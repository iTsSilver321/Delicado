import { Skeleton } from "@/components/ui/skeleton";

export default function Loading() {
    return (
        <div className="container py-10 md:py-16">
            {/* Header */}
            <div className="flex items-center justify-between mb-8">
                <Skeleton className="h-10 w-48" />
                <Skeleton className="h-10 w-32" />
            </div>

            {/* Profile Card */}
            <div className="bg-card rounded-2xl border p-6 mb-8">
                <div className="flex items-center gap-4">
                    <Skeleton className="w-16 h-16 rounded-full" />
                    <div className="space-y-2">
                        <Skeleton className="h-6 w-40" />
                        <Skeleton className="h-4 w-56" />
                    </div>
                </div>
            </div>

            {/* Tabs */}
            <div className="flex gap-2 mb-6">
                {[1, 2, 3].map((i) => (
                    <Skeleton key={i} className="h-10 w-28 rounded-md" />
                ))}
            </div>

            {/* Orders List */}
            <div className="space-y-4">
                {[1, 2, 3].map((i) => (
                    <div key={i} className="bg-card rounded-2xl border p-6">
                        <div className="flex justify-between items-start mb-4">
                            <div className="space-y-2">
                                <Skeleton className="h-5 w-32" />
                                <Skeleton className="h-4 w-24" />
                            </div>
                            <Skeleton className="h-6 w-20 rounded-full" />
                        </div>
                        <div className="flex gap-4">
                            {[1, 2].map((j) => (
                                <Skeleton key={j} className="w-16 h-16 rounded-lg" />
                            ))}
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
}
