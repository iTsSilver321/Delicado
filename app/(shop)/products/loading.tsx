import { Skeleton } from "@/components/ui/skeleton";

export default function Loading() {
    return (
        <div className="container py-10 md:py-16">
            {/* Header Skeleton */}
            <div className="mb-8">
                <Skeleton className="h-10 w-48 mb-2" />
                <Skeleton className="h-4 w-64" />
            </div>

            <div className="flex flex-col lg:flex-row gap-8">
                {/* Filters Sidebar Skeleton */}
                <div className="w-full lg:w-64 flex-shrink-0 space-y-6">
                    <div className="space-y-4">
                        <Skeleton className="h-6 w-24" />
                        <div className="space-y-2">
                            {[1, 2, 3, 4].map((i) => (
                                <Skeleton key={i} className="h-8 w-full" />
                            ))}
                        </div>
                    </div>
                    <div className="space-y-4">
                        <Skeleton className="h-6 w-20" />
                        <Skeleton className="h-10 w-full" />
                    </div>
                </div>

                {/* Product Grid Skeleton */}
                <div className="flex-1">
                    <div className="flex justify-between items-center mb-6">
                        <Skeleton className="h-4 w-32" />
                        <Skeleton className="h-10 w-40" />
                    </div>
                    <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-6">
                        {[1, 2, 3, 4, 5, 6].map((i) => (
                            <div key={i} className="space-y-3">
                                <Skeleton className="aspect-square rounded-xl" />
                                <Skeleton className="h-5 w-3/4" />
                                <Skeleton className="h-4 w-1/4" />
                            </div>
                        ))}
                    </div>
                </div>
            </div>
        </div>
    );
}
