import os
import base64
import secrets
import hashlib
import io
import re
from datetime import datetime, date, timedelta
from typing import Optional

import httpx
from dotenv import load_dotenv
from fastapi import FastAPI, HTTPException, Query, BackgroundTasks, Depends, Request
from fastapi.middleware.cors import CORSMiddleware
from fastapi.responses import RedirectResponse, StreamingResponse
from fastapi.security import HTTPBearer, HTTPAuthorizationCredentials
from pydantic import BaseModel
from supabase import acreate_client, AsyncClient
from reportlab.lib.pagesizes import A4
from reportlab.platypus import SimpleDocTemplate, Table, TableStyle, Paragraph, Spacer
from reportlab.lib import colors
from reportlab.lib.styles import getSampleStyleSheet
import openpyxl
import jwt

load_dotenv()

# ── Config ────────────────────────────────────────────────────────────────────
XERO_CLIENT_ID     = os.environ["XERO_CLIENT_ID"]
XERO_CLIENT_SECRET = os.environ["XERO_CLIENT_SECRET"]
XERO_REDIRECT_URI  = os.environ.get("XERO_REDIRECT_URI", "")
SECRET_KEY         = os.environ["SECRET_KEY"]
SUPABASE_URL       = os.environ["SUPABASE_URL"]
SUPABASE_KEY       = os.environ["SUPABASE_KEY"]
SMTP_HOST          = os.environ.get("SMTP_HOST", "")
SMTP_PORT          = int(os.environ.get("SMTP_PORT", 587))
SMTP_USER          = os.environ.get("SMTP_USER", "")
SMTP_PASS          = os.environ.get("SMTP_PASS", "")
FRONTEND_URL       = os.environ.get("FRONTEND_URL", "http://localhost:5173")
ADMIN_URL          = os.environ.get("ADMIN_URL", "http://localhost:3000")
ADMIN_AUTH_DISABLED = os.environ.get("ADMIN_AUTH_DISABLED", "false").lower() == "true"


def _resolve_redirect_uri(request: Optional[Request] = None) -> str:
    if request is not None:
        forwarded_proto = request.headers.get("x-forwarded-proto") or request.url.scheme
        host = request.headers.get("x-forwarded-host") or request.headers.get("host") or request.url.netloc
        return f"{forwarded_proto}://{host}/api/xero/callback"

    env_value = (XERO_REDIRECT_URI or "").strip()
    if env_value:
        return env_value.rstrip("/") if env_value.endswith("/api/xero/callback") else env_value.rstrip("/") + "/api/xero/callback"
    raise RuntimeError("XERO_REDIRECT_URI is not configured")

XERO_TOKEN_URL   = "https://identity.xero.com/connect/token"
XERO_CONNECT_URL = "https://api.xero.com/connections"
XERO_API_BASE    = "https://api.xero.com/api.xro/2.0"
XERO_SCOPES      = (
    "offline_access openid profile email "
    "accounting.settings.read accounting.contacts.read "
    "accounting.invoices.read "
    "accounting.reports.aged.read accounting.reports.balancesheet.read "
    "accounting.reports.budgetsummary.read accounting.reports.profitandloss.read"
)

# ── App ───────────────────────────────────────────────────────────────────────
supabase: AsyncClient = None
app = FastAPI(title="Wealcco API")

@app.on_event("startup")
async def startup():
    global supabase
    supabase = await acreate_client(SUPABASE_URL, SUPABASE_KEY)

