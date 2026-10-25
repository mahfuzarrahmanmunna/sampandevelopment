// app/components/MotherCompany.tsx
"use client";

import { useLayoutEffect, useRef, useState, useCallback, useEffect } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

/* ------------------------------------------------------------------ */
/*  TYPES & DATA                                                       */
/* ------------------------------------------------------------------ */

type Concern = {
  name: string;
  tag: string;
  location: string;
  img?: string;
  caption?: string;
  href?: string;
};

const CONCERNS: Concern[] = [
  {
    name: "Express Highway Inn",
    tag: "Hospitality",
    location: "Express Highway",
    img: "/images/brand/expresshighwayinn.png",
    caption: "Highway hospitality landmark",
    href: "https://sampangroup.com.bd/express-highway-inn",
  },
  {
    name: "Sampan Highway Inn",
    tag: "Hospitality",
    location: "Dhaka — Chittagong Highway",
    img: "/images/brand/sampanhighwayinn.png",
    caption: "Modern transit accommodation",
    href: "https://sampangroup.com.bd/sampan-highway-inn",
  },
  {
    name: "Sampan Agro & Golf Resort",
    tag: "Leisure",
    location: "Outskirts of City",
    img: "/images/brand/agroandgolf.png",
    caption: "Resort living by the greens",
    href: "https://sampangroup.com.bd/agro-golf-resort",
  },
  {
    name: "LSHS",
    tag: "Education",
    location: "Professional Studies",
    img: "/images/brand/lshs.png",
    caption: "Institute of professional studies",
    href: "https://sampangroup.com.bd/lshs",
  },
  {
    name: "Sampan Eco & Agro",
    tag: "Agriculture",
    location: "Sustainable Futures",
    img: "/images/brand/sampanechoagro.png",
    caption: "Sustainable agriculture & eco-solutions",
    href: "https://sampangroup.com.bd/eco-agro",
  },
  {
    name: "Sampan Mart",
    tag: "Retail",
    location: "Everyday Goods",
    img: "/images/brand/sampanmart.png",
    caption: "Convenience for everyday needs",
    href: "https://sampangroup.com.bd/sampan-mart",
  },
];

/* ------------------------------------------------------------------ */
/*  COMPONENT                                                          */
/* ------------------------------------------------------------------ */

