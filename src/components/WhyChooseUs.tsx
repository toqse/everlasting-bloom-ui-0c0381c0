import { motion } from "framer-motion";
import { Phone, Mail, Sparkles } from "lucide-react";

/* Original-style icons: medal with star & ribbon, handshake + shield, ring + hearts */
const IconGenuine = () => (
  <svg viewBox="0 0 64 64" className="w-10 h-10 shrink-0" fill="none" xmlns="http://www.w3.org/2000/svg" aria-hidden>
    <circle cx="32" cy="26" r="14" fill="#D4A84B" stroke="#B8860B" strokeWidth="1.5" />
    <path d="M32 18l3.5 7 7.5 1-5.5 5.5 1.5 7.5L32 35l-6 4 1.5-7.5-5.5-5.5 7.5-1L32 18z" fill="#fff" stroke="#B8860B" strokeWidth="0.8" strokeLinejoin="round" />
    <path d="M22 42h20v6c0 2-1.5 4-4 4H26c-2.5 0-4-2-4-4v-6z" fill="#D4A84B" stroke="#B8860B" strokeWidth="1.2" />
    <path d="M26 48h12M28 52h8" stroke="#B8860B" strokeWidth="1" strokeLinecap="round" />
    <rect x="26" y="54" width="12" height="6" rx="1" fill="#8B5CF6" />
    <rect x="26" y="58" width="4" height="2" fill="#93C5FD" /><rect x="34" y="58" width="4" height="2" fill="#93C5FD" />
  </svg>
);
const IconTrusted = () => (
  <svg viewBox="0 0 64 64" className="w-10 h-10 shrink-0" fill="none" xmlns="http://www.w3.org/2000/svg" aria-hidden>
    <path d="M20 34l6-6 4 4 8-8 6 6" stroke="#D4A84B" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" fill="none" />
    <path d="M28 28v-4c0-2 2-4 4-4s4 2 4 4v4" stroke="#D4A84B" strokeWidth="2" fill="none" />
    <path d="M24 30c-2 0-4 2-4 4v2h16v-2c0-2-2-4-4-4" stroke="#D4A84B" strokeWidth="1.8" fill="none" />
    <path d="M32 38c-6 0-10 4-10 10v8h20v-8c0-6-4-10-10-10z" fill="#3B82F6" stroke="#2563EB" strokeWidth="1.5" />
    <path d="M32 42l2 2 4-4" stroke="#fff" strokeWidth="1.2" strokeLinecap="round" strokeLinejoin="round" />
  </svg>
);
const IconWeddings = () => (
  <svg viewBox="0 0 64 64" className="w-10 h-10 shrink-0" fill="none" xmlns="http://www.w3.org/2000/svg" aria-hidden>
    <circle cx="32" cy="26" r="11" stroke="#A78BFA" strokeWidth="2.5" fill="none" />
    <circle cx="32" cy="26" r="7" stroke="#A78BFA" strokeWidth="2" fill="none" />
    <path d="M32 19v14M25 26h14" stroke="#A78BFA" strokeWidth="2" />
    <path d="M22 40c0-2 2-4 5-5 2-.8 4-.8 6 0 3 1 5 3 5 5v4H22v-4z" fill="#EF4444" stroke="#DC2626" strokeWidth="1.2" />
    <path d="M42 40c0-2-2-4-5-5-2-.8-4-.8-6 0-3 1-5 3-5 5v4h10v-4z" fill="#EF4444" stroke="#DC2626" strokeWidth="1.2" />
    <path d="M28 38c1.2-1 2.8-1.5 4-1.5s2.8.5 4 1.5M36 38c1.2-1 2.8-1.5 4-1.5s2.8.5 4 1.5" stroke="#EF4444" strokeWidth="1.2" strokeLinecap="round" fill="none" />
  </svg>
);

