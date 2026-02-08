"use client";


import Link from "next/link";
import { usePathname } from "next/navigation";

import { ShoppingBag, Menu, Search, ChevronDown, Bed, Shirt, UtensilsCrossed, User, LogOut, Package } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useCartStore } from "@/lib/store";
import { CartSheet } from "./CartSheet";
import { SearchDialog } from "./SearchDialog";
import { MobileMenu } from "./MobileMenu";
import { motion, AnimatePresence } from "framer-motion";
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

const categories = [
    { name: "Bedding", href: "/products/bedding", icon: Bed, desc: "Pillows, sheets & more" },
    { name: "Clothing", href: "/products/clothing", icon: Shirt, desc: "Robes, shirts & apparel" },
    { name: "Tableware", href: "/products/tableware", icon: UtensilsCrossed, desc: "Table linens & decor" },
];

interface HeaderProps {
    user?: SupabaseUser | null;
}

export function Header({ user }: HeaderProps) {
    const pathname = usePathname();
    const { items, openCart } = useCartStore();
    const [mounted, setMounted] = useState(false);
    const [isSearchOpen, setIsSearchOpen] = useState(false);
    const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
    const [isDropdownOpen, setIsDropdownOpen] = useState(false);

    // Hydration fix for persisting store
    useEffect(() => {
        setMounted(true);
    }, []);

    // Keyboard shortcut for search
    useEffect(() => {
        const handleKeyDown = (e: KeyboardEvent) => {
            if ((e.metaKey || e.ctrlKey) && e.key === "k") {
                e.preventDefault();
                setIsSearchOpen(true);
            }
        };

        document.addEventListener("keydown", handleKeyDown);
        return () => document.removeEventListener("keydown", handleKeyDown);
    }, []);

    const itemCount = mounted ? items.reduce((acc, item) => acc + item.quantity, 0) : 0;

    return (
        <header className="sticky top-0 z-40 w-full border-b bg-background/80 backdrop-blur-md supports-[backdrop-filter]:bg-background/60">
            <div className="container flex h-16 items-center justify-between">
                <div className="flex items-center gap-4">
                    <Button
                        variant="ghost"
                        size="icon"
                        className="md:hidden"
                        onClick={() => setIsMobileMenuOpen(true)}
                    >
                        <Menu className="h-6 w-6" />
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

                <nav className="hidden md:flex items-center gap-1">
                    {/* Categories Dropdown */}
                    <div
                        className="relative"
                        onMouseEnter={() => setIsDropdownOpen(true)}
                        onMouseLeave={() => setIsDropdownOpen(false)}
                    >
                        <button className="flex items-center gap-1 px-4 py-2 text-sm font-medium transition-colors hover:text-primary rounded-lg hover:bg-secondary/50">
                            Shop
                            <ChevronDown className={`h-4 w-4 transition-transform ${isDropdownOpen ? 'rotate-180' : ''}`} />
                        </button>

                        <AnimatePresence>
                            {isDropdownOpen && (
                                <motion.div
                                    initial={{ opacity: 0, y: 10 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    exit={{ opacity: 0, y: 10 }}
                                    transition={{ duration: 0.15 }}
                                    className="absolute left-0 top-full pt-2"
                                >
                                    <div className="w-64 bg-background rounded-xl border shadow-xl p-2">
                                        {categories.map((category) => (
                                            <Link
                                                key={category.name}
                                                href={category.href}
                                                className="flex items-center gap-3 p-3 rounded-lg hover:bg-secondary transition-colors"
                                            >
                                                <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-primary/10">
                                                    <category.icon className="h-5 w-5 text-primary" />
                                                </div>
                                                <div>
                                                    <p className="font-medium text-sm">{category.name}</p>
                                                    <p className="text-xs text-muted-foreground">{category.desc}</p>
                                                </div>
                                            </Link>
                                        ))}
                                        <div className="border-t mt-2 pt-2">
                                            <Link
                                                href="/collections"
                                                className="block px-3 py-2 text-sm font-medium text-primary hover:underline"
                                            >
                                                View All Collections →
                                            </Link>
                                        </div>
                                    </div>
                                </motion.div>
                            )}
                        </AnimatePresence>
                    </div>

                    <Link href="/collections" className="px-4 py-2 text-sm font-medium transition-colors hover:text-primary rounded-lg hover:bg-secondary/50">
                        Collections
                    </Link>
                </nav>

                <div className="flex items-center gap-2">
                    <Button
                        variant="ghost"
                        size="icon"
                        onClick={() => setIsSearchOpen(true)}
                        className="relative hidden sm:inline-flex"
                    >
                        <Search className="h-5 w-5" />
                        <span className="sr-only">Search products</span>
                        {/* Keyboard hint - desktop only */}
                        <span className="hidden lg:flex absolute -bottom-6 left-1/2 -translate-x-1/2 text-[10px] text-muted-foreground gap-0.5 whitespace-nowrap">
                            <kbd className="px-1 rounded bg-secondary font-mono">⌘</kbd>
                            <kbd className="px-1 rounded bg-secondary font-mono">K</kbd>
                        </span>
                    </Button>

                    {/* Cart - Now links to separate page */}
                    <Link href="/cart">
                        <Button variant="ghost" size="icon" className="relative group">
                            <ShoppingBag className="w-5 h-5 group-hover:scale-110 transition-transform" />
                            <AnimatePresence>
                                {itemCount > 0 && (
                                    <motion.span
                                        initial={{ scale: 0 }}
                                        animate={{ scale: 1 }}
                                        exit={{ scale: 0 }}
                                        className="absolute -top-1 -right-1 bg-primary text-primary-foreground text-[10px] font-bold w-4 h-4 flex items-center justify-center rounded-full ring-2 ring-background"
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
                                <Button variant="ghost" size="icon" className="rounded-full overflow-hidden">
                                    <Avatar className="h-8 w-8">
                                        <AvatarImage src={user.user_metadata?.avatar_url} />
                                        <AvatarFallback className="bg-primary/10 text-primary">
                                            {user.email?.charAt(0).toUpperCase()}
                                        </AvatarFallback>
                                    </Avatar>
                                </Button>
                            </DropdownMenuTrigger>
                            <DropdownMenuContent align="end" className="w-56">
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
                        <Button asChild variant="default" size="sm" className="ml-2 hidden sm:inline-flex">
                            <Link href="/login">
                                Login
                            </Link>
                        </Button>
                    )}
                </div>
            </div>


            <SearchDialog isOpen={isSearchOpen} onClose={() => setIsSearchOpen(false)} />
            <MobileMenu isOpen={isMobileMenuOpen} onClose={() => setIsMobileMenuOpen(false)} />
        </header>
    );
}
