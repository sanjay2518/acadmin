import { useEffect, useState } from 'react';
import { LogOut, FileText, Loader2, CheckCircle2, Clock, AlertCircle } from 'lucide-react';

const API = 'https://acadmin-seven.vercel.app';

const statusIcon = (inv) => {
    if (inv.Status === 'PAID') return <CheckCircle2 size={14} className="text-green" />;
    if (inv.IsOverdue)         return <AlertCircle  size={14} className="text-red"   />;
    return                            <Clock        size={14} className="text-yellow"/>;
};

const statusLabel = (inv) => {
    if (inv.Status === 'PAID') return { label: 'Paid',    cls: 'badge-green'  };
    if (inv.IsOverdue)         return { label: 'Overdue', cls: 'badge-red'    };
    return                            { label: 'Pending', cls: 'badge-yellow' };
};

const fmt = (n) => `£${Number(n || 0).toLocaleString('en-GB', { minimumFractionDigits: 2 })}`;

const UserPortal = ({ user, onLogout }) => {
    const [invoices, setInvoices] = useState([]);
    const [loading, setLoading]   = useState(true);

    useEffect(() => {
        fetch(`${API}/api/user/portal?contact_id=${user.xero_contact_id}`)
            .then(r => r.json())
            .then(d => setInvoices(d.invoices || []))
            .finally(() => setLoading(false));
    }, [user.xero_contact_id]);

    const total     = invoices.reduce((s, i) => s + Number(i.AmountDue  || 0), 0);
    const paid      = invoices.filter(i => i.Status === 'PAID').length;
    const overdue   = invoices.filter(i => i.IsOverdue).length;

    return (
        <div className="portal-wrapper">
            <div className="portal-header">
                <div className="portal-avatar">{user.name?.charAt(0).toUpperCase()}</div>
                <div>
                    <h3>{user.name}</h3>
                    <p>{user.email}</p>
                </div>
                <button className="portal-logout" onClick={onLogout} title="Logout">
                    <LogOut size={16} />
                </button>
            </div>

            <div className="portal-stats">
                <div className="pstat">
                    <span className="pstat-val">{invoices.length}</span>
                    <span className="pstat-lbl">Total</span>
                </div>
                <div className="pstat">
                    <span className="pstat-val green">{paid}</span>
                    <span className="pstat-lbl">Paid</span>
                </div>
                <div className="pstat">
                    <span className="pstat-val red">{overdue}</span>
                    <span className="pstat-lbl">Overdue</span>
                </div>
                <div className="pstat">
                    <span className="pstat-val">{fmt(total)}</span>
                    <span className="pstat-lbl">Outstanding</span>
                </div>
            </div>

            <h4 className="portal-section-title">Your Invoices</h4>

            {loading ? (
                <div className="portal-loading">
                    <Loader2 size={24} className="spin" />
                </div>
            ) : invoices.length === 0 ? (
                <div className="portal-empty">
                    <FileText size={32} />
                    <p>No invoices found</p>
                </div>
            ) : (
                <div className="portal-invoices">
                    {invoices.map((inv, i) => {
                        const { label, cls } = statusLabel(inv);
                        return (
                            <div key={i} className="portal-invoice-row">
                                <div className="inv-left">
                                    <p className="inv-number">{inv.InvoiceNumber || '—'}</p>
                                    <p className="inv-date">Due: {inv.DueDateString || inv.DueDate?.split('T')[0] || '—'}</p>
                                </div>
                                <div className="inv-right">
                                    <p className="inv-amount">{fmt(inv.AmountDue)}</p>
                                    <span className={`inv-badge ${cls}`}>{label}</span>
                                </div>
                            </div>
                        );
                    })}
                </div>
            )}
        </div>
    );
};

export default UserPortal;
