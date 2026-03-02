import { useState } from "react";
import { NavLink, useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import { useAuthStore } from "@/stores/authStore";
import { 
  LayoutDashboard, User, Heart, MessageCircle, Crown, Settings, LogOut, Menu, X, Sparkles, Users
} from "lucide-react";
import { cn } from "@/lib/utils";

const sidebarLinks = [
  { name: "Dashboard", href: "/dashboard", icon: LayoutDashboard },
  { name: "My Matches", href: "/dashboard/matches", icon: Users },
  { name: "Profile", href: "/dashboard/profile", icon: User },
  { name: "Interests", href: "/dashboard/interests", icon: Heart },
  { name: "Chat List", href: "/dashboard/chat-list", icon: MessageCircle },
  { name: "Plan", href: "/dashboard/plan", icon: Crown },
  { name: "Settings", href: "/dashboard/settings", icon: Settings },
];

const DashboardLayout = ({ children }: { children: React.ReactNode }) => {
  const { user, logout } = useAuthStore();
  const navigate = useNavigate();
  const [sidebarOpen, setSidebarOpen] = useState(false);

  const handleLogout = () => {
    logout();
    navigate("/");
  };

  return (
    <div className="min-h-screen bg-accent-rose/30 relative">
      {/* Decorative leaves */}
      <div className="absolute top-0 left-0 w-32 h-40 opacity-40 pointer-events-none">
        <img src="https://rn53themes.net/themes/matrimo/images/leafs-min.png" alt="" className="w-full h-full object-contain" />
      </div>
      <div className="absolute top-0 right-0 w-32 h-40 opacity-40 pointer-events-none transform scale-x-[-1]">
        <img src="https://rn53themes.net/themes/matrimo/images/leafs-min.png" alt="" className="w-full h-full object-contain" />
      </div>

      <div className="container mx-auto px-4 py-8">
        <div className="flex gap-6 relative">
          {/* Mobile Toggle */}
          <button
            onClick={() => setSidebarOpen(!sidebarOpen)}
            className="lg:hidden fixed top-4 left-4 z-50 w-10 h-10 bg-white rounded-full shadow-soft flex items-center justify-center"
          >
            {sidebarOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
          </button>

          {/* Sidebar */}
          <motion.aside
            initial={false}
            className={cn(
              "w-72 flex-shrink-0 lg:block",
              sidebarOpen ? "fixed inset-0 z-40 lg:static lg:z-auto" : "hidden lg:block"
            )}
          >
            {sidebarOpen && <div className="fixed inset-0 bg-black/30 lg:hidden" onClick={() => setSidebarOpen(false)} />}
            
            <div className="bg-white rounded-3xl shadow-card p-6 sticky top-8 relative z-50">
              {/* User Photo */}
              <div className="relative mb-6 rounded-2xl overflow-hidden">
                <img
                  src={user?.avatar || "https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=300&h=200&fit=crop&crop=face"}
                  alt={user?.name}
                  className="w-full h-48 object-cover"
                />
              </div>

              {/* Nav Links */}
              <nav className="space-y-1">
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

          {/* Main Content */}
          <main className="flex-1 min-w-0">
            {children}
          </main>
        </div>
      </div>

      {/* Decorative bottom leaves */}
      <div className="absolute bottom-0 right-0 w-40 h-48 opacity-30 pointer-events-none">
        <img src="https://rn53themes.net/themes/matrimo/images/leafs-min.png" alt="" className="w-full h-full object-contain transform rotate-180" />
      </div>
    </div>
  );
};

export default DashboardLayout;
