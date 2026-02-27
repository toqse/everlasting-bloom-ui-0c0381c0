import { useState } from "react";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { Button } from "@/components/ui/button";
import { Search, MapPin, Heart, Filter, Grid, List, Star, Briefcase, GraduationCap, ChevronDown, MessageCircle, Send, Eye, Clock, Sparkles, Users } from "lucide-react";
import { profilesData, Profile } from "@/components/FeaturedProfiles";
import { useNavigate } from "react-router-dom";
import { useAuthStore } from "@/stores/authStore";
import { motion } from "framer-motion";

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
  const { isLoggedIn } = useAuthStore();
  const [viewMode, setViewMode] = useState<"grid" | "list">(isLoggedIn ? "list" : "grid");
  const [likedProfiles, setLikedProfiles] = useState<number[]>([]);

  const toggleLike = (id: number) => {
    setLikedProfiles(prev => prev.includes(id) ? prev.filter(p => p !== id) : [...prev, id]);
  };

  return (
    <div className="min-h-screen bg-background">
      <Navbar />

      {/* Hero Banner */}
      <section className="pt-28 pb-12 bg-gradient-romantic relative overflow-hidden">
        <div className="absolute inset-0">
          <div className="absolute top-10 left-10 w-40 h-40 bg-secondary/20 rounded-full blur-3xl animate-float" />
          <div className="absolute bottom-10 right-10 w-60 h-60 bg-primary/15 rounded-full blur-3xl animate-float-delayed" />
        </div>
        <div className="container mx-auto px-4 relative z-10 text-center">
          <h1 className="font-serif text-4xl md:text-5xl font-bold text-foreground mb-2 animate-fade-in-up">
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

        <div className="container mx-auto px-4">
          <div className="flex flex-col lg:flex-row gap-8">
            {/* Left Sidebar Filters */}
            <div className="lg:w-72 flex-shrink-0">
              <motion.div initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }} className="bg-card rounded-2xl shadow-card p-6 border border-primary/5 sticky top-24 space-y-6">
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
              <div className="flex items-center justify-between mb-6">
                <h2 className="font-serif text-xl font-bold text-foreground">
                  Showing <span className="text-secondary">{allProfiles.length}</span> profiles
                </h2>
                <div className="flex items-center gap-3">
                  <span className="text-sm text-muted-foreground">Sort by:</span>
                  <select className="px-3 py-2 rounded-lg border border-primary/10 text-sm bg-card">
                    <option>Most relative</option>
                    <option>Newest First</option>
                    <option>Best Match</option>
                  </select>
                  <div className="flex bg-card rounded-lg border border-primary/10 overflow-hidden">
                    <button onClick={() => setViewMode("grid")} className={`p-2.5 ${viewMode === "grid" ? "bg-primary text-primary-foreground" : ""}`}>
                      <Grid className="w-4 h-4" />
                    </button>
                    <button onClick={() => setViewMode("list")} className={`p-2.5 ${viewMode === "list" ? "bg-primary text-primary-foreground" : ""}`}>
                      <List className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              </div>

              {/* Profiles */}
              <div className={`space-y-6 ${viewMode === "grid" ? "grid grid-cols-1 md:grid-cols-2 gap-6 space-y-0" : ""}`}>
                {allProfiles.map((profile, index) => (
                  viewMode === "list" ? (
                    <ListProfileCard key={profile.id} profile={profile} index={index} navigate={navigate} liked={likedProfiles.includes(profile.id)} onLike={() => toggleLike(profile.id)} />
                  ) : (
                    <GridProfileCard key={profile.id} profile={profile} index={index} navigate={navigate} liked={likedProfiles.includes(profile.id)} onLike={() => toggleLike(profile.id)} />
                  )
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

const ListProfileCard = ({ profile, index, navigate, liked, onLike }: { profile: Profile; index: number; navigate: any; liked: boolean; onLike: () => void }) => {
  const isOnline = index % 3 === 0;
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: index * 0.05 }}
      className="flex bg-card rounded-2xl overflow-hidden shadow-card border border-primary/5 hover-lift cursor-pointer group"
      onClick={() => navigate(`/profile/${profile.id}`)}
    >
      {/* Image */}
      <div className="w-64 flex-shrink-0 relative overflow-hidden">
        {/* Online indicator */}
        <div className={`absolute top-3 left-3 z-10 w-3.5 h-3.5 rounded-full border-2 border-card ${isOnline ? "bg-green-500" : "bg-muted-foreground/40"}`} />
        <img src={profile.image} alt={profile.name} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500 min-h-[220px]" />
        {/* Bottom status bar */}
        <div className={`absolute bottom-0 left-0 right-0 py-1.5 text-center text-xs font-medium text-primary-foreground ${isOnline ? "bg-green-600/90" : "bg-muted-foreground/70"}`}>
          {isOnline ? "Available Online" : `I'll be available on 10:00 AM`}
        </div>
      </div>

      {/* Info */}
      <div className="flex-1 p-6">
        <div className="flex items-start justify-between mb-3">
          <h3 className="font-serif text-2xl font-bold text-primary group-hover:text-primary-dark transition-colors">{profile.name}</h3>
          <button onClick={(e) => { e.stopPropagation(); onLike(); }} className="text-muted-foreground hover:text-primary transition-colors">
            <Heart className={`w-5 h-5 ${liked ? "fill-primary text-primary" : ""}`} />
          </button>
        </div>

        {/* Tags */}
        <div className="flex flex-wrap gap-2 mb-4">
          <span className="px-3 py-1 bg-foreground text-primary-foreground text-xs font-medium rounded-md">{profile.education.split(",")[0]}</span>
          <span className="px-3 py-1 bg-primary text-primary-foreground text-xs font-medium rounded-md">{profile.profession}</span>
          <span className="px-3 py-1 bg-secondary text-secondary-foreground text-xs font-medium rounded-md">{profile.age} Years old</span>
          <span className="px-3 py-1 bg-accent text-accent-foreground text-xs font-medium rounded-md">Height: 155Cms</span>
        </div>

        {/* Action buttons */}
        <div className="flex flex-wrap gap-2">
          <Button size="sm" variant="hero" className="gap-1 text-xs" onClick={(e) => { e.stopPropagation(); }}>
            <MessageCircle className="w-3.5 h-3.5" /> Chat now
          </Button>
          <Button size="sm" variant="outline" className="gap-1 text-xs" onClick={(e) => { e.stopPropagation(); }}>
            WhatsApp
          </Button>
          <Button size="sm" variant="outline" className="gap-1 text-xs" onClick={(e) => { e.stopPropagation(); }}>
            <Send className="w-3.5 h-3.5" /> Send interest
          </Button>
          <Button size="sm" variant="outline" className="gap-1 text-xs" onClick={(e) => { e.stopPropagation(); navigate(`/profile/${profile.id}`); }}>
            More details
          </Button>
        </div>
      </div>
    </motion.div>
  );
};

