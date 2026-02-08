"use client";

import { useEffect, useState } from "react";
import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from "@/components/ui/table";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Search, Mail, Calendar, Shield, User, Phone, MapPin, Package, Clock, MoreHorizontal } from "lucide-react";
import Image from "next/image";
import { Badge } from "@/components/ui/badge";
import { getCustomers } from "../actions";
import {
    Sheet,
    SheetContent,
    SheetDescription,
    SheetHeader,
    SheetTitle,
} from "@/components/ui/sheet";
import { formatCurrency } from "@/lib/utils";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";

export default function CustomersPage() {
    const [customers, setCustomers] = useState<any[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    const [search, setSearch] = useState("");
    const [selectedCustomer, setSelectedCustomer] = useState<any>(null);

    useEffect(() => {
        async function loadCustomers() {
            try {
                const data = await getCustomers();
                setCustomers(data);
            } catch (error) {
                console.error("Failed to fetch customers", error);
            } finally {
                setIsLoading(false);
            }
        }
        loadCustomers();
    }, []);

    const filteredCustomers = customers.filter(c =>
        c.full_name?.toLowerCase().includes(search.toLowerCase()) ||
        c.email?.toLowerCase().includes(search.toLowerCase())
    );

    const [customerOrders, setCustomerOrders] = useState<any[]>([]);
    const [loadingOrders, setLoadingOrders] = useState(false);

    useEffect(() => {
        if (selectedCustomer?.email) {
            setLoadingOrders(true);
            import("../actions").then(mod => mod.getCustomerOrders(selectedCustomer.email))
                .then(data => setCustomerOrders(data || []))
                .catch(err => console.error(err))
                .finally(() => setLoadingOrders(false));
        } else {
            setCustomerOrders([]);
        }
    }, [selectedCustomer]);

    return (
        <div className="space-y-8">
            <div className="flex items-center justify-between">
                <div>
                    <h2 className="text-3xl font-serif font-bold tracking-tight">Customers</h2>
                    <p className="text-muted-foreground">Manage your customer base.</p>
                </div>
            </div>

            <div className="flex items-center space-x-2">
                <div className="relative flex-1 max-w-sm">
                    <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
                    <Input
                        type="search"
                        placeholder="Search customers..."
                        className="pl-8"
                        value={search}
                        onChange={(e) => setSearch(e.target.value)}
                    />
                </div>
            </div>

            <div className="border rounded-lg bg-card">
                <Table>
                    <TableHeader>
                        <TableRow>
                            <TableHead>Customer</TableHead>
                            <TableHead>Role</TableHead>
                            <TableHead>Joined</TableHead>
                            <TableHead className="text-right">Actions</TableHead>
                        </TableRow>
                    </TableHeader>
                    <TableBody>
                        {isLoading ? (
                            <TableRow>
                                <TableCell colSpan={4} className="h-24 text-center">
                                    Loading customers...
                                </TableCell>
                            </TableRow>
                        ) : filteredCustomers.length === 0 ? (
                            <TableRow>
                                <TableCell colSpan={4} className="h-24 text-center">
                                    No customers found.
                                </TableCell>
                            </TableRow>
                        ) : (
                            filteredCustomers.map((customer) => (
                                <TableRow key={customer.id}>
                                    <TableCell>
                                        <div className="flex items-center gap-3">
                                            <div className="relative w-10 h-10 rounded-full overflow-hidden">
                                                <Image
                                                    src={customer.avatar_url || `https://api.dicebear.com/9.x/initials/svg?seed=${customer.full_name}`}
                                                    alt={customer.full_name || 'User'}
                                                    fill
                                                    className="object-cover"
                                                />
                                            </div>
                                            <div className="flex flex-col">
                                                <span className="font-medium">{customer.full_name}</span>
                                                <span className="text-xs text-muted-foreground flex items-center gap-1">
                                                    <Mail className="w-3 h-3" />
                                                    {customer.email}
                                                </span>
                                            </div>
                                        </div>
                                    </TableCell>
                                    <TableCell>
                                        <Badge variant={customer.role === 'admin' ? 'default' : 'secondary'}>
                                            {customer.role === 'admin' && <Shield className="w-3 h-3 mr-1 inline" />}
                                            {customer.role}
                                        </Badge>
                                    </TableCell>
                                    <TableCell>
                                        <div className="flex items-center gap-2 text-sm text-muted-foreground">
                                            <Calendar className="w-3 h-3" />
                                            {new Date(customer.created_at).toLocaleDateString()}
                                        </div>
                                    </TableCell>
                                    <TableCell className="text-right">
                                        <Button
                                            variant="ghost"
                                            size="sm"
                                            onClick={() => setSelectedCustomer(customer)}
                                        >
                                            View Details
                                        </Button>
                                    </TableCell>
                                </TableRow>
                            ))
                        )}
                    </TableBody>
                </Table>
            </div>

            <Sheet open={!!selectedCustomer} onOpenChange={(open) => !open && setSelectedCustomer(null)}>
                <SheetContent className="w-[400px] sm:w-[540px] overflow-y-auto">
                    <SheetHeader className="space-y-4 pb-6 border-b">
                        <div className="flex items-center justify-between">
                            <SheetTitle>Customer Profile</SheetTitle>
                        </div>
                        <div className="flex flex-col items-center gap-4 py-4">
                            <div className="relative w-24 h-24 rounded-full overflow-hidden border-4 border-background shadow-lg">
                                <Image
                                    src={selectedCustomer?.avatar_url || `https://api.dicebear.com/9.x/initials/svg?seed=${selectedCustomer?.full_name}`}
                                    alt={selectedCustomer?.full_name || 'User'}
                                    fill
                                    className="object-cover"
                                />
                            </div>
                            <div className="text-center space-y-1">
                                <h3 className="text-xl font-bold font-serif">{selectedCustomer?.full_name}</h3>
                                <p className="text-sm text-muted-foreground">{selectedCustomer?.email}</p>
                                <div className="pt-2">
                                    <Badge variant={selectedCustomer?.role === 'admin' ? 'default' : 'secondary'} className="px-3 py-1">
                                        {selectedCustomer?.role === 'admin' && <Shield className="w-3 h-3 mr-1 inline" />}
                                        {selectedCustomer?.role}
                                    </Badge>
                                </div>
                            </div>
                        </div>
                    </SheetHeader>

                    <div className="h-6"></div>

                    {selectedCustomer && (
                        <Tabs defaultValue="overview" className="w-full">
                            <TabsList className="grid w-full grid-cols-2">
                                <TabsTrigger value="overview">Overview</TabsTrigger>
                                <TabsTrigger value="orders">Orders History</TabsTrigger>
                            </TabsList>

                            <TabsContent value="overview" className="space-y-6 mt-6">
                                <div className="grid gap-4">
                                    <Card>
                                        <CardHeader className="pb-2">
                                            <CardTitle className="text-sm font-medium">Contact Information</CardTitle>
                                        </CardHeader>
                                        <CardContent className="space-y-3">
                                            <div className="flex items-center justify-between">
                                                <span className="text-sm text-muted-foreground flex items-center gap-2">
                                                    <Mail className="w-4 h-4" /> Email
                                                </span>
                                                <span className="text-sm font-medium">{selectedCustomer.email}</span>
                                            </div>
                                            <Separator />
                                            <div className="flex items-center justify-between">
                                                <span className="text-sm text-muted-foreground flex items-center gap-2">
                                                    <Phone className="w-4 h-4" /> Phone
                                                </span>
                                                <span className="text-sm font-medium text-muted-foreground italic">Not provided</span>
                                            </div>
                                        </CardContent>
                                    </Card>

                                    <Card>
                                        <CardHeader className="pb-2">
                                            <CardTitle className="text-sm font-medium">Account Details</CardTitle>
                                        </CardHeader>
                                        <CardContent className="space-y-3">
                                            <div className="flex items-center justify-between">
                                                <span className="text-sm text-muted-foreground flex items-center gap-2">
                                                    <Calendar className="w-4 h-4" /> Joined
                                                </span>
                                                <span className="text-sm font-medium">
                                                    {new Date(selectedCustomer.created_at).toLocaleDateString(undefined, {
                                                        year: 'numeric',
                                                        month: 'long',
                                                        day: 'numeric'
                                                    })}
                                                </span>
                                            </div>
                                            <Separator />
                                            <div className="flex items-center justify-between">
                                                <span className="text-sm text-muted-foreground flex items-center gap-2">
                                                    <User className="w-4 h-4" /> User ID
                                                </span>
                                                <code className="text-xs bg-muted px-2 py-1 rounded">
                                                    {selectedCustomer.id.split('-')[0]}...
                                                </code>
                                            </div>
                                            <div className="mt-2 text-xs text-muted-foreground break-all">
                                                Full ID: {selectedCustomer.id}
                                            </div>
                                        </CardContent>
                                    </Card>

                                    <div className="flex gap-2">
                                        <Button variant="outline" className="flex-1">
                                            Reset Password
                                        </Button>
                                        <Button variant="destructive" className="flex-1">
                                            Delete User
                                        </Button>
                                    </div>
                                </div>
                            </TabsContent>

                            <TabsContent value="orders" className="mt-6">
                                <Card>
                                    <CardHeader>
                                        <CardTitle className="flex justify-between items-center">
                                            <span>Recent Orders</span>
                                            {loadingOrders && <Package className="w-4 h-4 animate-spin" />}
                                        </CardTitle>
                                        <CardDescription>
                                            View orders placed by this customer.
                                        </CardDescription>
                                    </CardHeader>
                                    <CardContent>
                                        {loadingOrders ? (
                                            <div className="text-center py-8 text-muted-foreground">Loading...</div>
                                        ) : customerOrders.length === 0 ? (
                                            <div className="flex flex-col items-center justify-center py-8 text-center text-muted-foreground">
                                                <Package className="w-12 h-12 mb-4 opacity-20" />
                                                <p>No orders found for this customer.</p>
                                            </div>
                                        ) : (
                                            <div className="space-y-4">
                                                {customerOrders.map(order => (
                                                    <div key={order.id} className="flex items-center justify-between border-b pb-4 last:border-0 last:pb-0">
                                                        <div className="space-y-1">
                                                            <div className="font-medium">Order #{order.id.slice(0, 8).toUpperCase()}</div>
                                                            <div className="text-xs text-muted-foreground">
                                                                {new Date(order.created_at).toLocaleDateString()}
                                                            </div>
                                                        </div>
                                                        <div className="text-right space-y-1">
                                                            <div className="font-medium">{formatCurrency(order.total / 100)}</div>
                                                            <Badge variant="outline" className="capitalize text-xs">{order.status}</Badge>
                                                        </div>
                                                    </div>
                                                ))}
                                            </div>
                                        )}
                                    </CardContent>
                                </Card>
                            </TabsContent>
                        </Tabs>
                    )}
                </SheetContent>
            </Sheet>
        </div>
    );
}
