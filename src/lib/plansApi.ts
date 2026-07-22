import { debugLog } from "./debugLog";
import { BASE_URL } from "./config";
import { memberFetchWithAuthRetry } from "@/lib/memberAuthedFetch";

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

function redactSigInUrl(url: string): string {
  return url.replace(/([?&]sig=)([^&]+)/gi, "$1<redacted>");
}

function redactSensitive<T>(value: T): T {
  if (typeof value === "string") return redactSigInUrl(value) as T;
  if (Array.isArray(value)) return value.map((v) => redactSensitive(v)) as T;
  if (value && typeof value === "object") {
    const obj = value as Record<string, unknown>;
    const out: Record<string, unknown> = {};
    for (const [k, v] of Object.entries(obj)) out[k] = redactSensitive(v);
    return out as T;
  }
  return value;
}

function logPlansRequest(path: string, method: string, body: unknown | null) {
  const endpoint = `${BASE_URL}${path}`;
  debugLog("[plansApi] request", redactSensitive({ endpoint, path, method, body }));
}

function logPlansResponse(path: string, method: string, status: number, response: unknown) {
  const endpoint = `${BASE_URL}${path}`;
  debugLog("[plansApi] response", redactSensitive({ endpoint, path, method, status, response }));
}

async function authedFetch<T>(path: string, opts: { method: string; body?: string }): Promise<T> {
  const url = `${BASE_URL}${path}`;

  const bodyParsed: unknown | null =
    opts.body !== undefined ? (JSON.parse(opts.body) as unknown) : null;
  logPlansRequest(path, opts.method, bodyParsed);

  const res = await memberFetchWithAuthRetry(url, {
    method: opts.method,
    headers: { "Content-Type": "application/json" },
    ...(opts.body !== undefined && { body: opts.body }),
  });

  const data = (await res.json().catch(() => ({}))) as T & ApiErrorPayload;
  logPlansResponse(path, opts.method, res.status, data);

  if (!res.ok) throw new Error(getErrorMessage(data, "Request failed"));
  return data as T;
}

/** GET /api/v1/my/plan/ — current subscription & remaining quotas */
export interface MyPlanDetails {
  is_plan_active: boolean;
  plan_name: string | null;
  valid_until: string | null;
  profile_views_remaining: number;
  interests_remaining: number;
  chat_remaining: number;
  contact_view_remaining: number;
  horoscope_remaining: number;
  service_charge?: number;
  plan_price?: number;
  total_price?: number;
  service_charge_remaining: number;
  service_charge_paid: number;
}

/** Align service charge fields when API has price_paid but service_charge_paid=0. */
export function normalizeMyPlanDetails(data: MyPlanDetails): MyPlanDetails {
  if (!data.is_plan_active) return data;
  const serviceCharge = data.service_charge ?? 0;
  const planPrice = data.plan_price ?? 0;
  const paid = data.service_charge_paid ?? 0;
  const effectivePaid = paid > 0 ? paid : planPrice;
  if (effectivePaid <= 0 && (data.service_charge_remaining ?? 0) <= 0) return data;
  return {
    ...data,
    service_charge_paid: effectivePaid,
    service_charge_remaining: Math.max(0, serviceCharge - effectivePaid),
  };
}

export interface MyPlanResponse {
  success: boolean;
  data: MyPlanDetails;
}

export async function getMyPlan(): Promise<MyPlanResponse> {
  const res = await authedFetch<MyPlanResponse>("v1/my/plan/", { method: "GET" });
  return { ...res, data: normalizeMyPlanDetails(res.data) };
}

export type PaymentMethod = "razorpay" | "stripe" | "upi" | "manual";

export type PaymentOption = "plan_only" | "full";

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

export interface PlanOrderResponse {
  success: boolean;
  data: {
    plan_id: number;
    payment_option: PaymentOption;
    amount_inr: number;
    order_id: string;
    amount: number;
    currency: string;
    key_id: string;
  };
}

export interface PlanVerifyResponse {
  success: boolean;
  message: string;
  data: PlanPurchaseResponse["data"] & {
    payment_option?: PaymentOption;
    carry_forward?: Record<string, number>;
  };
}

