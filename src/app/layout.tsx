import type { Metadata } from "next";
import { Inter, Chakra_Petch } from "next/font/google";
import "./globals.css";
import { Header } from "../components/layout/header";
import GridBackground from "../components/common/grid-background";

const inter = Inter({ subsets: ["latin"] });

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
        <main className="relative">
          <Header />
        </main>
        {children}
      </body>
    </html>
  );
}
