import React, { useEffect, useState } from 'react';
import api from '@/services/api';
import { Link } from 'react-router-dom';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';

const OrdersPage: React.FC = () => {
    const [orders, setOrders] = useState<any[]>([]);
    const [error, setError] = useState<string | null>(null);
    const [preview, setPreview] = useState<{ imageUrl: string; name: string } | null>(null);

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
        <>
            <div className="space-y-4">
                <h1 className="text-2xl font-semibold">Orders</h1>
                {error && <div className="text-red-600 text-sm">{error}</div>}
                <div className="overflow-x-auto border rounded-xl">
                    <table className="w-full text-sm">
                        <thead className="bg-muted/40">
                            <tr>
                                <th className="text-left p-2">Order ID</th>
                                <th className="text-left p-2">Item</th>
                                <th className="text-left p-2">Customer</th>
                                <th className="text-left p-2">Status</th>
                                <th className="text-left p-2">Payment</th>
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
                                    <td className="p-2">
                                        <button
                                            type="button"
                                            className="flex items-center gap-2"
                                            onClick={() => {
                                                const first = o.items?.[0];
                                                if (first?.imageUrl) setPreview({ imageUrl: first.imageUrl, name: first.name });
                                            }}
                                        >
                                            {o.items?.[0]?.imageUrl ? (
                                                <img src={o.items[0].imageUrl} alt={o.items[0].name} className="w-10 h-10 rounded object-cover" />
                                            ) : (
                                                <div className="w-10 h-10 rounded bg-muted" />
                                            )}
                                            <div className="text-xs text-left">
                                                <div className="font-medium truncate max-w-[160px]">{o.items?.[0]?.name || '-'}</div>
                                                {o.items && o.items.length > 1 && (
                                                    <div className="text-muted-foreground">+{o.items.length - 1} more</div>
                                                )}
                                            </div>
                                        </button>
                                    </td>
                                    <td className="p-2">{o.customer?.firstName} {o.customer?.lastName}</td>
                                    <td className="p-2">{o.status}</td>
                                    <td className="p-2">
                                        <div className="text-xs">
                                            <div><span className="text-muted-foreground">Provider:</span> {o.paymentProvider || '-'}</div>
                                            <div><span className="text-muted-foreground">Currency:</span> {o.paymentCurrency || 'INR'}</div>
                                            {o.razorpayPaymentId && (
                                                <div className="truncate"><span className="text-muted-foreground">Payment ID:</span> {o.razorpayPaymentId}</div>
                                            )}
                                            {o.razorpayOrderId && (
                                                <div className="truncate"><span className="text-muted-foreground">Order ID:</span> {o.razorpayOrderId}</div>
                                            )}
                                        </div>
                                    </td>
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
            <Dialog open={!!preview} onOpenChange={(open) => !open && setPreview(null)}>
                <DialogContent className="max-w-2xl">
                    <DialogHeader>
                        <DialogTitle>{preview?.name}</DialogTitle>
                    </DialogHeader>
                    {preview?.imageUrl && (
                        <img src={preview.imageUrl} alt={preview.name} className="w-full max-h-[70vh] object-contain rounded" />
                    )}
                </DialogContent>
            </Dialog>
        </>
    );
};

export default OrdersPage;


