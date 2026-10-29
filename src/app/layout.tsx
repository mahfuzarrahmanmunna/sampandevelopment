// app/layout.tsx
import type { Metadata } from "next";
import { Cormorant_Garamond, Inter } from "next/font/google";
import "./globals.css";
import LenisProvider from "./components/LenisProvider";
import Navbar from "./components/Navbar/Navbar";
import Footer from "./components/Footer/Footer";
import FloatingContact from "./components/FloatingContact/FloatingContact";

const inter = Inter({
  variable: "--font-sans",
  subsets: ["latin"],
  weight: ["300", "400", "500", "600", "700"],
  display: "swap",
});

const cormorant = Cormorant_Garamond({
  variable: "--font-serif",
  subsets: ["latin"],
  weight: ["300", "400", "500", "600", "700"],
  style: ["normal", "italic"],
  display: "swap",
});

const siteUrl = "https://www.sampandevelopmentltd.com";
const siteName = "Sampan Development Limited";
const siteTitle = "Sampan Development Limited | Premium Real Estate Developer in Bangladesh";
const siteDescription = "Sampan Development Limited, a Sampan Group enterprise, delivers premium residential, commercial, and mixed-use property developments alongside secure land investment opportunities in Bangladesh.";

// MUST BE ABSOLUTE URL FOR WHATSAPP/FACEBOOK
const ogImageUrl = `${siteUrl}/logo/og-image.jpg`; 

export const metadata: Metadata = {
  metadataBase: new URL(siteUrl),
  title: {
    default: siteTitle,
    template: `%s | ${siteName}`,
  },
  description: siteDescription,
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
  authors: [{ name: siteName }],
  creator: siteName,
  publisher: siteName,
  alternates: { canonical: "/" },
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
    siteName: siteName,
    title: siteTitle,
    description: siteDescription,
    images: [
      {
        url: ogImageUrl, // Absolute URL
        width: 1200,
        height: 630,
        alt: "Sampan Development Limited — Premium Real Estate Developer in Bangladesh",
        type: "image/jpeg",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: siteTitle,
    description: siteDescription,
    images: [ogImageUrl], // Absolute URL
    creator: "@sampan_dev",
  },
  icons: {
    icon: [{ url: "/logo/devfavicon.png", type: "image/png" }],
    shortcut: "/logo/devfavicon.png",
    apple: [{ url: "/logo/devfavicon.png", sizes: "180x180", type: "image/png" }],
  },
  category: "Real Estate",
};

const organizationSchema = {
  "@context": "https://schema.org",
  "@type": "Organization",
  name: siteName,
  url: siteUrl,
  logo: `${siteUrl}/logo/logo.png`,
  parentOrganization: { "@type": "Organization", name: "Sampan Group", url: "https://sampangroup.com.bd" },
  foundingDate: "2008",
  address: {
    "@type": "PostalAddress",
    streetAddress: "Sampan 21st Century Tower, H 284, Rd 1/A, Block B, Bashundhara R/A",
    addressLocality: "Dhaka", addressCountry: "BD", postalCode: "1229",
  },
  contactPoint: { "@type": "ContactPoint", telephone: "+8801929918400", contactType: "customer service" },
  sameAs: ["https://www.facebook.com/sampandevelopmentlimited"],
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" className={`${inter.variable} ${cormorant.variable} h-full antialiased scroll-smooth`}>
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <meta name="theme-color" content="#17211D" />
      </head>
      <body className="min-h-full flex flex-col font-sans bg-[#F7F4ED] text-[#171916] selection:bg-[#C5A059] selection:text-white">
        <LenisProvider>
          <Navbar />
          <main id="main-content" className="flex-grow relative z-10">{children}</main>
          <Footer />
          <FloatingContact />
          <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(organizationSchema) }} />
        </LenisProvider>
      </body>
    </html>
  );
}