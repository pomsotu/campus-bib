import type { Metadata } from "next";
import { Inter, Geist_Mono } from "next/font/google";
import { Toaster } from "sonner";
import "./globals.css";

const inter = Inter({
  variable: "--font-inter",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "Campus Service Business-in-a-Box",
  description:
    "Operational management dashboard for student service entrepreneurs.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body
        className={`${inter.variable} ${geistMono.variable} font-sans antialiased`}
      >
        {children}
        <Toaster
          position="bottom-right"
          richColors
          theme="dark"
          toastOptions={{
            style: {
              background: "#1e293b",
              border: "1px solid rgba(255,255,255,0.08)",
              color: "#e2e8f0",
            },
          }}
        />
      </body>
    </html>
  );
}
