import { motion } from "framer-motion";
import DashboardLayout from "@/components/DashboardLayout";
import { useAuthStore } from "@/stores/authStore";
import { Heart, Eye, Users, MousePointer, Edit, Sparkles } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useNavigate } from "react-router-dom";

const DashboardPage = () => {
  const { user } = useAuthStore();
  const navigate = useNavigate();

  const profileStats = [
    { icon: Heart, label: "Likes", value: 12, color: "text-primary" },
    { icon: Eye, label: "Views", value: 12, color: "text-secondary" },
    { icon: Users, label: "Interests", value: 12, color: "text-primary" },
    { icon: MousePointer, label: "Clicks", value: 12, color: "text-secondary" },
  ];

  return (
    <DashboardLayout>
      <div className="space-y-6">
        {/* Header */}
        <h1 className="font-serif text-2xl md:text-3xl font-bold text-secondary">Profiles status</h1>

        <div className="grid lg:grid-cols-2 gap-6">
          {/* Profile Card */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="bg-white rounded-3xl shadow-card overflow-hidden"
          >
            <div className="relative">
              <img
                src={user?.avatar || "https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=600&h=300&fit=crop&crop=face"}
                alt={user?.name}
                className="w-full h-64 object-cover"
              />
              <div className="absolute bottom-0 left-0 right-0 bg-foreground/90 text-white py-3 px-6 text-center">
                <button
                  onClick={() => navigate("/dashboard/profile")}
                  className="font-medium tracking-wide flex items-center gap-2 justify-center w-full"
                >
                  <Edit className="w-4 h-4" />
                  EDIT PROFILE
                </button>
              </div>
            </div>
          </motion.div>

          {/* Profile Completion */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="bg-white rounded-3xl shadow-card p-6"
          >
            <div className="flex items-center justify-between mb-6">
              <h3 className="font-serif text-lg font-bold text-secondary">Profile completion</h3>
              <button className="w-8 h-8 rounded-full border border-primary/10 flex items-center justify-center text-muted-foreground hover:bg-accent-rose transition-colors">
                •••
              </button>
            </div>

            {/* Circular Progress */}
            <div className="flex justify-center mb-8">
              <div className="relative w-40 h-40">
                <svg className="w-full h-full transform -rotate-90" viewBox="0 0 120 120">
                  <circle cx="60" cy="60" r="50" stroke="hsl(var(--accent-rose))" strokeWidth="8" fill="none" />
                  <circle
                    cx="60" cy="60" r="50"
                    stroke="url(#progress-gradient)"
                    strokeWidth="8"
                    fill="none"
                    strokeLinecap="round"
                    strokeDasharray={`${2 * Math.PI * 50 * 0.9} ${2 * Math.PI * 50}`}
                  />
                  <defs>
                    <linearGradient id="progress-gradient" x1="0%" y1="0%" x2="100%" y2="0%">
                      <stop offset="0%" stopColor="hsl(270, 60%, 50%)" />
                      <stop offset="100%" stopColor="hsl(330, 60%, 50%)" />
                    </linearGradient>
                  </defs>
                </svg>
                <div className="absolute inset-0 flex items-center justify-center">
                  <span className="font-serif text-4xl font-bold text-foreground">90<span className="text-lg">%</span></span>
                </div>
              </div>
            </div>

            {/* Stats Grid */}
            <div className="grid grid-cols-2 gap-4">
              {profileStats.map((stat, i) => (
                <div key={i} className="flex items-center gap-3">
                  <div className="w-8 h-8 rounded-full bg-accent-rose flex items-center justify-center">
                    <stat.icon className={`w-4 h-4 ${stat.color}`} />
                  </div>
                  <span className="text-sm">
                    <span className="font-bold text-foreground">{stat.value}</span>{" "}
                    <span className="text-muted-foreground">{stat.label}</span>
                  </span>
                </div>
              ))}
            </div>
          </motion.div>
        </div>

        {/* Profile Views Chart placeholder */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="bg-white rounded-3xl shadow-card p-6"
        >
          <div className="flex items-center justify-between mb-6">
            <h3 className="font-serif text-lg font-bold text-secondary">Profiles views</h3>
            <select className="border border-primary/10 rounded-xl px-4 py-2 text-sm bg-white">
              <option>Current month</option>
              <option>Last month</option>
              <option>Last 3 months</option>
            </select>
          </div>
          <div className="h-48 bg-gradient-to-t from-accent-gold/20 to-transparent rounded-2xl flex items-end justify-center pb-4">
            <p className="text-muted-foreground text-sm">Profile views analytics will appear here</p>
          </div>
        </motion.div>
      </div>
    </DashboardLayout>
  );
};

export default DashboardPage;
