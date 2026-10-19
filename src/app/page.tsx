// app/page.tsx
import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import Hero from "./components/Hero/Hero";
import About from "./components/HomeAboutSection/HomeAboutSection";
import FeaturedProject from "./components/FeaturedProject/FeaturedProject";
import ProjectShowcase from "./components/ProjectShowcase/ProjectShowcase";
import CondominiumShowcase from "./components/CondominiumShowcase/CondominiumShowcase";
import HighwayAddressSection from "./components/HighwayAddressSection/HighwayAddressSection";
import CompletedProjectsSection from "./components/CompletedProjectsSection/CompletedProjectsSection";
import HighwayInnSection from "./components/HighwayInnSection/HighwayInnSection";

// If your homepage UI is handled by a Client Component, import it here:
// import HomeClientContent from "./home-client";

export const metadata: Metadata = {
  title: "Home", // Renders as "Home | Sampan Development Limited" via template
  alternates: {
    canonical: "/",
  },
};

const webPageSchema = {
  "@context": "https://schema.org",
  "@type": "WebPage",
  name: "Sampan Development Limited | Real Estate & Property Development in Bangladesh",
  url: "https://sampandevelopmentltd.com",
  description: "Sampan Development Limited, a Sampan Group enterprise, delivers premium residential and commercial property development and land investment in Bangladesh.",
  isPartOf: {
    "@type": "WebSite",
    url: "https://sampandevelopmentltd.com",
    name: "Sampan Development Limited",
  },
};

export default function HomePage() {
  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify(webPageSchema),
        }}
      />

      <main>
      <Hero />
      <About />
      <ProjectShowcase />
      {/* <CondominiumShowcase/> */}
      <HighwayAddressSection />
      <CompletedProjectsSection />
      <HighwayInnSection/>
      <FeaturedProject />

      </main>
    </>
  );
}