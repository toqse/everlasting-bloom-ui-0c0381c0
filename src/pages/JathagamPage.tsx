import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import DashboardLayout from "@/components/DashboardLayout";
import { useAuthStore } from "@/stores/authStore";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { Calendar, Clock, Sparkles, Check, X, Phone } from "lucide-react";
import { RASI_OPTIONS, NAKSHATRA_OPTIONS, NAKSHATRA_PADA } from "@/data/jathagam";
import { profilesData } from "@/components/FeaturedProfiles";
import { cn } from "@/lib/utils";
import { Progress } from "@/components/ui/progress";

const PORUTHAM_CHECKS = [
  { name: "Dina Porutham", passed: true },
  { name: "Gana Porutham", passed: true },
  { name: "Mahendra Porutham", passed: true },
  { name: "Stree Deergha", passed: true },
  { name: "Yoni Porutham", passed: true },
  { name: "Rasi Porutham", passed: true },
  { name: "Rajju Porutham", passed: true },
  { name: "Vasya Porutham", passed: true },
  { name: "Vedha Porutham", passed: false },
  { name: "Nadi Porutham", passed: false },
];

export default function JathagamPage() {
  const navigate = useNavigate();
  const isHinduFn = useAuthStore((s) => s.isHindu);

  useEffect(() => {
    if (typeof isHinduFn !== "function") return;
    if (!isHinduFn()) navigate("/dashboard", { replace: true });
  }, [isHinduFn, navigate]);

  const [rasi, setRasi] = useState("");
  const [nakshatra, setNakshatra] = useState("");
  const [nakshatraPada, setNakshatraPada] = useState<number>(1);
  const [birthName, setBirthName] = useState("");
  const [timeOfBirth, setTimeOfBirth] = useState("");
  const [placeOfBirth, setPlaceOfBirth] = useState("");
  const [mangalDosha, setMangalDosha] = useState(false);
  const [horoscopeMatchRequired, setHoroscopeMatchRequired] = useState<"yes" | "no" | "any">("yes");
  const [generatingPdf, setGeneratingPdf] = useState(false);
  const [poruthamScore, setPoruthamScore] = useState<number | null>(null);
  const [checkingMatch, setCheckingMatch] = useState(false);

  const selectedProfile = profilesData[0];

  const handleGeneratePdf = async () => {
    setGeneratingPdf(true);
    await new Promise((r) => setTimeout(r, 2000));
    setGeneratingPdf(false);
  };

  const handleCheckMatch = async () => {
    setCheckingMatch(true);
    await new Promise((r) => setTimeout(r, 1500));
    setPoruthamScore(8);
    setCheckingMatch(false);
  };

  return (
    <DashboardLayout>
      <div className="space-y-6">
        {/* Header + Gold Plan banner */}
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
          <div className="px-4 py-2 rounded-xl bg-primary text-primary-foreground flex items-center gap-2 shrink-0">
            <Check className="w-5 h-5" />
            <div className="text-left">
              <p className="font-semibold text-sm">Gold Plan Active</p>
              <p className="text-xs opacity-90">Horoscope Access Unlocked</p>
            </div>
          </div>
        </div>

        <div className="grid lg:grid-cols-2 gap-8">
          {/* Left: Birth Details */}
          <div className="bg-card rounded-2xl shadow-card p-6 border border-primary/10">
            <h2 className="font-serif text-lg font-bold text-foreground flex items-center gap-2 mb-4">
              <Calendar className="w-5 h-5 text-primary" />
              Birth Details
              <span className="text-xs font-normal text-muted-foreground">Required for Jathagam generation</span>
            </h2>

            <div className="space-y-4">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <Label className="text-xs uppercase text-muted-foreground">Rasi (Moon Sign) *</Label>
                  <select
                    value={rasi}
                    onChange={(e) => setRasi(e.target.value)}
                    className="w-full mt-1.5 px-3 py-2.5 rounded-lg border border-primary/20 bg-background text-foreground"
                  >
                    <option value="">Select Rasi</option>
                    {RASI_OPTIONS.map((r) => (
                      <option key={r.value} value={r.value}>{r.label}</option>
                    ))}
                  </select>
                </div>
                <div>
                  <Label className="text-xs uppercase text-muted-foreground">Nakshatra (Star) *</Label>
                  <select
                    value={nakshatra}
                    onChange={(e) => setNakshatra(e.target.value)}
                    className="w-full mt-1.5 px-3 py-2.5 rounded-lg border border-primary/20 bg-background text-foreground"
                  >
                    <option value="">Select Nakshatra</option>
                    {NAKSHATRA_OPTIONS.map((n) => (
                      <option key={n.value} value={n.value}>{n.label}</option>
                    ))}
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <Label className="text-xs uppercase text-muted-foreground">Nakshatra Pada</Label>
                  <div className="flex gap-2 mt-2">
                    {NAKSHATRA_PADA.map((p) => (
                      <button
                        key={p}
                        type="button"
                        onClick={() => setNakshatraPada(p)}
                        className={cn(
                          "w-10 h-10 rounded-full border-2 font-semibold transition-all",
                          nakshatraPada === p
                            ? "bg-primary text-primary-foreground border-primary"
                            : "border-border hover:border-primary/50"
                        )}
                      >
                        {p}
                      </button>
                    ))}
                  </div>
                </div>
                <div>
                  <Label className="text-xs uppercase text-muted-foreground">Name</Label>
                  <Input
                    placeholder="Your name"
                    value={birthName}
                    onChange={(e) => setBirthName(e.target.value)}
                    className="mt-1.5"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
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
                <div>
                  <Label className="text-xs uppercase text-muted-foreground">Place of Birth</Label>
                  <Input
                    placeholder="e.g. Thrissur, Kerala"
                    value={placeOfBirth}
                    onChange={(e) => setPlaceOfBirth(e.target.value)}
                    className="mt-1.5"
                  />
                </div>
              </div>

              <div className="flex items-center justify-between py-2">
                <div>
                  <Label>Mangal Dosha</Label>
                  <p className="text-xs text-muted-foreground">Will be included in compatibility calculation</p>
                </div>
                <Switch checked={mangalDosha} onCheckedChange={setMangalDosha} />
              </div>

              <div>
                <Label className="text-xs uppercase text-muted-foreground block mb-2">Horoscope Match Required in Partner?</Label>
                <div className="flex gap-2 flex-wrap">
                  {(["yes", "no", "any"] as const).map((opt) => (
                    <button
                      key={opt}
                      type="button"
                      onClick={() => setHoroscopeMatchRequired(opt)}
                      className={cn(
                        "px-4 py-2 rounded-lg border-2 text-sm font-medium capitalize transition-all",
                        horoscopeMatchRequired === opt
                          ? "bg-primary text-primary-foreground border-primary"
                          : "border-border hover:border-primary/50"
                      )}
                    >
                      {opt === "yes" && "Yes, Required"}
                      {opt === "no" && "No, Not Required"}
                      {opt === "any" && "Any"}
                    </button>
                  ))}
                </div>
              </div>

              <Button
                variant="default"
                className="w-full bg-primary hover:bg-primary-dark py-6 gap-2"
                onClick={handleGeneratePdf}
                disabled={generatingPdf}
              >
                {generatingPdf ? (
                  <>
                    <span className="animate-spin">⟳</span>
                    Generating...
                  </>
                ) : (
                  <>
                    <Sparkles className="w-5 h-5" />
                    Generate Horoscope PDF
                  </>
                )}
              </Button>

              <Button
                variant="outline"
                className="w-full mt-3 py-6 gap-2 border-primary text-primary hover:bg-primary/10"
                onClick={() => {}}
              >
                <Sparkles className="w-5 h-5" />
                Generate Jakakam full PDF pay 175/-
              </Button>
            </div>
          </div>

          {/* Right: Porutham (Compatibility) - Check Match section */}
          <div className="bg-card rounded-2xl shadow-card p-6 border border-primary/10">
            <h2 className="font-serif text-lg font-bold text-foreground flex items-center gap-2 mb-1">
              <Sparkles className="w-5 h-5 text-primary" />
              Porutham (Compatibility)
            </h2>
            <p className="text-xs text-muted-foreground mb-4">10 compatibility checks · 0-10 scale</p>

            {selectedProfile && (
              <div className="rounded-xl p-4 mb-5 bg-accent-rose/10 border border-primary/10">
                <div className="flex items-center gap-4">
                  <div className="w-14 h-14 rounded-full bg-accent-rose/30 flex items-center justify-center font-bold text-primary text-lg shrink-0">
                    {selectedProfile.name.split(" ").map((n) => n[0]).join("")}
                  </div>
                  <div className="min-w-0 flex-1">
                    <p className="font-semibold text-foreground">{selectedProfile.name}</p>
                    <p className="text-sm text-muted-foreground">
                      {selectedProfile.age} yrs · {selectedProfile.location.split(",")[0]} · Chingam Rasi · Atham Nakshatra
                    </p>
                  </div>
                  <Button
                    variant="default"
                    size="sm"
                    className="bg-primary hover:bg-primary-dark shrink-0"
                    onClick={handleCheckMatch}
                    disabled={checkingMatch}
                  >
                    {checkingMatch ? "Checking..." : "Check Match"}
                  </Button>
                </div>
              </div>
            )}

            {poruthamScore !== null ? (
              <div className="space-y-4">
                <div>
                  <div className="flex items-baseline gap-2 flex-wrap">
                    <span className="text-3xl font-bold text-green-600">{poruthamScore}/10</span>
                    <span className="flex items-center gap-1 text-sm font-medium text-foreground">
                      <Sparkles className="w-4 h-4 text-secondary" />
                      *Excellent Match
                    </span>
                  </div>
                  <Progress value={poruthamScore * 10} className="h-2 mt-2 [&>div]:bg-green-500" />
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                  {PORUTHAM_CHECKS.map((item) => (
                    <div
                      key={item.name}
                      className={cn(
                        "flex items-center gap-2 py-2.5 px-3 rounded-lg border",
                        item.passed
                          ? "bg-green-50 dark:bg-green-950/20 border-green-200 dark:border-green-800/40"
                          : "bg-red-50 dark:bg-red-950/20 border-red-200 dark:border-red-800/40"
                      )}
                    >
                      {item.passed ? (
                        <Check className="w-5 h-5 text-green-600 shrink-0" />
                      ) : (
                        <X className="w-5 h-5 text-red-600 shrink-0" />
                      )}
                      <span className={cn(
                        "text-sm font-medium",
                        item.passed ? "text-green-800 dark:text-green-200" : "text-red-800 dark:text-red-200"
                      )}>
                        {item.name}
                      </span>
                    </div>
                  ))}
                </div>

                <p className="text-xs text-muted-foreground pt-2">
                  Score stored in horoscope_matches table. Consult a jyotishi for final decision.
                </p>
              </div>
            ) : (
              <p className="text-sm text-muted-foreground flex items-center gap-1">
                <Sparkles className="w-4 h-4" />
                Click &quot;Check Match&quot; to see Porutham score. Fill your birth details first for accurate results.
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
        </div>
      </div>
    </DashboardLayout>
  );
}
