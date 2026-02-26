import { motion } from "framer-motion";
import DashboardLayout from "@/components/DashboardLayout";
import { useAuthStore } from "@/stores/authStore";
import { Edit, MapPin, Phone, Mail, Calendar, Briefcase, GraduationCap, Heart } from "lucide-react";
import { Button } from "@/components/ui/button";

const UserProfilePage = () => {
  const { user } = useAuthStore();

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
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <h1 className="font-serif text-2xl md:text-3xl font-bold text-secondary">My Profile</h1>
          <Button variant="outline" className="gap-2">
            <Edit className="w-4 h-4" />
            Edit Profile
          </Button>
        </div>

        {/* Profile Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-white rounded-3xl shadow-card p-6"
        >
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
        </motion.div>

        {/* Personal Info */}
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }} className="bg-white rounded-3xl shadow-card p-6">
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
        </motion.div>

        {/* Education */}
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2 }} className="bg-white rounded-3xl shadow-card p-6">
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
        </motion.div>

        {/* Location */}
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.3 }} className="bg-white rounded-3xl shadow-card p-6">
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
        </motion.div>
      </div>
    </DashboardLayout>
  );
};

export default UserProfilePage;