export async function createPlanOrder(
  planId: number,
  paymentOption: PaymentOption = "plan_only",
): Promise<PlanOrderResponse> {
  return authedFetch<PlanOrderResponse>("v1/plans/order/", {
    method: "POST",
    body: JSON.stringify({ plan_id: planId, payment_option: paymentOption }),
  });
}

export async function verifyPlanPayment(params: {
  planId: number;
  paymentOption: PaymentOption;
  razorpay_order_id: string;
  razorpay_payment_id: string;
  razorpay_signature: string;
}): Promise<PlanVerifyResponse> {
  return authedFetch<PlanVerifyResponse>("v1/plans/verify/", {
    method: "POST",
    body: JSON.stringify({
      plan_id: params.planId,
      payment_option: params.paymentOption,
      razorpay_order_id: params.razorpay_order_id,
      razorpay_payment_id: params.razorpay_payment_id,
      razorpay_signature: params.razorpay_signature,
    }),
  });
}

export interface ServiceChargeOrderResponse {
  success: boolean;
  message?: string;
  data: {
    amount_inr: number;
    order_id?: string;
    amount?: number;
    currency?: string;
    key_id?: string;
    amount_paid?: number;
    service_charge_remaining?: number;
  };
}

export interface ServiceChargeVerifyResponse {
  success: boolean;
  message: string;
  data: {
    transaction_id?: number;
    amount_paid: number;
    service_charge_remaining: number;
  };
}

export async function createServiceChargeOrder(): Promise<ServiceChargeOrderResponse> {
  return authedFetch<ServiceChargeOrderResponse>("v1/plans/pay-remaining-service/order/", {
    method: "POST",
    body: JSON.stringify({}),
  });
}

export async function verifyServiceChargePayment(params: {
  razorpay_order_id: string;
  razorpay_payment_id: string;
  razorpay_signature: string;
}): Promise<ServiceChargeVerifyResponse> {
  return authedFetch<ServiceChargeVerifyResponse>("v1/plans/pay-remaining-service/verify/", {
    method: "POST",
    body: JSON.stringify({
      razorpay_order_id: params.razorpay_order_id,
      razorpay_payment_id: params.razorpay_payment_id,
      razorpay_signature: params.razorpay_signature,
    }),
  });
}

export interface WebsitePlan {
  id: number;
  name: string;
  price: number;
  duration_days: number;
  profile_view_limit: number;
  interest_limit: number;
  chat_limit: number;
  horoscope_match_limit: number;
  contact_view_limit: number;
  description: string;
  service_charge?: {
    male?: number;
    female?: number;
    other?: number;
  };
  total_price?: {
    male?: number;
    female?: number;
    other?: number;
  };
}

export interface WebsitePlansResponse {
  success: boolean;
  data: {
    plans: WebsitePlan[];
  };
}

/** Accepts `{ data: { plans } }`, `{ data: { results } }` (some DRF wrappers), or empty. */
function extractWebsitePlansFromPayload(data: unknown): WebsitePlan[] {
  if (!data || typeof data !== "object") return [];
  const root = data as Record<string, unknown>;
  const inner = root["data"];
  if (!inner || typeof inner !== "object") return [];
  const d = inner as Record<string, unknown>;
  const fromPlans = d["plans"];
  if (Array.isArray(fromPlans) && fromPlans.length) return fromPlans as WebsitePlan[];
  const fromResults = d["results"];
  if (Array.isArray(fromResults) && fromResults.length) return fromResults as WebsitePlan[];
  return [];
}

/** Public endpoint (no token): GET /api/v1/website/plans/ */
export async function getWebsitePlans(): Promise<WebsitePlansResponse> {
  const path = "v1/website/plans/";
  const url = `${BASE_URL}${path}`;
  logPlansRequest(path, "GET", null);
  const res = await fetch(url, { method: "GET" });
  const data = (await res.json().catch(() => ({}))) as WebsitePlansResponse & ApiErrorPayload;
  logPlansResponse(path, "GET", res.status, data);
  if (!res.ok) throw new Error(getErrorMessage(data, "Failed to load website plans"));
  const plans = extractWebsitePlansFromPayload(data);
  return {
    success: Boolean((data as WebsitePlansResponse).success),
    data: { plans },
  };
}

