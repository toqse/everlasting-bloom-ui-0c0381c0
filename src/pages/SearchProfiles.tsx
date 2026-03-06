import { useState } from "react";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { Button } from "@/components/ui/button";
import { Search, MapPin, Heart, Star, Briefcase, ChevronDown, MessageCircle, Send, Clock, Sparkles, Users } from "lucide-react";
import { profilesData, Profile } from "@/components/FeaturedProfiles";
import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import ChoosePlanModal from "@/components/ChoosePlanModal";
import ProfileViewDrawer from "@/components/ProfileViewDrawer";

// Extended profiles
const allProfiles: Profile[] = [
  ...profilesData,
  {
    id: 7, name: "Riya Kapoor", age: 25, profession: "UI/UX Designer",
    education: "B.Des, NID Ahmedabad", location: "Bangalore, Karnataka",
    image: "https://images.unsplash.com/photo-1544005313-94ddf0286df2?w=400&h=500&fit=crop",
    isVerified: true, isPremium: false, compatibility: 89,
  },
  {
    id: 8, name: "Nisha Singh", age: 27, profession: "Lawyer",
    education: "LLB, NLU Delhi", location: "Lucknow, UP",
    image: "https://images.unsplash.com/photo-1488426862026-3ee34a7d66df?w=400&h=500&fit=crop",
    isVerified: true, isPremium: true, compatibility: 91,
  },
  {
    id: 9, name: "Divya Nair", age: 24, profession: "Fashion Designer",
    education: "B.Des, Pearl Academy", location: "Mumbai, Maharashtra",
    image: "https://images.unsplash.com/photo-1502823403499-6ccfcf4fb453?w=400&h=500&fit=crop",
    isVerified: true, isPremium: false, compatibility: 84,
  },
];

