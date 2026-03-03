import { motion } from "framer-motion";
import DashboardLayout from "@/components/DashboardLayout";
import Navbar from "@/components/Navbar";
import { Heart, Trash2, MapPin, Briefcase, Star, StickyNote } from "lucide-react";
import { profilesData } from "@/components/FeaturedProfiles";
import { useNavigate } from "react-router-dom";
import { useState } from "react";

const ShortlistedPage = () => {
  const navigate = useNavigate();
  const shortlisted = profilesData.slice(0, 5);
  const [notes, setNotes] = useState<Record<string, string>>({});

  return (
    <>
      <Navbar />
      <div className="pt-20">
        <DashboardLayout>
          <div className="space-y-6">
            <div className="flex items-center justify-between">
              <h1 className="font-serif text-2xl md:text-3xl font-bold text-secondary">Shortlisted Profiles</h1>
              <span className="text-sm text-muted-foreground">{shortlisted.length} profiles saved</span>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {shortlisted.map((profile, i) => (
                <motion.div
                  key={profile.id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: i * 0.08 }}
                  whileHover={{ y: -4 }}
                  className="bg-card rounded-2xl shadow-card overflow-hidden border border-primary/5 group"
                >
                  <div className="relative h-48 overflow-hidden cursor-pointer" onClick={() => navigate(`/profile/${profile.id}`)}>
                    <img src={profile.image} alt={profile.name} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" />
                    <div className="absolute inset-0 bg-gradient-to-t from-foreground/50 to-transparent" />
                    {profile.isPremium && (
                      <span className="absolute top-2 right-2 px-2 py-0.5 bg-secondary/90 text-secondary-foreground text-[10px] font-bold rounded-full flex items-center gap-1">
                        <Star className="w-2.5 h-2.5 fill-current" /> Premium
                      </span>
                    )}
                    <div className="absolute bottom-2 left-2 text-primary-foreground">
                      <h4 className="font-serif font-bold text-sm">{profile.name}, {profile.age}</h4>
                      <div className="flex items-center gap-1 text-xs opacity-90">
                        <MapPin className="w-3 h-3" /> {profile.location}
                      </div>
                    </div>
                  </div>
                  <div className="p-3 space-y-2">
                    <div className="flex items-center gap-1.5 text-xs text-muted-foreground">
                      <Briefcase className="w-3 h-3" /> {profile.profession}
                    </div>
                    <div className="relative">
                      <StickyNote className="absolute left-2 top-2 w-3 h-3 text-muted-foreground" />
                      <textarea
                        placeholder="Add a note..."
                        value={notes[profile.id] || ""}
                        onChange={(e) => setNotes({ ...notes, [profile.id]: e.target.value })}
                        className="w-full pl-7 pr-2 py-1.5 text-xs bg-accent-rose/30 rounded-lg border-0 focus:ring-1 focus:ring-primary/20 resize-none h-14"
                      />
                    </div>
                    <div className="flex gap-2">
                      <button className="flex-1 py-1.5 text-xs font-medium bg-primary text-primary-foreground rounded-lg hover:bg-primary-dark transition-colors">
                        Send Interest
                      </button>
                      <button className="p-1.5 text-destructive hover:bg-destructive/10 rounded-lg transition-colors">
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  </div>
                </motion.div>
              ))}
            </div>
          </div>
        </DashboardLayout>
      </div>
    </>
  );
};

export default ShortlistedPage;
