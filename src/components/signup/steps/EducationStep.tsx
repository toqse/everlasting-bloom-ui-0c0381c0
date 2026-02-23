import { SelectField, inputClass, labelClass } from "../SignupFormFields";

interface Props {
  formData: Record<string, string>;
  onChange: (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => void;
}

const EducationStep = ({ formData, onChange }: Props) => (
  <>
    <div className="text-center mb-6">
      <h1 className="font-serif text-2xl font-bold text-foreground mb-1">Education &amp; Occupation Details</h1>
      <p className="text-muted-foreground text-sm">Please provide your educational and employment information</p>
    </div>
    <div className="space-y-4">
      <SelectField label="Highest Education" name="education" options={["High School", "Diploma", "Bachelor's", "Master's", "PhD", "Other"]} value={formData.education} onChange={onChange} />
      <SelectField label="Education Subject" name="educationSubject" options={["Engineering", "Medicine", "Arts", "Science", "Commerce", "Law", "IT/Computer Science", "Management", "Other"]} value={formData.educationSubject} onChange={onChange} />
      <SelectField label="Employment Status" name="employmentStatus" options={["Employed", "Self-Employed", "Business", "Unemployed", "Student", "Freelancer"]} value={formData.employmentStatus} onChange={onChange} />
      <div>
        <label className={labelClass}>Occupation / Job</label>
        <input type="text" name="occupation" value={formData.occupation} onChange={onChange} placeholder="e.g. Software Developer, Teacher, Engineer" className={inputClass} />
      </div>
    </div>
  </>
);

export default EducationStep;
