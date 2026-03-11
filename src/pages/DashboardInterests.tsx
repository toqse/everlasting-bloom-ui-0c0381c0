import { useState } from "react";
import { motion } from "framer-motion";
import DashboardLayout from "@/components/DashboardLayout";
import { useInterestStore } from "@/stores/interestStore";
import { profilesData } from "@/components/FeaturedProfiles";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";
import { useNavigate } from "react-router-dom";

type Tab = "received" | "sent";

const DashboardInterests = () => {
  const [activeTab, setActiveTab] = useState<Tab>("received");
  const navigate = useNavigate();
  const { receivedInterests, sentInterests, acceptInterest, rejectInterest } = useInterestStore();

  const tabs: { id: Tab; label: string }[] = [
    { id: "received", label: "Received" },
    { id: "sent", label: "Sent" },
  ];

  const filteredList = activeTab === "received"
    ? receivedInterests.map((i) => ({ interest: i, fromProfileId: i.fromProfileId, toProfileId: i.toProfileId, isReceived: true }))
    : sentInterests.map((i) => ({ interest: i, fromProfileId: i.fromProfileId, toProfileId: i.toProfileId, isReceived: false }));

  const handleAccept = (id: string, name: string) => {
    acceptInterest(id);
    toast.success(`Accepted ${name}'s interest! 💕`);
  };

  const handleReject = (id: string, name: string) => {
    rejectInterest(id);
    toast.info(`Denied ${name}'s interest`);
  };

  return (
    <DashboardLayout>
      <div className="space-y-6">
        <h1 className="font-serif text-2xl md:text-3xl font-bold text-secondary italic">Interest request</h1>

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
            {filteredList.length === 0 ? (
              <p className="text-center text-muted-foreground py-8">No {activeTab} interests at the moment.</p>
            ) : (
              filteredList.map(({ interest, fromProfileId, toProfileId, isReceived }) => {
                const profileId = isReceived ? fromProfileId : toProfileId;
                const profile = profilesData.find((p) => p.id === profileId);
                if (!profile) return null;

                const planBadge = profile.isPremium ? "PLATINUM USER" : "FREE USER";
                const badgeColor = profile.isPremium ? "bg-primary text-primary-foreground" : "bg-green-600 text-white";
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
                        src={profile.image}
                        alt={profile.name}
                        className="w-24 h-28 rounded-xl object-cover"
                      />
                      <span className={`absolute bottom-1 left-1 right-1 text-center text-[10px] font-bold px-1 py-0.5 rounded ${badgeColor}`}>
                        {planBadge}
                      </span>
                    </div>

                    <div className="flex-1 min-w-0">
                      <h3 className="font-serif font-bold text-foreground">{profile.name}</h3>
                      <div className="flex flex-wrap gap-x-4 gap-y-1 text-xs text-muted-foreground mt-1">
                        <span>• City: <strong className="text-foreground">{profile.location}</strong></span>
                        <span>• Age: <strong className="text-foreground">{profile.age}</strong></span>
                        <span>• Height: <strong className="text-foreground">5'6"</strong></span>
                        <span>• Job: <strong className="text-foreground">{profile.profession}</strong></span>
                      </div>
                      <p className="text-xs text-muted-foreground mt-1">
                        • Request on: {new Date(interest.createdAt).toLocaleString('en-US', { hour: '2-digit', minute: '2-digit', hour12: true })}, {new Date(interest.createdAt).toLocaleDateString('en-US', { day: 'numeric', month: 'long', year: 'numeric' })}
                        {interest.status === "accepted" && (
                          <span> • Accepted: {new Date(interest.updatedAt).toLocaleString('en-US', { hour: '2-digit', minute: '2-digit', hour12: true })}, {new Date(interest.updatedAt).toLocaleDateString('en-US', { day: 'numeric', month: 'long', year: 'numeric' })}</span>
                        )}
                        {interest.status === "rejected" && (
                          <span> • Declined: {new Date(interest.updatedAt).toLocaleString('en-US', { hour: '2-digit', minute: '2-digit', hour12: true })}, {new Date(interest.updatedAt).toLocaleDateString('en-US', { day: 'numeric', month: 'long', year: 'numeric' })}</span>
                        )}
                      </p>
                      <button
                        onClick={() => navigate(`/profile/${profile.id}`)}
                        className="mt-2 text-xs px-3 py-1.5 border border-primary/20 rounded-lg text-foreground hover:bg-accent-rose transition-colors"
                      >
                        View full profile
                      </button>
                    </div>

                    <div className="flex gap-2 flex-shrink-0">
                      {showAcceptDeny && (
                        <>
                          <Button size="sm" className="bg-green-600 hover:bg-green-700 text-white text-xs rounded-full" onClick={() => handleAccept(interest.id, profile.name)}>Accept</Button>
                          <Button size="sm" variant="outline" className="text-xs rounded-full border-primary" onClick={() => handleReject(interest.id, profile.name)}>Deny</Button>
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
