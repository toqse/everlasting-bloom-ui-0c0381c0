import { useState, useMemo } from "react";
import { SelectField, inputClass, labelClass } from "../SignupFormFields";

const OCCUPATIONS = [
  "Software Engineer", "Doctor", "Teacher", "CA", "Lawyer", "Business", "Government Job",
  "Banking", "Nurse", "Architect", "Designer", "Marketing", "HR", "Accountant",
  "Engineer (Civil)", "Engineer (Mech)", "Engineer (ECE)", "Professor", "Freelancer", "Other",
];

const INCOME_RANGES = ["Not specified", "Below 1 Lakh", "1-2 Lakh", "2-5 Lakh", "5-10 Lakh", "10-25 Lakh", "25 Lakh+"];

interface Props {
  formData: Record<string, string>;
  onChange: (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => void;
}

const EducationStep = ({ formData, onChange }: Props) => {
  const [occupationSearch, setOccupationSearch] = useState("");
  const filteredOccupations = useMemo(() => {
    const q = occupationSearch.trim().toLowerCase();
    if (!q) return OCCUPATIONS;
    return OCCUPATIONS.filter((o) => o.toLowerCase().includes(q));
  }, [occupationSearch]);

  return (
    <>
      <div className="text-center mb-6">
        <h1 className="font-serif text-2xl font-bold text-foreground mb-1">Education & Occupation</h1>
        <p className="text-muted-foreground text-sm">Education, Subject, Employment, Occupation with search, Annual Income</p>
      </div>
      <div className="space-y-4">
        <SelectField label="Highest Education" name="education" options={["High School", "Diploma", "Bachelor's", "Master's", "PhD", "Other"]} value={formData.education} onChange={onChange} />
        <SelectField label="Subject" name="educationSubject" options={["Engineering", "Medicine", "Arts", "Science", "Commerce", "Law", "IT/Computer Science", "Management", "Other"]} value={formData.educationSubject} onChange={onChange} />
        <SelectField label="Employment" name="employmentStatus" options={["Employed", "Self-Employed", "Business", "Unemployed", "Student", "Freelancer"]} value={formData.employmentStatus} onChange={onChange} />
        <div>
          <label className={labelClass}>Occupation (search)</label>
          <input
            type="text"
            value={occupationSearch !== "" ? occupationSearch : formData.occupation}
            onChange={(e) => {
              const v = e.target.value;
              setOccupationSearch(v);
              onChange({ ...e, target: { ...e.target, name: "occupation", value: v } });
            }}
            onFocus={() => setOccupationSearch(occupationSearch || formData.occupation)}
            placeholder="Search or type occupation"
            className={inputClass}
            list="occupation-list"
          />
          <datalist id="occupation-list">
            {filteredOccupations.map((o) => (
              <option key={o} value={o} />
            ))}
          </datalist>
          {occupationSearch && (
            <div className="mt-1 max-h-32 overflow-y-auto rounded-xl border border-primary/10 bg-white">
              {filteredOccupations.slice(0, 8).map((o) => (
                <button
                  key={o}
                  type="button"
                  className="w-full px-4 py-2 text-left text-sm hover:bg-primary/10"
                  onClick={() => {
                    setOccupationSearch("");
                    onChange({ target: { name: "occupation", value: o } } as React.ChangeEvent<HTMLInputElement>);
                  }}
                >
                  {o}
                </button>
              ))}
            </div>
          )}
        </div>
        <SelectField label="Annual Income" name="annualIncome" options={INCOME_RANGES} value={formData.annualIncome || ""} onChange={onChange} />
      </div>
    </>
  );
};

export default EducationStep;
