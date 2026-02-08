import { Skeleton } from "@/components/ui/skeleton";

export default function Loading() {
    return (
        <div className="container py-10 md:py-16">
            {/* Header */}
            <Skeleton className="h-10 w-48 mb-8" />

            <div className="grid lg:grid-cols-[1fr_400px] gap-12">
                {/* Cart Items Skeleton */}
                <div className="space-y-4">
                    {[1, 2, 3].map((i) => (
                        <div key={i} className="flex gap-4 p-4 bg-card rounded-xl border">
                            <Skeleton className="w-24 h-24 rounded-lg flex-shrink-0" />
                            <div className="flex-1 space-y-2">
                                <Skeleton className="h-5 w-3/4" />
                                <Skeleton className="h-4 w-1/4" />
                                <Skeleton className="h-8 w-24" />
                            </div>
                            <Skeleton className="h-6 w-16" />
                        </div>
                    ))}
                </div>

                {/* Summary Skeleton */}
                <div className="lg:sticky lg:top-24 h-fit">
                    <div className="bg-card rounded-2xl border p-6 space-y-4">
                        <Skeleton className="h-6 w-32" />
                        <div className="space-y-2">
                            <Skeleton className="h-4 w-full" />
                            <Skeleton className="h-4 w-full" />
                            <Skeleton className="h-4 w-3/4" />
                        </div>
                        <Skeleton className="h-14 w-full rounded-md" />
                    </div>
                </div>
            </div>
        </div>
    );
}
