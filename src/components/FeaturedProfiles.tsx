import { useState } from "react";
import { Heart, MapPin, Briefcase, GraduationCap, Star, MessageCircle, ArrowRight, Sparkles, Eye } from "lucide-react";
import { Button } from "./ui/button";
import { useNavigate } from "react-router-dom";
import ProfileViewDrawer from "./ProfileViewDrawer";

export interface Profile {
  id: number;
  name: string;
  age: number;
  profession: string;
  education: string;
  location: string;
  image: string;
  isVerified: boolean;
  isPremium: boolean;
  compatibility: number;
}

export const profilesData: Profile[] = [
  {
    id: 1,
    name: "Priya Sharma",
    age: 26,
    profession: "Software Engineer",
    education: "MBA, IIM Bangalore",
    location: "Mumbai, Maharashtra",
    image: "https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=400&h=500&fit=crop",
    isVerified: true,
    isPremium: true,
    compatibility: 95,
  },
  {
    id: 2,
    name: "Ananya Reddy",
    age: 24,
    profession: "Doctor",
    education: "MBBS, AIIMS Delhi",
    location: "Hyderabad, Telangana",
    image: "/images/l3.jpg",
    isVerified: true,
    isPremium: false,
    compatibility: 88,
  },
  {
    id: 3,
    name: "Sneha Patel",
    age: 27,
    profession: "CA",
    education: "B.Com, Gujarat University",
    location: "Ahmedabad, Gujarat",
    image: "/images/4.jpg",
    isVerified: true,
    isPremium: true,
    compatibility: 92,
  },
  {
    id: 4,
    name: "Kavya Menon",
    age: 25,
    profession: "Architect",
    education: "B.Arch, IIT Kharagpur",
    location: "Kochi, Kerala",
    image: "https://images.unsplash.com/photo-1517841905240-472988babdf9?w=400&h=500&fit=crop",
    isVerified: true,
    isPremium: false,
    compatibility: 85,
  },
  {
    id: 5,
    name: "Ishita Gupta",
    age: 28,
    profession: "Marketing Manager",
    education: "MBA, ISB Hyderabad",
    location: "Delhi NCR",
    image: "https://images.unsplash.com/photo-1531746020798-e6953c6e8e04?w=400&h=500&fit=crop",
    isVerified: true,
    isPremium: true,
    compatibility: 90,
  },
  {
    id: 6,
    name: "Meera Iyer",
    age: 26,
    profession: "Data Scientist",
    education: "M.Tech, IIT Madras",
    location: "Chennai, Tamil Nadu",
    image: "https://images.unsplash.com/photo-1524504388940-b1c1722653e1?w=400&h=500&fit=crop",
    isVerified: true,
    isPremium: false,
    compatibility: 87,
  },
  {
    id: 7,
    name: "Divya Krishnan",
    age: 25,
    profession: "UX Designer",
    education: "B.Des, NID Ahmedabad",
    location: "Pune, Maharashtra",
    image: "https://images.unsplash.com/photo-1544005313-94ddf0286df2?w=400&h=500&fit=crop",
    isVerified: true,
    isPremium: true,
    compatibility: 91,
  },
  {
    id: 8,
    name: "Riya Nair",
    age: 27,
    profession: "Chartered Accountant",
    education: "CA, ICAI",
    location: "Thiruvananthapuram, Kerala",
    image: "/images/download%201.jpg",
    isVerified: true,
    isPremium: false,
    compatibility: 86,
  },
];

