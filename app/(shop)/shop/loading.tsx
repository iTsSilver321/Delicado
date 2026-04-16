import { Skeleton } from "@/components/ui/skeleton";

export default function ShopLoading() {
    return (
        <div className="container py-16 md:py-24 min-h-[70vh]">
            {/* Header */}
            <div className="text-center mb-12">
                <Skeleton className="h-12 w-48 mx-auto mb-4 rounded-lg" />
                <Skeleton className="h-4 w-72 mx-auto rounded-lg" />
            </div>

            {/* Filter Tabs */}
            <div className="flex justify-center gap-3 mb-12">
                {[1, 2, 3].map((i) => (
                    <Skeleton key={i} className="h-10 w-24 rounded-full" />
                ))}
            </div>

            {/* Product Grid */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
                {[1, 2, 3, 4, 5, 6].map((i) => (
                    <div key={i} className="space-y-4">
                        <Skeleton className="aspect-[4/5] rounded-2xl" />
                        <div className="flex justify-between">
                            <Skeleton className="h-4 w-3/4 rounded" />
                            <Skeleton className="h-4 w-4 rounded-full" />
                        </div>
                        <Skeleton className="h-4 w-1/4 rounded" />
                    </div>
                ))}
            </div>
        </div>
    );
}
