import type { Metadata, Viewport } from "next";
import { GeistSans } from "geist/font/sans";
import "./globals.css";

import Providers from "@/providers/Providers";
import Navbar from "@/components/layout/Navbar";
import Footer from "@/components/layout/Footer";

export const metadata: Metadata = {
  title: {
    default: "MatchPulse",
    template: "%s | MatchPulse",
  },
  description:
    "Modern football live scores, statistics, standings, fixtures and AI-powered predictions.",
  applicationName: "MatchPulse",
  keywords: [
    "Football",
    "Live Scores",
    "Statistics",
    "Predictions",
    "Fixtures",
    "Standings",
    "MatchPulse",
  ],
};

export const viewport: Viewport = {
  themeColor: "#09090b",
  colorScheme: "dark",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="en"
      suppressHydrationWarning
      className="dark"
    >
      <body
        className={`${GeistSans.className} min-h-screen bg-zinc-950 text-zinc-50 antialiased`}
      >
        <Providers>

          {/* App Background */}

          <div className="fixed inset-0 -z-50 overflow-hidden">

            <div className="absolute left-0 top-0 h-[34rem] w-[34rem] rounded-full bg-green-500/10 blur-3xl" />

            <div className="absolute right-0 top-20 h-[30rem] w-[30rem] rounded-full bg-emerald-500/10 blur-3xl" />

            <div className="absolute bottom-0 left-1/2 h-[28rem] w-[28rem] -translate-x-1/2 rounded-full bg-green-400/5 blur-3xl" />

            <div className="absolute inset-0 bg-[radial-gradient(circle_at_top,rgba(255,255,255,0.03),transparent_55%)]" />

          </div>

          {/* App Shell */}

          <div className="relative flex min-h-screen flex-col">

            <Navbar />

            <main className="relative z-10 flex-1">
              {children}
            </main>

            <Footer />

          </div>

        </Providers>
      </body>
    </html>
  );
}