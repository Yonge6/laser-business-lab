import type { Metadata } from "next";
import { Suspense } from "react";
import { SharedReport } from "@/components/results/shared-report";

export const metadata: Metadata = { title: "Shared Maker Business Report", robots: { index: false, follow: false } };

export default function SharedReportPage() {
  return <Suspense><SharedReport /></Suspense>;
}
