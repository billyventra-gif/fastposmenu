import type { Metadata } from "next";
import Builder from "@/components/Builder";

export const metadata: Metadata = { title: "Build a menu", robots: { index: false } };

export default function BuildPage() {
  return <Builder />;
}
