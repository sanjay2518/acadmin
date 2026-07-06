from fastapi import FastAPI, Request, Depends, HTTPException
from fastapi.responses import RedirectResponse
from fastapi.middleware.cors import CORSMiddleware
import os

app = FastAPI(title="Wealcco Client Portal API")

# Setup CORS for the Next.js frontend
app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:3000"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Xero OAuth Credentials (should be in .env)
XERO_CLIENT_ID = os.environ.get("XERO_CLIENT_ID", "YOUR_XERO_CLIENT_ID")
XERO_CLIENT_SECRET = os.environ.get("XERO_CLIENT_SECRET", "YOUR_XERO_CLIENT_SECRET")
XERO_REDIRECT_URI = "http://localhost:8000/api/auth/xero/callback"

@app.get("/")
def read_root():
    return {"status": "ok", "message": "Wealcco API is running"}

@app.get("/api/auth/xero/login")
def xero_login():
    """
    Redirects the user to the Xero authorization page.
    """
    scopes = "offline_access accounting.transactions.read accounting.reports.read accounting.settings.read"
    
    # URL encode the scopes and redirect URI
    # In a real app, you should also pass a 'state' parameter to prevent CSRF attacks
    auth_url = (
        f"https://login.xero.com/identity/connect/authorize"
        f"?response_type=code"
        f"&client_id={XERO_CLIENT_ID}"
        f"&redirect_uri={XERO_REDIRECT_URI}"
        f"&scope={scopes}"
        f"&state=secure_random_string_here"
    )
    
    return RedirectResponse(url=auth_url)

@app.get("/api/auth/xero/callback")
def xero_callback(code: str = None, state: str = None):
    """
    Handles the callback from Xero after the user authorizes the app.
    Exchanges the authorization code for an access token.
    """
    if not code:
        raise HTTPException(status_code=400, detail="Missing authorization code")
        
    # Here you would typically:
    # 1. Exchange the 'code' for access and refresh tokens via POST to https://identity.xero.com/connect/token
    # 2. Get the connected tenant (organization) ID via GET to https://api.xero.com/connections
    # 3. Store the tokens and tenant_id securely in Supabase against the current user/company ID
    
    return {
        "message": "Authorization code received successfully!",
        "code": code,
        "next_steps": "Exchange this code for an access token and store it in Supabase."
    }

if __name__ == "__main__":
    import uvicorn
    uvicorn.run("main:app", host="0.0.0.0", port=8000, reload=True)
