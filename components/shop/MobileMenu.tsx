"use client";

import Link from "next/link";
import { motion, AnimatePresence } from "framer-motion";
import { X, Bed, Shirt, UtensilsCrossed, HelpCircle, Truck, Mail, ShoppingBag } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useCartStore } from "@/lib/store";

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

const menuVariants = {
    closed: { x: "-100%", opacity: 0 },
    open: { x: 0, opacity: 1 },
};

const linkVariants = {
    closed: { x: -20, opacity: 0 },
    open: (i: number) => ({
        x: 0,
        opacity: 1,
        transition: { delay: 0.1 + i * 0.05 },
    }),
};

export function MobileMenu({ isOpen, onClose }: MobileMenuProps) {
    const { openCart } = useCartStore();

    return (
        <AnimatePresence>
            {isOpen && (
                <>
                    {/* Backdrop */}
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        onClick={onClose}
                        className="fixed inset-0 z-50 bg-black/50 backdrop-blur-sm md:hidden"
                    />

                    {/* Menu Panel */}
                    <motion.div
                        initial="closed"
                        animate="open"
                        exit="closed"
                        variants={menuVariants}
                        transition={{ type: "spring", damping: 25, stiffness: 200 }}
                        className="fixed inset-y-0 left-0 z-50 w-full max-w-xs bg-background shadow-2xl md:hidden"
                    >
                        <div className="flex flex-col h-full">
                            {/* Header */}
                            <div className="flex items-center justify-between p-4 border-b">
                                <Link
                                    href="/"
                                    onClick={onClose}
                                    className="font-serif text-2xl font-bold tracking-tight text-primary"
                                >
                                    Delicado
                                </Link>
                                <Button variant="ghost" size="icon" onClick={onClose}>
                                    <X className="h-6 w-6" />
                                    <span className="sr-only">Close menu</span>
                                </Button>
                            </div>

                            {/* Links */}
                            <div className="flex-1 overflow-y-auto p-4 space-y-6">
                                {menuLinks.map((section, sectionIndex) => (
                                    <div key={section.title}>
                                        <p className="text-xs font-medium text-muted-foreground uppercase tracking-wider mb-3">
                                            {section.title}
                                        </p>
                                        <div className="space-y-1">
                                            {section.links.map((link, linkIndex) => (
                                                <motion.div
                                                    key={link.name}
                                                    custom={sectionIndex * 4 + linkIndex}
                                                    variants={linkVariants}
                                                >
                                                    <Link
                                                        href={link.href}
                                                        onClick={onClose}
                                                        className="flex items-center gap-3 px-3 py-3 rounded-lg hover:bg-secondary transition-colors"
                                                    >
                                                        <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-primary/10">
                                                            <link.icon className="h-5 w-5 text-primary" />
                                                        </div>
                                                        <span className="font-medium">{link.name}</span>
                                                    </Link>
                                                </motion.div>
                                            ))}
                                        </div>
                                    </div>
                                ))}
                            </div>

                            {/* Footer Actions */}
                            <div className="p-4 border-t space-y-3">
                                <Button
                                    className="w-full"
                                    size="lg"
                                    onClick={() => {
                                        onClose();
                                        openCart();
                                    }}
                                >
                                    <ShoppingBag className="h-5 w-5 mr-2" />
                                    View Cart
                                </Button>
                                <p className="text-xs text-center text-muted-foreground">
                                    Free shipping on orders over $100
                                </p>
                            </div>
                        </div>
                    </motion.div>
                </>
            )}
        </AnimatePresence>
    );
}
