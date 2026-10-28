// app/components/HighwayInnSection.tsx
"use client";

import { useLayoutEffect, useRef } from "react";
import Link from "next/link";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
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

const FACILITIES = [
  {
    name: "Restaurant & Party Centre",
    desc: "Fine dining and grand celebrations under one roof.",
    img: "/images/projects/highwayinn/vvip-lounge.jpeg",
    tag: "Dining",
  },
  {
    name: "Sweet Box",
    desc: "Artisanal desserts and confections crafted daily.",
    img: "/images/projects/highwayinn/sweet-shop.jpg",
    tag: "Confections",
  },
  {
    name: "Mini Sampan",
    desc: "Quick bites and casual café moments.",
    img: "/images/projects/highwayinn/Feature-Image-1.jpg",
    tag: "Café",
  },
  {
    name: "Sampan Mart",
    desc: "Premium retail and everyday essentials.",
    img: "/images/projects/highwayinn/IMG_20250916_065230.jpg",
    tag: "Retail",
  },
  {
    name: "Filling Station",
    desc: "Modern fueling infrastructure for travellers.",
    img: "/images/projects/highwayinn/Filling-Station-1.jpg",
    tag: "Fuel",
  },
  {
    name: "LPG Station",
    desc: "Safe and efficient gas solutions for vehicles and homes.",
    img: "/images/projects/highwayinn/lpg.jpeg",
    tag: "Gas",
  },
  {
    name: "White House Hotel & Motel",
    desc: "Luxury transient living beside the highway.",
    img: "/images/projects/highwayinn/hotelandmotel.png",
    tag: "Hospitality",
  },
];

