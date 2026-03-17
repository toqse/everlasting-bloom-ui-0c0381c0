import { useState, useEffect } from "react";
import { Dialog, DialogContent, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { X, Heart, Sparkles, Lock, User, Briefcase, ClipboardList, Users, Moon, Phone, Eye } from "lucide-react";
import { Profile } from "@/components/FeaturedProfiles";
import { useAuthStore } from "@/stores/authStore";
import { useInterestStore } from "@/stores/interestStore";
import { toast } from "sonner";
import UseCreditDialog, { type CreditDialogVariant } from "@/components/UseCreditDialog";
import type { ProfilePreviewData } from "@/lib/matchesApi";

interface Props {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  profile: Profile | null;
  /** When from My Matches, pass API preview data; drawer shows this and Send Interest uses onSendInterest (API). */
  preview?: ProfilePreviewData | null;
  onSendInterest?: () => void;
  /** When credits are exhausted or user clicks Upgrade in credit dialog */
  onOpenPlanModal?: () => void;
}

const ProfileViewDrawer = ({ open, onOpenChange, profile, preview, onSendInterest, onOpenPlanModal }: Props) => {
  const isHindu = useAuthStore((s) => s.isHindu);
  const hasPaidPlan = useAuthStore((s) => s.hasPaidPlan);
  const sendInterest = useInterestStore((s) => s.sendInterest);
  const getHoroscopeRemaining = useAuthStore((s) => s.getHoroscopeRemaining);
  const getHoroscopeQuota = useAuthStore((s) => s.getHoroscopeQuota);
  const useHoroscopeCredit = useAuthStore((s) => s.useHoroscopeCredit);

  const [contactRevealed, setContactRevealed] = useState(false);
  const [horoscopeRevealed, setHoroscopeRevealed] = useState(false);
  const [creditDialogOpen, setCreditDialogOpen] = useState(false);
  const [creditDialogVariant, setCreditDialogVariant] = useState<CreditDialogVariant>("contact");

  const isPreviewMode = !!preview;

  useEffect(() => {
    if (!open) {
      setContactRevealed(false);
      setHoroscopeRevealed(false);
    }
  }, [open, profile?.id, preview?.matri_id]);

  if (!profile && !preview) return null;

  const displayName = preview?.name ?? profile?.name ?? "";
  const displayAge = preview?.age ?? profile?.age ?? 0;
  const displayLocation = (preview?.location ?? profile?.location)?.split(",")[0] ?? "";
  const displayEducation = (preview?.education ?? profile?.education)?.split(",")[0] ?? "";
  const displayOccupation = preview?.occupation ?? profile?.profession ?? "";
  const displayAbout = preview?.about_me ?? (profile ? `${profile.education} graduate working in the ${profile.profession?.toLowerCase() ?? ""} sector in ${displayLocation}. I love music, dancing and exploring new places.` : "No description provided.");
  const displayFamily = preview?.family_background ?? "Middle-class family from Kerala. Father is a retired government employee, mother is a homemaker. One sibling.";
  const displayReligion = preview?.religion ?? "Hindu";
  const displayCaste = preview?.caste ?? "Menon";
  const displayMaritalStatus = preview?.marital_status ?? "Never Married";
  const displayHeight = preview?.height ?? "5'4\"";
  const displayMotherTongue = preview?.mother_tongue ?? "Malayalam";
  const displayAnnualIncome = preview?.annual_income ?? "₹5–8 Lakhs";

  const handleSendInterest = () => {
    if (isPreviewMode && onSendInterest) {
      onSendInterest();
      return;
    }
    if (hasPaidPlan() && profile) {
      sendInterest(0, profile.id, "Hi! I'd love to connect with you.");
      toast.success("Interest sent!", { description: `${profile.name} will be notified.` });
      onOpenChange(false);
    } else {
      onSendInterest?.();
      onOpenChange(false);
    }
  };

  const handleCreditConfirm = () => {
    const used = useHoroscopeCredit();
    if (used) {
      if (creditDialogVariant === "contact") setContactRevealed(true);
      else setHoroscopeRevealed(true);
      toast.success("1 credit used");
      const remaining = getHoroscopeRemaining();
      if (remaining <= 2 && remaining > 0) {
        toast.info(`Only ${remaining} horoscope match${remaining === 1 ? "" : "es"} remaining. Consider upgrading for more.`);
      }
    }
  };

  const handleViewContactClick = () => {
    if (getHoroscopeRemaining() <= 0) {
      setCreditDialogVariant("contact");
      setCreditDialogOpen(true);
      return;
    }
    setCreditDialogVariant("contact");
    setCreditDialogOpen(true);
  };

  const handleCheckHoroscopeClick = () => {
    if (getHoroscopeRemaining() <= 0) {
      setCreditDialogVariant("horoscope");
      setCreditDialogOpen(true);
      return;
    }
    setCreditDialogVariant("horoscope");
    setCreditDialogOpen(true);
  };

  const basicDetails = [
    { label: "AGE", value: `${displayAge} years` },
    { label: "LOCATION", value: displayLocation },
    { label: "RELIGION", value: displayReligion },
    { label: "CASTE", value: displayCaste },
    { label: "EDUCATION", value: displayEducation },
    { label: "MARITAL STATUS", value: displayMaritalStatus },
    { label: "HEIGHT", value: displayHeight },
    { label: "MOTHER TONGUE", value: displayMotherTongue },
  ];

  const careerDetails = [
    { label: "OCCUPATION", value: displayOccupation },
    { label: "EMPLOYMENT", value: "Employed - Private" },
    { label: "ANNUAL INCOME", value: displayAnnualIncome },
    { label: "FIELD", value: "Engineering / IT" },
  ];

  const horoscopeInfo = [
    { label: "RASI", value: "Chingam" },
    { label: "NAKSHATRA", value: "Atham" },
    { label: "PADA", value: "2" },
    { label: "MANGAL DOSHA", value: "No" },
  ];

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent hideCloseButton className="max-w-2xl w-[95vw] max-h-[90vh] overflow-y-auto rounded-2xl p-0 gap-0 border-0 shadow-elevated">
        <DialogTitle className="sr-only">{displayName}</DialogTitle>
        {/* Header with gradient */}
        <div className="bg-gradient-to-r from-primary via-primary-dark to-primary p-6 text-primary-foreground relative">
          <button
            onClick={() => onOpenChange(false)}
            className="absolute top-4 right-4 w-8 h-8 rounded-full bg-white/20 flex items-center justify-center hover:bg-white/30 transition-colors"
          >
            <X className="w-4 h-4" />
          </button>

          <div className="flex items-center gap-4">
            <div className="w-16 h-16 rounded-full bg-accent-rose/30 flex items-center justify-center text-xl font-bold border-2 border-white/30">
              {displayName.split(" ").map(n => n[0]).join("")}
            </div>
            <div>
              <h2 className="font-serif text-2xl font-bold">{displayName}</h2>
              <p className="text-sm opacity-90">{displayAge} yrs · {displayLocation} · {displayEducation}</p>
              <div className="flex gap-2 mt-2">
                <span className="px-2.5 py-0.5 bg-white/20 rounded-full text-xs font-semibold">{displayReligion}</span>
                <span className="px-2.5 py-0.5 bg-secondary/80 text-secondary-foreground rounded-full text-xs font-semibold flex items-center gap-1">
                  <span>◆</span> {displayCaste}
                </span>
                {isHindu() && (
                  <span className="px-2.5 py-0.5 bg-white/20 rounded-full text-xs font-semibold flex items-center gap-1">
                    <Sparkles className="w-3 h-3" /> Jathagam Available
                  </span>
                )}
              </div>
            </div>
          </div>
        </div>

        {/* Body */}
        <div className="p-6 space-y-6">
          <div className="grid md:grid-cols-2 gap-6">
            <div>
              <h3 className="font-serif text-lg font-bold text-foreground mb-3 flex items-center gap-2">
                <User className="w-5 h-5 text-primary" /> About Me
              </h3>
              <div className="p-4 rounded-xl border border-primary/10 bg-accent-rose/5">
                <p className="text-sm text-muted-foreground leading-relaxed">
                  {displayAbout || "No description provided."}
                </p>
              </div>
            </div>

            {/* Career & Education */}
            <div>
              <h3 className="font-serif text-lg font-bold text-foreground mb-3 flex items-center gap-2">
                <Briefcase className="w-5 h-5 text-primary" /> Career & Education
              </h3>
              <div className="grid grid-cols-2 gap-2">
                {careerDetails.map((d, i) => (
                  <div key={i} className="p-3 rounded-xl border border-primary/10 bg-card">
                    <p className="text-[10px] font-bold text-primary uppercase">{d.label}</p>
                    <p className="text-sm font-semibold text-foreground mt-0.5">{d.value}</p>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Basic Details + Family */}
          <div className="grid md:grid-cols-2 gap-6">
            <div>
              <h3 className="font-serif text-lg font-bold text-foreground mb-3 flex items-center gap-2">
                <ClipboardList className="w-5 h-5 text-primary" /> Basic Details
              </h3>
              <div className="grid grid-cols-2 gap-2">
                {basicDetails.map((d, i) => (
                  <div key={i} className="p-3 rounded-xl border border-primary/10 bg-card">
                    <p className="text-[10px] font-bold text-primary uppercase">{d.label}</p>
                    <p className="text-sm font-semibold text-foreground mt-0.5">{d.value}</p>
                  </div>
                ))}
              </div>
            </div>

            <div>
              <h3 className="font-serif text-lg font-bold text-foreground mb-3 flex items-center gap-2">
                <Users className="w-5 h-5 text-primary" /> Family Background
              </h3>
              <div className="p-4 rounded-xl border border-primary/10 bg-accent-rose/5">
                <p className="text-sm text-muted-foreground leading-relaxed">
                  {displayFamily || "No family details provided."}
                </p>
              </div>

              {/* Horoscope Info - Hindu + paid plan; use 1 credit to view */}
              {isHindu() && hasPaidPlan() && (
                <div className="mt-4">
                  <h3 className="font-serif text-lg font-bold text-foreground mb-3 flex items-center gap-2">
                    <Moon className="w-5 h-5 text-primary" /> Horoscope Info
                  </h3>
                  {horoscopeRevealed ? (
                    <div className="grid grid-cols-2 gap-2 p-4 rounded-xl bg-primary/5 border border-primary/15">
                      {horoscopeInfo.map((d, i) => (
                        <div key={i} className="p-2">
                          <p className="text-[10px] font-bold text-primary uppercase">{d.label}</p>
                          <p className="text-sm font-semibold text-foreground mt-0.5">{d.value}</p>
                        </div>
                      ))}
                    </div>
                  ) : (
                    <Button
                      variant="outline"
                      className="w-full gap-2"
                      onClick={handleCheckHoroscopeClick}
                    >
                      <Sparkles className="w-4 h-4" /> Check Horoscope
                    </Button>
                  )}
                </div>
              )}
            </div>
          </div>

          <div>
            <h3 className="font-serif text-lg font-bold text-foreground mb-3 flex items-center gap-2">
              <Phone className="w-5 h-5 text-primary" /> Contact Details
            </h3>
            <div className="p-4 rounded-xl bg-primary/5 border border-primary/15 relative">
              <div className={!isPreviewMode && hasPaidPlan() && contactRevealed ? "" : "blur-sm select-none pointer-events-none"}>
                <p className="text-sm text-foreground">+91 98765 43210</p>
                <p className="text-sm text-foreground mt-1">{displayName.toLowerCase().replace(/\s/g, "")}@gmail.com</p>
              </div>
              {(isPreviewMode && preview?.contact_locked) || (!isPreviewMode && !hasPaidPlan()) ? (
                <div className="absolute inset-0 flex items-center justify-center bg-white/60 backdrop-blur-[2px] rounded-xl">
                  <div className="text-center flex items-center gap-2 justify-center">
                    <Lock className="w-4 h-4 text-secondary shrink-0" />
                    <p className="text-sm font-semibold text-secondary">
                      {isPreviewMode ? "Unlock contact from profile to view details" : "Upgrade to Gold or Diamond plan to view contact"}
                    </p>
                  </div>
                </div>
              ) : null}
              {!isPreviewMode && hasPaidPlan() && !contactRevealed && (
                <div className="absolute inset-0 flex items-center justify-center bg-white/80 backdrop-blur-[2px] rounded-xl">
                  <Button variant="hero" className="gap-2" onClick={handleViewContactClick}>
                    <Eye className="w-4 h-4" /> View Contact
                  </Button>
                </div>
              )}
            </div>
          </div>
        </div>

        <UseCreditDialog
          open={creditDialogOpen}
          onOpenChange={setCreditDialogOpen}
          remaining={getHoroscopeRemaining()}
          quota={getHoroscopeQuota()}
          variant={creditDialogVariant}
          onConfirm={handleCreditConfirm}
          onUpgrade={() => onOpenPlanModal?.()}
        />

        {/* Footer Actions */}
        <div className="p-4 border-t border-primary/10 flex gap-3">
          <Button
            variant="hero"
            size="lg"
            className="flex-1 gap-2"
            onClick={handleSendInterest}
          >
            <Heart className="w-5 h-5" /> Send Interest
          </Button>
          <Button variant="outline" size="lg" onClick={() => onOpenChange(false)}>
            Close
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default ProfileViewDrawer;
