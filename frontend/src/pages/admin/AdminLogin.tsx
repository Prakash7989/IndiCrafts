import React, { useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext';
import { Eye, EyeOff, Shield } from 'lucide-react';

const AdminLogin: React.FC = () => {
    const { login, refreshProfile } = useAuth();
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState<string | null>(null);
    const [loading, setLoading] = useState(false);
    const [showPassword, setShowPassword] = useState(false);
    const navigate = useNavigate();
    const location = useLocation();

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setError(null);
        setLoading(true);
        try {
            await login(email, password);
            await refreshProfile();
            // After login, navigate to /admin or back to intended page
            const state = location.state as { from?: Location } | null;
            navigate((state && (state as any).from?.pathname) || '/admin', { replace: true });
        } catch (err: any) {
            setError(err?.message || 'Login failed');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="min-h-screen flex items-center justify-center p-4 bg-gradient-to-br from-slate-50 to-white">
            <div className="w-full max-w-md">
                <div className="mb-6 text-center">
                    <div className="mx-auto h-12 w-12 rounded-full bg-black text-white flex items-center justify-center">
                        <Shield className="h-6 w-6" />
                    </div>
                    <h1 className="mt-3 text-2xl font-semibold">IndiCrafts Admin</h1>
                    <p className="text-sm text-muted-foreground">Sign in to your admin account</p>
                </div>
                <form onSubmit={handleSubmit} className="w-full border rounded-xl p-6 space-y-4 shadow-sm bg-white">
                    {error && <div className="text-sm text-red-600 bg-red-50 border border-red-200 rounded px-3 py-2">{error}</div>}
                    <div>
                        <label className="block text-sm mb-1">Email</label>
                        <input
                            type="email"
                            className="w-full border rounded px-3 py-2 focus:outline-none focus:ring-2 focus:ring-black"
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            required
                        />
                    </div>
                    <div>
                        <label className="block text-sm mb-1">Password</label>
                        <div className="relative">
                            <input
                                type={showPassword ? 'text' : 'password'}
                                className="w-full border rounded px-3 py-2 pr-10 focus:outline-none focus:ring-2 focus:ring-black"
                                value={password}
                                onChange={(e) => setPassword(e.target.value)}
                                required
                            />
                            <button
                                type="button"
                                aria-label={showPassword ? 'Hide password' : 'Show password'}
                                onClick={() => setShowPassword((s) => !s)}
                                className="absolute right-2 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground"
                            >
                                {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                            </button>
                        </div>
                    </div>
                    <button type="submit" className="w-full bg-black text-white py-2 rounded hover:opacity-90" disabled={loading}>
                        {loading ? 'Signing in…' : 'Sign in'}
                    </button>
                </form>
            </div>
        </div>
    );
};

export default AdminLogin;


