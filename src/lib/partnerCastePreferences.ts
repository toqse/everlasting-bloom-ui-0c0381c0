export type PartnerCasteNameLookup = {
  religionId?: number;
  religionName?: string;
  casteId?: number | null;
  casteName?: string;
  partnerReligionIds?: Array<number | { id?: number; name?: string; religion?: string }>;
  partnerReligionNames?: string[];
  religions?: Array<{ id: number; name?: string }>;
  castes?: Array<{ id: number; name?: string }>;
};

function positiveInt(value: unknown): number | null {
  if (typeof value === "number" && Number.isInteger(value) && value > 0) {
    return value;
  }
  if (typeof value === "string" && /^\d+$/.test(value.trim())) {
    const parsed = Number(value.trim());
    return parsed > 0 ? parsed : null;
  }
  return null;
}

function addNameId(
  map: Map<string, number>,
  name: string | undefined,
  id: number | null | undefined,
) {
  const key = name?.trim().toLowerCase();
  if (!key || id == null || !Number.isFinite(id) || id <= 0) return;
  map.set(key, id);
}

function partnerReligionIdList(
  raw: PartnerCasteNameLookup["partnerReligionIds"],
): number[] {
  return (raw ?? [])
    .map((item) => (typeof item === "number" ? item : (item?.id ?? 0)))
    .filter((id): id is number => Number.isFinite(id) && id > 0);
}

/** Convert GET display maps like {"Hindu": ["BRAHMIN"]} into PATCH ids {"1": [12]}. */
export function toPartnerCastePreferenceIds(
  raw: unknown,
  lookup: PartnerCasteNameLookup = {},
): Record<string, number[]> {
  if (!raw || typeof raw !== "object" || Array.isArray(raw)) return {};

  const religionByName = new Map<string, number>();
  addNameId(religionByName, lookup.religionName, lookup.religionId);
  const partnerIds = partnerReligionIdList(lookup.partnerReligionIds);
  const partnerNames = lookup.partnerReligionNames ?? [];
  for (let i = 0; i < Math.min(partnerIds.length, partnerNames.length); i += 1) {
    addNameId(religionByName, partnerNames[i], partnerIds[i]);
  }
  for (const religion of lookup.religions ?? []) {
    addNameId(religionByName, religion.name, religion.id);
  }

  const casteByName = new Map<string, number>();
  addNameId(casteByName, lookup.casteName, lookup.casteId);
  for (const caste of lookup.castes ?? []) {
    addNameId(casteByName, caste.name, caste.id);
  }

  const out: Record<string, number[]> = {};
  for (const [key, value] of Object.entries(raw as Record<string, unknown>)) {
    if (!Array.isArray(value)) continue;
    const religionId =
      positiveInt(key) ?? religionByName.get(key.trim().toLowerCase()) ?? null;
    if (religionId == null) continue;
    const casteIds: number[] = [];
    for (const item of value) {
      const casteId =
        positiveInt(item) ??
        (typeof item === "string"
          ? (casteByName.get(item.trim().toLowerCase()) ?? null)
          : null);
      if (casteId != null) casteIds.push(casteId);
    }
    if (!casteIds.length) continue;
    const mapKey = String(religionId);
    out[mapKey] = [...new Set([...(out[mapKey] ?? []), ...casteIds])];
  }
  return out;
}

export function partnerCastePreferencesEqual(
  a: Record<string, number[]> | undefined,
  b: Record<string, number[]>,
): boolean {
  const left = a ?? {};
  const leftKeys = Object.keys(left);
  const rightKeys = Object.keys(b);
  if (leftKeys.length !== rightKeys.length) return false;
  return leftKeys.every((key) => {
    const leftIds = left[key] ?? [];
    const rightIds = b[key] ?? [];
    if (leftIds.length !== rightIds.length) return false;
    return leftIds.every((id, index) => id === rightIds[index]);
  });
}
