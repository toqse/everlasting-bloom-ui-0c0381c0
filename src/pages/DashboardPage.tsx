import { motion } from "framer-motion";
import DashboardLayout from "@/components/DashboardLayout";
import { useAuthStore } from "@/stores/authStore";
import {
  Heart,
  Eye,
  Send,
  Star,
  IndianRupee,
  Lock,
  Sparkles,
  MapPin,
  ArrowRight,
  Camera,
  Settings2,
  ChevronRight,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { useNavigate } from "react-router-dom";
import GlassProfileCard from "@/components/GlassProfileCard";
import { profilesData } from "@/components/FeaturedProfiles";

const dashboardStats = [
  { icon: Eye, label: "Profile Views", value: 24, color: "text-primary" },
  { icon: Heart, label: "Interests Received", value: 8, color: "text-secondary" },
  { icon: Send, label: "Interests Sent", value: 0, color: "text-primary" },
  { icon: Star, label: "Horoscope Active", value: "—", color: "text-secondary" },
  { icon: IndianRupee, label: "Upgrade Plan", isAction: true, color: "text-secondary" },
];

const quickActionsList = [
  { label: "Add horoscope details", icon: Star, href: "/dashboard/profile" },
  { label: "Upload more photos", icon: Camera, href: "/dashboard/profile" },
  { label: "Set partner preferences", icon: Settings2, href: "/dashboard/profile" },
];

const DashboardPage = () => {
  const { user } = useAuthStore();
  const navigate = useNavigate();
  const newMatches = profilesData.slice(0, 4);
  const suggestedProfiles = profilesData.slice(0, 6);
  const nearbyProfiles = profilesData.slice(0, 3);
  const todaysPicks = profilesData.slice(2, 4);
  const profileCompletion = 75;

  return (
    <DashboardLayout>
      <div className="space-y-6 w-full">
        {/* Welcome banner */}
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-primary rounded-2xl shadow-card p-6 text-primary-foreground"
        >
          <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">
            <div>
              <h1 className="font-serif text-2xl md:text-3xl font-bold">
                Welcome back, {user?.name || "User"}
              </h1>
              <div className="flex flex-wrap items-center gap-3 mt-2 text-sm opacity-95">
                <span>Profile: {profileCompletion}% Complete</span>
                <span className="opacity-70">|</span>
                <span>AM00230916 – Kerala</span>
                <span className="px-3 py-0.5 rounded-full bg-white/20 font-medium">Hindu</span>
              </div>
            </div>
            <div className="flex gap-3">
              <div className="bg-white/15 rounded-xl px-4 py-3 text-center min-w-[120px]">
                <p className="text-2xl font-bold">0</p>
                <p className="text-xs opacity-90">Interests Sent</p>
              </div>
              <div className="bg-white/15 rounded-xl px-4 py-3 text-center min-w-[120px]">
                <p className="text-2xl font-bold">12</p>
                <p className="text-xs opacity-90">New Matches</p>
              </div>
            </div>
          </div>
        </motion.div>

        {/* 5 stat cards */}
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.05 }}
          className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-4"
        >
          {dashboardStats.map((stat, i) => (
            <div
              key={i}
              className="bg-white rounded-2xl shadow-card p-4 flex items-center gap-4 hover:shadow-elevated transition-shadow"
            >
              <div className="w-12 h-12 rounded-xl bg-accent-rose flex items-center justify-center flex-shrink-0 relative">
                <stat.icon className={`w-6 h-6 ${stat.color}`} />
                {"isAction" in stat && (
                  <Lock className="absolute -bottom-0.5 -right-0.5 w-3.5 h-3.5 text-secondary" />
                )}
              </div>
              <div className="min-w-0 flex-1">
                {"value" in stat && stat.value !== undefined && (
                  <p className="font-serif text-xl font-bold text-foreground truncate">
                    {stat.value}
                  </p>
                )}
                <p className="text-xs text-muted-foreground">{stat.label}</p>
              </div>
              {"isAction" in stat && stat.isAction && (
                <Button
                  size="sm"
                  variant="outline"
                  className="shrink-0"
                  onClick={() => navigate("/dashboard/plan")}
                >
                  Upgrade
                </Button>
              )}
            </div>
          ))}
        </motion.div>

        {/* Two columns: New Matches + Quick Actions */}
        <div className="grid lg:grid-cols-12 gap-6">
          {/* Left: New Matches */}
          <div className="lg:col-span-8 space-y-6">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.1 }}
            >
              <h2 className="font-serif text-xl font-bold text-secondary mb-4">New Matches</h2>
              <div className="grid sm:grid-cols-2 gap-4">
                {newMatches.map((profile, index) => (
                  <div key={profile.id}>
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

            {/* Nearby Matches */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.15 }}
            >
              <h2 className="font-serif text-xl font-bold text-secondary mb-3">Nearby Matches</h2>
              <p className="flex items-center gap-2 text-sm text-muted-foreground mb-4">
                <MapPin className="w-4 h-4 text-primary" />
                Based on your location – Nilambur, Kerala
              </p>
              <div className="bg-primary/10 rounded-2xl p-4 border border-primary/10">
                <div className="flex gap-4 overflow-x-auto pb-2">
                  {nearbyProfiles.map((profile) => (
                    <div
                      key={profile.id}
                      className="flex-shrink-0 w-40 text-center"
                    >
                      <div className="w-16 h-16 rounded-full bg-accent-rose/30 flex items-center justify-center mx-auto mb-2 font-bold text-primary">
                        {profile.name.split(" ").map((n) => n[0]).join("")}
                      </div>
                      <p className="font-medium text-sm truncate">{profile.name.split(" ")[0]}</p>
                      <p className="text-xs text-muted-foreground truncate">{profile.location.split(",")[0]}</p>
                      <Button
                        size="sm"
                        variant="hero"
                        className="mt-2 w-full text-xs"
                        onClick={() => {}}
                      >
                        Send Interest
                      </Button>
                    </div>
                  ))}
                </div>
              </div>
            </motion.div>

            {/* Suggested for you – full width grid */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 }}
              className="w-full"
            >
              <h2 className="font-serif text-xl font-bold text-secondary mb-4 flex items-center gap-2">
                <Sparkles className="w-5 h-5 text-secondary" />
                Suggested for you
              </h2>
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 w-full">
                {suggestedProfiles.map((profile, index) => (
                  <div key={profile.id} className="w-full">
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

          {/* Right: Quick Actions sidebar */}
          <aside className="lg:col-span-4 space-y-6">
            <motion.div
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.1 }}
              className="bg-white rounded-3xl shadow-card p-6 sticky top-8"
            >
              <h3 className="font-serif text-lg font-bold text-secondary mb-4">Quick actions</h3>
              <div className="space-y-4">
                <div>
                  <div className="flex justify-between text-sm mb-2">
                    <span className="text-muted-foreground">Complete your profile</span>
                    <span className="font-semibold text-foreground">{profileCompletion}% done</span>
                  </div>
                  <div className="h-2 bg-primary/10 rounded-full overflow-hidden">
                    <motion.div
                      className="h-full bg-primary rounded-full"
                      initial={{ width: 0 }}
                      animate={{ width: `${profileCompletion}%` }}
                      transition={{ duration: 0.8 }}
                    />
                  </div>
                  <p className="text-xs text-muted-foreground mt-2">Add Jathagam for 90%</p>
                </div>
                <div className="space-y-1">
                  {quickActionsList.map((item) => (
                    <button
                      key={item.label}
                      onClick={() => navigate(item.href)}
                      className="flex items-center gap-3 w-full px-3 py-2.5 rounded-xl text-sm font-medium text-foreground hover:bg-accent-rose/30 transition-colors"
                    >
                      <item.icon className="w-5 h-5 text-primary flex-shrink-0" />
                      <span className="flex-1 text-left">{item.label}</span>
                      <ChevronRight className="w-4 h-4 text-muted-foreground" />
                    </button>
                  ))}
                </div>
              </div>
            </motion.div>

            {/* Horoscope Matching */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.15 }}
              className="bg-accent-gold/20 rounded-3xl shadow-card p-6 border border-secondary/20"
            >
              <h3 className="font-serif text-lg font-bold text-secondary mb-2 flex items-center gap-2">
                <Star className="w-5 h-5 text-secondary" />
                Horoscope Matching
              </h3>
              <p className="text-sm text-muted-foreground mb-4">
                As a Hindu user, you get Jathagam-based Porutham scoring for all your matches.
              </p>
              <Button
                variant="hero"
                className="w-full gap-2"
                onClick={() => navigate("/dashboard/plan")}
              >
                Upgrade to Access Horoscope
                <ArrowRight className="w-4 h-4" />
              </Button>
            </motion.div>

            {/* Today's Picks */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 }}
              className="bg-white rounded-3xl shadow-card p-6"
            >
              <h3 className="font-serif text-lg font-bold text-secondary mb-4">Today&apos;s Picks</h3>
              <div className="space-y-3">
                {todaysPicks.map((profile) => (
                  <div
                    key={profile.id}
                    className="flex items-center gap-3 p-2 rounded-xl hover:bg-accent-rose/20 transition-colors"
                  >
                    <div className="w-10 h-10 rounded-full bg-accent-rose/30 flex items-center justify-center font-bold text-sm text-primary flex-shrink-0">
                      {profile.name.split(" ").map((n) => n[0]).join("")}
                    </div>
                    <div className="min-w-0 flex-1">
                      <p className="font-medium text-sm truncate">{profile.name}</p>
                      <p className="text-xs text-muted-foreground">
                        {profile.age} yrs {profile.profession}
                      </p>
                    </div>
                    <button
                      onClick={() => navigate(`/profile/${profile.id}`)}
                      className="w-9 h-9 rounded-lg bg-primary/10 flex items-center justify-center text-primary hover:bg-primary/20 transition-colors flex-shrink-0"
                    >
                      <Eye className="w-4 h-4" />
                    </button>
                  </div>
                ))}
              </div>
            </motion.div>
          </aside>
        </div>
      </div>
    </DashboardLayout>
  );
};

export default DashboardPage;
