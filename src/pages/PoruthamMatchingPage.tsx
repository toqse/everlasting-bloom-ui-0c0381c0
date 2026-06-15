"use client";

import { Suspense, useEffect, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import {
  Check,
  Download,
  Equal,
  ListChecks,
  Loader2,
  X,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  buildPersonForChart,
  CHART_TYPES,
  SelfHoroscopeChart,
  TAB_LABELS,
  type ChartLang,
  type SelfChartType,
} from "@/components/astrology/SelfHoroscopeChart";
import { SouthIndianChartGrid } from "@/components/astrology/SouthIndianChartGrid";
import {
  getMatchReportPdf,
  postPoruthamMatch,
  type PoruthamGrahanilaPerson,
  type PoruthamMatchData,
} from "@/lib/astrologyApi";
import {
  dasaDurationMalayalam,
  grahaNameMalayalam,
  nakshatraNameMalayalam,
  poruthamRowLabelMalayalam,
  rasiNameMalayalam,
} from "@/lib/malayalam/horoscopeDisplayMl";
import { BASE_URL } from "@/lib/config";
import { useAuthStore } from "@/stores/authStore";
import { cn } from "@/lib/utils";
import { getDisplayErrorMessage } from "@/lib/apiErrors";
import { toast } from "sonner";

/** Display order for the 10 poruthams returned by POST /astrology/porutham/ */
const PORUTHAM_KEYS = [
  "dinam",
  "ganam",
  "mahendra",
  "sthree_deerga",
  "yoni",
  "rasi",
  "rasyadhipam",
  "vasyam",
  "rajju_dosham",
  "vedha_dosham",
] as const;

const PORUTHAM_LABELS_EN: Record<string, string> = {
  dinam: "Dinam",
  ganam: "Ganam",
  mahendra: "Mahendram",
  sthree_deerga: "Sthree Deergham",
  yoni: "Yoni",
  rasi: "Rasi",
  rasyadhipam: "Rasyadhipathi",
  vasyam: "Vasyam",
  rajju_dosham: "Rajju",
  vedha_dosham: "Vedha",
};

/** Page chrome (cards, headers, detail boxes) stays English regardless of toggle. */
const PAGE_COPY = {
  bride: "Bride",
  groom: "Groom",
  overall: "Overall Match",
  poruthamDetails: "Porutham Details",
  loading: "Loading chart…",
  chartNotAvailable: "Chart not available",
  matchedSummary: (s: number, m: number) => `${s} out of ${m} poruthams matched`,
} as const;

const DETAIL_LABELS = {
  nakshatra: "Nakshatra",
  padam: "Padam",
  rasi: "Rasi",
  lagnam: "Lagnam",
  dasa: "Dasa",
  lord: "Lord",
} as const;

/** Bride/groom birth-detail rows shown alongside (not inside) the chart. */
function personDetailRows(
  h: PoruthamGrahanilaPerson["horoscope"],
  lang: ChartLang,
): { label: string; value: string }[] {
  const isMl = lang === "ml";
  return [
    {
      label: DETAIL_LABELS.nakshatra,
      value: h?.star_display
        ? isMl
          ? nakshatraNameMalayalam(h.star_display)
          : h.star_display
        : "—",
    },
    {
      label: DETAIL_LABELS.padam,
      value: h?.pr_pada != null ? String(h.pr_pada) : "—",
    },
    {
      label: DETAIL_LABELS.rasi,
      value: h?.rasi_display
        ? isMl
          ? rasiNameMalayalam(h.rasi_display)
          : h.rasi_display
        : "—",
    },
    {
      label: DETAIL_LABELS.lagnam,
      value: h?.lagnam_display
        ? isMl
          ? rasiNameMalayalam(h.lagnam_display)
          : h.lagnam_display
        : "—",
    },
    {
      label: DETAIL_LABELS.dasa,
      value: h?.dasa_display
        ? isMl
          ? dasaDurationMalayalam(h.dasa_display)
          : h.dasa_display
        : "—",
    },
    {
      label: DETAIL_LABELS.lord,
      value: h?.dasa_lord
        ? isMl
          ? grahaNameMalayalam(h.dasa_lord)
          : h.dasa_lord
        : "—",
    },
  ];
}

const GRADE_POINTS: Record<string, number> = {
  uthamam: 1,
  madhyamam: 0.5,
  adhamam: 0,
};

function poruthamPoints(key: string, data: PoruthamMatchData): number {
  const grade = data.grades?.[key]?.toLowerCase();
  if (grade && grade in GRADE_POINTS) return GRADE_POINTS[grade];
  return data.poruthams?.[key] ? 1 : 0;
}

function resolveMediaUrl(raw?: string | null): string {
  const t = (raw ?? "").trim();
  if (!t) return "";
  if (/^https?:\/\//i.test(t)) return t;
  const base = BASE_URL.replace(/\/api\/?$/i, "").replace(/\/$/, "");
  return `${base}${t.startsWith("/") ? "" : "/"}${t}`;
}

function initialsOf(name?: string): string {
  return (name ?? "")
    .split(" ")
    .map((n) => n[0])
    .filter(Boolean)
    .join("")
    .slice(0, 2)
    .toUpperCase();
}

function LanguageToggle({
  lang,
  onChange,
}: {
  lang: ChartLang;
  onChange: (lang: ChartLang) => void;
}) {
  return (
    <div className="inline-flex shrink-0 rounded-full border border-primary/20 bg-muted/40 p-0.5 text-xs font-semibold font-ml">
      {(["en", "ml"] as ChartLang[]).map((value) => (
        <button
          key={value}
          type="button"
          onClick={() => onChange(value)}
          className={cn(
            "rounded-full px-3 py-1 transition-colors",
            lang === value
              ? "bg-primary text-primary-foreground"
              : "text-muted-foreground hover:text-foreground",
          )}
        >
          {value === "en" ? "English" : "മലയാളം"}
        </button>
      ))}
    </div>
  );
}

function MatchResultCard({ data }: { data: PoruthamMatchData }) {
  const result = data.result || data.overall_result || "—";
  return (
    <div className="flex shrink-0 items-center gap-3 rounded-2xl bg-gradient-to-br from-primary to-primary-dark p-4 text-primary-foreground shadow-card sm:gap-4 font-ml">
      <div className="flex h-16 w-16 shrink-0 flex-col items-center justify-center rounded-full border-4 border-white/30 sm:h-20 sm:w-20">
        <span className="text-xl font-bold leading-none sm:text-2xl">
          {data.score}
        </span>
        <span className="text-xs opacity-80">/{data.max_score}</span>
      </div>
      <div className="min-w-0 flex-1">
        <p className="text-[11px] font-semibold uppercase tracking-wider opacity-80">
          {PAGE_COPY.overall}
        </p>
        <p className="mt-0.5 text-lg font-bold leading-tight sm:text-xl">
          {result}
        </p>
        <p className="mt-0.5 text-xs opacity-90 sm:text-sm">
          {PAGE_COPY.matchedSummary(data.score, data.max_score)}
        </p>
      </div>
    </div>
  );
}

function PoruthamDetailsCard({
  data,
  lang,
}: {
  data: PoruthamMatchData;
  lang: ChartLang;
}) {
  const rows = PORUTHAM_KEYS.filter(
    (key) => key in (data.poruthams ?? {}),
  ).map((key) => {
    const matched = Boolean(data.poruthams[key]);
    const points = poruthamPoints(key, data);
    const label =
      lang === "en"
        ? (PORUTHAM_LABELS_EN[key] ?? key)
        : poruthamRowLabelMalayalam(key, key);
    return { key, matched, points, label };
  });

  return (
    <div className="rounded-2xl border border-primary/15 bg-card p-3 shadow-card font-ml sm:p-4 lg:flex lg:min-h-0 lg:flex-1 lg:flex-col lg:overflow-hidden">
      <div className="mb-1.5 flex shrink-0 items-center gap-2">
        <ListChecks className="h-5 w-5 text-primary" />
        <p className="text-base font-bold text-foreground">
          {PAGE_COPY.poruthamDetails}
        </p>
      </div>
      <ul className="lg:min-h-0 lg:flex-1 lg:overflow-y-auto">
        {rows.map((row) => (
          <li
            key={row.key}
            className="flex items-center gap-3 border-b border-primary/5 py-2 last:border-0"
          >
            <span className="flex-1 text-sm font-medium text-foreground">
              {row.label}
            </span>
            <span
              className={cn(
                "flex h-6 w-6 shrink-0 items-center justify-center rounded-full",
                row.points >= 1
                  ? "bg-green-500"
                  : row.points > 0
                    ? "bg-amber-400"
                    : "bg-red-500",
              )}
            >
              {row.points >= 1 ? (
                <Check className="h-4 w-4 text-white" strokeWidth={3} />
              ) : row.points > 0 ? (
                <Equal className="h-4 w-4 text-white" strokeWidth={3} />
              ) : (
                <X className="h-4 w-4 text-white" strokeWidth={3} />
              )}
            </span>
          </li>
        ))}
      </ul>
    </div>
  );
}

function GrahanilaCard({
  title,
  person,
  lang,
}: {
  title: string;
  person: PoruthamGrahanilaPerson;
  lang: ChartLang;
}) {
  const h = person.horoscope;
  const charts = h?.charts;
  const photo = resolveMediaUrl(person.profile_photo);
  const details = personDetailRows(h, lang);

  return (
    <section className="flex h-full flex-col overflow-hidden rounded-2xl border border-primary/15 bg-card shadow-card font-ml">
      <div className="shrink-0 border-b border-primary/10 bg-accent-rose/15 py-2.5 text-center">
        <span className="text-sm font-bold text-primary">{title}</span>
      </div>

      <div className="flex min-h-0 flex-1 flex-col space-y-3 overflow-y-auto p-3">
        <div className="flex items-center gap-3">
          <div className="h-16 w-16 shrink-0 overflow-hidden rounded-full border-2 border-primary/20 bg-accent-rose/30">
            {photo ? (
              <img
                src={photo}
                alt={person.name}
                className="h-full w-full object-cover"
              />
            ) : (
              <div className="flex h-full w-full items-center justify-center text-2xl font-bold text-primary">
                {initialsOf(person.name)}
              </div>
            )}
          </div>
          <div className="flex min-w-0 flex-1 flex-col justify-center">
            <p className="line-clamp-2 break-words text-base font-bold leading-tight text-foreground">
              {person.name || "—"}
            </p>
            {person.matri_id ? (
              <p className="font-mono text-xs text-muted-foreground">
                {person.matri_id}
              </p>
            ) : null}
          </div>
        </div>

        <div className="grid grid-cols-2 gap-2 sm:grid-cols-3">
          {details.map((d) => (
            <div
              key={d.label}
              className="rounded-xl border border-primary/10 bg-muted/30 px-2 py-1.5"
            >
              <p className="text-[10px] font-semibold uppercase tracking-wide text-muted-foreground">
                {d.label}
              </p>
              <p className="mt-0.5 text-sm font-bold leading-tight text-foreground">
                {d.value}
              </p>
            </div>
          ))}
        </div>

        {charts ? (
          <SelfHoroscopeChart
            charts={charts}
            headerLine={person.matri_id}
            name={person.name}
            dateOfBirth={h?.pr_dob}
            timeOfBirth={h?.pr_tob}
            placeOfBirth={h?.place_of_birth}
            lang={lang}
            centerLang={lang}
            tabLang="en"
            variant="tabs"
            enableZoom
          />
        ) : (
          <div className="flex h-40 items-center justify-center rounded-lg border border-dashed border-muted-foreground/30 text-xs text-muted-foreground">
            {PAGE_COPY.chartNotAvailable}
          </div>
        )}
      </div>
    </section>
  );
}

/** Mobile-only: bride & groom charts shown as squares side by side, driven by one shared tab control at the bottom. */
function MobileGrahanilaPair({
  bride,
  groom,
  lang,
}: {
  bride: PoruthamGrahanilaPerson;
  groom: PoruthamGrahanilaPerson;
  lang: ChartLang;
}) {
  const [chartType, setChartType] = useState<SelfChartType>("rasi");
  const tabLabels = TAB_LABELS.en;

  const roleLabel = (isBride: boolean) =>
    lang === "ml"
      ? isBride
        ? "സ്ത്രീ"
        : "പുരുഷൻ"
      : isBride
        ? PAGE_COPY.bride
        : PAGE_COPY.groom;

  const renderChart = (
    person: PoruthamGrahanilaPerson,
    title: string,
    isBride: boolean,
  ) => {
    const h = person.horoscope;
    const charts = h?.charts;
    const details = personDetailRows(h, lang);
    const centerLabel = `${TAB_LABELS[lang][chartType]} (${roleLabel(isBride)})`;
    return (
      <section className="flex flex-col overflow-hidden rounded-2xl border border-primary/15 bg-card shadow-card font-ml">
        <div className="border-b border-primary/10 bg-accent-rose/15 py-2 text-center">
          <span className="text-sm font-bold text-primary">{title}</span>
        </div>
        <div className="space-y-2 p-2">
          {/* Birth details as a compact section, moved out of the chart centre. */}
          <div className="grid grid-cols-2 gap-1.5">
            {details.map((d) => (
              <div
                key={d.label}
                className="rounded-lg border border-primary/10 bg-muted/30 px-1.5 py-1"
              >
                <p className="text-[9px] font-semibold uppercase tracking-wide text-muted-foreground">
                  {d.label}
                </p>
                <p className="mt-0.5 text-xs font-bold leading-tight text-foreground">
                  {d.value}
                </p>
              </div>
            ))}
          </div>
          {charts ? (
            <SouthIndianChartGrid
              person={buildPersonForChart(charts, chartType, lang, {
                name: person.name,
                dateOfBirth: h?.pr_dob,
                timeOfBirth: h?.pr_tob,
                placeOfBirth: h?.place_of_birth,
              })}
              lang={lang}
              centerLang={lang}
              centerLabel={centerLabel}
              dense
            />
          ) : (
            <div className="flex aspect-square items-center justify-center rounded-lg border border-dashed border-muted-foreground/30 text-xs text-muted-foreground">
              {PAGE_COPY.chartNotAvailable}
            </div>
          )}
        </div>
      </section>
    );
  };

  return (
    <div className="space-y-3">
      <div className="grid grid-cols-2 gap-3">
        {renderChart(bride, PAGE_COPY.bride, true)}
        {renderChart(groom, PAGE_COPY.groom, false)}
      </div>
      <div className="mx-auto flex w-full max-w-xs items-center gap-1 rounded-xl bg-muted/40 p-1 font-ml">
        {CHART_TYPES.map((value) => (
          <button
            key={value}
            type="button"
            onClick={() => setChartType(value)}
            className={cn(
              "flex-1 rounded-lg px-2 py-2 text-xs font-semibold transition-colors",
              chartType === value
                ? "bg-primary text-primary-foreground shadow-sm"
                : "text-muted-foreground hover:text-foreground",
            )}
          >
            {tabLabels[value]}
          </button>
        ))}
      </div>
    </div>
  );
}

function PoruthamMatchingContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const partnerMatriId = searchParams?.get("partner")?.trim() ?? "";
  const myMatriId = useAuthStore((s) => s.user?.matriId?.trim() ?? "");

  const [lang, setLang] = useState<ChartLang>("en");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [data, setData] = useState<PoruthamMatchData | null>(null);
  const [downloading, setDownloading] = useState(false);

  const handleDownload = async () => {
    if (downloading) return;
    const reportUrl = resolveMediaUrl(data?.match_report_url);
    if (reportUrl) {
      window.open(reportUrl, "_blank", "noopener,noreferrer");
      return;
    }
    if (!partnerMatriId) return;
    setDownloading(true);
    try {
      const { blob, filename } = await getMatchReportPdf(partnerMatriId);
      const objectUrl = URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.href = objectUrl;
      a.download = filename;
      document.body.appendChild(a);
      a.click();
      a.remove();
      URL.revokeObjectURL(objectUrl);
    } catch (e) {
      const err = e as Error & { status?: number };
      const msg = err.message || "Could not download match report.";
      if (err.status === 403) {
        toast.info(msg);
        router.push("/dashboard/plan");
      } else {
        toast.error(msg);
      }
    } finally {
      setDownloading(false);
    }
  };

  useEffect(() => {
    if (!myMatriId || !partnerMatriId) {
      setLoading(false);
      setError(
        !myMatriId
          ? "Your Matri ID was not found. Please sign in again."
          : "Partner profile is missing. Open a profile and tap Match Horoscope.",
      );
      return;
    }

    let cancelled = false;
    setLoading(true);
    setError(null);

    postPoruthamMatch({ matri_id: myMatriId, partner_matri_id: partnerMatriId })
      .then((res) => {
        if (cancelled) return;
        setData(res.data);
      })
      .catch((e) => {
        if (cancelled) return;
        const err = e as Error & { status?: number };
        const msg = getDisplayErrorMessage(e);
        setError(msg);
        if (err.status === 403) {
          toast.info(msg);
          router.push("/dashboard/plan");
          return;
        }
        toast.error(msg);
      })
      .finally(() => {
        if (!cancelled) setLoading(false);
      });

    return () => {
      cancelled = true;
    };
  }, [myMatriId, partnerMatriId, router]);

  return (
    <div className="mx-auto flex w-full max-w-5xl flex-col gap-3 lg:max-w-6xl xl:max-w-7xl lg:h-[calc(100vh_-_3rem)] lg:min-h-0 lg:overflow-hidden">
      <div className="flex shrink-0 items-center justify-end gap-2">
        <LanguageToggle lang={lang} onChange={setLang} />
        {data ? (
          <Button
            type="button"
            variant="outline"
            size="sm"
            className="shrink-0 px-2.5"
            title="Download Report"
            aria-label="Download Report"
            onClick={handleDownload}
            disabled={downloading}
          >
            {downloading ? (
              <Loader2 className="h-4 w-4 animate-spin" />
            ) : (
              <Download className="h-4 w-4" />
            )}
          </Button>
        ) : null}
      </div>

      {loading ? (
        <div className="flex min-h-[40vh] items-center justify-center gap-2 text-muted-foreground">
          <Loader2 className="h-8 w-8 animate-spin text-primary" />
          <span className="text-sm">{PAGE_COPY.loading}</span>
        </div>
      ) : error ? (
        <div className="rounded-xl border border-destructive/30 bg-destructive/5 px-4 py-6 text-center">
          <p className="text-sm text-destructive">{error}</p>
          <Button
            type="button"
            variant="outline"
            className="mt-4"
            onClick={() => router.back()}
          >
            Go back
          </Button>
        </div>
      ) : data?.grahanila ? (
        <div className="flex flex-col gap-3 sm:gap-4 lg:grid lg:min-h-0 lg:flex-1 lg:grid-cols-[1.35fr_1fr_1.35fr] lg:items-stretch lg:overflow-hidden">
          {/* Match result + porutham details: top on mobile, centre column on desktop. */}
          <div className="order-1 flex flex-col gap-3 sm:gap-4 lg:order-2 lg:h-full lg:min-h-0 lg:overflow-hidden">
            <MatchResultCard data={data} />
            <PoruthamDetailsCard data={data} lang={lang} />
          </div>

          {/* Mobile only: square charts side by side with a single shared tab control at the bottom. */}
          <div className="order-2 lg:hidden">
            <MobileGrahanilaPair
              bride={data.grahanila.bride}
              groom={data.grahanila.groom}
              lang={lang}
            />
          </div>

          {/* Desktop only: full bride & groom cards (photo, details, per-card tabs). */}
          <div className="hidden lg:contents">
            <div className="lg:order-1 lg:h-full lg:min-h-0 lg:overflow-hidden">
              <GrahanilaCard
                title={PAGE_COPY.bride}
                person={data.grahanila.bride}
                lang={lang}
              />
            </div>
            <div className="lg:order-3 lg:h-full lg:min-h-0 lg:overflow-hidden">
              <GrahanilaCard
                title={PAGE_COPY.groom}
                person={data.grahanila.groom}
                lang={lang}
              />
            </div>
          </div>
        </div>
      ) : (
        <div className="rounded-xl border border-muted-foreground/30 px-4 py-6 text-center text-sm text-muted-foreground">
          No match data returned.
        </div>
      )}
    </div>
  );
}

export default function PoruthamMatchingPage() {
  return (
    <Suspense
      fallback={
        <div className="flex min-h-[40vh] items-center justify-center">
          <Loader2 className="h-8 w-8 animate-spin text-primary" />
        </div>
      }
    >
      <PoruthamMatchingContent />
    </Suspense>
  );
}
