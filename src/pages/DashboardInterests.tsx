"use client";

import { useCallback, useEffect, useMemo, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuRadioGroup,
  DropdownMenuRadioItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  Inbox,
  Hourglass,
  Send,
  Clock,
  SlidersHorizontal,
  MapPin,
  CalendarDays,
  GraduationCap,
  Briefcase,
  Check,
  X,
  ChevronDown,
  Heart,
} from "lucide-react";
import { toast } from "sonner";
import { useRouter } from "next/navigation";
import {
  fetchAllInterestPages,
  getMyInterests,
  respondInterest,
  cancelInterest,
  sendInterest,
  type InterestCard,
} from "@/lib/interestsApi";
import {
  getProfilePreview,
  getChatPermission,
  startChat,
  type ProfilePreviewData,
} from "@/lib/matchesApi";
import ProfileViewDrawer from "@/components/ProfileViewDrawer";
import ChoosePlanModal from "@/components/ChoosePlanModal";
import { getDisplayErrorMessage } from "@/lib/apiErrors";
import { formatDateTimeDdMmYyyy } from "@/lib/utils";

type Tab = "received" | "sent";
type SortOrder = "newest" | "oldest";
type StatusFilter = "all" | InterestCard["status"];

const STATUS_CONFIG: Record<
  InterestCard["status"],
  { label: string; className: string }
> = {
  pending: {
    label: "Pending",
    className: "bg-amber-100 text-amber-700 border-amber-200",
  },
  accepted: {
    label: "Accepted",
    className: "bg-emerald-100 text-emerald-700 border-emerald-200",
  },
  rejected: {
    label: "Declined",
    className: "bg-rose-100 text-rose-700 border-rose-200",
  },
  cancelled: {
    label: "Cancelled",
    className: "bg-slate-100 text-slate-600 border-slate-200",
  },
};

const FILTER_OPTIONS: { value: StatusFilter; label: string }[] = [
  { value: "all", label: "All statuses" },
  { value: "pending", label: "Pending" },
  { value: "accepted", label: "Accepted" },
  { value: "rejected", label: "Declined" },
  { value: "cancelled", label: "Cancelled" },
];

const DEFAULT_PHOTO =
  "https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=200&h=260&fit=crop&crop=face";

