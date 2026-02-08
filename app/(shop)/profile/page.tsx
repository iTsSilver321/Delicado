import { createClient } from "@/lib/supabase/server";
import { redirect } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { signout } from "@/app/(auth)/actions";
import { User, Package, LogOut, Clock, MapPin, CreditCard, Banknote } from "lucide-react";
import Image from "next/image";
import Link from "next/link";

const statusColors: Record<string, string> = {
    pending: "bg-yellow-500/10 text-yellow-600 border-yellow-500/20",
    confirmed: "bg-blue-500/10 text-blue-600 border-blue-500/20",
    paid: "bg-emerald-500/10 text-emerald-600 border-emerald-500/20",
    processing: "bg-purple-500/10 text-purple-600 border-purple-500/20",
    shipped: "bg-indigo-500/10 text-indigo-600 border-indigo-500/20",
    delivered: "bg-green-500/10 text-green-600 border-green-500/20",
    cancelled: "bg-red-500/10 text-red-600 border-red-500/20",
};

export default async function ProfilePage() {
    const supabase = await createClient();

    const { data: { user } } = await supabase.auth.getUser();

    if (!user) {
        redirect("/login");
    }

    const { data: profile } = await supabase
        .from("profiles")
        .select("*")
        .eq("id", user.id)
        .single();

    // Fetch user's orders
    const { data: orders } = await supabase
        .from("orders")
        .select(`
            *,
            order_items (
                id,
                product_name,
                quantity,
                unit_price,
                customization
            )
        `)
        .or(`user_id.eq.${user.id},customer_email.eq.${user.email}`)
        .order("created_at", { ascending: false })
        .limit(10);

    return (
        <div className="container py-16 md:py-24">
            <div className="max-w-4xl mx-auto space-y-12">
                <div className="space-y-4">
                    <h1 className="font-serif text-4xl font-bold tracking-tight">My Account</h1>
                    <p className="text-muted-foreground">Manage your profile and view your orders.</p>
                </div>

                <div className="grid md:grid-cols-[1fr_2fr] gap-12">
                    {/* Sidebar / Profile Card */}
                    <div className="space-y-6">
                        <div className="bg-card rounded-2xl border p-6 flex flex-col items-center text-center space-y-4 shadow-sm">
                            <div className="relative w-24 h-24 rounded-full overflow-hidden border-2 border-primary/20">
                                <Image
                                    src={profile?.avatar_url || `https://api.dicebear.com/9.x/initials/svg?seed=${profile?.full_name || 'User'}`}
                                    alt="Avatar"
                                    fill
                                    className="object-cover"
                                />
                            </div>
                            <div>
                                <h3 className="font-serif text-xl font-bold">{profile?.full_name || "Valued Customer"}</h3>
                                <p className="text-sm text-muted-foreground">{user.email}</p>
                            </div>

                            <form action={signout} className="w-full pt-4">
                                <Button variant="outline" className="w-full gap-2 text-destructive hover:text-destructive hover:bg-destructive/10 border-destructive/20">
                                    <LogOut className="w-4 h-4" />
                                    Sign Out
                                </Button>
                            </form>
                        </div>
                    </div>

                    {/* Main Content Area */}
                    <div className="space-y-8">

                        {/* Profile Settings */}
                        <div className="bg-card rounded-2xl border p-8 space-y-6 shadow-sm">
                            <div className="flex items-center gap-2 pb-4 border-b">
                                <User className="w-5 h-5 text-primary" />
                                <h2 className="font-serif text-xl font-bold">Profile Details</h2>
                            </div>

                            <div className="grid gap-6">
                                <div className="space-y-2">
                                    <Label>Full Name</Label>
                                    <Input defaultValue={profile?.full_name || ""} readOnly className="bg-secondary/30" />
                                </div>
                                <div className="space-y-2">
                                    <Label>Email Address</Label>
                                    <Input defaultValue={user.email || ""} readOnly className="bg-secondary/30" />
                                </div>
                            </div>
                            <div className="flex justify-end pt-2">
                                <Button variant="secondary" disabled>Edit Profile (Coming Soon)</Button>
                            </div>
                        </div>

                        {/* Order History */}
                        <div className="bg-card rounded-2xl border p-8 space-y-6 shadow-sm">
                            <div className="flex items-center gap-2 pb-4 border-b">
                                <Package className="w-5 h-5 text-primary" />
                                <h2 className="font-serif text-xl font-bold">Order History</h2>
                            </div>

                            {!orders || orders.length === 0 ? (
                                <div className="text-center py-12 text-muted-foreground space-y-3">
                                    <Package className="w-12 h-12 mx-auto opacity-20" />
                                    <p>No orders yet.</p>
                                    <Button variant="link" asChild className="text-primary">
                                        <Link href="/collections">Start Shopping</Link>
                                    </Button>
                                </div>
                            ) : (
                                <div className="space-y-4">
                                    {orders.map((order) => (
                                        <div key={order.id} className="border rounded-xl p-4 space-y-3">
                                            <div className="flex items-center justify-between">
                                                <div className="flex items-center gap-3">
                                                    <span className={`px-2 py-1 text-xs font-medium rounded-full border capitalize ${statusColors[order.status] || statusColors.pending}`}>
                                                        {order.status}
                                                    </span>
                                                    <span className="text-sm text-muted-foreground flex items-center gap-1">
                                                        <Clock className="w-3 h-3" />
                                                        {new Date(order.created_at).toLocaleDateString()}
                                                    </span>
                                                </div>
                                                <div className="flex items-center gap-2 text-sm">
                                                    {order.payment_method === 'cod' ? (
                                                        <Banknote className="w-4 h-4 text-emerald-600" />
                                                    ) : (
                                                        <CreditCard className="w-4 h-4 text-primary" />
                                                    )}
                                                    <span className="font-medium">${(order.total / 100).toFixed(2)}</span>
                                                </div>
                                            </div>

                                            <div className="space-y-2">
                                                {order.order_items?.map((item: any) => (
                                                    <div key={item.id} className="flex items-center justify-between text-sm">
                                                        <div className="flex items-center gap-2">
                                                            <span>{item.product_name}</span>
                                                            <span className="text-muted-foreground">× {item.quantity}</span>
                                                            {item.customization?.text && (
                                                                <span className="text-xs text-muted-foreground">
                                                                    "{item.customization.text}"
                                                                </span>
                                                            )}
                                                        </div>
                                                        <span className="text-muted-foreground">
                                                            ${((item.unit_price * item.quantity) / 100).toFixed(2)}
                                                        </span>
                                                    </div>
                                                ))}
                                            </div>

                                            {order.shipping_address && (
                                                <div className="flex items-start gap-2 text-xs text-muted-foreground pt-2 border-t">
                                                    <MapPin className="w-3 h-3 mt-0.5 flex-shrink-0" />
                                                    <span>
                                                        {order.shipping_address.line1}, {order.shipping_address.city}, {order.shipping_address.postal_code}
                                                    </span>
                                                </div>
                                            )}
                                        </div>
                                    ))}
                                </div>
                            )}
                        </div>

                    </div>
                </div>
            </div>
        </div>
    );
}
