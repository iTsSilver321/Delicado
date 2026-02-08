"use client";

import { useEffect, useState } from "react";
import { EMBROIDERY_FONTS } from "./constants";
import { Label } from "@/components/ui/label";
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select";

interface FontPickerProps {
    selectedFont: string;
    onSelect: (font: string) => void;
}

export function FontPicker({ selectedFont, onSelect }: FontPickerProps) {
    // Fix hydration mismatch by only rendering Select on client
    const [mounted, setMounted] = useState(false);

    useEffect(() => {
        setMounted(true);
    }, []);

    return (
        <div className="space-y-3">
            <Label>Typography</Label>
            {mounted ? (
                <Select value={selectedFont} onValueChange={onSelect}>
                    <SelectTrigger className="w-full">
                        <SelectValue placeholder="Select a font" />
                    </SelectTrigger>
                    <SelectContent>
                        {EMBROIDERY_FONTS.map((font) => (
                            <SelectItem key={font.value} value={font.value} className={font.class}>
                                {font.name}
                            </SelectItem>
                        ))}
                    </SelectContent>
                </Select>
            ) : (
                // Skeleton while hydrating
                <div className="h-9 w-full rounded-md border border-input bg-transparent animate-pulse" />
            )}
        </div>
    );
}
