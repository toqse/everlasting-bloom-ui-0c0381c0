import { useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { plansData, type Plan } from "@/components/Membership";
import { Check, CreditCard, Smartphone, Building2, Wallet, Lock } from "lucide-react";
import { cn } from "@/lib/utils";

interface PaymentPopupProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  defaultPlanId?: number;
}

const paymentMethods = [
  { id: "upi", label: "UPI", icon: Smartphone, desc: "GPay, PhonePe, Paytm" },
  { id: "card", label: "Card", icon: CreditCard, desc: "Credit / Debit card" },
  { id: "netbanking", label: "Net Banking", icon: Building2, desc: "All major banks" },
  { id: "wallet", label: "Wallet", icon: Wallet, desc: "Paytm, Amazon Pay" },
];

const PaymentPopup = ({ open, onOpenChange, defaultPlanId = 1 }: PaymentPopupProps) => {
  const [selectedPlanIndex, setSelectedPlanIndex] = useState(defaultPlanId);
  const [selectedPayment, setSelectedPayment] = useState<string | null>(null);

  const selectedPlan = plansData[selectedPlanIndex];

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-4xl w-[95vw] max-h-[90vh] overflow-y-auto rounded-3xl p-0 gap-0 border-0 shadow-elevated">
        <DialogHeader className="p-6 pb-4 border-b border-primary/10">
          <DialogTitle className="font-serif text-xl font-bold text-secondary">
            Choose plan & pay
          </DialogTitle>
        </DialogHeader>

        <div className="grid md:grid-cols-2 min-h-[420px]">
          {/* Left: plan selector */}
          <div className="p-6 border-b md:border-b-0 md:border-r border-primary/10 bg-accent-rose/5">
            <h3 className="font-serif font-bold text-foreground mb-4">Select plan</h3>
            <div className="space-y-3">
              {plansData.map((plan: Plan, index: number) => (
                <button
                  key={plan.name}
                  onClick={() => setSelectedPlanIndex(index)}
                  className={cn(
                    "w-full text-left rounded-2xl border-2 p-4 transition-all",
                    selectedPlanIndex === index
                      ? "border-primary bg-white shadow-soft"
                      : "border-primary/10 bg-white/80 hover:border-primary/30"
                  )}
                >
                  <div className="flex items-start justify-between gap-2">
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2">
                        <plan.icon className="w-5 h-5 text-secondary flex-shrink-0" />
                        <span className="font-serif font-bold text-foreground">{plan.name}</span>
                        {plan.isPopular && (
                          <span className="text-xs font-medium text-secondary bg-secondary/15 px-2 py-0.5 rounded-full">
                            Popular
                          </span>
                        )}
                      </div>
                      <p className="text-sm text-muted-foreground mt-1">{plan.description}</p>
                      <p className="font-serif text-lg font-bold text-primary mt-2">
                        {plan.price}
                        <span className="text-sm font-normal text-muted-foreground">{plan.period}</span>
                      </p>
                    </div>
                    <div
                      className={cn(
                        "w-6 h-6 rounded-full border-2 flex items-center justify-center flex-shrink-0",
                        selectedPlanIndex === index ? "border-primary bg-primary" : "border-primary/30"
                      )}
                    >
                      {selectedPlanIndex === index && (
                        <Check className="w-4 h-4 text-primary-foreground" />
                      )}
                    </div>
                  </div>
                </button>
              ))}
            </div>
          </div>

          {/* Right: payment method grid */}
          <div className="p-6 flex flex-col">
            <h3 className="font-serif font-bold text-foreground mb-4">Payment method</h3>
            <div className="grid grid-cols-2 gap-3 flex-1 content-start">
              {paymentMethods.map((method) => (
                <button
                  key={method.id}
                  onClick={() => setSelectedPayment(method.id)}
                  className={cn(
                    "rounded-2xl border-2 p-4 flex flex-col items-center justify-center gap-2 transition-all min-h-[100px]",
                    selectedPayment === method.id
                      ? "border-primary bg-accent-rose/30 shadow-soft"
                      : "border-primary/10 bg-white hover:border-primary/30"
                  )}
                >
                  <method.icon className="w-8 h-8 text-primary" />
                  <span className="font-medium text-sm text-foreground">{method.label}</span>
                  <span className="text-xs text-muted-foreground">{method.desc}</span>
                </button>
              ))}
            </div>

            <div className="mt-6 flex items-center gap-2 text-sm text-muted-foreground">
              <Lock className="w-4 h-4 flex-shrink-0" />
              <span>Secure payment. Your data is encrypted.</span>
            </div>

            <div className="mt-4 flex flex-col sm:flex-row gap-3">
              <Button
                variant="hero"
                className="flex-1"
                disabled={!selectedPayment}
                onClick={() => onOpenChange(false)}
              >
                Pay {selectedPlan?.price}
              </Button>
              <Button variant="outline" onClick={() => onOpenChange(false)}>
                Cancel
              </Button>
            </div>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default PaymentPopup;
