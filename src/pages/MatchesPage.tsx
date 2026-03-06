import { useState, useMemo } from "react";
import Navbar from "@/components/Navbar";
import DashboardLayout from "@/components/DashboardLayout";
import { Button } from "@/components/ui/button";
import { Search, MapPin, Heart, Grid, List, Star, Briefcase, GraduationCap, ChevronDown, MessageCircle, Send, Eye, Clock, Sparkles, Users, Bell, TrendingUp, Flame } from "lucide-react";
import { profilesData, Profile } from "@/components/FeaturedProfiles";
import { useNavigate } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import ChoosePlanModal from "@/components/ChoosePlanModal";

type MatchProfile = Profile & { isOnline?: boolean };

const allProfiles: MatchProfile[] = [
  ...profilesData.map((p, i) => ({ ...p, isOnline: i % 3 === 0 })),
  {
    id: 7, name: "Riya Kapoor", age: 25, profession: "UI/UX Designer",
    education: "B.Des, NID Ahmedabad", location: "Bangalore, Karnataka",
    image: "https://images.unsplash.com/photo-1544005313-94ddf0286df2?w=400&h=500&fit=crop",
    isVerified: true, isPremium: false, compatibility: 89, isOnline: true,
  },
  {
    id: 8, name: "Nisha Singh", age: 27, profession: "Lawyer",
    education: "LLB, NLU Delhi", location: "Lucknow, UP",
    image: "https://images.unsplash.com/photo-1488426862026-3ee34a7d66df?w=400&h=500&fit=crop",
    isVerified: true, isPremium: true, compatibility: 91, isOnline: false,
  },
  {
    id: 9, name: "Divya Nair", age: 24, profession: "Fashion Designer",
    education: "B.Des, Pearl Academy", location: "Mumbai, Maharashtra",
    image: "https://images.unsplash.com/photo-1502823403499-6ccfcf4fb453?w=400&h=500&fit=crop",
    isVerified: true, isPremium: false, compatibility: 84, isOnline: true,
  },
  {
    id: 10, name: "Tanya Mehra", age: 26, profession: "Content Strategist",
    education: "MA English, JNU", location: "Delhi NCR",
    image: "https://images.unsplash.com/photo-1529626455594-4ff0802cfb7e?w=400&h=500&fit=crop",
    isVerified: true, isPremium: true, compatibility: 93, isOnline: false,
  },
  {
    id: 11, name: "Pooja Desai", age: 23, profession: "Graphic Designer",
    education: "BFA, MS University", location: "Vadodara, Gujarat",
    image: "https://images.unsplash.com/photo-1524504388940-b1c1722653e1?w=400&h=600&fit=crop",
    isVerified: true, isPremium: false, compatibility: 86, isOnline: true,
  },
];

const FilterSelect = ({ icon, label, options, value, onChange }: { icon: React.ReactNode; label: string; options: string[]; value: string; onChange: (v: string) => void }) => (
  <div>
    <div className="flex items-center gap-2 text-primary font-serif font-semibold mb-2">
      {icon} {label}
    </div>
    <select
      value={value}
      onChange={(e) => onChange(e.target.value)}
      className="w-full px-3 py-2.5 rounded-lg border border-primary/10 text-sm bg-card text-foreground focus:ring-2 focus:ring-primary/20 transition-all"
    >
      {options.map(o => <option key={o} value={o}>{o}</option>)}
    </select>
  </div>
);

const AGE_OPTIONS = ["Select age", "21-25", "26-30", "31-35", "36+"];
const LOCATION_OPTIONS = ["Select location", "Chennai", "Mumbai", "Delhi", "Bangalore", "Hyderabad"];

