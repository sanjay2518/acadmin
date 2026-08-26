import { useState, useEffect } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { KeyRound, Eye, EyeOff, Loader2, CheckCircle2 } from 'lucide-react';
import './SetPassword.css';

const API = 'https://acadmin-seven.vercel.app';

export default function SetPassword() {
    const navigate = useNavigate();
    const [params] = useSearchParams();
    const token = params.get('token');

    const [password, setPassword]   = useState('');
    const [confirm, setConfirm]     = useState('');
    const [showPass, setShowPass]   = useState(false);
    const [loading, setLoading]     = useState(false);
    const [error, setError]         = useState('');
    const [success, setSuccess]     = useState(false);

    useEffect(() => {
        if (!token) navigate('/');
    }, [token, navigate]);

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (password !== confirm) { setError('Passwords do not match'); return; }
        if (password.length < 8)  { setError('Password must be at least 8 characters'); return; }
        setLoading(true);
        setError('');
        try {
            const res  = await fetch(`${API}/api/auth/set-password`, {
                method:  'POST',
                headers: { 'Content-Type': 'application/json' },
                body:    JSON.stringify({ token, password }),
            });
            const data = await res.json();
            if (!res.ok) throw new Error(data.detail || 'Failed to set password');
            setSuccess(true);
            setTimeout(() => navigate('/'), 2500);
        } catch (err) {
            setError(err.message);
        } finally {
            setLoading(false);
        }
    };

    if (success) return (
        <div className="sp-page">
            <div className="sp-card">
                <CheckCircle2 size={48} color="#16a34a" />
                <h2>Password set!</h2>
                <p>Redirecting you to login…</p>
            </div>
        </div>
    );

    return (
        <div className="sp-page">
            <div className="sp-card">
                <div className="sp-icon"><KeyRound size={26} /></div>
                <h2>Set your password</h2>
                <p>Choose a password for your Wealcco portal account.</p>
                <form onSubmit={handleSubmit} className="sp-form">
                    <div className="sp-field">
                        <label>New Password</label>
                        <div className="sp-pw-wrap">
                            <input
                                type={showPass ? 'text' : 'password'}
                                value={password}
                                onChange={e => setPassword(e.target.value)}
                                placeholder="Min. 8 characters"
                                required autoFocus
                            />
                            <button type="button" onClick={() => setShowPass(!showPass)}>
                                {showPass ? <EyeOff size={16} /> : <Eye size={16} />}
                            </button>
                        </div>
                    </div>
                    <div className="sp-field">
                        <label>Confirm Password</label>
                        <input
                            type="password"
                            value={confirm}
                            onChange={e => setConfirm(e.target.value)}
                            placeholder="Repeat password"
                            required
                        />
                    </div>
                    {error && <p className="sp-error">{error}</p>}
                    <button type="submit" className="sp-btn" disabled={loading}>
                        {loading ? <Loader2 size={18} className="spin" /> : 'Set Password & Login'}
                    </button>
                </form>
            </div>
        </div>
    );
}
