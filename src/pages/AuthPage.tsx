import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { AnimatePresence, motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { Mail, Lock, Eye, EyeOff, ArrowRight, ArrowLeft, Phone, User, Users } from "lucide-react";
import { toast } from "sonner";
import { useAuthStore } from "@/stores/authStore";
import SignupStepIndicator, { SIGNUP_STEPS } from "@/components/signup/SignupStepIndicator";
import BasicInfoStep from "@/components/signup/steps/BasicInfoStep";
import LocationStep from "@/components/signup/steps/LocationStep";
import ReligiousStep from "@/components/signup/steps/ReligiousStep";
import PersonalStep from "@/components/signup/steps/PersonalStep";
import EducationStep from "@/components/signup/steps/EducationStep";
import AboutMeStep from "@/components/signup/steps/AboutMeStep";
import PhotosStep from "@/components/signup/steps/PhotosStep";
import logoImg from "@/assets/logo.jpg";

type AuthMode = "login" | "signup";
type LoginMethod = "phone" | "email";
type LoginTab = "otp" | "password";

const profileForOptions = ["Myself", "Son", "Daughter", "Brother", "Sister", "Friend", "Relative"];

const stepVariants = {
  enter: (dir: number) => ({ x: dir > 0 ? 80 : -80, opacity: 0 }),
  center: { x: 0, opacity: 1 },
  exit: (dir: number) => ({ x: dir > 0 ? -80 : 80, opacity: 0 }),
};

const AuthPage = () => {
  const navigate = useNavigate();
  const [mode, setMode] = useState<AuthMode>("login");
  const [loginMethod, setLoginMethod] = useState<LoginMethod>("phone");
  const [loginTab, setLoginTab] = useState<LoginTab>("otp");
  const [showPassword, setShowPassword] = useState(false);
  const [signupStep, setSignupStep] = useState(0);
  const [direction, setDirection] = useState(1);
  const [hasChildren, setHasChildren] = useState<"yes" | "no">("no");
  const [photos, setPhotos] = useState<string[]>([]);
  const [otpSent, setOtpSent] = useState(false);
  const [otp, setOtp] = useState(["", "", "", "", "", ""]);
  const [profileFor, setProfileFor] = useState("");

  const [formData, setFormData] = useState({
    name: "", phone: "", email: "", dob: "", gender: "", password: "",
    country: "", state: "", district: "", city: "", address: "",
    religion: "", caste: "", subCaste: "", motherTongue: "",
    maritalStatus: "", numberOfChildren: "", height: "", weight: "", skinTone: "",
    education: "", educationSubject: "", employmentStatus: "", occupation: "",
    aboutMe: "",
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    if (name === "phone") {
      const digitsOnly = value.replace(/\D/g, "").slice(0, 12);
      setFormData({ ...formData, phone: digitsOnly });
      return;
    }
    setFormData({ ...formData, [name]: value });
  };

  const handleSendOtp = (e: React.FormEvent) => {
    e.preventDefault();
    if (loginMethod === "phone") {
      if (!formData.phone) { toast.error("Please enter your phone number"); return; }
      const len = formData.phone.replace(/\D/g, "").length;
      if (len < 10 || len > 12) { toast.error("Phone number must be 10–12 digits"); return; }
    }
    if (loginMethod === "email" && !formData.email) { toast.error("Please enter your email address"); return; }
    setOtpSent(true);
    setOtp(["1", "2", "3", "4", "5", "6"]); // Auto-fill for demo
    toast.success(loginMethod === "phone" ? "OTP sent to your phone (auto-filled for demo)" : "OTP sent to your email (auto-filled for demo)");
  };

  const handlePasswordLogin = (e: React.FormEvent) => {
    e.preventDefault();
    if (loginMethod === "phone" && !formData.phone) { toast.error("Please enter your phone number"); return; }
    if (loginMethod === "email" && !formData.email) { toast.error("Please enter your email"); return; }
    if (!formData.password) { toast.error("Please enter your password"); return; }
    const { login } = useAuthStore.getState();
    login(loginMethod, loginMethod === "phone" ? formData.phone : formData.email);
    toast.success("Login successful! 💕");
    navigate("/dashboard");
  };

  const handleOtpChange = (index: number, value: string) => {
    if (value && !/^\d$/.test(value)) return;
    const next = [...otp];
    next[index] = value.slice(-1);
    setOtp(next);
    if (value && index < 5) document.getElementById(`otp-${index + 1}`)?.focus();
  };

  const handleOtpKeyDown = (index: number, e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Backspace" && !otp[index] && index > 0) document.getElementById(`otp-${index - 1}`)?.focus();
  };

  const handleVerifyOtp = (e: React.FormEvent) => {
    e.preventDefault();
    if (otp.join("").length !== 6) { toast.error("Please enter the 6-digit OTP"); return; }
    const { login } = useAuthStore.getState();
    login(loginMethod, loginMethod === "phone" ? formData.phone : formData.email);
    toast.success("OTP verified! Welcome back! 💕");
    navigate("/dashboard");
  };

  const handleSignupNext = () => {
    if (signupStep === 0) {
      if (!profileFor) { toast.error("Please select who you're creating this profile for"); return; }
      if (!formData.name || !formData.phone || !formData.dob || !formData.gender) { toast.error("Please fill all required fields"); return; }
    }
    if (signupStep < SIGNUP_STEPS.length - 1) { setDirection(1); setSignupStep(signupStep + 1); }
    else { toast.success("Account created successfully! 🎉"); navigate("/search"); }
  };

  const handleSignupPrev = () => { if (signupStep > 0) { setDirection(-1); setSignupStep(signupStep - 1); } };

  const renderStep = () => {
    const props = { formData, onChange: handleChange };
    switch (signupStep) {
      case 0: return <BasicInfoStep {...props} />;
      case 1: return <LocationStep {...props} />;
      case 2: return <ReligiousStep {...props} />;
      case 3: return <PersonalStep {...props} hasChildren={hasChildren} setHasChildren={setHasChildren} />;
      case 4: return <EducationStep {...props} />;
      case 5: return <AboutMeStep {...props} />;
      case 6: return <PhotosStep photos={photos} setPhotos={setPhotos} />;
      default: return null;
    }
  };

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

          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="bg-white/95 backdrop-blur-lg rounded-3xl shadow-elevated p-8 border border-primary/5">
            <div className="text-center mb-6">
              <img src={logoImg} alt="AVB" className="w-20 h-20 object-contain mx-auto mb-3" />
              <h1 className="font-serif text-2xl font-bold text-foreground mb-1">Welcome Back</h1>
              <p className="text-muted-foreground text-sm">Sign in to continue your journey</p>
              <span className="inline-block mt-2 px-3 py-1 bg-accent-gold/40 text-secondary-dark text-xs font-bold rounded-full">🆓 FREE Registration</span>
            </div>

            {/* Phone / Email toggle */}
            <div className="flex gap-3 mb-4">
              {(["phone", "email"] as LoginMethod[]).map((m) => (
                <button key={m} type="button" onClick={() => { setLoginMethod(m); setOtpSent(false); }}
                  className={`flex-1 py-2.5 rounded-2xl font-medium transition-all capitalize text-sm ${loginMethod === m ? "bg-primary text-primary-foreground shadow-soft" : "border-2 border-primary/10 text-foreground hover:bg-accent-rose"}`}>
                  {m}
                </button>
              ))}
            </div>

            {/* OTP / Password toggle */}
            <div className="flex gap-2 mb-5">
              {(["otp", "password"] as LoginTab[]).map((t) => (
                <button key={t} type="button" onClick={() => { setLoginTab(t); setOtpSent(false); }}
                  className={`flex-1 py-2 rounded-xl text-xs font-medium transition-all capitalize ${loginTab === t ? "bg-secondary/20 text-secondary-dark border border-secondary/30" : "text-muted-foreground hover:bg-accent-rose"}`}>
                  {t === "otp" ? "OTP Login" : "Password"}
                </button>
              ))}
            </div>

            {loginTab === "otp" ? (
              !otpSent ? (
                <form onSubmit={handleSendOtp} className="space-y-4">
                  {loginMethod === "phone" ? (
                    <div className="relative flex items-center border-2 border-primary/10 rounded-2xl bg-white focus-within:border-primary transition-colors">
                      <Phone className="absolute left-4 w-5 h-5 text-primary/50" />
                      <span className="pl-12 pr-1 text-sm text-foreground">+91</span>
                      <input type="tel" name="phone" value={formData.phone} onChange={handleChange} placeholder="Phone Number" inputMode="numeric" className="flex-1 px-2 py-3.5 rounded-r-2xl focus:ring-0 border-0 bg-transparent" />
                    </div>
                  ) : (
                    <div className="relative">
                      <Mail className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-primary/50" />
                      <input type="email" name="email" value={formData.email} onChange={handleChange} placeholder="you@example.com" className="w-full pl-12 pr-4 py-3.5 rounded-2xl border-2 border-primary/10 focus:border-primary focus:ring-0 bg-white" />
                    </div>
                  )}
                  <Button type="submit" variant="hero" size="lg" className="w-full gap-2">
                    Send OTP <ArrowRight className="w-5 h-5" />
                  </Button>
                </form>
              ) : (
                <form onSubmit={handleVerifyOtp} className="space-y-4">
                  <p className="text-muted-foreground text-sm mb-2 text-center">
                    Enter the 6-digit OTP sent to{" "}
                    <span className="font-medium text-foreground">{loginMethod === "phone" ? `+91 ${formData.phone}` : formData.email}</span>
                  </p>
                  <div className="flex justify-center gap-2">
                    {otp.map((digit, index) => (
                      <input key={index} id={`otp-${index}`} type="text" inputMode="numeric" maxLength={1} value={digit}
                        onChange={(e) => handleOtpChange(index, e.target.value)} onKeyDown={(e) => handleOtpKeyDown(index, e)}
                        className="w-11 h-12 text-center text-lg font-bold rounded-xl border-2 border-primary/20 focus:border-primary focus:ring-2 focus:ring-primary/20 bg-white transition-colors" />
                    ))}
                  </div>
                  <Button type="submit" variant="hero" size="lg" className="w-full gap-2">Verify & Continue <ArrowRight className="w-5 h-5" /></Button>
                  <button type="button" onClick={() => setOtpSent(false)} className="w-full text-center text-sm text-muted-foreground hover:text-primary transition-colors">
                    Change {loginMethod === "phone" ? "number" : "email"}
                  </button>
                </form>
              )
            ) : (
              <form onSubmit={handlePasswordLogin} className="space-y-4">
                {loginMethod === "phone" ? (
                  <div className="relative flex items-center border-2 border-primary/10 rounded-2xl bg-white focus-within:border-primary transition-colors">
                    <Phone className="absolute left-4 w-5 h-5 text-primary/50" />
                    <span className="pl-12 pr-1 text-sm text-foreground">+91</span>
                    <input type="tel" name="phone" value={formData.phone} onChange={handleChange} placeholder="Phone Number" inputMode="numeric" className="flex-1 px-2 py-3.5 rounded-r-2xl focus:ring-0 border-0 bg-transparent" />
                  </div>
                ) : (
                  <div className="relative">
                    <Mail className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-primary/50" />
                    <input type="email" name="email" value={formData.email} onChange={handleChange} placeholder="you@example.com" className="w-full pl-12 pr-4 py-3.5 rounded-2xl border-2 border-primary/10 focus:border-primary focus:ring-0 bg-white" />
                  </div>
                )}
                <div className="relative">
                  <Lock className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-primary/50" />
                  <input type={showPassword ? "text" : "password"} name="password" value={formData.password} onChange={handleChange} placeholder="Password"
                    className="w-full pl-12 pr-12 py-3.5 rounded-2xl border-2 border-primary/10 focus:border-primary focus:ring-0 bg-white" />
                  <button type="button" onClick={() => setShowPassword(!showPassword)} className="absolute right-4 top-1/2 -translate-y-1/2 text-primary/40 hover:text-primary">
                    {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                  </button>
                </div>
                <Button type="submit" variant="hero" size="lg" className="w-full gap-2">Login <ArrowRight className="w-5 h-5" /></Button>
              </form>
            )}

            <div className="my-5 flex items-center gap-4">
              <div className="flex-1 border-t border-primary/10" />
              <span className="text-sm text-muted-foreground">OR</span>
              <div className="flex-1 border-t border-primary/10" />
            </div>
            <div className="text-center">
              <p className="text-muted-foreground">Don't have an account?{" "}
                <button type="button" onClick={() => { setMode("signup"); setSignupStep(0); }} className="text-primary font-bold hover:text-primary-dark transition-colors">Sign Up</button>
              </p>
            </div>
          </motion.div>
        </div>
      </div>
    );
  }

  // ---- SIGNUP VIEW ----
  return (
    <div className="min-h-screen bg-gradient-romantic flex items-center justify-center relative overflow-hidden py-8 px-4">
      <div className="absolute top-10 left-10 w-48 h-48 bg-secondary/25 rounded-full blur-3xl animate-float" />
      <div className="absolute bottom-10 right-10 w-64 h-64 bg-primary/15 rounded-full blur-3xl animate-float-delayed" />

      <div className="w-full max-w-md relative z-10">
        {signupStep === 0 ? (
          <button onClick={() => setMode("login")} className="flex items-center gap-2 text-primary hover:text-primary-dark transition-colors mb-4 group">
            <ArrowLeft className="w-5 h-5 group-hover:-translate-x-1 transition-transform" /> <span className="font-medium">Back to Sign In</span>
          </button>
        ) : (
          <button onClick={handleSignupPrev} className="flex items-center gap-2 text-primary hover:text-primary-dark transition-colors mb-4 group">
            <ArrowLeft className="w-5 h-5 group-hover:-translate-x-1 transition-transform" /> <span className="font-medium">Previous Step</span>
          </button>
        )}

        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="bg-white/95 backdrop-blur-lg rounded-3xl shadow-elevated p-8 border border-primary/5">
          <SignupStepIndicator currentStep={signupStep} />

          {/* Profile For Selection - shown on step 0 */}
          {signupStep === 0 && (
            <div className="mb-6">
              <label className="text-sm font-medium text-foreground mb-2 block flex items-center gap-2">
                <Users className="w-4 h-4 text-primary" /> Profile for
              </label>
              <div className="flex flex-wrap gap-2">
                {profileForOptions.map((opt) => (
                  <button key={opt} type="button" onClick={() => setProfileFor(opt)}
                    className={`px-4 py-2 rounded-full text-sm font-medium transition-all ${
                      profileFor === opt ? "bg-primary text-primary-foreground shadow-soft" : "bg-accent-rose text-foreground hover:bg-primary/10"
                    }`}>
                    {opt}
                  </button>
                ))}
              </div>
            </div>
          )}

          <div className="overflow-hidden min-h-[380px]">
            <AnimatePresence mode="wait" custom={direction}>
              <motion.div key={signupStep} custom={direction} variants={stepVariants} initial="enter" animate="center" exit="exit" transition={{ duration: 0.3 }}>
                {renderStep()}
              </motion.div>
            </AnimatePresence>
          </div>

          <div className="mt-8 space-y-3">
            <Button variant="hero" size="lg" className="w-full gap-2" onClick={handleSignupNext}>
              {signupStep === SIGNUP_STEPS.length - 1 ? "Create Account" : "Continue"} <ArrowRight className="w-5 h-5" />
            </Button>
            {signupStep > 0 && (
              <button onClick={handleSignupPrev} className="w-full text-center text-foreground font-medium hover:text-primary transition-colors py-2">Previous</button>
            )}
          </div>

          {signupStep === 0 && (
            <div className="mt-6 text-center">
              <p className="text-muted-foreground">Already have an account?{" "}
                <button type="button" onClick={() => setMode("login")} className="text-primary font-bold hover:text-primary-dark transition-colors">Sign In</button>
              </p>
            </div>
          )}
        </motion.div>
      </div>
    </div>
  );
};

export default AuthPage;
