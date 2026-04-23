import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

/** `trailingSlash: true` in Next can surface a trailing `/` from `usePathname()`. */
export function withoutTrailingSlash(path: string): string {
  if (path.length <= 1) return path;
  return path.endsWith("/") ? path.slice(0, -1) : path;
}

export function isDashboardPath(path: string): boolean {
  const p = withoutTrailingSlash(path);
  return p === "/dashboard" || p.startsWith("/dashboard/");
}

/** True when we should render a real `<img>` — avoids flashing stock demo URLs on refresh. */
export function isUsableProfilePhotoUrl(url: string | null | undefined): boolean {
  const t = typeof url === "string" ? url.trim() : "";
  if (!t) return false;
  if (t.includes("images.unsplash.com")) return false;
  return true;
}
