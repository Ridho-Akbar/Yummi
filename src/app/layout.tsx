import type { Metadata } from "next";
import { Fredoka, Nunito } from "next/font/google";
import "./globals.css";
import { getSiteSettings } from "@/features/site/queries";

const fredoka = Fredoka({
  subsets: ["latin"],
  variable: "--font-fredoka",
  weight: ["400", "500", "600", "700"],
});
const nunito = Nunito({ subsets: ["latin"], variable: "--font-nunito" });

export async function generateMetadata(): Promise<Metadata> {
  try {
    const settings = await getSiteSettings();
    return {
      title: `${settings.storeInfo.name} — ${settings.storeInfo.tagline || "Pre-order Makanan Viral"}`,
      description: settings.hero.subtitle || "Pesan makanan viral untuk acara spesialmu.",
    };
  } catch {
    return {
      title: "Pre-order Makanan Viral",
    };
  }
}

export default function RootLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="id" className={`${fredoka.variable} ${nunito.variable}`}>
      <body>{children}</body>
    </html>
  );
}