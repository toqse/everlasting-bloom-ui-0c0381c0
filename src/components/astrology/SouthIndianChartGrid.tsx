"use client";

import { cn, formatDateDdMmYyyy, formatTimeOfBirthDisplay } from "@/lib/utils";
import {
  dasaDurationMalayalam,
  grahaNameMalayalam,
  ml,
  nakshatraNameMalayalam,
  rasiNameMalayalam,
} from "@/lib/malayalam/horoscopeDisplayMl";
import type { MatchChartPersonJson } from "@/lib/astrologyApi";
import {
  normalizeChartPlanetsMap,
  resolveChartRasiKey,
  SOUTH_INDIAN_CELL_RC,
  SOUTH_INDIAN_GRID_SIGNS,
} from "./southIndianChartLayout";

export type ChartGridLang = "en" | "ml";

/** Canonical grid key → Kerala English (romanized) rasi name, matching the rest of the English UI. */
const RASI_EN_DISPLAY: Record<string, string> = {
  Meena: "Meenam",
  Mesha: "Medam",
  Vrishabha: "Edavam",
  Mithuna: "Midhunam",
  Karka: "Karkadakam",
  Simha: "Chingam",
  Kanya: "Kanni",
  Tula: "Thulam",
  Vrishchika: "Vrischikam",
  Dhanus: "Dhanu",
  Makara: "Makaram",
  Kumbha: "Kumbham",
};

/** Center-panel labels per language. Malayalam values mirror {@link ml}. */
const GRID_LABELS = {
  en: {
    lagna: "Lagna",
    dob: "DOB",
    tob: "Time",
    pob: "Place",
    dasaLord: "Lord",
    dasa: "Dasa",
    rasiShort: "Rasi",
    padaLabel: (n: number) => `Pada ${n}`,
  },
  ml: {
    lagna: ml.lagna,
    dob: ml.dob,
    tob: ml.tob,
    pob: ml.pob,
    dasaLord: ml.dasaLord,
    dasa: ml.dasa,
    rasiShort: ml.rasiShort,
    padaLabel: ml.padaLabel,
  },
} as const;

/** Localized rasi name for a canonical grid key. */
function rasiName(sign: string, lang: ChartGridLang): string {
  if (lang === "en") return RASI_EN_DISPLAY[sign] ?? sign;
  return rasiNameMalayalam(sign);
}

export interface SouthIndianChartGridProps {
  person: MatchChartPersonJson;
  /** e.g. matri id + Bride/Groom */
  headerLine?: string;
  className?: string;
  /** Language for the 12 rasi cells (sign titles + planet letters). Defaults to Malayalam. */
  lang?: ChartGridLang;
  /** Language for the merged centre panel; defaults to {@link lang}. */
  centerLang?: ChartGridLang;
}

