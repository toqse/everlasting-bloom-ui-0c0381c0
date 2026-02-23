import { User, Phone, Mail, Calendar, PlusCircle } from "lucide-react";
import { SelectField, inputClass } from "../SignupFormFields";

interface Props {
  formData: Record<string, string>;
  onChange: (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => void;
  agreeTerms: boolean;
  setAgreeTerms: (v: boolean) => void;
}

const BasicInfoStep = ({ formData, onChange, agreeTerms, setAgreeTerms }: Props) => (
  <>
    <div className="text-center mb-6">
      <div className="w-16 h-16 mx-auto rounded-full bg-primary flex items-center justify-center mb-4 relative">
        <User className="w-8 h-8 text-primary-foreground" />
        <PlusCircle className="w-5 h-5 text-primary-foreground absolute -right-1 -bottom-1 bg-primary rounded-full" />
      </div>
      <h1 className="font-serif text-2xl font-bold text-foreground mb-1">Create Account</h1>
      <p className="text-muted-foreground text-sm">Join us to find your perfect match</p>
    </div>
    <div className="space-y-4">
      <div className="relative">
        <User className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-primary/50" />
        <input type="text" name="name" value={formData.name} onChange={onChange} placeholder="Full Name" className="w-full pl-12 pr-4 py-3.5 rounded-2xl border-2 border-primary/10 focus:border-primary focus:ring-0 transition-colors bg-white" />
      </div>
      <div className="relative flex items-center border-2 border-primary/10 rounded-2xl bg-white focus-within:border-primary transition-colors">
        <Phone className="absolute left-4 w-5 h-5 text-primary/50" />
        <span className="pl-12 pr-1 text-sm text-foreground">+91</span>
        <input type="tel" name="phone" value={formData.phone} onChange={onChange} placeholder="Phone Number" className="flex-1 px-2 py-3.5 rounded-r-2xl focus:ring-0 border-0 bg-transparent" />
      </div>
      <div className="relative">
        <Mail className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-primary/50" />
        <input type="email" name="email" value={formData.email} onChange={onChange} placeholder="Email Address" className="w-full pl-12 pr-4 py-3.5 rounded-2xl border-2 border-primary/10 focus:border-primary focus:ring-0 transition-colors bg-white" />
      </div>
      <div className="relative">
        <Calendar className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-primary/50" />
        <input type="date" name="dob" value={formData.dob} onChange={onChange} className="w-full pl-12 pr-4 py-3.5 rounded-2xl border-2 border-primary/10 focus:border-primary focus:ring-0 transition-colors bg-white" />
      </div>
      <SelectField label="Gender" name="gender" options={["Male", "Female"]} value={formData.gender} onChange={onChange} />
      <div className="relative">
        <input type="password" name="password" value={formData.password} onChange={onChange} placeholder="Create Password" className="w-full px-4 py-3.5 rounded-2xl border-2 border-primary/10 focus:border-primary focus:ring-0 transition-colors bg-white" />
      </div>
      <label className="flex items-center gap-3 cursor-pointer">
        <input type="checkbox" checked={agreeTerms} onChange={() => setAgreeTerms(!agreeTerms)} className="w-5 h-5 rounded border-primary/30 text-primary focus:ring-primary" />
        <span className="text-sm text-foreground">I agree to the <a href="#" className="text-primary font-medium hover:underline">Terms & Conditions</a></span>
      </label>
    </div>
  </>
);

export default BasicInfoStep;
