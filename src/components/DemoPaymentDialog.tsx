"use client";

import { useEffect, useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import {
  Check,
  CreditCard,
  Download,
  Loader2,
  Lock,
  Smartphone,
  Wallet,
} from "lucide-react";
import { cn } from "@/lib/utils";

interface DemoPaymentDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  amount: number;
  productLabel: string;
  downloadUrl: string;
}

const paymentMethods = [
  { id: "upi", label: "UPI", icon: Smartphone, desc: "GPay, PhonePe, Paytm" },
  { id: "card", label: "Card", icon: CreditCard, desc: "Credit / Debit card" },
  { id: "wallet", label: "Wallet", icon: Wallet, desc: "Paytm, Amazon Pay" },
];

const formatPrice = (amount: number) => `₹${amount.toLocaleString("en-IN")}`;

const DemoPaymentDialog = ({
  open,
  onOpenChange,
  amount,
  productLabel,
  downloadUrl,
}: DemoPaymentDialogProps) => {
  const [selectedPayment, setSelectedPayment] = useState<string | null>(null);
  const [phase, setPhase] = useState<"pay" | "processing" | "success">("pay");
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    if (!open) {
      setSelectedPayment(null);
      setPhase("pay");
      setSubmitting(false);
    }
  }, [open]);

  const handlePay = async () => {
    if (!selectedPayment || submitting) return;
    setSubmitting(true);
    setPhase("processing");
    await new Promise((resolve) => setTimeout(resolve, 1200));
    setPhase("success");
    setSubmitting(false);
  };

  const handleDownload = () => {
    const url = downloadUrl.trim();
    if (!url) return;
    window.open(url, "_blank", "noopener,noreferrer");
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-lg w-[95vw] rounded-3xl p-0 gap-0 border-0 shadow-elevated overflow-hidden">
        {phase === "success" ? (
          <>
            <DialogHeader className="p-6 pb-2 border-b border-primary/10">
              <DialogTitle className="font-serif text-xl font-bold text-secondary">
                Payment successful
              </DialogTitle>
            </DialogHeader>
            <div className="p-8 flex flex-col items-center text-center gap-4">
              <div className="w-16 h-16 rounded-full bg-green-100 flex items-center justify-center">
                <Check className="w-8 h-8 text-green-600" />
              </div>
              <div className="space-y-1">
                <p className="font-serif text-lg font-bold text-foreground">
                  {formatPrice(amount)} paid
                </p>
                <p className="text-sm text-muted-foreground">
                  Your {productLabel} is ready to download.
                </p>
              </div>
              <Button
                variant="hero"
                className="w-full gap-2 mt-2"
                onClick={handleDownload}
                disabled={!downloadUrl.trim()}
              >
                <Download className="w-4 h-4" />
                Download {productLabel}
              </Button>
              <Button variant="outline" onClick={() => onOpenChange(false)}>
                Close
              </Button>
            </div>
          </>
        ) : (
          <>
            <DialogHeader className="p-6 pb-4 border-b border-primary/10">
              <DialogTitle className="font-serif text-xl font-bold text-secondary">
                Complete your purchase
              </DialogTitle>
            </DialogHeader>
            <div className="p-6 space-y-5">
              <div className="rounded-2xl border-2 border-primary bg-accent-rose/5 p-4">
                <p className="text-sm text-muted-foreground mb-1">Product</p>
                <p className="font-serif font-bold text-foreground text-lg">
                  {productLabel}
                </p>
                <p className="font-serif text-2xl font-bold text-primary mt-2">
                  {formatPrice(amount)}
                </p>
                <p className="text-xs text-muted-foreground mt-1">
                  Demo payment — no real charge
                </p>
              </div>

              <div>
                <h3 className="font-serif font-bold text-foreground mb-3">
                  Payment method
                </h3>
                <div className="grid grid-cols-3 gap-2">
                  {paymentMethods.map((method) => (
                    <button
                      key={method.id}
                      type="button"
                      onClick={() => setSelectedPayment(method.id)}
                      className={cn(
                        "rounded-xl border-2 p-3 flex flex-col items-center gap-1 transition-all min-h-[88px]",
                        selectedPayment === method.id
                          ? "border-primary bg-accent-rose/30 shadow-soft"
                          : "border-primary/10 bg-white hover:border-primary/30",
                      )}
                    >
                      <method.icon className="w-6 h-6 text-primary" />
                      <span className="font-medium text-xs text-foreground">
                        {method.label}
                      </span>
                    </button>
                  ))}
                </div>
              </div>

              <div className="flex items-center gap-2 text-sm text-muted-foreground">
                <Lock className="w-4 h-4 flex-shrink-0" />
                <span>Demo checkout for testing without Razorpay.</span>
              </div>

              <div className="flex flex-col sm:flex-row gap-3 pt-1">
                <Button
                  variant="hero"
                  className="flex-1"
                  disabled={!selectedPayment || submitting}
                  onClick={handlePay}
                >
                  {phase === "processing" || submitting ? (
                    <>
                      <Loader2 className="w-4 h-4 animate-spin mr-2" />
                      Processing...
                    </>
                  ) : (
                    `Pay ${formatPrice(amount)}`
                  )}
                </Button>
                <Button
                  variant="outline"
                  disabled={submitting}
                  onClick={() => onOpenChange(false)}
                >
                  Cancel
                </Button>
              </div>
            </div>
          </>
        )}
      </DialogContent>
    </Dialog>
  );
};

export default DemoPaymentDialog;
