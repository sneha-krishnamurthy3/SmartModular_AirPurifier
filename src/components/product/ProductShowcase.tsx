import React, { useState } from 'react';
import { useProductStore } from '../../store/useProductStore';
import { useCartStore } from '../../store/useCartStore';
import { initiateRazorpayPayment } from '../../services/razorpay';
import { useOrderStore } from '../../store/useOrderStore';
import { useAuthStore } from '../../store/useAuthStore';
import { sendOrderConfirmationEmail, sendAdminOrderNotification } from '../../services/email';
import { trackAddToCart, trackPurchase } from '../../services/analytics';
import { purifierImg } from '../../assets/productAssets';
import { Check, ShieldCheck, Truck, RotateCcw, Minus, Plus, ShoppingBag, ArrowRight } from 'lucide-react';
import toast from 'react-hot-toast';
import { useNavigate } from 'react-router-dom';

export const ProductShowcase: React.FC = () => {
  const { products } = useProductStore();
  const { addToCart } = useCartStore();
  const { createOrder } = useOrderStore();
  const { user } = useAuthStore();
  const navigate = useNavigate();

  const [quantity, setQuantity] = useState<number>(1);
  const [isProcessing, setIsProcessing] = useState(false);

  const mainProduct = products.find((p) => p.id === 'prod-001') || products[0];

  const handleAddToCart = () => {
    addToCart(mainProduct, quantity);
    trackAddToCart(mainProduct, quantity);
    toast.success(`Added ${quantity} x ${mainProduct.name} to cart!`);
  };

  const handleBuyNowDirect = async () => {
    setIsProcessing(true);
    const totalAmount = mainProduct.price * quantity;

    const dummyAddress = user?.addresses[0] || {
      id: 'addr-quick',
      name: user?.name || 'Customer',
      phone: '+91 9036767664',
      street: 'Cubbonpet, Main Road',
      city: 'Bengaluru Rural',
      state: 'Karnataka',
      pincode: '560002',
    };

    await initiateRazorpayPayment({
      amount: totalAmount,
      customerName: user?.name || 'Guest User',
      customerEmail: user?.email || 'snehakrishnamurthy25@gmail.com',
      customerPhone: dummyAddress.phone,
      shippingAddress: dummyAddress,
      items: [{ product: mainProduct, quantity }],
      onSuccess: (paymentRes) => {
        const order = createOrder({
          customerId: user?.uid || 'guest-001',
          customerName: user?.name || 'Sneha K.',
          customerEmail: user?.email || 'snehakrishnamurthy25@gmail.com',
          customerPhone: dummyAddress.phone,
          shippingAddress: dummyAddress,
          items: [{ product: mainProduct, quantity }],
          subtotal: totalAmount,
          discount: 0,
          tax: Math.round(totalAmount * 0.18),
          shippingFee: 0,
          total: totalAmount,
          paymentMethod: 'Razorpay',
          paymentId: paymentRes.paymentId,
        });
        sendOrderConfirmationEmail({
          orderId: order.id,
          customerName: user?.name || 'Sneha K.',
          customerEmail: user?.email || 'snehakrishnamurthy25@gmail.com',
          totalAmount: totalAmount,
          itemsCount: quantity,
          items: [{ product: mainProduct, quantity }],
          shippingAddress: dummyAddress,
        });

        const productsSummary = `${mainProduct.name} (x${quantity})`;
        sendAdminOrderNotification({
          orderId: order.id,
          customerName: user?.name || 'Sneha K.',
          customerPhone: dummyAddress.phone,
          customerEmail: user?.email || 'snehakrishnamurthy25@gmail.com',
          address: `${dummyAddress.street}, ${dummyAddress.city}, ${dummyAddress.state} - ${dummyAddress.pincode}`,
          productsSummary,
          totalAmount: totalAmount,
        });

        trackPurchase(order);

        toast.success(`Payment verified! Order #${order.id} created.`);
        setIsProcessing(false);
        navigate(`/order-tracking/${order.id}`);
      },
      onFailure: (err) => {
        toast.error(err || 'Payment checkout cancelled or failed');
        setIsProcessing(false);
      },
    });
  };

  return (
    <section id="starter-kit" className="bg-[#F8F7F3] text-[#09090B] py-16 border-t border-b border-gray-300 font-inter">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
          
          {/* Left Column: Product Info & Checklist */}
          <div className="lg:col-span-4 space-y-6">
            <span className="text-xs font-black tracking-widest text-[#6C3EF4] uppercase">OUR PRODUCT</span>
            
            <h2 className="text-4xl sm:text-5xl lg:text-6xl font-black font-syne tracking-tighter uppercase leading-[0.9] text-[#09090B]">
              {mainProduct.name}
            </h2>

            <p className="text-xs text-[#666666] leading-relaxed font-semibold">
              {mainProduct.tagline}
            </p>

            <ul className="space-y-3 text-xs font-black text-[#09090B]">
              <li className="flex items-center gap-2.5">
                <span className="w-4 h-4 rounded-full bg-[#D7FF2F] flex items-center justify-center text-[#09090B] shrink-0">
                  <Check className="w-3 h-3 stroke-[3]" />
                </span>
                <span>Covers up to 350 sq. ft.</span>
              </li>
              <li className="flex items-center gap-2.5">
                <span className="w-4 h-4 rounded-full bg-[#D7FF2F] flex items-center justify-center text-[#09090B] shrink-0">
                  <Check className="w-3 h-3 stroke-[3]" />
                </span>
                <span>3-Stage Filtration System</span>
              </li>
              <li className="flex items-center gap-2.5">
                <span className="w-4 h-4 rounded-full bg-[#D7FF2F] flex items-center justify-center text-[#09090B] shrink-0">
                  <Check className="w-3 h-3 stroke-[3]" />
                </span>
                <span>Real-time AQI Display</span>
              </li>
              <li className="flex items-center gap-2.5">
                <span className="w-4 h-4 rounded-full bg-[#D7FF2F] flex items-center justify-center text-[#09090B] shrink-0">
                  <Check className="w-3 h-3 stroke-[3]" />
                </span>
                <span>USB-C Power (5V/2A)</span>
              </li>
              <li className="flex items-center gap-2.5">
                <span className="w-4 h-4 rounded-full bg-[#D7FF2F] flex items-center justify-center text-[#09090B] shrink-0">
                  <Check className="w-3 h-3 stroke-[3]" />
                </span>
                <span>1 Year Warranty</span>
              </li>
            </ul>

            <div className="flex items-center gap-3 pt-2">
              <span className="font-syne font-black text-4xl sm:text-5xl text-[#09090B]">
                ₹{mainProduct.price.toLocaleString('en-IN')}
              </span>
              <span className="text-base line-through text-gray-500 font-bold">
                ₹{mainProduct.originalPrice.toLocaleString('en-IN')}
              </span>
              <span className="bg-[#D7FF2F] text-[#09090B] text-xs font-black px-3 py-1 uppercase rounded-none">
                SAVE ₹{(mainProduct.originalPrice - mainProduct.price).toLocaleString('en-IN')}
              </span>
            </div>

            <div className="grid grid-cols-3 gap-2 pt-6 border-t border-gray-300 text-[10px] font-black text-[#09090B]">
              <div className="flex flex-col items-start gap-1">
                <Truck className="w-5 h-5 text-[#09090B]" />
                <span>FREE SHIPPING</span>
                <span className="text-[9px] text-gray-600 font-normal">PAN INDIA</span>
              </div>
              <div className="flex flex-col items-start gap-1">
                <RotateCcw className="w-5 h-5 text-[#09090B]" />
                <span>7-DAY</span>
                <span className="text-[9px] text-gray-600 font-normal">EASY RETURNS</span>
              </div>
              <div className="flex flex-col items-start gap-1">
                <ShieldCheck className="w-5 h-5 text-[#09090B]" />
                <span>1 YEAR</span>
                <span className="text-[9px] text-gray-600 font-normal">WARRANTY</span>
              </div>
            </div>

          </div>

          {/* Center Column: Clean High-Res Product Studio Render */}
          <div className="lg:col-span-4 flex justify-center items-center py-4">
            <img
              src={purifierImg}
              alt="Pavitra Air Module One"
              className="w-full h-auto max-w-xs object-contain drop-shadow-xl mx-auto"
            />
          </div>

          {/* Right Column: Complete Starter Kit Purchase Card */}
          <div className="lg:col-span-4 bg-white border border-gray-300 p-6 sm:p-8 space-y-6 shadow-sm">
            
            <div className="border-b border-gray-300 pb-3">
              <h4 className="text-xs font-black tracking-wider text-[#09090B] uppercase">
                COMPLETE STARTER KIT INCLUDES
              </h4>
            </div>

            <div className="space-y-4">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 bg-gray-100 border border-gray-300 flex items-center justify-center text-xs font-bold shrink-0">
                  🛡️
                </div>
                <div>
                  <h5 className="text-xs font-black text-[#09090B] uppercase">HEPA FILTER</h5>
                  <p className="text-[10px] text-gray-600 font-medium">(Installed)</p>
                </div>
              </div>

              <div className="flex items-center gap-3">
                <div className="w-10 h-10 bg-gray-100 border border-gray-300 flex items-center justify-center text-xs font-bold shrink-0">
                  ⚡
                </div>
                <div>
                  <h5 className="text-xs font-black text-[#09090B] uppercase">POWER MODULE</h5>
                  <p className="text-[10px] text-gray-600 font-medium">USB-C (Installed)</p>
                </div>
              </div>

              <div className="flex items-center gap-3">
                <div className="w-10 h-10 bg-gray-100 border border-gray-300 flex items-center justify-center text-xs font-bold shrink-0">
                  📊
                </div>
                <div>
                  <h5 className="text-xs font-black text-[#09090B] uppercase">AQI METER</h5>
                  <p className="text-[10px] text-gray-600 font-medium">(Installed)</p>
                </div>
              </div>
            </div>

            <div className="flex items-center justify-between pt-2 border-t border-gray-200">
              <span className="text-xs font-black text-[#09090B] uppercase">QUANTITY</span>
              <div className="flex items-center gap-3 bg-gray-100 border border-gray-300 px-3 py-1">
                <button 
                  onClick={() => setQuantity(Math.max(1, quantity - 1))}
                  className="text-gray-700 hover:text-black font-bold text-sm"
                >
                  <Minus className="w-3.5 h-3.5" />
                </button>
                <span className="font-mono font-bold text-xs">{quantity}</span>
                <button 
                  onClick={() => setQuantity(quantity + 1)}
                  className="text-gray-700 hover:text-black font-bold text-sm"
                >
                  <Plus className="w-3.5 h-3.5" />
                </button>
              </div>
            </div>

            <div className="space-y-2 pt-2">
              <button
                onClick={handleBuyNowDirect}
                disabled={isProcessing}
                className="w-full bg-[#D7FF2F] text-[#09090B] hover:bg-[#C2EB1B] font-black text-xs py-4 px-4 uppercase tracking-wider flex items-center justify-center gap-2 transition-colors rounded-none shadow-sm"
              >
                {isProcessing ? 'PROCESSING...' : `BUY NOW FOR ₹${(mainProduct.price * quantity).toLocaleString('en-IN')}`}
                <ArrowRight className="w-4 h-4" />
              </button>

              <button
                onClick={handleAddToCart}
                className="w-full bg-white text-[#09090B] border border-gray-300 hover:bg-gray-100 font-bold text-xs py-3 px-4 uppercase tracking-wider flex items-center justify-center gap-2 transition-colors rounded-none"
              >
                <ShoppingBag className="w-4 h-4" /> ADD TO CART
              </button>
            </div>

            <div className="pt-2 text-center border-t border-gray-200">
              <p className="text-[10px] font-black text-gray-700 uppercase">
                Secured by <span className="text-blue-600 font-black">Razorpay</span>
              </p>
              <p className="text-[9px] text-gray-500 font-semibold">UPI | Cards | NetBanking | Wallets</p>
            </div>

          </div>

        </div>

      </div>
    </section>
  );
};
