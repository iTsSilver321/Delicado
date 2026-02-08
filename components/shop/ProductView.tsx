"use client";

import { CustomizerCanvas } from "@/components/customizer/CustomizerCanvas";
import { CustomizerControls } from "@/components/customizer/Controls";
import { Button } from "@/components/ui/button";
import { Star } from "lucide-react";
import { motion } from "framer-motion";
import { useCustomizerStore, useCartStore } from "@/lib/store";
import { useRef, useEffect, useState } from "react";
import { TiltCard } from "@/components/ui/TiltCard";
import { toast } from "sonner";
import { ProductPreview } from "@/components/customizer/ProductPreview";

interface Product {
    id: string;
    slug: string;
    name: string;
    description: string;
    price: number;
    image_url: string;
}

interface ProductViewProps {
    product: Product;
}

// Map product slug to 3D model type
function getProductType(product: Product): 'pillow' | 'tshirt' | 'tablecloth' {
    const slug = product.slug.toLowerCase();

    if (slug === 'clothing' || slug.includes('robe') || slug.includes('shirt')) {
        return 'tshirt';
    }
    if (slug === 'tableware' || slug.includes('table') || slug.includes('runner')) {
        return 'tablecloth';
    }
    // Default to pillow for bedding items
    return 'pillow';
}

export function ProductView({ product }: ProductViewProps) {
    const productType = getProductType(product);
    const [mode, setMode] = useState<'standard' | 'custom'>('standard');
    const { text, font, color, position, textSize, isEditingText, reset } = useCustomizerStore();

    // Reset customizer when switching modes or unmounting
    useEffect(() => {
        reset();
    }, []);

    return (
        <div className="container py-10 md:py-16">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-16">

                {/* Left Column: Visual Customizer */}
                <motion.div
                    initial={{ opacity: 0, x: -50 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ duration: 0.6, ease: "easeOut" }}
                    className="space-y-6"
                >
                    <div className="sticky top-24">
                        <TiltCard className="rounded-xl overflow-hidden shadow-sm aspect-square mb-6">
                            {mode === 'standard' ? (
                                <div className="w-full aspect-square md:aspect-auto md:h-[650px] lg:h-[700px]">
                                    <ProductPreview productType={productType} productImage={product.image_url} customization={{ text: '', font: '', color: '', textSize: 0, position: { x: 0, y: 0 } }} />
                                </div>
                            ) : (
                                <CustomizerCanvas productImage={product.image_url} productType={productType} />
                            )}

                        </TiltCard>
                        <p className="text-center text-sm text-muted-foreground mt-4">
                            {mode === 'custom' ? "Rendered preview. Actual embroidery placement may vary slightly." : "Standard high-quality product without embroidery."}
                        </p>
                    </div>
                </motion.div>

                {/* Right Column: Product Details & Controls */}
                <motion.div
                    initial={{ opacity: 0, x: 50 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ duration: 0.6, ease: "easeOut", delay: 0.2 }}
                    className="space-y-8"
                >
                    <div className="space-y-2">
                        <h1 className="font-serif text-4xl font-bold tracking-tight text-primary">
                            {product.name}
                        </h1>
                        <div className="flex items-center gap-4">
                            <p className="text-2xl font-medium">
                                ${(product.price / 100).toFixed(2)}
                            </p>
                            <div className="flex items-center text-yellow-500">
                                <Star className="h-4 w-4 fill-current" />
                                <Star className="h-4 w-4 fill-current" />
                                <Star className="h-4 w-4 fill-current" />
                                <Star className="h-4 w-4 fill-current" />
                                <Star className="h-4 w-4 fill-current" />
                                <span className="ml-2 text-sm text-foreground">(42 reviews)</span>
                            </div>
                        </div>
                        <p className="text-muted-foreground leading-relaxed">
                            {product.description}
                        </p>
                    </div>

                    {/* Mode Selection Tabs */}
                    <div className="bg-muted p-1 rounded-lg grid grid-cols-2 gap-1 text-center font-medium">
                        <button
                            onClick={() => setMode('standard')}
                            className={`py-2 rounded-md transition-all ${mode === 'standard' ? 'bg-background shadow-sm text-foreground' : 'text-muted-foreground hover:text-foreground'}`}
                        >
                            Buy Standard
                        </button>
                        <button
                            onClick={() => setMode('custom')}
                            className={`py-2 rounded-md transition-all ${mode === 'custom' ? 'bg-background shadow-sm text-foreground' : 'text-muted-foreground hover:text-foreground'}`}
                        >
                            Customize (+Free)
                        </button>
                    </div>

                    {/* Customizer Controls Panel - Only show in custom mode */}
                    {mode === 'custom' && (
                        <motion.div
                            initial={{ opacity: 0, y: 10 }}
                            animate={{ opacity: 1, y: 0 }}
                            exit={{ opacity: 0, y: -10 }}
                        >
                            <CustomizerControls />
                        </motion.div>
                    )}

                    <div className="flex flex-col gap-3 pt-4 border-t">
                        <Button
                            size="lg"
                            className="w-full text-lg h-14 shadow-md hover:shadow-lg transition-all hover:scale-[1.02] active:scale-[0.98]"
                            onClick={() => {
                                // Create a unique ID
                                const customId = `${product.id}-${Date.now()}`;

                                if (mode === 'custom') {
                                    const { text: currentText, font: currentFont, color: currentColor, position: currentPos, textSize: currentSize, isEditingText: currentEditing } = useCustomizerStore.getState();

                                    useCartStore.getState().addItem({
                                        id: customId,
                                        productId: product.id,
                                        name: product.name,
                                        price: product.price,
                                        image: product.image_url,
                                        quantity: 1,
                                        isCustomized: true,
                                        customization: {
                                            text: currentText,
                                            font: currentFont,
                                            color: currentColor,
                                            position: currentPos,
                                            textSize: currentSize,
                                            isEditingText: currentEditing
                                        }
                                    });

                                    toast.success("Added to your creation", {
                                        description: `${product.name} with "${currentText}"`,
                                    });
                                } else {
                                    // Standard mode
                                    useCartStore.getState().addItem({
                                        id: customId,
                                        productId: product.id,
                                        name: product.name,
                                        price: product.price,
                                        image: product.image_url,
                                        quantity: 1,
                                        isCustomized: false,
                                        customization: {
                                            text: '',
                                            font: '',
                                            color: '',
                                            position: { x: 0, y: 0 },
                                            textSize: 1,
                                            isEditingText: false
                                        }
                                    });

                                    toast.success("Added to cart", {
                                        description: `${product.name} (Standard)`,
                                    });
                                }
                            }}
                        >
                            Add to Cart - ${(product.price / 100).toFixed(2)}
                        </Button>
                        <p className="text-xs text-center text-muted-foreground">
                            Ships in 5-7 business days. Free shipping on orders over $100.
                        </p>
                    </div>
                </motion.div>
            </div>
        </div>
    );
}
