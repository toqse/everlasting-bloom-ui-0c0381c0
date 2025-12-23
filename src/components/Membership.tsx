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
}

export const plansData: Plan[] = [
  {
    name: "Basic",
    price: "Free",
    period: "",
    description: "Start your journey",
    features: [
      "Create detailed profile",
      "Browse profiles",
      "Basic search filters",
      "5 interests per day",
      "Email support",
    ],
    icon: Heart,
    isPopular: false,
    variant: "outline",
  },
  {
    name: "Premium",
    price: "₹2,499",
    period: "/3 months",
    description: "Most popular choice",
    features: [
      "Everything in Basic",
      "Unlimited messages",
      "View contact details",
      "Advanced filters",
      "Profile boost monthly",
      "Priority support",
      "See who viewed you",
    ],
    icon: Crown,
    isPopular: true,
    variant: "hero",
  },
  {
    name: "Platinum",
    price: "₹4,999",
    period: "/6 months",
    description: "Ultimate experience",
    features: [
      "Everything in Premium",
      "Personal matchmaker",
      "Relationship counseling",
      "Profile highlighting",
      "VIP badge",
      "Dedicated support",
      "Background verification",
      "Premium analytics",
    ],
    icon: Sparkles,
    isPopular: false,
    variant: "gold",
  },
];

const Membership = () => {
  const navigate = useNavigate();

  return (
    <section id="membership" className="py-24 bg-gradient-romantic relative overflow-hidden">
      {/* Decorative Elements */}
      <div className="absolute top-0 left-0 w-full h-32 bg-white" style={{ clipPath: "ellipse(70% 100% at 50% 0%)" }} />
      <div className="absolute top-20 right-10 w-48 h-48 bg-secondary/25 rounded-full blur-3xl animate-float" />
      <div className="absolute bottom-20 left-10 w-72 h-72 bg-primary/15 rounded-full blur-3xl animate-float-delayed" />
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[500px] h-[500px] bg-accent-gold/20 rounded-full blur-3xl animate-pulse-soft" />

      {/* Floating Sparkles */}
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
        {/* Section Header */}
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

        {/* Pricing Cards */}
        <div className="grid md:grid-cols-3 gap-6 lg:gap-8 max-w-6xl mx-auto">
          {plansData.map((plan, index) => (
            <div
              key={plan.name}
              className={`relative animate-fade-in-up ${plan.isPopular ? "md:-mt-6 md:mb-6" : ""}`}
              style={{ animationDelay: `${0.1 * index}s` }}
            >
              {/* Popular Badge */}
              {plan.isPopular && (
                <div className="absolute -top-5 left-1/2 -translate-x-1/2 z-10">
                  <div className="px-5 py-2 bg-gradient-to-r from-secondary to-secondary-light text-secondary-foreground text-sm font-bold rounded-full shadow-gold flex items-center gap-1.5 animate-glow">
                    <Star className="w-4 h-4 fill-current animate-sparkle" />
                    Most Popular
                  </div>
                </div>
              )}

              <div
                className={`h-full bg-white rounded-3xl p-8 transition-all duration-500 hover-lift group ${
                  plan.isPopular
                    ? "shadow-elevated border-2 border-secondary"
                    : "shadow-card border border-primary/10 hover:border-primary/20"
                }`}
              >
                {/* Plan Icon */}
                <div className={`w-16 h-16 rounded-2xl flex items-center justify-center mb-6 transition-transform group-hover:scale-110 ${
                  plan.isPopular
                    ? "bg-gradient-to-br from-secondary to-secondary-light shadow-gold"
                    : "bg-accent-rose group-hover:bg-primary/10"
                }`}>
                  <plan.icon className={`w-8 h-8 ${plan.isPopular ? "text-white" : "text-primary"} ${plan.isPopular ? "animate-bounce-soft" : ""}`} />
                </div>

                {/* Plan Name & Price */}
                <h3 className="font-serif text-2xl font-bold text-foreground mb-2">{plan.name}</h3>
                <p className="text-muted-foreground text-sm mb-4">{plan.description}</p>
                
                <div className="flex items-baseline gap-1 mb-6">
                  <span className="font-serif text-4xl font-bold text-gradient-primary">{plan.price}</span>
                  {plan.period && <span className="text-muted-foreground">{plan.period}</span>}
                </div>

                {/* Features */}
                <ul className="space-y-3 mb-8">
                  {plan.features.map((feature, i) => (
                    <li key={i} className="flex items-start gap-3 group/item">
                      <div className={`w-5 h-5 rounded-full flex items-center justify-center flex-shrink-0 mt-0.5 transition-colors ${
                        plan.isPopular ? "bg-secondary/20 group-hover/item:bg-secondary/30" : "bg-accent-rose group-hover/item:bg-primary/10"
                      }`}>
                        <Check className={`w-3 h-3 ${plan.isPopular ? "text-secondary" : "text-primary"}`} />
                      </div>
                      <span className="text-sm text-foreground">{feature}</span>
                    </li>
                  ))}
                </ul>

                {/* CTA Button */}
                <Button 
                  variant={plan.variant} 
                  size="lg" 
                  className="w-full group/btn"
                  onClick={() => navigate("/auth")}
                >
                  {plan.price === "Free" ? "Get Started" : "Choose Plan"}
                  <ArrowRight className="w-4 h-4 group-hover/btn:translate-x-1 transition-transform" />
                </Button>
              </div>
            </div>
          ))}
        </div>

        {/* Trust Badges */}
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

        {/* View All Plans Link */}
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