const SearchProfiles = () => {
  const navigate = useNavigate();
  const [likedProfiles, setLikedProfiles] = useState<number[]>([]);
  const [planModalOpen, setPlanModalOpen] = useState(false);
  const [viewProfile, setViewProfile] = useState<Profile | null>(null);

  const toggleLike = (id: number) => {
    setLikedProfiles(prev => prev.includes(id) ? prev.filter(p => p !== id) : [...prev, id]);
  };

  return (
    <div className="min-h-screen bg-background">
      <Navbar />

      {/* Hero Banner */}
      <section className="pt-24 sm:pt-28 pb-8 sm:pb-12 bg-gradient-romantic relative overflow-hidden">
        <div className="absolute inset-0">
          <div className="absolute top-10 left-10 w-40 h-40 bg-secondary/20 rounded-full blur-3xl animate-float" />
          <div className="absolute bottom-10 right-10 w-60 h-60 bg-primary/15 rounded-full blur-3xl animate-float-delayed" />
        </div>
        <div className="container mx-auto px-4 relative z-10 text-center">
          <h1 className="font-serif text-3xl sm:text-4xl md:text-5xl font-bold text-foreground mb-2 animate-fade-in-up">
            Lakhs of <span className="text-gradient-gold">Happy Marriages</span>
          </h1>
          <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.3 }}>
            <Button variant="hero" size="lg" className="mt-4 gap-2" onClick={() => navigate("/auth")}>
              Join now for Free 💍
            </Button>
          </motion.div>
        </div>
      </section>

      {/* Main Content */}
      <section className="py-12 relative">
        {/* Decorative leaves */}
        <div className="absolute top-0 left-0 w-24 h-32 opacity-20 pointer-events-none">
          <img src="https://rn53themes.net/themes/matrimo/images/leafs-min.png" alt="" className="w-full h-full object-contain" />
        </div>
        <div className="absolute bottom-0 right-0 w-28 h-36 opacity-20 pointer-events-none transform scale-x-[-1]">
          <img src="https://rn53themes.net/themes/matrimo/images/leafs-min.png" alt="" className="w-full h-full object-contain" />
        </div>

        <div className="container mx-auto px-3 sm:px-4">
          <div className="flex flex-col lg:flex-row gap-6 lg:gap-8">
            {/* Left Sidebar Filters */}
            <div className="lg:w-72 flex-shrink-0 w-full max-w-full">
              <motion.div initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }} className="bg-card rounded-2xl shadow-card p-4 sm:p-6 border border-primary/5 lg:sticky lg:top-24 space-y-6">
                <FilterSelect icon={<Search className="w-4 h-4 text-primary" />} label="I'm looking for" options={["I'm looking for", "Bride", "Groom"]} />
                <FilterSelect icon={<Clock className="w-4 h-4 text-primary" />} label="Age" options={["Select age", "21-25", "26-30", "31-35", "36+"]} />
                <FilterSelect icon={<Sparkles className="w-4 h-4 text-primary" />} label="Select Religion" options={["Religion", "Hindu", "Muslim", "Christian", "Sikh"]} />
                <FilterSelect icon={<MapPin className="w-4 h-4 text-primary" />} label="Location" options={["Chennai", "Mumbai", "Delhi", "Bangalore", "Hyderabad"]} />

                <div>
                  <div className="flex items-center gap-2 text-primary font-serif font-semibold mb-2">
                    <Clock className="w-4 h-4" /> Availability
                  </div>
                  <div className="space-y-1 text-sm">
                    {["All", "Available", "Offline"].map(o => (
                      <label key={o} className="flex items-center gap-2 cursor-pointer py-1">
                        <input type="radio" name="availability" defaultChecked={o === "All"} className="accent-primary" />
                        <span className="text-muted-foreground">{o}</span>
                      </label>
                    ))}
                  </div>
                </div>

                <div>
                  <div className="flex items-center gap-2 text-primary font-serif font-semibold mb-2">
                    <Users className="w-4 h-4" /> Profile
                  </div>
                  <div className="space-y-1 text-sm">
                    {["All", "Premium", "Free"].map(o => (
                      <label key={o} className="flex items-center gap-2 cursor-pointer py-1">
                        <input type="radio" name="profile_type" defaultChecked={o === "All"} className="accent-primary" />
                        <span className="text-muted-foreground">{o}</span>
                      </label>
                    ))}
                  </div>
                </div>

                {/* CTA Box */}
                <div className="bg-primary rounded-2xl p-5 text-center text-primary-foreground">
                  <h4 className="font-serif text-lg font-bold mb-1">What are you looking for?</h4>
                  <p className="text-xs opacity-80 mb-3">We will help to arrange the best match to you</p>
                  <Button variant="gold" size="sm" className="w-full">Send your queries</Button>
                </div>
              </motion.div>
            </div>

            {/* Right - Profiles */}
            <div className="flex-1">
              {/* Results Header */}
              <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 mb-4 sm:mb-6">
                <h2 className="font-serif text-lg sm:text-xl font-bold text-foreground">
                  Showing <span className="text-secondary">{allProfiles.length}</span> profiles
                </h2>
                <div className="flex items-center gap-3">
                  <span className="text-sm text-muted-foreground shrink-0">Sort by:</span>
                  <select className="flex-1 sm:flex-none min-w-0 px-3 py-2 rounded-lg border border-primary/10 text-sm bg-card">
                    <option>Most relative</option>
                    <option>Newest First</option>
                    <option>Best Match</option>
                  </select>
                </div>
              </div>

              {/* Profiles - list/table format only */}
              <div className="space-y-4 sm:space-y-6">
                {allProfiles.map((profile, index) => (
                  <ListProfileCard key={profile.id} profile={profile} index={index} navigate={navigate} liked={likedProfiles.includes(profile.id)} onLike={() => toggleLike(profile.id)} onSendInterest={() => setPlanModalOpen(true)} onMoreDetails={() => setViewProfile(profile)} />
                ))}
              </div>

              <div className="text-center mt-12">
                <Button variant="outline" size="lg" className="group">
                  Load More Profiles
                  <ChevronDown className="w-5 h-5 group-hover:translate-y-1 transition-transform" />
                </Button>
              </div>
            </div>
          </div>
        </div>
      </section>

      <ChoosePlanModal open={planModalOpen} onOpenChange={setPlanModalOpen} />
      <ProfileViewDrawer open={!!viewProfile} onOpenChange={(o) => !o && setViewProfile(null)} profile={viewProfile} onSendInterest={() => { setPlanModalOpen(true); setViewProfile(null); }} />

      <Footer />
    </div>
  );
};

const FilterSelect = ({ icon, label, options }: { icon: React.ReactNode; label: string; options: string[] }) => (
  <div>
    <div className="flex items-center gap-2 text-primary font-serif font-semibold mb-2">
      {icon} {label}
    </div>
    <select className="w-full px-3 py-2.5 rounded-lg border border-primary/10 text-sm bg-card text-foreground">
      {options.map(o => <option key={o}>{o}</option>)}
    </select>
  </div>
);

