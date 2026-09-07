import type { Metadata } from "next";
import ChildSafetyPage from "@/pages/ChildSafetyPage";

export const metadata: Metadata = {
  title: "Child Safety Standards | Aiswarya Matrimony",
  description:
    "Aiswarya Matrimony child safety standards: zero tolerance for CSAE and CSAM, age requirements, reporting, and designated child-safety contact.",
};

export default function ChildSafetyRoutePage() {
  return <ChildSafetyPage />;
}
