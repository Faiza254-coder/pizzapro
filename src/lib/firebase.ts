import { initializeApp, getApps, getApp } from 'firebase/app';
import { 
  getAuth, 
  signInWithEmailAndPassword, 
  createUserWithEmailAndPassword, 
  signOut, 
  onAuthStateChanged,
  GoogleAuthProvider,
  signInWithPopup,
  User as FirebaseUser
} from 'firebase/auth';
import { 
  getFirestore, 
  collection, 
  doc, 
  setDoc, 
  getDoc, 
  getDocs, 
  query, 
  where, 
  onSnapshot, 
  orderBy,
  getDocFromServer
} from 'firebase/firestore';
import firebaseConfig from '../../firebase-applet-config.json';
import { Order, UserProfile } from '../types';

// Initialize Firebase App
const app = !getApps().length ? initializeApp(firebaseConfig) : getApp();

// Initialize Auth & Firestore with specific Database ID
export const auth = getAuth(app);
export const db = (firebaseConfig.firestoreDatabaseId && firebaseConfig.firestoreDatabaseId !== '(default)')
  ? getFirestore(app, firebaseConfig.firestoreDatabaseId) 
  : getFirestore(app);

// Firestore Error Types and Logger Helper
export enum OperationType {
  CREATE = 'create',
  UPDATE = 'update',
  DELETE = 'delete',
  LIST = 'list',
  GET = 'get',
  WRITE = 'write',
}

export interface FirestoreErrorInfo {
  error: string;
  operationType: OperationType;
  path: string | null;
  authInfo: {
    userId?: string | null;
    email?: string | null;
    emailVerified?: boolean | null;
    isAnonymous?: boolean | null;
    tenantId?: string | null;
  };
}

export function handleFirestoreError(error: unknown, operationType: OperationType, path: string | null): Error {
  const errInfo: FirestoreErrorInfo = {
    error: error instanceof Error ? error.message : String(error),
    authInfo: {
      userId: auth.currentUser?.uid || null,
      email: auth.currentUser?.email || null,
      emailVerified: auth.currentUser?.emailVerified || null,
      isAnonymous: auth.currentUser?.isAnonymous || null,
      tenantId: auth.currentUser?.tenantId || null,
    },
    operationType,
    path
  };
  console.error('[Firestore Error Details]:', JSON.stringify(errInfo, null, 2));
  return new Error(`Firestore operation (${operationType}) failed on path "${path}": ${errInfo.error}`);
}

// Test Connection on Startup
async function testConnection() {
  try {
    const testDocRef = doc(db, 'test', 'connection');
    await getDoc(testDocRef);
  } catch (error) {
    if (error instanceof Error && error.message.includes('the client is offline')) {
      console.warn('[Firestore] Client connection offline notice:', error.message);
    }
  }
}
testConnection();

// Helper to recursively remove undefined values (Firestore throws on undefined)
export function sanitizeForFirestore<T>(data: T): T {
  if (data === null || data === undefined) {
    return null as any;
  }
  if (Array.isArray(data)) {
    return data.map((item) => sanitizeForFirestore(item)) as any;
  }
  if (typeof data === 'object' && !(data instanceof Date)) {
    const cleaned: any = {};
    for (const [key, value] of Object.entries(data)) {
      if (value !== undefined) {
        cleaned[key] = sanitizeForFirestore(value);
      }
    }
    return cleaned;
  }
  return data;
}

// Save or Update User Profile in Firestore
export const saveUserProfileToFirestore = async (userProfile: UserProfile): Promise<void> => {
  try {
    const docId = userProfile.id || `user-${Date.now()}`;
    const userRef = doc(db, 'users', docId);
    const rawPayload = {
      ...userProfile,
      id: docId,
      updatedAt: new Date().toISOString(),
    };
    const payload = sanitizeForFirestore(rawPayload);
    await setDoc(userRef, payload, { merge: true });
  } catch (err: any) {
    if (err?.code === 'permission-denied' || err?.message?.includes('insufficient permissions')) {
      console.warn('[Firestore] User profile save notice (permissions):', err?.message || err);
    } else if (err?.message?.includes('client is offline') || err?.code === 'unavailable') {
      console.warn('[Firestore] User profile save notice (offline):', err?.message || err);
    } else {
      console.error('Error saving user profile to Firestore:', err);
    }
  }
};

