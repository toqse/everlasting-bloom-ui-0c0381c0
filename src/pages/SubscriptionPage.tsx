import { motion } from "framer-motion";
import DashboardLayout from "@/components/DashboardLayout";
import Navbar from "@/components/Navbar";
import { Crown, Calendar, Clock, ArrowUpRight } from "lucide-react";
import { useAuthStore } from "@/stores/authStore";
import { useNavigate } from "react-router-dom";
import { Progress } from "@/components/ui/progress";

const SubscriptionPage = () => {
  const { user } = useAuthStore();
  const navigate = useNavigate();
  const plan = user?.plan || "Premium";
  const validUntil = "24 June 2026";
  const daysRemaining = 113;
  const totalDays = 365;
  const percentUsed = Math.round(((totalDays - daysRemaining) / totalDays) * 100);

  return (
    <>
      <Navbar />
      <div className="pt-20">
        <DashboardLayout>
          <div className="space-y-6">
            <h1 className="font-serif text-2xl md:text-3xl font-bold text-secondary">Subscription Status</h1>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="bg-card rounded-3xl shadow-card p-8 border border-primary/5"
            >
              <div className="flex items-center gap-4 mb-6">
                <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-secondary to-secondary-light flex items-center justify-center">
                  <Crown className="w-8 h-8 text-secondary-foreground" />
                </div>
                <div>
                  <h2 className="font-serif text-2xl font-bold text-foreground">{plan} Plan</h2>
                  <p className="text-sm text-muted-foreground">Active subscription</p>
                </div>
                <div className="ml-auto px-4 py-2 rounded-full bg-accent-gold/50 text-secondary-dark text-sm font-semibold">
                  Active
                </div>
              </div>

              <div className="grid grid-cols-3 gap-4 mb-6">
                <div className="bg-accent-rose/50 rounded-xl p-4 text-center">
                  <Calendar className="w-5 h-5 text-primary mx-auto mb-1" />
                  <p className="text-xs text-muted-foreground">Valid Until</p>
                  <p className="font-serif font-bold text-sm text-foreground">{validUntil}</p>
                </div>
                <div className="bg-accent-gold/50 rounded-xl p-4 text-center">
                  <Clock className="w-5 h-5 text-secondary mx-auto mb-1" />
                  <p className="text-xs text-muted-foreground">Days Left</p>
                  <p className="font-serif font-bold text-xl text-foreground">{daysRemaining}</p>
                </div>
                <div className="bg-accent-pink/50 rounded-xl p-4 text-center">
                  <ArrowUpRight className="w-5 h-5 text-primary mx-auto mb-1" />
                  <p className="text-xs text-muted-foreground">Usage</p>
                  <p className="font-serif font-bold text-sm text-foreground">{percentUsed}%</p>
                </div>
              </div>

              <div className="space-y-2">
                <div className="flex justify-between text-xs">
                  <span className="text-muted-foreground">Plan duration progress</span>
                  <span className="font-medium text-foreground">{percentUsed}%</span>
                </div>
                <Progress value={percentUsed} className="h-3 bg-accent-rose" />
              </div>

              <button
                onClick={() => navigate("/membership")}
                className="mt-6 w-full py-3 rounded-2xl bg-gradient-to-r from-secondary to-secondary-light text-secondary-foreground font-bold text-sm hover:shadow-gold transition-shadow"
              >
                Upgrade Plan
              </button>
            </motion.div>
          </div>
        </DashboardLayout>
      </div>
    </>
  );
};

export default SubscriptionPage;
