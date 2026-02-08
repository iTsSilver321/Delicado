import { Skeleton } from "@/components/ui/skeleton";

export default function Loading() {
    return (
        <div className="container py-10 md:py-16">
            <Skeleton className="h-4 w-36 mb-8" />
            <Skeleton className="h-10 w-48 mb-8" />

            <div className="grid lg:grid-cols-[1fr_400px] gap-12">
                {/* Form Skeleton */}
                <div className="space-y-8">
                    {/* Contact Info */}
                    <div className="bg-card rounded-2xl border p-6 space-y-4">
                        <Skeleton className="h-6 w-48" />
                        <div className="grid md:grid-cols-2 gap-4">
                            <Skeleton className="h-10 w-full" />
                            <Skeleton className="h-10 w-full" />
                            <Skeleton className="h-10 w-full md:col-span-2" />
                        </div>
                    </div>

                    {/* Shipping Address */}
                    <div className="bg-card rounded-2xl border p-6 space-y-4">
                        <Skeleton className="h-6 w-40" />
                        <Skeleton className="h-10 w-full" />
                        <Skeleton className="h-10 w-full" />
                        <div className="grid md:grid-cols-3 gap-4">
                            <Skeleton className="h-10 w-full" />
                            <Skeleton className="h-10 w-full" />
                            <Skeleton className="h-10 w-full" />
                        </div>
                    </div>

                    {/* Payment Method */}
                    <div className="bg-card rounded-2xl border p-6 space-y-4">
                        <Skeleton className="h-6 w-40" />
                        <Skeleton className="h-16 w-full rounded-xl" />
                        <Skeleton className="h-16 w-full rounded-xl" />
                    </div>
                </div>

                {/* Order Summary Skeleton */}
                <div className="lg:sticky lg:top-24 h-fit">
                    <div className="bg-card rounded-2xl border p-6 space-y-6">
                        <Skeleton className="h-6 w-32" />
                        <div className="space-y-4">
                            {[1, 2].map((i) => (
                                <div key={i} className="flex gap-4">
                                    <Skeleton className="w-16 h-16 rounded-lg flex-shrink-0" />
                                    <div className="flex-1 space-y-1">
                                        <Skeleton className="h-4 w-3/4" />
                                        <Skeleton className="h-3 w-1/2" />
                                    </div>
                                    <Skeleton className="h-4 w-12" />
                                </div>
                            ))}
                        </div>
                        <div className="border-t pt-4 space-y-2">
                            <Skeleton className="h-4 w-full" />
                            <Skeleton className="h-4 w-full" />
                            <Skeleton className="h-6 w-full mt-4" />
                        </div>
                        <Skeleton className="h-14 w-full rounded-md" />
                    </div>
                </div>
            </div>
        </div>
    );
}
