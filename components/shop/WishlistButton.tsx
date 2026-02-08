"use client";

import { Heart } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useState, useTransition } from "react";
import { toggleWishlist } from "@/app/(shop)/actions/wishlist";
import { useRouter } from "next/navigation";
import { cn } from "@/lib/utils";
import { motion, AnimatePresence } from "framer-motion";
import { toast } from "sonner";

interface WishlistButtonProps {
    productId: string;
    productName?: string;
    initialIsInWishlist?: boolean;
    isAuthenticated?: boolean;
    variant?: "icon" | "default";
    size?: "sm" | "default" | "lg";
    className?: string;
}

export function WishlistButton({
    productId,
    productName = "Item",
    initialIsInWishlist = false,
    isAuthenticated = false,
    variant = "icon",
    size = "default",
    className,
}: WishlistButtonProps) {
    const [isInWishlist, setIsInWishlist] = useState(initialIsInWishlist);
    const [isPending, startTransition] = useTransition();
    const router = useRouter();

    const handleClick = (e: React.MouseEvent) => {
        e.preventDefault();
        e.stopPropagation();

        if (!isAuthenticated) {
            router.push("/login?redirect=" + encodeURIComponent(window.location.pathname));
            return;
        }

        const wasInWishlist = isInWishlist;
        // Optimistic update
        setIsInWishlist(!isInWishlist);

        // Show optimistic toast
        if (wasInWishlist) {
            toast.success("Removed from wishlist", {
                description: productName,
                icon: "💔",
            });
        } else {
            toast.success("Added to wishlist", {
                description: productName,
                icon: "❤️",
            });
        }

        startTransition(async () => {
            const result = await toggleWishlist(productId);
            if (result.error) {
                // Revert on error
                setIsInWishlist(wasInWishlist);
                toast.error("Something went wrong", {
                    description: result.error,
                });
            }
        });
    };

    const sizeClasses = {
        sm: "h-8 w-8",
        default: "h-10 w-10",
        lg: "h-12 w-12",
    };

    const iconSizes = {
        sm: "h-4 w-4",
        default: "h-5 w-5",
        lg: "h-6 w-6",
    };

    if (variant === "icon") {
        return (
            <Button
                variant="secondary"
                size="icon"
                onClick={handleClick}
                disabled={isPending}
                className={cn(
                    sizeClasses[size],
                    "rounded-full bg-background/80 backdrop-blur-sm border shadow-sm",
                    "hover:bg-background hover:scale-110 transition-all duration-200",
                    isPending && "opacity-50 cursor-not-allowed",
                    className
                )}
                aria-label={isInWishlist ? "Remove from wishlist" : "Add to wishlist"}
            >
                <AnimatePresence mode="wait">
                    <motion.div
                        key={isInWishlist ? "filled" : "empty"}
                        initial={{ scale: 0.5, opacity: 0 }}
                        animate={{ scale: 1, opacity: 1 }}
                        exit={{ scale: 0.5, opacity: 0 }}
                        transition={{ duration: 0.15 }}
                    >
                        <Heart
                            className={cn(
                                iconSizes[size],
                                "transition-colors duration-200",
                                isInWishlist
                                    ? "fill-red-500 text-red-500"
                                    : "text-muted-foreground hover:text-red-500"
                            )}
                        />
                    </motion.div>
                </AnimatePresence>
            </Button>
        );
    }

    return (
        <Button
            variant={isInWishlist ? "default" : "outline"}
            onClick={handleClick}
            disabled={isPending}
            className={cn(
                "gap-2 transition-all duration-200",
                isInWishlist && "bg-red-500 hover:bg-red-600 border-red-500",
                className
            )}
        >
            <Heart
                className={cn(
                    "h-4 w-4",
                    isInWishlist ? "fill-current" : ""
                )}
            />
            {isInWishlist ? "In Wishlist" : "Add to Wishlist"}
        </Button>
    );
}
