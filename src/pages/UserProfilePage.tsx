import { useState } from "react";
import { motion } from "framer-motion";
import DashboardLayout from "@/components/DashboardLayout";
import { useAuthStore } from "@/stores/authStore";
import {
  Edit,
  MapPin,
  User,
  GraduationCap,
  Heart,
  Sparkles,
  Crown,
  BookHeart,
  ArrowRight,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { useNavigate } from "react-router-dom";
import { cn } from "@/lib/utils";

type ProfileSection = "my-profile" | "horoscope" | "plans" | "success-stories";

const profileMenu: { id: ProfileSection; label: string; icon: typeof User }[] = [
  { id: "my-profile", label: "My Profile", icon: User },
  { id: "horoscope", label: "Horoscope", icon: Sparkles },
  { id: "plans", label: "Plans", icon: Crown },
  { id: "success-stories", label: "Success Stories", icon: BookHeart },
];

const UserProfilePage = () => {
  const { user } = useAuthStore();
  const navigate = useNavigate();
  const [activeSection, setActiveSection] = useState<ProfileSection>("my-profile");

  const personalInfo = [
    { label: "Full Name", value: user?.name || "Anna Jaslin" },
    { label: "Date of Birth", value: "15 March 1996" },
    { label: "Gender", value: "Female" },
    { label: "Marital Status", value: "Never Married" },
    { label: "Height", value: "5'4\"" },
    { label: "Religion", value: "Hindu" },
    { label: "Caste", value: "Brahmin" },
    { label: "Mother Tongue", value: "Hindi" },
  ];

  const educationInfo = [
    { label: "Education", value: "Masters in Computer Science" },
    { label: "Occupation", value: "Software Engineer" },
    { label: "Annual Income", value: "₹8-10 Lakhs" },
    { label: "Working At", value: "TCS, Mumbai" },
  ];

  const locationInfo = [
    { label: "Country", value: "India" },
    { label: "State", value: "Maharashtra" },
    { label: "City", value: user?.location?.split(",")[0] || "Mumbai" },
  ];

  return (
    <DashboardLayout>
      <div className="flex flex-col lg:flex-row gap-6">
        {/* Left sidebar menu */}
        <motion.aside
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          className="lg:w-64 flex-shrink-0"
        >
          <nav className="bg-white rounded-3xl shadow-card p-2 sticky top-8">
            {profileMenu.map((item) => (
              <button
                key={item.id}
                onClick={() => setActiveSection(item.id)}
                className={cn(
                  "w-full flex items-center gap-3 px-4 py-3 rounded-xl text-left font-medium transition-all",
                  activeSection === item.id
                    ? "bg-primary text-primary-foreground shadow-soft"
                    : "text-foreground hover:bg-accent-rose/50"
                )}
              >
                <item.icon className="w-5 h-5 flex-shrink-0" />
                {item.label}
              </button>
            ))}
          </nav>
        </motion.aside>

        {/* Right content area */}
        <main className="flex-1 min-w-0 space-y-6">
          {activeSection === "my-profile" && (
            <motion.div
              key="my-profile"
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              className="space-y-6"
            >
              <div className="flex items-center justify-between">
                <h1 className="font-serif text-2xl md:text-3xl font-bold text-secondary">My Profile</h1>
                <Button variant="outline" className="gap-2">
                  <Edit className="w-4 h-4" />
                  Edit Profile
                </Button>
              </div>

              <div className="bg-white rounded-3xl shadow-card p-6">
                <div className="flex items-center gap-6">
                  <img
                    src={user?.avatar}
                    alt={user?.name}
                    className="w-24 h-24 rounded-full object-cover border-4 border-accent-rose"
                  />
                  <div>
                    <h2 className="font-serif text-xl font-bold text-foreground">{user?.name}</h2>
                    <p className="text-muted-foreground text-sm flex items-center gap-2">
                      <MapPin className="w-4 h-4" /> {user?.location}
                    </p>
                    <p className="text-sm text-secondary font-medium mt-1">{user?.plan} Member</p>
                  </div>
                </div>
              </div>

              <div className="bg-white rounded-3xl shadow-card p-6">
                <h3 className="font-serif text-lg font-bold text-secondary mb-4 flex items-center gap-2">
                  <Heart className="w-5 h-5" /> Personal Information
                </h3>
                <div className="grid md:grid-cols-2 gap-4">
                  {personalInfo.map((item) => (
                    <div key={item.label} className="flex justify-between py-3 border-b border-primary/5 last:border-0">
                      <span className="text-muted-foreground text-sm">{item.label}</span>
                      <span className="text-foreground font-medium text-sm">{item.value}</span>
                    </div>
                  ))}
                </div>
              </div>

              <div className="bg-white rounded-3xl shadow-card p-6">
                <h3 className="font-serif text-lg font-bold text-secondary mb-4 flex items-center gap-2">
                  <GraduationCap className="w-5 h-5" /> Education & Career
                </h3>
                <div className="grid md:grid-cols-2 gap-4">
                  {educationInfo.map((item) => (
                    <div key={item.label} className="flex justify-between py-3 border-b border-primary/5 last:border-0">
                      <span className="text-muted-foreground text-sm">{item.label}</span>
                      <span className="text-foreground font-medium text-sm">{item.value}</span>
                    </div>
                  ))}
                </div>
              </div>

              <div className="bg-white rounded-3xl shadow-card p-6">
                <h3 className="font-serif text-lg font-bold text-secondary mb-4 flex items-center gap-2">
                  <MapPin className="w-5 h-5" /> Location Details
                </h3>
                <div className="grid md:grid-cols-2 gap-4">
                  {locationInfo.map((item) => (
                    <div key={item.label} className="flex justify-between py-3 border-b border-primary/5 last:border-0">
                      <span className="text-muted-foreground text-sm">{item.label}</span>
                      <span className="text-foreground font-medium text-sm">{item.value}</span>
                    </div>
                  ))}
                </div>
              </div>
            </motion.div>
          )}

          {activeSection === "horoscope" && (
            <motion.div
              key="horoscope"
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              className="bg-white rounded-3xl shadow-card p-8"
            >
              <h1 className="font-serif text-2xl font-bold text-secondary mb-4 flex items-center gap-2">
                <Sparkles className="w-6 h-6" /> Horoscope
              </h1>
              <p className="text-muted-foreground mb-6">
                View and manage your horoscope details for better match compatibility.
              </p>
              <div className="grid md:grid-cols-2 gap-6">
                <div className="rounded-2xl border border-primary/10 p-6">
                  <p className="text-sm text-muted-foreground mb-1">Rashi</p>
                  <p className="font-semibold text-foreground">Meena (Pisces)</p>
                </div>
                <div className="rounded-2xl border border-primary/10 p-6">
                  <p className="text-sm text-muted-foreground mb-1">Nakshatra</p>
                  <p className="font-semibold text-foreground">Revati</p>
                </div>
                <div className="rounded-2xl border border-primary/10 p-6 md:col-span-2">
                  <p className="text-sm text-muted-foreground mb-2">Manglik status</p>
                  <p className="font-semibold text-foreground">Non-Manglik</p>
                </div>
              </div>
              <Button variant="outline" className="mt-6 gap-2">
                <Edit className="w-4 h-4" />
                Edit Horoscope
              </Button>
            </motion.div>
          )}

          {activeSection === "plans" && (
            <motion.div
              key="plans"
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              className="bg-white rounded-3xl shadow-card p-8"
            >
              <h1 className="font-serif text-2xl font-bold text-secondary mb-4 flex items-center gap-2">
                <Crown className="w-6 h-6" /> Plans
              </h1>
              <p className="text-muted-foreground mb-6">
                Your current plan: <strong className="text-foreground">{user?.plan || "Premium"}</strong>. Upgrade to unlock more matches and features.
              </p>
              <div className="rounded-2xl bg-accent-rose/30 border border-primary/10 p-6 mb-6">
                <p className="text-sm text-foreground mb-2">Valid till: 24 June 2025</p>
                <p className="text-sm text-muted-foreground">Horoscope matches remaining: 42</p>
              </div>
              <Button variant="hero" className="gap-2" onClick={() => navigate("/dashboard/plan")}>
                Manage plan
                <ArrowRight className="w-4 h-4" />
              </Button>
            </motion.div>
          )}

          {activeSection === "success-stories" && (
            <motion.div
              key="success-stories"
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              className="bg-white rounded-3xl shadow-card p-8"
            >
              <h1 className="font-serif text-2xl font-bold text-secondary mb-4 flex items-center gap-2">
                <BookHeart className="w-6 h-6" /> Success Stories
              </h1>
              <p className="text-muted-foreground mb-6">
                Read how other couples found their perfect match with Aiswarya Matrimony.
              </p>
              <Button variant="outline" className="gap-2" onClick={() => navigate("/success-stories")}>
                View success stories
                <ArrowRight className="w-4 h-4" />
              </Button>
            </motion.div>
          )}
        </main>
      </div>
    </DashboardLayout>
  );
};

export default UserProfilePage;
