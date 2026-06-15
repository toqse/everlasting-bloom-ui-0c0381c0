"use client";

import { useMemo, useState } from "react";
import { Maximize2 } from "lucide-react";
import type { HoroscopeCharts, MatchChartPersonJson } from "@/lib/astrologyApi";
import { Label } from "@/components/ui/label";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import {
  Dialog,
  DialogContent,
  DialogTitle,
} from "@/components/ui/dialog";
import { ml } from "@/lib/malayalam/horoscopeDisplayMl";
import { cn } from "@/lib/utils";
import { SouthIndianChartGrid } from "./SouthIndianChartGrid";
import { chartGridToPlanetsMap } from "./southIndianChartLayout";

export type SelfChartType = "rasi" | "amsa" | "bhava";
export type ChartLang = "en" | "ml";

export const TAB_LABELS: Record<ChartLang, Record<SelfChartType, string>> = {
  en: { rasi: "Rasi", amsa: "Amshakam", bhava: "Bavam" },
  ml: { rasi: ml.rasi, amsa: ml.amsakom, bhava: ml.bhavam },
};

export const CHART_TYPES: SelfChartType[] = ["rasi", "amsa", "bhava"];

export interface SelfHoroscopeChartProps {
  charts: HoroscopeCharts;
  headerLine?: string;
  name?: string;
  dateOfBirth?: string;
  timeOfBirth?: string;
  placeOfBirth?: string;
  className?: string;
  /** Language for rasi cell titles and planet letters inside the grid. Defaults to Malayalam. */
  lang?: ChartLang;
  /** Centre panel language; defaults to {@link lang}. */
  centerLang?: ChartLang;
  /** Rasi / Amsakom / Bhavam tab labels; defaults to {@link lang}. */
  tabLang?: ChartLang;
  /** "radio" (default) keeps the legacy radio group; "tabs" renders a segmented control. */
  variant?: "radio" | "tabs";
  /** When true, shows a "Zoom" control that opens the chart in a larger dialog. */
  enableZoom?: boolean;
}

export function buildPersonForChart(
  charts: HoroscopeCharts,
  chartType: SelfChartType,
  lang: ChartLang,
  meta: {
    name?: string;
    dateOfBirth?: string;
    timeOfBirth?: string;
    placeOfBirth?: string;
  },
): MatchChartPersonJson {
  const grid = charts?.[chartType] ?? null;
  const moon = grid?.planets?.find((p) => p.key === "mo");
  const lagnaSign =
    grid?.lagna_sign != null
      ? (grid.sign_names?.[String(grid.lagna_sign)] ?? "")
      : "";

  return {
    name: meta.name,
    date_of_birth: meta.dateOfBirth,
    time_of_birth: meta.timeOfBirth,
    place_of_birth: meta.placeOfBirth,
    planets: chartGridToPlanetsMap(grid ?? undefined, lang),
    lagna: lagnaSign,
    rasi: moon?.sign_name ?? charts?.rasi?.planets?.find((p) => p.key === "mo")?.sign_name,
    nakshatra: charts?.star?.name,
    nakshatra_pada: charts?.star?.pada,
    dasa_lord: charts?.dasa?.lord,
    dasa_balance: charts?.dasa?.balance_text,
  };
}

export function SelfHoroscopeChart({
  charts,
  headerLine,
  name,
  dateOfBirth,
  timeOfBirth,
  placeOfBirth,
  className,
  lang = "ml",
  centerLang,
  tabLang,
  variant = "radio",
  enableZoom = false,
}: SelfHoroscopeChartProps) {
  const [chartType, setChartType] = useState<SelfChartType>("rasi");
  const [zoomOpen, setZoomOpen] = useState(false);
  const panelLang = centerLang ?? lang;
  const tabsLang = tabLang ?? lang;

  const person = useMemo(
    () =>
      buildPersonForChart(charts, chartType, lang, {
        name,
        dateOfBirth,
        timeOfBirth,
        placeOfBirth,
      }),
    [charts, chartType, lang, name, dateOfBirth, timeOfBirth, placeOfBirth],
  );

  const tabLabels = TAB_LABELS[tabsLang];

  if (variant === "tabs") {
    return (
      <div className={cn("space-y-3 font-ml", className)}>
        <div className="flex items-center gap-1 rounded-xl bg-muted/40 p-1">
          {CHART_TYPES.map((value) => (
            <button
              key={value}
              type="button"
              onClick={() => setChartType(value)}
              className={cn(
                "flex-1 rounded-lg px-2 py-2 text-xs font-semibold transition-colors sm:text-sm",
                chartType === value
                  ? "bg-primary text-primary-foreground shadow-sm"
                  : "text-muted-foreground hover:text-foreground",
              )}
            >
              {tabLabels[value]}
            </button>
          ))}
        </div>

        {enableZoom ? (
          <div className="flex justify-end">
            <button
              type="button"
              onClick={() => setZoomOpen(true)}
              className="inline-flex items-center gap-1.5 text-sm font-semibold text-primary hover:text-primary-dark"
            >
              <Maximize2 className="h-4 w-4" />
              {tabsLang === "ml" ? "സൂം" : "Zoom"}
            </button>
          </div>
        ) : null}

        <SouthIndianChartGrid
          person={person}
          headerLine={headerLine}
          lang={lang}
          centerLang={panelLang}
        />

        {enableZoom ? (
          <Dialog open={zoomOpen} onOpenChange={setZoomOpen}>
            <DialogContent className="max-w-md p-4 sm:p-6">
              <DialogTitle className="text-center text-base text-primary">
                {tabLabels[chartType]}
                {name ? ` · ${name}` : ""}
              </DialogTitle>
              <SouthIndianChartGrid
                person={person}
                headerLine={headerLine}
                lang={lang}
                centerLang={panelLang}
              />
            </DialogContent>
          </Dialog>
        ) : null}
      </div>
    );
  }

  return (
    <div className={cn("space-y-4 font-ml", className)}>
      <SouthIndianChartGrid
        person={person}
        headerLine={headerLine}
        lang={lang}
        centerLang={panelLang}
      />

      <RadioGroup
        value={chartType}
        onValueChange={(v) => setChartType(v as SelfChartType)}
        className="flex flex-row flex-wrap items-center justify-center gap-x-6 gap-y-2 border-y border-primary/10 py-3"
        aria-label={ml.rasi}
      >
        {CHART_TYPES.map((value) => (
          <div key={value} className="flex items-center gap-2">
            <RadioGroupItem value={value} id={`self-chart-${value}`} />
            <Label
              htmlFor={`self-chart-${value}`}
              className="cursor-pointer text-sm font-medium leading-none text-foreground peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
            >
              {tabLabels[value]}
            </Label>
          </div>
        ))}
      </RadioGroup>
    </div>
  );
}
