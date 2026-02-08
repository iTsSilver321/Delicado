"use client";

import { useState, useEffect } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { Slider } from "@/components/ui/slider";
import { Checkbox } from "@/components/ui/checkbox";
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
import { Filter, X } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";

interface ProductFilterProps {
    maxPrice?: number;
}

const CATEGORIES = ["Bedding", "Clothing", "Tableware"];
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
    const [isOpen, setIsOpen] = useState(false); // For mobile sheet

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

    const filterContent = (
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
                        <div key={category} className="flex items-center space-x-2">
                            <Checkbox
                                id={`category-${category}`}
                                checked={selectedCategories.includes(category.toLowerCase())}
                                onCheckedChange={() => handleCategoryChange(category.toLowerCase())}
                            />
                            <Label
                                htmlFor={`category-${category}`}
                                className="text-sm font-normal cursor-pointer"
                            >
                                {category}
                            </Label>
                        </div>
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

    return (
        <>
            {/* Desktop Sidebar */}
            <div className="hidden lg:block w-64 space-y-6 sticky top-24 h-fit">
                <div className="flex items-center gap-2 font-serif text-xl font-bold">
                    <Filter className="w-5 h-5" /> Filters
                </div>
                {filterContent}
            </div>

            {/* Mobile Trigger */}
            <div className="lg:hidden mb-6">
                <Sheet open={isOpen} onOpenChange={setIsOpen}>
                    <SheetTrigger asChild>
                        <Button variant="outline" className="w-full">
                            <Filter className="w-4 h-4 mr-2" />
                            Filters {activeFiltersCount > 0 && <Badge variant="secondary" className="ml-1">{activeFiltersCount}</Badge>}
                        </Button>
                    </SheetTrigger>
                    <SheetContent side="left" className="w-[300px] sm:w-[400px]">
                        <SheetHeader>
                            <SheetTitle className="font-serif">Filters</SheetTitle>
                            <SheetDescription>
                                Refine your search to find the perfect item.
                            </SheetDescription>
                        </SheetHeader>
                        <div className="mt-8">
                            {filterContent}
                        </div>
                    </SheetContent>
                </Sheet>
            </div>
        </>
    );
}
