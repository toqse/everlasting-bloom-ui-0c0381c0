"use client";

import { useState, useMemo, useEffect, useCallback, Suspense } from "react";
import DashboardLayout from "@/components/DashboardLayout";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import {
  Send,
  Clock,
  Sparkles,
  Users,
  TrendingUp,
  ImageIcon,
  Ruler,
  BookOpen,
  Briefcase as BriefcaseIcon,
  ChevronDown,
  ChevronLeft,
  ChevronRight,
  Heart,
  Eye,
} from "lucide-react";
import { useRouter, useSearchParams } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import ChoosePlanModal from "@/components/ChoosePlanModal";
import ProfileViewDrawer from "@/components/ProfileViewDrawer";
import { Dialog, DialogContent, DialogTitle } from "@/components/ui/dialog";
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from "@/components/ui/collapsible";
import { Checkbox } from "@/components/ui/checkbox";
import { Slider } from "@/components/ui/slider";
import { Input } from "@/components/ui/input";
import { useAuthStore } from "@/stores/authStore";
import {
  getMatches,
  getMatchFilters,
  getProfilePreview,
  getChatPermission,
  sendInterest as sendInterestApi,
  startChat as startChatApi,
  wishlistToggle,
  type MatchProfile as ApiMatchProfile,
  type MatchFiltersResponse,
  type ProfilePreviewData,
  type SortBy,
} from "@/lib/matchesApi";
import { getSentInterests } from "@/lib/interestsApi";
import { toast } from "sonner";

const FilterSection = ({ title, icon, children, defaultOpen = false }: { title: string; icon: React.ReactNode; children: React.ReactNode; defaultOpen?: boolean }) => (
  <Collapsible defaultOpen={defaultOpen} className="group/collapse border-b border-primary/[0.08] last:border-0">
    <CollapsibleTrigger className="flex w-full items-center justify-between py-3.5 text-left text-foreground transition-colors hover:bg-primary/[0.04] rounded-lg px-1 -mx-1">
      <span className="flex items-center gap-2.5 text-sm font-semibold tracking-tight">
        <span className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-secondary/15 text-primary">{icon}</span>
        {title}
      </span>
      <ChevronDown className="h-4 w-4 shrink-0 text-muted-foreground transition-transform duration-200 group-data-[state=open]/collapse:rotate-180" />
    </CollapsibleTrigger>
    <CollapsibleContent className="pb-4 pl-0.5 pt-0">{children}</CollapsibleContent>
  </Collapsible>
);

/** Single-select searchable list by id/name (API filter options) */
const SearchableIdSelect = ({
  placeholder,
  options,
  valueId,
  onSelect,
  searchQuery,
  onSearchChange,
  initialVisible = 8,
}: {
  placeholder: string;
  options: { id: number; name: string }[];
  valueId: number | null;
  onSelect: (id: number | null) => void;
  searchQuery: string;
  onSearchChange: (q: string) => void;
  initialVisible?: number;
}) => {
  const [showAll, setShowAll] = useState(false);
  const filtered = options.filter((o) => o.name.toLowerCase().includes(searchQuery.toLowerCase()));
  const displayList = showAll ? filtered : filtered.slice(0, initialVisible);
  const hasMore = !showAll && filtered.length > initialVisible;
  return (
    <div className="space-y-2">
      <Input
        placeholder={placeholder}
        value={searchQuery}
        onChange={(e) => onSearchChange(e.target.value)}
        className="h-9 text-sm rounded-lg border-primary/10"
      />
      <div className="max-h-40 overflow-y-auto space-y-1">
        <label className="flex items-center gap-2 cursor-pointer py-1.5 px-2 rounded hover:bg-accent/50 text-sm">
          <Checkbox checked={valueId === null} onCheckedChange={(c) => c && onSelect(null)} />
          <span className="text-muted-foreground">Any</span>
        </label>
        {displayList.map((item) => (
          <label
            key={item.id}
            className="flex items-center gap-2 cursor-pointer py-1.5 px-2 rounded hover:bg-accent/50 text-sm"
          >
            <Checkbox checked={valueId === item.id} onCheckedChange={() => onSelect(valueId === item.id ? null : item.id)} />
            <span className="text-muted-foreground">{item.name}</span>
          </label>
        ))}
      </div>
      {hasMore && (
        <button type="button" onClick={() => setShowAll(true)} className="text-xs text-primary font-medium hover:underline">
          More
        </button>
      )}
    </div>
  );
};

/** Caste list filtered by selected religion_id */
const CasteSelect = ({
  castes,
  religionId,
  valueId,
  onSelect,
  searchQuery,
  onSearchChange,
}: {
  castes: { id: number; name: string; religion_id: number }[];
  religionId: number | null;
  valueId: number | null;
  onSelect: (id: number | null) => void;
  searchQuery: string;
  onSearchChange: (q: string) => void;
}) => {
  const filtered = useMemo(() => {
    let list = religionId != null ? castes.filter((c) => c.religion_id === religionId) : castes;
    if (searchQuery.trim()) list = list.filter((c) => c.name.toLowerCase().includes(searchQuery.toLowerCase()));
    return list;
  }, [castes, religionId, searchQuery]);
  return (
    <div className="space-y-2">
      <Input
        placeholder="Search caste..."
        value={searchQuery}
        onChange={(e) => onSearchChange(e.target.value)}
        className="h-9 text-sm rounded-lg border-primary/10"
      />
      <div className="max-h-40 overflow-y-auto space-y-1">
        <label className="flex items-center gap-2 cursor-pointer py-1.5 px-2 rounded hover:bg-accent/50 text-sm">
          <Checkbox checked={valueId === null} onCheckedChange={(c) => c && onSelect(null)} />
          <span className="text-muted-foreground">Any</span>
        </label>
        {filtered.map((item) => (
          <label
            key={item.id}
            className="flex items-center gap-2 cursor-pointer py-1.5 px-2 rounded hover:bg-accent/50 text-sm"
          >
            <Checkbox checked={valueId === item.id} onCheckedChange={() => onSelect(valueId === item.id ? null : item.id)} />
            <span className="text-muted-foreground">{item.name}</span>
          </label>
        ))}
      </div>
    </div>
  );
};

