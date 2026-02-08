import { Skeleton } from "@/components/ui/skeleton";

export default function Loading() {
    return (
        <div className="container py-10 md:py-16">
            {/* Header Skeleton */}
            <div className="text-center mb-12">
                <Skeleton className="h-10 w-64 mx-auto mb-4" />
                <Skeleton className="h-4 w-96 mx-auto" />
            </div>

            {/* Category Cards Skeleton */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                {[1, 2, 3].map((i) => (
                    <Skeleton key={i} className="h-64 rounded-2xl" />
                ))}
            </div>
        </div>
    );
}
