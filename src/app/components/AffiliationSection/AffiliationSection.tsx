// app/components/AffiliationSection.tsx
"use client";

import { useRef, useState } from "react";
import Image from "next/image";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { useGSAP } from "@gsap/react";
import { Cormorant_Garamond, Inter } from "next/font/google";

const luxSerif = Cormorant_Garamond({
  subsets: ["latin"],
  weight: ["300", "400", "500", "600"],
  style: ["normal", "italic"],
  variable: "--font-lux-serif",
});

const luxSans = Inter({
  subsets: ["latin"],
  weight: ["300", "400", "500", "600"],
  variable: "--font-lux-sans",
});

gsap.registerPlugin(useGSAP, ScrollTrigger);

/* ------------------------------------------------------------------ */
/*  DATA MODEL                                                         */
/* ------------------------------------------------------------------ */

interface Affiliation {
  id: string;
  name: string;
  description: string;
  logo: string;
  shortName?: string;
}

interface Category {
  index: string;
  title: string;
  italicTitle: string;
  subtitle: string;
  items: Affiliation[];
}

const categoriesData: Category[] = [
  {
    index: "01",
    title: "Entrepreneurial",
    italicTitle: "Leadership",
    subtitle: "Commerce & Trade",
    items: [
      { id: "01", name: "REHAB", shortName: "REHAB", description: "Real Estate & Housing Association of Bangladesh", logo: "/images/brand/all sampan logo & Affiliations Logo 5.webp" },
      { id: "02", name: "FBCCI", shortName: "FBCCI", description: "Federation of Bangladesh Chambers of Commerce & Industry", logo: "/images/brand/all sampan logo & Affiliations Logo.webp" },
      { id: "03", name: "BARVIDA", shortName: "BARVIDA", description: "Bangladesh Reconditioned Vehicles Importers & Dealers Association", logo: "/images/brand/all sampan logo & Affiliations Logo 2.webp" },
      { id: "04", name: "BADIA", shortName: "BADIA", description: "Bangladesh Arm's Dealer and Importer Association", logo: "/images/brand/all sampan logo & Affiliations Logo 4.webp" },
      { id: "05", name: "PABX", shortName: "PABX", description: "Bangladesh PABX Association", logo: "/images/brand/all sampan logo & Affiliations Logo 1.webp" },
      { id: "06", name: "LPG", shortName: "LPG", description: "Bangladesh LPG Autogas Station & Conversion Workshop Owner's Association", logo: "/images/brand/all sampan logo & Affiliations Logo 3.webp" },
      { id: "07", name: "DGDP", shortName: "DGDP", description: "Directorate General Defence Purchase", logo: "/images/brand/all sampan logo & Affiliations Logo 6.webp" },
      { id: "08", name: "EHCL", shortName: "EHCL", description: "Express Highway Club And Lounge", logo: "/images/brand/all sampan logo & Affiliations Logo 12.webp" },
    ],
  },
  {
    index: "02",
    title: "Sports & Social",
    italicTitle: "Development",
    subtitle: "Youth & Community",
    items: [
      { id: "09", name: "BVF", shortName: "BVF", description: "Bangladesh Volleyball Federation (AD-Hoc Community)", logo: "/images/brand/all sampan logo & Affiliations Logo 7.webp" },
      { id: "10", name: "Barisal Bulls", shortName: "Bulls", description: "Bangladesh Premier League (BPL) Franchise", logo: "/images/brand/all sampan logo & Affiliations Logo 8.webp" },
      { id: "11", name: "Barisal Club", shortName: "Est. 1864", description: "Historical Social ClubEstablished 1864", logo: "/images/brand/all sampan logo & Affiliations Logo 10.webp" },
      { id: "12", name: "BPL", shortName: "BPL", description: "Bangladesh Premier League Official Affiliation", logo: "/images/brand/all sampan logo & Affiliations Logo 11.webp" },
      { id: "13", name: "SSC", shortName: "SSC", description: "Shooter's Shooting Club", logo: "/images/brand/all sampan logo & Affiliations Logo 14.webp" },
      { id: "14", name: "BAF", shortName: "BAF", description: "Bangladesh Archery Federation", logo: "/images/brand/all sampan logo & Affiliations Logo 15.webp" },
      { id: "15", name: "SGA", shortName: "SGA", description: "Sampan Golf Academy", logo: "/images/brand/all sampan logo & Affiliations Logo 22.webp" },
    ],
  },
  {
    index: "03",
    title: "International",
    italicTitle: "Diplomacy",
    subtitle: "Foreign Affairs & Global Standards",
    items: [
      { id: "16", name: "Mercedes-Benz", shortName: "MB", description: "Global Automotive Partner & Authorized Dealer", logo: "/images/brand/all sampan logo & Affiliations Logo 17.webp" },
      { id: "17", name: "CIPS", shortName: "CIPS", description: "Chartered Institute of Procurement & Supply UKAuthorized", logo: "/images/brand/cips.png" },
      // { id: "18", name: "Global Initiative", shortName: "GI", description: "Strategic International Development Network", logo: "/images/brand/Asset 26@4x.png" },
    ],
  },
];

