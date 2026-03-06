import { motion } from "framer-motion";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { Sparkles, Star, Users, Phone, Mail, Facebook, Twitter, Linkedin, Instagram, Heart } from "lucide-react";

const features = [
  { emoji: "🏅", title: "Genuine Profiles", description: "The most trusted wedding matrimony brand with 100% verified profiles" },
  { emoji: "🤝🛡️", title: "Most Trusted", description: "The most trusted wedding matrimony brand trusted by millions" },
  { emoji: "💍💕", title: "2000+ Weddings", description: "The most trusted wedding matrimony brand with thousands of success stories" },
];

const stats = [
  { value: "2K", label: "COUPLES PAIRED", icon: Heart },
  { value: "4000+", label: "REGISTERED USERS", icon: Users },
  { value: "1600+", label: "MENS", icon: Users },
  { value: "2000+", label: "WOMENS", icon: Users },
];

const testimonials = [
  { name: "John Smith", role: "IT Professional", avatar: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=100&h=100&fit=crop&crop=face", review: "It is a long established fact that a reader will be distracted by the readable content of a page when looking at its layout. The service is amazing!", rating: 5 },
  { name: "Julia Ann", role: "Teacher", avatar: "https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=100&h=100&fit=crop&crop=face", review: "It is a long established fact that a reader will be distracted by the readable content of a page when looking at its layout. Highly recommended!", rating: 5 },
  { name: "William Son", role: "Government Staff", avatar: "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=100&h=100&fit=crop&crop=face", review: "It is a long established fact that a reader will be distracted by the readable content of a page when looking at its layout. Excellent platform!", rating: 5 },
];

const team = [
  {
    name: "Ashley Jen",
    role: "Marketing Manager",
    avatar: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=400&h=500&fit=crop&crop=face",
    bgColor: "bg-cyan-400",
  },
  {
    name: "Ashley Jen",
    role: "Marketing Manager",
    avatar: "https://images.unsplash.com/photo-1517841905240-472988babdf9?w=400&h=500&fit=crop&crop=face",
    bgColor: "bg-amber-400",
  },
  {
    name: "Emily Arrov",
    role: "Creative Manager",
    avatar: "https://images.unsplash.com/photo-1580489944761-15a19d654956?w=400&h=500&fit=crop&crop=face",
    bgColor: "bg-sky-300",
  },
  {
    name: "Julia Sear",
    role: "Client Coordinator",
    avatar: "https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?w=400&h=500&fit=crop&crop=face",
    bgColor: "bg-red-400",
  },
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
          <div className="inline-flex items-center gap-2 px-5 py-2.5 rounded-full bg-card/80 backdrop-blur-sm border border-primary/10 mb-4 shadow-soft animate-fade-in-up">
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
                className="bg-card rounded-3xl p-8 shadow-card hover-lift text-center border border-primary/10">
                <div className="w-20 h-20 mx-auto rounded-full bg-accent-gold/60 flex items-center justify-center mb-4">
                  <span className="text-3xl">{f.emoji}</span>
                </div>
                <h3 className="font-serif text-xl font-bold text-foreground mb-2">{f.title}</h3>
                <p className="text-muted-foreground text-sm">{f.description}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Welcome Section */}
      <section className="py-16 bg-card relative overflow-hidden">
        <div className="container mx-auto px-4">
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            {/* Left - Overlapping wedding photos */}
            <motion.div initial={{ opacity: 0, x: -40 }} whileInView={{ opacity: 1, x: 0 }} viewport={{ once: true }} className="relative flex items-center justify-center min-h-[420px]">
              <div className="relative w-full max-w-[480px] mx-auto">
                {/* Background decorative shape */}
                <div className="absolute -top-4 -left-4 w-[320px] h-[260px] rounded-3xl bg-accent-rose/40 -z-10" />
                
                {/* Main image */}
                <motion.div
                  className="relative z-10 rounded-2xl overflow-hidden shadow-elevated w-[300px] h-[220px]"
                  whileHover={{ scale: 1.02 }}
                  transition={{ duration: 0.3 }}
                >
                  <img
                    src="https://images.unsplash.com/photo-1519741497674-611481863552?w=600&h=400&fit=crop"
                    alt="Wedding couple with bouquet"
                    className="w-full h-full object-cover"
                  />
                </motion.div>

                {/* Overlapping second image */}
                <motion.div
                  className="absolute top-[120px] left-[140px] z-20 rounded-2xl overflow-hidden shadow-elevated w-[300px] h-[220px] border-4 border-card"
                  whileHover={{ scale: 1.02 }}
                  transition={{ duration: 0.3 }}
                >
                  <img
                    src="https://images.unsplash.com/photo-1591604466107-ec97de577aff?w=600&h=400&fit=crop"
                    alt="Wedding rings hands"
                    className="w-full h-full object-cover"
                  />
                </motion.div>

                {/* Decorative gold circle */}
                <motion.div
                  className="absolute -top-2 left-[180px] z-30 w-12 h-12 rounded-full border-[3px] border-secondary"
                  animate={{ scale: [1, 1.1, 1] }}
                  transition={{ duration: 3, repeat: Infinity }}
                />

                {/* Small decorative circle bottom-right */}
                <div className="absolute bottom-0 right-4 w-8 h-8 rounded-full bg-accent-rose/60 -z-10" />
              </div>
            </motion.div>

            {/* Right - Content */}
            <motion.div initial={{ opacity: 0, x: 40 }} whileInView={{ opacity: 1, x: 0 }} viewport={{ once: true }}>
              <h2 className="font-serif text-3xl md:text-5xl font-bold text-foreground mb-2 uppercase tracking-wider">
                Welcome to
              </h2>
              <h3 className="font-serif text-3xl md:text-4xl font-bold mb-6">
                <span className="text-gradient-primary italic">Wedding Matrimony</span>
              </h3>
              <p className="text-muted-foreground mb-4 leading-relaxed">
                Aiswarya Bureau is a trusted matrimonial service with over 37 years of experience in connecting suitable brides and grooms. Located near Cherthala Private Bus Stand in Alappuzha District, Kerala, we serve families both within Kerala and outside the state.
              </p>
              <p className="text-muted-foreground mb-4 leading-relaxed">
                Our experienced team understands the preferences of families and helps them find the right life partner. Built on the values of trust, responsibility, and sincerity, we are committed to providing the best matrimonial connections at a reasonable cost.
              </p>
              <p className="text-muted-foreground mb-6 leading-relaxed">
                For more than three decades, Aiswarya Vivaha Bureau has been helping people build happy and meaningful marriages.
              </p>

              <div className="flex flex-wrap gap-8 text-sm">
                <div className="flex items-center gap-3">
                  <div className="w-12 h-12 rounded-full bg-foreground/80 flex items-center justify-center">
                    <Phone className="w-5 h-5 text-primary-foreground" />
                  </div>
                  <div>
                    <p className="text-xs text-muted-foreground">Enquiry</p>
                    <span className="font-semibold text-foreground">+01 2242 3366</span>
                  </div>
                </div>
                <div className="flex items-center gap-3">
                  <div className="w-12 h-12 rounded-full bg-foreground/80 flex items-center justify-center">
                    <Mail className="w-5 h-5 text-primary-foreground" />
                  </div>
                  <div>
                    <p className="text-xs text-muted-foreground">Get Support</p>
                    <span className="font-semibold text-foreground">info@example.com</span>
                  </div>
                </div>
              </div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Stats Bar - Matching reference */}
      <section className="py-12 bg-gradient-romantic relative overflow-hidden">
        <div className="absolute bottom-4 right-[10%] w-12 h-12 rounded-full border-3 border-accent-rose opacity-40" />

        <div className="container mx-auto px-4">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
            {stats.map((s, i) => (
              <motion.div
                key={s.label}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.15 }}
                className="text-center border-r last:border-r-0 border-border/50"
              >
                <div className="flex items-center justify-center gap-3 mb-2">
                  <div className="w-10 h-10 rounded-lg bg-accent-gold flex items-center justify-center">
                    <s.icon className="w-5 h-5 text-secondary-dark" />
                  </div>
                  <motion.span
                    className="font-serif text-3xl md:text-4xl font-bold text-foreground"
                    initial={{ opacity: 0 }}
                    whileInView={{ opacity: 1 }}
                    viewport={{ once: true }}
                    transition={{ delay: 0.3 + i * 0.1 }}
                  >
                    {s.value}
                  </motion.span>
                </div>
                <p className="text-xs font-semibold text-muted-foreground uppercase tracking-widest">{s.label}</p>
              </motion.div>
            ))}
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
                className="bg-card rounded-3xl p-6 shadow-card hover-lift">
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

      {/* Team - Matching reference with colorful backgrounds and hover effects */}
      <section className="py-16">
        <div className="container mx-auto px-4">
          <div className="text-center mb-12">
            <p className="text-sm text-secondary font-medium uppercase tracking-[0.3em] mb-2 font-serif">Our Professionals</p>
            <h2 className="font-serif text-3xl md:text-4xl font-bold text-foreground mb-4">Meet Our <span className="text-gradient-gold">Team</span></h2>
            {/* Flower divider */}
            <div className="flex items-center justify-center gap-1 opacity-60">
              <div className="w-12 h-[1px] bg-secondary" />
              <span className="text-secondary text-lg">🌿🌸🌿</span>
              <div className="w-12 h-[1px] bg-secondary" />
            </div>
          </div>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8 max-w-5xl mx-auto">
            {team.map((member, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.1 }}
                className="group cursor-pointer"
              >
                <div className={`relative rounded-2xl overflow-hidden shadow-card mb-4 ${member.bgColor}`}>
                  <img
                    src={member.avatar}
                    alt={member.name}
                    className="w-full h-56 md:h-64 object-cover transition-transform duration-500 group-hover:scale-110"
                  />
                  {/* Hover overlay with social icons */}
                  <motion.div
                    className="absolute inset-0 bg-primary/60 flex items-center justify-center gap-3 opacity-0 group-hover:opacity-100 transition-all duration-300"
                  >
                    {[Facebook, Twitter, Linkedin, Instagram].map((Icon, j) => (
                      <motion.div
                        key={j}
                        initial={{ y: 20, opacity: 0 }}
                        whileHover={{ scale: 1.2 }}
                        className="w-9 h-9 rounded-full bg-card/90 flex items-center justify-center group-hover:animate-fade-in-up"
                        style={{ animationDelay: `${j * 0.1}s` }}
                      >
                        <Icon className="w-4 h-4 text-primary" />
                      </motion.div>
                    ))}
                  </motion.div>
                </div>
                <div className="text-center">
                  <h4 className="font-serif font-bold text-foreground text-lg">{member.name}</h4>
                  <p className="text-sm text-muted-foreground">{member.role}</p>
                </div>
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
