import { motion } from "framer-motion";
import { Award, Shield, Heart, Sparkles } from "lucide-react";

const features = [
  {
    icon: Award,
    title: "Genuine Profiles",
    description: "Contact genuine profiles with 100% verified mobile numbers and background checks",
  },
  {
    icon: Shield,
    title: "Most Trusted",
    description: "The most trusted wedding matrimony brand with millions of happy members",
  },
  {
    icon: Heart,
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
    <section className="py-24 relative overflow-hidden">
      <div className="absolute top-20 right-10 w-72 h-72 bg-secondary/10 rounded-full blur-3xl animate-float" />
      <div className="absolute bottom-20 left-10 w-48 h-48 bg-primary/10 rounded-full blur-3xl animate-float-delayed" />

      {[...Array(5)].map((_, i) => (
        <Sparkles
          key={i}
          className="absolute text-secondary/20 animate-sparkle"
          style={{
            left: `${10 + i * 18}%`,
            top: `${15 + (i % 3) * 25}%`,
            width: `${16 + i * 3}px`,
            animationDelay: `${i * 0.4}s`,
          }}
        />
      ))}

      <div className="container mx-auto px-4 relative z-10">
        {/* Header */}
        <div className="text-center mb-16">
          <div className="inline-flex items-center gap-2 px-5 py-2.5 rounded-full bg-white/80 backdrop-blur-sm border border-primary/10 mb-4 animate-fade-in-up shadow-soft">
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

        {/* Features */}
        <div className="grid md:grid-cols-3 gap-8 mb-20">
          {features.map((feature, index) => (
            <motion.div
              key={feature.title}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: index * 0.15 }}
              className="bg-white/80 backdrop-blur-sm rounded-3xl p-8 border border-primary/10 shadow-card hover-lift group text-center"
            >
              <div className="w-16 h-16 mx-auto rounded-2xl bg-accent-gold flex items-center justify-center mb-6 group-hover:scale-110 transition-transform shadow-gold">
                <feature.icon className="w-8 h-8 text-secondary" />
              </div>
              <h3 className="font-serif text-xl font-bold text-foreground mb-3">{feature.title}</h3>
              <p className="text-muted-foreground leading-relaxed">{feature.description}</p>
            </motion.div>
          ))}
        </div>

        {/* Welcome Section */}
        <div className="grid lg:grid-cols-2 gap-12 items-center mb-20">
          <motion.div
            initial={{ opacity: 0, x: -40 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            className="relative"
          >
            <div className="relative rounded-3xl overflow-hidden shadow-elevated">
              <img
                src="https://images.unsplash.com/photo-1519741497674-611481863552?w=600&h=400&fit=crop"
                alt="Happy couple"
                className="w-full h-80 object-cover"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-primary/30 to-transparent" />
            </div>
            <div className="absolute -bottom-6 -right-6 w-40 h-40 rounded-2xl overflow-hidden shadow-elevated border-4 border-white">
              <img
                src="https://images.unsplash.com/photo-1529634597503-139d3726fed5?w=200&h=200&fit=crop"
                alt="Wedding couple"
                className="w-full h-full object-cover"
              />
            </div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, x: 40 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
          >
            <h2 className="font-serif text-3xl md:text-4xl font-bold text-foreground mb-4">
              Welcome to <span className="text-gradient-primary italic">EternalBond</span>
            </h2>
            <p className="text-muted-foreground mb-4 leading-relaxed">
              Best wedding matrimony — it is a long established fact that finding your life partner is
              one of the most important decisions you'll ever make. We make it beautiful and seamless.
            </p>
            <p className="text-muted-foreground mb-6 leading-relaxed">
              There are many paths to finding love, but ours is backed by trust, technology, and a
              commitment to your happiness. Start your matrimony journey with us today.
            </p>
            <div className="flex flex-wrap gap-6 text-sm">
              <div className="flex items-center gap-2">
                <span className="font-serif font-bold text-primary">Enquiry</span>
                <span className="italic text-secondary font-semibold">+91 2242 3366</span>
              </div>
              <div className="flex items-center gap-2">
                <span className="font-serif font-bold text-primary">Support</span>
                <span className="italic text-secondary font-semibold">info@eternalbond.com</span>
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
              className="bg-white/70 backdrop-blur-sm rounded-2xl p-6 text-center border border-primary/10 shadow-card hover-lift"
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
