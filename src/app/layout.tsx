import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import { StoreProvider } from "@/context/StoreContext";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: {
    default: "Culinary Hub — Premium Kitchen Utensils in Kenya",
    template: "%s | Culinary Hub",
  },
  description:
    "Shop premium kitchen utensils, cookware, and accessories in Kenya. Non-stick pots, pans, knives, and more delivered to your door.",
  keywords: [
    "kitchen utensils Kenya",
    "cookware Kenya",
    "cooking pots",
    "non-stick pans",
    "kitchen tools Nairobi",
  ],
};

export default function RootLayout({ children }: LayoutProps<"/">) {
  return (
    <html lang="en" className={`${geistSans.variable} ${geistMono.variable} h-full antialiased`}>
      <body className="min-h-full bg-white text-foreground">
        <StoreProvider>
          <div className="flex min-h-screen flex-col">
            <Navbar />
            <main className="flex-1">{children}</main>
            <Footer />
          </div>
        </StoreProvider>
      </body>
    </html>
  );
}
