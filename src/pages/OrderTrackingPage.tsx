import React from 'react';
import { useParams, Link } from 'react-router-dom';
import { useOrderStore } from '../store/useOrderStore';
import type { OrderStatus } from '../types';
import { Printer, Truck, ArrowLeft } from 'lucide-react';

export const OrderTrackingPage: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const { getOrderById } = useOrderStore();

  const order = getOrderById(id || 'PAV-89421');

  if (!order) {
    return (
      <div className="bg-[#09090B] text-white min-h-[70vh] flex flex-col items-center justify-center p-6 text-center font-inter space-y-4">
        <h2 className="font-syne font-black text-2xl text-white">ORDER NOT FOUND</h2>
        <p className="text-xs text-gray-400">Order ID #{id} was not found in our database.</p>
        <Link to="/products" className="bg-[#D7FF2F] text-[#09090B] font-black text-xs px-5 py-3 rounded-xl uppercase">
          CONTINUE SHOPPING
        </Link>
      </div>
    );
  }

  const allStatuses: OrderStatus[] = ['Pending', 'Confirmed', 'Packed', 'Shipped', 'Out For Delivery', 'Delivered'];
  const currentStatusIndex = allStatuses.indexOf(order.status);

  const handlePrintInvoice = () => {
    window.print();
  };

  return (
    <div className="bg-[#09090B] text-white min-h-screen py-12 font-inter print:bg-white print:text-black">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        
        <div className="mb-6 print:hidden">
          <Link to="/" className="inline-flex items-center gap-2 text-xs font-bold text-gray-400 hover:text-[#D7FF2F]">
            <ArrowLeft className="w-4 h-4" /> BACK TO HOME
          </Link>
        </div>

        <div className="bg-[#111111] border border-[#27272A] rounded-3xl p-6 sm:p-8 space-y-6 print:bg-white print:border-black print:text-black">
          
          <div className="flex flex-wrap items-center justify-between gap-4 border-b border-[#27272A] pb-6 print:border-black">
            <div>
              <span className="text-xs font-mono font-bold text-[#D7FF2F] uppercase print:text-black">
                ORDER #{order.id}
              </span>
              <h1 className="text-2xl sm:text-3xl font-black font-syne text-white uppercase print:text-black">
                ORDER TRACKING & INVOICE
              </h1>
              <p className="text-xs text-gray-400 print:text-gray-600">
                Placed on {new Date(order.createdAt).toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' })}
              </p>
            </div>

            <button
              onClick={handlePrintInvoice}
              className="bg-[#09090B] border border-[#27272A] hover:border-[#D7FF2F] text-[#D7FF2F] font-bold text-xs px-4 py-2.5 rounded-xl uppercase tracking-wider flex items-center gap-2 transition-all print:hidden"
            >
              <Printer className="w-4 h-4" /> PRINT INVOICE
            </button>
          </div>

          {/* Corrected Delivery Status Bar with 100% Circular Badges & Typo Fixed */}
          <div className="py-4 print:hidden space-y-6">
            <h4 className="text-xs font-black tracking-wider text-[#D7FF2F] uppercase">
              LIVE DELIVERY STATUS: {order.status.toUpperCase()}
            </h4>

            <div className="relative">
              {/* Connecting Progress Line */}
              <div className="absolute top-4 left-6 right-6 h-0.5 bg-[#27272A] -z-0" />
              <div 
                className="absolute top-4 left-6 h-0.5 bg-[#D7FF2F] transition-all duration-500 -z-0"
                style={{ width: `${(currentStatusIndex / (allStatuses.length - 1)) * 90}%` }}
              />

              <div className="grid grid-cols-6 gap-2 text-center relative z-10">
                {allStatuses.map((st, idx) => {
                  const isPassed = idx <= currentStatusIndex;
                  const isCurrent = idx === currentStatusIndex;
                  return (
                    <div key={st} className="space-y-2 flex flex-col items-center">
                      <div 
                        className={`w-8 h-8 rounded-full border flex items-center justify-center font-mono font-bold text-xs transition-all ${
                          isPassed 
                            ? 'bg-[#D7FF2F] text-[#09090B] border-[#D7FF2F] shadow-[0_0_10px_#D7FF2F]' 
                            : 'bg-[#09090B] border-gray-600 text-gray-400'
                        }`}
                      >
                        {idx + 1}
                      </div>
                      <span className={`text-[10px] font-bold block leading-tight ${isCurrent ? 'text-[#D7FF2F]' : isPassed ? 'text-white' : 'text-gray-500'}`}>
                        {st}
                      </span>
                    </div>
                  );
                })}
              </div>
            </div>
          </div>

          {order.trackingNumber && (
            <div className="bg-[#09090B] border border-[#27272A] p-4 rounded-2xl flex items-center justify-between text-xs font-bold print:border-black">
              <div className="flex items-center gap-3">
                <Truck className="w-5 h-5 text-[#D7FF2F]" />
                <div>
                  <span className="text-gray-400 block font-medium">COURIER & TRACKING NO.</span>
                  <span className="text-white print:text-black font-mono">{order.courierName} — {order.trackingNumber}</span>
                </div>
              </div>
              <span className="bg-[#D7FF2F]/10 text-[#D7FF2F] border border-[#D7FF2F]/30 px-3 py-1 rounded-full text-[10px] uppercase font-mono">
                IN TRANSIT
              </span>
            </div>
          )}

          <div className="space-y-3 pt-4">
            <h4 className="text-xs font-black tracking-wider text-[#D7FF2F] uppercase print:text-black">
              ORDERED ITEMS
            </h4>

            <div className="space-y-3">
              {order.items.map((item) => (
                <div key={item.product.id} className="flex items-center justify-between bg-[#09090B]/60 p-4 rounded-2xl border border-[#27272A]/60 print:bg-white print:border-black">
                  <div className="flex items-center gap-3">
                    <img src={item.product.coverImage} className="w-12 h-12 rounded-lg object-cover" alt="" />
                    <div>
                      <h5 className="font-syne font-bold text-xs uppercase text-white print:text-black">{item.product.name}</h5>
                      <span className="text-xs text-gray-400">Qty: {item.quantity}</span>
                    </div>
                  </div>
                  <div className="font-mono font-bold text-sm text-[#D7FF2F] print:text-black">
                    ₹{(item.product.price * item.quantity).toLocaleString('en-IN')}
                  </div>
                </div>
              ))}
            </div>
          </div>

          <div className="border-t border-[#27272A] pt-4 text-xs font-medium text-gray-400 space-y-1.5 print:border-black print:text-black">
            <div className="flex justify-between">
              <span>Subtotal</span>
              <span className="font-mono text-white print:text-black">₹{order.subtotal.toLocaleString('en-IN')}</span>
            </div>
            {order.discount > 0 && (
              <div className="flex justify-between text-[#D7FF2F]">
                <span>Discount ({order.couponCode})</span>
                <span className="font-mono">-₹{order.discount.toLocaleString('en-IN')}</span>
              </div>
            )}
            <div className="flex justify-between">
              <span>GST (18%)</span>
              <span className="font-mono text-white print:text-black">₹{order.tax.toLocaleString('en-IN')}</span>
            </div>
            <div className="flex justify-between">
              <span>Express Shipping</span>
              <span className="font-mono text-white print:text-black">
                {order.shippingFee === 0 ? 'FREE' : `₹${order.shippingFee}`}
              </span>
            </div>

            <div className="flex justify-between text-base font-bold text-white pt-2 border-t border-[#27272A] print:border-black print:text-black">
              <span>TOTAL PAID ({order.paymentMethod})</span>
              <span className="font-mono text-[#D7FF2F] font-black text-lg print:text-black">
                ₹{order.total.toLocaleString('en-IN')}
              </span>
            </div>
          </div>

          <div className="bg-[#09090B] p-4 rounded-2xl border border-[#27272A] text-xs space-y-1 print:bg-white print:border-black print:text-black">
            <span className="text-[10px] font-bold text-[#D7FF2F] uppercase tracking-wider block">DELIVERY ADDRESS</span>
            <div className="font-bold text-white print:text-black">{order.shippingAddress.name}</div>
            <div className="text-gray-400">{order.shippingAddress.street}, {order.shippingAddress.city}, {order.shippingAddress.state} - {order.shippingAddress.pincode}</div>
            <div className="text-gray-400">Phone: {order.shippingAddress.phone}</div>
          </div>

        </div>
      </div>
    </div>
  );
};
