import React from 'react';
import { useWishlistStore } from '../store/useWishlistStore';
import { useProductStore } from '../store/useProductStore';
import { useCartStore } from '../store/useCartStore';
import { Heart, ShoppingBag, Trash2 } from 'lucide-react';
import { Link } from 'react-router-dom';
import toast from 'react-hot-toast';

export const WishlistPage: React.FC = () => {
  const { wishlistIds, toggleWishlist } = useWishlistStore();
  const { products } = useProductStore();
  const { addToCart } = useCartStore();

  const savedProducts = products.filter((p) => wishlistIds.includes(p.id));

  return (
    <div className="bg-brand-black text-brand-offwhite min-h-screen py-12 font-inter">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="mb-8 space-y-2">
          <h1 className="font-syne font-black text-3xl sm:text-4xl text-white uppercase flex items-center gap-3">
            <Heart className="w-7 h-7 text-neon-green fill-neon-green" /> SAVED WISHLIST ({savedProducts.length})
          </h1>
          <p className="text-xs text-brand-muted">Keep track of modular components you plan to buy later.</p>
        </div>

        {savedProducts.length === 0 ? (
          <div className="bg-brand-surface border border-brand-border rounded-3xl p-12 text-center space-y-4">
            <Heart className="w-12 h-12 text-brand-muted mx-auto" />
            <h3 className="font-syne font-bold text-lg text-white">Your Wishlist is Empty</h3>
            <Link to="/products" className="inline-block bg-neon-green text-brand-black font-black text-xs px-6 py-3 rounded-xl uppercase">
              BROWSE STORE
            </Link>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {savedProducts.map((p) => (
              <div key={p.id} className="bg-brand-surface border border-brand-border rounded-2xl p-5 space-y-4">
                <img src={p.coverImage} className="w-full aspect-square object-cover rounded-xl" alt="" />
                <h4 className="font-syne font-bold text-base text-white uppercase">{p.name}</h4>
                <div className="font-mono font-bold text-neon-green text-lg">₹{p.price.toLocaleString('en-IN')}</div>
                
                <div className="flex gap-2">
                  <button
                    onClick={() => {
                      addToCart(p, 1);
                      toast.success(`Moved ${p.name} to cart!`);
                    }}
                    className="flex-1 bg-neon-green text-brand-black font-black text-xs py-2.5 rounded-xl uppercase flex items-center justify-center gap-1.5"
                  >
                    <ShoppingBag className="w-4 h-4" /> ADD TO CART
                  </button>
                  <button
                    onClick={() => toggleWishlist(p.id)}
                    className="p-2.5 bg-brand-black border border-brand-border text-brand-muted hover:text-red-400 rounded-xl"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};
