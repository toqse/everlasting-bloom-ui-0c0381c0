import { useState } from "react";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { Button } from "@/components/ui/button";
import { Check, Crown, Sparkles, Star, Zap, Heart, Shield, ArrowRight, HelpCircle, ChevronDown, Award } from "lucide-react";
import { plansData } from "@/components/Membership";
import { useNavigate } from "react-router-dom";

const faqs = [
  {
    question: "How does the matching algorithm work?",
    answer: "Our advanced matching algorithm considers multiple factors including interests, values, lifestyle preferences, and location to suggest compatible matches.",
  },
  {
    question: "Is my privacy protected?",
    answer: "Absolutely! We take privacy very seriously. Your contact details are only visible to members you choose to connect with.",
  },
  {
    question: "Can I upgrade or downgrade my plan?",
    answer: "Yes, you can upgrade your plan anytime. When you upgrade, you'll immediately get access to premium features.",
  },
  {
    question: "What's included in the verification process?",
    answer: "Our verification process includes ID verification, phone number verification, and optional photo verification.",
  },
  {
    question: "How do I cancel my subscription?",
    answer: "You can cancel your subscription anytime from your account settings. Your premium features will remain active until the end of your current billing period.",
  },
];

const MembershipPage = () => {
  const navigate = useNavigate();
  const [openFaq, setOpenFaq] = useState<number | null>(null);

  return (
    <div className="min-h-screen bg-background">
      <Navbar />

      {/* Hero Section */}
      <section className="pt-28 pb-16 bg-gradient-romantic relative overflow-hidden">
        {/* Wedding background */}
        <div className="absolute inset-0 opacity-[0.06]">
          <img src="https://images.unsplash.com/photo-1519741497674-611481863552?w=1920&h=800&fit=crop" alt="" className="w-full h-full object-cover" />
        </div>
        <div className="absolute inset-0">
          <div className="absolute top-10 left-10 w-48 h-48 bg-secondary/25 rounded-full blur-3xl animate-float" />
          <div className="absolute bottom-10 right-10 w-64 h-64 bg-primary/15 rounded-full blur-3xl animate-float-delayed" />
        </div>

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

          {/* Pricing Cards - 5 columns */}
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
                  className={`h-full w-full bg-white rounded-3xl p-6 transition-all duration-500 hover-lift group flex flex-col shadow-card border-2 ${plan.cardAccent || "border-primary/10"}`}
                >
                  <div className={`w-14 h-14 rounded-2xl flex items-center justify-center mb-4 group-hover:scale-110 transition-transform ${plan.iconBg || "bg-accent-rose"}`}>
                    <plan.icon className={`w-7 h-7 ${plan.iconBg?.includes("gradient") ? "text-white" : "text-primary"}`} />
                  </div>

                  <h3 className="font-serif text-xl font-bold text-foreground mb-1">{plan.name}</h3>
                  <p className="text-muted-foreground text-xs mb-3">{plan.description}</p>
                  
                  <div className="flex items-baseline gap-1 mb-3">
                    <span className="font-serif text-3xl font-bold text-gradient-primary">{plan.price}</span>
                    {plan.period && <span className="text-muted-foreground text-sm">{plan.period}</span>}
                  </div>

                  {plan.highlightFeature && (
                    <p className="text-sm font-medium text-foreground mb-1 underline decoration-primary/30 underline-offset-2">
                      {plan.highlightFeature}
                    </p>
                  )}

                  {plan.contactView && (
                    <p className="text-sm font-bold text-primary mb-4">
                      {plan.contactView}
                    </p>
                  )}

                  <ul className="space-y-2.5 mb-6 flex-1">
                    {plan.features.map((feature, i) => (
                      <li key={i} className="flex items-start gap-2.5">
                        <div className="w-5 h-5 rounded-full flex items-center justify-center flex-shrink-0 mt-0.5 bg-green-100">
                          <Check className="w-3 h-3 text-green-600" />
                        </div>
                        <span className="text-sm text-foreground">{feature}</span>
                      </li>
                    ))}
                  </ul>

                  <Button 
                    variant={plan.variant} 
                    size="lg" 
                    className="w-full group/btn"
                    onClick={() => navigate("/auth")}
                  >
                    Get Started
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

          <div className="max-w-5xl mx-auto overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b-2 border-primary/10">
                  <th className="py-4 px-2 text-left font-serif text-sm">Feature</th>
                  <th className="py-4 px-2 text-center font-serif text-sm text-red-500">Special</th>
                  <th className="py-4 px-2 text-center font-serif text-sm text-blue-500">Silver</th>
                  <th className="py-4 px-2 text-center font-serif text-sm text-secondary">Gold</th>
                  <th className="py-4 px-2 text-center font-serif text-sm text-orange-500">Premium</th>
                  <th className="py-4 px-2 text-center font-serif text-sm text-purple-600">Ultimate</th>
                </tr>
              </thead>
              <tbody>
                {[
                  { feature: "Horoscope Matches", special: "6", silver: "15", gold: "30", premium: "60", ultimate: "70" },
                  { feature: "Contact Views", special: "6", silver: "15", gold: "30", premium: "60", ultimate: "70" },
                  { feature: "Send Interests", special: "✓", silver: "✓", gold: "✓", premium: "✓", ultimate: "✓" },
                  { feature: "Chat with Matches", special: "✓", silver: "✓", gold: "✓", premium: "✓", ultimate: "✓" },
                  { feature: "Profile Visibility", special: "✓", silver: "✓", gold: "✓", premium: "✓", ultimate: "✓" },
                  { feature: "Dedicated Support", special: "✗", silver: "✗", gold: "✗", premium: "✓", ultimate: "✓" },
                  { feature: "Customer Care", special: "✗", silver: "✗", gold: "✗", premium: "✗", ultimate: "✓" },
                  { feature: "Duration", special: "1 month", silver: "3 months", gold: "6 months", premium: "1 Year", ultimate: "1 Year" },
                ].map((row, i) => (
                  <tr key={i} className="border-b border-primary/5 hover:bg-accent-rose/30 transition-colors">
                    <td className="py-3 px-2 font-medium text-sm">{row.feature}</td>
                    <td className="py-3 px-2 text-center text-sm">{row.special}</td>
                    <td className="py-3 px-2 text-center text-sm">{row.silver}</td>
                    <td className="py-3 px-2 text-center bg-secondary/5 font-medium text-secondary text-sm">{row.gold}</td>
                    <td className="py-3 px-2 text-center bg-orange-50 font-medium text-orange-600 text-sm">{row.premium}</td>
                    <td className="py-3 px-2 text-center text-sm">{row.ultimate}</td>
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
              <div key={index} className="bg-gradient-card rounded-2xl border border-primary/5 overflow-hidden shadow-card hover-lift">
                <button
                  onClick={() => setOpenFaq(openFaq === index ? null : index)}
                  className="w-full flex items-center justify-between p-6 text-left"
                >
                  <span className="font-medium text-foreground pr-4">{faq.question}</span>
                  <ChevronDown className={`w-5 h-5 text-primary transition-transform flex-shrink-0 ${openFaq === index ? "rotate-180" : ""}`} />
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
