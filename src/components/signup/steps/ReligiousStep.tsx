import { SelectField } from "../SignupFormFields";

interface Props {
  formData: Record<string, string>;
  onChange: (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => void;
}

const ReligiousStep = ({ formData, onChange }: Props) => (
  <>
    <div className="text-center mb-6">
      <h1 className="font-serif text-2xl font-bold text-foreground mb-1">Religious Details</h1>
      <p className="text-muted-foreground text-sm">Please provide your religious information</p>
    </div>
    <div className="space-y-4">
      <SelectField label="Religion" name="religion" options={["Hindu", "Muslim", "Christian", "Sikh", "Buddhist", "Jain", "Other"]} value={formData.religion} onChange={onChange} />
      <SelectField label="Caste" name="caste" options={["Brahmin", "Kshatriya", "Vaishya", "Shudra", "SC/ST", "OBC", "Other"]} value={formData.caste} onChange={onChange} />
      <SelectField label="Sub-Caste" name="subCaste" options={["Iyer", "Iyengar", "Mudaliar", "Nadar", "Gounder", "Pillai", "Thevar", "Vanniyar", "Other"]} optional value={formData.subCaste} onChange={onChange} />
      <SelectField label="Mother Tongue" name="motherTongue" options={["Tamil", "Telugu", "Kannada", "Malayalam", "Hindi", "English", "Urdu", "Bengali", "Marathi", "Gujarati"]} value={formData.motherTongue} onChange={onChange} />
    </div>
  </>
);

export default ReligiousStep;
