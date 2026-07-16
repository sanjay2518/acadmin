"use client";

import React, { useState, useEffect } from "react";
import { FileText, Link2, Download, CheckCircle2, Loader2 } from "lucide-react";

const API = "https://acadmin-seven.vercel.app";

const REPORTS = [
  { key: "profit-and-loss",  title: "Profit & Loss",     description: "Detailed breakdown of your revenue and expenses." },
  { key: "balance-sheet",    title: "Balance Sheet",      description: "Snapshot of your assets, liabilities, and equity." },
  { key: "aged-receivables", title: "Aged Receivables",   description: "Summary of outstanding invoices owed to you." },
  { key: "aged-payables",    title: "Aged Payables",      description: "Summary of bills and expenses you owe." },
];

export default function ReportsPage() {
  const [connected, setConnected]   = useState(false);
  const [checking, setChecking]     = useState(true);
  const [downloading, setDownloading] = useState<string | null>(null);

  useEffect(() => {
    // Check if we just returned from Xero OAuth
    const params = new URLSearchParams(window.location.search);
    if (params.get("connected") === "true") {
      setConnected(true);
      setChecking(false);
      window.history.replaceState({}, "", "/dashboard/reports");
      return;
    }
    fetch(`${API}/api/auth/xero/status`)
      .then((r) => r.json())
      .then((d) => setConnected(d.connected))
      .finally(() => setChecking(false));
  }, []);

  const handleDownload = async (reportKey: string, format: "pdf" | "excel") => {
    const id = `${reportKey}-${format}`;
    setDownloading(id);
    try {
      const resp = await fetch(`${API}/api/reports/${reportKey}/export/${format}`);
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
      <header className="mb-8">
        <h2 className="text-3xl font-bold text-gray-900">Financial Reports</h2>
        <p className="text-gray-500 mt-1">Generate and download detailed financial reports from Xero.</p>
      </header>

      {!connected ? (
        <div className="bg-white border border-gray-200 rounded-2xl p-12 text-center shadow-sm max-w-2xl mx-auto mt-16">
          <div className="w-20 h-20 bg-blue-50 rounded-full flex items-center justify-center mx-auto mb-6">
            <Link2 className="w-10 h-10 text-blue-600" />
          </div>
          <h3 className="text-2xl font-bold text-gray-900 mb-3">Connect your accounting software</h3>
          <p className="text-gray-600 mb-8 max-w-md mx-auto">
            Securely connect your Xero account to view and download reports. We only request read-only access.
          </p>
          <a
            href={`${API}/api/auth/xero/login`}
            className="inline-block bg-[#13b5ea] hover:bg-[#10a1d1] text-white px-8 py-3 rounded-lg font-semibold transition shadow-sm text-lg"
          >
            Connect Xero
          </a>
          <p className="text-xs text-gray-400 mt-6">Secure connection via OAuth 2.0. We never store your Xero password.</p>
        </div>
      ) : (
        <div className="space-y-6">
          <div className="bg-green-50 border border-green-200 rounded-xl p-4 flex items-center">
            <CheckCircle2 className="w-5 h-5 text-green-600 mr-3 flex-shrink-0" />
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
        </div>
      )}
    </div>
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
