import { useState } from "react";
import { motion } from "framer-motion";
import DashboardLayout from "@/components/DashboardLayout";
import Navbar from "@/components/Navbar";
import { useAuthStore } from "@/stores/authStore";
import { Heart, Eye, Users, MousePointer, Edit, TrendingUp, Calendar, Star, ArrowUpRight, Clock, Sparkles, Bell, Flame, MapPin, Briefcase, ArrowRight } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { profilesData } from "@/components/FeaturedProfiles";

const DashboardPage = () => {
  const { user } = useAuthStore();
  const navigate = useNavigate();

  const profileStats = [
    { icon: Heart, label: "Likes", value: 128, color: "text-primary", trend: "+12%" },
    { icon: Eye, label: "Views", value: 342, color: "text-secondary", trend: "+24%" },
    { icon: Users, label: "Interests", value: 56, color: "text-primary", trend: "+8%" },
    { icon: MousePointer, label: "Clicks", value: 89, color: "text-secondary", trend: "+15%" },
  ];

  const recentActivity = [
    { name: "Sarah liked your profile", time: "2 mins ago", icon: Heart, color: "bg-accent-pink" },
    { name: "New interest from Rahul", time: "15 mins ago", icon: Star, color: "bg-accent-gold" },
    { name: "Profile viewed by Priya", time: "1 hour ago", icon: Eye, color: "bg-accent-rose" },
    { name: "Message from Ankit", time: "3 hours ago", icon: ArrowUpRight, color: "bg-accent-pink" },
  ];

  const weeklyViews = [35, 52, 41, 67, 55, 78, 62];
  const monthlyViews = [120, 185, 210, 156, 230, 195, 278, 245, 312, 198, 267, 290];
  const months = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];
  const days = ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"];
  const maxView = Math.max(...weeklyViews);
  const [chartPeriod, setChartPeriod] = useState<string>("This week");
  const activeData = chartPeriod === "This week" ? weeklyViews : monthlyViews.slice(0, 7);
  const activeLabels = chartPeriod === "This week" ? days : months.slice(0, 7);
  const activeMax = Math.max(...activeData);

  return (
    <>
      <Navbar />
      <div className="pt-20">
        <DashboardLayout>
          <div className="space-y-6">
            {/* Header */}
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              className="flex items-center justify-between"
            >
              <div>
                <h1 className="font-serif text-2xl md:text-3xl font-bold text-secondary">Profiles status</h1>
                <p className="text-muted-foreground text-sm mt-1">Welcome back, {user?.name || "User"}!</p>
              </div>
              <motion.div
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                transition={{ type: "spring", delay: 0.3 }}
                className="flex items-center gap-2 px-4 py-2 rounded-full bg-accent-gold/50 border border-secondary/20"
              >
                <Clock className="w-4 h-4 text-secondary" />
                <span className="text-sm font-medium text-secondary-foreground">Last active: Today</span>
              </motion.div>
            </motion.div>

            <div className="grid lg:grid-cols-2 gap-6">
              {/* Profile Card */}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                whileHover={{ y: -4, boxShadow: "0 20px 60px -15px hsl(330 60% 34% / 0.2)" }}
                className="bg-card rounded-3xl shadow-card overflow-hidden"
              >
                <div className="relative group">
                  <img
                    src={user?.avatar || "https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=600&h=300&fit=crop&crop=face"}
                    alt={user?.name}
                    className="w-full h-64 object-cover transition-transform duration-700 group-hover:scale-105"
                  />
                  <motion.div
                    className="absolute inset-0 bg-gradient-to-t from-foreground/60 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300"
                  />
                  <div className="absolute bottom-0 left-0 right-0 bg-foreground/90 text-primary-foreground py-3 px-6 text-center">
                    <button
                      onClick={() => navigate("/dashboard/profile")}
                      className="font-medium tracking-wide flex items-center gap-2 justify-center w-full hover:text-secondary transition-colors"
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
                whileHover={{ y: -4 }}
                className="bg-card rounded-3xl shadow-card p-6"
              >
                <div className="flex items-center justify-between mb-6">
                  <h3 className="font-serif text-lg font-bold text-secondary">Profile completion</h3>
                  <button className="w-8 h-8 rounded-full border border-primary/10 flex items-center justify-center text-muted-foreground hover:bg-accent-rose transition-colors">
                    •••
                  </button>
                </div>

                {/* Circular Progress */}
                <div className="flex justify-center mb-8">
                  <motion.div
                    className="relative w-40 h-40"
                    initial={{ scale: 0, rotate: -90 }}
                    animate={{ scale: 1, rotate: 0 }}
                    transition={{ type: "spring", stiffness: 80, delay: 0.3 }}
                  >
                    <svg className="w-full h-full transform -rotate-90" viewBox="0 0 120 120">
                      <circle cx="60" cy="60" r="50" stroke="hsl(var(--accent-rose))" strokeWidth="8" fill="none" />
                      <motion.circle
                        cx="60" cy="60" r="50"
                        stroke="url(#progress-gradient)"
                        strokeWidth="8"
                        fill="none"
                        strokeLinecap="round"
                        initial={{ strokeDasharray: `0 ${2 * Math.PI * 50}` }}
                        animate={{ strokeDasharray: `${2 * Math.PI * 50 * 0.9} ${2 * Math.PI * 50}` }}
                        transition={{ duration: 1.5, ease: "easeOut", delay: 0.5 }}
                      />
                      <defs>
                        <linearGradient id="progress-gradient" x1="0%" y1="0%" x2="100%" y2="0%">
                          <stop offset="0%" stopColor="hsl(270, 60%, 50%)" />
                          <stop offset="100%" stopColor="hsl(330, 60%, 50%)" />
                        </linearGradient>
                      </defs>
                    </svg>
                    <div className="absolute inset-0 flex items-center justify-center">
                      <motion.span
                        className="font-serif text-4xl font-bold text-foreground"
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        transition={{ delay: 1 }}
                      >
                        90<span className="text-lg">%</span>
                      </motion.span>
                    </div>
                  </motion.div>
                </div>

                {/* Stats Grid */}
                <div className="grid grid-cols-2 gap-4">
                  {profileStats.map((stat, i) => (
                    <motion.div
                      key={i}
                      initial={{ opacity: 0, x: -10 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: 0.6 + i * 0.1 }}
                      whileHover={{ scale: 1.05 }}
                      className="flex items-center gap-3 cursor-pointer"
                    >
                      <div className="w-8 h-8 rounded-full bg-accent-rose flex items-center justify-center">
                        <stat.icon className={`w-4 h-4 ${stat.color}`} />
                      </div>
                      <span className="text-sm">
                        <span className="font-bold text-foreground">{stat.value}</span>{" "}
                        <span className="text-muted-foreground">{stat.label}</span>
                      </span>
                    </motion.div>
                  ))}
                </div>
              </motion.div>
            </div>

            {/* Stats Cards Row */}
            <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
              {profileStats.map((stat, i) => (
                <motion.div
                  key={`card-${i}`}
                  initial={{ opacity: 0, y: 30 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.2 + i * 0.1 }}
                  whileHover={{ y: -6, scale: 1.02 }}
                  className="bg-card rounded-2xl shadow-card p-5 border border-primary/5"
                >
                  <div className="flex items-center justify-between mb-3">
                    <div className={`w-10 h-10 rounded-xl bg-accent-rose flex items-center justify-center`}>
                      <stat.icon className={`w-5 h-5 ${stat.color}`} />
                    </div>
                    <span className="text-xs font-semibold px-2 py-0.5 rounded-full flex items-center gap-1 bg-accent-gold/30 text-secondary-dark">
                      <TrendingUp className="w-3 h-3" />
                      {stat.trend}
                    </span>
                  </div>
                  <h4 className="font-serif text-2xl font-bold text-foreground">{stat.value}</h4>
                  <p className="text-sm text-muted-foreground">{stat.label}</p>
                </motion.div>
              ))}
            </div>

            <div className="grid lg:grid-cols-3 gap-6">
              {/* Profile Views Chart */}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.3 }}
                className="bg-card rounded-3xl shadow-card p-6 lg:col-span-2"
              >
                <div className="flex items-center justify-between mb-6">
                  <h3 className="font-serif text-lg font-bold text-secondary">Profile views</h3>
                  <select 
                    className="border border-primary/10 rounded-xl px-4 py-2 text-sm bg-card"
                    value={chartPeriod}
                    onChange={(e) => setChartPeriod(e.target.value)}
                  >
                    <option>This week</option>
                    <option>Current month</option>
                  </select>
                </div>
                {/* Summary stats row */}
                <div className="flex gap-4 mb-4">
                  <div className="flex-1 bg-accent-rose/40 rounded-xl p-3 text-center">
                    <p className="text-xs text-muted-foreground">Total Views</p>
                    <p className="font-serif text-xl font-bold text-foreground">{activeData.reduce((a, b) => a + b, 0)}</p>
                  </div>
                  <div className="flex-1 bg-accent-gold/40 rounded-xl p-3 text-center">
                    <p className="text-xs text-muted-foreground">Avg/Day</p>
                    <p className="font-serif text-xl font-bold text-foreground">{Math.round(activeData.reduce((a, b) => a + b, 0) / activeData.length)}</p>
                  </div>
                  <div className="flex-1 bg-accent-pink/40 rounded-xl p-3 text-center">
                    <p className="text-xs text-muted-foreground">Peak</p>
                    <p className="font-serif text-xl font-bold text-foreground">{activeMax}</p>
                  </div>
                </div>
                {/* Bar Chart */}
                <div className="flex items-end justify-between gap-3 h-48 px-2">
                  {activeData.map((val, i) => (
                    <div key={i} className="flex flex-col items-center flex-1 gap-2">
                      <motion.span
                        className="text-[10px] font-bold text-secondary"
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        transition={{ delay: 1 + i * 0.1 }}
                      >
                        {val}
                      </motion.span>
                      <motion.div
                        className="w-full rounded-t-xl relative overflow-hidden"
                        style={{
                          background: `linear-gradient(180deg, hsl(330 60% 34%) 0%, hsl(40 100% 56%) 100%)`,
                        }}
                        initial={{ height: 0 }}
                        animate={{ height: `${(val / activeMax) * 100}%` }}
                        transition={{ duration: 0.8, delay: 0.5 + i * 0.1, ease: "easeOut" }}
                        whileHover={{ scaleY: 1.05, opacity: 0.9 }}
                      >
                        <motion.div 
                          className="absolute inset-0 bg-gradient-to-t from-transparent to-white/20"
                          animate={{ opacity: [0, 0.3, 0] }}
                          transition={{ duration: 2, repeat: Infinity, delay: i * 0.3 }}
                        />
                      </motion.div>
                      <span className="text-xs text-muted-foreground font-medium">{activeLabels[i]}</span>
                    </div>
                  ))}
                </div>
              </motion.div>

              {/* Recent Activity */}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.4 }}
                className="bg-card rounded-3xl shadow-card p-6"
              >
                <h3 className="font-serif text-lg font-bold text-secondary mb-4">Recent Activity</h3>
                <div className="space-y-4">
                  {recentActivity.map((activity, i) => (
                    <motion.div
                      key={i}
                      initial={{ opacity: 0, x: 20 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: 0.6 + i * 0.1 }}
                      whileHover={{ x: 4 }}
                      className="flex items-start gap-3 cursor-pointer group"
                    >
                      <div className={`w-8 h-8 rounded-full ${activity.color} flex items-center justify-center flex-shrink-0 group-hover:scale-110 transition-transform`}>
                        <activity.icon className="w-4 h-4 text-primary" />
                      </div>
                      <div>
                        <p className="text-sm font-medium text-foreground">{activity.name}</p>
                        <p className="text-xs text-muted-foreground">{activity.time}</p>
                      </div>
                    </motion.div>
                  ))}
                </div>
              </motion.div>
            </div>

            {/* New Matches Found Section */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.5 }}
              className="bg-card rounded-3xl shadow-card p-6"
            >
              <div className="flex items-center justify-between mb-6">
                <div className="flex items-center gap-3">
                  <div className="relative">
                    <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-primary to-secondary flex items-center justify-center">
                      <Sparkles className="w-5 h-5 text-primary-foreground" />
                    </div>
                    <span className="absolute -top-1 -right-1 w-4 h-4 bg-destructive text-primary-foreground text-[9px] font-bold rounded-full flex items-center justify-center animate-pulse-soft">
                      {profilesData.length}
                    </span>
                  </div>
                  <div>
                    <h3 className="font-serif text-lg font-bold text-secondary flex items-center gap-2">
                      New Matches Found <Flame className="w-4 h-4 text-secondary" />
                    </h3>
                    <p className="text-xs text-muted-foreground">Based on your preferences</p>
                  </div>
                </div>
                <button
                  onClick={() => navigate("/dashboard/matches")}
                  className="text-sm font-medium text-primary hover:text-primary-dark flex items-center gap-1 transition-colors"
                >
                  View All <ArrowRight className="w-4 h-4" />
                </button>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {profilesData.slice(0, 6).map((profile, i) => (
                  <motion.div
                    key={profile.id}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.6 + i * 0.08, type: "spring", stiffness: 100 }}
                    whileHover={{ y: -6, scale: 1.02 }}
                    className="bg-accent/30 rounded-2xl overflow-hidden cursor-pointer group border border-primary/5 hover:shadow-elevated transition-all"
                    onClick={() => navigate(`/profile/${profile.id}`)}
                  >
                    <div className="relative h-44 overflow-hidden">
                      <img src={profile.image} alt={profile.name} className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700" />
                      <div className="absolute inset-0 bg-gradient-to-t from-foreground/60 via-transparent to-transparent" />
                      {i < 2 && (
                        <span className="absolute top-2 left-2 px-2 py-0.5 bg-secondary text-secondary-foreground text-[10px] font-bold rounded-full flex items-center gap-1 animate-pulse-soft">
                          <Bell className="w-2.5 h-2.5" /> NEW
                        </span>
                      )}
                      {profile.isPremium && (
                        <span className="absolute top-2 right-2 px-2 py-0.5 bg-secondary/90 text-secondary-foreground text-[10px] font-bold rounded-full flex items-center gap-1">
                          <Star className="w-2.5 h-2.5 fill-current" /> Premium
                        </span>
                      )}
                      <div className="absolute bottom-2 right-2 px-2 py-0.5 bg-card/90 backdrop-blur-sm rounded-full shadow-soft">
                        <span className="text-xs font-bold text-gradient-primary">{profile.compatibility}%</span>
                      </div>
                    </div>
                    <div className="p-3">
                      <h4 className="font-serif text-sm font-bold text-foreground group-hover:text-primary transition-colors">{profile.name}, {profile.age}</h4>
                      <div className="flex items-center gap-1.5 text-xs text-muted-foreground mt-1">
                        <Briefcase className="w-3 h-3 text-primary/60" />
                        {profile.profession}
                      </div>
                      <div className="flex items-center gap-1.5 text-xs text-muted-foreground mt-0.5">
                        <MapPin className="w-3 h-3 text-primary/60" />
                        {profile.location}
                      </div>
                    </div>
                  </motion.div>
                ))}
              </div>
            </motion.div>
          </div>
        </DashboardLayout>
      </div>
    </>
  );
};

export default DashboardPage;
