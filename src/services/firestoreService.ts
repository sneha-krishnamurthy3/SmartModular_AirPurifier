import { 
  collection, 
  doc, 
  getDoc, 
  getDocs, 
  setDoc, 
  updateDoc, 
  deleteDoc, 
  query, 
  where, 
  orderBy, 
  serverTimestamp 
} from 'firebase/firestore';
import { db, isFirebaseConfigured } from './firebase';
import type { Product, Order, CMSData, FAQItem, Review, Coupon } from '../types';

// Collection References
const PRODUCTS_COL = 'products';
const ORDERS_COL = 'orders';
const PAYMENTS_COL = 'payments';
const CMS_COL = 'cms';
const FAQS_COL = 'faqs';
const REVIEWS_COL = 'reviews';
const COUPONS_COL = 'coupons';

// ==================== PRODUCTS FIRESTORE ====================
export const getFirestoreProducts = async (): Promise<Product[]> => {
  if (!isFirebaseConfigured) return [];
  try {
    const querySnapshot = await getDocs(collection(db, PRODUCTS_COL));
    return querySnapshot.docs.map((docSnap) => docSnap.data() as Product);
  } catch (error) {
    console.warn('Firestore getProducts error:', error);
    return [];
  }
};

export const saveFirestoreProduct = async (product: Product): Promise<boolean> => {
  if (!isFirebaseConfigured) return false;
  try {
    await setDoc(doc(db, PRODUCTS_COL, product.id), {
      ...product,
      updatedAt: serverTimestamp(),
    });
    return true;
  } catch (error) {
    console.error('Firestore saveProduct error:', error);
    return false;
  }
};

export const deleteFirestoreProduct = async (id: string): Promise<boolean> => {
  if (!isFirebaseConfigured) return false;
  try {
    await deleteDoc(doc(db, PRODUCTS_COL, id));
    return true;
  } catch (error) {
    console.error('Firestore deleteProduct error:', error);
    return false;
  }
};

// ==================== ORDERS & TRANSACTIONS FIRESTORE ====================
export const saveFirestoreOrder = async (order: Order): Promise<boolean> => {
  if (!isFirebaseConfigured) return false;
  try {
    await setDoc(doc(db, ORDERS_COL, order.id), {
      ...order,
      createdAtTimestamp: serverTimestamp(),
    });

    // Also record transaction in payments collection
    await setDoc(doc(db, PAYMENTS_COL, `pay_${order.id}`), {
      orderId: order.id,
      paymentId: order.paymentId,
      customerEmail: order.customerEmail,
      customerName: order.customerName,
      amount: order.total,
      paymentMethod: order.paymentMethod,
      status: 'SUCCESS',
      timestamp: serverTimestamp(),
    });

    return true;
  } catch (error) {
    console.error('Firestore saveOrder error:', error);
    return false;
  }
};

export const updateFirestoreOrderStatus = async (orderId: string, status: string): Promise<boolean> => {
  if (!isFirebaseConfigured) return false;
  try {
    await updateDoc(doc(db, ORDERS_COL, orderId), {
      status,
      updatedAt: serverTimestamp(),
    });
    return true;
  } catch (error) {
    console.error('Firestore updateOrderStatus error:', error);
    return false;
  }
};

export const getFirestoreCustomerOrders = async (userEmail: string): Promise<Order[]> => {
  if (!isFirebaseConfigured) return [];
  try {
    const q = query(
      collection(db, ORDERS_COL),
      where('customerEmail', '==', userEmail),
      orderBy('createdAtTimestamp', 'desc')
    );
    const querySnapshot = await getDocs(q);
    return querySnapshot.docs.map((docSnap) => docSnap.data() as Order);
  } catch (error) {
    console.warn('Firestore getCustomerOrders error:', error);
    return [];
  }
};

// ==================== CMS & CONTENT FIRESTORE ====================
export const saveFirestoreCMS = async (cmsData: CMSData): Promise<boolean> => {
  if (!isFirebaseConfigured) return false;
  try {
    await setDoc(doc(db, CMS_COL, 'homepage'), {
      ...cmsData,
      updatedAt: serverTimestamp(),
    });
    return true;
  } catch (error) {
    console.error('Firestore saveCMS error:', error);
    return false;
  }
};

export const getFirestoreCMS = async (): Promise<CMSData | null> => {
  if (!isFirebaseConfigured) return null;
  try {
    const docSnap = await getDoc(doc(db, CMS_COL, 'homepage'));
    return docSnap.exists() ? (docSnap.data() as CMSData) : null;
  } catch (error) {
    console.warn('Firestore getCMS error:', error);
    return null;
  }
};

// ==================== FAQS, REVIEWS, COUPONS FIRESTORE ====================
export const saveFirestoreFAQ = async (faq: FAQItem): Promise<boolean> => {
  if (!isFirebaseConfigured) return false;
  try {
    await setDoc(doc(db, FAQS_COL, faq.id), faq);
    return true;
  } catch (error) {
    console.error('Firestore saveFAQ error:', error);
    return false;
  }
};

export const saveFirestoreReview = async (review: Review): Promise<boolean> => {
  if (!isFirebaseConfigured) return false;
  try {
    await setDoc(doc(db, REVIEWS_COL, review.id), review);
    return true;
  } catch (error) {
    console.error('Firestore saveReview error:', error);
    return false;
  }
};

export const saveFirestoreCoupon = async (coupon: Coupon): Promise<boolean> => {
  if (!isFirebaseConfigured) return false;
  try {
    await setDoc(doc(db, COUPONS_COL, coupon.id), coupon);
    return true;
  } catch (error) {
    console.error('Firestore saveCoupon error:', error);
    return false;
  }
};
