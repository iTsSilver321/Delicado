"use client";

import Link from "next/link";
import { ShoppingBag, User, HelpCircle, Truck, Mail, ChevronDown } from "lucide-react";
import { Button } from "@/components/ui/button";
import { ThemeToggle } from "./ThemeToggle";
import { useState } from "react";

import {
    Sheet,
    SheetContent,
    SheetHeader,
    SheetTitle,
    SheetDescription,
} from "@/components/ui/sheet";

interface MobileMenuProps {
    isOpen: boolean;
    onClose: () => void;
    user?: { email?: string } | null;
}

const mainLinks = [
    { name: "Shop All", href: "/shop" },
    { name: "Branch Collection", href: "/shop?design=branch" },
    { name: "Flower Collection", href: "/shop?design=flower" },
    { name: "Wishlist", href: "/wishlist" },
];

const supportLinks = [
    { name: "FAQ", href: "/faq", icon: HelpCircle },
    { name: "Shipping & Returns", href: "/shipping", icon: Truck },
    { name: "Contact Us", href: "/contact", icon: Mail },
];

export function MobileMenu({ isOpen, onClose, user }: MobileMenuProps) {
    const [isSupportOpen, setIsSupportOpen] = useState(false);

    return (
        <Sheet open={isOpen} onOpenChange={(open) => !open && onClose()}>
            <SheetContent side="left" className="w-[300px] sm:w-[360px] p-0 flex flex-col h-full">
                <SheetHeader className="p-5 border-b text-left">
                    <SheetTitle className="font-serif text-2xl font-bold tracking-tight text-primary">
                        <Link href="/" onClick={onClose}>
                            Delicado
                        </Link>
                    </SheetTitle>
                    <SheetDescription className="sr-only">
                        Mobile navigation menu
                    </SheetDescription>
                </SheetHeader>

                <div className="flex-1 overflow-y-auto p-5 space-y-6">
                    {/* Main Nav */}
                    <div className="space-y-1">
                        <p className="text-xs font-medium text-muted-foreground uppercase tracking-wider px-3 mb-2">Shop</p>
                        {mainLinks.map((link) => (
                            <Link
                                key={link.name}
                                href={link.href}
                                onClick={onClose}
                                className="block px-3 py-2.5 text-sm font-medium rounded-lg hover:bg-secondary transition-colors"
                            >
                                {link.name}
                            </Link>
                        ))}
                    </div>

                    {/* About */}
                    <div className="space-y-1">
                        <Link
                            href="/about"
                            onClick={onClose}
                            className="block px-3 py-2.5 text-sm font-medium rounded-lg hover:bg-secondary transition-colors"
                        >
                            About Us
                        </Link>
                    </div>

                    {/* Support */}
                    <div>
                        <button
                            onClick={() => setIsSupportOpen(!isSupportOpen)}
                            className="flex items-center justify-between w-full px-3 py-2.5 text-sm font-medium rounded-lg hover:bg-secondary transition-colors"
                        >
                            <span>Support</span>
                            <ChevronDown className={`h-4 w-4 transition-transform ${isSupportOpen ? 'rotate-180' : ''}`} />
                        </button>
                        {isSupportOpen && (
                            <div className="mt-1 ml-3 space-y-1 border-l-2 border-primary/20 pl-3">
                                {supportLinks.map((link) => (
                                    <Link
                                        key={link.name}
                                        href={link.href}
                                        onClick={onClose}
                                        className="flex items-center gap-2 px-3 py-2 text-sm text-muted-foreground hover:text-foreground rounded-lg hover:bg-secondary transition-colors"
                                    >
                                        <link.icon className="w-4 h-4" />
                                        {link.name}
                                    </Link>
                                ))}
                            </div>
                        )}
                    </div>
                </div>

                <div className="p-5 border-t space-y-3 mt-auto">
                    <div className="flex items-center justify-between mb-2">
                        <span className="text-sm font-medium">Appearance</span>
                        <ThemeToggle />
                    </div>
                    <Link href="/cart" onClick={onClose}>
                        <Button className="w-full" size="lg">
                            <ShoppingBag className="h-5 w-5 mr-2" />
                            View Cart
                        </Button>
                    </Link>
                    {!user && (
                        <Link href="/login" onClick={onClose}>
                            <Button variant="outline" className="w-full mt-2" size="lg">
                                <User className="h-5 w-5 mr-2" />
                                Login
                            </Button>
                        </Link>
                    )}
                    <p className="text-xs text-center text-muted-foreground">
                        Free shipping on orders over $100
                    </p>
                </div>
            </SheetContent>
        </Sheet>
    );
}
