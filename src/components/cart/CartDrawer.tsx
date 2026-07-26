import React, { useState } from 'react';
import { useCartStore } from '../../store/useCartStore';
import { X, Trash2, Plus, Minus, Tag, ArrowRight, ShoppingBag } from 'lucide-react';
import { motion } from 'framer-motion';
import toast from 'react-hot-toast';

interface CartDrawerProps {
  onProceedCheckout: () => void;
}

export const CartDrawer: React.FC<CartDrawerProps> = ({ onProceedCheckout }) => {
  const { 
    cart, 
    isCartOpen, 
    setCartOpen, 
    removeFromCart, 
    updateQuantity, 
    appliedCoupon, 
    applyCoupon, 
    removeCoupon,
    getSubtotal,
    getDiscount,
    getShipping,
    getTax,
    getTotal
  } = useCartStore();

  const [couponInput, setCouponInput] = useState('');

  if (!isCartOpen) return null;

  const handleApplyCoupon = (e: React.FormEvent) => {
    e.preventDefault();
    if (!couponInput) return;
    const res = applyCoupon(couponInput);
    if (res.success) {
      toast.success(res.message);
      setCouponInput('');
    } else {
      toast.error(res.message);
    }
  };

  const subtotal = getSubtotal();
  const discount = getDiscount();
  const shipping = getShipping();
  const tax = getTax();
  const total = getTotal();

  return (
    <div className="fixed inset-0 z-50 overflow-hidden font-inter">
      <div 
        onClick={() => setCartOpen(false)}
        className="absolute inset-0 bg-black/70 backdrop-blur-sm transition-opacity" 
      />

      <div className="fixed inset-y-0 right-0 max-w-full flex pl-10">
        <motion.div 
          initial={{ x: '100%' }}
          animate={{ x: 0 }}
          exit={{ x: '100%' }}
          transition={{ type: 'spring', damping: 25, stiffness: 200 }}
          className="w-screen max-w-md bg-brand-surface border-l border-brand-border text-brand-offwhite shadow-2xl flex flex-col"
        >
          
          <div className="p-6 border-b border-brand-border flex items-center justify-between">
            <div className="flex items-center gap-2">
              <ShoppingBag className="w-5 h-5 text-neon-green" />
              <h3 className="font-syne font-black text-lg text-white uppercase">YOUR SHOPPING CART</h3>
            </div>
            <button 
              onClick={() => setCartOpen(false)}
              className="p-1 text-brand-muted hover:text-white"
            >
              <X className="w-6 h-6" />
            </button>
          </div>

          <div className="flex-1 overflow-y-auto p-6 space-y-4">
            {cart.length === 0 ? (
              <div className="text-center py-16 space-y-4">
                <div className="w-16 h-16 rounded-full bg-brand-card border border-brand-border mx-auto flex items-center justify-center text-brand-muted">
                  <ShoppingBag className="w-8 h-8" />
                </div>
                <h4 className="font-syne font-bold text-white text-base">Your Cart is Empty</h4>
                <p className="text-xs text-brand-muted max-w-xs mx-auto">
                  Explore our modular air purifiers and replacement components.
                </p>
              </div>
            ) : (
              cart.map((item) => (
                <div 
                  key={item.product.id}
                  className="bg-brand-black border border-brand-border p-4 rounded-xl flex items-center gap-4 relative group"
                >
                  <img 
                    src={item.product.coverImage} 
                    alt={item.product.name}
                    className="w-16 h-16 object-cover rounded-lg border border-brand-border"
                  />
                  <div className="flex-1 space-y-1">
                    <h5 className="font-syne font-bold text-xs text-white uppercase pr-6">{item.product.name}</h5>
                    <div className="text-xs font-mono font-bold text-neon-green">
                      ₹{item.product.price.toLocaleString('en-IN')}
                    </div>
                    
                    <div className="flex items-center gap-3 pt-1">
                      <div className="flex items-center gap-2 bg-brand-surface border border-brand-border px-2 py-1 rounded">
                        <button 
                          onClick={() => updateQuantity(item.product.id, item.quantity - 1)}
                          className="text-brand-muted hover:text-white"
                        >
                          <Minus className="w-3 h-3" />
                        </button>
                        <span className="font-mono text-xs font-bold px-1">{item.quantity}</span>
                        <button 
                          onClick={() => updateQuantity(item.product.id, item.quantity + 1)}
                          className="text-brand-muted hover:text-white"
                        >
                          <Plus className="w-3 h-3" />
                        </button>
                      </div>
                    </div>
                  </div>

                  <button 
                    onClick={() => removeFromCart(item.product.id)}
                    className="absolute top-4 right-4 text-brand-muted hover:text-red-400"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              ))
            )}
          </div>

          {cart.length > 0 && (
            <div className="p-6 border-t border-brand-border bg-brand-black/90 space-y-4">
              {appliedCoupon ? (
                <div className="flex items-center justify-between bg-neon-green/10 border border-neon-green/30 p-2.5 rounded-lg text-xs font-bold text-neon-green">
                  <div className="flex items-center gap-2">
                    <Tag className="w-4 h-4" />
                    <span>COUPON '{appliedCoupon.code}' APPLIED (-₹{discount})</span>
                  </div>
                  <button onClick={removeCoupon} className="text-xs underline text-brand-offwhite hover:text-red-400">
                    REMOVE
                  </button>
                </div>
              ) : (
                <form onSubmit={handleApplyCoupon} className="flex gap-2">
                  <input
                    type="text"
                    value={couponInput}
                    onChange={(e) => setCouponInput(e.target.value)}
                    placeholder="Coupon code (e.g. CLEAN20)"
                    className="flex-1 bg-brand-surface border border-brand-border rounded-lg px-3 py-2 text-xs text-white uppercase placeholder-brand-muted focus:outline-none focus:border-neon-green"
                  />
                  <button
                    type="submit"
                    className="bg-brand-surface border border-brand-border hover:bg-brand-card text-neon-green font-bold text-xs px-4 py-2 rounded-lg"
                  >
                    APPLY
                  </button>
                </form>
              )}

              <div className="space-y-1.5 text-xs text-brand-muted pt-2 border-t border-brand-border/40 font-medium">
                <div className="flex justify-between">
                  <span>Subtotal</span>
                  <span className="font-mono text-white">₹{subtotal.toLocaleString('en-IN')}</span>
                </div>
                {discount > 0 && (
                  <div className="flex justify-between text-neon-green">
                    <span>Discount</span>
                    <span className="font-mono">-₹{discount.toLocaleString('en-IN')}</span>
                  </div>
                )}
                <div className="flex justify-between">
                  <span>Estimated Express Shipping</span>
                  <span className="font-mono text-white">
                    {shipping === 0 ? <span className="text-neon-green font-bold">FREE</span> : `₹${shipping}`}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span>GST (18%)</span>
                  <span className="font-mono text-white">₹{tax.toLocaleString('en-IN')}</span>
                </div>

                <div className="flex justify-between text-sm font-bold text-white pt-2 border-t border-brand-border">
                  <span>TOTAL PAYMENT</span>
                  <span className="font-mono text-neon-green font-black text-lg">
                    ₹{total.toLocaleString('en-IN')}
                  </span>
                </div>
              </div>

              <button
                onClick={() => {
                  setCartOpen(false);
                  onProceedCheckout();
                }}
                className="w-full bg-neon-green text-brand-black hover:bg-neon-hover font-black text-xs py-4 rounded-xl uppercase tracking-wider flex items-center justify-center gap-2 shadow-xl shadow-neon-green/10 transition-all"
              >
                <span>PROCEED TO CHECKOUT</span>
                <ArrowRight className="w-4 h-4" />
              </button>
            </div>
          )}

        </motion.div>
      </div>
    </div>
  );
};
