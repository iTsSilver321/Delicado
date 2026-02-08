"use client";

import { useCustomizerStore } from "@/lib/store";
import { useEffect, useState, useRef, useCallback } from "react";

interface ProductPreviewProps {
    productType?: 'pillow' | 'tshirt' | 'tablecloth';
    productImage?: string;
    customization?: {
        text: string;
        font: string;
        color: string;
        textSize: number;
        position: { x: number; y: number };
    };
}

// Product images from local assets
const PRODUCT_IMAGES: Record<string, string> = {
    pillow: '/products/Pillow.png',
    tshirt: '/products/T-shirt.png',
    tablecloth: '/products/Tablecloth.png',
};

// Text positioning defaults for each product
const PRODUCT_CONFIG: Record<string, { x: number; y: number }> = {
    pillow: { x: 50, y: 50 },
    tshirt: { x: 50, y: 40 },
    tablecloth: { x: 50, y: 50 },
};

export function ProductPreview({ productType = 'pillow', productImage, customization }: ProductPreviewProps) {
    // Get store state
    const store = useCustomizerStore();

    // Determine source of truth: props (for cart/static view) or store (for active customization)
    const isStatic = !!customization;

    const text = isStatic ? customization.text : store.text;
    const font = isStatic ? customization.font : store.font;
    const color = isStatic ? customization.color : store.color;
    const textSize = isStatic ? customization.textSize : store.textSize;

    // Position state handled differently for static vs interactive
    const [internalPosition, setInternalPosition] = useState(PRODUCT_CONFIG[productType] || { x: 50, y: 50 });
    const position = isStatic ? customization.position : internalPosition;

    const [isDragging, setIsDragging] = useState(false);
    const containerRef = useRef<HTMLDivElement>(null);

    const imageSrc = PRODUCT_IMAGES[productType] || PRODUCT_IMAGES.pillow;

    // Reset position when product type changes (only for interactive mode)
    useEffect(() => {
        if (!isStatic) {
            setInternalPosition(PRODUCT_CONFIG[productType] || { x: 50, y: 50 });
        }
    }, [productType, isStatic]);

    // Drag handlers - update position directly without state batching delays
    const updatePosition = useCallback((clientX: number, clientY: number) => {
        if (!containerRef.current || isStatic) return;
        const rect = containerRef.current.getBoundingClientRect();
        const newX = Math.max(10, Math.min(90, ((clientX - rect.left) / rect.width) * 100));
        const newY = Math.max(10, Math.min(90, ((clientY - rect.top) / rect.height) * 100));
        // Update local state for immediate feedback
        setInternalPosition({ x: newX, y: newY });
        // Update store (debouncing might be better but direct update is fine for now)
        useCustomizerStore.getState().setPosition({ x: newX, y: newY });
    }, [isStatic]);

    const handleMouseDown = useCallback((e: React.MouseEvent) => {
        if (isStatic) return;
        e.preventDefault();
        setIsDragging(true);
    }, [isStatic]);

    const handleMouseMove = useCallback((e: React.MouseEvent) => {
        if (!isDragging || isStatic) return;
        updatePosition(e.clientX, e.clientY);
    }, [isDragging, updatePosition, isStatic]);

    const handleMouseUp = useCallback(() => setIsDragging(false), []);

    const handleTouchStart = useCallback((e: React.TouchEvent) => {
        if (isStatic) return;
        e.preventDefault();
        setIsDragging(true);
    }, [isStatic]);

    const handleTouchMove = useCallback((e: React.TouchEvent) => {
        if (!isDragging || isStatic) return;
        const touch = e.touches[0];
        updatePosition(touch.clientX, touch.clientY);
    }, [isDragging, updatePosition, isStatic]);

    // Font size based on textSize slider (16px to 64px range)
    // Scale down slightly for smaller containers if needed, but for now exact pixel match
    const fontSize = 16 + (textSize * 48);

    // Get the font family name
    const getFontFamily = () => {
        if (font === 'Playfair Display') return '"Playfair Display", serif';
        if (font === 'Geist') return '"Geist Sans", sans-serif';
        return `"${font}", sans-serif`;
    };

    return (
        <div
            ref={containerRef}
            className={`relative w-full h-full overflow-hidden rounded-xl select-none ${!isStatic ? 'cursor-default' : ''}`}
            onMouseMove={handleMouseMove}
            onMouseUp={handleMouseUp}
            onMouseLeave={handleMouseUp}
            onTouchMove={handleTouchMove}
            onTouchEnd={handleMouseUp}
        >
            {/* Product Image - Full background */}
            <div
                className="absolute inset-0"
                style={{
                    backgroundImage: `url(${imageSrc})`,
                    backgroundSize: 'cover',
                    backgroundPosition: 'center',
                }}
            />

            {/* Draggable/Static Text */}
            {text && (
                <div
                    className={`absolute ${!isStatic ? 'cursor-grab active:cursor-grabbing' : ''}`}
                    style={{
                        left: `${position.x}%`,
                        top: `${position.y}%`,
                        transform: 'translate(-50%, -50%)',
                        fontSize: `${fontSize}px`,
                        fontFamily: getFontFamily(),
                        color: color,
                        fontWeight: 'bold',
                        textShadow: '2px 2px 4px rgba(0,0,0,0.5)',
                        whiteSpace: 'nowrap',
                        userSelect: 'none',
                    }}
                    onMouseDown={handleMouseDown}
                    onTouchStart={handleTouchStart}
                >
                    {text}
                </div>
            )}

            {/* Drag hint - only in interactive mode */}
            {text && !isDragging && !isStatic && (
                <div className="absolute bottom-4 inset-x-0 text-center pointer-events-none">
                    <span className="text-xs text-white/70 bg-black/50 px-3 py-1 rounded-full">
                        Drag to position text
                    </span>
                </div>
            )}
        </div>
    );
}
