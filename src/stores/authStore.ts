import { create } from 'zustand';
import { persist } from 'zustand/middleware';

export interface User {
  name: string;
  email: string;
  phone: string;
  avatar: string;
  plan: string;
  location: string;
  memberSince: string;
  /** Religion from registration (Step 4). Used for Horoscope visibility and post-payment redirect. */
  religion: string;
}

interface AuthState {
  isLoggedIn: boolean;
  user: User | null;
  /** Demo override: "Hindu" | "Christian" | "Muslim" | null. When set, isHindu() uses this instead of user.religion. */
  demoReligionOverride: string | null;
  login: (method: 'email' | 'phone', value: string) => void;
  /** Complete signup: set user with profile data including religion. */
  loginWithProfile: (profile: Partial<User> & { religion: string }) => void;
  logout: () => void;
  setDemoReligion: (religion: string | null) => void;
  /** True if user religion is Hindu (Horoscope/Jathagam visible, post-pay redirect to Jathagam). */
  isHindu: () => boolean;
}

const defaultUser: User = {
  name: "Anna Jaslin",
  email: "anna.jaslin@gmail.com",
  phone: "+91 98765 43210",
  avatar: "https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=200&h=200&fit=crop&crop=face",
  plan: "Premium",
  location: "Mumbai, India",
  memberSince: "January 2024",
  religion: "Hindu",
};

export const useAuthStore = create<AuthState>()(
  persist(
    (set, get) => ({
      isLoggedIn: false,
      user: null,
      demoReligionOverride: null,
      login: () => {
        set({ isLoggedIn: true, user: { ...defaultUser } });
      },
      loginWithProfile: (profile) => {
        set({
          isLoggedIn: true,
          user: {
            ...defaultUser,
            name: profile.name ?? defaultUser.name,
            email: profile.email ?? defaultUser.email,
            phone: profile.phone ?? defaultUser.phone,
            location: profile.location ?? defaultUser.location,
            religion: profile.religion ?? "",
          },
        });
      },
      logout: () => {
        set({ isLoggedIn: false, user: null, demoReligionOverride: null });
      },
      setDemoReligion: (religion) => {
        set({ demoReligionOverride: religion || null });
      },
      isHindu: () => {
        const override = get().demoReligionOverride?.trim().toLowerCase();
        if (override) {
          if (override === "christian" || override === "muslim") return false;
          if (override === "hindu") return true;
        }
        const r = (get().user?.religion ?? "").trim().toLowerCase();
        if (r === "christian" || r === "muslim") return false;
        return true;
      },
    }),
    {
      name: 'auth-store',
      partialize: (state) => ({ isLoggedIn: state.isLoggedIn, user: state.user }),
    }
  )
);
