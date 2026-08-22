"use client";

import React, { useState, useEffect } from "react";
import { FileText, Link2, Download, CheckCircle2, Loader2, RefreshCw, ChevronDown } from "lucide-react";
import styles from "./reports.module.css";

const API = process.env.NEXT_PUBLIC_API_URL || "https://acadmin-seven.vercel.app";

const REPORTS = [
  { key: "profit-and-loss",  title: "Profit & Loss",     description: "Detailed breakdown of your revenue and expenses." },
  { key: "balance-sheet",    title: "Balance Sheet",      description: "Snapshot of your assets, liabilities, and equity." },
  { key: "aged-receivables", title: "Aged Receivables",   description: "Summary of outstanding invoices owed to you." },
  { key: "aged-payables",    title: "Aged Payables",      description: "Summary of bills and expenses you owe." },
];

interface Client {
  id: string;
  name: string;
  xero_connected?: boolean;
}

function rowsFromReport(report: any): string[][] {
  const rows: string[][] = [];
  for (const section of report?.Reports?.[0]?.Rows ?? []) {
    for (const row of section?.Rows ?? [section]) {
      if (row?.Cells?.length) rows.push(row.Cells.map((cell: any) => cell.Value ?? ""));
    }
  }
  return rows;
}

export default function ReportsPage() {
  const [connected, setConnected]   = useState(false);
  const [checking, setChecking]     = useState(true);
  const [downloading, setDownloading] = useState<string | null>(null);
  const [clients, setClients] = useState<Client[]>([]);
  const [clientId, setClientId] = useState("");
  const [reports, setReports] = useState<Record<string, any>>({});
  const [invoices, setInvoices] = useState<any[]>([]);

  const authHeaders = (): Record<string, string> => {
    try {
      const token = JSON.parse(localStorage.getItem("admin_user") || "").token;
      return { Authorization: `Bearer ${token}` };
    } catch { return {}; }
  };

  const loadData = (selectedClientId: string) => {
    if (!selectedClientId) { setConnected(false); setChecking(false); return; }
    setChecking(true);
    const query = `?client_id=${encodeURIComponent(selectedClientId)}`;
    const year = new Date().getFullYear();
    const today = new Date().toISOString().slice(0, 10);
    Promise.allSettled([
      fetch(`${API}/api/reports/profit-and-loss?from_date=${year}-01-01&to_date=${today}&client_id=${encodeURIComponent(selectedClientId)}`, { headers: authHeaders() }).then(r => r.json()),
      fetch(`${API}/api/reports/balance-sheet?report_date=${today}&client_id=${encodeURIComponent(selectedClientId)}`, { headers: authHeaders() }).then(r => r.json()),
      fetch(`${API}/api/reports/aged-receivables${query}`, { headers: authHeaders() }).then(r => r.json()),
      fetch(`${API}/api/reports/aged-payables${query}`, { headers: authHeaders() }).then(r => r.json()),
      fetch(`${API}/api/portal/invoices${query}`, { headers: authHeaders() }).then(r => r.json()),
    ]).then(([profit, balance, receivables, payables, invoiceData]) => {
      const nextReports: Record<string, any> = {};
      ["profit-and-loss", "balance-sheet", "aged-receivables", "aged-payables"].forEach((key, index) => {
        const result = [profit, balance, receivables, payables][index];
        if (result.status === "fulfilled" && !result.value?.detail) nextReports[key] = result.value;
      });
      setReports(nextReports);
      setInvoices(invoiceData.status === "fulfilled" && Array.isArray(invoiceData.value?.invoices) ? invoiceData.value.invoices : []);
      setConnected(Object.keys(nextReports).length > 0);
    }).finally(() => setChecking(false));
  };

  useEffect(() => {
    fetch(`${API}/api/admin/clients`, { headers: authHeaders() })
      .then((r) => r.json())
      .then((d) => {
        const available = Array.isArray(d) ? d.filter((client: Client) => client.xero_connected) : [];
        setClients(available);
        const first = available[0];
        if (first) { setClientId(first.id); loadData(first.id); }
        else setChecking(false);
      })
      .catch(() => setChecking(false));
  }, []);

  const handleDownload = async (reportKey: string, format: "pdf" | "excel") => {
    const id = `${reportKey}-${format}`;
    setDownloading(id);
    const token = (() => { try { return JSON.parse(localStorage.getItem('admin_user') || '').token; } catch { return null; } })();
    try {
      const query = clientId ? `?client_id=${encodeURIComponent(clientId)}` : "";
      const resp = await fetch(`${API}/api/reports/${reportKey}/export/${format}${query}`, {
        headers: token ? { Authorization: `Bearer ${token}` } : {},
      });
      if (!resp.ok) throw new Error("Export failed");
      const blob = await resp.blob();
      const url  = URL.createObjectURL(blob);
      const a    = document.createElement("a");
      a.href     = url;
      a.download = `${reportKey}.${format === "excel" ? "xlsx" : "pdf"}`;
      a.click();
      URL.revokeObjectURL(url);
    } catch {
      alert("Failed to download report. Please try again.");
    } finally {
      setDownloading(null);
    }
  };

  if (checking) {
    return (
      <div className="p-8 flex items-center justify-center h-64">
        <Loader2 className="w-8 h-8 animate-spin text-blue-600" />
      </div>
    );
  }

  return (
    <div className="p-8">
      <header className="flex flex-col gap-5 sm:flex-row sm:justify-between sm:items-start mb-8">
        <div>
        <h2 className="text-3xl font-bold text-gray-900">Financial Reports</h2>
        <p className="text-gray-500 mt-1">Generate and download detailed financial reports from Xero.</p>
        </div>
        <div className="flex items-end gap-3">
          <label className={styles.selector}>
            <span className={styles.selectorLabel}>View client</span>
            <select value={clientId} onChange={e => { setClientId(e.target.value); loadData(e.target.value); }} className={styles.select}>
              <option value="">Select client</option>
              {clients.map(client => <option key={client.id} value={client.id}>{client.name}</option>)}
            </select>
            <ChevronDown className={styles.chevron} size={17} strokeWidth={2.5} />
          </label>
          <button onClick={() => loadData(clientId)} className="flex items-center gap-2 bg-white border border-gray-300 text-gray-700 px-4 py-2 rounded-lg font-medium hover:bg-gray-50 transition shadow-sm">
            <RefreshCw className="w-4 h-4" /> Refresh
          </button>
        </div>
      </header>

      {!connected ? (
        <div className="bg-white border border-gray-200 rounded-2xl p-12 text-center shadow-sm max-w-2xl mx-auto mt-16">
          <div className="w-20 h-20 bg-blue-50 rounded-full flex items-center justify-center mx-auto mb-6">
            <Link2 className="w-10 h-10 text-blue-600" />
          </div>
          <h3 className="text-2xl font-bold text-gray-900 mb-3">No Xero connection yet</h3>
          <p className="text-gray-600 mb-8 max-w-md mx-auto">
            Go to the Clients page, create a client, then click "Connect Xero" next to their name.
          </p>
          <a
            href="/dashboard/clients"
            className="inline-block bg-blue-600 hover:bg-blue-700 text-white px-8 py-3 rounded-lg font-semibold transition shadow-sm text-lg"
          >
            Go to Clients
          </a>
        </div>
      ) : (
        <div className="space-y-6">
          <div className="bg-green-50 border border-green-200 rounded-xl p-4 flex items-center">
            <CheckCircle2 className="w-5 h-5 text-green-600 mr-3 shrink-0" />
            <span className="text-green-800 font-medium">Connected to Xero. Data is live.</span>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {REPORTS.map((r) => (
              <ReportCard
                key={r.key}
                title={r.title}
                description={r.description}
                downloading={downloading}
                onDownload={(fmt) => handleDownload(r.key, fmt)}
                reportKey={r.key}
              />
            ))}
          </div>

          <ReportTable title="Profit & Loss" report={reports["profit-and-loss"]} />
          <ReportTable title="Balance Sheet" report={reports["balance-sheet"]} />
          <ReportTable title="Aged Receivables" report={reports["aged-receivables"]} />
          <ReportTable title="Aged Payables" report={reports["aged-payables"]} />

          <InvoiceTable title="Sales / Receivable Invoices" invoices={invoices.filter(invoice => invoice.Type === "ACCREC")} />
          <InvoiceTable title="Purchase / Payable Bills" invoices={invoices.filter(invoice => invoice.Type === "ACCPAY")} />
        </div>
      )}
    </div>
  );
}

