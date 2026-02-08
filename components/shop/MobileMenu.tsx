"use client";

import Link from "next/link";
import { Bed, Shirt, UtensilsCrossed, HelpCircle, Truck, Mail, ShoppingBag } from "lucide-react";
import { Button } from "@/components/ui/button";
import { ThemeToggle } from "./ThemeToggle";

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
}

const menuLinks = [
    {
        title: "Shop",
        links: [
            { name: "Bedding", href: "/products/bedding", icon: Bed },
            { name: "Clothing", href: "/products/clothing", icon: Shirt },
            { name: "Tableware", href: "/products/tableware", icon: UtensilsCrossed },
            { name: "All Collections", href: "/collections", icon: ShoppingBag },
        ]
    },
    {
        title: "Support",
        links: [
            { name: "FAQ", href: "/faq", icon: HelpCircle },
            { name: "Shipping & Returns", href: "/shipping", icon: Truck },
            { name: "Contact Us", href: "/contact", icon: Mail },
        ]
    }
];



export function MobileMenu({ isOpen, onClose }: MobileMenuProps) {

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

                <div className="flex-1 overflow-y-auto p-4 space-y-6">
                    {menuLinks.map((section) => (
                        <div key={section.title}>
                            <p className="text-xs font-medium text-muted-foreground uppercase tracking-wider mb-3">
                                {section.title}
                            </p>
                            <div className="space-y-1">
                                {section.links.map((link) => (
                                    <Link
                                        key={link.name}
                                        href={link.href}
                                        onClick={onClose}
                                        className="flex items-center gap-3 px-3 py-3 rounded-lg hover:bg-secondary transition-colors"
                                    >
                                        <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-primary/10">
                                            <link.icon className="h-5 w-5 text-primary" />
                                        </div>
                                        <span className="font-medium">{link.name}</span>
                                    </Link>
                                ))}
                            </div>
                        </div>
                    ))}
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
                    <p className="text-xs text-center text-muted-foreground">
                        Free shipping on orders over $100
                    </p>
                </div>
            </SheetContent>
        </Sheet>
    );
}
