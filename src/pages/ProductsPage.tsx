import React, { useState } from 'react';
import { useProductStore } from '../store/useProductStore';
import { useCartStore } from '../store/useCartStore';
import { useWishlistStore } from '../store/useWishlistStore';
import { Search, Heart, ShoppingBag, Sparkles } from 'lucide-react';
import { Link } from 'react-router-dom';
import toast from 'react-hot-toast';

export const ProductsPage: React.FC = () => {
  const { products } = useProductStore();
  const { addToCart } = useCartStore();
  const { toggleWishlist, isInWishlist } = useWishlistStore();

  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [search, setSearch] = useState<string>('');
  const [maxPrice, setMaxPrice] = useState<number>(7000);

  const categories = [
    { id: 'all', label: 'All Products' },
    { id: 'purifier', label: 'Air Purifiers' },
    { id: 'filter', label: 'HEPA Filters' },
    { id: 'power_module', label: 'Power & Motor' },
    { id: 'aqi_sensor', label: 'AQI Displays' },
    { id: 'accessory', label: 'Accessories' },
  ];

  const filteredProducts = products.filter((p) => {
    if (!p.isPublished) return false;
    const matchesCategory = selectedCategory === 'all' || p.category === selectedCategory;
    const matchesSearch = p.name.toLowerCase().includes(search.toLowerCase()) || p.tagline.toLowerCase().includes(search.toLowerCase());
    const matchesPrice = p.price <= maxPrice;
    return matchesCategory && matchesSearch && matchesPrice;
  });

  return (
    <div className="bg-[#09090B] text-white min-h-screen py-12 font-inter">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Top Header */}
        <div className="mb-10 space-y-3">
          <div className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full bg-[#111111] border border-gray-800 text-[#D7FF2F] text-xs font-black tracking-widest uppercase">
            <Sparkles className="w-3.5 h-3.5" />
            <span>MODULAR STORE</span>
          </div>
          <h1 className="text-4xl sm:text-5xl font-black font-syne tracking-tighter uppercase text-white">
            PURIFIERS & <span className="text-[#D7FF2F]">REPLACEMENT MODULES</span>
          </h1>
          <p className="text-gray-300 text-sm font-medium max-w-xl">
            Upgrade individual components or buy complete starter kits. All products feature 100% plant-based PLA construction.
          </p>
        </div>

        {/* Search & Filter Bar */}
        <div className="bg-[#111111] border border-[#27272A] rounded-2xl p-4 sm:p-6 mb-10 space-y-4 shadow-sm">
          <div className="grid grid-cols-1 md:grid-cols-12 gap-4 items-center">
            <div className="md:col-span-6 relative">
              <Search className="w-4 h-4 absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-400" />
              <input
                type="text"
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                placeholder="Search products or modules..."
                className="w-full bg-[#09090B] border border-[#27272A] rounded-xl py-2.5 pl-10 pr-4 text-xs text-white placeholder-gray-400 focus:outline-none focus:border-[#D7FF2F]"
              />
            </div>

            <div className="md:col-span-6 flex items-center gap-4">
              <span className="text-xs font-bold text-gray-300 whitespace-nowrap">MAX PRICE:</span>
              <input
                type="range"
                min="500"
                max="7000"
                step="250"
                value={maxPrice}
                onChange={(e) => setMaxPrice(Number(e.target.value))}
                className="w-full accent-[#D7FF2F] cursor-pointer h-1.5 bg-gray-800 rounded-lg"
              />
              <span className="text-xs font-mono font-bold text-[#D7FF2F] whitespace-nowrap">
                ₹{maxPrice.toLocaleString('en-IN')}
              </span>
            </div>
          </div>

          <div className="flex flex-wrap gap-2 pt-2 border-t border-[#27272A]">
            {categories.map((cat) => (
              <button
                key={cat.id}
                onClick={() => setSelectedCategory(cat.id)}
                className={`px-3.5 py-1.5 rounded-xl text-xs font-black transition-all ${
                  selectedCategory === cat.id
                    ? 'bg-[#D7FF2F] text-[#09090B]'
                    : 'bg-[#09090B] border border-[#27272A] text-gray-300 hover:text-white'
                }`}
              >
                {cat.label}
              </button>
            ))}
          </div>
        </div>

        {/* Product Cards Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {filteredProducts.map((product) => {
            const inWishlist = isInWishlist(product.id);
            return (
              <div
                key={product.id}
                className="bg-[#111111] border border-[#27272A] rounded-3xl p-6 flex flex-col justify-between hover:border-gray-600 transition-all group relative shadow-sm"
              >
                <button
                  onClick={() => {
                    toggleWishlist(product.id);
                    toast.success(inWishlist ? 'Removed from wishlist' : 'Added to wishlist!');
                  }}
                  className="absolute top-4 right-4 z-10 w-9 h-9 rounded-full bg-[#09090B]/80 border border-[#27272A] flex items-center justify-center text-gray-300 hover:text-red-400 transition-colors"
                >
                  <Heart className={`w-4 h-4 ${inWishlist ? 'fill-red-500 text-red-500' : ''}`} />
                </button>

                {product.discountPercentage > 0 && (
                  <span className="absolute top-4 left-4 z-10 bg-[#D7FF2F] text-[#09090B] text-[10px] font-black px-2 py-0.5 rounded uppercase font-mono">
                    -{product.discountPercentage}% OFF
                  </span>
                )}

                <Link to={`/product/${product.id}`} className="block aspect-square w-full rounded-2xl overflow-hidden bg-[#09090B] p-4 mb-6 relative flex items-center justify-center">
                  <img
                    src={product.coverImage || '/pavitra_purifier.png'}
                    alt={product.name}
                    onError={(e) => {
                      e.currentTarget.src = '/pavitra_purifier.png';
                    }}
                    className="w-full h-full object-contain group-hover:scale-105 transition-transform duration-300"
                  />
                </Link>

                <div className="space-y-3 flex-1 flex flex-col justify-between">
                  <div className="space-y-1">
                    <span className="text-[10px] font-mono font-bold text-[#6C3EF4] uppercase tracking-wider">
                      {product.category.replace('_', ' ')}
                    </span>
                    <Link to={`/product/${product.id}`}>
                      <h3 className="font-syne font-black text-lg text-white group-hover:text-[#D7FF2F] transition-colors uppercase">
                        {product.name}
                      </h3>
                    </Link>
                    <p className="text-xs text-gray-300 line-clamp-2 font-medium">
                      {product.tagline}
                    </p>
                  </div>

                  <div className="pt-4 border-t border-[#27272A] flex items-center justify-between">
                    <div>
                      <div className="font-syne font-black text-xl text-white font-mono">
                        ₹{product.price.toLocaleString('en-IN')}
                      </div>
                      {product.originalPrice > product.price && (
                        <div className="text-[11px] line-through text-gray-400 font-mono">
                          ₹{product.originalPrice.toLocaleString('en-IN')}
                        </div>
                      )}
                    </div>

                    <button
                      onClick={() => {
                        addToCart(product, 1);
                        toast.success(`Added ${product.name} to cart!`);
                      }}
                      className="bg-[#D7FF2F] text-[#09090B] hover:bg-[#C2EB1B] font-black text-xs px-4 py-2.5 rounded-xl uppercase tracking-wider flex items-center gap-1.5 transition-colors"
                    >
                      <ShoppingBag className="w-3.5 h-3.5" /> ADD TO CART
                    </button>
                  </div>

                </div>
              </div>
            );
          })}
        </div>

      </div>
    </div>
  );
};