const FeaturedProfiles = () => {
  const navigate = useNavigate();
  const [hoveredId, setHoveredId] = useState<number | null>(null);
  const [likedProfiles, setLikedProfiles] = useState<number[]>([]);
  const [viewProfile, setViewProfile] = useState<Profile | null>(null);

  const toggleLike = (e: React.MouseEvent, id: number) => {
    e.stopPropagation();
    setLikedProfiles(prev => 
      prev.includes(id) ? prev.filter(p => p !== id) : [...prev, id]
    );
  };

  const handleViewProfile = (id: number) => {
    window.scrollTo(0, 0);
    navigate(`/profile/${id}`);
  };

  return (
    <section id="profiles" className="py-12 sm:py-16 md:py-24 bg-gradient-romantic relative overflow-hidden">
      {/* Animated Background */}
      <div className="absolute top-20 left-10 w-72 h-72 bg-secondary/15 rounded-full blur-3xl animate-float" />
      <div className="absolute bottom-20 right-10 w-96 h-96 bg-primary/10 rounded-full blur-3xl animate-float-delayed" />
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-accent-pink/20 rounded-full blur-3xl animate-pulse-soft" />

      {/* Floating Sparkles */}
      {[...Array(6)].map((_, i) => (
        <Sparkles
          key={i}
          className="absolute text-secondary/30 animate-sparkle"
          style={{
            left: `${15 + i * 15}%`,
            top: `${20 + (i % 3) * 25}%`,
            width: `${20 + i * 4}px`,
            height: `${20 + i * 4}px`,
            animationDelay: `${i * 0.5}s`,
          }}
        />
      ))}

      <div className="container mx-auto px-4 relative z-10">
        {/* Section Header */}
        <div className="text-center mb-8 sm:mb-14">
          <div className="inline-flex items-center gap-2 px-5 py-2.5 rounded-full bg-white/80 backdrop-blur-sm border border-primary/10 mb-4 animate-fade-in-up shadow-soft">
            <Star className="w-4 h-4 text-secondary fill-secondary animate-sparkle" />
            <span className="text-sm font-medium text-primary">Featured Profiles</span>
            <Star className="w-4 h-4 text-secondary fill-secondary animate-sparkle" style={{ animationDelay: "0.5s" }} />
          </div>
          <h2 className="font-serif text-3xl sm:text-4xl md:text-5xl font-bold text-foreground mb-4 animate-fade-in-up" style={{ animationDelay: "0.1s" }}>
            Meet Your <span className="text-gradient-gold">Perfect Match</span>
          </h2>
          <p className="text-muted-foreground max-w-2xl mx-auto animate-fade-in-up" style={{ animationDelay: "0.2s" }}>
            Handpicked profiles based on your preferences and compatibility
          </p>
        </div>

        {/* Profiles Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6 lg:gap-8 mb-8 sm:mb-12">
          {profilesData.map((profile, index) => (
            <div
              key={profile.id}
              className="group relative animate-fade-in-up cursor-pointer"
              style={{ animationDelay: `${0.1 * index}s` }}
              onMouseEnter={() => setHoveredId(profile.id)}
              onMouseLeave={() => setHoveredId(null)}
              onClick={() => handleViewProfile(profile.id)}
            >
              <div className={`bg-white rounded-3xl overflow-hidden shadow-card transition-all duration-500 ${
                profile.isPremium ? "gold-border" : "border border-primary/10"
              } ${hoveredId === profile.id ? "shadow-elevated scale-[1.02] -translate-y-2" : ""}`}>
                
                {/* Image Container - click on image redirects to login */}
                <div className="relative h-72 overflow-hidden cursor-pointer" onClick={(e) => { e.stopPropagation(); navigate("/auth"); }}>
                  <img
                    src={profile.image}
                    alt={profile.name}
                    className="w-full h-full object-cover object-top transition-transform duration-700 group-hover:scale-110"
                  />
                  
                  {/* Overlay Gradient */}
                  <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/20 to-transparent" />
                  
                  {/* Badges */}
                  <div className="absolute top-4 left-4 flex gap-2">
                    {profile.isPremium && (
                      <span className="px-3 py-1.5 bg-gradient-to-r from-secondary to-secondary-light text-secondary-foreground text-xs font-bold rounded-full flex items-center gap-1 shadow-gold animate-glow">
                        <Star className="w-3 h-3 fill-current" /> Premium
                      </span>
                    )}
                    {profile.isVerified && (
                      <span className="px-3 py-1.5 bg-primary text-primary-foreground text-xs font-bold rounded-full shadow-soft">
                        Verified ✓
                      </span>
                    )}
                  </div>

                  {/* Like Button */}
                  <button
                    onClick={(e) => toggleLike(e, profile.id)}
                    className={`absolute top-4 right-4 w-11 h-11 rounded-full flex items-center justify-center transition-all duration-300 hover:scale-125 ${
                      likedProfiles.includes(profile.id)
                        ? "bg-primary shadow-soft"
                        : "bg-white/90 backdrop-blur-sm hover:bg-white"
                    }`}
                  >
                    <Heart
                      className={`w-5 h-5 transition-all ${
                        likedProfiles.includes(profile.id)
                          ? "text-white fill-white animate-heart-beat"
                          : "text-primary"
                      }`}
                    />
                  </button>

                  {/* Compatibility Score */}
                  <div className="absolute bottom-4 right-4 px-3 py-1.5 bg-white/95 backdrop-blur-sm rounded-full shadow-soft">
                    <span className="text-sm font-bold text-gradient-primary">{profile.compatibility}% Match</span>
                  </div>

                  {/* Hover Actions */}
                  <div className={`absolute bottom-0 left-0 right-0 p-4 bg-gradient-to-t from-primary via-primary/95 to-primary/80 transform transition-all duration-500 ${
                    hoveredId === profile.id ? "translate-y-0 opacity-100" : "translate-y-full opacity-0"
                  }`}>
                    <div className="flex gap-2">
                      <Button 
                        variant="gold" 
                        size="sm" 
                        className="flex-1 gap-1"
                        onClick={(e) => {
                          e.stopPropagation();
                          navigate("/auth");
                        }}
                      >
                        <Heart className="w-4 h-4" />
                        Connect
                      </Button>
                      <Button 
                        variant="glass" 
                        size="sm" 
                        className="flex-1 gap-1"
                        onClick={(e) => {
                          e.stopPropagation();
                          setViewProfile(profile);
                        }}
                      >
                        <Eye className="w-4 h-4" />
                        View
                      </Button>
                    </div>
                  </div>
                </div>

                {/* Profile Info - click redirects to login */}
                <div
                  className="p-5 cursor-pointer"
                  onClick={(e) => {
                    e.stopPropagation();
                    navigate("/auth");
                  }}
                >
                  <div className="flex items-start justify-between mb-3">
                    <div>
                      <h3 className="font-serif text-xl font-bold text-foreground group-hover:text-primary transition-colors">{profile.name}</h3>
                      <p className="text-muted-foreground">{profile.age} years</p>
                    </div>
                    <Sparkles className="w-5 h-5 text-secondary opacity-0 group-hover:opacity-100 animate-sparkle transition-opacity" />
                  </div>

                  <div className="space-y-2">
                    <div className="flex items-center gap-2 text-sm text-muted-foreground group-hover:text-foreground transition-colors">
                      <Briefcase className="w-4 h-4 text-primary" />
                      {profile.profession}
                    </div>
                    <div className="flex items-center gap-2 text-sm text-muted-foreground group-hover:text-foreground transition-colors">
                      <GraduationCap className="w-4 h-4 text-primary" />
                      {profile.education}
                    </div>
                    <div className="flex items-center gap-2 text-sm text-muted-foreground group-hover:text-foreground transition-colors">
                      <MapPin className="w-4 h-4 text-primary" />
                      {profile.location}
                    </div>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* View More Button */}
        <div className="text-center">
          <Button 
            variant="hero" 
            size="lg" 
            className="group"
            onClick={() => navigate("/search")}
          >
            View All Profiles
            <ArrowRight className="w-5 h-5 group-hover:translate-x-2 transition-transform" />
          </Button>
        </div>
      </div>

      <ProfileViewDrawer
        open={!!viewProfile}
        onOpenChange={(open) => !open && setViewProfile(null)}
        profile={viewProfile}
        onSendInterest={() => {}}
      />
    </section>
  );
};

export default FeaturedProfiles;
