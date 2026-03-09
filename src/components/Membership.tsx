import { Check, Crown, Sparkles, Star, Zap, Heart, Shield, ArrowRight, Award } from "lucide-react";
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
  contactView?: string;
  badge?: string;
  badgeColor?: string;
  cardAccent?: string;
  iconBg?: string;
}

export const plansData: Plan[] = [
  {
    name: "Special Offer",
    price: "₹499",
    period: "/1 month",
    description: "Quick trial plan",
    highlightFeature: "6 Horoscope Matching",
    contactView: "6 Up to Contact View",
    features: [
      "Up to 6 horoscope matches",
      "Send interests to profiles",
      "Chat with matches",
      "Profile visibility",
    ],
    icon: Zap,
    isPopular: false,
    variant: "outline",
    badge: "SPECIAL OFFER",
    badgeColor: "bg-red-500 text-white",
    cardAccent: "border-red-400",
    iconBg: "bg-red-100",
  },
  {
    name: "Silver",
    price: "₹999",
    period: "/3 months",
    description: "Perfect to get started",
    highlightFeature: "15 Horoscope Matching",
    contactView: "15 Up to Contact View",
    features: [
      "Up to 15 horoscope matches",
      "Send interests to profiles",
      "Chat with matches",
      "Profile visibility",
    ],
    icon: Star,
    isPopular: false,
    variant: "outline",
    cardAccent: "border-blue-300",
    iconBg: "bg-blue-100",
  },
  {
    name: "Gold",
    price: "₹1,499",
    period: "/6 months",
    description: "Most popular choice",
    highlightFeature: "30 Horoscope Matching",
    contactView: "30 Up to Contact View",
    features: [
      "Up to 30 horoscope matches",
      "Send interests to profiles",
      "Chat with matches",
      "Profile visibility",
    ],
    icon: Crown,
    isPopular: true,
    variant: "hero",
    badge: "BEST VALUE",
    badgeColor: "bg-gradient-to-r from-secondary to-secondary-light text-secondary-foreground",
    cardAccent: "border-secondary",
    iconBg: "bg-gradient-to-br from-secondary to-secondary-light",
  },
  {
    name: "Premium",
    price: "₹1,999",
    period: "/1 Year",
    description: "Most popular choice",
    highlightFeature: "60 Horoscope Matching",
    contactView: "60 Up to Contact View",
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
    badge: "BEST VALUE",
    badgeColor: "bg-gradient-to-r from-secondary to-secondary-light text-secondary-foreground",
    cardAccent: "border-orange-400",
    iconBg: "bg-gradient-to-br from-orange-400 to-orange-300",
  },
  {
    name: "Ultimate",
    price: "₹2,999",
    period: "/1 Year",
    description: "Best value for serious seekers",
    highlightFeature: "70 Horoscope Matching",
    contactView: "70 Up to Contact View",
    features: [
      "Up to 70 horoscope matches",
      "Send interests to profiles",
      "Chat with matches",
      "Profile visibility",
      "Everything in Premium",
      "Dedicated support",
      "Customer care Assistance",
    ],
    icon: Award,
    isPopular: false,
    variant: "gold",
    badge: "TOP RECOMMENDED",
    badgeColor: "bg-purple-600 text-white",
    cardAccent: "border-purple-400",
    iconBg: "bg-gradient-to-br from-purple-500 to-purple-400",
  },
];

const Membership = () => {
  const navigate = useNavigate();

  return (
    <section id="membership" className="py-24 bg-gradient-romantic relative overflow-hidden">
      <div className="absolute top-0 left-0 w-full h-32 bg-white" style={{ clipPath: "ellipse(70% 100% at 50% 0%)" }} />
      <div className="absolute top-20 right-10 w-48 h-48 bg-secondary/25 rounded-full blur-3xl animate-float" />
      <div className="absolute bottom-20 left-10 w-72 h-72 bg-primary/15 rounded-full blur-3xl animate-float-delayed" />

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

        <div className="grid sm:grid-cols-2 lg:grid-cols-5 gap-5 max-w-7xl mx-auto">
          {plansData.map((plan, index) => (
            <div
              key={plan.name}
              className="relative animate-fade-in-up flex"
              style={{ animationDelay: `${0.1 * index}s` }}
            >
              {plan.badge && (
                <div className="absolute -top-4 left-1/2 -translate-x-1/2 z-10">
                  <div className={`px-3 py-1.5 ${plan.badgeColor} text-xs font-bold rounded-full shadow-md flex items-center gap-1 whitespace-nowrap`}>
                    <Star className="w-3 h-3 fill-current" />
                    {plan.badge}
                  </div>
                </div>
              )}

              <div
                className={`h-full w-full bg-white rounded-3xl p-5 transition-all duration-500 hover-lift group flex flex-col shadow-card border-2 ${plan.cardAccent || "border-primary/10"}`}
              >
                <div className={`w-12 h-12 rounded-2xl flex items-center justify-center mb-4 transition-transform group-hover:scale-110 ${plan.iconBg || "bg-accent-rose"}`}>
                  <plan.icon className={`w-6 h-6 ${plan.iconBg?.includes("gradient") ? "text-white" : "text-primary"}`} />
                </div>

                <h3 className="font-serif text-lg font-bold text-foreground mb-1">{plan.name}</h3>
                <p className="text-muted-foreground text-xs mb-3">{plan.description}</p>
                
                <div className="flex items-baseline gap-1 mb-2">
                  <span className="font-serif text-2xl font-bold text-gradient-primary">{plan.price}</span>
                  {plan.period && <span className="text-muted-foreground text-xs">{plan.period}</span>}
                </div>

                {plan.highlightFeature && (
                  <p className="text-xs font-medium text-foreground mb-1 underline decoration-primary/30 underline-offset-2">
                    {plan.highlightFeature}
                  </p>
                )}

                {plan.contactView && (
                  <p className="text-xs font-bold text-primary mb-3">
                    {plan.contactView}
                  </p>
                )}

                <ul className="space-y-2 mb-6 flex-1">
                  {plan.features.map((feature, i) => (
                    <li key={i} className="flex items-start gap-2">
                      <div className="w-4 h-4 rounded-full flex items-center justify-center flex-shrink-0 mt-0.5 bg-green-100">
                        <Check className="w-2.5 h-2.5 text-green-600" />
                      </div>
                      <span className="text-xs text-foreground">{feature}</span>
                    </li>
                  ))}
                </ul>

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
