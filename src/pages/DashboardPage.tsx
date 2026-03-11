import { useState } from "react";
import { motion } from "framer-motion";
import DashboardLayout from "@/components/DashboardLayout";
import { useAuthStore } from "@/stores/authStore";
import { useInterestStore } from "@/stores/interestStore";
import {
  Heart, Eye, Send, Star, IndianRupee, Lock, Sparkles,
  MapPin, ArrowRight, Camera, Settings2, ChevronRight,
  Clock, Check, X,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { useNavigate } from "react-router-dom";
import GlassProfileCard from "@/components/GlassProfileCard";
import { profilesData, Profile } from "@/components/FeaturedProfiles";
import ChoosePlanModal from "@/components/ChoosePlanModal";
import ProfileViewDrawer from "@/components/ProfileViewDrawer";
import UploadPhotosModal from "@/components/UploadPhotosModal";
import PartnerPreferencesModal from "@/components/PartnerPreferencesModal";

const allDashboardStats = [
  { icon: Eye, label: "Profile Views", value: 24, color: "text-primary" },
  { icon: Heart, label: "Interests Received", value: 8, color: "text-secondary" },
  { icon: Send, label: "Interests Sent", value: 0, color: "text-primary" },
  { icon: Star, label: "Horoscope Active", value: "—", color: "text-secondary", hinduOnly: true },
  { icon: IndianRupee, label: "Upgrade Plan", isAction: true, color: "text-secondary" },
];

const statusConfig = {
  pending: { label: "Pending", icon: Clock, className: "bg-amber-100 text-amber-800 dark:bg-amber-900/30 dark:text-amber-200" },
  accepted: { label: "Accepted", icon: Check, className: "bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-200" },
  rejected: { label: "Declined", icon: X, className: "bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-200" },
};

const DashboardPage = () => {
  const { user, isHindu } = useAuthStore();
  const { sentInterests } = useInterestStore();
  const navigate = useNavigate();
  const [planModalOpen, setPlanModalOpen] = useState(false);
  const [viewProfile, setViewProfile] = useState<Profile | null>(null);
  const [uploadPhotosOpen, setUploadPhotosOpen] = useState(false);
  const [preferencesOpen, setPreferencesOpen] = useState(false);

  const dashboardStats = allDashboardStats.filter((s) => !("hinduOnly" in s && s.hinduOnly) || isHindu());
  const newMatches = profilesData.slice(0, 4);
  const suggestedProfiles = profilesData.slice(0, 4);
  const nearbyProfiles = profilesData.slice(0, 3);
  const todaysPicks = profilesData.slice(2, 4);
  const profileCompletion = 75;

  const quickActionsList = [
    ...(isHindu() ? [{ label: "Add horoscope details", icon: Star, action: () => navigate("/dashboard/profile") }] : []),
    { label: "Upload more photos", icon: Camera, action: () => setUploadPhotosOpen(true) },
    { label: "Set partner preferences", icon: Settings2, action: () => setPreferencesOpen(true) },
  ];

  return (
    <DashboardLayout>
      <div className="space-y-6 w-full">
        {/* Interests Sent panel */}
        {sentInterests.length > 0 && (
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            className="bg-card rounded-2xl shadow-card p-5 border border-primary/10"
          >
            <h2 className="font-serif text-lg font-bold text-foreground mb-4 flex items-center gap-2">
              <Send className="w-5 h-5 text-primary" />
              Interests Sent
            </h2>
            <div className="space-y-3">
              {sentInterests.map((interest) => {
                const profile = profilesData.find((p) => p.id === interest.toProfileId);
                const status = statusConfig[interest.status];
                const StatusIcon = status.icon;
                return (
                  <div
                    key={interest.id}
                    className="flex flex-wrap items-center gap-4 p-4 rounded-xl bg-muted/30 border border-primary/5 hover:border-primary/10 transition-colors"
                  >
                    <div className="min-w-0 flex-1">
                      <p className="font-semibold text-foreground">{profile?.name ?? `Profile #${interest.toProfileId}`}</p>
                      <p className="text-sm text-muted-foreground">{profile?.age ?? "—"} yrs · {profile?.location ?? "—"}</p>
                      <p className="text-xs text-muted-foreground mt-0.5">{profile?.education ?? "—"}</p>
                    </div>
                    <span className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-semibold ${status.className}`}>
                      <StatusIcon className="w-3.5 h-3.5" />
                      {status.label}
                    </span>
                  </div>
                );
              })}
            </div>
          </motion.div>
        )}

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
              </div>
            </div>
            <div className="flex gap-3">
              <div className="bg-white/15 rounded-xl px-4 py-3 text-center min-w-[120px]">
                <p className="text-2xl font-bold">{sentInterests.length}</p>
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
            <div key={i} className="bg-card rounded-2xl shadow-card p-4 flex items-center gap-4 hover:shadow-elevated transition-shadow">
              <div className="w-12 h-12 rounded-xl bg-accent-rose flex items-center justify-center flex-shrink-0 relative">
                <stat.icon className={`w-6 h-6 ${stat.color}`} />
                {"isAction" in stat && <Lock className="absolute -bottom-0.5 -right-0.5 w-3.5 h-3.5 text-secondary" />}
              </div>
              <div className="min-w-0 flex-1">
                {"value" in stat && stat.value !== undefined && (
                  <p className="font-serif text-xl font-bold text-foreground truncate">{stat.value}</p>
                )}
                <p className="text-xs text-muted-foreground">{stat.label}</p>
              </div>
              {"isAction" in stat && stat.isAction && (
                <Button size="sm" variant="outline" className="shrink-0" onClick={() => navigate("/dashboard/plan")}>
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
            <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }}>
              <div className="flex items-center justify-between mb-4">
                <h2 className="font-serif text-xl font-bold text-secondary">New Matches Found</h2>
                <Button variant="ghost" size="sm" onClick={() => navigate("/dashboard/matches")} className="gap-1 text-primary">
                  View All <ArrowRight className="w-4 h-4" />
                </Button>
              </div>
              <div className="grid sm:grid-cols-2 gap-4">
                {newMatches.map((profile, index) => (
                  <motion.div
                    key={profile.id}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.1 + index * 0.05 }}
                    className="bg-card rounded-2xl shadow-card border border-primary/10 overflow-hidden hover:shadow-elevated transition-all group"
                  >
                    <div className="relative h-48 overflow-hidden">
                      <img src={profile.image} alt={profile.name} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" />
                      <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent" />
                      <div className="absolute top-3 left-3 flex gap-1.5">
                        {profile.isPremium && (
                          <span className="px-2 py-0.5 bg-secondary text-secondary-foreground text-[10px] font-bold rounded-full flex items-center gap-1">
                            <Star className="w-3 h-3 fill-current" /> Premium
                          </span>
                        )}
                        <span className="px-2 py-0.5 bg-green-500 text-white text-[10px] font-bold rounded-full">NEW</span>
                      </div>
                      <div className="absolute bottom-3 right-3 px-2 py-1 bg-white/90 rounded-full">
                        <span className="text-xs font-bold text-primary">{profile.compatibility}% Match</span>
                      </div>
                      <div className="absolute bottom-3 left-3 text-white">
                        <h3 className="font-serif text-lg font-bold">{profile.name}</h3>
                        <p className="text-xs opacity-90">{profile.age} yrs · {profile.location.split(",")[0]}</p>
                      </div>
                    </div>
                    <div className="p-3 flex gap-2">
                      <Button
                        variant="outline"
                        size="sm"
                        className="flex-1 gap-1"
                        onClick={() => setViewProfile(profile)}
                      >
                        <Eye className="w-4 h-4" /> View
                      </Button>
                      <Button
                        variant="hero"
                        size="sm"
                        className="flex-1 gap-1"
                        onClick={() => setPlanModalOpen(true)}
                      >
                        <Heart className="w-4 h-4" /> Interest
                      </Button>
                    </div>
                  </motion.div>
                ))}
              </div>
            </motion.div>

            {/* Nearby Matches */}
            <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.15 }}>
              <h2 className="font-serif text-xl font-bold text-secondary mb-3">Nearby Matches</h2>
              <p className="flex items-center gap-2 text-sm text-muted-foreground mb-4">
                <MapPin className="w-4 h-4 text-primary" />
                Based on your location – Nilambur, Kerala
              </p>
              <div className="bg-primary/10 rounded-2xl p-4 border border-primary/10">
                <div className="flex gap-4 overflow-x-auto pb-2">
                  {nearbyProfiles.map((profile) => (
                    <div key={profile.id} className="flex-shrink-0 w-40 text-center">
                      <div className="w-16 h-16 rounded-full bg-accent-rose/30 flex items-center justify-center mx-auto mb-2 font-bold text-primary">
                        {profile.name.split(" ").map((n) => n[0]).join("")}
                      </div>
                      <p className="font-medium text-sm truncate">{profile.name.split(" ")[0]}</p>
                      <p className="text-xs text-muted-foreground truncate">{profile.location.split(",")[0]}</p>
                      <Button size="sm" variant="hero" className="mt-2 w-full text-xs" onClick={() => setViewProfile(profile)}>
                        View Profile
                      </Button>
                    </div>
                  ))}
                </div>
              </div>
            </motion.div>

            {/* Suggested for you */}
            <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2 }} className="w-full">
              <h2 className="font-serif text-xl font-bold text-secondary mb-4 flex items-center gap-2">
                <Sparkles className="w-5 h-5 text-secondary" /> Suggested for you
              </h2>
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 w-full">
                {suggestedProfiles.map((profile, index) => (
                  <div key={profile.id} className="w-full">
                    <GlassProfileCard
                      profile={profile}
                      index={index}
                      showActions={true}
                      onSendInterest={() => setPlanModalOpen(true)}
                      onViewProfile={() => setViewProfile(profile)}
                      showHoroscopeBadge={isHindu()}
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
              className="bg-card rounded-3xl shadow-card p-6"
            >
              <h3 className="font-serif text-lg font-bold text-secondary mb-4">Quick actions</h3>
              <div className="space-y-4">
                <div>
                  <div className="flex justify-between text-sm mb-2">
                    <span className="text-muted-foreground">Complete your profile</span>
                    <span className="font-semibold text-foreground">{profileCompletion}% done</span>
                  </div>
                  <div className="h-2 bg-primary/10 rounded-full overflow-hidden">
                    <motion.div className="h-full bg-primary rounded-full" initial={{ width: 0 }} animate={{ width: `${profileCompletion}%` }} transition={{ duration: 0.8 }} />
                  </div>
                  <p className="text-xs text-muted-foreground mt-2">Add Jathagam for 90%</p>
                </div>
                <div className="space-y-1">
                  {quickActionsList.map((item) => (
                    <button
                      key={item.label}
                      onClick={item.action}
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

            {isHindu() && (
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.15 }}
                className="bg-accent-gold/20 rounded-3xl shadow-card p-6 border border-secondary/20"
              >
                <h3 className="font-serif text-lg font-bold text-secondary mb-2 flex items-center gap-2">
                  <Star className="w-5 h-5 text-secondary" /> Horoscope Matching
                </h3>
                <p className="text-sm text-muted-foreground mb-4">
                  As a Hindu user, you get Jathagam-based Porutham scoring for all your matches.
                </p>
                <Button variant="hero" className="w-full gap-2" onClick={() => navigate("/dashboard/jathagam")}>
                  Set Up Horoscope <ArrowRight className="w-4 h-4" />
                </Button>
              </motion.div>
            )}

            {/* Today's Picks */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 }}
              className="bg-card rounded-3xl shadow-card p-6"
            >
              <h3 className="font-serif text-lg font-bold text-secondary mb-4">Today&apos;s Picks</h3>
              <div className="space-y-3">
                {todaysPicks.map((profile) => (
                  <div key={profile.id} className="flex items-center gap-3 p-2 rounded-xl hover:bg-accent-rose/20 transition-colors">
                    <div className="w-10 h-10 rounded-full bg-accent-rose/30 flex items-center justify-center font-bold text-sm text-primary flex-shrink-0">
                      {profile.name.split(" ").map((n) => n[0]).join("")}
                    </div>
                    <div className="min-w-0 flex-1">
                      <p className="font-medium text-sm truncate">{profile.name}</p>
                      <p className="text-xs text-muted-foreground">{profile.age} yrs {profile.profession}</p>
                    </div>
                    <button
                      onClick={() => setViewProfile(profile)}
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

      <ChoosePlanModal open={planModalOpen} onOpenChange={setPlanModalOpen} />
      <ProfileViewDrawer open={!!viewProfile} onOpenChange={(o) => !o && setViewProfile(null)} profile={viewProfile} onSendInterest={() => setPlanModalOpen(true)} />
      <UploadPhotosModal open={uploadPhotosOpen} onOpenChange={setUploadPhotosOpen} />
      <PartnerPreferencesModal open={preferencesOpen} onOpenChange={setPreferencesOpen} />
    </DashboardLayout>
  );
};

export default DashboardPage;
