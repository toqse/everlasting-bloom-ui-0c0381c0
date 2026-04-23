import dynamic from "next/dynamic";
import DashboardSectionLoading from "@/components/DashboardSectionLoading";

const UserProfilePage = dynamic(() => import("@/pages/UserProfilePage"), {
  loading: () => <DashboardSectionLoading />,
});

export default function UserProfileRoutePage() {
  return <UserProfilePage />;
}
