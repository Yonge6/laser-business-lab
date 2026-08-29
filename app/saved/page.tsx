import type { Metadata } from "next";
import { SavedOpportunities } from "@/components/marketing/saved-opportunities";

export const metadata: Metadata = {
  title: "Saved Maker Opportunities",
  description: "Continue validating maker product opportunities you saved on this device.",
  robots: { index: false, follow: false },
};

export default function SavedPage() {
  return <SavedOpportunities />;
}
