import { SelectField, inputClass, labelClass } from "../SignupFormFields";

interface Props {
  formData: Record<string, string>;
  onChange: (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => void;
  hasChildren: "yes" | "no";
  setHasChildren: (v: "yes" | "no") => void;
}

const MARITAL_OPTIONS = ["Never Married", "Divorced", "Widowed", "Separated"];
const COLOR_OPTIONS = ["Fair", "Wheatish", "Dark", "Very Fair"];

const PersonalStep = ({ formData, onChange, hasChildren, setHasChildren }: Props) => {
  const showChildren =
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
        <SelectField label="Marital Status" name="maritalStatus" options={MARITAL_OPTIONS} value={formData.maritalStatus} onChange={onChange} />
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
        <SelectField label="Complexion / Color" name="skinTone" options={COLOR_OPTIONS} value={formData.skinTone} onChange={onChange} />
      </div>
    </>
  );
};

export default PersonalStep;