export function SouthIndianChartGrid({
  person,
  headerLine,
  className,
  lang = "ml",
  centerLang,
}: SouthIndianChartGridProps) {
  const planets = normalizeChartPlanetsMap(person.planets);
  const lagnaSign = person.lagna ? resolveChartRasiKey(person.lagna) : null;
  const panelLang = centerLang ?? lang;
  const L = GRID_LABELS[panelLang];

  return (
    <div className={cn("flex flex-col gap-2 font-ml", className)}>
      {headerLine ? (
        <p className="text-center text-xs font-mono text-muted-foreground truncate px-1">
          {headerLine}
        </p>
      ) : null}
      <div className="w-full aspect-square">
        <div
          className="grid h-full w-full grid-cols-4 grid-rows-4 gap-px border border-border bg-border"
          style={{ gridTemplateColumns: "repeat(4, 1fr)", gridTemplateRows: "repeat(4, 1fr)" }}
        >
          {SOUTH_INDIAN_GRID_SIGNS.map((sign, i) => {
            const rc = SOUTH_INDIAN_CELL_RC[i];
            const bodies = planets[sign] ?? [];
            const isLagna = lagnaSign != null && sign === lagnaSign;
            return (
              <div
                key={sign}
                className={cn(
                  "flex min-h-0 min-w-0 flex-col p-1 sm:p-1.5",
                  isLagna
                    ? "bg-muted ring-1 ring-inset ring-foreground/40"
                    : "bg-card",
                )}
                style={{ gridRow: rc.row, gridColumn: rc.col }}
                title={isLagna ? L.lagna : undefined}
              >
                <span className="text-[10px] sm:text-xs font-semibold tracking-tight leading-none truncate text-muted-foreground">
                  {rasiName(sign, lang)}
                </span>
                <div className="mt-0.5 flex min-h-0 flex-1 flex-col gap-0.5 overflow-hidden">
                  {bodies.length === 0 ? null : (
                    bodies.map((label, bi) => (
                      <span
                        key={`${sign}-${bi}-${label}`}
                        className="text-[11px] sm:text-sm font-semibold leading-tight text-foreground truncate"
                        title={label}
                      >
                        {label}
                      </span>
                    ))
                  )}
                </div>
              </div>
            );
          })}

          <div
            className="flex flex-col items-center justify-center gap-0.5 bg-card px-1 py-1 text-center"
            style={{ gridRow: "2 / 4", gridColumn: "2 / 4" }}
          >
            <p className="text-xs sm:text-sm font-semibold text-primary leading-tight line-clamp-2">
              {person.name?.trim() || "—"}
            </p>
            {person.date_of_birth?.trim() ? (
              <p className="text-[10px] sm:text-xs text-primary/80 leading-tight">
                {L.dob}: {formatDateDdMmYyyy(person.date_of_birth)}
              </p>
            ) : null}
            {person.time_of_birth?.trim() ? (
              <p className="text-[10px] sm:text-xs text-primary/80 leading-tight">
                {L.tob}: {formatTimeOfBirthDisplay(person.time_of_birth)}
              </p>
            ) : null}
            {person.place_of_birth?.trim() ? (
              <p className="text-[10px] sm:text-xs text-primary/80 leading-tight line-clamp-2">
                {L.pob}: {person.place_of_birth.trim()}
              </p>
            ) : null}
            {person.nakshatra ? (
              <p className="text-[10px] sm:text-xs text-primary/80 leading-tight">
                {panelLang === "en"
                  ? person.nakshatra
                  : nakshatraNameMalayalam(person.nakshatra)}
                {person.nakshatra_pada != null
                  ? ` · ${L.padaLabel(person.nakshatra_pada)}`
                  : ""}
              </p>
            ) : null}
            {person.dasa_balance || person.dasa_lord ? (
              <p className="text-[10px] sm:text-xs text-primary leading-tight">
                {person.dasa_lord ? (
                  <span className="font-medium">
                    {L.dasaLord}:{" "}
                    {panelLang === "en"
                      ? person.dasa_lord
                      : grahaNameMalayalam(person.dasa_lord)}
                  </span>
                ) : null}
                {person.dasa_balance ? (
                  <span className="block text-primary/80">
                    {L.dasa}:{" "}
                    {panelLang === "en"
                      ? person.dasa_balance
                      : dasaDurationMalayalam(person.dasa_balance)}
                  </span>
                ) : null}
              </p>
            ) : null}
            {(person.lagna || person.rasi) && (
              <p className="text-[10px] sm:text-xs text-primary/80 leading-tight">
                {[
                  person.lagna
                    ? `${L.lagna}: ${
                        panelLang === "en"
                          ? person.lagna
                          : rasiNameMalayalam(person.lagna)
                      }`
                    : null,
                  person.rasi
                    ? `${L.rasiShort}: ${
                        panelLang === "en"
                          ? person.rasi
                          : rasiNameMalayalam(person.rasi)
                      }`
                    : null,
                ]
                  .filter(Boolean)
                  .join(" · ")}
              </p>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
