import { User, Phone, Mail, Calendar, ArrowRight } from "lucide-react";
import { SelectField, inputClass, labelClass } from "../SignupFormFields";
import { Button } from "@/components/ui/button";

interface Props {
  formData: Record<string, string>;
  onChange: (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => void;
  agreeTerms: boolean;
  setAgreeTerms: (v: boolean) => void;
  otpSent: boolean;
  otp: string[];
  onSendOtp: () => void;
  onVerifyOtp: (e: React.FormEvent) => void;
  onOtpChange: (index: number, value: string) => void;
  onOtpKeyDown: (index: number, e: React.KeyboardEvent<HTMLInputElement>) => void;
  onBackFromOtp: () => void;
  phoneVerified: boolean;
  canSendOtp?: boolean;
  fieldErrors?: { email?: string; dob?: string; phone?: string; general?: string };
}

const BasicInfoStep = ({
  formData,
  onChange,
  agreeTerms,
  setAgreeTerms,
  otpSent,
  otp,
  onSendOtp,
  onVerifyOtp,
  onOtpChange,
  onOtpKeyDown,
  onBackFromOtp,
  phoneVerified,
  canSendOtp = false,
  fieldErrors,
}: Props) => (
  <>
    {/* OTP-only screen when OTP has been sent (no registration form) */}
    {otpSent && (
      <div className="space-y-6 py-4">
        <p className="text-muted-foreground text-sm text-center">
          OTP sent to +91 {formData.phone}. Enter 6-digit code:
        </p>
        <div className="flex justify-center gap-2">
          {otp.map((digit, index) => (
            <input
              key={index}
              id={`signup-otp-${index}`}
              type="text"
              inputMode="numeric"
              maxLength={1}
              value={digit}
              onChange={(e) => onOtpChange(index, e.target.value)}
              onKeyDown={(e) => onOtpKeyDown(index, e)}
              className="w-11 h-12 text-center text-lg font-bold rounded-xl border-2 border-primary/20 focus:border-primary focus:ring-2 focus:ring-primary/20 bg-white transition-colors"
            />
          ))}
        </div>
        <Button type="button" variant="hero" size="lg" className="w-full gap-2" onClick={(e) => { e.preventDefault(); onVerifyOtp(e); }}>
          Verify OTP & Continue
          <ArrowRight className="w-5 h-5" />
        </Button>
        <button type="button" onClick={onBackFromOtp} className="w-full text-center text-sm text-muted-foreground hover:text-primary transition-colors">
          Change number
        </button>
      </div>
    )}

    {/* Registration form (only when OTP not sent and not already verified) */}
    {!otpSent && !phoneVerified && (
      <>
        <div className="text-center mb-6">
          <div className="w-16 h-16 mx-auto rounded-full bg-primary flex items-center justify-center mb-4 relative">
            <User className="w-8 h-8 text-primary-foreground" />
          </div>
          <h1 className="font-serif text-2xl font-bold text-foreground mb-1">Registration</h1>
          <p className="text-muted-foreground text-sm">Full name, Phone + OTP, Email (optional), DOB, Gender</p>
        </div>
        <div className="space-y-4">
          <div className="relative">
            <User className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-primary/50" />
            <input type="text" name="name" value={formData.name} onChange={onChange} placeholder="Full Name *" className="w-full pl-12 pr-4 py-3.5 rounded-2xl border-2 border-primary/10 focus:border-primary focus:ring-0 transition-colors bg-white" />
          </div>
          <div className="relative flex items-center border-2 border-primary/10 rounded-2xl bg-white focus-within:border-primary transition-colors">
            <Phone className="absolute left-4 w-5 h-5 text-primary/50" />
            <span className="pl-12 pr-1 text-sm text-foreground">+91</span>
            <input type="tel" name="phone" value={formData.phone} onChange={onChange} placeholder="Phone Number *" minLength={10} maxLength={10} inputMode="numeric" pattern="[0-9]{10}" className="flex-1 px-2 py-3.5 rounded-r-2xl focus:ring-0 border-0 bg-transparent" />
          </div>
          {fieldErrors?.phone && (
            <p className="text-xs text-red-500 text-left">{fieldErrors.phone}</p>
          )}
          <div className="relative">
            <Mail className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-primary/50" />
            <input type="email" name="email" value={formData.email} onChange={onChange} placeholder="Email (optional)" className="w-full pl-12 pr-4 py-3.5 rounded-2xl border-2 border-primary/10 focus:border-primary focus:ring-0 transition-colors bg-white" />
          </div>
          {fieldErrors?.email && (
            <p className="text-xs text-red-500 text-left">{fieldErrors.email}</p>
          )}
          <div className="relative">
            <Calendar className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-primary/50" />
            <input type="date" name="dob" value={formData.dob} onChange={onChange} className="w-full pl-12 pr-4 py-3.5 rounded-2xl border-2 border-primary/10 focus:border-primary focus:ring-0 transition-colors bg-white" />
          </div>
          {fieldErrors?.dob && (
            <p className="text-xs text-red-500 text-left">{fieldErrors.dob}</p>
          )}
          <SelectField label="Gender" name="gender" options={["Male", "Female"]} value={formData.gender} onChange={onChange} />
          <div className="flex items-start gap-3">
            <input
              type="checkbox"
              id="agreeTerms"
              checked={agreeTerms}
              onChange={(e) => setAgreeTerms(e.target.checked)}
              className="mt-1 w-5 h-5 rounded border-primary/30 text-primary focus:ring-primary"
            />
            <label htmlFor="agreeTerms" className="text-sm text-muted-foreground cursor-pointer">
              I agree to the Terms & Conditions and Privacy Policy
            </label>
          </div>
          <Button type="button" variant="hero" size="lg" className="w-full gap-2" onClick={onSendOtp} disabled={!canSendOtp}>
            Send OTP
            <ArrowRight className="w-5 h-5" />
          </Button>
          {fieldErrors?.general && (
            <p className="mt-2 text-xs text-red-500 text-left">{fieldErrors.general}</p>
          )}
        </div>
      </>
    )}

    {/* When user goes Previous from Location: show full form with all fields including name & phone */}
    {!otpSent && phoneVerified && (
      <>
        <div className="text-center mb-6">
          <div className="w-16 h-16 mx-auto rounded-full bg-primary flex items-center justify-center mb-4 relative">
            <User className="w-8 h-8 text-primary-foreground" />
          </div>
          <h1 className="font-serif text-2xl font-bold text-foreground mb-1">Registration</h1>
          <p className="text-muted-foreground text-sm">Full name, Phone + OTP, Email (optional), DOB, Gender</p>
        </div>
        <div className="space-y-4">
          <p className="text-center text-primary font-medium">Phone verified successfully.</p>
          <div className="relative">
            <User className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-primary/50" />
            <input type="text" name="name" value={formData.name} onChange={onChange} placeholder="Full Name *" className="w-full pl-12 pr-4 py-3.5 rounded-2xl border-2 border-primary/10 focus:border-primary focus:ring-0 transition-colors bg-white" />
          </div>
          <div className="relative flex items-center border-2 border-primary/10 rounded-2xl bg-white focus-within:border-primary transition-colors">
            <Phone className="absolute left-4 w-5 h-5 text-primary/50" />
            <span className="pl-12 pr-1 text-sm text-foreground">+91</span>
            <input type="tel" name="phone" value={formData.phone} onChange={onChange} placeholder="Phone Number *" minLength={10} maxLength={10} inputMode="numeric" pattern="[0-9]{10}" className="flex-1 px-2 py-3.5 rounded-r-2xl focus:ring-0 border-0 bg-transparent" />
          </div>
          {fieldErrors?.phone && (
            <p className="text-xs text-red-500 text-left">{fieldErrors.phone}</p>
          )}
          <div className="relative">
            <Mail className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-primary/50" />
            <input type="email" name="email" value={formData.email} onChange={onChange} placeholder="Email (optional)" className="w-full pl-12 pr-4 py-3.5 rounded-2xl border-2 border-primary/10 focus:border-primary focus:ring-0 transition-colors bg-white" />
          </div>
          {fieldErrors?.email && (
            <p className="text-xs text-red-500 text-left">{fieldErrors.email}</p>
          )}
          <div className="relative">
            <Calendar className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-primary/50" />
            <input type="date" name="dob" value={formData.dob} onChange={onChange} className="w-full pl-12 pr-4 py-3.5 rounded-2xl border-2 border-primary/10 focus:border-primary focus:ring-0 transition-colors bg-white" />
          </div>
          {fieldErrors?.dob && (
            <p className="text-xs text-red-500 text-left">{fieldErrors.dob}</p>
          )}
          <SelectField label="Gender" name="gender" options={["Male", "Female"]} value={formData.gender} onChange={onChange} />
          <div className="flex items-start gap-3">
            <input
              type="checkbox"
              id="agreeTermsVerified"
              checked={agreeTerms}
              onChange={(e) => setAgreeTerms(e.target.checked)}
              className="mt-1 w-5 h-5 rounded border-primary/30 text-primary focus:ring-primary"
            />
            <label htmlFor="agreeTermsVerified" className="text-sm text-muted-foreground cursor-pointer">
              I agree to the Terms & Conditions and Privacy Policy
            </label>
          </div>
        </div>
      </>
    )}
  </>
);

export default BasicInfoStep;
