import { SelectField, inputClass, labelClass } from "../SignupFormFields";

interface Props {
  formData: Record<string, string>;
  onChange: (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => void;
  hasChildren: "yes" | "no";
  setHasChildren: (v: "yes" | "no") => void;
}

const PersonalStep = ({ formData, onChange, hasChildren, setHasChildren }: Props) => (
  <>
    <div className="text-center mb-6">
      <h1 className="font-serif text-2xl font-bold text-foreground mb-1">Personal Details</h1>
      <p className="text-muted-foreground text-sm">Please provide your personal information</p>
    </div>
    <div className="space-y-4">
      <SelectField label="Marital Status" name="maritalStatus" options={["Never Married", "Divorced", "Widowed", "Separated"]} value={formData.maritalStatus} onChange={onChange} />
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
          <input type="number" name="numberOfChildren" value={formData.numberOfChildren} onChange={onChange} placeholder="Enter number of children" className={inputClass} />
        </div>
      )}
      <div>
        <label className={labelClass}>Height (in cm)</label>
        <input type="number" name="height" value={formData.height} onChange={onChange} placeholder="Enter height in centimeters" className={inputClass} />
      </div>
      <div>
        <label className={labelClass}>Weight (in kg)</label>
        <input type="number" name="weight" value={formData.weight} onChange={onChange} placeholder="Enter weight in kilograms" className={inputClass} />
      </div>
      <SelectField label="Skin Tone" name="skinTone" options={["Fair", "Wheatish", "Dark", "Very Fair"]} value={formData.skinTone} onChange={onChange} />
    </div>
  </>
);

export default PersonalStep;
