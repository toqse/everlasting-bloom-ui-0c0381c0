import { useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { Button } from "@/components/ui/button";
import { 
  Heart, MapPin, Briefcase, GraduationCap, MessageCircle, 
  ArrowLeft, Shield, Ruler, Phone, Mail, MapPinned, Send, Clock, X, Check, Crown, Star
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
    toast.success("Interest sent successfully! 💕", { description: `${profile.name} will be notified.` });
  };

  const handleToggleFavorite = () => {
    toggleFavorite(profile.id);
    toast.success(isFavorite ? "Removed from favorites" : `Added ${profile.name} to favorites! ❤️`);
  };

  const handleMessage = () => {
    if (chatEnabled) navigate(`/chat/${profile.id}`);
    else toast.info("Chat unavailable", { description: "You can chat once your interest is accepted." });
  };

  const quickInfo = [
    { emoji: "🏙️", label: "CITY:", value: profile.location.split(",")[0] },
    { emoji: "🎂", label: "AGE:", value: `${profile.age}` },
    { emoji: "📏", label: "HEIGHT:", value: "5.7" },
    { emoji: "💼", label: "JOB:", value: profile.profession.split(" ")[0].toUpperCase() },
  ];

  const galleryImages = [
    "https://images.unsplash.com/photo-1529626455594-4ff0802cfb7e?w=300&h=300&fit=crop",
    "https://images.unsplash.com/photo-1524504388940-b1c1722653e1?w=300&h=300&fit=crop",
    "https://images.unsplash.com/photo-1488426862026-3ee34a7d66df?w=300&h=300&fit=crop",
  ];

  return (
    <div className="min-h-screen bg-background">
      <Navbar />

      <section className="pt-20">
        {/* Back button */}
        <div className="container mx-auto px-4 py-4">
          <button onClick={() => navigate(-1)} className="flex items-center gap-2 text-primary hover:text-primary-dark transition-colors group">
            <ArrowLeft className="w-5 h-5 group-hover:-translate-x-1 transition-transform" />
            <span className="font-medium">Back</span>
          </button>
        </div>

        {/* Main Profile - Two column layout like reference */}
        <div className="flex flex-col lg:flex-row">
          {/* Left - Full height photo */}
          <motion.div
            initial={{ opacity: 0, x: -30 }}
            animate={{ opacity: 1, x: 0 }}
            className="lg:w-1/2 relative"
          >
            {/* Decorative leaf top-left */}
            <div className="absolute top-0 left-0 z-10 pointer-events-none opacity-40">
              <img src="https://rn53themes.net/themes/matrimo/images/leafs-min.png" alt="" className="w-28 h-36 object-contain" />
            </div>

            <img
              src={profile.image}
              alt={profile.name}
              className="w-full h-[500px] lg:h-[600px] object-cover"
            />

            {/* Badges */}
            <div className="absolute top-6 left-6 flex gap-2 z-20">
              {profile.isPremium && (
                <span className="px-3 py-1.5 bg-gradient-to-r from-secondary to-secondary-light text-secondary-foreground text-sm font-bold rounded-full flex items-center gap-1 shadow-gold animate-glow">
                  <Crown className="w-4 h-4" /> Premium
                </span>
              )}
              {profile.isVerified && (
                <span className="px-3 py-1.5 bg-primary text-primary-foreground text-sm font-bold rounded-full flex items-center gap-1">
                  <Shield className="w-4 h-4" /> Verified
                </span>
              )}
            </div>

            {/* Bottom action buttons like reference */}
            <div className="flex">
              <Button
                variant="default"
                className="flex-1 rounded-none py-6 text-lg font-semibold bg-[#4338ca] hover:bg-[#3730a3] text-primary-foreground"
                onClick={handleMessage}
              >
                CHAT NOW
              </Button>
              <Button
                variant="default"
                className="flex-1 rounded-none py-6 text-lg font-semibold bg-secondary hover:bg-secondary-dark text-secondary-foreground"
                onClick={interestStatus ? undefined : handleSendInterest}
              >
                {interestStatus ? interestStatus.toUpperCase() : "SEND INTEREST"}
              </Button>
            </div>
          </motion.div>

          {/* Right - Profile info */}
          <motion.div
            initial={{ opacity: 0, x: 30 }}
            animate={{ opacity: 1, x: 0 }}
            className="lg:w-1/2 p-8 lg:p-12 relative"
          >
            {/* Decorative leaf top-right */}
            <div className="absolute top-0 right-0 pointer-events-none opacity-30 transform scale-x-[-1]">
              <img src="https://rn53themes.net/themes/matrimo/images/leafs-min.png" alt="" className="w-24 h-32 object-contain" />
            </div>

            <h1 className="font-serif text-4xl md:text-5xl font-bold text-foreground mb-3">
              {profile.name}
            </h1>

            {/* Status badges */}
            <div className="flex gap-2 mb-6">
              <span className="px-3 py-1 bg-primary text-primary-foreground text-xs font-bold rounded-md">100 viewers</span>
              <span className="px-3 py-1 bg-green-500 text-white text-xs font-bold rounded-md">Available online</span>
              {interestStatus && <StatusChip status={interestStatus} />}
            </div>

            {/* Quick info cards like reference */}
            <div className="flex gap-3 mb-8">
              {quickInfo.map((info, i) => (
                <motion.div
                  key={i}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.2 + i * 0.1 }}
                  className="flex-1 border border-primary/10 rounded-xl p-3 text-center hover-lift bg-card"
                >
                  <div className="text-2xl mb-1">{info.emoji}</div>
                  <p className="text-[10px] text-muted-foreground font-semibold uppercase">{info.label}</p>
                  <p className="text-sm font-bold text-foreground">{info.value}</p>
                </motion.div>
              ))}
            </div>

            {/* About section */}
            <div className="mb-8">
              <h3 className="font-serif text-xl font-bold text-foreground mb-3 uppercase tracking-wide">About</h3>
              <p className="text-muted-foreground leading-relaxed mb-3">
                I am a {profile.profession} working in {profile.location}. I completed my {profile.education} and am passionate about my career. I believe in maintaining a balance between work and personal life.
              </p>
              <p className="text-muted-foreground leading-relaxed">
                Many desktop publishing packages and web page editors now use Lorem Ipsum as their default model text.
              </p>
            </div>

            {/* Photo Gallery */}
            <div className="mb-8">
              <div className="border-t border-border mb-6" />
              <h3 className="font-serif text-xl font-bold text-foreground mb-4 uppercase tracking-wide">Photo Gallery</h3>
              <div className="grid grid-cols-3 gap-3">
                {galleryImages.map((img, i) => (
                  <motion.div
                    key={i}
                    initial={{ opacity: 0, scale: 0.8 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ delay: 0.4 + i * 0.1 }}
                    whileHover={{ scale: 1.05 }}
                    className="rounded-xl overflow-hidden cursor-pointer shadow-card"
                  >
                    <img src={img} alt={`Gallery ${i + 1}`} className="w-full h-32 object-cover hover:brightness-110 transition-all" />
                  </motion.div>
                ))}
              </div>
            </div>

            {/* Contact Info */}
            <div>
              <div className="border-t border-border mb-6" />
              <h3 className="font-serif text-xl font-bold text-foreground mb-4 uppercase tracking-wide">Contact Info</h3>
              <div className="space-y-3">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-full border border-primary/20 flex items-center justify-center">
                    <Phone className="w-4 h-4 text-primary" />
                  </div>
                  <div>
                    <span className="text-sm font-semibold text-foreground">Phone: </span>
                    <span className="text-sm text-muted-foreground">+92 (8800) 68 - 8960</span>
                  </div>
                </div>
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-full border border-primary/20 flex items-center justify-center">
                    <Mail className="w-4 h-4 text-primary" />
                  </div>
                  <div>
                    <span className="text-sm font-semibold text-foreground">Email: </span>
                    <span className="text-sm text-muted-foreground">{profile.name.toLowerCase().replace(" ", "")}@gmail.com</span>
                  </div>
                </div>
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-full border border-primary/20 flex items-center justify-center">
                    <MapPinned className="w-4 h-4 text-primary" />
                  </div>
                  <div>
                    <span className="text-sm font-semibold text-foreground">Address: </span>
                    <span className="text-sm text-muted-foreground">28800 Orchard Lake Road, Suite 180, {profile.location}</span>
                  </div>
                </div>
              </div>
            </div>

            {/* Decorative leaf bottom-right */}
            <div className="absolute bottom-0 right-0 pointer-events-none opacity-20 transform scale-x-[-1] rotate-180">
              <img src="https://rn53themes.net/themes/matrimo/images/leafs-min.png" alt="" className="w-32 h-40 object-contain" />
            </div>
          </motion.div>
        </div>
      </section>

      <Footer />
    </div>
  );
};

export default ProfileDetail;