const DashboardInterests = () => {
  const [activeTab, setActiveTab] = useState<Tab>("received");
  const router = useRouter();
  const [receivedInterests, setReceivedInterests] = useState<InterestCard[]>(
    [],
  );
  const [sentInterests, setSentInterests] = useState<InterestCard[]>([]);
  const [receivedTotal, setReceivedTotal] = useState(0);
  const [sentTotal, setSentTotal] = useState(0);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [busyId, setBusyId] = useState<number | null>(null);
  const [viewPreview, setViewPreview] = useState<ProfilePreviewData | null>(
    null,
  );
  const [previewBusyMatriId, setPreviewBusyMatriId] = useState<string | null>(
    null,
  );
  const [previewCanChat, setPreviewCanChat] = useState(false);
  const [planModalOpen, setPlanModalOpen] = useState(false);
  const [sortOrder, setSortOrder] = useState<SortOrder>("newest");
  const [statusFilter, setStatusFilter] = useState<StatusFilter>("all");

  const load = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      // Use canonical list endpoints (/received/, /sent/). Some APIs return empty from /my/.
      const [recv, sent] = await Promise.all([
        fetchAllInterestPages("received"),
        fetchAllInterestPages("sent"),
      ]);
      let receivedResults = recv.results;
      let sentResults = sent.results;
      let receivedTotal = recv.total;
      let sentTotal = sent.total;

      // If both list endpoints are empty, fall back to /my/ (in case only that is populated)
      if (
        receivedResults.length === 0 &&
        sentResults.length === 0 &&
        receivedTotal === 0 &&
        sentTotal === 0
      ) {
        try {
          const my = await getMyInterests();
          receivedResults = my.data.received.results;
          sentResults = my.data.sent.results;
          receivedTotal = my.data.received.total;
          sentTotal = my.data.sent.total;
        } catch {
          /* keep zeros */
        }
      }

      setReceivedInterests(receivedResults);
      setSentInterests(sentResults);
      setReceivedTotal(receivedTotal);
      setSentTotal(sentTotal);
    } catch (e) {
      setError(getDisplayErrorMessage(e));
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    load();
  }, [load]);

  const handleViewFullProfile = useCallback(async (matriId: string) => {
    setPreviewBusyMatriId(matriId);
    try {
      const res = await getProfilePreview(matriId);
      let canChat = false;
      try {
        const perm = await getChatPermission(matriId);
        canChat = perm.data.can_chat;
      } catch {
        canChat = false;
      }
      setPreviewCanChat(canChat);
      setViewPreview(res.data);
    } catch (e) {
      toast.error(e instanceof Error ? e.message : "Failed to load profile");
    } finally {
      setPreviewBusyMatriId(null);
    }
  }, []);

  const handlePreviewSendInterest = useCallback(
    async (matriId: string) => {
      try {
        const res = await sendInterest(matriId);
        toast.success(res.message || "Interest sent successfully.");
        try {
          const latest = await getProfilePreview(matriId);
          setViewPreview((prev) =>
            prev?.matri_id === matriId ? latest.data : prev,
          );
        } catch {
          setViewPreview((prev) =>
            prev?.matri_id === matriId
              ? { ...prev, interest_status: "sent", is_interest_sent: true }
              : prev,
          );
        }
        void load();
      } catch (e) {
        const err = e as Error & { status?: number };
        const msg = err.message || "Failed to send interest";
        if (err.status === 403 || msg.toLowerCase().includes("plan")) {
          toast.error(msg);
          router.push("/dashboard/plan");
          return;
        }
        toast.error(msg);
      }
    },
    [load, router],
  );

  const handlePreviewChat = useCallback(
    async (matriId: string) => {
      try {
        const res = await startChat(matriId);
        const convoId = res.data.conversation_id;
        router.push(convoId ? `/chat/${convoId}` : "/dashboard/chat-list");
      } catch (e) {
        const msg = e instanceof Error ? e.message : "Failed to start chat";
        if (
          msg.toLowerCase().includes("plan") ||
          msg.toLowerCase().includes("upgrade") ||
          msg.toLowerCase().includes("expired")
        ) {
          setPlanModalOpen(true);
        } else {
          toast.error(msg);
        }
      }
    },
    [router],
  );

  const handlePreviewMatchHoroscope = useCallback(
    (matriId: string) => {
      router.push(
        `/dashboard/porutham-matching?partner=${encodeURIComponent(matriId)}`,
      );
    },
    [router],
  );

  const summary = {
    receivedTotal,
    receivedPending: receivedInterests.filter((i) => i.status === "pending")
      .length,
    sentTotal,
    sentPending: sentInterests.filter((i) => i.status === "pending").length,
  };

  const tabs: { id: Tab; label: string; count: number; icon: typeof Inbox }[] = [
    { id: "received", label: "Received", count: receivedTotal, icon: Inbox },
    { id: "sent", label: "Sent", count: sentTotal, icon: Send },
  ];

  const filteredList = useMemo(() => {
    const base =
      activeTab === "received"
        ? receivedInterests.map((i) => ({ interest: i, isReceived: true }))
        : sentInterests.map((i) => ({ interest: i, isReceived: false }));

    const byStatus =
      statusFilter === "all"
        ? base
        : base.filter(({ interest }) => interest.status === statusFilter);

    return [...byStatus].sort((a, b) => {
      const ta = new Date(a.interest.created_at).getTime() || 0;
      const tb = new Date(b.interest.created_at).getTime() || 0;
      return sortOrder === "newest" ? tb - ta : ta - tb;
    });
  }, [activeTab, receivedInterests, sentInterests, statusFilter, sortOrder]);

  const handleAccept = async (id: number, name: string) => {
    setBusyId(id);
    try {
      const res = await respondInterest(id, "accept");
      setReceivedInterests((prev) =>
        prev.map((i) =>
          i.interest_id === id ? { ...i, status: "accepted" as const } : i,
        ),
      );
      toast.success(res.message || `Accepted ${name}'s interest!`);
    } catch (e) {
      toast.error(e instanceof Error ? e.message : "Failed to accept interest");
    } finally {
      setBusyId(null);
    }
  };

  const handleReject = async (id: number, name: string) => {
    setBusyId(id);
    try {
      const res = await respondInterest(id, "reject");
      setReceivedInterests((prev) =>
        prev.map((i) =>
          i.interest_id === id ? { ...i, status: "rejected" as const } : i,
        ),
      );
      toast.info(res.message || `Declined ${name}'s interest`);
    } catch (e) {
      toast.error(getDisplayErrorMessage(e));
    } finally {
      setBusyId(null);
    }
  };

  const handleCancel = async (id: number) => {
    setBusyId(id);
    try {
      const res = await cancelInterest(id);
      setSentInterests((prev) =>
        prev.map((i) =>
          i.interest_id === id ? { ...i, status: "cancelled" as const } : i,
        ),
      );
      toast.success(res.message || "Interest cancelled.");
    } catch (e) {
      toast.error(getDisplayErrorMessage(e));
    } finally {
      setBusyId(null);
    }
  };

  const summaryCards = [
    {
      label: "Received",
      value: summary.receivedTotal,
      hint: "Total interests",
      icon: Inbox,
      iconWrap: "bg-rose-100 text-rose-600",
      cardBg: "from-rose-50/80 to-rose-100/40",
    },
    {
      label: "Pending",
      value: summary.receivedPending,
      hint: "Awaiting your response",
      icon: Hourglass,
      iconWrap: "bg-amber-100 text-amber-600",
      cardBg: "from-amber-50/80 to-amber-100/40",
    },
    {
      label: "Sent",
      value: summary.sentTotal,
      hint: "You have sent",
      icon: Send,
      iconWrap: "bg-sky-100 text-sky-600",
      cardBg: "from-sky-50/80 to-sky-100/40",
    },
    {
      label: "Sent pending",
      value: summary.sentPending,
      hint: "Waiting for reply",
      icon: Clock,
      iconWrap: "bg-emerald-100 text-emerald-600",
      cardBg: "from-emerald-50/80 to-emerald-100/40",
    },
  ];

  const activeFilterLabel =
    FILTER_OPTIONS.find((o) => o.value === statusFilter)?.label ?? "All statuses";

  return (
    <div className="space-y-4 lg:space-y-6">
        {/* Page header */}
        <div className="flex flex-wrap items-start justify-between gap-3">
          <div>
            <h1 className="font-serif text-2xl md:text-3xl font-bold text-secondary">
              Interest requests
            </h1>
            <p className="text-sm text-muted-foreground mt-1">
              Manage and respond to interest requests from potential candidates.
            </p>
          </div>

          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button
                variant="outline"
                size="sm"
                className="gap-2 rounded-full border-primary/20"
              >
                <SlidersHorizontal className="w-4 h-4" />
                Filter
                {statusFilter !== "all" && (
                  <span className="ml-1 w-1.5 h-1.5 rounded-full bg-primary" />
                )}
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="w-48">
              <DropdownMenuLabel>Filter by status</DropdownMenuLabel>
              <DropdownMenuSeparator />
              <DropdownMenuRadioGroup
                value={statusFilter}
                onValueChange={(v) => setStatusFilter(v as StatusFilter)}
              >
                {FILTER_OPTIONS.map((opt) => (
                  <DropdownMenuRadioItem key={opt.value} value={opt.value}>
                    {opt.label}
                  </DropdownMenuRadioItem>
                ))}
              </DropdownMenuRadioGroup>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>

        {/* Summary cards */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 lg:gap-4">
          {summaryCards.map((card, i) => (
            <motion.div
              key={card.label}
              initial={{ opacity: 0, y: 16 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.06 }}
              className={`flex items-center gap-3 rounded-2xl bg-gradient-to-br ${card.cardBg} border border-primary/10 p-3.5`}
            >
              <div
                className={`w-11 h-11 rounded-xl flex items-center justify-center flex-shrink-0 ${card.iconWrap}`}
              >
                <card.icon className="w-5 h-5" />
              </div>
              <div className="min-w-0">
                <p className="text-[10px] font-bold text-muted-foreground uppercase tracking-wide truncate">
                  {card.label}
                </p>
                <p className="text-xl font-serif font-bold text-foreground leading-tight">
                  {card.value}
                </p>
                <p className="text-[10px] text-muted-foreground truncate">
                  {card.hint}
                </p>
              </div>
            </motion.div>
          ))}
        </div>

        {error && (
          <div className="rounded-xl bg-destructive/10 text-destructive px-4 py-3 text-sm flex items-center justify-between gap-4">
            <span>{error}</span>
            <Button variant="outline" size="sm" onClick={() => load()}>
              Retry
            </Button>
          </div>
        )}

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-white rounded-3xl shadow-card p-4 sm:p-6"
        >
          {/* Tabs + sort */}
          <div className="flex flex-wrap items-center justify-between gap-3 mb-5">
            <div className="flex gap-1.5 p-1 rounded-full bg-rose-50/80 border border-primary/5">
              {tabs.map((tab) => (
                <button
                  key={tab.id}
                  type="button"
                  onClick={() => setActiveTab(tab.id)}
                  className={`flex items-center gap-2 px-4 py-2 rounded-full text-sm font-semibold transition-all ${
                    activeTab === tab.id
                      ? "bg-primary text-primary-foreground shadow-md"
                      : "text-muted-foreground hover:text-foreground"
                  }`}
                >
                  <tab.icon className="w-4 h-4" />
                  {tab.label} ({tab.count})
                </button>
              ))}
            </div>

            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <button
                  type="button"
                  className="flex items-center gap-1.5 text-xs text-muted-foreground hover:text-foreground transition-colors"
                >
                  Sort by:{" "}
                  <span className="font-semibold text-foreground">
                    {sortOrder === "newest" ? "Newest first" : "Oldest first"}
                  </span>
                  <ChevronDown className="w-3.5 h-3.5" />
                </button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end">
                <DropdownMenuItem onClick={() => setSortOrder("newest")}>
                  Newest first
                </DropdownMenuItem>
                <DropdownMenuItem onClick={() => setSortOrder("oldest")}>
                  Oldest first
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>

          <div className="space-y-3">
            {loading && filteredList.length === 0 ? (
              <div className="flex flex-col items-center justify-center py-14 gap-3 text-muted-foreground">
                <Heart className="w-10 h-10 text-primary/30 animate-pulse" />
                <p className="text-sm">Loading interests…</p>
              </div>
            ) : filteredList.length === 0 ? (
              <div className="flex flex-col items-center justify-center py-14 gap-3 text-center">
                <div className="w-14 h-14 rounded-2xl bg-rose-50 flex items-center justify-center">
                  <Inbox className="w-7 h-7 text-primary/40" />
                </div>
                <p className="text-sm text-muted-foreground">
                  No {activeTab}
                  {statusFilter !== "all"
                    ? ` ${activeFilterLabel.toLowerCase()}`
                    : ""}{" "}
                  interests at the moment.
                </p>
              </div>
            ) : (
              <AnimatePresence mode="popLayout">
                {filteredList.map(({ interest, isReceived }) => {
                  const status =
                    STATUS_CONFIG[interest.status] ?? STATUS_CONFIG.pending;
                  const showAcceptDeny =
                    isReceived && interest.status === "pending";
                  const showCancel =
                    !isReceived && interest.status === "pending";
                  const disabled = busyId === interest.interest_id;

                  const details = [
                    {
                      icon: MapPin,
                      label: "Location",
                      value: interest.location,
                    },
                    {
                      icon: CalendarDays,
                      label: "Age",
                      value: interest.age,
                    },
                    {
                      icon: GraduationCap,
                      label: "Education",
                      value: interest.education,
                    },
                    {
                      icon: Briefcase,
                      label: "Job",
                      value: interest.occupation,
                    },
                  ];

                  return (
                    <motion.div
                      key={`${interest.interest_id}-${isReceived ? "r" : "s"}`}
                      layout
                      initial={{ opacity: 0, y: 12 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, scale: 0.98 }}
                      className="flex flex-col sm:flex-row items-stretch sm:items-start gap-4 rounded-2xl border border-primary/10 bg-card p-4 hover:shadow-card transition-shadow"
                    >
                      <div className="relative flex-shrink-0 self-center sm:self-start">
                        <img
                          src={interest.profile_photo || DEFAULT_PHOTO}
                          alt={interest.name}
                          className="w-28 h-32 rounded-xl object-cover"
                        />
                        <span className="absolute bottom-1.5 left-1.5 right-1.5 text-center text-[10px] font-bold px-1 py-1 rounded-md bg-primary/90 text-primary-foreground backdrop-blur">
                          MEMBER
                        </span>
                      </div>

                      <div className="flex-1 min-w-0">
                        <div className="flex flex-wrap items-start justify-between gap-2">
                          <div className="flex flex-wrap items-center gap-2">
                            <h3 className="font-serif font-bold text-lg text-foreground capitalize">
                              {interest.name}
                            </h3>
                            <span
                              className={`text-[10px] font-bold uppercase tracking-wide px-2.5 py-0.5 rounded-full border ${status.className}`}
                            >
                              {status.label}
                            </span>
                          </div>

                          {/* Actions (desktop) */}
                          <div className="hidden sm:flex items-center gap-2 flex-shrink-0">
                            {showAcceptDeny && (
                              <>
                                <Button
                                  size="sm"
                                  className="gap-1.5 bg-emerald-600 hover:bg-emerald-700 text-white text-xs rounded-full px-4"
                                  disabled={disabled}
                                  onClick={() =>
                                    handleAccept(
                                      interest.interest_id,
                                      interest.name,
                                    )
                                  }
                                >
                                  <Check className="w-3.5 h-3.5" />
                                  Accept
                                </Button>
                                <Button
                                  size="sm"
                                  variant="outline"
                                  className="gap-1.5 text-xs rounded-full border-primary text-primary hover:bg-primary/5 px-4"
                                  disabled={disabled}
                                  onClick={() =>
                                    handleReject(
                                      interest.interest_id,
                                      interest.name,
                                    )
                                  }
                                >
                                  <X className="w-3.5 h-3.5" />
                                  Deny
                                </Button>
                              </>
                            )}
                            {showCancel && (
                              <Button
                                size="sm"
                                variant="outline"
                                className="gap-1.5 text-xs rounded-full text-destructive border-destructive/30 hover:bg-destructive/10 px-4"
                                disabled={disabled}
                                onClick={() =>
                                  handleCancel(interest.interest_id)
                                }
                              >
                                <X className="w-3.5 h-3.5" />
                                Cancel
                              </Button>
                            )}
                          </div>
                        </div>

                        {/* Detail fields */}
                        <div className="grid grid-cols-2 sm:grid-cols-4 gap-x-4 gap-y-3 mt-3">
                          {details.map((d) => (
                            <div
                              key={d.label}
                              className="flex items-center gap-2 min-w-0"
                            >
                              <div className="w-7 h-7 rounded-lg bg-primary/10 flex items-center justify-center flex-shrink-0">
                                <d.icon className="w-3.5 h-3.5 text-primary" />
                              </div>
                              <div className="min-w-0">
                                <p className="text-[10px] text-muted-foreground leading-tight">
                                  {d.label}
                                </p>
                                <p className="text-xs font-semibold text-foreground truncate">
                                  {d.value || "—"}
                                </p>
                              </div>
                            </div>
                          ))}
                        </div>

                        <div className="mt-3 pt-3 border-t border-dashed border-primary/10 flex flex-wrap items-center justify-between gap-3">
                          <p className="flex items-center gap-1.5 text-xs text-muted-foreground">
                            <Clock className="w-3.5 h-3.5" />
                            Request on:{" "}
                            <span className="text-foreground">
                              {formatDateTimeDdMmYyyy(interest.created_at)}
                            </span>
                          </p>
                          <button
                            type="button"
                            onClick={() =>
                              handleViewFullProfile(interest.matri_id)
                            }
                            disabled={previewBusyMatriId === interest.matri_id}
                            className="text-xs font-medium px-3.5 py-1.5 border border-primary/30 rounded-full text-primary hover:bg-primary/5 transition-colors disabled:opacity-60"
                          >
                            {previewBusyMatriId === interest.matri_id
                              ? "Loading…"
                              : "View full profile"}
                          </button>
                        </div>

                        {/* Actions (mobile) */}
                        {(showAcceptDeny || showCancel) && (
                          <div className="flex sm:hidden items-center gap-2 mt-3">
                            {showAcceptDeny && (
                              <>
                                <Button
                                  size="sm"
                                  className="flex-1 gap-1.5 bg-emerald-600 hover:bg-emerald-700 text-white text-xs rounded-full"
                                  disabled={disabled}
                                  onClick={() =>
                                    handleAccept(
                                      interest.interest_id,
                                      interest.name,
                                    )
                                  }
                                >
                                  <Check className="w-3.5 h-3.5" />
                                  Accept
                                </Button>
                                <Button
                                  size="sm"
                                  variant="outline"
                                  className="flex-1 gap-1.5 text-xs rounded-full border-primary text-primary"
                                  disabled={disabled}
                                  onClick={() =>
                                    handleReject(
                                      interest.interest_id,
                                      interest.name,
                                    )
                                  }
                                >
                                  <X className="w-3.5 h-3.5" />
                                  Deny
                                </Button>
                              </>
                            )}
                            {showCancel && (
                              <Button
                                size="sm"
                                variant="outline"
                                className="flex-1 gap-1.5 text-xs rounded-full text-destructive border-destructive/30"
                                disabled={disabled}
                                onClick={() =>
                                  handleCancel(interest.interest_id)
                                }
                              >
                                <X className="w-3.5 h-3.5" />
                                Cancel
                              </Button>
                            )}
                          </div>
                        )}
                      </div>
                    </motion.div>
                  );
                })}
              </AnimatePresence>
            )}
          </div>
        </motion.div>

        <ProfileViewDrawer
          open={!!viewPreview}
          onOpenChange={(open) => {
            if (!open) {
              setViewPreview(null);
              setPreviewCanChat(false);
            }
          }}
          profile={null}
          preview={viewPreview}
          onSendInterest={
            viewPreview
              ? () => handlePreviewSendInterest(viewPreview.matri_id)
              : undefined
          }
          canChat={previewCanChat}
          onChat={
            viewPreview
              ? () => handlePreviewChat(viewPreview.matri_id)
              : undefined
          }
          onMatchHoroscope={
            viewPreview
              ? () => handlePreviewMatchHoroscope(viewPreview.matri_id)
              : undefined
          }
          onOpenPlanModal={() => setPlanModalOpen(true)}
        />

        <ChoosePlanModal open={planModalOpen} onOpenChange={setPlanModalOpen} />
    </div>
  );
};

export default DashboardInterests;
