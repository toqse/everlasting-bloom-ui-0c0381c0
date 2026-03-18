"use client";

import { useState } from "react";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import PageHeroBanner from "@/components/PageHeroBanner";
import { Button } from "@/components/ui/button";
import { Check, Crown, Sparkles, Star, Zap, Heart, Shield, ArrowRight, HelpCircle, ChevronDown, Award } from "lucide-react";
import { plansData } from "@/components/Membership";
import { useRouter } from "next/navigation";

const faqs: { question: string; answer: string | string[] }[] = [
  {
    question: "Why is Aiswarya Matrimonial better compared to other matrimonial websites?",
    answer:
      "M/s Aiswarya Vivaha Bureau is following remarkable way of operations, that is I any customer can enter at any time of our schedule and collect all details and either accept or reject asper their desire. Our collection of data, newly implementing way of approach (different sources of information from rural, urban, city & abroad ) on the light of the above our website is outstanding than that of other websites.",
  },
  {
    question: "Is Aiswarya Matrimonial a trustworthy matchmaking platform?",
    answer:
      'Yes, our website is chiefly operating on the base of customer\'s trust and their evaluation. Our website promote different choices and making "Newly Constructive Attitude". So we have an opinion that the dream of customers will be materializing on the base of our offering.',
  },
  {
    question: "What is the difference between free membership vs paid membership?",
    answer:
      "Our website stands for the satisfaction of customers by choosing there database collection. But we allow all details except key point.",
  },
  {
    question: "What additional benefits do I get as a Premium Member?",
    answer:
      "Surely our customers will get maximum benefit at the time of there contact with the attempt, surprise benefit, extraordinary offerings and benefits will be releasing to the eligible customers.",
  },
  {
    question: "How can I contact other members Aiswarya Matrimonial?",
    answer: [
      "No wonder our website is everywhere and easy to open without any obstacle if the customers are ready to contact with our website. The meaning is the M/s Aiswarya Vivaha Bureau and its operation is as omni present.",
      "In shot our reputed website is a remedy for the customers those who are interested to select marriage alliance and share with us, maximum level of co-operation constructive attitude and spontaneous way of behavior. Our motto is maximum satisfaction with minimum level of customers attitude.",
      "A significant merit is Rs. 499/- (as fees) no other website can clarify because they are imposing than that of this amount. We had had 37 years experiences, during this experiences which proves the original quality of website and how can maintain a website (Vivaha bureau). With full meaning full level.",
    ],
  },
];

