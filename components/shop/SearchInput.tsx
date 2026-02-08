"use client";

import { useState, useEffect, useTransition } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { Input } from "@/components/ui/input";
import { Search, Loader2 } from "lucide-react";

// Actually, let's implement debounce manually inside for simplicity if no hook exists.
// Checking if we have a hooks folder... likely not standard.
// Let's implement simple debounce.

interface SearchInputProps {
    className?: string;
    placeholder?: string;
}

export function SearchInput({ className, placeholder = "Search products..." }: SearchInputProps) {
    const router = useRouter();
    const searchParams = useSearchParams();
    const [isPending, startTransition] = useTransition();

    // Initial value from URL
    const initialQuery = searchParams.get("q") || "";
    const [value, setValue] = useState(initialQuery);

    // Sync state with URL if it changes externally (e.g. clear filters)
    useEffect(() => {
        setValue(searchParams.get("q") || "");
    }, [searchParams]);

    const handleSearch = (term: string) => {
        const params = new URLSearchParams(searchParams.toString());

        if (term) {
            params.set("q", term);
        } else {
            params.delete("q");
        }

        // Reset pagination if implementation existed (not yet, but good practice)
        // params.delete("page");

        startTransition(() => {
            // If we are NOT on the search page, we probably want to navigate TO the search page.
            if (window.location.pathname !== "/search") {
                router.push(`/search?${params.toString()}`);
            } else {
                router.replace(`/search?${params.toString()}`);
            }
        });
    };

    // Debounce effect
    useEffect(() => {
        // Only debounce if the value is different from the URL (to avoid loop on mount)
        if (value !== (searchParams.get("q") || "")) {
            const timeoutId = setTimeout(() => {
                handleSearch(value);
            }, 500); // 500ms debounce

            return () => clearTimeout(timeoutId);
        }
    }, [value]);


    return (
        <div className={`relative ${className}`}>
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <Input
                value={value}
                onChange={(e) => setValue(e.target.value)}
                placeholder={placeholder}
                className="pl-9 pr-4 rounded-full bg-secondary/50 border-transparent focus:border-primary focus:bg-background transition-colors"
                onKeyDown={(e) => {
                    if (e.key === "Enter") {
                        handleSearch(value);
                    }
                }}
            />
            {isPending && (
                <div className="absolute right-3 top-1/2 -translate-y-1/2">
                    <Loader2 className="h-4 w-4 animate-spin text-muted-foreground" />
                </div>
            )}
        </div>
    );
}
