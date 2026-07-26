import { create } from 'zustand';
import { persist } from 'zustand/middleware';

interface WishlistState {
  wishlistIds: string[];
  toggleWishlist: (productId: string) => void;
  isInWishlist: (productId: string) => boolean;
  clearWishlist: () => void;
}

export const useWishlistStore = create<WishlistState>()(
  persist(
    (set, get) => ({
      wishlistIds: ['prod-001'],

      toggleWishlist: (productId) => {
        const current = get().wishlistIds;
        if (current.includes(productId)) {
          set({ wishlistIds: current.filter((id) => id !== productId) });
        } else {
          set({ wishlistIds: [...current, productId] });
        }
      },

      isInWishlist: (productId) => get().wishlistIds.includes(productId),

      clearWishlist: () => set({ wishlistIds: [] }),
    }),
    {
      name: 'pavitra-wishlist-store',
    }
  )
);