const ListProfileCard = ({ profile, index, liked, onLike, onSendInterest, onMoreDetails }: { profile: Profile; index: number; navigate: any; liked: boolean; onLike: () => void; onSendInterest?: () => void; onMoreDetails?: () => void }) => {
  const isOnline = index % 3 === 0;
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: index * 0.05 }}
      className="flex flex-col md:flex-row md:items-start bg-card rounded-2xl overflow-hidden shadow-card border border-primary/5 hover-lift group"
    >
      {/* Image - full width on mobile, fixed width on md+ */}
      <div
        className="w-full md:w-64 h-52 sm:h-56 md:h-64 flex-shrink-0 relative overflow-hidden bg-muted/30 cursor-pointer"
        onClick={(e) => { e.stopPropagation(); onMoreDetails?.(); }}
      >
        <div className={`absolute top-3 left-3 z-10 w-3.5 h-3.5 rounded-full border-2 border-card ${isOnline ? "bg-green-500" : "bg-muted-foreground/40"}`} />
        <img src={profile.image} alt={profile.name} className="w-full h-full object-cover object-center group-hover:scale-105 transition-transform duration-500" />
        <div className={`absolute bottom-0 left-0 right-0 py-1.5 text-center text-xs font-medium text-primary-foreground ${isOnline ? "bg-green-600/90" : "bg-muted-foreground/70"}`}>
          {isOnline ? "Available Online" : "I'll be available on 10:00 AM"}
        </div>
      </div>

      {/* Info - compact layout */}
      <div className="p-3 sm:p-4 flex flex-col min-w-0 flex-1">
        <div className="flex items-start justify-between gap-2 mb-2">
          <h3 className="font-serif text-lg sm:text-xl font-bold text-primary group-hover:text-primary-dark transition-colors truncate min-w-0">{profile.name}</h3>
          <button type="button" onClick={(e) => { e.stopPropagation(); onLike(); }} className="text-muted-foreground hover:text-primary transition-colors flex-shrink-0" aria-label={liked ? "Remove from favourites" : "Add to favourites"}>
            <Heart className={`w-5 h-5 ${liked ? "fill-primary text-primary" : ""}`} />
          </button>
        </div>

        {/* Tags - wrap on small screens */}
        <div className="flex flex-wrap gap-1.5 mb-2">
          <span className="px-2.5 py-0.5 bg-foreground text-primary-foreground text-xs font-medium rounded-md">{profile.education.split(",")[0]}</span>
          <span className="px-2.5 py-0.5 bg-primary text-primary-foreground text-xs font-medium rounded-md">{profile.profession}</span>
          <span className="px-2.5 py-0.5 bg-secondary text-secondary-foreground text-xs font-medium rounded-md">{profile.age} Years old</span>
          <span className="px-2.5 py-0.5 bg-accent text-accent-foreground text-xs font-medium rounded-md">Height: 155Cms</span>
        </div>

        {/* Action buttons - wrap, full width on mobile for easier tap */}
        <div className="flex flex-wrap gap-2 mt-auto">
          <Button size="sm" variant="hero" className="gap-1 text-xs flex-1 sm:flex-initial min-w-[calc(50%-4px)] sm:min-w-0" onClick={(e) => { e.stopPropagation(); }}>
            <MessageCircle className="w-3.5 h-3.5 shrink-0" /> Chat now
          </Button>
          <Button size="sm" variant="outline" className="gap-1 text-xs flex-1 sm:flex-initial min-w-[calc(50%-4px)] sm:min-w-0" onClick={(e) => { e.stopPropagation(); }}>
            WhatsApp
          </Button>
          <Button size="sm" variant="outline" className="gap-1 text-xs flex-1 sm:flex-initial min-w-[calc(50%-4px)] sm:min-w-0" onClick={(e) => { e.stopPropagation(); onSendInterest?.(); }}>
            <Send className="w-3.5 h-3.5 shrink-0" /> Send interest
          </Button>
          <Button size="sm" variant="hero" className="gap-1 text-xs flex-1 sm:flex-initial min-w-[calc(50%-4px)] sm:min-w-0" onClick={(e) => { e.stopPropagation(); onMoreDetails?.(); }}>
            More details
          </Button>
        </div>
      </div>
    </motion.div>
  );
};

export default SearchProfiles;
