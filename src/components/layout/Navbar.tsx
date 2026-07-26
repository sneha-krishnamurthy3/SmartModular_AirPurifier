import React, { useState } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { useCartStore } from '../../store/useCartStore';
import { useWishlistStore } from '../../store/useWishlistStore';
import { useAuthStore } from '../../store/useAuthStore';
import { 
  Heart, 
  User as UserIcon, 
  Menu, 
  X, 
  ArrowRight,
  ShieldCheck
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

interface NavbarProps {
  onOpenAuthModal?: () => void;
}

export const Navbar: React.FC<NavbarProps> = ({ onOpenAuthModal }) => {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const { cart, setCartOpen } = useCartStore();
  const { wishlistIds } = useWishlistStore();
  const { user, isAuthenticated, isAdmin } = useAuthStore();
  const location = useLocation();
  const navigate = useNavigate();

  const cartItemCount = cart.reduce((total, item) => total + item.quantity, 0);

  const navLinks = [
    { name: 'PRODUCTS', path: '/products' },
    { name: 'HOW IT WORKS', path: '/how-it-works' },
    { name: 'SUSTAINABILITY', path: '/sustainability' },
    { name: 'ABOUT US', path: '/about' },
    { name: 'SUPPORT', path: '/support' },
  ];

  return (
    <header className="sticky top-0 z-40 bg-[#F8F7F3] border-b border-gray-300 text-[#09090B]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-20">
          
          {/* Logo Section: Solid Neon Green Box on Left */}
          <Link to="/" className="flex items-center group shrink-0">
            <div className="bg-[#D7FF2F] text-[#09090B] px-5 py-3.5 font-syne font-black text-xl tracking-tighter leading-none flex flex-col justify-center transition-transform group-hover:scale-105">
              <span className="text-xl font-black tracking-tight">PAVITRA</span>
              <span className="text-[9px] tracking-widest font-mono text-[#09090B] font-bold">INNOVATIONS</span>
            </div>
          </Link>

          {/* Nav Links */}
          <nav className="hidden lg:flex items-center space-x-8">
            {navLinks.map((link) => {
              const isActive = location.pathname === link.path;
              return (
                <Link
                  key={link.name}
                  to={link.path}
                  className={`text-xs font-black tracking-wider uppercase transition-colors ${
                    isActive ? 'text-[#09090B] underline underline-offset-4 decoration-[#D7FF2F]' : 'text-[#09090B]/80 hover:text-[#09090B]'
                  }`}
                >
                  {link.name}
                </Link>
              );
            })}

            {isAdmin && (
              <Link
                to="/admin"
                className="text-xs font-bold tracking-wider text-[#6C3EF4] bg-[#6C3EF4]/10 px-3 py-1.5 rounded-full border border-[#6C3EF4]/30 flex items-center gap-1.5 hover:bg-[#6C3EF4]/20 transition-all"
              >
                <ShieldCheck className="w-3.5 h-3.5" /> ADMIN CMS
              </Link>
            )}
          </nav>

          {/* Action Buttons */}
          <div className="flex items-center gap-3">
            
            {/* Wishlist */}
            <Link 
              to="/wishlist" 
              className="relative p-2 text-[#09090B] hover:text-[#6C3EF4] transition-colors hidden sm:block"
              title="Wishlist"
            >
              <Heart className="w-5 h-5" />
              {wishlistIds.length > 0 && (
                <span className="absolute top-1 right-1 w-4 h-4 bg-[#6C3EF4] text-white text-[10px] font-bold rounded-full flex items-center justify-center">
                  {wishlistIds.length}
                </span>
              )}
            </Link>

            {/* Auth / Account */}
            {isAuthenticated ? (
              <button
                onClick={() => navigate('/profile')}
                className="flex items-center gap-2 text-xs font-bold text-[#09090B] hover:opacity-80 p-2 transition-opacity"
                title={user?.name || 'Account'}
              >
                {user?.photoURL ? (
                  <img src={user.photoURL} alt="Profile" className="w-6 h-6 rounded-full object-cover border border-[#D7FF2F]" />
                ) : (
                  <UserIcon className="w-5 h-5" />
                )}
                <span className="hidden xl:inline max-w-[90px] truncate">{user?.name}</span>
              </button>
            ) : (
              <button
                onClick={onOpenAuthModal}
                className="text-xs font-black text-[#09090B] hover:opacity-80 p-2 transition-opacity uppercase tracking-wider"
              >
                SIGN IN
              </button>
            )}

            {/* CART (0) Black Block */}
            <button
              onClick={() => setCartOpen(true)}
              className="bg-[#09090B] text-white hover:bg-[#1a1a1e] px-5 py-3 text-xs font-black tracking-wider flex items-center gap-2.5 transition-colors"
            >
              <span>CART</span>
              <span className="w-5 h-5 rounded-full bg-white text-[#09090B] text-[10px] font-mono font-bold flex items-center justify-center">
                {cartItemCount}
              </span>
            </button>

            {/* BUY NOW → Neon Green Block */}
            <Link
              to="/products"
              className="bg-[#D7FF2F] text-[#09090B] hover:bg-[#C2EB1B] px-5 py-3 text-xs font-black tracking-wider flex items-center gap-1.5 transition-colors shadow-sm"
            >
              BUY NOW <ArrowRight className="w-4 h-4" />
            </Link>

            {/* Mobile menu toggle */}
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="lg:hidden p-2 text-[#09090B]"
            >
              {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </button>

          </div>
        </div>
      </div>

      {/* Mobile Drawer Menu */}
      <AnimatePresence>
        {mobileMenuOpen && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            className="lg:hidden bg-[#F8F7F3] border-b border-gray-300 overflow-hidden"
          >
            <div className="px-6 py-6 space-y-4">
              {navLinks.map((link) => (
                <Link
                  key={link.name}
                  to={link.path}
                  onClick={() => setMobileMenuOpen(false)}
                  className="block text-sm font-bold tracking-wider text-[#09090B] hover:text-[#6C3EF4]"
                >
                  {link.name}
                </Link>
              ))}

              <div className="pt-4 border-t border-gray-300 flex flex-col gap-3">
                <Link
                  to="/wishlist"
                  onClick={() => setMobileMenuOpen(false)}
                  className="flex items-center gap-2 text-sm font-bold text-[#09090B]"
                >
                  <Heart className="w-4 h-4 text-[#6C3EF4]" /> WISHLIST ({wishlistIds.length})
                </Link>

                <Link
                  to="/admin"
                  onClick={() => setMobileMenuOpen(false)}
                  className="flex items-center gap-2 text-sm font-bold text-[#6C3EF4]"
                >
                  <ShieldCheck className="w-4 h-4" /> ADMIN DASHBOARD
                </Link>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </header>
  );
};