const METRICS = [
  { value: "18", label: "Affiliations" },
  { value: "03", label: "Sectors" },
  { value: "1864", label: "Oldest Heritage" },
  { value: "Global", label: "Reach" },
];

/* ------------------------------------------------------------------ */
/*  MAIN COMPONENT                                                     */
/* ------------------------------------------------------------------ */

export default function AffiliationSection() {
  const containerRef = useRef<HTMLDivElement>(null);
  const [hoveredCard, setHoveredCard] = useState<string | null>(null);

  useGSAP(
    () => {
      const mm = gsap.matchMedia();

      /* ---------------- Reduced motion fallback ---------------- */
      mm.add("(prefers-reduced-motion: reduce)", () => {
        gsap.set(
          ".anim-eyebrow, .anim-headline, .anim-fade, .anim-line-draw, .anim-cat, .anim-card, .anim-metric",
          { clearProps: "all" }
        );
      });

      /* ---------------- Desktop & tablet ---------------- */
      mm.add("(min-width: 768px) and (prefers-reduced-motion: no-preference)", () => {
        gsap.set(".anim-headline", { yPercent: 110 });
        gsap.set(".anim-eyebrow", { opacity: 0, x: -16 });
        gsap.set(".anim-fade", { opacity: 0, y: 30 });
        gsap.set(".anim-line-draw", { scaleX: 0, transformOrigin: "left" });
        gsap.set(".anim-cat", { opacity: 0, y: 40 });
        gsap.set(".anim-card", { opacity: 0, y: 30 });
        gsap.set(".anim-metric", { opacity: 0, y: 24 });

        // Header entrance
        gsap.timeline({
          scrollTrigger: {
            trigger: containerRef.current,
            start: "top 78%",
            end: "top 30%",
            scrub: 1,
          },
        })
          .to(".anim-eyebrow", { opacity: 1, x: 0, ease: "power3.out", duration: 0.4 }, 0)
          .to(".anim-headline", { yPercent: 0, ease: "power4.out", duration: 0.7, stagger: 0.1 }, 0.1)
          .to(".anim-fade", { opacity: 1, y: 0, ease: "power3.out", duration: 0.6, stagger: 0.08 }, 0.3)
          .to(".anim-line-draw", { scaleX: 1, ease: "power2.out", duration: 0.5, stagger: 0.05 }, 0.5);

        // Category blocksstaggered entrance
        gsap.utils.toArray<HTMLElement>(".anim-cat").forEach((block) => {
          gsap.to(block, {
            opacity: 1,
            y: 0,
            duration: 0.8,
            ease: "power3.out",
            scrollTrigger: {
              trigger: block,
              start: "top 80%",
              end: "top 40%",
              scrub: 1,
            },
          });
        });

        // Cardsstaggered per row
        gsap.utils.toArray<HTMLElement>(".anim-card").forEach((card, i) => {
          gsap.to(card, {
            opacity: 1,
            y: 0,
            duration: 0.7,
            ease: "power3.out",
            delay: (i % 4) * 0.05,
            scrollTrigger: {
              trigger: card,
              start: "top 88%",
              end: "top 55%",
              scrub: 1,
            },
          });
        });

        // Metrics
        gsap.to(".anim-metric", {
          opacity: 1,
          y: 0,
          duration: 0.6,
          stagger: 0.08,
          ease: "power3.out",
          scrollTrigger: {
            trigger: ".metrics-strip",
            start: "top 85%",
            end: "top 50%",
            scrub: 1,
          },
        });
      });

      /* ---------------- Mobile ---------------- */
      mm.add("(max-width: 767px) and (prefers-reduced-motion: no-preference)", () => {
        gsap.set(".anim-eyebrow, .anim-headline, .anim-fade, .anim-cat, .anim-card, .anim-metric", { opacity: 0, y: 24 });
        gsap.set(".anim-line-draw", { scaleX: 0, transformOrigin: "left" });

        gsap.timeline({
          scrollTrigger: {
            trigger: containerRef.current,
            start: "top 82%",
            end: "top 45%",
            scrub: 1,
          },
        })
          .to(".anim-eyebrow", { opacity: 1, y: 0, ease: "power3.out", duration: 0.5 }, 0)
          .to(".anim-headline", { opacity: 1, y: 0, ease: "power4.out", duration: 0.6, stagger: 0.08 }, 0.1)
          .to(".anim-fade", { opacity: 1, y: 0, ease: "power3.out", duration: 0.5, stagger: 0.06 }, 0.3)
          .to(".anim-line-draw", { scaleX: 1, ease: "power2.out", duration: 0.5, stagger: 0.04 }, 0.4);

        gsap.utils.toArray<HTMLElement>(".anim-cat").forEach((block) => {
          gsap.to(block, {
            opacity: 1, y: 0, duration: 0.6, ease: "power3.out",
            scrollTrigger: { trigger: block, start: "top 85%", end: "top 50%", scrub: 1 },
          });
        });

        gsap.utils.toArray<HTMLElement>(".anim-card").forEach((card, i) => {
          gsap.to(card, {
            opacity: 1, y: 0, duration: 0.5, ease: "power3.out", delay: (i % 2) * 0.05,
            scrollTrigger: { trigger: card, start: "top 90%", end: "top 60%", scrub: 1 },
          });
        });

        gsap.to(".anim-metric", {
          opacity: 1, y: 0, duration: 0.5, stagger: 0.06, ease: "power3.out",
          scrollTrigger: { trigger: ".metrics-strip", start: "top 88%", end: "top 55%", scrub: 1 },
        });
      });
    },
    { scope: containerRef }
  );

  return (
    <section
      ref={containerRef}
      className={`${luxSerif.variable} ${luxSans.variable} relative w-full overflow-hidden bg-[#F7F5EF] text-[#191C19] font-lux-sans antialiased`}
    >
      {/* ═══ Ambient atmospheric layers ═══ */}
      <div className="pointer-events-none absolute inset-0">
        <div className="absolute left-1/2 top-0 h-[620px] w-[920px] -translate-x-1/2 -translate-y-1/4 rounded-full bg-[radial-gradient(ellipse_at_center,_rgba(197,160,89,0.12)_0%,_transparent_60%)] blur-3xl" />
        <div className="absolute bottom-0 right-0 h-[500px] w-[700px] translate-x-1/3 translate-y-1/3 rounded-full bg-[radial-gradient(circle,_rgba(197,160,89,0.08)_0%,_transparent_70%)] blur-3xl" />
        <div className="absolute left-0 top-1/3 h-[400px] w-[500px] -translate-x-1/3 rounded-full bg-[radial-gradient(circle,_rgba(197,160,89,0.06)_0%,_transparent_70%)] blur-3xl" />
      </div>

      {/* Kinetic ghost typography */}
      <div className="pointer-events-none absolute left-0 top-1/2 w-full -translate-y-1/2 overflow-hidden whitespace-nowrap opacity-[0.03]">
        <span className="font-lux-serif pr-8 text-[20vw] leading-none text-[#191C19]">AFFILIATIONS</span>
      </div>
      <div className="absolute right-5 top-6 z-20 hidden items-center gap-3 text-[9px] uppercase tracking-[0.4em] text-[#777A74] sm:right-6 md:flex md:right-12">
        <span>18 Affiliations</span>
        <span className="h-px w-8 bg-[#19ABE1]" />
      </div>

      <div className="relative z-10 mx-auto max-w-[1600px] px-5 sm:px-6 md:px-12 lg:px-24 pt-28 pb-20 md:pt-36 md:pb-28 lg:pt-44 lg:pb-32">

        {/* ═══════════════════════════════════════════════════════════
            1. EDITORIAL HEADER
           ═══════════════════════════════════════════════════════════ */}
        <div className="grid grid-cols-1 gap-10 lg:grid-cols-12 lg:gap-16 mb-28 md:mb-36 lg:mb-44">

          <div className="lg:col-span-8">
            <h2 className="font-lux-serif text-[clamp(2.8rem,6vw,5.5rem)] leading-[0.95] tracking-[-0.03em] font-light text-[#191C19]">
              <span className="block overflow-hidden pb-2">
                <span className="anim-headline block">Connected to institutions</span>
              </span>
              <span className="block overflow-hidden pb-2">
                <span className="anim-headline block italic text-[#19ABE1]">that shape our industries.</span>
              </span>
            </h2>
          </div>

          <div className="lg:col-span-4 flex flex-col justify-end">
            <p className="anim-fade text-sm md:text-base font-light leading-relaxed text-[#5C655C] max-w-md lg:ml-auto lg:text-right">
              Professional memberships and international affiliations reflecting the networks behind Sampan Groupacross commerce, sport, and diplomacy.
            </p>

            {/* Inline mini-stats */}
            <div className="anim-fade mt-8 flex flex-wrap items-center gap-x-8 gap-y-3 border-t border-[rgba(25,28,25,0.1)] pt-6 lg:justify-end">
              {[
                { v: "18", l: "Affiliations" },
                { v: "03", l: "Sectors" },
                { v: "1864", l: "Heritage" },
              ].map((s, i) => (
                <div key={i} className="flex items-baseline gap-2">
                  <span className="font-lux-serif text-2xl font-light italic text-[#19ABE1]">{s.v}</span>
                  <span className="text-[9px] uppercase tracking-[0.3em] text-[#777A74]">{s.l}</span>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* ═══════════════════════════════════════════════════════════
            2. CATEGORIZED INSTITUTIONAL DIRECTORY
           ═══════════════════════════════════════════════════════════ */}
        <div className="flex flex-col gap-24 lg:gap-36">

          {categoriesData.map((category) => (
            <div key={category.index} className="anim-cat relative">

              {/* Section index on divider */}
              <div className="absolute left-0 top-0 -translate-y-1/2 bg-[#F7F5EF] px-4">
                <span className="font-mono text-[10px] tracking-[0.2em] text-[#19ABE1]">{category.index} / Directory</span>
              </div>

              {/* Category Header */}
              <div className="mb-12 md:mb-16 grid grid-cols-1 gap-6 border-b border-[rgba(25,28,25,0.1)] pb-8 md:grid-cols-12 md:items-end">
                <div className="md:col-span-8">
                  <div className="mb-5 flex items-baseline gap-6">
                    <span className="font-lux-serif text-5xl md:text-6xl font-light italic text-[#19ABE1]/40 leading-none">
                      {category.index}
                    </span>
                    <div>
                      <h3 className="font-lux-serif text-3xl md:text-4xl lg:text-5xl font-light tracking-[-0.02em] text-[#191C19] leading-tight">
                        {category.title}
                        <span className="block italic text-[#19ABE1]">{category.italicTitle}</span>
                      </h3>
                    </div>
                  </div>
                  <p className="text-[10px] font-medium uppercase tracking-[0.4em] text-[#19ABE1] md:text-[11px] ml-0 md:ml-20">
                    {category.subtitle}
                  </p>
                </div>
                <div className="md:col-span-4 md:text-right">
                  <span className="font-mono text-xs uppercase tracking-[0.2em] text-[#777A74]">
                    {String(category.items.length).padStart(2, "0")} Organizations
                  </span>
                  <p className="mt-2 text-sm font-light text-[#777A74] max-w-xs md:ml-auto">
                    Verified memberships and active partnerships.
                  </p>
                </div>
              </div>

              {/* Organization Cards Grid */}
              <div className="grid grid-cols-1 gap-px overflow-hidden border border-[rgba(25,28,25,0.1)] bg-[rgba(25,28,25,0.1)] sm:grid-cols-2 lg:grid-cols-4">
                {category.items.map((aff) => (
                  <AffiliationCard
                    key={aff.id}
                    aff={aff}
                    isHovered={hoveredCard === aff.id}
                    isDimmed={hoveredCard !== null && hoveredCard !== aff.id}
                    onEnter={() => setHoveredCard(aff.id)}
                    onLeave={() => setHoveredCard(null)}
                  />
                ))}
              </div>
            </div>
          ))}
        </div>

        {/* ═══════════════════════════════════════════════════════════
            3. METRICS STRIP
           ═══════════════════════════════════════════════════════════ */}
        <div className="metrics-strip mt-28 md:mt-36 lg:mt-44 border-t border-[rgba(25,28,25,0.1)] pt-12">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8 md:gap-6">
            {METRICS.map((metric, i) => (
              <div key={i} className="anim-metric flex flex-col gap-3 border-l border-[rgba(197,160,89,0.4)] pl-5">
                <span className="font-lux-serif text-4xl md:text-5xl lg:text-6xl font-light italic text-[#19ABE1] leading-none">
                  {metric.value}
                </span>
                <span className="text-[10px] uppercase tracking-[0.3em] text-[#777A74]">{metric.label}</span>
              </div>
            ))}
          </div>
        </div>

        {/* Bottom section index marker */}
        <div className="mt-20 flex items-center justify-between text-[10px] uppercase tracking-[0.3em] text-[#777A74]">
          <span>Affiliations & Network</span>
          <span className="hidden sm:inline">Sampan Group · Trust</span>
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
  isHovered: boolean;
  isDimmed: boolean;
  onEnter: () => void;
  onLeave: () => void;
}

function AffiliationCard({ aff, isHovered, isDimmed, onEnter, onLeave }: AffiliationCardProps) {
  return (
    <article
      onMouseEnter={onEnter}
      onMouseLeave={onLeave}
      className={`aff-card anim-card group relative flex flex-col bg-white p-6 md:p-8 transition-all duration-500 ease-[cubic-bezier(0.22,1,0.36,1)] ${
        isDimmed ? "opacity-50" : "opacity-100"
      } hover:bg-[#FAF8F2]`}
    >
      {/* Sliding gold indicatortop-left */}
      <span
        aria-hidden="true"
        className="absolute left-0 top-0 h-px w-0 bg-[#19ABE1] transition-all duration-500 ease-[cubic-bezier(0.22,1,0.36,1)] group-hover:w-full"
      />

      {/* Top Row: Index + Hover Line */}
      <div className="mb-8 flex items-center justify-between">
        <span className="font-mono text-[10px] tracking-widest text-[#777A74]">
          {aff.id}
        </span>
        <span className="h-px w-0 bg-[#19ABE1] transition-all duration-500 ease-out group-hover:w-8" />
      </div>

      {/* Logo Containerfull color by default, grayscale on hover */}
      <div className="relative flex aspect-[4/3] w-full items-center justify-center">
        <div className="relative h-full w-full max-w-[140px]">
          <img
            src={aff.logo}
            alt={`${aff.name} Logo`}
            className="object-contain transition-all duration-500 ease-out group-hover:scale-110 group-hover:grayscale group-hover:opacity-70"
            sizes="(min-width: 1024px) 25vw, 50vw"
          />
        </div>
      </div>

      {/* Metadata Content */}
      <div className="mt-8 flex flex-1 flex-col">
        <div className="mb-3 flex items-center gap-3">
          <span className="h-px w-4 bg-[#19ABE1]" />
          <span className="text-[9px] uppercase tracking-[0.3em] text-[#19ABE1]">{aff.shortName}</span>
        </div>
        <h4 className="font-lux-serif text-xl md:text-2xl font-light leading-tight text-[#191C19] transition-colors duration-500 group-hover:text-[#19ABE1]">
          {aff.name}
        </h4>
        <p className="mt-3 text-xs font-light leading-relaxed text-[#777A74]">
          {aff.description}
        </p>
      </div>

      {/* Corner accent on hover */}
      <div className="absolute bottom-0 right-0 z-10 h-6 w-6 border-b border-r border-[#19ABE1] opacity-0 transition-opacity duration-500 group-hover:opacity-100" />

      {/* Subtle gold wash on hover */}
      <div className="pointer-events-none absolute inset-0 bg-[#19ABE1]/0 transition-colors duration-700 group-hover:bg-[#19ABE1]/[0.03]" />
    </article>
  );
}