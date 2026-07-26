import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import type { User, Address, UserRole } from '../types';
import { auth } from '../services/firebase';
import { signOut } from 'firebase/auth';

interface AuthState {
  user: User | null;
  allUsers: User[];
  isAuthenticated: boolean;
  isAdmin: boolean;
  
  // Auth Actions
  login: (email: string, role?: UserRole, name?: string) => void;
  logout: () => void;
  updateProfile: (data: Partial<User>) => void;
  addAddress: (address: Omit<Address, 'id'>) => void;
  deleteAddress: (id: string) => void;
  toggleWishlist: (productId: string) => void;
  
  // Admin User Management
  toggleBlockUser: (uid: string) => void;
  deleteUser: (uid: string) => void;
  updateUserRole: (uid: string, role: UserRole) => void;
}

export const useAuthStore = create<AuthState>()(
  persist(
    (set, get) => ({
      user: null,
      allUsers: [],
      isAuthenticated: false,
      isAdmin: false,

      login: (email, role = 'customer', name) => {
        const isAdminRole = role === 'admin' || role === 'super_admin' || email.includes('admin');
        const userRole: UserRole = isAdminRole ? 'admin' : 'customer';

        const existingUser = get().allUsers.find((u) => u.email.toLowerCase() === email.toLowerCase());

        let currentUser: User;
        if (existingUser) {
          currentUser = { ...existingUser, role: userRole, photoURL: '' };
        } else {
          currentUser = {
            uid: `usr-${Date.now()}`,
            name: name || email.split('@')[0].toUpperCase(),
            email: email,
            role: userRole,
            photoURL: '',
            addresses: [
              {
                id: 'addr-default',
                name: name || 'Customer',
                phone: '+91 9036767664',
                street: 'Cubbonpet',
                city: 'Bengaluru Rural',
                state: 'Karnataka',
                pincode: '560002',
                isDefault: true
              }
            ],
            wishlist: [],
            totalSpent: 0,
            ordersCount: 0,
            createdAt: new Date().toISOString().split('T')[0],
            isBlocked: false,
          };
        }

        set((state) => ({
          user: currentUser,
          isAuthenticated: true,
          isAdmin: isAdminRole,
          allUsers: state.allUsers.some((u) => u.uid === currentUser.uid)
            ? state.allUsers.map((u) => (u.uid === currentUser.uid ? currentUser : u))
            : [...state.allUsers, currentUser],
        }));
      },

      logout: async () => {
        try {
          await signOut(auth);
        } catch (e) {
          console.warn('Firebase signOut notice:', e);
        }
        set({ user: null, isAuthenticated: false, isAdmin: false });
      },

      updateProfile: (data) => {
        set((state) => {
          if (!state.user) return state;
          const updatedUser = { ...state.user, ...data };
          return {
            user: updatedUser,
            allUsers: state.allUsers.map((u) => (u.uid === updatedUser.uid ? updatedUser : u)),
          };
        });
      },

      addAddress: (addrData) => {
        set((state) => {
          if (!state.user) return state;
          const newAddr: Address = {
            ...addrData,
            id: `addr-${Date.now()}`,
          };
          const addresses = [...state.user.addresses, newAddr];
          const updatedUser = { ...state.user, addresses };
          return {
            user: updatedUser,
            allUsers: state.allUsers.map((u) => (u.uid === updatedUser.uid ? updatedUser : u)),
          };
        });
      },

      deleteAddress: (id) => {
        set((state) => {
          if (!state.user) return state;
          const addresses = state.user.addresses.filter((a) => a.id !== id);
          const updatedUser = { ...state.user, addresses };
          return {
            user: updatedUser,
            allUsers: state.allUsers.map((u) => (u.uid === updatedUser.uid ? updatedUser : u)),
          };
        });
      },

      toggleWishlist: (productId) => {
        set((state) => {
          if (!state.user) return state;
          const exists = state.user.wishlist.includes(productId);
          const wishlist = exists
            ? state.user.wishlist.filter((id) => id !== productId)
            : [...state.user.wishlist, productId];
          const updatedUser = { ...state.user, wishlist };
          return {
            user: updatedUser,
            allUsers: state.allUsers.map((u) => (u.uid === updatedUser.uid ? updatedUser : u)),
          };
        });
      },

      toggleBlockUser: (uid) => {
        set((state) => ({
          allUsers: state.allUsers.map((u) => (u.uid === uid ? { ...u, isBlocked: !u.isBlocked } : u)),
        }));
      },

      deleteUser: (uid) => {
        set((state) => ({
          allUsers: state.allUsers.filter((u) => u.uid !== uid),
        }));
      },

      updateUserRole: (uid, role) => {
        set((state) => ({
          allUsers: state.allUsers.map((u) => (u.uid === uid ? { ...u, role } : u)),
        }));
      },
    }),
    {
      name: 'pavitra-auth-store-v5',
      merge: (persistedState: any, currentState) => {
        return {
          ...currentState,
          ...persistedState,
          user: persistedState?.user || null,
          isAuthenticated: Boolean(persistedState?.user),
          isAdmin: Boolean(persistedState?.user?.role === 'admin' || persistedState?.user?.role === 'super_admin'),
        };
      },
    }
  )
);
