/** Static family type / status choices for profile forms (not loaded from backend). */

export const FAMILY_TYPE_OPTIONS = [
  "Nuclear Family",
  "Joint Family",
  "Extended Family",
] as const;

export const FAMILY_STATUS_OPTIONS = [
  "Lower Class",
  "Lower Middle Class",
  "Middle Class",
  "Upper Middle Class",
  "Affluent",
  "Rich",
  "High Class",
  "Wealthy",
  "Ultra Wealthy",
] as const;

export type FamilyTypeOption = (typeof FAMILY_TYPE_OPTIONS)[number];
export type FamilyStatusOption = (typeof FAMILY_STATUS_OPTIONS)[number];

const FAMILY_TYPE_ALIASES: Record<string, FamilyTypeOption> = {
  Nuclear: "Nuclear Family",
  Joint: "Joint Family",
  Extended: "Extended Family",
};

const FAMILY_STATUS_ALIASES: Record<string, FamilyStatusOption> = {
  "Rich / Affluent": "Affluent",
};

export function normalizeFamilyType(value: unknown): string {
  const text = String(value ?? "").trim();
  if (!text) return "";
  if ((FAMILY_TYPE_OPTIONS as readonly string[]).includes(text)) return text;
  return FAMILY_TYPE_ALIASES[text] ?? "";
}

export function normalizeFamilyStatus(value: unknown): string {
  const text = String(value ?? "").trim();
  if (!text) return "";
  if ((FAMILY_STATUS_OPTIONS as readonly string[]).includes(text)) return text;
  return FAMILY_STATUS_ALIASES[text] ?? "";
}
