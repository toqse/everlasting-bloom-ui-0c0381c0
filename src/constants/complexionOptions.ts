/** Canonical complexion values accepted by registration and profile APIs. */
export const VALID_COMPLEXION_OPTIONS = [
  "Very Fair",
  "Fair",
  "Wheatish",
  "Dark",
] as const;

const COMPLEXION_ALIASES: Record<string, string> = {
  white: "Very Fair",
  medium: "Wheatish",
  "medium white": "Wheatish",
  black: "Dark",
  "wheatish brown": "Wheatish",
};

export function isValidComplexionName(name: string): boolean {
  const key = name.trim().toLowerCase();
  return VALID_COMPLEXION_OPTIONS.some((option) => option.toLowerCase() === key);
}

export function normalizeComplexionOption(value: unknown): string {
  const raw = String(value ?? "").trim();
  if (!raw) return "";
  const alias = COMPLEXION_ALIASES[raw.toLowerCase()];
  if (alias) return alias;
  const exact = VALID_COMPLEXION_OPTIONS.find((option) => option.toLowerCase() === raw.toLowerCase());
  return exact ?? "";
}

export function complexionNamesFromMaster(
  items: Array<{ name?: string; is_active?: boolean }>,
): string[] {
  const names = items
    .filter((item) => item.is_active !== false)
    .map((item) => String(item.name ?? "").trim())
    .filter((name) => isValidComplexionName(name));
  return Array.from(new Set(names));
}
