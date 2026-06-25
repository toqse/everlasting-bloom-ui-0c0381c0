import { BASE_URL } from "./config";
import { ApiError, fetchWithTimeout } from "./apiErrors";

export const WEBSITE_NEWSLETTER_SUBSCRIBE_PATH = "v1/website/newsletter/subscribe/";

type SubscribeResponse = {
  success: boolean;
  data?: { message?: string };
  error?: { code?: number; message?: string };
};

function getErrorMessage(data: SubscribeResponse, fallback: string): string {
  if (data.error?.message) return data.error.message;
  return fallback;
}

export async function subscribeNewsletter(email: string): Promise<string> {
  const res = await fetchWithTimeout(`${BASE_URL}${WEBSITE_NEWSLETTER_SUBSCRIBE_PATH}`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ email: email.trim(), source: "footer" }),
  });
  const data = (await res.json().catch(() => ({}))) as SubscribeResponse;
  if (!res.ok || !data.success) {
    throw new ApiError(
      getErrorMessage(data, "Could not subscribe. Please try again."),
      res.status,
    );
  }
  return data.data?.message ?? "Subscribed successfully.";
}
