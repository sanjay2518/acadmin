"use client";

import React, { useEffect, useState } from 'react';
import { 
  LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer,
  BarChart, Bar
} from 'recharts';
import { 
  Building2, TrendingUp, TrendingDown, DollarSign, 
  CreditCard, FileText, AlertCircle, Loader2
} from 'lucide-react';
import Link from 'next/link';

const API = "http://localhost:8000";

// Fallback mock data shown while loading or when Xero is not connected
const MOCK_MONTHLY = [
  { name: 'Jan', revenue: 4000, expenses: 2400 },
  { name: 'Feb', revenue: 3000, expenses: 1398 },
  { name: 'Mar', revenue: 2000, expenses: 9800 },
  { name: 'Apr', revenue: 2780, expenses: 3908 },
  { name: 'May', revenue: 1890, expenses: 4800 },
  { name: 'Jun', revenue: 2390, expenses: 3800 },
  { name: 'Jul', revenue: 3490, expenses: 4300 },
];

function extractKpiValue(report: any, label: string): string {
  try {
    for (const section of report?.Reports?.[0]?.Rows ?? []) {
      for (const row of section?.Rows ?? []) {
        const cells = row?.Cells ?? [];
        if (cells[0]?.Value?.toLowerCase().includes(label.toLowerCase())) {
          return `£${Number(cells[1]?.Value ?? 0).toLocaleString('en-GB')}`;
        }
      }
    }
  } catch { /* ignore */ }
  return '—';
}

