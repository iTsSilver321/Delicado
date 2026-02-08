import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Home, Search, ArrowLeft } from "lucide-react";

export default function NotFound() {
    return (
        <div className="min-h-[80vh] flex items-center justify-center px-4">
            <div className="max-w-md text-center space-y-6">
                {/* Decorative 404 */}
                <div className="relative">
                    <span className="text-[150px] md:text-[200px] font-serif font-bold leading-none text-primary/10">
                        404
                    </span>
                    <div className="absolute inset-0 flex items-center justify-center">
                        <div className="w-24 h-24 rounded-full bg-primary/10 flex items-center justify-center">
                            <Search className="w-12 h-12 text-primary" />
                        </div>
                    </div>
                </div>

                <div className="space-y-2">
                    <h1 className="font-serif text-3xl font-bold">Page Not Found</h1>
                    <p className="text-muted-foreground">
                        The page you&apos;re looking for doesn&apos;t exist or has been moved.
                    </p>
                </div>

                <div className="flex flex-col sm:flex-row gap-3 justify-center">
                    <Button asChild variant="default" className="gap-2">
                        <Link href="/">
                            <Home className="w-4 h-4" />
                            Back to Home
                        </Link>
                    </Button>
                    <Button asChild variant="outline" className="gap-2">
                        <Link href="/collections">
                            <ArrowLeft className="w-4 h-4" />
                            Browse Products
                        </Link>
                    </Button>
                </div>
            </div>
        </div>
    );
}
