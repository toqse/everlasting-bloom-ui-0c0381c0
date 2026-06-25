import type {
  MatchBlock,
  PoruthamDetailedItem,
  PoruthamMatchData,
} from "@/lib/astrologyApi";

/** Canonical display order — matches the legacy Visual PairMaker EXE list. */
export const PORUTHAM_DISPLAY_ORDER = [
  "rasi",
  "rasyadhip",
  "vasyam",
  "deergaham",
  "dinam",
  "mahendra",
  "ganam",
  "yoni",
  "rajju_dosham",
  "vedham",
  "kuja_dosham",
  "dasa_sandhi",
  "papam_samyom",
] as const;

/** English labels for the EXE-ordered porutham checklist. */
export const PORUTHAM_LABELS_EN: Record<string, string> = {
  rasi: "Rasi",
  rasyadhip: "Rasyadhipam",
  vasyam: "Vasyam",
  deergaham: "Deergham",
  dinam: "Dinam",
  mahendra: "Mahendram",
  ganam: "Ganam",
  yoni: "Yoni",
  rajju_dosham: "Rajju Dosham",
  vedham: "Vedha Dosham",
  kuja_dosham: "Kuja Dosham",
  dasa_sandhi: "Dasa Sandhi",
  papam_samyom: "Papam Samyam",
};

/** API field keys mapped to each canonical display-order slot. */
const ORDER_KEY_TO_API_KEYS: Record<string, string[]> = {
  rasi: ["rasi"],
  rasyadhip: ["rasyadhipam"],
  vasyam: ["vasyam"],
  deergaham: ["sthree_deerga"],
  dinam: ["dinam"],
  mahendra: ["mahendra"],
  ganam: ["ganam"],
  yoni: ["yoni"],
  rajju_dosham: ["rajju_dosham"],
  vedham: ["vedha_dosham"],
  kuja_dosham: ["chovva_dosham"],
  dasa_sandhi: ["dasa_sandhi"],
  papam_samyom: ["papa_samyam"],
};

const GRADE_POINTS: Record<string, number> = {
  uthamam: 1,
  madhyamam: 0.5,
  adhamam: 0,
};

export interface PoruthamMatchDisplayRow {
  key: string;
  orderKey: string;
  points: number;
}

/** Build porutham + dosha rows in EXE order for POST /astrology/porutham/ responses. */
export function poruthamMatchDisplayRows(
  data: PoruthamMatchData,
): PoruthamMatchDisplayRow[] {
  const doshaByKey = new Map<string, boolean>();
  for (const item of data.dosha_checks ?? []) {
    doshaByKey.set(
      normalizePoruthamKey(item.key ?? item.label ?? ""),
      Boolean(item.matched),
    );
  }

  const pointsForApiKey = (apiKey: string): number => {
    const grade = data.grades?.[apiKey]?.toLowerCase();
    if (grade && grade in GRADE_POINTS) return GRADE_POINTS[grade]!;
    return data.poruthams?.[apiKey] ? 1 : 0;
  };

  const rows: PoruthamMatchDisplayRow[] = [];

  for (const orderKey of PORUTHAM_DISPLAY_ORDER) {
    const apiKeys = ORDER_KEY_TO_API_KEYS[orderKey] ?? [orderKey];
    let points: number | null = null;
    let displayKey = apiKeys[0]!;

    for (const apiKey of apiKeys) {
      if (Object.prototype.hasOwnProperty.call(data.poruthams ?? {}, apiKey)) {
        points = pointsForApiKey(apiKey);
        displayKey = apiKey;
        break;
      }
    }

    if (points === null && doshaByKey.has(orderKey)) {
      const matched = doshaByKey.get(orderKey)!;
      points = matched ? 1 : 0;
      displayKey = apiKeys[0]!;
    }

    if (points === null && orderKey === "kuja_dosham" && data.chovva_dosham != null) {
      points = data.chovva_dosham ? 1 : 0;
      displayKey = "chovva_dosham";
    }

    if (points === null) continue;

    rows.push({ key: displayKey, orderKey, points });
  }

  return rows;
}

