"use client";

import { useRef } from "react";
import Image from "next/image";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { useGSAP } from "@gsap/react";

gsap.registerPlugin(useGSAP, ScrollTrigger);

/* ------------------------------------------------------------------ */
/*  DATA MODEL                                                         */
/* ------------------------------------------------------------------ */

interface Affiliation {
  id: string;
  name: string;
  description: string;
  logo: string;
}

interface Category {
  index: string;
  title: string;
  subtitle: string;
  items: Affiliation[];
}

const categoriesData: Category[] = [
  {
    index: "01",
    title: "Entrepreneurial Leadership",
    subtitle: "Commerce & Trade",
    items: [
      { id: "01", name: "REHAB", description: "Real Estate & Housing Association of Bangladesh", logo: "/images/affiliation/rehab.png" },
      { id: "02", name: "FBCCI", description: "Federation of Bangladesh Chambers of Commerce & Industry", logo: "/images/affiliation/fbcci.png" },
      { id: "03", name: "BARVIDA", description: "Bangladesh Reconditioned Vehicles Importers & Dealers Association", logo: "/images/affiliation/barvia.png" },
      { id: "04", name: "BAD", description: "Bangladesh Arm's Dealer and Importer Association", logo: "/images/affiliation/bad.png" },
      { id: "05", name: "PABX", description: "Bangladesh PABX Association", logo: "/images/affiliation/pabx.png" },
      { id: "06", name: "LPG", description: "Bangladesh LPG Autogas Station & Conversion Workshop Ownerʼs Association", logo: "/images/affiliation/lpg.png" },
      { id: "07", name: "DGDP", description: "Directorate General Defence Purchase", logo: "/images/affiliation/dgdp.png" },
      { id: "08", name: "EHCL", description: "Express Highway Club And Lounge", logo: "/images/affiliation/EHCl.png" },
    ],
  },
  {
    index: "02",
    title: "Sports & Social Development",
    subtitle: "Youth & Sports",
    items: [
      { id: "09", name: "BVF", description: "Bangladesh Volleyball Federation (AD-Hoc Community)", logo: "/images/affiliation/bvf.png" },
      { id: "10", name: "Barisal Bulls", description: "Bangladesh Premier League (BPL) Franchise", logo: "/images/affiliation/barishalbulls.png" },
      { id: "11", name: "Barisal Club", description: "Established 1864 - Historical Social Club", logo: "/images/affiliation/lis.png" },
      { id: "12", name: "BPL", description: "Bangladesh Premier League Official Affiliation", logo: "/images/affiliation/bpl.png" },
      { id: "13", name: "SSC", description: "Shooter's Shooting Club", logo: "/images/affiliation/shoot.png" },
      { id: "14", name: "BAF", description: "Bangladesh Archery Federation", logo: "/images/affiliation/Archery.png" },
      { id: "15", name: "SGA", description: "Sampan Golf Academy", logo: "/images/affiliation/Sampan Golf Academy.png" },
    ],
  },
  {
    index: "03",
    title: "International Diplomacy",
    subtitle: "Foreign Affairs & Global Standards",
    items: [
      { id: "16", name: "Mercedes-Benz", description: "Global Automotive Partner & Authorized Dealer", logo: "/images/affiliation/mercedes.png" },
      { id: "17", name: "CIPS", description: "Chartered Institute of Procurement & Supply UK - Authorized", logo: "/images/affiliation/cips.png" },
      { id: "18", name: "Global Initiative", description: "Strategic International Development Network", logo: "/images/affiliation/Asset 26@4x.png" },
    ],
  },
];

/* ------------------------------------------------------------------ */
/*  MAIN COMPONENT                                                     */
/* ------------------------------------------------------------------ */

