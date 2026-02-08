"use client";

import { useState, useEffect } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { Slider } from "@/components/ui/slider";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select";
import {
    Sheet,
    SheetContent,
    SheetDescription,
    SheetHeader,
    SheetTitle,
    SheetTrigger,
} from "@/components/ui/sheet";
import { Filter, X, Bed, Shirt, UtensilsCrossed, ArrowUpDown, DollarSign, Check, SlidersHorizontal } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { cn } from "@/lib/utils";

interface ProductFilterProps {
    maxPrice?: number;
}

const CATEGORIES = [
    { name: "Bedding", value: "bedding", icon: Bed },
    { name: "Clothing", value: "clothing", icon: Shirt },
    { name: "Tableware", value: "tableware", icon: UtensilsCrossed },
];

const SORT_OPTIONS = [
    { label: "Newest", value: "newest" },
    { label: "Price: Low to High", value: "price_asc" },
    { label: "Price: High to Low", value: "price_desc" },
];

export function ProductFilter({ maxPrice = 1000 }: ProductFilterProps) {
    const router = useRouter();
    const searchParams = useSearchParams();

    const [priceRange, setPriceRange] = useState([0, maxPrice]);
    const [selectedCategories, setSelectedCategories] = useState<string[]>([]);
    const [sort, setSort] = useState("newest");
    const [isOpen, setIsOpen] = useState(false);

    // Initialize state from URL params
    useEffect(() => {
        const min = searchParams.get("min") ? Number(searchParams.get("min")) : 0;
        const max = searchParams.get("max") ? Number(searchParams.get("max")) : maxPrice;
        setPriceRange([min, max]);

        const cats = searchParams.get("category")?.split(",") || [];
        setSelectedCategories(cats.filter(Boolean));

        const s = searchParams.get("sort") || "newest";
        setSort(s);
    }, [searchParams, maxPrice]);

    // Update URL function
    const applyFilters = (newPrice: number[], newCats: string[], newSort: string) => {
        const params = new URLSearchParams(searchParams.toString());

        if (newPrice[0] > 0) params.set("min", newPrice[0].toString());
        else params.delete("min");

        if (newPrice[1] < maxPrice) params.set("max", newPrice[1].toString());
        else params.delete("max");

        if (newCats.length > 0) params.set("category", newCats.join(","));
        else params.delete("category");

        if (newSort !== "newest") params.set("sort", newSort);
        else params.delete("sort");

        router.push(`/search?${params.toString()}`);
    };

    const handlePriceChange = (value: number[]) => {
        setPriceRange(value);
    };

    const handlePriceCommit = (value: number[]) => {
        applyFilters(value, selectedCategories, sort);
    };

    const handleCategoryChange = (category: string) => {
        const newCats = selectedCategories.includes(category)
            ? selectedCategories.filter((c) => c !== category)
            : [...selectedCategories, category];
        setSelectedCategories(newCats);
        applyFilters(priceRange, newCats, sort);
    };

    const handleSortChange = (value: string) => {
        setSort(value);
        applyFilters(priceRange, selectedCategories, value);
    };

    const clearFilters = () => {
        setPriceRange([0, maxPrice]);
        setSelectedCategories([]);
        setSort("newest");
        router.push("/search");
    };

    const activeFiltersCount =
        (priceRange[0] > 0 || priceRange[1] < maxPrice ? 1 : 0) +
        selectedCategories.length +
        (sort !== "newest" ? 1 : 0);

    // Desktop filter content (original style)
    const desktopFilterContent = (
        <div className="space-y-6">
            {/* Sort */}
            <div className="space-y-2">
                <Label>Sort By</Label>
                <Select value={sort} onValueChange={handleSortChange}>
                    <SelectTrigger>
                        <SelectValue placeholder="Sort by" />
                    </SelectTrigger>
                    <SelectContent>
                        {SORT_OPTIONS.map((option) => (
                            <SelectItem key={option.value} value={option.value}>
                                {option.label}
                            </SelectItem>
                        ))}
                    </SelectContent>
                </Select>
            </div>

            <Separator />

            {/* Categories */}
            <div className="space-y-4">
                <Label>Categories</Label>
                <div className="space-y-2">
                    {CATEGORIES.map((category) => (
                        <button
                            key={category.value}
                            onClick={() => handleCategoryChange(category.value)}
                            className={cn(
                                "flex items-center gap-3 w-full p-2 rounded-lg transition-colors text-left",
                                selectedCategories.includes(category.value)
                                    ? "bg-primary/10 text-primary"
                                    : "hover:bg-secondary"
                            )}
                        >
                            <div className={cn(
                                "flex h-8 w-8 items-center justify-center rounded-lg",
                                selectedCategories.includes(category.value)
                                    ? "bg-primary text-primary-foreground"
                                    : "bg-secondary"
                            )}>
                                <category.icon className="h-4 w-4" />
                            </div>
                            <span className="text-sm font-medium">{category.name}</span>
                            {selectedCategories.includes(category.value) && (
                                <Check className="h-4 w-4 ml-auto" />
                            )}
                        </button>
                    ))}
                </div>
            </div>

            <Separator />

            {/* Price Range */}
            <div className="space-y-4">
                <div className="flex items-center justify-between">
                    <Label>Price Range</Label>
                    <span className="text-sm text-muted-foreground">
                        ${priceRange[0]} - ${priceRange[1]}
                    </span>
                </div>
                <Slider
                    defaultValue={[0, maxPrice]}
                    value={priceRange}
                    max={maxPrice}
                    step={10}
                    minStepsBetweenThumbs={1}
                    onValueChange={handlePriceChange}
                    onValueCommit={handlePriceCommit}
                    className="py-4"
                />
            </div>

            {/* Clear Filters Button */}
            {activeFiltersCount > 0 && (
                <Button
                    variant="outline"
                    className="w-full"
                    onClick={clearFilters}
                >
                    Clear Filters
                    <X className="w-4 h-4 ml-2" />
                </Button>
            )}
        </div>
    );

    // Enhanced mobile filter content
    const mobileFilterContent = (
        <div className="flex flex-col h-full">
            <div className="flex-1 overflow-y-auto space-y-6 pb-4">
                {/* Sort Section */}
                <div className="space-y-3">
                    <div className="flex items-center gap-2">
                        <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-primary/10">
                            <ArrowUpDown className="h-4 w-4 text-primary" />
                        </div>
                        <Label className="text-base font-semibold">Sort By</Label>
                    </div>
                    <div className="grid grid-cols-1 gap-2">
                        {SORT_OPTIONS.map((option) => (
                            <button
                                key={option.value}
                                onClick={() => handleSortChange(option.value)}
                                className={cn(
                                    "flex items-center justify-between px-4 py-3 rounded-xl border transition-all",
                                    sort === option.value
                                        ? "border-primary bg-primary/5 text-primary"
                                        : "border-border hover:border-primary/50 hover:bg-secondary/50"
                                )}
                            >
                                <span className="text-sm font-medium">{option.label}</span>
                                {sort === option.value && (
                                    <Check className="h-4 w-4" />
                                )}
                            </button>
                        ))}
                    </div>
                </div>

                <Separator />

                {/* Categories Section */}
                <div className="space-y-3">
                    <div className="flex items-center gap-2">
                        <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-primary/10">
                            <SlidersHorizontal className="h-4 w-4 text-primary" />
                        </div>
                        <Label className="text-base font-semibold">Categories</Label>
                    </div>
                    <div className="grid grid-cols-1 gap-2">
                        {CATEGORIES.map((category) => (
                            <button
                                key={category.value}
                                onClick={() => handleCategoryChange(category.value)}
                                className={cn(
                                    "flex items-center gap-3 px-4 py-3 rounded-xl border transition-all",
                                    selectedCategories.includes(category.value)
                                        ? "border-primary bg-primary/5"
                                        : "border-border hover:border-primary/50 hover:bg-secondary/50"
                                )}
                            >
                                <div className={cn(
                                    "flex h-10 w-10 items-center justify-center rounded-lg transition-colors",
                                    selectedCategories.includes(category.value)
                                        ? "bg-primary text-primary-foreground"
                                        : "bg-secondary"
                                )}>
                                    <category.icon className="h-5 w-5" />
                                </div>
                                <span className={cn(
                                    "text-sm font-medium flex-1 text-left",
                                    selectedCategories.includes(category.value) && "text-primary"
                                )}>
                                    {category.name}
                                </span>
                                {selectedCategories.includes(category.value) && (
                                    <div className="flex h-6 w-6 items-center justify-center rounded-full bg-primary text-primary-foreground">
                                        <Check className="h-3 w-3" />
                                    </div>
                                )}
                            </button>
                        ))}
                    </div>
                </div>

                <Separator />

                {/* Price Range Section */}
                <div className="space-y-4">
                    <div className="flex items-center gap-2">
                        <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-primary/10">
                            <DollarSign className="h-4 w-4 text-primary" />
                        </div>
                        <Label className="text-base font-semibold">Price Range</Label>
                    </div>

                    {/* Price display cards */}
                    <div className="flex items-center gap-3">
                        <div className="flex-1 px-4 py-3 rounded-xl border bg-secondary/30 text-center">
                            <p className="text-xs text-muted-foreground mb-1">Min</p>
                            <p className="text-lg font-semibold">${priceRange[0]}</p>
                        </div>
                        <div className="text-muted-foreground">—</div>
                        <div className="flex-1 px-4 py-3 rounded-xl border bg-secondary/30 text-center">
                            <p className="text-xs text-muted-foreground mb-1">Max</p>
                            <p className="text-lg font-semibold">${priceRange[1]}</p>
                        </div>
                    </div>

                    <div className="px-2 pt-2">
                        <Slider
                            defaultValue={[0, maxPrice]}
                            value={priceRange}
                            max={maxPrice}
                            step={10}
                            minStepsBetweenThumbs={1}
                            onValueChange={handlePriceChange}
                            onValueCommit={handlePriceCommit}
                            className="py-4"
                        />
                    </div>
                </div>
            </div>

            {/* Sticky bottom actions */}
            <div className="border-t pt-4 mt-auto space-y-3 bg-background">
                {activeFiltersCount > 0 && (
                    <Button
                        variant="outline"
                        className="w-full"
                        onClick={clearFilters}
                    >
                        <X className="w-4 h-4 mr-2" />
                        Clear All Filters
                    </Button>
                )}
                <Button
                    className="w-full"
                    size="lg"
                    onClick={() => setIsOpen(false)}
                >
                    Show Results
                    {activeFiltersCount > 0 && (
                        <Badge variant="secondary" className="ml-2 bg-primary-foreground/20">
                            {activeFiltersCount} active
                        </Badge>
                    )}
                </Button>
            </div>
        </div>
    );

    return (
        <>
            {/* Desktop Sidebar */}
            <div className="hidden lg:block w-64 space-y-6 sticky top-24 h-fit">
                <div className="flex items-center gap-2 font-serif text-xl font-bold">
                    <Filter className="w-5 h-5" /> Filters
                </div>
                {desktopFilterContent}
            </div>

            {/* Mobile Trigger */}
            <div className="lg:hidden mb-6">
                <Sheet open={isOpen} onOpenChange={setIsOpen}>
                    <SheetTrigger asChild>
                        <Button variant="outline" className="w-full gap-2">
                            <Filter className="w-4 h-4" />
                            <span>Filters</span>
                            {activeFiltersCount > 0 && (
                                <Badge variant="default" className="ml-auto">
                                    {activeFiltersCount}
                                </Badge>
                            )}
                        </Button>
                    </SheetTrigger>
                    <SheetContent side="left" className="w-[320px] sm:w-[400px] flex flex-col p-0">
                        <SheetHeader className="p-4 border-b">
                            <SheetTitle className="font-serif text-xl flex items-center gap-2">
                                <Filter className="w-5 h-5 text-primary" />
                                Filters
                            </SheetTitle>
                            <SheetDescription>
                                Refine your search to find the perfect item.
                            </SheetDescription>
                        </SheetHeader>
                        <div className="flex-1 overflow-hidden p-4">
                            {mobileFilterContent}
                        </div>
                    </SheetContent>
                </Sheet>
            </div>
        </>
    );
}

