import type { Metadata } from "next";
import Builder from "@/components/Builder";

export const metadata: Metadata = { title: "Build a menu · Fast POS Menu" };

export default function BuildPage() {
  return <Builder />;
}
