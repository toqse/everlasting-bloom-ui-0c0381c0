import { motion } from "framer-motion";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { Button } from "@/components/ui/button";
import { useNavigate } from "react-router-dom";
import { Users, Camera, Crown, Heart, MessageCircle, Search, Shield, Sparkles, ArrowRight, Star } from "lucide-react";

const services = [
  { icon: Users, title: "Browse Profiles", description: "Explore 1200+ verified profiles with detailed information, photos, and preferences.", count: "1200+ Profiles", iconColor: "text-rose-500", iconBg: "bg-rose-100", borderColor: "border-rose-200" },
  { icon: Heart, title: "Matchmaking", description: "Our advanced algorithm matches you with compatible profiles based on your preferences.", count: "Smart Matching", iconColor: "text-pink-500", iconBg: "bg-pink-100", borderColor: "border-pink-200" },
  { icon: Camera, title: "Photo Gallery", description: "View and share beautiful wedding photos and moments from our successful couples.", count: "1000+ Photos", iconColor: "text-amber-500", iconBg: "bg-amber-100", borderColor: "border-amber-200" },
  { icon: Crown, title: "Premium Plans", description: "Get access to exclusive features with our premium membership plans.", count: "4 Plans", iconColor: "text-secondary", iconBg: "bg-accent-gold", borderColor: "border-secondary/30" },
  { icon: MessageCircle, title: "Chat & Connect", description: "Communicate with your matches through our secure messaging platform.", count: "Real-time Chat", iconColor: "text-teal-500", iconBg: "bg-teal-100", borderColor: "border-teal-200" },
  { icon: Shield, title: "Verified Profiles", description: "All profiles go through a thorough verification process for your safety.", count: "100% Verified", iconColor: "text-green-500", iconBg: "bg-green-100", borderColor: "border-green-200" },
  { icon: Search, title: "Advanced Search", description: "Find your perfect match using our detailed search filters and preferences.", count: "20+ Filters", iconColor: "text-blue-500", iconBg: "bg-blue-100", borderColor: "border-blue-200" },
  { icon: Star, title: "Horoscope Matching", description: "Traditional horoscope compatibility analysis for a perfect match.", count: "Vedic Analysis", iconColor: "text-purple-500", iconBg: "bg-purple-100", borderColor: "border-purple-200" },
];

const ServicesPage = () => {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-background">
      <Navbar />

      {/* Hero */}
      <section className="pt-28 pb-16 bg-gradient-romantic relative overflow-hidden">
        <div className="absolute inset-0 opacity-[0.06]">
          <img src="https://images.unsplash.com/photo-1537633552985-df8429e8048b?w=1920&h=800&fit=crop" alt="" className="w-full h-full object-cover" />
        </div>
        <div className="absolute top-10 left-10 w-48 h-48 bg-secondary/20 rounded-full blur-3xl animate-float" />
        <div className="absolute bottom-10 right-10 w-64 h-64 bg-primary/15 rounded-full blur-3xl animate-float-delayed" />
        <div className="container mx-auto px-4 relative z-10 text-center">
          <div className="inline-flex items-center gap-2 px-5 py-2.5 rounded-full bg-white/80 backdrop-blur-sm border border-primary/10 mb-4 shadow-soft animate-fade-in-up">
            <Sparkles className="w-4 h-4 text-secondary animate-sparkle" />
            <span className="text-sm font-medium text-primary">What We Offer</span>
          </div>
          <h1 className="font-serif text-4xl md:text-6xl font-bold text-foreground mb-4 animate-fade-in-up" style={{ animationDelay: "0.1s" }}>
            Explore Our <span className="text-gradient-gold">Offerings</span>
          </h1>
          <p className="text-muted-foreground max-w-2xl mx-auto text-lg animate-fade-in-up" style={{ animationDelay: "0.2s" }}>
            Comprehensive matrimony services designed to help you find your perfect life partner
          </p>
        </div>
      </section>

      {/* Services Grid */}
      <section className="py-16">
        <div className="container mx-auto px-4">
          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6 max-w-6xl mx-auto">
            {services.map((service, i) => (
              <motion.div
                key={service.title}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.08 }}
                className={`relative rounded-3xl p-[2px] overflow-hidden group hover-lift`}
              >
                {/* Animated moving border */}
                <div
                  className="absolute inset-0 rounded-3xl bg-[length:200%_200%] animate-[shimmer_3s_linear_infinite] opacity-60 group-hover:opacity-100 transition-opacity duration-500"
                  style={{ backgroundImage: "linear-gradient(90deg, transparent, hsl(var(--secondary)), hsl(var(--primary)), hsl(var(--secondary)), transparent)" }}
                />
                <div className={`relative bg-card rounded-[22px] p-6 text-center z-10 h-full border ${service.borderColor}`}>
                  <div className={`w-16 h-16 mx-auto rounded-2xl ${service.iconBg} flex items-center justify-center mb-4 group-hover:scale-110 transition-transform`}>
                    <service.icon className={`w-8 h-8 ${service.iconColor}`} />
                  </div>
                  <h3 className="font-serif text-lg font-bold text-foreground mb-2">{service.title}</h3>
                  <p className={`${service.iconColor} text-xs font-medium mb-3`}>{service.count}</p>
                  <p className="text-muted-foreground text-sm leading-relaxed">{service.description}</p>
                </div>
              </motion.div>
            ))}
          </div>

          <div className="text-center mt-12">
            <Button variant="hero" size="lg" className="gap-2 group" onClick={() => navigate("/auth")}>
              Get Started Now
              <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
            </Button>
          </div>
        </div>
      </section>

      <Footer />
    </div>
  );
};

export default ServicesPage;
