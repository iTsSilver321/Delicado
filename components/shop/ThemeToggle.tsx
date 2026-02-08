"use client";

import { useTheme } from "next-themes";
import { motion } from "framer-motion";
import { useEffect, useState } from "react";

export function ThemeToggle() {
    const { theme, setTheme, resolvedTheme } = useTheme();
    const [mounted, setMounted] = useState(false);

    // Prevent hydration mismatch
    useEffect(() => {
        setMounted(true);
    }, []);

    if (!mounted) {
        return (
            <div className="w-16 h-8 rounded-full bg-muted/30 border border-input/10" />
        );
    }

    const isDark = resolvedTheme === "dark";

    const toggleTheme = () => {
        setTheme(isDark ? "light" : "dark");
    };

    return (
        <button
            onClick={toggleTheme}
            className={`
                relative h-8 w-16 rounded-full p-1 transition-colors duration-200 border
                ${isDark ? 'bg-card border-border' : 'bg-amber-100/50 border-amber-200'}
            `}
            aria-label={`Switch to ${isDark ? "light" : "dark"} mode`}
        >
            <motion.div
                className={`
                    h-6 w-6 rounded-full flex items-center justify-center shadow-sm relative z-10
                    ${isDark ? 'bg-muted text-foreground' : 'bg-white'}
                `}
                animate={{
                    x: isDark ? 32 : 0,
                    rotate: isDark ? 360 : 0
                }}
                transition={{
                    type: "spring",
                    stiffness: 700,
                    damping: 30
                }}
            >
                {/* Icons */}
                <div className="relative w-4 h-4">
                    {/* Sun Icon (Visible in Light Mode) */}
                    <motion.svg
                        viewBox="0 0 24 24"
                        fill="none"
                        className="absolute inset-0 text-amber-500"
                        animate={{
                            scale: isDark ? 0 : 1,
                            opacity: isDark ? 0 : 1
                        }}
                    >
                        <circle cx="12" cy="12" r="5" fill="currentColor" />
                        <path d="M12 2V4" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
                        <path d="M12 20V22" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
                        <path d="M4 12H2" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
                        <path d="M22 12H20" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
                        <path d="M19.07 4.93L17.66 6.34" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
                        <path d="M6.34 17.66L4.93 19.07" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
                        <path d="M4.93 4.93L6.34 6.34" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
                        <path d="M17.66 17.66L19.07 19.07" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
                    </motion.svg>

                    {/* Moon Icon (Visible in Dark Mode) */}
                    <motion.svg
                        viewBox="0 0 24 24"
                        fill="none"
                        className="absolute inset-0 text-primary"
                        animate={{
                            scale: isDark ? 1 : 0,
                            opacity: isDark ? 1 : 0
                        }}
                    >
                        <path
                            d="M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79z"
                            fill="currentColor"
                        />
                    </motion.svg>
                </div>
            </motion.div>
        </button>
    );
}
