import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import type { Product, CMSData, FAQItem, Review } from '../types';
import { initialProducts, initialCMS, initialFAQs, initialReviews } from '../data/initialData';
import { saveFirestoreProduct, deleteFirestoreProduct, saveFirestoreCMS } from '../services/firestoreService';

interface ProductState {
  products: Product[];
  cms: CMSData;
  faqs: FAQItem[];
  reviews: Review[];
  searchQuery: string;
  selectedCategory: string;
  priceRange: [number, number];
  
  // Actions
  setSearchQuery: (query: string) => void;
  setSelectedCategory: (category: string) => void;
  setPriceRange: (range: [number, number]) => void;
  
  // Admin Product CMS Actions
  addProduct: (product: Omit<Product, 'id'>) => void;
  updateProduct: (id: string, updatedData: Partial<Product>) => void;
  deleteProduct: (id: string) => void;
  duplicateProduct: (id: string) => void;
  togglePublish: (id: string) => void;
  toggleFeatured: (id: string) => void;
  updatePrice: (id: string, price: number, originalPrice?: number) => void;
  
  // Admin CMS Content Actions
  updateCMS: (updatedCMS: Partial<CMSData>) => void;
  addFAQ: (faq: Omit<FAQItem, 'id'>) => void;
  updateFAQ: (id: string, faq: Partial<FAQItem>) => void;
  deleteFAQ: (id: string) => void;
  addReview: (review: Omit<Review, 'id' | 'createdAt'>) => void;
}

export const useProductStore = create<ProductState>()(
  persist(
    (set, get) => ({
      products: initialProducts,
      cms: initialCMS,
      faqs: initialFAQs,
      reviews: initialReviews,
      searchQuery: '',
      selectedCategory: 'all',
      priceRange: [0, 10000],

      setSearchQuery: (query) => set({ searchQuery: query }),
      setSelectedCategory: (category) => set({ selectedCategory: category }),
      setPriceRange: (range) => set({ priceRange: range }),

      addProduct: (newProductData) => {
        const id = `prod-${Date.now()}`;
        const newProduct: Product = {
          ...newProductData,
          id,
        };
        set((state) => ({ products: [newProduct, ...state.products] }));
        saveFirestoreProduct(newProduct);
      },

      updateProduct: (id, updatedData) => {
        set((state) => {
          const updatedProducts = state.products.map((p) => {
            if (p.id === id) {
              const updatedP = { ...p, ...updatedData };
              saveFirestoreProduct(updatedP);
              return updatedP;
            }
            return p;
          });
          return { products: updatedProducts };
        });
      },

      deleteProduct: (id) => {
        set((state) => ({
          products: state.products.filter((p) => p.id !== id),
        }));
        deleteFirestoreProduct(id);
      },

      duplicateProduct: (id) => {
        const product = get().products.find((p) => p.id === id);
        if (!product) return;
        const dup: Product = {
          ...product,
          id: `prod-${Date.now()}`,
          name: `${product.name} (Copy)`,
          sku: `${product.sku}-COPY`,
        };
        set((state) => ({ products: [dup, ...state.products] }));
        saveFirestoreProduct(dup);
      },

      togglePublish: (id) => {
        set((state) => {
          const updatedProducts = state.products.map((p) => {
            if (p.id === id) {
              const updatedP = { ...p, isPublished: !p.isPublished };
              saveFirestoreProduct(updatedP);
              return updatedP;
            }
            return p;
          });
          return { products: updatedProducts };
        });
      },

      toggleFeatured: (id) => {
        set((state) => {
          const updatedProducts = state.products.map((p) => {
            if (p.id === id) {
              const updatedP = { ...p, isFeatured: !p.isFeatured };
              saveFirestoreProduct(updatedP);
              return updatedP;
            }
            return p;
          });
          return { products: updatedProducts };
        });
      },

      updatePrice: (id, price, originalPrice) => {
        set((state) => {
          const updatedProducts = state.products.map((p) => {
            if (p.id === id) {
              const orig = originalPrice ?? p.originalPrice;
              const discount = orig > price ? Math.round(((orig - price) / orig) * 100) : 0;
              const updatedP = { ...p, price, originalPrice: orig, discountPercentage: discount };
              saveFirestoreProduct(updatedP);
              return updatedP;
            }
            return p;
          });
          return { products: updatedProducts };
        });
      },

      updateCMS: (updatedCMS) => {
        set((state) => {
          const newCMS = { ...state.cms, ...updatedCMS };
          saveFirestoreCMS(newCMS);
          return { cms: newCMS };
        });
      },

      addFAQ: (faqData) => {
        const newFaq: FAQItem = {
          ...faqData,
          id: `faq-${Date.now()}`,
        };
        set((state) => ({ faqs: [...state.faqs, newFaq] }));
      },

      updateFAQ: (id, faqData) => {
        set((state) => ({
          faqs: state.faqs.map((f) => (f.id === id ? { ...f, ...faqData } : f)),
        }));
      },

      deleteFAQ: (id) => {
        set((state) => ({
          faqs: state.faqs.filter((f) => f.id !== id),
        }));
      },

      addReview: (reviewData) => {
        const newRev: Review = {
          ...reviewData,
          id: `rev-${Date.now()}`,
          createdAt: new Date().toISOString().split('T')[0],
        };
        set((state) => ({ reviews: [newRev, ...state.reviews] }));
      },
    }),
    {
      name: 'pavitra-products-cms-store-v6',
      merge: (persistedState: any, currentState) => {
        return {
          ...currentState,
          ...persistedState,
          products: initialProducts,
          cms: initialCMS,
        };
      },
    }
  )
);
