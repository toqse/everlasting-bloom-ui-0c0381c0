"use client";

import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import DashboardLayout from "@/components/DashboardLayout";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";
import { useRouter } from "next/navigation";
import { getReceivedInterests, getSentInterests, respondInterest } from "@/lib/interestsApi";

type Tab = "received" | "sent";

const DashboardInterests = () => {
  const [activeTab, setActiveTab] = useState<Tab>("received");
  const router = useRouter();
  const [receivedInterests, setReceivedInterests] = useState<ReturnType<typeof Array.prototype.slice>>([]);
  const [sentInterests, setSentInterests] = useState<ReturnType<typeof Array.prototype.slice>>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const load = async () => {
      setLoading(true);
      setError(null);
      try {
        const [receivedRes, sentRes] = await Promise.all([getReceivedInterests(1, 10), getSentInterests(1, 10)]);
        setReceivedInterests(receivedRes.data.results);
        setSentInterests(sentRes.data.results);
      } catch (e) {
        setError(e instanceof Error ? e.message : "Failed to load interests");
      } finally {
        setLoading(false);
      }
    };
    load();
  }, []);

  const tabs: { id: Tab; label: string }[] = [
    { id: "received", label: "Received" },
    { id: "sent", label: "Sent" },
  ];

  const summary = {
    receivedTotal: receivedInterests.length,
    receivedPending: receivedInterests.filter((i: any) => i.status === "pending").length,
    sentTotal: sentInterests.length,
    sentPending: sentInterests.filter((i: any) => i.status === "pending").length,
  };

  const filteredList = activeTab === "received"
    ? receivedInterests.map((i: any) => ({ interest: i, isReceived: true }))
    : sentInterests.map((i: any) => ({ interest: i, isReceived: false }));

  const handleAccept = async (id: number, name: string) => {
    try {
      await respondInterest(id, "accept");
      setReceivedInterests((prev: any[]) =>
        prev.map((i) => (i.interest_id === id ? { ...i, status: "accepted" } : i)),
      );
      toast.success(`Accepted ${name}'s interest! 💕`);
    } catch (e) {
      toast.error(e instanceof Error ? e.message : "Failed to accept interest");
    }
  };

  const handleReject = async (id: number, name: string) => {
    try {
      await respondInterest(id, "reject");
      setReceivedInterests((prev: any[]) =>
        prev.map((i) => (i.interest_id === id ? { ...i, status: "rejected" } : i)),
      );
      toast.info(`Denied ${name}'s interest`);
    } catch (e) {
      toast.error(e instanceof Error ? e.message : "Failed to reject interest");
    }
  };

  return (
    <DashboardLayout>
      <div className="space-y-6">
        <h1 className="font-serif text-2xl md:text-3xl font-bold text-secondary italic">Interest request</h1>

        {/* Compact summary section for all interests */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
          <div className="rounded-2xl bg-gradient-to-br from-rose-50 to-rose-100 border border-primary/10 p-3">
            <p className="text-[11px] font-semibold text-muted-foreground uppercase tracking-wide">Received</p>
            <p className="text-xl font-serif font-bold text-primary">{summary.receivedTotal}</p>
            <p className="text-[11px] text-muted-foreground mt-1">Total interests</p>
          </div>
          <div className="rounded-2xl bg-gradient-to-br from-amber-50 to-amber-100 border border-primary/10 p-3">
            <p className="text-[11px] font-semibold text-muted-foreground uppercase tracking-wide">Pending</p>
            <p className="text-xl font-serif font-bold text-amber-700">{summary.receivedPending}</p>
            <p className="text-[11px] text-muted-foreground mt-1">Awaiting your response</p>
          </div>
          <div className="rounded-2xl bg-gradient-to-br from-sky-50 to-sky-100 border border-primary/10 p-3">
            <p className="text-[11px] font-semibold text-muted-foreground uppercase tracking-wide">Sent</p>
            <p className="text-xl font-serif font-bold text-sky-700">{summary.sentTotal}</p>
            <p className="text-[11px] text-muted-foreground mt-1">You have sent</p>
          </div>
          <div className="rounded-2xl bg-gradient-to-br from-emerald-50 to-emerald-100 border border-primary/10 p-3">
            <p className="text-[11px] font-semibold text-muted-foreground uppercase tracking-wide">Sent pending</p>
            <p className="text-xl font-serif font-bold text-emerald-700">{summary.sentPending}</p>
            <p className="text-[11px] text-muted-foreground mt-1">Waiting for reply</p>
          </div>
        </div>

        {error && (
          <div className="rounded-xl bg-destructive/10 text-destructive px-4 py-3 text-sm">
            {error}
          </div>
        )}

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-white rounded-3xl shadow-card p-6"
        >
          {/* More button */}
          <div className="flex justify-end mb-4">
            <button className="w-8 h-8 rounded-full border border-primary/10 flex items-center justify-center text-muted-foreground hover:bg-accent-rose">
              •••
            </button>
          </div>

          {/* Pill-style tabs: Received, Sent, Accepted, Declined */}
          <div className="flex flex-wrap justify-center sm:justify-start gap-2 mb-6 p-1 rounded-2xl bg-rose-50/80 border border-primary/5">
            {tabs.map((tab) => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`px-5 py-2.5 rounded-full text-sm font-semibold transition-all ${
                  activeTab === tab.id
                    ? "bg-primary text-primary-foreground shadow-md border-2 border-primary"
                    : "bg-white/60 text-muted-foreground border-2 border-primary/10 hover:border-primary/20 hover:text-foreground"
                }`}
              >
                {tab.label}
              </button>
            ))}
          </div>

          {/* Interest Cards */}
          <div className="space-y-6">
            {loading && filteredList.length === 0 ? (
              <p className="text-center text-muted-foreground py-8">Loading interests…</p>
            ) : filteredList.length === 0 ? (
              <p className="text-center text-muted-foreground py-8">No {activeTab} interests at the moment.</p>
            ) : (
              filteredList.map(({ interest, isReceived }: any) => {
                const planBadge = "MEMBER";
                const badgeColor = "bg-primary text-primary-foreground";
                const showAcceptDeny = isReceived && interest.status === "pending";

                return (
                  <motion.div
                    key={`${interest.id}-${isReceived ? "r" : "s"}`}
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    className="flex items-start gap-4 pb-6 border-b border-primary/5 last:border-0"
                  >
                    <div className="relative flex-shrink-0">
                      <img
                        src={
                          interest.profile_photo ||
                          "https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=200&h=260&fit=crop&crop=face"
                        }
                        alt={interest.name}
                        className="w-24 h-28 rounded-xl object-cover"
                      />
                      <span className={`absolute bottom-1 left-1 right-1 text-center text-[10px] font-bold px-1 py-0.5 rounded ${badgeColor}`}>
                        {planBadge}
                      </span>
                    </div>

                    <div className="flex-1 min-w-0">
                      <h3 className="font-serif font-bold text-foreground">{interest.name}</h3>
                      <div className="flex flex-wrap gap-x-4 gap-y-1 text-xs text-muted-foreground mt-1">
                        <span>• Location: <strong className="text-foreground">{interest.location}</strong></span>
                        <span>• Age: <strong className="text-foreground">{interest.age}</strong></span>
                        <span>• Education: <strong className="text-foreground">{interest.education}</strong></span>
                        <span>• Job: <strong className="text-foreground">{interest.occupation}</strong></span>
                      </div>
                      <p className="text-xs text-muted-foreground mt-1">
                        • Request on:{" "}
                        {new Date(interest.created_at).toLocaleString(undefined, {
                          hour: "2-digit",
                          minute: "2-digit",
                          day: "numeric",
                          month: "short",
                          year: "numeric",
                        })}
                      </p>
                      <button
                        onClick={() => router.push(`/profiles/${interest.matri_id}/preview`)}
                        className="mt-2 text-xs px-3 py-1.5 border border-primary/20 rounded-lg text-foreground hover:bg-accent-rose transition-colors"
                      >
                        View full profile
                      </button>
                    </div>

                    <div className="flex gap-2 flex-shrink-0">
                      {showAcceptDeny && (
                        <>
                          <Button
                            size="sm"
                            className="bg-green-600 hover:bg-green-700 text-white text-xs rounded-full"
                            onClick={() => handleAccept(interest.interest_id, interest.name)}
                          >
                            Accept
                          </Button>
                          <Button
                            size="sm"
                            variant="outline"
                            className="text-xs rounded-full border-primary"
                            onClick={() => handleReject(interest.interest_id, interest.name)}
                          >
                            Deny
                          </Button>
                        </>
                      )}
                    </div>
                  </motion.div>
                );
              })
            )}
          </div>
        </motion.div>
      </div>
    </DashboardLayout>
  );
};

export default DashboardInterests;
