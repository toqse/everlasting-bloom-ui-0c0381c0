import { Check, Crown, Sparkles, Star, Zap, Heart, Shield } from "lucide-react";
import { Button } from "./ui/button";

interface Plan {
  name: string;
  price: string;
  period: string;
  description: string;
  features: string[];
  icon: typeof Crown;
  isPopular: boolean;
  variant: "outline" | "hero" | "gold";
}

const plans: Plan[] = [
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
  return (
    <section id="membership" className="py-20 bg-gradient-romantic relative overflow-hidden">
      {/* Decorative Elements */}
      <div className="absolute top-0 left-0 w-full h-32 bg-white" style={{ clipPath: "ellipse(70% 100% at 50% 0%)" }} />
      <div className="absolute top-20 right-10 w-40 h-40 bg-secondary/20 rounded-full blur-3xl animate-float" />
      <div className="absolute bottom-20 left-10 w-60 h-60 bg-primary/10 rounded-full blur-3xl animate-float-delayed" />

      <div className="container mx-auto px-4 relative z-10 pt-16">
        {/* Section Header */}
        <div className="text-center mb-16">
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-white/80 border border-primary/10 mb-4 animate-fade-in-up">
            <Crown className="w-4 h-4 text-secondary" />
            <span className="text-sm font-medium text-primary">Membership Plans</span>
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
          {plans.map((plan, index) => (
            <div
              key={plan.name}
              className={`relative animate-fade-in-up ${plan.isPopular ? "md:-mt-4 md:mb-4" : ""}`}
              style={{ animationDelay: `${0.1 * index}s` }}
            >
              {/* Popular Badge */}
              {plan.isPopular && (
                <div className="absolute -top-4 left-1/2 -translate-x-1/2 z-10">
                  <div className="px-4 py-1.5 bg-secondary text-secondary-foreground text-sm font-bold rounded-full shadow-gold flex items-center gap-1">
                    <Star className="w-4 h-4 fill-current" />
                    Most Popular
                  </div>
                </div>
              )}

              <div
                className={`h-full bg-white rounded-3xl p-8 transition-all duration-500 hover-lift ${
                  plan.isPopular
                    ? "shadow-elevated border-2 border-secondary"
                    : "shadow-card border border-primary/10"
                }`}
              >
                {/* Plan Icon */}
                <div className={`w-16 h-16 rounded-2xl flex items-center justify-center mb-6 ${
                  plan.isPopular
                    ? "bg-gradient-to-br from-secondary to-secondary-light"
                    : "bg-accent-rose"
                }`}>
                  <plan.icon className={`w-8 h-8 ${plan.isPopular ? "text-secondary-foreground" : "text-primary"}`} />
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
                    <li key={i} className="flex items-start gap-3">
                      <div className={`w-5 h-5 rounded-full flex items-center justify-center flex-shrink-0 mt-0.5 ${
                        plan.isPopular ? "bg-secondary/20" : "bg-accent-rose"
                      }`}>
                        <Check className={`w-3 h-3 ${plan.isPopular ? "text-secondary" : "text-primary"}`} />
                      </div>
                      <span className="text-sm text-foreground">{feature}</span>
                    </li>
                  ))}
                </ul>

                {/* CTA Button */}
                <Button variant={plan.variant} size="lg" className="w-full">
                  {plan.price === "Free" ? "Get Started" : "Choose Plan"}
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
            <div key={index} className="flex items-center gap-2 text-muted-foreground">
              <badge.icon className="w-5 h-5 text-secondary" />
              <span className="text-sm font-medium">{badge.text}</span>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default Membership;
