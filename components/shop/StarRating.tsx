"use client";

import { Star, StarHalf } from "lucide-react";
import { useState } from "react";
import { cn } from "@/lib/utils";

interface StarRatingProps {
    value: number; // Current rating value (e.g., 4.5 or 3)
    onChange?: (value: number) => void; // Callback when a star is clicked
    readOnly?: boolean; // If true, user cannot interact
    size?: number; // Size of the stars in pixels
    className?: string; // Additional classes for the container
}

export function StarRating({
    value,
    onChange,
    readOnly = false,
    size = 20,
    className,
}: StarRatingProps) {
    const [hoverValue, setHoverValue] = useState<number | null>(null);

    // Determine what to display: hover value (if interacting) or actual value
    const displayValue = hoverValue !== null ? hoverValue : value;

    // Helper to render a single star
    const renderStar = (index: number) => {
        // Check if we need a half star logic for read-only display
        // Logic: index is 1-based (1, 2, 3, 4, 5)
        // If value is 4.5, then:
        // 1: Full
        // 2: Full
        // 3: Full
        // 4: Full
        // 5: Half? No, 4.5 means 4 full and 1 half.
        // Wait, let's simplify.
        // If we are readOnly, we show precision.
        // If we are interactive, we only show integers on hover.

        const isFull = index <= Math.floor(displayValue);
        const isHalf = readOnly && !isFull && index === Math.ceil(displayValue) && displayValue % 1 >= 0.25;

        // For input mode (readOnly=false), we only care about integers
        // hoverValue will always be integer if set by mouse enter

        return (
            <button
                key={index}
                type="button"
                disabled={readOnly}
                onClick={() => !readOnly && onChange?.(index)}
                onMouseEnter={() => !readOnly && setHoverValue(index)}
                className={cn(
                    "transition-transform focus:outline-none",
                    readOnly ? "cursor-default" : "cursor-pointer hover:scale-110 active:scale-95"
                )}
            >
                <div className="relative">
                    {/* Background Star (Empty) */}
                    <Star
                        size={size}
                        className={cn(
                            "text-muted-foreground/20 fill-transparent absolute top-0 left-0",
                            isFull || isHalf ? "invisible" : "visible"
                        )}
                    />

                    {/* Foreground Star (Full or Half) */}
                    {isFull ? (
                        <Star
                            size={size}
                            className="text-yellow-500 fill-yellow-500"
                        />
                    ) : isHalf ? (
                        <div className="relative">
                            {/* Background used for alignment, hidden */}
                            <Star size={size} className="invisible" />
                            <div className="absolute inset-0 overflow-hidden w-1/2">
                                <Star size={size} className="text-yellow-500 fill-yellow-500" />
                            </div>
                            <Star size={size} className="absolute inset-0 text-muted-foreground/20 fill-transparent pointer-events-none" />
                        </div>
                    ) : (
                        <Star
                            size={size}
                            className="text-muted-foreground/20 fill-transparent"
                        />
                    )}
                </div>
            </button>
        );
    };

    // Re-simplified render logic for robustness
    /*
      Logic:
      Show 5 stars.
      For each star i (1 to 5):
      - If i <= value: Full yellow
      - If i > value but i - 1 < value (e.g. value=4.5, i=5): Check decimals
        - If >= 0.75: Full
        - If >= 0.25: Half
        - Else: Empty
      - If i > value: Empty
    */

    return (
        <div
            className={cn("flex items-center gap-0.5", className)}
            onMouseLeave={() => setHoverValue(null)}
        >
            {[1, 2, 3, 4, 5].map((i) => {
                // If NOT readOnly (interactive), always be integers
                if (!readOnly) {
                    const filled = i <= (hoverValue ?? Math.ceil(value));
                    // Wait, input is integer. value should be integer. if value is passed as float but interactive??
                    // Assume interactive uses integers.
                    return (
                        <button
                            key={i}
                            type="button"
                            onClick={() => onChange?.(i)}
                            onMouseEnter={() => setHoverValue(i)}
                            className="focus:outline-none transition-transform hover:scale-110 active:scale-95 cursor-pointer"
                        >
                            <Star
                                size={size}
                                className={cn(
                                    "transition-colors",
                                    i <= (hoverValue ?? value)
                                        ? "text-yellow-500 fill-yellow-500"
                                        : "text-muted-foreground/30 fill-transparent"
                                )}
                            />
                        </button>
                    );
                }

                // Read Only Logic (Display Average)
                const isFull = i <= Math.floor(value);
                const isHalf = !isFull && i === Math.ceil(value) && (value % 1) >= 0.25 && (value % 1) < 0.75;
                const isAlmostFull = !isFull && !isHalf && i === Math.ceil(value) && (value % 1) >= 0.75;
                // Note: if >= 0.75, we treat as full visually for 5-star usually, or just stick to half.
                // Let's stick to simple:
                // Full if i <= value
                // Half if i > value && i - 1 < value && fractional part > 0

                return (
                    <div key={i} className={cn("relative", readOnly && "cursor-default")}>
                        {/* Base Empty Star */}
                        <Star size={size} className="text-muted-foreground/30 fill-transparent" />

                        {/* Overlay Full/Half */}
                        <div className={cn("absolute inset-0 overflow-hidden",
                            isFull || isAlmostFull ? "w-full" : isHalf ? "w-1/2" : "w-0"
                        )}>
                            <Star size={size} className="text-yellow-500 fill-yellow-500" />
                        </div>
                    </div>
                );
            })}
        </div>
    );
}
