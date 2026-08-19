import type { Metadata } from "next";
import Script from "next/script";
import { Barlow_Condensed, Noto_Sans_SC } from "next/font/google";
import "./globals.css";
import { AppProviders } from "@/components/providers/app-providers";
import { SiteHeader } from "@/components/marketing/site-header";
import { SiteFooter } from "@/components/marketing/site-footer";

const display = Barlow_Condensed({
  subsets: ["latin"],
  variable: "--font-display",
  weight: ["500", "600", "700", "800", "900"],
  style: ["normal", "italic"],
});

const body = Noto_Sans_SC({
  subsets: ["latin"],
  variable: "--font-body",
  weight: ["400", "500", "600", "700", "800", "900"],
});

const siteUrl = process.env.NEXT_PUBLIC_SITE_URL ?? "https://maker.wonderelian.com";

export const metadata: Metadata = {
  metadataBase: new URL(siteUrl),
  title: { default: "Maker Business Lab — Turn Maker Skills Into Business Numbers", template: "%s | Maker Business Lab" },
  description: "Find maker products worth selling, calculate realistic profit and payback, and match your business to the right production setup.",
  alternates: { canonical: "/" },
  openGraph: {
    title: "Maker Business Lab",
    description: "Choose your next winning maker product with explainable opportunity scores and business math.",
    url: siteUrl,
    siteName: "Maker Business Lab",
    type: "website",
    locale: "en_US",
  },
  twitter: { card: "summary_large_image", title: "Maker Business Lab", description: "Turn maker skills into profitable products." },
};

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  const gaId = process.env.NEXT_PUBLIC_GA_ID;
  return (
    <html lang="en" className={`${display.variable} ${body.variable}`}>
      <body>
        {gaId ? (
          <>
            <Script src={`https://www.googletagmanager.com/gtag/js?id=${gaId}`} strategy="afterInteractive" />
            <Script id="ga4" strategy="afterInteractive">{`window.dataLayer=window.dataLayer||[];function gtag(){dataLayer.push(arguments)}gtag('js',new Date());gtag('config','${gaId}',{send_page_view:false});`}</Script>
          </>
        ) : null}
        <AppProviders>
          <SiteHeader />
          {children}
          <SiteFooter />
        </AppProviders>
      </body>
    </html>
  );
}
