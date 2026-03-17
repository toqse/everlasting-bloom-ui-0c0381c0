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
    console.log("[interestsApi]", method, endpoint, body ?? "");
    if (response) {
      // eslint-disable-next-line no-console
      console.log("[interestsApi] response", response);
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

export interface InterestCard {
  interest_id: number;
  matri_id: string;
  name: string;
  age: number;
  location: string;
  education: string;
  occupation: string;
  profile_photo: string | null;
  status: "pending" | "accepted" | "rejected" | "cancelled";
  created_at: string;
}

export interface InterestsListResponse {
  success: boolean;
  data: {
    total: number;
    results: InterestCard[];
  };
}

export async function getReceivedInterests(page = 1, limit = 10): Promise<InterestsListResponse> {
  const path = `v1/interests/received/?page=${page}&limit=${limit}`;
  return authedFetch<InterestsListResponse>(path, { method: "GET" });
}

export async function getSentInterests(page = 1, limit = 10): Promise<InterestsListResponse> {
  const path = `v1/interests/sent/?page=${page}&limit=${limit}`;
  return authedFetch<InterestsListResponse>(path, { method: "GET" });
}

export async function respondInterest(interestId: number, action: "accept" | "reject"): Promise<{ success: boolean; message: string }> {
  return authedFetch<{ success: boolean; message: string }>("v1/interests/respond/", {
    method: "POST",
    body: JSON.stringify({ interest_id: interestId, action }),
  });
}

export async function cancelInterest(interestId: number): Promise<{ success: boolean; message: string }> {
  return authedFetch<{ success: boolean; message: string }>("v1/interests/cancel/", {
    method: "POST",
    body: JSON.stringify({ interest_id: interestId }),
  });
}