export function normalizePoruthamKey(raw: string): string {
  const key = raw.trim().toLowerCase().replace(/[\s-]+/g, "_");
  const aliases: Record<string, string> = {
    rasiyadhip: "rasyadhip",
    rasyadhip: "rasyadhip",
    rasyadhipam: "rasyadhip",
    sthree_deerga: "deergaham",
    vedha_dosham: "vedham",
    chovva_dosham: "kuja_dosham",
    rajju: "rajju_dosham",
    reju_dosham: "rajju_dosham",
    rejju_dosham: "rajju_dosham",
    papam_samyam: "papam_samyom",
    papa_samyam: "papam_samyom",
    kuja_alignment: "kuja_dosham",
  };
  return aliases[key] ?? key;
}

function sortPoruthamRows(rows: PoruthamDetailedItem[]): PoruthamDetailedItem[] {
  const order = new Map<string, number>(
    PORUTHAM_DISPLAY_ORDER.map((key, idx) => [key, idx]),
  );
  const resolveOrderKey = (item: PoruthamDetailedItem): string => {
    const candidates = [
      normalizePoruthamKey(item.key ?? ""),
      normalizePoruthamKey(item.label ?? ""),
    ];
    for (const c of candidates) {
      if (order.has(c)) return c;
      if (
        c.includes("rasyadhip") ||
        c.includes("rasyadip") ||
        c.includes("rasiyadhip")
      )
        return "rasyadhip";
      if (c.includes("deerg") || c.includes("deergh")) return "deergaham";
      if (c.includes("dinam") || c === "dina") return "dinam";
      if (c.includes("mahendra")) return "mahendra";
      if (c.includes("ganam") || c.includes("gan")) return "ganam";
      if (c.includes("yoni")) return "yoni";
      if (c.includes("rajju") || c.includes("rejju") || c.includes("reju"))
        return "rajju_dosham";
      if (c.includes("vedham") || c.includes("veda")) return "vedham";
      if (c.includes("kuja")) return "kuja_dosham";
      if (c.includes("dasa") && c.includes("sandhi")) return "dasa_sandhi";
      if (c.includes("papam") && (c.includes("samy") || c.includes("samo")))
        return "papam_samyom";
      if (c === "rasi") return "rasi";
      if (c.includes("vasyam") || c.includes("vashyam")) return "vasyam";
    }
    return "";
  };
  return [...rows].sort((a, b) => {
    const aPos = order.get(resolveOrderKey(a)) ?? 999;
    const bPos = order.get(resolveOrderKey(b)) ?? 999;
    return aPos - bPos;
  });
}

export function poruthamRowsFromMatch(match: MatchBlock): PoruthamDetailedItem[] {
  if (match.poruthams_detailed?.length)
    return sortPoruthamRows(match.poruthams_detailed);
  const p = match.poruthams;
  if (!p || typeof p !== "object") return [];
  const generated = Object.entries(p).map(([key, matched]) => ({
    key,
    label: key.replace(/_/g, " ").replace(/\b\w/g, (c) => c.toUpperCase()),
    matched: Boolean(matched),
    severity: "low",
    is_critical: key === "rajju",
  }));
  return sortPoruthamRows(generated);
}

/** 10 poruthams + Kuja / Dasa Sandhi / Papam Samyom from `match.flags` (PairMaker-style checklist). */
export function extendedPoruthamChecklist(
  match: MatchBlock,
): PoruthamDetailedItem[] {
  const base = poruthamRowsFromMatch(match);
  const withPoints = base.map((item) => ({
    ...item,
    points: match.koota_points?.[item.key] ?? item.points,
  }));
  const f = match.flags;
  if (!f) return withPoints;
  const kujaAligned = f.kuja_dosham_bride === f.kuja_dosham_groom;
  const extra: PoruthamDetailedItem[] = [
    {
      key: "kuja_alignment",
      label: "Kuja Dosham",
      matched: kujaAligned,
      severity: "medium",
      is_critical: false,
      description: "Matched when both charts share the same Kuja pattern",
    },
    {
      key: "dasa_sandhi",
      label: "Dasa Sandhi",
      matched: !f.dasa_sandhi,
      severity: "low",
      is_critical: false,
      description:
        "Favorable when neither side is at a major mahadasha boundary",
    },
    {
      key: "papam_samyam",
      label: "Papam Samyom",
      matched: Boolean(f.papam_samyam_matched),
      severity: "low",
      is_critical: false,
      description: "Kendra malefic alignment between charts",
    },
  ];
  return sortPoruthamRows([...withPoints, ...extra]);
}
