import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import {
    FileText, Loader2, CheckCircle2, Clock, AlertCircle, DollarSign, TrendingUp
} from 'lucide-react';
import {
    BarChart, Bar, LineChart, Line, PieChart, Pie, Cell,
    XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Legend
} from 'recharts';
import './ClientPortal.css';

const API = 'http://localhost:8000';

const fmt    = (n) => `£${Number(n || 0).toLocaleString('en-GB', { minimumFractionDigits: 0, maximumFractionDigits: 0 })}`;
const fmtFull= (n) => `£${Number(n || 0).toLocaleString('en-GB', { minimumFractionDigits: 2 })}`;

const fmtDate = (val) => {
    if (!val) return '—';
    // Handle Xero /Date(...)/ format
    const ms = typeof val === 'string' ? val.match(/\/Date\((\d+)/) : null;
    const d  = ms ? new Date(Number(ms[1])) : new Date(val);
    return isNaN(d) ? val : d.toLocaleDateString('en-GB', { day: '2-digit', month: 'short', year: 'numeric' });
};

const statusMeta = (inv) => {
    if (inv.Status === 'PAID') return { label: 'Paid',    cls: 'badge-green',  icon: <CheckCircle2 size={13} /> };
    if (inv.IsOverdue)         return { label: 'Overdue', cls: 'badge-red',    icon: <AlertCircle  size={13} /> };
    return                            { label: 'Pending', cls: 'badge-yellow', icon: <Clock        size={13} /> };
};

// Build monthly bar data from invoices
function buildMonthlyData(invoices) {
    const map = {};
    invoices.forEach(inv => {
        const ms  = typeof inv.DateString === 'string' ? inv.DateString.match(/\/Date\((\d+)/) : null;
        const d   = ms ? new Date(Number(ms[1])) : new Date(inv.DateString || inv.Date);
        if (isNaN(d)) return;
        const key = d.toLocaleDateString('en-GB', { month: 'short', year: '2-digit' });
        if (!map[key]) map[key] = { month: key, billed: 0, paid: 0, pending: 0, _ts: d.getTime() };
        map[key].billed  += Number(inv.Total || 0);
        map[key].paid    += Number(inv.AmountPaid || 0);
        map[key].pending += Number(inv.AmountDue || 0);
    });
    return Object.values(map).sort((a, b) => a._ts - b._ts);
}

// Build status pie data
function buildPieData(invoices) {
    const paid    = invoices.filter(i => i.Status === 'PAID').reduce((s, i) => s + Number(i.Total || 0), 0);
    const overdue = invoices.filter(i => i.IsOverdue).reduce((s, i) => s + Number(i.AmountDue || 0), 0);
    const pending = invoices.filter(i => i.Status !== 'PAID' && !i.IsOverdue).reduce((s, i) => s + Number(i.AmountDue || 0), 0);
    return [
        { name: 'Paid',    value: paid,    color: '#16a34a' },
        { name: 'Pending', value: pending, color: '#ca8a04' },
        { name: 'Overdue', value: overdue, color: '#dc2626' },
    ].filter(d => d.value > 0);
}

// Build cumulative payment trend
function buildTrendData(invoices) {
    const sorted = [...invoices].sort((a, b) => new Date(a.DateString || a.Date) - new Date(b.DateString || b.Date));
    let cumulative = 0;
    return sorted.map(inv => {
        cumulative += Number(inv.Total || 0);
        const ms = typeof inv.DateString === 'string' ? inv.DateString.match(/\/Date\((\d+)/) : null;
        const d  = ms ? new Date(Number(ms[1])) : new Date(inv.DateString || inv.Date);
        return {
            date:       isNaN(d) ? '—' : d.toLocaleDateString('en-GB', { day: '2-digit', month: 'short' }),
            cumulative,
            amount: Number(inv.Total || 0),
        };
    });
}

const CustomTooltip = ({ active, payload, label }) => {
    if (!active || !payload?.length) return null;
    return (
        <div className="cp-tooltip">
            <p className="cp-tooltip-label">{label}</p>
            {payload.map((p, i) => (
                <p key={i} style={{ color: p.color }}>{p.name}: {fmt(p.value)}</p>
            ))}
        </div>
    );
};

export default function ClientPortal() {
    const navigate = useNavigate();
    const [user, setUser]         = useState(null);
    const [invoices, setInvoices] = useState([]);
    const [loading, setLoading]   = useState(true);
    const [filter, setFilter]     = useState('ALL');

    useEffect(() => {
        const stored = localStorage.getItem('portal_user');
        if (!stored) { navigate('/'); return; }
        const u = JSON.parse(stored);
        setUser(u);
        fetch(`${API}/api/user/portal?contact_id=${u.xero_contact_id}`)
            .then(r => r.json())
            .then(d => setInvoices(d.invoices || []))
            .finally(() => setLoading(false));
    }, [navigate]);

    if (!user) return null;

    const filtered     = filter === 'ALL' ? invoices : invoices.filter(i => filter === 'OVERDUE' ? i.IsOverdue : i.Status === filter);
    const paidCount    = invoices.filter(i => i.Status === 'PAID').length;
    const overdueCount = invoices.filter(i => i.IsOverdue).length;
    const outstanding  = invoices.filter(i => i.Status !== 'PAID').reduce((s, i) => s + Number(i.AmountDue || 0), 0);
    const totalBilled  = invoices.reduce((s, i) => s + Number(i.Total || 0), 0);

    const monthlyData = buildMonthlyData(invoices);
    const pieData     = buildPieData(invoices);
    const trendData   = buildTrendData(invoices);

    // Current ratio: paid / total billed
    const currentRatio = totalBilled > 0 ? (totalBilled - outstanding) / totalBilled : 0;
    const ratioPercent = Math.round(currentRatio * 100);

    return (
        <div className="cp-page">
            {/* Hero */}
            <div className="cp-hero">
                <div className="cp-hero-inner">
                    <div className="cp-avatar">{user.name?.charAt(0).toUpperCase()}</div>
                    <div>
                        <h1 className="cp-welcome">Welcome back, {user.name}</h1>
                        <p className="cp-email">{user.email}</p>
                    </div>
                </div>
            </div>

            <div className="cp-container">
                {/* KPI Stats */}
                <div className="cp-stats">
                    {[
                        { icon: <FileText size={20} />,     cls: 'blue',  val: invoices.length, lbl: 'Total Invoices' },
                        { icon: <CheckCircle2 size={20} />, cls: 'green', val: paidCount,        lbl: 'Paid' },
                        { icon: <AlertCircle size={20} />,  cls: 'red',   val: overdueCount,     lbl: 'Overdue' },
                        { icon: <DollarSign size={20} />,   cls: 'amber', val: fmtFull(outstanding), lbl: 'Outstanding' },
                        { icon: <TrendingUp size={20} />,   cls: 'indigo',val: fmtFull(totalBilled), lbl: 'Total Billed' },
                    ].map((s, i) => (
                        <div key={i} className="cp-stat-card">
                            <div className={`cp-stat-icon ${s.cls}`}>{s.icon}</div>
                            <div>
                                <p className="cp-stat-val">{s.val}</p>
                                <p className="cp-stat-lbl">{s.lbl}</p>
                            </div>
                        </div>
                    ))}
                </div>

                {loading ? (
                    <div className="cp-loading"><Loader2 size={32} className="spin" /></div>
                ) : invoices.length === 0 ? (
                    <div className="cp-empty"><FileText size={40} /><p>No invoice data available</p></div>
                ) : (
                    <>
                        {/* Charts row */}
                        <div className="cp-charts-grid">
                            {/* Monthly Billed vs Paid bar chart */}
                            <div className="cp-chart-card cp-chart-wide">
                                <h3 className="cp-chart-title">Monthly Invoice Summary</h3>
                                <p className="cp-chart-sub">Billed vs Paid amounts by month</p>
                                <div className="cp-chart-body">
                                    {monthlyData.length > 0 ? (
                                        <ResponsiveContainer width="100%" height="100%">
                                            <BarChart data={monthlyData} barGap={4}>
                                                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
                                                <XAxis dataKey="month" axisLine={false} tickLine={false} tick={{ fill: '#94a3b8', fontSize: 12 }} />
                                                <YAxis axisLine={false} tickLine={false} tick={{ fill: '#94a3b8', fontSize: 11 }} tickFormatter={v => `£${(v/1000).toFixed(0)}k`} />
                                                <Tooltip content={<CustomTooltip />} />
                                                <Legend wrapperStyle={{ fontSize: '12px', paddingTop: '12px' }} />
                                                <Bar dataKey="billed"  name="Billed"  fill="#3b82f6" radius={[4,4,0,0]} />
                                                <Bar dataKey="paid"    name="Paid"    fill="#16a34a" radius={[4,4,0,0]} />
                                                <Bar dataKey="pending" name="Pending" fill="#f59e0b" radius={[4,4,0,0]} />
                                            </BarChart>
                                        </ResponsiveContainer>
                                    ) : (
                                        <div className="cp-chart-empty">Not enough data</div>
                                    )}
                                </div>
                            </div>

                            {/* Payment status pie */}
                            <div className="cp-chart-card">
                                <h3 className="cp-chart-title">Payment Status</h3>
                                <p className="cp-chart-sub">By invoice value</p>
                                <div className="cp-chart-body">
                                    {pieData.length > 0 ? (
                                        <ResponsiveContainer width="100%" height="100%">
                                            <PieChart>
                                                <Pie
                                                    data={pieData}
                                                    cx="50%" cy="45%"
                                                    innerRadius="55%" outerRadius="75%"
                                                    paddingAngle={3}
                                                    dataKey="value"
                                                >
                                                    {pieData.map((entry, i) => (
                                                        <Cell key={i} fill={entry.color} />
                                                    ))}
                                                </Pie>
                                                <Tooltip formatter={(v) => fmt(v)} />
                                                <Legend wrapperStyle={{ fontSize: '12px' }} />
                                            </PieChart>
                                        </ResponsiveContainer>
                                    ) : (
                                        <div className="cp-chart-empty">No data</div>
                                    )}
                                </div>
                                {/* Current ratio gauge */}
                                <div className="cp-ratio-wrap">
                                    <div className="cp-ratio-bar-bg">
                                        <div className="cp-ratio-bar-fill" style={{ width: `${ratioPercent}%` }} />
                                    </div>
                                    <div className="cp-ratio-labels">
                                        <span>Payment Rate</span>
                                        <span className="cp-ratio-val">{ratioPercent}%</span>
                                    </div>
                                </div>
                            </div>
                        </div>

                        {/* Cumulative spend trend */}
                        <div className="cp-chart-card cp-chart-full">
                            <h3 className="cp-chart-title">Cumulative Invoice Value</h3>
                            <p className="cp-chart-sub">Running total of all invoices over time</p>
                            <div className="cp-chart-body cp-chart-body-lg">
                                <ResponsiveContainer width="100%" height="100%">
                                    <LineChart data={trendData}>
                                        <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
                                        <XAxis dataKey="date" axisLine={false} tickLine={false} tick={{ fill: '#94a3b8', fontSize: 12 }} />
                                        <YAxis axisLine={false} tickLine={false} tick={{ fill: '#94a3b8', fontSize: 11 }} tickFormatter={v => `£${(v/1000).toFixed(0)}k`} />
                                        <Tooltip content={<CustomTooltip />} />
                                        <Legend wrapperStyle={{ fontSize: '12px', paddingTop: '8px' }} />
                                        <Line type="monotone" dataKey="cumulative" name="Cumulative Total" stroke="#2563eb" strokeWidth={2.5} dot={{ r: 4, fill: '#2563eb' }} activeDot={{ r: 6 }} />
                                        <Line type="monotone" dataKey="amount"     name="Invoice Amount"  stroke="#7c3aed" strokeWidth={2} strokeDasharray="5 4" dot={{ r: 3 }} />
                                    </LineChart>
                                </ResponsiveContainer>
                            </div>
                        </div>
                    </>
                )}

                {/* Invoice table */}
                <div className="cp-section-header">
                    <h2 className="cp-section-title">Your Invoices</h2>
                    <div className="cp-filters">
                        {[
                            { key: 'ALL',        label: 'All' },
                            { key: 'AUTHORISED', label: 'Pending' },
                            { key: 'PAID',       label: 'Paid' },
                            { key: 'OVERDUE',    label: 'Overdue' },
                        ].map(f => (
                            <button key={f.key} className={`cp-filter-btn ${filter === f.key ? 'active' : ''}`} onClick={() => setFilter(f.key)}>
                                {f.label}
                            </button>
                        ))}
                    </div>
                </div>

                <div className="cp-table-wrap">
                    {filtered.length === 0 ? (
                        <div className="cp-empty"><FileText size={40} /><p>No invoices found</p></div>
                    ) : (
                        <table className="cp-table">
                            <thead>
                                <tr>
                                    <th>Invoice #</th>
                                    <th>Date</th>
                                    <th>Due Date</th>
                                    <th>Amount</th>
                                    <th>Balance Due</th>
                                    <th>Status</th>
                                </tr>
                            </thead>
                            <tbody>
                                {filtered.map((inv, i) => {
                                    const { label, cls, icon } = statusMeta(inv);
                                    return (
                                        <tr key={i}>
                                            <td className="inv-num">{inv.InvoiceNumber || '—'}</td>
                                            <td>{fmtDate(inv.DateString || inv.Date)}</td>
                                            <td>{fmtDate(inv.DueDateString || inv.DueDate)}</td>
                                            <td>{fmtFull(inv.Total)}</td>
                                            <td className="inv-balance">{fmtFull(inv.AmountDue)}</td>
                                            <td><span className={`cp-badge ${cls}`}>{icon} {label}</span></td>
                                        </tr>
                                    );
                                })}
                            </tbody>
                        </table>
                    )}
                </div>
            </div>
        </div>
    );
}
