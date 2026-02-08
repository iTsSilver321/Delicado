'use client';

import { useState } from 'react';
import { createClient } from '@/lib/supabase/client';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Package, Search, Truck, CheckCircle, Clock, XCircle, AlertCircle } from 'lucide-react';
import { Separator } from '@/components/ui/separator';
import { Badge } from '@/components/ui/badge';

export default function TrackOrderPage() {
    const [orderId, setOrderId] = useState('');
    const [email, setEmail] = useState('');
    const [order, setOrder] = useState<any>(null);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');
    const [hasSearched, setHasSearched] = useState(false);

    const supabase = createClient();

    const handleTrack = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);
        setError('');
        setOrder(null);
        setHasSearched(true);

        try {
            // We search by ID and Email for security (basic verification)
            // Or just ID if it's a long UUID, but user might not know UUID.
            // Usually "Track by Order ID" implies the public ID.
            // Since our IDs are UUIDs, users probably copy-paste them from email.
            // Let's enforce Email match for security so random people can't snoop orders by guessing IDs.

            // Fetch orders for this email
            const { data, error } = await supabase
                .from('orders')
                .select(`
                    *,
                    order_items (
                        product_name,
                        quantity,
                        unit_price
                    ),
                    shipping_address
                `)
                .eq('customer_email', email.trim().toLowerCase())
                .order('created_at', { ascending: false });

            if (error || !data || data.length === 0) {
                setError('No order found with this email.');
            } else {
                // Find order matching ID (full or partial)
                // Strip '#' if user included it
                const searchId = orderId.trim().replace(/^#/, '').toLowerCase();
                const foundOrder = data.find(o => o.id.toLowerCase().startsWith(searchId));

                if (foundOrder) {
                    setOrder(foundOrder);
                } else {
                    setError('Order ID not found for this email.');
                }
            }
        } catch (err) {
            setError('An error occurred while tracking your order.');
        } finally {
            setLoading(false);
        }
    };

    const getStatusIcon = (status: string) => {
        switch (status) {
            case 'pending': return <Clock className="w-12 h-12 text-yellow-500" />;
            case 'processing': return <Package className="w-12 h-12 text-blue-500" />;
            case 'shipped': return <Truck className="w-12 h-12 text-indigo-500" />;
            case 'delivered': return <CheckCircle className="w-12 h-12 text-green-500" />;
            case 'cancelled': return <XCircle className="w-12 h-12 text-red-500" />;
            default: return <AlertCircle className="w-12 h-12 text-gray-400" />;
        }
    };

    const getStatusStep = (currentStatus: string) => {
        const steps = ['pending', 'processing', 'shipped', 'delivered'];
        const currentIndex = steps.indexOf(currentStatus);
        if (currentStatus === 'cancelled') return -1;
        return currentIndex;
    };

    return (
        <div className="container py-24 max-w-2xl mx-auto min-h-[80vh]">
            <div className="space-y-8 text-center mb-12">
                <h1 className="text-4xl font-serif font-bold tracking-tight">Track Your Order</h1>
                <p className="text-muted-foreground">Enter your Order ID and Email to see real-time updates.</p>
            </div>

            <Card className="shadow-lg border-muted/40">
                <CardHeader>
                    <CardTitle>Find Your Order</CardTitle>
                    <CardDescription>Check the status of your recent purchase.</CardDescription>
                </CardHeader>
                <CardContent>
                    <form onSubmit={handleTrack} className="space-y-4">
                        <div className="space-y-2">
                            <Label htmlFor="order-id">Order ID</Label>
                            <Input
                                id="order-id"
                                placeholder="e.g. 123e4567-e89b..."
                                value={orderId}
                                onChange={(e) => setOrderId(e.target.value)}
                                required
                            />
                        </div>
                        <div className="space-y-2">
                            <Label htmlFor="email">Email Address</Label>
                            <Input
                                id="email"
                                type="email"
                                placeholder="Enter the email used for checkout"
                                value={email}
                                onChange={(e) => setEmail(e.target.value)}
                                required
                            />
                        </div>
                        <Button type="submit" className="w-full" size="lg" disabled={loading}>
                            {loading ? (
                                <>
                                    <Clock className="mr-2 h-4 w-4 animate-spin" />
                                    Tracking...
                                </>
                            ) : (
                                <>
                                    <Search className="mr-2 h-4 w-4" />
                                    Track Order
                                </>
                            )}
                        </Button>
                    </form>
                </CardContent>
            </Card>

            {error && (
                <div className="mt-8 p-4 rounded-lg bg-destructive/10 text-destructive text-center font-medium animate-in fade-in slide-in-from-bottom-4">
                    {error}
                </div>
            )}

            {order && (
                <div className="mt-12 space-y-8 animate-in fade-in slide-in-from-bottom-8 duration-700">

                    {/* Status Header */}
                    <div className="flex flex-col items-center justify-center space-y-4 text-center">
                        <div className="p-4 bg-background rounded-full shadow-sm border">
                            {getStatusIcon(order.status)}
                        </div>
                        <div>
                            <h2 className="text-2xl font-bold capitalize">{order.status}</h2>
                            <p className="text-muted-foreground">
                                Order marked as {order.status} on {new Date(order.updated_at || order.created_at).toLocaleDateString()}
                            </p>
                        </div>
                    </div>

                    {/* Progress Bar (Simple) */}
                    {order.status !== 'cancelled' && (
                        <div className="relative w-full h-2 bg-secondary rounded-full overflow-hidden">
                            <div
                                className="absolute top-0 left-0 h-full bg-primary transition-all duration-1000 ease-out"
                                style={{ width: `${Math.max(5, (getStatusStep(order.status) + 1) * 25)}%` }}
                            />
                        </div>
                    )}

                    {/* Order Details Card */}
                    <Card>
                        <CardHeader>
                            <CardTitle>Order Details</CardTitle>
                        </CardHeader>
                        <CardContent className="space-y-6">
                            <div className="flex justify-between items-center text-sm">
                                <span className="text-muted-foreground">Order Date</span>
                                <span className="font-medium">{new Date(order.created_at).toLocaleDateString()}</span>
                            </div>

                            <Separator />

                            <div className="space-y-3">
                                {order.order_items.map((item: any, idx: number) => (
                                    <div key={idx} className="flex justify-between text-sm">
                                        <div className="flex items-center gap-2">
                                            <span className="font-medium">{item.quantity}x</span>
                                            <span>{item.product_name}</span>
                                        </div>
                                        <span>${(item.unit_price / 100).toFixed(2)}</span>
                                    </div>
                                ))}
                            </div>

                            <Separator />

                            {order.shipping_address && (
                                <div className="space-y-2">
                                    <h4 className="font-medium text-sm">Shipping To</h4>
                                    <p className="text-sm text-muted-foreground leading-relaxed">
                                        {order.shipping_address.line1}<br />
                                        {order.shipping_address.city}, {order.shipping_address.postal_code}<br />
                                        {order.shipping_address.country}
                                    </p>
                                </div>
                            )}

                            <div className="rounded-lg bg-secondary/50 p-4 flex items-center justify-between text-lg font-bold">
                                <span>Total</span>
                                <span>${(order.total / 100).toFixed(2)}</span>
                            </div>
                        </CardContent>
                    </Card>
                </div>
            )}
        </div>
    );
}
