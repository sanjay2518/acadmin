"use client";

import React, { useEffect, useState } from "react";
import { useSearchParams } from "next/navigation";
import {
  UserPlus, Loader2, RefreshCw, CheckCircle2, XCircle,
  ToggleLeft, ToggleRight, Link2, KeyRound, Eye, EyeOff
} from "lucide-react";

const API = process.env.NEXT_PUBLIC_API_URL || "https://acadmin-seven.vercel.app";

function getToken(): string {
  try { return JSON.parse(localStorage.getItem("admin_user") || "").token; } catch { return ""; }
}
function authH() { return { Authorization: `Bearer ${getToken()}`, "Content-Type": "application/json" }; }

interface Client {
  id: string;
  name: string;
  email: string;
  is_active: boolean;
  created_at: string;
  xero_connected?: boolean;
}

export default function ClientsPage() {
  const searchParams = useSearchParams();
  const [clients, setClients]         = useState<Client[]>([]);
  const [loading, setLoading]         = useState(true);
  const [showForm, setShowForm]       = useState(false);
  const [name, setName]               = useState("");
  const [email, setEmail]             = useState("");
  const [password, setPassword]       = useState("");
  const [showPass, setShowPass]       = useState(false);
  const [creating, setCreating]       = useState(false);
  const [error, setError]             = useState("");
  const [success, setSuccess]         = useState("");
  const [actionId, setActionId]       = useState<string | null>(null);

  // Reset password modal state
  const [resetClient, setResetClient] = useState<Client | null>(null);
  const [newPassword, setNewPassword] = useState("");
  const [showNewPass, setShowNewPass] = useState(false);
  const [resetting, setResetting]     = useState(false);

  useEffect(() => {
    if (searchParams.get("xero") === "connected") {
      setSuccess("Xero connected successfully!");
      // Clean URL without reload
      window.history.replaceState({}, "", "/dashboard/clients");
    }
  }, [searchParams]);

  const load = () => {
    setLoading(true);
    fetch(`${API}/api/admin/clients`, { headers: authH() })
      .then(r => r.json())
      .then(d => setClients(Array.isArray(d) ? d : []))
      .finally(() => setLoading(false));
  };

  useEffect(() => { load(); }, []);

  const handleCreate = async (e: React.FormEvent) => {
    e.preventDefault();
    if (password.length < 6) { setError("Password must be at least 6 characters"); return; }
    setCreating(true); setError(""); setSuccess("");
    try {
      const res  = await fetch(`${API}/api/admin/clients`, {
        method: "POST", headers: authH(),
        body: JSON.stringify({ name, email, password }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.detail || "Failed to create client");
      setSuccess(`Client "${name}" created. They can now log in with the password you set.`);
      setName(""); setEmail(""); setPassword(""); setShowForm(false);
      load();
    } catch (err: any) {
      setError(err.message);
    } finally {
      setCreating(false);
    }
  };

  const handleResetPassword = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!resetClient) return;
    if (newPassword.length < 6) { setError("Password must be at least 6 characters"); return; }
    setResetting(true); setError("");
    try {
      const res = await fetch(`${API}/api/admin/clients/${resetClient.id}/reset-password`, {
        method: "POST", headers: authH(),
        body: JSON.stringify({ password: newPassword }),
      });
      if (!res.ok) throw new Error("Failed to reset password");
      setSuccess(`Password updated for ${resetClient.name}`);
      setResetClient(null); setNewPassword("");
    } catch (err: any) {
      setError(err.message);
    } finally {
      setResetting(false);
    }
  };

  const toggleActive = async (client: Client) => {
    setActionId(client.id);
    await fetch(`${API}/api/admin/clients/${client.id}`, {
      method: "PATCH", headers: authH(),
      body: JSON.stringify({ is_active: !client.is_active }),
    });
    setActionId(null);
    load();
  };

  const connectXero = (clientId: string) => {
    const token = getToken();
    const query = token ? `?token=${encodeURIComponent(token)}` : "";
    window.location.href = `${API}/api/xero/connect/admin/${clientId}${query}`;
  };

  return (
    <div className="p-8">
      <header className="flex justify-between items-center mb-8">
        <div>
          <h2 className="text-3xl font-bold text-gray-900">Clients</h2>
          <p className="text-gray-500 mt-1">Create and manage client portal accounts</p>
        </div>
        <div className="flex gap-3">
          <button onClick={load}
            className="flex items-center gap-2 bg-white border border-gray-300 text-gray-700 px-4 py-2 rounded-lg font-medium hover:bg-gray-50 transition shadow-sm">
            <RefreshCw className="w-4 h-4" /> Refresh
          </button>
          <button onClick={() => { setShowForm(!showForm); setError(""); setSuccess(""); }}
            className="flex items-center gap-2 bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg font-medium transition shadow-sm">
            <UserPlus className="w-4 h-4" /> Add Client
          </button>
        </div>
      </header>

      {/* Feedback banners */}
      {success && (
        <div className="flex items-center gap-2 bg-green-50 border border-green-200 text-green-800 rounded-xl px-4 py-3 mb-6 text-sm">
          <CheckCircle2 className="w-4 h-4 shrink-0" /> {success}
        </div>
      )}
      {error && (
        <div className="flex items-center gap-2 bg-red-50 border border-red-200 text-red-700 rounded-xl px-4 py-3 mb-6 text-sm">
          <XCircle className="w-4 h-4 shrink-0" /> {error}
        </div>
      )}

      {/* Add Client form */}
      {showForm && (
        <div className="bg-white border border-gray-200 rounded-2xl p-6 mb-6 shadow-sm">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">New Client</h3>
          <form onSubmit={handleCreate} className="grid grid-cols-1 sm:grid-cols-3 gap-3">
            <input
              type="text" placeholder="Client name (e.g. Acme Ltd)" value={name}
              onChange={e => setName(e.target.value)} required
              className="border border-gray-300 rounded-xl px-4 py-2.5 text-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none"
            />
            <input
              type="email" placeholder="Login email" value={email}
              onChange={e => setEmail(e.target.value)} required
              className="border border-gray-300 rounded-xl px-4 py-2.5 text-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none"
            />
            <div className="relative">
              <input
                type={showPass ? "text" : "password"} placeholder="Set password (min 6 chars)" value={password}
                onChange={e => setPassword(e.target.value)} required
                className="w-full border border-gray-300 rounded-xl px-4 py-2.5 pr-10 text-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none"
              />
              <button type="button" onClick={() => setShowPass(!showPass)}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600">
                {showPass ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
              </button>
            </div>
            <button type="submit" disabled={creating}
              className="sm:col-span-3 flex items-center justify-center gap-2 bg-blue-600 hover:bg-blue-700 disabled:opacity-60 text-white px-6 py-2.5 rounded-xl font-medium text-sm transition">
              {creating ? <Loader2 className="w-4 h-4 animate-spin" /> : <UserPlus className="w-4 h-4" />}
              {creating ? "Creating…" : "Create Client"}
            </button>
          </form>
          <p className="text-xs text-gray-400 mt-3">
            The client will use this email and password to log in to their portal.
          </p>
        </div>
      )}

      {/* Reset Password modal */}
      {resetClient && (
        <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50 p-4"
          onClick={() => { setResetClient(null); setNewPassword(""); setError(""); }}>
          <div className="bg-white rounded-2xl shadow-2xl max-w-sm w-full p-6"
            onClick={e => e.stopPropagation()}>
            <h3 className="text-lg font-semibold text-gray-900 mb-1">Reset Password</h3>
            <p className="text-sm text-gray-500 mb-4">Set a new password for <strong>{resetClient.name}</strong></p>
            <form onSubmit={handleResetPassword} className="space-y-3">
              <div className="relative">
                <input
                  type={showNewPass ? "text" : "password"} placeholder="New password (min 6 chars)"
                  value={newPassword} onChange={e => setNewPassword(e.target.value)} required autoFocus
                  className="w-full border border-gray-300 rounded-xl px-4 py-2.5 pr-10 text-sm focus:ring-2 focus:ring-blue-500 outline-none"
                />
                <button type="button" onClick={() => setShowNewPass(!showNewPass)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600">
                  {showNewPass ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                </button>
              </div>
              <div className="flex gap-2">
                <button type="submit" disabled={resetting}
                  className="flex-1 flex items-center justify-center gap-2 bg-blue-600 hover:bg-blue-700 disabled:opacity-60 text-white py-2.5 rounded-xl font-medium text-sm transition">
                  {resetting ? <Loader2 className="w-4 h-4 animate-spin" /> : "Save Password"}
                </button>
                <button type="button" onClick={() => { setResetClient(null); setNewPassword(""); setError(""); }}
                  className="flex-1 bg-gray-100 hover:bg-gray-200 text-gray-700 py-2.5 rounded-xl font-medium text-sm transition">
                  Cancel
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Clients table */}
      <div className="bg-white border border-gray-200 rounded-2xl shadow-sm overflow-hidden">
        {loading ? (
          <div className="flex items-center justify-center py-20">
            <Loader2 className="w-8 h-8 animate-spin text-blue-600" />
          </div>
        ) : clients.length === 0 ? (
          <div className="text-center py-20 text-gray-400">
            <UserPlus className="w-10 h-10 mx-auto mb-3 opacity-40" />
            <p>No clients yet — click "Add Client" to create the first one.</p>
          </div>
        ) : (
          <table className="w-full text-sm">
            <thead className="bg-gray-50 border-b border-gray-200">
              <tr>
                <th className="text-left px-6 py-3 text-gray-500 font-medium">Client</th>
                <th className="text-left px-6 py-3 text-gray-500 font-medium">Email</th>
                <th className="text-left px-6 py-3 text-gray-500 font-medium">Xero</th>
                <th className="text-left px-6 py-3 text-gray-500 font-medium">Status</th>
                <th className="text-left px-6 py-3 text-gray-500 font-medium">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {clients.map(client => (
                <tr key={client.id} className="hover:bg-gray-50 transition">
                  <td className="px-6 py-4">
                    <div className="flex items-center gap-3">
                      <div className="w-8 h-8 rounded-full bg-blue-100 flex items-center justify-center text-blue-700 font-bold text-xs shrink-0">
                        {client.name?.charAt(0).toUpperCase()}
                      </div>
                      <span className="font-medium text-gray-900">{client.name}</span>
                    </div>
                  </td>
                  <td className="px-6 py-4 text-gray-500">{client.email}</td>
                  <td className="px-6 py-4">
                    {client.xero_connected ? (
                      <span className="flex items-center gap-1.5 text-green-700 text-xs font-medium">
                        <CheckCircle2 className="w-3.5 h-3.5" /> Connected
                      </span>
                    ) : (
                      <button onClick={() => connectXero(client.id)}
                        className="flex items-center gap-1.5 text-xs font-medium text-blue-600 hover:text-blue-800 transition">
                        <Link2 className="w-3.5 h-3.5" /> Connect Xero
                      </button>
                    )}
                  </td>
                  <td className="px-6 py-4">
                    <span className={`px-2.5 py-1 rounded-full text-xs font-medium ${
                      client.is_active ? "bg-green-100 text-green-700" : "bg-gray-100 text-gray-500"
                    }`}>
                      {client.is_active ? "Active" : "Inactive"}
                    </span>
                  </td>
                  <td className="px-6 py-4">
                    <div className="flex items-center gap-2">
                      <button
                        onClick={() => { setResetClient(client); setError(""); setSuccess(""); }}
                        title="Reset password"
                        className="p-1.5 rounded-lg text-gray-400 hover:text-blue-600 hover:bg-blue-50 transition">
                        <KeyRound className="w-4 h-4" />
                      </button>
                      <button
                        onClick={() => toggleActive(client)}
                        disabled={actionId === client.id}
                        title={client.is_active ? "Deactivate" : "Activate"}
                        className="p-1.5 rounded-lg text-gray-400 hover:text-blue-600 hover:bg-blue-50 transition">
                        {actionId === client.id
                          ? <Loader2 className="w-4 h-4 animate-spin" />
                          : client.is_active
                            ? <ToggleRight className="w-5 h-5 text-green-600" />
                            : <ToggleLeft className="w-5 h-5 text-gray-400" />}
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>
    </div>
  );
}
