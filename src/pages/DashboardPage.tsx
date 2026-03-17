import { useState, useEffect, useCallback } from "react";
import { motion } from "framer-motion";
import DashboardLayout from "@/components/DashboardLayout";
import { useAuthStore } from "@/stores/authStore";
import {
  Heart, Eye, Send, Star, IndianRupee, Lock, Sparkles,
  MapPin, ArrowRight, Camera, Settings2, ChevronRight,
  Users, Loader2, AlertCircle,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { useNavigate } from "react-router-dom";
import ChoosePlanModal from "@/components/ChoosePlanModal";
import ProfileViewDrawer from "@/components/ProfileViewDrawer";
import UploadPhotosModal from "@/components/UploadPhotosModal";
import PartnerPreferencesModal from "@/components/PartnerPreferencesModal";
import { toast } from "sonner";
import {
  getDashboardSummary,
  getDashboardNewMatches,
  getDashboardSuggestions,
  getDashboardTodayPicks,
  getProfileCompletion,
  type DashboardSummary,
  type DashboardProfile,
} from "@/lib/dashboardApi";
import { getProfilePreview, sendInterest, type ProfilePreviewData } from "@/lib/matchesApi";
import { BASE_URL } from "@/lib/config";

function getMediaUrl(path: string | null | undefined): string {
  if (!path) return "";
  const base = BASE_URL.replace(/\/api\/?$/, "");
  return path.startsWith("http") ? path : `${base}${path.startsWith("/") ? "" : "/"}${path}`;
}

// ---- Inline dashboard profile card (avoids old Profile type dependency) ----
interface DashboardMatchCardProps {
  profile: DashboardProfile;
  onView: () => void;
  onInterest: () => void;
  sendingInterest: boolean;
}

const DashboardMatchCard = ({ profile, onView, onInterest, sendingInterest }: DashboardMatchCardProps) => {
  const photoUrl = getMediaUrl(profile.profile_photo);
  const initials = profile.name
    .split(" ")
    .map((n) => n[0])
    .join("")
    .slice(0, 2);

  return (
    <div className="bg-card rounded-2xl shadow-card border border-primary/10 overflow-hidden hover:shadow-elevated transition-all group">
      <div className="relative h-48 overflow-hidden bg-accent-rose/20">
        {photoUrl ? (
          <img
            src={photoUrl}
            alt={profile.name}
            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
          />
        ) : (
          <div className="w-full h-full flex items-center justify-center">
            <span className="text-3xl font-bold text-primary/40">{initials}</span>
          </div>
        )}
        <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent" />
        <div className="absolute top-3 left-3 flex gap-1.5">
          {profile.is_new && (
            <span className="px-2 py-0.5 bg-green-500 text-white text-[10px] font-bold rounded-full">NEW</span>
          )}
          {profile.is_online && (
            <span className="px-2 py-0.5 bg-emerald-500 text-white text-[10px] font-bold rounded-full flex items-center gap-1">
              <span className="w-1.5 h-1.5 bg-white rounded-full animate-pulse" /> Online
            </span>
          )}
        </div>
        {(profile.match_percentage ?? 0) > 0 && (
          <div className="absolute bottom-3 right-3 px-2 py-1 bg-white/90 rounded-full">
            <span className="text-xs font-bold text-primary">{profile.match_percentage}% Match</span>
          </div>
        )}
        <div className="absolute bottom-3 left-3 text-white">
          <h3 className="font-serif text-lg font-bold leading-tight">{profile.name}</h3>
          <p className="text-xs opacity-90">
            {profile.age} yrs{profile.location ? ` · ${profile.location.split(",")[0]}` : ""}
          </p>
        </div>
      </div>
      <div className="p-3 flex gap-2">
        <Button variant="outline" size="sm" className="flex-1 gap-1" onClick={onView}>
          <Eye className="w-4 h-4" /> View
        </Button>
        <Button
          variant="hero"
          size="sm"
          className="flex-1 gap-1"
          onClick={onInterest}
          disabled={sendingInterest}
        >
          {sendingInterest ? <Loader2 className="w-4 h-4 animate-spin" /> : <Heart className="w-4 h-4" />}
          Interest
        </Button>
      </div>
    </div>
  );
};

// ---- Suggestion card (compact) ----
interface SuggestionCardProps {
  profile: DashboardProfile;
  index: number;
  onView: () => void;
  onInterest: () => void;
  sendingInterest: boolean;
  showHoroscopeBadge?: boolean;
}

const SuggestionCard = ({ profile, index, onView, onInterest, sendingInterest, showHoroscopeBadge }: SuggestionCardProps) => {
  const photoUrl = getMediaUrl(profile.profile_photo);
  const initials = profile.name.split(" ").map((n) => n[0]).join("").slice(0, 2);

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.05 * index }}
      className="bg-card rounded-2xl shadow-card border border-primary/10 overflow-hidden hover:shadow-elevated transition-all group flex flex-col"
    >
      <div className="relative h-52 overflow-hidden bg-accent-rose/20 flex-shrink-0">
        {photoUrl ? (
          <img
            src={photoUrl}
            alt={profile.name}
            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
          />
        ) : (
          <div className="w-full h-full flex items-center justify-center">
            <span className="text-3xl font-bold text-primary/40">{initials}</span>
          </div>
        )}
        <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-transparent to-transparent" />
        {(profile.match_percentage ?? 0) > 0 && (
          <div className="absolute top-3 right-3 px-2 py-1 bg-white/90 rounded-full">
            <span className="text-xs font-bold text-primary">{profile.match_percentage}% Match</span>
          </div>
        )}
        {showHoroscopeBadge && (
          <span className="absolute top-3 left-3 px-2 py-1 bg-primary/90 rounded-full text-primary-foreground text-xs font-semibold flex items-center gap-1">
            <Sparkles className="w-3 h-3" /> Horoscope
          </span>
        )}
        <div className="absolute bottom-3 left-3 right-3 text-white">
          <h3 className="font-serif text-base font-bold leading-tight truncate">{profile.name}</h3>
          <p className="text-xs opacity-90">{profile.age} yrs{profile.location ? ` · ${profile.location.split(",")[0]}` : ""}</p>
        </div>
      </div>
      <div className="p-3 flex-1 flex flex-col justify-between gap-2">
        <div className="text-xs text-muted-foreground space-y-1">
          {profile.occupation && (
            <p className="flex items-center gap-1.5 truncate">
              <Users className="w-3.5 h-3.5 text-primary flex-shrink-0" />
              {profile.occupation}
            </p>
          )}
          {profile.education && (
            <p className="flex items-center gap-1.5 truncate">
              <Star className="w-3.5 h-3.5 text-secondary flex-shrink-0" />
              {profile.education}
            </p>
          )}
        </div>
        <div className="flex gap-2 pt-1">
          <Button variant="outline" size="sm" className="flex-1 gap-1 text-xs" onClick={onView}>
            <Eye className="w-3.5 h-3.5" /> View
          </Button>
          <Button variant="hero" size="sm" className="flex-1 gap-1 text-xs" onClick={onInterest} disabled={sendingInterest}>
            {sendingInterest ? <Loader2 className="w-3.5 h-3.5 animate-spin" /> : <Heart className="w-3.5 h-3.5" />}
            Interest
          </Button>
        </div>
      </div>
    </motion.div>
  );
};

