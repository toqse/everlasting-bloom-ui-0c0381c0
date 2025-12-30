import { useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { Button } from "@/components/ui/button";
import { 
  Heart, MapPin, Briefcase, GraduationCap, Star, MessageCircle, 
  ArrowLeft, Share2, Shield, Calendar, Ruler, Users, Home, 
  Sparkles, Check, Phone, Mail, Eye, Crown, Clock, X, Send
} from "lucide-react";
import { profilesData } from "@/components/FeaturedProfiles";
import { useInterestStore, InterestStatus } from "@/stores/interestStore";
import { toast } from "sonner";

const StatusChip = ({ status }: { status: InterestStatus }) => {
  const config = {
    pending: { label: 'Pending', className: 'bg-secondary/20 text-secondary-dark border-secondary/30', icon: Clock },
    accepted: { label: 'Accepted', className: 'bg-green-500/20 text-green-700 border-green-500/30', icon: Check },
    rejected: { label: 'Declined', className: 'bg-red-500/20 text-red-700 border-red-500/30', icon: X },
  };
  const { label, className, icon: Icon } = config[status];
  return (
    <motion.span initial={{ scale: 0.8 }} animate={{ scale: 1 }} className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full text-sm font-semibold border ${className}`}>
      <Icon className="w-4 h-4" /> {label}
    </motion.span>
  );
};

const ProfileDetail = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState("about");
  
  const { favorites, toggleFavorite, sendInterest, getSentInterestStatus, canChat } = useInterestStore();
  const profile = profilesData.find(p => p.id === Number(id));
  const isFavorite = profile ? favorites.includes(profile.id) : false;
  const interestStatus = profile ? getSentInterestStatus(profile.id) : null;
  const chatEnabled = profile ? canChat(profile.id) : false;

  if (!profile) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <h1 className="font-serif text-2xl font-bold mb-4">Profile Not Found</h1>
          <Button onClick={() => navigate("/search")}>Browse Profiles</Button>
        </div>
      </div>
    );
  }

  const handleSendInterest = () => {
    sendInterest(0, profile.id, "Hi! I'd love to connect with you.");
    toast.success("Interest sent successfully! 💕", { description: `${profile.name} will be notified about your interest.` });
  };

  const handleToggleFavorite = () => {
    toggleFavorite(profile.id);
    toast.success(isFavorite ? `Removed from favorites` : `Added ${profile.name} to favorites! ❤️`);
  };

  const handleMessage = () => {
    if (chatEnabled) {
      navigate(`/chat/${profile.id}`);
    } else {
      toast.info("Chat unavailable", { description: "You can chat once your interest is accepted." });
    }
  };

  const handleShare = () => {
    navigator.clipboard.writeText(window.location.href);
    toast.success("Profile link copied to clipboard!");
  };

  // Extended profile details
  const profileDetails = {
    height: "5'6\"",
    weight: "55 kg",
    maritalStatus: "Never Married",
    motherTongue: "Hindi",
    religion: "Hindu",
    caste: "Brahmin",
    diet: "Vegetarian",
    drinking: "Non-drinker",
    smoking: "Non-smoker",
    family: "Nuclear Family",
    familyStatus: "Middle Class",
    fatherOccupation: "Business",
    motherOccupation: "Homemaker",
    siblings: "1 Brother, 1 Sister",
    aboutMe: `I am a ${profile.profession} working in ${profile.location}. I completed my ${profile.education} and am passionate about my career. I believe in maintaining a balance between work and personal life. I enjoy reading, traveling, and spending quality time with family. Looking for a life partner who shares similar values and has a positive outlook on life.`,
    partnerPreference: "Looking for someone who is educated, family-oriented, and has a good sense of humor. Age preference: 26-32 years. Should be settled in career and open to both working and homemaker wife.",
  };

  const tabs = [
    { id: "about", label: "About" },
    { id: "family", label: "Family" },
    { id: "preferences", label: "Preferences" },
  ];

  return (
    <div className="min-h-screen bg-background">
      <Navbar />

      {/* Hero Section */}
      <section className="pt-20 bg-gradient-romantic relative overflow-hidden">
        {/* Decorative elements */}
        <div className="absolute top-20 left-10 w-40 h-40 bg-secondary/20 rounded-full blur-3xl animate-float" />
        <div className="absolute bottom-10 right-10 w-60 h-60 bg-primary/15 rounded-full blur-3xl animate-float-delayed" />
        
        {[...Array(5)].map((_, i) => (
          <Sparkles
            key={i}
            className="absolute text-secondary/30 animate-sparkle"
            style={{
              left: `${10 + i * 20}%`,
              top: `${30 + (i % 2) * 30}%`,
              width: `${18 + i * 4}px`,
              animationDelay: `${i * 0.5}s`,
            }}
          />
        ))}

        <div className="container mx-auto px-4 py-8 relative z-10">
          {/* Back Button */}
          <button
            onClick={() => navigate(-1)}
            className="flex items-center gap-2 text-primary hover:text-primary-dark transition-colors mb-6 group"
          >
            <ArrowLeft className="w-5 h-5 group-hover:-translate-x-1 transition-transform" />
            <span className="font-medium">Back to Search</span>
          </button>

          <div className="grid lg:grid-cols-3 gap-8">
            {/* Main Image */}
            <div className="lg:col-span-1">
              <div className="relative rounded-3xl overflow-hidden shadow-elevated animate-scale-in group">
                <img
                  src={profile.image}
                  alt={profile.name}
                  className="w-full h-[450px] object-cover group-hover:scale-105 transition-transform duration-700"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/50 via-transparent to-transparent" />
                
                {/* Badges */}
                <div className="absolute top-4 left-4 flex flex-col gap-2">
                  {profile.isPremium && (
                    <span className="px-3 py-1.5 bg-gradient-to-r from-secondary to-secondary-light text-secondary-foreground text-sm font-bold rounded-full flex items-center gap-1 shadow-gold animate-glow">
                      <Crown className="w-4 h-4" /> Premium
                    </span>
                  )}
                  {profile.isVerified && (
                    <span className="px-3 py-1.5 bg-primary text-primary-foreground text-sm font-bold rounded-full flex items-center gap-1 shadow-soft">
                      <Shield className="w-4 h-4" /> Verified
                    </span>
                  )}
                </div>

                {/* Match Score */}
                <div className="absolute bottom-4 left-4 right-4">
                  <div className="bg-white/95 backdrop-blur-sm rounded-2xl p-4 shadow-soft">
                    <div className="flex items-center justify-between mb-2">
                      <span className="text-sm font-medium text-foreground">Compatibility Score</span>
                      <span className="text-2xl font-bold text-gradient-primary">{profile.compatibility}%</span>
                    </div>
                    <div className="h-2 bg-accent-rose rounded-full overflow-hidden">
                      <div 
                        className="h-full bg-gradient-to-r from-primary to-secondary rounded-full transition-all duration-1000"
                        style={{ width: `${profile.compatibility}%` }}
                      />
                    </div>
                  </div>
                </div>
              </div>

              {/* Photo Gallery Placeholder */}
              <div className="grid grid-cols-4 gap-2 mt-4">
                {[...Array(4)].map((_, i) => (
                  <div
                    key={i}
                    className="aspect-square rounded-xl bg-accent-rose/50 flex items-center justify-center cursor-pointer hover:bg-accent-rose transition-colors group"
                  >
                    <Eye className="w-5 h-5 text-primary/40 group-hover:text-primary transition-colors" />
                  </div>
                ))}
              </div>
            </div>

            {/* Profile Info */}
            <div className="lg:col-span-2 animate-fade-in-up">
              <div className="bg-white rounded-3xl p-6 md:p-8 shadow-card border border-primary/5">
                {/* Header */}
                <div className="flex flex-col md:flex-row md:items-start justify-between gap-4 mb-6">
                  <div>
                    <h1 className="font-serif text-3xl md:text-4xl font-bold text-foreground mb-2 flex items-center gap-3">
                      {profile.name}
                      <motion.div whileTap={{ scale: 0.8 }} onClick={handleToggleFavorite} className="cursor-pointer">
                        <Heart className={`w-8 h-8 transition-all hover:scale-125 ${isFavorite ? "text-primary fill-primary animate-heart-beat" : "text-primary/30"}`} />
                      </motion.div>
                    </h1>
                    <p className="text-muted-foreground text-lg">{profile.age} years • {profileDetails.height}</p>
                    {interestStatus && <div className="mt-2"><StatusChip status={interestStatus} /></div>}
                  </div>
                  <button onClick={handleShare} className="p-3 rounded-xl bg-accent-rose hover:bg-primary/10 transition-colors group">
                    <Share2 className="w-5 h-5 text-primary group-hover:scale-110 transition-transform" />
                  </button>
                </div>

                {/* Quick Info */}
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
                  <div className="flex items-center gap-3 p-3 bg-accent-rose/50 rounded-xl">
                    <Briefcase className="w-5 h-5 text-primary" />
                    <div><p className="text-xs text-muted-foreground">Profession</p><p className="text-sm font-medium text-foreground">{profile.profession}</p></div>
                  </div>
                  <div className="flex items-center gap-3 p-3 bg-accent-gold/50 rounded-xl">
                    <GraduationCap className="w-5 h-5 text-secondary" />
                    <div><p className="text-xs text-muted-foreground">Education</p><p className="text-sm font-medium text-foreground">{profile.education.split(',')[0]}</p></div>
                  </div>
                  <div className="flex items-center gap-3 p-3 bg-accent-rose/50 rounded-xl">
                    <MapPin className="w-5 h-5 text-primary" />
                    <div><p className="text-xs text-muted-foreground">Location</p><p className="text-sm font-medium text-foreground">{profile.location.split(',')[0]}</p></div>
                  </div>
                  <div className="flex items-center gap-3 p-3 bg-accent-gold/50 rounded-xl">
                    <Calendar className="w-5 h-5 text-secondary" />
                    <div><p className="text-xs text-muted-foreground">Status</p><p className="text-sm font-medium text-foreground">{profileDetails.maritalStatus}</p></div>
                  </div>
                </div>

                {/* Action Buttons */}
                <div className="flex flex-col sm:flex-row gap-3 mb-8">
                  {!interestStatus ? (
                    <Button variant="hero" size="lg" className="flex-1 gap-2" onClick={handleSendInterest}>
                      <Send className="w-5 h-5" /> Send Interest
                    </Button>
                  ) : interestStatus === 'pending' ? (
                    <Button variant="outline" size="lg" className="flex-1 gap-2" disabled>
                      <Clock className="w-5 h-5" /> Interest Pending
                    </Button>
                  ) : interestStatus === 'accepted' ? (
                    <Button variant="gold" size="lg" className="flex-1 gap-2" onClick={handleMessage}>
                      <MessageCircle className="w-5 h-5" /> Chat Now
                    </Button>
                  ) : (
                    <Button variant="outline" size="lg" className="flex-1 gap-2" disabled>
                      <X className="w-5 h-5" /> Interest Declined
                    </Button>
                  )}
                  <Button variant={isFavorite ? "romantic" : "outline"} size="lg" className="gap-2" onClick={handleToggleFavorite}>
                    <Heart className={`w-5 h-5 ${isFavorite ? "fill-current" : ""}`} /> {isFavorite ? "Favorited" : "Add to Favorites"}
                  </Button>
                </div>

                {/* Tabs */}
                <div className="border-b border-primary/10 mb-6">
                  <div className="flex gap-6">
                    {tabs.map((tab) => (
                      <button
                        key={tab.id}
                        onClick={() => setActiveTab(tab.id)}
                        className={`pb-3 font-medium transition-all relative ${
                          activeTab === tab.id ? "text-primary" : "text-muted-foreground hover:text-foreground"
                        }`}
                      >
                        {tab.label}
                        {activeTab === tab.id && (
                          <div className="absolute bottom-0 left-0 right-0 h-0.5 bg-secondary rounded-full" />
                        )}
                      </button>
                    ))}
                  </div>
                </div>

                {/* Tab Content */}
                <div className="animate-fade-in-up">
                  {activeTab === "about" && (
                    <div className="space-y-6">
                      <div>
                        <h3 className="font-serif text-xl font-bold text-foreground mb-3 flex items-center gap-2">
                          <Sparkles className="w-5 h-5 text-secondary" />
                          About Me
                        </h3>
                        <p className="text-muted-foreground leading-relaxed">{profileDetails.aboutMe}</p>
                      </div>

                      <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                        {[
                          { label: "Height", value: profileDetails.height, icon: Ruler },
                          { label: "Religion", value: profileDetails.religion, icon: Star },
                          { label: "Mother Tongue", value: profileDetails.motherTongue, icon: MessageCircle },
                          { label: "Diet", value: profileDetails.diet, icon: Heart },
                          { label: "Drinking", value: profileDetails.drinking, icon: Check },
                          { label: "Smoking", value: profileDetails.smoking, icon: Check },
                        ].map((item, i) => (
                          <div key={i} className="flex items-center gap-3 p-3 bg-accent-rose/30 rounded-xl">
                            <item.icon className="w-4 h-4 text-primary" />
                            <div>
                              <p className="text-xs text-muted-foreground">{item.label}</p>
                              <p className="text-sm font-medium text-foreground">{item.value}</p>
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}

                  {activeTab === "family" && (
                    <div className="space-y-6">
                      <h3 className="font-serif text-xl font-bold text-foreground mb-3 flex items-center gap-2">
                        <Users className="w-5 h-5 text-secondary" />
                        Family Details
                      </h3>
                      <div className="grid grid-cols-2 gap-4">
                        {[
                          { label: "Family Type", value: profileDetails.family, icon: Home },
                          { label: "Family Status", value: profileDetails.familyStatus, icon: Star },
                          { label: "Father's Occupation", value: profileDetails.fatherOccupation, icon: Briefcase },
                          { label: "Mother's Occupation", value: profileDetails.motherOccupation, icon: Briefcase },
                          { label: "Siblings", value: profileDetails.siblings, icon: Users },
                          { label: "Caste", value: profileDetails.caste, icon: Star },
                        ].map((item, i) => (
                          <div key={i} className="flex items-center gap-3 p-4 bg-accent-rose/30 rounded-xl">
                            <item.icon className="w-5 h-5 text-primary" />
                            <div>
                              <p className="text-xs text-muted-foreground">{item.label}</p>
                              <p className="text-sm font-medium text-foreground">{item.value}</p>
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}

                  {activeTab === "preferences" && (
                    <div className="space-y-6">
                      <h3 className="font-serif text-xl font-bold text-foreground mb-3 flex items-center gap-2">
                        <Heart className="w-5 h-5 text-secondary" />
                        Partner Preferences
                      </h3>
                      <p className="text-muted-foreground leading-relaxed">{profileDetails.partnerPreference}</p>
                    </div>
                  )}
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      <Footer />
    </div>
  );
};

export default ProfileDetail;