const MembershipPage = () => {
  const router = useRouter();
  const [openFaq, setOpenFaq] = useState<number | null>(null);

  return (
    <div className="min-h-screen bg-background">
      <Navbar />

      {/* Hero banner (same style as Contact page) */}
      <PageHeroBanner
        tagLabel="Premium Memberships"
        TagIcon={Crown}
        titlePart1="Invest in Your"
        titleHighlight="Love Story"
        description="Choose the perfect plan to accelerate your journey towards finding your soulmate"
        backgroundImage="/images/Close%20Up%20Wedding%20Couple%20Hands%20with%20Gold%20Rings%20and%20Bouquet%20_%20Luxury%20Bridal%20Jewelry%20Inspiration%202026%20(1).jpg"
      />

      {/* Pricing Cards Section */}
      <section className="py-16 relative overflow-hidden" style={{ backgroundColor: "var(--membership-section-bg)" }}>
        <div className="container mx-auto px-4 relative z-10">
          {/* Pricing Cards - 5 columns */}
          <div className="grid sm:grid-cols-2 lg:grid-cols-5 gap-6 max-w-[90rem] mx-auto">
            {plansData.map((plan, index) => (
              <div
                key={plan.name}
                className="relative animate-fade-in-up flex"
                style={{ animationDelay: `${0.1 * index}s` }}
              >
                {plan.badge && (
                  <div className={`absolute -top-1 z-10 ${plan.badge === "SPECIAL OFFER" ? "left-0 -translate-x-0.5" : "right-0 translate-x-0.5"}`}>
                    {plan.badge === "SPECIAL OFFER" ? (
                      <div className="relative" style={{ transform: "rotate(-8deg)" }}>
                        <div className="relative bg-red-600 text-white font-bold uppercase text-center shadow-[0_3px_8px_rgba(0,0,0,0.35),inset_0_1px_0_rgba(255,255,255,0.15)]" style={{ padding: "6px 14px 8px 12px", textShadow: "0 1px 2px rgba(0,0,0,0.4)", clipPath: "polygon(0 0, 100% 0, 98% 100%, 2% 100%)" }}>
                          <div className="text-[10px] leading-tight tracking-wider">SPECIAL</div>
                          <div className="text-xs leading-tight tracking-wider">OFFER</div>
                        </div>
                        <div className="absolute bottom-0 right-0 w-8 h-3 bg-amber-400 opacity-95" style={{ clipPath: "polygon(20% 0, 100% 0, 100% 100%, 0 100%, 0 60%)", boxShadow: "0 2px 4px rgba(0,0,0,0.2)" }} aria-hidden />
                      </div>
                    ) : plan.badge === "TOP RECOMMENDED" ? (
                      <div className="inline-flex flex-col items-end">
                        <div className="bg-blue-600 text-white text-[9px] font-bold uppercase tracking-wider px-3 py-1 text-center border-b border-blue-500/50" style={{ clipPath: "polygon(8px 0, 100% 0, calc(100% - 8px) 100%, 0 100%)", textShadow: "0 1px 1px rgba(0,0,0,0.3)", boxShadow: "0 2px 4px rgba(0,0,0,0.2)" }}>
                          RECOMMENDED
                        </div>
                        <div className="flex gap-1 justify-center py-0.5">
                          {[1,2,3,4,5].map((i) => <span key={i} className="w-1 h-1 rounded-full bg-white/80" />)}
                        </div>
                        <div className="relative bg-red-600 text-white text-lg font-black uppercase tracking-widest py-1.5 px-5 text-center border-l-2 border-r-2 border-red-700/60" style={{ clipPath: "polygon(0 0, 100% 0, 100% 85%, 50% 100%, 0 85%)", textShadow: "0 1px 2px rgba(0,0,0,0.4)", boxShadow: "0 4px 10px rgba(0,0,0,0.25), inset 0 1px 0 rgba(255,255,255,0.2)" }}>
                          TOP
                          <div className="absolute left-1 top-1/2 -translate-y-1/2 flex flex-col gap-0.5">
                            {[1,2,3].map((i) => <span key={i} className="w-0.5 h-0.5 rounded-full bg-white/70" />)}
                          </div>
                          <div className="absolute right-1 top-1/2 -translate-y-1/2 flex flex-col gap-0.5">
                            {[1,2,3].map((i) => <span key={i} className="w-0.5 h-0.5 rounded-full bg-white/70" />)}
                          </div>
                        </div>
                      </div>
                    ) : (
                      <div className={`px-3 py-1.5 ${plan.badgeColor} text-xs font-bold rounded-full shadow-md flex items-center gap-1 whitespace-nowrap`}>
                        <Star className="w-3 h-3 fill-current" />
                        {plan.badge}
                      </div>
                    )}
                  </div>
                )}

                <div
                  className={`h-full w-full rounded-3xl p-6 transition-all duration-500 hover-lift group flex flex-col shadow-card border-2 ${plan.cardBg || "bg-white"} ${plan.cardAccent || "border-primary/10"}`}
                >
                  <div className={`w-14 h-14 rounded-2xl flex items-center justify-center mb-4 group-hover:scale-110 transition-transform shadow-[0_4px_12px_-2px_rgba(0,0,0,0.15)] ${plan.iconBg || "bg-accent-rose"}`}>
                    <plan.icon className="w-7 h-7 text-white" />
                  </div>

                  <h3 className="font-serif text-xl font-bold mb-1" style={{ color: "var(--membership-title)" }}>{plan.name}</h3>
                  <p className="text-xs mb-3" style={{ color: "var(--membership-desc)" }}>{plan.description}</p>
                  
                  <div className="flex items-baseline gap-1 mb-3">
                    <span className="font-serif text-3xl font-bold" style={{ color: "var(--membership-price)" }}>{plan.price}</span>
                    {plan.period && <span className="text-sm" style={{ color: "var(--membership-period)" }}>{plan.period}</span>}
                  </div>

                  {plan.highlightFeature && (
                    <p className="text-sm font-medium mb-1 underline underline-offset-2" style={{ color: "var(--membership-feature)" }}>
                      {plan.highlightFeature}
                    </p>
                  )}

                  {plan.contactView && (
                    <p className="text-sm font-bold mb-4" style={{ color: "var(--membership-title)" }}>
                      {plan.contactView}
                    </p>
                  )}

                  <ul className="mb-6 flex-1">
                    {plan.features.map((feature, i) => (
                      <li key={i} className="flex flex-col">
                        <div className="flex items-start gap-2.5 py-3">
                          <div className="w-5 h-5 rounded-full flex items-center justify-center flex-shrink-0 mt-0.5 bg-[#6A3266]/15">
                            <Check className="w-3 h-3" style={{ color: "var(--membership-check)" }} />
                          </div>
                          <span className="text-sm flex-1" style={{ color: "var(--membership-feature)" }}>{feature}</span>
                        </div>
                        {i < plan.features.length - 1 && <div className="mx-2 border-b" style={{ borderColor: "var(--membership-divider)" }} />}
                      </li>
                    ))}
                  </ul>

                  <Button 
                    variant="hero" 
                    size="lg" 
                    className="w-full group/btn border-0 text-white hover:opacity-95"
                    style={{ background: "#b23272", boxShadow: "0 4px 14px -2px rgba(178, 50, 114, 0.35)" }}
                    onClick={() => router.push("/auth")}
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
                  <div className="px-6 pb-6 pt-0 animate-fade-in-up space-y-3">
                    {(Array.isArray(faq.answer) ? faq.answer : [faq.answer]).map((para, i) => (
                      <p key={i} className="text-muted-foreground text-sm sm:text-base leading-relaxed">
                        {para}
                      </p>
                    ))}
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
