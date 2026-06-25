import { useEffect, useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Check, Lock, CreditCard } from "lucide-react";
import {
  createPlanOrder,
  verifyPlanPayment,
  type AvailablePlan,
} from "@/lib/plansApi";
import { openRazorpayCheckout } from "@/lib/razorpayCheckout";
import { useAuthStore } from "@/stores/authStore";
import { toast } from "sonner";

interface PaymentPopupProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  apiPlan?: AvailablePlan;
  defaultPlanId?: number;
  /** User's actual remaining service charge from GET /my/plan/ (overrides catalog default). */
  serviceChargeRemaining?: number;
  onPurchaseSuccess?: () => void | Promise<void>;
}

const formatPrice = (amount: number) => `₹${amount.toLocaleString("en-IN")}`;

const buildApiFeatures = (plan: AvailablePlan): string[] => {
  const list: string[] = [];
  if (plan.profile_view_limit > 0) list.push(`${plan.profile_view_limit} Profile Views`);
  if (plan.interest_limit > 0) list.push(`${plan.interest_limit} Interest Sends`);
  if (plan.contact_view_limit > 0) list.push(`${plan.contact_view_limit} Contact Views`);
  if (plan.chat_limit > 0) list.push(`${plan.chat_limit} Chat Starts`);
  if (plan.horoscope_match_limit > 0) list.push(`${plan.horoscope_match_limit} Horoscope Matches`);
  return list;
};

const PaymentPopup = ({
  open,
  onOpenChange,
  apiPlan,
  serviceChargeRemaining: userServiceChargeRemaining,
  onPurchaseSuccess,
}: PaymentPopupProps) => {
  const user = useAuthStore((s) => s.user);
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    setSubmitting(false);
  }, [apiPlan, open]);

  if (!apiPlan) return null;

  const planPrice = apiPlan.price ?? 0;
  const catalogRemaining =
    apiPlan.service_charge_remaining ??
    Math.max(0, (apiPlan.service_charge ?? 0) - planPrice);
  const serviceChargeRemaining =
    userServiceChargeRemaining !== undefined
      ? userServiceChargeRemaining
      : catalogRemaining;
  const hasServiceChargeRemaining = serviceChargeRemaining > 0;

  const features = buildApiFeatures(apiPlan);

  const handlePay = async () => {
    if (!apiPlan) return;
    setSubmitting(true);
    try {
      const orderRes = await createPlanOrder(apiPlan.id, "plan_only");
      const order = orderRes.data;
      if (!order.order_id || !order.key_id) {
        throw new Error("Invalid payment order response.");
      }

      await openRazorpayCheckout({
        keyId: order.key_id,
        orderId: order.order_id,
        amount: order.amount,
        currency: order.currency,
        description: `${apiPlan.name} membership plan`,
        prefill: {
          name: user?.name ?? undefined,
          email: user?.email ?? undefined,
          contact: user?.phone ?? undefined,
        },
        onSuccess: async (payment) => {
          const verifyRes = await verifyPlanPayment({
            planId: apiPlan.id,
            paymentOption: "plan_only",
            razorpay_order_id: payment.razorpay_order_id,
            razorpay_payment_id: payment.razorpay_payment_id,
            razorpay_signature: payment.razorpay_signature,
          });
          toast.success(verifyRes.message ?? "Plan purchased successfully.");
          await onPurchaseSuccess?.();
          onOpenChange(false);
        },
      });
    } catch (e) {
      const msg = e instanceof Error ? e.message : "Failed to purchase plan";
      if (msg !== "Payment cancelled.") {
        toast.error(msg);
      }
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-4xl w-[95vw] max-h-[90vh] overflow-y-auto rounded-3xl p-0 gap-0 border-0 shadow-elevated">
        <DialogHeader className="p-6 pb-4 border-b border-primary/10">
          <DialogTitle className="font-serif text-xl font-bold text-secondary">
            Complete your purchase
          </DialogTitle>
        </DialogHeader>

        <div className="grid md:grid-cols-2 min-h-[420px]">
          <div className="p-6 border-b md:border-b-0 md:border-r border-primary/10 bg-accent-rose/5 flex flex-col">
            <h3 className="font-serif font-bold text-foreground mb-4">Selected plan</h3>
            <div className="rounded-2xl border-2 border-primary bg-white shadow-soft p-4 flex flex-col gap-3">
              <span className="font-serif font-bold text-foreground text-lg">{apiPlan.name}</span>
              {apiPlan.description && (
                <p className="text-sm text-muted-foreground">{apiPlan.description}</p>
              )}
              <div>
                <p className="font-serif text-2xl font-bold text-primary">{formatPrice(planPrice)}</p>
                {apiPlan.duration_days > 0 && (
                  <p className="text-xs text-muted-foreground">
                    Valid for {apiPlan.duration_days} days
                  </p>
                )}
              </div>
              {hasServiceChargeRemaining && (
                <div className="rounded-lg bg-green-50 border border-green-200 px-3 py-2 text-xs text-green-800">
                  <span className="font-semibold">Registration fee:</span> {formatPrice(planPrice)}
                  <br />
                  <span className="text-green-600">
                    Remaining service charge: {formatPrice(serviceChargeRemaining)}
                  </span>
                </div>
              )}
              <ul className="space-y-1 text-sm text-foreground">
                {features.map((feat, i) => (
                  <li key={i} className="flex items-start gap-2">
                    <Check className="w-4 h-4 text-primary mt-0.5 flex-shrink-0" />
                    <span>{feat}</span>
                  </li>
                ))}
              </ul>
            </div>
          </div>

          <div className="p-6 flex flex-col">
            <h3 className="font-serif font-bold text-foreground mb-4">Payment</h3>

            <div className="rounded-xl border-2 border-primary bg-accent-rose/30 p-3 mb-4 text-sm">
              <span className="font-semibold">Registration fee</span>
              <span className="block text-muted-foreground">{formatPrice(planPrice)}</span>
              {hasServiceChargeRemaining && (
                <p className="text-xs text-muted-foreground mt-2">
                  Remaining service charge can be paid later from your membership section.
                </p>
              )}
            </div>

            <div className="rounded-2xl border border-primary/15 bg-white p-4 flex items-start gap-3">
              <CreditCard className="w-8 h-8 text-primary flex-shrink-0 mt-0.5" />
              <div>
                <p className="font-medium text-foreground">Pay securely with Razorpay</p>
                <p className="text-xs text-muted-foreground mt-1">
                  UPI, cards, net banking, and wallets supported in one checkout.
                </p>
              </div>
            </div>

            <div className="mt-6 flex items-center gap-2 text-sm text-muted-foreground">
              <Lock className="w-4 h-4 flex-shrink-0" />
              <span>Secure payment. Your data is encrypted.</span>
            </div>

            <div className="mt-4 flex flex-col sm:flex-row gap-3">
              <Button
                variant="hero"
                className="flex-1"
                disabled={submitting}
                onClick={handlePay}
              >
                {submitting ? "Processing..." : `Pay ${formatPrice(planPrice)} with Razorpay`}
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