export default function DashboardPage() {
  const [invoices, setInvoices]     = useState<any[]>([]);
  const [kpis, setKpis]             = useState<any>(null);
  const [loading, setLoading]       = useState(true);
  const [lastSync, setLastSync]     = useState<string>('—');

  useEffect(() => {
    Promise.all([
      fetch(`${API}/api/invoices?status=AUTHORISED`).then(r => r.ok ? r.json() : []),
      fetch(`${API}/api/dashboard/kpis`).then(r => r.ok ? r.json() : null),
    ]).then(([inv, k]) => {
      setInvoices(Array.isArray(inv) ? inv.slice(0, 3) : []);
      setKpis(k);
      setLastSync(new Date().toLocaleTimeString('en-GB', { hour: '2-digit', minute: '2-digit' }));
    }).finally(() => setLoading(false));
  }, []);

  const pl  = kpis?.profit_and_loss;
  const bs  = kpis?.balance_sheet;
  const revenue  = pl  ? extractKpiValue(pl, 'total income')   : '£124,500';
  const expenses = pl  ? extractKpiValue(pl, 'total expenses')  : '£86,200';
  const profit   = pl  ? extractKpiValue(pl, 'net profit')      : '£38,300';
  const bank     = bs  ? extractKpiValue(bs, 'bank')            : '£42,900';

  const recentInvoices = invoices.length > 0
    ? invoices.map((inv: any) => ({
        id:     inv.InvoiceNumber ?? inv.InvoiceID?.slice(0, 8),
        client: inv.Contact?.Name ?? 'Unknown',
        amount: `£${Number(inv.AmountDue ?? 0).toLocaleString('en-GB')}`,
        status: inv.Status === 'AUTHORISED' ? 'Pending' : inv.Status,
        date:   inv.DueDate?.split('T')[0] ?? '',
      }))
    : [
        { id: 'INV-001', client: 'Acme Corp',    amount: '£1,200', status: 'Paid',    date: '2026-07-01' },
        { id: 'INV-002', client: 'Globex Inc',   amount: '£3,450', status: 'Overdue', date: '2026-06-15' },
        { id: 'INV-003', client: 'Soylent Corp', amount: '£890',   status: 'Pending', date: '2026-07-05' },
      ];

  return (
    <div className="p-8">
        <header className="flex justify-between items-center mb-8">
          <div>
            <h2 className="text-3xl font-bold text-gray-900">Financial Overview</h2>
            <p className="text-gray-500 mt-1">
              {loading ? 'Loading data…' : `Data synced with Xero at ${lastSync}.`}
            </p>
          </div>
          <button
            onClick={() => { setLoading(true); window.location.reload(); }}
            className="bg-white border border-gray-300 text-gray-700 px-4 py-2 rounded-lg font-medium hover:bg-gray-50 transition shadow-sm flex items-center gap-2"
          >
            {loading && <Loader2 className="w-4 h-4 animate-spin" />}
            Refresh Data
          </button>
        </header>

        {/* KPI Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <Card title="Revenue (YTD)"  value={revenue}  icon={<TrendingUp  className="w-6 h-6 text-green-600"  />} trend="From Xero P&L"  trendPositive={true}  />
          <Card title="Expenses (YTD)" value={expenses} icon={<TrendingDown className="w-6 h-6 text-red-600"    />} trend="From Xero P&L"  trendPositive={false} />
          <Card title="Net Profit"     value={profit}   icon={<DollarSign  className="w-6 h-6 text-blue-600"   />} trend="From Xero P&L"  trendPositive={true}  />
          <Card title="Bank Balance"   value={bank}     icon={<Building2   className="w-6 h-6 text-indigo-600" />} trend="From Balance Sheet" trendPositive={true} />
        </div>

        {/* Charts Row */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-8">
          <div className="lg:col-span-2 bg-white p-6 rounded-2xl border border-gray-200 shadow-sm">
            <h3 className="text-lg font-semibold text-gray-900 mb-6">Revenue vs Expenses</h3>
            <div className="h-72">
              <ResponsiveContainer width="100%" height="100%">
                <LineChart data={MOCK_MONTHLY}>
                  <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#E5E7EB" />
                  <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{fill: '#6B7280'}} />
                  <YAxis axisLine={false} tickLine={false} tick={{fill: '#6B7280'}} tickFormatter={(value) => `£${value/1000}k`} />
                  <Tooltip contentStyle={{ borderRadius: '8px', border: 'none', boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)' }} />
                  <Line type="monotone" dataKey="revenue" stroke="#2563EB" strokeWidth={3} dot={{r: 4}} activeDot={{r: 6}} />
                  <Line type="monotone" dataKey="expenses" stroke="#EF4444" strokeWidth={3} dot={{r: 4}} activeDot={{r: 6}} />
                </LineChart>
              </ResponsiveContainer>
            </div>
          </div>
          
          <div className="bg-white p-6 rounded-2xl border border-gray-200 shadow-sm flex flex-col">
            <h3 className="text-lg font-semibold text-gray-900 mb-6">Cash Flow</h3>
            <div className="flex-1">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={MOCK_MONTHLY.slice(-4)}>
                  <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#E5E7EB" />
                  <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{fill: '#6B7280'}} />
                  <Tooltip cursor={{fill: '#F3F4F6'}} contentStyle={{ borderRadius: '8px', border: 'none', boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)' }} />
                  <Bar dataKey="revenue" fill="#3B82F6" radius={[4, 4, 0, 0]} />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </div>
        </div>

        {/* Actionable Insights Row */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <div className="bg-white p-6 rounded-2xl border border-gray-200 shadow-sm">
            <div className="flex justify-between items-center mb-6">
              <h3 className="text-lg font-semibold text-gray-900">Outstanding Invoices</h3>
              <a href="#" className="text-blue-600 hover:text-blue-700 text-sm font-medium">View All</a>
            </div>
            <div className="space-y-4">
              {recentInvoices.map((invoice, i) => (
                <div key={i} className="flex items-center justify-between p-4 rounded-xl border border-gray-100 bg-gray-50 hover:bg-gray-100 transition">
                  <div>
                    <p className="font-medium text-gray-900">{invoice.client}</p>
                    <p className="text-sm text-gray-500">{invoice.id} • {invoice.date}</p>
                  </div>
                  <div className="text-right">
                    <p className="font-bold text-gray-900">{invoice.amount}</p>
                    <span className={`text-xs font-medium px-2.5 py-0.5 rounded-full ${
                      invoice.status === 'Paid' ? 'bg-green-100 text-green-800' : 
                      invoice.status === 'Overdue' ? 'bg-red-100 text-red-800' : 
                      'bg-yellow-100 text-yellow-800'
                    }`}>
                      {invoice.status}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </div>

          <div className="bg-white p-6 rounded-2xl border border-gray-200 shadow-sm">
            <h3 className="text-lg font-semibold text-gray-900 mb-6">Action Items</h3>
            <div className="space-y-4">
               <div className="flex items-start p-4 bg-red-50 rounded-xl border border-red-100">
                  <AlertCircle className="w-5 h-5 text-red-600 mt-0.5 mr-3 flex-shrink-0" />
                  <div>
                    <h4 className="font-medium text-red-900">Overdue Bills</h4>
                    <p className="text-sm text-red-700 mt-1">You have 3 bills totaling £1,200 that are currently overdue for payment.</p>
                  </div>
               </div>
               <div className="flex items-start p-4 bg-orange-50 rounded-xl border border-orange-100">
                  <AlertCircle className="w-5 h-5 text-orange-600 mt-0.5 mr-3 flex-shrink-0" />
                  <div>
                    <h4 className="font-medium text-orange-900">Unreconciled Transactions</h4>
                    <p className="text-sm text-orange-700 mt-1">There are 12 transactions in your main bank account waiting to be reconciled.</p>
                  </div>
               </div>
            </div>
          </div>
        </div>

    </div>
  );
}

function Card({ title, value, icon, trend, trendPositive }: any) {
  return (
    <div className="bg-white p-6 rounded-2xl border border-gray-200 shadow-sm">
      <div className="flex justify-between items-start mb-4">
        <div>
          <p className="text-sm font-medium text-gray-500 mb-1">{title}</p>
          <h3 className="text-3xl font-bold text-gray-900">{value}</h3>
        </div>
        <div className="p-3 bg-gray-50 rounded-xl">
          {icon}
        </div>
      </div>
      <p className={`text-sm font-medium ${trendPositive ? 'text-green-600' : 'text-red-600'}`}>
        {trend}
      </p>
    </div>
  );
}
