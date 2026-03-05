import DashboardLayout from "@/components/DashboardLayout";
import { motion } from "framer-motion";
import { CreditCard, ArrowUpRight, ArrowDownLeft, Crown, CheckCircle, Clock, XCircle } from "lucide-react";

const transactions = [
  { id: "TXN-20260301", date: "01 Mar 2026", plan: "Gold Plan", amount: "₹4,999", status: "success", type: "credit", icon: Crown },
  { id: "TXN-20260215", date: "15 Feb 2026", plan: "Profile Boost", amount: "₹499", status: "success", type: "credit", icon: ArrowUpRight },
  { id: "TXN-20260210", date: "10 Feb 2026", plan: "Silver Plan", amount: "₹2,499", status: "failed", type: "credit", icon: Crown },
  { id: "TXN-20260201", date: "01 Feb 2026", plan: "Diamond Plan", amount: "₹9,999", status: "success", type: "credit", icon: Crown },
  { id: "TXN-20260120", date: "20 Jan 2026", plan: "Refund - Silver Plan", amount: "₹2,499", status: "pending", type: "debit", icon: ArrowDownLeft },
  { id: "TXN-20260105", date: "05 Jan 2026", plan: "Bronze Plan", amount: "₹999", status: "success", type: "credit", icon: Crown },
];

const statusConfig = {
  success: { label: "Success", icon: CheckCircle, color: "text-green-600 bg-green-50 border-green-200" },
  pending: { label: "Pending", icon: Clock, color: "text-amber-600 bg-amber-50 border-amber-200" },
  failed: { label: "Failed", icon: XCircle, color: "text-red-600 bg-red-50 border-red-200" },
};

const TransactionsPage = () => {
  return (
    <DashboardLayout>
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <h1 className="font-serif text-2xl md:text-3xl font-bold text-secondary">Transactions</h1>
          <div className="flex items-center gap-2 px-4 py-2 rounded-xl bg-accent-gold/30 border border-secondary/20">
            <CreditCard className="w-4 h-4 text-secondary" />
            <span className="text-sm font-medium text-foreground">6 Transactions</span>
          </div>
        </div>

        {/* Summary Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          {[
            { label: "Total Spent", value: "₹18,995", color: "from-primary/10 to-accent-rose" },
            { label: "Active Plan", value: "Gold Plan", color: "from-secondary/10 to-accent-gold/30" },
            { label: "Next Renewal", value: "01 Jun 2026", color: "from-green-50 to-emerald-50" },
          ].map((card, i) => (
            <motion.div
              key={card.label}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.1 }}
              className={`bg-gradient-to-br ${card.color} rounded-2xl p-5 border border-primary/10`}
            >
              <p className="text-xs text-muted-foreground mb-1">{card.label}</p>
              <p className="font-serif text-xl font-bold text-foreground">{card.value}</p>
            </motion.div>
          ))}
        </div>

        {/* Transactions Table */}
        <div className="bg-card rounded-3xl shadow-card border border-primary/10 overflow-hidden">
          <div className="p-5 border-b border-primary/10">
            <h2 className="font-serif text-lg font-bold text-foreground">Transaction History</h2>
          </div>
          <div className="divide-y divide-primary/5">
            {transactions.map((txn, i) => {
              const st = statusConfig[txn.status as keyof typeof statusConfig];
              const StatusIcon = st.icon;
              return (
                <motion.div
                  key={txn.id}
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: i * 0.08 }}
                  className="flex items-center justify-between p-4 hover:bg-accent-rose/30 transition-colors"
                >
                  <div className="flex items-center gap-4">
                    <div className={`w-10 h-10 rounded-xl flex items-center justify-center ${txn.type === "credit" ? "bg-primary/10" : "bg-green-50"}`}>
                      <txn.icon className={`w-5 h-5 ${txn.type === "credit" ? "text-primary" : "text-green-600"}`} />
                    </div>
                    <div>
                      <p className="font-medium text-foreground text-sm">{txn.plan}</p>
                      <p className="text-xs text-muted-foreground">{txn.id} · {txn.date}</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-4">
                    <span className={`text-sm font-bold ${txn.type === "debit" ? "text-green-600" : "text-foreground"}`}>
                      {txn.type === "debit" ? "+" : "-"}{txn.amount}
                    </span>
                    <span className={`inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-medium border ${st.color}`}>
                      <StatusIcon className="w-3 h-3" />
                      {st.label}
                    </span>
                  </div>
                </motion.div>
              );
            })}
          </div>
        </div>
      </div>
    </DashboardLayout>
  );
};

export default TransactionsPage;
