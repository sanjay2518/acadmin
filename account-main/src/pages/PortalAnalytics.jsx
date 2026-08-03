import { useEffect, useState, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import {
    ArrowLeft, Loader2, RefreshCw, AlertCircle, TrendingUp, TrendingDown,
    Users, Receipt, BarChart2, Wallet, Target
} from 'lucide-react';
import {
    BarChart, Bar, LineChart, Line, PieChart, Pie, Cell,
    XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer
} from 'recharts';
import './PortalAnalytics.css';

const API = 'https://acadmin-seven.vercel.app'; // --- IGNORE ---
const COLORS = ['#2563eb', '#16a34a', '#dc2626', '#d97706', '#7c3aed', '#0891b2', '#be185d', '#65a30d'];
const fmt = (n) => `£${Number(n || 0).toLocaleString('en-GB', { minimumFractionDigits: 0, maximumFractionDigits: 0 })}`;

// ── Shared components ─────────────────────────────────────────────────────────

function ChartCard({ title, subtitle, icon, children }) {
    return (
        <div className="pa-card">
            <div className="pa-card-header">
                <div className="pa-card-icon">{icon}</div>
                <div>
                    <h3 className="pa-card-title">{title}</h3>
                    {subtitle && <p className="pa-card-sub">{subtitle}</p>}
                </div>
            </div>
            {children}
        </div>
    );
}

function Loading() {
    return <div className="pa-loading"><Loader2 size={26} className="pa-spin" /></div>;
}

function Empty({ msg = 'No data available' }) {
    return (
        <div className="pa-empty">
            <AlertCircle size={28} />
            <p>{msg}</p>
        </div>
    );
}

const Tip = ({ active, payload, label }) => {
    if (!active || !payload?.length) return null;
    return (
        <div className="pa-tooltip">
            <p className="pa-tooltip-label">{label}</p>
            {payload.map((p, i) => (
                <p key={i} style={{ color: p.color }}>{p.name}: {fmt(p.value)}</p>
            ))}
        </div>
    );
};

// ── Aged table (receivables + payables) ───────────────────────────────────────

function AgedTable({ data }) {
    if (!data.length) return <Empty />;
    return (
        <div className="pa-table-wrap">
            <table className="pa-table">
                <thead>
                    <tr>
                        {['Contact', 'Current', '1–30 days', '31–60 days', '60+ days', 'Total'].map(h => (
                            <th key={h}>{h}</th>
                        ))}
                    </tr>
                </thead>
                <tbody>
                    {data.map((row, i) => (
                        <tr key={i}>
                            <td className="pa-td-name">{row.contact}</td>
                            <td className="pa-td-green">{fmt(row.current)}</td>
                            <td className="pa-td-yellow">{fmt(row['1-30'])}</td>
                            <td className="pa-td-orange">{fmt(row['31-60'])}</td>
                            <td className="pa-td-red">{fmt(row['60+'])}</td>
                            <td className="pa-td-bold">{fmt(row.total)}</td>
                        </tr>
                    ))}
                </tbody>
            </table>
        </div>
    );
}

// ── Main ──────────────────────────────────────────────────────────────────────

export default function PortalAnalytics() {
    const navigate = useNavigate();
    const [user, setUser]         = useState(null);
    const [syncing, setSyncing]   = useState(false);
    const [lastSync, setLastSync] = useState(null);

    const [agedRec,  setAgedRec]  = useState([]);
    const [agedPay,  setAgedPay]  = useState([]);
    const [cashflow, setCashflow] = useState([]);
    const [vat,      setVat]      = useState([]);
    const [top,      setTop]      = useState({ top_customers: [], top_expenses: [] });
    const [budget,   setBudget]   = useState(null);

    const [loading, setLoading]   = useState({
        agedRec: true, agedPay: true, cashflow: true, vat: true, top: true, budget: true
    });

    const setL = (key, val) => setLoading(prev => ({ ...prev, [key]: val }));

    useEffect(() => {
        const stored = localStorage.getItem('portal_user');
        if (!stored) { navigate('/'); return; }
        setUser(JSON.parse(stored));
    }, [navigate]);

    const fetchAll = useCallback(async (contactId) => {
        const query = contactId ? `?contact_id=${encodeURIComponent(contactId)}` : '';
        const calls = [
            [`${API}/api/analytics/aged-receivables${query}`, setAgedRec,  'agedRec'],
            [`${API}/api/analytics/aged-payables${query}`,    setAgedPay,  'agedPay'],
            [`${API}/api/analytics/cashflow${query}`,         setCashflow, 'cashflow'],
            [`${API}/api/analytics/vat${query}`,              setVat,      'vat'],
            [`${API}/api/analytics/top${query}`,              setTop,      'top'],
            [`${API}/api/analytics/budget${query}`,          setBudget,   'budget'],
        ];
        await Promise.allSettled(
            calls.map(([url, setter, key]) =>
                fetch(url)
                    .then(r => { if (!r.ok) throw new Error(); return r.json(); })
                    .then(d => { setter(key === 'top' || key === 'budget' ? d : (d.data ?? d)); setL(key, false); })
                    .catch(() => setL(key, false))
            )
        );
        setLastSync(new Date().toLocaleTimeString('en-GB', { hour: '2-digit', minute: '2-digit' }));
    }, []);

    useEffect(() => {
        if (user?.xero_contact_id) {
            fetchAll(user.xero_contact_id);
        }
    }, [fetchAll, user]);

    const handleSync = async () => {
        setSyncing(true);
        const query = user?.xero_contact_id ? `?contact_id=${encodeURIComponent(user.xero_contact_id)}` : '';
        try { await fetch(`${API}/api/analytics/sync${query}`, { method: 'POST' }); } catch {}
        Object.keys(loading).forEach(k => setL(k, true));
        await fetchAll(user?.xero_contact_id);
        setSyncing(false);
    };

    if (!user) return null;

    const latestVat = vat[vat.length - 1];

    // Parse budget actual rows for chart
    const budgetRows = [];
    if (budget?.actual) {
        (budget.actual?.Reports?.[0]?.Rows ?? []).forEach(section => {
            (section.Rows ?? []).forEach(row => {
                const cells = row.Cells ?? [];
                if (cells.length >= 2 && cells[1]?.Value && cells[0]?.Value) {
                    const val = parseFloat(cells[1].Value || '0');
                    if (val !== 0) budgetRows.push({ label: cells[0].Value, actual: val });
                }
            });
        });
    }

    return (
        <div className="pa-page">
            {/* Hero */}
            <div className="pa-hero">
                <div className="pa-hero-inner">
                    <button className="pa-back-btn" onClick={() => navigate('/portal')}>
                        <ArrowLeft size={16} /> Back to portal
                    </button>
                    <div className="pa-avatar">{user.name?.charAt(0).toUpperCase()}</div>
                    <div>
                        <h1 className="pa-welcome">Analytics — {user.name}</h1>
                        <p className="pa-sub">
                            Financial insights from your Xero account
                            {lastSync && <> · Last synced {lastSync}</>}
                        </p>
                    </div>
                    <button className="pa-sync-btn" onClick={handleSync} disabled={syncing}>
                        {syncing ? <Loader2 size={15} className="pa-spin" /> : <RefreshCw size={15} />}
                        {syncing ? 'Syncing…' : 'Sync'}
                    </button>
                </div>
            </div>

            <div className="pa-container">

                {/* ── 1. Aged Receivables ──────────────────────────────────── */}
                <ChartCard title="Aged Receivables" subtitle="Money customers owe you, by overdue period" icon={<Receipt size={16} />}>
                    {loading.agedRec ? <Loading /> : <AgedTable data={agedRec} />}
                </ChartCard>

                {/* ── 2. Aged Payables ─────────────────────────────────────── */}
                <ChartCard title="Aged Payables" subtitle="Money you owe to suppliers, by overdue period" icon={<Wallet size={16} />}>
                    {loading.agedPay ? <Loading /> : <AgedTable data={agedPay} />}
                </ChartCard>

                {/* ── 3. Cash Flow Trend ───────────────────────────────────── */}
                <ChartCard title="Cash Flow Trend" subtitle="Monthly inflow vs outflow — last 12 months" icon={<TrendingUp size={16} />}>
                    {loading.cashflow ? <Loading /> : cashflow.length === 0 ? <Empty /> : (
                        <div className="pa-chart-h">
                            <ResponsiveContainer width="100%" height="100%">
                                <BarChart data={cashflow} barGap={3}>
                                    <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
                                    <XAxis dataKey="month" axisLine={false} tickLine={false} tick={{ fill: '#94a3b8', fontSize: 11 }} />
                                    <YAxis axisLine={false} tickLine={false} tick={{ fill: '#94a3b8', fontSize: 11 }} tickFormatter={v => `£${(v / 1000).toFixed(0)}k`} />
                                    <Tooltip content={<Tip />} />
                                    <Legend wrapperStyle={{ fontSize: '12px', paddingTop: '10px' }} />
                                    <Bar dataKey="inflow"  name="Inflow"  fill="#16a34a" radius={[4, 4, 0, 0]} animationDuration={900} animationEasing="ease" />
                                    <Bar dataKey="outflow" name="Outflow" fill="#dc2626" radius={[4, 4, 0, 0]} animationDuration={900} animationEasing="ease" />
                                    <Line type="monotone" dataKey="net" name="Net" stroke="#2563eb" strokeWidth={2.5} dot={{ r: 3 }} animationDuration={900} animationEasing="ease" />
                                </BarChart>
                            </ResponsiveContainer>
                        </div>
                    )}
                </ChartCard>

                {/* ── 4. VAT Summary ───────────────────────────────────────── */}
                <ChartCard title="VAT Summary" subtitle="VAT collected vs paid — last 4 quarters" icon={<BarChart2 size={16} />}>
                    {loading.vat ? <Loading /> : vat.length === 0 ? <Empty /> : (
                        <div className="pa-vat-wrap">
                            {latestVat && (
                                <div className="pa-vat-kpis">
                                    {[
                                        { label: 'VAT Collected', val: latestVat.vat_collected, cls: 'green' },
                                        { label: 'VAT Paid',      val: latestVat.vat_paid,      cls: 'red'   },
                                        { label: 'Net VAT',       val: latestVat.net_vat,       cls: latestVat.net_vat >= 0 ? 'blue' : 'orange' },
                                    ].map(k => (
                                        <div key={k.label} className="pa-vat-kpi">
                                            <p className={`pa-vat-val pa-vat-${k.cls}`}>{fmt(k.val)}</p>
                                            <p className="pa-vat-lbl">{k.label} ({latestVat.period})</p>
                                        </div>
                                    ))}
                                </div>
                            )}
                            <div className="pa-chart-h">
                                <ResponsiveContainer width="100%" height="100%">
                                    <BarChart data={vat} barGap={4}>
                                        <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
                                        <XAxis dataKey="period" axisLine={false} tickLine={false} tick={{ fill: '#94a3b8', fontSize: 11 }} />
                                        <YAxis axisLine={false} tickLine={false} tick={{ fill: '#94a3b8', fontSize: 11 }} tickFormatter={v => `£${(v / 1000).toFixed(0)}k`} />
                                        <Tooltip content={<Tip />} />
                                        <Legend wrapperStyle={{ fontSize: '12px', paddingTop: '8px' }} />
                                        <Bar dataKey="vat_collected" name="VAT Collected" fill="#16a34a" radius={[4, 4, 0, 0]} animationDuration={900} animationEasing="ease" />
                                        <Bar dataKey="vat_paid"      name="VAT Paid"      fill="#dc2626" radius={[4, 4, 0, 0]} animationDuration={900} animationEasing="ease" />
                                        <Bar dataKey="net_vat"       name="Net VAT"       fill="#2563eb" radius={[4, 4, 0, 0]} animationDuration={900} animationEasing="ease" />
                                    </BarChart>
                                </ResponsiveContainer>
                            </div>
                        </div>
                    )}
                </ChartCard>

                {/* ── 5. Top Customers & Top Expenses ─────────────────────── */}
                <div className="pa-two-col">
                    <ChartCard title="Top Customers" subtitle="Revenue by customer (YTD)" icon={<Users size={16} />}>
                        {loading.top ? <Loading /> : !top.top_customers?.length ? <Empty /> : (
                            <div className="pa-chart-h">
                                <ResponsiveContainer width="100%" height="100%">
                                    <BarChart data={top.top_customers} layout="vertical" margin={{ left: 4 }}>
                                        <CartesianGrid strokeDasharray="3 3" horizontal={false} stroke="#f1f5f9" />
                                        <XAxis type="number" axisLine={false} tickLine={false} tick={{ fill: '#94a3b8', fontSize: 10 }} tickFormatter={v => `£${(v / 1000).toFixed(0)}k`} />
                                        <YAxis type="category" dataKey="name" axisLine={false} tickLine={false} tick={{ fill: '#374151', fontSize: 11 }} width={100} />
                                        <Tooltip content={<Tip />} />
                                        <Bar dataKey="value" name="Revenue" radius={[0, 4, 4, 0]} animationDuration={900} animationEasing="ease">
                                            {top.top_customers.map((_, i) => <Cell key={i} fill={COLORS[i % COLORS.length]} />)}
                                        </Bar>
                                    </BarChart>
                                </ResponsiveContainer>
                            </div>
                        )}
                    </ChartCard>

                    <ChartCard title="Top Expense Categories" subtitle="Spend breakdown (YTD)" icon={<TrendingDown size={16} />}>
                        {loading.top ? <Loading /> : !top.top_expenses?.length ? <Empty /> : (
                            <div className="pa-chart-h">
                                <ResponsiveContainer width="100%" height="100%">
                                    <PieChart>
                                        <Pie data={top.top_expenses} dataKey="value" nameKey="name"
                                            cx="50%" cy="48%" outerRadius="72%" paddingAngle={2}
                                            animationDuration={900} animationEasing="ease" />
                                        {top.top_expenses.map((_, i) => <Cell key={i} fill={COLORS[i % COLORS.length]} />)}
                                        <Tooltip formatter={v => fmt(v)} />
                                        <Legend wrapperStyle={{ fontSize: '11px' }} />
                                    </PieChart>
                                </ResponsiveContainer>
                            </div>
                        )}
                    </ChartCard>
                </div>

                {/* ── 6. Budget vs Actual ──────────────────────────────────── */}
                <ChartCard title="Budget vs Actual" subtitle="Planned vs real figures for this year" icon={<Target size={16} />}>
                    {loading.budget ? <Loading /> : !budget?.budget ? (
                        <div className="pa-empty">
                            <AlertCircle size={28} />
                            <p>No budget set in Xero. Add a budget in Xero to enable this report.</p>
                        </div>
                    ) : budgetRows.length === 0 ? <Empty /> : (
                        <div className="pa-chart-h">
                            <ResponsiveContainer width="100%" height="100%">
                                <BarChart data={budgetRows.slice(0, 12)} barGap={4}>
                                    <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
                                    <XAxis dataKey="label" axisLine={false} tickLine={false} tick={{ fill: '#94a3b8', fontSize: 10 }} />
                                    <YAxis axisLine={false} tickLine={false} tick={{ fill: '#94a3b8', fontSize: 11 }} tickFormatter={v => `£${(v / 1000).toFixed(0)}k`} />
                                    <Tooltip content={<Tip />} />
                                    <Legend wrapperStyle={{ fontSize: '12px', paddingTop: '8px' }} />
                                    <Bar dataKey="actual" name="Actual" fill="#2563eb" radius={[4, 4, 0, 0]} animationDuration={900} animationEasing="ease" />
                                </BarChart>
                            </ResponsiveContainer>
                        </div>
                    )}
                </ChartCard>

            </div>
        </div>
    );
}
