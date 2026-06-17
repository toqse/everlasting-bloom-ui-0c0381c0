export type RazorpayPaymentResponse = {
  razorpay_payment_id: string;
  razorpay_order_id: string;
  razorpay_signature: string;
};

declare global {
  interface Window {
    Razorpay?: new (options: {
      key: string;
      amount: number;
      currency: string;
      order_id: string;
      name?: string;
      description?: string;
      handler: (response: RazorpayPaymentResponse) => void;
      prefill?: { name?: string; email?: string; contact?: string };
      theme?: { color?: string };
      modal?: { ondismiss?: () => void };
    }) => { open: () => void };
  }
}

let razorpayScriptPromise: Promise<boolean> | null = null;

export async function ensureRazorpayScript(): Promise<boolean> {
  if (typeof window === "undefined") return false;
  if (window.Razorpay) return true;
  if (!razorpayScriptPromise) {
    razorpayScriptPromise = new Promise((resolve) => {
      const script = document.createElement("script");
      script.src = "https://checkout.razorpay.com/v1/checkout.js";
      script.async = true;
      script.onload = () => resolve(true);
      script.onerror = () => resolve(false);
      document.body.appendChild(script);
    });
  }
  return razorpayScriptPromise;
}

export type OpenRazorpayCheckoutOptions = {
  keyId: string;
  orderId: string;
  amount: number;
  currency: string;
  name?: string;
  description?: string;
  prefill?: { name?: string; email?: string; contact?: string };
  themeColor?: string;
  onSuccess: (payment: RazorpayPaymentResponse) => void | Promise<void>;
  onDismiss?: () => void;
};

export async function openRazorpayCheckout(opts: OpenRazorpayCheckoutOptions): Promise<void> {
  const sdkReady = await ensureRazorpayScript();
  if (!sdkReady || !window.Razorpay) {
    throw new Error("Could not load Razorpay checkout.");
  }

  const RazorpayCtor = window.Razorpay;

  await new Promise<void>((resolve, reject) => {
    const rz = new RazorpayCtor({
      key: opts.keyId,
      amount: opts.amount,
      currency: opts.currency,
      order_id: opts.orderId,
      name: opts.name ?? "Aiswarya Matrimony",
      description: opts.description,
      prefill: opts.prefill,
      theme: { color: opts.themeColor ?? "#8d1b5b" },
      handler: async (payment) => {
        try {
          await opts.onSuccess(payment);
          resolve();
        } catch (e) {
          reject(e instanceof Error ? e : new Error("Payment verification failed."));
        }
      },
      modal: {
        ondismiss: () => {
          opts.onDismiss?.();
          reject(new Error("Payment cancelled."));
        },
      },
    });
    rz.open();
  });
}
