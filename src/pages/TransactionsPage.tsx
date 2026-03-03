import DashboardLayout from "@/components/DashboardLayout";

const TransactionsPage = () => {
  return (
    <DashboardLayout>
      <div className="space-y-6">
        <h1 className="font-serif text-2xl md:text-3xl font-bold text-secondary">
          Transactions
        </h1>
        <div className="bg-white rounded-3xl shadow-card p-8 text-center text-muted-foreground">
          <p>Your transaction history will appear here.</p>
        </div>
      </div>
    </DashboardLayout>
  );
};

export default TransactionsPage;
