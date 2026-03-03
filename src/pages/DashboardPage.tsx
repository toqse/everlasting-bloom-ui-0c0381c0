import { motion } from "framer-motion";
import DashboardLayout from "@/components/DashboardLayout";
import { useAuthStore } from "@/stores/authStore";
import { Heart, Eye, Users, MousePointer, Edit, Sparkles, MapPin, ArrowRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useNavigate } from "react-router-dom";
import GlassProfileCard from "@/components/GlassProfileCard";
import { profilesData } from "@/components/FeaturedProfiles";

const dashboardStats = [
  { icon: Heart, label: "Likes", value: 12, color: "text-primary" },
  { icon: Eye, label: "Views", value: 24, color: "text-secondary" },
  { icon: Users, label: "Interests", value: 8, color: "text-primary" },
  { icon: MousePointer, label: "Clicks", value: 45, color: "text-secondary" },
];

const DashboardPage = () => {
  const { user } = useAuthStore();
  const navigate = useNavigate();
  const suggestedProfiles = profilesData.slice(0, 6);

  return (
    <DashboardLayout>
      <div className="space-y-6">
        {/* Header */}
        <h1 className="font-serif text-2xl md:text-3xl font-bold text-secondary">Profiles status</h1>

        {/* DashboardStats cards row */}
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          className="grid grid-cols-2 md:grid-cols-4 gap-4"
        >
          {dashboardStats.map((stat, i) => (
            <div
              key={i}
              className="bg-white rounded-2xl shadow-card p-4 flex items-center gap-4 hover:shadow-elevated transition-shadow"
            >
              <div className="w-12 h-12 rounded-xl bg-accent-rose flex items-center justify-center flex-shrink-0">
                <stat.icon className={`w-6 h-6 ${stat.color}`} />
              </div>
              <div>
                <p className="font-serif text-2xl font-bold text-foreground">{stat.value}</p>
                <p className="text-sm text-muted-foreground">{stat.label}</p>
              </div>
            </div>
          ))}
        </motion.div>

        {/* 2-column grid: matches area + sidebar */}
        <div className="grid lg:grid-cols-12 gap-6">
          {/* Left: matches / main content (8 cols) */}
          <div className="lg:col-span-8 space-y-6">
            {/* Profile Card + completion row */}
            <div className="grid lg:grid-cols-2 gap-6">
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
                <div className="flex justify-center mb-6">
                  <div className="relative w-32 h-32">
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
                      <span className="font-serif text-3xl font-bold text-foreground">90<span className="text-base">%</span></span>
                    </div>
                  </div>
                </div>
                <div className="grid grid-cols-2 gap-3">
                  {dashboardStats.map((stat, i) => (
                    <div key={i} className="flex items-center gap-2">
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

            {/* Nearby Matches banner */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.15 }}
              className="bg-gradient-to-r from-primary/15 via-accent-rose/30 to-secondary/15 rounded-3xl shadow-card p-6 border border-primary/10"
            >
              <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
                <div className="flex items-center gap-4">
                  <div className="w-14 h-14 rounded-2xl bg-white/80 flex items-center justify-center">
                    <MapPin className="w-7 h-7 text-primary" />
                  </div>
                  <div>
                    <h3 className="font-serif text-lg font-bold text-secondary">Nearby Matches</h3>
                    <p className="text-sm text-muted-foreground">Profiles near your location are waiting to connect</p>
                  </div>
                </div>
                <Button
                  variant="hero"
                  size="default"
                  className="gap-2 shrink-0"
                  onClick={() => navigate("/search")}
                >
                  View Nearby
                  <ArrowRight className="w-4 h-4" />
                </Button>
              </div>
            </motion.div>

            {/* Suggested — grid-12 */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 }}
            >
              <h3 className="font-serif text-lg font-bold text-secondary mb-4 flex items-center gap-2">
                <Sparkles className="w-5 h-5 text-secondary" />
                Suggested for you
              </h3>
              <div className="grid grid-cols-12 gap-4">
                {suggestedProfiles.map((profile, index) => (
                  <div key={profile.id} className="col-span-12 sm:col-span-6 lg:col-span-4">
                    <GlassProfileCard
                      profile={profile}
                      index={index}
                      showActions={true}
                      onSendInterest={() => {}}
                    />
                  </div>
                ))}
              </div>
            </motion.div>
          </div>

          {/* Right: sidebar (4 cols) */}
          <aside className="lg:col-span-4 space-y-6">
            <motion.div
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.1 }}
              className="bg-white rounded-3xl shadow-card p-6 sticky top-8"
            >
              <h3 className="font-serif text-lg font-bold text-secondary mb-4">Quick actions</h3>
              <div className="space-y-2">
                <Button variant="outline" className="w-full justify-start gap-2" onClick={() => navigate("/search")}>
                  <Heart className="w-4 h-4" />
                  Find matches
                </Button>
                <Button variant="outline" className="w-full justify-start gap-2" onClick={() => navigate("/dashboard/interests")}>
                  <Users className="w-4 h-4" />
                  My interests
                </Button>
                <Button variant="outline" className="w-full justify-start gap-2" onClick={() => navigate("/dashboard/plan")}>
                  <Sparkles className="w-4 h-4" />
                  Upgrade plan
                </Button>
              </div>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 }}
              className="bg-white rounded-3xl shadow-card p-6"
            >
              <h3 className="font-serif text-lg font-bold text-secondary mb-4">Profile views</h3>
              <select className="w-full border border-primary/10 rounded-xl px-4 py-2 text-sm bg-white mb-4">
                <option>Current month</option>
                <option>Last month</option>
                <option>Last 3 months</option>
              </select>
              <div className="h-32 bg-gradient-to-t from-accent-gold/20 to-transparent rounded-2xl flex items-end justify-center pb-3">
                <p className="text-muted-foreground text-xs">Views chart</p>
              </div>
            </motion.div>
          </aside>
        </div>
      </div>
    </DashboardLayout>
  );
};

export default DashboardPage;
