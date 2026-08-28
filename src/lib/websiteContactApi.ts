import { BASE_URL } from "./config";
import { ApiError, fetchWithTimeout } from "./apiErrors";
import { formatPhoneDisplay } from "./phone";

export const WEBSITE_BRANCHES_V1_PATH = "v1/website/branches/";
export const WEBSITE_ENQUIRIES_V1_PATH = "v1/website/enquiries/";

export type WebsiteBranch = {
  id: number;
  name: string;
  city: string;
  phone: string;
  email: string;
  address: string;
};

type BranchesResponse = {
  success?: boolean;
  data?: WebsiteBranch[];
  error?: { code?: number; message?: string };
};

type EnquiryResponse = {
  success?: boolean;
  data?: { message?: string };
  error?: { code?: number; message?: string };
};

function getErrorMessage(
  data: { error?: { message?: string } },
  fallback: string,
): string {
  if (data.error?.message) return data.error.message;
  return fallback;
}

export async function getWebsiteBranches(): Promise<WebsiteBranch[]> {
  const res = await fetchWithTimeout(`${BASE_URL}${WEBSITE_BRANCHES_V1_PATH}`, {
    method: "GET",
  });
  const data = (await res.json().catch(() => ({}))) as BranchesResponse;
  if (!res.ok || !data.success || !Array.isArray(data.data)) {
    throw new ApiError(
      getErrorMessage(data, "Could not load contact details."),
      res.status,
    );
  }
  return data.data;
}

export async function submitWebsiteEnquiry(body: {
  name: string;
  phone: string;
  email: string;
  subject?: string;
  message: string;
}): Promise<string> {
  const res = await fetchWithTimeout(`${BASE_URL}${WEBSITE_ENQUIRIES_V1_PATH}`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(body),
  });
  const data = (await res.json().catch(() => ({}))) as EnquiryResponse;
  if (!res.ok || !data.success) {
    throw new ApiError(
      getErrorMessage(data, "Could not send your message. Please try again."),
      res.status,
    );
  }
  return data.data?.message ?? "Message sent successfully. We'll get back to you shortly.";
}

export function branchDetailLines(branch: WebsiteBranch): string[] {
  const lines: string[] = [];
  const address = (branch.address || "").trim();
  if (address) {
    lines.push(...address.split(/\r?\n/).map((l) => l.trim()).filter(Boolean));
  }
  const city = (branch.city || "").trim();
  if (city && !lines.some((l) => l.toLowerCase() === city.toLowerCase())) {
    lines.push(city);
  }
  const phone = formatPhoneDisplay(branch.phone);
  if (phone && phone !== "—") lines.push(phone);
  const email = (branch.email || "").trim();
  if (email) lines.push(email);
  return lines;
}
