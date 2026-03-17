import { useState, useMemo, useEffect, useCallback } from "react";
import Navbar from "@/components/Navbar";
import DashboardLayout from "@/components/DashboardLayout";
import { Button } from "@/components/ui/button";
import { MessageCircle, Send, Clock, Sparkles, Users, TrendingUp, Flame, ImageIcon, Ruler, BookOpen, Briefcase as BriefcaseIcon, ChevronDown, Heart, Eye } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import ChoosePlanModal from "@/components/ChoosePlanModal";
import ProfileViewDrawer from "@/components/ProfileViewDrawer";
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from "@/components/ui/collapsible";
import { Checkbox } from "@/components/ui/checkbox";
import { Slider } from "@/components/ui/slider";
import { Input } from "@/components/ui/input";
import {
  getMatches,
  getMatchFilters,
  getProfilePreview,
  sendInterest as sendInterestApi,
  startChat as startChatApi,
  wishlistToggle,
  type MatchProfile as ApiMatchProfile,
  type MatchFiltersResponse,
  type ProfilePreviewData,
  type SortBy,
} from "@/lib/matchesApi";
import { toast } from "sonner";

const FilterSection = ({ title, icon, children, defaultOpen = false }: { title: string; icon: React.ReactNode; children: React.ReactNode; defaultOpen?: boolean }) => (
  <Collapsible defaultOpen={defaultOpen} className="group/collapse border-b border-primary/10 last:border-0">
    <CollapsibleTrigger className="flex w-full items-center justify-between py-3 text-left font-medium text-foreground hover:text-primary transition-colors">
      <span className="flex items-center gap-2 text-sm font-semibold">
        {icon}
        {title}
      </span>
      <ChevronDown className="h-4 w-4 shrink-0 transition-transform duration-200 group-data-[state=open]/collapse:rotate-180" />
    </CollapsibleTrigger>
    <CollapsibleContent className="pb-3">{children}</CollapsibleContent>
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

const DEFAULT_LIMIT = 10;
const SORT_OPTIONS: { value: SortBy; label: string }[] = [
  { value: "most_relevant", label: "Most relative" },
  { value: "newest", label: "Newest First" },
  { value: "best_match", label: "Best Match" },
];

const MatchesPage = () => {
  const navigate = useNavigate();
  const [profiles, setProfiles] = useState<ApiMatchProfile[]>([]);
  const [totalProfiles, setTotalProfiles] = useState(0);
  const [page, setPage] = useState(1);
  const [loading, setLoading] = useState(true);
  const [filtersLoading, setFiltersLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [filters, setFilters] = useState<MatchFiltersResponse["data"] | null>(null);
  const [planModalOpen, setPlanModalOpen] = useState(false);
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
  const [wishlistedMatriIds, setWishlistedMatriIds] = useState<Set<string>>(new Set());
  const [actionLoading, setActionLoading] = useState<string | null>(null);

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

  const fetchMatches = useCallback(async (pageNum: number, append: boolean) => {
    setLoading(true);
    setError(null);
    try {
      // By default do not apply filters: only send page & limit (and sort). Add age/height only when user changed them.
      const defaultAge: [number, number] = [18, 70];
      const defaultHeight: [number, number] = [120, 200];
      const params: Parameters<typeof getMatches>[0] = {
        page: pageNum,
        limit: DEFAULT_LIMIT,
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
      setProfiles((prev) => (append ? [...prev, ...res.data.profiles] : res.data.profiles));
    } catch (e) {
      setError(e instanceof Error ? e.message : "Failed to load matches");
      if (!append) setProfiles([]);
    } finally {
      setLoading(false);
    }
  }, [ageRange, heightRange, religionId, casteId, educationId, occupationId, maritalStatusId, onlyWithPhoto, sortBy]);

  useEffect(() => {
    setPage(1);
    fetchMatches(1, false);
  }, [fetchMatches]);

  const loadMore = () => {
    const next = page + 1;
    setPage(next);
    fetchMatches(next, true);
  };

  const hasMore = profiles.length < totalProfiles;

  const handleViewDetails = useCallback(async (matriId: string) => {
    setActionLoading(matriId);
    try {
      const res = await getProfilePreview(matriId);
      setViewPreview(res.data);
    } catch (e) {
      toast.error(e instanceof Error ? e.message : "Failed to load profile");
    } finally {
      setActionLoading(null);
    }
  }, []);

  const handleSendInterest = useCallback(async (matriId: string) => {
    setActionLoading(matriId);
    try {
      await sendInterestApi(matriId);
      toast.success("Interest sent successfully.");
      setViewPreview(null);
    } catch (e) {
      const err = e as Error & { status?: number };
      const msg = err.message || "Failed to send interest";
      // If user has no active plan (403), send them to Plans & Pricing page.
      if (err.status === 403 || msg.toLowerCase().includes("plan")) {
        navigate("/dashboard/plan");
        return;
      }
      toast.error(msg);
    } finally {
      setActionLoading(null);
    }
  }, [navigate]);

  const handleChat = useCallback(async (matriId: string) => {
    setActionLoading(matriId);
    try {
      const res = await startChatApi(matriId);
      toast.success("Chat started.");
      const convoId = res.data.conversation_id;
      if (convoId) {
        const other = profiles.find((p) => p.matri_id === matriId);
        navigate(`/chat/${convoId}`, {
          state: other
            ? {
                otherUser: {
                  matri_id: other.matri_id,
                  name: other.name,
                  profile_photo: other.profile_photo,
                },
              }
            : undefined,
        });
      } else {
        navigate("/dashboard/chat-list");
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
  }, [navigate]);

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
      <Navbar />
      <div className="pt-20">
        <DashboardLayout>
          <div className="space-y-6">
            {/* Header */}
            <motion.div
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              className="flex items-center justify-between flex-wrap gap-4"
            >
              <div className="flex items-center gap-3">
                <div className="relative">
                  <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-primary to-secondary flex items-center justify-center shadow-soft">
                    <Sparkles className="w-6 h-6 text-primary-foreground" />
                  </div>
                  <span className="absolute -top-1 -right-1 w-5 h-5 bg-destructive text-primary-foreground text-[10px] font-bold rounded-full flex items-center justify-center animate-pulse-soft">
                    {totalProfiles}
                  </span>
                </div>
                <div>
                  <h1 className="font-serif text-2xl md:text-3xl font-bold text-secondary">New Matches Found</h1>
                  <p className="text-muted-foreground text-sm flex items-center gap-1">
                    <Flame className="w-3.5 h-3.5 text-secondary" />
                    {totalProfiles} compatible profiles waiting for you
                  </p>
                </div>
              </div>

              <motion.div
                initial={{ scale: 0.9, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                transition={{ delay: 0.2 }}
                className="flex items-center gap-2 px-4 py-2 rounded-full bg-accent-gold/50 border border-secondary/20"
              >
                <TrendingUp className="w-4 h-4 text-secondary" />
                <span className="text-sm font-medium text-secondary-foreground">+{Math.min(5, totalProfiles)} new today</span>
              </motion.div>
            </motion.div>

            <div className="flex flex-col lg:flex-row gap-6">
              {/* Left Sidebar - Filters from API */}
              <motion.div
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.1 }}
                className="lg:w-72 xl:w-80 flex-shrink-0"
              >
                <div className="bg-card rounded-2xl shadow-card p-4 border border-primary/5 space-y-0 sticky top-28">
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

              {/* Right - Profiles */}
              <div className="flex-1 min-w-0">
                <motion.div
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.15 }}
                  className="flex items-center justify-between mb-5 flex-wrap gap-3"
                >
                  <h2 className="font-serif text-lg font-bold text-foreground">
                    Showing <span className="text-secondary">{profiles.length}</span> profiles
                  </h2>
                  <div className="flex items-center gap-3">
                    <span className="text-sm text-muted-foreground">Sort by:</span>
                    <select
                      className="px-3 py-2 rounded-lg border border-primary/10 text-sm bg-card"
                      value={sortBy}
                      onChange={(e) => setSortBy(e.target.value as SortBy)}
                    >
                      {SORT_OPTIONS.map((o) => (
                        <option key={o.value} value={o.value}>{o.label}</option>
                      ))}
                    </select>
                  </div>
                </motion.div>

                {error && (
                  <div className="rounded-xl bg-destructive/10 text-destructive px-4 py-3 text-sm mb-4">
                    {error}
                  </div>
                )}

                {loading && profiles.length === 0 ? (
                  <div className="text-center py-12 text-muted-foreground">Loading matches…</div>
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
                        onChat={() => handleChat(profile.matri_id)}
                        onOpenPlanModal={() => setPlanModalOpen(true)}
                        actionLoading={actionLoading}
                      />
                    ))}
                  </motion.div>
                )}

                {hasMore && !loading && (
                  <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ delay: 0.5 }}
                    className="text-center mt-10"
                  >
                    <Button variant="outline" size="lg" className="group gap-2" onClick={loadMore} disabled={loading}>
                      Load More Profiles
                      <ChevronDown className="w-5 h-5 group-hover:translate-y-1 transition-transform" />
                    </Button>
                  </motion.div>
                )}
              </div>
            </div>
          </div>
        </DashboardLayout>
      </div>

      <ProfileViewDrawer
        open={!!viewPreview}
        onOpenChange={(open) => !open && setViewPreview(null)}
        profile={null}
        preview={viewPreview}
        onSendInterest={viewPreview ? () => handleSendInterest(viewPreview.matri_id) : undefined}
        onOpenPlanModal={() => setPlanModalOpen(true)}
      />
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
  onChat,
  onOpenPlanModal,
  actionLoading,
}: {
  profile: ApiMatchProfile;
  index: number;
  liked: boolean;
  onLike: () => void;
  onSendInterest: () => void;
  onViewDetails: () => void;
  onChat: () => void;
  onOpenPlanModal: () => void;
  actionLoading: string | null;
}) => {
  const isOnline = profile.is_online;
  const imgSrc = profile.profile_photo || "https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=400&h=500&fit=crop";
  const busy = actionLoading === profile.matri_id;

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: index * 0.06, type: "spring", stiffness: 100 }}
      whileHover={{ y: -4, boxShadow: "0 20px 60px -15px hsl(330 60% 34% / 0.15)" }}
      className="flex flex-col md:flex-row md:items-stretch bg-card rounded-2xl overflow-hidden shadow-card border border-primary/5 cursor-pointer group relative"
      onClick={() => onViewDetails()}
    >
      <div className="w-full md:w-56 lg:w-64 h-52 md:h-64 flex-shrink-0 relative overflow-hidden">
        <div className={`absolute top-3 left-3 z-10 w-3.5 h-3.5 rounded-full border-2 border-card ${isOnline ? "bg-green-500 animate-pulse-soft" : "bg-muted-foreground/40"}`} />
        <img src={imgSrc} alt={profile.name} className="w-full h-full object-cover object-center group-hover:scale-105 transition-transform duration-700" />
        <div className={`absolute bottom-0 left-0 right-0 py-1.5 text-center text-xs font-medium text-primary-foreground ${isOnline ? "bg-green-600/90" : "bg-muted-foreground/70"}`}>
          {isOnline ? "Available Online" : (profile.last_seen ? `Last login ${profile.last_seen}` : "Recently active")}
        </div>
        <div className="absolute top-3 right-3 px-2 py-1 bg-card/95 backdrop-blur-sm rounded-full shadow-soft">
          <span className="text-xs font-bold text-gradient-primary">{profile.match_percentage}%</span>
        </div>
      </div>

      <div className="flex-1 p-3 sm:p-5 min-w-0 flex flex-col">
        <div className="flex items-start justify-between gap-2 mb-2">
          <h3 className="font-serif text-lg sm:text-xl font-bold text-primary group-hover:text-primary-dark transition-colors truncate min-w-0">{profile.name}</h3>
          <button type="button" onClick={(e) => { e.stopPropagation(); onLike(); }} disabled={busy} className="text-muted-foreground hover:text-primary transition-all hover:scale-125 flex-shrink-0" aria-label="Favorite">
            <Heart className={`w-5 h-5 ${liked ? "fill-primary text-primary" : ""}`} />
          </button>
        </div>

        <div className="flex flex-wrap gap-1.5 mb-2">
          <span className="px-2.5 py-0.5 bg-primary text-primary-foreground text-xs font-medium rounded-md">{profile.education}</span>
          <span className="px-2.5 py-0.5 bg-primary text-primary-foreground text-xs font-medium rounded-md">{profile.occupation}</span>
          <span className="px-2.5 py-0.5 bg-secondary text-secondary-foreground text-xs font-medium rounded-md">{profile.age} Years old</span>
          <span className="px-2.5 py-0.5 bg-accent text-accent-foreground text-xs font-medium rounded-md">Height: {profile.height}cm</span>
        </div>

        <div className="flex flex-wrap gap-1.5">
          <Button size="sm" variant="hero" className="gap-1 text-xs shrink-0" disabled={!profile.can_chat || busy} onClick={(e) => { e.stopPropagation(); profile.can_chat ? onChat() : onOpenPlanModal(); }}>
            <MessageCircle className="w-3.5 h-3.5 shrink-0" /> Chat now
          </Button>
          <Button size="sm" variant="outline" className="gap-1 text-xs shrink-0" disabled={!profile.can_send_interest || busy} onClick={(e) => { e.stopPropagation(); profile.can_send_interest ? onSendInterest() : onOpenPlanModal(); }}>
            <Send className="w-3.5 h-3.5 shrink-0" /> Send interest
          </Button>
          <Button size="sm" variant="hero" className="gap-1 text-xs shrink-0" disabled={!profile.can_view_details || busy} onClick={(e) => { e.stopPropagation(); onViewDetails(); }}>
            <Eye className="w-3.5 h-3.5 shrink-0" /> View details
          </Button>
        </div>
      </div>
    </motion.div>
  );
};

export default MatchesPage;