export default function MotherCompany() {
  const sectionRef = useRef<HTMLElement>(null);
  const listRef = useRef<HTMLUListElement>(null);
  const cursorRef = useRef<HTMLDivElement>(null);

  const [hoveredIndex, setHoveredIndex] = useState<number | null>(null);
  const [expandedMobile, setExpandedMobile] = useState<number | null>(null);
  const [currentImg, setCurrentImg] = useState<string | null>(null);
  const [currentCaption, setCurrentCaption] = useState<string>("");

  /* --- Image preloading --- */
  useEffect(() => {
    CONCERNS.forEach((c) => {
      if (!c.img) return;
      const img = new Image();
      img.src = c.img;
    });
  }, []);

  /* --- GSAP engine --- */
  useLayoutEffect(() => {
    gsap.registerPlugin(ScrollTrigger);

    const ctx = gsap.context(() => {
      const mm = gsap.matchMedia();

      /* ---------------- Reduced motion — show everything ---------------- */
      mm.add("(prefers-reduced-motion: reduce)", () => {
        gsap.set(
          ".anim-eyebrow, .anim-headline, .anim-fade, .anim-line-draw, .anim-concern",
          { clearProps: "all" }
        );
        if (cursorRef.current) gsap.set(cursorRef.current, { opacity: 0 });
      });

      /* ---------------- Desktop & tablet (pointer fine) ----------------- */
      mm.add(
        "(min-width: 768px) and (prefers-reduced-motion: no-preference) and (pointer: fine)",
        () => {
          gsap.set(".anim-headline", { yPercent: 110 });
          gsap.set(".anim-fade", { opacity: 0, y: 40 });
          gsap.set(".anim-line-draw", { scaleX: 0, transformOrigin: "left" });
          gsap.set(".anim-eyebrow", { opacity: 0, x: -20 });
          gsap.set(".anim-concern", { opacity: 0, y: 30 });

          const tl = gsap.timeline({
            scrollTrigger: {
              trigger: sectionRef.current,
              start: "top 78%",
              end: "top 35%",
              scrub: 1,
              invalidateOnRefresh: true,
            },
          });
          tl.to(".anim-eyebrow", { opacity: 1, x: 0, ease: "power3.out", duration: 0.4 }, 0)
            .to(".anim-headline", { yPercent: 0, ease: "power4.out", duration: 0.6, stagger: 0.1 }, 0.1)
            .to(".anim-fade", { opacity: 1, y: 0, ease: "power3.out", duration: 0.6, stagger: 0.08 }, 0.3)
            .to(".anim-line-draw", { scaleX: 1, ease: "power2.out", duration: 0.5, stagger: 0.05 }, 0.5)
            .to(".anim-concern", { opacity: 1, y: 0, ease: "power3.out", duration: 0.5, stagger: 0.06 }, 0.6);

          if (cursorRef.current) {
            gsap.set(cursorRef.current, {
              xPercent: -50,
              yPercent: -50,
              opacity: 0,
              scale: 0.92,
              rotate: -2,
              x: window.innerWidth / 2,
              y: window.innerHeight / 2,
              pointerEvents: "none",
            });

            const xTo = gsap.quickTo(cursorRef.current, "x", { duration: 0.7, ease: "power3" });
            const yTo = gsap.quickTo(cursorRef.current, "y", { duration: 0.7, ease: "power3" });

            const PREVIEW_W = 440;
            const PREVIEW_H = 280;

            const handleMouseMove = (e: MouseEvent) => {
              const halfW = PREVIEW_W / 2;
              const halfH = PREVIEW_H / 2;
              const margin = 24;
              const x = Math.max(
                halfW + margin,
                Math.min(window.innerWidth - halfW - margin, e.clientX)
              );
              const y = Math.max(
                halfH + margin,
                Math.min(window.innerHeight - halfH - margin, e.clientY)
              );
              xTo(x);
              yTo(y);
            };

            window.addEventListener("mousemove", handleMouseMove, { passive: true });

            const hideCursor = () => {
              if (!cursorRef.current) return;
              gsap.to(cursorRef.current, {
                opacity: 0,
                scale: 0.92,
                duration: 0.3,
                ease: "power3.in",
                overwrite: "auto",
              });
              setHoveredIndex(null);
            };

            const cursorGuard = ScrollTrigger.create({
              trigger: sectionRef.current,
              start: "top bottom",
              end: "bottom top",
              onLeave: hideCursor,
              onLeaveBack: hideCursor,
              onToggle: (self) => {
                if (!self.isActive) hideCursor();
              },
            });

            return () => {
              window.removeEventListener("mousemove", handleMouseMove);
              cursorGuard.kill();
            };
          }
        }
      );

      /* ---------------- Tablet / coarse pointer ---------------- */
      mm.add(
        "(min-width: 768px) and (prefers-reduced-motion: no-preference) and (pointer: coarse)",
        () => {
          gsap.set(".anim-headline", { yPercent: 110 });
          gsap.set(".anim-fade", { opacity: 0, y: 40 });
          gsap.set(".anim-line-draw", { scaleX: 0, transformOrigin: "left" });
          gsap.set(".anim-eyebrow", { opacity: 0, x: -20 });
          gsap.set(".anim-concern", { opacity: 0, y: 30 });

          const tl = gsap.timeline({
            scrollTrigger: {
              trigger: sectionRef.current,
              start: "top 80%",
              end: "top 38%",
              scrub: 1,
              invalidateOnRefresh: true,
            },
          });
          tl.to(".anim-eyebrow", { opacity: 1, x: 0, ease: "power3.out", duration: 0.4 }, 0)
            .to(".anim-headline", { yPercent: 0, ease: "power4.out", duration: 0.6, stagger: 0.1 }, 0.1)
            .to(".anim-fade", { opacity: 1, y: 0, ease: "power3.out", duration: 0.6, stagger: 0.08 }, 0.3)
            .to(".anim-line-draw", { scaleX: 1, ease: "power2.out", duration: 0.5, stagger: 0.05 }, 0.5)
            .to(".anim-concern", { opacity: 1, y: 0, ease: "power3.out", duration: 0.5, stagger: 0.06 }, 0.6);

          if (cursorRef.current) gsap.set(cursorRef.current, { opacity: 0 });
        }
      );

      /* ---------------- Mobile ---------------- */
      mm.add("(max-width: 767px) and (prefers-reduced-motion: no-preference)", () => {
        gsap.set(".anim-eyebrow, .anim-headline, .anim-fade, .anim-concern", {
          opacity: 0,
          y: 30,
        });
        gsap.set(".anim-line-draw", { scaleX: 0, transformOrigin: "left" });

        const tl = gsap.timeline({
          scrollTrigger: {
            trigger: sectionRef.current,
            start: "top 82%",
            end: "top 45%",
            scrub: 1,
            invalidateOnRefresh: true,
          },
        });
        tl.to(".anim-eyebrow", { opacity: 1, y: 0, ease: "power3.out", duration: 0.5 }, 0)
          .to(".anim-headline", { opacity: 1, y: 0, ease: "power4.out", duration: 0.6, stagger: 0.08 }, 0.1)
          .to(".anim-fade", { opacity: 1, y: 0, ease: "power3.out", duration: 0.5, stagger: 0.06 }, 0.3)
          .to(".anim-line-draw", { scaleX: 1, ease: "power2.out", duration: 0.5, stagger: 0.04 }, 0.4)
          .to(".anim-concern", { opacity: 1, y: 0, ease: "power3.out", duration: 0.5, stagger: 0.05 }, 0.5);

        if (cursorRef.current) gsap.set(cursorRef.current, { opacity: 0 });
      });
    }, sectionRef);

    return () => ctx.revert();
  }, []);

  /* ------------------------------------------------------------------ */
  /*  Cursor preview handlers                                           */
  /* ------------------------------------------------------------------ */

  const showCursorFor = useCallback((concern: Concern) => {
    if (!cursorRef.current) return;
    if (concern.img) {
      setCurrentImg(concern.img);
      setCurrentCaption(concern.caption || concern.name);
    }
    gsap.to(cursorRef.current, {
      opacity: 1,
      scale: 1,
      rotate: -2,
      duration: 0.45,
      ease: "power3.out",
      overwrite: "auto",
    });
  }, []);

  const hideCursor = useCallback(() => {
    if (!cursorRef.current) return;
    gsap.to(cursorRef.current, {
      opacity: 0,
      scale: 0.92,
      duration: 0.3,
      ease: "power3.in",
      overwrite: "auto",
    });
  }, []);

  const handleItemEnter = useCallback(
    (i: number) => {
      const concern = CONCERNS[i];
      if (!concern || !concern.img) {
        hideCursor();
        setHoveredIndex(null);
        return;
      }
      setHoveredIndex(i);
      showCursorFor(concern);
    },
    [hideCursor, showCursorFor]
  );

  const handleListLeave = useCallback(() => {
    setHoveredIndex(null);
    hideCursor();
  }, [hideCursor]);

  const handleMobileToggle = useCallback((i: number) => {
    setExpandedMobile((curr) => (curr === i ? null : i));
  }, []);

  const handleConcernKeyDown = (e: React.KeyboardEvent, i: number) => {
    if (e.key === "Enter" || e.key === " ") {
      e.preventDefault();
      handleMobileToggle(i);
    }
  };

  /* ------------------------------------------------------------------ */
  /*  RENDER                                                            */
  /* ------------------------------------------------------------------ */

  return (
    <section
      ref={sectionRef}
      className="relative w-full overflow-hidden bg-[#0B0B0D] font-lux-sans antialiased"
    >
      {/* Ambient halo */}
      <div className="pointer-events-none absolute inset-0 opacity-60">
        <div className="absolute left-1/2 top-1/2 h-[700px] w-[700px] -translate-x-1/2 -translate-y-1/2 rounded-full bg-[radial-gradient(circle,_rgba(198,160,107,0.08)_0%,_transparent_70%)] blur-3xl" />
      </div>

      {/* Kinetic background typography */}
      <div className="pointer-events-none absolute left-0 top-1/2 w-full -translate-y-1/2 overflow-hidden whitespace-nowrap opacity-[0.04]">
        <span className="font-lux-serif pr-8 text-[18vw] leading-none text-[#F5F3EE]">
          SAMPAN GROUP
        </span>
      </div>

      {/* Floating cursor preview — landscape, desktop only */}
      <div
        ref={cursorRef}
        aria-hidden="true"
        className="pointer-events-none fixed left-0 top-0 z-50 hidden h-[280px] w-[440px] opacity-0 will-change-transform md:block"
      >
        <div className="relative h-full w-full overflow-hidden border border-[#C6A06B]/30 shadow-[0_30px_80px_-20px_rgba(0,0,0,0.85)]">
          {currentImg && (
            <img
              src={currentImg}
              alt={currentCaption}
              className="h-full w-full object-cover"
              draggable={false}
            />
          )}
          <div className="absolute inset-0 bg-gradient-to-t from-[#0B0B0D] via-[#0B0B0D]/10 to-transparent" />
          <div className="absolute bottom-0 left-0 right-0 flex items-end justify-between gap-4 p-5">
            <div className="flex flex-col">
              <div className="mb-2 h-px w-8 bg-[#C6A06B]" />
              <span className="block font-lux-serif text-base italic text-[#F5F3EE]">
                {currentCaption}
              </span>
            </div>
            <span className="font-lux-serif text-2xl font-light italic text-[#C6A06B]/60">·</span>
          </div>
          <div className="absolute left-0 top-0 h-6 w-6 border-l border-t border-[#C6A06B]/60" />
          <div className="absolute bottom-0 right-0 h-6 w-6 border-b border-r border-[#C6A06B]/60" />
        </div>
      </div>

      {/* Main composition */}
      <div className="relative z-10 mx-auto flex min-h-screen max-w-[1440px] flex-col justify-center px-5 py-24 sm:px-6 md:px-12 md:py-32 lg:px-24">
        <div className="grid w-full grid-cols-1 items-start gap-16 md:grid-cols-12 md:gap-12 lg:gap-20">
          {/* LEFT: Sticky narrative */}
          <div className="md:col-span-5 md:sticky md:top-32 md:self-start">
            <div className="anim-eyebrow mb-8 flex items-center gap-4">
              <span className="block h-[1.5px] w-12 bg-[#C6A06B]" />
              <span className="text-[10px] font-medium uppercase tracking-[0.4em] text-[#C6A06B] md:text-[11px]">
                Mother Company
              </span>
            </div>

            <h2 className="mb-10 font-lux-serif text-[clamp(2.8rem,7vw,6rem)] leading-[0.92] tracking-[-0.03em] text-[#F8F7F3]">
              <span className="block overflow-hidden pb-2">
                <span className="anim-headline block font-light">Part of</span>
              </span>
              <span className="block overflow-hidden pb-2">
                <span className="anim-headline block font-normal italic text-[#C6A06B]">
                  Sampan Group
                </span>
              </span>
            </h2>

            <div className="anim-fade max-w-md">
              <p className="mb-10 text-sm font-light leading-relaxed text-[#E9E0D2]/75 sm:text-base md:text-lg">
                Sampan Development Ltd sits inside Sampan Group, whose concerns
                include Express Highway Inn, Sampan Highway Inn, Sampan Agro
                &amp; Golf Resort, LSHS (professional education), Sampan Eco
                &amp; Agro, Sampan Mart and more.
              </p>
            </div>

            <div className="anim-fade">
              <a
                href="https://sampangroup.com.bd"
                target="_blank"
                rel="noopener noreferrer"
                className="group relative inline-flex items-center gap-3 overflow-hidden bg-[#C6A06B] px-8 py-4 text-[10px] font-semibold uppercase tracking-[0.3em] text-[#0B0B0D] transition-colors duration-500 hover:text-[#C6A06B] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#C6A06B] focus-visible:ring-offset-2 focus-visible:ring-offset-[#0B0B0D]"
              >
                <span className="absolute inset-0 z-0 translate-y-full bg-[#F5F3EE] transition-transform duration-500 ease-[cubic-bezier(0.22,1,0.36,1)] group-hover:translate-y-0 group-focus-visible:translate-y-0" />
                <span className="relative z-10 flex items-center gap-3">
                  Visit Sampan Group
                  <svg
                    className="h-4 w-4 transition-transform duration-300 group-hover:translate-x-1"
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
              </a>
            </div>

            {/* Hint */}
            <div className="anim-fade mt-12 hidden items-center gap-3 text-[10px] uppercase tracking-[0.3em] text-[#F5F3EE]/30 md:flex">
              <svg
                className="h-3 w-3 text-[#C6A06B]"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
                aria-hidden="true"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth="1.5"
                  d="M15 15l-2 5L9 9l11 4-5 2zm0 0l5 5M7.188 2.239l.777 2.897M5.136 7.965l-2.898-.777M13.95 4.05l-2.122 2.122m-5.657 5.656l-2.12 2.122"
                />
              </svg>
              Hover the concerns to preview
            </div>
          </div>

          {/* RIGHT: Concerns directory */}
          <div className="md:col-span-7">
            <div className="anim-fade mb-10 flex items-end justify-between border-b border-[#F5F3EE]/10 pb-6">
              <div className="flex items-baseline gap-4">
                <span className="font-lux-serif text-4xl font-light italic text-[#C6A06B] md:text-5xl">
                  06
                </span>
                <span className="text-[10px] uppercase tracking-[0.3em] text-[#F5F3EE]/40">
                  Concerns &amp; Counting
                </span>
              </div>
              <span className="hidden text-[10px] uppercase tracking-[0.3em] text-[#F5F3EE]/30 sm:block">
                Sister Concerns
              </span>
            </div>

            <ul
              ref={listRef}
              onMouseLeave={handleListLeave}
              className="flex flex-col"
            >
              {CONCERNS.map((concern, i) => {
                const isActive = hoveredIndex === i;
                const isDimmed = hoveredIndex !== null && hoveredIndex !== i;
                const hasImage = Boolean(concern.img);
                const isMobileExpanded = expandedMobile === i;
                const indexLabel = (i + 1).toString().padStart(2, "0");

                return (
                  <li
                    key={concern.name}
                    className="anim-concern group"
                    onMouseEnter={() => handleItemEnter(i)}
                    onFocus={() => hasImage && handleItemEnter(i)}
                    onBlur={handleListLeave}
                  >
                    <button
                      type="button"
                      onClick={() => handleMobileToggle(i)}
                      onKeyDown={(e) => handleConcernKeyDown(e, i)}
                      aria-expanded={hasImage ? isMobileExpanded : undefined}
                      aria-label={`${concern.name} — ${concern.tag}. ${concern.location}. ${hasImage ? "Tap to preview image." : ""}`}
                      className="relative flex w-full items-center gap-4 border-b border-[#F5F3EE]/10 py-6 text-left outline-none transition-all duration-500 hover:gap-5 focus-visible:ring-2 focus-visible:ring-[#C6A06B] focus-visible:ring-inset md:gap-6"
                    >
                      {/* Sliding gold rule */}
                      <span
                        aria-hidden="true"
                        className="absolute left-0 top-1/2 h-px w-0 bg-[#C6A06B] transition-all duration-500 ease-[cubic-bezier(0.22,1,0.36,1)] group-hover:w-12 group-focus-visible:w-12"
                      />

                      {/* Index */}
                      <span
                        className={`relative z-10 w-10 flex-shrink-0 font-lux-serif text-2xl font-light italic transition-all duration-500 md:w-auto md:text-3xl ${
                          isActive
                            ? "translate-x-12 text-[#C6A06B]"
                            : isDimmed
                            ? "text-[#F5F3EE]/20"
                            : "text-[#F5F3EE]/40"
                        }`}
                      >
                        {indexLabel}
                      </span>

                      {/* Name & meta */}
                      <div
                        className={`relative z-10 flex flex-1 flex-col gap-1.5 transition-all duration-500 ${
                          isActive ? "translate-x-12" : ""
                        }`}
                      >
                        <span
                          className={`font-lux-serif text-2xl font-light leading-tight transition-colors duration-500 md:text-3xl lg:text-4xl ${
                            isActive
                              ? "text-[#C6A06B]"
                              : isDimmed
                              ? "text-[#F5F3EE]/30"
                              : "text-[#F5F3EE] group-hover:text-[#C6A06B] group-focus-visible:text-[#C6A06B]"
                          }`}
                        >
                          {concern.name}
                        </span>
                        <span className="flex flex-wrap items-center gap-x-3 gap-y-1 text-[10px] uppercase tracking-[0.25em] text-[#F5F3EE]/40">
                          <span className="h-px w-6 bg-[#F5F3EE]/20" aria-hidden="true" />
                          <span>{concern.tag}</span>
                          <span aria-hidden="true" className="text-[#F5F3EE]/20">·</span>
                          <span>{concern.location}</span>
                        </span>
                      </div>

                      {/* Mobile thumbnail */}
                      {hasImage && (
                        <div
                          className="relative z-10 h-16 w-12 flex-shrink-0 overflow-hidden border border-[#F5F3EE]/15 transition-all duration-500 group-hover:border-[#C6A06B] group-focus-visible:border-[#C6A06B] md:hidden"
                          aria-hidden="true"
                        >
                          <img
                            src={concern.img}
                            alt=""
                            className="h-full w-full object-fill"
                            loading="lazy"
                          />
                        </div>
                      )}

                      {/* Desktop arrow indicator */}
                      <svg
                        aria-hidden="true"
                        className={`relative z-10 hidden h-5 w-5 flex-shrink-0 transition-all duration-500 md:block ${
                          isActive
                            ? "translate-x-0 text-[#C6A06B] opacity-100"
                            : "-translate-x-2 text-[#F5F3EE] opacity-0"
                        }`}
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth="1.5"
                          d="M14 5l7 7m0 0l-7 7m7-7H3"
                        />
                      </svg>

                      {/* No-image label */}
                      {!hasImage && (
                        <span className="relative z-10 hidden text-[10px] uppercase tracking-[0.2em] text-[#F5F3EE]/30 md:block">
                          Group Asset
                        </span>
                      )}
                    </button>

                    {/* Mobile expanded image */}
                    {hasImage && isMobileExpanded && (
                      <div className="md:hidden">
                        <div className="relative h-64 w-full overflow-hidden border border-t-0 border-[#F5F3EE]/10">
                          <img
                            src={concern.img}
                            alt={concern.name}
                            className="h-full w-full object-contain"
                            loading="lazy"
                          />
                          <div className="absolute inset-0 bg-gradient-to-t from-[#0B0B0D] via-transparent to-transparent" />
                          <div className="absolute bottom-0 left-0 right-0 p-5">
                            <div className="mb-2 h-px w-8 bg-[#C6A06B]" />
                            <span className="block font-lux-serif text-sm italic text-[#F5F3EE]">
                              {concern.caption}
                            </span>
                          </div>
                        </div>
                      </div>
                    )}
                  </li>
                );
              })}

              {/* "+ more" — dismisses the floating cursor */}
              <li
                className="anim-concern group flex items-center gap-5 py-6 md:gap-6"
                onMouseEnter={handleListLeave}
              >
                <span className="font-lux-serif text-2xl font-light italic text-[#C6A06B]/50 md:text-3xl">+</span>
                <span className="font-lux-serif text-2xl font-light italic text-[#C6A06B]/80 transition-colors duration-300 group-hover:text-[#C6A06B] md:text-3xl lg:text-4xl">
                  more concerns in the network
                </span>
              </li>
            </ul>
          </div>
        </div>

        {/* Bottom section index marker */}
        <div className="mt-20 flex items-center justify-between text-[10px] uppercase tracking-[0.3em] text-[#F5F3EE]/40">
          <span>Mother Company</span>
          <span className="hidden sm:inline">Sampan Development Ltd.</span>
        </div>
      </div>

      {/* Typography — uses project fonts if already loaded globally */}
      <style jsx>{`
        .font-lux-serif {
          font-family: var(--font-lux-serif), "Cormorant Garamond", "Times New Roman", serif;
        }
        .font-lux-sans {
          font-family: var(--font-lux-sans), "Inter", system-ui, -apple-system, sans-serif;
        }
      `}</style>
    </section>
  );
}