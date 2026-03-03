import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import DashboardLayout from "@/components/DashboardLayout";
import Navbar from "@/components/Navbar";
import { Bell, Heart, Eye, Users, Crown, Check, Trash2 } from "lucide-react";

const initialNotifications = [
  { id: 1, type: "match", icon: Heart, title: "New match found!", desc: "Priya (92% compatible) matches your preferences", time: "2 mins ago", read: false, color: "bg-accent-pink" },
  { id: 2, type: "interest", icon: Users, title: "Interest received", desc: "Rahul sent you an interest request", time: "15 mins ago", read: false, color: "bg-accent-rose" },
  { id: 3, type: "view", icon: Eye, title: "Profile viewed", desc: "Someone viewed your profile", time: "1 hour ago", read: false, color: "bg-accent-gold" },
  { id: 4, type: "subscription", icon: Crown, title: "Subscription expiring", desc: "Your Premium plan expires in 30 days", time: "2 hours ago", read: true, color: "bg-accent-gold" },
  { id: 5, type: "interest", icon: Heart, title: "Interest accepted!", desc: "Sarah accepted your interest request", time: "1 day ago", read: true, color: "bg-accent-pink" },
  { id: 6, type: "match", icon: Users, title: "5 new matches", desc: "Check out your new weekly matches", time: "2 days ago", read: true, color: "bg-accent-rose" },
];

const NotificationsPage = () => {
  const [notifications, setNotifications] = useState(initialNotifications);
  const unreadCount = notifications.filter((n) => !n.read).length;

  const markAllRead = () => setNotifications(notifications.map((n) => ({ ...n, read: true })));
  const deleteNotif = (id: number) => setNotifications(notifications.filter((n) => n.id !== id));

  return (
    <>
      <Navbar />
      <div className="pt-20">
        <DashboardLayout>
          <div className="space-y-6">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <h1 className="font-serif text-2xl md:text-3xl font-bold text-secondary">Notifications</h1>
                {unreadCount > 0 && (
                  <span className="px-2.5 py-0.5 bg-destructive text-primary-foreground text-xs font-bold rounded-full animate-pulse-soft">
                    {unreadCount}
                  </span>
                )}
              </div>
              {unreadCount > 0 && (
                <button onClick={markAllRead} className="text-xs font-medium text-primary hover:underline flex items-center gap-1">
                  <Check className="w-3 h-3" /> Mark all read
                </button>
              )}
            </div>

            <div className="space-y-2">
              <AnimatePresence>
                {notifications.map((n, i) => (
                  <motion.div
                    key={n.id}
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    exit={{ opacity: 0, x: 20, height: 0 }}
                    transition={{ delay: i * 0.04 }}
                    className={`bg-card rounded-2xl shadow-card p-4 flex items-start gap-3 border transition-all ${
                      n.read ? "border-primary/5 opacity-70" : "border-primary/15 shadow-elevated"
                    }`}
                  >
                    <div className={`w-10 h-10 rounded-xl ${n.color} flex items-center justify-center flex-shrink-0`}>
                      <n.icon className="w-5 h-5 text-primary" />
                    </div>
                    <div className="flex-1 min-w-0">
                      <h4 className={`text-sm ${n.read ? "text-foreground" : "font-bold text-foreground"}`}>{n.title}</h4>
                      <p className="text-xs text-muted-foreground mt-0.5">{n.desc}</p>
                      <p className="text-[10px] text-muted-foreground mt-1">{n.time}</p>
                    </div>
                    {!n.read && <div className="w-2 h-2 rounded-full bg-primary flex-shrink-0 mt-2 animate-pulse-soft" />}
                    <button onClick={() => deleteNotif(n.id)} className="p-1 text-muted-foreground hover:text-destructive transition-colors flex-shrink-0">
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                  </motion.div>
                ))}
              </AnimatePresence>
            </div>
          </div>
        </DashboardLayout>
      </div>
    </>
  );
};

export default NotificationsPage;
