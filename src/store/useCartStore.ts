import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import type { Product, CartItem, Coupon } from '../types';
import { initialCoupons } from '../data/initialData';

interface CartState {
  cart: CartItem[];
  appliedCoupon: Coupon | null;
  coupons: Coupon[];
  isCartOpen: boolean;
  
  // Cart Actions
  addToCart: (product: Product, quantity?: number) => void;
  removeFromCart: (productId: string) => void;
  updateQuantity: (productId: string, quantity: number) => void;
  clearCart: () => void;
  setCartOpen: (isOpen: boolean) => void;
  
  // Coupon Actions
  applyCoupon: (code: string) => { success: boolean; message: string };
  removeCoupon: () => void;
  addCoupon: (coupon: Omit<Coupon, 'id' | 'timesUsed'>) => void;
  deleteCoupon: (id: string) => void;
  
  // Calculations
  getSubtotal: () => number;
  getDiscount: () => number;
  getShipping: () => number;
  getTax: () => number;
  getTotal: () => number;
}

export const useCartStore = create<CartState>()(
  persist(
    (set, get) => ({
      cart: [],
      appliedCoupon: null,
      coupons: initialCoupons,
      isCartOpen: false,

      addToCart: (product, quantity = 1) => {
        const currentCart = get().cart;
        const existingIndex = currentCart.findIndex((item) => item.product.id === product.id);

        if (existingIndex > -1) {
          const updatedCart = [...currentCart];
          updatedCart[existingIndex].quantity += quantity;
          set({ cart: updatedCart, isCartOpen: true });
        } else {
          set({ cart: [...currentCart, { product, quantity }], isCartOpen: true });
        }
      },

      removeFromCart: (productId) => {
        set({ cart: get().cart.filter((item) => item.product.id !== productId) });
      },

      updateQuantity: (productId, quantity) => {
        if (quantity <= 0) {
          get().removeFromCart(productId);
          return;
        }
        set({
          cart: get().cart.map((item) => (item.product.id === productId ? { ...item, quantity } : item)),
        });
      },

      clearCart: () => {
        set({ cart: [], appliedCoupon: null });
      },

      setCartOpen: (isOpen) => set({ isCartOpen: isOpen }),

      applyCoupon: (code) => {
        const cleanCode = code.trim().toUpperCase();
        const found = get().coupons.find((c) => c.code.toUpperCase() === cleanCode && c.isActive);

        if (!found) {
          return { success: false, message: 'Invalid coupon code' };
        }

        const subtotal = get().getSubtotal();
        if (subtotal < found.minPurchase) {
          return {
            success: false,
            message: `Minimum purchase amount of ₹${found.minPurchase} required for this coupon`,
          };
        }

        set({ appliedCoupon: found });
        return { success: true, message: `Coupon '${found.code}' applied successfully!` };
      },

      removeCoupon: () => set({ appliedCoupon: null }),

      addCoupon: (couponData) => {
        const newCoupon: Coupon = {
          ...couponData,
          id: `coup-${Date.now()}`,
          timesUsed: 0,
        };
        set((state) => ({ coupons: [newCoupon, ...state.coupons] }));
      },

      deleteCoupon: (id) => {
        set((state) => ({ coupons: state.coupons.filter((c) => c.id !== id) }));
      },

      getSubtotal: () => {
        return get().cart.reduce((acc, item) => acc + item.product.price * item.quantity, 0);
      },

      getDiscount: () => {
        const coupon = get().appliedCoupon;
        if (!coupon) return 0;
        const subtotal = get().getSubtotal();

        if (coupon.type === 'percentage') {
          return Math.round((subtotal * coupon.value) / 100);
        }
        return Math.min(coupon.value, subtotal);
      },

      getShipping: () => {
        const subtotal = get().getSubtotal();
        if (subtotal === 0) return 0;
        return subtotal >= 1999 ? 0 : 150;
      },

      getTax: () => {
        const taxable = get().getSubtotal() - get().getDiscount();
        return Math.round(Math.max(0, taxable) * 0.18); // 18% GST
      },

      getTotal: () => {
        const subtotal = get().getSubtotal();
        if (subtotal === 0) return 0;
        const discount = get().getDiscount();
        const shipping = get().getShipping();
        const tax = get().getTax();
        return Math.max(0, subtotal - discount + shipping + tax);
      },
    }),
    {
      name: 'pavitra-cart-store',
    }
  )
);
