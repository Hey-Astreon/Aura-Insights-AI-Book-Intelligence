import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "AuraInsights | AI-Powered Book Intelligence",
  description: "Advanced book scraping, AI insights, and RAG-powered Q&A platform.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className="dark">
      <body className={`${inter.className} min-h-screen selection:bg-sky-500/30`}>
        {children}
      </body>
    </html>
  );
}
