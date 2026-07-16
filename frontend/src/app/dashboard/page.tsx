"use client";

import React, { useEffect, useState } from "react";
import {
  LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer,
  BarChart, Bar,
} from "recharts";
import { Building2, TrendingUp, TrendingDown, DollarSign, Loader2, RefreshCw } from "lucide-react";

const API = "https://acadmin-seven.vercel.app/";

function extractKpiValue(report: any, label: string): number {
  try {
    for (const section of report?.Reports?.[0]?.Rows ?? []) {
      for (const row of section?.Rows ?? []) {
        const cells = row?.Cells ?? [];
        if (cells[0]?.Value?.toLowerCase().includes(label.toLowerCase())) {
          return parseFloat(cells[1]?.Value ?? "0") || 0;
        }
      }
    }
  } catch { /* ignore */ }
  return 0;
}

function fmt(n: number) {
  return `£${n.toLocaleString("en-GB", { minimumFractionDigits: 0, maximumFractionDigits: 0 })}`;
}

export default function DashboardPage() {
  const [invoices, setInvoices]   = useState<any[]>([]);
  const [kpis, setKpis]           = useState<any>(null);
  const [monthly, setMonthly]     = useState<any[]>([]);
  const [loading, setLoading]     = useState(true);
  const [error, setError]         = useState<string | null>(null);
  const [lastSync, setLastSync]   = useState("—");

  const load = () => {
    setLoading(true);
    setError(null);
    Promise.allSettled([
      fetch(`${API}/api/invoices?status=AUTHORISED`).then(r => r.json()),
      fetch(`${API}/api/dashboard/kpis`).then(r => r.json()),
      fetch(`${API}/api/reports/monthly`).then(r => r.json()),
    ]).then(([inv, k, m]) => {
      setInvoices(inv.status === "fulfilled" && Array.isArray(inv.value) ? inv.value.slice(0, 5) : []);
      setKpis(k.status === "fulfilled" ? k.value : null);
      setMonthly(m.status === "fulfilled" && Array.isArray(m.value) ? m.value : []);
      if (k.status === "rejected" && inv.status === "rejected") {
        setError("Failed to load data from Xero. Please reconnect.");
      }
      setLastSync(new Date().toLocaleTimeString("en-GB", { hour: "2-digit", minute: "2-digit" }));
    }).finally(() => setLoading(false));
  };

  useEffect(() => { load(); }, []);

  const pl  = kpis?.profit_and_loss;
  const bs  = kpis?.balance_sheet;
  const revenue  = pl ? fmt(extractKpiValue(pl, "total income"))              : null;
  const expenses = pl ? fmt(extractKpiValue(pl, "total operating expenses"))   : null;
  const profit   = pl ? fmt(extractKpiValue(pl, "net profit"))                 : null;
  const bank     = bs ? fmt(extractKpiValue(bs, "total bank"))                 : null;

  if (loading) {
    return (
      <div className="flex items-center justify-center h-full min-h-96">
        <div className="text-center">
          <Loader2 className="w-10 h-10 animate-spin text-blue-600 mx-auto mb-3" />
          <p className="text-gray-500">Loading live data from Xero…</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex items-center justify-center h-full min-h-96">
        <div className="text-center">
          <p className="text-red-600 font-medium mb-4">{error}</p>
          <a href={`${API}/api/auth/xero/login`} className="bg-blue-600 text-white px-6 py-2 rounded-lg font-medium hover:bg-blue-700 transition">
            Reconnect Xero
          </a>
        </div>
      </div>
    );
  }

  return (
    <div className="p-8">
      <header className="flex justify-between items-center mb-8">
        <div>
          <h2 className="text-3xl font-bold text-gray-900">Financial Overview</h2>
          <p className="text-gray-500 mt-1">Live data from Xero · Last synced {lastSync}</p>
        </div>
        <button
          onClick={load}
          className="flex items-center gap-2 bg-white border border-gray-300 text-gray-700 px-4 py-2 rounded-lg font-medium hover:bg-gray-50 transition shadow-sm"
        >
          <RefreshCw className="w-4 h-4" /> Refresh
        </button>
      </header>

      {/* KPI Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        <Card title="Revenue (YTD)"  value={revenue}  icon={<TrendingUp  className="w-6 h-6 text-green-600"  />} />
        <Card title="Expenses (YTD)" value={expenses} icon={<TrendingDown className="w-6 h-6 text-red-600"    />} />
        <Card title="Net Profit"     value={profit}   icon={<DollarSign  className="w-6 h-6 text-blue-600"   />} />
        <Card title="Bank Balance"   value={bank}     icon={<Building2   className="w-6 h-6 text-indigo-600" />} />
      </div>

      {/* Charts */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-8">
        <div className="lg:col-span-2 bg-white p-6 rounded-2xl border border-gray-200 shadow-sm">
          <h3 className="text-lg font-semibold text-gray-900 mb-6">Revenue vs Expenses (Last 6 Months)</h3>
          {monthly.length > 0 ? (
            <div className="h-72">
              <ResponsiveContainer width="100%" height="100%">
                <LineChart data={monthly}>
                  <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#E5E7EB" />
                  <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{ fill: "#6B7280" }} />
                  <YAxis axisLine={false} tickLine={false} tick={{ fill: "#6B7280" }} tickFormatter={v => `£${(v/1000).toFixed(0)}k`} />
                  <Tooltip formatter={(v: any) => fmt(v)} contentStyle={{ borderRadius: "8px", border: "none", boxShadow: "0 4px 6px -1px rgb(0 0 0 / 0.1)" }} />
                  <Line type="monotone" dataKey="revenue"  name="Revenue"  stroke="#2563EB" strokeWidth={3} dot={{ r: 4 }} activeDot={{ r: 6 }} />
                  <Line type="monotone" dataKey="expenses" name="Expenses" stroke="#EF4444" strokeWidth={3} dot={{ r: 4 }} activeDot={{ r: 6 }} />
                </LineChart>
              </ResponsiveContainer>
            </div>
          ) : (
            <div className="h-72 flex items-center justify-center text-gray-400">No monthly data available</div>
          )}
        </div>

        <div className="bg-white p-6 rounded-2xl border border-gray-200 shadow-sm">
          <h3 className="text-lg font-semibold text-gray-900 mb-6">Monthly Revenue</h3>
          {monthly.length > 0 ? (
            <div className="h-72">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={monthly}>
                  <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#E5E7EB" />
                  <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{ fill: "#6B7280" }} />
                  <Tooltip formatter={(v: any) => fmt(v)} cursor={{ fill: "#F3F4F6" }} contentStyle={{ borderRadius: "8px", border: "none", boxShadow: "0 4px 6px -1px rgb(0 0 0 / 0.1)" }} />
                  <Bar dataKey="revenue" name="Revenue" fill="#3B82F6" radius={[4, 4, 0, 0]} />
                </BarChart>
              </ResponsiveContainer>
            </div>
          ) : (
            <div className="h-72 flex items-center justify-center text-gray-400">No data available</div>
          )}
        </div>
      </div>

      {/* Invoices */}
      <div className="bg-white p-6 rounded-2xl border border-gray-200 shadow-sm">
        <h3 className="text-lg font-semibold text-gray-900 mb-6">Outstanding Invoices</h3>
        {invoices.length === 0 ? (
          <p className="text-gray-400 text-center py-8">No outstanding invoices</p>
        ) : (
          <div className="space-y-3">
            {invoices.map((inv: any, i: number) => (
              <div key={i} className="flex items-center justify-between p-4 rounded-xl border border-gray-100 bg-gray-50 hover:bg-gray-100 transition">
                <div>
                  <p className="font-medium text-gray-900">{inv.Contact?.Name ?? "Unknown"}</p>
                  <p className="text-sm text-gray-500">{inv.InvoiceNumber} · Due {inv.DueDateString ?? inv.DueDate?.split("T")[0]}</p>
                </div>
                <div className="text-right">
                  <p className="font-bold text-gray-900">{fmt(inv.AmountDue ?? 0)}</p>
                  <span className={`text-xs font-medium px-2.5 py-0.5 rounded-full ${
                    inv.Status === "PAID" ? "bg-green-100 text-green-800" :
                    inv.IsOverdue ? "bg-red-100 text-red-800" :
                    "bg-yellow-100 text-yellow-800"
                  }`}>
                    {inv.IsOverdue ? "Overdue" : inv.Status === "PAID" ? "Paid" : "Pending"}
                  </span>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

function Card({ title, value, icon }: { title: string; value: string | null; icon: React.ReactNode }) {
  return (
    <div className="bg-white p-6 rounded-2xl border border-gray-200 shadow-sm">
      <div className="flex justify-between items-start mb-2">
        <p className="text-sm font-medium text-gray-500">{title}</p>
        <div className="p-3 bg-gray-50 rounded-xl">{icon}</div>
      </div>
      <h3 className="text-3xl font-bold text-gray-900">{value ?? <span className="text-gray-300">—</span>}</h3>
    </div>
  );
}
