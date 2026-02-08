"use client";

import { Package, AlertTriangle, XCircle } from "lucide-react";
import { cn } from "@/lib/utils";

interface StockBadgeProps {
    stockQuantity: number | null | undefined;
    lowStockThreshold?: number;
    className?: string;
    showIcon?: boolean;
}

type StockStatus = "in_stock" | "low_stock" | "out_of_stock";

function getStockStatus(quantity: number | null | undefined, threshold: number): StockStatus {
    if (quantity === null || quantity === undefined) {
        return "in_stock"; // Default to in stock if unknown
    }
    if (quantity <= 0) {
        return "out_of_stock";
    }
    if (quantity <= threshold) {
        return "low_stock";
    }
    return "in_stock";
}

const statusConfig: Record<StockStatus, { label: string; className: string; icon: typeof Package }> = {
    in_stock: {
        label: "In Stock",
        className: "bg-emerald-500/10 text-emerald-600 border-emerald-500/20",
        icon: Package,
    },
    low_stock: {
        label: "Low Stock",
        className: "bg-amber-500/10 text-amber-600 border-amber-500/20",
        icon: AlertTriangle,
    },
    out_of_stock: {
        label: "Out of Stock",
        className: "bg-red-500/10 text-red-600 border-red-500/20",
        icon: XCircle,
    },
};

export function StockBadge({
    stockQuantity,
    lowStockThreshold = 10,
    className,
    showIcon = true,
}: StockBadgeProps) {
    const status = getStockStatus(stockQuantity, lowStockThreshold);
    const config = statusConfig[status];
    const Icon = config.icon;

    return (
        <div
            className={cn(
                "inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-medium border transition-colors",
                config.className,
                className
            )}
        >
            {showIcon && <Icon className="w-3 h-3" />}
            <span>{config.label}</span>
        </div>
    );
}

export function getStockStatusForButton(stockQuantity: number | null | undefined, lowStockThreshold = 10): StockStatus {
    return getStockStatus(stockQuantity, lowStockThreshold);
}
