"use client";

import { THREAD_COLORS } from "./constants";
import { Label } from "@/components/ui/label";
import { cn } from "@/lib/utils";

interface ColorPickerProps {
    selectedColor: string;
    onSelect: (color: string) => void;
}

export function ColorPicker({ selectedColor, onSelect }: ColorPickerProps) {
    return (
        <div className="space-y-3">
            <Label>Thread Color</Label>
            <div className="flex flex-wrap gap-3">
                {THREAD_COLORS.map((color) => (
                    <button
                        key={color.value}
                        onClick={() => onSelect(color.value)}
                        className={cn(
                            "h-8 w-8 rounded-full border-2 ring-offset-background transition-all hover:scale-110 focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2",
                            selectedColor === color.value
                                ? "border-primary ring-2 ring-primary"
                                : "border-transparent"
                        )}
                        style={{ backgroundColor: color.value }}
                        title={color.name}
                        aria-label={`Select ${color.name}`}
                    />
                ))}
            </div>
        </div>
    );
}
