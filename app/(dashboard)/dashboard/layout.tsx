import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Dashboard",
  description: "Your CampusBIB operations overview.",
};

export default function DashboardPageLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return children;
}
