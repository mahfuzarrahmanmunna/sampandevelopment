// app/components/ProjectCards.tsx
"use client";

import { useState, useRef, useLayoutEffect } from "react";
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

const PROJECTS = [
  {
    index: "01",
    name: "Sampan Trade Emporium",
    subhead: "Shop. Discover. Access more.",
    desc: "A mixed-use commercial hub bringing retail, leisure, and essential services together. From showrooms to a cinema, and a hospital to diagnostics, everything is in one building.",
    facts: ["20 katha", "B+LG+G+11", "Showrooms", "Food court", "Cinema", "Banks", "Hospital", "Diagnostics"],
    img: "/images/roni/Sampan_Trade_Emporium_Rooftop_Tower.png",
    slug: "/projects/ongoing/sampan-trade-emporium",
    linkLabel: "See the Trade Emporium",
    location: "Adjacent to Highway Inn",
    type: "Mixed-Use",
  },
  {
    index: "02",
    name: "Express Highway Inn",
    subhead: "Stop. Unwind. Connect.",
    desc: "A hospitality destination on the Dhaka–Chittagong Highway. Stop for a meal, unwind in the lounge, and let your car be washed while you relax.",
    facts: ["60 katha", "2-storied condominium", "Club and lounge membership", "VVIP lounge", "24/7 restaurant", "Sampan Mart", "Automatic car wash"],
    img: "/expresshighway/expresshighwayinn.png",
    slug: "/projects/ongoing/express-highway-inn",
    linkLabel: "See Express Highway Inn",
    location: "Dhaka–Chittagong Highway",
    type: "Hospitality",
  },
  {
    index: "03",
    name: "Sampan Condominium",
    subhead: "Stay. Live. Earn.",
    desc: "Serviced apartment living right next door. Units are professionally managed for rental income, while owners enjoy full access to the adjacent highway facilities.",
    facts: ["20 katha", "G+9 serviced apartments", "Managed rental units", "Rooftop pool and gym"],
    img: "/images/projects/condominium/condomenium.png",
    slug: "/projects/ongoing/sampan-condominium",
    linkLabel: "See the Condominium",
    location: "Beside Express Highway Inn",
    type: "Serviced Living",
  },
  
];

