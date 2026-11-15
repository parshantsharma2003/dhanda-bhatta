import { Archivo, Inter } from "next/font/google";
import "./globals.css";
import Navbar from "@/components/layout/Navbar";
import Footer from "@/components/layout/Footer";
import MobileContactBar from "@/components/layout/MobileContactBar";
import GoogleAnalytics from "@/components/analytics/GoogleAnalytics";
import { siteConfig } from "@/config/site";
import { getSiteUrl, TARGET_KEYWORDS } from "@/lib/seo";

const archivo = Archivo({
  subsets: ["latin"],
  variable: "--font-archivo",
  display: "swap",
  weight: ["400", "500", "600", "700", "800"],
});

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-inter",
  display: "swap",
  weight: ["300", "400", "500", "600", "700"],
});

const siteUrl = getSiteUrl();
const googleVerification =
  process.env.NEXT_PUBLIC_GOOGLE_SITE_VERIFICATION ||
  process.env.GOOGLE_SITE_VERIFICATION ||
  undefined;

export const metadata = {
  title: {
    default: `${siteConfig.name} | Brick Manufacturer in Jind, Haryana`,
    template: `%s | ${siteConfig.name}`,
  },
  description: siteConfig.description,
  keywords: TARGET_KEYWORDS,
  authors: [{ name: siteConfig.name, url: siteUrl }],
  creator: siteConfig.name,
  publisher: siteConfig.name,
  metadataBase: new URL(siteUrl),
  alternates: {
    canonical: siteUrl,
    languages: {
      "en-IN": siteUrl,
      "x-default": siteUrl,
    },
  },
  openGraph: {
    title: `${siteConfig.name} | Brick Manufacturer in Jind, Haryana`,
    description: siteConfig.description,
    url: siteUrl,
    siteName: siteConfig.name,
    locale: "en_IN",
    type: "website",
    images: [
      {
        url: `${siteUrl}/images/facility/kiln-hero.webp`,
        width: 1200,
        height: 630,
        alt: `${siteConfig.name} - Brick Kiln in Kalwa, Jind`,
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: `${siteConfig.name} | Brick Manufacturer in Jind, Haryana`,
    description: siteConfig.description,
    images: [`${siteUrl}/images/facility/kiln-hero.webp`],
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      "max-video-preview": -1,
      "max-image-preview": "large",
      "max-snippet": -1,
    },
  },
  verification: googleVerification
    ? {
        google: googleVerification,
      }
    : undefined,
};

export const viewport = {
  themeColor: "#963D32",
  width: "device-width",
  initialScale: 1,
  maximumScale: 5,
};

export default function RootLayout({ children }) {
  return (
    <html lang="en" className={`${archivo.variable} ${inter.variable}`}>
      <body className="min-h-screen flex flex-col bg-warm-bg text-charcoal font-body antialiased pb-[calc(3.5rem+env(safe-area-inset-bottom,0px))] lg:pb-0">
        <GoogleAnalytics />
        <Navbar />
        <main className="flex-1 w-full">{children}</main>
        <Footer />
        <MobileContactBar />
      </body>
    </html>
  );
}
