import { useState, useMemo, useEffect, useLayoutEffect, useRef, useCallback } from "react";
import { createPortal } from "react-dom";
import { ChevronDown, Search } from "lucide-react";
import { SelectField, inputClass, labelClass } from "../SignupFormFields";
import { HIGHEST_EDUCATION_OPTIONS } from "@/constants/highestEducationOptions";
import { EDUCATION_SUBJECT_OPTIONS } from "@/constants/educationSubjectOptions";

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

function SearchableEducationSelect({
  value,
  onChange,
}: {
  value: string;
  onChange: Props["onChange"];
}) {
  const [open, setOpen] = useState(false);
  const [search, setSearch] = useState("");
  const [position, setPosition] = useState({ top: 0, left: 0, width: 0 });
  const containerRef = useRef<HTMLDivElement>(null);
  const overlayRef = useRef<HTMLDivElement>(null);

  const filtered = useMemo(() => {
    const q = search.trim().toLowerCase();
    const list = [...HIGHEST_EDUCATION_OPTIONS];
    if (!q) return list;
    return list.filter((opt) => opt.toLowerCase().includes(q));
  }, [search]);

  const updatePosition = useCallback(() => {
    const btn = containerRef.current?.querySelector("button");
    if (btn) {
      const rect = btn.getBoundingClientRect();
      setPosition({ top: rect.bottom + 4, left: rect.left, width: rect.width });
    }
  }, []);

  useLayoutEffect(() => {
    if (!open) return;
    setSearch("");
    updatePosition();
    window.addEventListener("scroll", updatePosition, true);
    window.addEventListener("resize", updatePosition);
    return () => {
      window.removeEventListener("scroll", updatePosition, true);
      window.removeEventListener("resize", updatePosition);
    };
  }, [open, updatePosition]);

  useEffect(() => {
    const onDown = (e: MouseEvent) => {
      const t = e.target as Node;
      if (!containerRef.current?.contains(t) && !overlayRef.current?.contains(t)) setOpen(false);
    };
    if (open) document.addEventListener("mousedown", onDown);
    return () => document.removeEventListener("mousedown", onDown);
  }, [open]);

  const select = (label: string) => {
    onChange({
      target: { name: "education", value: label },
    } as React.ChangeEvent<HTMLSelectElement>);
    setOpen(false);
    setSearch("");
  };

  const display =
    value && value.trim() !== "" ? value : "Select Highest Education";
  const inList = (HIGHEST_EDUCATION_OPTIONS as readonly string[]).includes(value);

  const dropdown =
    open &&
    position.width > 0 &&
    createPortal(
      <div
        ref={overlayRef}
        className="fixed z-[100] rounded-2xl border-2 border-primary/10 bg-white shadow-xl flex flex-col overflow-hidden max-h-[min(320px,70vh)]"
        style={{
          top: position.top,
          left: position.left,
          width: Math.max(position.width, 240),
          minWidth: 240,
        }}
      >
        <div className="p-2 border-b border-primary/10 bg-muted/30 shrink-0">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground pointer-events-none" />
            <input
              type="text"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Search qualification..."
              className="w-full pl-9 pr-3 py-2.5 rounded-xl border border-primary/10 focus:border-primary focus:ring-1 focus:ring-primary/20 text-sm text-foreground placeholder:text-muted-foreground bg-white"
              autoFocus
              onKeyDown={(e) => {
                if (e.key === "Escape") setOpen(false);
              }}
            />
          </div>
        </div>
        <div className="overflow-y-auto p-1 flex-1 min-h-0 [scrollbar-width:thin]">
          {value && !inList && (
            <button
              type="button"
              onClick={() => select(value)}
              className="w-full text-left px-3 py-2.5 rounded-xl text-sm bg-amber-50 text-amber-900 hover:bg-amber-100 mb-1"
            >
              Current: {value}
            </button>
          )}
          {filtered.length === 0 ? (
            <div className="py-8 text-center text-sm text-muted-foreground">No qualification matches your search</div>
          ) : (
            filtered.map((opt) => (
              <button
                key={opt}
                type="button"
                onClick={() => select(opt)}
                className={`w-full text-left px-3 py-2.5 rounded-xl text-sm transition-colors ${
                  opt === value ? "bg-primary text-primary-foreground font-medium" : "hover:bg-primary/10 text-foreground"
                }`}
              >
                {opt}
              </button>
            ))
          )}
        </div>
      </div>,
      document.body
    );

  return (
    <div ref={containerRef} className="relative">
      <label className={labelClass}>Highest Education</label>
      <button
        type="button"
        onClick={() => setOpen((o) => !o)}
        className="w-full px-4 py-3.5 rounded-2xl border-2 border-primary/10 focus:border-primary focus:ring-2 focus:ring-primary/20 transition-colors bg-white text-left flex items-center justify-between gap-2 text-foreground"
      >
        <span className={value ? "" : "text-muted-foreground"}>{display}</span>
        <ChevronDown className={`w-5 h-5 shrink-0 text-muted-foreground transition-transform ${open ? "rotate-180" : ""}`} />
      </button>
      {dropdown}
    </div>
  );
}

