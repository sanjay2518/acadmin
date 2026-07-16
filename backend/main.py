import os
import base64
import secrets
import io
from datetime import datetime

import httpx
from dotenv import load_dotenv
from fastapi import FastAPI, HTTPException, Query, BackgroundTasks
from fastapi.middleware.cors import CORSMiddleware
from fastapi.responses import RedirectResponse, StreamingResponse
from pydantic import BaseModel
from typing import Optional
from supabase import create_client, Client
from reportlab.lib.pagesizes import A4
from reportlab.platypus import SimpleDocTemplate, Table, TableStyle, Paragraph, Spacer
from reportlab.lib import colors
from reportlab.lib.styles import getSampleStyleSheet
import openpyxl

load_dotenv()

# ── Config ────────────────────────────────────────────────────────────────────
CLIENT_ID     = os.environ["XERO_CLIENT_ID"]
CLIENT_SECRET = os.environ["XERO_CLIENT_SECRET"]
REDIRECT_URI  = os.environ["XERO_REDIRECT_URI"]
SECRET_KEY    = os.environ["SECRET_KEY"]

SUPABASE_URL  = os.environ["SUPABASE_URL"]
SUPABASE_KEY  = os.environ["SUPABASE_KEY"]

XERO_TOKEN_URL   = "https://identity.xero.com/connect/token"
XERO_CONNECT_URL = "https://api.xero.com/connections"
XERO_API_BASE    = "https://api.xero.com/api.xro/2.0"

supabase: Client = create_client(SUPABASE_URL, SUPABASE_KEY)

# ── App ───────────────────────────────────────────────────────────────────────
app = FastAPI(title="Wealcco API")

