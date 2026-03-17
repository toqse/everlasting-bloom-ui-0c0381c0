import { BASE_URL } from "./config";
import { useAuthStore } from "@/stores/authStore";

type ApiErrorPayload = {
  success?: boolean;
  error?: { code?: number; message?: string; details?: unknown };
  detail?: string | string[];
  message?: string;
  [key: string]: unknown;
};

const getErrorMessage = (data: ApiErrorPayload | unknown, fallback: string): string => {
  const payload = (data ?? {}) as ApiErrorPayload;
  if (payload.error?.message) return payload.error.message;
  if (typeof payload.message === "string" && payload.message.trim()) return payload.message;
  if (typeof payload.detail === "string" && payload.detail.trim()) return payload.detail;
  if (Array.isArray(payload.detail) && payload.detail[0]) return String(payload.detail[0]);
  return fallback;
};

const logApi = (endpoint: string, method: string, body?: unknown, response?: { status: number; data: unknown }) => {
  try {
    // eslint-disable-next-line no-console
    console.log("[plansApi]", method, endpoint, body ?? "");
    if (response) {
      // eslint-disable-next-line no-console
      console.log("[plansApi] response", response);
    }
  } catch {
    // ignore
  }
};

async function authedFetch<T>(path: string, opts: { method: string; body?: string }): Promise<T> {
  const url = `${BASE_URL}${path}`;
  const token = useAuthStore.getState().accessToken;

  logApi(path, opts.method, opts.body ? JSON.parse(opts.body) : undefined);

  const res = await fetch(url, {
    method: opts.method,
    headers: {
      "Content-Type": "application/json",
      ...(token ? { Authorization: `Bearer ${token}` } : {}),
    },
    ...(opts.body !== undefined && { body: opts.body }),
  });

  const data = (await res.json().catch(() => ({}))) as T & ApiErrorPayload;
  logApi(path, opts.method, undefined, { status: res.status, data });

  if (!res.ok) throw new Error(getErrorMessage(data, "Request failed"));
  return data as T;
}

export type PaymentMethod = "razorpay" | "stripe" | "upi" | "manual";

export interface AvailablePlan {
  id: number;
  name: string;
  price: number;
  service_charge: number;
  total_price: number;
  first_payment: number;
  service_charge_remaining: number;
  duration_days: number;
  profile_view_limit: number;
  interest_limit: number;
  chat_limit: number;
  horoscope_match_limit: number;
  contact_view_limit: number;
  description: string;
}

export interface PlansListResponse {
  success: boolean;
  data: {
    gender: string;
    plans: AvailablePlan[];
  };
}

export interface PlanPurchaseResponse {
  success: boolean;
  message: string;
  data: {
    transaction_id: number;
    plan_name: string;
    valid_until: string;
    amount_paid: number;
    total_amount: number;
    service_charge_remaining: number;
  };
}

export async function getAvailablePlans(): Promise<PlansListResponse> {
  return authedFetch<PlansListResponse>("v1/plans/", { method: "GET" });
}

export async function purchasePlan(planId: number, paymentMethod: PaymentMethod): Promise<PlanPurchaseResponse> {
  return authedFetch<PlanPurchaseResponse>("v1/plans/purchase/", {
    method: "POST",
    body: JSON.stringify({ plan_id: planId, payment_method: paymentMethod }),
  });
}