export default function ProjectCards() {
  const [hoveredIdx, setHoveredIdx] = useState<number | null>(null);
  const sectionRef = useRef<HTMLElement>(null);

  /* GSAP entrance animation — cards rise + fade in with stagger */
    /* GSAP entrance animation — cards rise + fade in with stagger */
  useLayoutEffect(() => {
    gsap.registerPlugin(ScrollTrigger);
    const ctx = gsap.context(() => {
      const mm = gsap.matchMedia();

      /* ── Desktop ── */
      mm.add("(min-width: 1024px) and (prefers-reduced-motion: no-preference)", () => {
        // FIX: use fromTo + immediateRender: false
        // This keeps the cards at their natural (visible) state until the
        // ScrollTrigger fires. If GSAP/ScrollTrigger ever fails to load,
        // the cards still render — they just won't animate in.
        gsap.fromTo(".pc-card",
          { opacity: 0, y: 60 },
          {
            opacity: 1,
            y: 0,
            duration: 1.1,
            stagger: 0.15,
            ease: "power3.out",
            immediateRender: false, // ← KEY: don't set opacity:0 until tween actually plays
            scrollTrigger: {
              trigger: sectionRef.current,
              start: "top 85%",
              once: true,
            },
          }
        );

        gsap.fromTo(".pc-header > *",
          { y: 36, opacity: 0 },
          {
            y: 0,
            opacity: 1,
            duration: 1,
            stagger: 0.12,
            ease: "power3.out",
            immediateRender: false,
            scrollTrigger: { trigger: ".pc-header", start: "top 85%", once: true },
          }
        );
      });

      /* ── Mobile ── */
      mm.add("(max-width: 1023px) and (prefers-reduced-motion: no-preference)", () => {
        // FIX: same pattern — fromTo + immediateRender: false
        gsap.fromTo(".pc-mobile-card",
          { opacity: 0, y: 40 },
          {
            opacity: 1,
            y: 0,
            duration: 0.9,
            stagger: 0.12,
            ease: "power3.out",
            immediateRender: false,
            scrollTrigger: {
              trigger: sectionRef.current,
              start: "top 85%",
              once: true,
            },
          }
        );

        gsap.fromTo(".pc-header > *",
          { opacity: 0, y: 24 },
          {
            opacity: 1,
            y: 0,
            duration: 0.8,
            stagger: 0.1,
            ease: "power3.out",
            immediateRender: false,
            scrollTrigger: { trigger: ".pc-header", start: "top 85%", once: true },
          }
        );
      });

      /* ── Reduced motion ── */
      mm.add("(prefers-reduced-motion: reduce)", () => {
        gsap.set(".pc-card, .pc-mobile-card, .pc-header > *", { clearProps: "all" });
      });

      // Refresh after fonts load — prevents trigger miscalculation
      if (typeof document !== "undefined" && document.fonts) {
        document.fonts.ready.then(() => ScrollTrigger.refresh());
      }
    }, sectionRef);

    return () => ctx.revert();
  }, []);


  return (
    <section
      ref={sectionRef}
      className={`${luxSerif.variable} ${luxSans.variable} relative w-full bg-[#0B0B0D] text-[#F4F1EA] font-lux-sans antialiased overflow-hidden py-24 lg:py-32`}
    >
      {/* Subtle radial atmosphere */}
      <div
        className="pointer-events-none absolute inset-0 z-0"
        style={{
          background:
            "radial-gradient(ellipse 70% 50% at 50% 0%, rgba(25, 171, 225, 0.04), transparent 60%)",
        }}
        aria-hidden="true"
      />
      {/* Subtle dot grid */}
      <div
        className="pointer-events-none absolute inset-0 z-0 opacity-[0.025]"
        style={{
          backgroundImage:
            "radial-gradient(circle, #F4F1EA 0.5px, transparent 0.5px)",
          backgroundSize: "32px 32px",
        }}
        aria-hidden="true"
      />

      <div className="relative z-10 mx-auto max-w-[1600px] px-5 sm:px-6 md:px-12 lg:px-16">
        {/* ───────────────────────────────────────────────────────────
            SECTION HEADER
           ─────────────────────────────────────────────────────────── */}
        <div className="pc-header mb-16 max-w-3xl lg:mb-20">
          <div className="mb-8 flex items-center gap-4">
            <span
              className="h-[1.5px] w-12"
              style={{
                background:
                  "linear-gradient(90deg, #19ABE1, transparent)",
              }}
            />
            <span className="font-mono text-[10px] font-semibold uppercase tracking-[0.4em] text-[#19ABE1] sm:text-[11px]">
              One Connected Destination
            </span>
            <span className="h-1.5 w-1.5 rounded-full bg-[#19ABE1]" />
          </div>

          <h2 className="font-lux-serif text-[clamp(2.5rem,5.5vw,5rem)] leading-[0.95] tracking-[-0.03em] font-light text-[#F4F1EA] mb-6">
            Three projects.
            <br />
            <span className="italic text-[#19ABE1]">One address.</span>
          </h2>

          <p className="text-sm sm:text-base md:text-lg font-light leading-relaxed text-[#B5B1A8] max-w-xl">
            Stay, live, shop, and connect within a single destination on the Dhaka–Chittagong Highway. Hover each card to explore the project that fits your purpose.
          </p>
        </div>

        {/* ═══════════════════════════════════════════════════════════
            DESKTOP — 3 EXPANDING CARDS IN A ROW (hidden on mobile)
            - Default: all cards equal width (flex: 1)
            - Hovered: hovered card expands to flex-[2.6], others shrink to flex-[0.7]
            - Hovered card reveals: description + facts + CTA
            - Shrunk cards show: large italic index centered
           ═══════════════════════════════════════════════════════════ */}
        <div className="hidden lg:flex gap-3 h-[78vh] min-h-[600px]">
          {PROJECTS.map((project, i) => {
            const isHovered = hoveredIdx === i;
            const isAnyHovered = hoveredIdx !== null;
            const isShrunk = isAnyHovered && !isHovered;

            return (
              <article
                key={project.index}
                onMouseEnter={() => setHoveredIdx(i)}
                onMouseLeave={() => setHoveredIdx(null)}
                className={`pc-card group relative overflow-hidden cursor-pointer transition-all duration-[800ms] ease-[cubic-bezier(0.22,1,0.36,1)] ${
                  isHovered ? "flex-[2.6]" : isShrunk ? "flex-[0.7]" : "flex-[1]"
                }`}
                style={{
                  backgroundImage: `url(${project.img})`,
                  backgroundSize: "cover",
                  backgroundPosition: "center",
                  boxShadow: isHovered
                    ? "0 30px 80px -20px rgba(0,0,0,0.6), 0 0 0 1px rgba(25, 171, 225, 0.2)"
                    : "0 12px 32px -12px rgba(0,0,0,0.4)",
                }}
              >
                {/* Dark gradient overlay — always present, deepens on hover */}
                <div className="absolute inset-0 bg-gradient-to-t from-[#0B0B0D] via-[#0B0B0D]/60 to-[#0B0B0D]/20" />
                <div
                  className={`absolute inset-0 bg-gradient-to-r from-[#0B0B0D]/85 via-[#0B0B0D]/30 to-transparent transition-opacity duration-500 ${
                    isHovered ? "opacity-100" : "opacity-0"
                  }`}
                />

                {/* Architectural corner brackets — 4 corners, subtle frame */}
                <span className="pointer-events-none absolute left-3 top-3 z-30 h-3 w-3 border-l border-t border-[#19ABE1]/50" />
                <span className="pointer-events-none absolute right-3 top-3 z-30 h-3 w-3 border-r border-t border-[#19ABE1]/50" />
                <span className="pointer-events-none absolute bottom-3 left-3 z-30 h-3 w-3 border-b border-l border-[#19ABE1]/50" />
                <span className="pointer-events-none absolute bottom-3 right-3 z-30 h-3 w-3 border-b border-r border-[#19ABE1]/50" />

                {/* Top index badge (always visible) */}
                <div className="absolute left-5 top-5 z-20 flex items-center gap-2 backdrop-blur-md bg-[#0B0B0D]/40 px-3 py-1.5">
                  <span className="h-px w-3 bg-[#19ABE1]" />
                  <span className="font-mono text-[9px] uppercase tracking-[0.3em] text-[#F4F1EA]">
                    {project.index} / 03
                  </span>
                </div>

                {/* Top-right type label (hidden when shrunk) */}
                <div
                  className={`absolute right-5 top-5 z-20 backdrop-blur-md bg-[#0B0B0D]/40 px-3 py-1.5 transition-opacity duration-300 ${
                    isShrunk ? "opacity-0" : "opacity-100"
                  }`}
                >
                  <span className="font-mono text-[9px] uppercase tracking-[0.3em] text-[#19ABE1]">
                    {project.type}
                  </span>
                </div>

                {/* Large italic index — only visible when shrunk (centered) */}
                <div
                  className={`pointer-events-none absolute left-1/2 top-1/2 z-10 -translate-x-1/2 -translate-y-1/2 transition-all duration-500 ${
                    isShrunk ? "opacity-100 scale-100" : "opacity-0 scale-75"
                  }`}
                >
                  <span className="block font-lux-serif text-[10vw] italic font-light leading-none text-[#F4F1EA]">
                    {project.index}
                  </span>
                </div>

                {/* Content layer (bottom-anchored) */}
                <div
                  className={`absolute bottom-0 left-0 right-0 z-20 p-6 transition-all duration-500 ${
                    isShrunk ? "opacity-0 translate-y-4" : "opacity-100 translate-y-0"
                  }`}
                >
                  {/* Index + type row */}
                  <div className="mb-4 flex items-center gap-3">
                    <span className="font-lux-serif text-2xl italic font-light text-[#19ABE1]">
                      {project.index}
                    </span>
                    <span className="h-px w-8 bg-[#19ABE1]" />
                    <span className="font-mono text-[9px] uppercase tracking-[0.3em] text-[#19ABE1] font-medium">
                      {project.type}
                    </span>
                  </div>

                  {/* Name */}
                  <h3 className="font-lux-serif text-[clamp(1.8rem,2.2vw,2.8rem)] leading-[0.95] tracking-[-0.02em] font-light text-[#F4F1EA] mb-2">
                    {project.name}
                  </h3>

                  {/* Subhead */}
                  <p className="font-lux-serif text-base italic font-light text-[#19ABE1]/85 mb-6">
                    {project.subhead}
                  </p>

                  {/* Expanded content — revealed on hover via max-height */}
                  <div
                    className={`overflow-hidden transition-all duration-500 ease-[cubic-bezier(0.22,1,0.36,1)] ${
                      isHovered
                        ? "max-h-[600px] opacity-100"
                        : "max-h-0 opacity-0"
                    }`}
                  >
                    {/* Description */}
                    <p className="text-sm text-[#B5B1A8] font-light leading-relaxed border-l-2 border-[#19ABE1]/40 pl-4 mb-6 max-w-md">
                      {project.desc}
                    </p>

                    {/* Facts grid */}
                    <div className="grid grid-cols-2 gap-x-6 gap-y-2 mb-6 max-w-md border-t border-[#F4F1EA]/10 pt-4">
                      {project.facts.map((fact, idx) => (
                        <div
                          key={idx}
                          className="flex items-center gap-2 text-[10px] text-[#B5B1A8] font-light"
                        >
                          <span className="h-1 w-1 rounded-full bg-[#19ABE1] flex-shrink-0" />
                          {fact}
                        </div>
                      ))}
                    </div>

                    {/* CTA + location */}
                    <div className="flex flex-wrap items-center gap-4">
                      <Link
                        href={project.slug}
                        className="group/cta relative inline-flex items-center gap-3 overflow-hidden bg-[#19ABE1] text-[#0B0B0D] text-[10px] font-semibold uppercase tracking-[0.25em] px-6 py-3.5 transition-colors duration-500 hover:text-[#19ABE1]"
                      >
                        <span className="absolute inset-0 bg-[#F4F1EA] translate-y-full group-hover/cta:translate-y-0 transition-transform duration-500 ease-[cubic-bezier(0.22,1,0.36,1)] z-0" />
                        <span className="relative z-10 flex items-center gap-3">
                          {project.linkLabel}
                          <svg
                            className="h-3.5 w-3.5 transition-transform duration-300 group-hover/cta:translate-x-1"
                            fill="none"
                            stroke="currentColor"
                            viewBox="0 0 24 24"
                            aria-hidden="true"
                          >
                            <path
                              strokeLinecap="round"
                              strokeLinejoin="round"
                              strokeWidth="1.5"
                              d="M14 5l7 7m0 0l-7 7m7-7H3"
                            />
                          </svg>
                        </span>
                      </Link>
                      <span className="font-mono text-[9px] uppercase tracking-[0.3em] text-[#89867E]">
                        {project.location}
                      </span>
                    </div>
                  </div>
                </div>

                {/* Hover sweep sheen — left-to-right shine on hover */}
                <span
                  aria-hidden="true"
                  className="pointer-events-none absolute inset-0 -translate-x-full bg-gradient-to-r from-transparent via-white/10 to-transparent transition-transform duration-[1200ms] ease-out group-hover:translate-x-full"
                />

                {/* Left edge accent bar (visible on hover) */}
                <span
                  className={`pointer-events-none absolute left-0 top-0 h-full w-[3px] bg-[#19ABE1] transition-opacity duration-500 ${
                    isHovered ? "opacity-100" : "opacity-0"
                  }`}
                />
              </article>
            );
          })}
        </div>

        {/* ═══════════════════════════════════════════════════════════
            MOBILE — STACKED VERTICAL CARDS (hidden on desktop)
            All content visible by default — no hover expansion
           ═══════════════════════════════════════════════════════════ */}
        <div className="lg:hidden flex flex-col gap-6">
          {PROJECTS.map((project, i) => (
            <article
              key={project.index}
              className="pc-mobile-card group relative overflow-hidden border border-[#F4F1EA]/10"
            >
              {/* Image layer */}
              <div className="relative w-full aspect-[4/3] overflow-hidden">
                <img
                  src={project.img}
                  alt={project.name}
                  className="h-full w-full object-cover transition-transform duration-700 ease-[cubic-bezier(0.22,1,0.36,1)] group-hover:scale-105"
                  loading="lazy"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-[#0B0B0D] via-[#0B0B0D]/40 to-transparent" />

                {/* Top-left index badge */}
                <div className="absolute left-3 top-3 backdrop-blur-md bg-[#0B0B0D]/60 px-3 py-1.5 flex items-center gap-2">
                  <span className="h-px w-3 bg-[#19ABE1]" />
                  <span className="font-mono text-[9px] uppercase tracking-[0.3em] text-[#F4F1EA]">
                    {project.index} / 03
                  </span>
                </div>

                {/* Top-right type label */}
                <div className="absolute right-3 top-3 backdrop-blur-md bg-[#0B0B0D]/60 px-3 py-1.5">
                  <span className="font-mono text-[9px] uppercase tracking-[0.3em] text-[#19ABE1]">
                    {project.type}
                  </span>
                </div>

                {/* Corner accent */}
                <div className="absolute right-0 top-0 h-5 w-5 border-r border-t border-[#19ABE1]/50" />
                <div className="absolute bottom-0 left-0 h-5 w-5 border-l border-b border-[#19ABE1]/50" />
              </div>

              {/* Card content (always visible on mobile) */}
              <div className="bg-[#0B0B0D] p-5 sm:p-6">
                {/* Index + type row */}
                <div className="mb-3 flex items-center gap-3">
                  <span className="font-lux-serif text-xl italic font-light text-[#19ABE1]">
                    {project.index}
                  </span>
                  <span className="h-px w-6 bg-[#19ABE1]" />
                  <span className="font-mono text-[9px] uppercase tracking-[0.3em] text-[#19ABE1] font-medium">
                    {project.type}
                  </span>
                </div>

                {/* Name */}
                <h3 className="font-lux-serif text-[clamp(1.8rem,7vw,2.5rem)] leading-[0.95] tracking-[-0.02em] font-light text-[#F4F1EA] mb-2">
                  {project.name}
                </h3>

                {/* Subhead */}
                <p className="font-lux-serif text-base italic font-light text-[#19ABE1]/85 mb-5">
                  {project.subhead}
                </p>

                {/* Description */}
                <p className="text-xs sm:text-sm text-[#B5B1A8] font-light leading-relaxed border-l-2 border-[#19ABE1]/40 pl-3 mb-5">
                  {project.desc}
                </p>

                {/* Facts grid */}
                <div className="grid grid-cols-2 gap-x-3 gap-y-2 mb-6 border-t border-[#F4F1EA]/10 pt-4">
                  {project.facts.map((fact, idx) => (
                    <div
                      key={idx}
                      className="flex items-center gap-2 text-[10px] text-[#B5B1A8] font-light"
                    >
                      <span className="h-1 w-1 rounded-full bg-[#19ABE1] flex-shrink-0" />
                      {fact}
                    </div>
                  ))}
                </div>

                {/* CTA */}
                <Link
                  href={project.slug}
                  className="group/cta relative inline-flex w-full items-center justify-center gap-3 overflow-hidden bg-[#19ABE1] text-[#0B0B0D] text-[10px] font-semibold uppercase tracking-[0.25em] px-6 py-3.5 transition-colors duration-500 hover:text-[#19ABE1]"
                >
                  <span className="absolute inset-0 bg-[#F4F1EA] translate-y-full group-hover/cta:translate-y-0 transition-transform duration-500 ease-[cubic-bezier(0.22,1,0.36,1)] z-0" />
                  <span className="relative z-10 flex items-center gap-3">
                    {project.linkLabel}
                    <svg
                      className="h-3.5 w-3.5"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                      aria-hidden="true"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth="1.5"
                        d="M14 5l7 7m0 0l-7 7m7-7H3"
                      />
                    </svg>
                  </span>
                </Link>

                {/* Location footer */}
                <div className="mt-4 flex items-center justify-center gap-2">
                  <span className="h-px w-4 bg-[#19ABE1]/40" />
                  <span className="font-mono text-[8px] uppercase tracking-[0.3em] text-[#89867E]">
                    {project.location}
                  </span>
                  <span className="h-px w-4 bg-[#19ABE1]/40" />
                </div>
              </div>
            </article>
          ))}
        </div>

        {/* Bottom helper text — guides user behavior */}
        <div className="mt-12 flex items-center justify-center gap-3 text-[#89867E]">
          <span className="hidden h-px w-8 bg-[#19ABE1]/40 lg:block" />
          <span className="font-mono text-[9px] uppercase tracking-[0.3em]">
            {hoveredIdx !== null
              ? `Viewing ${PROJECTS[hoveredIdx].name}`
              : "Hover any card to explore"}
          </span>
          <span className="hidden h-px w-8 bg-[#19ABE1]/40 lg:block" />
        </div>
      </div>

      {/* Global typography styles */}
      <style jsx global>{`
        @import url('https://fonts.googleapis.com/css2?family=Cormorant+Garamond:ital,wght@0,300;0,400;0,500;0,600;1,300;1,400;1,500&family=Inter:wght@300;400;500;600&display=swap');

        .font-lux-serif {
          font-family: 'Cormorant Garamond', serif;
        }
        .font-lux-sans {
          font-family: 'Inter', sans-serif;
        }
      `}</style>
    </section>
  );
}