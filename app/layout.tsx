import type { Metadata, Viewport } from "next";
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
  metadataBase: new URL('https://campus.pomsconvert.ca'),
  title: {
    default: 'CampusBIB Dashboard',
    template: '%s | CampusBIB'
  },
  description: 'Your operations. Automated. — CampusBIB operational dashboard for student entrepreneurs.',
  keywords: [
    'student entrepreneur',
    'campus business',
    'operations automation',
    'business management',
    'CampusBIB'
  ],
  authors: [{ name: 'PomsConvert' }],
  creator: 'PomsConvert',
  icons: {
    icon: [
      { url: '/favicons/favicon-16x16.png', sizes: '16x16', type: 'image/png' },
      { url: '/favicons/favicon-32x32.png', sizes: '32x32', type: 'image/png' },
      { url: '/favicons/favicon.ico' }
    ],
    apple: [
      { url: '/favicons/apple-touch-icon.png', sizes: '180x180' }
    ],
    other: [
      { rel: 'android-chrome', url: '/favicons/android-chrome-192x192.png' },
      { rel: 'android-chrome', url: '/favicons/android-chrome-512x512.png' }
    ]
  },
  manifest: '/site.webmanifest',
  openGraph: {
    type: 'website',
    siteName: 'CampusBIB',
    title: 'CampusBIB Dashboard',
    description: 'Your operations. Automated.',
    url: 'https://campus.pomsconvert.ca',
    images: [{
      url: '/social/og-image.png',
      width: 1200,
      height: 630,
      alt: 'CampusBIB — Your operations. Automated.'
    }]
  },
  twitter: {
    card: 'summary_large_image',
    title: 'CampusBIB Dashboard',
    description: 'Your operations. Automated.',
    images: ['/social/twitter-card.png']
  }
};

export const viewport: Viewport = {
  themeColor: '#EA580C',
  colorScheme: 'dark',
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
