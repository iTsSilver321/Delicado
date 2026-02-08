import { createClient } from "@/lib/supabase/server";
import { redirect } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { signout } from "@/app/(auth)/actions";
import { User, Mail, Package, LogOut } from "lucide-react";
import Image from "next/image";

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

                            <div className="text-center py-12 text-muted-foreground space-y-3">
                                <Package className="w-12 h-12 mx-auto opacity-20" />
                                <p>No orders yet.</p>
                                <Button variant="link" asChild className="text-primary">
                                    <a href="/collections">Start Shopping</a>
                                </Button>
                            </div>
                        </div>

                    </div>
                </div>
            </div>
        </div>
    );
}
