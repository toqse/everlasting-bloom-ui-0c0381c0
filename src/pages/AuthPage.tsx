import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Heart, Mail, Lock, User, Eye, EyeOff, Sparkles, ArrowRight, ArrowLeft, Phone, Calendar, MapPin, BookOpen, Briefcase, Camera, PlusCircle, ChevronDown } from "lucide-react";
import { toast } from "sonner";

type AuthMode = "login" | "signup";
type LoginMethod = "phone" | "email";

const SIGNUP_STEPS = [
  "Basic Info",
  "Location",
  "Religious",
  "Personal",
  "Education",
  "About Me",
  "Photos",
];

const AuthPage = () => {
  const navigate = useNavigate();
  const [mode, setMode] = useState<AuthMode>("login");
  const [loginMethod, setLoginMethod] = useState<LoginMethod>("phone");
  const [showPassword, setShowPassword] = useState(false);
  const [signupStep, setSignupStep] = useState(0);
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
      if (!formData.name || !formData.phone || !formData.email || !formData.dob || !formData.gender) {
        toast.error("Please fill all required fields");
        return;
      }
      if (!agreeTerms) {
        toast.error("Please agree to Terms & Conditions");
        return;
      }
    }
    if (signupStep < SIGNUP_STEPS.length - 1) {
      setSignupStep(signupStep + 1);
    } else {
      toast.success("Account created successfully! 🎉", { description: "Welcome to EternalBond!" });
      navigate("/search");
    }
  };

  const handleSignupPrev = () => {
    if (signupStep > 0) setSignupStep(signupStep - 1);
  };

  const selectClass = "w-full px-4 py-3.5 rounded-2xl border-2 border-primary/10 focus:border-primary focus:ring-0 transition-colors bg-white appearance-none";
  const inputClass = "w-full px-4 py-3.5 rounded-2xl border-2 border-primary/10 focus:border-primary focus:ring-0 transition-colors bg-white";
  const labelClass = "block text-sm font-medium text-foreground mb-1.5";

  const SelectField = ({ label, name, options, optional }: { label: string; name: string; options: string[]; optional?: boolean }) => (
    <div>
      <label className={labelClass}>{label}{optional && <span className="text-muted-foreground"> (Optional)</span>}</label>
      <div className="relative">
        <select name={name} value={(formData as any)[name]} onChange={handleChange} className={selectClass}>
          <option value="">Select {label}</option>
          {options.map(o => <option key={o} value={o}>{o}</option>)}
        </select>
        <ChevronDown className="absolute right-4 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground pointer-events-none" />
      </div>
    </div>
  );

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

          <div className="bg-white/95 backdrop-blur-lg rounded-3xl shadow-elevated p-8 border border-primary/5 animate-scale-in">
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

            {/* Phone / Email Toggle */}
            <div className="flex gap-3 mb-6">
              <button
                onClick={() => setLoginMethod("phone")}
                className={`flex-1 py-3 rounded-2xl font-medium transition-all ${loginMethod === "phone" ? "bg-primary text-primary-foreground shadow-soft" : "border-2 border-primary/10 text-foreground hover:bg-accent-rose"}`}
              >
                Phone
              </button>
              <button
                onClick={() => setLoginMethod("email")}
                className={`flex-1 py-3 rounded-2xl font-medium transition-all ${loginMethod === "email" ? "bg-primary text-primary-foreground shadow-soft" : "border-2 border-primary/10 text-foreground hover:bg-accent-rose"}`}
              >
                Email
              </button>
            </div>

            <form onSubmit={handleLoginSubmit} className="space-y-4">
              {loginMethod === "phone" ? (
                <div>
                  <div className="relative flex items-center border-2 border-primary/10 rounded-2xl bg-white focus-within:border-primary transition-colors">
                    <span className="flex items-center gap-1.5 pl-4 pr-2 text-sm text-foreground border-r border-primary/10">
                      🇮🇳 +91
                    </span>
                    <input
                      type="tel"
                      name="phone"
                      value={formData.phone}
                      onChange={handleChange}
                      placeholder="Phone number"
                      className="flex-1 px-3 py-3.5 rounded-r-2xl focus:ring-0 border-0 bg-transparent"
                    />
                  </div>
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
          </div>
        </div>
      </div>
    );
  }

  // ---- SIGNUP VIEW (multi-step) ----
  return (
    <div className="min-h-screen bg-gradient-romantic flex items-center justify-center relative overflow-hidden py-8 px-4">
      <div className="absolute top-10 left-10 w-48 h-48 bg-secondary/25 rounded-full blur-3xl animate-float" />
      <div className="absolute bottom-10 right-10 w-64 h-64 bg-primary/15 rounded-full blur-3xl animate-float-delayed" />

      <div className="w-full max-w-md relative z-10">
        {signupStep === 0 && (
          <button onClick={() => setMode("login")} className="flex items-center gap-2 text-primary hover:text-primary-dark transition-colors mb-4 group">
            <ArrowLeft className="w-5 h-5 group-hover:-translate-x-1 transition-transform" />
            <span className="font-medium">Back to Sign In</span>
          </button>
        )}

        <div className="bg-white/95 backdrop-blur-lg rounded-3xl shadow-elevated p-8 border border-primary/5 animate-scale-in">
          {/* Step 0: Basic Info */}
          {signupStep === 0 && (
            <>
              <div className="text-center mb-6">
                <div className="w-16 h-16 mx-auto rounded-full bg-primary flex items-center justify-center mb-4">
                  <User className="w-8 h-8 text-primary-foreground" />
                  <PlusCircle className="w-5 h-5 text-primary-foreground absolute ml-10 mt-8" />
                </div>
                <h1 className="font-serif text-2xl font-bold text-foreground mb-1">Create Account</h1>
                <p className="text-muted-foreground text-sm">Join us to find your perfect match</p>
              </div>
              <div className="space-y-4">
                <div className="relative">
                  <User className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-primary/50" />
                  <input type="text" name="name" value={formData.name} onChange={handleChange} placeholder="Full Name" className="w-full pl-12 pr-4 py-3.5 rounded-2xl border-2 border-primary/10 focus:border-primary focus:ring-0 transition-colors" />
                </div>
                <div className="relative flex items-center border-2 border-primary/10 rounded-2xl bg-white focus-within:border-primary transition-colors">
                  <Phone className="absolute left-4 w-5 h-5 text-primary/50" />
                  <span className="pl-12 pr-1 text-sm text-foreground">+91</span>
                  <input type="tel" name="phone" value={formData.phone} onChange={handleChange} placeholder="Phone Number" className="flex-1 px-2 py-3.5 rounded-r-2xl focus:ring-0 border-0 bg-transparent" />
                </div>
                <div className="relative">
                  <Mail className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-primary/50" />
                  <input type="email" name="email" value={formData.email} onChange={handleChange} placeholder="Email Address" className="w-full pl-12 pr-4 py-3.5 rounded-2xl border-2 border-primary/10 focus:border-primary focus:ring-0 transition-colors" />
                </div>
                <div className="relative">
                  <Calendar className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-primary/50" />
                  <input type="date" name="dob" value={formData.dob} onChange={handleChange} placeholder="Select Date of Birth" className="w-full pl-12 pr-4 py-3.5 rounded-2xl border-2 border-primary/10 focus:border-primary focus:ring-0 transition-colors" />
                </div>
                <SelectField label="" name="gender" options={["Male", "Female"]} />
                <label className="flex items-center gap-3 cursor-pointer">
                  <input type="checkbox" checked={agreeTerms} onChange={() => setAgreeTerms(!agreeTerms)} className="w-5 h-5 rounded border-primary/30 text-primary focus:ring-primary" />
                  <span className="text-sm text-foreground">I agree to the <a href="#" className="text-primary font-medium hover:underline">Terms & Conditions</a></span>
                </label>
              </div>
            </>
          )}

          {/* Step 1: Location Details */}
          {signupStep === 1 && (
            <>
              <div className="text-center mb-6">
                <h1 className="font-serif text-2xl font-bold text-foreground mb-1">Location Details</h1>
                <p className="text-muted-foreground text-sm">Please provide your address information</p>
              </div>
              <div className="space-y-4">
                <SelectField label="Country" name="country" options={["India", "USA", "UK", "Canada", "Australia"]} />
                <SelectField label="State" name="state" options={["Tamil Nadu", "Karnataka", "Kerala", "Andhra Pradesh", "Maharashtra", "Delhi", "Uttar Pradesh"]} />
                <SelectField label="District" name="district" options={["Chennai", "Coimbatore", "Madurai", "Salem", "Tiruchirappalli"]} />
                <SelectField label="City" name="city" options={["Chennai", "Coimbatore", "Madurai", "Salem"]} />
                <div>
                  <label className={labelClass}>Address</label>
                  <textarea name="address" value={formData.address} onChange={handleChange} placeholder="Enter your address" rows={3} className="w-full px-4 py-3 rounded-2xl border-2 border-primary/10 focus:border-primary focus:ring-0 transition-colors bg-white resize-none" />
                </div>
              </div>
            </>
          )}

          {/* Step 2: Religious Details */}
          {signupStep === 2 && (
            <>
              <div className="text-center mb-6">
                <h1 className="font-serif text-2xl font-bold text-foreground mb-1">Religious Details</h1>
                <p className="text-muted-foreground text-sm">Please provide your religious information</p>
              </div>
              <div className="space-y-4">
                <SelectField label="Religion" name="religion" options={["Hindu", "Muslim", "Christian", "Sikh", "Buddhist", "Jain"]} />
                <SelectField label="Caste" name="caste" options={["Brahmin", "Kshatriya", "Vaishya", "Shudra", "Other"]} />
                <SelectField label="Sub-Caste" name="subCaste" options={["Iyer", "Iyengar", "Mudaliar", "Nadar", "Gounder", "Other"]} optional />
                <SelectField label="Mother Tongue" name="motherTongue" options={["Tamil", "Telugu", "Kannada", "Malayalam", "Hindi", "English", "Urdu"]} />
              </div>
            </>
          )}

          {/* Step 3: Personal Details */}
          {signupStep === 3 && (
            <>
              <div className="text-center mb-6">
                <h1 className="font-serif text-2xl font-bold text-foreground mb-1">Personal Details</h1>
                <p className="text-muted-foreground text-sm">Please provide your personal information</p>
              </div>
              <div className="space-y-4">
                <SelectField label="Marital Status" name="maritalStatus" options={["Never Married", "Divorced", "Widowed", "Separated"]} />
                <div>
                  <label className={labelClass}>Do you have children?</label>
                  <div className="flex gap-6 mt-1">
                    <label className="flex items-center gap-2 cursor-pointer">
                      <input type="radio" name="hasChildren" checked={hasChildren === "yes"} onChange={() => setHasChildren("yes")} className="w-5 h-5 text-primary focus:ring-primary" />
                      <span className="text-foreground">Yes</span>
                    </label>
                    <label className="flex items-center gap-2 cursor-pointer">
                      <input type="radio" name="hasChildren" checked={hasChildren === "no"} onChange={() => setHasChildren("no")} className="w-5 h-5 text-primary focus:ring-primary" />
                      <span className="text-foreground">No</span>
                    </label>
                  </div>
                </div>
                {hasChildren === "yes" && (
                  <div>
                    <label className={labelClass}>Number of Children</label>
                    <input type="number" name="numberOfChildren" value={formData.numberOfChildren} onChange={handleChange} placeholder="Enter number of children" className={inputClass} />
                  </div>
                )}
                <div>
                  <label className={labelClass}>Height (in cm)</label>
                  <input type="number" name="height" value={formData.height} onChange={handleChange} placeholder="Enter height in centimeters" className={inputClass} />
                </div>
                <div>
                  <label className={labelClass}>Weight (in kg)</label>
                  <input type="number" name="weight" value={formData.weight} onChange={handleChange} placeholder="Enter weight in kilograms" className={inputClass} />
                </div>
                <SelectField label="Skin Tone" name="skinTone" options={["Fair", "Wheatish", "Dark", "Very Fair"]} />
              </div>
            </>
          )}

          {/* Step 4: Education & Occupation */}
          {signupStep === 4 && (
            <>
              <div className="text-center mb-6">
                <h1 className="font-serif text-2xl font-bold text-foreground mb-1">Education & Occupation Details</h1>
                <p className="text-muted-foreground text-sm">Please provide your educational and employment information</p>
              </div>
              <div className="space-y-4">
                <SelectField label="Highest Education" name="education" options={["High School", "Diploma", "Bachelor's", "Master's", "PhD", "Other"]} />
                <SelectField label="Education Subject" name="educationSubject" options={["Engineering", "Medicine", "Arts", "Science", "Commerce", "Law", "Other"]} />
                <SelectField label="Employment Status" name="employmentStatus" options={["Employed", "Self-Employed", "Business", "Unemployed", "Student"]} />
                <div>
                  <label className={labelClass}>Occupation / Job</label>
                  <input type="text" name="occupation" value={formData.occupation} onChange={handleChange} placeholder="e.g. Software Developer, Teacher, Engineer" className={inputClass} />
                </div>
              </div>
            </>
          )}

          {/* Step 5: About Me */}
          {signupStep === 5 && (
            <>
              <div className="text-center mb-6">
                <h1 className="font-serif text-2xl font-bold text-foreground mb-1">About Me</h1>
                <p className="text-muted-foreground text-sm">Tell us about yourself</p>
              </div>
              <div>
                <label className={labelClass}>About Me</label>
                <textarea name="aboutMe" value={formData.aboutMe} onChange={handleChange} placeholder="Write about yourself, your interests, hobbies, values, and what you are looking for..." rows={8} className="w-full px-4 py-3 rounded-2xl border-2 border-primary/10 focus:border-primary focus:ring-0 transition-colors bg-white resize-none" />
              </div>
            </>
          )}

          {/* Step 6: Add Photos */}
          {signupStep === 6 && (
            <>
              <div className="text-center mb-6">
                <h1 className="font-serif text-2xl font-bold text-foreground mb-1">Add Photos</h1>
                <p className="text-muted-foreground text-sm">Add your photos to complete your profile. You can add up to 4 photos.</p>
              </div>
              <div className="flex justify-center mb-6">
                <div className="w-24 h-24 rounded-full border-2 border-primary/30 flex items-center justify-center bg-accent-rose">
                  <User className="w-12 h-12 text-primary/50" />
                </div>
              </div>
              <p className="font-medium text-foreground mb-3">All photos</p>
              <div className="grid grid-cols-2 gap-4">
                {photos.map((p, i) => (
                  <div key={i} className="aspect-square rounded-2xl border-2 border-primary/10 bg-accent-rose flex items-center justify-center overflow-hidden">
                    <img src={p} alt="" className="w-full h-full object-cover" />
                  </div>
                ))}
                {photos.length < 4 && (
                  <label className="aspect-square rounded-2xl border-2 border-primary/20 border-dashed flex flex-col items-center justify-center cursor-pointer hover:bg-accent-rose transition-colors">
                    <PlusCircle className="w-8 h-8 text-primary/50 mb-1" />
                    <span className="text-sm text-primary font-medium">Add Photo</span>
                    <input type="file" accept="image/*" className="hidden" onChange={(e) => {
                      const file = e.target.files?.[0];
                      if (file) {
                        const url = URL.createObjectURL(file);
                        setPhotos([...photos, url]);
                      }
                    }} />
                  </label>
                )}
              </div>
            </>
          )}

          {/* Navigation Buttons */}
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
        </div>
      </div>
    </div>
  );
};

export default AuthPage;
