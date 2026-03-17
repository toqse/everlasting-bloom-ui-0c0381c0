import { useState, useEffect } from "react";
import { NavLink, useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import { useAuthStore } from "@/stores/authStore";
import { 
  LayoutDashboard, User, Heart, MessageCircle, Crown, Settings, LogOut, Menu, X, Sparkles, Users, Receipt, HelpCircle
} from "lucide-react";
import { cn } from "@/lib/utils";
import DemoReligionBar from "@/components/DemoReligionBar";

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

const FloatingHeart = ({ delay, left, size }: { delay: number; left: string; size: number }) => (
  <motion.div
    className="absolute pointer-events-none text-primary/10"
    style={{ left, top: "100%" }}
    animate={{
      y: [0, -800],
      x: [0, Math.random() * 40 - 20],
      opacity: [0, 0.6, 0],
      rotate: [0, 360],
    }}
    transition={{
      duration: 12 + Math.random() * 8,
      delay,
      repeat: Infinity,
      ease: "easeOut",
    }}
  >
    <Heart className={`w-${size} h-${size}`} style={{ width: size * 4, height: size * 4 }} />
  </motion.div>
);

const DashboardLayout = ({ children }: { children: React.ReactNode }) => {
  const { user, logout, isHindu, accessToken, isProfileComplete } = useAuthStore();
  const navigate = useNavigate();
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const sidebarLinks = baseSidebarLinks.filter((link) => link.name !== "Horoscope" || isHindu());

  useEffect(() => {
    if (accessToken && !isProfileComplete()) {
      navigate("/auth", { replace: true });
    }
  }, [accessToken, isProfileComplete, navigate]);

  const handleLogout = () => {
    logout();
    navigate("/");
  };

  return (
    <div className="min-h-screen relative overflow-hidden" style={{
      background: "linear-gradient(135deg, hsl(340 60% 97%) 0%, hsl(0 0% 100%) 30%, hsl(45 100% 98%) 60%, hsl(340 60% 96%) 100%)"
    }}>
      <DemoReligionBar />
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
      <div className="w-full px-4 lg:px-10 py-8 relative z-10 flex flex-col min-h-screen lg:min-h-0 lg:h-[calc(100vh-44px)] lg:overflow-hidden">
        <div className="flex flex-1 gap-6 relative min-h-0 lg:overflow-hidden">
          {/* Mobile Toggle */}
          <button
            onClick={() => setSidebarOpen(!sidebarOpen)}
            className="lg:hidden fixed top-4 left-4 z-50 w-10 h-10 bg-card rounded-full shadow-soft flex items-center justify-center"
          >
            {sidebarOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
          </button>

          {/* Sidebar - fixed on desktop (main content scrolls instead) */}
          <motion.aside
            initial={false}
            className={cn(
              "w-72 flex-shrink-0 lg:block lg:h-full",
              sidebarOpen ? "fixed inset-0 z-40 lg:static lg:z-auto" : "hidden lg:block"
            )}
          >
            {sidebarOpen && <div className="fixed inset-0 bg-foreground/30 lg:hidden" onClick={() => setSidebarOpen(false)} />}
            
            <div className="bg-card rounded-3xl shadow-card p-6 h-full flex flex-col relative z-50 lg:min-h-0 lg:max-h-full overflow-hidden">
              {/* User Photo */}
              <div className="relative mb-6 rounded-2xl overflow-hidden">
                <img
                  src={user?.avatar || "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=300&h=300&fit=crop&crop=face"}
                  alt={user?.name}
                  className="w-full h-48 object-cover"
                />
              </div>

              {/* Nav Links - flex-1 so sidebar fills height, overflow for long lists */}
              <nav className="space-y-1 flex-1 min-h-0 overflow-y-auto [scrollbar-width:none] [&::-webkit-scrollbar]:w-0">
                {sidebarLinks.map((link) => (
                  <NavLink
                    key={link.name}
                    to={link.href}
                    end={link.href === "/dashboard"}
                    onClick={() => setSidebarOpen(false)}
                    className={({ isActive }) => cn(
                      "flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-medium transition-all",
                      isActive
                        ? "text-secondary border-l-4 border-secondary bg-secondary/5"
                        : "text-foreground hover:bg-accent-rose/50"
                    )}
                  >
                    <link.icon className="w-5 h-5" />
                    {link.name}
                  </NavLink>
                ))}

                <button
                  onClick={handleLogout}
                  className="flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-medium text-foreground hover:bg-accent-rose/50 w-full transition-all"
                >
                  <LogOut className="w-5 h-5" />
                  Log out
                </button>
              </nav>
            </div>
          </motion.aside>

          {/* Main Content - scrolls on desktop; sidebar stays fixed */}
          <main className="flex-1 min-w-0 min-h-0 overflow-y-auto">
            {children}
          </main>
        </div>
      </div>
    </div>
  );
};

export default DashboardLayout;