const MatchesPage = () => {
  const navigate = useNavigate();
  const [viewMode, setViewMode] = useState<"grid" | "list">("list");
  const [likedProfiles, setLikedProfiles] = useState<number[]>([]);
  const [planModalOpen, setPlanModalOpen] = useState(false);
  const [ageRange, setAgeRange] = useState(AGE_OPTIONS[0]);
  const [location, setLocation] = useState(LOCATION_OPTIONS[0]);
  const [availability, setAvailability] = useState<"All" | "Available" | "Offline">("All");
  const [profileType, setProfileType] = useState<"All" | "Premium" | "Free">("All");

  const toggleLike = (id: number) => {
    setLikedProfiles(prev => prev.includes(id) ? prev.filter(p => p !== id) : [...prev, id]);
  };

  const filteredProfiles = useMemo(() => {
    return allProfiles.filter((profile) => {
      if (ageRange && ageRange !== AGE_OPTIONS[0]) {
        const [min, max] = ageRange === "36+" ? [36, 120] : ageRange.split("-").map(Number);
        if (profile.age < min || (max !== 120 && profile.age > max)) return false;
      }
      if (location && location !== LOCATION_OPTIONS[0]) {
        if (!profile.location.toLowerCase().includes(location.toLowerCase())) return false;
      }
      if (availability === "Available" && !(profile as MatchProfile).isOnline) return false;
      if (availability === "Offline" && (profile as MatchProfile).isOnline) return false;
      if (profileType === "Premium" && !profile.isPremium) return false;
      if (profileType === "Free" && profile.isPremium) return false;
      return true;
    });
  }, [ageRange, location, availability, profileType]);

  return (
    <>
      <Navbar />
      <div className="pt-20">
        <DashboardLayout>
          <div className="space-y-6">
            {/* Header with notification */}
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
                    {filteredProfiles.length}
                  </span>
                </div>
                <div>
                  <h1 className="font-serif text-2xl md:text-3xl font-bold text-secondary">New Matches Found</h1>
                  <p className="text-muted-foreground text-sm flex items-center gap-1">
                    <Flame className="w-3.5 h-3.5 text-secondary" />
                    {filteredProfiles.length} compatible profiles waiting for you
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
                <span className="text-sm font-medium text-secondary-foreground">+5 new today</span>
              </motion.div>
            </motion.div>

            {/* Main Content - Sidebar + Profiles */}
            <div className="flex flex-col lg:flex-row gap-6">
              {/* Left Sidebar Filters */}
              <motion.div
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.1 }}
                className="lg:w-64 flex-shrink-0"
              >
                <div className="bg-card rounded-2xl shadow-card p-5 border border-primary/5 space-y-5 sticky top-28">
                  <FilterSelect icon={<Search className="w-4 h-4 text-primary" />} label="I'm looking for" options={["I'm looking for", "Bride", "Groom"]} value="I'm looking for" onChange={() => {}} />
                  <FilterSelect icon={<Clock className="w-4 h-4 text-primary" />} label="Age" options={AGE_OPTIONS} value={ageRange} onChange={setAgeRange} />
                  <FilterSelect icon={<Sparkles className="w-4 h-4 text-primary" />} label="Select Religion" options={["Religion", "Hindu", "Muslim", "Christian", "Sikh"]} value="Religion" onChange={() => {}} />
                  <FilterSelect icon={<MapPin className="w-4 h-4 text-primary" />} label="Location" options={LOCATION_OPTIONS} value={location} onChange={setLocation} />

                  <div>
                    <div className="flex items-center gap-2 text-primary font-serif font-semibold mb-2">
                      <Clock className="w-4 h-4" /> Availability
                    </div>
                    <div className="space-y-1.5 text-sm">
                      {(["All", "Available", "Offline"] as const).map(o => (
                        <label key={o} className="flex items-center gap-2 cursor-pointer py-1 hover:text-primary transition-colors">
                          <input type="radio" name="availability" checked={availability === o} onChange={() => setAvailability(o)} className="accent-primary" />
                          <span className="text-muted-foreground">{o}</span>
                        </label>
                      ))}
                    </div>
                  </div>

                  <div>
                    <div className="flex items-center gap-2 text-primary font-serif font-semibold mb-2">
                      <Users className="w-4 h-4" /> Profile
                    </div>
                    <div className="space-y-1.5 text-sm">
                      {(["All", "Premium", "Free"] as const).map(o => (
                        <label key={o} className="flex items-center gap-2 cursor-pointer py-1 hover:text-primary transition-colors">
                          <input type="radio" name="profile_type" checked={profileType === o} onChange={() => setProfileType(o)} className="accent-primary" />
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
                </div>
              </motion.div>

              {/* Right - Profiles */}
              <div className="flex-1 min-w-0">
                {/* Results Header */}
                <motion.div
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.15 }}
                  className="flex items-center justify-between mb-5 flex-wrap gap-3"
                >
                  <h2 className="font-serif text-lg font-bold text-foreground">
                    Showing <span className="text-secondary">{filteredProfiles.length}</span> profiles
                  </h2>
                  <div className="flex items-center gap-3">
                    <span className="text-sm text-muted-foreground">Sort by:</span>
                    <select className="px-3 py-2 rounded-lg border border-primary/10 text-sm bg-card">
                      <option>Most relative</option>
                      <option>Newest First</option>
                      <option>Best Match</option>
                    </select>
                    <div className="flex bg-card rounded-lg border border-primary/10 overflow-hidden">
                      <button onClick={() => setViewMode("grid")} className={`p-2.5 transition-colors ${viewMode === "grid" ? "bg-primary text-primary-foreground" : "hover:bg-accent"}`}>
                        <Grid className="w-4 h-4" />
                      </button>
                      <button onClick={() => setViewMode("list")} className={`p-2.5 transition-colors ${viewMode === "list" ? "bg-primary text-primary-foreground" : "hover:bg-accent"}`}>
                        <List className="w-4 h-4" />
                      </button>
                    </div>
                  </div>
                </motion.div>

                {/* Profile Cards */}
                <AnimatePresence mode="wait">
                  <motion.div
                    key={viewMode}
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    className={viewMode === "grid" ? "grid grid-cols-1 md:grid-cols-2 gap-5" : "space-y-5"}
                  >
                    {filteredProfiles.map((profile, index) => (
                      viewMode === "list" ? (
                        <MatchListCard key={profile.id} profile={profile} index={index} navigate={navigate} liked={likedProfiles.includes(profile.id)} onLike={() => toggleLike(profile.id)} onSendInterest={() => setPlanModalOpen(true)} isOnline={(profile as MatchProfile).isOnline} />
                      ) : (
                        <MatchGridCard key={profile.id} profile={profile} index={index} navigate={navigate} liked={likedProfiles.includes(profile.id)} onLike={() => toggleLike(profile.id)} onSendInterest={() => setPlanModalOpen(true)} />
                      )
                    ))}
                  </motion.div>
                </AnimatePresence>

                <motion.div
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ delay: 0.5 }}
                  className="text-center mt-10"
                >
                  <Button variant="outline" size="lg" className="group gap-2">
                    Load More Profiles
                    <ChevronDown className="w-5 h-5 group-hover:translate-y-1 transition-transform" />
                  </Button>
                </motion.div>
              </div>
            </div>
          </div>
        </DashboardLayout>
      </div>

      <ChoosePlanModal open={planModalOpen} onOpenChange={setPlanModalOpen} />
    </>
  );
};

