import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Sessions",
  description: "Manage your upcoming and past sessions.",
};

export default function SessionsPageLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return children;
}
