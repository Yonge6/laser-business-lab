import type { Metadata } from "next";
import { HomeExperience } from "@/components/marketing/home-experience";
import { GuideShelf } from "@/components/marketing/guide-shelf";

export const metadata: Metadata = { alternates: { canonical: "/" } };

export default function HomePage() {
  return <HomeExperience><GuideShelf /></HomeExperience>;
}
