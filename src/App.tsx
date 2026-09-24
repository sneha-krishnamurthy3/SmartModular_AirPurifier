import React, { useState, useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route, useLocation } from 'react-router-dom';
import { trackPageView } from './services/analytics';
import { AnnouncementBar } from './components/layout/AnnouncementBar';
import { Navbar } from './components/layout/Navbar';
import { Footer } from './components/layout/Footer';
import { CustomCursor } from './components/layout/CustomCursor';
import { ScrollProgress } from './components/layout/ScrollProgress';
import { ScrollToTop } from './components/layout/ScrollToTop';
import { CartDrawer } from './components/cart/CartDrawer';
import { CheckoutModal } from './components/checkout/CheckoutModal';
import { AuthModal } from './components/auth/AuthModal';

import { Home } from './pages/Home';
import { ProductsPage } from './pages/ProductsPage';
import { ProductDetail } from './pages/ProductDetail';
import { HowItWorksPage } from './pages/HowItWorksPage';
import { SustainabilityPage } from './pages/SustainabilityPage';
import { FAQPage } from './pages/FAQPage';
import { OrderTrackingPage } from './pages/OrderTrackingPage';
import { ProfilePage } from './pages/ProfilePage';
import { WishlistPage } from './pages/WishlistPage';
import { StaticPolicyPage } from './pages/StaticPolicyPage';
import { SupportPage } from './pages/SupportPage';
import { LoginPage } from './pages/LoginPage';
import { AdminDashboard } from './pages/AdminDashboard';
import { NotFoundPage } from './pages/NotFoundPage';

import { Toaster } from 'react-hot-toast';

const Layout: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const location = useLocation();
  const isAdminPath = location.pathname.startsWith('/admin');

  const [isCheckoutOpen, setIsCheckoutOpen] = useState(false);
  const [isAuthOpen, setIsAuthOpen] = useState(false);

  useEffect(() => {
    trackPageView(location.pathname + location.search);
  }, [location.pathname, location.search]);

  return (
    <div className="min-h-screen bg-[#09090B] text-white flex flex-col font-inter">
      <ScrollToTop />
      <CustomCursor />
      <ScrollProgress />
      
      <Toaster 
        position="bottom-right"
        toastOptions={{
          style: {
            background: '#121215',
            color: '#FFFFFF',
            border: '1px solid #27272A',
            borderRadius: '12px',
            fontSize: '12px',
            fontWeight: '600',
          },
        }}
      />

      {!isAdminPath && <AnnouncementBar />}
      {!isAdminPath && <Navbar onOpenAuthModal={() => setIsAuthOpen(true)} />}

      <div className="flex-1">{children}</div>

      {!isAdminPath && <Footer />}

      {/* Global Drawers & Modals */}
      <CartDrawer onProceedCheckout={() => setIsCheckoutOpen(true)} />
      <CheckoutModal isOpen={isCheckoutOpen} onClose={() => setIsCheckoutOpen(false)} />
      <AuthModal isOpen={isAuthOpen} onClose={() => setIsAuthOpen(false)} />
    </div>
  );
};

export function App() {
  return (
    <Router>
      <Layout>
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/login" element={<LoginPage />} />
          <Route path="/products" element={<ProductsPage />} />
          <Route path="/product/:id" element={<ProductDetail />} />
          <Route path="/how-it-works" element={<HowItWorksPage />} />
          <Route path="/sustainability" element={<SustainabilityPage />} />
          <Route path="/wishlist" element={<WishlistPage />} />
          <Route path="/order-tracking/:id" element={<OrderTrackingPage />} />
          <Route path="/orders" element={<ProfilePage />} />
          <Route path="/profile" element={<ProfilePage />} />
          <Route path="/faq" element={<FAQPage />} />
          <Route path="/about" element={<StaticPolicyPage />} />
          <Route path="/support" element={<SupportPage />} />
          <Route path="/contact" element={<SupportPage />} />
          <Route path="/policy/:type" element={<StaticPolicyPage />} />
          <Route path="/admin" element={<AdminDashboard />} />
          <Route path="*" element={<NotFoundPage />} />
        </Routes>
      </Layout>
    </Router>
  );
}

export default App;
