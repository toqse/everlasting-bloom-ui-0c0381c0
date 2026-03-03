import { useState } from "react";
import { motion } from "framer-motion";
import DashboardLayout from "@/components/DashboardLayout";
import { useAuthStore } from "@/stores/authStore";
import { Button } from "@/components/ui/button";
import { useNavigate } from "react-router-dom";
import { Download, Gift } from "lucide-react";
import PaymentPopup from "@/components/PaymentPopup";

const invoices = [
  { planType: "Platinum", duration: "12 Months (May 2023 - June 2024)", cost: "₹2,999" },
  { planType: "Standard", duration: "6 Months (Aug 2021 - Jan 2022)", cost: "₹1,499" },
  { planType: "Standard", duration: "6 Months (Jan 2021 - July 2021)", cost: "₹1,499" },
];

const PlanPage = () => {
  const { user } = useAuthStore();
  const navigate = useNavigate();
  const [paymentOpen, setPaymentOpen] = useState(false);

  return (
    <DashboardLayout>
      <div className="space-y-6">
        <div className="grid lg:grid-cols-2 gap-6">
          {/* Current Plan */}
          <div>
            <h2 className="font-serif text-2xl font-bold text-secondary italic mb-4">Plan details</h2>
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="bg-white rounded-3xl shadow-card p-8 text-center"
            >
              <p className="text-secondary font-medium mb-4">Current plan</p>
              <div className="flex justify-center mb-4">
                <Gift className="w-20 h-20 text-secondary" />
              </div>
              <p className="text-sm text-muted-foreground">Plan name: <strong className="text-foreground">{user?.plan || "Premium"}</strong></p>
              <p className="text-sm text-muted-foreground">Validity: <strong className="text-foreground">12 Months</strong></p>
              <p className="text-sm text-muted-foreground">Valid till <strong className="text-foreground">24 June 2025</strong></p>
              <Button className="mt-6 bg-foreground text-white hover:bg-foreground/90 font-bold tracking-wider" onClick={() => setPaymentOpen(true)}>
                UPGRADE NOW
              </Button>
            </motion.div>
          </div>

          {/* All Invoices */}
          <div>
            <h2 className="font-serif text-2xl font-bold text-secondary italic mb-4">All invoice</h2>
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.1 }}
              className="bg-white rounded-3xl shadow-card overflow-hidden"
            >
              <table className="w-full">
                <thead>
                  <tr className="border-b border-primary/10">
                    <th className="text-left p-4 text-sm font-medium text-muted-foreground">Plan type</th>
                    <th className="text-left p-4 text-sm font-medium text-muted-foreground">Duration</th>
                    <th className="text-left p-4 text-sm font-medium text-muted-foreground">Cost</th>
                    <th className="text-left p-4 text-sm font-medium text-muted-foreground">Invoice</th>
                  </tr>
                </thead>
                <tbody>
                  {invoices.map((inv, i) => (
                    <tr key={i} className="border-b border-primary/5 last:border-0">
                      <td className="p-4 text-sm text-foreground">{inv.planType}</td>
                      <td className="p-4 text-sm text-secondary">{inv.duration}</td>
                      <td className="p-4 text-sm text-foreground font-medium">{inv.cost}</td>
                      <td className="p-4">
                        <Button size="sm" className="bg-foreground text-white hover:bg-foreground/90 text-xs gap-1">
                          <Download className="w-3 h-3" /> DOWNLOAD
                        </Button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </motion.div>
          </div>
        </div>

        {/* Cancellation */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="bg-accent-gold/30 rounded-2xl p-4 text-center"
        >
          <p className="text-sm text-foreground">
            Plan cancellation: <button className="text-secondary font-bold hover:underline">Click here</button> to cancel the current plan.
          </p>
        </motion.div>
      </div>

      <PaymentPopup open={paymentOpen} onOpenChange={setPaymentOpen} defaultPlanId={1} />
    </DashboardLayout>
  );
};

export default PlanPage;
