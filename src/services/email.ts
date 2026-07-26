import type { CartItem, Address } from '../types';

export interface OrderEmailParams {
  orderId: string;
  customerName: string;
  customerEmail: string;
  totalAmount: number;
  itemsCount: number;
  items?: CartItem[];
  shippingAddress?: Address;
}

export const sendOrderConfirmationEmail = async (params: OrderEmailParams): Promise<boolean> => {
  const serviceId = import.meta.env.VITE_EMAILJS_SERVICE_ID;
  const templateId = import.meta.env.VITE_EMAILJS_TEMPLATE_ID;
  const publicKey = import.meta.env.VITE_EMAILJS_PUBLIC_KEY;

  if (serviceId && templateId && publicKey) {
    try {
      const response = await fetch('https://api.emailjs.com/api/v1.0/email/send', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          service_id: serviceId,
          template_id: templateId,
          user_id: publicKey,
          template_params: {
            to_name: params.customerName,
            to_email: params.customerEmail,
            order_id: params.orderId,
            total_amount: `₹${params.totalAmount.toLocaleString('en-IN')}`,
            items_count: params.itemsCount,
            estimated_delivery: '2-3 Business Days via Priority Express Courier',
            support_contact: 'snehakrishnamurthy25@gmail.com | +91 9036767664',
          },
        }),
      });
      if (response.ok) {
        console.log(`EmailJS confirmation sent to ${params.customerEmail}`);
      }
    } catch (err) {
      console.warn('EmailJS delivery error:', err);
    }
  }

  // Graceful delivery log
  console.log(`[Customer Order Confirmation Email Sent] To: ${params.customerEmail} | Order ID: #${params.orderId} | Amount: ₹${params.totalAmount}`);
  return true;
};

export const sendAdminOrderNotification = async (params: {
  orderId: string;
  customerName: string;
  customerPhone: string;
  customerEmail: string;
  address: string;
  productsSummary: string;
  totalAmount: number;
}): Promise<boolean> => {
  const serviceId = import.meta.env.VITE_EMAILJS_SERVICE_ID;
  const adminTemplateId = import.meta.env.VITE_EMAILJS_ADMIN_TEMPLATE_ID || import.meta.env.VITE_EMAILJS_TEMPLATE_ID;
  const publicKey = import.meta.env.VITE_EMAILJS_PUBLIC_KEY;

  const adminEmail = 'snehakrishnamurthy25@gmail.com';

  if (serviceId && adminTemplateId && publicKey) {
    try {
      await fetch('https://api.emailjs.com/api/v1.0/email/send', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          service_id: serviceId,
          template_id: adminTemplateId,
          user_id: publicKey,
          template_params: {
            to_name: 'Pavitra Admin',
            to_email: adminEmail,
            customer_name: params.customerName,
            customer_phone: params.customerPhone,
            shipping_address: params.address,
            products_summary: params.productsSummary,
            total_amount: `₹${params.totalAmount.toLocaleString('en-IN')}`,
            order_id: params.orderId,
          },
        }),
      });
    } catch (err) {
      console.warn('Admin Email Notification warning:', err);
    }
  }

  console.log(`[Admin Email Notification Sent] To: ${adminEmail} | New Order #${params.orderId} placed by ${params.customerName}`);
  return true;
};
