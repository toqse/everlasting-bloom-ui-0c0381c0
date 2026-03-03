import { useState } from "react";
import { motion } from "framer-motion";
import DashboardLayout from "@/components/DashboardLayout";
import Navbar from "@/components/Navbar";
import { Star, Lock, Moon, Sun, Sparkles } from "lucide-react";
import { useAuthStore } from "@/stores/authStore";
import { useNavigate } from "react-router-dom";

const jathagamData = {
  rasi: "Mesha (Aries)",
  nakshatra: "Ashwini",
  lagnam: "Kanya (Virgo)",
  dasa: "Rahu Dasa",
  dasaBalance: "4 Years 2 Months",
  birthStar: "Ashwini - 1st Padam",
  manglik: "No",
  rasiChart: [
    ["Ke", "", "Mo", ""],
    ["", "", "", "Su,Me"],
    ["Ju", "", "", "Ve,Ma"],
    ["Sa,Ra", "", "", ""],
  ],
};

const HoroscopePage = () => {
  const { user } = useAuthStore();
  const navigate = useNavigate();
  const [selectedProfile, setSelectedProfile] = useState("");

  // Mock: check if user is Hindu and has paid
  const isHindu = true; // In real app, check formData.religion
  const hasPaid = user?.plan === "Premium" || user?.plan === "Ultimate" || user?.plan === "Gold";

  if (!isHindu) {
    return (
      <>
        <Navbar />
        <div className="pt-20">
          <DashboardLayout>
            <div className="flex flex-col items-center justify-center py-20">
              <Moon className="w-16 h-16 text-muted-foreground mb-4" />
              <h2 className="font-serif text-xl font-bold text-foreground mb-2">Horoscope Not Available</h2>
              <p className="text-muted-foreground text-sm">Horoscope (Jathagam) is available only for Hindu profiles.</p>
            </div>
          </DashboardLayout>
        </div>
      </>
    );
  }

  if (!hasPaid) {
    return (
      <>
        <Navbar />
        <div className="pt-20">
          <DashboardLayout>
            <div className="flex flex-col items-center justify-center py-20">
              <motion.div
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                transition={{ type: "spring" }}
                className="w-24 h-24 rounded-full bg-accent-gold/50 flex items-center justify-center mb-6"
              >
                <Lock className="w-12 h-12 text-secondary" />
              </motion.div>
              <h2 className="font-serif text-2xl font-bold text-foreground mb-2">Unlock Horoscope</h2>
              <p className="text-muted-foreground text-sm text-center max-w-md mb-6">
                Upgrade to a paid plan to access your Jathagam (Horoscope) and check compatibility with other profiles.
              </p>
              <button
                onClick={() => navigate("/dashboard/plan")}
                className="px-8 py-3 rounded-2xl bg-gradient-to-r from-secondary to-secondary-light text-secondary-foreground font-bold hover:shadow-gold transition-shadow"
              >
                Upgrade Now
              </button>
            </div>
          </DashboardLayout>
        </div>
      </>
    );
  }

  return (
    <>
      <Navbar />
      <div className="pt-20">
        <DashboardLayout>
          <div className="space-y-6">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-accent-gold flex items-center justify-center">
                <Sun className="w-5 h-5 text-secondary" />
              </div>
              <div>
                <h1 className="font-serif text-2xl md:text-3xl font-bold text-secondary">Jathagam / Horoscope</h1>
                <p className="text-sm text-muted-foreground">View your horoscope details</p>
              </div>
            </div>

            <div className="grid md:grid-cols-2 gap-6">
              {/* Horoscope Details */}
              <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="bg-card rounded-3xl shadow-card p-6 space-y-4">
                <h3 className="font-serif text-lg font-bold text-secondary flex items-center gap-2">
                  <Sparkles className="w-4 h-4" /> Birth Details
                </h3>
                {[
                  ["Rasi", jathagamData.rasi],
                  ["Nakshatra", jathagamData.nakshatra],
                  ["Lagnam", jathagamData.lagnam],
                  ["Birth Star", jathagamData.birthStar],
                  ["Current Dasa", jathagamData.dasa],
                  ["Dasa Balance", jathagamData.dasaBalance],
                  ["Manglik/Chevvai", jathagamData.manglik],
                ].map(([label, value]) => (
                  <div key={label} className="flex justify-between py-2 border-b border-primary/5 last:border-0">
                    <span className="text-sm text-muted-foreground">{label}</span>
                    <span className="text-sm font-medium text-foreground">{value}</span>
                  </div>
                ))}
              </motion.div>

              {/* Rasi Chart */}
              <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }} className="bg-card rounded-3xl shadow-card p-6">
                <h3 className="font-serif text-lg font-bold text-secondary flex items-center gap-2 mb-4">
                  <Star className="w-4 h-4" /> Rasi Chart
                </h3>
                <div className="grid grid-cols-4 gap-0 border-2 border-primary/20 rounded-xl overflow-hidden">
                  {jathagamData.rasiChart.flat().map((cell, i) => (
                    <div
                      key={i}
                      className="border border-primary/10 p-3 min-h-[60px] flex items-center justify-center text-xs font-bold text-primary bg-accent-rose/20"
                    >
                      {cell}
                    </div>
                  ))}
                </div>
              </motion.div>
            </div>

            {/* Compatibility Check */}
            <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2 }} className="bg-card rounded-3xl shadow-card p-6">
              <h3 className="font-serif text-lg font-bold text-secondary mb-4">Check Compatibility</h3>
              <div className="flex gap-4 items-end">
                <div className="flex-1">
                  <label className="text-xs text-muted-foreground mb-1 block">Enter profile ID</label>
                  <input
                    value={selectedProfile}
                    onChange={(e) => setSelectedProfile(e.target.value)}
                    placeholder="e.g. AVM12345"
                    className="w-full px-4 py-3 rounded-xl border-2 border-primary/10 focus:border-primary focus:ring-0 bg-white text-sm"
                  />
                </div>
                <button className="px-6 py-3 rounded-xl bg-primary text-primary-foreground font-medium text-sm hover:bg-primary-dark transition-colors">
                  Check Match
                </button>
              </div>
            </motion.div>
          </div>
        </DashboardLayout>
      </div>
    </>
  );
};

export default HoroscopePage;
