import { useMemo } from "react";
import { SelectField, labelClass } from "../SignupFormFields";
import { RELIGION_CASTE_MAP, MOTHER_TONGUES } from "@/data/religionCaste";

interface Props {
  formData: Record<string, string>;
  onChange: (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => void;
  interCaste: boolean;
  setInterCaste: (v: boolean) => void;
}

const RELIGIONS = Object.keys(RELIGION_CASTE_MAP);

const ReligiousStep = ({ formData, onChange, interCaste, setInterCaste }: Props) => {
  const casteOptions = useMemo(() => {
    const r = formData.religion || "";
    return RELIGION_CASTE_MAP[r] || [];
  }, [formData.religion]);

  return (
    <>
      <div className="text-center mb-6">
        <h1 className="font-serif text-2xl font-bold text-foreground mb-1">Religious Details</h1>
        <p className="text-muted-foreground text-sm">Religion, Caste (auto by religion), Mother Tongue</p>
      </div>
      <div className="space-y-4">
        <SelectField label="Religion" name="religion" options={RELIGIONS} value={formData.religion} onChange={onChange} />
        {!interCaste && (
          <SelectField label="Caste" name="caste" options={casteOptions} value={formData.caste} onChange={onChange} />
        )}
        <div className="flex items-center gap-3">
          <input
            type="checkbox"
            id="interCaste"
            checked={interCaste}
            onChange={(e) => setInterCaste(e.target.checked)}
            className="w-5 h-5 rounded border-primary/30 text-primary focus:ring-primary"
          />
          <label htmlFor="interCaste" className="text-sm text-foreground cursor-pointer">
            Inter-Caste marriage (hide caste)
          </label>
        </div>
        <SelectField label="Mother Tongue" name="motherTongue" options={MOTHER_TONGUES} value={formData.motherTongue} onChange={onChange} />
      </div>
    </>
  );
};

export default ReligiousStep;
