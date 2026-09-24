import type { Product, CartItem, Order } from '../types';

declare global {
  interface Window {
    dataLayer: any[];
    gtag?: (...args: any[]) => void;
  }
}

export const GA_MEASUREMENT_ID = 'G-7ZHY9S6YYJ';

// Helper to safely invoke gtag
export const gtag = (...args: any[]) => {
  if (typeof window !== 'undefined' && typeof window.gtag === 'function') {
    window.gtag(...args);
  } else if (typeof window !== 'undefined') {
    window.dataLayer = window.dataLayer || [];
    window.dataLayer.push(args);
  }
};

// Dispatch event with debug_mode for instant Realtime/DebugView visibility
export const sendEvent = (eventName: string, params: Record<string, any> = {}) => {
  const payload = { ...params, debug_mode: true };
  gtag('event', eventName, payload);
  if (typeof window !== 'undefined') {
    console.log(
      `%c[GA4 Analytics] 🎯 ${eventName}`,
      'color: #D7FF2F; background: #09090B; font-weight: bold; padding: 3px 8px; border-radius: 4px; border: 1px solid #27272A;',
      payload
    );
  }
};

// 1. Page View tracking (crucial for SPAs)
export const trackPageView = (path: string, title?: string) => {
  sendEvent('page_view', {
    page_path: path,
    page_location: typeof window !== 'undefined' ? window.location.href : '',
    page_title: title || (typeof document !== 'undefined' ? document.title : ''),
  });
};

// 2. View Product Detail (Funnel Step: view_item)
export const trackViewItem = (product: Product) => {
  sendEvent('view_item', {
    currency: 'INR',
    value: product.price,
    items: [
      {
        item_id: product.id,
        item_name: product.name,
        item_category: product.category,
        price: product.price,
        quantity: 1,
      },
    ],
  });
};

// 3. Add To Cart (Funnel Step: add_to_cart)
export const trackAddToCart = (product: Product, quantity: number = 1) => {
  sendEvent('add_to_cart', {
    currency: 'INR',
    value: product.price * quantity,
    items: [
      {
        item_id: product.id,
        item_name: product.name,
        item_category: product.category,
        price: product.price,
        quantity,
      },
    ],
  });
};

// 4. Begin Checkout (Funnel Step: begin_checkout)
export const trackBeginCheckout = (items: CartItem[], total: number) => {
  sendEvent('begin_checkout', {
    currency: 'INR',
    value: total,
    items: items.map((item) => ({
      item_id: item.product.id,
      item_name: item.product.name,
      item_category: item.product.category,
      price: item.product.price,
      quantity: item.quantity,
    })),
  });
};

// 5. Purchase Confirmation (Funnel Step: purchase)
export const trackPurchase = (order: Order) => {
  sendEvent('purchase', {
    transaction_id: order.id,
    value: order.total,
    currency: 'INR',
    tax: order.tax || 0,
    shipping: order.shippingFee || 0,
    items: order.items.map((item) => ({
      item_id: item.product.id,
      item_name: item.product.name,
      item_category: item.product.category,
      price: item.product.price,
      quantity: item.quantity,
    })),
  });
};
