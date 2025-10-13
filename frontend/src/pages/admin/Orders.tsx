import React, { useEffect, useState } from 'react';
import api from '@/services/api';
import { Link } from 'react-router-dom';

const OrdersPage: React.FC = () => {
    const [orders, setOrders] = useState<any[]>([]);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        (async () => {
            try {
                const res = await api.getAdminOrders({ limit: 20 });
                setOrders((res as any).orders || []);
            } catch (e: any) {
                setError(e?.message || 'Failed to load orders');
            }
        })();
    }, []);

    return (
        <div className="space-y-4">
            <h1 className="text-2xl font-semibold">Orders</h1>
            {error && <div className="text-red-600 text-sm">{error}</div>}
            <div className="overflow-x-auto border rounded-xl">
                <table className="w-full text-sm">
                    <thead className="bg-muted/40">
                        <tr>
                            <th className="text-left p-2">Order ID</th>
                            <th className="text-left p-2">Customer</th>
                            <th className="text-left p-2">Status</th>
                            <th className="text-left p-2">Shipping Address</th>
                            <th className="text-right p-2">Subtotal</th>
                            <th className="text-right p-2">Shipping</th>
                            <th className="text-right p-2">Total</th>
                            <th className="text-left p-2">Created</th>
                        </tr>
                    </thead>
                    <tbody>
                        {orders.map((o) => (
                            <tr key={o._id} className="border-t">
                                <td className="p-2"><Link to={`/admin/orders/${o._id}`} className="underline">{o._id}</Link></td>
                                <td className="p-2">{o.customer?.firstName} {o.customer?.lastName}</td>
                                <td className="p-2">{o.status}</td>
                                <td className="p-2">
                                    <div className="max-w-xs whitespace-pre-wrap text-xs text-muted-foreground">
                                        {o.shippingAddress?.fullName}, {o.shippingAddress?.phone}\n
                                        {o.shippingAddress?.line1}{o.shippingAddress?.line2 ? `, ${o.shippingAddress.line2}` : ''}\n
                                        {o.shippingAddress?.city}, {o.shippingAddress?.state} {o.shippingAddress?.postalCode}\n
                                        {o.shippingAddress?.country}
                                    </div>
                                </td>
                                <td className="p-2 text-right">₹{o.subtotal?.toFixed ? o.subtotal.toFixed(2) : o.subtotal}</td>
                                <td className="p-2 text-right">₹{o.shipping?.toFixed ? o.shipping.toFixed(2) : o.shipping}</td>
                                <td className="p-2 text-right">₹{o.total?.toFixed ? o.total.toFixed(2) : o.total}</td>
                                <td className="p-2">{new Date(o.createdAt).toLocaleString()}</td>
                            </tr>
                        ))}
                        {orders.length === 0 && (
                            <tr>
                                <td className="p-4 text-center" colSpan={5}>No orders found</td>
                            </tr>
                        )}
                    </tbody>
                </table>
            </div>
        </div>
    );
};

export default OrdersPage;


