import { BASE_URL } from "./config";

type ApiErrorPayload = {
  detail?: string | string[];
  message?: string;
  error?: string | { message?: string } | { [key: string]: unknown };
  errors?: string | string[];
  [key: string]: unknown;
};

const getErrorMessage = (
  data: ApiErrorPayload | unknown,
  fallback: string,
): string => {
  const payload = (data ?? {}) as ApiErrorPayload;

  if (typeof payload.detail === "string" && payload.detail.trim())
    return payload.detail;
  if (Array.isArray(payload.detail) && payload.detail[0])
    return String(payload.detail[0]);

  if (typeof payload.message === "string" && payload.message.trim())
    return payload.message;

  if (typeof payload.error === "string" && payload.error.trim())
    return payload.error;
  if (
    payload.error &&
    typeof payload.error === "object" &&
    "message" in payload.error
  ) {
    const msg = (payload.error as { message?: string }).message;
    if (msg && msg.trim()) return msg;
  }

  if (typeof payload.errors === "string" && payload.errors.trim())
    return payload.errors;
  if (Array.isArray(payload.errors) && payload.errors[0])
    return String(payload.errors[0]);

  return fallback;
};

/** POST v1/auth/register/ — sends OTP after basic details */
export type RegisterProfileFor =
  | "myself"
  | "son"
  | "daughter"
  | "brother"
  | "sister"
  | "friend"
  | "relative";

export interface RegisterBody {
  name: string;
  phone_number: string;
  /** Omit or leave empty — not sent if blank */
  email?: string;
  dob: string; // DD-MM-YYYY
  gender: "M" | "F" | "O";
  /** Who the profile is for; always sent lowercase to API */
  profile_for?: RegisterProfileFor;
}

const REGISTER_PROFILE_FOR_VALUES: readonly RegisterProfileFor[] = [
  "myself",
  "son",
  "daughter",
  "brother",
  "sister",
  "friend",
  "relative",
] as const;

/** Normalize UI value to API `profile_for` (lowercase). */
export function normalizeRegisterProfileFor(
  s: string,
): RegisterProfileFor | undefined {
  const raw = s.toLowerCase().trim();
  return (REGISTER_PROFILE_FOR_VALUES as readonly string[]).includes(raw)
    ? (raw as RegisterProfileFor)
    : undefined;
}

function buildRegisterPayload(body: RegisterBody): Record<string, unknown> {
  const payload: Record<string, unknown> = {
    name: body.name.trim(),
    phone_number: body.phone_number.trim(),
    dob: body.dob.trim(),
    gender: body.gender,
  };
  const email = typeof body.email === "string" ? body.email.trim() : "";
  if (email) payload.email = email;
  const pf =
    typeof body.profile_for === "string"
      ? normalizeRegisterProfileFor(body.profile_for)
      : body.profile_for;
  if (pf) payload.profile_for = pf;
  return payload;
}

export async function register(body: RegisterBody): Promise<unknown> {
  const url = `${BASE_URL}v1/auth/register/`;
  const payload = buildRegisterPayload(body);
  console.log("[authApi] register request body:", payload);
  const res = await fetch(url, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(payload),
  });
  const data = await res.json().catch(() => ({}));
  console.log("[authApi] register response:", { status: res.status, data });
  if (!res.ok) throw new Error(getErrorMessage(data, "Registration failed"));
  return data;
}

/** POST v1/auth/verify-otp/ — verify OTP after registration */
export interface VerifyOtpBody {
  mobile: string;
  otp: string;
}

export interface VerifyOtpResponse {
  success?: boolean;
  data?: VerifyMobileData;
}

export async function verifyOtp(
  body: VerifyOtpBody,
): Promise<VerifyOtpResponse> {
  const url = `${BASE_URL}v1/auth/verify-otp/`;
  console.log("[authApi] verifyOtp request body:", body);
  const res = await fetch(url, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(body),
  });
  const data = (await res.json().catch(() => ({}))) as VerifyOtpResponse;
  console.log("[authApi] verifyOtp response:", { status: res.status, data });
  if (!res.ok)
    throw new Error(getErrorMessage(data, "OTP verification failed"));
  return data;
}

export interface RegisterMobileBody {
  mobile: string;
}

export interface VerifyMobileBody {
  mobile: string;
  otp: string;
}

export interface VerifyMobileProfile {
  id?: string;
  matri_id?: string;
  basic_details?: {
    name?: string;
    gender?: string;
    dob?: string;
    email?: string;
    phone?: string;
  };
  location_details?: {
    country_id?: number;
    country?: string;
    state_id?: number;
    state?: string;
    district_id?: number;
    district?: string;
    city_id?: number;
    city?: string;
    address?: string;
  };
  religion_details?: Record<string, unknown> & {
    religion_id?: number;
    religion?: string;
    caste_id?: number;
    caste?: string;
    mother_tongue_id?: number;
    mother_tongue?: string;
  };
  personal_details?: Record<string, unknown> & {
    marital_status?: string;
    height?: number;
    weight?: number;
    complexion?: string;
  };
  education_details?: Record<string, unknown> & {
    highest_education?: string;
    education_subject?: string;
    employment?: string;
    occupation?: string;
    annual_income?: string;
  };
  about_me?: string;
  photos?: Record<string, unknown>;
}

export interface VerifyMobileData {
  access_token: string;
  refresh_token: string;
  matri_id: string;
  is_registered: boolean;
  is_registration_profile_completed: boolean;
  profile_status: string;
  profile_steps: Record<string, boolean>;
  profile_completion_percentage: number;
  next_step: string | null;
  profile?: VerifyMobileProfile;
}

export interface VerifyMobileResponse {
  success: boolean;
  data: VerifyMobileData;
}

/** POST v1/auth/register/mobile/ — send OTP to mobile */
export async function registerMobile(
  body: RegisterMobileBody,
): Promise<unknown> {
  const url = `${BASE_URL}v1/auth/register/mobile/`;
  console.log("[authApi] registerMobile request body:", body);
  const res = await fetch(url, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(body),
  });
  const data = await res.json().catch(() => ({}));
  console.log("[authApi] registerMobile response:", {
    status: res.status,
    data,
  });
  if (!res.ok) throw new Error(getErrorMessage(data, "Failed to send OTP"));
  return data;
}

/** POST v1/auth/verify/mobile/ — verify OTP and get tokens */
export async function verifyMobile(
  body: VerifyMobileBody,
): Promise<VerifyMobileResponse> {
  const url = `${BASE_URL}v1/auth/verify/mobile/`;
  console.log("[authApi] verifyMobile request body:", body);
  const res = await fetch(url, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(body),
  });
  const data = (await res.json().catch(() => ({}))) as VerifyMobileResponse;
  console.log("[authApi] verifyMobile response:", { status: res.status, data });
  if (!res.ok) throw new Error(getErrorMessage(data, "Failed to verify OTP"));
  return data;
}
