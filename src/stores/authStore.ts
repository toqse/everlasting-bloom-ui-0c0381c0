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
  /** Update user's plan after payment (e.g. "Gold", "Diamond", "Silver"). */
  setPlan: (plan: string) => void;
  /** True if user has a paid plan (Silver, Gold, Diamond) — unlocks contacts, send interest, chat, horoscope for Hindu. */
  hasPaidPlan: () => boolean;
  /** True if user religion is Hindu (Horoscope/Jathagam visible, post-pay redirect to Jathagam). */
  isHindu: () => boolean;
  /** Horoscope/contact view credits: used this period (resets on plan renewal). */
  horoscopeCreditsUsed: number;
  /** Quota per plan: Silver 6, Gold 15, Diamond 30, etc. */
  getHoroscopeQuota: () => number;
  getHoroscopeRemaining: () => number;
  /** Use 1 credit. Returns true if used, false if none left. */
  useHoroscopeCredit: () => boolean;
}

const HOROSCOPE_QUOTA: Record<string, number> = {
  silver: 6,
  gold: 15,
  diamond: 30,
  platinum: 60,
  premium: 70,
};

const defaultUser: User = {
  name: "Anna Jaslin",
  email: "anna.jaslin@gmail.com",
  phone: "+91 98765 43210",
  avatar: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=200&h=200&fit=crop&crop=face",
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
      horoscopeCreditsUsed: 0,
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
      setPlan: (plan) => {
        const u = get().user;
        if (u) set({ user: { ...u, plan }, horoscopeCreditsUsed: 0 });
      },
      hasPaidPlan: () => {
        const p = (get().user?.plan ?? "").toLowerCase();
        return p === "silver" || p === "gold" || p === "diamond";
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
      getHoroscopeQuota: () => {
        const p = (get().user?.plan ?? "").toLowerCase();
        return HOROSCOPE_QUOTA[p] ?? (get().hasPaidPlan() ? 6 : 0);
      },
      getHoroscopeRemaining: () => {
        const quota = get().getHoroscopeQuota();
        return Math.max(0, quota - get().horoscopeCreditsUsed);
      },
      useHoroscopeCredit: () => {
        const remaining = get().getHoroscopeRemaining();
        if (remaining <= 0) return false;
        set({ horoscopeCreditsUsed: get().horoscopeCreditsUsed + 1 });
        return true;
      },
    }),
    {
      name: 'auth-store',
      partialize: (state) => ({ isLoggedIn: state.isLoggedIn, user: state.user, horoscopeCreditsUsed: state.horoscopeCreditsUsed }),
    }
  )
);
