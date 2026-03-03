import { motion } from "framer-motion";
import DashboardLayout from "@/components/DashboardLayout";
import Navbar from "@/components/Navbar";
import { Eye, Calendar, MapPin, Briefcase } from "lucide-react";
import { profilesData } from "@/components/FeaturedProfiles";
import { useNavigate } from "react-router-dom";

const contactViewedData = profilesData.slice(0, 6).map((p, i) => ({
  ...p,
  viewedOn: `${28 - i * 3} Feb 2026`,
  viewedTime: `${10 + i}:${15 + i * 5} AM`,
}));

const ContactViewedPage = () => {
  const navigate = useNavigate();

  return (
    <>
      <Navbar />
      <div className="pt-20">
        <DashboardLayout>
          <div className="space-y-6">
            <h1 className="font-serif text-2xl md:text-3xl font-bold text-secondary">Contact Viewed</h1>
            <p className="text-sm text-muted-foreground">Profiles whose contact details you have viewed</p>

            <div className="space-y-3">
              {contactViewedData.map((profile, i) => (
                <motion.div
                  key={profile.id}
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: i * 0.06 }}
                  whileHover={{ x: 4 }}
                  className="bg-card rounded-2xl shadow-card p-4 flex items-center gap-4 cursor-pointer border border-primary/5 hover:shadow-elevated transition-all"
                  onClick={() => navigate(`/profile/${profile.id}`)}
                >
                  <img src={profile.image} alt={profile.name} className="w-14 h-14 rounded-full object-cover border-2 border-primary/10" />
                  <div className="flex-1 min-w-0">
                    <h4 className="font-serif font-bold text-sm text-foreground">{profile.name}, {profile.age}</h4>
                    <div className="flex items-center gap-3 text-xs text-muted-foreground mt-0.5">
                      <span className="flex items-center gap-1"><Briefcase className="w-3 h-3" /> {profile.profession}</span>
                      <span className="flex items-center gap-1"><MapPin className="w-3 h-3" /> {profile.location}</span>
                    </div>
                  </div>
                  <div className="text-right flex-shrink-0">
                    <div className="flex items-center gap-1 text-xs text-muted-foreground">
                      <Calendar className="w-3 h-3" /> {profile.viewedOn}
                    </div>
                    <p className="text-[10px] text-muted-foreground mt-0.5">{profile.viewedTime}</p>
                  </div>
                  <Eye className="w-4 h-4 text-primary/40 flex-shrink-0" />
                </motion.div>
              ))}
            </div>
          </div>
        </DashboardLayout>
      </div>
    </>
  );
};

export default ContactViewedPage;
