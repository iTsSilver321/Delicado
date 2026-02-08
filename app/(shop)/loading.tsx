import { Skeleton } from "@/components/ui/skeleton";

export default function Loading() {
    return (
        <div className="min-h-screen">
            {/* Hero Section Skeleton */}
            <section className="relative h-[85vh] flex items-center justify-center overflow-hidden">
                <Skeleton className="absolute inset-0" />
                <div className="relative z-10 container text-center space-y-6">
                    <Skeleton className="h-16 w-3/4 mx-auto" />
                    <Skeleton className="h-6 w-1/2 mx-auto" />
                    <div className="flex gap-4 justify-center">
                        <Skeleton className="h-12 w-36" />
                        <Skeleton className="h-12 w-36" />
                    </div>
                </div>
            </section>

            {/* Categories Section Skeleton */}
            <section className="container py-20">
                <div className="text-center mb-12">
                    <Skeleton className="h-8 w-48 mx-auto mb-4" />
                    <Skeleton className="h-4 w-64 mx-auto" />
                </div>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                    {[1, 2, 3].map((i) => (
                        <Skeleton key={i} className="h-48 rounded-2xl" />
                    ))}
                </div>
            </section>

            {/* Products Section Skeleton */}
            <section className="container py-20">
                <div className="text-center mb-12">
                    <Skeleton className="h-8 w-56 mx-auto mb-4" />
                    <Skeleton className="h-4 w-80 mx-auto" />
                </div>
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
                    {[1, 2, 3, 4].map((i) => (
                        <div key={i} className="space-y-3">
                            <Skeleton className="aspect-square rounded-xl" />
                            <Skeleton className="h-4 w-3/4" />
                            <Skeleton className="h-4 w-1/4" />
                        </div>
                    ))}
                </div>
            </section>
        </div>
    );
}
