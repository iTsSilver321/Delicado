"use client";

import { ProductPreview } from "./ProductPreview";

interface CustomizerCanvasProps {
    productImage?: string;
    productType?: 'pillow' | 'tshirt' | 'tablecloth';
}

export function CustomizerCanvas({ productImage, productType = 'pillow' }: CustomizerCanvasProps) {
    return (
        <div className="w-full aspect-square md:aspect-auto md:h-[650px] lg:h-[700px]">
            <ProductPreview productType={productType} productImage={productImage} />
        </div>
    );
}
