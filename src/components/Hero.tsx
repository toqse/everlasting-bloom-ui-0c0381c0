import { Heart, Sparkles, ArrowRight } from "lucide-react";
import { Button } from "./ui/button";

const Hero = () => {
  const petals = Array.from({ length: 12 }, (_, i) => i);

  return (
    <section id="home" className="relative min-h-screen flex items-center justify-center overflow-hidden bg-gradient-romantic">
      {/* Floating Petals */}
      {petals.map((_, i) => (
        <div
          key={i}
          className="absolute animate-petal-fall opacity-60"
          style={{
            left: `${Math.random() * 100}%`,
            animationDelay: `${Math.random() * 8}s`,
            animationDuration: `${8 + Math.random() * 4}s`,
          }}
        >
          <Heart
            className="text-primary/30"
            style={{
              width: `${12 + Math.random() * 16}px`,
              height: `${12 + Math.random() * 16}px`,
            }}
            fill="currentColor"
          />
        </div>
      ))}

      {/* Decorative Elements */}
      <div className="absolute top-1/4 left-10 w-32 h-32 bg-secondary/20 rounded-full blur-3xl animate-float" />
      <div className="absolute bottom-1/3 right-10 w-40 h-40 bg-primary/20 rounded-full blur-3xl animate-float-delayed" />
      <div className="absolute top-1/3 right-1/4 w-24 h-24 bg-accent-pink rounded-full blur-2xl animate-pulse-soft" />

      {/* 3D Ring Elements */}
      <div className="absolute left-[10%] top-[30%] hidden lg:block animate-float">
        <div className="relative w-20 h-20">
          <div className="absolute inset-0 border-4 border-secondary rounded-full transform rotate-45 shadow-gold" />
          <div className="absolute inset-2 border-2 border-secondary/50 rounded-full transform -rotate-12" />
          <Sparkles className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-6 h-6 text-secondary animate-sparkle" />
        </div>
      </div>

      <div className="absolute right-[12%] bottom-[35%] hidden lg:block animate-float-delayed">
        <div className="relative w-16 h-16">
          <div className="absolute inset-0 border-4 border-primary rounded-full transform -rotate-12 shadow-soft" />
          <Heart className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-5 h-5 text-primary fill-primary animate-heart-beat" />
        </div>
      </div>

      {/* Main Content */}
      <div className="container mx-auto px-4 pt-24 pb-16 relative z-10">
        <div className="max-w-4xl mx-auto text-center">
          {/* Badge */}
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-white/60 backdrop-blur-sm border border-primary/20 shadow-soft mb-8 animate-fade-in-up">
            <Sparkles className="w-4 h-4 text-secondary animate-sparkle" />
            <span className="text-sm font-medium text-primary">India's Most Trusted Matrimony</span>
            <Sparkles className="w-4 h-4 text-secondary animate-sparkle" />
          </div>

          {/* Heading */}
          <h1 className="font-serif text-5xl md:text-6xl lg:text-7xl font-bold text-foreground leading-tight mb-6 animate-fade-in-up" style={{ animationDelay: "0.1s" }}>
            Find Your{" "}
            <span className="relative inline-block">
              <span className="text-gradient-primary">Forever</span>
              <svg className="absolute -bottom-2 left-0 w-full" viewBox="0 0 200 12" fill="none">
                <path d="M2 10C50 2 150 2 198 10" stroke="url(#gold-gradient)" strokeWidth="3" strokeLinecap="round" />
                <defs>
                  <linearGradient id="gold-gradient" x1="0" y1="0" x2="200" y2="0">
                    <stop offset="0%" stopColor="hsl(40, 100%, 56%)" />
                    <stop offset="100%" stopColor="hsl(42, 100%, 68%)" />
                  </linearGradient>
                </defs>
              </svg>
            </span>{" "}
            Love
          </h1>

          {/* Subtitle */}
          <p className="text-lg md:text-xl text-muted-foreground max-w-2xl mx-auto mb-10 animate-fade-in-up" style={{ animationDelay: "0.2s" }}>
            Begin your beautiful journey towards a lifetime of love, trust, and togetherness. 
            Join millions who found their soulmate with EternalBond.
          </p>

          {/* CTA Buttons */}
          <div className="flex flex-col sm:flex-row items-center justify-center gap-4 animate-fade-in-up" style={{ animationDelay: "0.3s" }}>
            <Button variant="hero" size="xl" className="group">
              <Heart className="w-5 h-5 group-hover:animate-heart-beat" fill="currentColor" />
              Start Your Journey
              <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
            </Button>
            <Button variant="outline" size="xl" className="group">
              View Success Stories
            </Button>
          </div>

          {/* Stats */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6 mt-16 animate-fade-in-up" style={{ animationDelay: "0.4s" }}>
            {[
              { value: "5M+", label: "Happy Members" },
              { value: "1M+", label: "Successful Matches" },
              { value: "15+", label: "Years of Trust" },
              { value: "100%", label: "Privacy Secured" },
            ].map((stat, index) => (
              <div
                key={index}
                className="bg-white/60 backdrop-blur-sm rounded-2xl p-6 border border-primary/10 shadow-card hover-lift"
              >
                <div className="font-serif text-3xl md:text-4xl font-bold text-gradient-primary mb-1">
                  {stat.value}
                </div>
                <div className="text-sm text-muted-foreground">{stat.label}</div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Bottom Wave */}
      <div className="absolute bottom-0 left-0 right-0">
        <svg viewBox="0 0 1440 120" fill="none" className="w-full">
          <path
            d="M0 120L60 110C120 100 240 80 360 70C480 60 600 60 720 65C840 70 960 80 1080 85C1200 90 1320 90 1380 90L1440 90V120H1380C1320 120 1200 120 1080 120C960 120 840 120 720 120C600 120 480 120 360 120C240 120 120 120 60 120H0V120Z"
            fill="white"
          />
        </svg>
      </div>
    </section>
  );
};

export default Hero;
