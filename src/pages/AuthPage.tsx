import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { AnimatePresence, motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { Heart, Mail, Lock, Eye, EyeOff, Sparkles, ArrowRight, ArrowLeft, Phone } from "lucide-react";
import { toast } from "sonner";
import SignupStepIndicator, { SIGNUP_STEPS } from "@/components/signup/SignupStepIndicator";
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
  const [photos, setPhotos] = useState<string[]>([]);

  const [formData, setFormData] = useState({
    name: "", phone: "", email: "", dob: "", gender: "", password: "",
    country: "", state: "", district: "", city: "", address: "",
    religion: "", caste: "", subCaste: "", motherTongue: "",
    maritalStatus: "", numberOfChildren: "", height: "", weight: "", skinTone: "",
    education: "", educationSubject: "", employmentStatus: "", occupation: "",
    aboutMe: "",
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleLoginSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (loginMethod === "phone" && !formData.phone) {
      toast.error("Please enter your phone number");
      return;
    }
    if (loginMethod === "email" && (!formData.email || !formData.password)) {
      toast.error("Please fill in all fields");
      return;
    }
    toast.success("Welcome back! 💕");
    navigate("/search");
  };

  const handleSignupNext = () => {
    if (signupStep === 0) {
      if (!formData.name || !formData.phone || !formData.email || !formData.dob || !formData.gender || !formData.password) {
        toast.error("Please fill all required fields");
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
      toast.success("Account created successfully! 🎉", { description: "Welcome to EternalBond!" });
      navigate("/search");
    }
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
      case 0: return <BasicInfoStep {...props} agreeTerms={agreeTerms} setAgreeTerms={setAgreeTerms} />;
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
                  Eternal<span className="text-secondary">Bond</span>
                </span>
              </div>
              <h1 className="font-serif text-2xl font-bold text-foreground mb-2">Welcome Back</h1>
              <p className="text-muted-foreground text-sm">Sign in to continue your journey</p>
            </div>

            <div className="flex gap-3 mb-6">
              {(["phone", "email"] as LoginMethod[]).map((m) => (
                <button
                  key={m}
                  onClick={() => setLoginMethod(m)}
                  className={`flex-1 py-3 rounded-2xl font-medium transition-all capitalize ${loginMethod === m ? "bg-primary text-primary-foreground shadow-soft" : "border-2 border-primary/10 text-foreground hover:bg-accent-rose"}`}
                >
                  {m}
                </button>
              ))}
            </div>

            <form onSubmit={handleLoginSubmit} className="space-y-4">
              {loginMethod === "phone" ? (
                <div className="relative flex items-center border-2 border-primary/10 rounded-2xl bg-white focus-within:border-primary transition-colors">
                  <span className="flex items-center gap-1.5 pl-4 pr-2 text-sm text-foreground border-r border-primary/10">🇮🇳 +91</span>
                  <input type="tel" name="phone" value={formData.phone} onChange={handleChange} placeholder="Phone number" className="flex-1 px-3 py-3.5 rounded-r-2xl focus:ring-0 border-0 bg-transparent" />
                </div>
              ) : (
                <>
                  <div className="relative">
                    <Mail className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-primary/50" />
                    <input type="email" name="email" value={formData.email} onChange={handleChange} placeholder="you@example.com" className="w-full pl-12 pr-4 py-3.5 rounded-2xl border-2 border-primary/10 focus:border-primary focus:ring-0 transition-colors" />
                  </div>
                  <div className="relative">
                    <Lock className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-primary/50" />
                    <input type={showPassword ? "text" : "password"} name="password" value={formData.password} onChange={handleChange} placeholder="••••••••" className="w-full pl-12 pr-12 py-3.5 rounded-2xl border-2 border-primary/10 focus:border-primary focus:ring-0 transition-colors" />
                    <button type="button" onClick={() => setShowPassword(!showPassword)} className="absolute right-4 top-1/2 -translate-y-1/2 text-primary/50 hover:text-primary">
                      {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                    </button>
                  </div>
                </>
              )}
              <Button type="submit" variant="hero" size="lg" className="w-full gap-2">
                {loginMethod === "phone" ? "Send OTP" : "Sign In"}
                <ArrowRight className="w-5 h-5" />
              </Button>
            </form>

            <div className="my-6 flex items-center gap-4">
              <div className="flex-1 border-t border-primary/10" />
              <span className="text-sm text-muted-foreground">OR</span>
              <div className="flex-1 border-t border-primary/10" />
            </div>

            <div className="text-center">
              <p className="text-muted-foreground">
                Don't have an account?{" "}
                <button type="button" onClick={() => { setMode("signup"); setSignupStep(0); }} className="text-primary font-bold hover:text-primary-dark transition-colors">
                  Sign Up
                </button>
              </p>
            </div>
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

      <div className="w-full max-w-md relative z-10">
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
            <Button variant="hero" size="lg" className="w-full gap-2" onClick={handleSignupNext}>
              {signupStep === SIGNUP_STEPS.length - 1 ? "Create Account" : "Continue"}
              <ArrowRight className="w-5 h-5" />
            </Button>
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