/** Opens profile drawer when landing with ?open=matri_id (e.g. from dashboard stories). */
function MatchesOpenFromQuery({
  onPreview,
  setBusyMatriId,
}: {
  onPreview: (data: ProfilePreviewData) => void | Promise<void>;
  setBusyMatriId: (id: string | null) => void;
}) {
  const router = useRouter();
  const searchParams = useSearchParams();
  const openMatriId = searchParams?.get("open")?.trim() || null;

  useEffect(() => {
    if (!openMatriId) return;
    const id = openMatriId;
    let cancelled = false;
    (async () => {
      try {
        setBusyMatriId(id);
        const res = await getProfilePreview(id);
        if (!cancelled) {
          await Promise.resolve(onPreview(res.data));
          router.replace("/dashboard/matches", { scroll: false });
        }
      } catch (e) {
        if (!cancelled) {
          toast.error(e instanceof Error ? e.message : "Failed to load profile");
          router.replace("/dashboard/matches", { scroll: false });
        }
      } finally {
        if (!cancelled) setBusyMatriId(null);
      }
    })();
    return () => {
      cancelled = true;
    };
  }, [openMatriId, onPreview, router, setBusyMatriId]);

  return null;
}

const DEFAULT_LIMIT = 10;
const LIMIT_OPTIONS = [10, 20, 30, 50] as const;
const SORT_OPTIONS: { value: SortBy; label: string }[] = [
  { value: "most_relevant", label: "Most relative" },
  { value: "newest", label: "Newest First" },
  { value: "best_match", label: "Best Match" },
];

