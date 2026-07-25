import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { X, LogIn, Eye, EyeOff, Loader2 } from 'lucide-react';
import './LoginModal.css';

const API = 'https://acadmin-seven.vercel.app';

const LoginModal = ({ isOpen, onClose }) => {
    const navigate = useNavigate();
    const [email, setEmail]       = useState('');
    const [password, setPassword] = useState('');
    const [showPass, setShowPass] = useState(false);
    const [loading, setLoading]   = useState(false);
    const [error, setError]       = useState('');

    if (!isOpen) return null;

    const handleLogin = async (e) => {
        e.preventDefault();
        setLoading(true);
        setError('');
        try {
            const res  = await fetch(`${API}/api/auth/login`, {
                method:  'POST',
                headers: { 'Content-Type': 'application/json' },
                body:    JSON.stringify({ email, password }),
            });
            const data = await res.json();
            if (!res.ok) throw new Error(data.detail || 'Login failed');
            localStorage.setItem('portal_user', JSON.stringify(data));
            // Trigger header to update portalUser state
            window.dispatchEvent(new Event('storage'));
            onClose();
            navigate('/portal');
        } catch (err) {
            setError(err.message);
        } finally {
            setLoading(false);
        }
    };

    const handleClose = () => {
        setEmail('');
        setPassword('');
        setError('');
        onClose();
    };

    return (
        <div className="login-overlay" onClick={handleClose}>
            <div className="login-modal" onClick={e => e.stopPropagation()}>
                <button className="login-close" onClick={handleClose}>
                    <X size={20} />
                </button>
                <div className="login-header">
                    <div className="login-icon"><LogIn size={24} /></div>
                    <h2>Client Login</h2>
                    <p>Access your financial portal</p>
                </div>
                <form onSubmit={handleLogin} className="login-form">
                    <div className="login-field">
                        <label>Email Address</label>
                        <input
                            type="email" value={email}
                            onChange={e => setEmail(e.target.value)}
                            placeholder="you@example.com" required autoFocus
                        />
                    </div>
                    <div className="login-field">
                        <label>Password</label>
                        <div className="password-wrapper">
                            <input
                                type={showPass ? 'text' : 'password'} value={password}
                                onChange={e => setPassword(e.target.value)}
                                placeholder="Enter your password" required
                            />
                            <button type="button" className="toggle-pass" onClick={() => setShowPass(!showPass)}>
                                {showPass ? <EyeOff size={16} /> : <Eye size={16} />}
                            </button>
                        </div>
                    </div>
                    {error && <p className="login-error">{error}</p>}
                    <button type="submit" className="login-btn" disabled={loading}>
                        {loading ? <Loader2 size={18} className="spin" /> : 'Sign In'}
                    </button>
                </form>
                <p className="login-note">Don't have access? Contact your account manager.</p>
            </div>
        </div>
    );
};

export default LoginModal;
