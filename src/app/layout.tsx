import type { Metadata } from "next";
import { IBM_Plex_Mono, Sora } from "next/font/google";
import "./globals.css";

import { PortfolioChat } from "@/components/portfolio-chat";
import { ScrollProgress } from "@/components/scroll-progress";
import { CursorTrail } from "@/components/cursor-trail";

const sora = Sora({
  variable: "--font-sora",
  subsets: ["latin"],
});

const plexMono = IBM_Plex_Mono({
  variable: "--font-plex-mono",
  subsets: ["latin"],
  weight: ["400", "500"],
});

export const metadata: Metadata = {
  metadataBase: new URL("https://portfolio-hart.vercel.app"),
  title: {
    default: "Rhohart Martel | AI Engineer & Automation Specialist",
    template: "%s | Rhohart Martel",
  },
  description:
    "AI Engineer who builds n8n automation pipelines, AI-powered dashboards, and intelligent business tools — turning manual processes into systems that run themselves.",
  openGraph: {
    title: "Rhohart Martel | AI Engineer & Automation Specialist",
    description:
      "AI Engineer who builds n8n automation pipelines, AI-powered dashboards, and intelligent business tools — turning manual processes into systems that run themselves.",
    type: "website",
  },
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
      className={`${sora.variable} ${plexMono.variable} h-full scroll-smooth`}
    >
      <body className="min-h-full flex flex-col bg-background text-foreground">
        <script
        >
          {`(function(){try{var t=localStorage.getItem('theme');if(t==='dark'||t==='light')document.documentElement.classList.add(t)}catch(e){}})()`}
        </script>
        <a
          href="#main"
          className="sr-only focus:not-sr-only focus:fixed focus:left-4 focus:top-4 focus:z-50 focus:rounded-full focus:bg-foreground focus:px-4 focus:py-2 focus:text-sm focus:font-semibold focus:text-background"
        >
          Skip to content
        </a>
        <ScrollProgress />
        <CursorTrail />
        {children}
        <PortfolioChat />
      </body>
    </html>
  );
}
