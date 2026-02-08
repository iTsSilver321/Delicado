# Product Requirements Document (PRD) - Delicado

## 1. Executive Summary
**Delicado** is a premium e-commerce platform specializing in personalized embroidery products (bedsheets, pillowcases, clothing). The platform allows users to visually visualize their customizations (text, thread colors, fonts) directly on product mockups before purchasing. The backend integrates seamlessly with embroidery machines via `.dst` file management.

**Core Value Proposition**: "See it before you stitch it." A high-end, intuitive design that makes ordering custom embroidery feel magical and safe (no "hope it looks good" anxiety).

---

## 2. Technical Stack (Latest Stable Versions)

### Frontend (The Storefront)
*   **Framework**: **Next.js 15** (App Router)
    *   *Why*: Server Components for SEO (crucial for e-commerce), optimistic updates, and modern data fetching.
*   **Language**: **TypeScript 5.x**
*   **Styling**: **Tailwind CSS 3.4+**
*   **UI Library**: **shadcn/ui** (Radix UI primitives)
    *   *Why*: Accessible, copy-pasteable, highly customizable "premium" default look.
*   **Animations**: **Framer Motion 11**
    *   *Why*: Complex layout transitions, micro-interactions, and "wow" factor for the customizer.
*   **State Management**: **Zustand**
    *   *Why*: Minimalist global state for the Shopping Cart and Customizer session.
*   **Forms**: **React Hook Form** + **Zod** (Validation)

### Backend (The Infrastructure)
*   **Platform**: **Supabase**
    *   **Database**: PostgreSQL 16 (Managed)
    *   **Auth**: Supabase Auth (Email/Password + OAuth if needed)
    *   **Storage**: Supabase Storage (Buckets for Product Images & `.dst` files)
    *   **Realtime**: Supabase Realtime (For live admin order updates)
*   **Payments**: **Stripe** (via `stripe-js` and Payment Elements)

---

## 3. Product Features

### 3.1. The "Visual Customizer" (Core Feature)
The heart of the app. Replaces standard form inputs with an interactive canvas.
*   **Live Preview**: Users type text and see it overlaid on the product image in real-time.
*   **Interactive Controls**:
    *   **Placement**: Drag and drop text within a "safe zone" box on the product.
    *   **Thread Color**: Circular swatches of actual thread colors.
    *   **Font Picker**: Visual list of embroidery-support fonts.
*   **Output**: Generates a preview JSON metadata object saved with the Order Line Item.

### 3.2. E-commerce Core
*   **Product Browsing**:
    *   Grid view with staggered animations.
    *   Quick view modal.
    *   Filtering by category (Bedding, Clothing, Tableware).
*   **Cart & Checkout**:
    *   Slide-out Cart Drawer (accessible from anywhere).
    *   Guest Checkout support.
    *   Stripe Checkout integration.

### 3.3. Admin Dashboard (For Business Owner)
*   **Order Management**: Kanban or List view of orders (Pending -> Embroidering -> Shipped).
*   **DST File Manager**:
    *   Upload `.dst` files (embroidery machine patterns).
    *   Tag files by "Font" or "Design Element".
*   **Catalog Management**: Add/Edit products, upload photos.

---

## 4. Database Schema (Supabase / PostgreSQL)

### `profiles`
*   `id` (uuid, PK, refs `auth.users`)
*   `email` (text)
*   `full_name` (text)
*   `role` (enum: 'admin', 'customer')

### `products`
*   `id` (uuid, PK)
*   `name` (text)
*   `slug` (text, unique)
*   `description` (text)
*   `price` (int, cents)
*   `base_image_url` (text)
*   `is_customizable` (bool)
*   `category` (text)

### `embroidery_fonts`
*   `id` (uuid, PK)
*   `name` (text, e.g., "Script", "Block")
*   `preview_image_url` (text)
*   `dst_file_url` (text, optional link to master font file)

### `orders`
*   `id` (uuid, PK)
*   `user_id` (uuid, refs `profiles`, nullable for guest)
*   `status` (enum: 'pending', 'processing', 'shipped', 'delivered')
*   `total` (int)
*   `stripe_payment_id` (text)
*   `created_at` (timestamp)

### `order_items`
*   `id` (uuid, PK)
*   `order_id` (uuid, refs `orders`)
*   `product_id` (uuid, refs `products`)
*   `quantity` (int)
*   `customization_data` (jsonb)
    *   *Schema*: `{ "text": "Mom", "font": "Script", "color": "#FF0000", "position": { "x": 50, "y": 20 } }`

---

## 5. Project Structure (Next.js App Router)

```
delicado/
├── app/
│   ├── (shop)/               # Public facing shop routes
│   │   ├── page.tsx          # Landing page
│   │   ├── product/[slug]/   # Product details + Customizer
│   │   ├── cart/             # Cart page
│   │   └── checkout/         # Checkout flow
│   ├── (admin)/              # Protected admin routes
│   │   ├── admin/dashboard/  # Orders & Analytics
│   │   └── admin/products/   # CMS
│   ├── api/                  # Route Handlers (Webhooks, etc.)
│   ├── layout.tsx            # Root layout (Fonts, Providers)
│   └── globals.css           # Tailwind imports
├── components/
│   ├── ui/                   # shadcn/ui primitives (Button, Input)
│   ├── shop/                 # Shop specific (ProductCard, CartDrawer)
│   ├── customizer/           # Complex Customizer components (Canvas, Controls)
│   └── admin/                # Admin specific (OrderTable, FileUploader)
├── lib/
│   ├── supabase/             # Client & Server clients
│   ├── utils.ts              # cn() and formatters
│   └── store.ts              # Zustand stores
├── public/                   # Static assets
└── types/                    # TypeScript interfaces
```

## 6. Design & UX Guidelines
*   **Aesthetics**: Glassmorphism, large typography, "breathing" whitespace.
*   **Colors**: Creating a custom `delicado` palette in Tailwind.
    *   Primary: Deep Embroidery Red / Soft Gold.
    *   Background: Off-white / linen texture.
*   **Interactions**:
    *   Hovering a product card slightly lifts it (scale 1.02).
    *   Adding to cart triggers a confetti or satisfying "plop" animation.

## 7. Getting Started Commands
1.  `npx create-next-app@latest delicado --typescript --eslint --tailwind`
2.  `npx shadcn@latest init`
3.  `npm install @supabase/ssr @supabase/supabase-js framer-motion zustand stripe`
