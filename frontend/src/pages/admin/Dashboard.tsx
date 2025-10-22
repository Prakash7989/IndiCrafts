import React, { useEffect, useState } from 'react';
import api from '@/services/api';

const AdminDashboard: React.FC = () => {
    const [stats, setStats] = useState<any | null>(null);
    const [shippingSummary, setShippingSummary] = useState<any | null>(null);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        (async () => {
            try {
                const [statsRes, shippingRes] = await Promise.all([
                    api.getAdminStats(),
                    api.get('/admin/shipping-summary')
                ]);
                setStats((statsRes as any).stats);
                setShippingSummary((shippingRes as any).summary);
            } catch (e: any) {
                setError(e?.message || 'Failed to load stats');
            }
        })();
    }, []);

    return (
        <div className="space-y-6">
            <h1 className="text-2xl font-semibold">Dashboard</h1>
            {error && <div className="text-red-600 text-sm">{error}</div>}

            {/* Basic Stats */}
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

            {/* Shipping Cost Analysis */}
            {shippingSummary && (
                <div className="space-y-4">
                    <h2 className="text-xl font-semibold">Shipping Cost Analysis</h2>

                    {/* Pricing Overview */}
                    <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                        <div className="rounded-xl border p-4 bg-gradient-to-br from-blue-50 to-blue-100">
                            <div className="text-xs uppercase text-blue-600">Total Base Price</div>
                            <div className="mt-2 text-2xl font-semibold text-blue-900">
                                ₹{shippingSummary.pricing?.totalBasePrice?.toLocaleString() || '0'}
                            </div>
                        </div>

                        <div className="rounded-xl border p-4 bg-gradient-to-br from-green-50 to-green-100">
                            <div className="text-xs uppercase text-green-600">Total Shipping Cost</div>
                            <div className="mt-2 text-2xl font-semibold text-green-900">
                                ₹{shippingSummary.pricing?.totalShippingCost?.toLocaleString() || '0'}
                            </div>
                        </div>

                        <div className="rounded-xl border p-4 bg-gradient-to-br from-purple-50 to-purple-100">
                            <div className="text-xs uppercase text-purple-600">Total Customer Price</div>
                            <div className="mt-2 text-2xl font-semibold text-purple-900">
                                ₹{shippingSummary.pricing?.totalCustomerPrice?.toLocaleString() || '0'}
                            </div>
                        </div>

                        <div className="rounded-xl border p-4 bg-gradient-to-br from-orange-50 to-orange-100">
                            <div className="text-xs uppercase text-orange-600">Avg Shipping Cost</div>
                            <div className="mt-2 text-2xl font-semibold text-orange-900">
                                ₹{shippingSummary.pricing?.averageShippingCost?.toFixed(2) || '0'}
                            </div>
                        </div>
                    </div>

                    {/* Weight Distribution */}
                    {shippingSummary.distribution?.weight && (
                        <div className="rounded-xl border p-4 bg-white">
                            <h3 className="text-lg font-semibold mb-3">Weight Distribution</h3>
                            <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
                                {Object.entries(shippingSummary.distribution.weight).map(([category, count]) => (
                                    <div key={category} className="flex justify-between items-center p-2 bg-gray-50 rounded">
                                        <span className="text-sm font-medium">{category}</span>
                                        <span className="text-sm text-gray-600">{count as number} products</span>
                                    </div>
                                ))}
                            </div>
                        </div>
                    )}

                    {/* Location Distribution */}
                    {shippingSummary.distribution?.location && (
                        <div className="rounded-xl border p-4 bg-white">
                            <h3 className="text-lg font-semibold mb-3">Location Distribution</h3>
                            <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
                                {Object.entries(shippingSummary.distribution.location).map(([state, count]) => (
                                    <div key={state} className="flex justify-between items-center p-2 bg-gray-50 rounded">
                                        <span className="text-sm font-medium">{state}</span>
                                        <span className="text-sm text-gray-600">{count as number} products</span>
                                    </div>
                                ))}
                            </div>
                        </div>
                    )}

                    {/* Detailed Price Analysis */}
                    <div className="rounded-xl border p-4 bg-white">
                        <h3 className="text-lg font-semibold mb-3">Detailed Price Analysis</h3>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <div className="p-3 bg-blue-50 rounded">
                                <h4 className="font-semibold text-blue-900 mb-2">Base Pricing</h4>
                                <div className="space-y-1 text-sm">
                                    <div className="flex justify-between">
                                        <span>Total Base Price:</span>
                                        <span className="font-medium">₹{shippingSummary.pricing?.totalBasePrice?.toLocaleString()}</span>
                                    </div>
                                    <div className="flex justify-between">
                                        <span>Average Base Price:</span>
                                        <span className="font-medium">₹{shippingSummary.pricing?.totalBasePrice && shippingSummary.totalProducts ? (shippingSummary.pricing.totalBasePrice / shippingSummary.totalProducts).toFixed(2) : '0'}</span>
                                    </div>
                                </div>
                            </div>

                            <div className="p-3 bg-green-50 rounded">
                                <h4 className="font-semibold text-green-900 mb-2">Shipping Impact</h4>
                                <div className="space-y-1 text-sm">
                                    <div className="flex justify-between">
                                        <span>Total Shipping Cost:</span>
                                        <span className="font-medium">₹{shippingSummary.pricing?.totalShippingCost?.toLocaleString()}</span>
                                    </div>
                                    <div className="flex justify-between">
                                        <span>Average Shipping Cost:</span>
                                        <span className="font-medium">₹{shippingSummary.pricing?.averageShippingCost?.toFixed(2)}</span>
                                    </div>
                                    <div className="flex justify-between">
                                        <span>Shipping % of Base:</span>
                                        <span className="font-medium">
                                            {shippingSummary.pricing?.totalBasePrice && shippingSummary.pricing?.totalShippingCost
                                                ? ((shippingSummary.pricing.totalShippingCost / shippingSummary.pricing.totalBasePrice) * 100).toFixed(1)
                                                : '0'
                                            }%
                                        </span>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

export default AdminDashboard;