const GridProfileCard = ({ profile, index, navigate, liked, onLike }: { profile: Profile; index: number; navigate: any; liked: boolean; onLike: () => void }) => {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: index * 0.05 }}
      className="bg-card rounded-2xl overflow-hidden shadow-card border border-primary/5 hover-lift cursor-pointer group"
      onClick={() => navigate(`/profile/${profile.id}`)}
    >
      <div className="relative h-64 overflow-hidden">
        <img src={profile.image} alt={profile.name} className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500" />
        <div className="absolute inset-0 bg-gradient-to-t from-foreground/60 via-transparent to-transparent" />
        {profile.isPremium && (
          <span className="absolute top-3 left-3 px-2 py-1 bg-secondary text-secondary-foreground text-xs font-bold rounded-full flex items-center gap-1">
            <Star className="w-3 h-3 fill-current" /> Premium
          </span>
        )}
        <button onClick={(e) => { e.stopPropagation(); onLike(); }} className={`absolute top-3 right-3 w-9 h-9 rounded-full flex items-center justify-center transition-all hover:scale-110 ${liked ? "bg-primary" : "bg-card/90"}`}>
          <Heart className={`w-4 h-4 ${liked ? "text-primary-foreground fill-primary-foreground" : "text-primary"}`} />
        </button>
        <div className="absolute bottom-3 right-3 px-2 py-1 bg-card/90 rounded-full text-xs font-bold text-primary">{profile.compatibility}% Match</div>
      </div>
      <div className="p-4">
        <h3 className="font-serif text-lg font-bold text-foreground">{profile.name}</h3>
        <p className="text-sm text-muted-foreground mb-2">{profile.age} years</p>
        <div className="space-y-1.5">
          <div className="flex items-center gap-2 text-sm text-muted-foreground"><Briefcase className="w-4 h-4 text-primary/60" />{profile.profession}</div>
          <div className="flex items-center gap-2 text-sm text-muted-foreground"><MapPin className="w-4 h-4 text-primary/60" />{profile.location}</div>
        </div>
      </div>
    </motion.div>
  );
};

export default SearchProfiles;
