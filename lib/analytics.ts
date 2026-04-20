/**
 * Analytics module — Google Analytics 4 (GA4) e-commerce event tracking.
 *
 * Follows the GA4 recommended e-commerce events spec:
 * https://developers.google.com/analytics/devguides/collection/ga4/reference/events
 *
 * All monetary values are converted from cents → dollars before dispatch.
 */

// ---------------------------------------------------------------------------
// Types
// ---------------------------------------------------------------------------

interface AnalyticsItem {
  item_id: string;
  item_name: string;
  price: number;     // dollars
  quantity: number;
  item_category?: string;
  item_variant?: string;
}

type GtagCommand = 'config' | 'event' | 'js' | 'set';

// Extend Window to include gtag / dataLayer
declare global {
  interface Window {
    gtag?: (...args: [GtagCommand, ...unknown[]]) => void;
    dataLayer?: unknown[];
  }
}

// ---------------------------------------------------------------------------
// Helpers
// ---------------------------------------------------------------------------

const GA_MEASUREMENT_ID = process.env.NEXT_PUBLIC_GA_MEASUREMENT_ID;

function gtag(...args: [GtagCommand, ...unknown[]]) {
  if (typeof window === 'undefined' || !window.gtag) return;
  window.gtag(...args);
}

/** Convert cents to dollars with 2-decimal precision. */
function centsToUsd(cents: number): number {
  return Math.round(cents) / 100;
}

// ---------------------------------------------------------------------------
// E-Commerce Events
// ---------------------------------------------------------------------------

/**
 * Fire when a user views a product detail page.
 */
export function trackViewItem(product: {
  id: string;
  name: string;
  price: number;       // cents
  category?: string;
  variant?: string;
}) {
  const item: AnalyticsItem = {
    item_id: product.id,
    item_name: product.name,
    price: centsToUsd(product.price),
    quantity: 1,
    ...(product.category && { item_category: product.category }),
    ...(product.variant && { item_variant: product.variant }),
  };

  gtag('event', 'view_item', {
    currency: 'USD',
    value: item.price,
    items: [item],
  });
}

/**
 * Fire when a user adds an item to the cart.
 */
export function trackAddToCart(product: {
  id: string;
  name: string;
  price: number;       // cents
  quantity: number;
  category?: string;
  variant?: string;
}) {
  const item: AnalyticsItem = {
    item_id: product.id,
    item_name: product.name,
    price: centsToUsd(product.price),
    quantity: product.quantity,
    ...(product.category && { item_category: product.category }),
    ...(product.variant && { item_variant: product.variant }),
  };

  gtag('event', 'add_to_cart', {
    currency: 'USD',
    value: item.price * item.quantity,
    items: [item],
  });
}

/**
 * Fire when a user initiates checkout (clicks "Checkout" from cart).
 */
export function trackBeginCheckout(cartItems: {
  id: string;
  name: string;
  price: number;       // cents
  quantity: number;
}[]) {
  const items: AnalyticsItem[] = cartItems.map((ci) => ({
    item_id: ci.id,
    item_name: ci.name,
    price: centsToUsd(ci.price),
    quantity: ci.quantity,
  }));

  const value = items.reduce((sum, i) => sum + i.price * i.quantity, 0);

  gtag('event', 'begin_checkout', {
    currency: 'USD',
    value,
    items,
  });
}

/**
 * Fire on the order-success page after a confirmed purchase.
 */
export function trackPurchase(order: {
  orderId: string;
  total: number;       // cents
  shipping: number;    // cents
  items: {
    id: string;
    name: string;
    price: number;     // cents
    quantity: number;
  }[];
}) {
  const items: AnalyticsItem[] = order.items.map((ci) => ({
    item_id: ci.id,
    item_name: ci.name,
    price: centsToUsd(ci.price),
    quantity: ci.quantity,
  }));

  gtag('event', 'purchase', {
    transaction_id: order.orderId,
    currency: 'USD',
    value: centsToUsd(order.total),
    shipping: centsToUsd(order.shipping),
    items,
  });
}

// ---------------------------------------------------------------------------
// GA initialisation check (for non-production / missing IDs)
// ---------------------------------------------------------------------------

export { GA_MEASUREMENT_ID };
