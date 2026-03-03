import { motion } from "framer-motion";
import DashboardLayout from "@/components/DashboardLayout";
import Navbar from "@/components/Navbar";
import { Eye, Clock, MapPin, Lock } from "lucide-react";
import { profilesData } from "@/components/FeaturedProfiles";
import { useNavigate } from "react-router-dom";
import { useAuthStore } from "@/stores/authStore";

const viewers = profilesData.slice(2, 8).map((p, i) => ({
  ...p,
  viewedAgo: i === 0 ? "Just now" : i < 3 ? `${i * 2} hours ago` : `${i} days ago`,
}));

const WhoViewedPage = () => {
  const navigate = useNavigate();
  const { user } = useAuthStore();
  const isPremium = user?.plan === "Premium" || user?.plan === "Ultimate";

  return (
    <>
      <Navbar />
      <div className="pt-20">
        <DashboardLayout>
          <div className="space-y-6">
            <div className="flex items-center justify-between">
              <div>
                <h1 className="font-serif text-2xl md:text-3xl font-bold text-secondary">Who Viewed My Profile</h1>
                <p className="text-sm text-muted-foreground mt-1">{viewers.length} people viewed your profile</p>
              </div>
              <div className="flex items-center gap-2 px-3 py-1.5 rounded-full bg-accent-rose text-xs font-medium text-primary">
                <Eye className="w-3 h-3" /> {viewers.length} views this week
              </div>
            </div>

            <div className="space-y-3">
              {viewers.map((v, i) => (
                <motion.div
                  key={v.id}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: i * 0.06 }}
                  className="bg-card rounded-2xl shadow-card p-4 flex items-center gap-4 border border-primary/5"
                >
                  <div className="relative">
                    <img
                      src={v.image}
                      alt={v.name}
                      className={`w-14 h-14 rounded-full object-cover border-2 border-primary/10 ${!isPremium && i > 1 ? "blur-sm" : ""}`}
                    />
                    {!isPremium && i > 1 && (
                      <div className="absolute inset-0 flex items-center justify-center">
                        <Lock className="w-4 h-4 text-primary" />
                      </div>
                    )}
                  </div>
                  <div className="flex-1">
                    <h4 className="font-serif font-bold text-sm text-foreground">
                      {!isPremium && i > 1 ? "Premium Only" : `${v.name}, ${v.age}`}
                    </h4>
                    <div className="flex items-center gap-1 text-xs text-muted-foreground mt-0.5">
                      <MapPin className="w-3 h-3" /> {!isPremium && i > 1 ? "Upgrade to see" : v.location}
                    </div>
                  </div>
                  <div className="flex items-center gap-1 text-xs text-muted-foreground">
                    <Clock className="w-3 h-3" /> {v.viewedAgo}
                  </div>
                  {(!isPremium && i > 1) ? (
                    <button onClick={() => navigate("/dashboard/plan")} className="px-3 py-1.5 text-xs font-medium bg-secondary text-secondary-foreground rounded-full">
                      Upgrade
                    </button>
                  ) : (
                    <button onClick={() => navigate(`/profile/${v.id}`)} className="px-3 py-1.5 text-xs font-medium bg-primary text-primary-foreground rounded-full">
                      View
                    </button>
                  )}
                </motion.div>
              ))}
            </div>
          </div>
        </DashboardLayout>
      </div>
    </>
  );
};

export default WhoViewedPage;
