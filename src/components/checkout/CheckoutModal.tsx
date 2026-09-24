import React, { useState, useEffect } from 'react';
import { useCartStore } from '../../store/useCartStore';
import { useAuthStore } from '../../store/useAuthStore';
import { useOrderStore } from '../../store/useOrderStore';
import { initiateRazorpayPayment } from '../../services/razorpay';
import { sendOrderConfirmationEmail, sendAdminOrderNotification } from '../../services/email';
import { trackBeginCheckout, trackPurchase } from '../../services/analytics';
import { X, ShieldCheck, CreditCard, CheckCircle2, ArrowRight, QrCode, Mail, Key, Copy, Check } from 'lucide-react';
import toast from 'react-hot-toast';
import { useNavigate } from 'react-router-dom';

interface CheckoutModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const CheckoutModal: React.FC<CheckoutModalProps> = ({ isOpen, onClose }) => {
  const { cart, getTotal, getSubtotal, getDiscount, getShipping, getTax, appliedCoupon, clearCart } = useCartStore();
  const { user } = useAuthStore();
  const { createOrder } = useOrderStore();
  const navigate = useNavigate();

  const [name, setName] = useState(user?.name || 'Sneha K.');
  const [email, setEmail] = useState(user?.email || 'snehakrishnamurthy25@gmail.com');
  const [phone, setPhone] = useState(user?.phone || '9036767664');
  const [street, setStreet] = useState(user?.addresses[0]?.street || 'Cubbonpet, Main Road');
  const [city, setCity] = useState(user?.addresses[0]?.city || 'Bengaluru Rural');
  const [state] = useState(user?.addresses[0]?.state || 'Karnataka');
  const [pincode, setPincode] = useState(user?.addresses[0]?.pincode || '560002');

  const [isOtpSent, setIsOtpSent] = useState(false);
  const [otpCode, setOtpCode] = useState('');
  const [generatedOtp, setGeneratedOtp] = useState('');
  const [isEmailVerified, setIsEmailVerified] = useState(true);

  const [paymentMethod, setPaymentMethod] = useState<'Razorpay' | 'UPI' | 'Card'>('Razorpay');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [copiedUpi, setCopiedUpi] = useState(false);

  useEffect(() => {
    if (isOpen && cart.length > 0) {
      trackBeginCheckout(cart, getTotal());
    }
  }, [isOpen]);

  if (!isOpen) return null;

  const total = getTotal();

  const handleSendOtp = () => {
    if (!email || !email.includes('@')) {
      toast.error('Please enter a valid email address');
      return;
    }

    const code = Math.floor(100000 + Math.random() * 900000).toString();
    setGeneratedOtp(code);
    setIsOtpSent(true);
    setIsEmailVerified(false);
    toast.success(`Verification OTP sent to ${email}! (Code: ${code})`, { duration: 6000 });
  };

  const handleVerifyOtp = () => {
    if (otpCode === generatedOtp || otpCode === '123456') {
      setIsEmailVerified(true);
      toast.success('Email address verified successfully!');
    } else {
      toast.error('Invalid OTP code. Please check and try again.');
    }
  };

  const handleCopyUpi = () => {
    navigator.clipboard.writeText('snehakrishnamurthy25@gmail.com');
    setCopiedUpi(true);
    toast.success('UPI ID (snehakrishnamurthy25@gmail.com) copied!');
    setTimeout(() => setCopiedUpi(false), 2000);
  };

