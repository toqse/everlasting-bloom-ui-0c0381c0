import { BASE_URL } from "./config";
import { useAuthStore } from "@/stores/authStore";

export interface LocationBody {
  country_id: number;
  state_id: number;
  district_id: number;
  city_id: number;
  address: string;
}

export interface ReligionBody {
  religion_id: number;
  caste_id: number | null;
  mother_tongue_id: number;
  partner_preference_type: "own_religion_only" | "open_to_all" | "specific_religions";
  partner_religion_ids: number[];
}

export interface PersonalBody {
  marital_status: string;
  has_children: boolean;
  number_of_children: number | null;
  height: number;
  weight: number | null;
  complexion: string;
}

export interface EducationBody {
  highest_education: string;
  education_subject: string;
  employment: string;
  occupation: string;
  annual_income: string;
}

export interface GenerateAboutResponse {
  success: boolean;
  data: {
    about_me: string;
    suggestions: string[];
  };
}

export interface AboutBody {
  about_me: string;
}

export interface PhotosBody {
  profile_photo?: File;
  full_photo?: File;
  selfie_photo?: File;
  family_photo?: File;
}

type ProfileErrorPayload = {
  detail?: string | string[];
  message?: string;
  error?:
    | string
    | {
        message?: string;
        [key: string]: unknown;
      };
  errors?:
    | string
    | string[]
    | Record<
        string,
        | string
        | string[]
        | {
            message?: string;
          }
      >;
  [key: string]: unknown;
};

const getProfileErrorMessage = (data: ProfileErrorPayload | unknown, fallback: string): string => {
  const payload = (data ?? {}) as ProfileErrorPayload;

  if (typeof payload.detail === "string" && payload.detail.trim()) return payload.detail;
  if (Array.isArray(payload.detail) && payload.detail[0]) return String(payload.detail[0]);

  if (typeof payload.message === "string" && payload.message.trim()) return payload.message;
  if (payload.message && typeof payload.message === "object") {
    const msgObj = payload.message as Record<string, unknown>;
    for (const key of Object.keys(msgObj)) {
      const val = msgObj[key];
      if (typeof val === "string" && val.trim()) return val;
      if (Array.isArray(val) && val[0]) return String(val[0]);
    }
  }

  if (typeof payload.error === "string" && payload.error.trim()) return payload.error;
  if (payload.error && typeof payload.error === "object") {
    const errObj = payload.error as { message?: unknown; detail?: unknown; errors?: unknown };

    if (typeof errObj.message === "string" && errObj.message.trim()) return errObj.message;
    if (errObj.message && typeof errObj.message === "object") {
      const inner = errObj.message as Record<string, unknown>;
      for (const key of Object.keys(inner)) {
        const val = inner[key];
        if (typeof val === "string" && val.trim()) return val;
        if (Array.isArray(val) && val[0]) return String(val[0]);
      }
    }

    if (typeof errObj.detail === "string" && errObj.detail.trim()) return errObj.detail;
    if (Array.isArray(errObj.detail) && errObj.detail[0]) return String(errObj.detail[0]);

    if (typeof errObj.errors === "string" && errObj.errors.trim()) return errObj.errors;
    if (Array.isArray(errObj.errors) && errObj.errors[0]) return String(errObj.errors[0]);
  }

  if (typeof payload.errors === "string" && payload.errors.trim()) return payload.errors;
  if (Array.isArray(payload.errors) && payload.errors[0]) return String(payload.errors[0]);

  if (payload.errors && typeof payload.errors === "object") {
    for (const key of Object.keys(payload.errors)) {
      const val = (payload.errors as Record<string, unknown>)[key];
      if (typeof val === "string" && val.trim()) return val;
      if (Array.isArray(val) && val[0]) return String(val[0]);
      if (val && typeof val === "object" && "message" in (val as { message?: string })) {
        const msg = (val as { message?: string }).message;
        if (msg && msg.trim()) return msg;
      }
    }
  }

  return fallback;
};

async function authedPost<TReq extends object, TRes = unknown>(path: string, body: TReq): Promise<TRes> {
  const url = `${BASE_URL}${path}`;
  const token = useAuthStore.getState().accessToken;
  console.log("[profileApi] request:", { path, body });
  const res = await fetch(url, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      ...(token ? { Authorization: `Bearer ${token}` } : {}),
    },
    body: JSON.stringify(body),
  });
  const data = (await res.json().catch(() => ({}))) as TRes & ProfileErrorPayload;
  console.log("[profileApi] response:", { path, status: res.status, data });
  if (!res.ok) throw new Error(getProfileErrorMessage(data, "Request failed"));
  return data;
}

export async function postLocation(body: LocationBody): Promise<unknown> {
  return authedPost("v1/profile/location/", body);
}

export async function postReligion(body: ReligionBody): Promise<unknown> {
  return authedPost("v1/profile/religion/", body);
}

export async function postPersonal(body: PersonalBody): Promise<unknown> {
  return authedPost("v1/profile/personal/", body);
}

export async function postEducation(body: EducationBody): Promise<unknown> {
  return authedPost("v1/profile/education/", body);
}

export async function getGenerateAbout(): Promise<GenerateAboutResponse> {
  const url = `${BASE_URL}v1/profile/generate-about/`;
  const token = useAuthStore.getState().accessToken;
  console.log("[profileApi] request: GET v1/profile/generate-about/");
  const res = await fetch(url, {
    method: "GET",
    headers: {
      ...(token ? { Authorization: `Bearer ${token}` } : {}),
    },
  });
  const data = (await res.json().catch(() => ({}))) as GenerateAboutResponse & ProfileErrorPayload;
  console.log("[profileApi] response:", { path: "v1/profile/generate-about/", status: res.status, data });
  if (!res.ok) throw new Error(getProfileErrorMessage(data, "Failed to generate about me"));
  return data;
}

export async function postAbout(body: AboutBody): Promise<unknown> {
  return authedPost("v1/profile/about/", body);
}

export async function postPhotos(body: PhotosBody): Promise<unknown> {
  const url = `${BASE_URL}v1/profile/photos/`;
  const token = useAuthStore.getState().accessToken;
  const formData = new FormData();

  if (body.profile_photo) formData.append("profile_photo", body.profile_photo);
  if (body.full_photo) formData.append("full_photo", body.full_photo);
  if (body.selfie_photo) formData.append("selfie_photo", body.selfie_photo);
  if (body.family_photo) formData.append("family_photo", body.family_photo);

  console.log("[profileApi] request: POST v1/profile/photos/", {
    has_profile: !!body.profile_photo,
    has_full: !!body.full_photo,
    has_selfie: !!body.selfie_photo,
    has_family: !!body.family_photo,
  });

  const res = await fetch(url, {
    method: "POST",
    headers: {
      ...(token ? { Authorization: `Bearer ${token}` } : {}),
    },
    body: formData,
  });

  const data = (await res.json().catch(() => ({}))) as ProfileErrorPayload;
  console.log("[profileApi] response:", {
    path: "v1/profile/photos/",
    status: res.status,
    data,
  });

  if (!res.ok) {
    throw new Error(getProfileErrorMessage(data, "Failed to upload photos"));
  }

  return data;
}
