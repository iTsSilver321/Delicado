"use client";

import { useCustomizerStore } from "@/lib/store";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { ColorPicker } from "./ColorPicker";
import { FontPicker } from "./FontPicker";
import { Type, Palette, Maximize2 } from "lucide-react";
import { motion } from "framer-motion";

const containerVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: {
        opacity: 1,
        y: 0,
        transition: {
            duration: 0.5,
            staggerChildren: 0.1
        }
    }
};

const itemVariants = {
    hidden: { opacity: 0, x: -10 },
    visible: { opacity: 1, x: 0 }
};

export function CustomizerControls() {
    const {
        text, setText,
        font, setFont,
        color, setColor,
        textSize, setTextSize,
        setIsEditingText
    } = useCustomizerStore();

    return (
        <motion.div
            initial="hidden"
            animate="visible"
            variants={containerVariants}
        >
            <Card className="w-full md:w-[400px] border-none shadow-xl bg-background/60 backdrop-blur-xl supports-[backdrop-filter]:bg-background/40">
                <CardHeader className="pb-4">
                    <CardTitle className="font-serif text-2xl tracking-wide flex items-center gap-2">
                        <Palette className="w-5 h-5 text-primary" />
                        Personalize It
                    </CardTitle>
                    <CardDescription>
                        Create your unique masterpiece.
                    </CardDescription>
                </CardHeader>

                <Separator className="bg-primary/10" />

                <CardContent className="space-y-6 pt-6">
                    {/* Text Input Section */}
                    <motion.div variants={itemVariants} className="space-y-3">
                        <div className="flex items-center gap-2 text-primary font-medium">
                            <Type className="w-4 h-4" />
                            <Label htmlFor="custom-text" className="text-base">Your Text</Label>
                        </div>
                        <Input
                            id="custom-text"
                            placeholder="Enter name (e.g. 'Isabella')"
                            value={text}
                            onChange={(e) => setText(e.target.value)}
                            onFocus={() => setIsEditingText(true)}
                            onBlur={() => setIsEditingText(false)}
                            className="text-lg h-12 bg-white/50 border-primary/20 focus-visible:ring-primary/30 font-medium transition-all focus:scale-[1.01]"
                            maxLength={20}
                        />
                    </motion.div>

                    {/* Text Size Slider */}
                    <motion.div variants={itemVariants} className="space-y-3">
                        <div className="flex items-center justify-between">
                            <div className="flex items-center gap-2 text-primary font-medium">
                                <Maximize2 className="w-4 h-4" />
                                <Label className="text-base">Text Size</Label>
                            </div>
                            <span className="text-sm text-muted-foreground">{Math.round(textSize * 100)}%</span>
                        </div>
                        <input
                            type="range"
                            min="0.5"
                            max="1.5"
                            step="0.1"
                            value={textSize}
                            onChange={(e) => setTextSize(parseFloat(e.target.value))}
                            className="w-full h-2 bg-secondary rounded-lg appearance-none cursor-pointer accent-primary"
                        />
                        <div className="flex justify-between text-xs text-muted-foreground">
                            <span>Small</span>
                            <span>Large</span>
                        </div>
                    </motion.div>

                    {/* Font Picker Section */}
                    <motion.div variants={itemVariants} className="space-y-3">
                        <div className="flex items-center gap-2 text-primary font-medium">
                            <Type className="w-4 h-4" />
                            <Label className="text-base">Typography Style</Label>
                        </div>
                        <FontPicker selectedFont={font} onSelect={setFont} />
                    </motion.div>

                    {/* Color Picker Section */}
                    <motion.div variants={itemVariants} className="space-y-3">
                        <div className="flex items-center gap-2 text-primary font-medium">
                            <Palette className="w-4 h-4" />
                            <Label className="text-base">Thread Color</Label>
                        </div>
                        <ColorPicker selectedColor={color} onSelect={setColor} />
                    </motion.div>
                </CardContent>
            </Card>
        </motion.div>
    );
}