export default function HighwayInnSection() {
  const sectionRef = useRef<HTMLElement>(null);

  useLayoutEffect(() => {
    gsap.registerPlugin(ScrollTrigger);

    const ctx = gsap.context(() => {
      const mm = gsap.matchMedia();

      // ─── Reduced motion fallback ──────────────────────────────────
      mm.add("(prefers-reduced-motion: reduce)", () => {
        gsap.set(
          ".anim-eyebrow, .anim-headline, .anim-fade, .anim-line-draw, .anim-img-reveal, .anim-card",
          { clearProps: "all" }
        );
      });

      // ─── Desktop & tablet ─────────────────────────────────────────
      mm.add("(min-width: 768px) and (prefers-reduced-motion: no-preference)", () => {
        // Initial states
        gsap.set(".anim-headline", { yPercent: 110 });
        gsap.set(".anim-eyebrow", { opacity: 0, x: -16 });
        gsap.set(".anim-fade", { opacity: 0, y: 30 });
        gsap.set(".anim-line-draw", { scaleX: 0, transformOrigin: "left" });
        gsap.set(".anim-img-reveal", { clipPath: "inset(0% 0% 100% 0%)" });
        gsap.set(".anim-card", { opacity: 0, y: 40 });

        // Hero entrancescrubbed
        const heroTl = gsap.timeline({
          scrollTrigger: {
            trigger: sectionRef.current,
            start: "top 78%",
            end: "top 30%",
            scrub: 1,
          },
        });
        heroTl
          .to(".anim-eyebrow", { opacity: 1, x: 0, ease: "power3.out", duration: 0.4 }, 0)
          .to(".anim-headline", { yPercent: 0, ease: "power4.out", duration: 0.7, stagger: 0.1 }, 0.1)
          .to(".anim-fade", { opacity: 1, y: 0, ease: "power3.out", duration: 0.6, stagger: 0.08 }, 0.3)
          .to(".anim-line-draw", { scaleX: 1, ease: "power2.out", duration: 0.5, stagger: 0.05 }, 0.5)
          .to(".anim-img-reveal", { clipPath: "inset(0% 0% 0% 0%)", ease: "power3.inOut", duration: 0.8 }, 0.2);

        // Gallery cardsstaggered entrance
        gsap.to(".anim-card", {
          opacity: 1,
          y: 0,
          duration: 0.8,
          stagger: 0.08,
          ease: "power3.out",
          scrollTrigger: {
            trigger: ".gallery-grid",
            start: "top 80%",
            end: "top 40%",
            scrub: 1,
          },
        });
      });

      // ─── Mobile ───────────────────────────────────────────────────
      mm.add("(max-width: 767px) and (prefers-reduced-motion: no-preference)", () => {
        gsap.set(".anim-eyebrow, .anim-headline, .anim-fade, .anim-card", { opacity: 0, y: 24 });
        gsap.set(".anim-line-draw", { scaleX: 0, transformOrigin: "left" });
        gsap.set(".anim-img-reveal", { clipPath: "inset(0% 0% 100% 0%)" });

        const heroTl = gsap.timeline({
          scrollTrigger: {
            trigger: sectionRef.current,
            start: "top 80%",
            end: "top 40%",
            scrub: 1,
          },
        });
        heroTl
          .to(".anim-eyebrow", { opacity: 1, y: 0, ease: "power3.out", duration: 0.5 }, 0)
          .to(".anim-headline", { opacity: 1, y: 0, ease: "power4.out", duration: 0.6, stagger: 0.08 }, 0.1)
          .to(".anim-fade", { opacity: 1, y: 0, ease: "power3.out", duration: 0.5, stagger: 0.06 }, 0.3)
          .to(".anim-line-draw", { scaleX: 1, ease: "power2.out", duration: 0.5, stagger: 0.04 }, 0.4)
          .to(".anim-img-reveal", { clipPath: "inset(0% 0% 0% 0%)", ease: "power3.inOut", duration: 0.7 }, 0.2);

        gsap.to(".anim-card", {
          opacity: 1,
          y: 0,
          duration: 0.6,
          stagger: 0.06,
          ease: "power3.out",
          scrollTrigger: {
            trigger: ".gallery-grid",
            start: "top 85%",
            end: "top 50%",
            scrub: 1,
          },
        });
      });
    }, sectionRef);

    return () => ctx.revert();
  }, []);

  return (
    <section
      ref={sectionRef}
      className={`${luxSerif.variable} ${luxSans.variable} relative w-full overflow-hidden bg-[#171715] text-[#F4F1EA] font-lux-sans antialiased`}
    >
      {/* Soft ambient gradientwarm gold radial in upper third */}
      <div className="pointer-events-none absolute inset-0">
        <div className="absolute left-1/2 top-0 h-[620px] w-[920px] -translate-x-1/2 -translate-y-1/4 rounded-full bg-[radial-gradient(ellipse_at_center,_rgba(197,160,89,0.08)_0%,_transparent_60%)] blur-3xl" />
        <div className="absolute bottom-0 right-0 h-[500px] w-[700px] translate-x-1/3 translate-y-1/3 rounded-full bg-[radial-gradient(circle,_rgba(197,160,89,0.05)_0%,_transparent_70%)] blur-3xl" />
      </div>

      {/* Kinetic ghost typography */}
      <div className="pointer-events-none absolute left-0 top-1/2 w-full -translate-y-1/2 overflow-hidden whitespace-nowrap opacity-[0.025]">
        <span className="font-lux-serif pr-8 text-[20vw] leading-none text-[#F4F1EA]">HIGHWAY INN</span>
      </div>

      <div className="relative z-10 mx-auto max-w-[1440px] px-5 sm:px-6 md:px-12 lg:px-24 pt-24 pb-20 md:pt-32 md:pb-28 lg:pt-40 lg:pb-32">
        {/* ═══════════════════════════════════════════════════════════
            EDITORIAL HEROSplit layout with cinematic image reveal
           ═══════════════════════════════════════════════════════════ */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 lg:gap-16 items-center mb-24 md:mb-32 lg:mb-40">
          
          {/* Text Column */}
          <div className="lg:col-span-6 order-2 lg:order-1">
            {/* Eyebrow */}
            <div className="anim-eyebrow mb-8 flex items-center gap-4">
              <span className="anim-line-draw block h-[1.5px] w-12 bg-[#19ABE1]" />
              <span className="text-[10px] font-medium uppercase tracking-[0.4em] text-[#19ABE1] md:text-[11px]">
                The Sampan Experience
              </span>
            </div>

            {/* Headline */}
            <h2 className="font-lux-serif text-[clamp(2.8rem,6vw,5rem)] leading-[0.95] tracking-[-0.03em] text-[#F4F1EA] mb-6">
              <span className="block overflow-hidden pb-2">
                <span className="anim-headline block font-light">Sampan Highway</span>
              </span>
              <span className="block overflow-hidden pb-2">
                <span className="anim-headline block font-normal italic text-[#19ABE1]">Inn.</span>
              </span>
            </h2>

            {/* Subhead */}
            <p className="anim-fade mb-8 max-w-md font-lux-serif text-xl md:text-2xl font-light italic text-[#B5B1A8]">
              Everything in one destination.
            </p>

            {/* Body copy */}
            <p className="anim-fade mb-10 max-w-md text-sm md:text-base font-light leading-relaxed text-[#B5B1A8]">
              A restaurant and party centre, Sweet Box, Mini Sampan, Sampan Mart, a filling station, an LPG station and the Sampan White House hotel and motelall brought together in one place along the Dhaka–Chittagong Highway.
            </p>

            {/* CTA + meta strip */}
            <div className="anim-fade flex flex-col gap-6">
              <Link
                href="/sampan-highway-inn"
                className="group relative inline-flex items-center gap-3 overflow-hidden bg-[#19ABE1] px-8 py-4 text-[10px] font-semibold uppercase tracking-[0.3em] text-[#171715] transition-colors duration-500 hover:text-[#19ABE1] w-fit"
              >
                <span className="absolute inset-0 z-0 translate-y-full bg-[#F4F1EA] transition-transform duration-500 ease-[cubic-bezier(0.22,1,0.36,1)] group-hover:translate-y-0" />
                <span className="relative z-10 flex items-center gap-3">
                  Explore Highway Inn
                  <svg className="h-4 w-4 transition-transform duration-300 group-hover:translate-x-1" fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden="true">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" d="M14 5l7 7m0 0l-7 7m7-7H3" />
                  </svg>
                </span>
              </Link>

              {/* Quick-fact strip */}
              <div className="flex flex-wrap items-center gap-x-6 gap-y-2 text-[9px] uppercase tracking-[0.3em] text-[#89867E]">
                <span>DhakaChittagong Highway</span>
                <span className="h-3 w-px bg-[rgba(244,241,234,0.15)]" />
                <span>7 Connected Concerns</span>
                <span className="h-3 w-px bg-[rgba(244,241,234,0.15)]" />
                <span>24/7 Open</span>
              </div>
            </div>
          </div>

          {/* Image Columnwith cinematic clip reveal */}
          <div className="lg:col-span-6 order-1 lg:order-2">
            <div className="relative aspect-[4/5] sm:aspect-[5/4] lg:aspect-[5/6] overflow-hidden bg-[#1D1D1A]">
              {/* Image with clip-path reveal */}
              <div className="anim-img-reveal absolute inset-0">
                <img
                  src="/images/projects/highwayinn/sampanhighwayinn.png"
                  alt="Sampan Highway Innarchitectural exterior at dusk"
                  className="h-full w-full object-cover"
                  loading="lazy"
                />
                {/* Gradient overlay for depth */}
                <div className="absolute inset-0 bg-gradient-to-t from-[#171715]/60 via-transparent to-transparent" />
                <div className="absolute inset-0 bg-gradient-to-r from-[#171715]/30 via-transparent to-transparent" />
              </div>

              {/* Corner accents */}
              <div className="absolute left-0 top-0 z-10 h-8 w-8 border-l border-t border-[#19ABE1]/50" />
              <div className="absolute bottom-0 right-0 z-10 h-8 w-8 border-b border-r border-[#19ABE1]/50" />

              {/* Floating captionbottom left */}
              <div className="absolute bottom-5 left-5 z-10 flex items-center gap-3">
                <span className="h-px w-8 bg-[#19ABE1]" />
                <span className="text-[9px] uppercase tracking-[0.3em] text-[#F4F1EA]/80 backdrop-blur-sm bg-[#171715]/40 px-3 py-1.5">
                  Fig 01 / Highway District
                </span>
              </div>

              {/* Top-right index */}
              <div className="absolute right-5 top-5 z-10 flex items-baseline gap-2">
                <span className="font-lux-serif text-3xl font-light italic text-[#19ABE1]/80">01</span>
                <span className="text-[9px] uppercase tracking-[0.3em] text-[#F4F1EA]/50">/ Inn</span>
              </div>
            </div>
          </div>
        </div>

        {/* ═══════════════════════════════════════════════════════════
            AMENITIES GALLERYEditorial bento with cinematic cards
           ═══════════════════════════════════════════════════════════ */}
        <div className="border-t border-[rgba(244,241,234,0.08)] pt-16 md:pt-24">
          
          {/* Section header */}
          <div className="grid grid-cols-1 md:grid-cols-12 gap-6 mb-12 md:mb-16 items-end">
            <div className="md:col-span-7">
              <div className="mb-5 flex items-center gap-4">
                <span className="anim-line-draw block h-[1.5px] w-12 bg-[#19ABE1]" />
                <span className="text-[10px] font-medium uppercase tracking-[0.4em] text-[#19ABE1] md:text-[11px]">
                  More to Discover
                </span>
              </div>
              <h3 className="font-lux-serif text-[clamp(2.2rem,4vw,3.5rem)] leading-[1] tracking-[-0.03em] font-light text-[#F4F1EA]">
                Seven concerns,
                <span className="block italic text-[#19ABE1]">one destination.</span>
              </h3>
            </div>
            <div className="md:col-span-5 md:text-right">
              <p className="text-sm md:text-base font-light leading-relaxed text-[#89867E] max-w-sm md:ml-auto">
                Everything you needthoughtfully brought together along the highway. Dining, retail, fuel, hospitality, and more.
              </p>
            </div>
          </div>

          {/* Bento grid */}
          <div className="gallery-grid grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-12 gap-4 md:gap-5">
            {FACILITIES.map((facility, i) => {
              // Balanced 7-item bento layout
              let spanClass = "";
              let heightClass = "";

              if (i === 0) {
                // Hero cardlarge left
                spanClass = "sm:col-span-2 lg:col-span-7";
                heightClass = "h-[320px] sm:h-[400px] lg:h-[480px]";
              } else if (i === 1) {
                // Hero cardlarge right
                spanClass = "lg:col-span-5";
                heightClass = "h-[320px] sm:h-[400px] lg:h-[480px]";
              } else if (i >= 2 && i <= 4) {
                // Mid row3 equal cards
                spanClass = "lg:col-span-4";
                heightClass = "h-[280px] sm:h-[320px] lg:h-[360px]";
              } else {
                // Bottom row2 wide cards
                spanClass = "sm:col-span-2 lg:col-span-6";
                heightClass = "h-[280px] sm:h-[340px] lg:h-[400px]";
              }

              return (
                <article
                  key={i}
                  className={`anim-card group relative ${spanClass} ${heightClass} overflow-hidden bg-[#1D1D1A] border border-[rgba(244,241,234,0.06)]`}
                >
                  {/* Image */}
                  <img
                    src={facility.img}
                    alt={facility.name}
                    className="absolute inset-0 h-full w-full object-cover transition-transform duration-[1.4s] ease-[cubic-bezier(0.22,1,0.36,1)] group-hover:scale-105"
                    loading="lazy"
                  />

                  {/* Gradient overlayalways present for legibility, intensifies on hover */}
                  <div className="absolute inset-0 bg-gradient-to-t from-[#171715] via-[#171715]/30 to-transparent opacity-90 transition-opacity duration-500 group-hover:opacity-100" />
                  <div className="absolute inset-0 bg-gradient-to-r from-[#171715]/40 via-transparent to-transparent" />

                  {/* Top rowindex + tag */}
                  <div className="absolute top-5 left-5 right-5 z-10 flex items-start justify-between">
                    <span className="flex items-center gap-2 text-[9px] uppercase tracking-[0.3em] text-[#F4F1EA]/70 backdrop-blur-sm bg-[#171715]/40 px-2.5 py-1">
                      <span className="h-px w-3 bg-[#19ABE1]" />
                      {String(i + 1).padStart(2, "0")}
                    </span>
                    <span className="text-[9px] uppercase tracking-[0.3em] text-[#19ABE1] backdrop-blur-sm bg-[#171715]/40 px-2.5 py-1">
                      {facility.tag}
                    </span>
                  </div>

                  {/* Bottom content */}
                  <div className="absolute bottom-0 left-0 right-0 z-10 p-6 md:p-8">
                    <h4 className="font-lux-serif text-2xl md:text-3xl font-light leading-tight text-[#F4F1EA] transition-colors duration-500 group-hover:text-[#19ABE1]">
                      {facility.name}
                    </h4>

                    {/* Hover descriptiongrid row trick */}
                    <div className="grid transition-all duration-500 ease-[cubic-bezier(0.22,1,0.36,1)] group-hover:grid-rows-[1fr] grid-rows-[0fr]">
                      <div className="overflow-hidden">
                        <div className="flex items-center gap-3 mt-3">
                          <span className="h-px w-6 bg-[#19ABE1]" />
                          <p className="text-xs md:text-sm font-light leading-relaxed text-[#B5B1A8]">
                            {facility.desc}
                          </p>
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Corner accent on hover */}
                  <div className="absolute bottom-0 right-0 z-10 h-6 w-6 border-b border-r border-[#19ABE1] opacity-0 transition-opacity duration-500 group-hover:opacity-100" />

                  {/* Subtle gold wash on hover */}
                  <div className="pointer-events-none absolute inset-0 bg-[#19ABE1]/0 transition-colors duration-700 group-hover:bg-[#19ABE1]/[0.04]" />
                </article>
              );
            })}
          </div>

          {/* Bottom CTA strip */}
          <div className="mt-16 md:mt-20 flex flex-col md:flex-row items-start md:items-center justify-between gap-6 border-t border-[rgba(244,241,234,0.08)] pt-8">
            <div className="flex items-center gap-4">
              <span className="h-px w-8 bg-[#19ABE1]" />
              <p className="text-[10px] uppercase tracking-[0.3em] text-[#89867E]">
                Visit any concernopen daily
              </p>
            </div>
            <Link
              href="/sampan-highway-inn"
              className="group inline-flex items-center gap-4 text-[10px] font-semibold uppercase tracking-[0.3em] text-[#F4F1EA] hover:text-[#19ABE1] transition-colors duration-300"
            >
              See the full directory
              <span className="relative w-12 h-[1.5px] bg-[#F4F1EA]/40 overflow-hidden">
                <span className="absolute inset-0 bg-[#19ABE1] -translate-x-full group-hover:translate-x-0 transition-transform duration-500 ease-[cubic-bezier(0.22,1,0.36,1)]" />
              </span>
              <svg className="h-3.5 w-3.5 transition-transform duration-300 group-hover:translate-x-1" fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden="true">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" d="M14 5l7 7m0 0l-7 7m7-7H3" />
              </svg>
            </Link>
          </div>
        </div>

        {/* Bottom section index marker */}
        <div className="mt-20 flex items-center justify-between text-[10px] uppercase tracking-[0.3em] text-[#89867E]">
          <span>Sampan Highway Inn</span>
          <span className="hidden sm:inline">Sampan Group · Hospitality</span>
        </div>
      </div>
    </section>
  );
}