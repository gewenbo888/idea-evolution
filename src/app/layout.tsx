import type { Metadata, Viewport } from "next";
import Script from "next/script";
import "./globals.css";
import { LangProvider } from "./components/LangProvider";
import { BackgroundFX } from "./components/BackgroundFX";
import { Topbar } from "./components/Topbar";

export const viewport: Viewport = {
  themeColor: "#07070a",
  width: "device-width", initialScale: 1,
};

export const metadata: Metadata = {
  metadataBase: new URL("https://idea-evolution.psyverse.fun"),
  title: "Idea Evolution | 观念演化",
  description: "A civilization-scale system modeling how memes, religions, ideologies, paradigms, and narratives spread, mutate, and reshape human history.",
  keywords: [
    "memetics","ideology","religion","philosophy","propagation","civilization",
    "idea evolution","narrative warfare","memetic engineering","Psyverse",
    "迷因学","观念演化","宗教传播","意识形态","哲学","文明",
  ],
  authors: [{ name: "Gewenbo", url: "https://psyverse.fun" }],
  alternates: {
    canonical: "/",
    languages: { en: "/", "zh-CN": "/", "x-default": "/" },
  },
  openGraph: {
    images: [{ url: "/opengraph-image.png", width: 1200, height: 630, alt: "Idea Evolution 观念演化" }],
    title: "Idea Evolution",
    description: "How memes, religions, ideologies, paradigms, and narratives spread across civilization. Bilingual EN/中文.",
    url: "https://idea-evolution.psyverse.fun/",
    siteName: "Psyverse",
    type: "website",
    locale: "en_US",
    alternateLocale: ["zh_CN"],
  },
  twitter: {
    images: ["/twitter-image.png"],
    card: "summary_large_image",
    title: "Idea Evolution",
    description: "Civilization-scale memetic propagation. Bilingual.",
  },
  robots: { index: true, follow: true },
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body>
        <Script src="https://analytics-dashboard-two-blue.vercel.app/tracker.js" strategy="afterInteractive" />
        <Script id="ld-json" type="application/ld+json" strategy="afterInteractive"
          dangerouslySetInnerHTML={{ __html: JSON.stringify({
            "@context": "https://schema.org",
            "@type": "WebSite",
            name: "Idea Evolution",
            description: "A civilization-scale system modeling how memes, religions, ideologies, paradigms, and narratives propagate, mutate, and reshape human history.",
            url: "https://idea-evolution.psyverse.fun/",
            inLanguage: ["en", "zh-CN"],
            author: { "@type": "Person", name: "Gewenbo", url: "https://psyverse.fun/" },
            publisher: { "@type": "Organization", name: "Psyverse", url: "https://psyverse.fun/" },
          }) }} />
        <LangProvider>
          <BackgroundFX />
          <Topbar />
          {children}
        </LangProvider>
      </body>
    </html>
  );
}
