"use client";

import React, { useRef } from "react";
import { motion, useMotionValue, useSpring, useTransform } from "framer-motion";

interface TiltCardProps {
    children: React.ReactNode;
    className?: string;
    rotationFactor?: number; // How much it tilts (default: 15)
}

export function TiltCard({ children, className = "", rotationFactor = 15 }: TiltCardProps) {
    const ref = useRef<HTMLDivElement>(null);

    const x = useMotionValue(0);
    const y = useMotionValue(0);

    const mouseX = useSpring(x, { stiffness: 150, damping: 15, mass: 0.1 });
    const mouseY = useSpring(y, { stiffness: 150, damping: 15, mass: 0.1 });

    function handleMouseMove(e: React.MouseEvent<HTMLDivElement>) {
        if (!ref.current) return;

        const rect = ref.current.getBoundingClientRect();
        const width = rect.width;
        const height = rect.height;

        // Calculate mouse position relative to center of card (-0.5 to 0.5)
        const relativeX = (e.clientX - rect.left) / width - 0.5;
        const relativeY = (e.clientY - rect.top) / height - 0.5;

        // Set motion values (inverted Y for natural tilt feel)
        x.set(relativeY * rotationFactor); // Rotate X axis based on Y position
        y.set(-relativeX * rotationFactor); // Rotate Y axis based on X position
    }

    function handleMouseLeave() {
        x.set(0);
        y.set(0);
    }

    return (
        <motion.div
            ref={ref}
            style={{
                rotateX: mouseX,
                rotateY: mouseY,
                transformStyle: "preserve-3d",
            }}
            onMouseMove={handleMouseMove}
            onMouseLeave={handleMouseLeave}
            className={`relative transition-all duration-200 ease-out will-change-transform ${className}`}
        >
            <div style={{ transform: "translateZ(30px)" }}>
                {children}
            </div>
        </motion.div>
    );
}
