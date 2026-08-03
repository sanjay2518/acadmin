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
        "http://localhost:5174",
        "http://localhost:5175",
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


def _contact_query(contact_id: Optional[str]) -> str:
    return f"ContactIDs={contact_id}&" if contact_id else ""


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
async def create_contact(body: ContactIn):
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
async def get_contacts():
    result = supabase.table("contact_submissions").select("*").order("created_at", desc=True).execute()
    return result.data


# ── User Auth ─────────────────────────────────────────────────────────────────

class LoginIn(BaseModel):
    email:    str
    password: str

@app.post("/api/auth/login")
async def user_login(body: LoginIn):
    import hashlib
    row = supabase.table("xero_users").select("*").eq("email", body.email).execute()
    if not row.data:
        raise HTTPException(status_code=401, detail="Invalid email or password")
    user = row.data[0]
    # Compare SHA-256 hashed password
    hashed = hashlib.sha256(body.password.encode()).hexdigest()
    if user["password_hash"] != hashed:
        raise HTTPException(status_code=401, detail="Invalid email or password")
    return {
        "success":          True,
        "xero_contact_id":  user["xero_contact_id"],
        "name":             user["name"],
        "email":            user["email"],
    }


@app.get("/api/user/portal")
async def user_portal(contact_id: str):
    """Fetch invoices for a specific Xero contact."""
    try:
        invoices = await _xero_get(f"Invoices?ContactIDs={contact_id}&Statuses=AUTHORISED,PAID,VOIDED&order=DueDate DESC")
        invoice_list = invoices.get("Invoices", [])
    except Exception:
        invoice_list = []

    total = len(invoice_list)
    paid = sum(1 for inv in invoice_list if inv.get("Status") == "PAID")
    outstanding = sum(
        float(inv.get("AmountDue", 0))
        for inv in invoice_list
        if inv.get("Status") == "AUTHORISED"
    )
    return {
        "invoices": invoice_list,
        "stats": {
            "total": total,
            "paid": paid,
            "outstanding": round(outstanding, 2),
        },
    }