export default function AffiliationSection() {
  const containerRef = useRef<HTMLDivElement>(null);

  useGSAP(
    () => {
      const mm = gsap.matchMedia();

      mm.add("(prefers-reduced-motion: reduce)", () => {
        gsap.set([".aff-header > *", ".cat-block", ".aff-card"], { opacity: 1, y: 0, clipPath: "none" });
      });

      mm.add("(prefers-reduced-motion: no-preference)", () => {
        /* HEADER ENTRANCE */
        gsap.fromTo(
          ".aff-header > *",
          { y: 40, opacity: 0 },
          {
            y: 0,
            opacity: 1,
            duration: 1.2,
            stagger: 0.15,
            ease: "power3.out",
            scrollTrigger: { trigger: ".aff-header", start: "top 85%", once: true },
          }
        );

        /* CATEGORY BLOCKS REVEAL */
        // FIX: Added <HTMLElement> generic to prevent TS unknown error
        gsap.utils.toArray<HTMLElement>(".cat-block").forEach((block) => {
          gsap.from(block, {
            opacity: 0,
            y: 60,
            duration: 1.2,
            ease: "power4.out",
            scrollTrigger: { trigger: block, start: "top 85%", once: true },
          });
        });

        /* CARDS RAPID STAGGER REVEAL */
        // FIX: Added <HTMLElement> generic to prevent TS unknown error
        gsap.utils.toArray<HTMLElement>(".aff-card").forEach((card, i) => {
          gsap.from(card, {
            opacity: 0,
            y: 30,
            duration: 0.8,
            ease: "power3.out",
            scrollTrigger: { trigger: card, start: "top 90%", once: true },
            delay: (i % 4) * 0.05, // Slight stagger per row
          });
        });
      });
    },
    { scope: containerRef }
  );

  return (
    <section ref={containerRef} className="relative w-full overflow-hidden bg-[#F7F7F4] py-24 md:py-32 lg:py-40">
      <div className="relative mx-auto max-w-[1600px] px-[5vw]">
        
        {/* ====== EDITORIAL HEADER ====== */}
        <div className="aff-header mb-20 grid grid-cols-1 gap-8 border-b border-neutral-300/60 pb-12 lg:mb-32 lg:grid-cols-12 lg:gap-12">
          <div className="lg:col-span-8">
            <p className="mb-6 flex items-center font-mono text-[11px] font-medium uppercase tracking-[0.4em] text-emerald-700">
              <span className="mr-3 inline-block h-px w-6 bg-emerald-700"></span>
              Network & Affiliations
            </p>
            <h2 className="text-[clamp(2.5rem,5vw,4.5rem)] font-semibold leading-[0.95] tracking-[-0.04em] text-neutral-950">
              Connected to institutions
              <br />
              <span className="text-neutral-400">that shape our industries.</span>
            </h2>
          </div>
          <div className="flex flex-col justify-end lg:col-span-4 lg:items-end">
            <p className="max-w-xs text-sm leading-7 text-neutral-500 lg:text-right">
              Professional memberships and international affiliations reflecting the networks behind Sampan Group.
            </p>
          </div>
        </div>

        {/* ====== CATEGORIZED INSTITUTIONAL GRID ====== */}
        <div className="flex flex-col gap-20 lg:gap-32">
          {categoriesData.map((category) => (
            <div key={category.index} className="cat-block">
              
              {/* Category Header */}
              <div className="mb-10 flex items-end justify-between border-b border-neutral-200 pb-6">
                <div className="flex items-baseline gap-6">
                  <span className="font-mono text-sm font-medium text-neutral-400">{category.index}</span>
                  <div>
                    <h3 className="text-2xl font-semibold tracking-tight text-neutral-950 md:text-3xl">
                      {category.title}
                    </h3>
                    <p className="mt-1 font-mono text-xs uppercase tracking-[0.3em] text-emerald-700">
                      {category.subtitle}
                    </p>
                  </div>
                </div>
                <span className="hidden font-mono text-xs uppercase tracking-widest text-neutral-400 md:block">
                  {category.items.length} Organizations
                </span>
              </div>

              {/* Organization Cards Grid */}
              <div className="grid grid-cols-1 gap-px overflow-hidden border border-neutral-200 bg-neutral-200 sm:grid-cols-2 lg:grid-cols-4">
                {category.items.map((aff) => (
                  <AffiliationCard key={aff.id} aff={aff} />
                ))}
              </div>

            </div>
          ))}
        </div>

      </div>
    </section>
  );
}

/* ------------------------------------------------------------------ */
/*  AFFILIATION CARD SUBCOMPONENT                                      */
/* ------------------------------------------------------------------ */

interface AffiliationCardProps {
  aff: Affiliation;
}

function AffiliationCard({ aff }: AffiliationCardProps) {
  return (
    <article className="aff-card group relative flex flex-col bg-[#F7F7F4] p-8 transition-all duration-500 ease-[cubic-bezier(0.19,1,0.22,1)] hover:bg-white">
      
      {/* Top Row: Index & Hover Line */}
      <div className="mb-8 flex items-center justify-between">
        <span className="font-mono text-[10px] tracking-widest text-neutral-400">
          {aff.id}
        </span>
        <span className="h-px w-0 bg-emerald-500 transition-all duration-500 ease-out group-hover:w-8"></span>
      </div>

      {/* Logo Container - Fixed aspect ratio for perfect grid alignment */}
      <div className="relative flex aspect-[4/3] w-full items-center justify-center">
        <div className="relative h-full w-full max-w-[140px]">
          <Image
            src={aff.logo}
            alt={`${aff.name} Logo`}
            fill
            className="object-contain opacity-70 transition-all duration-500 ease-out group-hover:scale-110 group-hover:opacity-100"
            sizes="(min-width: 1024px) 25vw, 50vw"
          />
        </div>
      </div>

      {/* Metadata Content */}
      <div className="mt-8 flex flex-1 flex-col">
        <h4 className="text-lg font-semibold tracking-tight text-neutral-950">
          {aff.name}
        </h4>
        <p className="mt-2 text-xs leading-relaxed text-neutral-500">
          {aff.description}
        </p>
      </div>
    </article>
  );
}