import { Skeleton } from "@/components/ui/skeleton";

export default function Loading() {
    return (
        <div className="container py-10 md:py-16">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-16">
                {/* Left Column: Visual Customizer Skeleton */}
                <div className="space-y-6">
                    <div className="sticky top-24">
                        <Skeleton className="w-full aspect-square rounded-xl" />
                        <Skeleton className="h-4 w-3/4 mx-auto mt-4" />
                    </div>
                </div>

                {/* Right Column: Product Details Skeleton */}
                <div className="space-y-8">
                    <div className="space-y-4">
                        <Skeleton className="h-10 w-3/4" />
                        <div className="flex items-center gap-4">
                            <Skeleton className="h-8 w-24" />
                            <Skeleton className="h-4 w-32" />
                        </div>
                        <div className="space-y-2">
                            <Skeleton className="h-4 w-full" />
                            <Skeleton className="h-4 w-full" />
                            <Skeleton className="h-4 w-2/3" />
                        </div>
                    </div>

                    {/* Mode Selection Tabs Skeleton */}
                    <div className="grid grid-cols-2 gap-1">
                        <Skeleton className="h-10 rounded-md" />
                        <Skeleton className="h-10 rounded-md" />
                    </div>

                    <div className="flex flex-col gap-3 pt-4 border-t">
                        <Skeleton className="h-14 w-full rounded-md" />
                        <Skeleton className="h-4 w-2/3 mx-auto" />
                    </div>
                </div>
            </div>
        </div>
    );
}