const MatchesPage = () => {
  const router = useRouter();
  const [profiles, setProfiles] = useState<ApiMatchProfile[]>([]);
  const [totalProfiles, setTotalProfiles] = useState(0);
  const [page, setPage] = useState(1);
  const [limit, setLimit] = useState<number>(DEFAULT_LIMIT);
  const [loading, setLoading] = useState(true);
  const [filtersLoading, setFiltersLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [filters, setFilters] = useState<MatchFiltersResponse["data"] | null>(null);
  const [planModalOpen, setPlanModalOpen] = useState(false);
  const me = useAuthStore((s) => s.user);
  const [onlyWithPhoto, setOnlyWithPhoto] = useState(false);
  const [ageRange, setAgeRange] = useState<[number, number]>([18, 70]);
  const [heightRange, setHeightRange] = useState<[number, number]>([120, 200]);
  const [maritalStatusId, setMaritalStatusId] = useState<number | null>(null);
  const [religionId, setReligionId] = useState<number | null>(null);
  const [casteId, setCasteId] = useState<number | null>(null);
  const [educationId, setEducationId] = useState<number | null>(null);
  const [occupationId, setOccupationId] = useState<number | null>(null);
  const [maritalSearch, setMaritalSearch] = useState("");
  const [religionSearch, setReligionSearch] = useState("");
  const [casteSearch, setCasteSearch] = useState("");
  const [educationSearch, setEducationSearch] = useState("");
  const [occupationSearch, setOccupationSearch] = useState("");
  const [sortBy, setSortBy] = useState<SortBy>("most_relevant");
  const [viewPreview, setViewPreview] = useState<ProfilePreviewData | null>(null);
  /** Resolved for the open drawer (matches list row or GET v1/chat/permission/ when deep-linking). */
  const [matchPreviewCanChat, setMatchPreviewCanChat] = useState(false);
  const [wishlistedMatriIds, setWishlistedMatriIds] = useState<Set<string>>(new Set());
  const [actionLoading, setActionLoading] = useState<string | null>(null);

  // Local-only Match Check modal state – uses already-fetched profiles, no API changes
  const [matchModalOpen, setMatchModalOpen] = useState(false);
  const [currentBrideIndex, setCurrentBrideIndex] = useState(0);

  const brideProfiles = useMemo(() => profiles.slice(0, 10), [profiles]);
  const newProfilesCount = useMemo(() => profiles.filter((p) => p.is_new).length, [profiles]);
  const currentBride = brideProfiles[currentBrideIndex] ?? null;
  const meGender = (me?.gender ?? "").trim().toLowerCase();
  const leftLabel = meGender === "male" ? "Groom" : meGender === "female" ? "Bride" : "Profile";
  const rightLabel = meGender === "male" ? "Bride" : meGender === "female" ? "Groom" : "Match";

  const fetchFilters = useCallback(async () => {
    setFiltersLoading(true);
    try {
      const res = await getMatchFilters();
      setFilters(res.data);
    } catch (e) {
      console.error("Failed to load match filters", e);
    } finally {
      setFiltersLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchFilters();
  }, [fetchFilters]);

  const fetchMatches = useCallback(async (pageNum: number) => {
    setLoading(true);
    setError(null);
    try {
      // By default do not apply filters: only send page & limit (and sort). Add age/height only when user changed them.
      const defaultAge: [number, number] = [18, 70];
      const defaultHeight: [number, number] = [120, 200];
      const params: Parameters<typeof getMatches>[0] = {
        page: pageNum,
        limit,
        sort_by: sortBy,
      };
      if (ageRange[0] !== defaultAge[0] || ageRange[1] !== defaultAge[1]) {
        params.age_min = ageRange[0];
        params.age_max = ageRange[1];
      }
      if (heightRange[0] !== defaultHeight[0] || heightRange[1] !== defaultHeight[1]) {
        params.height_min = heightRange[0];
        params.height_max = heightRange[1];
      }
      if (religionId != null) params.religion_id = religionId;
      if (casteId != null) params.caste_id = casteId;
      if (educationId != null) params.education_id = educationId;
      if (occupationId != null) params.occupation_id = occupationId;
      if (maritalStatusId != null) params.marital_status = maritalStatusId;
      if (onlyWithPhoto) params.profile_with_photo = true;

      const res = await getMatches(params);
      setTotalProfiles(res.data.total_profiles);
      setProfiles(res.data.profiles);
      setWishlistedMatriIds(() => {
        const next = new Set<string>();
        res.data.profiles.forEach((p) => {
          if (p.is_wishlisted) next.add(p.matri_id);
          else next.delete(p.matri_id);
        });
        return next;
      });
    } catch (e) {
      setError(e instanceof Error ? e.message : "Failed to load matches");
      setProfiles([]);
    } finally {
      setLoading(false);
    }
  }, [ageRange, heightRange, religionId, casteId, educationId, occupationId, maritalStatusId, onlyWithPhoto, sortBy, limit]);

  useEffect(() => {
    setPage(1);
    fetchMatches(1);
  }, [fetchMatches]);

  useEffect(() => {
    if (page === 1) return;
    fetchMatches(page);
  }, [page, fetchMatches]);

  const totalPages = Math.max(1, Math.ceil(totalProfiles / limit));
  const canGoPrev = page > 1;
  const canGoNext = page < totalPages;
  const pageButtons = Array.from(
    new Set([1, page - 1, page, page + 1, totalPages].filter((p) => p >= 1 && p <= totalPages)),
  );

  const openMatchModal = useCallback(
    (initialMatriId?: string) => {
      if (brideProfiles.length === 0) return;
      if (initialMatriId) {
        const idx = brideProfiles.findIndex((p) => p.matri_id === initialMatriId);
        setCurrentBrideIndex(idx >= 0 ? idx : 0);
      } else {
        setCurrentBrideIndex(0);
      }
      setMatchModalOpen(true);
    },
    [brideProfiles],
  );

  const resolveCanChat = useCallback(
    async (matriId: string) => {
      const fromList = profiles.find((p) => p.matri_id === matriId);
      if (fromList != null) return fromList.can_chat ?? false;
      try {
        const perm = await getChatPermission(matriId);
        return perm.data.can_chat;
      } catch {
        return false;
      }
    },
    [profiles],
  );

  const completeMatchPreviewOpen = useCallback(
    async (data: ProfilePreviewData) => {
      const canChat = await resolveCanChat(data.matri_id);
      setMatchPreviewCanChat(canChat);
      setViewPreview(data);
    },
    [resolveCanChat],
  );

  const handleViewDetails = useCallback(
    async (matriId: string) => {
      setActionLoading(matriId);
      try {
        const res = await getProfilePreview(matriId);
        const fromList = profiles.find((p) => p.matri_id === matriId);
        const mergedPreview: ProfilePreviewData = {
          ...res.data,
          interest_status:
            res.data.interest_status ??
            (fromList?.interest_status ? String(fromList.interest_status) : undefined),
          is_interest_sent: res.data.is_interest_sent ?? fromList?.is_interest_sent,
        };
        await completeMatchPreviewOpen(mergedPreview);
      } catch (e) {
        toast.error(e instanceof Error ? e.message : "Failed to load profile");
      } finally {
        setActionLoading(null);
      }
    },
    [completeMatchPreviewOpen, profiles],
  );

  const handleSendInterest = useCallback(async (matriId: string) => {
    setActionLoading(matriId);
    try {
      const res = await sendInterestApi(matriId);
      toast.success(res.message || "Interest sent successfully.");
      try {
        const sentRes = await getSentInterests(1, 50);
        const sentItem = sentRes.data.results.find((item) => item.matri_id === matriId);
        const nextStatus = sentItem?.status ?? "sent";

        setProfiles((prev) =>
          prev.map((p) =>
            p.matri_id === matriId
              ? {
                  ...p,
                  interest_status: nextStatus,
                  is_interest_sent: true,
                }
              : p,
          ),
        );

        setViewPreview((prev) =>
          prev?.matri_id === matriId
            ? {
                ...prev,
                interest_status: nextStatus,
                is_interest_sent: true,
              }
            : prev,
        );
      } catch {
        // Fallback if sent list refresh fails: still reflect "sent" locally.
        setProfiles((prev) =>
          prev.map((p) =>
            p.matri_id === matriId
              ? {
                  ...p,
                  interest_status: "sent",
                  is_interest_sent: true,
                }
              : p,
          ),
        );
        setViewPreview((prev) =>
          prev?.matri_id === matriId
            ? {
                ...prev,
                interest_status: "sent",
                is_interest_sent: true,
              }
            : prev,
        );
      }
    } catch (e) {
      const err = e as Error & { status?: number };
      const msg = err.message || "Failed to send interest";
      // If user has no active plan (403), send them to Plans & Pricing page.
      if (err.status === 403 || msg.toLowerCase().includes("plan")) {
        toast.error(msg);
        router.push("/dashboard/plan");
        return;
      }
      toast.error(msg);
    } finally {
      setActionLoading(null);
    }
  }, [router]);

  const handleCheckMatch = useCallback((matriId: string) => {
    router.push(`/dashboard/jathagam?profile=${encodeURIComponent(matriId)}`);
  }, [router]);

  const handleChat = useCallback(async (matriId: string) => {
    setActionLoading(matriId);
    try {
      const res = await startChatApi(matriId);
      toast.success("Chat started.");
      const convoId = res.data.conversation_id;
      if (convoId) {
        router.push(`/chat/${convoId}`);
      } else {
        router.push("/dashboard/chat-list");
      }
    } catch (e) {
      const msg = e instanceof Error ? e.message : "Failed to start chat";
      if (msg.toLowerCase().includes("plan") || msg.toLowerCase().includes("upgrade") || msg.toLowerCase().includes("expired")) {
        setPlanModalOpen(true);
      } else {
        toast.error(msg);
      }
    } finally {
      setActionLoading(null);
    }
  }, [router]);

  const goToPrevBride = () => {
    if (brideProfiles.length === 0) return;
    setCurrentBrideIndex((prev) => (prev - 1 + brideProfiles.length) % brideProfiles.length);
  };

  const goToNextBride = () => {
    if (brideProfiles.length === 0) return;
    setCurrentBrideIndex((prev) => (prev + 1) % brideProfiles.length);
  };

  const handleWishlist = useCallback(async (matriId: string) => {
    setActionLoading(matriId);
    try {
      const res = await wishlistToggle(matriId);
      setWishlistedMatriIds((prev) => {
        const next = new Set(prev);
        if (res.data.is_wishlisted) next.add(matriId);
        else next.delete(matriId);
        return next;
      });
    } catch (e) {
      toast.error(e instanceof Error ? e.message : "Failed to update wishlist");
    } finally {
      setActionLoading(null);
    }
  }, []);

  return (
    <>
      <DashboardLayout>
        {/* Single root so layout flex height reaches the list scroller (lg). */}
        <div className="flex flex-col gap-6 lg:h-full lg:min-h-0 lg:flex-1 lg:gap-6 lg:overflow-hidden">
          <Suspense fallback={null}>
            <MatchesOpenFromQuery onPreview={completeMatchPreviewOpen} setBusyMatriId={setActionLoading} />
          </Suspense>
          {/* Header — maroon + gold, stats from existing API data only */}
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            className="shrink-0 rounded-2xl border border-primary/10 bg-card/90 px-5 py-5 shadow-card backdrop-blur-sm md:px-7 md:py-6"
          >
            <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
              <div className="min-w-0 space-y-2">
                <div className="flex flex-wrap items-center gap-3">
                  <h1 className="font-serif text-2xl font-bold tracking-tight text-secondary md:text-3xl">New Matches Found</h1>
                  <span
                    className="inline-flex min-h-[1.75rem] min-w-[1.75rem] items-center justify-center rounded-full bg-primary px-2 text-sm font-bold tabular-nums text-primary-foreground shadow-soft"
                    aria-label={`${totalProfiles} matches`}
                  >
                    {totalProfiles > 99 ? "99+" : totalProfiles}
                  </span>
                </div>
                <p className="max-w-xl text-sm leading-relaxed text-muted-foreground">
                  {totalProfiles === 1
                    ? "1 compatible profile waiting for you."
                    : `${totalProfiles} compatible profiles waiting for you.`}
                </p>
              </div>
              <motion.div
                initial={{ scale: 0.95, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                transition={{ delay: 0.12 }}
                className="flex shrink-0 items-center gap-2 self-start rounded-full border border-secondary/35 bg-gradient-to-r from-accent-gold/80 to-secondary/10 px-4 py-2 shadow-sm"
              >
                <TrendingUp className="h-4 w-4 text-secondary" aria-hidden />
                <span className="text-sm font-semibold text-secondary-foreground">
                  {newProfilesCount > 0 ? `+${newProfilesCount} new today` : `${totalProfiles} total`}
                </span>
              </motion.div>
            </div>

            <div className="mt-5 flex flex-col gap-3 border-t border-primary/10 pt-5 sm:flex-row sm:items-center sm:justify-between">
              <p className="text-xs font-medium uppercase tracking-wider text-muted-foreground">Refine &amp; sort</p>
              <div className="flex flex-wrap items-center gap-3">
                <Button
                  type="button"
                  variant="outline"
                  size="sm"
                  className="gap-2 border-primary/25 bg-background/80 font-semibold text-primary shadow-sm hover:bg-primary hover:text-primary-foreground"
                  onClick={() => openMatchModal()}
                >
                  <Sparkles className="h-4 w-4 shrink-0" />
                  Check Match
                </Button>
                <div className="flex items-center gap-2">
                  <span className="text-sm text-muted-foreground">Sort by</span>
                  <div className="relative">
                    <select
                      className="h-9 min-w-[10.5rem] cursor-pointer appearance-none rounded-lg border border-primary/15 bg-background py-2 pl-3 pr-9 text-sm font-medium text-foreground shadow-sm transition-colors hover:border-primary/30 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
                      value={sortBy}
                      onChange={(e) => setSortBy(e.target.value as SortBy)}
                      aria-label="Sort matches"
                    >
                      {SORT_OPTIONS.map((o) => (
                        <option key={o.value} value={o.value}>
                          {o.label}
                        </option>
                      ))}
                    </select>
                    <ChevronDown className="pointer-events-none absolute right-2.5 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" aria-hidden />
                  </div>
                </div>
              </div>
            </div>
          </motion.div>

          {/* lg:h-0 + flex-1 = let this row shrink so the list column can scroll (flex overflow quirk) */}
          <div className="flex min-h-0 flex-col gap-6 lg:h-0 lg:min-h-0 lg:flex-1 lg:flex-row lg:items-stretch lg:gap-8 lg:overflow-hidden">
            {/* Filters — fixed column on lg (scroll inside column only if filters exceed viewport) */}
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.1 }}
              className="w-full shrink-0 lg:w-72 xl:w-80 lg:min-h-0 lg:max-h-full lg:overflow-y-auto lg:overscroll-y-contain lg:pr-1"
            >
              <div className="space-y-0 rounded-2xl border border-primary/10 bg-card/95 p-4 shadow-card backdrop-blur-sm">
                <p className="mb-3 px-1 text-xs font-semibold uppercase tracking-wider text-muted-foreground">Filters</p>
                <FilterSection title="Profile Type" icon={<ImageIcon className="w-4 h-4 text-primary" />}>
                  <label className="flex items-center gap-2 cursor-pointer py-2 text-sm text-muted-foreground hover:text-foreground">
                    <Checkbox checked={onlyWithPhoto} onCheckedChange={(c) => setOnlyWithPhoto(!!c)} />
                    Only with Photo
                  </label>
                </FilterSection>

                <FilterSection title="Age" icon={<Clock className="w-4 h-4 text-primary" />}>
                  <div className="space-y-3 pt-1">
                    <Slider
                      min={18}
                      max={70}
                      step={1}
                      value={ageRange}
                      onValueChange={(v) => setAgeRange(v as [number, number])}
                      className="py-2"
                    />
                    <p className="text-xs text-muted-foreground text-center">
                      {ageRange[0]} - {ageRange[1]} years
                    </p>
                  </div>
                </FilterSection>

                <FilterSection title="Height" icon={<Ruler className="w-4 h-4 text-primary" />}>
                  <div className="space-y-3 pt-1">
                    <Slider
                      min={120}
                      max={200}
                      step={5}
                      value={heightRange}
                      onValueChange={(v) => setHeightRange(v as [number, number])}
                      className="py-2"
                    />
                    <p className="text-xs text-muted-foreground text-center">
                      {heightRange[0]}cm - {heightRange[1]}cm
                    </p>
                  </div>
                </FilterSection>

                {filters && (
                  <>
                    <FilterSection title="Marital Status" icon={<Heart className="w-4 h-4 text-primary" />}>
                      <SearchableIdSelect
                        placeholder="Search marital status..."
                        options={filters.marital_status}
                        valueId={maritalStatusId}
                        onSelect={setMaritalStatusId}
                        searchQuery={maritalSearch}
                        onSearchChange={setMaritalSearch}
                      />
                    </FilterSection>

                    <FilterSection title="Religion" icon={<Sparkles className="w-4 h-4 text-primary" />}>
                      <SearchableIdSelect
                        placeholder="Search religion..."
                        options={filters.religions}
                        valueId={religionId}
                        onSelect={(id) => { setReligionId(id); setCasteId(null); }}
                        searchQuery={religionSearch}
                        onSearchChange={setReligionSearch}
                      />
                    </FilterSection>

                    <FilterSection title="Caste" icon={<Users className="w-4 h-4 text-primary" />}>
                      <CasteSelect
                        castes={filters.castes}
                        religionId={religionId}
                        valueId={casteId}
                        onSelect={setCasteId}
                        searchQuery={casteSearch}
                        onSearchChange={setCasteSearch}
                      />
                    </FilterSection>

                    <FilterSection title="Education" icon={<BookOpen className="w-4 h-4 text-primary" />}>
                      <SearchableIdSelect
                        placeholder="Search education..."
                        options={filters.educations}
                        valueId={educationId}
                        onSelect={setEducationId}
                        searchQuery={educationSearch}
                        onSearchChange={setEducationSearch}
                      />
                    </FilterSection>

                    <FilterSection title="Occupation" icon={<BriefcaseIcon className="w-4 h-4 text-primary" />}>
                      <SearchableIdSelect
                        placeholder="Search occupation..."
                        options={filters.occupations}
                        valueId={occupationId}
                        onSelect={setOccupationId}
                        searchQuery={occupationSearch}
                        onSearchChange={setOccupationSearch}
                      />
                    </FilterSection>
                  </>
                )}
                {filtersLoading && (
                  <p className="text-sm text-muted-foreground py-2">Loading filters…</p>
                )}
              </div>
            </motion.div>

            {/* Matches — only this area scrolls on desktop */}
            <div className="flex min-h-0 min-w-0 flex-1 flex-col overflow-hidden lg:min-h-0">
              <motion.div
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.15 }}
                className="mb-4 flex shrink-0 flex-wrap items-baseline justify-between gap-2 border-b border-primary/10 pb-4 lg:mb-5"
              >
                <h2 className="font-serif text-lg font-bold text-foreground">
                  Showing <span className="text-secondary tabular-nums">{profiles.length}</span>
                  {profiles.length === 1 ? " profile" : " profiles"}
                </h2>
                {totalProfiles > 0 && (
                  <span className="text-sm text-muted-foreground">
                    Page <span className="tabular-nums font-medium text-foreground">{page}</span> of{" "}
                    <span className="tabular-nums font-medium text-foreground">{totalPages}</span> ·{" "}
                    <span className="tabular-nums font-medium text-foreground">{totalProfiles}</span> total
                  </span>
                )}
              </motion.div>

              <div className="min-h-0 flex-1 overflow-y-auto overscroll-y-contain [scrollbar-gutter:stable] lg:h-0 lg:max-h-[calc(100dvh-22rem)] lg:flex-1 lg:pr-1">
                {error && (
                  <div className="mb-4 rounded-xl bg-destructive/10 px-4 py-3 text-sm text-destructive">
                    {error}
                  </div>
                )}

                {loading && profiles.length === 0 ? (
                  <div className="py-12 text-center text-muted-foreground">Loading matches…</div>
                ) : (
                  <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="space-y-5">
                    {profiles.map((profile, index) => (
                      <MatchListCard
                        key={profile.matri_id}
                        profile={profile}
                        index={index}
                        liked={wishlistedMatriIds.has(profile.matri_id)}
                        onLike={() => handleWishlist(profile.matri_id)}
                        onSendInterest={() => handleSendInterest(profile.matri_id)}
                        onViewDetails={() => handleViewDetails(profile.matri_id)}
                        onCheckMatch={() => openMatchModal(profile.matri_id)}
                        actionLoading={actionLoading}
                      />
                    ))}
                  </motion.div>
                )}

                {!loading && totalProfiles > 0 && (
                  <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ delay: 0.2 }}
                    className="mt-8 flex flex-wrap items-center justify-between gap-3 border-t border-primary/10 pt-4"
                  >
                    <div className="flex items-center gap-2">
                      <span className="text-xs text-muted-foreground">Rows per page</span>
                      <select
                        value={limit}
                        onChange={(e) => setLimit(Number(e.target.value))}
                        className="h-8 rounded-md border border-primary/20 bg-background px-2 text-sm"
                        aria-label="Rows per page"
                      >
                        {LIMIT_OPTIONS.map((v) => (
                          <option key={v} value={v}>
                            {v}
                          </option>
                        ))}
                      </select>
                    </div>

                    <div className="flex items-center gap-1.5">
                      <Button
                        variant="outline"
                        size="sm"
                        disabled={!canGoPrev || loading}
                        onClick={() => canGoPrev && setPage((p) => p - 1)}
                      >
                        <ChevronLeft className="h-4 w-4" />
                      </Button>

                      {pageButtons.map((p, idx) => {
                        const prev = pageButtons[idx - 1];
                        const showGap = prev != null && p - prev > 1;
                        return (
                          <div key={`page-slot-${p}-${idx}`} className="flex items-center gap-1.5">
                            {showGap ? (
                              <span className="px-1 text-xs text-muted-foreground">…</span>
                            ) : null}
                            <Button
                              variant={p === page ? "default" : "outline"}
                              size="sm"
                              className="min-w-9 px-2"
                              onClick={() => setPage(p)}
                              disabled={loading}
                            >
                              {p}
                            </Button>
                          </div>
                        );
                      })}

                      <Button
                        variant="outline"
                        size="sm"
                        disabled={!canGoNext || loading}
                        onClick={() => canGoNext && setPage((p) => p + 1)}
                      >
                        <ChevronRight className="h-4 w-4" />
                      </Button>
                    </div>
                  </motion.div>
                )}
              </div>
            </div>
          </div>
        </div>
      </DashboardLayout>

      <ProfileViewDrawer
        open={!!viewPreview}
        onOpenChange={(open) => {
          if (!open) {
            setViewPreview(null);
            setMatchPreviewCanChat(false);
          }
        }}
        profile={null}
        preview={viewPreview}
        onSendInterest={viewPreview ? () => handleSendInterest(viewPreview.matri_id) : undefined}
        canChat={matchPreviewCanChat}
        onChat={viewPreview ? () => handleChat(viewPreview.matri_id) : undefined}
        onOpenPlanModal={() => setPlanModalOpen(true)}
      />

      {/* Horoscope Match modal – groom fixed on left, browse up to 10 bride profiles on right */}
      <Dialog open={matchModalOpen} onOpenChange={setMatchModalOpen}>
        <DialogContent className="max-w-5xl p-6 sm:p-8">
          <DialogTitle className="mb-4 flex items-center gap-2">
            <Sparkles className="w-5 h-5 text-primary" />
            Visual Pair Maker
          </DialogTitle>

          {me && currentBride ? (
            <div className="space-y-5">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6 items-stretch">
                {/* Profile owner (fixed) */}
                <div className="bg-card rounded-2xl border border-primary/10 shadow-card p-4 flex flex-col items-center justify-center gap-3 min-h-[280px]">
                  <motion.div
                    className="w-32 h-32 rounded-2xl overflow-hidden bg-muted flex items-center justify-center"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ duration: 0.4, ease: "easeOut" }}
                  >
                    <img
                      src={
                        me.avatar ||
                        "https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=400&h=500&fit=crop"
                      }
                      alt={me.name}
                      className="w-full h-full object-cover"
                    />
                  </motion.div>
                  <div className="text-center space-y-1">
                    <p className="text-xs font-semibold uppercase text-muted-foreground tracking-wide">{leftLabel}</p>
                    <p className="text-sm font-semibold text-foreground truncate max-w-[160px]">
                      {me.name}
                    </p>
                    {me.matriId && <p className="text-xs text-muted-foreground">ID: {me.matriId}</p>}
                  </div>
                </div>

                {/* Match carousel */}
                <div className="bg-card rounded-2xl border border-primary/10 shadow-card p-4 relative min-h-[280px] flex flex-col justify-center">
                  {/* Arrows */}
                  <button
                    type="button"
                    onClick={goToPrevBride}
                    className="hidden md:flex absolute left-2 top-1/2 -translate-y-1/2 w-8 h-8 items-center justify-center rounded-full bg-background/80 border border-border shadow-soft hover:bg-background"
                    aria-label="Previous"
                  >
                    <ChevronLeft className="w-4 h-4" />
                  </button>
                  <button
                    type="button"
                    onClick={goToNextBride}
                    className="hidden md:flex absolute right-2 top-1/2 -translate-y-1/2 w-8 h-8 items-center justify-center rounded-full bg-background/80 border border-border shadow-soft hover:bg-background"
                    aria-label="Next"
                  >
                    <ChevronRight className="w-4 h-4" />
                  </button>

                  <div className="flex flex-col items-center gap-3 pt-2 pb-3 flex-1 justify-center">
                    <AnimatePresence mode="wait" initial={false}>
                      <motion.div
                        key={currentBride.matri_id}
                        className="flex flex-col items-center gap-3"
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        transition={{ duration: 0.3, ease: "easeInOut" }}
                      >
                        <div className="w-32 h-32 rounded-2xl overflow-hidden bg-muted flex items-center justify-center">
                          <img
                            src={
                              currentBride.profile_photo ||
                              "https://images.unsplash.com/photo-1524504388940-b1c1722653e1?w=400&h=500&fit=crop"
                            }
                            alt={currentBride.name}
                            className="w-full h-full object-cover"
                          />
                        </div>
                        <div className="text-center space-y-1">
                          <p className="text-xs font-semibold uppercase text-muted-foreground tracking-wide">{rightLabel}</p>
                          <p className="text-sm font-semibold text-foreground truncate max-w-[160px]">
                            {currentBride.name}
                          </p>
                          <p className="text-xs text-muted-foreground">ID: {currentBride.matri_id}</p>
                        </div>
                      </motion.div>
                    </AnimatePresence>

                    {/* Dots */}
                    <div className="flex flex-wrap justify-center gap-1.5 mt-1">
                      {brideProfiles.map((b, idx) => (
                        <button
                          key={b.matri_id}
                          type="button"
                          onClick={() => setCurrentBrideIndex(idx)}
                          className={
                            idx === currentBrideIndex
                              ? "w-2.5 h-2.5 rounded-full bg-primary"
                              : "w-2 h-2 rounded-full bg-muted-foreground/30 hover:bg-muted-foreground/60"
                          }
                          aria-label={`Go to bride ${idx + 1}`}
                        />
                      ))}
                    </div>
                  </div>
                </div>
              </div>
            </div>
          ) : (
            <p className="text-sm text-muted-foreground">
              Not enough profiles to run quick match comparison yet. Please try again after loading more matches.
            </p>
          )}
        </DialogContent>
      </Dialog>
      <ChoosePlanModal open={planModalOpen} onOpenChange={setPlanModalOpen} />
    </>
  );
};

