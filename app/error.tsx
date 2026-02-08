"use client";

import { useEffect } from "react";
import Link from "next/link";
import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { AlertTriangle, Home, RefreshCw } from "lucide-react";

export default function Error({
    error,
    reset,
}: {
    error: Error & { digest?: string };
    reset: () => void;
}) {
    useEffect(() => {
        // Log the error to an error reporting service
        console.error(error);
    }, [error]);

    return (
        <div className="min-h-[80vh] flex items-center justify-center px-4">
            <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5 }}
                className="max-w-md text-center space-y-6"
            >
                <div className="w-20 h-20 mx-auto rounded-full bg-destructive/10 flex items-center justify-center">
                    <AlertTriangle className="w-10 h-10 text-destructive" />
                </div>

                <div className="space-y-2">
                    <h1 className="font-serif text-3xl font-bold">Something went wrong</h1>
                    <p className="text-muted-foreground">
                        We apologize for the inconvenience. An unexpected error has occurred.
                    </p>
                </div>

                <div className="flex flex-col sm:flex-row gap-3 justify-center">
                    <Button onClick={reset} variant="default" className="gap-2">
                        <RefreshCw className="w-4 h-4" />
                        Try Again
                    </Button>
                    <Button asChild variant="outline" className="gap-2">
                        <Link href="/">
                            <Home className="w-4 h-4" />
                            Back to Home
                        </Link>
                    </Button>
                </div>

                {error.digest && (
                    <p className="text-xs text-muted-foreground/60">
                        Error ID: {error.digest}
                    </p>
                )}
            </motion.div>
        </div>
    );
}
