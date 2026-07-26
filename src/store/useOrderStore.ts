import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import type { Order, OrderStatus, CartItem, Address } from '../types';
import { saveFirestoreOrder, updateFirestoreOrderStatus } from '../services/firestoreService';
import { sendAdminOrderNotification } from '../services/email';

interface OrderState {
  orders: Order[];
  
  // Actions
  createOrder: (params: {
    customerId: string;
    customerName: string;
    customerEmail: string;
    customerPhone: string;
    shippingAddress: Address;
    items: CartItem[];
    subtotal: number;
    discount: number;
    couponCode?: string;
    tax: number;
    shippingFee: number;
    total: number;
    paymentMethod: 'Razorpay' | 'UPI' | 'Card' | 'NetBanking' | 'Simulated';
    paymentId: string;
  }) => Order;

  updateOrderStatus: (id: string, newStatus: OrderStatus, note?: string) => void;
  updateTrackingInfo: (id: string, trackingNumber: string, courierName: string) => void;
  cancelOrder: (id: string) => void;
  getOrderById: (id: string) => Order | undefined;
  getUserOrders: (customerId: string) => Order[];
}

const initialMockOrders: Order[] = [
  {
    id: 'PAV-89421',
    customerId: 'usr-cust-01',
    customerName: 'Sneha K.',
    customerEmail: 'snehakrishnamurthy25@gmail.com',
    customerPhone: '+91 9036767664',
    shippingAddress: {
      id: 'addr-2',
      name: 'Sneha Residence',
      phone: '+91 9036767664',
      street: 'Cubbonpet, Main Road',
      city: 'Bengaluru Rural',
      state: 'Karnataka',
      pincode: '560002',
    },
    items: [
      {
        product: {
          id: 'prod-001',
          sku: 'PAV-MOD-ONE',
          name: 'Pavitra Air Module One',
          tagline: 'Comes with all core modules. Upgrade anytime.',
          price: 3500,
          originalPrice: 4999,
          discountPercentage: 30,
          coverImage: '/pavitra_purifier.png',
          images: [],
          category: 'purifier',
          stock: 40,
          isFeatured: true,
          isPublished: true,
          rating: 4.8,
          reviewsCount: 2140,
          description: '',
          specs: [],
          features: [],
          coverageArea: '350 sq ft',
          filtrationType: 'H13 HEPA',
          dimensions: '',
          weight: '',
          warranty: '1 Year',
          includedItems: [],
        },
        quantity: 1,
      }
    ],
    subtotal: 3500,
    discount: 500,
    couponCode: 'CLEAN20',
    tax: 630,
    shippingFee: 0,
    total: 3630,
    paymentMethod: 'Razorpay',
    paymentId: 'pay_RZP_984729103',
    paymentStatus: 'Paid',
    status: 'Shipped',
    trackingNumber: 'BLR-EXP-99210',
    courierName: 'BlueDart Express',
    timeline: [
      { status: 'Pending', timestamp: '2026-07-18 10:15 AM', note: 'Order placed successfully' },
      { status: 'Confirmed', timestamp: '2026-07-18 10:18 AM', note: 'Payment verified via Razorpay' },
      { status: 'Packed', timestamp: '2026-07-18 02:30 PM', note: 'Module parts inspected & packaged' },
      { status: 'Shipped', timestamp: '2026-07-19 09:00 AM', note: 'Handed over to BlueDart courier' }
    ],
    createdAt: '2026-07-18T10:15:00Z',
    updatedAt: '2026-07-19T09:00:00Z',
  }
];

export const useOrderStore = create<OrderState>()(
  persist(
    (set, get) => ({
      orders: initialMockOrders,

      createOrder: (params) => {
        const orderId = `PAV-${Math.floor(10000 + Math.random() * 90000)}`;
        const nowStr = new Date().toLocaleString('en-IN', { timeZone: 'Asia/Kolkata' });

        const newOrder: Order = {
          id: orderId,
          ...params,
          paymentStatus: 'Paid',
          status: 'Confirmed',
          timeline: [
            { status: 'Pending', timestamp: nowStr, note: 'Order submitted' },
            { status: 'Confirmed', timestamp: nowStr, note: `Payment verified (${params.paymentMethod})` },
          ],
          createdAt: new Date().toISOString(),
          updatedAt: new Date().toISOString(),
          trackingNumber: `PAV-TRK-${Math.floor(100000 + Math.random() * 900000)}`,
          courierName: 'Delhivery Priority Express',
        };

        set((state) => ({ orders: [newOrder, ...state.orders] }));

        // 1. Sync to Firestore
        saveFirestoreOrder(newOrder);

        // 2. Send Admin Email Notification
        const productsSummary = params.items.map((i) => `${i.quantity}x ${i.product.name}`).join(', ');
        sendAdminOrderNotification({
          orderId,
          customerName: params.customerName,
          customerPhone: params.customerPhone,
          customerEmail: params.customerEmail,
          address: `${params.shippingAddress.street}, ${params.shippingAddress.city}, ${params.shippingAddress.state} - ${params.shippingAddress.pincode}`,
          productsSummary,
          totalAmount: params.total,
        });

        return newOrder;
      },

      updateOrderStatus: (id, newStatus, note) => {
        const nowStr = new Date().toLocaleString('en-IN', { timeZone: 'Asia/Kolkata' });

        set((state) => ({
          orders: state.orders.map((o) => {
            if (o.id === id) {
              const updatedTimeline = [
                ...o.timeline,
                { status: newStatus, timestamp: nowStr, note: note || `Status updated to ${newStatus}` },
              ];
              return {
                ...o,
                status: newStatus,
                timeline: updatedTimeline,
                updatedAt: new Date().toISOString(),
              };
            }
            return o;
          }),
        }));

        // Sync Status Update to Firestore
        updateFirestoreOrderStatus(id, newStatus);
      },

      updateTrackingInfo: (id, trackingNumber, courierName) => {
        set((state) => ({
          orders: state.orders.map((o) =>
            o.id === id ? { ...o, trackingNumber, courierName, updatedAt: new Date().toISOString() } : o
          ),
        }));
      },

      cancelOrder: (id) => {
        get().updateOrderStatus(id, 'Cancelled', 'Cancelled by user or administrator');
      },

      getOrderById: (id) => {
        return get().orders.find((o) => o.id === id);
      },

      getUserOrders: (customerId) => {
        return get().orders.filter((o) => o.customerId === customerId);
      },
    }),
    {
      name: 'pavitra-orders-store-v2',
    }
  )
);
