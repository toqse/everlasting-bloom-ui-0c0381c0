import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { X, CreditCard, Smartphone, Check, Crown, Star, Shield } from "lucide-react";

interface PaymentPopupProps {
  isOpen: boolean;
  onClose: () => void;
  onSuccess?: () => void;
}

const plans = [
  { name: "Silver", price: "₹999", duration: "3 Months", features: ["15 Horoscope Matches", "Basic Search", "50 Interests/Month"], color: "from-gray-400 to-gray-500" },
  { name: "Gold", price: "₹1,499", duration: "6 Months", popular: true, features: ["30 Horoscope Matches", "Advanced Search", "100 Interests/Month", "Profile Boost"], color: "from-secondary to-secondary-light" },
  { name: "Premium", price: "₹1,999", duration: "1 Year", features: ["70 Horoscope Matches", "Priority Search", "Unlimited Interests", "Profile Boost", "Video Call"], color: "from-primary to-primary-light" },
];

const paymentMethods = [
  { id: "gpay", name: "Google Pay", icon: "💳", color: "bg-blue-50 border-blue-200" },
  { id: "phonepe", name: "PhonePe", icon: "📱", color: "bg-purple-50 border-purple-200" },
  { id: "paytm", name: "Paytm", icon: "💰", color: "bg-blue-50 border-blue-200" },
  { id: "card", name: "Credit/Debit Card", icon: "💳", color: "bg-gray-50 border-gray-200" },
];

const PaymentPopup = ({ isOpen, onClose, onSuccess }: PaymentPopupProps) => {
  const [selectedPlan, setSelectedPlan] = useState(1);
  const [selectedMethod, setSelectedMethod] = useState("");
  const [step, setStep] = useState<"plan" | "payment" | "success">("plan");

  const handlePay = () => {
    if (!selectedMethod) return;
    setStep("success");
    setTimeout(() => {
      onSuccess?.();
      onClose();
      setStep("plan");
      setSelectedMethod("");
    }, 2500);
  };

  if (!isOpen) return null;

  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        className="fixed inset-0 z-[60] bg-foreground/50 backdrop-blur-sm flex items-center justify-center p-4"
        onClick={onClose}
      >
        <motion.div
          initial={{ scale: 0.9, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          exit={{ scale: 0.9, opacity: 0 }}
          className="bg-card rounded-3xl shadow-elevated max-w-lg w-full max-h-[90vh] overflow-y-auto p-6"
          onClick={(e) => e.stopPropagation()}
        >
          <div className="flex items-center justify-between mb-6">
            <h2 className="font-serif text-xl font-bold text-secondary">
              {step === "plan" ? "Choose a Plan" : step === "payment" ? "Select Payment" : "Payment Successful!"}
            </h2>
            <button onClick={onClose} className="w-8 h-8 rounded-full bg-accent-rose flex items-center justify-center hover:bg-primary/10 transition-colors">
              <X className="w-4 h-4" />
            </button>
          </div>

          {step === "plan" && (
            <div className="space-y-3">
              {plans.map((plan, i) => (
                <motion.div
                  key={plan.name}
                  whileHover={{ scale: 1.02 }}
                  onClick={() => setSelectedPlan(i)}
                  className={`relative p-4 rounded-2xl border-2 cursor-pointer transition-all ${
                    selectedPlan === i ? "border-primary shadow-soft" : "border-primary/10 hover:border-primary/30"
                  }`}
                >
                  {plan.popular && (
                    <span className="absolute -top-2 right-4 px-3 py-0.5 bg-secondary text-secondary-foreground text-[10px] font-bold rounded-full">
                      MOST POPULAR
                    </span>
                  )}
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <div className={`w-10 h-10 rounded-xl bg-gradient-to-br ${plan.color} flex items-center justify-center`}>
                        <Crown className="w-5 h-5 text-white" />
                      </div>
                      <div>
                        <h3 className="font-serif font-bold text-foreground">{plan.name}</h3>
                        <p className="text-xs text-muted-foreground">{plan.duration}</p>
                      </div>
                    </div>
                    <span className="font-serif text-xl font-bold text-foreground">{plan.price}</span>
                  </div>
                  <div className="flex flex-wrap gap-2 mt-3">
                    {plan.features.map((f) => (
                      <span key={f} className="text-[10px] px-2 py-0.5 bg-accent-rose rounded-full text-foreground">{f}</span>
                    ))}
                  </div>
                </motion.div>
              ))}
              <button
                onClick={() => setStep("payment")}
                className="w-full py-3 rounded-2xl bg-primary text-primary-foreground font-bold text-sm mt-4 hover:bg-primary-dark transition-colors"
              >
                Continue to Payment
              </button>
            </div>
          )}

          {step === "payment" && (
            <div className="space-y-3">
              <div className="bg-accent-rose/50 rounded-xl p-3 mb-4">
                <p className="text-sm text-center">
                  <span className="font-bold text-foreground">{plans[selectedPlan].name}</span> — {plans[selectedPlan].price} / {plans[selectedPlan].duration}
                </p>
              </div>
              {paymentMethods.map((m) => (
                <motion.div
                  key={m.id}
                  whileHover={{ scale: 1.02 }}
                  onClick={() => setSelectedMethod(m.id)}
                  className={`p-4 rounded-2xl border-2 cursor-pointer flex items-center gap-3 transition-all ${
                    selectedMethod === m.id ? "border-primary shadow-soft" : "border-primary/10"
                  }`}
                >
                  <span className="text-2xl">{m.icon}</span>
                  <span className="font-medium text-foreground text-sm">{m.name}</span>
                  {selectedMethod === m.id && <Check className="w-5 h-5 text-primary ml-auto" />}
                </motion.div>
              ))}
              <div className="flex gap-3 mt-4">
                <button onClick={() => setStep("plan")} className="flex-1 py-3 rounded-2xl border-2 border-primary/10 font-medium text-sm">
                  Back
                </button>
                <button
                  onClick={handlePay}
                  disabled={!selectedMethod}
                  className="flex-1 py-3 rounded-2xl bg-primary text-primary-foreground font-bold text-sm disabled:opacity-40 hover:bg-primary-dark transition-colors"
                >
                  Pay {plans[selectedPlan].price}
                </button>
              </div>
            </div>
          )}

          {step === "success" && (
            <div className="text-center py-8">
              <motion.div
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                transition={{ type: "spring", stiffness: 200 }}
                className="w-20 h-20 rounded-full bg-accent-gold/50 flex items-center justify-center mx-auto mb-4"
              >
                <Check className="w-10 h-10 text-secondary" />
              </motion.div>
              <h3 className="font-serif text-xl font-bold text-foreground mb-2">Payment Successful!</h3>
              <p className="text-sm text-muted-foreground">Your {plans[selectedPlan].name} plan is now active.</p>
            </div>
          )}
        </motion.div>
      </motion.div>
    </AnimatePresence>
  );
};

export default PaymentPopup;
