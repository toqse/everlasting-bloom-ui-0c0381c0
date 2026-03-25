"use client";

import { useState, useEffect, useCallback } from "react";
import { useRouter } from "next/navigation";
import DashboardLayout from "@/components/DashboardLayout";
import { useAuthStore } from "@/stores/authStore";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Calendar,
  Clock,
  Sparkles,
  Check,
  X,
  Phone,
  Loader2,
  FileText,
  RefreshCw,
} from "lucide-react";
import { cn } from "@/lib/utils";
import { Progress } from "@/components/ui/progress";
import { toast } from "sonner";
import { getBirthDetails, getProfile, updateBirthDetails } from "@/lib/profileApi";
import { getMyPlan, type MyPlanDetails } from "@/lib/plansApi";
import {
  getMyHoroscope,
  postGenerateHoroscope,
  getBirthDetailCandidates,
  postAstrologyPdfOrder,
  postAstrologyPdfVerify,
  type AstrologyPdfProduct,
  type BirthDetailCandidate,
  type HoroscopeMeData,
  type HoroscopePrimaryPanel,
  type MatchBlock,
  type PoruthamDetailedItem,
} from "@/lib/astrologyApi";

declare global {
  interface Window {
    Razorpay?: new (options: {
      key: string;
      amount: number;
      currency: string;
      order_id: string;
      name?: string;
      description?: string;
      handler: (response: {
        razorpay_payment_id: string;
        razorpay_order_id: string;
        razorpay_signature: string;
      }) => void;
      prefill?: { name?: string };
      theme?: { color?: string };
      modal?: { ondismiss?: () => void };
    }) => { open: () => void };
  }
}

function normalizeTimeForApi(value: string): string {
  const t = value.trim();
  if (!t) return "";
  if (/^\d{2}:\d{2}$/.test(t)) return `${t}:00`;
  return t;
}

let razorpayScriptPromise: Promise<boolean> | null = null;
async function ensureRazorpayScript(): Promise<boolean> {
  if (typeof window === "undefined") return false;
  if (window.Razorpay) return true;
  if (!razorpayScriptPromise) {
    razorpayScriptPromise = new Promise((resolve) => {
      const script = document.createElement("script");
      script.src = "https://checkout.razorpay.com/v1/checkout.js";
      script.async = true;
      script.onload = () => resolve(true);
      script.onerror = () => resolve(false);
      document.body.appendChild(script);
    });
  }
  return razorpayScriptPromise;
}

function poruthamRowsFromMatch(match: MatchBlock): PoruthamDetailedItem[] {
  if (match.poruthams_detailed?.length) return match.poruthams_detailed;
  const p = match.poruthams;
  if (!p || typeof p !== "object") return [];
  return Object.entries(p).map(([key, matched]) => ({
    key,
    label: key.replace(/_/g, " ").replace(/\b\w/g, (c) => c.toUpperCase()),
    matched: Boolean(matched),
    severity: "low",
    is_critical: key === "rajju",
  }));
}

/** 10 poruthams + Kuja / Dasa Sandhi / Papam Samyom from `match.flags` (PairMaker-style checklist). */
function extendedPoruthamChecklist(match: MatchBlock): PoruthamDetailedItem[] {
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
      description: "Favorable when neither side is at a major mahadasha boundary",
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
  return [...withPoints, ...extra];
}

