import { debugLog } from "./debugLog";
import { BASE_URL } from "./config";
import { GENERIC_ERROR_MESSAGE } from "@/lib/apiErrors";
import { memberFetchWithAuthRetry } from "@/lib/memberAuthedFetch";
import { useAuthStore } from "@/stores/authStore";

function authHeaders(): HeadersInit {
  const token = useAuthStore.getState().accessToken;
  return {
    "Content-Type": "application/json",
    ...(token ? { Authorization: `Bearer ${token}` } : {}),
  };
}

function v1(path: string): string {
  return `${BASE_URL}v1/${path}`;
}

async function request<T>(
  url: string,
  options: RequestInit & { _body?: unknown } = {}
): Promise<T> {
  const { _body, ...fetchOptions } = options;

  debugLog("[profileReportsApi] URL:", url);
  if (_body !== undefined) debugLog("[profileReportsApi] Body:", _body);

  const res = await memberFetchWithAuthRetry(url, fetchOptions);
  const json = await res.json().catch(() => null);

  debugLog("[profileReportsApi] Response:", json);

  if (!json || typeof json !== "object") {
    throw new Error(GENERIC_ERROR_MESSAGE);
  }

  if (!res.ok || json.success === false) {
    const msg =
      json?.error?.message ||
      json?.message ||
      `Request failed (${res.status})`;
    throw new Error(msg);
  }
  return json.data as T;
}

export interface ReportUserResult {
  id: number;
  matri_id: string;
  status: string;
}

/** POST /api/v1/profile-reports/ */
export async function reportUser(
  matriId: string,
  message: string
): Promise<ReportUserResult> {
  const body = { matri_id: matriId, message };
  return request<ReportUserResult>(v1("profile-reports/"), {
    method: "POST",
    headers: authHeaders(),
    body: JSON.stringify(body),
    _body: body,
  });
}
