import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { AnimatePresence, motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { Heart, Mail, Lock, Eye, EyeOff, Sparkles, ArrowRight, ArrowLeft, Phone } from "lucide-react";
import { toast } from "sonner";
import { useAuthStore } from "@/stores/authStore";
import SignupStepIndicator, { SIGNUP_STEPS } from "@/components/signup/SignupStepIndicator";
import ProfileForStep from "@/components/signup/steps/ProfileForStep";
import BasicInfoStep from "@/components/signup/steps/BasicInfoStep";
import LocationStep from "@/components/signup/steps/LocationStep";
import ReligiousStep from "@/components/signup/steps/ReligiousStep";
import PersonalStep from "@/components/signup/steps/PersonalStep";
import EducationStep from "@/components/signup/steps/EducationStep";
import AboutMeStep from "@/components/signup/steps/AboutMeStep";
import PhotosStep from "@/components/signup/steps/PhotosStep";

type AuthMode = "login" | "signup";
type LoginMethod = "phone" | "email";

const stepVariants = {
  enter: (dir: number) => ({ x: dir > 0 ? 80 : -80, opacity: 0 }),
  center: { x: 0, opacity: 1 },
  exit: (dir: number) => ({ x: dir > 0 ? -80 : 80, opacity: 0 }),
};

const AuthPage = () => {
  const navigate = useNavigate();
  const [mode, setMode] = useState<AuthMode>("login");
  const [loginMethod, setLoginMethod] = useState<LoginMethod>("phone");
  const [showPassword, setShowPassword] = useState(false);
  const [signupStep, setSignupStep] = useState(0);
  const [direction, setDirection] = useState(1);
  const [agreeTerms, setAgreeTerms] = useState(false);
  const [hasChildren, setHasChildren] = useState<"yes" | "no">("no");
  const [interCaste, setInterCaste] = useState(false);
  const [phoneVerified, setPhoneVerified] = useState(false);
  const [signupOtpSent, setSignupOtpSent] = useState(false);
  const [signupOtp, setSignupOtp] = useState(["", "", "", "", "", ""]);
  const [photos, setPhotos] = useState<Record<string, string>>({});
  const [aadhaarVerified, setAadhaarVerified] = useState(false);
  const [otpSent, setOtpSent] = useState(false);
  const [otp, setOtp] = useState(["", "", "", "", "", ""]);

  const [formData, setFormData] = useState({
    profileFor: "", name: "", phone: "", email: "", dob: "", gender: "", password: "",
    country: "", state: "", district: "", city: "", address: "", addressType: "",
    religion: "", caste: "", subCaste: "", motherTongue: "",
    maritalStatus: "", numberOfChildren: "", height: "", weight: "", skinTone: "",
    education: "", educationSubject: "", employmentStatus: "", occupation: "", annualIncome: "",
    aboutMe: "", aadhaarNumber: "",
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    if (name === "phone") {
      const digitsOnly = value.replace(/\D/g, "").slice(0, 12);
      setFormData((prev) => ({ ...prev, phone: digitsOnly }));
      return;
    }
    if (name === "religion") {
      setFormData((prev) => ({ ...prev, religion: value, caste: "" }));
      return;
    }
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSendOtp = (e: React.FormEvent) => {
    e.preventDefault();
    if (loginMethod === "phone") {
      if (!formData.phone) {
        toast.error("Please enter your phone number");
        return;
      }
      const len = formData.phone.replace(/\D/g, "").length;
      if (len < 10 || len > 12) {
        toast.error("Phone number must be 10–12 digits");
        return;
      }
    }
    if (loginMethod === "email" && !formData.email) {
      toast.error("Please enter your email address");
      return;
    }
    setOtpSent(true);
    setOtp(["", "", "", "", "", ""]);
    toast.success(loginMethod === "phone" ? "OTP sent to your phone" : "OTP sent to your email");
  };

  const handleOtpChange = (index: number, value: string) => {
    if (value && !/^\d$/.test(value)) return;
    const next = [...otp];
    next[index] = value.slice(-1);
    setOtp(next);
    if (value && index < 5) {
      const nextInput = document.getElementById(`otp-${index + 1}`);
      nextInput?.focus();
    }
  };

  const handleOtpKeyDown = (index: number, e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Backspace" && !otp[index] && index > 0) {
      const prevInput = document.getElementById(`otp-${index - 1}`);
      prevInput?.focus();
    }
  };

  const handleVerifyOtp = (e: React.FormEvent) => {
    e.preventDefault();
    const otpValue = otp.join("");
    if (otpValue.length !== 6) {
      toast.error("Please enter the 6-digit OTP");
      return;
    }
    const { login } = useAuthStore.getState();
    login(loginMethod, loginMethod === "phone" ? formData.phone : formData.email);
    toast.success("OTP verified! Welcome back! 💕");
    navigate("/dashboard");
  };

  const handleBackToPhoneOrEmail = () => {
    setOtpSent(false);
    setOtp(["", "", "", "", "", ""]);
  };

  const handleSignupSendOtp = () => {
    if (!formData.name?.trim()) {
      toast.error("Please enter full name");
      return;
    }
    const phoneLen = formData.phone.replace(/\D/g, "").length;
    if (phoneLen < 10 || phoneLen > 12) {
      toast.error("Phone number must be 10–12 digits");
      return;
    }
    setSignupOtpSent(true);
    setSignupOtp(["", "", "", "", "", ""]);
    toast.success("OTP sent to +91 " + formData.phone);
  };

  const handleSignupVerifyOtp = (e: React.FormEvent) => {
    e.preventDefault();
    const otpValue = signupOtp.join("");
    if (otpValue.length !== 6) {
      toast.error("Please enter the 6-digit OTP");
      return;
    }
    setPhoneVerified(true);
    setSignupOtpSent(false);
    setSignupOtp(["", "", "", "", "", ""]);
    toast.success("Phone verified!");
  };

  const handleSignupOtpChange = (index: number, value: string) => {
    if (value && !/^\d$/.test(value)) return;
    const next = [...signupOtp];
    next[index] = value.slice(-1);
    setSignupOtp(next);
    if (value && index < 5) {
      const el = document.getElementById(`signup-otp-${index + 1}`);
      (el as HTMLInputElement)?.focus();
    }
  };

  const handleSignupOtpKeyDown = (index: number, e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Backspace" && !signupOtp[index] && index > 0) {
      const el = document.getElementById(`signup-otp-${index - 1}`);
      (el as HTMLInputElement)?.focus();
    }
  };

  const handleSignupBackFromOtp = () => {
    setSignupOtpSent(false);
    setSignupOtp(["", "", "", "", "", ""]);
  };

  const handleSignupNext = () => {
    if (signupStep === 0) {
      if (!formData.profileFor) {
        toast.error("Please select who this profile is for");
        return;
      }
    }
    if (signupStep === 1) {
      if (!phoneVerified) {
        toast.error("Please verify your phone with OTP first");
        return;
      }
      if (!formData.name?.trim() || !formData.dob || !formData.gender) {
        toast.error("Please fill name, date of birth, and gender");
        return;
      }
      if (!agreeTerms) {
        toast.error("Please agree to Terms & Conditions");
        return;
      }
    }
    if (signupStep < SIGNUP_STEPS.length - 1) {
      setDirection(1);
      setSignupStep(signupStep + 1);
    } else {
      const { loginWithProfile } = useAuthStore.getState();
      loginWithProfile({
        name: formData.name,
        phone: formData.phone,
        email: formData.email || undefined,
        religion: formData.religion || "",
        location: [formData.city, formData.state].filter(Boolean).join(", ") || undefined,
      });
      toast.success("Account created successfully! 🎉", { description: "Welcome to Aiswarya Matrimony!" });
      navigate("/dashboard");
    }
  };

  const handleAboutHelpMeWrite = () => {
    const sample = "I am a caring and family-oriented person. I value honesty and respect. I enjoy reading and spending time with family. Looking for a life partner who shares similar values.";
    setFormData((prev) => ({ ...prev, aboutMe: sample }));
    toast.success("Sample bio added. Feel free to edit!");
  };

  const handleAboutSkip = () => {
    setFormData((prev) => ({ ...prev, aboutMe: "" }));
    toast.success("Skipped. You can add this later.");
  };

  const handleVerifyAadhaar = () => {
    const digits = formData.aadhaarNumber.replace(/\D/g, "");
    if (digits.length !== 12) {
      toast.error("Enter a valid 12-digit Aadhaar number");
      return;
    }
    setAadhaarVerified(true);
    toast.success("Aadhaar verified. Verified badge will show on your profile.");
  };

  const handleSignupPrev = () => {
    if (signupStep > 0) {
      setDirection(-1);
      setSignupStep(signupStep - 1);
    }
  };

  const renderStep = () => {
    const props = { formData, onChange: handleChange };
    switch (signupStep) {
      case 0:
        return <ProfileForStep profileFor={formData.profileFor} onChange={(v) => setFormData((prev) => ({ ...prev, profileFor: v }))} />;
      case 1:
        return (
          <BasicInfoStep
            {...props}
            agreeTerms={agreeTerms}
            setAgreeTerms={setAgreeTerms}
            otpSent={signupOtpSent}
            otp={signupOtp}
            onSendOtp={handleSignupSendOtp}
            onVerifyOtp={handleSignupVerifyOtp}
            onOtpChange={handleSignupOtpChange}
            onOtpKeyDown={handleSignupOtpKeyDown}
            onBackFromOtp={handleSignupBackFromOtp}
            phoneVerified={phoneVerified}
          />
        );
      case 2: return <LocationStep {...props} />;
      case 3: return <ReligiousStep {...props} interCaste={false} setInterCaste={() => {}} />;
      case 4: return <PersonalStep {...props} hasChildren={hasChildren} setHasChildren={setHasChildren} />;
      case 5: return <EducationStep {...props} />;
      case 6: return <AboutMeStep {...props} onHelpMeWrite={handleAboutHelpMeWrite} onSkip={handleAboutSkip} />;
      case 7:
        return (
          <PhotosStep
            photos={photos}
            setPhotos={setPhotos}
            aadhaarNumber={formData.aadhaarNumber}
            onAadhaarChange={(value) => setFormData((prev) => ({ ...prev, aadhaarNumber: value }))}
            aadhaarVerified={aadhaarVerified}
            onVerifyAadhaar={handleVerifyAadhaar}
            onSkipOrCompleteLater={handleSignupNext}
          />
        );
      default: return null;
    }
  };

  const canShowContinue = signupStep !== 1 || phoneVerified;

  // ---- LOGIN VIEW ----
  if (mode === "login") {
    return (
      <div className="min-h-screen bg-gradient-romantic flex items-center justify-center relative overflow-hidden py-12 px-4">
        <div className="absolute top-10 left-10 w-48 h-48 bg-secondary/25 rounded-full blur-3xl animate-float" />
        <div className="absolute bottom-10 right-10 w-64 h-64 bg-primary/15 rounded-full blur-3xl animate-float-delayed" />

        <div className="w-full max-w-md relative z-10">
          <button onClick={() => navigate("/")} className="flex items-center gap-2 text-primary hover:text-primary-dark transition-colors mb-6 group">
            <ArrowLeft className="w-5 h-5 group-hover:-translate-x-1 transition-transform" />
            <span className="font-medium">Back to Home</span>
          </button>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="bg-white/95 backdrop-blur-lg rounded-3xl shadow-elevated p-8 border border-primary/5"
          >
            <div className="text-center mb-8">
              <div className="inline-flex items-center gap-2 mb-4">
                <div className="relative">
                  <Heart className="w-10 h-10 text-primary fill-primary animate-heart-beat" />
                  <Sparkles className="absolute -top-1 -right-1 w-4 h-4 text-secondary animate-sparkle" />
                </div>
                <span className="font-serif text-3xl font-bold text-primary">
                  Aiswarya <span className="text-secondary">Matrimony</span>
                </span>
              </div>
              <h1 className="font-serif text-2xl font-bold text-foreground mb-2">Welcome Back</h1>
              <p className="text-muted-foreground text-sm">Sign in to continue your journey</p>
            </div>

            {!otpSent ? (
              <>
                <div className="flex gap-3 mb-6">
                  {(["phone", "email"] as LoginMethod[]).map((m) => (
                    <button
                      key={m}
                      type="button"
                      onClick={() => setLoginMethod(m)}
                      className={`flex-1 py-3 rounded-2xl font-medium transition-all capitalize ${loginMethod === m ? "bg-primary text-primary-foreground shadow-soft" : "border-2 border-primary/10 text-foreground hover:bg-accent-rose"}`}
                    >
                      {m}
                    </button>
                  ))}
                </div>

                <form onSubmit={handleSendOtp} className="space-y-4">
                  {loginMethod === "phone" ? (
                    <div className="relative flex items-center border-2 border-primary/10 rounded-2xl bg-white focus-within:border-primary transition-colors">
                      <Phone className="absolute left-4 w-5 h-5 text-primary/50" />
                      <span className="pl-12 pr-1 text-sm text-foreground">+91</span>
                      <input type="tel" name="phone" value={formData.phone} onChange={handleChange} placeholder="Phone Number" minLength={10} maxLength={12} inputMode="numeric" pattern="[0-9]{10,12}" className="flex-1 px-2 py-3.5 rounded-r-2xl focus:ring-0 border-0 bg-transparent" />
                    </div>
                  ) : (
                    <div className="relative">
                      <Mail className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-primary/50" />
                      <input type="email" name="email" value={formData.email} onChange={handleChange} placeholder="you@example.com" className="w-full pl-12 pr-4 py-3.5 rounded-2xl border-2 border-primary/10 focus:border-primary focus:ring-0 transition-colors bg-white" />
                    </div>
                  )}
                  <Button type="submit" variant="hero" size="lg" className="w-full gap-2">
                    Send OTP
                    <ArrowRight className="w-5 h-5" />
                  </Button>
                </form>
              </>
            ) : (
              <>
                <p className="text-muted-foreground text-sm mb-2 text-center">
                  Enter the 6-digit OTP sent to{" "}
                  {loginMethod === "phone" ? (
                    <span className="font-medium text-foreground">+91 {formData.phone}</span>
                  ) : (
                    <span className="font-medium text-foreground">{formData.email}</span>
                  )}
                </p>
                <form onSubmit={handleVerifyOtp} className="space-y-4">
                  <div className="flex justify-center gap-2">
                    {otp.map((digit, index) => (
                      <input
                        key={index}
                        id={`otp-${index}`}
                        type="text"
                        inputMode="numeric"
                        maxLength={1}
                        value={digit}
                        onChange={(e) => handleOtpChange(index, e.target.value)}
                        onKeyDown={(e) => handleOtpKeyDown(index, e)}
                        className="w-11 h-12 text-center text-lg font-bold rounded-xl border-2 border-primary/20 focus:border-primary focus:ring-2 focus:ring-primary/20 bg-white transition-colors"
                      />
                    ))}
                  </div>
                  <Button type="submit" variant="hero" size="lg" className="w-full gap-2">
                    Verify & Continue
                    <ArrowRight className="w-5 h-5" />
                  </Button>
                  <button
                    type="button"
                    onClick={handleBackToPhoneOrEmail}
                    className="w-full text-center text-sm text-muted-foreground hover:text-primary transition-colors"
                  >
                    Change {loginMethod === "phone" ? "number" : "email"}
                  </button>
                </form>
              </>
            )}

            {!otpSent && (
              <>
                <div className="my-6 flex items-center gap-4">
                  <div className="flex-1 border-t border-primary/10" />
                  <span className="text-sm text-muted-foreground">OR</span>
                  <div className="flex-1 border-t border-primary/10" />
                </div>
                <div className="text-center">
                  <p className="text-muted-foreground">
                    Don't have an account?{" "}
                    <button
                      type="button"
                      onClick={() => {
                        setMode("signup");
                        setSignupStep(0);
                        setPhoneVerified(false);
                        setSignupOtpSent(false);
                        setSignupOtp(["", "", "", "", "", ""]);
                        setAadhaarVerified(false);
                      }}
                      className="text-primary font-bold hover:text-primary-dark transition-colors"
                    >
                      Register free
                    </button>
                  </p>
                </div>
              </>
            )}
          </motion.div>
        </div>
      </div>
    );
  }

  // ---- SIGNUP VIEW (multi-step with animations) ----
  return (
    <div className="min-h-screen bg-gradient-romantic flex items-center justify-center relative overflow-hidden py-8 px-4">
      <div className="absolute top-10 left-10 w-48 h-48 bg-secondary/25 rounded-full blur-3xl animate-float" />
      <div className="absolute bottom-10 right-10 w-64 h-64 bg-primary/15 rounded-full blur-3xl animate-float-delayed" />

      <div className="w-full max-w-4xl relative z-10">
        {signupStep === 0 ? (
          <button onClick={() => setMode("login")} className="flex items-center gap-2 text-primary hover:text-primary-dark transition-colors mb-4 group">
            <ArrowLeft className="w-5 h-5 group-hover:-translate-x-1 transition-transform" />
            <span className="font-medium">Back to Sign In</span>
          </button>
        ) : (
          <button onClick={handleSignupPrev} className="flex items-center gap-2 text-primary hover:text-primary-dark transition-colors mb-4 group">
            <ArrowLeft className="w-5 h-5 group-hover:-translate-x-1 transition-transform" />
            <span className="font-medium">Previous Step</span>
          </button>
        )}

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-white/95 backdrop-blur-lg rounded-3xl shadow-elevated p-8 border border-primary/5"
        >
          <SignupStepIndicator currentStep={signupStep} />

          <div className="overflow-hidden min-h-[380px]">
            <AnimatePresence mode="wait" custom={direction}>
              <motion.div
                key={signupStep}
                custom={direction}
                variants={stepVariants}
                initial="enter"
                animate="center"
                exit="exit"
                transition={{ duration: 0.3, ease: "easeInOut" }}
              >
                {renderStep()}
              </motion.div>
            </AnimatePresence>
          </div>

          <div className="mt-8 space-y-3">
            {canShowContinue && (
              <Button variant="hero" size="lg" className="w-full gap-2" onClick={handleSignupNext}>
                {signupStep === SIGNUP_STEPS.length - 1 ? "Create Account" : "Continue"}
                <ArrowRight className="w-5 h-5" />
              </Button>
            )}
            {signupStep > 0 && (
              <button onClick={handleSignupPrev} className="w-full text-center text-foreground font-medium hover:text-primary transition-colors py-2">
                Previous
              </button>
            )}
          </div>

          {signupStep === 0 && (
            <div className="mt-6 text-center">
              <p className="text-muted-foreground">
                Already have an account?{" "}
                <button type="button" onClick={() => setMode("login")} className="text-primary font-bold hover:text-primary-dark transition-colors">
                  Sign In
                </button>
              </p>
            </div>
          )}
        </motion.div>
      </div>
    </div>
  );
};

export default AuthPage;
