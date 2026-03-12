import { useState } from "react";
import { motion } from "framer-motion";
import DashboardLayout from "@/components/DashboardLayout";
import { useAuthStore } from "@/stores/authStore";
import { Button } from "@/components/ui/button";
import { Edit, LogOut } from "lucide-react";
import { useNavigate } from "react-router-dom";

const SettingsPage = () => {
  const { user, logout } = useAuthStore();
  const navigate = useNavigate();

  const [notifications, setNotifications] = useState({
    interestRequest: true,
    chat: true,
    profileViews: true,
    newProfileMatch: true,
  });

  const accountInfo = [
    { label: "Full name", value: user?.name || "Rahul" },
    { label: "Mobile", value: user?.phone || "+91 98765 43210" },
    { label: "Email id", value: user?.email || "anna.jaslin@gmail.com" },
    { label: "Password", value: "••••••••••" },
    { label: "Profile type", value: user?.plan || "Premium" },
  ];

  const handleLogout = () => {
    logout();
    navigate("/");
  };

  return (
    <DashboardLayout>
      <div className="space-y-6">
        <h1 className="font-serif text-2xl md:text-3xl font-bold text-secondary italic">Profile settings</h1>

        {/* Profile Section */}
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="bg-white rounded-3xl shadow-card p-6">
          <h3 className="text-secondary font-medium mb-4">Profile</h3>
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <img src={user?.avatar} alt={user?.name} className="w-14 h-14 rounded-full object-cover border-2 border-primary/20" />
              <div>
                <h4 className="font-serif font-bold text-foreground">{user?.name}</h4>
                <p className="text-xs text-secondary">{user?.plan} user | {user?.location}</p>
              </div>
            </div>
            <Button size="sm" className="bg-primary text-primary-foreground rounded-full gap-1" onClick={handleLogout}>
              Sign Out
            </Button>
          </div>
        </motion.div>

        {/* Visibility Settings */}
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }} className="bg-white rounded-3xl shadow-card p-6 space-y-6">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="font-serif font-bold text-secondary">Profile visible</h3>
              <p className="text-xs text-muted-foreground">You can set-up who can able to view your profile.</p>
            </div>
            <select className="border border-primary/10 rounded-xl px-4 py-2 text-sm bg-white">
              <option>All users</option>
              <option>Premium users only</option>
              <option>Hidden</option>
            </select>
          </div>
          <div className="border-t border-primary/5" />
          <div className="flex items-center justify-between">
            <div>
              <h3 className="font-serif font-bold text-secondary">Who can send you Interest requests?</h3>
              <p className="text-xs text-muted-foreground">You can set-up who can able to make Interest request here.</p>
            </div>
            <select className="border border-primary/10 rounded-xl px-4 py-2 text-sm bg-white">
              <option>All users</option>
              <option>Premium users only</option>
            </select>
          </div>
        </motion.div>

        {/* Account Info */}
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2 }} className="bg-white rounded-3xl shadow-card p-6">
          <div className="flex items-center justify-between mb-4">
            <h3 className="font-serif font-bold text-secondary">Account</h3>
            <Button variant="outline" size="sm" className="gap-1 rounded-full text-xs">
              <Edit className="w-3 h-3" /> Edit
            </Button>
          </div>
          <div className="space-y-0">
            {accountInfo.map((item) => (
              <div key={item.label} className="flex justify-between py-3 border-b border-primary/5 last:border-0">
                <span className="text-muted-foreground text-sm">{item.label}</span>
                <span className="text-foreground text-sm">{item.value}</span>
              </div>
            ))}
          </div>
        </motion.div>

        {/* Notifications */}
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.3 }} className="bg-white rounded-3xl shadow-card p-6">
          <h3 className="font-serif font-bold text-secondary mb-4">Notifications</h3>
          <div className="space-y-6">
            {[
              { key: "interestRequest", title: "Interest request", desc: "Interest request email notifications" },
              { key: "chat", title: "Chat", desc: "New chat notifications" },
              { key: "profileViews", title: "Profile views", desc: "If anyone views your profile means you get the notifications at end of the day" },
              { key: "newProfileMatch", title: "New profile match", desc: "You get the profile match emails" },
            ].map((item) => (
              <div key={item.key} className="flex items-center justify-between">
                <div>
                  <h4 className="font-serif font-bold text-foreground text-sm">{item.title}</h4>
                  <p className="text-xs text-muted-foreground">{item.desc}</p>
                </div>
                <button
                  onClick={() => setNotifications(prev => ({ ...prev, [item.key]: !prev[item.key as keyof typeof prev] }))}
                  className={`w-12 h-6 rounded-full transition-colors relative ${notifications[item.key as keyof typeof notifications] ? "bg-green-500" : "bg-gray-300"}`}
                >
                  <div className={`w-5 h-5 bg-white rounded-full absolute top-0.5 transition-transform ${notifications[item.key as keyof typeof notifications] ? "right-0.5" : "left-0.5"}`} />
                </button>
              </div>
            ))}
          </div>
        </motion.div>
      </div>
    </DashboardLayout>
  );
};

export default SettingsPage;
