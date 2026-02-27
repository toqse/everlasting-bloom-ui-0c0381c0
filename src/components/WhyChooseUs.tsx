import { motion } from "framer-motion";
import { Phone, Mail, Sparkles } from "lucide-react";

const features = [
  {
    emoji: "🏅",
    title: "Genuine Profiles",
    description: "Contact genuine profiles with 100% verified mobile numbers and background checks",
  },
  {
    emoji: "🤝🛡️",
    title: "Most Trusted",
    description: "The most trusted wedding matrimony brand with millions of happy members",
  },
  {
    emoji: "💍💕",
    title: "2000+ Weddings",
    description: "Lakhs of people have found their life partner through our platform",
  },
];

const stats = [
  { value: "2K", label: "Couples Paired" },
  { value: "4000+", label: "Registered Users" },
  { value: "1600+", label: "Men" },
  { value: "2000+", label: "Women" },
];

const WhyChooseUs = () => {
  return (
    <section className="py-24 relative overflow-hidden bg-card">
      {/* Clean background - no image boxes */}
      <div className="absolute top-20 right-10 w-72 h-72 bg-secondary/5 rounded-full blur-[100px]" />
      <div className="absolute bottom-20 left-10 w-48 h-48 bg-primary/5 rounded-full blur-[100px]" />

      <div className="container mx-auto px-4 relative z-10">
        {/* Header */}
        <div className="text-center mb-16">
          <div className="inline-flex items-center gap-2 px-5 py-2.5 rounded-full bg-background/80 backdrop-blur-sm border border-primary/10 mb-4 animate-fade-in-up shadow-soft">
            <Sparkles className="w-4 h-4 text-secondary animate-sparkle" />
            <span className="text-sm font-medium text-primary">#1 Matrimony</span>
          </div>
          <h2 className="font-serif text-4xl md:text-5xl font-bold text-foreground mb-4 animate-fade-in-up" style={{ animationDelay: "0.1s" }}>
            Why Choose <span className="text-gradient-gold">Us</span>
          </h2>
          <p className="text-muted-foreground max-w-2xl mx-auto animate-fade-in-up" style={{ animationDelay: "0.2s" }}>
            Most Trusted and premium Matrimony Service in the World
          </p>
        </div>

        {/* Features with emoji icons like reference */}
        <div className="grid md:grid-cols-3 gap-8 mb-20">
          {features.map((feature, index) => (
            <motion.div
              key={feature.title}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: index * 0.15 }}
              className="bg-background rounded-3xl p-8 border border-primary/5 shadow-card hover-lift group text-center"
            >
              <div className="w-20 h-20 mx-auto rounded-full bg-accent-gold/60 flex items-center justify-center mb-6 group-hover:scale-110 transition-transform">
                <span className="text-3xl">{feature.emoji}</span>
              </div>
              <h3 className="font-serif text-xl font-bold text-foreground mb-3">{feature.title}</h3>
              <p className="text-muted-foreground leading-relaxed">{feature.description}</p>
            </motion.div>
          ))}
        </div>

        {/* Welcome to Aiswarya Matrimony - exact reference layout */}
        <div className="grid lg:grid-cols-2 gap-12 items-center mb-20">
          <motion.div
            initial={{ opacity: 0, x: -40 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            className="relative min-h-[520px]"
          >
            {/* Gold circle decoration top-left */}
            <motion.div
              className="absolute -top-2 left-[15%] w-20 h-20 rounded-full border-[5px] border-secondary z-10"
              initial={{ scale: 0, rotate: -180 }}
              whileInView={{ scale: 1, rotate: 0 }}
              viewport={{ once: true }}
              transition={{ type: "spring", delay: 0.3 }}
            />

            {/* Main large image - top left, slightly tilted */}
            <motion.div
              className="relative z-[2] w-[65%] rounded-2xl overflow-hidden shadow-elevated"
              whileHover={{ scale: 1.02 }}
              transition={{ type: "spring", stiffness: 200 }}
            >
              <img
                src="https://images.unsplash.com/photo-1519741497674-611481863552?w=600&h=450&fit=crop"
                alt="Couple with fairy lights"
                className="w-full h-[320px] object-cover"
              />
            </motion.div>

            {/* Overlapping second image - bottom right, overlapping */}
            <motion.div
              className="absolute bottom-0 left-[25%] w-[65%] z-[3] rounded-2xl overflow-hidden shadow-elevated border-[6px] border-card"
              initial={{ opacity: 0, y: 40, x: 20 }}
              whileInView={{ opacity: 1, y: 0, x: 0 }}
              viewport={{ once: true }}
              transition={{ delay: 0.4 }}
              whileHover={{ scale: 1.03 }}
            >
              <img
                src="https://images.unsplash.com/photo-1529634597503-139d3726fed5?w=600&h=400&fit=crop"
                alt="Wedding couple with veil"
                className="w-full h-[300px] object-cover"
              />
            </motion.div>

            {/* Pink/rose rounded rectangle decoration bottom-right */}
            <div className="absolute -bottom-4 right-[5%] w-28 h-28 rounded-2xl border-[5px] border-accent-rose z-[1]" />
          </motion.div>

          {/* Right - Content matching reference exactly */}
          <motion.div initial={{ opacity: 0, x: 40 }} whileInView={{ opacity: 1, x: 0 }} viewport={{ once: true }}>
            <h2 className="font-serif text-4xl md:text-5xl font-bold text-foreground mb-1 uppercase tracking-wider" style={{ textDecoration: "underline", textDecorationColor: "hsl(var(--secondary))", textUnderlineOffset: "8px" }}>
              Welcome to
            </h2>
            <h3 className="font-serif text-3xl md:text-4xl font-bold mb-6">
              <span className="text-gradient-primary italic">Aiswarya Matrimony</span>
            </h3>
            <p className="text-muted-foreground mb-4 leading-relaxed text-base">
              Best wedding matrimony — it is a long established fact that a reader will be distracted by the readable content of a page when looking at its layout.
            </p>
            <p className="mb-4">
              <span className="text-primary font-semibold cursor-pointer hover:underline">Click here to </span>
              <span className="text-muted-foreground">Start your matrimony service now.</span>
            </p>

            <div className="border-t border-border my-6" />

            <p className="text-muted-foreground mb-8 leading-relaxed text-base">
              There are many variations of passages of Lorem Ipsum available, but the majority have suffered alteration in some form, by injected humour, or randomised words which don't look even slightly believable.
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

        {/* Stats */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
          {stats.map((stat, index) => (
            <motion.div
              key={stat.label}
              initial={{ opacity: 0, scale: 0.8 }}
              whileInView={{ opacity: 1, scale: 1 }}
              viewport={{ once: true }}
              transition={{ delay: index * 0.1 }}
              className="bg-background rounded-2xl p-6 text-center border border-primary/10 shadow-card hover-lift"
            >
              <div className="font-serif text-3xl md:text-4xl font-bold text-gradient-primary mb-1">
                {stat.value}
              </div>
              <div className="text-sm text-muted-foreground">{stat.label}</div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default WhyChooseUs;
