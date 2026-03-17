import { Image, IdCard, Smartphone, Users, PlusCircle, Check, FileImage } from "lucide-react";

const SLOTS = [
  { key: "full", label: "Full Photo (300x450)", size: "300x450 px", icon: Image },
  { key: "passport", label: "Passport Size (120x150)", size: "120x150 px", icon: IdCard },
  { key: "selfie", label: "Selfie", size: "Square px", icon: Smartphone },
  { key: "family", label: "Family Photo (400x180)", size: "400x180 px", icon: Users },
] as const;

const AADHAAR_SLOTS = [
  { key: "aadhaar_front", label: "Aadhaar Front", icon: FileImage },
  { key: "aadhaar_back", label: "Aadhaar Back", icon: FileImage },
] as const;

export interface PhotoSlotValue {
  file: File;
  previewUrl: string;
}

interface Props {
  photos: Record<string, PhotoSlotValue>;
  setPhotos: (p: Record<string, PhotoSlotValue>) => void;
  onSkipOrCompleteLater?: () => void;
}

const PhotosStep = ({
  photos,
  setPhotos,
  onSkipOrCompleteLater,
}: Props) => {
  const updateSlot = (key: string, file: File) => {
    const next = { ...photos };
    const existing = next[key];
    if (existing?.previewUrl) {
      URL.revokeObjectURL(existing.previewUrl);
    }
    const previewUrl = URL.createObjectURL(file);
    next[key] = { file, previewUrl };
    setPhotos(next);
  };
  const removeSlot = (key: string) => {
    const next = { ...photos };
    const existing = next[key];
    if (existing?.previewUrl) {
      URL.revokeObjectURL(existing.previewUrl);
    }
    delete next[key];
    setPhotos(next);
  };

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
                if (file) updateSlot(key, file);
                e.target.value = "";
              }}
            />
            {photos[key] ? (
              <div className="absolute inset-0 rounded-2xl overflow-hidden">
                <img src={photos[key].previewUrl} alt={label} className="w-full h-full object-cover" />
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
        <label className="block text-xs font-semibold text-foreground uppercase tracking-wide mb-3">
          Aadhaar front &amp; back photo
        </label>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          {AADHAAR_SLOTS.map(({ key, label, icon: Icon }) => (
            <label
              key={key}
              className={`relative flex flex-col items-center justify-center p-6 rounded-2xl border-2 border-dashed transition-all cursor-pointer min-h-[120px] ${
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
                  if (file) updateSlot(key, file);
                  e.target.value = "";
                }}
              />
              {photos[key] ? (
                <div className="absolute inset-0 rounded-2xl overflow-hidden">
                  <img src={photos[key].previewUrl} alt={label} className="w-full h-full object-cover" />
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
                  <div className="w-12 h-12 rounded-xl bg-primary/10 flex items-center justify-center mb-2">
                    <Icon className="w-6 h-6 text-primary" />
                  </div>
                  <span className="font-semibold text-foreground text-center text-sm">{label}</span>
                  <span className="mt-1 text-xs text-primary font-medium flex items-center gap-1">
                    <PlusCircle className="w-4 h-4" /> Upload photo
                  </span>
                </>
              )}
            </label>
          ))}
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