app.add_middleware(
    CORSMiddleware,
    allow_origins=[
        "http://localhost:3000", "http://localhost:5173",
        "http://localhost:5174", "http://localhost:5175",
        "https://acadmin-ifi1.vercel.app",
        "https://acadmin-seven.vercel.app",
        "https://acadmin-ah6w.vercel.app",
    ],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# ── JWT helpers ───────────────────────────────────────────────────────────────

def _make_token(user: dict) -> str:
    payload = {
        "sub":       str(user["id"]),
        "role":      user["role"],
        "client_id": str(user["client_id"]) if user.get("client_id") else None,
        "name":      user["name"],
        "email":     user["email"],
    }
    return jwt.encode(payload, SECRET_KEY, algorithm="HS256")


def _decode_token(token: str) -> dict:
    try:
        return jwt.decode(token, SECRET_KEY, algorithms=["HS256"])
    except jwt.PyJWTError:
        raise HTTPException(status_code=401, detail="Invalid or expired token")


bearer = HTTPBearer(auto_error=False)

async def get_current_user(creds: Optional[HTTPAuthorizationCredentials] = Depends(bearer)) -> dict:
    if ADMIN_AUTH_DISABLED and creds is None:
        return {"role": "super_admin", "name": "Local admin"}
    if creds is None:
        raise HTTPException(status_code=401, detail="Not authenticated")
    return _decode_token(creds.credentials)

async def require_admin(user: dict = Depends(get_current_user)) -> dict:
    if ADMIN_AUTH_DISABLED:
        return {"role": "super_admin", "name": "Local admin"}
    if user["role"] != "super_admin":
        raise HTTPException(status_code=403, detail="Admin access required")
    return user

async def require_client(user: dict = Depends(get_current_user)) -> dict:
    if user["role"] not in ("super_admin", "client"):
        raise HTTPException(status_code=403, detail="Access denied")
    return user

# ── Xero helpers (per-client token) ──────────────────────────────────────────

def _xero_basic() -> str:
    return "Basic " + base64.b64encode(f"{XERO_CLIENT_ID}:{XERO_CLIENT_SECRET}".encode()).decode()


async def _get_xero_conn(client_id: str) -> dict:
    row = await supabase.table("xero_connections").select("*").eq("client_id", client_id).execute()
    if not row.data:
        raise HTTPException(status_code=404, detail="Xero not connected for this client")
    return row.data[0]


async def _select_xero_connection(connections: list[dict], client_id: str) -> dict:
    if not connections:
        raise HTTPException(status_code=400, detail="No Xero organisation was authorised for this account")

    current = await supabase.table("xero_connections").select("xero_tenant_id").eq("client_id", client_id).execute()
    current_tenant = current.data[0]["xero_tenant_id"] if current.data else None
    if current_tenant:
        matching = next((connection for connection in connections if connection["tenantId"] == current_tenant), None)
        if matching:
            return matching

    assigned = await supabase.table("xero_connections").select("xero_tenant_id").execute()
    assigned_tenants = {row["xero_tenant_id"] for row in assigned.data}
    available = next((connection for connection in connections if connection["tenantId"] not in assigned_tenants), None)
    if available:
        return available

    raise HTTPException(
        status_code=409,
        detail="All Xero organisations returned for this login are already connected to another client. Select the client's own organisation in Xero and try again.",
    )


async def _refresh_xero(conn: dict) -> dict:
    if datetime.utcnow().timestamp() < conn["expires_at"] - 60:
        return conn
    async with httpx.AsyncClient() as c:
        r = await c.post(
            XERO_TOKEN_URL,
            headers={"Authorization": _xero_basic(), "Content-Type": "application/x-www-form-urlencoded"},
            data={"grant_type": "refresh_token", "refresh_token": conn["refresh_token"]},
        )
    r.raise_for_status()
    t = r.json()
    updated = {
        "access_token":  t["access_token"],
        "refresh_token": t.get("refresh_token", conn["refresh_token"]),
        "expires_at":    datetime.utcnow().timestamp() + t["expires_in"],
    }
    await supabase.table("xero_connections").update(updated).eq("id", conn["id"]).execute()
    return {**conn, **updated}


async def _xero_get(client_id: str, path: str) -> dict:
    conn = await _get_xero_conn(client_id)
    conn = await _refresh_xero(conn)
    async with httpx.AsyncClient() as c:
        r = await c.get(
            f"{XERO_API_BASE}/{path}",
            headers={
                "Authorization": f"Bearer {conn['access_token']}",
                "Xero-tenant-id": conn["xero_tenant_id"],
                "Accept": "application/json",
            },
        )
    r.raise_for_status()
    return r.json()


# ── Email invite helper ───────────────────────────────────────────────────────

async def _send_invite(email: str, name: str, token: str):
    import smtplib
    from email.mime.text import MIMEText
    link = f"{FRONTEND_URL}/portal/set-password?token={token}"
    body = f"Hi {name},\n\nYour Wealcco client portal has been created.\nSet your password here:\n{link}\n\nThis link expires in 72 hours."
    msg = MIMEText(body)
    msg["Subject"] = "Your Wealcco Portal Invitation"
    msg["From"]    = SMTP_USER
    msg["To"]      = email
    try:
        with smtplib.SMTP(SMTP_HOST, SMTP_PORT) as s:
            s.starttls()
            s.login(SMTP_USER, SMTP_PASS)
            s.send_message(msg)
    except Exception as e:
        print(f"Email send failed: {e}")

# ── Auth ──────────────────────────────────────────────────────────────────────

class LoginIn(BaseModel):
    email:    str
    password: str

@app.post("/api/auth/login")
async def login(body: LoginIn):
    row = await supabase.table("portal_users").select("*").eq("email", body.email).execute()
    if not row.data:
        raise HTTPException(status_code=401, detail="Invalid email or password")
    user = row.data[0]
    if not user.get("password_hash"):
        raise HTTPException(status_code=401, detail="Password not set — check your invite email")
    if user["password_hash"] != hashlib.sha256(body.password.encode()).hexdigest():
        raise HTTPException(status_code=401, detail="Invalid email or password")
    if user["role"] == "client":
        client = await supabase.table("clients").select("is_active").eq("id", user["client_id"]).execute()
        if not client.data or not client.data[0]["is_active"]:
            raise HTTPException(status_code=403, detail="Account deactivated")
    return {"token": _make_token(user), "role": user["role"], "name": user["name"]}


class SetPasswordIn(BaseModel):
    token:    str
    password: str

@app.post("/api/auth/set-password")
async def set_password(body: SetPasswordIn):
    row = await supabase.table("portal_users").select("*").eq("invite_token", body.token).execute()
    if not row.data:
        raise HTTPException(status_code=400, detail="Invalid or expired invite token")
    hashed = hashlib.sha256(body.password.encode()).hexdigest()
    await supabase.table("portal_users").update({
        "password_hash": hashed,
        "invite_token":  None,
    }).eq("id", row.data[0]["id"]).execute()
    return {"success": True}

# ── Admin: manage clients ─────────────────────────────────────────────────────

class ClientIn(BaseModel):
    name:     str
    email:    str
    password: str

@app.post("/api/admin/clients")
async def admin_create_client(body: ClientIn, _=Depends(require_admin)):
    # 1. Create client (tenant)
    c = await supabase.table("clients").insert({"name": body.name, "email": body.email}).execute()
    client_id = c.data[0]["id"]
    # 2. Create portal_user with password set directly by admin
    hashed = hashlib.sha256(body.password.encode()).hexdigest()
    await supabase.table("portal_users").insert({
        "client_id":    client_id,
        "name":         body.name,
        "email":        body.email,
        "role":         "client",
        "password_hash": hashed,
    }).execute()
    return {"success": True, "client_id": client_id}


@app.get("/api/admin/clients")
async def admin_list_clients(_=Depends(require_admin)):
    rows = await supabase.table("clients").select("*, xero_connections(xero_tenant_id), portal_users(email,role)").execute()
    return [{**client, "xero_connected": bool(client.get("xero_connections"))} for client in rows.data]


@app.patch("/api/admin/clients/{client_id}")
async def admin_toggle_client(client_id: str, body: dict, _=Depends(require_admin)):
    await supabase.table("clients").update({"is_active": body["is_active"]}).eq("id", client_id).execute()
    return {"success": True}


@app.delete("/api/admin/clients/{client_id}")
async def admin_delete_client(client_id: str, _=Depends(require_admin)):
    client = await supabase.table("clients").select("id").eq("id", client_id).execute()
    if not client.data:
        raise HTTPException(status_code=404, detail="Client not found")

    # Explicit cleanup keeps deletion safe even if a deployment has older FK constraints.
    await supabase.table("xero_connections").delete().eq("client_id", client_id).execute()
    await supabase.table("oauth_states").delete().eq("client_id", client_id).execute()
    await supabase.table("portal_users").delete().eq("client_id", client_id).execute()
    await supabase.table("clients").delete().eq("id", client_id).execute()
    return {"success": True}


@app.post("/api/admin/clients/{client_id}/reset-password")
async def admin_reset_password(client_id: str, body: dict, _=Depends(require_admin)):
    hashed = hashlib.sha256(body["password"].encode()).hexdigest()
    await supabase.table("portal_users").update({"password_hash": hashed}).eq("client_id", client_id).execute()
    return {"success": True}


async def admin_resend_invite(client_id: str, _=Depends(require_admin)):
    row = await supabase.table("portal_users").select("*").eq("client_id", client_id).eq("role", "client").execute()
    if not row.data:
        raise HTTPException(status_code=404, detail="Client user not found")
    user = row.data[0]
    token = secrets.token_urlsafe(32)
    await supabase.table("portal_users").update({
        "invite_token":   token,
        "invite_sent_at": datetime.utcnow().isoformat(),
        "password_hash":  None,
    }).eq("id", user["id"]).execute()
    await _send_invite(user["email"], user["name"], token)
    return {"success": True}

# ── Contact form (public) ─────────────────────────────────────────────────────

class ContactIn(BaseModel):
    name:    str
    email:   str
    phone:   Optional[str] = None
    company: Optional[str] = None
    service: Optional[str] = None
    message: str

@app.post("/api/contacts")
async def create_contact(body: ContactIn):
    r = await supabase.table("contact_submissions").insert({
        "name": body.name, "email": body.email, "phone": body.phone,
        "company": body.company, "service": body.service,
        "message": body.message, "status": "new",
    }).execute()
    return {"success": True, "id": r.data[0]["id"] if r.data else None}

@app.get("/api/contacts")
async def get_contacts(_=Depends(require_admin)):
    r = await supabase.table("contact_submissions").select("*").order("created_at", desc=True).execute()
    return r.data


@app.get("/api/users")
async def get_users(client_id: Optional[str] = None, user=Depends(require_client)):
    if user["role"] == "client":
        client_ids = [user["client_id"]]
    elif client_id:
        client_ids = [client_id]
    else:
        clients = await supabase.table("clients").select("id,name").execute()
        client_ids = [client["id"] for client in clients.data]

    client_names = {}
    if client_ids:
        clients = await supabase.table("clients").select("id,name").in_("id", client_ids).execute()
        client_names = {client["id"]: client["name"] for client in clients.data}

    async def load_contacts(cid: str) -> list[dict]:
        try:
            data = await _xero_get(cid, "Contacts")
        except Exception:
            return []
        result = []
        for contact in data.get("Contacts", []):
            phones = contact.get("Phones") or []
            addresses = contact.get("Addresses") or []
            city = next((address.get("City") for address in addresses if address.get("AddressType") == "STREET"), "")
            receivable = contact.get("Balances", {}).get("AccountsReceivable", {})
            payable = contact.get("Balances", {}).get("AccountsPayable", {})
            result.append({
                "id": contact.get("ContactID"),
                "name": contact.get("Name", ""),
                "email": contact.get("EmailAddress", ""),
                "phone": next((phone.get("PhoneNumber") for phone in phones if phone.get("PhoneType") == "DEFAULT"), ""),
                "city": city,
                "status": contact.get("ContactStatus", ""),
                "is_customer": bool(contact.get("IsCustomer")),
                "is_supplier": bool(contact.get("IsSupplier")),
                "balance": float(receivable.get("Outstanding", 0) or 0) - float(payable.get("Outstanding", 0) or 0),
                "client_id": cid,
                "client_name": client_names.get(cid, ""),
            })
        return result

    import asyncio
    contacts = await asyncio.gather(*(load_contacts(cid) for cid in client_ids))
    return [contact for client_contacts in contacts for contact in client_contacts]


# ── Xero OAuth (per-client) ───────────────────────────────────────────────────

@app.get("/api/xero/connect")
async def xero_connect(request: Request, user: dict = Depends(require_client)):
    client_id = user["client_id"] if user["role"] == "client" else None
    if not client_id:
        raise HTTPException(status_code=400, detail="Provide client_id as admin")
    state = secrets.token_urlsafe(32)
    await supabase.table("oauth_states").insert({"state": state, "client_id": client_id}).execute()
    from urllib.parse import urlencode
    redirect_uri = _resolve_redirect_uri(request)
    url = "https://login.xero.com/identity/connect/authorize?" + urlencode({
        "response_type": "code",
        "client_id": XERO_CLIENT_ID,
        "redirect_uri": redirect_uri,
        "scope": XERO_SCOPES,
        "state": state,
        "prompt": "login",
    })
    return RedirectResponse(url)


@app.get("/api/xero/connect/admin/{client_id}")
async def xero_connect_for_client(request: Request, client_id: str, token: Optional[str] = Query(None)):
    # Token passed as query param because this is a browser redirect (can't set headers)
    if not ADMIN_AUTH_DISABLED:
        if not token:
            raise HTTPException(status_code=401, detail="Not authenticated")
        try:
            user = _decode_token(token)
        except Exception:
            raise HTTPException(status_code=401, detail="Invalid token")
        if user["role"] != "super_admin":
            raise HTTPException(status_code=403, detail="Admin access required")
    state = secrets.token_urlsafe(32)
    await supabase.table("oauth_states").insert({"state": state, "client_id": client_id, "origin": "admin"}).execute()
    from urllib.parse import urlencode
    redirect_uri = _resolve_redirect_uri(request)
    url = "https://login.xero.com/identity/connect/authorize?" + urlencode({
        "response_type": "code",
        "client_id": XERO_CLIENT_ID,
        "redirect_uri": redirect_uri,
        "scope": XERO_SCOPES,
        "state": state,
        "prompt": "login",
    })
    return RedirectResponse(url)


@app.get("/api/xero/callback")
async def xero_callback(
    request: Request,
    state: str = Query(...),
    code:  str = Query(None),
    error: str = Query(None),
    error_description: str = Query(None),
):
    print(f"DEBUG XERO_CALLBACK state_present={bool(state)} code_present={bool(code)} error={error or 'none'}")
    if error:
        raise HTTPException(status_code=400, detail=error_description or error)
    if not code:
        raise HTTPException(status_code=400, detail="Xero did not return an authorization code")
    state_row = await supabase.table("oauth_states").select("*").eq("state", state).execute()
    if not state_row.data:
        raise HTTPException(status_code=400, detail="Invalid OAuth state")
    client_id = state_row.data[0]["client_id"]
    await supabase.table("oauth_states").delete().eq("state", state).execute()

    redirect_uri = _resolve_redirect_uri(request)
    async with httpx.AsyncClient() as c:
        r = await c.post(
            XERO_TOKEN_URL,
            headers={"Authorization": _xero_basic(), "Content-Type": "application/x-www-form-urlencoded"},
            data={"grant_type": "authorization_code", "code": code, "redirect_uri": redirect_uri},
        )
    if r.is_error:
        print(f"ERROR XERO_TOKEN status={r.status_code} response={r.text[:500]}")
        raise HTTPException(status_code=502, detail="Xero token exchange failed")
    t = r.json()

    async with httpx.AsyncClient() as c:
        cr = await c.get(XERO_CONNECT_URL, headers={"Authorization": f"Bearer {t['access_token']}", "Accept": "application/json"})
    cr.raise_for_status()
    connections = cr.json()
    selected_connection = await _select_xero_connection(connections, client_id)
    tenant_id = selected_connection["tenantId"]

    await supabase.table("xero_connections").upsert({
        "client_id":      client_id,
        "xero_tenant_id": tenant_id,
        "access_token":   t["access_token"],
        "refresh_token":  t["refresh_token"],
        "expires_at":     datetime.utcnow().timestamp() + t["expires_in"],
        "updated_at":     datetime.utcnow().isoformat(),
    }, on_conflict="client_id").execute()

    # If connected via admin flow, redirect back to admin dashboard; else to client portal
    origin = state_row.data[0].get("origin", "client")
    if origin == "admin":
        return RedirectResponse(f"{ADMIN_URL}/dashboard/clients?xero=connected")
    return RedirectResponse(f"{FRONTEND_URL}/portal?xero=connected")


@app.delete("/api/xero/disconnect")
async def xero_disconnect(user: dict = Depends(require_client)):
    client_id = user["client_id"]
    try:
        conn = await _get_xero_conn(client_id)
        async with httpx.AsyncClient() as c:
            await c.post(
                "https://identity.xero.com/connect/revocation",
                headers={"Authorization": _xero_basic(), "Content-Type": "application/x-www-form-urlencoded"},
                data={"token": conn["refresh_token"], "token_type_hint": "refresh_token"},
            )
    except Exception:
        pass
    await supabase.table("xero_connections").delete().eq("client_id", client_id).execute()
    return {"success": True}


@app.get("/api/xero/status")
async def xero_status(user: dict = Depends(require_client)):
    client_id = user["client_id"]
    row = await supabase.table("xero_connections").select("xero_tenant_id,updated_at").eq("client_id", client_id).execute()
    return {"connected": bool(row.data), "updated_at": row.data[0]["updated_at"] if row.data else None}


# ── Analytics helpers ─────────────────────────────────────────────────────────

def _parse_xero_date(val: str) -> date:
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
        bkt  = _age_bucket((today - due).days)
        name = inv.get("Contact", {}).get("Name", "Unknown")
        if name not in contacts:
            contacts[name] = {"contact": name, "current": 0.0, "1-30": 0.0, "31-60": 0.0, "60+": 0.0, "total": 0.0}
        amt = float(inv.get("AmountDue", 0))
        contacts[name][bkt]     += amt
        contacts[name]["total"] += amt
    return sorted(contacts.values(), key=lambda x: -x["total"])


def _aged_report(invoices: list, title: str) -> dict:
    buckets = _bucket_invoices(invoices, date.today())
    rows = [{"Cells": [{"Value": "Contact"}, {"Value": "Current"}, {"Value": "1-30"}, {"Value": "31-60"}, {"Value": "60+"}, {"Value": "Total"}]}]
    rows.append({"Rows": [{"Cells": [{"Value": bucket["contact"]}, {"Value": f"{bucket['current']:.2f}"}, {"Value": f"{bucket['1-30']:.2f}"}, {"Value": f"{bucket['31-60']:.2f}"}, {"Value": f"{bucket['60+']:.2f}"}, {"Value": f"{bucket['total']:.2f}"}]} for bucket in buckets]})
    return {"Reports": [{"ReportName": title, "Rows": rows}]}

def _resolve_client(user: dict, client_id_param: Optional[str]) -> str:
    """Admin can pass any client_id; client role always uses their own."""
    if user["role"] == "super_admin":
        if not client_id_param:
            raise HTTPException(status_code=400, detail="Admin must supply client_id")
        return client_id_param
    return user["client_id"]

# ── Analytics endpoints ───────────────────────────────────────────────────────

@app.get("/api/analytics/aged-receivables")
async def analytics_aged_receivables(client_id: Optional[str] = None, user=Depends(require_client)):
    cid = _resolve_client(user, client_id)
    data = await _xero_get(cid, "Invoices?Statuses=AUTHORISED&Type=ACCREC&order=DueDate DESC")
    return _bucket_invoices(data.get("Invoices", []), date.today())

@app.get("/api/analytics/aged-payables")
async def analytics_aged_payables(client_id: Optional[str] = None, user=Depends(require_client)):
    cid = _resolve_client(user, client_id)
    data = await _xero_get(cid, "Invoices?Statuses=AUTHORISED&Type=ACCPAY&order=DueDate DESC")
    return _bucket_invoices(data.get("Invoices", []), date.today())

@app.get("/api/analytics/cashflow")
async def analytics_cashflow(client_id: Optional[str] = None, user=Depends(require_client)):
    cid    = _resolve_client(user, client_id)
    today  = date.today()
    result = []
    for i in range(11, -1, -1):
        month    = (today.month - i - 1) % 12 + 1
        year     = today.year - ((today.month - i - 1) // 12)
        from_d   = date(year, month, 1)
        last_day = (date(year, month % 12 + 1, 1) if month < 12 else date(year + 1, 1, 1)) - timedelta(days=1)
        inflow = outflow = 0.0
        try:
            data = await _xero_get(cid, f"Reports/ProfitAndLoss?fromDate={from_d}&toDate={last_day}")
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
async def analytics_vat(client_id: Optional[str] = None, user=Depends(require_client)):
    cid     = _resolve_client(user, client_id)
    today   = date.today()
    periods = []
    for q in range(3, -1, -1):
        cur_q     = (today.month - 1) // 3
        target_q  = cur_q - q
        year_off  = 0
        while target_q < 0:
            target_q += 4; year_off -= 1
        q_year      = today.year + year_off
        q_start_mon = target_q * 3 + 1
        q_end_mon   = q_start_mon + 2
        from_d      = date(q_year, q_start_mon, 1)
        last_day    = (date(q_year, q_end_mon % 12 + 1, 1) if q_end_mon < 12 else date(q_year + 1, 1, 1)) - timedelta(days=1)
        vat_collected = vat_paid = 0.0
        try:
            sales = await _xero_get(cid, f"Invoices?Type=ACCREC&Statuses=AUTHORISED,PAID&DateFrom={from_d}&DateTo={last_day}")
            for inv in sales.get("Invoices", []):
                for li in inv.get("LineItems", []):
                    vat_collected += float(li.get("TaxAmount", 0))
        except Exception: pass
        try:
            bills = await _xero_get(cid, f"Invoices?Type=ACCPAY&Statuses=AUTHORISED,PAID&DateFrom={from_d}&DateTo={last_day}")
            for inv in bills.get("Invoices", []):
                for li in inv.get("LineItems", []):
                    vat_paid += float(li.get("TaxAmount", 0))
        except Exception: pass
        periods.append({"period": f"Q{target_q + 1} {q_year}", "vat_collected": round(vat_collected, 2), "vat_paid": round(vat_paid, 2), "net_vat": round(vat_collected - vat_paid, 2)})
    return periods

@app.get("/api/analytics/top")
async def analytics_top(client_id: Optional[str] = None, user=Depends(require_client)):
    cid    = _resolve_client(user, client_id)
    today  = date.today()
    from_d = date(today.year, 1, 1)
    customers: dict = {}
    expenses:  dict = {}
    try:
        sales = await _xero_get(cid, f"Invoices?Type=ACCREC&Statuses=AUTHORISED,PAID&DateFrom={from_d}&DateTo={today}")
        for inv in sales.get("Invoices", []):
            n = inv.get("Contact", {}).get("Name", "Unknown")
            customers[n] = customers.get(n, 0.0) + float(inv.get("Total", 0))
    except Exception: pass
    try:
        bills = await _xero_get(cid, f"Invoices?Type=ACCPAY&Statuses=AUTHORISED,PAID&DateFrom={from_d}&DateTo={today}")
        for inv in bills.get("Invoices", []):
            for li in inv.get("LineItems", []):
                cat = li.get("Description") or li.get("AccountCode") or "Other"
                expenses[cat] = expenses.get(cat, 0.0) + float(li.get("LineAmount", 0))
    except Exception: pass
    return {
        "top_customers": sorted([{"name": k, "value": round(v, 2)} for k, v in customers.items()], key=lambda x: -x["value"])[:10],
        "top_expenses":  sorted([{"name": k, "value": round(v, 2)} for k, v in expenses.items()],  key=lambda x: -x["value"])[:10],
    }

@app.get("/api/analytics/budget")
async def analytics_budget(client_id: Optional[str] = None, user=Depends(require_client)):
    cid    = _resolve_client(user, client_id)
    today  = date.today()
    from_d = date(today.year, 1, 1)
    budget = actual = None
    try:
        budget = await _xero_get(cid, f"Reports/BudgetSummary?date={today}&periods=12&timeframe=1")
    except Exception: pass
    try:
        actual = await _xero_get(cid, f"Reports/ProfitAndLoss?fromDate={from_d}&toDate={today}")
    except Exception: pass
    return {"budget": budget, "actual": actual}


# ── Analytics cache (sync + serve) ───────────────────────────────────────────

@app.post("/api/analytics/sync")
async def analytics_sync(client_id: Optional[str] = None, user=Depends(require_client)):
    import asyncio
    cid = _resolve_client(user, client_id)
    aged_rec, aged_pay, cashflow, vat, top = await asyncio.gather(
        analytics_aged_receivables(cid, user),
        analytics_aged_payables(cid, user),
        analytics_cashflow(cid, user),
        analytics_vat(cid, user),
        analytics_top(cid, user),
        return_exceptions=True,
    )
    saved = []
    for key, val in [("aged_receivables", aged_rec), ("aged_payables", aged_pay),
                     ("cashflow", cashflow), ("vat", vat), ("top", top)]:
        if isinstance(val, Exception):
            continue
        await supabase.table("analytics_cache").upsert(
            {"client_id": cid, "key": key, "data": val, "updated_at": datetime.utcnow().isoformat()},
            on_conflict="client_id,key"
        ).execute()
        saved.append(key)
    return {"synced": saved}


@app.get("/api/analytics/cached/{key}")
async def analytics_cached(key: str, client_id: Optional[str] = None, user=Depends(require_client)):
    cid = _resolve_client(user, client_id)
    row = await supabase.table("analytics_cache").select("data,updated_at").eq("client_id", cid).eq("key", key).execute()
    if not row.data:
        raise HTTPException(status_code=404, detail="No cached data — run /api/analytics/sync first.")
    return {"data": row.data[0]["data"], "updated_at": row.data[0]["updated_at"]}

# ── Reports ───────────────────────────────────────────────────────────────────

@app.get("/api/reports/profit-and-loss")
async def profit_and_loss(from_date: str, to_date: str, client_id: Optional[str] = None, user=Depends(require_client)):
    cid = _resolve_client(user, client_id)
    return await _xero_get(cid, f"Reports/ProfitAndLoss?fromDate={from_date}&toDate={to_date}")

@app.get("/api/reports/balance-sheet")
async def balance_sheet(report_date: str, client_id: Optional[str] = None, user=Depends(require_client)):
    cid = _resolve_client(user, client_id)
    return await _xero_get(cid, f"Reports/BalanceSheet?date={report_date}")

@app.get("/api/reports/monthly")
async def monthly_report(client_id: Optional[str] = None, user=Depends(require_client)):
    cid    = _resolve_client(user, client_id)
    today  = date.today()
    result = []
    for i in range(5, -1, -1):
        month    = (today.month - i - 1) % 12 + 1
        year     = today.year - ((today.month - i - 1) // 12)
        from_d   = date(year, month, 1)
        last_day = (date(year, month % 12 + 1, 1) if month < 12 else date(year + 1, 1, 1)) - timedelta(days=1)
        revenue = expenses = 0.0
        try:
            data = await _xero_get(cid, f"Reports/ProfitAndLoss?fromDate={from_d}&toDate={last_day}")
            for section in data.get("Reports", [{}])[0].get("Rows", []):
                for row in section.get("Rows", []):
                    cells = row.get("Cells", [])
                    if not cells: continue
                    label = cells[0].get("Value", "").lower()
                    val   = float(cells[1].get("Value") or 0) if len(cells) > 1 else 0
                    if "total income" in label:             revenue  = val
                    if "total operating expenses" in label: expenses = val
        except Exception: pass
        result.append({"name": from_d.strftime("%b"), "revenue": revenue, "expenses": expenses})
    return result


@app.get("/api/reports/aged-receivables")
async def aged_receivables(client_id: Optional[str] = None, user=Depends(require_client)):
    cid = _resolve_client(user, client_id)
    data = await _xero_get(cid, "Invoices?Statuses=AUTHORISED&Type=ACCREC&order=DueDate DESC")
    return _aged_report(data.get("Invoices", []), "Aged Receivables")


@app.get("/api/reports/aged-payables")
async def aged_payables(client_id: Optional[str] = None, user=Depends(require_client)):
    cid = _resolve_client(user, client_id)
    data = await _xero_get(cid, "Invoices?Statuses=AUTHORISED&Type=ACCPAY&order=DueDate DESC")
    return _aged_report(data.get("Invoices", []), "Aged Payables")


@app.get("/api/reports/{report_type}")
async def report_data(report_type: str, client_id: Optional[str] = None, user=Depends(require_client)):
    if report_type not in REPORT_MAP:
        raise HTTPException(status_code=404, detail="Unknown report type")
    cid = _resolve_client(user, client_id)
    path = REPORT_MAP[report_type]
    if report_type == "profit-and-loss":
        today = date.today()
        path += f"?fromDate={today.year}-01-01&toDate={today}"
    elif report_type == "balance-sheet":
        path += f"?date={date.today()}"
    elif report_type in ("aged-receivables", "aged-payables"):
        path += f"?date={date.today()}"
    return await _xero_get(cid, path)

# ── Export (PDF / Excel) ──────────────────────────────────────────────────────

REPORT_MAP = {
    "profit-and-loss":  "Reports/ProfitAndLoss",
    "balance-sheet":    "Reports/BalanceSheet",
    "aged-receivables": "Reports/AgedReceivablesByContact",
    "aged-payables":    "Reports/AgedPayablesByContact",
}

def _extract_rows(report_json: dict):
    reports = report_json.get("Reports", [{}])
    title   = reports[0].get("ReportTitles", ["Report"])[0] if reports else "Report"
    rows    = []
    for section in reports[0].get("Rows", []):
        for row in section.get("Rows", [section]):
            rows.append([c.get("Value", "") for c in row.get("Cells", [])])
    return title, rows

@app.get("/api/reports/{report_type}/export/pdf")
async def export_pdf(report_type: str, client_id: Optional[str] = None, user=Depends(require_client)):
    if report_type not in REPORT_MAP:
        raise HTTPException(status_code=404, detail="Unknown report type")
    cid = _resolve_client(user, client_id)
    if report_type == "aged-receivables":
        invoice_data = await _xero_get(cid, "Invoices?Statuses=AUTHORISED&Type=ACCREC&order=DueDate DESC")
        data = _aged_report(invoice_data.get("Invoices", []), "Aged Receivables")
    elif report_type == "aged-payables":
        invoice_data = await _xero_get(cid, "Invoices?Statuses=AUTHORISED&Type=ACCPAY&order=DueDate DESC")
        data = _aged_report(invoice_data.get("Invoices", []), "Aged Payables")
    else:
        data = await _xero_get(cid, REPORT_MAP[report_type])
    title, rows = _extract_rows(data)
    buf = io.BytesIO()
    doc = SimpleDocTemplate(buf, pagesize=A4)
    styles = getSampleStyleSheet()
    elements = [Paragraph(title, styles["Title"]), Spacer(1, 12)]
    if rows:
        t = Table(rows)
        t.setStyle(TableStyle([
            ("BACKGROUND", (0, 0), (-1, 0), colors.HexColor("#2563EB")),
            ("TEXTCOLOR",  (0, 0), (-1, 0), colors.white),
            ("FONTNAME",   (0, 0), (-1, 0), "Helvetica-Bold"),
            ("ROWBACKGROUNDS", (0, 1), (-1, -1), [colors.white, colors.HexColor("#F3F4F6")]),
            ("GRID",       (0, 0), (-1, -1), 0.5, colors.HexColor("#E5E7EB")),
            ("FONTSIZE",   (0, 0), (-1, -1), 8),
            ("PADDING",    (0, 0), (-1, -1), 6),
        ]))
        elements.append(t)
    doc.build(elements)
    buf.seek(0)
    return StreamingResponse(buf, media_type="application/pdf",
        headers={"Content-Disposition": f"attachment; filename={report_type}.pdf"})

@app.get("/api/reports/{report_type}/export/excel")
async def export_excel(report_type: str, client_id: Optional[str] = None, user=Depends(require_client)):
    if report_type not in REPORT_MAP:
        raise HTTPException(status_code=404, detail="Unknown report type")
    cid = _resolve_client(user, client_id)
    if report_type == "aged-receivables":
        invoice_data = await _xero_get(cid, "Invoices?Statuses=AUTHORISED&Type=ACCREC&order=DueDate DESC")
        data = _aged_report(invoice_data.get("Invoices", []), "Aged Receivables")
    elif report_type == "aged-payables":
        invoice_data = await _xero_get(cid, "Invoices?Statuses=AUTHORISED&Type=ACCPAY&order=DueDate DESC")
        data = _aged_report(invoice_data.get("Invoices", []), "Aged Payables")
    else:
        data = await _xero_get(cid, REPORT_MAP[report_type])
    title, rows = _extract_rows(data)
    wb = openpyxl.Workbook()
    ws = wb.active
    ws.title = title[:31]
    for row in rows:
        ws.append(row)
    buf = io.BytesIO()
    wb.save(buf)
    buf.seek(0)
    return StreamingResponse(buf,
        media_type="application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
        headers={"Content-Disposition": f"attachment; filename={report_type}.xlsx"})

# ── Client portal (invoices for logged-in client) ─────────────────────────────

@app.get("/api/portal/invoices")
async def portal_invoices(client_id: Optional[str] = None, user=Depends(require_client)):
    cid = _resolve_client(user, client_id) if user["role"] == "super_admin" else user.get("client_id")
    if not cid:
        return {"invoices": [], "stats": {"total": 0, "paid": 0, "outstanding": 0}}
    try:
        data = await _xero_get(cid, "Invoices?Statuses=AUTHORISED,PAID,VOIDED&order=DueDate DESC")
        inv_list = data.get("Invoices", [])
    except Exception:
        inv_list = []
    paid        = sum(1 for i in inv_list if i.get("Status") == "PAID")
    outstanding = sum(float(i.get("AmountDue", 0)) for i in inv_list if i.get("Status") == "AUTHORISED")
    return {"invoices": inv_list, "stats": {"total": len(inv_list), "paid": paid, "outstanding": round(outstanding, 2)}}

# ── Admin: all clients combined view ─────────────────────────────────────────

@app.get("/api/admin/overview")
async def admin_overview(_=Depends(require_admin)):
    clients = await supabase.table("clients").select("id,name,email,is_active").execute()
    conns   = await supabase.table("xero_connections").select("client_id,updated_at").execute()
    conn_map = {c["client_id"]: c["updated_at"] for c in conns.data}
    return [
        {**cl, "xero_connected": cl["id"] in conn_map, "last_sync": conn_map.get(cl["id"])}
        for cl in clients.data
    ]


@app.get("/api/admin/financial-overview")
async def admin_financial_overview(_=Depends(require_admin)):
    clients = await supabase.table("clients").select("id,name").execute()
    connected = await supabase.table("xero_connections").select("client_id").execute()
    client_names = {client["id"]: client["name"] for client in clients.data}
    client_ids = [connection["client_id"] for connection in connected.data]

    def report_value(report: dict, label: str) -> float:
        for section in report.get("Reports", [{}])[0].get("Rows", []):
            for row in section.get("Rows", []):
                cells = row.get("Cells", [])
                if cells and cells[0].get("Value", "").lower() == label.lower():
                    try:
                        return float(str(cells[1].get("Value", 0)).replace(",", ""))
                    except (IndexError, TypeError, ValueError):
                        return 0
        return 0

    async def load_client(client_id: str) -> tuple[dict, list[dict]]:
        import asyncio
        today = date.today()
        try:
            report, invoices, balance = await asyncio.gather(
                _xero_get(client_id, f"Reports/ProfitAndLoss?fromDate={today.year}-01-01&toDate={today}"),
                _xero_get(client_id, "Invoices?Statuses=AUTHORISED,PAID,VOIDED&order=DueDate DESC"),
                _xero_get(client_id, f"Reports/BalanceSheet?date={today}"),
            )
        except Exception:
            return {"income": 0, "expenses": 0, "profit": 0, "bank": 0}, []
        summary = {
            "income": report_value(report, "Total Income"),
            "expenses": report_value(report, "Total Operating Expenses"),
            "profit": report_value(report, "Net Profit"),
            "bank": report_value(balance, "Total Assets"),
        }
        client_invoices = [
            {**invoice, "client_id": client_id, "client_name": client_names.get(client_id, "")}
            for invoice in invoices.get("Invoices", [])
        ]
        return summary, client_invoices

    import asyncio
    results = await asyncio.gather(*(load_client(client_id) for client_id in client_ids))
    totals = {
        "income": sum(result[0]["income"] for result in results),
        "expenses": sum(result[0]["expenses"] for result in results),
        "profit": sum(result[0]["profit"] for result in results),
        "bank": sum(result[0]["bank"] for result in results),
    }
    invoices = [invoice for _, client_invoices in results for invoice in client_invoices]
    invoices.sort(key=lambda invoice: invoice.get("DueDateString") or invoice.get("DueDate", ""))
    today = date.today()
    monthly = []
    for month_offset in range(5, -1, -1):
        month_number = (today.month - month_offset - 1) % 12 + 1
        month_year = today.year - ((today.month - month_offset - 1) // 12)
        month_start = date(month_year, month_number, 1)
        next_month = date(month_year + 1, 1, 1) if month_number == 12 else date(month_year, month_number + 1, 1)
        revenue = expenses = 0.0
        for invoice in invoices:
            invoice_date = _parse_xero_date(invoice.get("DateString") or invoice.get("Date", ""))
            if month_start <= invoice_date < next_month:
                if invoice.get("Type") == "ACCREC":
                    revenue += float(invoice.get("Total", 0) or 0)
                elif invoice.get("Type") == "ACCPAY":
                    expenses += float(invoice.get("Total", 0) or 0)
        monthly.append({"name": month_start.strftime("%b"), "revenue": revenue, "expenses": expenses})
    return {
        "invoices": invoices[:5],
        "profit_and_loss": {"Reports": [{"Rows": [{"Cells": [
            {"Value": "Total Income"}, {"Value": str(totals["income"])}
        ]}, {"Cells": [
            {"Value": "Total Operating Expenses"}, {"Value": str(totals["expenses"])}
        ]}, {"Cells": [
            {"Value": "Net Profit"}, {"Value": str(totals["profit"])}
        ]}]}]},
        "balance_sheet": {"Reports": [{"Rows": [{"Cells": [
            {"Value": "Total Assets"}, {"Value": str(totals["bank"])}
        ]}]}]},
        "monthly": monthly,
    }

# ── Root ──────────────────────────────────────────────────────────────────────

@app.get("/")
async def root():
    return {"status": "ok", "message": "Wealcco API is running"}

if __name__ == "__main__":
    import uvicorn
    uvicorn.run("main:app", host="0.0.0.0", port=8000, reload=True)