function ProfileChartColumn({ panel }: { panel: HoroscopePrimaryPanel }) {
  const url = panel.chart_url?.trim() ?? "";
  const cp = panel.center_panel;
  const dasa = cp?.dasa;

  return (
    <div className="flex flex-col items-stretch gap-3 rounded-xl border border-primary/15 bg-card p-4 shadow-sm">
      <div className="text-center space-y-1 border-b border-primary/10 pb-3">
        {panel.matri_id ? (
          <p className="text-xs font-mono text-muted-foreground tracking-tight">{panel.matri_id}</p>
        ) : null}
        <p className="font-bold text-foreground text-sm sm:text-base uppercase tracking-wide">
          {panel.name ?? "—"}
        </p>
        {panel.role ? (
          <p className="text-xs font-semibold text-primary">{panel.role}</p>
        ) : null}
      </div>
      <div className="flex justify-center">
        {url ? (
          <img
            src={url}
            alt={`Horoscope chart for ${panel.name ?? panel.matri_id ?? "profile"}`}
            className="w-full max-w-[min(100%,420px)] rounded-lg border border-primary/10 bg-white object-contain"
          />
        ) : (
          <div className="flex h-48 w-full max-w-[280px] items-center justify-center rounded-lg border border-dashed border-muted-foreground/30 text-xs text-muted-foreground">
            Chart not available
          </div>
        )}
      </div>
      <div className="rounded-lg border border-primary/10 bg-muted/20 p-3 text-center text-xs space-y-1.5">
        {panel.chart_meta?.display_title ? (
          <p className="font-medium text-foreground leading-snug">{panel.chart_meta.display_title}</p>
        ) : null}
        <p className="text-muted-foreground">
          {[panel.chart_meta?.rasi_label ?? panel.rasi, panel.chart_meta?.lagna_label ?? panel.lagna]
            .filter(Boolean)
            .join(" · ")}
        </p>
        {cp?.nakshatra != null || cp?.padam != null ? (
          <div className="pt-2 border-t border-primary/10 space-y-0.5">
            {cp.nakshatra ? (
              <p>
                <span className="text-muted-foreground">Nakshatra</span> · {cp.nakshatra}
                {cp.nakshatra_english ? ` (${cp.nakshatra_english})` : ""}
              </p>
            ) : null}
            {cp.padam != null ? (
              <p>
                <span className="text-muted-foreground">Padam</span> · {cp.padam}
              </p>
            ) : null}
          </div>
        ) : null}
        {dasa && (dasa.remaining_label || dasa.lord) ? (
          <div className="pt-2 border-t border-primary/10 space-y-1">
            <p className="font-semibold text-foreground">Dasa</p>
            {dasa.remaining_label ? <p className="text-foreground">{dasa.remaining_label}</p> : null}
            {dasa.lord ? (
              <p>
                <span className="text-muted-foreground">Lord</span> · {dasa.lord}
              </p>
            ) : null}
          </div>
        ) : null}
        {panel.kuja_dosham != null || panel.kendra_malefic_count != null ? (
          <p className="text-[11px] text-muted-foreground pt-1">
            {[
              panel.kuja_dosham != null ? `Kuja dosham: ${panel.kuja_dosham ? "Yes" : "No"}` : null,
              panel.kendra_malefic_count != null
                ? `Kendra malefics: ${panel.kendra_malefic_count}`
                : null,
            ]
              .filter(Boolean)
              .join(" · ")}
          </p>
        ) : null}
      </div>
    </div>
  );
}

function PoruthamChecklistColumn({ rows }: { rows: PoruthamDetailedItem[] }) {
  return (
    <div className="flex flex-col justify-center gap-0 min-h-[120px] rounded-xl border-2 border-primary/20 bg-primary/5 px-3 py-4 sm:px-4">
      <p className="text-[10px] uppercase tracking-wider text-muted-foreground font-semibold mb-2 text-center">
        Porutham
      </p>
      <ul className="space-y-1.5 max-h-[min(70vh,520px)] overflow-y-auto pr-1">
        {rows.map((row) => (
          <li
            key={row.key}
            className="flex items-center justify-between gap-2 text-xs sm:text-sm py-1 border-b border-primary/5 last:border-0"
          >
            <span className="text-foreground font-medium leading-tight">{row.label}</span>
            {typeof row.points === "number" ? (
              <span className="text-[11px] text-muted-foreground ml-auto mr-1">
                {row.points.toFixed(1)}
              </span>
            ) : null}
            <span
              className="shrink-0 flex h-6 w-6 items-center justify-center rounded border border-primary/20 bg-background"
              title={row.description}
            >
              {row.matched ? (
                <Check className="h-3.5 w-3.5 text-green-600" strokeWidth={3} />
              ) : (
                <X className="h-3.5 w-3.5 text-red-500" strokeWidth={2.5} />
              )}
            </span>
          </li>
        ))}
      </ul>
    </div>
  );
}

