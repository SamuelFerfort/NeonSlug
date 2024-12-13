import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import { Header } from "../components/layout/header";
import GridBackground from "../components/common/grid-background";

const inter = Inter({ subsets: ["latin"] });

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
      <body className={inter.className}>
        <GridBackground />
        <main className="relative">
          <Header />
        </main>
        {children}
      </body>
    </html>
  );
}
