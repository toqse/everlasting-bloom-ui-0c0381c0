import dynamic from "next/dynamic";
import DashboardSectionLoading from "@/components/DashboardSectionLoading";

const MatchesPage = dynamic(() => import("@/pages/MatchesPage"), {
  loading: () => <DashboardSectionLoading />,
});

export default function MatchesRoutePage() {
  return <MatchesPage />;
}