const features = [
  {
    icon: IconGenuine,
    title: "Genuine Profiles",
    description: "Contact genuine profiles with 100% verified mobile numbers and background checks",
  },
  {
    icon: IconTrusted,
    title: "Most Trusted",
    description: "The most trusted wedding matrimony brand with millions of happy members",
  },
  {
    icon: IconWeddings,
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
    <section className="py-12 sm:py-16 md:py-24 relative overflow-hidden bg-card">
      {/* Clean background - no image boxes */}
      <div className="absolute top-20 right-10 w-72 h-72 bg-secondary/5 rounded-full blur-[100px]" />
      <div className="absolute bottom-20 left-10 w-48 h-48 bg-primary/5 rounded-full blur-[100px]" />

      <div className="container mx-auto px-4 relative z-10">
        {/* Header */}
        <div className="text-center mb-10 sm:mb-16">
          <div className="inline-flex items-center gap-2 px-5 py-2.5 rounded-full bg-background/80 backdrop-blur-sm border border-primary/10 mb-4 animate-fade-in-up shadow-soft">
            <Sparkles className="w-4 h-4 text-secondary animate-sparkle" />
            <span className="text-sm font-medium text-primary">#1 Matrimony</span>
          </div>
          <h2 className="font-serif text-3xl sm:text-4xl md:text-5xl font-bold text-foreground mb-4 animate-fade-in-up" style={{ animationDelay: "0.1s" }}>
            Why Choose <span className="text-gradient-gold">Us</span>
          </h2>
          <p className="text-muted-foreground max-w-2xl mx-auto animate-fade-in-up" style={{ animationDelay: "0.2s" }}>
            Most Trusted and premium Matrimony Service in the World
          </p>
        </div>

        {/* Features with emoji icons like reference */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 sm:gap-8 mb-12 sm:mb-20">
          {features.map((feature, index) => {
            const Icon = feature.icon;
            return (
              <motion.div
                key={feature.title}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.15 }}
                className="bg-background rounded-3xl p-8 border border-primary/5 shadow-card hover-lift group text-center"
              >
                <div className="w-20 h-20 mx-auto rounded-full bg-accent-gold/60 flex items-center justify-center mb-6 group-hover:scale-110 transition-transform text-foreground">
                  <Icon />
                </div>
                <h3 className="font-serif text-xl font-bold text-foreground mb-3">{feature.title}</h3>
                <p className="text-muted-foreground leading-relaxed">{feature.description}</p>
              </motion.div>
            );
          })}
        </div>

        {/* Welcome to Aiswarya Matrimony - exact reference layout */}
        <div className="grid lg:grid-cols-2 gap-8 sm:gap-12 items-center mb-12 sm:mb-20">
          <motion.div
            initial={{ opacity: 0, x: -40 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            className="relative flex flex-col lg:block min-h-0 lg:min-h-[520px]"
          >
            {/* Main large image - full width on mobile, 65% on lg */}
            <motion.div
              className="relative z-[2] w-full lg:w-[65%] rounded-2xl overflow-hidden shadow-elevated shrink-0"
              whileHover={{ scale: 1.02 }}
              transition={{ type: "spring", stiffness: 200 }}
            >
              <img
                src="/images/christian.png"
                alt="Wedding couple"
                className="w-full h-[240px] sm:h-[280px] lg:h-[320px] object-cover object-[center_30%]"
              />
            </motion.div>

            {/* Second image - stacked on mobile, overlapping on lg */}
            <motion.div
              className="relative mt-4 lg:absolute lg:bottom-0 lg:left-[25%] lg:mt-0 w-full lg:w-[65%] z-[3] rounded-2xl overflow-hidden shadow-elevated border-4 lg:border-[6px] border-card"
              initial={{ opacity: 0, y: 40, x: 20 }}
              whileInView={{ opacity: 1, y: 0, x: 0 }}
              viewport={{ once: true }}
              transition={{ delay: 0.4 }}
              whileHover={{ scale: 1.03 }}
            >
              <img
                src="/images/Wedding%20day.jpg"
                alt="Wedding rings and flowers"
                className="w-full h-[200px] sm:h-[240px] lg:h-[300px] object-cover object-center"
              />
            </motion.div>

            {/* Pink/rose rounded rectangle decoration bottom-right - hidden on small mobile */}
            <div className="absolute -bottom-4 right-[5%] w-20 h-20 sm:w-28 sm:h-28 rounded-2xl border-[4px] sm:border-[5px] border-accent-rose z-[1] hidden sm:block pointer-events-none" />
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
