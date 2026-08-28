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
      modal?: { ondismiss?: () => void; escape?: boolean; backdropclose?: boolean };
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

/**
 * Radix Dialog / react-remove-scroll sets `pointer-events: none` on <body>.
 * Razorpay's checkout iframe is a body child, so only the outer overlay receives
 * clicks. Unlock the page and lift Razorpay above our modals while checkout is open.
 */
function enableRazorpayInteraction(): () => void {
  if (typeof document === "undefined") return () => undefined;

  const body = document.body;
  const html = document.documentElement;
  const previousBody = {
    value: body.style.getPropertyValue("pointer-events"),
    priority: body.style.getPropertyPriority("pointer-events"),
  };
  const previousHtml = {
    value: html.style.getPropertyValue("pointer-events"),
    priority: html.style.getPropertyPriority("pointer-events"),
  };

  body.setAttribute("data-razorpay-open", "true");
  body.style.setProperty("pointer-events", "auto", "important");
  html.style.setProperty("pointer-events", "auto", "important");

  const style = document.createElement("style");
  style.setAttribute("data-razorpay-interaction-fix", "true");
  style.textContent = `
    body[data-razorpay-open] {
      pointer-events: auto !important;
    }
    body[data-razorpay-open] [data-radix-dialog-overlay],
    body[data-razorpay-open] [data-radix-dialog-content],
    body[data-razorpay-open] [data-radix-alert-dialog-overlay],
    body[data-razorpay-open] [data-radix-alert-dialog-content] {
      pointer-events: none !important;
    }
    .razorpay-container,
    .razorpay-backdrop,
    iframe.razorpay-checkout-frame,
    iframe[src*="razorpay"] {
      pointer-events: auto !important;
      z-index: 2147483646 !important;
    }
  `;
  document.head.appendChild(style);

  let restored = false;
  return () => {
    if (restored) return;
    restored = true;
    style.remove();
    body.removeAttribute("data-razorpay-open");
    if (previousBody.value) {
      body.style.setProperty("pointer-events", previousBody.value, previousBody.priority);
    } else {
      body.style.removeProperty("pointer-events");
    }
    if (previousHtml.value) {
      html.style.setProperty("pointer-events", previousHtml.value, previousHtml.priority);
    } else {
      html.style.removeProperty("pointer-events");
    }
  };
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

  const restoreInteraction = enableRazorpayInteraction();
  const RazorpayCtor = window.Razorpay;

  try {
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
          restoreInteraction();
          try {
            await opts.onSuccess(payment);
            resolve();
          } catch (e) {
            reject(e instanceof Error ? e : new Error("Payment verification failed."));
          }
        },
        modal: {
          escape: true,
          backdropclose: true,
          ondismiss: () => {
            restoreInteraction();
            opts.onDismiss?.();
            reject(new Error("Payment cancelled."));
          },
        },
      });
      rz.open();
    });
  } finally {
    restoreInteraction();
  }
}
