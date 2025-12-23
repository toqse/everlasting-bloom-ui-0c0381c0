import { useState } from "react";
import { Heart, MapPin, Briefcase, GraduationCap, Star, MessageCircle, ArrowRight } from "lucide-react";
import { Button } from "./ui/button";

interface Profile {
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

const profiles: Profile[] = [
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
    image: "https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=400&h=500&fit=crop",
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
    image: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=400&h=500&fit=crop",
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
];

const FeaturedProfiles = () => {
  const [hoveredId, setHoveredId] = useState<number | null>(null);
  const [likedProfiles, setLikedProfiles] = useState<number[]>([]);

  const toggleLike = (id: number) => {
    setLikedProfiles(prev => 
      prev.includes(id) ? prev.filter(p => p !== id) : [...prev, id]
    );
  };

  return (
    <section id="profiles" className="py-20 bg-gradient-romantic relative overflow-hidden">
      {/* Decorative Elements */}
      <div className="absolute top-20 left-10 w-64 h-64 bg-secondary/10 rounded-full blur-3xl" />
      <div className="absolute bottom-20 right-10 w-80 h-80 bg-primary/10 rounded-full blur-3xl" />

      <div className="container mx-auto px-4 relative z-10">
        {/* Section Header */}
        <div className="text-center mb-12">
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-white/80 border border-primary/10 mb-4 animate-fade-in-up">
            <Star className="w-4 h-4 text-secondary fill-secondary" />
            <span className="text-sm font-medium text-primary">Featured Profiles</span>
          </div>
          <h2 className="font-serif text-4xl md:text-5xl font-bold text-foreground mb-4 animate-fade-in-up" style={{ animationDelay: "0.1s" }}>
            Meet Your <span className="text-gradient-gold">Perfect Match</span>
          </h2>
          <p className="text-muted-foreground max-w-2xl mx-auto animate-fade-in-up" style={{ animationDelay: "0.2s" }}>
            Handpicked profiles based on your preferences and compatibility
          </p>
        </div>

        {/* Profiles Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-12">
          {profiles.map((profile, index) => (
            <div
              key={profile.id}
              className="group relative animate-fade-in-up"
              style={{ animationDelay: `${0.1 * index}s` }}
              onMouseEnter={() => setHoveredId(profile.id)}
              onMouseLeave={() => setHoveredId(null)}
            >
              <div className={`bg-white rounded-3xl overflow-hidden shadow-card transition-all duration-500 ${
                profile.isPremium ? "gold-border" : "border border-primary/10"
              } ${hoveredId === profile.id ? "shadow-elevated scale-[1.02]" : ""}`}>
                
                {/* Image Container */}
                <div className="relative h-72 overflow-hidden">
                  <img
                    src={profile.image}
                    alt={profile.name}
                    className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
                  />
                  
                  {/* Overlay Gradient */}
                  <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent" />
                  
                  {/* Badges */}
                  <div className="absolute top-4 left-4 flex gap-2">
                    {profile.isPremium && (
                      <span className="px-3 py-1 bg-secondary text-secondary-foreground text-xs font-bold rounded-full flex items-center gap-1">
                        <Star className="w-3 h-3 fill-current" /> Premium
                      </span>
                    )}
                    {profile.isVerified && (
                      <span className="px-3 py-1 bg-primary text-primary-foreground text-xs font-bold rounded-full">
                        Verified ✓
                      </span>
                    )}
                  </div>

                  {/* Like Button */}
                  <button
                    onClick={() => toggleLike(profile.id)}
                    className="absolute top-4 right-4 w-10 h-10 rounded-full bg-white/90 backdrop-blur-sm flex items-center justify-center transition-all duration-300 hover:scale-110"
                  >
                    <Heart
                      className={`w-5 h-5 transition-colors ${
                        likedProfiles.includes(profile.id)
                          ? "text-primary fill-primary"
                          : "text-primary/50"
                      }`}
                    />
                  </button>

                  {/* Compatibility Score */}
                  <div className="absolute bottom-4 right-4 px-3 py-1.5 bg-white/90 backdrop-blur-sm rounded-full">
                    <span className="text-sm font-bold text-primary">{profile.compatibility}% Match</span>
                  </div>

                  {/* Quick Info on Hover */}
                  <div className={`absolute bottom-0 left-0 right-0 p-4 bg-gradient-to-t from-primary to-primary/90 transform transition-all duration-500 ${
                    hoveredId === profile.id ? "translate-y-0 opacity-100" : "translate-y-full opacity-0"
                  }`}>
                    <div className="flex gap-2">
                      <Button variant="gold" size="sm" className="flex-1 gap-1">
                        <Heart className="w-4 h-4" />
                        Connect
                      </Button>
                      <Button variant="glass" size="sm" className="flex-1 gap-1">
                        <MessageCircle className="w-4 h-4" />
                        Message
                      </Button>
                    </div>
                  </div>
                </div>

                {/* Profile Info */}
                <div className="p-5">
                  <div className="flex items-start justify-between mb-3">
                    <div>
                      <h3 className="font-serif text-xl font-bold text-foreground">{profile.name}</h3>
                      <p className="text-muted-foreground">{profile.age} years</p>
                    </div>
                  </div>

                  <div className="space-y-2">
                    <div className="flex items-center gap-2 text-sm text-muted-foreground">
                      <Briefcase className="w-4 h-4 text-primary" />
                      {profile.profession}
                    </div>
                    <div className="flex items-center gap-2 text-sm text-muted-foreground">
                      <GraduationCap className="w-4 h-4 text-primary" />
                      {profile.education}
                    </div>
                    <div className="flex items-center gap-2 text-sm text-muted-foreground">
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
          <Button variant="hero" size="lg" className="group">
            View All Profiles
            <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
          </Button>
        </div>
      </div>
    </section>
  );
};

export default FeaturedProfiles;
