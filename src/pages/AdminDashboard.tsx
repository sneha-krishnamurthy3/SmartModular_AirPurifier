import React, { useState } from 'react';
import { useProductStore } from '../store/useProductStore';
import { useOrderStore } from '../store/useOrderStore';
import { useCartStore } from '../store/useCartStore';
import { useAuthStore } from '../store/useAuthStore';
import type { Product, OrderStatus } from '../types';
import { 
  LayoutDashboard, 
  Package, 
  ShoppingBag, 
  Users, 
  Tag, 
  FileText, 
  DollarSign, 
  Plus, 
  Edit3, 
  Trash2, 
  Copy, 
  Save
} from 'lucide-react';
import toast from 'react-hot-toast';

export const AdminDashboard: React.FC = () => {
  const [activeTab, setActiveTab] = useState<'overview' | 'products' | 'orders' | 'cms' | 'coupons' | 'users'>('overview');
  
  const { products, cms, addProduct, updateProduct, deleteProduct, duplicateProduct, togglePublish, updateCMS } = useProductStore();
  const { orders, updateOrderStatus } = useOrderStore();
  const { coupons, addCoupon, deleteCoupon } = useCartStore();
  const { allUsers, toggleBlockUser } = useAuthStore();

  // State for Product Edit / Create Modal
  const [isProductModalOpen, setIsProductModalOpen] = useState(false);
  const [editingProductId, setEditingProductId] = useState<string | null>(null);

  // Form states for Product
  const [prodName, setProdName] = useState('');
  const [prodTagline, setProdTagline] = useState('');
  const [prodPrice, setProdPrice] = useState<number>(4999);
  const [prodOrigPrice, setProdOrigPrice] = useState<number>(6999);
  const [prodCategory, setProdCategory] = useState<Product['category']>('purifier');
  const [prodStock, setProdStock] = useState<number>(50);
  const [prodCoverImage, setProdCoverImage] = useState('');

  // Form states for CMS
  const [cmsHeroLine1, setCmsHeroLine1] = useState(cms.heroTitleLine1);
  const [cmsHeroLine2, setCmsHeroLine2] = useState(cms.heroTitleLine2);
  const [cmsHeroHighlight, setCmsHeroHighlight] = useState(cms.heroTitleHighlight);
  const [cmsHeroSubtitle, setCmsHeroSubtitle] = useState(cms.heroSubtitle);
  const [cmsAnnouncement, setCmsAnnouncement] = useState(cms.announcementText);

  // Form states for Coupon
  const [newCouponCode, setNewCouponCode] = useState('');
  const [newCouponValue, setNewCouponValue] = useState<number>(20);
  const [newCouponMin, setNewCouponMin] = useState<number>(1000);

  // Summary Metrics
  const totalRevenue = orders.reduce((sum, o) => sum + (o.paymentStatus === 'Paid' ? o.total : 0), 0);
  const totalOrders = orders.length;
  const totalProducts = products.length;
  const totalCustomers = allUsers.filter((u) => u.role === 'customer').length;

  // Save Product Handler
  const handleSaveProduct = (e: React.FormEvent) => {
    e.preventDefault();
    if (editingProductId) {
      updateProduct(editingProductId, {
        name: prodName,
        tagline: prodTagline,
        price: prodPrice,
        originalPrice: prodOrigPrice,
        category: prodCategory,
        stock: prodStock,
        coverImage: prodCoverImage || 'https://images.unsplash.com/photo-1585771724684-38269d6639fd?q=80&w=800&auto=format&fit=crop',
      });
      toast.success('Product updated! Customer site automatically updated.');
    } else {
      addProduct({
        sku: `PAV-NEW-${Math.floor(1000 + Math.random() * 9000)}`,
        name: prodName,
        tagline: prodTagline,
        price: prodPrice,
        originalPrice: prodOrigPrice,
        discountPercentage: Math.round(((prodOrigPrice - prodPrice) / prodOrigPrice) * 100),
        coverImage: prodCoverImage || 'https://images.unsplash.com/photo-1585771724684-38269d6639fd?q=80&w=800&auto=format&fit=crop',
        images: [prodCoverImage || 'https://images.unsplash.com/photo-1585771724684-38269d6639fd?q=80&w=800&auto=format&fit=crop'],
        category: prodCategory,
        stock: prodStock,
        isFeatured: true,
        isPublished: true,
        rating: 5.0,
        reviewsCount: 1,
        description: prodTagline,
        specs: [{ label: 'Material', value: '100% Bio-PLA' }],
        features: ['Modular swap capable'],
        coverageArea: '350 sq ft',
        filtrationType: 'H13 HEPA',
        dimensions: '180x180x320mm',
        weight: '1.4kg',
        warranty: '1 Year',
        includedItems: ['Main Module'],
      });
      toast.success('New product created & published live!');
    }
    setIsProductModalOpen(false);
  };

  const handleOpenEditProduct = (p: Product) => {
    setEditingProductId(p.id);
    setProdName(p.name);
    setProdTagline(p.tagline);
    setProdPrice(p.price);
    setProdOrigPrice(p.originalPrice);
    setProdCategory(p.category);
    setProdStock(p.stock);
    setProdCoverImage(p.coverImage);
    setIsProductModalOpen(true);
  };

  const handleOpenNewProduct = () => {
    setEditingProductId(null);
    setProdName('');
    setProdTagline('');
    setProdPrice(999);
    setProdOrigPrice(1499);
    setProdCategory('purifier');
    setProdStock(50);
    setProdCoverImage('https://images.unsplash.com/photo-1585771724684-38269d6639fd?q=80&w=800&auto=format&fit=crop');
    setIsProductModalOpen(true);
  };

  const handleSaveCMS = (e: React.FormEvent) => {
    e.preventDefault();
    updateCMS({
      heroTitleLine1: cmsHeroLine1,
      heroTitleLine2: cmsHeroLine2,
      heroTitleHighlight: cmsHeroHighlight,
      heroSubtitle: cmsHeroSubtitle,
      announcementText: cmsAnnouncement,
    });
    toast.success('Homepage CMS content saved & updated live!');
  };

  const handleCreateCoupon = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newCouponCode) return;
    addCoupon({
      code: newCouponCode.toUpperCase(),
      type: 'percentage',
      value: newCouponValue,
      minPurchase: newCouponMin,
      expiryDate: '2027-12-31',
      usageLimit: 500,
      isActive: true,
    });
    toast.success(`Coupon '${newCouponCode}' created successfully!`);
    setNewCouponCode('');
  };

  return (
    <div className="bg-brand-black text-brand-offwhite min-h-screen font-inter flex flex-col">
      
      {/* Top Admin Header */}
      <header className="bg-brand-surface border-b border-brand-border py-4 px-6 sticky top-0 z-30 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="bg-brand-purple text-white px-3 py-1 font-syne font-black text-sm rounded uppercase">
            ADMIN CMS
          </div>
          <span className="text-xs text-brand-muted font-bold hidden sm:inline">
            Pavitra Innovations Central Command
          </span>
        </div>

        <div className="flex items-center gap-2">
          <span className="text-xs font-mono font-bold text-neon-green bg-neon-green/10 border border-neon-green/30 px-3 py-1 rounded-full">
            LIVE FIRESTORE CONNECTED
          </span>
        </div>
      </header>

      {/* Main Admin Body */}
      <div className="flex-1 flex flex-col md:flex-row">
        
        {/* Sidebar Nav */}
        <aside className="w-full md:w-64 bg-brand-surface border-r border-brand-border p-4 space-y-2 shrink-0">
          <button
            onClick={() => setActiveTab('overview')}
            className={`w-full text-left p-3 rounded-xl text-xs font-bold flex items-center gap-3 transition-colors ${
              activeTab === 'overview' ? 'bg-neon-green text-brand-black font-black' : 'text-brand-muted hover:text-white'
            }`}
          >
            <LayoutDashboard className="w-4 h-4" /> DASHBOARD OVERVIEW
          </button>

          <button
            onClick={() => setActiveTab('products')}
            className={`w-full text-left p-3 rounded-xl text-xs font-bold flex items-center gap-3 transition-colors ${
              activeTab === 'products' ? 'bg-neon-green text-brand-black font-black' : 'text-brand-muted hover:text-white'
            }`}
          >
            <Package className="w-4 h-4" /> PRODUCT MANAGEMENT
          </button>

          <button
            onClick={() => setActiveTab('orders')}
            className={`w-full text-left p-3 rounded-xl text-xs font-bold flex items-center gap-3 transition-colors ${
              activeTab === 'orders' ? 'bg-neon-green text-brand-black font-black' : 'text-brand-muted hover:text-white'
            }`}
          >
            <ShoppingBag className="w-4 h-4" /> ORDER MANAGEMENT ({orders.length})
          </button>

          <button
            onClick={() => setActiveTab('cms')}
            className={`w-full text-left p-3 rounded-xl text-xs font-bold flex items-center gap-3 transition-colors ${
              activeTab === 'cms' ? 'bg-neon-green text-brand-black font-black' : 'text-brand-muted hover:text-white'
            }`}
          >
            <FileText className="w-4 h-4" /> HOMEPAGE CMS BUILDER
          </button>

          <button
            onClick={() => setActiveTab('coupons')}
            className={`w-full text-left p-3 rounded-xl text-xs font-bold flex items-center gap-3 transition-colors ${
              activeTab === 'coupons' ? 'bg-neon-green text-brand-black font-black' : 'text-brand-muted hover:text-white'
            }`}
          >
            <Tag className="w-4 h-4" /> COUPON MANAGER
          </button>

          <button
            onClick={() => setActiveTab('users')}
            className={`w-full text-left p-3 rounded-xl text-xs font-bold flex items-center gap-3 transition-colors ${
              activeTab === 'users' ? 'bg-neon-green text-brand-black font-black' : 'text-brand-muted hover:text-white'
            }`}
          >
            <Users className="w-4 h-4" /> CUSTOMER DIRECTORY
          </button>
        </aside>

        {/* Content Panel */}
        <main className="flex-1 p-6 md:p-8 space-y-8 overflow-y-auto">
          
          {/* TAB 1: OVERVIEW METRICS */}
          {activeTab === 'overview' && (
            <div className="space-y-8">
              <div className="flex items-center justify-between">
                <h2 className="font-syne font-black text-2xl text-white uppercase">BUSINESS ANALYTICS OVERVIEW</h2>
                <span className="text-xs text-neon-green font-mono font-bold">Auto Synchronized</span>
              </div>

              {/* Metric Cards */}
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
                <div className="bg-brand-surface border border-brand-border p-6 rounded-2xl space-y-2">
                  <div className="flex justify-between text-brand-muted text-xs font-bold uppercase">
                    <span>TOTAL REVENUE</span>
                    <DollarSign className="w-4 h-4 text-neon-green" />
                  </div>
                  <div className="font-syne font-black text-3xl text-white font-mono">
                    ₹{totalRevenue.toLocaleString('en-IN')}
                  </div>
                  <span className="text-[10px] text-neon-green font-bold">+18.4% this month</span>
                </div>

                <div className="bg-brand-surface border border-brand-border p-6 rounded-2xl space-y-2">
                  <div className="flex justify-between text-brand-muted text-xs font-bold uppercase">
                    <span>TOTAL ORDERS</span>
                    <ShoppingBag className="w-4 h-4 text-brand-purple" />
                  </div>
                  <div className="font-syne font-black text-3xl text-white font-mono">
                    {totalOrders}
                  </div>
                  <span className="text-[10px] text-neon-green font-bold">100% fulfillment rate</span>
                </div>

                <div className="bg-brand-surface border border-brand-border p-6 rounded-2xl space-y-2">
                  <div className="flex justify-between text-brand-muted text-xs font-bold uppercase">
                    <span>ACTIVE PRODUCTS</span>
                    <Package className="w-4 h-4 text-neon-green" />
                  </div>
                  <div className="font-syne font-black text-3xl text-white font-mono">
                    {totalProducts}
                  </div>
                  <span className="text-[10px] text-brand-muted">Modular components live</span>
                </div>

                <div className="bg-brand-surface border border-brand-border p-6 rounded-2xl space-y-2">
                  <div className="flex justify-between text-brand-muted text-xs font-bold uppercase">
                    <span>CUSTOMERS</span>
                    <Users className="w-4 h-4 text-brand-purple" />
                  </div>
                  <div className="font-syne font-black text-3xl text-white font-mono">
                    {totalCustomers}
                  </div>
                  <span className="text-[10px] text-neon-green font-bold">4.8 Average Rating</span>
                </div>
              </div>

              {/* Recent Orders List */}
              <div className="bg-brand-surface border border-brand-border rounded-2xl p-6 space-y-4">
                <h3 className="font-syne font-bold text-lg text-white uppercase">RECENT ORDERS</h3>
                
                <div className="overflow-x-auto">
                  <table className="w-full text-left text-xs font-medium">
                    <thead>
                      <tr className="border-b border-brand-border text-brand-muted uppercase font-bold">
                        <th className="py-3 px-3">Order ID</th>
                        <th className="py-3 px-3">Customer</th>
                        <th className="py-3 px-3">Status</th>
                        <th className="py-3 px-3">Total</th>
                        <th className="py-3 px-3">Date</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-brand-border/60">
                      {orders.map((o) => (
                        <tr key={o.id} className="hover:bg-brand-black/50">
                          <td className="py-3 px-3 font-mono font-bold text-neon-green">{o.id}</td>
                          <td className="py-3 px-3 font-bold text-white">{o.customerName}</td>
                          <td className="py-3 px-3">
                            <span className="bg-brand-black border border-brand-border px-2.5 py-1 rounded text-[10px] font-bold text-neon-green">
                              {o.status}
                            </span>
                          </td>
                          <td className="py-3 px-3 font-mono font-bold text-white">₹{o.total.toLocaleString('en-IN')}</td>
                          <td className="py-3 px-3 text-brand-muted">{new Date(o.createdAt).toLocaleDateString('en-IN')}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            </div>
          )}

          {/* TAB 2: PRODUCT MANAGEMENT */}
          {activeTab === 'products' && (
            <div className="space-y-6">
              <div className="flex items-center justify-between">
                <div>
                  <h2 className="font-syne font-black text-2xl text-white uppercase">PRODUCT & PRICE MANAGEMENT</h2>
                  <p className="text-xs text-brand-muted">Edit prices or details here and it immediately reflects on the live site.</p>
                </div>

                <button
                  onClick={handleOpenNewProduct}
                  className="bg-neon-green text-brand-black hover:bg-neon-hover font-black text-xs px-4 py-2.5 rounded-xl uppercase flex items-center gap-2"
                >
                  <Plus className="w-4 h-4" /> ADD NEW PRODUCT
                </button>
              </div>

              {/* Product Table */}
              <div className="bg-brand-surface border border-brand-border rounded-2xl p-6 overflow-x-auto">
                <table className="w-full text-left text-xs font-medium">
                  <thead>
                    <tr className="border-b border-brand-border text-brand-muted uppercase font-bold">
                      <th className="py-3 px-3">Product</th>
                      <th className="py-3 px-3">Category</th>
                      <th className="py-3 px-3">Live Price (₹)</th>
                      <th className="py-3 px-3">Stock</th>
                      <th className="py-3 px-3">Status</th>
                      <th className="py-3 px-3 text-right">Actions</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-brand-border/60">
                    {products.map((p) => (
                      <tr key={p.id} className="hover:bg-brand-black/50">
                        <td className="py-3 px-3 font-bold text-white flex items-center gap-3">
                          <img src={p.coverImage} className="w-10 h-10 rounded-lg object-cover" alt="" />
                          <div>
                            <div className="font-syne font-bold uppercase">{p.name}</div>
                            <span className="text-[10px] font-mono text-brand-muted">{p.sku}</span>
                          </div>
                        </td>
                        <td className="py-3 px-3 font-mono text-brand-muted uppercase">{p.category}</td>
                        <td className="py-3 px-3 font-mono font-bold text-neon-green">
                          ₹{p.price.toLocaleString('en-IN')}
                        </td>
                        <td className="py-3 px-3 font-mono font-bold text-white">{p.stock}</td>
                        <td className="py-3 px-3">
                          <button 
                            onClick={() => togglePublish(p.id)}
                            className={`px-2 py-0.5 rounded text-[10px] font-bold uppercase ${
                              p.isPublished ? 'bg-neon-green/20 text-neon-green' : 'bg-red-500/20 text-red-400'
                            }`}
                          >
                            {p.isPublished ? 'Published' : 'Hidden'}
                          </button>
                        </td>
                        <td className="py-3 px-3 text-right space-x-2">
                          <button onClick={() => handleOpenEditProduct(p)} className="p-1.5 bg-brand-black hover:text-neon-green rounded">
                            <Edit3 className="w-4 h-4" />
                          </button>
                          <button onClick={() => duplicateProduct(p.id)} className="p-1.5 bg-brand-black hover:text-brand-purple rounded">
                            <Copy className="w-4 h-4" />
                          </button>
                          <button onClick={() => deleteProduct(p.id)} className="p-1.5 bg-brand-black hover:text-red-400 rounded">
                            <Trash2 className="w-4 h-4" />
                          </button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          )}

          {/* TAB 3: ORDER MANAGEMENT */}
          {activeTab === 'orders' && (
            <div className="space-y-6">
              <h2 className="font-syne font-black text-2xl text-white uppercase">ORDER MANAGEMENT</h2>

              <div className="space-y-4">
                {orders.map((order) => (
                  <div key={order.id} className="bg-brand-surface border border-brand-border rounded-2xl p-6 space-y-4">
                    <div className="flex flex-wrap items-center justify-between gap-4 border-b border-brand-border pb-4">
                      <div>
                        <span className="text-xs font-mono font-bold text-neon-green">ORDER #{order.id}</span>
                        <h4 className="font-syne font-bold text-base text-white">{order.customerName} ({order.customerEmail})</h4>
                      </div>

                      <div className="flex items-center gap-3">
                        <span className="text-xs font-bold text-brand-muted">STATUS:</span>
                        <select
                          value={order.status}
                          onChange={(e) => updateOrderStatus(order.id, e.target.value as OrderStatus)}
                          className="bg-brand-black border border-brand-border text-neon-green font-bold text-xs p-2 rounded-xl"
                        >
                          <option value="Pending">Pending</option>
                          <option value="Confirmed">Confirmed</option>
                          <option value="Packed">Packed</option>
                          <option value="Shipped">Shipped</option>
                          <option value="Out For Delivery">Out For Delivery</option>
                          <option value="Delivered">Delivered</option>
                          <option value="Cancelled">Cancelled</option>
                        </select>
                      </div>
                    </div>

                    <div className="flex justify-between items-center text-xs">
                      <div>
                        <span className="text-brand-muted">Items: {order.items.length} | Payment: {order.paymentMethod}</span>
                      </div>
                      <div className="font-mono font-bold text-neon-green text-sm">
                        Total: ₹{order.total.toLocaleString('en-IN')}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* TAB 4: HOMEPAGE CMS BUILDER */}
          {activeTab === 'cms' && (
            <div className="space-y-6 max-w-3xl">
              <h2 className="font-syne font-black text-2xl text-white uppercase">HOMEPAGE CONTENT CMS</h2>
              <p className="text-xs text-brand-muted">Edit headlines, announcement text, and hero copy without touching source code.</p>

              <form onSubmit={handleSaveCMS} className="bg-brand-surface border border-brand-border p-6 rounded-2xl space-y-4 text-xs font-bold">
                <div>
                  <label className="block text-brand-muted mb-1">HERO TITLE LINE 1</label>
                  <input
                    type="text"
                    value={cmsHeroLine1}
                    onChange={(e) => setCmsHeroLine1(e.target.value)}
                    className="w-full bg-brand-black border border-brand-border rounded-xl p-3 text-white"
                  />
                </div>

                <div>
                  <label className="block text-brand-muted mb-1">HERO TITLE LINE 2</label>
                  <input
                    type="text"
                    value={cmsHeroLine2}
                    onChange={(e) => setCmsHeroLine2(e.target.value)}
                    className="w-full bg-brand-black border border-brand-border rounded-xl p-3 text-white"
                  />
                </div>

                <div>
                  <label className="block text-brand-muted mb-1">HERO HIGHLIGHTED WORD (NEON GREEN)</label>
                  <input
                    type="text"
                    value={cmsHeroHighlight}
                    onChange={(e) => setCmsHeroHighlight(e.target.value)}
                    className="w-full bg-brand-black border border-brand-border rounded-xl p-3 text-white"
                  />
                </div>

                <div>
                  <label className="block text-brand-muted mb-1">HERO SUBTITLE COPY</label>
                  <textarea
                    value={cmsHeroSubtitle}
                    onChange={(e) => setCmsHeroSubtitle(e.target.value)}
                    rows={3}
                    className="w-full bg-brand-black border border-brand-border rounded-xl p-3 text-white"
                  />
                </div>

                <div>
                  <label className="block text-brand-muted mb-1">HEADER ANNOUNCEMENT BAR TEXT</label>
                  <input
                    type="text"
                    value={cmsAnnouncement}
                    onChange={(e) => setCmsAnnouncement(e.target.value)}
                    className="w-full bg-brand-black border border-brand-border rounded-xl p-3 text-white"
                  />
                </div>

                <button
                  type="submit"
                  className="bg-neon-green text-brand-black font-black text-xs py-3 px-6 rounded-xl uppercase tracking-wider flex items-center gap-2"
                >
                  <Save className="w-4 h-4" /> SAVE CMS CHANGES
                </button>
              </form>
            </div>
          )}

          {/* TAB 5: COUPON MANAGER */}
          {activeTab === 'coupons' && (
            <div className="space-y-6">
              <h2 className="font-syne font-black text-2xl text-white uppercase">COUPON ENGINE MANAGER</h2>

              <form onSubmit={handleCreateCoupon} className="bg-brand-surface border border-brand-border p-6 rounded-2xl grid grid-cols-1 sm:grid-cols-3 gap-4 text-xs font-bold">
                <div>
                  <label className="block text-brand-muted mb-1">COUPON CODE</label>
                  <input
                    type="text"
                    value={newCouponCode}
                    onChange={(e) => setNewCouponCode(e.target.value)}
                    placeholder="e.g. CLEAN20"
                    className="w-full bg-brand-black border border-brand-border rounded-xl p-2.5 text-white uppercase"
                    required
                  />
                </div>

                <div>
                  <label className="block text-brand-muted mb-1">DISCOUNT %</label>
                  <input
                    type="number"
                    value={newCouponValue}
                    onChange={(e) => setNewCouponValue(Number(e.target.value))}
                    className="w-full bg-brand-black border border-brand-border rounded-xl p-2.5 text-white"
                    required
                  />
                </div>

                <div>
                  <label className="block text-brand-muted mb-1">MIN PURCHASE (₹)</label>
                  <input
                    type="number"
                    value={newCouponMin}
                    onChange={(e) => setNewCouponMin(Number(e.target.value))}
                    className="w-full bg-brand-black border border-brand-border rounded-xl p-2.5 text-white"
                    required
                  />
                </div>

                <div className="sm:col-span-3">
                  <button type="submit" className="bg-neon-green text-brand-black font-black text-xs py-3 px-6 rounded-xl uppercase">
                    CREATE COUPON
                  </button>
                </div>
              </form>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                {coupons.map((c) => (
                  <div key={c.id} className="bg-brand-surface border border-brand-border p-4 rounded-xl space-y-2 relative">
                    <span className="font-mono font-bold text-neon-green text-lg">{c.code}</span>
                    <div className="text-xs text-brand-muted">{c.value}% Off • Min Order ₹{c.minPurchase}</div>
                    <button onClick={() => deleteCoupon(c.id)} className="absolute top-4 right-4 text-brand-muted hover:text-red-400">
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* TAB 6: CUSTOMER DIRECTORY */}
          {activeTab === 'users' && (
            <div className="space-y-6">
              <h2 className="font-syne font-black text-2xl text-white uppercase">CUSTOMER DIRECTORY</h2>

              <div className="bg-brand-surface border border-brand-border rounded-2xl p-6 overflow-x-auto">
                <table className="w-full text-left text-xs font-medium">
                  <thead>
                    <tr className="border-b border-brand-border text-brand-muted uppercase font-bold">
                      <th className="py-3 px-3">User</th>
                      <th className="py-3 px-3">Role</th>
                      <th className="py-3 px-3">Status</th>
                      <th className="py-3 px-3 text-right">Actions</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-brand-border/60">
                    {allUsers.map((u) => (
                      <tr key={u.uid} className="hover:bg-brand-black/50">
                        <td className="py-3 px-3 font-bold text-white flex items-center gap-3">
                          <img src={u.photoURL || 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?q=80&w=150&auto=format&fit=crop'} className="w-8 h-8 rounded-full object-cover" alt="" />
                          <div>
                            <div>{u.name}</div>
                            <span className="text-[10px] text-brand-muted">{u.email}</span>
                          </div>
                        </td>
                        <td className="py-3 px-3 font-mono text-neon-green uppercase">{u.role}</td>
                        <td className="py-3 px-3">
                          <span className={`px-2 py-0.5 rounded text-[10px] font-bold uppercase ${u.isBlocked ? 'bg-red-500/20 text-red-400' : 'bg-neon-green/20 text-neon-green'}`}>
                            {u.isBlocked ? 'Blocked' : 'Active'}
                          </span>
                        </td>
                        <td className="py-3 px-3 text-right">
                          <button onClick={() => toggleBlockUser(u.uid)} className="px-3 py-1 bg-brand-black border border-brand-border text-xs font-bold rounded">
                            {u.isBlocked ? 'Unblock' : 'Block'}
                          </button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          )}

        </main>
      </div>

      {/* Edit / Add Product Modal */}
      {isProductModalOpen && (
        <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-md flex items-center justify-center p-4">
          <div className="bg-brand-surface border border-brand-border max-w-lg w-full rounded-2xl p-6 space-y-4 max-h-[90vh] overflow-y-auto">
            <h3 className="font-syne font-bold text-xl text-white uppercase">
              {editingProductId ? 'EDIT PRODUCT & PRICE' : 'ADD NEW PRODUCT'}
            </h3>

            <form onSubmit={handleSaveProduct} className="space-y-4 text-xs font-bold">
              <div>
                <label className="block text-brand-muted mb-1">PRODUCT NAME</label>
                <input
                  type="text"
                  value={prodName}
                  onChange={(e) => setProdName(e.target.value)}
                  className="w-full bg-brand-black border border-brand-border rounded-xl p-3 text-white"
                  required
                />
              </div>

              <div>
                <label className="block text-brand-muted mb-1">TAGLINE / SHORT DESC</label>
                <input
                  type="text"
                  value={prodTagline}
                  onChange={(e) => setProdTagline(e.target.value)}
                  className="w-full bg-brand-black border border-brand-border rounded-xl p-3 text-white"
                  required
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-neon-green mb-1">LIVE SELLING PRICE (₹)</label>
                  <input
                    type="number"
                    value={prodPrice}
                    onChange={(e) => setProdPrice(Number(e.target.value))}
                    className="w-full bg-brand-black border border-neon-green rounded-xl p-3 text-neon-green font-mono font-bold"
                    required
                  />
                </div>

                <div>
                  <label className="block text-brand-muted mb-1">ORIGINAL MRP (₹)</label>
                  <input
                    type="number"
                    value={prodOrigPrice}
                    onChange={(e) => setProdOrigPrice(Number(e.target.value))}
                    className="w-full bg-brand-black border border-brand-border rounded-xl p-3 text-white font-mono"
                    required
                  />
                </div>
              </div>

              <div>
                <label className="block text-brand-muted mb-1">CATEGORY</label>
                <select
                  value={prodCategory}
                  onChange={(e) => setProdCategory(e.target.value as any)}
                  className="w-full bg-brand-black border border-brand-border rounded-xl p-3 text-white"
                >
                  <option value="purifier">Air Purifier</option>
                  <option value="filter">HEPA Filter</option>
                  <option value="power_module">Power & Motor Core</option>
                  <option value="aqi_sensor">AQI Sensor</option>
                  <option value="accessory">Accessory</option>
                </select>
              </div>

              <div>
                <label className="block text-brand-muted mb-1">STOCK INVENTORY</label>
                <input
                  type="number"
                  value={prodStock}
                  onChange={(e) => setProdStock(Number(e.target.value))}
                  className="w-full bg-brand-black border border-brand-border rounded-xl p-3 text-white"
                  required
                />
              </div>

              <div>
                <label className="block text-brand-muted mb-1">IMAGE URL</label>
                <input
                  type="text"
                  value={prodCoverImage}
                  onChange={(e) => setProdCoverImage(e.target.value)}
                  className="w-full bg-brand-black border border-brand-border rounded-xl p-3 text-white"
                  placeholder="https://images.unsplash.com/..."
                />
              </div>

              <div className="flex justify-end gap-3 pt-2">
                <button
                  type="button"
                  onClick={() => setIsProductModalOpen(false)}
                  className="px-4 py-2 bg-brand-black text-brand-muted rounded-xl"
                >
                  CANCEL
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 bg-neon-green text-brand-black font-black uppercase rounded-xl"
                >
                  SAVE & PUBLISH LIVE
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

    </div>
  );
};
