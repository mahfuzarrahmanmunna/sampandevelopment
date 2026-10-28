// app/layout.tsx
import type { Metadata } from "next";
import { DM_Serif_Display, Manrope } from "next/font/google";
import "./globals.css";
import LenisProvider from "./components/LenisProvider";
import Navbar from "./components/Navbar/Navbar";
import Footer from "./components/Footer/Footer";
import AntiInspect from "./components/AntiInspect/AntiInspect";
import FloatingContact from "./components/FloatingContact/FloatingContact";

const manrope = Manrope({
  variable: "--font-sans",
  subsets: ["latin"],   
  weight: ["300", "400", "500", "600", "700"],
});

const dmSerif = DM_Serif_Display({
  variable: "--font-serif",
  subsets: ["latin"],
  weight: ["400"],
});

// Verified production domain
const siteUrl = "https://sampandevelopmentltd.com";

export const metadata: Metadata = {
  metadataBase: new URL(siteUrl),
  title: {
    default: "Sampan Development Limited | Real Estate & Property Development in Bangladesh",
    template: "%s | Sampan Development Limited",
  },
  description:
    "Sampan Development Limited, a Sampan Group enterprise, delivers premium residential and commercial property development and land investment in Bangladesh.",
  keywords: [
    "Sampan Development Limited",
    "real estate developer in Bangladesh",
    "property development company in Bangladesh",
    "residential property development in Bangladesh",
    "commercial property development in Bangladesh",
    "apartments and real estate projects in Dhaka",
    "land investment opportunities in Bangladesh",
    "Sampan Group real estate division",
  ],
  alternates: {
    canonical: "/",
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      "max-image-preview": "large",
      "max-video-preview": -1,
      "max-snippet": -1,
    },
  },
  openGraph: {
    type: "website",
    locale: "en_US",
    url: siteUrl,
    siteName: "Sampan Development Limited",
    title: "Sampan Development Limited | Real Estate & Property Development in Bangladesh",
    description:
      "Discover premium residential and commercial property development, apartments, and land investment opportunities in Bangladesh with Sampan Development Limited.",
    images: [
      {
        url: "/logo/logo.png",
        width: 1200,
        height: 630,
        alt: "Sampan Development Limited",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "Sampan Development Limited | Real Estate & Property Development",
    description:
      "Discover premium residential and commercial property development, apartments, and land investment opportunities in Bangladesh.",
    images: ["/logo/logo.png"],
  },
  icons: {
    icon: "/logo/logo.png",
    apple: "/logo/logo.png",
  },
};

// Structured Data
const organizationSchema = {
  "@context": "https://schema.org",
  "@type": "Organization",
  name: "Sampan Development Limited",
  url: siteUrl,
  logo: `${siteUrl}/logo/logo.png`,
  parentOrganization: {
    "@type": "Organization",
    name: "Sampan Group",
  },
  sameAs: [
    "https://www.facebook.com/sampandevelopmentlimited",
  ],
};

const websiteSchema = {
  "@context": "https://schema.org",
  "@type": "WebSite",
  name: "Sampan Development Limited",
  url: siteUrl,
  publisher: {
    "@type": "Organization",
    name: "Sampan Development Limited",
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html
      lang="en"
      className={`${manrope.variable} ${dmSerif.variable} h-full antialiased`}
    >
      <body className="min-h-full flex flex-col font-sans bg-[#F7F4ED] text-[#171916]">
        <LenisProvider>
          <Navbar />
          {/* <AntiInspect/> */}
          <main className="flex-grow">{children}</main>
          <Footer />
          <FloatingContact/>
          <script
            type="application/ld+json"
            dangerouslySetInnerHTML={{
              __html: JSON.stringify(organizationSchema),
            }}
          />
          <script
            type="application/ld+json"
            dangerouslySetInnerHTML={{
              __html: JSON.stringify(websiteSchema),
            }}
          />
        </LenisProvider>
      </body>
    </html>
  );
}