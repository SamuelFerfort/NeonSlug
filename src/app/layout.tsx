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
  title: "NeonLink - URL Shortener",
  description: "Shorten your URLs with style",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body className={chakra.className}>
        <GridBackground />
        <Toaster
          theme="dark"
          position="top-center"
          toastOptions={{
            className:
              "bg-gray-900/95 backdrop-blur-sm border border-neon-pink/10 shadow-lg shadow-neon-pink/5",
            descriptionClassName: "text-gray-400",
            duration: 2000,
          }}
        />
        <main className="relative">
          <Header />
          {children}
        </main>
       
      </body>
    </html>
  );
}
