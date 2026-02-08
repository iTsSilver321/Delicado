"use client";

import { useState } from "react";
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
import { MoreHorizontal } from "lucide-react";
import { toast } from "sonner";
import { formatCurrency } from "@/lib/utils";
import { updateOrderStatus } from "../../actions"; // Use Server Action directly

interface Order {
    id: string;
    created_at: string;
    total: number;
    status: string;
    payment_method: string;
    customer_name: string;
    customer_email: string;
}

interface OrdersTableProps {
    initialOrders: Order[];
}

export function OrdersTable({ initialOrders }: OrdersTableProps) {
    // We keep local state to allow optimistic updates or re-fetching if needed without full page reload.
    // For now, simpler: just update local state after successful action.
    const [orders, setOrders] = useState<Order[]>(initialOrders);

    const handleUpdateStatus = async (orderId: string, status: string) => {
        // Optimistic check
        const currentOrder = orders.find(o => o.id === orderId);
        if (currentOrder && currentOrder.status === status) {
            toast.info(`Order is already marked as ${status}`);
            return;
        }

        try {
            const { success, error } = await updateOrderStatus(orderId, status);

            if (!success) {
                toast.error("Failed to update status");
                console.error(error);
            } else {
                toast.success(`Order marked as ${status}`);

                // Update local state to reflect change
                setOrders(prev => prev.map(o => o.id === orderId ? { ...o, status } : o));

                // Trigger email notification (fire and forget)
                fetch('/api/send-status-email', {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({ orderId, status }),
                }).catch(err => console.error("Failed to trigger status email", err));
            }
        } catch (err) {
            toast.error("An error occurred");
            console.error(err);
        }
    };

    return (
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
                {orders.length === 0 ? (
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
                                        <DropdownMenuItem onClick={() => handleUpdateStatus(order.id, 'processing')}>
                                            Mark Processing
                                        </DropdownMenuItem>
                                        <DropdownMenuItem onClick={() => handleUpdateStatus(order.id, 'shipped')}>
                                            Mark Shipped
                                        </DropdownMenuItem>
                                        <DropdownMenuItem onClick={() => handleUpdateStatus(order.id, 'delivered')}>
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
    );
}
