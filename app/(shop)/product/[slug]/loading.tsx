import { Skeleton } from "@/components/ui/skeleton";

export default function ProductLoading() {
    return (
        <div className="container py-12 md:py-20">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-10 lg:gap-16">
                {/* Left: Image Gallery */}
                <div className="flex gap-4">
                    {/* Thumbnails */}
                    <div className="hidden lg:flex flex-col gap-3">
                        {[1, 2].map((i) => (
                            <Skeleton key={i} className="w-20 h-20 rounded-lg" />
                        ))}
                    </div>
                    {/* Main Image */}
                    <Skeleton className="flex-1 aspect-[4/5] rounded-2xl" />
                </div>

                {/* Right: Product Info */}
                <div className="space-y-6">
                    <Skeleton className="h-4 w-32 rounded" />
                    <Skeleton className="h-12 w-3/4 rounded-lg" />
                    <Skeleton className="h-4 w-40 rounded" />
                    <Skeleton className="h-8 w-28 rounded" />
                    <Skeleton className="h-5 w-full rounded" />
                    <Skeleton className="h-5 w-4/5 rounded" />

                    {/* Color dots */}
                    <div className="flex gap-3 pt-2">
                        {[1, 2, 3].map((i) => (
                            <Skeleton key={i} className="w-10 h-10 rounded-full" />
                        ))}
                    </div>

                    {/* Quantity + Add to cart */}
                    <div className="flex gap-3 pt-4">
                        <Skeleton className="h-14 flex-1 rounded-xl" />
                        <Skeleton className="h-14 w-14 rounded-xl" />
                    </div>

                    {/* Trust badges */}
                    <div className="flex gap-6 pt-4">
                        {[1, 2, 3].map((i) => (
                            <Skeleton key={i} className="h-4 w-28 rounded" />
                        ))}
                    </div>

                    {/* Accordion */}
                    <div className="space-y-3 pt-4">
                        {[1, 2, 3].map((i) => (
                            <Skeleton key={i} className="h-12 rounded-lg" />
                        ))}
                    </div>
                </div>
            </div>
        </div>
    );
}