// ---- Main page ----

const DashboardPage = () => {
  const { user, isHindu, hasPaidPlan, getHoroscopeRemaining, getHoroscopeQuota } = useAuthStore();
  const showHoroscope = () => isHindu() && hasPaidPlan();
  const horoscopeRemaining = getHoroscopeRemaining();
  const horoscopeQuota = getHoroscopeQuota();
  const navigate = useNavigate();

  // Data state
  const [summary, setSummary] = useState<DashboardSummary | null>(null);
  const [newMatches, setNewMatches] = useState<DashboardProfile[]>([]);
  const [suggestions, setSuggestions] = useState<DashboardProfile[]>([]);
  const [todayPicks, setTodayPicks] = useState<DashboardProfile[]>([]);
  const [profileCompletion, setProfileCompletion] = useState(0);
  const [stepsRemaining, setStepsRemaining] = useState<string[]>([]);
  const [loading, setLoading] = useState(true);
  const [loadError, setLoadError] = useState<string | null>(null);

  // UI state
  const [planModalOpen, setPlanModalOpen] = useState(false);
  const [uploadPhotosOpen, setUploadPhotosOpen] = useState(false);
  const [preferencesOpen, setPreferencesOpen] = useState(false);

  // Profile preview drawer
  const [previewData, setPreviewData] = useState<ProfilePreviewData | null>(null);
  const [previewLoading, setPreviewLoading] = useState(false);

  // Per-card interest sending state (matri_id)
  const [sendingInterest, setSendingInterest] = useState<string | null>(null);

  const loadDashboard = useCallback(async () => {
    setLoading(true);
    setLoadError(null);
    try {
      const [summaryRes, matchesRes, suggestionsRes, todayRes, completionRes] = await Promise.all([
        getDashboardSummary(),
        getDashboardNewMatches(4),
        getDashboardSuggestions(8),
        getDashboardTodayPicks(),
        getProfileCompletion(),
      ]);
      setSummary(summaryRes.data);
      setNewMatches(Array.isArray(matchesRes.data) ? matchesRes.data : []);
      setSuggestions(Array.isArray(suggestionsRes.data) ? suggestionsRes.data : []);
      setTodayPicks(Array.isArray(todayRes.data) ? todayRes.data : []);
      setProfileCompletion(completionRes.data?.percentage ?? 0);
      setStepsRemaining(completionRes.data?.steps_remaining ?? []);
    } catch (err) {
      console.error("Dashboard load error:", err);
      setLoadError(err instanceof Error ? err.message : "Failed to load dashboard");
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    loadDashboard();
  }, [loadDashboard]);

  const handleViewProfile = async (matriId: string) => {
    setPreviewLoading(true);
    try {
      const res = await getProfilePreview(matriId);
      setPreviewData(res.data);
    } catch (err) {
      toast.error(err instanceof Error ? err.message : "Could not load profile");
    } finally {
      setPreviewLoading(false);
    }
  };

  const handleSendInterest = async (matriId: string) => {
    setSendingInterest(matriId);
    try {
      const res = await sendInterest(matriId);
      toast.success(res.message || "Interest sent!");
    } catch (err) {
      const msg = err instanceof Error ? err.message : "Failed to send interest";
      if ((err as { status?: number }).status === 403) {
        setPlanModalOpen(true);
      } else {
        toast.error(msg);
      }
    } finally {
      setSendingInterest(null);
    }
  };

  const quickActionsList = [
    ...(showHoroscope() ? [{ label: "Add horoscope details", icon: Star, action: () => navigate("/dashboard/jathagam") }] : []),
    { label: "Upload more photos", icon: Camera, action: () => setUploadPhotosOpen(true) },
    { label: "Set partner preferences", icon: Settings2, action: () => setPreferencesOpen(true) },
  ];

  const statsCards = [
    {
      icon: Eye,
      label: "Profile Views",
      value: summary?.profile_views ?? "—",
      color: "text-primary",
    },
    {
      icon: Heart,
      label: "Interests Received",
      value: summary?.interests_received ?? "—",
      color: "text-secondary",
    },
    {
      icon: Send,
      label: "Interests Sent",
      value: summary?.interests_sent ?? "—",
      color: "text-primary",
    },
    ...(showHoroscope()
      ? [{ icon: Star, label: "Horoscope Active", value: "—", color: "text-secondary", hinduOnly: true as const }]
      : []),
    { icon: IndianRupee, label: "Upgrade Plan", isAction: true as const, color: "text-secondary" },
  ];

  const displayLocation = summary?.location || user?.location || "";
  const displayMatriId = summary?.matri_id || user?.matriId || "";

  if (loading) {
    return (
      <DashboardLayout>
        <div className="flex items-center justify-center min-h-[60vh]">
          <div className="text-center space-y-3">
            <Loader2 className="w-10 h-10 animate-spin text-primary mx-auto" />
            <p className="text-muted-foreground">Loading your dashboard…</p>
          </div>
        </div>
      </DashboardLayout>
    );
  }

  if (loadError) {
    return (
      <DashboardLayout>
        <div className="flex items-center justify-center min-h-[60vh]">
          <div className="text-center space-y-3">
            <AlertCircle className="w-10 h-10 text-destructive mx-auto" />
            <p className="text-foreground font-semibold">Failed to load dashboard</p>
            <p className="text-sm text-muted-foreground">{loadError}</p>
            <Button variant="outline" onClick={loadDashboard}>Try again</Button>
          </div>
        </div>
      </DashboardLayout>
    );
  }

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
                {(displayMatriId || displayLocation) && (
                  <>
                    <span className="opacity-70">|</span>
                    <span>
                      {[displayMatriId, displayLocation].filter(Boolean).join(" – ")}
                    </span>
                  </>
                )}
              </div>
            </div>
            <div className="flex gap-3">
              <div className="bg-white/15 rounded-xl px-4 py-3 text-center min-w-[120px]">
                <p className="text-2xl font-bold">{summary?.interests_sent ?? 0}</p>
                <p className="text-xs opacity-90">Interests Sent</p>
              </div>
              <div className="bg-white/15 rounded-xl px-4 py-3 text-center min-w-[120px]">
                <p className="text-2xl font-bold">{summary?.new_matches ?? 0}</p>
                <p className="text-xs opacity-90">New Matches</p>
              </div>
            </div>
          </div>
        </motion.div>

        {/* Horoscope / contact credit widget */}
        {hasPaidPlan() && (
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.04 }}
            className="bg-card rounded-2xl shadow-card p-4 border border-primary/10 flex flex-wrap items-center justify-between gap-3"
          >
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-primary/10 flex items-center justify-center">
                <Sparkles className="w-5 h-5 text-primary" />
              </div>
              <div>
                <p className="font-semibold text-foreground">Horoscope & contact views</p>
                <p className="text-sm text-muted-foreground">
                  <span className="font-bold text-primary">{horoscopeRemaining}</span> of {horoscopeQuota} remaining this period
                </p>
              </div>
            </div>
            {horoscopeRemaining <= 2 && (
              <Button size="sm" variant="outline" onClick={() => setPlanModalOpen(true)}>
                Get more
              </Button>
            )}
          </motion.div>
        )}

        {/* Stat cards */}
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.05 }}
          className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-4"
        >
          {statsCards.map((stat, i) => (
            <div key={i} className="bg-card rounded-2xl shadow-card p-4 flex items-center gap-4 hover:shadow-elevated transition-shadow">
              <div className="w-12 h-12 rounded-xl bg-accent-rose flex items-center justify-center flex-shrink-0 relative">
                <stat.icon className={`w-6 h-6 ${stat.color}`} />
                {"isAction" in stat && stat.isAction && (
                  <Lock className="absolute -bottom-0.5 -right-0.5 w-3.5 h-3.5 text-secondary" />
                )}
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

        {/* Two-column layout */}
        <div className="grid lg:grid-cols-12 gap-6">
          {/* Left content */}
          <div className="lg:col-span-8 space-y-6">
            {/* New Matches */}
            <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }}>
              <div className="flex items-center justify-between mb-4">
                <h2 className="font-serif text-xl font-bold text-secondary">New Matches Found</h2>
                <Button variant="ghost" size="sm" onClick={() => navigate("/dashboard/matches")} className="gap-1 text-primary">
                  View All <ArrowRight className="w-4 h-4" />
                </Button>
              </div>
              {newMatches.length > 0 ? (
                <div className="grid sm:grid-cols-2 gap-4">
                  {newMatches.map((profile, index) => (
                    <motion.div
                      key={profile.matri_id}
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: 0.1 + index * 0.05 }}
                    >
                      <DashboardMatchCard
                        profile={profile}
                        onView={() => handleViewProfile(profile.matri_id)}
                        onInterest={() => handleSendInterest(profile.matri_id)}
                        sendingInterest={sendingInterest === profile.matri_id}
                      />
                    </motion.div>
                  ))}
                </div>
              ) : (
                <div className="text-center py-10 text-muted-foreground bg-card rounded-2xl border border-primary/10">
                  <Users className="w-10 h-10 mx-auto mb-2 opacity-30" />
                  <p>No new matches yet. Complete your profile to get better matches.</p>
                </div>
              )}
            </motion.div>

            {/* Nearby / Location Based */}
            {displayLocation && (
              <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.15 }}>
                <h2 className="font-serif text-xl font-bold text-secondary mb-3">Nearby Matches</h2>
                <p className="flex items-center gap-2 text-sm text-muted-foreground mb-4">
                  <MapPin className="w-4 h-4 text-primary" />
                  Based on your location – {displayLocation}
                </p>
                <div className="bg-primary/10 rounded-2xl p-4 border border-primary/10">
                  <div className="flex gap-4 overflow-x-auto pb-2">
                    {(suggestions.length > 0 ? suggestions.slice(0, 4) : newMatches.slice(0, 4)).map((profile) => {
                      const photoUrl = getMediaUrl(profile.profile_photo);
                      const initials = profile.name.split(" ").map((n) => n[0]).join("").slice(0, 2);
                      return (
                        <div key={profile.matri_id} className="flex-shrink-0 w-40 text-center">
                          {photoUrl ? (
                            <img
                              src={photoUrl}
                              alt={profile.name}
                              className="w-16 h-16 rounded-full object-cover mx-auto mb-2 border-2 border-primary/20"
                            />
                          ) : (
                            <div className="w-16 h-16 rounded-full bg-accent-rose/30 flex items-center justify-center mx-auto mb-2 font-bold text-primary">
                              {initials}
                            </div>
                          )}
                          <p className="font-medium text-sm truncate">{profile.name.split(" ")[0]}</p>
                          <p className="text-xs text-muted-foreground truncate">
                            {profile.location ? profile.location.split(",")[0] : "—"}
                          </p>
                          <Button
                            size="sm"
                            variant="hero"
                            className="mt-2 w-full text-xs"
                            onClick={() => handleViewProfile(profile.matri_id)}
                            disabled={previewLoading}
                          >
                            View Profile
                          </Button>
                        </div>
                      );
                    })}
                  </div>
                </div>
              </motion.div>
            )}

            {/* Suggested for you */}
            <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2 }} className="w-full">
              <h2 className="font-serif text-xl font-bold text-secondary mb-4 flex items-center gap-2">
                <Sparkles className="w-5 h-5 text-secondary" /> Suggested for you
              </h2>
              {suggestions.length > 0 ? (
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 w-full">
                  {suggestions.map((profile, index) => (
                    <SuggestionCard
                      key={profile.matri_id}
                      profile={profile}
                      index={index}
                      onView={() => handleViewProfile(profile.matri_id)}
                      onInterest={() => handleSendInterest(profile.matri_id)}
                      sendingInterest={sendingInterest === profile.matri_id}
                      showHoroscopeBadge={showHoroscope()}
                    />
                  ))}
                </div>
              ) : (
                <div className="text-center py-10 text-muted-foreground bg-card rounded-2xl border border-primary/10">
                  <Sparkles className="w-10 h-10 mx-auto mb-2 opacity-30" />
                  <p>No suggestions yet. Set your partner preferences to get personalized matches.</p>
                  <Button
                    variant="outline"
                    className="mt-3"
                    onClick={() => setPreferencesOpen(true)}
                  >
                    Set Preferences
                  </Button>
                </div>
              )}
            </motion.div>
          </div>

          {/* Right sidebar */}
          <aside className="lg:col-span-4 space-y-6">
            {/* Quick Actions */}
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
                    <motion.div
                      className="h-full bg-primary rounded-full"
                      initial={{ width: 0 }}
                      animate={{ width: `${profileCompletion}%` }}
                      transition={{ duration: 0.8 }}
                    />
                  </div>
                  {stepsRemaining.length > 0 && (
                    <p className="text-xs text-muted-foreground mt-2">
                      Remaining: {stepsRemaining.map((s) => s.charAt(0).toUpperCase() + s.slice(1)).join(", ")}
                    </p>
                  )}
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

            {/* Horoscope widget */}
            {showHoroscope() && (
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
              {todayPicks.length > 0 ? (
                <div className="space-y-3">
                  {todayPicks.map((profile) => {
                    const photoUrl = getMediaUrl(profile.profile_photo);
                    const initials = profile.name.split(" ").map((n) => n[0]).join("").slice(0, 2);
                    return (
                      <div
                        key={profile.matri_id}
                        className="flex items-center gap-3 p-2 rounded-xl hover:bg-accent-rose/20 transition-colors"
                      >
                        {photoUrl ? (
                          <img
                            src={photoUrl}
                            alt={profile.name}
                            className="w-10 h-10 rounded-full object-cover flex-shrink-0 border border-primary/10"
                          />
                        ) : (
                          <div className="w-10 h-10 rounded-full bg-accent-rose/30 flex items-center justify-center font-bold text-sm text-primary flex-shrink-0">
                            {initials}
                          </div>
                        )}
                        <div className="min-w-0 flex-1">
                          <p className="font-medium text-sm truncate">{profile.name}</p>
                          <p className="text-xs text-muted-foreground truncate">
                            {profile.age ? `${profile.age} yrs` : ""}
                            {profile.occupation ? ` · ${profile.occupation}` : ""}
                          </p>
                        </div>
                        <button
                          onClick={() => handleViewProfile(profile.matri_id)}
                          disabled={previewLoading}
                          className="w-9 h-9 rounded-lg bg-primary/10 flex items-center justify-center text-primary hover:bg-primary/20 transition-colors flex-shrink-0 disabled:opacity-50"
                        >
                          {previewLoading ? <Loader2 className="w-4 h-4 animate-spin" /> : <Eye className="w-4 h-4" />}
                        </button>
                      </div>
                    );
                  })}
                </div>
              ) : (
                <p className="text-sm text-muted-foreground text-center py-4">No picks available today.</p>
              )}
            </motion.div>
          </aside>
        </div>
      </div>

      {/* Modals */}
      <ChoosePlanModal open={planModalOpen} onOpenChange={setPlanModalOpen} />
      <ProfileViewDrawer
        open={!!previewData}
        onOpenChange={(o) => !o && setPreviewData(null)}
        profile={null}
        preview={previewData}
        onSendInterest={() => previewData && handleSendInterest(previewData.matri_id)}
        onOpenPlanModal={() => setPlanModalOpen(true)}
      />
      <UploadPhotosModal open={uploadPhotosOpen} onOpenChange={setUploadPhotosOpen} />
      <PartnerPreferencesModal open={preferencesOpen} onOpenChange={setPreferencesOpen} />
    </DashboardLayout>
  );
};

export default DashboardPage;
