import type { Metadata } from "next";
import Script from "next/script";
import { Barlow_Condensed, Noto_Sans_SC, ZCOOL_QingKe_HuangYou } from "next/font/google";
import "./globals.css";
import { AppProviders } from "@/components/providers/app-providers";
import { SiteHeader } from "@/components/marketing/site-header";
import { SiteFooter } from "@/components/marketing/site-footer";
import { MobileBottomNav } from "@/components/marketing/mobile-bottom-nav";

const display = Barlow_Condensed({
  subsets: ["latin"],
  variable: "--font-display-en",
  weight: ["500", "600", "700", "800", "900"],
  style: ["normal", "italic"],
});

const body = Noto_Sans_SC({
  subsets: ["latin"],
  variable: "--font-body-en",
  weight: ["400", "500", "600", "700", "800", "900"],
});

const chineseDisplay = ZCOOL_QingKe_HuangYou({
  subsets: ["latin"],
  variable: "--font-display-zh",
  weight: "400",
  display: "swap",
});

const siteUrl = process.env.NEXT_PUBLIC_SITE_URL ?? "https://maker.wonderelian.com";

export const metadata: Metadata = {
  metadataBase: new URL(siteUrl),
  title: { default: "Maker Business Lab — Turn Maker Skills Into Business Numbers", template: "%s | Maker Business Lab" },
  description: "Find maker products worth selling, calculate realistic profit and payback, and match your business to the right production setup.",
  alternates: {
    canonical: "/",
    types: { "application/rss+xml": "/feed.xml" },
  },
  openGraph: {
    title: "Maker Business Lab",
    description: "Choose your next winning maker product with explainable opportunity scores and business math.",
    url: siteUrl,
    siteName: "Maker Business Lab",
    type: "website",
    locale: "en_US",
  },
  twitter: { card: "summary_large_image", title: "Maker Business Lab", description: "Turn maker skills into profitable products." },
  appleWebApp: {
    capable: true,
    statusBarStyle: "black-translucent",
    title: "Maker Lab",
  },
  formatDetection: { telephone: false },
};

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  const gaId = process.env.NEXT_PUBLIC_GA_ID;
  const structuredData = {
    "@context": "https://schema.org",
    "@graph": [
      {
        "@type": "Organization",
        "@id": `${siteUrl}/#organization`,
        name: "Maker Business Lab",
        url: siteUrl,
        logo: `${siteUrl}/images/brand-lockup.png`,
        description: "Business-first product opportunity, profit, and equipment decision tools for makers and one-person companies.",
      },
      {
        "@type": "WebSite",
        "@id": `${siteUrl}/#website`,
        name: "Maker Business Lab",
        url: siteUrl,
        publisher: { "@id": `${siteUrl}/#organization` },
        inLanguage: ["en-US", "zh-CN"],
      },
    ],
  };
  return (
    <html lang="en" className={`${display.variable} ${body.variable} ${chineseDisplay.variable}`}>
      <body>
        <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(structuredData).replace(/</g, "\\u003c") }} />
        {gaId ? (
          <>
            <Script src={`https://www.googletagmanager.com/gtag/js?id=${gaId}`} strategy="afterInteractive" />
            <Script id="ga4" strategy="afterInteractive">{`window.dataLayer=window.dataLayer||[];function gtag(){dataLayer.push(arguments)}gtag('js',new Date());gtag('config','${gaId}',{send_page_view:false});`}</Script>
          </>
        ) : null}
        <AppProviders>
          <SiteHeader />
          {children}
          <MobileBottomNav />
          <SiteFooter />
        </AppProviders>
      </body>
    </html>
  );
}
