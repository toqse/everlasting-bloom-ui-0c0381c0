import { debugLog } from "./debugLog";
import { BASE_URL } from "./config";

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

export const WEBSITE_TESTIMONIALS_V1_PATH = "v1/website/testimonials/";

export interface WebsiteTestimonial {
  id: number;
  name: string;
  role: string;
  review: string;
  rating: number;
  avatar: string | null;
  status: string;
  sort_order: number;
  created_at: string;
}

export interface WebsiteTestimonialsListData {
  testimonials: WebsiteTestimonial[];
}

export interface WebsiteTestimonialsResponse {
  success: boolean;
  data: WebsiteTestimonialsListData;
}

function apiOrigin(): string {
  return BASE_URL.replace(/\/api\/?$/, "").replace(/\/$/, "");
}

/** `avatar` may be absolute or relative `/media/...` */
export function resolveTestimonialAvatarUrl(
  avatar: string | null | undefined
): string {
  const s = typeof avatar === "string" ? avatar.trim() : "";
  if (!s) return "";
  if (s.startsWith("http://") || s.startsWith("https://")) return s;
  return `${apiOrigin()}${s.startsWith("/") ? s : `/${s}`}`;
}

/**
 * Public endpoint (no token): GET /api/v1/website/testimonials/
 */
export async function getWebsiteTestimonials(): Promise<WebsiteTestimonialsResponse> {
  const path = WEBSITE_TESTIMONIALS_V1_PATH;
  const url = `${BASE_URL}${path}`;
  debugLog("[testimonialsApi] request", { endpoint: url, path, method: "GET" });

  const res = await fetch(url, { method: "GET" });
  const data = (await res.json().catch(() => ({}))) as WebsiteTestimonialsResponse &
    ApiErrorPayload;
  debugLog("[testimonialsApi] response", { endpoint: url, path, method: "GET", status: res.status, response: data });

  if (!res.ok) {
    throw new Error(getErrorMessage(data, "Failed to load testimonials"));
  }
  if (!data.success || !data.data) {
    throw new Error("Invalid testimonials response");
  }
  return data;
}
