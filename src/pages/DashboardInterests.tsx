import { useState } from "react";
import { motion } from "framer-motion";
import DashboardLayout from "@/components/DashboardLayout";
import { useInterestStore } from "@/stores/interestStore";
import { profilesData } from "@/components/FeaturedProfiles";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";
import { useNavigate } from "react-router-dom";

type Tab = "new" | "accepted" | "denied";

const DashboardInterests = () => {
  const [activeTab, setActiveTab] = useState<Tab>("new");
  const navigate = useNavigate();
  const { receivedInterests, acceptInterest, rejectInterest } = useInterestStore();

  const tabs: { id: Tab; label: string }[] = [
    { id: "new", label: "New requests" },
    { id: "accepted", label: "Accept request" },
    { id: "denied", label: "Deny request" },
  ];

  const filteredInterests = receivedInterests.filter((i) => {
    if (activeTab === "new") return i.status === "pending";
    if (activeTab === "accepted") return i.status === "accepted";
    return i.status === "rejected";
  });

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

          {/* Tabs */}
          <div className="flex gap-6 border-b border-primary/10 mb-6">
            {tabs.map((tab) => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`pb-3 text-sm font-medium transition-all border-b-2 ${
                  activeTab === tab.id
                    ? "border-secondary text-secondary"
                    : "border-transparent text-muted-foreground hover:text-foreground"
                }`}
              >
                {tab.label}
              </button>
            ))}
          </div>

          {/* Interest Cards */}
          <div className="space-y-6">
            {filteredInterests.length === 0 ? (
              <p className="text-center text-muted-foreground py-8">No {activeTab} requests at the moment.</p>
            ) : (
              filteredInterests.map((interest) => {
                const profile = profilesData.find((p) => p.id === interest.fromProfileId);
                if (!profile) return null;

                const planBadge = profile.isPremium ? "PLATINUM USER" : "FREE USER";
                const badgeColor = profile.isPremium ? "bg-primary text-primary-foreground" : "bg-green-600 text-white";

                return (
                  <motion.div
                    key={interest.id}
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
                          <span> • Accept on: {new Date(interest.updatedAt).toLocaleString('en-US', { hour: '2-digit', minute: '2-digit', hour12: true })}, {new Date(interest.updatedAt).toLocaleDateString('en-US', { day: 'numeric', month: 'long', year: 'numeric' })}</span>
                        )}
                        {interest.status === "rejected" && (
                          <span> • Deny on: {new Date(interest.updatedAt).toLocaleString('en-US', { hour: '2-digit', minute: '2-digit', hour12: true })}, {new Date(interest.updatedAt).toLocaleDateString('en-US', { day: 'numeric', month: 'long', year: 'numeric' })}</span>
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
                      {activeTab === "new" && (
                        <>
                          <Button size="sm" className="bg-green-600 hover:bg-green-700 text-white text-xs rounded-full" onClick={() => handleAccept(interest.id, profile.name)}>Accept</Button>
                          <Button size="sm" variant="outline" className="text-xs rounded-full border-primary" onClick={() => handleReject(interest.id, profile.name)}>Deny</Button>
                        </>
                      )}
                      {activeTab === "accepted" && (
                        <Button size="sm" variant="outline" className="text-xs rounded-full border-primary" onClick={() => handleReject(interest.id, profile.name)}>Deny</Button>
                      )}
                      {activeTab === "denied" && (
                        <Button size="sm" className="bg-green-600 hover:bg-green-700 text-white text-xs rounded-full" onClick={() => handleAccept(interest.id, profile.name)}>Accept</Button>
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