export default function JathagamPage() {
  const router = useRouter();
  const isHinduFn = useAuthStore((s) => s.isHindu);
  const user = useAuthStore((s) => s.user);

  useEffect(() => {
    if (typeof isHinduFn !== "function") return;
    if (!isHinduFn()) router.replace("/dashboard");
  }, [isHinduFn, router]);

  const [displayName, setDisplayName] = useState("");
  const [timeOfBirth, setTimeOfBirth] = useState("");
  const [placeOfBirth, setPlaceOfBirth] = useState("");
  const [savingBirthDetails, setSavingBirthDetails] = useState(false);
  const [loadingInitial, setLoadingInitial] = useState(true);
  const [myPlan, setMyPlan] = useState<MyPlanDetails | null>(null);

  const [candidates, setCandidates] = useState<BirthDetailCandidate[]>([]);
  const [candidatesError, setCandidatesError] = useState<string | null>(null);
  const [selectedMatriId, setSelectedMatriId] = useState<string>("");

  /** Shown only in Birth Details after "Generate Horoscope (chart)" or "Refresh" (self-only). */
  const [selfHoroscopeData, setSelfHoroscopeData] = useState<HoroscopeMeData | null>(null);
  /** Set only by "Check Match" — drives the comparison report; does not update the self Grahanila card. */
  const [matchResponseData, setMatchResponseData] = useState<HoroscopeMeData | null>(null);
  const [matchBlock, setMatchBlock] = useState<MatchBlock | null>(null);
  const [generatingChart, setGeneratingChart] = useState(false);
  const [refreshingChart, setRefreshingChart] = useState(false);
  const [checkingMatch, setCheckingMatch] = useState(false);
  const [processingPdfProduct, setProcessingPdfProduct] = useState<AstrologyPdfProduct | null>(null);

  const loadPageData = useCallback(async () => {
    setLoadingInitial(true);
    setCandidatesError(null);
    try {
      const [bdRes, profRes, planRes] = await Promise.all([
        getBirthDetails(),
        getProfile(),
        getMyPlan().catch(() => null),
      ]);

      const name = profRes.data?.basic_details?.name?.trim() ?? "";
      setDisplayName(name);

      const t = bdRes.data?.time_of_birth?.trim();
      setTimeOfBirth(t && t.length >= 5 ? t.slice(0, 5) : t ?? "");
      setPlaceOfBirth(bdRes.data?.place_of_birth?.trim() ?? "");

      if (planRes?.success && planRes.data) {
        setMyPlan(planRes.data);
        if (planRes.data.is_plan_active) {
          try {
            const cRes = await getBirthDetailCandidates({ limit: 20 });
            setCandidates(cRes.data.results);
            const first = cRes.data.results[0];
            setSelectedMatriId((prev) => {
              if (prev && cRes.data.results.some((r) => r.matri_id === prev)) return prev;
              return first?.matri_id ?? "";
            });
          } catch (e) {
            setCandidates([]);
            setSelectedMatriId("");
            setCandidatesError(e instanceof Error ? e.message : "Could not load candidates.");
          }
        } else {
          setCandidates([]);
          setSelectedMatriId("");
        }
      } else {
        setMyPlan(null);
        setCandidates([]);
        setSelectedMatriId("");
      }
    } catch (e) {
      toast.error(e instanceof Error ? e.message : "Failed to load page data.");
    } finally {
      setLoadingInitial(false);
    }
  }, []);

  useEffect(() => {
    loadPageData();
  }, [loadPageData]);

  const handleUpdateBirthDetails = async () => {
    const place = placeOfBirth.trim();
    const timeApi = normalizeTimeForApi(timeOfBirth);
    if (!place) {
      toast.error("Place of birth is required.");
      return;
    }
    if (!timeApi) {
      toast.error("Time of birth is required.");
      return;
    }
    setSavingBirthDetails(true);
    try {
      const res = await updateBirthDetails({
        time_of_birth: timeApi,
        place_of_birth: place,
      });
      toast.success(res.message ?? "Birth details updated successfully.");
      const t = res.data?.time_of_birth?.trim();
      setTimeOfBirth(t && t.length >= 5 ? t.slice(0, 5) : t ?? "");
      setPlaceOfBirth(res.data?.place_of_birth?.trim() ?? place);
    } catch (e) {
      toast.error(e instanceof Error ? e.message : "Could not save birth details.");
    } finally {
      setSavingBirthDetails(false);
    }
  };

  const handleGenerateChart = async () => {
    setGeneratingChart(true);
    try {
      const res = await getMyHoroscope("south");
      setSelfHoroscopeData(res.data);
      setMatchResponseData(null);
      setMatchBlock(null);
    } catch (e) {
      const msg = e instanceof Error ? e.message : "Could not load horoscope.";
      toast.error(msg);
    } finally {
      setGeneratingChart(false);
    }
  };

  const handleRefreshChart = async () => {
    const matriId = user?.matriId?.trim();
    if (!matriId) {
      toast.error("Matri ID not found. Please sign in again.");
      return;
    }
    setRefreshingChart(true);
    try {
      const res = await postGenerateHoroscope({ matri_id: matriId });
      setSelfHoroscopeData(res.data);
      setMatchResponseData(null);
      setMatchBlock(null);
    } catch (e) {
      toast.error(e instanceof Error ? e.message : "Could not refresh horoscope.");
    } finally {
      setRefreshingChart(false);
    }
  };

  const handleCheckMatch = async () => {
    const myMatri = user?.matriId?.trim();
    const partner = selectedMatriId.trim();
    if (!myMatri) {
      toast.error("Matri ID not found. Please sign in again.");
      return;
    }
    if (!partner) {
      toast.error("Select a candidate to check compatibility.");
      return;
    }
    setCheckingMatch(true);
    try {
      const res = await postGenerateHoroscope({
        matri_id: myMatri,
        partner_matri_id: partner,
      });
      setMatchResponseData(res.data);
      setMatchBlock(res.data.match ?? null);
      if (!res.data.match) {
        toast.message(
          "Compatibility report not available. The other member may need complete birth details or horoscope generation.",
        );
      } else {
        toast.success(res.data.match.summary?.result ?? "Compatibility calculated.");
      }
      try {
        const planRes = await getMyPlan();
        if (planRes.success) setMyPlan(planRes.data);
      } catch {
        // banner may stay stale; non-fatal
      }
    } catch (e) {
      toast.error(e instanceof Error ? e.message : "Could not check match.");
    } finally {
      setCheckingMatch(false);
    }
  };

  const handleBuyAstrologyPdf = async (product: AstrologyPdfProduct) => {
    setProcessingPdfProduct(product);
    try {
      const sdkReady = await ensureRazorpayScript();
      if (!sdkReady || !window.Razorpay) {
        throw new Error("Could not load Razorpay checkout.");
      }
      const RazorpayCtor = window.Razorpay;

      const orderRes = await postAstrologyPdfOrder({ product });
      const order = orderRes.data;

      await new Promise<void>((resolve, reject) => {
        const rz = new RazorpayCtor({
          key: order.key_id,
          amount: order.amount,
          currency: order.currency,
          order_id: order.order_id,
          name: "Matrimony Astrology",
          description:
            product === "jathakam" ? "Jathakam PDF" : "Thalakuri PDF",
          prefill: { name: displayName || undefined },
          theme: { color: "#8d1b5b" },
          handler: async (payment) => {
            try {
              const verifyRes = await postAstrologyPdfVerify({
                product,
                razorpay_order_id: payment.razorpay_order_id,
                razorpay_payment_id: payment.razorpay_payment_id,
                razorpay_signature: payment.razorpay_signature,
              });
              const downloadUrl = verifyRes.data?.download_url?.trim();
              if (!downloadUrl) {
                throw new Error("Download URL missing in verification response.");
              }
              window.open(downloadUrl, "_blank", "noopener,noreferrer");
              toast.success(
                verifyRes.message ??
                  `${product === "jathakam" ? "Jathakam" : "Thalakuri"} PDF is ready.`,
              );
              resolve();
            } catch (e) {
              reject(
                e instanceof Error
                  ? e
                  : new Error("Payment verified but PDF could not be opened."),
              );
            }
          },
          modal: {
            ondismiss: () => reject(new Error("Payment cancelled.")),
          },
        });
        rz.open();
      });
    } catch (e) {
      const msg = e instanceof Error ? e.message : "Could not process astrology PDF payment.";
      if (msg !== "Payment cancelled.") toast.error(msg);
    } finally {
      setProcessingPdfProduct(null);
    }
  };

  const selfPrimary = selfHoroscopeData?.primary;
  const chartUrlSelf = selfPrimary?.chart_url ?? selfHoroscopeData?.chart_url;
  const poruthamRows = matchBlock ? poruthamRowsFromMatch(matchBlock) : [];
  const comparisonRows = matchBlock ? extendedPoruthamChecklist(matchBlock) : [];
  const showPairComparison = Boolean(
    matchBlock && matchResponseData?.primary && matchResponseData?.partner,
  );
  const scorePct =
    matchBlock?.summary?.percentage ??
    (matchBlock?.max_score && matchBlock.max_score > 0 && matchBlock.score != null
      ? (matchBlock.score / matchBlock.max_score) * 100
      : null);
  const selectedCandidate = candidates.find((c) => c.matri_id === selectedMatriId);

  const planBanner = (() => {
    if (!myPlan) {
      return (
        <div className="px-4 py-2 rounded-xl border border-primary/20 bg-muted/40 text-foreground shrink-0 max-w-xs">
          <p className="font-semibold text-sm">Plan status</p>
          <p className="text-xs text-muted-foreground mt-0.5">
            Birth details and your own chart are available. Subscribe for compatibility matching with other
            members.
          </p>
        </div>
      );
    }
    if (myPlan.is_plan_active) {
      return (
        <div className="px-4 py-2 rounded-xl bg-primary text-primary-foreground flex items-center gap-2 shrink-0">
          <Check className="w-5 h-5" />
          <div className="text-left">
            <p className="font-semibold text-sm">{myPlan.plan_name ?? "Active plan"}</p>
            <p className="text-xs opacity-90">
              Horoscope matches remaining: <strong>{myPlan.horoscope_remaining}</strong>
            </p>
          </div>
        </div>
      );
    }
    return (
      <div className="px-4 py-2 rounded-xl border border-amber-500/40 bg-amber-50 dark:bg-amber-950/20 shrink-0 max-w-xs">
        <p className="font-semibold text-sm text-foreground">No active plan</p>
        <p className="text-xs text-muted-foreground mt-0.5">
          You can still update birth details and view your own horoscope. Renew to unlock partner matching.
        </p>
      </div>
    );
  })();

  return (
    <DashboardLayout>
      <div className="space-y-6 relative">
        {loadingInitial && (
          <div className="absolute inset-0 z-10 flex items-center justify-center bg-background/60 rounded-xl">
            <Loader2 className="w-10 h-10 animate-spin text-primary" aria-hidden />
          </div>
        )}

        <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-4">
          <div>
            <h1 className="font-serif text-2xl md:text-3xl font-bold text-foreground flex items-center gap-2">
              <Sparkles className="w-7 h-7 text-primary" />
              Jathagam & Horoscope
            </h1>
            <p className="text-muted-foreground mt-1">
              Enter your birth details to generate Horoscope PDF and calculate Porutham compatibility score
            </p>
          </div>
          {planBanner}
        </div>

        <div className="flex flex-wrap gap-2">
          <Button
            type="button"
            className="bg-primary hover:bg-primary-dark"
            onClick={handleUpdateBirthDetails}
            disabled={savingBirthDetails || loadingInitial}
          >
            {savingBirthDetails ? (
              <>
                <Loader2 className="w-4 h-4 animate-spin mr-2" />
                Saving…
              </>
            ) : (
              "Update Birth Details"
            )}
          </Button>
        </div>

        <div className="grid lg:grid-cols-2 gap-8">
          <div className="bg-card rounded-2xl shadow-card p-6 border border-primary/10">
            <h2 className="font-serif text-lg font-bold text-foreground flex items-center gap-2 mb-4">
              <Calendar className="w-5 h-5 text-primary" />
              Birth Details
              <span className="text-xs font-normal text-muted-foreground">Required for Jathagam generation</span>
            </h2>

            <div className="space-y-4">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <Label className="text-xs uppercase text-muted-foreground">Name</Label>
                  <Input
                    value={displayName}
                    readOnly
                    disabled
                    placeholder="From your profile"
                    className="mt-1.5 bg-muted/50"
                  />
                </div>
                <div>
                  <Label className="text-xs uppercase text-muted-foreground">Time of Birth</Label>
                  <div className="flex gap-2 mt-1.5 items-center">
                    <Input
                      type="time"
                      value={timeOfBirth}
                      onChange={(e) => setTimeOfBirth(e.target.value)}
                      className="max-w-[140px]"
                    />
                    <Clock className="w-5 h-5 text-muted-foreground" />
                  </div>
                </div>
              </div>

              <div>
                <Label className="text-xs uppercase text-muted-foreground">Place of Birth</Label>
                <Input
                  placeholder="e.g. Thrissur, Kerala"
                  value={placeOfBirth}
                  onChange={(e) => setPlaceOfBirth(e.target.value)}
                  className="mt-1.5"
                />
              </div>

              <div className="flex flex-col sm:flex-row gap-2">
                <Button
                  variant="default"
                  className="flex-1 bg-primary hover:bg-primary-dark py-6 gap-2"
                  onClick={handleGenerateChart}
                  disabled={generatingChart || loadingInitial}
                >
                  {generatingChart ? (
                    <>
                      <Loader2 className="w-5 h-5 animate-spin" />
                      Loading…
                    </>
                  ) : (
                    <>
                      <Sparkles className="w-5 h-5" />
                      Generate Horoscope (chart)
                    </>
                  )}
                </Button>
                <Button
                  type="button"
                  variant="outline"
                  className="py-6 gap-2 border-2 border-primary"
                  onClick={handleRefreshChart}
                  disabled={refreshingChart || loadingInitial}
                  title="POST generate for your matri_id only"
                >
                  {refreshingChart ? (
                    <Loader2 className="w-5 h-5 animate-spin" />
                  ) : (
                    <RefreshCw className="w-5 h-5" />
                  )}
                  Refresh
                </Button>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                <Button
                  variant="outline"
                  className="w-full py-6 gap-2 border-2 border-primary bg-white text-primary hover:bg-primary hover:text-primary-foreground transition-colors duration-200 [&_svg]:text-current"
                  type="button"
                  onClick={() => handleBuyAstrologyPdf("jathakam")}
                  disabled={processingPdfProduct != null}
                >
                  {processingPdfProduct === "jathakam" ? (
                    <>
                      <Loader2 className="w-5 h-5 animate-spin" />
                      Processing Jathakam...
                    </>
                  ) : (
                    <>
                      <Sparkles className="w-5 h-5" />
                      Generate Jathakam PDF (Pay 175/-)
                    </>
                  )}
                </Button>
                <Button
                  variant="outline"
                  className="w-full py-6 gap-2 border-2 border-primary bg-white text-primary hover:bg-primary hover:text-primary-foreground transition-colors duration-200 [&_svg]:text-current"
                  type="button"
                  onClick={() => handleBuyAstrologyPdf("thalakuri")}
                  disabled={processingPdfProduct != null}
                >
                  {processingPdfProduct === "thalakuri" ? (
                    <>
                      <Loader2 className="w-5 h-5 animate-spin" />
                      Processing Thalakuri...
                    </>
                  ) : (
                    <>
                      <Sparkles className="w-5 h-5" />
                      Generate Thalakuri PDF (Pay 20/-)
                    </>
                  )}
                </Button>
              </div>

              {selfHoroscopeData &&
                (chartUrlSelf || selfPrimary?.chart_meta?.display_title) && (
                <div className="pt-4 border-t border-primary/10 space-y-3">
                  {(selfPrimary?.chart_meta?.display_title || selfHoroscopeData?.nakshatra) && (
                    <p className="text-sm font-medium text-foreground">
                      {selfPrimary?.chart_meta?.display_title ??
                        [
                          selfHoroscopeData?.nakshatra,
                          selfHoroscopeData?.nakshatra_pada != null
                            ? `Pada ${selfHoroscopeData.nakshatra_pada}`
                            : null,
                        ]
                          .filter(Boolean)
                          .join(" · ")}
                    </p>
                  )}
                  {(selfPrimary?.rasi || selfHoroscopeData?.rasi) && (
                    <p className="text-xs text-muted-foreground">
                      Rasi: {selfPrimary?.rasi ?? selfHoroscopeData?.rasi}
                      {selfPrimary?.lagna || selfHoroscopeData?.lagna
                        ? ` · Lagna: ${selfPrimary?.lagna ?? selfHoroscopeData?.lagna}`
                        : ""}
                    </p>
                  )}
                  {chartUrlSelf ? (
                    <img
                      src={chartUrlSelf}
                      alt="South Indian horoscope chart"
                      className="w-full max-w-md rounded-lg border border-primary/10 bg-white"
                    />
                  ) : null}
                </div>
              )}
            </div>
          </div>

          <div className="bg-card rounded-2xl shadow-card p-6 border border-primary/10">
            <h2 className="font-serif text-lg font-bold text-foreground flex items-center gap-2 mb-1">
              <Sparkles className="w-5 h-5 text-primary" />
              Porutham (Compatibility)
            </h2>
            <p className="text-xs text-muted-foreground mb-4">10 compatibility checks · 0–10 scale</p>

            {candidatesError && (
              <p className="text-sm text-destructive mb-3 rounded-lg border border-destructive/30 bg-destructive/5 px-3 py-2">
                {candidatesError}
              </p>
            )}

            {myPlan?.is_plan_active && candidates.length === 0 && !candidatesError && (
              <p className="text-sm text-muted-foreground mb-3">
                No members with complete birth details found yet. Try again later.
              </p>
            )}

            {candidates.length > 0 && (
              <div className="space-y-3 mb-5">
                <Label className="text-xs uppercase text-muted-foreground">Candidate</Label>
                <Select
                  value={selectedMatriId || undefined}
                  onValueChange={setSelectedMatriId}
                >
                  <SelectTrigger className="w-full">
                    <SelectValue placeholder="Choose a profile" />
                  </SelectTrigger>
                  <SelectContent>
                    {candidates.map((c) => (
                      <SelectItem key={c.matri_id} value={c.matri_id}>
                        {c.name} ({c.matri_id}){c.has_horoscope ? " · chart ready" : ""}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            )}

            {selectedCandidate && (
              <div className="rounded-xl p-4 mb-5 bg-accent-rose/10 border border-primary/10">
                <div className="flex items-center gap-4">
                  <div className="w-14 h-14 rounded-full bg-accent-rose/30 flex items-center justify-center font-bold text-primary text-lg shrink-0">
                    {selectedCandidate.name
                      .split(" ")
                      .map((n) => n[0])
                      .join("")
                      .slice(0, 2)}
                  </div>
                  <div className="min-w-0 flex-1">
                    <p className="font-semibold text-foreground">{selectedCandidate.name}</p>
                    <p className="text-sm text-muted-foreground">
                      {selectedCandidate.matri_id} · {selectedCandidate.gender}
                      {selectedCandidate.has_horoscope ? " · Horoscope ready" : " · Generate on match"}
                    </p>
                  </div>
                  <Button
                    variant="default"
                    size="sm"
                    className="bg-primary hover:bg-primary-dark shrink-0"
                    onClick={handleCheckMatch}
                    disabled={
                      checkingMatch || !myPlan?.is_plan_active || !selectedMatriId || loadingInitial
                    }
                  >
                    {checkingMatch ? (
                      <>
                        <Loader2 className="w-4 h-4 animate-spin mr-1" />
                        Checking…
                      </>
                    ) : (
                      "Check Match"
                    )}
                  </Button>
                </div>
              </div>
            )}

            {!myPlan?.is_plan_active && (
              <p className="text-sm text-muted-foreground mb-4">
                An active subscription is required to list candidates and run compatibility checks with other
                members.
              </p>
            )}

            {matchBlock && poruthamRows.length > 0 ? (
              <div className="space-y-4">
                {showPairComparison ? (
                  <p className="text-sm text-muted-foreground">
                    Side-by-side Grahanila charts and the full checklist are shown in the report below.
                  </p>
                ) : (
                  <>
                    <div>
                      <div className="flex items-baseline gap-2 flex-wrap">
                        {scorePct != null ? (
                          <>
                            <span
                              className={cn(
                                "text-3xl font-bold",
                                scorePct >= 70
                                  ? "text-green-600"
                                  : scorePct >= 40
                                    ? "text-amber-600"
                                    : "text-red-600",
                              )}
                            >
                              {matchBlock.score ?? "—"}/{matchBlock.max_score ?? 10}
                            </span>
                            <span className="text-lg font-semibold text-muted-foreground">
                              ({Math.round(scorePct)}%)
                            </span>
                          </>
                        ) : (
                          <span className="text-3xl font-bold text-foreground">
                            {matchBlock.score ?? "—"}/{matchBlock.max_score ?? 10}
                          </span>
                        )}
                        <span className="flex items-center gap-1 text-sm font-medium text-foreground">
                          <Sparkles className="w-4 h-4 text-secondary" />
                          {matchBlock.summary?.result ?? matchBlock.result ?? "Result"}
                        </span>
                      </div>
                      {scorePct != null && (
                        <Progress value={scorePct} className="h-2 mt-2 [&>div]:bg-primary" />
                      )}
                    </div>

                    {matchResponseData?.match_report_pdf_url ? (
                      <a
                        href={matchResponseData.match_report_pdf_url}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="inline-flex items-center gap-2 text-sm font-medium text-primary hover:underline"
                      >
                        <FileText className="w-4 h-4" />
                        Open match report (PDF)
                      </a>
                    ) : null}

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                      {comparisonRows.map((item) => (
                        <div
                          key={item.key}
                          className={cn(
                            "flex items-center gap-2 py-2.5 px-3 rounded-lg border",
                            item.matched
                              ? "bg-green-50 dark:bg-green-950/20 border-green-200 dark:border-green-800/40"
                              : item.is_critical
                                ? "bg-red-50 dark:bg-red-950/20 border-red-200 dark:border-red-800/40"
                                : "bg-amber-50 dark:bg-amber-950/20 border-amber-200 dark:border-amber-800/40",
                          )}
                        >
                          {item.matched ? (
                            <Check className="w-5 h-5 text-green-600 shrink-0" />
                          ) : (
                            <X className="w-5 h-5 text-red-600 shrink-0" />
                          )}
                          <span
                            className={cn(
                              "text-sm font-medium",
                              item.matched
                                ? "text-green-800 dark:text-green-200"
                                : item.is_critical
                                  ? "text-red-800 dark:text-red-200"
                                  : "text-amber-900 dark:text-amber-200",
                            )}
                          >
                            {item.label}
                            {typeof item.points === "number" ? ` (${item.points.toFixed(1)})` : ""}
                          </span>
                        </div>
                      ))}
                    </div>

                    <p className="text-xs text-muted-foreground pt-2">
                      Consult a jyotishi for final decision. Quota usage follows your plan rules on the server.
                    </p>
                  </>
                )}
              </div>
            ) : (
              <p className="text-sm text-muted-foreground flex items-center gap-1">
                <Sparkles className="w-4 h-4" />
                Click &quot;Check Match&quot; to see Porutham score. Fill your birth details first for accurate
                results.
              </p>
            )}

            <a
              href="tel:8921726855"
              className="mt-4 flex w-full items-center justify-center gap-2 rounded-xl border-2 border-primary bg-primary/5 px-4 py-3 text-center text-sm font-medium text-primary hover:bg-primary/10 transition-colors"
            >
              <Phone className="w-4 h-4 shrink-0" />
              <span className="text-center">
                Astrologer services are available
                <br />
                contact : 8921726855
              </span>
            </a>
          </div>

          {showPairComparison && matchBlock && matchResponseData?.primary && matchResponseData.partner ? (
            <div className="lg:col-span-2 bg-card rounded-2xl shadow-card p-4 sm:p-6 border-2 border-primary/20 space-y-6">
              <div className="text-center space-y-1">
                <h3 className="font-serif text-xl sm:text-2xl font-bold text-foreground">
                  {matchResponseData.title ?? "Marriage Compatibility Report"}
                </h3>
                {matchResponseData.subtitle ? (
                  <p className="text-sm text-muted-foreground">{matchResponseData.subtitle}</p>
                ) : null}
              </div>

              <div className="flex flex-col sm:flex-row sm:flex-wrap sm:items-end sm:justify-between gap-3 border-b border-primary/10 pb-4">
                <div className="flex-1 min-w-0">
                  <div className="flex items-baseline gap-2 flex-wrap">
                    {scorePct != null ? (
                      <>
                        <span
                          className={cn(
                            "text-3xl font-bold",
                            scorePct >= 70
                              ? "text-green-600"
                              : scorePct >= 40
                                ? "text-amber-600"
                                : "text-red-600",
                          )}
                        >
                          {matchBlock.score ?? "—"}/{matchBlock.max_score ?? 10}
                        </span>
                        <span className="text-lg font-semibold text-muted-foreground">
                          ({Math.round(scorePct)}%)
                        </span>
                      </>
                    ) : (
                      <span className="text-3xl font-bold text-foreground">
                        {matchBlock.score ?? "—"}/{matchBlock.max_score ?? 10}
                      </span>
                    )}
                    <span className="flex items-center gap-1 text-sm font-medium text-foreground">
                      <Sparkles className="w-4 h-4 text-secondary" />
                      {matchBlock.summary?.result ?? matchBlock.result ?? "Result"}
                    </span>
                  </div>
                  {scorePct != null && (
                    <Progress value={scorePct} className="h-2 mt-2 max-w-md [&>div]:bg-primary" />
                  )}
                </div>
                <div className="flex flex-col items-start sm:items-end gap-2">
                  <p
                    className={cn(
                      "text-base sm:text-lg font-bold",
                      matchBlock.summary?.color_code === "green" && "text-green-600",
                      matchBlock.summary?.color_code === "orange" && "text-amber-600",
                      matchBlock.summary?.color_code === "red" && "text-red-600",
                      matchBlock.summary?.color_code == null &&
                        scorePct != null &&
                        (scorePct >= 70
                          ? "text-green-600"
                          : scorePct >= 40
                            ? "text-amber-600"
                            : "text-red-600"),
                      matchBlock.summary?.color_code == null && scorePct == null && "text-foreground",
                    )}
                  >
                    Compatibility grade: {matchBlock.summary?.grade ?? "—"}
                    {matchBlock.compatibility_grade != null || matchBlock.summary?.percentage != null
                      ? ` (${(matchBlock.summary?.percentage ?? matchBlock.compatibility_grade ?? 0).toFixed(2)}%)`
                      : ""}
                  </p>
                  {matchResponseData.match_report_pdf_url ? (
                    <a
                      href={matchResponseData.match_report_pdf_url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex items-center gap-2 text-sm font-medium text-primary hover:underline"
                    >
                      <FileText className="w-4 h-4" />
                      Open match report (PDF)
                    </a>
                  ) : null}
                </div>
              </div>

              <div className="grid grid-cols-1 xl:grid-cols-[1fr_minmax(148px,200px)_1fr] gap-5 xl:gap-6 items-start">
                <ProfileChartColumn panel={matchResponseData.primary} />
                <PoruthamChecklistColumn rows={comparisonRows} />
                <ProfileChartColumn panel={matchResponseData.partner} />
              </div>

              {matchBlock.explanation?.overall ? (
                <p className="text-sm text-foreground leading-relaxed border-l-4 border-primary/30 pl-3">
                  {matchBlock.explanation.overall}
                </p>
              ) : null}

              {matchBlock.insights && matchBlock.insights.length > 0 ? (
                <ul className="text-sm text-muted-foreground list-disc pl-5 space-y-1">
                  {matchBlock.insights.map((line, i) => (
                    <li key={i}>{line}</li>
                  ))}
                </ul>
              ) : null}

              <p className="text-xs text-muted-foreground">
                Consult a jyotishi for final decision. Quota usage follows your plan rules on the server.
              </p>
            </div>
          ) : null}
        </div>
      </div>
    </DashboardLayout>
  );
}
