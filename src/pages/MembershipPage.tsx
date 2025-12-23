import { useState } from "react";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { Button } from "@/components/ui/button";
import { Check, Crown, Sparkles, Star, Zap, Heart, Shield, ArrowRight, HelpCircle, ChevronDown } from "lucide-react";
import { plansData } from "@/components/Membership";
import { useNavigate } from "react-router-dom";

const faqs = [
  {
    question: "How does the matching algorithm work?",
    answer: "Our advanced matching algorithm considers multiple factors including interests, values, lifestyle preferences, and location to suggest compatible matches. The more detailed your profile, the better your matches will be.",
  },
  {
    question: "Is my privacy protected?",
    answer: "Absolutely! We take privacy very seriously. Your contact details are only visible to members you choose to connect with. All profiles go through verification before being approved.",
  },
  {
    question: "Can I upgrade or downgrade my plan?",
    answer: "Yes, you can upgrade your plan anytime. When you upgrade, you'll immediately get access to premium features. Downgrades take effect at the end of your current billing cycle.",
  },
  {
    question: "What's included in the verification process?",
    answer: "Our verification process includes ID verification, phone number verification, and optional photo verification. Premium members also get access to background verification services.",
  },
  {
    question: "How do I cancel my subscription?",
    answer: "You can cancel your subscription anytime from your account settings. Your premium features will remain active until the end of your current billing period.",
  },
];

