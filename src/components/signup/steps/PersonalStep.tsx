import { useEffect, useState } from "react";
import { SelectField, inputClass, labelClass } from "../SignupFormFields";
import { getComplexions, getMaritalStatuses } from "@/lib/masterApi";
import {
  complexionNamesFromMaster,
  VALID_COMPLEXION_OPTIONS,
} from "@/constants/complexionOptions";

interface Props {
  formData: Record<string, string>;
  onChange: (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => void;
  hasChildren: "yes" | "no";
  setHasChildren: (v: "yes" | "no") => void;
}

const MARITAL_OPTIONS = [
  "Awaiting Divorce",
  "Divorced",
  "Married",
  "Never Married",
  "Separated",
  "Widowed",
];
const COLOR_OPTIONS = [...VALID_COMPLEXION_OPTIONS];

const PersonalStep = ({ formData, onChange, hasChildren, setHasChildren }: Props) => {
  const [maritalOptions, setMaritalOptions] = useState<string[]>(MARITAL_OPTIONS);
  const [colorOptions, setColorOptions] = useState<string[]>(COLOR_OPTIONS);

  useEffect(() => {
    let cancelled = false;
    const loadMasterOptions = async () => {
      try {
        const [statuses, complexions] = await Promise.all([
          getMaritalStatuses(),
          getComplexions(),
        ]);
        if (cancelled) return;
        const maritalNames = statuses
          .map((status) => status?.name?.trim())
          .filter((name): name is string => !!name);
        if (maritalNames.length > 0) {
          setMaritalOptions(Array.from(new Set(maritalNames)));
        }
        const complexionNames = complexionNamesFromMaster(complexions);
        if (complexionNames.length > 0) {
          setColorOptions(complexionNames);
        }
      } catch {
        // Keep fallback options if API fails.
      }
    };
    void loadMasterOptions();
    return () => {
      cancelled = true;
    };
  }, []);

  const showChildren =
    formData.maritalStatus === "Awaiting Divorce" ||
    formData.maritalStatus === "Divorced" ||
    formData.maritalStatus === "Widowed" ||
    formData.maritalStatus === "Separated";

  return (
    <>
      <div className="text-center mb-6">
        <h1 className="font-serif text-2xl font-bold text-foreground mb-1">Personal Details</h1>
        <p className="text-muted-foreground text-sm">Marital status, Height, Weight (optional), Color</p>
      </div>
      <div className="space-y-4">
        <SelectField label="Marital Status" name="maritalStatus" options={maritalOptions} value={formData.maritalStatus} onChange={onChange} />
        {formData.maritalStatus === "Divorced" && (
          <div>
            <label className={labelClass}>Reason for Divorce</label>
            <input
              type="text"
              name="reasonForDivorce"
              value={formData.reasonForDivorce ?? ""}
              onChange={onChange}
              placeholder="e.g. Mutual consent"
              className={inputClass}
            />
          </div>
        )}
        {showChildren && (
          <>
            <div>
              <label className={labelClass}>Do you have children?</label>
              <div className="flex gap-6 mt-1">
                <label className="flex items-center gap-2 cursor-pointer">
                  <input type="radio" name="hasChildren" checked={hasChildren === "yes"} onChange={() => setHasChildren("yes")} className="w-5 h-5 text-primary focus:ring-primary" />
                  <span className="text-foreground">Yes</span>
                </label>
                <label className="flex items-center gap-2 cursor-pointer">
                  <input type="radio" name="hasChildren" checked={hasChildren === "no"} onChange={() => setHasChildren("no")} className="w-5 h-5 text-primary focus:ring-primary" />
                  <span className="text-foreground">No</span>
                </label>
              </div>
            </div>
            {hasChildren === "yes" && (
              <div>
                <label className={labelClass}>Number of Children</label>
                <input type="number" name="numberOfChildren" value={formData.numberOfChildren} onChange={onChange} placeholder="Enter number of children" min={1} className={inputClass} />
              </div>
            )}
          </>
        )}
        <div>
          <label className={labelClass}>Height (cm)</label>
          <input type="number" name="height" value={formData.height} onChange={onChange} placeholder="e.g. 165" className={inputClass} />
        </div>
        <div>
          <label className={labelClass}>Weight (kg) <span className="text-muted-foreground">(Optional)</span></label>
          <input type="number" name="weight" value={formData.weight} onChange={onChange} placeholder="e.g. 65" className={inputClass} />
        </div>
        <SelectField label="Complexion / Color" name="skinTone" options={colorOptions} value={formData.skinTone} onChange={onChange} />
      </div>
    </>
  );
};

export default PersonalStep;