const MatchListCard = ({
  profile,
  index,
  liked,
  onLike,
  onSendInterest,
  onViewDetails,
  onCheckMatch,
  actionLoading,
}: {
  profile: ApiMatchProfile;
  index: number;
  liked: boolean;
  onLike: () => void;
  onSendInterest: () => void;
  onViewDetails: () => void;
  onCheckMatch: () => void;
  actionLoading: string | null;
}) => {
  const normalizedProfile = profile as ApiMatchProfile & {
    can_interest_sent?: boolean;
    is_interest_sent?: boolean;
  };
  const isOnline = profile.is_online;
  const imgSrc = profile.profile_photo || "https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=400&h=500&fit=crop";
  const busy = actionLoading === profile.matri_id;
  const lastLoginLabel = isOnline
    ? "Online now"
    : profile.last_seen
      ? `Last login ${profile.last_seen}`
      : "Recently active";

  const canSendInterest =
    normalizedProfile.can_interest_sent ?? profile.can_send_interest ?? false;
  const interestStatus = String(normalizedProfile.interest_status ?? "")
    .trim()
    .toLowerCase();
  const isInterestSent = normalizedProfile.is_interest_sent ?? false;
  const showInterestAccepted = interestStatus === "accepted";
  const showInterestSent = interestStatus === "sent" || isInterestSent;
  const showSendInterestButton = interestStatus === "pending" && canSendInterest;

  return (
    <motion.div
      initial={{ opacity: 0, y: 16 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: index * 0.05, type: "spring", stiffness: 120, damping: 18 }}
      whileHover={{ y: -2 }}
      className={cn(
        "group relative flex flex-col overflow-hidden rounded-2xl border border-primary/10 bg-card shadow-card transition-shadow duration-300 hover:border-primary/20 hover:shadow-elevated md:flex-row md:items-stretch",
        "cursor-pointer",
      )}
      onClick={onViewDetails}
      role="button"
      tabIndex={0}
      onKeyDown={(e) => {
        if (e.key === "Enter" || e.key === " ") {
          e.preventDefault();
          onViewDetails();
        }
      }}
    >
      {/* Photo — circular match score + status bar (API: profile_photo, match_percentage, last_seen, is_online) */}
      <div className="relative h-56 w-full shrink-0 overflow-hidden bg-muted md:h-auto md:w-[min(100%,280px)] md:min-h-[260px] lg:w-[300px]">
        <img
          src={imgSrc}
          alt=""
          className="h-full w-full object-cover object-center transition-transform duration-700 group-hover:scale-[1.03]"
        />
        <div
          className={cn(
            "absolute left-3 top-3 z-10 h-3 w-3 rounded-full border-2 border-white/90 shadow-sm",
            isOnline ? "bg-emerald-500 shadow-[0_0_0_2px_rgba(16,185,129,0.35)]" : "bg-white/50",
          )}
          title={isOnline ? "Online" : "Offline"}
        />
        <div
          className="absolute right-3 top-3 z-10 flex h-[3.25rem] w-[3.25rem] flex-col items-center justify-center rounded-full border-2 border-secondary/90 bg-background/95 shadow-md backdrop-blur-[2px]"
          aria-label={`${profile.match_percentage}% match`}
        >
          <span className="text-[10px] font-semibold uppercase leading-none text-muted-foreground">Match</span>
          <span className="text-base font-bold leading-tight text-primary tabular-nums">{profile.match_percentage}%</span>
        </div>
        <div className="absolute inset-x-0 bottom-0 bg-gradient-to-t from-black/75 via-black/45 to-transparent px-3 pb-2 pt-10">
          <p className="text-center text-xs font-medium text-white/95 drop-shadow-sm">{lastLoginLabel}</p>
        </div>
        {profile.is_already_viewed === true ? (
          <div className="absolute bottom-14 left-3 z-10 rounded-md border border-white/30 bg-black/55 px-2 py-0.5 text-[10px] font-semibold uppercase tracking-wide text-white backdrop-blur-sm">
            Viewed
          </div>
        ) : null}
      </div>

      <div className="flex min-w-0 flex-1 flex-col justify-between gap-4 p-4 sm:p-5">
        <div>
          <div className="mb-3 flex items-start justify-between gap-3">
            <h3 className="min-w-0 flex-1 font-serif text-xl font-bold tracking-tight text-foreground transition-colors group-hover:text-primary md:text-2xl">
              {profile.name}
            </h3>
            <button
              type="button"
              onClick={(e) => {
                e.stopPropagation();
                onLike();
              }}
              disabled={busy}
              className="rounded-full p-1.5 text-muted-foreground transition-colors hover:bg-primary/10 hover:text-primary disabled:opacity-50"
              aria-label={liked ? "Remove from favorites" : "Add to favorites"}
              aria-pressed={liked}
            >
              <Heart className={cn("h-6 w-6", liked && "fill-secondary text-secondary")} />
            </button>
          </div>

          <div className="flex flex-wrap gap-2">
            <span className="inline-flex max-w-full items-center rounded-full bg-primary/10 px-3 py-1 text-xs font-semibold text-primary">
              <span className="truncate">{profile.education ?? "—"}</span>
            </span>
            <span className="inline-flex max-w-full items-center rounded-full bg-secondary/20 px-3 py-1 text-xs font-semibold text-secondary-foreground">
              <span className="truncate">{profile.occupation ?? "—"}</span>
            </span>
            <span className="inline-flex items-center rounded-full bg-[hsl(280_45%_94%)] px-3 py-1 text-xs font-semibold text-[hsl(280_35%_32%)]">
              {profile.age} years old
            </span>
          </div>
        </div>

        <div className="flex flex-wrap gap-2 border-t border-primary/10 pt-4">
          {showInterestAccepted ? (
            <Button
              size="sm"
              variant="outline"
              className="gap-1.5 rounded-lg border-primary/25 text-xs font-semibold"
              type="button"
              aria-disabled="true"
              onClick={(e) => {
                e.stopPropagation();
              }}
            >
              <Heart className="h-3.5 w-3.5 shrink-0 fill-secondary text-secondary" />
              Interest Accepted
            </Button>
          ) : showInterestSent ? (
            <Button
              size="sm"
              variant="outline"
              className="gap-1.5 rounded-lg border-primary/25 text-xs font-semibold"
              type="button"
              aria-disabled="true"
              onClick={(e) => {
                e.stopPropagation();
              }}
            >
              <Heart className="h-3.5 w-3.5 shrink-0 fill-secondary text-secondary" />
              Interest Sent
            </Button>
          ) : showSendInterestButton ? (
            <Button
              size="sm"
              variant="outline"
              className="gap-1.5 rounded-lg border-primary/25 text-xs font-semibold"
              disabled={busy}
              onClick={(e) => {
                e.stopPropagation();
                onSendInterest();
              }}
            >
              <Send className="h-3.5 w-3.5 shrink-0" />
              Send interest
            </Button>
          ) : null}
          <Button
            size="sm"
            variant="secondary"
            className="gap-1.5 rounded-lg text-xs font-semibold shadow-sm"
            disabled={busy}
            onClick={(e) => {
              e.stopPropagation();
              onViewDetails();
            }}
          >
            <Eye className="h-3.5 w-3.5 shrink-0" />
            View details
          </Button>
          <Button
            size="sm"
            variant="outline"
            className="gap-1.5 rounded-lg border-secondary/50 text-xs font-semibold text-secondary-foreground hover:bg-secondary/15"
            disabled={busy}
            onClick={(e) => {
              e.stopPropagation();
              onCheckMatch();
            }}
          >
            <Sparkles className="h-3.5 w-3.5 shrink-0" />
            Check Match
          </Button>
        </div>
      </div>
    </motion.div>
  );
};

export default MatchesPage;