app.add_middleware(
    CORSMiddleware,
    allow_origins=[
        "http://localhost:3000",
        "http://localhost:5173",
        "http://localhost:5174",
        "https://acadmin-ifi1.vercel.app",
        "https://acadmin-seven.vercel.app",
        "https://acadmin-ah6w.vercel.app",
    ],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# ── Helpers ───────────────────────────────────────────────────────────────────

def _basic_auth_header() -> str:
    creds = base64.b64encode(f"{CLIENT_ID}:{CLIENT_SECRET}".encode()).decode()
    return f"Basic {creds}"


def _get_tokens() -> dict:
    """Fetch the latest Xero tokens from Supabase."""
    row = supabase.table("xero_tokens").select("*").order("id", desc=True).limit(1).execute()
    if not row.data:
        raise HTTPException(status_code=401, detail="Xero not connected. Please authenticate first.")
    return row.data[0]


async def _refresh_if_needed(tokens: dict) -> dict:
    """Refresh access token if expired (Xero tokens last 30 min)."""
    expires_at = tokens.get("expires_at", 0)
    if datetime.utcnow().timestamp() < expires_at - 60:
        return tokens  # still valid

    async with httpx.AsyncClient() as client:
        resp = await client.post(
            XERO_TOKEN_URL,
            headers={"Authorization": _basic_auth_header(), "Content-Type": "application/x-www-form-urlencoded"},
            data={"grant_type": "refresh_token", "refresh_token": tokens["refresh_token"]},
        )
    resp.raise_for_status()
    new_tokens = resp.json()
    updated = {
        "access_token":  new_tokens["access_token"],
        "refresh_token": new_tokens.get("refresh_token", tokens["refresh_token"]),
        "expires_at":    datetime.utcnow().timestamp() + new_tokens["expires_in"],
        "tenant_id":     tokens["tenant_id"],
    }
    supabase.table("xero_tokens").update(updated).eq("id", tokens["id"]).execute()
    return updated


async def _xero_get(path: str) -> dict:
    tokens = _get_tokens()
    tokens = await _refresh_if_needed(tokens)
    async with httpx.AsyncClient() as client:
        resp = await client.get(
            f"{XERO_API_BASE}/{path}",
            headers={
                "Authorization": f"Bearer {tokens['access_token']}",
                "Xero-tenant-id": tokens["tenant_id"],
                "Accept": "application/json",
            },
        )
    resp.raise_for_status()
    return resp.json()


async def _xero_post(path: str, payload: dict) -> dict:
    tokens = _get_tokens()
    tokens = await _refresh_if_needed(tokens)
    async with httpx.AsyncClient() as client:
        resp = await client.post(
            f"{XERO_API_BASE}/{path}",
            headers={
                "Authorization": f"Bearer {tokens['access_token']}",
                "Xero-tenant-id": tokens["tenant_id"],
                "Content-Type": "application/json",
                "Accept": "application/json",
            },
            json=payload,
        )
    resp.raise_for_status()
    return resp.json()

# ── Contact Submissions ───────────────────────────────────────────────────────

class ContactIn(BaseModel):
    name:    str
    email:   str
    phone:   Optional[str] = None
    company: Optional[str] = None
    service: Optional[str] = None
    message: str

@app.post("/api/contacts")
def create_contact(body: ContactIn):
    result = supabase.table("contact_submissions").insert({
        "name":    body.name,
        "email":   body.email,
        "phone":   body.phone,
        "company": body.company,
        "service": body.service,
        "message": body.message,
        "status":  "new",
    }).execute()
    return {"success": True, "id": result.data[0]["id"] if result.data else None}


@app.get("/api/contacts")
def get_contacts():
    result = supabase.table("contact_submissions").select("*").order("created_at", desc=True).execute()
    return result.data


# ── OAuth ─────────────────────────────────────────────────────────────────────
XERO_SCOPES = (
    "offline_access openid profile email "
    "accounting.settings.read "
    "accounting.contacts.read "
    "accounting.invoices.read "
    "accounting.reports.aged.read "
    "accounting.reports.balancesheet.read "
    "accounting.reports.profitandloss.read"
)

@app.get("/api/auth/xero/login")
def xero_login():
    state = secrets.token_urlsafe(32)
    supabase.table("oauth_states").insert({"state": state}).execute()
    from urllib.parse import quote
    url = (
        f"https://login.xero.com/identity/connect/authorize"
        f"?response_type=code&client_id={CLIENT_ID}"
        f"&redirect_uri={quote(REDIRECT_URI)}&scope={quote(XERO_SCOPES)}&state={state}"
    )
    return RedirectResponse(url)


@app.get("/api/auth/xero/debug")
def xero_debug():
    """Temporary: shows the exact OAuth URL being built."""
    from urllib.parse import quote
    scopes = "offline_access openid profile email accounting.transactions.read accounting.reports.read accounting.contacts.read accounting.settings.read"
    url = (
        f"https://login.xero.com/identity/connect/authorize"
        f"?response_type=code&client_id={CLIENT_ID}"
        f"&redirect_uri={quote(REDIRECT_URI)}&scope={quote(scopes)}&state=debugtest"
    )
    return {"client_id": CLIENT_ID, "redirect_uri": REDIRECT_URI, "full_url": url}


@app.get("/api/auth/xero/callback")
async def xero_callback(
    state: str = Query(...),
    code: str = Query(None),
    error: str = Query(None),
    error_description: str = Query(None),
):
    if error:
        raise HTTPException(status_code=400, detail=error_description or error)
    # Validate state
    row = supabase.table("oauth_states").select("state").eq("state", state).execute()
    if not row.data:
        raise HTTPException(status_code=400, detail=f"Invalid OAuth state: {state[:8]}… not found in DB")
    supabase.table("oauth_states").delete().eq("state", state).execute()

    # Exchange code for tokens
    async with httpx.AsyncClient() as client:
        resp = await client.post(
            XERO_TOKEN_URL,
            headers={"Authorization": _basic_auth_header(), "Content-Type": "application/x-www-form-urlencoded"},
            data={"grant_type": "authorization_code", "code": code, "redirect_uri": REDIRECT_URI},
        )
    resp.raise_for_status()
    token_data = resp.json()

    # Get tenant ID
    async with httpx.AsyncClient() as client:
        conn_resp = await client.get(
            XERO_CONNECT_URL,
            headers={"Authorization": f"Bearer {token_data['access_token']}", "Accept": "application/json"},
        )
    conn_resp.raise_for_status()
    tenant_id = conn_resp.json()[0]["tenantId"]

    # Persist tokens in Supabase
    supabase.table("xero_tokens").upsert({
        "access_token":  token_data["access_token"],
        "refresh_token": token_data["refresh_token"],
        "expires_at":    datetime.utcnow().timestamp() + token_data["expires_in"],
        "tenant_id":     tenant_id,
    }).execute()

    # Redirect back to the admin frontend reports page
    return RedirectResponse("https://acadmin-ifi1.vercel.app/dashboard/reports?connected=true")


@app.post("/api/auth/xero/logout")
async def xero_logout():
    """Revoke Xero tokens and clear them from Supabase."""
    try:
        tokens = _get_tokens()
        # Revoke the token with Xero
        async with httpx.AsyncClient() as client:
            await client.post(
                "https://identity.xero.com/connect/revocation",
                headers={"Authorization": _basic_auth_header(), "Content-Type": "application/x-www-form-urlencoded"},
                data={"token": tokens["refresh_token"], "token_type_hint": "refresh_token"},
            )
    except Exception:
        pass  # still clear from DB even if revocation fails
    supabase.table("xero_tokens").delete().neq("id", 0).execute()
    return {"success": True}


@app.get("/api/auth/xero/status")
def xero_status():
    try:
        _get_tokens()
        return {"connected": True}
    except HTTPException:
        return {"connected": False}

# ── Supabase → Xero Sync ──────────────────────────────────────────────────────

async def _sync_customer_to_xero(customer: dict):
    """Create a Xero Contact + Invoice for a single customer row."""
    # 1. Create / upsert Contact
    contact_payload = {
        "Contacts": [{"Name": customer["name"], "EmailAddress": customer.get("email", "")}]
    }
    contact_resp = await _xero_post("Contacts", contact_payload)
    contact_id = contact_resp["Contacts"][0]["ContactID"]

    # 2. Create Invoice
    invoice_payload = {
        "Invoices": [{
            "Type": "ACCREC",
            "Contact": {"ContactID": contact_id},
            "LineItems": [{"Description": "Service", "Quantity": 1, "UnitAmount": customer["amount"]}],
            "Status": "AUTHORISED",
        }]
    }
    inv_resp = await _xero_post("Invoices", invoice_payload)
    invoice_id = inv_resp["Invoices"][0]["InvoiceID"]

    # 3. Update Supabase row with Xero IDs
    supabase.table("customers").update({
        "xero_contact_id": contact_id,
        "xero_invoice_id": invoice_id,
        "invoice_status":  "synced",
    }).eq("id", customer["id"]).execute()


@app.post("/api/sync/customers")
async def sync_all_customers(background_tasks: BackgroundTasks):
    """Sync all unsynced customers from Supabase to Xero."""
    rows = supabase.table("customers").select("*").neq("invoice_status", "synced").execute()
    for customer in rows.data:
        background_tasks.add_task(_sync_customer_to_xero, customer)
    return {"queued": len(rows.data)}


@app.post("/api/sync/webhook")
async def supabase_webhook(payload: dict, background_tasks: BackgroundTasks):
    """
    Supabase Database Webhook endpoint.
    Configure in Supabase: Table → customers → Insert event → POST http://your-backend/api/sync/webhook
    """
    record = payload.get("record")
    if record:
        background_tasks.add_task(_sync_customer_to_xero, record)
    return {"status": "accepted"}

# ── Reports ───────────────────────────────────────────────────────────────────

@app.get("/api/reports/monthly")
async def monthly_report():
    """Returns last 6 months revenue and expenses for the dashboard chart."""
    from datetime import date, timedelta
    today = date.today()
    result = []
    for i in range(5, -1, -1):
        month = (today.month - i - 1) % 12 + 1
        year  = today.year - ((today.month - i - 1) // 12)
        from_d   = date(year, month, 1)
        last_day = (date(year, month % 12 + 1, 1) if month < 12 else date(year + 1, 1, 1)) - timedelta(days=1)
        try:
            data = await _xero_get(f"Reports/ProfitAndLoss?fromDate={from_d}&toDate={last_day}")
            revenue = expenses = 0.0
            for section in data.get("Reports", [{}])[0].get("Rows", []):
                for row in section.get("Rows", []):
                    cells = row.get("Cells", [])
                    if not cells: continue
                    label = cells[0].get("Value", "").lower()
                    val   = float(cells[1].get("Value") or 0) if len(cells) > 1 else 0
                    if "total income" in label:            revenue  = val
                    if "total operating expenses" in label: expenses = val
        except Exception:
            revenue = expenses = 0.0
        result.append({"name": from_d.strftime("%b"), "revenue": revenue, "expenses": expenses})
    return result


@app.get("/api/reports/profit-and-loss")
async def profit_and_loss(from_date: str = "2023-01-01", to_date: str = "2023-12-31"):
    data = await _xero_get(f"Reports/ProfitAndLoss?fromDate={from_date}&toDate={to_date}")
    return data


@app.get("/api/reports/balance-sheet")
async def balance_sheet(date: str = "2023-12-31"):
    data = await _xero_get(f"Reports/BalanceSheet?date={date}")
    return data


@app.get("/api/reports/aged-receivables")
async def aged_receivables():
    data = await _xero_get("Reports/AgedReceivablesByContact")
    return data


@app.get("/api/reports/aged-payables")
async def aged_payables():
    data = await _xero_get("Reports/AgedPayablesByContact")
    return data

# ── Dashboard KPIs ────────────────────────────────────────────────────────────

@app.get("/api/dashboard/kpis")
async def dashboard_kpis():
    pl = await _xero_get("Reports/ProfitAndLoss?fromDate=2023-01-01&toDate=2023-12-31")
    bs = await _xero_get("Reports/BalanceSheet?date=2023-12-31")
    return {"profit_and_loss": pl, "balance_sheet": bs}

# ── Export Helpers ────────────────────────────────────────────────────────────

def _extract_rows(report_json: dict) -> tuple[str, list[list]]:
    """Pull title and flat rows from a Xero report JSON."""
    reports = report_json.get("Reports", [{}])
    title   = reports[0].get("ReportTitles", ["Report"])[0] if reports else "Report"
    rows: list[list] = []
    for section in reports[0].get("Rows", []):
        for row in section.get("Rows", [section]):
            cells = row.get("Cells", [])
            rows.append([c.get("Value", "") for c in cells])
    return title, rows


@app.get("/api/reports/{report_type}/export/pdf")
async def export_pdf(report_type: str):
    report_map = {
        "profit-and-loss":  "Reports/ProfitAndLoss",
        "balance-sheet":    "Reports/BalanceSheet",
        "aged-receivables": "Reports/AgedReceivablesByContact",
        "aged-payables":    "Reports/AgedPayablesByContact",
    }
    if report_type not in report_map:
        raise HTTPException(status_code=404, detail="Unknown report type")

    data = await _xero_get(report_map[report_type])
    title, rows = _extract_rows(data)

    buf = io.BytesIO()
    doc = SimpleDocTemplate(buf, pagesize=A4)
    styles = getSampleStyleSheet()
    elements = [
        Paragraph(title, styles["Title"]),
        Spacer(1, 12),
    ]
    if rows:
        table = Table(rows)
        table.setStyle(TableStyle([
            ("BACKGROUND", (0, 0), (-1, 0), colors.HexColor("#2563EB")),
            ("TEXTCOLOR",  (0, 0), (-1, 0), colors.white),
            ("FONTNAME",   (0, 0), (-1, 0), "Helvetica-Bold"),
            ("ROWBACKGROUNDS", (0, 1), (-1, -1), [colors.white, colors.HexColor("#F3F4F6")]),
            ("GRID",       (0, 0), (-1, -1), 0.5, colors.HexColor("#E5E7EB")),
            ("FONTSIZE",   (0, 0), (-1, -1), 8),
            ("PADDING",    (0, 0), (-1, -1), 6),
        ]))
        elements.append(table)
    doc.build(elements)
    buf.seek(0)

    return StreamingResponse(
        buf,
        media_type="application/pdf",
        headers={"Content-Disposition": f"attachment; filename={report_type}.pdf"},
    )


@app.get("/api/reports/{report_type}/export/excel")
async def export_excel(report_type: str):
    report_map = {
        "profit-and-loss":  "Reports/ProfitAndLoss",
        "balance-sheet":    "Reports/BalanceSheet",
        "aged-receivables": "Reports/AgedReceivablesByContact",
        "aged-payables":    "Reports/AgedPayablesByContact",
    }
    if report_type not in report_map:
        raise HTTPException(status_code=404, detail="Unknown report type")

    data = await _xero_get(report_map[report_type])
    title, rows = _extract_rows(data)

    wb = openpyxl.Workbook()
    ws = wb.active
    ws.title = title[:31]  # Excel sheet name limit
    for row in rows:
        ws.append(row)

    buf = io.BytesIO()
    wb.save(buf)
    buf.seek(0)

    return StreamingResponse(
        buf,
        media_type="application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
        headers={"Content-Disposition": f"attachment; filename={report_type}.xlsx"},
    )

# ── Invoices ──────────────────────────────────────────────────────────────────

@app.get("/api/users")
async def get_users():
    """Fetch contacts (users/clients) from Xero."""
    data = await _xero_get("Contacts?includeArchived=false&order=Name ASC")
    contacts = data.get("Contacts", [])
    return [
        {
            "id":          c.get("ContactID"),
            "name":        c.get("Name"),
            "email":       c.get("EmailAddress"),
            "phone":       c.get("Phones", [{}])[0].get("PhoneNumber", "") if c.get("Phones") else "",
            "status":      c.get("ContactStatus"),
            "is_customer": c.get("IsCustomer", False),
            "is_supplier": c.get("IsSupplier", False),
            "balance":     c.get("Balances", {}).get("AccountsReceivable", {}).get("Outstanding", 0),
            "city":        c.get("Addresses", [{}])[0].get("City", "") if c.get("Addresses") else "",
        }
        for c in contacts
    ]


@app.get("/api/invoices")
async def get_invoices(status: str = "AUTHORISED"):
    data = await _xero_get(f"Invoices?Statuses={status}&order=DueDate DESC")
    return data.get("Invoices", [])


@app.get("/")
def root():
    return {"status": "ok", "message": "Wealcco API is running"}


if __name__ == "__main__":
    import uvicorn
    uvicorn.run("main:app", host="0.0.0.0", port=8000, reload=True)
