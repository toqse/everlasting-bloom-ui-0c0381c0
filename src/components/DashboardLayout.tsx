"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { AnimatePresence, motion, useReducedMotion } from "framer-motion";
import { useAuthStore } from "@/stores/authStore";
import { fetchAndSyncMeProfile } from "@/lib/profileApi";
import { 
  LayoutDashboard, User, Heart, MessageCircle, Crown, Settings, LogOut, Menu, X, Sparkles, Users, Receipt, HelpCircle
} from "lucide-react";
import { cn } from "@/lib/utils";
import { stableUnit } from "@/lib/stableRandom";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";

const baseSidebarLinks = [
  { name: "Dashboard", href: "/dashboard", icon: LayoutDashboard },
  { name: "My Matches", href: "/dashboard/matches", icon: Users },
  { name: "Profile", href: "/dashboard/profile", icon: User },
  { name: "Interests", href: "/dashboard/interests", icon: Heart },
  { name: "Chat List", href: "/dashboard/chat-list", icon: MessageCircle },
  { name: "Horoscope", href: "/dashboard/jathagam", icon: Sparkles },
  { name: "Plans and Pricing", href: "/dashboard/plan", icon: Crown },
  { name: "Transactions", href: "/dashboard/transactions", icon: Receipt },
  { name: "Settings", href: "/dashboard/settings", icon: Settings },
  //{ name: "Help & Support", href: "/dashboard/help", icon: HelpCircle },
];

const FloatingHeart = ({ delay, left, size }: { delay: number; left: string; size: number }) => {
  const seed = `${delay}-${left}-${size}`;
  const driftX = stableUnit(`${seed}-x`) * 40 - 20;
  const duration = 12 + stableUnit(`${seed}-dur`) * 8;
  return (
  <motion.div
    className="absolute pointer-events-none text-primary/10"
    style={{ left, top: "100%" }}
    animate={{
      y: [0, -800],
      x: [0, driftX],
      opacity: [0, 0.6, 0],
      rotate: [0, 360],
    }}
    transition={{
      duration,
      delay,
      repeat: Infinity,
      ease: "easeOut",
    }}
  >
    <Heart className={`w-${size} h-${size}`} style={{ width: size * 4, height: size * 4 }} />
  </motion.div>
  );
};

