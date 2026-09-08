import { debugLog } from "./debugLog";
import { BASE_URL } from "./config";
import { GENERIC_ERROR_MESSAGE } from "@/lib/apiErrors";
import { memberFetchWithAuthRetry } from "@/lib/memberAuthedFetch";
import { useAuthStore } from "@/stores/authStore";
import type { MatchProfile } from "./matchesApi";

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

  debugLog("[blocksApi] URL:", url);
  if (_body !== undefined) debugLog("[blocksApi] Body:", _body);

  const res = await memberFetchWithAuthRetry(url, fetchOptions);
  const json = await res.json().catch(() => null);

  debugLog("[blocksApi] Response:", json);

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

export interface BlockActionResult {
  matri_id: string;
  is_blocked: boolean;
}

export interface BlockedListData {
  total: number;
  page: number;
  page_size: number;
  limit: number;
  profiles: MatchProfile[];
}

/** POST /api/v1/blocks/ */
export async function blockUser(matriId: string): Promise<BlockActionResult> {
  const body = { matri_id: matriId };
  return request<BlockActionResult>(v1("blocks/"), {
    method: "POST",
    headers: authHeaders(),
    body: JSON.stringify(body),
    _body: body,
  });
}

/** DELETE /api/v1/blocks/ */
export async function unblockUser(matriId: string): Promise<BlockActionResult> {
  const body = { matri_id: matriId };
  return request<BlockActionResult>(v1("blocks/"), {
    method: "DELETE",
    headers: authHeaders(),
    body: JSON.stringify(body),
    _body: body,
  });
}

/** GET /api/v1/blocks/ */
export async function getBlockedList(params?: {
  page?: number;
  limit?: number;
}): Promise<{ data: BlockedListData }> {
  const page = params?.page ?? 1;
  const limit = params?.limit ?? 10;
  const qs = new URLSearchParams({
    page: String(page),
    limit: String(limit),
  });
  const data = await request<BlockedListData>(
    `${v1("blocks/")}?${qs.toString()}`,
    { headers: authHeaders() }
  );
  return { data };
}
