import React, { useEffect, useState } from 'react';
import api from '@/services/api';

const AdminDashboard: React.FC = () => {
    const [stats, setStats] = useState<any | null>(null);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        (async () => {
            try {
                const res = await api.getAdminStats();
                setStats((res as any).stats);
            } catch (e: any) {
                setError(e?.message || 'Failed to load stats');
            }
        })();
    }, []);

    return (
        <div className="space-y-4">
            <h1 className="text-2xl font-semibold">Dashboard</h1>
            {error && <div className="text-red-600 text-sm">{error}</div>}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                {[
                    { label: 'Users', value: stats?.usersCount },
                    { label: 'Producers', value: stats?.producersCount },
                    { label: 'Products', value: stats?.productsCount },
                    { label: 'Orders', value: stats?.ordersCount },
                    { label: 'Paid Orders', value: stats?.paidOrdersCount },
                    { label: 'Total Revenue', value: stats?.totalRevenue, prefix: '₹' },
                ].map((c, idx) => (
                    <div key={idx} className="rounded-xl border p-4 bg-gradient-to-br from-white to-slate-50">
                        <div className="text-xs uppercase text-muted-foreground">{c.label}</div>
                        <div className="mt-2 text-3xl font-semibold tracking-tight">
                            {c.prefix}{typeof c.value === 'number' ? (c.label === 'Total Revenue' ? c.value.toFixed(2) : c.value) : '—'}
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
};

export default AdminDashboard;


