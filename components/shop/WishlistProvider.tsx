"use client";

import React, { createContext, useContext, useState, useEffect } from "react";

interface WishlistContextType {
    isAuthenticated: boolean;
    wishlistIds: string[];
    addWishlistId: (id: string) => void;
    removeWishlistId: (id: string) => void;
}

const WishlistContext = createContext<WishlistContextType | undefined>(undefined);

interface WishlistProviderProps {
    children: React.ReactNode;
    isAuthenticated: boolean;
    initialWishlistIds: string[];
}

export function WishlistProvider({
    children,
    isAuthenticated,
    initialWishlistIds,
}: WishlistProviderProps) {
    const [wishlistIds, setWishlistIds] = useState<string[]>(initialWishlistIds);

    // Sync state if initialWishlistIds changes (e.g. from server action revalidation)
    useEffect(() => {
        setWishlistIds(initialWishlistIds);
    }, [initialWishlistIds]);

    const addWishlistId = (id: string) => {
        setWishlistIds((prev) => (prev.includes(id) ? prev : [...prev, id]));
    };

    const removeWishlistId = (id: string) => {
        setWishlistIds((prev) => prev.filter((pId) => pId !== id));
    };

    return (
        <WishlistContext.Provider value={{ isAuthenticated, wishlistIds, addWishlistId, removeWishlistId }}>
            {children}
        </WishlistContext.Provider>
    );
}

export function useWishlist() {
    const context = useContext(WishlistContext);
    if (context === undefined) {
        throw new Error("useWishlist must be used within a WishlistProvider");
    }
    return context;
}
