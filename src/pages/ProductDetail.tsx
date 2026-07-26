import React, { useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { useProductStore } from '../store/useProductStore';
import { useCartStore } from '../store/useCartStore';
import { useWishlistStore } from '../store/useWishlistStore';
import { ShieldCheck, Truck, RotateCcw, Heart, ShoppingBag, Check, Star } from 'lucide-react';
import toast from 'react-hot-toast';

export const ProductDetail: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const { products } = useProductStore();
  const { addToCart } = useCartStore();
  const { toggleWishlist, isInWishlist } = useWishlistStore();

  const product = products.find((p) => p.id === id) || products[0];
  const [selectedImage, setSelectedImage] = useState(product.coverImage || '/pavitra_purifier.png');
  const [quantity, setQuantity] = useState(1);

  const inWishlist = isInWishlist(product.id);

  const handleAddToCart = () => {
    addToCart(product, quantity);
    toast.success(`Added ${quantity} x ${product.name} to cart!`);
  };

  return (
    <div className="bg-[#09090B] text-white min-h-screen py-12 font-inter">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        <div className="text-xs text-gray-400 mb-8 font-medium">
          <Link to="/" className="hover:text-white">Home</Link> / <Link to="/products" className="hover:text-white">Products</Link> / <span className="text-[#D7FF2F] font-bold">{product.name}</span>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-start">
          
          <div className="lg:col-span-6 space-y-4">
            <div className="aspect-square w-full rounded-3xl overflow-hidden bg-[#111111] border border-[#27272A] p-6 flex items-center justify-center">
              <img
                src={selectedImage || product.coverImage || '/pavitra_purifier.png'}
                alt={product.name}
                onError={(e) => {
                  e.currentTarget.src = '/pavitra_purifier.png';
                }}
                className="w-full h-full object-contain drop-shadow-xl"
              />
            </div>

            {product.images && product.images.length > 1 && (
              <div className="flex gap-3">
                {product.images.map((imgUrl, i) => (
                  <button
                    key={i}
                    onClick={() => setSelectedImage(imgUrl)}
                    className={`w-20 h-20 rounded-xl overflow-hidden border p-2 bg-[#111111] transition-all ${
                      selectedImage === imgUrl ? 'border-[#D7FF2F]' : 'border-[#27272A] opacity-60'
                    }`}
                  >
                    <img 
                      src={imgUrl} 
                      alt="Thumb" 
                      onError={(e) => {
                        e.currentTarget.src = '/pavitra_purifier.png';
                      }}
                      className="w-full h-full object-contain" 
                    />
                  </button>
                ))}
              </div>
            )}
          </div>

          <div className="lg:col-span-6 space-y-6">
            
            <div className="space-y-2">
              <span className="text-xs font-mono font-bold text-[#D7FF2F] uppercase tracking-widest">
                SKU: {product.sku}
              </span>
              <h1 className="text-4xl font-black font-syne uppercase text-white tracking-tight">
                {product.name}
              </h1>
              
              <div className="flex items-center gap-2 text-xs">
                <div className="flex text-[#F59E0B]">
                  {Array.from({ length: 5 }).map((_, i) => (
                    <Star key={i} className="w-4 h-4 fill-[#F59E0B] text-[#F59E0B]" />
                  ))}
                </div>
                <span className="font-bold text-white font-mono">4.8</span>
                <span className="text-gray-400">({product.reviewsCount} verified reviews)</span>
              </div>
            </div>

            <div className="flex items-center gap-4 py-2 border-y border-[#27272A]">
              <span className="font-syne font-black text-4xl text-white font-mono">
                ₹{product.price.toLocaleString('en-IN')}
              </span>
              {product.originalPrice > product.price && (
                <>
                  <span className="text-base line-through text-gray-500 font-mono">
                    ₹{product.originalPrice.toLocaleString('en-IN')}
                  </span>
                  <span className="bg-[#D7FF2F] text-[#09090B] text-xs font-black px-2.5 py-1 uppercase rounded">
                    SAVE ₹{(product.originalPrice - product.price).toLocaleString('en-IN')}
                  </span>
                </>
              )}
            </div>

            <p className="text-xs text-gray-300 leading-relaxed font-medium">
              {product.description}
            </p>

            <div className="space-y-2">
              <h4 className="text-xs font-black tracking-wider text-[#D7FF2F] uppercase">KEY HIGHLIGHTS</h4>
              <ul className="space-y-2 text-xs font-medium text-white">
                {product.features.map((feat, idx) => (
                  <li key={idx} className="flex items-center gap-2">
                    <Check className="w-3.5 h-3.5 text-[#D7FF2F] shrink-0 stroke-[3]" />
                    <span>{feat}</span>
                  </li>
                ))}
              </ul>
            </div>

            <div className="space-y-4 pt-4 border-t border-[#27272A]">
              <div className="flex items-center gap-4">
                <div className="flex items-center gap-3 bg-[#111111] border border-[#27272A] px-3 py-2 rounded-xl">
                  <button 
                    onClick={() => setQuantity(Math.max(1, quantity - 1))}
                    className="text-gray-400 hover:text-white font-bold"
                  >
                    -
                  </button>
                  <span className="font-mono font-bold text-xs px-2 text-white">{quantity}</span>
                  <button 
                    onClick={() => setQuantity(quantity + 1)}
                    className="text-gray-400 hover:text-white font-bold"
                  >
                    +
                  </button>
                </div>

                <button
                  onClick={handleAddToCart}
                  className="flex-1 bg-[#D7FF2F] text-[#09090B] hover:bg-[#C2EB1B] font-black text-xs py-3.5 px-6 rounded-xl uppercase tracking-wider flex items-center justify-center gap-2 shadow-lg transition-colors"
                >
                  <ShoppingBag className="w-4 h-4" /> ADD TO CART
                </button>

                <button
                  onClick={() => {
                    toggleWishlist(product.id);
                    toast.success(inWishlist ? 'Removed from wishlist' : 'Saved to wishlist');
                  }}
                  className="p-3.5 rounded-xl bg-[#111111] border border-[#27272A] text-gray-400 hover:text-red-400 transition-colors"
                >
                  <Heart className={`w-5 h-5 ${inWishlist ? 'fill-red-500 text-red-500' : ''}`} />
                </button>
              </div>
            </div>

            <div className="grid grid-cols-3 gap-2 pt-4 border-t border-[#27272A] text-[11px] font-bold text-gray-400">
              <div className="flex items-center gap-2">
                <Truck className="w-4 h-4 text-[#D7FF2F]" /> Free Pan-India Delivery
              </div>
              <div className="flex items-center gap-2">
                <RotateCcw className="w-4 h-4 text-[#D7FF2F]" /> 7-Day Returns
              </div>
              <div className="flex items-center gap-2">
                <ShieldCheck className="w-4 h-4 text-[#D7FF2F]" /> 1 Year Warranty
              </div>
            </div>

          </div>

        </div>
      </div>
    </div>
  );
};
