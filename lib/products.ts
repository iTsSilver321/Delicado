export type DesignFamily = 'branch' | 'flower';

export interface Product {
  id: string;
  slug: string;
  name: string;
  description: string;
  price: number; // in cents
  color: string;
  colorHex: string;
  design: DesignFamily;
  images: {
    tucked: string;
    normal: string;
    extra?: string;
  };
}

export const products: Product[] = [
  // ─── Branch Collection ────────────────────────────────
  {
    id: 'grey-branch',
    slug: 'grey-branch',
    name: 'Grey Branch Bedding Set',
    description:
      'Elegant grey cotton bedding with a delicate embroidered branch motif in silver and white tones. A timeless addition to any modern bedroom.',
    price: 11900,
    color: 'Grey',
    colorHex: '#9CA3AF',
    design: 'branch',
    images: {
      tucked: '/assets/grey_tucked_branch.jpeg',
      normal: '/assets/grey_branch.jpeg',
      extra: '/assets/grey.jpeg',
    },
  },
  {
    id: 'white-branch',
    slug: 'white-branch',
    name: 'White Branch Bedding Set',
    description:
      'Crisp white cotton bedding adorned with a graceful embroidered branch design. Pure sophistication for a serene, airy bedroom.',
    price: 11900,
    color: 'White',
    colorHex: '#F5F5F0',
    design: 'branch',
    images: {
      tucked: '/assets/white_tucked_branch.jpeg',
      normal: '/assets/white_branch.jpeg',
      extra: '/assets/white.jpeg',
    },
  },
  {
    id: 'white-green-branch',
    slug: 'white-green-branch',
    name: 'White & Green Branch Bedding Set',
    description:
      'Fresh white bedding with an embroidered branch motif in natural green hues. Brings a touch of botanical charm to your space.',
    price: 12900,
    color: 'White & Green',
    colorHex: '#86EFAC',
    design: 'branch',
    images: {
      tucked: '/assets/white-green_tucked_branch.jpeg',
      normal: '/assets/white-green_branch.jpeg',
      extra: '/assets/white.jpeg',
    },
  },

  // ─── Flower Collection ────────────────────────────────
  {
    id: 'grey-flower',
    slug: 'grey-flower',
    name: 'Grey Flower Bedding Set',
    description:
      'Luxurious grey cotton bedding featuring a stunning embroidered peony flower. Rich detail meets understated elegance.',
    price: 12900,
    color: 'Grey',
    colorHex: '#9CA3AF',
    design: 'flower',
    images: {
      tucked: '/assets/grey_tucked_flower.jpeg',
      normal: '/assets/grey_flower.jpeg',
      extra: '/assets/grey.jpeg',
    },
  },
  {
    id: 'white-flower',
    slug: 'white-flower',
    name: 'White Flower Bedding Set',
    description:
      'Premium white cotton bedding with an intricately embroidered peony in warm tones. A statement piece for the discerning home.',
    price: 12900,
    color: 'White',
    colorHex: '#F5F5F0',
    design: 'flower',
    images: {
      tucked: '/assets/white_tucked_flower.jpeg',
      normal: '/assets/white_flower.jpeg',
      extra: '/assets/white.jpeg',
    },
  },
  {
    id: 'white-pink-flower',
    slug: 'white-pink-flower',
    name: 'White & Pink Flower Bedding Set',
    description:
      'Delicate white bedding with a beautiful embroidered peony in soft pink threads. Romantic, refined, and irresistibly elegant.',
    price: 13900,
    color: 'White & Pink',
    colorHex: '#FDA4AF',
    design: 'flower',
    images: {
      tucked: '/assets/white-pink_tucked_flower.jpeg',
      normal: '/assets/white-pink_flower.jpeg',
      extra: '/assets/white.jpeg',
    },
  },
];

// ─── Helpers ──────────────────────────────────────────────

export function getProductBySlug(slug: string): Product | undefined {
  return products.find((p) => p.slug === slug);
}

export function getProductsByDesign(design: DesignFamily): Product[] {
  return products.filter((p) => p.design === design);
}

export function getColorVariants(product: Product): Product[] {
  return products.filter(
    (p) => p.design === product.design && p.id !== product.id
  );
}

export function getAllSlugs(): string[] {
  return products.map((p) => p.slug);
}
