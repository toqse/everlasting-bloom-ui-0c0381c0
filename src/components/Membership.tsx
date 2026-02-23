import { Check, Crown, Sparkles, Star, Zap, Heart, Shield, ArrowRight } from "lucide-react";
import { Button } from "./ui/button";
import { useNavigate } from "react-router-dom";

export interface Plan {
  name: string;
  price: string;
  period: string;
  description: string;
  features: string[];
  icon: typeof Crown;
  isPopular: boolean;
  variant: "outline" | "hero" | "gold";
  highlightFeature?: string;
  commission?: string;
}

export const plansData: Plan[] = [
  {
    name: "Silver",
    price: "₹999",
    period: "/3 months",
    description: "Perfect to get started",
    highlightFeature: "15 Horoscope Matching",
    features: [
      "Up to 15 horoscope matches",
      "Send interests to profiles",
      "Chat with matches",
      "Profile visibility",
    ],
    icon: Star,
    isPopular: false,
    variant: "outline",
  },
  {
    name: "Gold",
    price: "₹1,499",
    period: "/6 months",
    description: "Most popular choice",
    highlightFeature: "30 Horoscope Matching",
    features: [
      "Up to 30 horoscope matches",
      "Send interests to profiles",
      "Chat with matches",
      "Profile visibility",
    ],
    icon: Crown,
    isPopular: true,
    variant: "hero",
  },
  {
    name: "Premium",
    price: "₹1,999",
    period: "/1 Year",
    description: "Most popular choice",
    highlightFeature: "60 Horoscope Matching",
    features: [
      "Up to 60 horoscope matches",
      "Send interests to profiles",
      "Chat with matches",
      "Profile visibility",
      "Everything in Gold",
      "Dedicated support",
      "Best value for 1 year",
    ],
    icon: Sparkles,
    isPopular: true,
    variant: "hero",
  },
  {
    name: "Ultimate",
    price: "₹2,999",
    period: "/1 Year",
    description: "Best value for serious seekers",
    highlightFeature: "70 Horoscope Matching",
    features: [
      "Up to 70 horoscope matches",
      "Send interests to profiles",
      "Chat with matches",
      "Profile visibility",
      "Everything in Premium",
      "Dedicated support",
      "Customer care Assistance",
    ],
    commission: "Commission includes Male Rs. 15,000 / Female Rs. 10,000",
    icon: Sparkles,
    isPopular: false,
    variant: "gold",
  },
];

