import { useState } from "react";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { Button } from "@/components/ui/button";
import { Search, MapPin, Calendar, Heart, Users, Sparkles, Filter, Grid, List, Star, Briefcase, GraduationCap, ChevronDown, X } from "lucide-react";
import { profilesData, Profile } from "@/components/FeaturedProfiles";
import { useNavigate } from "react-router-dom";

// Extended profiles for the search page
const allProfiles: Profile[] = [
  ...profilesData,
  {
    id: 7,
    name: "Riya Kapoor",
    age: 25,
    profession: "UI/UX Designer",
    education: "B.Des, NID Ahmedabad",
    location: "Bangalore, Karnataka",
    image: "https://images.unsplash.com/photo-1544005313-94ddf0286df2?w=400&h=500&fit=crop",
    isVerified: true,
    isPremium: false,
    compatibility: 89,
  },
  {
    id: 8,
    name: "Nisha Singh",
    age: 27,
    profession: "Lawyer",
    education: "LLB, NLU Delhi",
    location: "Lucknow, UP",
    image: "https://images.unsplash.com/photo-1488426862026-3ee34a7d66df?w=400&h=500&fit=crop",
    isVerified: true,
    isPremium: true,
    compatibility: 91,
  },
  {
    id: 9,
    name: "Divya Nair",
    age: 24,
    profession: "Fashion Designer",
    education: "B.Des, Pearl Academy",
    location: "Mumbai, Maharashtra",
    image: "https://images.unsplash.com/photo-1502823403499-6ccfcf4fb453?w=400&h=500&fit=crop",
    isVerified: true,
    isPremium: false,
    compatibility: 84,
  },
];

