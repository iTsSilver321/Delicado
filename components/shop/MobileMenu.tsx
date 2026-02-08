"use client";

import Link from "next/link";
import { Bed, Shirt, UtensilsCrossed, HelpCircle, Truck, Mail, ShoppingBag, ChevronDown, User } from "lucide-react";
import { Button } from "@/components/ui/button";
import { ThemeToggle } from "./ThemeToggle";
import { SearchInput } from "./SearchInput";
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

// Match desktop categories structure with descriptions
const categories = [
    { name: "Bedding", href: "/products/bedding", icon: Bed, desc: "Pillows, sheets & more" },
    { name: "Clothing", href: "/products/clothing", icon: Shirt, desc: "Robes, shirts & apparel" },
    { name: "Tableware", href: "/products/tableware", icon: UtensilsCrossed, desc: "Table linens & decor" },
];

const supportLinks = [
    { name: "FAQ", href: "/faq", icon: HelpCircle, desc: "Common questions" },
    { name: "Shipping & Returns", href: "/shipping", icon: Truck, desc: "Delivery information" },
    { name: "Contact Us", href: "/contact", icon: Mail, desc: "Get in touch" },
];

export function MobileMenu({ isOpen, onClose, user }: MobileMenuProps) {
    const [isShopExpanded, setIsShopExpanded] = useState(true);
    const [isSupportExpanded, setIsSupportExpanded] = useState(false);

    return (
        <Sheet open={isOpen} onOpenChange={(open) => !open && onClose()}>
            <SheetContent side="left" className="w-[300px] sm:w-[400px] p-0 flex flex-col h-full">
                <SheetHeader className="p-4 border-b text-left">
                    <SheetTitle className="font-serif text-2xl font-bold tracking-tight text-primary">
                        <Link href="/" onClick={onClose}>
                            Delicado
                        </Link>
                    </SheetTitle>
                    <SheetDescription className="sr-only">
                        Mobile navigation menu
                    </SheetDescription>
                </SheetHeader>

                {/* Search Input - matching desktop */}
                <div className="p-4 border-b">
                    <SearchInput placeholder="Search products..." />
                </div>

                <div className="flex-1 overflow-y-auto p-4 space-y-4">
                    {/* Shop Section - Collapsible like desktop dropdown */}
                    <div>
                        <button
                            onClick={() => setIsShopExpanded(!isShopExpanded)}
                            className="flex items-center justify-between w-full px-3 py-2 text-sm font-medium rounded-lg hover:bg-secondary/50 transition-colors"
                        >
                            <span className="text-xs font-medium text-muted-foreground uppercase tracking-wider">Shop</span>
                            <ChevronDown className={`h-4 w-4 transition-transform ${isShopExpanded ? 'rotate-180' : ''}`} />
                        </button>
                        {isShopExpanded && (
                            <div className="mt-2 space-y-1">
                                {categories.map((category) => (
                                    <Link
                                        key={category.name}
                                        href={category.href}
                                        onClick={onClose}
                                        className="flex items-center gap-3 px-3 py-3 rounded-lg hover:bg-secondary transition-colors"
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
                                <Link
                                    href="/search"
                                    onClick={onClose}
                                    className="block px-3 py-2 text-sm font-medium text-primary hover:underline"
                                >
                                    Shop All Products →
                                </Link>
                            </div>
                        )}
                    </div>

                    {/* Support Section - Collapsible */}
                    <div>
                        <button
                            onClick={() => setIsSupportExpanded(!isSupportExpanded)}
                            className="flex items-center justify-between w-full px-3 py-2 text-sm font-medium rounded-lg hover:bg-secondary/50 transition-colors"
                        >
                            <span className="text-xs font-medium text-muted-foreground uppercase tracking-wider">Support</span>
                            <ChevronDown className={`h-4 w-4 transition-transform ${isSupportExpanded ? 'rotate-180' : ''}`} />
                        </button>
                        {isSupportExpanded && (
                            <div className="mt-2 space-y-1">
                                {supportLinks.map((link) => (
                                    <Link
                                        key={link.name}
                                        href={link.href}
                                        onClick={onClose}
                                        className="flex items-center gap-3 px-3 py-3 rounded-lg hover:bg-secondary transition-colors"
                                    >
                                        <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-primary/10">
                                            <link.icon className="h-5 w-5 text-primary" />
                                        </div>
                                        <div>
                                            <p className="font-medium text-sm">{link.name}</p>
                                            <p className="text-xs text-muted-foreground">{link.desc}</p>
                                        </div>
                                    </Link>
                                ))}
                            </div>
                        )}
                    </div>
                </div>

                <div className="p-4 border-t space-y-3 mt-auto">
                    <div className="flex items-center justify-between mb-3">
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
