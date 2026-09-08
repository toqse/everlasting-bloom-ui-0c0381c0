"use client";

import { useCallback, useEffect, useState } from "react";
import { motion } from "framer-motion";
import { Ban, ChevronLeft, ChevronRight, Eye, Loader2 } from "lucide-react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import ProfileViewDrawer from "@/components/ProfileViewDrawer";
import {
  getProfilePreview,
  getChatPermission,
  type MatchProfile,
  type ProfilePreviewData,
} from "@/lib/matchesApi";
import { getBlockedList, unblockUser } from "@/lib/blocksApi";
import { getDisplayErrorMessage } from "@/lib/apiErrors";

const DEFAULT_LIMIT = 10;

const DashboardBlockedPage = () => {
  const [profiles, setProfiles] = useState<MatchProfile[]>([]);
  const [total, setTotal] = useState(0);
  const [page, setPage] = useState(1);
  const [loading, setLoading] = useState(true);
  const [actionLoading, setActionLoading] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [preview, setPreview] = useState<ProfilePreviewData | null>(null);
  const [previewCanChat, setPreviewCanChat] = useState(false);

  const totalPages = Math.max(1, Math.ceil(total / DEFAULT_LIMIT));
  const rangeStart = total === 0 ? 0 : (page - 1) * DEFAULT_LIMIT + 1;
  const rangeEnd = Math.min(page * DEFAULT_LIMIT, total);
  const showPagination = !loading && total > 0;

  const fetchBlocked = useCallback(async (nextPage: number) => {
    setLoading(true);
    setError(null);
    try {
      const res = await getBlockedList({ page: nextPage, limit: DEFAULT_LIMIT });
      const nextTotal = res.data.total;
      const nextTotalPages = Math.max(1, Math.ceil(nextTotal / DEFAULT_LIMIT));
      // If current page is past the end (e.g. after unblock), load the last page.
      if (nextTotal > 0 && nextPage > nextTotalPages) {
        setPage(nextTotalPages);
        return;
      }
      setProfiles(res.data.profiles);
      setTotal(nextTotal);
    } catch (e) {
      setError(getDisplayErrorMessage(e));
      setProfiles([]);
      setTotal(0);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchBlocked(page);
  }, [fetchBlocked, page]);

  const handleViewDetails = useCallback(async (matriId: string) => {
    setActionLoading(matriId);
    try {
      const [profileRes, chatRes] = await Promise.all([
        getProfilePreview(matriId),
        getChatPermission(matriId).catch(() => ({ data: { can_chat: false } })),
      ]);
      setPreview({ ...profileRes.data, is_blocked_by_me: true });
      setPreviewCanChat(!!chatRes.data.can_chat);
    } catch (e) {
      // Preview is refused when blocked either way — show a minimal local card instead
      const local = profiles.find((p) => p.matri_id === matriId);
      if (local) {
        setPreview({
          matri_id: local.matri_id,
          name: local.name,
          age: local.age ?? 0,
          location: local.location ?? "",
          religion: "",
          caste: "",
          education: local.education ?? "",
          occupation: local.occupation ?? "",
          annual_income: "",
          marital_status: "",
          height: "",
          mother_tongue: "",
          profile_photo: local.profile_photo,
          about_me: "",
          family_background: "",
          contact_locked: true,
          is_blocked_by_me: true,
        });
        setPreviewCanChat(false);
        toast.message("Limited view — unblock to interact again.");
      } else {
        toast.error(getDisplayErrorMessage(e));
      }
    } finally {
      setActionLoading(null);
    }
  }, [profiles]);

  const handleUnblock = useCallback(
    async (matriId: string) => {
      setActionLoading(matriId);
      try {
        await unblockUser(matriId);
        toast.success("User unblocked");
        if (preview?.matri_id === matriId) {
          setPreview(null);
          setPreviewCanChat(false);
        }
        // Refetch so pagination / page contents stay in sync with the server.
        await fetchBlocked(page);
      } catch (e) {
        toast.error(getDisplayErrorMessage(e));
      } finally {
        setActionLoading(null);
      }
    },
    [preview?.matri_id, fetchBlocked, page],
  );

  return (
    <>
      <div className="space-y-5">
        <motion.div
          initial={{ opacity: 0, y: -8 }}
          animate={{ opacity: 1, y: 0 }}
          className="rounded-2xl border border-primary/10 bg-card/90 px-5 py-5 shadow-card"
        >
          <div className="flex items-center justify-between gap-3 max-lg:justify-start">
            <h1 className="max-lg:hidden font-serif text-2xl font-bold text-secondary">
              Blocked
            </h1>
            <span className="rounded-full bg-primary/10 px-3 py-1 text-sm font-semibold text-primary">
              {total} blocked
            </span>
          </div>
          <p className="mt-2 text-sm text-muted-foreground">
            Profiles you blocked. Unblock to see them in matches again.
          </p>
        </motion.div>

        {error ? (
          <div className="rounded-xl bg-destructive/10 px-4 py-3 text-sm text-destructive">
            {error}
          </div>
        ) : null}

        {loading ? (
          <div className="py-12 text-center text-muted-foreground">
            Loading blocked profiles...
          </div>
        ) : profiles.length === 0 ? (
          <div className="rounded-2xl border border-primary/10 bg-card p-10 text-center">
            <Ban className="mx-auto mb-3 h-9 w-9 text-muted-foreground" />
            <p className="font-semibold text-foreground">No blocked profiles</p>
            <p className="mt-1 text-sm text-muted-foreground">
              Use Block on a profile to stop seeing them in matches.
            </p>
          </div>
        ) : (
          <div className="space-y-4">
            {profiles.map((p) => {
              const busy = actionLoading === p.matri_id;
              return (
                <div
                  key={p.matri_id}
                  className="rounded-2xl border border-primary/10 bg-card p-4 shadow-card"
                >
                  <div className="flex flex-col gap-4 md:flex-row md:items-start md:justify-between">
                    <div className="flex gap-3">
                      <img
                        src={
                          p.profile_photo ||
                          "https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=200&h=260&fit=crop"
                        }
                        alt=""
                        className="h-20 w-16 rounded-lg object-cover"
                      />
                      <div>
                        <p className="font-serif text-xl font-bold text-foreground">
                          {p.name}
                        </p>
                        <p className="text-sm text-muted-foreground">
                          {p.education ?? "—"} · {p.occupation ?? "—"} ·{" "}
                          {p.age ?? "—"} yrs
                        </p>
                        {p.location ? (
                          <p className="text-xs text-muted-foreground mt-0.5">
                            {p.location}
                          </p>
                        ) : null}
                      </div>
                    </div>

                    <div className="flex flex-wrap gap-2">
                      <Button
                        size="sm"
                        variant="secondary"
                        disabled={busy}
                        onClick={() => handleViewDetails(p.matri_id)}
                      >
                        {busy ? (
                          <Loader2 className="mr-1 h-4 w-4 animate-spin" />
                        ) : (
                          <Eye className="mr-1 h-4 w-4" />
                        )}
                        View
                      </Button>
                      <Button
                        size="sm"
                        variant="outline"
                        disabled={busy}
                        onClick={() => void handleUnblock(p.matri_id)}
                      >
                        Unblock
                      </Button>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        )}

        {showPagination ? (
          <div className="flex flex-col gap-3 border-t border-primary/10 pt-4 sm:flex-row sm:items-center sm:justify-between">
            <p className="text-sm text-muted-foreground">
              Showing {rangeStart}–{rangeEnd} of {total}
            </p>
            <div className="flex items-center justify-end gap-2">
              <Button
                size="sm"
                variant="outline"
                disabled={page <= 1 || loading}
                onClick={() => setPage((p) => Math.max(1, p - 1))}
              >
                <ChevronLeft className="h-4 w-4" />
                <span className="sr-only sm:not-sr-only sm:ml-1">Previous</span>
              </Button>
              <span className="min-w-[7rem] text-center text-sm text-muted-foreground">
                Page {page} of {totalPages}
              </span>
              <Button
                size="sm"
                variant="outline"
                disabled={page >= totalPages || loading}
                onClick={() => setPage((p) => Math.min(totalPages, p + 1))}
              >
                <span className="sr-only sm:not-sr-only sm:mr-1">Next</span>
                <ChevronRight className="h-4 w-4" />
              </Button>
            </div>
          </div>
        ) : null}
      </div>

      <ProfileViewDrawer
        open={!!preview}
        onOpenChange={(open) => {
          if (!open) {
            setPreview(null);
            setPreviewCanChat(false);
          }
        }}
        profile={null}
        preview={preview}
        canChat={previewCanChat}
        onBlockedChange={(matriId, isBlocked) => {
          if (!isBlocked) {
            setPreview(null);
            setPreviewCanChat(false);
            void fetchBlocked(page);
          }
        }}
      />
    </>
  );
};

export default DashboardBlockedPage;
