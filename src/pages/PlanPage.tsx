import { useState } from "react";
import DashboardLayout from "@/components/DashboardLayout";
import { Button } from "@/components/ui/button";
import { Check } from "lucide-react";
import PaymentPopup from "@/components/PaymentPopup";

const plans = [
  {
    id: "silver",
    name: "Silver",
    price: "₹499",
    duration: "3 Months",
    features: ["View Contact Details", "Send 10 Interests/day", "Basic Chat"],
    buttonLabel: "Choose Silver",
    variant: "silver" as const,
  },
  {
    id: "gold",
    name: "Gold",
    price: "₹999",
    duration: "6 Months",
    popular: true,
    features: ["All Silver +", "50 Interests/day", "Priority Listing"],
    buttonLabel: "Choose Gold",
    variant: "gold" as const,
  },
  {
    id: "diamond",
    name: "Diamond",
    price: "₹1999",
    duration: "12 Months",
    features: ["All Gold +", "Unlimited Contacts", "Dedicated Manager"],
    buttonLabel: "Choose Diamond",
    variant: "diamond" as const,
  },
];

const PlanPage = () => {
  const [paymentOpen, setPaymentOpen] = useState(false);
  const [selectedPlanId, setSelectedPlanId] = useState<string | null>(null);

  const handleChoosePlan = (planId: string) => {
    setSelectedPlanId(planId);
    setPaymentOpen(true);
  };

  const defaultPlanId = plans.find((p) => p.id === (selectedPlanId ?? "gold")) ? 2 : 2; // Gold = 2 for PaymentPopup if it uses index

  return (
    <DashboardLayout>
      <div className="space-y-6">
        <h1 className="font-serif text-2xl md:text-3xl font-bold text-foreground pb-3 border-b border-gray-200">
          Plans & Pricing
        </h1>

        <div className="grid md:grid-cols-3 gap-6">
          {plans.map((plan) => (
            <div
              key={plan.id}
              className={`relative bg-white rounded-2xl shadow-card overflow-hidden flex flex-col ${
                plan.popular ? "ring-2 ring-secondary border-secondary/30" : "border border-primary/10"
              }`}
            >
              {plan.popular && (
                <div className="absolute top-0 left-0 right-0 bg-orange-500 text-white text-center py-1.5 text-xs font-bold tracking-wider">
                  POPULAR
                </div>
              )}
              <div className={`p-6 ${plan.popular ? "pt-10" : ""}`}>
                <h2
                  className={`font-serif text-xl font-bold ${
                    plan.variant === "silver"
                      ? "text-gray-700"
                      : plan.variant === "gold"
                        ? "text-secondary"
                        : "text-primary"
                  }`}
                >
                  {plan.name}
                </h2>
                <p
                  className={`mt-2 text-2xl font-bold ${
                    plan.variant === "silver"
                      ? "text-gray-800"
                      : plan.variant === "gold"
                        ? "text-secondary"
                        : "text-primary"
                  }`}
                >
                  {plan.price}
                </p>
                <p className="text-sm text-muted-foreground mt-0.5">{plan.duration}</p>
                <ul className="mt-6 space-y-3">
                  {plan.features.map((feature, i) => (
                    <li key={i} className="flex items-center gap-2 text-sm text-foreground">
                      <Check className="w-5 h-5 text-green-600 flex-shrink-0" />
                      {feature}
                    </li>
                  ))}
                </ul>
                <Button
                  type="button"
                  className={`mt-6 w-full ${
                    plan.variant === "silver"
                      ? "bg-gray-700 hover:bg-gray-800 text-white"
                      : plan.variant === "gold"
                        ? "bg-secondary hover:bg-secondary/90 text-secondary-foreground"
                        : "bg-primary hover:bg-primary/90 text-primary-foreground"
                  }`}
                  onClick={() => handleChoosePlan(plan.id)}
                >
                  {plan.buttonLabel}
                </Button>
              </div>
            </div>
          ))}
        </div>
      </div>

      <PaymentPopup
        open={paymentOpen}
        onOpenChange={setPaymentOpen}
        defaultPlanId={plans.findIndex((p) => p.id === (selectedPlanId ?? "gold")) + 1 || 2}
      />
    </DashboardLayout>
  );
};

export default PlanPage;
