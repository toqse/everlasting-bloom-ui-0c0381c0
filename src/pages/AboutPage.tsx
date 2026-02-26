import { motion } from "framer-motion";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { Award, Shield, Heart, Sparkles, Star, Users, Phone, Mail } from "lucide-react";

const features = [
  { icon: Award, title: "Genuine Profiles", description: "The most trusted wedding matrimony brand with 100% verified profiles" },
  { icon: Shield, title: "Most Trusted", description: "The most trusted wedding matrimony brand trusted by millions" },
  { icon: Heart, title: "2000+ Weddings", description: "The most trusted wedding matrimony brand with thousands of success stories" },
];

const stats = [
  { value: "2K", label: "Couples Paired" },
  { value: "4000+", label: "Registered Users" },
  { value: "1600+", label: "Men" },
  { value: "2000+", label: "Women" },
];

const testimonials = [
  { name: "John Smith", role: "IT Professional", avatar: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=100&h=100&fit=crop&crop=face", review: "It is a long established fact that a reader will be distracted by the readable content of a page when looking at its layout. The service is amazing!", rating: 5 },
  { name: "Julia Ann", role: "Teacher", avatar: "https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=100&h=100&fit=crop&crop=face", review: "It is a long established fact that a reader will be distracted by the readable content of a page when looking at its layout. Highly recommended!", rating: 5 },
  { name: "William Son", role: "Government Staff", avatar: "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=100&h=100&fit=crop&crop=face", review: "It is a long established fact that a reader will be distracted by the readable content of a page when looking at its layout. Excellent platform!", rating: 5 },
];

const team = [
  { name: "Ashley Jen", role: "Founder & CEO", avatar: "https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=200&h=200&fit=crop&crop=face" },
  { name: "Robert Wilson", role: "Head of Operations", avatar: "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=200&h=200&fit=crop&crop=face" },
  { name: "Sarah Davis", role: "Lead Matchmaker", avatar: "https://images.unsplash.com/photo-1544005313-94ddf0286df2?w=200&h=200&fit=crop&crop=face" },
  { name: "Mike Johnson", role: "Tech Lead", avatar: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=200&h=200&fit=crop&crop=face" },
];

const AboutPage = () => {
  return (
    <div className="min-h-screen bg-background">
      <Navbar />

      {/* Hero Banner */}
      <section className="pt-28 pb-16 bg-gradient-romantic relative overflow-hidden">
        <div className="absolute top-10 left-10 w-48 h-48 bg-secondary/20 rounded-full blur-3xl animate-float" />
        <div className="absolute bottom-10 right-10 w-64 h-64 bg-primary/15 rounded-full blur-3xl animate-float-delayed" />
        {[...Array(6)].map((_, i) => (
          <Sparkles key={i} className="absolute text-secondary/20 animate-sparkle"
            style={{ left: `${10 + i * 15}%`, top: `${20 + (i % 3) * 25}%`, width: `${16 + i * 3}px`, animationDelay: `${i * 0.3}s` }} />
        ))}

        <div className="container mx-auto px-4 relative z-10 text-center">
          <div className="inline-flex items-center gap-2 px-5 py-2.5 rounded-full bg-white/80 backdrop-blur-sm border border-primary/10 mb-4 shadow-soft animate-fade-in-up">
            <Sparkles className="w-4 h-4 text-secondary animate-sparkle" />
            <span className="text-sm font-medium text-primary">#1 Matrimony</span>
          </div>
          <h1 className="font-serif text-4xl md:text-6xl font-bold text-foreground mb-4 animate-fade-in-up" style={{ animationDelay: "0.1s" }}>
            About <span className="text-gradient-gold">Us</span>
          </h1>
          <p className="text-muted-foreground max-w-2xl mx-auto text-lg animate-fade-in-up" style={{ animationDelay: "0.2s" }}>
            Most Trusted and premium Matrimony Service in the World
          </p>
        </div>
      </section>

      {/* Features */}
      <section className="py-16">
        <div className="container mx-auto px-4">
          <div className="grid md:grid-cols-3 gap-8 -mt-16 relative z-20">
            {features.map((f, i) => (
              <motion.div key={f.title} initial={{ opacity: 0, y: 30 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ delay: i * 0.15 }}
                className="bg-white rounded-3xl p-8 shadow-card hover-lift text-center border border-primary/10">
                <div className="w-16 h-16 mx-auto rounded-2xl bg-accent-gold flex items-center justify-center mb-4 shadow-gold">
                  <f.icon className="w-8 h-8 text-secondary" />
                </div>
                <h3 className="font-serif text-xl font-bold text-foreground mb-2">{f.title}</h3>
                <p className="text-muted-foreground text-sm">{f.description}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Welcome Section */}
      <section className="py-16 bg-white">
        <div className="container mx-auto px-4">
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            <motion.div initial={{ opacity: 0, x: -40 }} whileInView={{ opacity: 1, x: 0 }} viewport={{ once: true }} className="relative">
              <div className="rounded-3xl overflow-hidden shadow-elevated">
                <img src="https://images.unsplash.com/photo-1519741497674-611481863552?w=600&h=400&fit=crop" alt="Happy couple" className="w-full h-80 object-cover" />
              </div>
              <div className="absolute -bottom-6 -right-6 w-40 h-40 rounded-2xl overflow-hidden shadow-elevated border-4 border-white">
                <img src="https://images.unsplash.com/photo-1529634597503-139d3726fed5?w=200&h=200&fit=crop" alt="Wedding" className="w-full h-full object-cover" />
              </div>
            </motion.div>
            <motion.div initial={{ opacity: 0, x: 40 }} whileInView={{ opacity: 1, x: 0 }} viewport={{ once: true }}>
              <h2 className="font-serif text-3xl md:text-4xl font-bold text-foreground mb-4">
                Welcome to <span className="text-gradient-primary italic">Aiswarya Matrimony</span>
              </h2>
              <p className="text-muted-foreground mb-4 leading-relaxed">
                Best wedding matrimony — it is a long established fact that finding your life partner is one of the most important decisions. We make it beautiful and seamless.
              </p>
              <p className="text-muted-foreground mb-6 leading-relaxed">
                There are many paths to finding love, but ours is backed by trust, technology, and a commitment to your happiness.
              </p>
              <div className="flex flex-wrap gap-6 text-sm mb-8">
                <div className="flex items-center gap-2"><Phone className="w-4 h-4 text-secondary" /><span className="italic text-secondary font-semibold">+91 2242 3366</span></div>
                <div className="flex items-center gap-2"><Mail className="w-4 h-4 text-secondary" /><span className="italic text-secondary font-semibold">info@eternalbond.com</span></div>
              </div>
              <div className="grid grid-cols-4 gap-4">
                {stats.map((s, i) => (
                  <motion.div key={s.label} initial={{ opacity: 0, scale: 0.8 }} whileInView={{ opacity: 1, scale: 1 }} viewport={{ once: true }} transition={{ delay: i * 0.1 }}
                    className="text-center">
                    <div className="font-serif text-2xl font-bold text-gradient-primary">{s.value}</div>
                    <div className="text-xs text-muted-foreground">{s.label}</div>
                  </motion.div>
                ))}
              </div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Testimonials */}
      <section className="py-16 bg-gradient-romantic">
        <div className="container mx-auto px-4">
          <div className="text-center mb-12">
            <h2 className="font-serif text-3xl md:text-4xl font-bold text-foreground mb-4">Customer <span className="text-gradient-gold">Testimonials</span></h2>
          </div>
          <div className="grid md:grid-cols-3 gap-8 max-w-5xl mx-auto">
            {testimonials.map((t, i) => (
              <motion.div key={t.name} initial={{ opacity: 0, y: 30 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ delay: i * 0.15 }}
                className="bg-white rounded-3xl p-6 shadow-card hover-lift">
                <div className="flex gap-1 mb-3">
                  {[...Array(t.rating)].map((_, j) => <Star key={j} className="w-4 h-4 text-secondary fill-secondary" />)}
                  <span className="text-xs text-muted-foreground ml-2">(50 Reviews)</span>
                </div>
                <p className="text-muted-foreground text-sm mb-4 italic">"{t.review}"</p>
                <div className="flex items-center gap-3">
                  <img src={t.avatar} alt={t.name} className="w-12 h-12 rounded-full object-cover" />
                  <div>
                    <h4 className="font-serif font-bold text-foreground text-sm">{t.name}</h4>
                    <p className="text-xs text-muted-foreground">{t.role}</p>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Team */}
      <section className="py-16">
        <div className="container mx-auto px-4">
          <div className="text-center mb-12">
            <p className="text-sm text-secondary font-medium uppercase tracking-wider mb-2">Our Professionals</p>
            <h2 className="font-serif text-3xl md:text-4xl font-bold text-foreground">Meet Our <span className="text-gradient-gold">Team</span></h2>
          </div>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8 max-w-4xl mx-auto">
            {team.map((member, i) => (
              <motion.div key={member.name} initial={{ opacity: 0, y: 30 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ delay: i * 0.1 }}
                className="text-center group">
                <div className="relative rounded-2xl overflow-hidden shadow-card mb-4 hover-lift">
                  <img src={member.avatar} alt={member.name} className="w-full h-48 object-cover transition-transform duration-500 group-hover:scale-110" />
                  <div className="absolute inset-0 bg-gradient-to-t from-primary/40 to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />
                </div>
                <h4 className="font-serif font-bold text-foreground">{member.name}</h4>
                <p className="text-xs text-muted-foreground">{member.role}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      <Footer />
    </div>
  );
};

export default AboutPage;