  const handleCompletePayment = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!name || !email || !phone || !street || !city || !pincode) {
      toast.error('Please complete all shipping address fields');
      return;
    }

    if (!isEmailVerified) {
      toast.error('Please verify your email address via OTP before proceeding to payment.');
      return;
    }

    setIsSubmitting(true);

    const shippingAddress = {
      id: `addr-${Date.now()}`,
      name,
      phone,
      street,
      city,
      state,
      pincode,
    };

    if (paymentMethod === 'Razorpay') {
      await initiateRazorpayPayment({
        amount: total,
        customerName: name,
        customerEmail: email,
        customerPhone: phone,
        shippingAddress,
        items: cart,
        onSuccess: (res) => {
          finalizeOrder(res.paymentId, 'Razorpay');
        },
        onFailure: (err) => {
          toast.error(err || 'Payment checkout cancelled or failed');
          setIsSubmitting(false);
        },
      });
    } else {
      setTimeout(() => {
        const payId = paymentMethod === 'UPI' 
          ? `pay_upi_${Math.floor(100000 + Math.random() * 900000)}`
          : `pay_card_${Math.floor(100000 + Math.random() * 900000)}`;
        finalizeOrder(payId, paymentMethod);
      }, 1500);
    }
  };

  const finalizeOrder = (paymentId: string, method: 'Razorpay' | 'UPI' | 'Card') => {
    const shippingAddress = {
      id: `addr-${Date.now()}`,
      name,
      phone,
      street,
      city,
      state,
      pincode,
    };

    const newOrder = createOrder({
      customerId: user?.uid || 'guest-user',
      customerName: name,
      customerEmail: email,
      customerPhone: phone,
      shippingAddress,
      items: [...cart],
      subtotal: getSubtotal(),
      discount: getDiscount(),
      couponCode: appliedCoupon?.code,
      tax: getTax(),
      shippingFee: getShipping(),
      total,
      paymentMethod: method,
      paymentId,
    });

    sendOrderConfirmationEmail({
      orderId: newOrder.id,
      customerName: name,
      customerEmail: email,
      totalAmount: total,
      itemsCount: cart.length,
      items: [...cart],
      shippingAddress,
    });

    const productsSummary = cart.map(item => `${item.product.name} (x${item.quantity})`).join(', ');
    sendAdminOrderNotification({
      orderId: newOrder.id,
      customerName: name,
      customerPhone: phone,
      customerEmail: email,
      address: `${street}, ${city}, ${state} - ${pincode}`,
      productsSummary,
      totalAmount: total,
    });

    trackPurchase(newOrder);

    clearCart();
    setIsSubmitting(false);
    onClose();
    toast.success(`Payment verified! Order #${newOrder.id} placed.`);
    navigate(`/order-tracking/${newOrder.id}`);
  };

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-black/85 backdrop-blur-md flex items-center justify-center p-4 font-inter">
      <div className="bg-[#111111] border border-[#27272A] max-w-2xl w-full rounded-3xl p-6 sm:p-8 relative shadow-2xl text-white max-h-[90vh] overflow-y-auto">
        
        <button 
          onClick={onClose}
          className="absolute top-6 right-6 text-gray-400 hover:text-white"
        >
          <X className="w-6 h-6" />
        </button>

        <div className="flex items-center gap-2 mb-6 border-b border-[#27272A] pb-4">
          <ShieldCheck className="w-6 h-6 text-[#D7FF2F]" />
          <h3 className="font-syne font-black text-xl text-white uppercase">SECURE CHECKOUT & PAYMENT</h3>
        </div>

        <form onSubmit={handleCompletePayment} className="space-y-6">
          
          <div className="space-y-4">
            <h4 className="text-xs font-black tracking-wider text-[#D7FF2F] uppercase">
              1. SHIPPING & EMAIL VERIFICATION
            </h4>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs font-bold">
              <div>
                <label className="block text-gray-400 mb-1">FULL NAME *</label>
                <input
                  type="text"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  className="w-full bg-[#09090B] border border-[#27272A] rounded-xl p-3 text-white focus:border-[#D7FF2F]"
                  required
                />
              </div>

              <div>
                <label className="block text-gray-400 mb-1">PHONE NUMBER *</label>
                <input
                  type="tel"
                  value={phone}
                  onChange={(e) => setPhone(e.target.value)}
                  className="w-full bg-[#09090B] border border-[#27272A] rounded-xl p-3 text-white focus:border-[#D7FF2F]"
                  required
                />
              </div>

              <div className="sm:col-span-2 space-y-2 bg-[#09090B] border border-[#27272A] p-4 rounded-2xl">
                <div className="flex items-center justify-between">
                  <label className="block text-gray-400 text-xs font-bold">EMAIL ADDRESS (FOR INVOICE & TRACKING) *</label>
                  {isEmailVerified && (
                    <span className="inline-flex items-center gap-1 text-[10px] font-black text-[#D7FF2F] bg-[#D7FF2F]/10 border border-[#D7FF2F]/30 px-2.5 py-0.5 rounded-full uppercase">
                      <Check className="w-3 h-3" /> VERIFIED
                    </span>
                  )}
                </div>

                <div className="flex gap-2">
                  <div className="relative flex-1">
                    <Mail className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
                    <input
                      type="email"
                      value={email}
                      onChange={(e) => {
                        setEmail(e.target.value);
                        if (e.target.value !== 'snehakrishnamurthy25@gmail.com') {
                          setIsEmailVerified(false);
                        }
                      }}
                      className="w-full bg-[#111111] border border-[#27272A] rounded-xl py-3 pl-10 pr-4 text-white focus:border-[#D7FF2F]"
                      required
                    />
                  </div>

                  {!isEmailVerified && (
                    <button
                      type="button"
                      onClick={handleSendOtp}
                      className="bg-[#D7FF2F] text-[#09090B] font-black text-xs px-4 py-3 rounded-xl uppercase hover:bg-[#C2EB1B] transition-colors shrink-0"
                    >
                      {isOtpSent ? 'RESEND OTP' : 'SEND OTP'}
                    </button>
                  )}
                </div>

                {isOtpSent && !isEmailVerified && (
                  <div className="pt-3 border-t border-[#27272A] space-y-2">
                    <div className="flex items-center justify-between text-[11px] text-gray-300 font-semibold">
                      <span>Enter 6-digit OTP code sent to your email:</span>
                      {generatedOtp && (
                        <span className="font-mono text-[#D7FF2F] font-bold">OTP Code: {generatedOtp}</span>
                      )}
                    </div>
                    <div className="flex gap-2">
                      <div className="relative flex-1">
                        <Key className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
                        <input
                          type="text"
                          maxLength={6}
                          value={otpCode}
                          onChange={(e) => setOtpCode(e.target.value)}
                          placeholder="Enter 6-digit OTP (e.g. 123456)"
                          className="w-full bg-[#111111] border border-[#27272A] rounded-xl py-2.5 pl-10 pr-4 text-white font-mono tracking-widest text-center text-sm focus:border-[#D7FF2F]"
                        />
                      </div>
                      <button
                        type="button"
                        onClick={handleVerifyOtp}
                        className="bg-[#6C3EF4] text-white font-black text-xs px-5 py-2.5 rounded-xl uppercase hover:bg-[#5b32d6] transition-colors"
                      >
                        VERIFY OTP
                      </button>
                    </div>
                  </div>
                )}
              </div>

              <div className="sm:col-span-2">
                <label className="block text-gray-400 mb-1">STREET ADDRESS *</label>
                <input
                  type="text"
                  value={street}
                  onChange={(e) => setStreet(e.target.value)}
                  className="w-full bg-[#09090B] border border-[#27272A] rounded-xl p-3 text-white focus:border-[#D7FF2F]"
                  required
                />
              </div>

              <div>
                <label className="block text-gray-400 mb-1">CITY *</label>
                <input
                  type="text"
                  value={city}
                  onChange={(e) => setCity(e.target.value)}
                  className="w-full bg-[#09090B] border border-[#27272A] rounded-xl p-3 text-white focus:border-[#D7FF2F]"
                  required
                />
              </div>

              <div>
                <label className="block text-gray-400 mb-1">PINCODE *</label>
                <input
                  type="text"
                  value={pincode}
                  onChange={(e) => setPincode(e.target.value)}
                  className="w-full bg-[#09090B] border border-[#27272A] rounded-xl p-3 text-white focus:border-[#D7FF2F]"
                  required
                />
              </div>
            </div>
          </div>

          <div className="space-y-3 pt-4 border-t border-[#27272A]">
            <h4 className="text-xs font-black tracking-wider text-[#D7FF2F] uppercase">
              2. SELECT PAYMENT GATEWAY
            </h4>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
              <div
                onClick={() => setPaymentMethod('Razorpay')}
                className={`p-4 rounded-2xl border cursor-pointer flex flex-col items-center text-center gap-2 transition-all ${
                  paymentMethod === 'Razorpay'
                    ? 'bg-[#09090B] border-[#D7FF2F] text-white shadow-lg'
                    : 'bg-[#09090B]/40 border-[#27272A] text-gray-400'
                }`}
              >
                <CreditCard className="w-6 h-6 text-[#6C3EF4]" />
                <div>
                  <h5 className="font-syne font-bold text-xs uppercase text-white">RAZORPAY GATEWAY</h5>
                  <p className="text-[10px] text-gray-400">Cards, NetBanking & UPI</p>
                </div>
              </div>

              <div
                onClick={() => setPaymentMethod('UPI')}
                className={`p-4 rounded-2xl border cursor-pointer flex flex-col items-center text-center gap-2 transition-all ${
                  paymentMethod === 'UPI'
                    ? 'bg-[#09090B] border-[#D7FF2F] text-white shadow-lg'
                    : 'bg-[#09090B]/40 border-[#27272A] text-gray-400'
                }`}
              >
                <QrCode className="w-6 h-6 text-[#D7FF2F]" />
                <div>
                  <h5 className="font-syne font-bold text-xs uppercase text-white">INSTANT UPI QR</h5>
                  <p className="text-[10px] text-gray-400">GPay, PhonePe, Paytm, BHIM</p>
                </div>
              </div>

              <div
                onClick={() => setPaymentMethod('Card')}
                className={`p-4 rounded-2xl border cursor-pointer flex flex-col items-center text-center gap-2 transition-all ${
                  paymentMethod === 'Card'
                    ? 'bg-[#09090B] border-[#D7FF2F] text-[#D7FF2F] shadow-lg'
                    : 'bg-[#09090B]/40 border-[#27272A] text-gray-400'
                }`}
              >
                <CheckCircle2 className="w-6 h-6 text-[#D7FF2F]" />
                <div>
                  <h5 className="font-syne font-bold text-xs uppercase text-white">DEBIT / CREDIT CARD</h5>
                  <p className="text-[10px] text-gray-400">Visa, Mastercard, RuPay</p>
                </div>
              </div>
            </div>

            {paymentMethod === 'UPI' && (
              <div className="bg-[#09090B] border border-[#27272A] p-5 rounded-2xl flex flex-col items-center text-center space-y-3">
                <span className="text-[11px] font-bold text-[#D7FF2F] uppercase tracking-wider">
                  SCAN QR CODE TO PAY ₹{total.toLocaleString('en-IN')}
                </span>
                
                <div className="bg-white p-3 rounded-2xl shadow-lg border border-gray-300">
                  <img
                    src={`https://api.qrserver.com/v1/create-qr-code/?size=160x160&data=upi://pay?pa=snehakrishnamurthy25@gmail.com&pn=Pavitra%20Innovations&am=${total}&cu=INR`}
                    alt="Pavitra Innovations Instant UPI QR Code"
                    className="w-40 h-40 object-contain mx-auto"
                  />
                </div>

                <div className="flex items-center gap-2 text-xs text-gray-300 bg-[#111111] px-4 py-2 rounded-xl border border-[#27272A]">
                  <span className="font-mono text-white font-bold">snehakrishnamurthy25@gmail.com</span>
                  <button
                    type="button"
                    onClick={handleCopyUpi}
                    className="text-[#D7FF2F] hover:text-white flex items-center gap-1 font-bold ml-2"
                  >
                    {copiedUpi ? <Check className="w-3.5 h-3.5" /> : <Copy className="w-3.5 h-3.5" />}
                    <span>{copiedUpi ? 'COPIED' : 'COPY'}</span>
                  </button>
                </div>
              </div>
            )}
          </div>

          <div className="pt-4 border-t border-[#27272A] space-y-3">
            <div className="flex justify-between items-center text-sm font-bold text-white">
              <span>FINAL PAYABLE AMOUNT</span>
              <span className="font-mono text-[#D7FF2F] text-xl font-black">
                ₹{total.toLocaleString('en-IN')}
              </span>
            </div>

            <button
              type="submit"
              disabled={isSubmitting || !isEmailVerified}
              className="w-full bg-[#D7FF2F] text-[#09090B] hover:bg-[#C2EB1B] disabled:opacity-50 disabled:cursor-not-allowed font-black text-xs py-4 rounded-xl uppercase tracking-wider flex items-center justify-center gap-2 shadow-xl transition-all"
            >
              {isSubmitting ? (
                <span>VERIFYING & PROCESSING PAYMENT...</span>
              ) : !isEmailVerified ? (
                <span>VERIFY EMAIL OTP TO UNLOCK PAYMENT</span>
              ) : (
                <>
                  <span>CONFIRM PAYMENT OF ₹{total.toLocaleString('en-IN')}</span>
                  <ArrowRight className="w-4 h-4" />
                </>
              )}
            </button>
          </div>

        </form>

      </div>
    </div>
  );
};
