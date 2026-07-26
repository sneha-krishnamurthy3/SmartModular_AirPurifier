import type { CartItem, Address } from '../types';

export interface PaymentOptions {
  amount: number; // in INR rupees
  customerName: string;
  customerEmail: string;
  customerPhone: string;
  shippingAddress: Address;
  items: CartItem[];
  onSuccess: (response: { paymentId: string; method: string; orderId?: string }) => void;
  onFailure: (error: string) => void;
}

export const loadRazorpaySDK = (): Promise<boolean> => {
  return new Promise((resolve) => {
    if ((window as any).Razorpay) {
      resolve(true);
      return;
    }
    const script = document.createElement('script');
    script.src = 'https://checkout.razorpay.com/v1/checkout.js';
    script.async = true;
    script.onload = () => resolve(true);
    script.onerror = () => resolve(false);
    document.body.appendChild(script);
  });
};

export const initiateRazorpayPayment = async (options: PaymentOptions): Promise<string> => {
  const rzpKeyId = import.meta.env.VITE_RAZORPAY_KEY_ID;

  // 1. Validation check for Razorpay API key
  if (!rzpKeyId || rzpKeyId.trim() === '' || rzpKeyId.includes('pavitra12345')) {
    const errorMsg = 'Razorpay Key ID (VITE_RAZORPAY_KEY_ID) is missing or unconfigured in .env file. Real payments require setting VITE_RAZORPAY_KEY_ID.';
    console.error('Razorpay Error:', errorMsg);
    options.onFailure(errorMsg);
    return 'KEY_MISSING_ERROR';
  }

  // 2. Load Razorpay official SDK script
  const isLoaded = await loadRazorpaySDK();
  if (!isLoaded || !(window as any).Razorpay) {
    const errorMsg = 'Failed to load Razorpay Checkout SDK. Please check your internet connection.';
    console.error('Razorpay Error:', errorMsg);
    options.onFailure(errorMsg);
    return 'SDK_LOAD_ERROR';
  }

  try {
    // 3. Request serverless Razorpay order creation
    let rzpOrderId: string | undefined;
    try {
      const orderRes = await fetch('/api/create-razorpay-order', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          amount: options.amount,
          currency: 'INR',
          receipt: `rcpt_${Date.now()}`,
        }),
      });
      if (orderRes.ok) {
        const orderData = await orderRes.json();
        if (orderData && orderData.id && !orderData.isSimulated) {
          rzpOrderId = orderData.id;
        }
      }
    } catch (err) {
      console.warn('Razorpay server order creation notice:', err);
    }

    const logoUrl = typeof window !== 'undefined' ? `${window.location.origin}/pavitra_purifier.png` : '/pavitra_purifier.png';

    // 4. Official Razorpay Checkout Configuration
    const razorpayOptions: any = {
      key: rzpKeyId,
      amount: Math.round(options.amount * 100), // Amount in Paise
      currency: 'INR',
      name: 'Pavitra Innovations',
      description: 'Order Payment for Modular Air Purifier & Components',
      image: logoUrl,
      handler: async function (response: any) {
        // 5. Payment Signature Verification
        if (response.razorpay_signature && rzpOrderId) {
          try {
            const verifyRes = await fetch('/api/verify-razorpay-payment', {
              method: 'POST',
              headers: { 'Content-Type': 'application/json' },
              body: JSON.stringify({
                razorpay_order_id: response.razorpay_order_id,
                razorpay_payment_id: response.razorpay_payment_id,
                razorpay_signature: response.razorpay_signature,
              }),
            });
            const verifyData = await verifyRes.json();
            if (!verifyRes.ok || !verifyData.verified) {
              const err = 'Razorpay payment signature verification failed on server.';
              console.error(err);
              options.onFailure(err);
              return;
            }
          } catch (err) {
            console.warn('Server signature verification notice:', err);
          }
        }

        options.onSuccess({
          paymentId: response.razorpay_payment_id || `pay_${Date.now()}`,
          method: 'Razorpay Standard Checkout',
          orderId: response.razorpay_order_id || rzpOrderId,
        });
      },
      prefill: {
        name: options.customerName,
        email: options.customerEmail,
        contact: options.customerPhone,
      },
      notes: {
        address: `${options.shippingAddress.street}, ${options.shippingAddress.city}, ${options.shippingAddress.state} - ${options.shippingAddress.pincode}`,
      },
      theme: {
        color: '#D7FF2F',
      },
      modal: {
        ondismiss: function () {
          console.warn('Razorpay Checkout closed by user.');
          options.onFailure('Payment checkout cancelled by user.');
        },
      },
    };

    if (rzpOrderId) {
      razorpayOptions.order_id = rzpOrderId;
    }

    const rzp = new (window as any).Razorpay(razorpayOptions);

    rzp.on('payment.failed', function (response: any) {
      const failReason = response.error?.description || response.error?.reason || 'Razorpay Payment Failed';
      console.error('Razorpay Payment Failed Error:', response.error);
      options.onFailure(failReason);
    });

    rzp.open();
    return 'RAZORPAY_OPENED';
  } catch (err: any) {
    const catchErr = err?.message || 'Failed to initialize Razorpay Checkout.';
    console.error('Razorpay Exception:', err);
    options.onFailure(catchErr);
    return 'RAZORPAY_INIT_ERROR';
  }
};
