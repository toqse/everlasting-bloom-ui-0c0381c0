import { Image, IdCard, Smartphone, Users, PlusCircle, Check } from "lucide-react";

const SLOTS = [
  { key: "full", label: "Full Photo (300x450)", size: "300x450 px", icon: Image },
  { key: "passport", label: "Passport Size (120x150)", size: "120x150 px", icon: IdCard },
  { key: "selfie", label: "Selfie", size: "Square px", icon: Smartphone },
  { key: "family", label: "Family Photo (400x180)", size: "400x180 px", icon: Users },
] as const;

interface Props {
  photos: Record<string, string>;
  setPhotos: (p: Record<string, string>) => void;
  aadhaarNumber: string;
  onAadhaarChange: (value: string) => void;
  aadhaarVerified: boolean;
  onVerifyAadhaar: () => void;
  onSkipOrCompleteLater?: () => void;
}

const PhotosStep = ({
  photos,
  setPhotos,
  aadhaarNumber,
  onAadhaarChange,
  aadhaarVerified,
  onVerifyAadhaar,
  onSkipOrCompleteLater,
}: Props) => {
  const updateSlot = (key: string, url: string) => {
    setPhotos({ ...photos, [key]: url });
  };
  const removeSlot = (key: string) => {
    const next = { ...photos };
    delete next[key];
    setPhotos(next);
  };

  const handleAadhaarInput = (e: React.ChangeEvent<HTMLInputElement>) => {
    const raw = e.target.value.replace(/\D/g, "").slice(0, 12);
    onAadhaarChange(raw);
  };

  const displayAadhaar = aadhaarNumber
    ? aadhaarNumber.replace(/(\d{4})(?=\d)/g, "$1 ").trim()
    : "";

  return (
    <>
      <div className="mb-6 flex flex-wrap items-center justify-between gap-2">
        <div>
          <h1 className="font-serif text-2xl font-bold text-foreground mb-1 text-left">Add Photos</h1>
          <p className="text-muted-foreground text-sm text-left">
            Photos greatly improve your match rate. All photos are auto-cropped to the required size.
          </p>
        </div>
        {onSkipOrCompleteLater && (
          <button
            type="button"
            onClick={onSkipOrCompleteLater}
            className="text-sm text-muted-foreground hover:text-primary transition-colors underline-offset-2 hover:underline"
          >
            Skip / Complete later
          </button>
        )}
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-8">
        {SLOTS.map(({ key, label, size, icon: Icon }) => (
          <label
            key={key}
            className={`relative flex flex-col items-center justify-center p-6 rounded-2xl border-2 border-dashed transition-all cursor-pointer min-h-[140px] ${
              photos[key]
                ? "border-primary/30 bg-primary/5"
                : "border-primary/20 bg-white hover:border-primary/40 hover:bg-accent-rose/30"
            }`}
          >
            <input
              type="file"
              accept="image/*"
              className="hidden"
              onChange={(e) => {
                const file = e.target.files?.[0];
                if (file) updateSlot(key, URL.createObjectURL(file));
                e.target.value = "";
              }}
            />
            {photos[key] ? (
              <div className="absolute inset-0 rounded-2xl overflow-hidden">
                <img src={photos[key]} alt={label} className="w-full h-full object-cover" />
                <button
                  type="button"
                  onClick={(e) => {
                    e.preventDefault();
                    removeSlot(key);
                  }}
                  className="absolute top-2 right-2 w-7 h-7 rounded-full bg-black/50 text-white flex items-center justify-center text-sm hover:bg-black/70"
                >
                  ×
                </button>
              </div>
            ) : (
              <>
                <div className="w-12 h-12 rounded-xl bg-primary/10 flex items-center justify-center mb-3">
                  <Icon className="w-6 h-6 text-primary" />
                </div>
                <span className="font-semibold text-foreground text-center text-sm">{label}</span>
                <span className="text-xs text-muted-foreground mt-0.5">{size}</span>
                <span className="mt-2 text-xs text-primary font-medium flex items-center gap-1">
                  <PlusCircle className="w-4 h-4" /> Add photo
                </span>
              </>
            )}
          </label>
        ))}
      </div>

      <div className="rounded-2xl border-2 border-primary/10 bg-white p-6">
        <div className="flex items-center justify-between gap-2 mb-4">
          <h2 className="font-serif text-lg font-bold text-foreground">ID Verification (Aadhaar)</h2>
          <span className="shrink-0 px-2.5 py-1 rounded-full bg-primary/20 text-primary text-xs font-semibold">
            OPTIONAL
          </span>
        </div>
        <div className="space-y-2">
          <label className="block text-xs font-semibold text-foreground uppercase tracking-wide">
            AADHAAR NUMBER
          </label>
          <div className="flex flex-col sm:flex-row gap-3">
            <input
              type="text"
              inputMode="numeric"
              placeholder="XXXX XXXX XXXX"
              value={displayAadhaar}
              onChange={handleAadhaarInput}
              maxLength={14}
              className="flex-1 px-4 py-3 rounded-xl border-2 border-primary/10 focus:border-primary focus:ring-0 bg-white text-foreground placeholder:text-muted-foreground"
            />
            <button
              type="button"
              onClick={onVerifyAadhaar}
              disabled={aadhaarNumber.replace(/\D/g, "").length !== 12}
              className="shrink-0 px-5 py-3 rounded-xl bg-primary text-primary-foreground font-semibold hover:bg-primary/90 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
            >
              Verify Aadhaar
            </button>
          </div>
        </div>
        <div className="mt-3 flex items-start gap-2">
          <div className="w-5 h-5 rounded bg-green-500 flex items-center justify-center shrink-0 mt-0.5">
            <Check className="w-3 h-3 text-white" strokeWidth={3} />
          </div>
          <p className="text-sm text-muted-foreground">
            Verified badge shown on your profile. Stored securely in app memory.
          </p>
        </div>
      </div>
    </>
  );
};

export default PhotosStep;
