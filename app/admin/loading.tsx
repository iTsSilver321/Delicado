import { Skeleton } from "@/components/ui/skeleton";

export default function AdminLoading() {
    return (
        <div className="p-6 space-y-6">
            {/* Header */}
            <div className="flex items-center justify-between">
                <Skeleton className="h-8 w-48" />
                <Skeleton className="h-10 w-32" />
            </div>

            {/* Stats Cards */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                {[1, 2, 3, 4].map((i) => (
                    <div key={i} className="bg-card rounded-xl border p-4 space-y-2">
                        <Skeleton className="h-4 w-20" />
                        <Skeleton className="h-8 w-24" />
                        <Skeleton className="h-3 w-16" />
                    </div>
                ))}
            </div>

            {/* Table */}
            <div className="bg-card rounded-xl border">
                <div className="p-4 border-b">
                    <div className="flex items-center justify-between">
                        <Skeleton className="h-6 w-32" />
                        <Skeleton className="h-10 w-64" />
                    </div>
                </div>
                <div className="divide-y">
                    {[1, 2, 3, 4, 5].map((i) => (
                        <div key={i} className="p-4 flex items-center gap-4">
                            <Skeleton className="w-10 h-10 rounded-full" />
                            <div className="flex-1 space-y-1">
                                <Skeleton className="h-4 w-32" />
                                <Skeleton className="h-3 w-24" />
                            </div>
                            <Skeleton className="h-4 w-16" />
                            <Skeleton className="h-6 w-20 rounded-full" />
                            <Skeleton className="h-8 w-8 rounded-md" />
                        </div>
                    ))}
                </div>
            </div>
        </div>
    );
}
