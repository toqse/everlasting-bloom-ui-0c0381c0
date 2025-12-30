import { motion } from "framer-motion";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import GlassProfileCard from "@/components/GlassProfileCard";
import EmptyState from "@/components/EmptyState";
import { useInterestStore } from "@/stores/interestStore";
import { profilesData } from "@/components/FeaturedProfiles";
import { toast } from "sonner";
import { Heart, Sparkles, Inbox, Filter, Check, Clock, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useState } from "react";
import { useNavigate } from "react-router-dom";

type FilterType = 'all' | 'pending' | 'accepted' | 'rejected';

const InterestReceived = () => {
  const navigate = useNavigate();
  const { receivedInterests, acceptInterest, rejectInterest, favorites, toggleFavorite, canChat } = useInterestStore();
  const [filter, setFilter] = useState<FilterType>('all');

  const filteredInterests = receivedInterests.filter(interest => {
    if (filter === 'all') return true;
    return interest.status === filter;
  });

  const handleAccept = (interestId: string, profileName: string) => {
    acceptInterest(interestId);
    toast.success(`You've accepted ${profileName}'s interest! 💕`, {
      description: "You can now start chatting with them.",
    });
  };

  const handleReject = (interestId: string, profileName: string) => {
    rejectInterest(interestId);
    toast.info(`You've declined ${profileName}'s interest`, {
      description: "They won't be notified of this action.",
    });
  };

  const handleChat = (profileId: number) => {
    navigate(`/chat/${profileId}`);
  };

  const filters: { id: FilterType; label: string; icon: any }[] = [
    { id: 'all', label: 'All', icon: Inbox },
    { id: 'pending', label: 'Pending', icon: Clock },
    { id: 'accepted', label: 'Accepted', icon: Check },
    { id: 'rejected', label: 'Declined', icon: X },
  ];

  const counts = {
    all: receivedInterests.length,
    pending: receivedInterests.filter(i => i.status === 'pending').length,
    accepted: receivedInterests.filter(i => i.status === 'accepted').length,
    rejected: receivedInterests.filter(i => i.status === 'rejected').length,
  };

  return (
    <div className="min-h-screen bg-background">
      <Navbar />

      {/* Hero Section */}
      <section className="pt-28 pb-12 bg-gradient-romantic relative overflow-hidden">
        {/* Animated Background */}
        <div className="absolute top-20 left-10 w-72 h-72 bg-secondary/15 rounded-full blur-3xl animate-float" />
        <div className="absolute bottom-10 right-10 w-96 h-96 bg-primary/10 rounded-full blur-3xl animate-float-delayed" />
        
        {/* Floating Sparkles */}
        {[...Array(5)].map((_, i) => (
          <Sparkles
            key={i}
            className="absolute text-secondary/30 animate-sparkle"
            style={{
              left: `${10 + i * 20}%`,
              top: `${30 + (i % 2) * 20}%`,
              width: `${20 + i * 4}px`,
              animationDelay: `${i * 0.4}s`,
            }}
          />
        ))}

        <div className="container mx-auto px-4 relative z-10">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-center"
          >
            <div className="inline-flex items-center gap-2 px-5 py-2.5 rounded-full bg-white/80 backdrop-blur-sm border border-primary/10 mb-4 shadow-soft">
              <Heart className="w-4 h-4 text-primary fill-primary animate-pulse-soft" />
              <span className="text-sm font-medium text-primary">Interests Received</span>
              {counts.pending > 0 && (
                <span className="px-2 py-0.5 bg-primary text-primary-foreground text-xs font-bold rounded-full">
                  {counts.pending} new
                </span>
              )}
            </div>
            <h1 className="font-serif text-4xl md:text-5xl font-bold text-foreground mb-4">
              People Interested in <span className="text-gradient-gold">You</span>
            </h1>
            <p className="text-muted-foreground max-w-2xl mx-auto">
              Review and respond to interests from members who want to connect with you
            </p>
          </motion.div>
        </div>
      </section>

      {/* Filter Section */}
      <section className="py-6 bg-white/50 backdrop-blur-sm sticky top-16 z-40 border-b border-primary/5">
        <div className="container mx-auto px-4">
          <div className="flex items-center gap-3 overflow-x-auto pb-2">
            <Filter className="w-5 h-5 text-muted-foreground flex-shrink-0" />
            {filters.map(({ id, label, icon: Icon }) => (
              <motion.button
                key={id}
                whileTap={{ scale: 0.95 }}
                onClick={() => setFilter(id)}
                className={`flex items-center gap-2 px-4 py-2 rounded-full text-sm font-medium transition-all whitespace-nowrap ${
                  filter === id
                    ? "bg-primary text-primary-foreground shadow-soft"
                    : "bg-white/70 text-muted-foreground hover:bg-accent-rose/50"
                }`}
              >
                <Icon className="w-4 h-4" />
                {label}
                <span className={`px-1.5 py-0.5 rounded-full text-xs ${
                  filter === id ? "bg-white/20" : "bg-primary/10"
                }`}>
                  {counts[id]}
                </span>
              </motion.button>
            ))}
          </div>
        </div>
      </section>

      {/* Interests Grid */}
      <section className="py-12">
        <div className="container mx-auto px-4">
          {filteredInterests.length === 0 ? (
            <EmptyState
              icon={Heart}
              title={filter === 'all' ? "No interests received yet" : `No ${filter} interests`}
              description={filter === 'all' 
                ? "When someone shows interest in your profile, you'll see them here. Keep your profile updated to attract more matches!"
                : `You don't have any ${filter} interests at the moment.`
              }
              actionLabel="Browse Profiles"
              actionPath="/search"
            />
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {filteredInterests.map((interest, index) => {
                const profile = profilesData.find(p => p.id === interest.fromProfileId);
                if (!profile) return null;

                return (
                  <div key={interest.id} className="relative">
                    {/* Message Preview */}
                    {interest.message && interest.status === 'pending' && (
                      <motion.div
                        initial={{ opacity: 0, y: -10 }}
                        animate={{ opacity: 1, y: 0 }}
                        className="mb-3 p-3 bg-white/70 backdrop-blur-sm rounded-xl border border-primary/10 shadow-soft"
                      >
                        <p className="text-sm text-muted-foreground italic">"{interest.message}"</p>
                      </motion.div>
                    )}
                    
                    <GlassProfileCard
                      profile={profile}
                      index={index}
                      isFavorite={favorites.includes(profile.id)}
                      onToggleFavorite={() => toggleFavorite(profile.id)}
                      interestStatus={interest.status}
                      onAccept={() => handleAccept(interest.id, profile.name)}
                      onReject={() => handleReject(interest.id, profile.name)}
                      canChat={canChat(profile.id)}
                      onMessage={() => handleChat(profile.id)}
                    />
                  </div>
                );
              })}
            </div>
          )}
        </div>
      </section>

      <Footer />
    </div>
  );
};

export default InterestReceived;
