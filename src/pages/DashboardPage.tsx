"use client";

import { useState, useEffect, useCallback, useRef } from "react";
import { motion } from "framer-motion";
import { useAuthStore } from "@/stores/authStore";
import {
  Heart,
  Eye,
  Send,
  Crown,
  Sparkles,
  MapPin,
  ArrowRight,
  Users,
  Loader2,
  AlertCircle,
  Search,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { useRouter } from "next/navigation";
import ChoosePlanModal from "@/components/ChoosePlanModal";
import ProfileViewDrawer from "@/components/ProfileViewDrawer";
import PartnerPreferencesModal from "@/components/PartnerPreferencesModal";
import { toast } from "sonner";
import {
  getDashboardSummary,
  getDashboardNewMatches,
  getDashboardSuggestions,
  getDashboardTodayPicks,
  type DashboardSummary,
  type DashboardProfile,
} from "@/lib/dashboardApi";
import {
  getProfilePreview,
  sendInterest,
  type ProfilePreviewData,
} from "@/lib/matchesApi";
import { BASE_URL } from "@/lib/config";
import { cn } from "@/lib/utils";
import { getDisplayErrorMessage } from "@/lib/apiErrors";

/** In-session cache so returning to /dashboard does not blank the whole UI while refetching. */
type DashboardSessionCache = {
  key: string;
  summary: DashboardSummary;
  newMatches: DashboardProfile[];
  suggestions: DashboardProfile[];
  todayPicks: DashboardProfile[];
  profileCompletion: number;
};

let dashboardSessionCache: DashboardSessionCache | null = null;

function dashboardCacheAuthKey(): string | null {
  const u = useAuthStore.getState().user;
  if (!u) return null;
  const id = u.matriId?.trim();
  if (id) return id;
  const phone = u.phone?.trim();
  if (phone) return `phone:${phone}`;
  const email = u.email?.trim();
  if (email) return `email:${email}`;
  return null;
}

function readDashboardSessionCache(): DashboardSessionCache | null {
  const key = dashboardCacheAuthKey();
  const c = dashboardSessionCache;
  if (!key || !c || c.key !== key) return null;
  return c;
}

function getMediaUrl(path: string | null | undefined): string {
  if (!path) return "";
  const base = BASE_URL.replace(/\/api\/?$/, "");
  return path.startsWith("http")
    ? path
    : `${base}${path.startsWith("/") ? "" : "/"}${path}`;
}

function formatPlanDate(value: string | null | undefined): string {
  if (!value) return "";
  const d = new Date(value);
  if (Number.isNaN(d.getTime())) return value;
  return d.toLocaleDateString(undefined, {
    day: "numeric",
    month: "short",
    year: "numeric",
  });
}

function getInitials(name: string): string {
  return name
    .split(" ")
    .map((n) => n[0])
    .join("")
    .slice(0, 2);
}

function formatHeight(value: number | string | null | undefined): string {
  if (value == null || value === "") return "";
  const cm = typeof value === "number" ? value : Number(value);
  if (!Number.isFinite(cm) || cm <= 0) {
    return typeof value === "string" ? value : "";
  }
  const totalInches = cm / 2.54;
  const feet = Math.floor(totalInches / 12);
  const inches = Math.round(totalInches - feet * 12);
  return `${feet}'${inches}"`;
}

// ---- Recommended match card ----
interface RecommendedCardProps {
  profile: DashboardProfile;
  index: number;
  onView: () => void;
  loading: boolean;
}

const RecommendedCard = ({
  profile,
  index,
  onView,
  loading,
}: RecommendedCardProps) => {
  const photoUrl = getMediaUrl(profile.profile_photo);
  const initials = getInitials(profile.name);
  const heightDisplay = formatHeight(profile.height);

  const detailChips = [
    profile.age ? `${profile.age} yrs` : null,
    heightDisplay || null,
    profile.location ? profile.location.split(",")[0] : null,
  ].filter(Boolean) as string[];

  return (
    <motion.div
      initial={{ opacity: 0, y: 16 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.05 * index }}
      onClick={onView}
      role="button"
      tabIndex={0}
      aria-disabled={loading}
      onKeyDown={(e) => {
        if (e.key === "Enter" || e.key === " ") {
          e.preventDefault();
          onView();
        }
      }}
      className={cn(
        "group flex cursor-pointer flex-col overflow-hidden rounded-2xl border border-primary/10 bg-card shadow-card transition-all hover:-translate-y-0.5 hover:border-primary/25 hover:shadow-elevated focus:outline-none focus-visible:ring-2 focus-visible:ring-primary/40",
        loading && "pointer-events-none opacity-70",
      )}
    >
      <div className="relative h-44 flex-shrink-0 overflow-hidden bg-accent-rose/30">
        {photoUrl ? (
          <img
            src={photoUrl}
            alt={profile.name}
            className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-105"
          />
        ) : (
          <div className="flex h-full w-full items-center justify-center">
            <span className="text-3xl font-bold text-primary/40">
              {initials}
            </span>
          </div>
        )}
        {(profile.match_percentage ?? 0) > 0 && (
          <div className="absolute right-2.5 top-2.5 rounded-full bg-white/95 px-2.5 py-1 shadow-sm">
            <span className="text-[11px] font-bold text-primary">
              {profile.match_percentage}% Match
            </span>
          </div>
        )}
        {profile.is_online && (
          <span className="absolute left-2.5 top-2.5 inline-flex items-center gap-1 rounded-md bg-green-600/90 px-2 py-0.5 text-[10px] font-semibold uppercase tracking-wide text-white shadow-sm">
            <span className="h-1.5 w-1.5 rounded-full bg-white" />
            Online
          </span>
        )}
        {loading && (
          <div className="absolute inset-0 flex items-center justify-center bg-black/20">
            <Loader2 className="h-6 w-6 animate-spin text-white" />
          </div>
        )}
      </div>
      <div className="flex flex-1 flex-col gap-1.5 p-3">
        <h3 className="truncate font-serif text-base font-bold leading-tight text-foreground transition-colors group-hover:text-primary">
          {profile.name}
        </h3>
        {detailChips.length > 0 && (
          <p className="truncate text-xs text-muted-foreground">
            {detailChips.join(" · ")}
          </p>
        )}
        {profile.occupation && (
          <p className="truncate text-xs text-muted-foreground">
            {profile.occupation}
          </p>
        )}
        {profile.education && (
          <p className="truncate text-xs text-muted-foreground">
            {profile.education}
          </p>
        )}
      </div>
    </motion.div>
  );
};

// ---- Main page ----

const DashboardPage = () => {
  const { user, hasPaidPlan } = useAuthStore();
  const router = useRouter();

  const initialCache = readDashboardSessionCache();
  const hasDashboardDataRef = useRef(initialCache != null);

  // Data state (hydrate from session cache when revisiting /dashboard for the same account)
  const [summary, setSummary] = useState<DashboardSummary | null>(
    () => initialCache?.summary ?? null,
  );
  const [newMatches, setNewMatches] = useState<DashboardProfile[]>(
    () => initialCache?.newMatches ?? [],
  );
  const [suggestions, setSuggestions] = useState<DashboardProfile[]>(
    () => initialCache?.suggestions ?? [],
  );
  const [todayPicks, setTodayPicks] = useState<DashboardProfile[]>(
    () => initialCache?.todayPicks ?? [],
  );
  const [profileCompletion, setProfileCompletion] = useState(
    () => initialCache?.profileCompletion ?? 0,
  );
  const [loading, setLoading] = useState(() => initialCache == null);
  const [loadError, setLoadError] = useState<string | null>(null);

  // UI state
  const [planModalOpen, setPlanModalOpen] = useState(false);
  const [preferencesOpen, setPreferencesOpen] = useState(false);

  // Profile preview drawer
  const [previewData, setPreviewData] = useState<ProfilePreviewData | null>(
    null,
  );
  const [previewLoading, setPreviewLoading] = useState(false);

  // Per-card interest sending state (matri_id)
  const [sendingInterest, setSendingInterest] = useState<string | null>(null);

  const loadDashboard = useCallback(async () => {
    const warm = readDashboardSessionCache() != null;
    if (!warm) setLoading(true);
    setLoadError(null);
    try {
      const [summaryRes, matchesRes, suggestionsRes, todayRes] =
        await Promise.all([
          getDashboardSummary(),
          getDashboardNewMatches(4),
          getDashboardSuggestions(8),
          getDashboardTodayPicks(),
        ]);
      const nextSummary = summaryRes.data;
      const nextMatches = Array.isArray(matchesRes.data) ? matchesRes.data : [];
      const nextSuggestions = Array.isArray(suggestionsRes.data)
        ? suggestionsRes.data
        : [];
      const nextToday = Array.isArray(todayRes.data) ? todayRes.data : [];
      const nextCompletion = nextSummary?.profile_completion ?? 0;

      setSummary(nextSummary);
      setNewMatches(nextMatches);
      setSuggestions(nextSuggestions);
      setTodayPicks(nextToday);
      setProfileCompletion(nextCompletion);

      const authKey = dashboardCacheAuthKey();
      if (authKey) {
        dashboardSessionCache = {
          key: authKey,
          summary: nextSummary,
          newMatches: nextMatches,
          suggestions: nextSuggestions,
          todayPicks: nextToday,
          profileCompletion: nextCompletion,
        };
      }
      hasDashboardDataRef.current = true;
    } catch (err) {
      console.error("Dashboard load error:", err);
      const msg =
        getDisplayErrorMessage(err);
      if (hasDashboardDataRef.current) {
        toast.error(msg);
      } else {
        setLoadError(msg);
      }
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
      toast.error(
        getDisplayErrorMessage(err),
      );
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
      const msg =
        getDisplayErrorMessage(err);
      if ((err as { status?: number }).status === 403) {
        toast.info("Please upgrade your plan to continue.");
        router.push("/dashboard/plan");
      } else {
        toast.error(msg);
      }
    } finally {
      setSendingInterest(null);
    }
  };

  const displayLocation = summary?.location || user?.location || "";
  const firstName = (user?.name || "User").split(" ")[0];
  const paid = hasPaidPlan();
  const planActive = summary?.plan?.is_plan_active ?? paid;
  const planName =
    summary?.plan?.plan_name || (planActive ? "Premium Member" : "Free Member");
  const planValidUntil = formatPlanDate(summary?.plan?.valid_until);

  const stats = [
    {
      icon: Eye,
      label: "Profile Views",
      value: summary?.profile_views ?? 0,
      iconBg: "bg-primary/10",
      iconColor: "text-primary",
    },
    {
      icon: Heart,
      label: "Interests Received",
      value: summary?.interests_received ?? 0,
      iconBg: "bg-rose-100",
      iconColor: "text-rose-500",
    },
    {
      icon: Send,
      label: "Interests Sent",
      value: summary?.interests_sent ?? 0,
      iconBg: "bg-amber-100",
      iconColor: "text-amber-500",
    },
    {
      icon: Users,
      label: "New Matches",
      value: summary?.new_matches ?? 0,
      iconBg: "bg-violet-100",
      iconColor: "text-violet-500",
    },
  ];

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[60vh]">
        <div className="text-center space-y-3">
          <Loader2 className="w-10 h-10 animate-spin text-primary mx-auto" />
          <p className="text-muted-foreground">Loading your dashboard…</p>
        </div>
      </div>
    );
  }

  if (loadError) {
    return (
      <div className="flex items-center justify-center min-h-[60vh]">
        <div className="text-center space-y-3">
          <AlertCircle className="w-10 h-10 text-destructive mx-auto" />
          <p className="text-foreground font-semibold">
            Failed to load dashboard
          </p>
          <p className="text-sm text-muted-foreground">{loadError}</p>
          <Button variant="outline" onClick={loadDashboard}>
            Try again
          </Button>
        </div>
      </div>
    );
  }

  return (
    <>
      <div className="mx-auto w-full min-w-0 max-w-md space-y-5 sm:max-w-none sm:space-y-6">
        {/* Welcome banner */}
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          className="rounded-2xl border border-primary/10 bg-card p-5 shadow-card sm:p-6"
        >
          <div className="flex flex-col gap-5 lg:flex-row lg:items-center lg:justify-between lg:gap-8">
            <div className="min-w-0 flex-1">
              <h1 className="font-serif text-xl font-bold text-foreground sm:text-2xl">
                Welcome back, {firstName}! <span aria-hidden>👋</span>
              </h1>
              <p className="mt-1 text-sm text-muted-foreground">
                Complete your profile and increase your chances
              </p>
              <div className="mt-4 flex flex-col gap-3 sm:flex-row sm:items-center sm:gap-4">
                <div className="min-w-0 flex-1">
                  <div className="mb-1.5 flex items-center justify-between text-xs">
                    <span className="text-muted-foreground">
                      Profile Completion
                    </span>
                    <span className="font-bold text-primary">
                      {profileCompletion}%
                    </span>
                  </div>
                  <div className="h-2 w-full overflow-hidden rounded-full bg-accent-rose">
                    <motion.div
                      initial={{ width: 0 }}
                      animate={{ width: `${profileCompletion}%` }}
                      transition={{ duration: 0.8, ease: "easeOut" }}
                      className="h-full rounded-full bg-gradient-to-r from-primary to-primary-light"
                    />
                  </div>
                </div>
                <Button
                  variant="hero"
                  className="shrink-0"
                  onClick={() => router.push("/dashboard/profile")}
                >
                  Complete Profile
                </Button>
              </div>
            </div>

            <div className="flex shrink-0 flex-col items-stretch gap-1.5 sm:items-end">
              {planActive ? (
                <div className="flex items-center gap-2 rounded-xl bg-gradient-to-r from-secondary/20 to-secondary/10 px-3.5 py-2 shadow-soft">
                  <Crown className="h-4 w-4 shrink-0 text-secondary-dark" />
                  <span className="truncate text-sm font-semibold text-secondary-dark">
                    {planName}
                  </span>
                </div>
              ) : (
                <button
                  type="button"
                  onClick={() => router.push("/dashboard/plan")}
                  className="flex items-center gap-2 rounded-xl bg-accent-rose/60 px-3.5 py-2 transition-colors hover:bg-accent-rose"
                >
                  <Crown className="h-4 w-4 shrink-0 text-primary" />
                  <span className="truncate text-sm font-semibold text-primary">
                    {planName}
                  </span>
                </button>
              )}
              {planActive && planValidUntil && (
                <p className="text-[11px] text-muted-foreground sm:text-right">
                  Valid until {planValidUntil}
                </p>
              )}
              {displayLocation && (
                <p className="flex items-center gap-1 text-[11px] text-muted-foreground sm:justify-end">
                  <MapPin className="h-3 w-3" />
                  {displayLocation}
                </p>
              )}
            </div>
          </div>
        </motion.div>

        {/* Stat cards */}
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.05 }}
          className="grid grid-cols-2 gap-3 md:grid-cols-3 lg:grid-cols-5"
        >
          {stats.map((stat, i) => (
            <div
              key={i}
              className="flex min-w-0 items-center gap-3 rounded-2xl border border-primary/5 bg-card p-4 shadow-card transition-shadow hover:shadow-elevated"
            >
              <div
                className={cn(
                  "flex h-12 w-12 shrink-0 items-center justify-center rounded-xl",
                  stat.iconBg,
                )}
              >
                <stat.icon className={cn("h-6 w-6", stat.iconColor)} />
              </div>
              <div className="min-w-0">
                <p className="font-serif text-2xl font-bold leading-none text-foreground">
                  {stat.value}
                </p>
                <p className="mt-1 truncate text-xs text-muted-foreground">
                  {stat.label}
                </p>
              </div>
            </div>
          ))}

          {/* Premium / Upgrade card */}
          <div className="flex min-w-0 items-center gap-3 rounded-2xl border border-secondary/20 bg-gradient-to-br from-accent-gold/40 to-card p-4 shadow-card">
            <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl bg-gradient-to-br from-secondary to-secondary-light">
              <Crown className="h-6 w-6 text-white" />
            </div>
            <div className="min-w-0">
              <p className="truncate font-serif text-sm font-bold text-foreground">
                {paid ? "Premium Member" : "Upgrade Plan"}
              </p>
              <button
                type="button"
                onClick={() => router.push("/dashboard/plan")}
                className="text-xs font-semibold text-primary hover:underline"
              >
                {paid ? "View Benefits" : "View Plans"}
              </button>
            </div>
          </div>
        </motion.div>

        {/* Two-column layout */}
        <div className="grid min-w-0 gap-5 sm:gap-6 xl:grid-cols-12">
          {/* Left content */}
          <div className="min-w-0 space-y-5 sm:space-y-6 xl:col-span-8">
            {/* Recommended Matches */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.1 }}
              className="rounded-2xl border border-primary/10 bg-card p-4 shadow-card sm:p-6"
            >
              <div className="mb-4 flex flex-col gap-2 sm:flex-row sm:items-start sm:justify-between">
                <div className="min-w-0">
                  <div className="flex items-center gap-2">
                    <h2 className="font-serif text-lg font-bold text-foreground sm:text-xl">
                      Recommended Matches
                    </h2>
                    {newMatches.length > 0 && (
                      <span className="rounded-full bg-rose-100 px-2 py-0.5 text-[11px] font-semibold text-rose-600">
                        {newMatches.length} New
                      </span>
                    )}
                  </div>
                  <p className="mt-0.5 text-sm text-muted-foreground">
                    Matches based on your preferences and activity
                  </p>
                </div>
                <button
                  type="button"
                  onClick={() => router.push("/dashboard/matches")}
                  className="flex shrink-0 items-center gap-1 text-sm font-semibold text-primary hover:underline"
                >
                  View all <ArrowRight className="h-4 w-4" />
                </button>
              </div>

              {newMatches.length > 0 ? (
                <div className="grid grid-cols-2 gap-3 sm:gap-4 lg:grid-cols-4">
                  {newMatches.map((profile, i) => (
                    <RecommendedCard
                      key={profile.matri_id}
                      profile={profile}
                      index={i}
                      loading={previewLoading}
                      onView={() => handleViewProfile(profile.matri_id)}
                    />
                  ))}
                </div>
              ) : (
                <div className="rounded-2xl border border-dashed border-primary/15 bg-accent-rose/10 py-12 text-center">
                  <Sparkles className="mx-auto mb-3 h-12 w-12 text-primary/30" />
                  <p className="font-medium text-foreground">
                    No recommended matches yet
                  </p>
                  <p className="mx-auto mt-1 max-w-sm text-sm text-muted-foreground">
                    Complete your profile and set preferences — we&apos;ll
                    surface fresh connections here.
                  </p>
                </div>
              )}
            </motion.div>

            {/* Nearby Matches */}
            {displayLocation && (
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.15 }}
                className="rounded-2xl border border-primary/10 bg-card p-4 shadow-card sm:p-6"
              >
                <div className="mb-4 flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
                  <div className="flex items-center gap-2">
                    <MapPin className="h-5 w-5 text-primary" />
                    <h2 className="font-serif text-lg font-bold text-foreground sm:text-xl">
                      Nearby Matches
                    </h2>
                    <span className="text-xs text-muted-foreground">
                      Near {displayLocation.split(",")[0]}
                    </span>
                  </div>
                  <button
                    type="button"
                    onClick={() => router.push("/dashboard/matches")}
                    className="flex shrink-0 items-center gap-1 text-sm font-semibold text-primary hover:underline"
                  >
                    <Search className="h-4 w-4" /> Expand search
                  </button>
                </div>

                {suggestions.length > 0 ? (
                  <div className="flex min-w-0 max-w-full gap-4 overflow-x-auto pb-2 [scrollbar-width:thin]">
                    {suggestions.slice(0, 8).map((profile) => {
                      const photoUrl = getMediaUrl(profile.profile_photo);
                      const initials = getInitials(profile.name);
                      return (
                        <button
                          key={profile.matri_id}
                          type="button"
                          onClick={() => handleViewProfile(profile.matri_id)}
                          disabled={previewLoading}
                          className="flex w-[72px] shrink-0 flex-col items-center gap-1.5 text-center transition-transform active:scale-95 disabled:opacity-60"
                        >
                          <div className="relative">
                            <div className="h-16 w-16 overflow-hidden rounded-full border-2 border-primary/15 bg-accent-rose/30">
                              {photoUrl ? (
                                <img
                                  src={photoUrl}
                                  alt={profile.name}
                                  className="h-full w-full object-cover"
                                />
                              ) : (
                                <div className="flex h-full w-full items-center justify-center font-bold text-primary">
                                  {initials}
                                </div>
                              )}
                            </div>
                            {(profile.match_percentage ?? 0) > 0 && (
                              <span className="absolute -bottom-1 left-1/2 -translate-x-1/2 rounded-full bg-primary px-1.5 py-0.5 text-[9px] font-bold text-primary-foreground shadow-sm">
                                {profile.match_percentage}%
                              </span>
                            )}
                          </div>
                          <p className="mt-1 w-full truncate text-xs font-semibold text-foreground">
                            {profile.name.split(" ")[0]}
                          </p>
                          {profile.age ? (
                            <p className="text-[11px] text-muted-foreground">
                              {profile.age} yrs
                            </p>
                          ) : null}
                        </button>
                      );
                    })}
                  </div>
                ) : (
                  <p className="py-4 text-center text-sm text-muted-foreground">
                    No nearby matches available right now.
                  </p>
                )}
              </motion.div>
            )}
          </div>

          {/* Right sidebar */}
          <aside className="min-w-0 space-y-5 sm:space-y-6 xl:col-span-4">
            {/* Today's Picks */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.15 }}
              className="rounded-2xl border border-primary/10 bg-card p-4 shadow-card sm:p-6"
            >
              <div className="mb-4">
                <h3 className="font-serif text-base font-bold text-foreground sm:text-lg">
                  Today&apos;s Picks
                </h3>
                <p className="flex items-center gap-1 text-xs text-muted-foreground">
                  <Sparkles className="h-3.5 w-3.5 text-secondary-dark" />
                  handpicked for you
                </p>
              </div>
              {todayPicks.length > 0 ? (
                <div className="space-y-2">
                  {todayPicks.map((profile) => {
                    const photoUrl = getMediaUrl(profile.profile_photo);
                    const initials = getInitials(profile.name);
                    return (
                      <div
                        key={profile.matri_id}
                        className="flex items-center gap-3 rounded-xl p-2 transition-colors hover:bg-accent-rose/20"
                      >
                        {photoUrl ? (
                          <img
                            src={photoUrl}
                            alt={profile.name}
                            className="h-11 w-11 flex-shrink-0 rounded-full border border-primary/10 object-cover"
                          />
                        ) : (
                          <div className="flex h-11 w-11 flex-shrink-0 items-center justify-center rounded-full bg-accent-rose/30 text-sm font-bold text-primary">
                            {initials}
                          </div>
                        )}
                        <div className="min-w-0 flex-1">
                          <p className="truncate text-sm font-semibold text-foreground">
                            {profile.name.split(" ")[0]}
                          </p>
                          <p className="truncate text-xs text-muted-foreground">
                            {profile.age ? `${profile.age} yrs` : ""}
                            {profile.location
                              ? ` · ${profile.location.split(",")[0]}`
                              : ""}
                          </p>
                          {(profile.match_percentage ?? 0) > 0 && (
                            <p className="text-[11px] font-semibold text-primary">
                              {profile.match_percentage}% Match
                            </p>
                          )}
                        </div>
                        <button
                          type="button"
                          onClick={() => handleViewProfile(profile.matri_id)}
                          disabled={previewLoading}
                          aria-label="View profile"
                          className="flex h-9 w-9 flex-shrink-0 items-center justify-center rounded-lg bg-primary/10 text-primary transition-colors hover:bg-primary/20 disabled:opacity-50"
                        >
                          {previewLoading ? (
                            <Loader2 className="h-4 w-4 animate-spin" />
                          ) : (
                            <Eye className="h-4 w-4" />
                          )}
                        </button>
                      </div>
                    );
                  })}
                  <button
                    type="button"
                    onClick={() => router.push("/dashboard/matches")}
                    className="mt-2 flex w-full items-center justify-center gap-1 text-sm font-semibold text-primary hover:underline"
                  >
                    View all picks <ArrowRight className="h-4 w-4" />
                  </button>
                </div>
              ) : (
                <p className="py-4 text-center text-sm text-muted-foreground">
                  No picks available today.
                </p>
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
        onSendInterest={() =>
          previewData && handleSendInterest(previewData.matri_id)
        }
        onOpenPlanModal={() => setPlanModalOpen(true)}
      />
      <PartnerPreferencesModal
        open={preferencesOpen}
        onOpenChange={setPreferencesOpen}
      />
    </>
  );
};

export default DashboardPage;
