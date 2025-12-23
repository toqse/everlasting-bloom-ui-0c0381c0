import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Heart, Mail, Lock, User, Eye, EyeOff, Sparkles, ArrowRight, ArrowLeft, Phone, Calendar } from "lucide-react";
import { toast } from "sonner";

const AuthPage = () => {
  const navigate = useNavigate();
  const [isLogin, setIsLogin] = useState(true);
  const [showPassword, setShowPassword] = useState(false);
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phone: "",
    password: "",
    confirmPassword: "",
    gender: "",
    dob: "",
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (isLogin) {
      // Login logic
      if (!formData.email || !formData.password) {
        toast.error("Please fill in all fields");
        return;
      }
      toast.success("Welcome back! 💕", {
        description: "You've been logged in successfully.",
      });
      navigate("/search");
    } else {
      // Register logic
      if (!formData.name || !formData.email || !formData.password || !formData.phone) {
        toast.error("Please fill in all required fields");
        return;
      }
      if (formData.password !== formData.confirmPassword) {
        toast.error("Passwords do not match");
        return;
      }
      toast.success("Account created successfully! 🎉", {
        description: "Welcome to EternalBond. Let's find your perfect match!",
      });
      navigate("/search");
    }
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  return (
    <div className="min-h-screen bg-gradient-romantic flex items-center justify-center relative overflow-hidden py-12 px-4">
      {/* Decorative Elements */}
      <div className="absolute top-10 left-10 w-48 h-48 bg-secondary/25 rounded-full blur-3xl animate-float" />
      <div className="absolute bottom-10 right-10 w-64 h-64 bg-primary/15 rounded-full blur-3xl animate-float-delayed" />
      <div className="absolute top-1/2 left-1/4 w-40 h-40 bg-accent-pink rounded-full blur-3xl animate-pulse-soft" />
      
      {/* Floating Hearts */}
      {[...Array(8)].map((_, i) => (
        <Heart
          key={i}
          className="absolute text-primary/10 fill-primary/10 animate-petal-fall"
          style={{
            left: `${5 + i * 12}%`,
            animationDelay: `${i * 1.5}s`,
            animationDuration: `${10 + i * 2}s`,
            width: `${16 + i * 4}px`,
            height: `${16 + i * 4}px`,
          }}
        />
      ))}

      {/* Floating Sparkles */}
      {[...Array(6)].map((_, i) => (
        <Sparkles
          key={i}
          className="absolute text-secondary/30 animate-sparkle"
          style={{
            left: `${10 + i * 15}%`,
            top: `${15 + (i % 3) * 30}%`,
            width: `${18 + i * 3}px`,
            animationDelay: `${i * 0.5}s`,
          }}
        />
      ))}

      <div className="w-full max-w-md relative z-10">
        {/* Back Button */}
        <button
          onClick={() => navigate("/")}
          className="flex items-center gap-2 text-primary hover:text-primary-dark transition-colors mb-6 group"
        >
          <ArrowLeft className="w-5 h-5 group-hover:-translate-x-1 transition-transform" />
          <span className="font-medium">Back to Home</span>
        </button>

        {/* Auth Card */}
        <div className="bg-white/95 backdrop-blur-lg rounded-3xl shadow-elevated p-8 border border-primary/5 animate-scale-in">
          {/* Logo */}
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
            <h1 className="font-serif text-2xl font-bold text-foreground mb-2">
              {isLogin ? "Welcome Back!" : "Create Account"}
            </h1>
            <p className="text-muted-foreground text-sm">
              {isLogin ? "Sign in to continue your journey" : "Join millions finding love on EternalBond"}
            </p>
          </div>

          {/* Form */}
          <form onSubmit={handleSubmit} className="space-y-4">
            {!isLogin && (
              <>
                {/* Name */}
                <div>
                  <label className="block text-sm font-medium text-foreground mb-1.5">Full Name</label>
                  <div className="relative">
                    <User className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-primary/50" />
                    <input
                      type="text"
                      name="name"
                      value={formData.name}
                      onChange={handleInputChange}
                      placeholder="Enter your full name"
                      className="w-full pl-12 pr-4 py-3 rounded-xl border-2 border-primary/10 focus:border-primary focus:ring-0 transition-colors"
                    />
                  </div>
                </div>

                {/* Phone */}
                <div>
                  <label className="block text-sm font-medium text-foreground mb-1.5">Phone Number</label>
                  <div className="relative">
                    <Phone className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-primary/50" />
                    <input
                      type="tel"
                      name="phone"
                      value={formData.phone}
                      onChange={handleInputChange}
                      placeholder="+91 98765 43210"
                      className="w-full pl-12 pr-4 py-3 rounded-xl border-2 border-primary/10 focus:border-primary focus:ring-0 transition-colors"
                    />
                  </div>
                </div>

                {/* Gender & DOB */}
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-foreground mb-1.5">Gender</label>
                    <select
                      name="gender"
                      value={formData.gender}
                      onChange={handleInputChange}
                      className="w-full px-4 py-3 rounded-xl border-2 border-primary/10 focus:border-primary focus:ring-0 transition-colors"
                    >
                      <option value="">Select</option>
                      <option value="male">Male</option>
                      <option value="female">Female</option>
                    </select>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-foreground mb-1.5">Date of Birth</label>
                    <div className="relative">
                      <Calendar className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-primary/50" />
                      <input
                        type="date"
                        name="dob"
                        value={formData.dob}
                        onChange={handleInputChange}
                        className="w-full pl-10 pr-4 py-3 rounded-xl border-2 border-primary/10 focus:border-primary focus:ring-0 transition-colors"
                      />
                    </div>
                  </div>
                </div>
              </>
            )}

            {/* Email */}
            <div>
              <label className="block text-sm font-medium text-foreground mb-1.5">Email Address</label>
              <div className="relative">
                <Mail className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-primary/50" />
                <input
                  type="email"
                  name="email"
                  value={formData.email}
                  onChange={handleInputChange}
                  placeholder="you@example.com"
                  className="w-full pl-12 pr-4 py-3 rounded-xl border-2 border-primary/10 focus:border-primary focus:ring-0 transition-colors"
                />
              </div>
            </div>

            {/* Password */}
            <div>
              <label className="block text-sm font-medium text-foreground mb-1.5">Password</label>
              <div className="relative">
                <Lock className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-primary/50" />
                <input
                  type={showPassword ? "text" : "password"}
                  name="password"
                  value={formData.password}
                  onChange={handleInputChange}
                  placeholder="••••••••"
                  className="w-full pl-12 pr-12 py-3 rounded-xl border-2 border-primary/10 focus:border-primary focus:ring-0 transition-colors"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-4 top-1/2 -translate-y-1/2 text-primary/50 hover:text-primary transition-colors"
                >
                  {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                </button>
              </div>
            </div>

            {/* Confirm Password */}
            {!isLogin && (
              <div>
                <label className="block text-sm font-medium text-foreground mb-1.5">Confirm Password</label>
                <div className="relative">
                  <Lock className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-primary/50" />
                  <input
                    type={showPassword ? "text" : "password"}
                    name="confirmPassword"
                    value={formData.confirmPassword}
                    onChange={handleInputChange}
                    placeholder="••••••••"
                    className="w-full pl-12 pr-4 py-3 rounded-xl border-2 border-primary/10 focus:border-primary focus:ring-0 transition-colors"
                  />
                </div>
              </div>
            )}

            {/* Forgot Password */}
            {isLogin && (
              <div className="text-right">
                <button type="button" className="text-sm text-primary hover:text-primary-dark transition-colors">
                  Forgot Password?
                </button>
              </div>
            )}

            {/* Submit Button */}
            <Button type="submit" variant="hero" size="lg" className="w-full gap-2 mt-6">
              {isLogin ? "Sign In" : "Create Account"}
              <ArrowRight className="w-5 h-5" />
            </Button>
          </form>

          {/* Social Login */}
          <div className="mt-6">
            <div className="relative">
              <div className="absolute inset-0 flex items-center">
                <div className="w-full border-t border-primary/10" />
              </div>
              <div className="relative flex justify-center text-sm">
                <span className="px-4 bg-white text-muted-foreground">Or continue with</span>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4 mt-6">
              <button className="flex items-center justify-center gap-2 px-4 py-3 border-2 border-primary/10 rounded-xl hover:bg-accent-rose transition-colors group">
                <svg className="w-5 h-5" viewBox="0 0 24 24">
                  <path fill="#EA4335" d="M5.26620003,9.76452941 C6.19878754,6.93863203 8.85444915,4.90909091 12,4.90909091 C13.6909091,4.90909091 15.2181818,5.50909091 16.4181818,6.49090909 L19.9090909,3 C17.7818182,1.14545455 15.0545455,0 12,0 C7.27006974,0 3.1977497,2.69829785 1.23999023,6.65002441 L5.26620003,9.76452941 Z"/>
                  <path fill="#34A853" d="M16.0407269,18.0125889 C14.9509167,18.7163016 13.5660892,19.0909091 12,19.0909091 C8.86648613,19.0909091 6.21911939,17.076871 5.27698177,14.2678769 L1.23746264,17.3349879 C3.19279051,21.2936293 7.26500293,24 12,24 C14.9328362,24 17.7353462,22.9573905 19.834192,20.9995801 L16.0407269,18.0125889 Z"/>
                  <path fill="#4A90E2" d="M19.834192,20.9995801 C22.0291676,18.9520994 23.4545455,15.903663 23.4545455,12 C23.4545455,11.2909091 23.3454545,10.5272727 23.1818182,9.81818182 L12,9.81818182 L12,14.4545455 L18.4363636,14.4545455 C18.1187732,16.013626 17.2662994,17.2212117 16.0407269,18.0125889 L19.834192,20.9995801 Z"/>
                  <path fill="#FBBC05" d="M5.27698177,14.2678769 C5.03832634,13.556323 4.90909091,12.7937589 4.90909091,12 C4.90909091,11.2182781 5.03443647,10.4668121 5.26620003,9.76452941 L1.23999023,6.65002441 C0.43658717,8.26043162 0,10.0753848 0,12 C0,13.9195484 0.444780743,15.7## 01021 1.23746264,17.3349879 L5.27698177,14.2678769 Z"/>
                </svg>
                <span className="font-medium text-foreground">Google</span>
              </button>
              <button className="flex items-center justify-center gap-2 px-4 py-3 border-2 border-primary/10 rounded-xl hover:bg-accent-rose transition-colors group">
                <svg className="w-5 h-5" fill="#1877F2" viewBox="0 0 24 24">
                  <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z"/>
                </svg>
                <span className="font-medium text-foreground">Facebook</span>
              </button>
            </div>
          </div>

          {/* Toggle Login/Register */}
          <div className="mt-8 text-center">
            <p className="text-muted-foreground">
              {isLogin ? "Don't have an account?" : "Already have an account?"}{" "}
              <button
                type="button"
                onClick={() => setIsLogin(!isLogin)}
                className="text-primary font-medium hover:text-primary-dark transition-colors"
              >
                {isLogin ? "Sign Up" : "Sign In"}
              </button>
            </p>
          </div>
        </div>

        {/* Terms */}
        <p className="text-center text-xs text-muted-foreground mt-6">
          By continuing, you agree to our{" "}
          <a href="#" className="text-primary hover:underline">Terms of Service</a>
          {" "}and{" "}
          <a href="#" className="text-primary hover:underline">Privacy Policy</a>
        </p>
      </div>
    </div>
  );
};

export default AuthPage;
