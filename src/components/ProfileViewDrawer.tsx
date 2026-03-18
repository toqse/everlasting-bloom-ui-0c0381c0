import { useState, useEffect } from "react";
import { Dialog, DialogContent, DialogDescription, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { X, Heart, Sparkles, Lock, User, Briefcase, ClipboardList, Users, Moon, Phone, Eye, Loader2 } from "lucide-react";
import { Profile } from "@/components/FeaturedProfiles";
import { useAuthStore } from "@/stores/authStore";
import { useInterestStore } from "@/stores/interestStore";
import { toast } from "sonner";
import UseCreditDialog, { type CreditDialogVariant } from "@/components/UseCreditDialog";
import type { ProfilePreviewData } from "@/lib/matchesApi";
import { getProfileFull, unlockContactDetails } from "@/lib/matchesApi";
import { mapFullProfileToDrawerDisplay, type FullProfileDrawerDisplay } from "@/lib/profileFullMapper";
import { useRouter } from "next/navigation";

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
  const router = useRouter();

  const [contactRevealed, setContactRevealed] = useState(false);
  const [horoscopeRevealed, setHoroscopeRevealed] = useState(false);
  const [creditDialogOpen, setCreditDialogOpen] = useState(false);
  const [creditDialogVariant, setCreditDialogVariant] = useState<CreditDialogVariant>("contact");

  /** After GET /profiles/{id}/full/ */
  const [fullDisplay, setFullDisplay] = useState<FullProfileDrawerDisplay | null>(null);
  const [fullRawProfile, setFullRawProfile] = useState<Record<string, unknown> | null>(null);
  const [fullLoading, setFullLoading] = useState(false);
  const [unlockLoading, setUnlockLoading] = useState(false);
  const [unlockedContact, setUnlockedContact] = useState<{ phone: string; email: string } | null>(null);
  const [livePreview, setLivePreview] = useState<ProfilePreviewData | null>(preview ?? null);
  const [expandedFull, setExpandedFull] = useState(false);
  const [photoPreviewUrl, setPhotoPreviewUrl] = useState<string | null>(null);

  const activePreview = livePreview ?? preview ?? null;
  const isPreviewMode = !!activePreview;
  const isViewedByMe = !!activePreview?.is_viewed_by_me;

  useEffect(() => {
    if (!open) {
      setContactRevealed(false);
      setHoroscopeRevealed(false);
      setFullDisplay(null);
      setFullRawProfile(null);
      setUnlockedContact(null);
      setFullLoading(false);
      setUnlockLoading(false);
      setLivePreview(preview ?? null);
      setExpandedFull(false);
      setPhotoPreviewUrl(null);
    }
  }, [open, profile?.id, preview?.matri_id]);

  useEffect(() => {
    if (!open) return;
    setLivePreview(preview ?? null);
  }, [open, preview]);

  // If preview already grants access to full details (is_viewed_by_me),
  // hydrate drawer from the included nested `profile` object if present.
  useEffect(() => {
    if (!open) return;
    if (!isPreviewMode) return;
    if (!isViewedByMe) return;
    if (fullDisplay) return;

    const candidate = (activePreview as unknown as { profile?: unknown })?.profile ?? (activePreview as unknown);
    const mapped = mapFullProfileToDrawerDisplay(candidate);
    if (mapped) {
      setFullDisplay(mapped);
      if (candidate && typeof candidate === "object") {
        setFullRawProfile(candidate as Record<string, unknown>);
      }
      setExpandedFull(true);
    }
  }, [open, isPreviewMode, isViewedByMe, fullDisplay, activePreview]);

  if (!profile && !preview) return null;

  const fd = fullDisplay;

  const displayName =
    (fd?.name && fd.name.trim()) || activePreview?.name || profile?.name || "";
  const displayAge =
    fd && fd.age > 0 ? fd.age : activePreview?.age ?? profile?.age ?? 0;
  const displayLocation =
    (fd?.location && fd.location.trim()) ||
    (activePreview?.location ?? profile?.location)?.split(",")[0] ||
    "";
  const displayEducation =
    (fd?.education && fd.education.trim()) ||
    (activePreview?.education ?? profile?.education)?.split(",")[0] ||
    "";
  const displayOccupation =
    (fd?.occupation && fd.occupation.trim()) ||
    activePreview?.occupation ||
    profile?.profession ||
    "";
  const displayAbout =
    (fd?.about_me && fd.about_me.trim()) ||
    activePreview?.about_me ||
    (profile
      ? `${profile.education} graduate working in the ${profile.profession?.toLowerCase() ?? ""} sector in ${displayLocation}. I love music, dancing and exploring new places.`
      : "No description provided.");
  const displayFamily =
    (fd?.familyText && fd.familyText.trim()) ||
    activePreview?.family_background ||
    "No family details provided.";
  const displayReligion = fd?.religion?.trim() || activePreview?.religion || "Hindu";
  const displayCaste = fd?.caste?.trim() || activePreview?.caste || "Menon";
  const displayMaritalStatus =
    fd?.marital_status?.trim() || activePreview?.marital_status || "Never Married";
  const displayHeight = fd?.height?.trim() || activePreview?.height || "5'4\"";
  const displayMotherTongue =
    fd?.mother_tongue?.trim() || activePreview?.mother_tongue || "Malayalam";
  const displayAnnualIncome =
    fd?.annual_income?.trim() || activePreview?.annual_income || "₹5–8 Lakhs";
  const displayEmployment =
    (fd?.employment && fd.employment.trim() && fd.employment !== "—"
      ? fd.employment
      : null) || "Employed - Private";
  const displayField =
    displayOccupation && /engineer|it|software/i.test(displayOccupation)
      ? "Engineering / IT"
      : displayOccupation
        ? "Professional"
        : "—";

  const headerPhoto =
    fd?.profile_photo || activePreview?.profile_photo || profile?.image || null;

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

  const handleViewFullProfile = async () => {
    if (!activePreview?.matri_id) return;
    setFullLoading(true);
    try {
      const res = await getProfileFull(activePreview.matri_id);
      const raw = (res.data.profile ?? null) as unknown as Record<string, unknown> | null;
      setFullRawProfile(raw);
      const mapped = mapFullProfileToDrawerDisplay(raw);
      if (mapped) {
        setFullDisplay(mapped);
        setExpandedFull(true);
        const rem = res.data.plan?.profile_views_remaining;
        if (rem != null) {
          toast.success("Full profile loaded", {
            description: `${rem} profile view${rem === 1 ? "" : "s"} remaining on your plan.`,
          });
        } else {
          toast.success("Full profile loaded");
        }
      } else {
        toast.error("Could not read profile data from server.");
      }
    } catch (e) {
      toast.error(e instanceof Error ? e.message : "Failed to load full profile");
    } finally {
      setFullLoading(false);
    }
  };

  const handleUnlockContactApi = async () => {
    if (!activePreview?.matri_id) return;
    setUnlockLoading(true);
    try {
      const res = await unlockContactDetails(activePreview.matri_id);
      setUnlockedContact({
        phone: res.data.phone ?? "",
        email: res.data.email ?? "",
      });

      // After unlock succeeds, hydrate from FULL profile (not preview).
      try {
        const full = await getProfileFull(activePreview.matri_id);
        const raw = (full.data.profile ?? null) as unknown as Record<string, unknown> | null;
        setFullRawProfile(raw);
        const mapped = mapFullProfileToDrawerDisplay(raw);
        if (mapped) setFullDisplay(mapped);
        setExpandedFull(true);
      } catch {
        // ignore: we can still show phone/email from unlock response
      }

      toast.success("Contact details unlocked");
    } catch (e) {
      const anyErr = e as unknown as {
        status?: number;
        data?: { error?: { message?: string } };
        response?: { status?: number; data?: { error?: { message?: string } } };
      };

      const status = anyErr?.status ?? anyErr?.response?.status;
      const apiMsg = anyErr?.data?.error?.message ?? anyErr?.response?.data?.error?.message;
      const msg =
        e instanceof Error
          ? e.message
          : typeof apiMsg === "string" && apiMsg.trim()
            ? apiMsg
            : "Could not unlock contact";

      // Any 403 here means plan is required / not allowed → take user to Plans & Pricing.
      if (status === 403) {
        toast.info(msg || "Upgrade your plan to view contact details.");
        onOpenChange(false);
        router.push("/dashboard/plan");
        return;
      }

      toast.error(msg);
      if (msg.toLowerCase().includes("plan") || msg.toLowerCase().includes("upgrade")) {
        onOpenPlanModal?.();
      }
    } finally {
      setUnlockLoading(false);
    }
  };

  const phoneShown =
    unlockedContact?.phone || (fd?.hasContactInProfile ? fd.phone : null) || "";
  const emailShown =
    unlockedContact?.email || (fd?.hasContactInProfile ? fd.email : null) || "";
  const contactVisiblePreview = !!(phoneShown.trim() || emailShown.trim());

  const bd = (fullRawProfile?.basic_details as Record<string, unknown> | undefined) ?? undefined;
  const per = (fullRawProfile?.personal_details as Record<string, unknown> | undefined) ?? undefined;
  const loc = (fullRawProfile?.location_details as Record<string, unknown> | undefined) ?? undefined;
  const rel = (fullRawProfile?.religion_details as Record<string, unknown> | undefined) ?? undefined;
  const edu = (fullRawProfile?.education_details as Record<string, unknown> | undefined) ?? undefined;
  const photos = (fullRawProfile?.photos as Record<string, unknown> | undefined) ?? undefined;
  const fam = (fullRawProfile?.family_details as Record<string, unknown> | undefined) ?? undefined;

  const basicDetails = [
    { label: "AGE", value: `${displayAge} years` },
    { label: "LOCATION", value: displayLocation || "—" },
    { label: "RELIGION", value: displayReligion },
    { label: "CASTE", value: displayCaste },
    { label: "EDUCATION", value: displayEducation },
    { label: "MARITAL STATUS", value: displayMaritalStatus },
    { label: "HEIGHT", value: displayHeight },
    { label: "MOTHER TONGUE", value: displayMotherTongue },
  ];

  const careerDetails = [
    { label: "OCCUPATION", value: displayOccupation || "—" },
    { label: "EMPLOYMENT", value: displayEmployment },
    { label: "ANNUAL INCOME", value: displayAnnualIncome },
    { label: "FIELD", value: displayField },
  ];

  const horoscopeInfo = [
    { label: "RASI", value: "Chingam" },
    { label: "NAKSHATRA", value: "Atham" },
    { label: "PADA", value: "2" },
    { label: "MANGAL DOSHA", value: "No" },
  ];

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent
        hideCloseButton
        className={`${expandedFull ? "max-w-5xl" : "max-w-2xl"} w-[95vw] max-h-[90vh] overflow-y-auto rounded-2xl p-0 gap-0 border-0 shadow-elevated`}
      >
        <DialogTitle className="sr-only">{displayName}</DialogTitle>
        <DialogDescription className="sr-only">
          Profile preview and contact details
        </DialogDescription>
        <div className="bg-gradient-to-r from-primary via-primary-dark to-primary p-6 text-primary-foreground relative">
          <button
            type="button"
            onClick={() => onOpenChange(false)}
            className="absolute top-4 right-4 w-8 h-8 rounded-full bg-white/20 flex items-center justify-center hover:bg-white/30 transition-colors"
          >
            <X className="w-4 h-4" />
          </button>

          <div className="flex items-center gap-4">
            <div className="w-16 h-16 rounded-full bg-accent-rose/30 overflow-hidden flex items-center justify-center text-xl font-bold border-2 border-white/30 shrink-0">
              {headerPhoto ? (
                <img src={headerPhoto} alt="" className="w-full h-full object-cover" />
              ) : (
                displayName.split(" ").map((n) => n[0]).join("")
              )}
            </div>
            <div>
              <h2 className="font-serif text-2xl font-bold">{displayName}</h2>
              <p className="text-sm opacity-90">
                {displayAge} yrs · {displayLocation} · {displayEducation}
              </p>
              <div className="flex gap-2 mt-2 flex-wrap">
                <span className="px-2.5 py-0.5 bg-white/20 rounded-full text-xs font-semibold">
                  {displayReligion}
                </span>
                <span className="px-2.5 py-0.5 bg-secondary/80 text-secondary-foreground rounded-full text-xs font-semibold flex items-center gap-1">
                  <span>◆</span> {displayCaste}
                </span>
                {isHindu() && (
                  <span className="px-2.5 py-0.5 bg-white/20 rounded-full text-xs font-semibold flex items-center gap-1">
                    <Sparkles className="w-3 h-3" /> Jathagam Available
                  </span>
                )}
                {isPreviewMode && (fullDisplay || isViewedByMe) && (
                  <span className="px-2.5 py-0.5 bg-emerald-500/90 rounded-full text-xs font-semibold">
                    Full profile
                  </span>
                )}
              </div>
            </div>
          </div>
        </div>

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
                <p className="text-sm text-muted-foreground leading-relaxed whitespace-pre-wrap">
                  {displayFamily || "No family details provided."}
                </p>
              </div>

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
                    <Button variant="outline" className="w-full gap-2" type="button" onClick={handleCheckHoroscopeClick}>
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
            <div className="p-4 rounded-xl bg-primary/5 border border-primary/15 relative min-h-[100px]">
              {isPreviewMode ? (
                <>
                  {!fullDisplay && !isViewedByMe && (
                    <div className="flex flex-col items-center justify-center gap-4 py-6 text-center">
                      <div className="blur-sm select-none pointer-events-none opacity-50">
                        <p className="text-sm text-foreground">+91 ••••• •••••</p>
                        <p className="text-sm text-foreground mt-1">••••••••@••••.com</p>
                      </div>
                      <p className="text-sm text-muted-foreground max-w-sm">
                        Phone and email may require unlocking based on your plan quota.
                      </p>
                      <Button
                        type="button"
                        variant="hero"
                        className="gap-2"
                        disabled={unlockLoading}
                        onClick={handleUnlockContactApi}
                      >
                        {unlockLoading ? (
                          <>
                            <Loader2 className="w-4 h-4 animate-spin" /> Unlocking…
                          </>
                        ) : (
                          <>
                            <Phone className="w-4 h-4" /> View contact details
                          </>
                        )}
                      </Button>
                    </div>
                  )}

                  {fullDisplay && !contactVisiblePreview && (
                    <div className="flex flex-col items-center justify-center gap-3 py-4 text-center">
                      <Lock className="w-8 h-8 text-muted-foreground" />
                      <p className="text-sm text-muted-foreground">
                        Phone and email are not included in this profile view. Unlock contact details using your plan
                        quota.
                      </p>
                      <Button
                        type="button"
                        variant="hero"
                        className="gap-2"
                        disabled={unlockLoading}
                        onClick={handleUnlockContactApi}
                      >
                        {unlockLoading ? (
                          <>
                            <Loader2 className="w-4 h-4 animate-spin" /> Unlocking…
                          </>
                        ) : (
                          <>
                            <Phone className="w-4 h-4" /> View contact details
                          </>
                        )}
                      </Button>
                    </div>
                  )}

                  {fullDisplay && contactVisiblePreview && (
                    <div className="space-y-2">
                      {phoneShown ? (
                        <p className="text-sm font-medium text-foreground">
                          <span className="text-muted-foreground font-normal">Phone: </span>
                          {phoneShown}
                        </p>
                      ) : null}
                      {emailShown ? (
                        <p className="text-sm font-medium text-foreground break-all">
                          <span className="text-muted-foreground font-normal">Email: </span>
                          {emailShown}
                        </p>
                      ) : null}
                    </div>
                  )}
                </>
              ) : (
                <>
                  <div
                    className={
                      hasPaidPlan() && contactRevealed ? "" : "blur-sm select-none pointer-events-none"
                    }
                  >
                    <p className="text-sm text-foreground">+91 98765 43210</p>
                    <p className="text-sm text-foreground mt-1">
                      {displayName.toLowerCase().replace(/\s/g, "")}@gmail.com
                    </p>
                  </div>
                  {!hasPaidPlan() ? (
                    <div className="absolute inset-0 flex items-center justify-center bg-white/60 backdrop-blur-[2px] rounded-xl">
                      <div className="text-center flex items-center gap-2 justify-center px-2">
                        <Lock className="w-4 h-4 text-secondary shrink-0" />
                        <p className="text-sm font-semibold text-secondary">
                          Upgrade to Gold or Diamond plan to view contact
                        </p>
                      </div>
                    </div>
                  ) : null}
                  {hasPaidPlan() && !contactRevealed && (
                    <div className="absolute inset-0 flex items-center justify-center bg-white/80 backdrop-blur-[2px] rounded-xl">
                      <Button variant="hero" className="gap-2" type="button" onClick={handleViewContactClick}>
                        <Eye className="w-4 h-4" /> View Contact
                      </Button>
                    </div>
                  )}
                </>
              )}
            </div>
          </div>

          {expandedFull && fullRawProfile ? (
            <div className="space-y-6">
              <div className="flex items-center justify-between gap-3">
                <h3 className="font-serif text-lg font-bold text-foreground">
                  Full Profile Details
                </h3>
                <Button type="button" variant="outline" size="sm" onClick={() => setExpandedFull(false)}>
                  Collapse
                </Button>
              </div>

              <div className="grid lg:grid-cols-2 gap-6">
                <div>
                  <h4 className="font-serif text-base font-bold text-foreground mb-3">Basic</h4>
                  <div className="grid grid-cols-2 gap-2">
                    {[
                      { label: "Matri ID", value: fullRawProfile.matri_id ?? "—" },
                      { label: "Gender", value: bd?.gender ?? "—" },
                      { label: "DOB", value: bd?.dob ?? "—" },
                      { label: "Profile for", value: bd?.profile_for ?? "—" },
                    ].map((d, i) => (
                      <div key={i} className="p-3 rounded-xl border border-primary/10 bg-card">
                        <p className="text-[10px] font-bold text-primary uppercase">{d.label}</p>
                        <p className="text-sm font-semibold text-foreground mt-0.5">{String(d.value)}</p>
                      </div>
                    ))}
                  </div>
                </div>

                <div>
                  <h4 className="font-serif text-base font-bold text-foreground mb-3">Personal</h4>
                  <div className="grid grid-cols-2 gap-2">
                    {[
                      { label: "Marital status", value: per?.marital_status ?? "—" },
                      { label: "Children", value: per?.children_count ?? "—" },
                      { label: "Height", value: per?.height_cm ?? "—" },
                      { label: "Weight", value: per?.weight_kg ?? "—" },
                      { label: "Colour", value: per?.colour ?? "—" },
                      { label: "Blood group", value: per?.blood_group ?? "—" },
                    ].map((d, i) => (
                      <div key={i} className="p-3 rounded-xl border border-primary/10 bg-card">
                        <p className="text-[10px] font-bold text-primary uppercase">{d.label}</p>
                        <p className="text-sm font-semibold text-foreground mt-0.5">{String(d.value)}</p>
                      </div>
                    ))}
                  </div>
                </div>
              </div>

              <div className="grid lg:grid-cols-2 gap-6">
                <div>
                  <h4 className="font-serif text-base font-bold text-foreground mb-3">Location</h4>
                  <div className="grid grid-cols-2 gap-2">
                    {[
                      { label: "Country", value: loc?.country ?? "—" },
                      { label: "State", value: loc?.state ?? "—" },
                      { label: "District", value: loc?.district ?? "—" },
                      { label: "City", value: loc?.city ?? "—" },
                    ].map((d, i) => (
                      <div key={i} className="p-3 rounded-xl border border-primary/10 bg-card">
                        <p className="text-[10px] font-bold text-primary uppercase">{d.label}</p>
                        <p className="text-sm font-semibold text-foreground mt-0.5">{String(d.value)}</p>
                      </div>
                    ))}
                    <div className="col-span-2 p-3 rounded-xl border border-primary/10 bg-card">
                      <p className="text-[10px] font-bold text-primary uppercase">Address</p>
                      <p className="text-sm font-semibold text-foreground mt-0.5 whitespace-pre-wrap">
                        {String(loc?.address ?? "—")}
                      </p>
                    </div>
                  </div>
                </div>

                <div>
                  <h4 className="font-serif text-base font-bold text-foreground mb-3">Education & Work</h4>
                  <div className="grid grid-cols-2 gap-2">
                    {[
                      { label: "Education", value: edu?.highest_education ?? "—" },
                      { label: "Subject", value: edu?.education_subject ?? "—" },
                      { label: "Employment", value: edu?.employment_status ?? "—" },
                      { label: "Occupation", value: edu?.occupation ?? "—" },
                      { label: "Annual income", value: edu?.annual_income ?? "—" },
                    ].map((d, i) => (
                      <div key={i} className={`${d.label === "Annual income" ? "col-span-2" : ""} p-3 rounded-xl border border-primary/10 bg-card`}>
                        <p className="text-[10px] font-bold text-primary uppercase">{d.label}</p>
                        <p className="text-sm font-semibold text-foreground mt-0.5">{String(d.value)}</p>
                      </div>
                    ))}
                  </div>
                </div>
              </div>

              <div className="grid lg:grid-cols-2 gap-6">
                <div>
                  <h4 className="font-serif text-base font-bold text-foreground mb-3">Religion</h4>
                  <div className="grid grid-cols-2 gap-2">
                    {[
                      { label: "Religion", value: rel?.religion ?? "—" },
                      { label: "Caste", value: rel?.caste ?? "—" },
                      { label: "Mother tongue", value: rel?.mother_tongue ?? "—" },
                      { label: "Preference type", value: rel?.partner_preference_type ?? "—" },
                    ].map((d, i) => (
                      <div key={i} className="p-3 rounded-xl border border-primary/10 bg-card">
                        <p className="text-[10px] font-bold text-primary uppercase">{d.label}</p>
                        <p className="text-sm font-semibold text-foreground mt-0.5">{String(d.value)}</p>
                      </div>
                    ))}
                  </div>
                </div>

                <div>
                  <h4 className="font-serif text-base font-bold text-foreground mb-3">Family</h4>
                  <div className="p-4 rounded-xl border border-primary/10 bg-accent-rose/5">
                    {fam && Object.keys(fam).length ? (
                      <div className="grid grid-cols-2 gap-2">
                        {Object.entries(fam).map(([k, v]) => (
                          <div key={k} className="p-3 rounded-xl border border-primary/10 bg-card">
                            <p className="text-[10px] font-bold text-primary uppercase">{k.replace(/_/g, " ")}</p>
                            <p className="text-sm font-semibold text-foreground mt-0.5">{String(v ?? "—")}</p>
                          </div>
                        ))}
                      </div>
                    ) : (
                      <p className="text-sm text-muted-foreground leading-relaxed">No family details provided.</p>
                    )}
                  </div>
                </div>
              </div>

              {photos && Object.keys(photos).length ? (
                <div>
                  <h4 className="font-serif text-base font-bold text-foreground mb-3">Photos</h4>
                  <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-3">
                    {Object.entries(photos)
                      .filter(([, v]) => typeof v === "string" && String(v).trim())
                      .map(([k, v]) => (
                        <button
                          key={k}
                          type="button"
                          onClick={() => setPhotoPreviewUrl(String(v))}
                          className="text-left rounded-xl border border-primary/10 bg-card overflow-hidden hover:ring-2 hover:ring-primary/20 transition-all"
                        >
                          <div className="px-3 py-2 border-b border-primary/10">
                            <p className="text-[10px] font-bold text-primary uppercase">{k.replace(/_/g, " ")}</p>
                          </div>
                          <div className="aspect-[4/3] bg-muted">
                            <img src={String(v)} alt="" className="w-full h-full object-cover" />
                          </div>
                        </button>
                      ))}
                  </div>
                </div>
              ) : null}
            </div>
          ) : null}
        </div>

        <Dialog open={!!photoPreviewUrl} onOpenChange={(o) => !o && setPhotoPreviewUrl(null)}>
          <DialogContent className="max-w-4xl w-[95vw] p-0 overflow-hidden rounded-2xl border-0">
            <DialogTitle className="sr-only">Photo preview</DialogTitle>
            <DialogDescription className="sr-only">Preview photo</DialogDescription>
            <div className="relative bg-black">
              <button
                type="button"
                onClick={() => setPhotoPreviewUrl(null)}
                className="absolute top-3 right-3 z-10 w-9 h-9 rounded-full bg-white/15 hover:bg-white/25 text-white flex items-center justify-center transition-colors"
                aria-label="Close"
              >
                <X className="w-4 h-4" />
              </button>
              {photoPreviewUrl ? (
                <img src={photoPreviewUrl} alt="" className="w-full max-h-[80vh] object-contain" />
              ) : null}
            </div>
          </DialogContent>
        </Dialog>

        <UseCreditDialog
          open={creditDialogOpen}
          onOpenChange={setCreditDialogOpen}
          remaining={getHoroscopeRemaining()}
          quota={getHoroscopeQuota()}
          variant={creditDialogVariant}
          onConfirm={handleCreditConfirm}
          onUpgrade={() => onOpenPlanModal?.()}
        />

        <div className="p-4 border-t border-primary/10 flex gap-3">
          <Button variant="hero" size="lg" className="flex-1 gap-2" type="button" onClick={handleSendInterest}>
            <Heart className="w-5 h-5" /> Send Interest
          </Button>
          <Button variant="outline" size="lg" type="button" onClick={() => onOpenChange(false)}>
            Close
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default ProfileViewDrawer;
