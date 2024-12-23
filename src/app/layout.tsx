import type { Metadata } from "next";
import { Chakra_Petch } from "next/font/google";
import "./globals.css";
import { Header } from "../components/layout/header";
import GridBackground from "../components/common/grid-background";
import { Toaster } from "@/src/components/ui/sonner";

const chakra = Chakra_Petch({
  weight: ["400", "700"],
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "NeonSlug - Modern URL Shortener with Analytics",
  description:
    "Free & open source URL shortener with password protection, analytics dashboard, and modern neon design. Shorten, track, and protect your links.",
  alternates: {
    canonical: "https://neonslug.com",
  },

  keywords: [
    "url shortener",
    "link management",
    "link analytics",
    "password protected links",
    "free url shortener",
    "open source",
    "link tracking",
    "short urls",
  ],
  authors: [{ name: "Samuel Fernandez" }],
  openGraph: {
    title: "NeonSlug - Modern URL Shortener",
    description:
      "Free & open source URL shortener with password protection and analytics",
    url: "https://neonslug.com",
    siteName: "NeonSlug",
    images: [
      {
        url: "https://res.cloudinary.com/dy0av590l/image/upload/v1734555194/og-image_ekc4cy.png",
        width: 1200,
        height: 630,
      },
    ],
    locale: "en_US",
    alternateLocale: ["es_ES", "en_GB"],
    type: "website",
  },
  twitter: {
    site: "@SamuxLoL",
    creator: "@SamuxLoL",
    card: "summary_large_image",
    title: "NeonSlug - Modern URL Shortener",
    description:
      "Free & open source URL shortener with password protection and analytics",
    images: [
      "https://res.cloudinary.com/dy0av590l/image/upload/v1734555194/og-image_ekc4cy.png",
    ],
  },

  robots: {
    index: true,
    follow: true,
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <head>
        <meta name="google" content="notranslate" />
      </head>
      <body className={chakra.className}>
        <GridBackground />
        <Toaster
          theme="dark"
          toastOptions={{
            className:
              "bg-gray-900/95 backdrop-blur-sm border border-neon-pink/10 shadow-lg shadow-neon-pink/5",
            descriptionClassName: "text-gray-400",
          }}
        />
        <Header />
        {children}
      </body>
    </html>
  );
}