const MatchListCard = ({ profile, index, navigate, liked, onLike, onSendInterest, isOnline: isOnlineProp }: { profile: Profile; index: number; navigate: any; liked: boolean; onLike: () => void; onSendInterest?: () => void; isOnline?: boolean }) => {
  const isOnline = isOnlineProp ?? index % 3 === 0;
  const isNew = index < 3;

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: index * 0.06, type: "spring", stiffness: 100 }}
      whileHover={{ y: -4, boxShadow: "0 20px 60px -15px hsl(330 60% 34% / 0.15)" }}
      className="flex flex-col md:flex-row md:items-stretch bg-card rounded-2xl overflow-hidden shadow-card border border-primary/5 cursor-pointer group relative"
      onClick={() => navigate(`/profile/${profile.id}`)}
    >
      {/* New badge */}
      {isNew && (
        <div className="absolute top-3 right-3 z-10 px-2.5 py-1 bg-secondary text-secondary-foreground text-[10px] font-bold rounded-full flex items-center gap-1 animate-pulse-soft">
          <Bell className="w-3 h-3" /> NEW
        </div>
      )}

      {/* Image - full width on mobile */}
      <div className="w-full md:w-56 lg:w-64 h-52 md:h-64 flex-shrink-0 relative overflow-hidden">
        <div className={`absolute top-3 left-3 z-10 w-3.5 h-3.5 rounded-full border-2 border-card ${isOnline ? "bg-green-500 animate-pulse-soft" : "bg-muted-foreground/40"}`} />
        <img src={profile.image} alt={profile.name} className="w-full h-full object-cover object-center group-hover:scale-105 transition-transform duration-700" />
        <div className={`absolute bottom-0 left-0 right-0 py-1.5 text-center text-xs font-medium text-primary-foreground ${isOnline ? "bg-green-600/90" : "bg-muted-foreground/70"}`}>
          {isOnline ? "Available Online" : `Last login 10 mins ago`}
        </div>
        <div className="absolute top-3 right-3 px-2 py-1 bg-card/95 backdrop-blur-sm rounded-full shadow-soft">
          <span className="text-xs font-bold text-gradient-primary">{profile.compatibility}%</span>
        </div>
      </div>

      {/* Info */}
      <div className="flex-1 p-3 sm:p-5 min-w-0 flex flex-col">
        <div className="flex items-start justify-between gap-2 mb-2">
          <h3 className="font-serif text-lg sm:text-xl font-bold text-primary group-hover:text-primary-dark transition-colors truncate min-w-0">{profile.name}</h3>
          <button type="button" onClick={(e) => { e.stopPropagation(); onLike(); }} className="text-muted-foreground hover:text-primary transition-all hover:scale-125 flex-shrink-0">
            <Heart className={`w-5 h-5 ${liked ? "fill-primary text-primary" : ""}`} />
          </button>
        </div>

        <div className="flex flex-wrap gap-1.5 mb-3">
          <span className="px-2.5 py-0.5 bg-foreground text-primary-foreground text-xs font-medium rounded-md">{profile.education.split(",")[0]}</span>
          <span className="px-2.5 py-0.5 bg-primary text-primary-foreground text-xs font-medium rounded-md">{profile.profession}</span>
          <span className="px-2.5 py-0.5 bg-secondary text-secondary-foreground text-xs font-medium rounded-md">{profile.age} Years old</span>
          <span className="px-2.5 py-0.5 bg-accent text-accent-foreground text-xs font-medium rounded-md">Height: 155Cms</span>
        </div>

        <div className="flex flex-wrap gap-2 mt-auto">
          <Button size="sm" variant="hero" className="gap-1 text-xs flex-1 sm:flex-initial min-w-[calc(50%-4px)] sm:min-w-0" onClick={(e) => e.stopPropagation()}>
            <MessageCircle className="w-3.5 h-3.5 shrink-0" /> Chat now
          </Button>
          <Button size="sm" variant="outline" className="gap-1 text-xs flex-1 sm:flex-initial min-w-[calc(50%-4px)] sm:min-w-0" onClick={(e) => e.stopPropagation()}>
            WhatsApp
          </Button>
          <Button size="sm" variant="outline" className="gap-1 text-xs flex-1 sm:flex-initial min-w-[calc(50%-4px)] sm:min-w-0" onClick={(e) => { e.stopPropagation(); onSendInterest?.(); }}>
            <Send className="w-3.5 h-3.5 shrink-0" /> Send interest
          </Button>
        </div>
      </div>
    </motion.div>
  );
};

