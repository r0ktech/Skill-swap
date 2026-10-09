import type { Metadata, Viewport } from "next";
import { Bricolage_Grotesque, Inter_Tight, Instrument_Serif } from "next/font/google";
import { Providers } from "@/components/common/Providers";
import "./globals.css";

const sans = Inter_Tight({ subsets: ["latin"], variable: "--font-sans", display: "swap" });
const display = Bricolage_Grotesque({ subsets: ["latin"], variable: "--font-display", display: "swap" });
const serif = Instrument_Serif({
  subsets: ["latin"],
  weight: "400",
  style: ["normal", "italic"],
  variable: "--font-serif",
  display: "swap",
});

export const metadata: Metadata = {
  title: {
    default: "SkillSwap · Trade skills, not money",
    template: "%s · SkillSwap",
  },
  description:
    "SkillSwap is a community where people exchange skills instead of money. List what you can teach, what you want to learn, and get matched for mutually beneficial swaps.",
};

export const viewport: Viewport = {
  themeColor: "#f9f8f5",
  width: "device-width",
  initialScale: 1,
  viewportFit: "cover",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" className={`${sans.variable} ${display.variable} ${serif.variable}`}>
      <body className="min-h-dvh font-sans">
        <Providers>{children}</Providers>
      </body>
    </html>
  );
}