const MembershipPage = () => {
  const navigate = useNavigate();
  const [billingCycle, setBillingCycle] = useState<"monthly" | "yearly">("yearly");
  const [openFaq, setOpenFaq] = useState<number | null>(null);

  const getPrice = (basePrice: string, isYearly: boolean) => {
    if (basePrice === "Free") return "Free";
    const price = parseInt(basePrice.replace(/[^\d]/g, ""));
    const yearlyPrice = Math.round(price * 0.8); // 20% discount for yearly
    return isYearly ? `₹${yearlyPrice.toLocaleString()}` : basePrice;
  };

  return (
    <div className="min-h-screen bg-background">
      <Navbar />

      {/* Hero Section */}
      <section className="pt-28 pb-16 bg-gradient-romantic relative overflow-hidden">
        {/* Decorative Elements */}
        <div className="absolute inset-0">
          <div className="absolute top-10 left-10 w-48 h-48 bg-secondary/25 rounded-full blur-3xl animate-float" />
          <div className="absolute bottom-10 right-10 w-64 h-64 bg-primary/15 rounded-full blur-3xl animate-float-delayed" />
          <div className="absolute top-1/2 right-1/4 w-40 h-40 bg-accent-gold/30 rounded-full blur-3xl animate-pulse-soft" />
        </div>

        {/* Floating Elements */}
        {[...Array(8)].map((_, i) => (
          <Sparkles
            key={i}
            className="absolute text-secondary/30 animate-sparkle"
            style={{
              left: `${5 + i * 12}%`,
              top: `${15 + (i % 4) * 20}%`,
              width: `${16 + i * 3}px`,
              animationDelay: `${i * 0.4}s`,
            }}
          />
        ))}

        <div className="container mx-auto px-4 relative z-10">
          <div className="text-center mb-12">
            <div className="inline-flex items-center gap-2 px-5 py-2.5 rounded-full bg-white/80 backdrop-blur-sm border border-primary/10 mb-4 shadow-soft animate-fade-in-up">
              <Crown className="w-4 h-4 text-secondary animate-bounce-soft" />
              <span className="text-sm font-medium text-primary">Premium Memberships</span>
              <Star className="w-4 h-4 text-secondary fill-secondary animate-sparkle" />
            </div>
            <h1 className="font-serif text-4xl md:text-6xl font-bold text-foreground mb-4 animate-fade-in-up" style={{ animationDelay: "0.1s" }}>
              Invest in Your <span className="text-gradient-gold">Love Story</span>
            </h1>
            <p className="text-muted-foreground max-w-2xl mx-auto text-lg animate-fade-in-up" style={{ animationDelay: "0.2s" }}>
              Choose the perfect plan to accelerate your journey towards finding your soulmate
            </p>
          </div>

          {/* Billing Toggle */}
          <div className="flex justify-center mb-12 animate-scale-in">
            <div className="bg-white/80 backdrop-blur-sm rounded-2xl p-1.5 shadow-soft border border-primary/10">
              <div className="flex gap-1">
                <button
                  onClick={() => setBillingCycle("monthly")}
                  className={`px-6 py-2.5 rounded-xl font-medium transition-all ${
                    billingCycle === "monthly"
                      ? "bg-primary text-primary-foreground shadow-soft"
                      : "text-foreground hover:bg-accent-rose"
                  }`}
                >
                  Monthly
                </button>
                <button
                  onClick={() => setBillingCycle("yearly")}
                  className={`px-6 py-2.5 rounded-xl font-medium transition-all flex items-center gap-2 ${
                    billingCycle === "yearly"
                      ? "bg-primary text-primary-foreground shadow-soft"
                      : "text-foreground hover:bg-accent-rose"
                  }`}
                >
                  Yearly
                  <span className="text-xs bg-secondary text-secondary-foreground px-2 py-0.5 rounded-full">
                    Save 20%
                  </span>
                </button>
              </div>
            </div>
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
                      Best Value
                    </div>
                  </div>
                )}

                <div
                  className={`h-full bg-white rounded-3xl p-8 transition-all duration-500 hover-lift group ${
                    plan.isPopular
                      ? "shadow-elevated border-2 border-secondary"
                      : "shadow-card border border-primary/10"
                  }`}
                >
                  {/* Plan Icon */}
                  <div className={`w-16 h-16 rounded-2xl flex items-center justify-center mb-6 group-hover:scale-110 transition-transform ${
                    plan.isPopular
                      ? "bg-gradient-to-br from-secondary to-secondary-light shadow-gold"
                      : "bg-accent-rose"
                  }`}>
                    <plan.icon className={`w-8 h-8 ${plan.isPopular ? "text-white animate-bounce-soft" : "text-primary"}`} />
                  </div>

                  {/* Plan Name & Price */}
                  <h3 className="font-serif text-2xl font-bold text-foreground mb-2">{plan.name}</h3>
                  <p className="text-muted-foreground text-sm mb-4">{plan.description}</p>
                  
                  <div className="flex items-baseline gap-1 mb-6">
                    <span className="font-serif text-4xl font-bold text-gradient-primary">
                      {getPrice(plan.price, billingCycle === "yearly")}
                    </span>
                    {plan.period && (
                      <span className="text-muted-foreground">
                        /{billingCycle === "yearly" ? "year" : plan.period.replace("/", "")}
                      </span>
                    )}
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
                  <Button 
                    variant={plan.variant} 
                    size="lg" 
                    className="w-full group/btn"
                    onClick={() => navigate("/auth")}
                  >
                    {plan.price === "Free" ? "Get Started Free" : "Choose Plan"}
                    <ArrowRight className="w-4 h-4 group-hover/btn:translate-x-1 transition-transform" />
                  </Button>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Features Comparison */}
      <section className="py-16 bg-white">
        <div className="container mx-auto px-4">
          <h2 className="font-serif text-3xl font-bold text-foreground text-center mb-12">
            Compare <span className="text-gradient-primary">Plan Features</span>
          </h2>

          <div className="max-w-4xl mx-auto overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b-2 border-primary/10">
                  <th className="py-4 px-4 text-left font-serif text-lg">Feature</th>
                  <th className="py-4 px-4 text-center font-serif text-lg">Basic</th>
                  <th className="py-4 px-4 text-center font-serif text-lg text-secondary">Premium</th>
                  <th className="py-4 px-4 text-center font-serif text-lg">Platinum</th>
                </tr>
              </thead>
              <tbody>
                {[
                  { feature: "View Profiles", basic: "✓", premium: "✓", platinum: "✓" },
                  { feature: "Send Interests", basic: "5/day", premium: "Unlimited", platinum: "Unlimited" },
                  { feature: "View Contact Details", basic: "✗", premium: "✓", platinum: "✓" },
                  { feature: "Send Messages", basic: "✗", premium: "Unlimited", platinum: "Unlimited" },
                  { feature: "Profile Boost", basic: "✗", premium: "1/month", platinum: "3/month" },
                  { feature: "See Profile Views", basic: "✗", premium: "✓", platinum: "✓" },
                  { feature: "Personal Matchmaker", basic: "✗", premium: "✗", platinum: "✓" },
                  { feature: "Background Verification", basic: "✗", premium: "✗", platinum: "✓" },
                  { feature: "Priority Support", basic: "✗", premium: "✓", platinum: "Dedicated" },
                ].map((row, i) => (
                  <tr key={i} className="border-b border-primary/5 hover:bg-accent-rose/30 transition-colors">
                    <td className="py-4 px-4 font-medium">{row.feature}</td>
                    <td className="py-4 px-4 text-center">{row.basic}</td>
                    <td className="py-4 px-4 text-center bg-secondary/5 font-medium text-secondary">{row.premium}</td>
                    <td className="py-4 px-4 text-center">{row.platinum}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </section>

      {/* Trust Badges */}
      <section className="py-12 bg-gradient-romantic">
        <div className="container mx-auto px-4">
          <div className="flex flex-wrap justify-center gap-8">
            {[
              { icon: Shield, label: "Secure Payments", desc: "256-bit SSL encryption" },
              { icon: Zap, label: "Instant Activation", desc: "Start immediately" },
              { icon: Heart, label: "Money-back Guarantee", desc: "30-day refund policy" },
            ].map((item, index) => (
              <div key={index} className="flex items-center gap-4 bg-white/80 backdrop-blur-sm px-6 py-4 rounded-2xl shadow-soft hover-lift">
                <div className="w-12 h-12 rounded-xl bg-accent-gold flex items-center justify-center">
                  <item.icon className="w-6 h-6 text-secondary" />
                </div>
                <div>
                  <p className="font-bold text-foreground">{item.label}</p>
                  <p className="text-sm text-muted-foreground">{item.desc}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* FAQs */}
      <section className="py-16 bg-white">
        <div className="container mx-auto px-4">
          <div className="text-center mb-12">
            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-accent-rose border border-primary/10 mb-4">
              <HelpCircle className="w-4 h-4 text-primary" />
              <span className="text-sm font-medium text-primary">Got Questions?</span>
            </div>
            <h2 className="font-serif text-3xl font-bold text-foreground">
              Frequently Asked <span className="text-gradient-primary">Questions</span>
            </h2>
          </div>

          <div className="max-w-3xl mx-auto space-y-4">
            {faqs.map((faq, index) => (
              <div
                key={index}
                className="bg-gradient-card rounded-2xl border border-primary/5 overflow-hidden shadow-card hover-lift"
              >
                <button
                  onClick={() => setOpenFaq(openFaq === index ? null : index)}
                  className="w-full flex items-center justify-between p-6 text-left"
                >
                  <span className="font-medium text-foreground pr-4">{faq.question}</span>
                  <ChevronDown className={`w-5 h-5 text-primary transition-transform flex-shrink-0 ${
                    openFaq === index ? "rotate-180" : ""
                  }`} />
                </button>
                {openFaq === index && (
                  <div className="px-6 pb-6 pt-0 animate-fade-in-up">
                    <p className="text-muted-foreground">{faq.answer}</p>
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>
      </section>

      <Footer />
    </div>
  );
};

export default MembershipPage;
