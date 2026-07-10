"use client";

import React, { useEffect, useState } from "react";
import { CheckCircle, XCircle, ExternalLink, RefreshCw } from "lucide-react";

const API = "http://localhost:8000";

const REQUIRED_SCOPES = [
  { scope: "offline_access",                        description: "Keep connection alive (refresh tokens)" },
  { scope: "openid profile email",                  description: "Basic identity" },
  { scope: "accounting.settings.read",              description: "Organisation settings" },
  { scope: "accounting.contacts.read",              description: "Customers & suppliers" },
  { scope: "accounting.invoices.read",              description: "Invoices & bills" },
  { scope: "accounting.reports.aged.read",          description: "Aged Receivables & Payables reports" },
  { scope: "accounting.reports.balancesheet.read",  description: "Balance Sheet report" },
  { scope: "accounting.reports.profitandloss.read", description: "Profit & Loss report" },
];

export default function SettingsPage() {
  const [connected, setConnected] = useState<boolean | null>(null);

  useEffect(() => {
    fetch(`${API}/api/auth/xero/status`)
      .then((r) => r.json())
      .then((d) => setConnected(d.connected))
      .catch(() => setConnected(false));
  }, []);

  return (
    <div className="p-8 max-w-2xl">
      <h2 className="text-3xl font-bold text-gray-900 mb-1">Settings</h2>
      <p className="text-gray-500 mb-8">Manage your Xero integration</p>

      {/* Connection status */}
      <div className="bg-white rounded-2xl border border-gray-200 shadow-sm p-6 mb-6">
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-lg font-semibold text-gray-900">Xero Connection</h3>
          {connected === null ? (
            <RefreshCw className="w-5 h-5 animate-spin text-gray-400" />
          ) : connected ? (
            <span className="flex items-center gap-1.5 text-green-700 bg-green-50 px-3 py-1 rounded-full text-sm font-medium">
              <CheckCircle className="w-4 h-4" /> Connected
            </span>
          ) : (
            <span className="flex items-center gap-1.5 text-red-700 bg-red-50 px-3 py-1 rounded-full text-sm font-medium">
              <XCircle className="w-4 h-4" /> Not connected
            </span>
          )}
        </div>
        <div className="flex gap-3">
          <a
            href={`${API}/api/auth/xero/login`}
            className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg text-sm font-medium transition"
          >
            {connected ? "Reconnect Xero" : "Connect Xero"}
          </a>
          <a
            href="https://developer.xero.com/app/manage"
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center gap-1.5 border border-gray-300 text-gray-700 px-4 py-2 rounded-lg text-sm font-medium hover:bg-gray-50 transition"
          >
            Xero Developer Portal <ExternalLink className="w-3.5 h-3.5" />
          </a>
        </div>
      </div>

      {/* Required scopes */}
      <div className="bg-white rounded-2xl border border-gray-200 shadow-sm p-6">
        <div className="flex items-start justify-between mb-2">
          <h3 className="text-lg font-semibold text-gray-900">Required OAuth Scopes</h3>
          <a
            href="https://developer.xero.com/app/manage"
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center gap-1 text-blue-600 hover:text-blue-700 text-sm font-medium"
          >
            Verify in Xero <ExternalLink className="w-3.5 h-3.5" />
          </a>
        </div>
        <p className="text-sm text-gray-500 mb-4">
          Your app was created after 2 March 2026 — only new granular scopes apply. Ensure all of these are enabled in your Xero app.
        </p>
        <div className="space-y-2">
          {REQUIRED_SCOPES.map(({ scope, description }) => (
            <div key={scope} className="flex items-center justify-between py-2.5 border-b border-gray-100 last:border-0">
              <div>
                <p className="text-sm font-mono text-gray-800">{scope}</p>
                <p className="text-xs text-gray-500">{description}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
