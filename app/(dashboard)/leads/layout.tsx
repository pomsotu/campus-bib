import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Leads",
  description: "Your lead pipeline and qualification status.",
};

export default function LeadsPageLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return children;
}