const SearchProfiles = () => {
  const navigate = useNavigate();
  const [viewMode, setViewMode] = useState<"grid" | "list">("grid");
  const [likedProfiles, setLikedProfiles] = useState<number[]>([]);
  const [showFilters, setShowFilters] = useState(false);
  const [filters, setFilters] = useState({
    lookingFor: "Bride",
    ageMin: "21",
    ageMax: "30",
    religion: "All",
    location: "All",
  });

  const toggleLike = (id: number) => {
    setLikedProfiles(prev => 
      prev.includes(id) ? prev.filter(p => p !== id) : [...prev, id]
    );
  };

  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      
      {/* Hero Section */}
      <section className="pt-28 pb-12 bg-gradient-romantic relative overflow-hidden">
        <div className="absolute inset-0">
          <div className="absolute top-10 left-10 w-40 h-40 bg-secondary/20 rounded-full blur-3xl animate-float" />
          <div className="absolute bottom-10 right-10 w-60 h-60 bg-primary/15 rounded-full blur-3xl animate-float-delayed" />
        </div>

        {/* Floating Sparkles */}
        {[...Array(6)].map((_, i) => (
          <Sparkles
            key={i}
            className="absolute text-secondary/30 animate-sparkle"
            style={{
              left: `${10 + i * 15}%`,
              top: `${20 + (i % 2) * 40}%`,
              width: `${16 + i * 3}px`,
              animationDelay: `${i * 0.4}s`,
            }}
          />
        ))}

        <div className="container mx-auto px-4 relative z-10">
          <div className="text-center mb-10">
            <h1 className="font-serif text-4xl md:text-5xl font-bold text-foreground mb-4 animate-fade-in-up">
              Find Your <span className="text-gradient-primary">Perfect Match</span>
            </h1>
            <p className="text-muted-foreground max-w-xl mx-auto animate-fade-in-up" style={{ animationDelay: "0.1s" }}>
              Browse through thousands of verified profiles and find your soulmate
            </p>
          </div>

          {/* Search Card */}
          <div className="max-w-5xl mx-auto bg-white/90 backdrop-blur-sm rounded-3xl p-6 md:p-8 shadow-elevated border border-primary/5 animate-scale-in">
            <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
              <div className="col-span-2 md:col-span-1">
                <label className="block text-sm font-medium text-foreground mb-2">Looking For</label>
                <select 
                  value={filters.lookingFor}
                  onChange={(e) => setFilters({...filters, lookingFor: e.target.value})}
                  className="w-full px-4 py-3 rounded-xl border-2 border-primary/10 focus:border-primary transition-colors"
                >
                  <option>Bride</option>
                  <option>Groom</option>
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium text-foreground mb-2">Age From</label>
                <select 
                  value={filters.ageMin}
                  onChange={(e) => setFilters({...filters, ageMin: e.target.value})}
                  className="w-full px-4 py-3 rounded-xl border-2 border-primary/10 focus:border-primary transition-colors"
                >
                  {[...Array(20)].map((_, i) => (
                    <option key={i} value={21 + i}>{21 + i}</option>
                  ))}
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium text-foreground mb-2">Age To</label>
                <select 
                  value={filters.ageMax}
                  onChange={(e) => setFilters({...filters, ageMax: e.target.value})}
                  className="w-full px-4 py-3 rounded-xl border-2 border-primary/10 focus:border-primary transition-colors"
                >
                  {[...Array(20)].map((_, i) => (
                    <option key={i} value={21 + i}>{21 + i}</option>
                  ))}
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium text-foreground mb-2">Religion</label>
                <select 
                  value={filters.religion}
                  onChange={(e) => setFilters({...filters, religion: e.target.value})}
                  className="w-full px-4 py-3 rounded-xl border-2 border-primary/10 focus:border-primary transition-colors"
                >
                  <option>All</option>
                  <option>Hindu</option>
                  <option>Muslim</option>
                  <option>Christian</option>
                  <option>Sikh</option>
                </select>
              </div>
              <div className="col-span-2 md:col-span-1 flex items-end">
                <Button variant="hero" className="w-full gap-2">
                  <Search className="w-4 h-4" />
                  Search
                </Button>
              </div>
            </div>

            {/* Advanced Filters Toggle */}
            <button
              onClick={() => setShowFilters(!showFilters)}
              className="flex items-center gap-2 mt-4 text-primary hover:text-primary-dark transition-colors"
            >
              <Filter className="w-4 h-4" />
              <span className="text-sm font-medium">Advanced Filters</span>
              <ChevronDown className={`w-4 h-4 transition-transform ${showFilters ? "rotate-180" : ""}`} />
            </button>

            {/* Advanced Filters Panel */}
            {showFilters && (
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mt-4 pt-4 border-t border-primary/10 animate-fade-in-up">
                <div>
                  <label className="block text-sm font-medium text-foreground mb-2">Education</label>
                  <select className="w-full px-4 py-2.5 rounded-xl border-2 border-primary/10 focus:border-primary transition-colors text-sm">
                    <option>Any</option>
                    <option>Bachelor's</option>
                    <option>Master's</option>
                    <option>Doctorate</option>
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium text-foreground mb-2">Profession</label>
                  <select className="w-full px-4 py-2.5 rounded-xl border-2 border-primary/10 focus:border-primary transition-colors text-sm">
                    <option>Any</option>
                    <option>Engineer</option>
                    <option>Doctor</option>
                    <option>Business</option>
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium text-foreground mb-2">Income</label>
                  <select className="w-full px-4 py-2.5 rounded-xl border-2 border-primary/10 focus:border-primary transition-colors text-sm">
                    <option>Any</option>
                    <option>5-10 LPA</option>
                    <option>10-20 LPA</option>
                    <option>20+ LPA</option>
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium text-foreground mb-2">Marital Status</label>
                  <select className="w-full px-4 py-2.5 rounded-xl border-2 border-primary/10 focus:border-primary transition-colors text-sm">
                    <option>Never Married</option>
                    <option>Divorced</option>
                    <option>Widowed</option>
                  </select>
                </div>
              </div>
            )}
          </div>
        </div>
      </section>

      {/* Results Section */}
      <section className="py-12 bg-white">
        <div className="container mx-auto px-4">
          {/* Results Header */}
          <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4 mb-8">
            <div>
              <h2 className="font-serif text-2xl font-bold text-foreground">
                {allProfiles.length} Profiles Found
              </h2>
              <p className="text-muted-foreground text-sm">Based on your preferences</p>
            </div>
            <div className="flex items-center gap-4">
              <div className="flex items-center gap-2 bg-accent-rose rounded-xl p-1">
                <button
                  onClick={() => setViewMode("grid")}
                  className={`p-2 rounded-lg transition-all ${viewMode === "grid" ? "bg-white shadow-soft" : ""}`}
                >
                  <Grid className="w-5 h-5 text-primary" />
                </button>
                <button
                  onClick={() => setViewMode("list")}
                  className={`p-2 rounded-lg transition-all ${viewMode === "list" ? "bg-white shadow-soft" : ""}`}
                >
                  <List className="w-5 h-5 text-primary" />
                </button>
              </div>
              <select className="px-4 py-2 rounded-xl border-2 border-primary/10 focus:border-primary transition-colors text-sm">
                <option>Newest First</option>
                <option>Best Match</option>
                <option>Recently Active</option>
              </select>
            </div>
          </div>

          {/* Profiles Grid/List */}
          <div className={`grid gap-6 ${viewMode === "grid" ? "grid-cols-1 md:grid-cols-2 lg:grid-cols-3" : "grid-cols-1"}`}>
            {allProfiles.map((profile, index) => (
              <div
                key={profile.id}
                className={`bg-white rounded-2xl overflow-hidden shadow-card border border-primary/5 hover-lift cursor-pointer group animate-fade-in-up ${
                  viewMode === "list" ? "flex" : ""
                }`}
                style={{ animationDelay: `${index * 0.05}s` }}
                onClick={() => navigate(`/profile/${profile.id}`)}
              >
                {/* Image */}
                <div className={`relative overflow-hidden ${viewMode === "list" ? "w-48 flex-shrink-0" : "h-64"}`}>
                  <img
                    src={profile.image}
                    alt={profile.name}
                    className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent" />
                  
                  {/* Badges */}
                  <div className="absolute top-3 left-3 flex gap-2">
                    {profile.isPremium && (
                      <span className="px-2 py-1 bg-secondary text-secondary-foreground text-xs font-bold rounded-full flex items-center gap-1">
                        <Star className="w-3 h-3 fill-current" /> Premium
                      </span>
                    )}
                  </div>

                  {/* Like Button */}
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      toggleLike(profile.id);
                    }}
                    className={`absolute top-3 right-3 w-9 h-9 rounded-full flex items-center justify-center transition-all hover:scale-110 ${
                      likedProfiles.includes(profile.id)
                        ? "bg-primary"
                        : "bg-white/90"
                    }`}
                  >
                    <Heart className={`w-4 h-4 ${likedProfiles.includes(profile.id) ? "text-white fill-white" : "text-primary"}`} />
                  </button>

                  {/* Match Score */}
                  <div className="absolute bottom-3 right-3 px-2 py-1 bg-white/90 rounded-full text-xs font-bold text-primary">
                    {profile.compatibility}% Match
                  </div>
                </div>

                {/* Info */}
                <div className="p-4 flex-1">
                  <div className="flex items-start justify-between mb-2">
                    <div>
                      <h3 className="font-serif text-lg font-bold text-foreground group-hover:text-primary transition-colors">
                        {profile.name}
                      </h3>
                      <p className="text-sm text-muted-foreground">{profile.age} years</p>
                    </div>
                    {profile.isVerified && (
                      <span className="text-xs text-primary font-medium bg-accent-rose px-2 py-1 rounded-full">
                        Verified ✓
                      </span>
                    )}
                  </div>
                  
                  <div className="space-y-1.5">
                    <div className="flex items-center gap-2 text-sm text-muted-foreground">
                      <Briefcase className="w-4 h-4 text-primary/60" />
                      {profile.profession}
                    </div>
                    <div className="flex items-center gap-2 text-sm text-muted-foreground">
                      <GraduationCap className="w-4 h-4 text-primary/60" />
                      {profile.education}
                    </div>
                    <div className="flex items-center gap-2 text-sm text-muted-foreground">
                      <MapPin className="w-4 h-4 text-primary/60" />
                      {profile.location}
                    </div>
                  </div>

                  {viewMode === "list" && (
                    <div className="flex gap-2 mt-4">
                      <Button variant="hero" size="sm" className="gap-1">
                        <Heart className="w-4 h-4" /> Connect
                      </Button>
                      <Button variant="outline" size="sm">View Profile</Button>
                    </div>
                  )}
                </div>
              </div>
            ))}
          </div>

          {/* Load More */}
          <div className="text-center mt-12">
            <Button variant="outline" size="lg" className="group">
              Load More Profiles
              <ChevronDown className="w-5 h-5 group-hover:translate-y-1 transition-transform" />
            </Button>
          </div>
        </div>
      </section>

      <Footer />
    </div>
  );
};

export default SearchProfiles;