function SearchableSubjectSelect({
  value,
  onChange,
}: {
  value: string;
  onChange: Props["onChange"];
}) {
  const [open, setOpen] = useState(false);
  const [search, setSearch] = useState("");
  const [position, setPosition] = useState({ top: 0, left: 0, width: 0 });
  const containerRef = useRef<HTMLDivElement>(null);
  const overlayRef = useRef<HTMLDivElement>(null);

  const filtered = useMemo(() => {
    const q = search.trim().toLowerCase();
    const list = [...EDUCATION_SUBJECT_OPTIONS];
    if (!q) return list;
    return list.filter((opt) => opt.toLowerCase().includes(q));
  }, [search]);

  const updatePosition = useCallback(() => {
    const btn = containerRef.current?.querySelector("button");
    if (btn) {
      const rect = btn.getBoundingClientRect();
      setPosition({ top: rect.bottom + 4, left: rect.left, width: rect.width });
    }
  }, []);

  useLayoutEffect(() => {
    if (!open) return;
    setSearch("");
    updatePosition();
    window.addEventListener("scroll", updatePosition, true);
    window.addEventListener("resize", updatePosition);
    return () => {
      window.removeEventListener("scroll", updatePosition, true);
      window.removeEventListener("resize", updatePosition);
    };
  }, [open, updatePosition]);

  useEffect(() => {
    const onDown = (e: MouseEvent) => {
      const t = e.target as Node;
      if (!containerRef.current?.contains(t) && !overlayRef.current?.contains(t)) setOpen(false);
    };
    if (open) document.addEventListener("mousedown", onDown);
    return () => document.removeEventListener("mousedown", onDown);
  }, [open]);

  const select = (label: string) => {
    onChange({
      target: { name: "educationSubject", value: label },
    } as React.ChangeEvent<HTMLSelectElement>);
    setOpen(false);
    setSearch("");
  };

  const display = value && value.trim() !== "" ? value : "Select Subject";
  const inList = (EDUCATION_SUBJECT_OPTIONS as readonly string[]).includes(value);

  const dropdown =
    open &&
    position.width > 0 &&
    createPortal(
      <div
        ref={overlayRef}
        className="fixed z-[100] rounded-2xl border-2 border-primary/10 bg-white shadow-xl flex flex-col overflow-hidden max-h-[min(320px,70vh)]"
        style={{
          top: position.top,
          left: position.left,
          width: Math.max(position.width, 240),
          minWidth: 240,
        }}
      >
        <div className="p-2 border-b border-primary/10 bg-muted/30 shrink-0">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground pointer-events-none" />
            <input
              type="text"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Search subject..."
              className="w-full pl-9 pr-3 py-2.5 rounded-xl border border-primary/10 focus:border-primary focus:ring-1 focus:ring-primary/20 text-sm text-foreground placeholder:text-muted-foreground bg-white"
              autoFocus
              onKeyDown={(e) => {
                if (e.key === "Escape") setOpen(false);
              }}
            />
          </div>
        </div>
        <div className="overflow-y-auto p-1 flex-1 min-h-0 [scrollbar-width:thin]">
          {value && !inList && (
            <button
              type="button"
              onClick={() => select(value)}
              className="w-full text-left px-3 py-2.5 rounded-xl text-sm bg-amber-50 text-amber-900 hover:bg-amber-100 mb-1"
            >
              Current: {value}
            </button>
          )}
          {filtered.length === 0 ? (
            <div className="py-8 text-center text-sm text-muted-foreground">No subject matches your search</div>
          ) : (
            filtered.map((opt) => (
              <button
                key={opt}
                type="button"
                onClick={() => select(opt)}
                className={`w-full text-left px-3 py-2.5 rounded-xl text-sm transition-colors ${
                  opt === value ? "bg-primary text-primary-foreground font-medium" : "hover:bg-primary/10 text-foreground"
                }`}
              >
                {opt}
              </button>
            ))
          )}
        </div>
      </div>,
      document.body
    );

  return (
    <div ref={containerRef} className="relative">
      <label className={labelClass}>Subject</label>
      <button
        type="button"
        onClick={() => setOpen((o) => !o)}
        className="w-full px-4 py-3.5 rounded-2xl border-2 border-primary/10 focus:border-primary focus:ring-2 focus:ring-primary/20 transition-colors bg-white text-left flex items-center justify-between gap-2 text-foreground"
      >
        <span className={value ? "" : "text-muted-foreground"}>{display}</span>
        <ChevronDown className={`w-5 h-5 shrink-0 text-muted-foreground transition-transform ${open ? "rotate-180" : ""}`} />
      </button>
      {dropdown}
    </div>
  );
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
        <SearchableEducationSelect value={formData.education} onChange={onChange} />
        <SearchableSubjectSelect value={formData.educationSubject} onChange={onChange} />
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
