import { SelectField, labelClass } from "../SignupFormFields";

interface Props {
  formData: Record<string, string>;
  onChange: (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => void;
}

const LocationStep = ({ formData, onChange }: Props) => (
  <>
    <div className="text-center mb-6">
      <h1 className="font-serif text-2xl font-bold text-foreground mb-1">Location Details</h1>
      <p className="text-muted-foreground text-sm">Please provide your address information</p>
    </div>
    <div className="space-y-4">
      <SelectField label="Country" name="country" options={["India", "USA", "UK", "Canada", "Australia", "UAE", "Saudi Arabia", "Singapore", "Malaysia"]} value={formData.country} onChange={onChange} />
      <SelectField label="State" name="state" options={["Tamil Nadu", "Karnataka", "Kerala", "Andhra Pradesh", "Telangana", "Maharashtra", "Delhi", "Uttar Pradesh", "Gujarat", "Rajasthan", "West Bengal", "Punjab"]} value={formData.state} onChange={onChange} />
      <SelectField label="District" name="district" options={["Chennai", "Coimbatore", "Madurai", "Salem", "Tiruchirappalli", "Thanjavur", "Erode", "Tirunelveli", "Vellore"]} value={formData.district} onChange={onChange} />
      <SelectField label="City" name="city" options={["Chennai", "Coimbatore", "Madurai", "Salem", "Trichy", "Thanjavur", "Erode", "Tirunelveli"]} value={formData.city} onChange={onChange} />
      <div>
        <label className={labelClass}>Address</label>
        <textarea name="address" value={formData.address} onChange={onChange} placeholder="Enter your address" rows={3} className="w-full px-4 py-3 rounded-2xl border-2 border-primary/10 focus:border-primary focus:ring-0 transition-colors bg-white resize-none" />
      </div>
    </div>
  </>
);

export default LocationStep;
