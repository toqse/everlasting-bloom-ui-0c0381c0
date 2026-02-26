import { create } from 'zustand';
import { persist } from 'zustand/middleware';

interface User {
  name: string;
  email: string;
  phone: string;
  avatar: string;
  plan: string;
  location: string;
  memberSince: string;
}

interface AuthState {
  isLoggedIn: boolean;
  user: User | null;
  login: (method: 'email' | 'phone', value: string) => void;
  logout: () => void;
}

const mockUser: User = {
  name: "Anna Jaslin",
  email: "anna.jaslin@gmail.com",
  phone: "+91 98765 43210",
  avatar: "https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=200&h=200&fit=crop&crop=face",
  plan: "Premium",
  location: "Mumbai, India",
  memberSince: "January 2024",
};

export const useAuthStore = create<AuthState>()(
  persist(
    (set) => ({
      isLoggedIn: false,
      user: null,
      login: () => {
        set({ isLoggedIn: true, user: mockUser });
      },
      logout: () => {
        set({ isLoggedIn: false, user: null });
      },
    }),
    { name: 'auth-store' }
  )
);