# ── OAuth ─────────────────────────────────────────────────────────────────────
XERO_SCOPES = (
    "offline_access openid profile email "
    "accounting.settings.read "
    "accounting.contacts.read "
    "accounting.transactions.read "
    "accounting.reports.read "
    "accounting.budgets.read"
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
async def xero_status():
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

# ── Analytics ────────────────────────────────────────────────────────────────
import re
from datetime import date, timedelta

def _parse_xero_date(val: str) -> date:
    """Parse Xero /Date(ms)/ or ISO string to date."""
    if not val:
        return date.today()
    ms = re.search(r"/Date\((\d+)", val)
    if ms:
        return date.fromtimestamp(int(ms.group(1)) / 1000)
    try:
        return date.fromisoformat(val[:10])
    except Exception:
        return date.today()


def _age_bucket(days: int) -> str:
    if days <= 0:  return "current"
    if days <= 30: return "1-30"
    if days <= 60: return "31-60"
    return "60+"


def _bucket_invoices(invoices: list, today: date) -> list:
    contacts: dict = {}
    for inv in invoices:
        due  = _parse_xero_date(inv.get("DueDateString") or inv.get("DueDate", ""))
        days = (today - due).days
        bkt  = _age_bucket(days)
        name = inv.get("Contact", {}).get("Name", "Unknown")
        if name not in contacts:
            contacts[name] = {"contact": name, "current": 0.0, "1-30": 0.0, "31-60": 0.0, "60+": 0.0, "total": 0.0}
        amt = float(inv.get("AmountDue", 0))
        contacts[name][bkt]     += amt
        contacts[name]["total"] += amt
    return sorted(contacts.values(), key=lambda x: -x["total"])


@app.get("/api/analytics/aged-receivables")
async def analytics_aged_receivables(contact_id: Optional[str] = None):
    today = date.today()
    query = _contact_query(contact_id)
    data  = await _xero_get(f"Invoices?{query}Statuses=AUTHORISED&Type=ACCREC&order=DueDate DESC")
    return _bucket_invoices(data.get("Invoices", []), today)


@app.get("/api/analytics/aged-payables")
async def analytics_aged_payables(contact_id: Optional[str] = None):
    today = date.today()
    query = _contact_query(contact_id)
    data  = await _xero_get(f"Invoices?{query}Statuses=AUTHORISED&Type=ACCPAY&order=DueDate DESC")
    return _bucket_invoices(data.get("Invoices", []), today)


@app.get("/api/analytics/cashflow")
async def analytics_cashflow(contact_id: Optional[str] = None):
    today  = date.today()
    result = []
    for i in range(11, -1, -1):
        month    = (today.month - i - 1) % 12 + 1
        year     = today.year - ((today.month - i - 1) // 12)
        from_d   = date(year, month, 1)
        last_day = (date(year, month % 12 + 1, 1) if month < 12 else date(year + 1, 1, 1)) - timedelta(days=1)
        inflow = outflow = 0.0
        if contact_id:
            try:
                sales = await _xero_get(f"Invoices?{_contact_query(contact_id)}Type=ACCREC&Statuses=AUTHORISED,PAID&DateFrom={from_d}&DateTo={last_day}")
                inflow = sum(float(inv.get("Total", 0)) for inv in sales.get("Invoices", []))
            except Exception:
                pass
            try:
                expenses = await _xero_get(f"Invoices?{_contact_query(contact_id)}Type=ACCPAY&Statuses=AUTHORISED,PAID&DateFrom={from_d}&DateTo={last_day}")
                outflow = sum(abs(float(li.get("LineAmount", 0))) for inv in expenses.get("Invoices", []) for li in inv.get("LineItems", []))
            except Exception:
                pass
        else:
            try:
                data = await _xero_get(f"Reports/ProfitAndLoss?fromDate={from_d}&toDate={last_day}")
                for section in data.get("Reports", [{}])[0].get("Rows", []):
                    for row in section.get("Rows", []):
                        cells = row.get("Cells", [])
                        if not cells: continue
                        label = cells[0].get("Value", "").lower()
                        val   = float(cells[1].get("Value") or 0) if len(cells) > 1 else 0
                        if "total income" in label:             inflow  = val
                        if "total operating expenses" in label: outflow = abs(val)
            except Exception:
                pass
        result.append({"month": from_d.strftime("%b %y"), "inflow": round(inflow, 2), "outflow": round(outflow, 2), "net": round(inflow - outflow, 2)})
    return result


@app.get("/api/analytics/vat")
async def analytics_vat(contact_id: Optional[str] = None):
    today   = date.today()
    periods = []
    for q in range(3, -1, -1):
        # compute quarter start/end
        cur_q      = (today.month - 1) // 3
        target_q   = cur_q - q
        year_off   = 0
        while target_q < 0:
            target_q += 4
            year_off -= 1
        q_year       = today.year + year_off
        q_start_mon  = target_q * 3 + 1
        q_end_mon    = q_start_mon + 2
        from_d       = date(q_year, q_start_mon, 1)
        last_day     = (date(q_year, q_end_mon % 12 + 1, 1) if q_end_mon < 12 else date(q_year + 1, 1, 1)) - timedelta(days=1)
        vat_collected = vat_paid = 0.0
        if contact_id:
            try:
                sales = await _xero_get(f"Invoices?{_contact_query(contact_id)}Type=ACCREC&Statuses=AUTHORISED,PAID&DateFrom={from_d}&DateTo={last_day}")
                for inv in sales.get("Invoices", []):
                    for li in inv.get("LineItems", []):
                        vat_collected += float(li.get("TaxAmount", 0))
            except Exception:
                pass
            try:
                bills = await _xero_get(f"Invoices?{_contact_query(contact_id)}Type=ACCPAY&Statuses=AUTHORISED,PAID&DateFrom={from_d}&DateTo={last_day}")
                for inv in bills.get("Invoices", []):
                    for li in inv.get("LineItems", []):
                        vat_paid += float(li.get("TaxAmount", 0))
            except Exception:
                pass
        else:
            try:
                sales = await _xero_get(f"Invoices?Type=ACCREC&Statuses=AUTHORISED,PAID&DateFrom={from_d}&DateTo={last_day}")
                for inv in sales.get("Invoices", []):
                    for li in inv.get("LineItems", []):
                        vat_collected += float(li.get("TaxAmount", 0))
            except Exception:
                pass
            try:
                bills = await _xero_get(f"Invoices?Type=ACCPAY&Statuses=AUTHORISED,PAID&DateFrom={from_d}&DateTo={last_day}")
                for inv in bills.get("Invoices", []):
                    for li in inv.get("LineItems", []):
                        vat_paid += float(li.get("TaxAmount", 0))
            except Exception:
                pass
        periods.append({
            "period":        f"Q{target_q + 1} {q_year}",
            "vat_collected": round(vat_collected, 2),
            "vat_paid":      round(vat_paid, 2),
            "net_vat":       round(vat_collected - vat_paid, 2),
        })
    return periods


@app.get("/api/analytics/top")
async def analytics_top(contact_id: Optional[str] = None):
    today  = date.today()
    from_d = date(today.year, 1, 1)
    customers: dict = {}
    try:
        query = _contact_query(contact_id)
        sales = await _xero_get(f"Invoices?{query}Type=ACCREC&Statuses=AUTHORISED,PAID&DateFrom={from_d}&DateTo={today}")
        for inv in sales.get("Invoices", []):
            name = inv.get("Contact", {}).get("Name", "Unknown")
            customers[name] = customers.get(name, 0.0) + float(inv.get("Total", 0))
    except Exception:
        pass
    expenses: dict = {}
    try:
        query = _contact_query(contact_id)
        bills = await _xero_get(f"Invoices?{query}Type=ACCPAY&Statuses=AUTHORISED,PAID&DateFrom={from_d}&DateTo={today}")
        for inv in bills.get("Invoices", []):
            for li in inv.get("LineItems", []):
                cat = li.get("Description") or li.get("AccountCode") or "Other"
                expenses[cat] = expenses.get(cat, 0.0) + float(li.get("LineAmount", 0))
    except Exception:
        pass
    return {
        "top_customers": sorted([{"name": k, "value": round(v, 2)} for k, v in customers.items()], key=lambda x: -x["value"])[:10],
        "top_expenses":  sorted([{"name": k, "value": round(v, 2)} for k, v in expenses.items()],  key=lambda x: -x["value"])[:10],
    }


@app.get("/api/analytics/budget")
async def analytics_budget(contact_id: Optional[str] = None):
    today  = date.today()
    from_d = date(today.year, 1, 1)
    budget = actual = None
    if contact_id:
        try:
            actual = await _xero_get(f"Invoices?{_contact_query(contact_id)}Type=ACCREC&Statuses=AUTHORISED,PAID&DateFrom={from_d}&DateTo={today}")
        except Exception:
            actual = None
    else:
        try:
            budget = await _xero_get(f"Reports/BudgetSummary?date={today}&periods=12&timeframe=1")
        except Exception:
            pass
        try:
            actual = await _xero_get(f"Reports/ProfitAndLoss?fromDate={from_d}&toDate={today}")
        except Exception:
            pass
    return {"budget": budget, "actual": actual}


@app.post("/api/analytics/sync")
async def analytics_sync(contact_id: Optional[str] = None):
    """Fetch all analytics from Xero and cache in Supabase. Call nightly or per client."""
    import asyncio
    aged_rec, aged_pay, cashflow, vat, top = await asyncio.gather(
        analytics_aged_receivables(contact_id),
        analytics_aged_payables(contact_id),
        analytics_cashflow(contact_id),
        analytics_vat(contact_id),
        analytics_top(contact_id),
        return_exceptions=True,
    )
    saved = []
    key_prefix = f"{contact_id}:" if contact_id else ""
    for key, val in [("aged_receivables", aged_rec), ("aged_payables", aged_pay),
                     ("cashflow", cashflow), ("vat", vat), ("top", top)]:
        if isinstance(val, Exception):
            continue
        cache_key = f"{key_prefix}{key}"
        supabase.table("analytics_cache").upsert(
            {"key": cache_key, "data": val, "updated_at": datetime.utcnow().isoformat()}
        ).execute()
        saved.append(cache_key)
    return {"synced": saved}


@app.get("/api/analytics/cached/{key}")
async def analytics_cached(key: str, contact_id: Optional[str] = None):
    cache_key = f"{contact_id}:{key}" if contact_id else key
    try:
        row = supabase.table("analytics_cache").select("data,updated_at").eq("key", cache_key).execute()
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Cache read failed: {e}")
    if not row.data:
        raise HTTPException(status_code=404, detail="No cached data — run /api/analytics/sync first.")
    return {"data": row.data[0]["data"], "updated_at": row.data[0]["updated_at"]}


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
    pl = await _xero_get("Reports/ProfitAndLoss?fromDate=2026-01-01&toDate=2026-12-31")
    bs = await _xero_get("Reports/BalanceSheet?date=2026-12-31")
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
async def root():
    return {"status": "ok", "message": "Wealcco API is running"}


if __name__ == "__main__":
    import uvicorn
    uvicorn.run("main:app", host="0.0.0.0", port=8000, reload=True)
