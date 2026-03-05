import { useState } from "react";
import DashboardLayout from "@/components/DashboardLayout";
import { Button } from "@/components/ui/button";
import { Check, Star, Crown, Sparkles, ArrowRight } from "lucide-react";
import PaymentPopup from "@/components/PaymentPopup";
import { plansData } from "@/components/Membership";

const PlanPage = () => {
  const [paymentOpen, setPaymentOpen] = useState(false);
  const [selectedPlanIndex, setSelectedPlanIndex] = useState<number>(1);

  const handleChoosePlan = (index: number) => {
    setSelectedPlanIndex(index);
    setPaymentOpen(true);
  };

  return (
    <DashboardLayout>
      <div className="space-y-6">
        <h1 className="font-serif text-2xl md:text-3xl font-bold text-foreground pb-3 border-b border-gray-200">
          Plans & Pricing
        </h1>

        <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {plansData.map((plan, index) => (
            <div
              key={plan.name}
              className={`relative bg-white rounded-2xl shadow-card overflow-hidden flex flex-col ${
                plan.isPopular
                  ? "ring-2 ring-secondary border-secondary/30 md:-mt-2 md:mb-2"
                  : "border border-primary/10"
              }`}
            >
              {plan.isPopular && (
                <div className="absolute top-0 left-0 right-0 z-10 bg-secondary text-white text-center py-2 px-4">
                  <span className="font-serif font-bold text-base tracking-wide flex items-center justify-center gap-2">
                    <Star className="w-5 h-5 fill-current flex-shrink-0" /> Best Value
                  </span>
                </div>
              )}
              <div className={`p-6 flex flex-col flex-1 ${plan.isPopular ? "pt-14" : ""}`}>
                {/* Plan icon */}
                <div
                  className={`w-14 h-14 rounded-2xl flex items-center justify-center mb-4 ${
                    plan.isPopular || plan.variant === "gold"
                      ? "bg-gradient-to-br from-secondary to-amber-400 shadow-md"
                      : "bg-accent-rose"
                  }`}
                >
                  <plan.icon
                    className={`w-7 h-7 ${
                      plan.isPopular || plan.variant === "gold" ? "text-white" : "text-primary"
                    }`}
                  />
                </div>

                <h2
                  className={`font-serif text-xl font-bold ${
                    plan.isPopular || plan.variant === "gold" ? "text-secondary" : "text-foreground"
                  }`}
                >
                  {plan.name}
                </h2>
                <p className="text-sm text-muted-foreground mb-3">{plan.description}</p>

                <div className="flex items-baseline gap-1 mb-4">
                  <span className="font-serif text-2xl font-bold text-primary">{plan.price}</span>
                  <span className="text-sm text-muted-foreground">{plan.period}</span>
                </div>

                <ul className="space-y-2.5 flex-1">
                  {plan.features.map((feature, i) => (
                    <li key={i} className="flex items-start gap-2 text-sm text-foreground">
                      <div
                        className={`w-5 h-5 rounded-full flex items-center justify-center flex-shrink-0 mt-0.5 ${
                          plan.isPopular || plan.variant === "gold"
                            ? "bg-secondary/20"
                            : "bg-accent-rose"
                        }`}
                      >
                        <Check
                          className={`w-3 h-3 ${
                            plan.isPopular || plan.variant === "gold"
                              ? "text-secondary"
                              : "text-primary"
                          }`}
                        />
                      </div>
                      <span>{feature}</span>
                    </li>
                  ))}
                </ul>

                <Button
                  type="button"
                  variant={plan.variant}
                  className="mt-6 w-full gap-2 group/btn"
                  onClick={() => handleChoosePlan(index)}
                >
                  Get Started
                  <ArrowRight className="w-4 h-4 group-hover/btn:translate-x-1 transition-transform" />
                </Button>
              </div>
            </div>
          ))}
        </div>
      </div>

      <PaymentPopup
        key={selectedPlanIndex}
        open={paymentOpen}
        onOpenChange={setPaymentOpen}
        defaultPlanId={selectedPlanIndex}
      />
    </DashboardLayout>
  );
};

export default PlanPage;