function ReportTable({ title, report }: { title: string; report: any }) {
  const rows = rowsFromReport(report);
  return (
    <section className={`${styles.reportPanel} bg-white border border-gray-200 rounded-xl shadow-sm overflow-hidden`}>
      <div className="p-5 border-b border-gray-200"><h3 className="text-lg font-semibold text-gray-900">{title}</h3></div>
      {rows.length === 0 ? <p className="p-6 text-gray-400">No data available</p> : (
        <div className="overflow-x-auto"><table className="w-full text-sm"><tbody>
          {rows.map((row, index) => <tr key={index} className="border-b border-gray-100 last:border-0">{row.map((cell, cellIndex) => <td key={cellIndex} className={`px-5 py-3 ${cellIndex === 0 ? "font-medium text-gray-800" : "text-right text-gray-600"}`}>{cell || "-"}</td>)}</tr>)}
        </tbody></table></div>
      )}
    </section>
  );
}

function InvoiceTable({ title, invoices }: { title: string; invoices: any[] }) {
  return (
    <section className={`${styles.reportPanel} bg-white border border-gray-200 rounded-xl shadow-sm overflow-hidden`}>
      <div className="p-5 border-b border-gray-200"><h3 className="text-lg font-semibold text-gray-900">{title}</h3></div>
      {invoices.length === 0 ? <p className="p-6 text-gray-400">No invoices available</p> : (
        <div className="overflow-x-auto"><table className="w-full text-sm"><thead className="bg-gray-50"><tr><th className="text-left px-5 py-3">Contact</th><th className="text-left px-5 py-3">Invoice</th><th className="text-left px-5 py-3">Status</th><th className="text-right px-5 py-3">Amount Due</th></tr></thead><tbody>
          {invoices.map(invoice => <tr key={invoice.InvoiceID} className="border-b border-gray-100"><td className="px-5 py-3">{invoice.Contact?.Name || "-"}</td><td className="px-5 py-3">{invoice.InvoiceNumber || "-"}</td><td className="px-5 py-3">{invoice.Status || "-"}</td><td className="px-5 py-3 text-right">{Number(invoice.AmountDue || 0).toLocaleString("en-IN", { style: "currency", currency: "INR" })}</td></tr>)}
        </tbody></table></div>
      )}
    </section>
  );
}