// Fetch User Profile from Firestore
export const getUserProfileFromFirestore = async (userId: string): Promise<UserProfile | null> => {
  if (!userId) return null;
  try {
    const userRef = doc(db, 'users', userId);
    const snap = await getDoc(userRef);
    if (snap.exists()) {
      return snap.data() as UserProfile;
    }
  } catch (err: any) {
    if (err?.code === 'permission-denied' || err?.message?.includes('insufficient permissions')) {
      console.warn('[Firestore] User profile fetch notice (permissions):', err?.message || err);
    } else if (err?.message?.includes('client is offline') || err?.code === 'unavailable') {
      console.warn('[Firestore] User profile fetch notice (offline):', err?.message || err);
    } else {
      console.error('Error fetching user profile from Firestore:', err);
    }
  }
  return null;
};

// Save Order to Firestore
export const saveOrderToFirestore = async (order: Order, userId?: string): Promise<string> => {
  const currentAuthUser = auth.currentUser;
  const effectiveUserId = userId || currentAuthUser?.uid || 'guest';

  const generatedOrderId = order.orderId || `PP-${Math.floor(100000 + Math.random() * 900000)}`;

  const rawPayload = {
    orderId: generatedOrderId,
    userId: effectiveUserId,
    customerName: order.customerName || 'Customer',
    customerPhone: order.customerPhone || '',
    phoneNumber: order.customerPhone || '',
    customerEmail: order.customerEmail || currentAuthUser?.email || '',
    email: order.customerEmail || currentAuthUser?.email || '',
    deliveryAddress: order.deliveryAddress || 'Takeaway Pickup',
    orderedItems: (order.items || []).map((item) => ({
      cartItemId: item.cartItemId || '',
      name: item.menuItem?.name || 'Pizza Item',
      selectedSize: item.selectedSize || 'Standard',
      quantity: Number(item.quantity) || 1,
      unitPrice: Number(item.unitPrice) || 0,
      totalPrice: Number(item.totalPrice) || 0,
      customNotes: item.customNotes || '',
    })),
    items: (order.items || []).map((item) => ({
      cartItemId: item.cartItemId || '',
      menuItem: {
        id: item.menuItem?.id || '',
        name: item.menuItem?.name || '',
        category: item.menuItem?.category || 'regular-pizza',
        description: item.menuItem?.description || '',
        price: Number(item.menuItem?.price) || 0,
        image: item.menuItem?.image || '',
      },
      selectedSize: item.selectedSize || 'Standard',
      quantity: Number(item.quantity) || 1,
      unitPrice: Number(item.unitPrice) || 0,
      totalPrice: Number(item.totalPrice) || 0,
      customNotes: item.customNotes || '',
    })),
    subtotal: Number(order.subtotal) || 0,
    discount: Number(order.discount) || 0,
    deliveryFee: Number(order.deliveryFee) || 0,
    totalAmount: Number(order.totalAmount) || 0,
    paymentMethod: order.paymentMethod || 'cod',
    paymentStatus: order.paymentStatus || 'Pending COD',
    orderStatus: order.orderStatus || 'Pending',
    orderType: order.orderType || 'delivery',
    notes: order.notes || '',
    createdAt: order.createdAt || new Date().toLocaleString(),
    createdAtISO: order.createdAtISO || new Date().toISOString(),
    estimatedTimeMinutes: Number(order.estimatedTimeMinutes) || 25,
    barcodeValue: generatedOrderId,
  };

  const payload = sanitizeForFirestore(rawPayload);

  try {
    const orderDocRef = doc(db, 'orders', generatedOrderId);
    await setDoc(orderDocRef, payload, { merge: true });
    console.log('[Firestore] Order document successfully created/written to "orders" collection in pizza-pro-b9ebb:', generatedOrderId);
    return generatedOrderId;
  } catch (primaryErr: any) {
    if (primaryErr?.code === 'permission-denied' || primaryErr?.message?.includes('insufficient permissions') || primaryErr?.message?.includes('client is offline') || primaryErr?.code === 'unavailable') {
      console.warn('[Firestore] Order save notice (permissions/offline fallback):', primaryErr?.message || primaryErr);
      try {
        const localOrders = JSON.parse(localStorage.getItem('pizzapro_saved_orders') || '[]');
        localStorage.setItem('pizzapro_saved_orders', JSON.stringify([payload, ...localOrders]));
      } catch (e) {
        console.warn('Failed to save order to localStorage fallback:', e);
      }
      return generatedOrderId;
    }
    console.error('[Firestore] Order setDoc failed on orders collection:', primaryErr);
    throw handleFirestoreError(primaryErr, OperationType.WRITE, `orders/${generatedOrderId}`);
  }
};