const MatchGridCard = ({ profile, index, navigate, liked, onLike, onSendInterest }: { profile: Profile; index: number; navigate: any; liked: boolean; onLike: () => void; onSendInterest?: () => void }) => {
  const isNew = index < 3;
  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.95 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ delay: index * 0.06, type: "spring" }}
      whileHover={{ y: -6, scale: 1.02 }}
      className="bg-card rounded-2xl overflow-hidden shadow-card border border-primary/5 cursor-pointer group relative"
      onClick={() => navigate(`/profile/${profile.id}`)}
    >
      {isNew && (
        <div className="absolute top-3 left-3 z-10 px-2.5 py-1 bg-secondary text-secondary-foreground text-[10px] font-bold rounded-full flex items-center gap-1 animate-pulse-soft">
          <Bell className="w-3 h-3" /> NEW
        </div>
      )}
      <div className="relative h-56 overflow-hidden">
        <img src={profile.image} alt={profile.name} className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700" />
        <div className="absolute inset-0 bg-gradient-to-t from-foreground/60 via-transparent to-transparent" />
        {profile.isPremium && (
          <span className="absolute top-3 right-3 px-2 py-1 bg-secondary text-secondary-foreground text-xs font-bold rounded-full flex items-center gap-1">
            <Star className="w-3 h-3 fill-current" /> Premium
          </span>
        )}
        <button onClick={(e) => { e.stopPropagation(); onLike(); }} className={`absolute top-3 ${isNew ? "left-20" : "left-3"} w-9 h-9 rounded-full flex items-center justify-center transition-all hover:scale-110 ${liked ? "bg-primary" : "bg-card/90"}`}>
          <Heart className={`w-4 h-4 ${liked ? "text-primary-foreground fill-primary-foreground" : "text-primary"}`} />
        </button>
        <div className="absolute bottom-3 right-3 px-2.5 py-1 bg-card/90 rounded-full text-xs font-bold text-gradient-primary shadow-soft">{profile.compatibility}% Match</div>
      </div>
      <div className="p-4">
        <h3 className="font-serif text-lg font-bold text-foreground group-hover:text-primary transition-colors">{profile.name}</h3>
        <p className="text-sm text-muted-foreground mb-2">{profile.age} years</p>
        <div className="space-y-1.5">
          <div className="flex items-center gap-2 text-sm text-muted-foreground"><Briefcase className="w-4 h-4 text-primary/60" />{profile.profession}</div>
          <div className="flex items-center gap-2 text-sm text-muted-foreground"><MapPin className="w-4 h-4 text-primary/60" />{profile.location}</div>
        </div>
      </div>
    </motion.div>
  );
};

export default MatchesPage;
