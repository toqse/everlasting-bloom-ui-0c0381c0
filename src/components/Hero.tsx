import { Heart, Sparkles, ArrowRight, Star, Users, Shield, Crown } from "lucide-react";
import { Button } from "./ui/button";
import { useNavigate } from "react-router-dom";

const Hero = () => {
  const navigate = useNavigate();
  const petals = Array.from({ length: 20 }, (_, i) => i);
  const sparkles = Array.from({ length: 8 }, (_, i) => i);

  return (
    <section id="home" className="relative min-h-screen flex items-center justify-center overflow-hidden bg-gradient-romantic">
      {/* Animated Background Particles */}
      <div className="absolute inset-0 overflow-hidden">
        {/* Floating Petals */}
        {petals.map((_, i) => (
          <div
            key={`petal-${i}`}
            className="absolute animate-petal-fall"
            style={{
              left: `${Math.random() * 100}%`,
              animationDelay: `${Math.random() * 10}s`,
              animationDuration: `${10 + Math.random() * 8}s`,
            }}
          >
            <Heart
              className="text-primary/20"
              style={{
                width: `${14 + Math.random() * 20}px`,
                height: `${14 + Math.random() * 20}px`,
              }}
              fill="currentColor"
            />
          </div>
        ))}

        {/* Sparkle Effects */}
        {sparkles.map((_, i) => (
          <div
            key={`sparkle-${i}`}
            className="absolute animate-sparkle"
            style={{
              left: `${10 + Math.random() * 80}%`,
              top: `${10 + Math.random() * 80}%`,
              animationDelay: `${Math.random() * 3}s`,
            }}
          >
            <Sparkles
              className="text-secondary/40"
              style={{
                width: `${16 + Math.random() * 12}px`,
                height: `${16 + Math.random() * 12}px`,
              }}
            />
          </div>
        ))}
      </div>

      {/* Glowing Orbs */}
      <div className="absolute top-1/4 left-10 w-40 h-40 bg-secondary/25 rounded-full blur-3xl animate-float" />
      <div className="absolute bottom-1/3 right-10 w-52 h-52 bg-primary/20 rounded-full blur-3xl animate-float-delayed" />
      <div className="absolute top-1/2 left-1/3 w-32 h-32 bg-accent-pink rounded-full blur-2xl animate-pulse-soft" />
      <div className="absolute top-20 right-1/4 w-24 h-24 bg-secondary/30 rounded-full blur-2xl animate-bounce-soft" />

      {/* 3D Floating Elements */}
      <div className="absolute left-[8%] top-[25%] hidden lg:block animate-float">
        <div className="relative w-24 h-24 tilt-3d">
          <div className="absolute inset-0 border-4 border-secondary rounded-full transform rotate-45 shadow-gold animate-glow" />
          <div className="absolute inset-3 border-2 border-secondary/50 rounded-full transform -rotate-12" />
          <div className="absolute inset-6 bg-secondary/20 rounded-full animate-pulse-soft" />
          <Sparkles className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-8 h-8 text-secondary animate-sparkle" />
        </div>
      </div>

      <div className="absolute right-[10%] top-[30%] hidden lg:block animate-float-delayed">
        <div className="relative w-20 h-20 tilt-3d">
          <div className="absolute inset-0 border-4 border-primary rounded-full shadow-soft" />
          <Heart className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-8 h-8 text-primary fill-primary animate-heart-beat" />
        </div>
      </div>

      <div className="absolute left-[15%] bottom-[25%] hidden lg:block animate-bounce-soft">
        <div className="relative w-16 h-16">
          <Crown className="w-full h-full text-secondary/60 animate-pulse-soft" />
        </div>
      </div>

      <div className="absolute right-[15%] bottom-[30%] hidden lg:block animate-float">
        <div className="w-14 h-14 bg-gradient-to-br from-primary/20 to-secondary/20 rounded-2xl backdrop-blur-sm border border-white/20 flex items-center justify-center shadow-elevated">
          <Star className="w-8 h-8 text-secondary fill-secondary animate-sparkle" />
        </div>
      </div>

      {/* Main Content */}
      <div className="container mx-auto px-4 pt-24 sm:pt-28 pb-12 sm:pb-20 relative z-10">
        <div className="max-w-4xl mx-auto text-center min-w-0">
          {/* Badge */}
          <div className="inline-flex items-center gap-2 px-5 py-2.5 rounded-full bg-white/70 backdrop-blur-sm border border-primary/20 shadow-soft mb-8 animate-fade-in-up hover-lift cursor-pointer group">
            <Sparkles className="w-4 h-4 text-secondary animate-sparkle" />
            <span className="text-sm font-medium text-primary">India's Most Trusted Matrimony</span>
            <Heart className="w-4 h-4 text-primary fill-primary group-hover:animate-heart-beat" />
          </div>

          {/* Heading */}
          <h1 className="font-serif text-4xl sm:text-5xl md:text-6xl lg:text-7xl font-bold text-foreground leading-tight mb-4 sm:mb-6 animate-fade-in-up" style={{ animationDelay: "0.1s" }}>
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

          {/* Subtitle */}
          <p className="text-base sm:text-lg md:text-xl text-muted-foreground max-w-2xl mx-auto mb-6 sm:mb-10 animate-fade-in-up leading-relaxed px-0" style={{ animationDelay: "0.2s" }}>
            Begin your beautiful journey towards a lifetime of love, trust, and togetherness. 
            Join millions who found their soulmate with Aiswarya Matrimony.
          </p>

          {/* Bride & Groom Animation */}
          <div className="flex items-center justify-center gap-2 mb-6 animate-fade-in-up" style={{ animationDelay: "0.25s" }}>
            <span className="text-5xl animate-float" style={{ animationDuration: "3s" }}>🤵</span>
            <Heart className="w-8 h-8 text-primary fill-primary animate-heart-beat" />
            <span className="text-5xl animate-float-delayed" style={{ animationDuration: "3.5s" }}>👰</span>
          </div>

          {/* CTA Buttons */}
          <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-center gap-3 sm:gap-4 animate-fade-in-up" style={{ animationDelay: "0.3s" }}>
            <Button 
              variant="hero" 
              size="xl" 
              className="group w-full sm:min-w-[220px]"
              onClick={() => navigate("/auth")}
            >
              <Heart className="w-5 h-5 group-hover:animate-heart-beat" fill="currentColor" />
              Start Your Journey
              <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
            </Button>
            <Button 
              variant="outline" 
              size="xl" 
              className="group w-full sm:min-w-[220px]"
              onClick={() => navigate("/success-stories")}
            >
              <Sparkles className="w-5 h-5 group-hover:animate-sparkle" />
              View Success Stories
            </Button>
          </div>

          {/* Stats */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-3 sm:gap-4 md:gap-6 mt-10 sm:mt-16 animate-fade-in-up" style={{ animationDelay: "0.4s" }}>
            {[
              { value: "2M+", label: "Happy Members", icon: Users },
              { value: "1M+", label: "Successful Matches", icon: Heart },
              { value: "38+", label: "Years of Trust", icon: Shield },
              { value: "100%", label: "Privacy Secured", icon: Crown },
            ].map((stat, index) => (
              <div
                key={index}
                className="bg-white/70 backdrop-blur-sm rounded-2xl p-5 md:p-6 border border-primary/10 shadow-card hover-lift group cursor-pointer"
                style={{ animationDelay: `${0.5 + index * 0.1}s` }}
              >
                <stat.icon className="w-6 h-6 text-secondary mx-auto mb-2 group-hover:animate-bounce-soft" />
                <div className="font-serif text-2xl md:text-3xl font-bold text-gradient-primary mb-1">
                  {stat.value}
                </div>
                <div className="text-xs md:text-sm text-muted-foreground">{stat.label}</div>
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
