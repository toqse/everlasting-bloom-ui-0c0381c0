"use client";

import { useMemo, useState } from "react";
import type { HoroscopeCharts, MatchChartPersonJson } from "@/lib/astrologyApi";
import { Label } from "@/components/ui/label";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { ml } from "@/lib/malayalam/horoscopeDisplayMl";
import { cn } from "@/lib/utils";
import { SouthIndianChartGrid } from "./SouthIndianChartGrid";
import { chartGridToPlanetsMap } from "./southIndianChartLayout";

type SelfChartType = "rasi" | "amsa" | "bhava";

const CHART_MODE_OPTIONS: { value: SelfChartType; label: string }[] = [
  { value: "rasi", label: ml.rasi },
  { value: "amsa", label: ml.amsakom },
  { value: "bhava", label: ml.bhavam },
];

export interface SelfHoroscopeChartProps {
  charts: HoroscopeCharts;
  headerLine?: string;
  name?: string;
  dateOfBirth?: string;
  timeOfBirth?: string;
  placeOfBirth?: string;
  className?: string;
}

function buildPersonForChart(
  charts: HoroscopeCharts,
  chartType: SelfChartType,
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
    planets: chartGridToPlanetsMap(grid ?? undefined),
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
}: SelfHoroscopeChartProps) {
  const [chartType, setChartType] = useState<SelfChartType>("rasi");

  const person = useMemo(
    () =>
      buildPersonForChart(charts, chartType, {
        name,
        dateOfBirth,
        timeOfBirth,
        placeOfBirth,
      }),
    [charts, chartType, name, dateOfBirth, timeOfBirth, placeOfBirth],
  );

  return (
    <div className={cn("space-y-4 font-ml", className)}>
      <SouthIndianChartGrid person={person} headerLine={headerLine} />

      <RadioGroup
        value={chartType}
        onValueChange={(v) => setChartType(v as SelfChartType)}
        className="flex flex-row flex-wrap items-center justify-center gap-x-6 gap-y-2 border-y border-primary/10 py-3"
        aria-label={ml.rasi}
      >
        {CHART_MODE_OPTIONS.map((opt) => (
          <div key={opt.value} className="flex items-center gap-2">
            <RadioGroupItem value={opt.value} id={`self-chart-${opt.value}`} />
            <Label
              htmlFor={`self-chart-${opt.value}`}
              className="cursor-pointer text-sm font-medium leading-none text-foreground peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
            >
              {opt.label}
            </Label>
          </div>
        ))}
      </RadioGroup>
    </div>
  );
}
