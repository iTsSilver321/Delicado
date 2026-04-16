import { Skeleton } from "@/components/ui/skeleton";

export default function Loading() {
    return (
        <div className="min-h-screen">
            {/* Hero Section Skeleton */}
            <section className="relative py-24 md:py-32 overflow-hidden">
                <div className="container text-center space-y-6">
                    <Skeleton className="h-6 w-40 mx-auto rounded-full" />
                    <Skeleton className="h-14 w-3/4 max-w-xl mx-auto rounded-lg" />
                    <Skeleton className="h-5 w-1/2 max-w-md mx-auto rounded-lg" />
                    <Skeleton className="h-12 w-40 mx-auto rounded-xl" />
                </div>
            </section>

            {/* Product Grid Skeleton */}
            <section className="container pb-20">
                <div className="text-center mb-12">
                    <Skeleton className="h-8 w-56 mx-auto mb-4 rounded-lg" />
                    <Skeleton className="h-4 w-80 mx-auto rounded-lg" />
                </div>
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
            </section>
        </div>
    );
}
