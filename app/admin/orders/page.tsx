"use client";

import { createClient } from "@/lib/supabase/client";
import { useEffect, useState } from "react";
import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuLabel,
    DropdownMenuSeparator,
    DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { MoreHorizontal, FileSearch, CheckCircle, XCircle } from "lucide-react";
import { toast } from "sonner";
import { formatCurrency } from "@/lib/utils";

interface Order {
    id: string;
    created_at: string;
    total: number;
    status: string;
    payment_method: string;
    customer_name: string;
    customer_email: string;
}

export default function OrdersPage() {
    const [orders, setOrders] = useState<Order[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    const supabase = createClient();

    const fetchOrders = async () => {
        setIsLoading(true);
        const { data, error } = await supabase
            .from("orders")
            .select("*")
            .order("created_at", { ascending: false });

        if (error) {
            toast.error("Failed to fetch orders");
        } else {
            setOrders(data || []);
        }
        setIsLoading(false);
    };

    useEffect(() => {
        fetchOrders();
    }, []);

    const updateStatus = async (orderId: string, status: string) => {
        // Check if status is already set
        const currentOrder = orders.find(o => o.id === orderId);
        if (currentOrder && currentOrder.status === status) {
            toast.info(`Order is already marked as ${status}`);
            return;
        }

        try {
            // Use Server Action to bypass RLS
            const { success, error } = await import("../actions").then(mod => mod.updateOrderStatus(orderId, status));

            if (!success) {
                toast.error("Failed to update status");
                console.error(error);
            } else {
                toast.success(`Order marked as ${status}`);
                fetchOrders();

                // Trigger email notification
                try {
                    await fetch('/api/send-status-email', {
                        method: 'POST',
                        headers: { 'Content-Type': 'application/json' },
                        body: JSON.stringify({ orderId, status }),
                    });
                    toast.success("Status email sent to customer");
                } catch (err) {
                    console.error("Failed to trigger status email", err);

                }
            }
        } catch (err) {
            toast.error("An error occurred");
            console.error(err);
        }
    };

    return (
        <div className="space-y-8">
            <div>
                <h2 className="text-3xl font-serif font-bold tracking-tight">Orders</h2>
                <p className="text-muted-foreground">
                    Manage and track your customer orders.
                </p>
            </div>

            <div className="rounded-md border bg-card">
                <Table>
                    <TableHeader>
                        <TableRow>
                            <TableHead className="w-[100px]">Order ID</TableHead>
                            <TableHead>Customer</TableHead>
                            <TableHead>Date</TableHead>
                            <TableHead>Status</TableHead>
                            <TableHead>Total</TableHead>
                            <TableHead className="text-right">Actions</TableHead>
                        </TableRow>
                    </TableHeader>
                    <TableBody>
                        {isLoading ? (
                            <TableRow>
                                <TableCell colSpan={6} className="text-center py-10">
                                    Loading orders...
                                </TableCell>
                            </TableRow>
                        ) : orders.length === 0 ? (
                            <TableRow>
                                <TableCell colSpan={6} className="text-center py-10">
                                    No orders found.
                                </TableCell>
                            </TableRow>
                        ) : (
                            orders.map((order) => (
                                <TableRow key={order.id}>
                                    <TableCell className="font-medium">
                                        #{order.id.slice(0, 8).toUpperCase()}
                                    </TableCell>
                                    <TableCell>
                                        <div className="flex flex-col">
                                            <span>{order.customer_name}</span>
                                            <span className="text-xs text-muted-foreground">
                                                {order.customer_email}
                                            </span>
                                        </div>
                                    </TableCell>
                                    <TableCell>
                                        {new Date(order.created_at).toLocaleDateString()}
                                    </TableCell>
                                    <TableCell>
                                        <Badge
                                            variant={
                                                order.status === "paid" || order.status === "completed"
                                                    ? "default"
                                                    : order.status === "pending"
                                                        ? "secondary"
                                                        : "destructive"
                                            }
                                            className="capitalize"
                                        >
                                            {order.status}
                                        </Badge>
                                    </TableCell>
                                    <TableCell>{formatCurrency(order.total / 100)}</TableCell>
                                    <TableCell className="text-right">
                                        <DropdownMenu>
                                            <DropdownMenuTrigger asChild>
                                                <Button variant="ghost" className="h-8 w-8 p-0">
                                                    <span className="sr-only">Open menu</span>
                                                    <MoreHorizontal className="h-4 w-4" />
                                                </Button>
                                            </DropdownMenuTrigger>
                                            <DropdownMenuContent align="end">
                                                <DropdownMenuLabel>Actions</DropdownMenuLabel>
                                                <DropdownMenuItem
                                                    onClick={() => navigator.clipboard.writeText(order.id)}
                                                >
                                                    Copy Order ID
                                                </DropdownMenuItem>
                                                <DropdownMenuSeparator />
                                                <DropdownMenuItem onClick={() => updateStatus(order.id, 'processing')}>
                                                    Mark Processing
                                                </DropdownMenuItem>
                                                <DropdownMenuItem onClick={() => updateStatus(order.id, 'shipped')}>
                                                    Mark Shipped
                                                </DropdownMenuItem>
                                                <DropdownMenuItem onClick={() => updateStatus(order.id, 'delivered')}>
                                                    Mark Delivered
                                                </DropdownMenuItem>
                                            </DropdownMenuContent>
                                        </DropdownMenu>
                                    </TableCell>
                                </TableRow>
                            ))
                        )}
                    </TableBody>
                </Table>
            </div>
        </div>
    );
}