// Subscribe to User Orders in Firestore
export const subscribeUserOrders = (
  userId: string, 
  onOrdersUpdate: (orders: Order[]) => void
) => {
  if (!userId) {
    onOrdersUpdate([]);
    return () => {};
  }
  try {
    const q = query(
      collection(db, 'orders'),
      where('userId', '==', userId)
    );

    return onSnapshot(q, (snapshot) => {
      const orders: Order[] = [];
      snapshot.forEach((docSnap) => {
        orders.push(docSnap.data() as Order);
      });
      // Sort newest first
      orders.sort((a, b) => (b.createdAtISO || '').localeCompare(a.createdAtISO || ''));
      onOrdersUpdate(orders);
    }, (err) => {
      if (err?.code === 'permission-denied' || err?.message?.includes('insufficient permissions')) {
        console.warn('[Firestore] User orders listener notice (permissions):', err?.message || err);
      } else {
        console.error('Error listening to orders:', err);
      }
    });
  } catch (err) {
    console.error('Firestore listener setup failed:', err);
    return () => {};
  }
};

// Subscribe to ALL Orders in Firestore (For Admin Dashboard)
export const subscribeAllOrders = (
  onOrdersUpdate: (orders: Order[]) => void
) => {
  try {
    const ordersCol = collection(db, 'orders');
    return onSnapshot(ordersCol, (snapshot) => {
      const orders: Order[] = [];
      snapshot.forEach((docSnap) => {
        orders.push(docSnap.data() as Order);
      });
      // Sort newest first
      orders.sort((a, b) => (b.createdAtISO || '').localeCompare(a.createdAtISO || ''));
      onOrdersUpdate(orders);
    }, (err) => {
      if (err?.code === 'permission-denied' || err?.message?.includes('insufficient permissions')) {
        console.warn('[Firestore] Admin orders listener notice (permissions):', err?.message || err);
      } else {
        console.error('Error listening to all orders for admin:', err);
      }
    });
  } catch (err) {
    console.error('Firestore all orders listener setup failed:', err);
    return () => {};
  }
};

// Update Order Status in Firestore
export const updateOrderStatusInFirestore = async (
  orderId: string,
  newStatus: string
): Promise<void> => {
  try {
    const orderRef = doc(db, 'orders', orderId);
    await setDoc(orderRef, { 
      orderStatus: newStatus, 
      updatedAtISO: new Date().toISOString() 
    }, { merge: true });
    console.log(`[Firestore] Order ${orderId} status updated to ${newStatus}`);
  } catch (err) {
    console.error('Error updating order status in Firestore:', err);
  }
};

export const googleProvider = new GoogleAuthProvider();

export const signInWithGoogle = async (): Promise<FirebaseUser | null> => {
  try {
    const result = await signInWithPopup(auth, googleProvider);
    return result.user;
  } catch (err: any) {
    if (err?.code !== 'auth/operation-not-allowed' && !err?.message?.includes('operation-not-allowed')) {
      console.error('Google Sign In Error:', err);
    }
    throw err;
  }
};

export { 
  signInWithEmailAndPassword, 
  createUserWithEmailAndPassword, 
  signOut, 
  onAuthStateChanged 
};
export type { FirebaseUser };
