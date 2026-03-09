import { Heart, Sparkles, ArrowRight, Star } from "lucide-react";
import { Button } from "./ui/button";
import { useNavigate } from "react-router-dom";
import weddingHero from "@/assets/wedding-hero.jpg";

const Hero = () => {
  const navigate = useNavigate();
  const petals = Array.from({ length: 20 }, (_, i) => i);
  const sparkles = Array.from({ length: 8 }, (_, i) => i);

  return (
    <section id="home" className="relative min-h-screen flex items-center justify-center overflow-hidden bg-gradient-romantic">
      {/* Animated Background Particles */}
      <div className="absolute inset-0 overflow-hidden">
        {petals.map((_, i) => (
          <div key={`petal-${i}`} className="absolute animate-petal-fall"
            style={{ left: `${Math.random() * 100}%`, animationDelay: `${Math.random() * 10}s`, animationDuration: `${10 + Math.random() * 8}s` }}>
            <Heart className="text-primary/20" style={{ width: `${14 + Math.random() * 20}px`, height: `${14 + Math.random() * 20}px` }} fill="currentColor" />
          </div>
        ))}
        {sparkles.map((_, i) => (
          <div key={`sparkle-${i}`} className="absolute animate-sparkle"
            style={{ left: `${10 + Math.random() * 80}%`, top: `${10 + Math.random() * 80}%`, animationDelay: `${Math.random() * 3}s` }}>
            <Sparkles className="text-secondary/40" style={{ width: `${16 + Math.random() * 12}px`, height: `${16 + Math.random() * 12}px` }} />
          </div>
        ))}
      </div>

      {/* Glowing Orbs */}
      <div className="absolute top-1/4 left-10 w-40 h-40 bg-secondary/25 rounded-full blur-3xl animate-float" />
      <div className="absolute bottom-1/3 right-10 w-52 h-52 bg-primary/20 rounded-full blur-3xl animate-float-delayed" />
      <div className="absolute top-1/2 left-1/3 w-32 h-32 bg-accent-pink rounded-full blur-2xl animate-pulse-soft" />

      {/* Main Content */}
      <div className="container mx-auto px-4 pt-24 sm:pt-28 pb-12 sm:pb-20 relative z-10">
        <div className="grid lg:grid-cols-2 gap-8 items-center max-w-6xl mx-auto">
          {/* Left: Text Content */}
          <div className="text-center lg:text-left min-w-0">
            <div className="inline-flex items-center gap-2 px-5 py-2.5 rounded-full bg-white/70 backdrop-blur-sm border border-primary/20 shadow-soft mb-6 animate-fade-in-up hover-lift cursor-pointer group">
              <Sparkles className="w-4 h-4 text-secondary animate-sparkle" />
              <span className="text-sm font-medium text-primary">India's Most Trusted Matrimony</span>
              <Heart className="w-4 h-4 text-primary fill-primary group-hover:animate-heart-beat" />
            </div>

            <h1 className="font-serif text-4xl sm:text-5xl md:text-6xl font-bold text-foreground leading-tight mb-4 sm:mb-6 animate-fade-in-up" style={{ animationDelay: "0.1s" }}>
              Find Your{" "}
              <span className="relative inline-block">
                <span className="text-gradient-primary">Forever</span>
                <svg className="absolute -bottom-2 left-0 w-full" viewBox="0 0 200 12" fill="none">
                  <path d="M2 10C50 2 150 2 198 10" stroke="url(#gold-gradient)" strokeWidth="3" strokeLinecap="round" className="animate-pulse-soft" />
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

            <p className="text-base sm:text-lg text-muted-foreground max-w-xl mb-6 sm:mb-8 animate-fade-in-up leading-relaxed" style={{ animationDelay: "0.2s" }}>
              Begin your beautiful journey towards a lifetime of love, trust, and togetherness. 
              Join millions who found their soulmate with Aiswarya Matrimony.
            </p>

            <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-center lg:justify-start gap-3 sm:gap-4 animate-fade-in-up" style={{ animationDelay: "0.3s" }}>
              <Button variant="hero" size="xl" className="group w-full sm:w-auto" onClick={() => navigate("/auth")}>
                <Heart className="w-5 h-5 group-hover:animate-heart-beat" fill="currentColor" />
                Start Your Journey
                <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
              </Button>
              <Button variant="outline" size="xl" className="group w-full sm:w-auto" onClick={() => navigate("/success-stories")}>
                <Sparkles className="w-5 h-5 group-hover:animate-sparkle" />
                View Success Stories
              </Button>
            </div>
          </div>

          {/* Right: Wedding Image */}
          <div className="hidden lg:flex flex-col items-center justify-center animate-fade-in-up" style={{ animationDelay: "0.3s" }}>
            <div className="relative">
              <div className="absolute -inset-4 bg-gradient-to-br from-secondary/30 to-primary/20 rounded-[2rem] blur-xl" />
              <img
                src={weddingHero}
                alt="Beautiful wedding couple"
                className="relative rounded-[2rem] w-[420px] h-[520px] object-cover shadow-elevated border-4 border-white/50"
              />
              {/* Decorative elements */}
              <div className="absolute -top-4 -right-4 w-16 h-16 rounded-full bg-secondary/80 flex items-center justify-center shadow-gold animate-bounce-soft">
                <Heart className="w-8 h-8 text-white fill-white" />
              </div>
              <div className="absolute -bottom-3 -left-3 w-14 h-14 rounded-full bg-primary/80 flex items-center justify-center shadow-soft animate-float">
                <Star className="w-7 h-7 text-white fill-white" />
              </div>
            </div>
            <p className="mt-4 text-center font-serif text-lg font-semibold text-foreground">
              39 Years of Trust & Tradition
            </p>
          </div>
        </div>
      </div>

      {/* Bottom Wave */}
      <div className="absolute bottom-0 left-0 right-0">
        <svg viewBox="0 0 1440 120" fill="none" className="w-full">
          <path d="M0 120L60 110C120 100 240 80 360 70C480 60 600 60 720 65C840 70 960 80 1080 85C1200 90 1320 90 1380 90L1440 90V120H1380C1320 120 1200 120 1080 120C960 120 840 120 720 120C600 120 480 120 360 120C240 120 120 120 60 120H0V120Z" fill="white" />
        </svg>
      </div>
    </section>
  );
};

export default Hero;