const DashboardLayout = ({ children }: { children: React.ReactNode }) => {
  const { user, logout, isHindu, accessToken, isProfileComplete, hasHydrated } = useAuthStore();
  const router = useRouter();
  const pathname = usePathname();
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [logoutConfirmOpen, setLogoutConfirmOpen] = useState(false);
  // Keep initial server/client markup identical; apply profile-based filtering
  // only after auth store hydration completes on the client.
  const sidebarLinks = !hasHydrated
    ? baseSidebarLinks
    : baseSidebarLinks.filter((link) => link.name !== "Horoscope" || isHindu());
  const reduceMotion = useReducedMotion();

  const pageTitle = (() => {
    const path = pathname ?? "/dashboard";
    if (path === "/dashboard") return "Dashboard";
    const match = sidebarLinks.find((l) => l.href !== "/dashboard" && path.startsWith(l.href));
    return match?.name ?? "Dashboard";
  })();

  useEffect(() => {
    if (!hasHydrated) return;
    if (!accessToken) {
      logout();
      router.replace("/auth");
      return;
    }
    if (accessToken && !isProfileComplete()) {
      router.replace("/auth");
    }
  }, [accessToken, hasHydrated, isProfileComplete, logout, router]);

  useEffect(() => {
    if (!hasHydrated) return;
    if (!accessToken) return;
    fetchAndSyncMeProfile();
  }, [accessToken, hasHydrated]);

  useEffect(() => {
    if (typeof document === "undefined") return;
    const isMobile = window.matchMedia("(max-width: 1023px)").matches;
    if (sidebarOpen && isMobile) {
      const prev = document.body.style.overflow;
      document.body.style.overflow = "hidden";
      return () => {
        document.body.style.overflow = prev;
      };
    }
  }, [sidebarOpen]);

  // Close the mobile drawer when navigating between dashboard sections.
  useEffect(() => {
    setSidebarOpen(false);
  }, [pathname]);

  const handleLogout = () => {
    logout();
    router.push("/");
  };

  const confirmLogout = () => {
    setLogoutConfirmOpen(false);
    setSidebarOpen(false);
    handleLogout();
  };

  return (
    <div className="min-h-screen relative overflow-x-hidden lg:overflow-hidden" style={{
      background: "linear-gradient(135deg, hsl(340 60% 97%) 0%, hsl(0 0% 100%) 30%, hsl(45 100% 98%) 60%, hsl(340 60% 96%) 100%)"
    }}>
      {/* Animated background orbs */}
      <motion.div
        className="absolute top-20 left-10 w-72 h-72 rounded-full opacity-20 pointer-events-none"
        style={{ background: "radial-gradient(circle, hsl(330 60% 80%) 0%, transparent 70%)" }}
        animate={{ scale: [1, 1.2, 1], x: [0, 30, 0], y: [0, -20, 0] }}
        transition={{ duration: 8, repeat: Infinity, ease: "easeInOut" }}
      />
      <motion.div
        className="absolute top-1/2 right-10 w-96 h-96 rounded-full opacity-15 pointer-events-none"
        style={{ background: "radial-gradient(circle, hsl(40 100% 80%) 0%, transparent 70%)" }}
        animate={{ scale: [1, 1.3, 1], x: [0, -20, 0], y: [0, 30, 0] }}
        transition={{ duration: 10, repeat: Infinity, ease: "easeInOut", delay: 2 }}
      />
      <motion.div
        className="absolute bottom-20 left-1/3 w-64 h-64 rounded-full opacity-10 pointer-events-none"
        style={{ background: "radial-gradient(circle, hsl(330 55% 75%) 0%, transparent 70%)" }}
        animate={{ scale: [1, 1.15, 1] }}
        transition={{ duration: 6, repeat: Infinity, ease: "easeInOut", delay: 4 }}
      />

      {/* Floating hearts */}
      <FloatingHeart delay={0} left="5%" size={3} />
      <FloatingHeart delay={3} left="85%" size={2} />
      <FloatingHeart delay={6} left="45%" size={4} />
      <FloatingHeart delay={9} left="70%" size={2} />
      <FloatingHeart delay={12} left="20%" size={3} />

      {/* Subtle pattern overlay */}
      <div className="absolute inset-0 pointer-events-none opacity-[0.03]" style={{
        backgroundImage: "radial-gradient(circle at 1px 1px, hsl(330 60% 34%) 1px, transparent 0)",
        backgroundSize: "40px 40px"
      }} />

      {/* Desktop: fixed-height container so only main content scrolls; sidebar stays fixed. Mobile: normal flow. */}
      <div className="w-full px-4 lg:px-10 pt-4 pb-8 relative z-10 flex flex-col min-h-screen lg:min-h-0 lg:h-screen lg:overflow-hidden">
        {/* Mobile header — hidden while drawer open so it doesn’t stack above / duplicate the close control */}
        <div
          className={cn(
            "lg:hidden sticky top-0 z-40 -mx-4 px-4 py-3 mb-3 bg-background/95 backdrop-blur-md border-b border-primary/10",
            sidebarOpen && "hidden"
          )}
        >
          <div className="flex items-center gap-3">
            <button
              type="button"
              onClick={() => setSidebarOpen(true)}
              className="w-10 h-10 bg-card rounded-full shadow-soft flex items-center justify-center shrink-0"
              aria-label="Open menu"
            >
              <Menu className="w-5 h-5" />
            </button>
            <div className="min-w-0 flex-1">
              <p className="font-serif font-bold text-foreground truncate">{pageTitle}</p>
              {(user?.matriId || user?.location) && (
                <p className="text-xs text-muted-foreground truncate">
                  {[user.matriId, user.location].filter(Boolean).join(" · ")}
                </p>
              )}
            </div>
          </div>
        </div>

        {/* Mobile: full-screen dim behind drawer (above page content, below drawer) */}
        {sidebarOpen && (
          <button
            type="button"
            aria-label="Close menu"
            className="lg:hidden fixed inset-0 z-[100] bg-foreground/40 backdrop-blur-[2px]"
            onClick={() => setSidebarOpen(false)}
          />
        )}

        <div className="flex flex-1 gap-6 relative min-h-0 lg:overflow-hidden">

          {/* Sidebar — desktop: in flow; mobile: full-height drawer above backdrop */}
          <motion.aside
            initial={false}
            className={cn(
              "w-72 flex-shrink-0 lg:block lg:h-full",
              sidebarOpen
                ? "fixed left-0 top-0 z-[110] h-dvh min-h-dvh w-[min(85vw,18rem)] flex flex-col lg:static lg:z-auto lg:h-full lg:w-72 lg:min-h-0 lg:max-w-none"
                : "hidden lg:block"
            )}
          >
            <div
              className={cn(
                "bg-card shadow-card flex flex-col flex-1 min-h-0 overflow-hidden",
                "lg:rounded-3xl lg:p-6 lg:shadow-card",
                "max-lg:h-full max-lg:min-h-dvh max-lg:rounded-none max-lg:border-r max-lg:border-primary/10 max-lg:p-4 max-lg:pt-[max(0.75rem,env(safe-area-inset-top))]"
              )}
            >
              <div className="lg:hidden flex items-center justify-between gap-2 pb-3 mb-2 border-b border-primary/10 shrink-0">
                <p className="font-serif font-semibold text-foreground text-sm truncate">Menu</p>
                <button
                  type="button"
                  onClick={() => setSidebarOpen(false)}
                  className="w-10 h-10 rounded-full bg-accent-rose/50 flex items-center justify-center text-foreground hover:bg-accent-rose transition-colors"
                  aria-label="Close menu"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              {/* User photo + name from GET v1/profile */}
              <div className="flex flex-col items-center mb-6">
                <div className="relative w-36 h-36 rounded-full overflow-hidden ring-4 ring-primary/15 shadow-card bg-accent-rose/30 shrink-0">
                  <img
                    src={
                      user?.avatar ||
                      "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=300&h=300&fit=crop&crop=face"
                    }
                    alt=""
                    className="w-full h-full object-cover"
                  />
                </div>
                {user?.name && (
                  <p className="mt-3 font-serif font-semibold text-center text-foreground truncate w-full px-1 text-sm">
                    {user.name}
                  </p>
                )}
                {(user?.matriId || user?.location) && (
                  <p className="text-xs text-muted-foreground text-center mt-0.5 truncate w-full px-1">
                    {[user.matriId, user.location].filter(Boolean).join(" · ")}
                  </p>
                )}
              </div>

              {/* Nav Links - flex-1 so sidebar fills height, overflow for long lists */}
              <nav className="space-y-1 flex-1 min-h-0 overflow-y-auto [scrollbar-width:none] [&::-webkit-scrollbar]:w-0">
                {sidebarLinks.map((link) => {
                  const isActive = link.href === "/dashboard" ? pathname === "/dashboard" : (pathname ?? "").startsWith(link.href);
                  return (
                    <Link
                      key={link.name}
                      href={link.href}
                      onClick={() => setSidebarOpen(false)}
                      className={cn(
                        "flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-medium transition-all",
                        isActive
                          ? "text-secondary border-l-4 border-secondary bg-secondary/5"
                          : "text-foreground hover:bg-accent-rose/50"
                      )}
                    >
                      <link.icon className="w-5 h-5" />
                      {link.name}
                    </Link>
                  );
                })}

                <button
                  type="button"
                  onClick={() => setLogoutConfirmOpen(true)}
                  className="flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-medium text-foreground hover:bg-accent-rose/50 w-full transition-all"
                >
                  <LogOut className="w-5 h-5" />
                  Log out
                </button>
              </nav>
            </div>
          </motion.aside>

          {/* Main Content - scrolls on desktop; sidebar stays fixed */}
          <main className="flex-1 min-w-0 min-h-0 overflow-y-auto [scrollbar-gutter:stable]">
            <AnimatePresence mode="wait" initial={false}>
              <motion.div
                key={pathname ?? "dashboard"}
                initial={reduceMotion ? false : { opacity: 0, y: 8, filter: "blur(2px)" }}
                animate={reduceMotion ? { opacity: 1 } : { opacity: 1, y: 0, filter: "blur(0px)" }}
                exit={reduceMotion ? { opacity: 0 } : { opacity: 0, y: -6, filter: "blur(2px)" }}
                transition={{
                  duration: reduceMotion ? 0 : 0.18,
                  ease: "easeOut",
                }}
                className="min-h-full"
              >
                {children}
              </motion.div>
            </AnimatePresence>
          </main>
        </div>
      </div>

      <AlertDialog open={logoutConfirmOpen} onOpenChange={setLogoutConfirmOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Log out?</AlertDialogTitle>
            <AlertDialogDescription>
              You’ll be signed out of your account on this device.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel type="button">Cancel</AlertDialogCancel>
            <AlertDialogAction type="button" onClick={confirmLogout}>
              Log out
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
};

export default DashboardLayout;
