import { useMemo, useState } from "react";
import { SelectField, labelClass } from "../SignupFormFields";
import { RELIGION_CASTE_MAP, MOTHER_TONGUES } from "@/data/religionCaste";
import { Home, Globe, CheckSquare, Check } from "lucide-react";
import { motion } from "framer-motion";

interface Props {
  formData: Record<string, string>;
  onChange: (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => void;
  interCaste: boolean;
  setInterCaste: (v: boolean) => void;
}

const RELIGIONS = ["Hindu", "Christian", "Muslim", "Caste no bar", "Intercaste"];

/** Options shown when "Specific Religions" is selected for partner preference */
const PARTNER_RELIGION_OPTIONS = ["Hindu", "Christian", "Muslim"];

type CastePref = "own" | "open" | "specific";

const ReligiousStep = ({ formData, onChange }: Props) => {
  const casteOptions = useMemo(() => {
    const r = formData.religion || "";
    return RELIGION_CASTE_MAP[r] || [];
  }, [formData.religion]);

  const [castePref, setCastePref] = useState<CastePref>("open");
  const [selectedCastes, setSelectedCastes] = useState<string[]>([]);

  const toggleCaste = (c: string) => {
    setSelectedCastes(prev => prev.includes(c) ? prev.filter(x => x !== c) : [...prev, c]);
  };

  const castePreferenceOptions: { key: CastePref; icon: React.ReactNode; label: string; desc: string }[] = [
    { key: "own", icon: <Home className="w-5 h-5" />, label: "Own Religion Only", desc: "Same religion profiles only" },
    { key: "open", icon: <Globe className="w-5 h-5" />, label: "Open to All Religions", desc: "No restriction at all" },
    { key: "specific", icon: <CheckSquare className="w-5 h-5" />, label: "Specific Religions", desc: "I'll choose which ones" },
  ];

  return (
    <>
      <div className="text-center mb-6">
        <h1 className="font-serif text-2xl font-bold text-foreground mb-1">Religious Details</h1>
      </div>
      <div className="space-y-5">
        <div className="grid grid-cols-2 gap-4">
          <SelectField label="Religion *" name="religion" options={RELIGIONS} value={formData.religion} onChange={onChange} />
          {casteOptions.length > 0 && (
            <SelectField label="Caste" name="caste" options={casteOptions} value={formData.caste} onChange={onChange} />
          )}
        </div>


        <SelectField label="Mother Tongue *" name="motherTongue" options={MOTHER_TONGUES} value={formData.motherTongue} onChange={onChange} />

        {/* Partner Religion Preference - only for Hindu, Christian, Muslim */}
        {formData.religion && !["Caste no bar", "Intercaste"].includes(formData.religion) && (
          <div className="pt-2">
            <div className="border-t border-primary/10 pt-4">
              <h3 className="font-serif text-lg font-bold text-foreground mb-1 flex items-center gap-2">
                🤝 Partner Religion Preference
              </h3>
              <p className="text-sm text-muted-foreground mb-4">
                Which {formData.religion} groups are you open to?
              </p>
              <div className="grid grid-cols-3 gap-3">
                {castePreferenceOptions.map(opt => (
                  <button
                    key={opt.key}
                    type="button"
                    onClick={() => { setCastePref(opt.key); if (opt.key !== "specific") setSelectedCastes([]); }}
                    className={`p-3 rounded-xl border-2 text-center transition-all flex flex-col items-center gap-1.5 ${
                      castePref === opt.key
                        ? "border-primary bg-primary/5 shadow-soft"
                        : "border-primary/10 hover:border-primary/30 bg-card"
                    }`}
                  >
                    <span className={castePref === opt.key ? "text-primary" : "text-muted-foreground"}>{opt.icon}</span>
                    <p className={`text-xs font-bold ${castePref === opt.key ? "text-primary" : "text-foreground"}`}>{opt.label}</p>
                    <p className="text-[10px] text-muted-foreground">{opt.desc}</p>
                    {castePref === opt.key && <Check className="w-4 h-4 text-primary" />}
                  </button>
                ))}
              </div>

              {castePref === "specific" && (
                <motion.div
                  initial={{ opacity: 0, height: 0 }}
                  animate={{ opacity: 1, height: "auto" }}
                  className="mt-4 p-4 rounded-xl border border-primary/10 bg-card"
                >
                  <p className="text-sm font-bold text-foreground mb-2">Select religions you're open to:</p>
                  <p className="text-xs text-muted-foreground mb-3">You can select one or more</p>
                  <div className="flex flex-wrap gap-2">
                    {PARTNER_RELIGION_OPTIONS.map(rel => (
                      <button
                        key={rel}
                        type="button"
                        onClick={() => toggleCaste(rel)}
                        className={`px-3 py-1.5 rounded-full text-sm font-medium transition-all ${
                          selectedCastes.includes(rel)
                            ? "bg-primary text-primary-foreground"
                            : "bg-muted text-foreground hover:bg-primary/10"
                        }`}
                      >
                        {rel}
                      </button>
                    ))}
                  </div>
                </motion.div>
              )}
            </div>
          </div>
        )}
      </div>
    </>
  );
};

export default ReligiousStep;
