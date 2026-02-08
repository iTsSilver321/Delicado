import { Skeleton } from "@/components/ui/skeleton";

export default function Loading() {
    return (
        <div className="min-h-screen">
            {/* Hero Section Skeleton */}
            <section className="relative py-20 overflow-hidden">
                <div className="container text-center space-y-4">
                    <Skeleton className="h-8 w-32 mx-auto rounded-full" />
                    <Skeleton className="h-14 w-80 mx-auto" />
                    <Skeleton className="h-6 w-[500px] max-w-full mx-auto" />
                </div>
            </section>

            {/* Story Section Skeleton */}
            <section className="container pb-20">
                <div className="grid lg:grid-cols-2 gap-12 lg:gap-16 items-center">
                    <div className="space-y-6">
                        <Skeleton className="h-10 w-3/4" />
                        <div className="space-y-3">
                            <Skeleton className="h-4 w-full" />
                            <Skeleton className="h-4 w-full" />
                            <Skeleton className="h-4 w-3/4" />
                            <Skeleton className="h-4 w-full" />
                            <Skeleton className="h-4 w-5/6" />
                        </div>
                        <Skeleton className="h-12 w-40" />
                    </div>
                    <Skeleton className="aspect-square rounded-2xl" />
                </div>
            </section>

            {/* Stats Section Skeleton */}
            <section className="container pb-20">
                <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
                    {[1, 2, 3, 4].map((i) => (
                        <Skeleton key={i} className="h-28 rounded-2xl" />
                    ))}
                </div>
            </section>

            {/* Values Section Skeleton */}
            <section className="container pb-20">
                <div className="text-center mb-12">
                    <Skeleton className="h-10 w-64 mx-auto mb-4" />
                    <Skeleton className="h-4 w-96 max-w-full mx-auto" />
                </div>
                <div className="grid md:grid-cols-2 gap-6">
                    {[1, 2, 3, 4].map((i) => (
                        <Skeleton key={i} className="h-32 rounded-2xl" />
                    ))}
                </div>
            </section>
        </div>
    );
}
