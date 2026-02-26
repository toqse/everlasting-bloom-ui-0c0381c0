import { motion } from "framer-motion";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { Button } from "@/components/ui/button";
import { useNavigate } from "react-router-dom";
import { Users, Camera, Crown, Heart, MessageCircle, Search, Shield, Sparkles, ArrowRight, Star } from "lucide-react";

const services = [
  { icon: Users, title: "Browse Profiles", description: "Explore 1200+ verified profiles with detailed information, photos, and preferences.", count: "1200+ Profiles" },
  { icon: Heart, title: "Matchmaking", description: "Our advanced algorithm matches you with compatible profiles based on your preferences.", count: "Smart Matching" },
  { icon: Camera, title: "Photo Gallery", description: "View and share beautiful wedding photos and moments from our successful couples.", count: "1000+ Photos" },
  { icon: Crown, title: "Premium Plans", description: "Get access to exclusive features with our premium membership plans.", count: "4 Plans" },
  { icon: MessageCircle, title: "Chat & Connect", description: "Communicate with your matches through our secure messaging platform.", count: "Real-time Chat" },
  { icon: Shield, title: "Verified Profiles", description: "All profiles go through a thorough verification process for your safety.", count: "100% Verified" },
  { icon: Search, title: "Advanced Search", description: "Find your perfect match using our detailed search filters and preferences.", count: "20+ Filters" },
  { icon: Star, title: "Horoscope Matching", description: "Traditional horoscope compatibility analysis for a perfect match.", count: "Vedic Analysis" },
];

const ServicesPage = () => {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-background">
      <Navbar />

      {/* Hero */}
      <section className="pt-28 pb-16 bg-gradient-romantic relative overflow-hidden">
        <div className="absolute top-10 left-10 w-48 h-48 bg-secondary/20 rounded-full blur-3xl animate-float" />
        <div className="absolute bottom-10 right-10 w-64 h-64 bg-primary/15 rounded-full blur-3xl animate-float-delayed" />
        {[...Array(5)].map((_, i) => (
          <Sparkles key={i} className="absolute text-secondary/20 animate-sparkle"
            style={{ left: `${10 + i * 18}%`, top: `${20 + (i % 3) * 25}%`, width: `${16 + i * 3}px`, animationDelay: `${i * 0.3}s` }} />
        ))}
        <div className="container mx-auto px-4 relative z-10 text-center">
          <div className="inline-flex items-center gap-2 px-5 py-2.5 rounded-full bg-white/80 backdrop-blur-sm border border-primary/10 mb-4 shadow-soft animate-fade-in-up">
            <Sparkles className="w-4 h-4 text-secondary animate-sparkle" />
            <span className="text-sm font-medium text-primary">What We Offer</span>
          </div>
          <h1 className="font-serif text-4xl md:text-6xl font-bold text-foreground mb-4 animate-fade-in-up" style={{ animationDelay: "0.1s" }}>
            Our <span className="text-gradient-gold">Services</span>
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
                className="bg-white rounded-3xl p-6 shadow-card hover-lift group border border-primary/5 text-center"
              >
                <div className="w-16 h-16 mx-auto rounded-2xl bg-accent-gold flex items-center justify-center mb-4 group-hover:scale-110 transition-transform shadow-gold">
                  <service.icon className="w-8 h-8 text-secondary" />
                </div>
                <h3 className="font-serif text-lg font-bold text-foreground mb-2">{service.title}</h3>
                <p className="text-secondary text-xs font-medium mb-3">{service.count}</p>
                <p className="text-muted-foreground text-sm leading-relaxed">{service.description}</p>
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
