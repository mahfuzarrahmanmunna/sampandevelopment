// app/page.tsx
import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";

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
      
      <main className="flex flex-col items-center w-full">
        {/* 
          Hero Section
          INTEGRATION INSTRUCTIONS:
          Replace the placeholder content below with your existing homepage UI components.
          Maintain the H1 tag, descriptive alt texts, and the 'priority' attribute on the LCP image.
        */}
        <section className="w-full max-w-7xl px-4 py-16 md:py-24 text-center">
          <h1 className="text-3xl md:text-5xl font-bold tracking-tight text-gray-900 mb-6">
            Sampan Development Limited: Premier Real Estate Developer in Bangladesh
          </h1>
          <p className="max-w-3xl mx-auto text-lg md:text-xl text-gray-600 mb-10">
            Welcome to Sampan Development Limited, the real estate division of Sampan Group. 
            We specialize in residential and commercial property development, delivering 
            high-quality apartments and land investment opportunities across Bangladesh.
          </p>
          
          {/* LCP Image: Do not lazy-load the hero image. Use priority */}
          <div className="relative w-full max-w-5xl mx-auto aspect-[2/1] rounded-xl overflow-hidden shadow-2xl">
            <Image
              src="/hero-image.jpg" // Replace with actual hero image path
              alt="Sampan Development Limited commercial and residential real estate project in Bangladesh"
              fill
              className="object-cover"
              priority
            />
          </div>
          
          <div className="mt-10">
            <Link 
              href="/projects" 
              className="inline-block bg-blue-600 text-white font-semibold px-8 py-4 rounded-lg hover:bg-blue-700 transition-colors duration-300 shadow-md"
            >
              Explore Our Projects
            </Link>
          </div>
        </section>

        {/* Services / Core Offerings Section */}
        <section className="w-full max-w-7xl px-4 py-16 md:py-24 bg-gray-50">
          <div className="text-center mb-12">
            <h2 className="text-2xl md:text-4xl font-bold text-gray-900 mb-4">
              Property Development in Bangladesh
            </h2>
            <p className="max-w-2xl mx-auto text-lg text-gray-600">
              As a leading property development company in Bangladesh, we focus on 
              quality, innovation, and sustainable growth.
            </p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 max-w-5xl mx-auto">
            <div className="p-8 bg-white rounded-lg shadow-sm border border-gray-100">
              <h3 className="text-xl md:text-2xl font-semibold text-gray-800 mb-4">
                Residential Property Development
              </h3>
              <p className="text-gray-600 leading-relaxed">
                Discover premium residential property development in Bangladesh, 
                including modern apartments and real estate projects in Dhaka.
              </p>
            </div>
            
            <div className="p-8 bg-white rounded-lg shadow-sm border border-gray-100">
              <h3 className="text-xl md:text-2xl font-semibold text-gray-800 mb-4">
                Commercial Property Development
              </h3>
              <p className="text-gray-600 leading-relaxed">
                Explore our commercial property development in Bangladesh, tailored 
                for business growth and strategic investment.
              </p>
            </div>
          </div>
        </section>
        
        {/* <HomeClientContent /> */}
      </main>
    </>
  );
}