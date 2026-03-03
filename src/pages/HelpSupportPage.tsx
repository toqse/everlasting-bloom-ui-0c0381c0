import DashboardLayout from "@/components/DashboardLayout";

const HelpSupportPage = () => {
  return (
    <DashboardLayout>
      <div className="space-y-6">
        <h1 className="font-serif text-2xl md:text-3xl font-bold text-secondary">
          Help & Support
        </h1>
        <div className="bg-white rounded-3xl shadow-card p-8 text-center text-muted-foreground">
          <p>Contact us for help and support. FAQs and contact options coming soon.</p>
        </div>
      </div>
    </DashboardLayout>
  );
};

export default HelpSupportPage;