function ReportCard({
  title, description, reportKey, downloading, onDownload,
}: {
  title: string;
  description: string;
  reportKey: string;
  downloading: string | null;
  onDownload: (fmt: "pdf" | "excel") => void;
}) {
  const pdfLoading   = downloading === `${reportKey}-pdf`;
  const xlsxLoading  = downloading === `${reportKey}-excel`;

  return (
    <div className="bg-white border border-gray-200 rounded-xl p-6 hover:shadow-md transition">
      <div className="flex items-start mb-4">
        <div className="p-3 bg-blue-50 rounded-lg mr-4">
          <FileText className="w-6 h-6 text-blue-600" />
        </div>
        <div>
          <h4 className="text-xl font-bold text-gray-900">{title}</h4>
          <p className="text-gray-500 text-sm mt-1">{description}</p>
        </div>
      </div>
      <div className="flex gap-3 mt-4 pt-4 border-t border-gray-100">
        <button
          onClick={() => onDownload("pdf")}
          disabled={!!downloading}
          className="flex items-center gap-2 text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 disabled:opacity-50 px-4 py-2 rounded-lg transition"
        >
          {pdfLoading ? <Loader2 className="w-4 h-4 animate-spin" /> : <Download className="w-4 h-4" />}
          PDF
        </button>
        <button
          onClick={() => onDownload("excel")}
          disabled={!!downloading}
          className="flex items-center gap-2 text-sm font-medium text-gray-700 bg-gray-100 hover:bg-gray-200 disabled:opacity-50 px-4 py-2 rounded-lg transition"
        >
          {xlsxLoading ? <Loader2 className="w-4 h-4 animate-spin" /> : <Download className="w-4 h-4" />}
          Excel
        </button>
      </div>
    </div>
  );
}
