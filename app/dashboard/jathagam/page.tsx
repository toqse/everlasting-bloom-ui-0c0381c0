import dynamic from "next/dynamic";
import DashboardSectionLoading from "@/components/DashboardSectionLoading";

const JathagamPage = dynamic(() => import("@/pages/JathagamPage"), {
  loading: () => <DashboardSectionLoading />,
});

export default function JathagamRoutePage() {
  return <JathagamPage />;
}
