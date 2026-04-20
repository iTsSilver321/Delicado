"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { cn, getInitials } from "@/lib/utils";

import { ShoppingBag, Menu, User, LogOut, Package, Shield, Heart } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useCartStore } from "@/lib/store";
import { MobileMenu } from "./MobileMenu";
import { ThemeToggle } from "./ThemeToggle";
import { AnimatePresence, motion } from "framer-motion";
import { useEffect, useState } from "react";
import { User as SupabaseUser } from "@supabase/supabase-js";
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuLabel,
    DropdownMenuSeparator,
    DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { signout } from "@/app/(auth)/actions";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { createClient } from "@/lib/supabase/client";

const navLinks = [
    { name: "Shop", href: "/shop" },
    { name: "About Us", href: "/about" },
    { name: "Contact", href: "/contact" },
];

interface HeaderProps {
    user?: SupabaseUser | null;
}

export function Header({ user }: HeaderProps) {
    const pathname = usePathname();
    const { items } = useCartStore();
    const [mounted, setMounted] = useState(false);
    const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
    const [isAdmin, setIsAdmin] = useState(false);
    const [scrolled, setScrolled] = useState(false);

    useEffect(() => {
        setMounted(true);
    }, []);

    // Scroll listener for subtle header background shift
    useEffect(() => {
        const onScroll = () => setScrolled(window.scrollY > 20);
        window.addEventListener("scroll", onScroll, { passive: true });
        return () => window.removeEventListener("scroll", onScroll);
    }, []);

    // Check if user is admin
    useEffect(() => {
        let isCancelled = false;

        if (user) {
            const supabase = createClient();
            supabase
                .from('profiles')
                .select('role')
                .eq('id', user.id)
                .single()
                .then(({ data }) => {
                    if (!isCancelled) {
                        setIsAdmin(data?.role === 'admin');
                    }
                });
        }

        return () => {
            isCancelled = true;
        };
    }, [user]);

    const itemCount = mounted ? items.reduce((acc, item) => acc + item.quantity, 0) : 0;

    return (
        <header className={cn(
            "sticky top-0 z-40 w-full transition-all duration-300",
            scrolled
                ? "bg-background/90 backdrop-blur-md border-b border-border/50 shadow-sm"
                : "bg-background border-b border-transparent"
        )}>
            <div className="container flex h-[72px] items-center justify-between">
                {/* Left — Mobile menu + Logo */}
                <div className="flex items-center gap-4">
                    <Button
                        variant="ghost"
                        size="icon"
                        className="md:hidden -ml-2"
                        onClick={() => setIsMobileMenuOpen(true)}
                    >
                        <Menu className="h-5 w-5" />
                        <span className="sr-only">Toggle menu</span>
                    </Button>
                    <Link
                        href="/"
                        className="font-serif text-2xl font-bold tracking-tight text-primary"
                        onClick={(e) => {
                            if (pathname === "/") {
                                e.preventDefault();
                                window.scrollTo({ top: 0, behavior: "smooth" });
                            }
                        }}
                    >
                        Delicado
                    </Link>
                </div>

                {/* Center — Nav */}
                <nav className="hidden md:flex items-center gap-1">
                    {navLinks.map((link) => (
                        <Link
                            key={link.name}
                            href={link.href}
                            className={cn(
                                "relative px-4 py-2 text-sm font-medium transition-colors rounded-lg",
                                pathname === link.href
                                    ? "text-primary"
                                    : "text-muted-foreground hover:text-foreground"
                            )}
                        >
                            {link.name}
                            {pathname === link.href && (
                                <motion.span
                                    layoutId="nav-underline"
                                    className="absolute bottom-0 left-2 right-2 h-0.5 bg-primary rounded-full"
                                    transition={{ type: "spring", bounce: 0.2, duration: 0.5 }}
                                />
                            )}
                        </Link>
                    ))}
                </nav>

                {/* Right — Actions */}
                <div className="flex items-center gap-1">
                    <ThemeToggle />

                    {/* Wishlist */}
                    <Link href="/wishlist">
                        <Button variant="ghost" size="icon" className="relative group text-muted-foreground hover:text-red-500 hover:bg-red-50 dark:hover:bg-red-950/20">
                            <Heart className="w-5 h-5 group-hover:scale-105 transition-transform" />
                            <span className="sr-only">View wishlist</span>
                        </Button>
                    </Link>

                    {/* Cart */}
                    <Link href="/cart">
                        <Button variant="ghost" size="icon" className="relative group">
                            <ShoppingBag className="w-5 h-5 group-hover:scale-105 transition-transform" />
                            <AnimatePresence>
                                {itemCount > 0 && (
                                    <motion.span
                                        initial={{ scale: 0 }}
                                        animate={{ scale: 1 }}
                                        exit={{ scale: 0 }}
                                        className="absolute -top-0.5 -right-0.5 bg-primary text-primary-foreground text-[10px] font-bold w-4 h-4 flex items-center justify-center rounded-full ring-2 ring-background"
                                    >
                                        {itemCount}
                                    </motion.span>
                                )}
                            </AnimatePresence>
                            <span className="sr-only">View cart</span>
                        </Button>
                    </Link>

                    {user ? (
                        <DropdownMenu>
                            <DropdownMenuTrigger asChild>
                                <Button variant="ghost" size="icon" className="rounded-full overflow-hidden" suppressHydrationWarning>
                                    <Avatar className="h-8 w-8">
                                        <AvatarImage src={user.user_metadata?.avatar_url} />
                                        <AvatarFallback className="bg-primary/10 text-primary text-xs">
                                            {getInitials(user.user_metadata?.full_name || user.email)}
                                        </AvatarFallback>
                                    </Avatar>
                                </Button>
                            </DropdownMenuTrigger>
                            <DropdownMenuContent align="end" className="w-52">
                                <DropdownMenuLabel>My Account</DropdownMenuLabel>
                                <DropdownMenuSeparator />
                                <DropdownMenuItem asChild>
                                    <Link href="/profile" className="cursor-pointer">
                                        <User className="mr-2 h-4 w-4" />
                                        <span>Profile</span>
                                    </Link>
                                </DropdownMenuItem>
                                <DropdownMenuItem asChild>
                                    <Link href="/profile" className="cursor-pointer">
                                        <Package className="mr-2 h-4 w-4" />
                                        <span>Orders</span>
                                    </Link>
                                </DropdownMenuItem>
                                <DropdownMenuItem asChild>
                                    <Link href="/wishlist" className="cursor-pointer">
                                        <Heart className="mr-2 h-4 w-4" />
                                        <span>Wishlist</span>
                                    </Link>
                                </DropdownMenuItem>
                                {isAdmin && (
                                    <>
                                        <DropdownMenuSeparator />
                                        <DropdownMenuItem asChild>
                                            <Link href="/admin" className="cursor-pointer">
                                                <Shield className="mr-2 h-4 w-4" />
                                                <span>Admin Dashboard</span>
                                            </Link>
                                        </DropdownMenuItem>
                                    </>
                                )}
                                <DropdownMenuSeparator />
                                <DropdownMenuItem asChild>
                                    <form action={signout} className="w-full">
                                        <button type="submit" className="flex w-full items-center text-destructive">
                                            <LogOut className="mr-2 h-4 w-4" />
                                            <span>Sign out</span>
                                        </button>
                                    </form>
                                </DropdownMenuItem>
                            </DropdownMenuContent>
                        </DropdownMenu>
                    ) : (
                        <>
                            <Button asChild variant="ghost" size="icon" className="sm:hidden text-primary hover:text-primary hover:bg-primary/10">
                                <Link href="/login">
                                    <User className="h-5 w-5" />
                                    <span className="sr-only">Login</span>
                                </Link>
                            </Button>
                            <Button asChild variant="default" size="sm" className="hidden sm:inline-flex ml-2 rounded-full px-5">
                                <Link href="/login">
                                    Login
                                </Link>
                            </Button>
                        </>
                    )}
                </div>
            </div>

            <MobileMenu isOpen={isMobileMenuOpen} onClose={() => setIsMobileMenuOpen(false)} user={user} />
        </header>
    );
}