const Membership = () => {
  const navigate = useNavigate();

  return (
    <section id="membership" className="py-24 bg-gradient-romantic relative overflow-hidden">
      <div className="absolute top-0 left-0 w-full h-32 bg-white" style={{ clipPath: "ellipse(70% 100% at 50% 0%)" }} />
      <div className="absolute top-20 right-10 w-48 h-48 bg-secondary/25 rounded-full blur-3xl animate-float" />
      <div className="absolute bottom-20 left-10 w-72 h-72 bg-primary/15 rounded-full blur-3xl animate-float-delayed" />

      {[...Array(8)].map((_, i) => (
        <Sparkles
          key={i}
          className="absolute text-secondary/30 animate-sparkle"
          style={{
            left: `${5 + i * 12}%`,
            top: `${10 + (i % 4) * 20}%`,
            width: `${18 + i * 3}px`,
            height: `${18 + i * 3}px`,
            animationDelay: `${i * 0.3}s`,
          }}
        />
      ))}

      <div className="container mx-auto px-4 relative z-10 pt-16">
        <div className="text-center mb-16">
          <div className="inline-flex items-center gap-2 px-5 py-2.5 rounded-full bg-white/80 backdrop-blur-sm border border-primary/10 mb-4 animate-fade-in-up shadow-soft">
            <Crown className="w-4 h-4 text-secondary animate-bounce-soft" />
            <span className="text-sm font-medium text-primary">Membership Plans</span>
            <Star className="w-4 h-4 text-secondary fill-secondary animate-sparkle" />
          </div>
          <h2 className="font-serif text-4xl md:text-5xl font-bold text-foreground mb-4 animate-fade-in-up" style={{ animationDelay: "0.1s" }}>
            Choose Your <span className="text-gradient-gold">Perfect Plan</span>
          </h2>
          <p className="text-muted-foreground max-w-2xl mx-auto animate-fade-in-up" style={{ animationDelay: "0.2s" }}>
            Invest in your love story with our premium features designed to help you find your soulmate faster
          </p>
        </div>

        <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6 max-w-6xl mx-auto">
          {plansData.map((plan, index) => (
            <div
              key={plan.name}
              className={`relative animate-fade-in-up ${plan.isPopular ? "md:-mt-4 md:mb-4" : ""}`}
              style={{ animationDelay: `${0.1 * index}s` }}
            >
              {plan.isPopular && (
                <div className="absolute -top-4 left-1/2 -translate-x-1/2 z-10">
                  <div className="px-4 py-1.5 bg-gradient-to-r from-secondary to-secondary-light text-secondary-foreground text-xs font-bold rounded-full shadow-gold flex items-center gap-1 animate-glow">
                    <Star className="w-3 h-3 fill-current animate-sparkle" />
                    MOST POPULAR
                  </div>
                </div>
              )}

              <div
                className={`h-full bg-white rounded-3xl p-6 transition-all duration-500 hover-lift group ${
                  plan.isPopular
                    ? "shadow-elevated border-2 border-secondary"
                    : plan.variant === "gold"
                    ? "shadow-elevated border-2 border-secondary/60"
                    : "shadow-card border border-primary/10 hover:border-primary/20"
                }`}
              >
                <div className={`w-12 h-12 rounded-2xl flex items-center justify-center mb-4 transition-transform group-hover:scale-110 ${
                  plan.isPopular
                    ? "bg-gradient-to-br from-secondary to-secondary-light shadow-gold"
                    : plan.variant === "gold"
                    ? "bg-gradient-to-br from-secondary to-secondary-light shadow-gold"
                    : "bg-accent-rose group-hover:bg-primary/10"
                }`}>
                  <plan.icon className={`w-6 h-6 ${plan.isPopular || plan.variant === "gold" ? "text-white" : "text-primary"}`} />
                </div>

                <h3 className={`font-serif text-xl font-bold mb-1 ${plan.isPopular || plan.variant === "gold" ? "text-secondary" : "text-foreground"}`}>{plan.name}</h3>
                <p className="text-muted-foreground text-xs mb-3">{plan.description}</p>
                
                <div className="flex items-baseline gap-1 mb-2">
                  <span className="font-serif text-3xl font-bold text-gradient-primary">{plan.price}</span>
                  {plan.period && <span className="text-muted-foreground text-sm">{plan.period}</span>}
                </div>

                {plan.highlightFeature && (
                  <p className="text-sm font-medium text-foreground mb-4 underline decoration-primary/30 underline-offset-2">
                    {plan.highlightFeature}
                  </p>
                )}

                {plan.commission && (
                  <p className="text-xs text-primary font-medium mb-4 leading-relaxed">
                    {plan.commission}
                  </p>
                )}

                <Button 
                  variant={plan.variant} 
                  size="default" 
                  className="w-full group/btn mt-auto"
                  onClick={() => navigate("/auth")}
                >
                  Get Started
                  <ArrowRight className="w-4 h-4 group-hover/btn:translate-x-1 transition-transform" />
                </Button>
              </div>
            </div>
          ))}
        </div>

        <div className="flex flex-wrap justify-center gap-6 mt-16">
          {[
            { icon: Shield, text: "Secure Payments" },
            { icon: Zap, text: "Instant Activation" },
            { icon: Heart, text: "Money-back Guarantee" },
          ].map((badge, index) => (
            <div key={index} className="flex items-center gap-2 text-muted-foreground bg-white/60 backdrop-blur-sm px-4 py-2 rounded-full shadow-soft hover-lift cursor-pointer">
              <badge.icon className="w-5 h-5 text-secondary animate-pulse-soft" />
              <span className="text-sm font-medium">{badge.text}</span>
            </div>
          ))}
        </div>

        <div className="text-center mt-10">
          <Button 
            variant="outline" 
            size="lg" 
            className="group"
            onClick={() => navigate("/membership")}
          >
            Compare All Plans
            <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
          </Button>
        </div>
      </div>
    </section>
  );
};

export default Membership;
