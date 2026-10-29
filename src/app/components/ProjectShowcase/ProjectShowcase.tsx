// app/components/ProjectShowcase.tsx
"use client";

import Link from "next/link";
import { useLayoutEffect, useRef, useState } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

// --- CONFIGURATION ---
const PROJECT_ASSETS = {
  metro: "/images/projects/metro-square/sampanmetrosquare.jpeg",
  golf: "/images/projects/agroandgolf/agroandgolf.png",
  express: "/expresshighway/expresshighwayinn.png",
  emporium: "/images/roni/Sampan_Trade_Emporium_Rooftop_Tower.png",
  condo: "/images/projects/condominium/condomenium.png",
};

const WHATSAPP_URL = "https://wa.me/8801000000000";

export default function ProjectShowcase() {
  const sectionRef = useRef<HTMLElement>(null);
  const mobileProgressRef = useRef<HTMLDivElement>(null);
  const desktopProgressRef = useRef<HTMLDivElement>(null);
  const [activeProject, setActiveProject] = useState(0);
  const [isInSection, setIsInSection] = useState(false);
  const [scrollProgress, setScrollProgress] = useState(0);
  const activeProjectRef = useRef(0);

  useLayoutEffect(() => {
    gsap.registerPlugin(ScrollTrigger);

    const ctx = gsap.context(() => {
      const mm = gsap.matchMedia();

      const updateActive = (index: number) => {
        if (activeProjectRef.current !== index) {
          activeProjectRef.current = index;
          setActiveProject(index);
        }
      };

      /* ---------------- Section visibility + scroll progress tracker ---------------- */
      ScrollTrigger.create({
        trigger: sectionRef.current,
        start: "top 50%",
        end: "bottom 50%",
        onEnter: () => setIsInSection(true),
        onLeave: () => setIsInSection(false),
        onEnterBack: () => setIsInSection(true),
        onLeaveBack: () => setIsInSection(false),
      });

      ScrollTrigger.create({
        trigger: sectionRef.current,
        start: "top top",
        end: "bottom bottom",
        onUpdate: (self) => setScrollProgress(self.progress),
      });

      /* ---------------- Reduced motion fallback ---------------- */
      mm.add("(prefers-reduced-motion: reduce)", () => {
        gsap.set(
          ".anim-headline, .anim-fade, .anim-line-draw, .anim-img-reveal, .anim-img-scale, .kinetic-text, .parallax-pan",
          { clearProps: "all" }
        );
      });

      /* ---------------- Shared chapter factory ---------------- */
      const createChapter = (
        id: string,
        index: number,
        isReversed: boolean,
        isMobile: boolean
      ) => {
        const chapter = document.querySelector(id);
        if (!chapter) return;

        gsap.set(`${id} .anim-headline`, { yPercent: 110 });
        gsap.set(`${id} .anim-fade`, { opacity: 0, y: isMobile ? 24 : 40 });
        gsap.set(`${id} .anim-line-draw`, { scaleX: 0, transformOrigin: "left" });
        gsap.set(`${id} .anim-img-reveal`, {
          clipPath: isReversed ? "inset(0% 100% 0% 0%)" : "inset(100% 0% 0% 0%)",
        });
        gsap.set(`${id} .anim-img-scale`, { scale: 1.5 });
        // FIX: Set scale buffer via GSAP so it's NOT overridden by yPercent animation
        // (Tailwind's scale-110 class gets overridden when GSAP sets yPercent on the same element)
        gsap.set(`${id} .parallax-pan`, { scale: 1.2 });
        gsap.set(`${id} .kinetic-text`, { xPercent: 10, opacity: 0 });

        const tl = gsap.timeline({
          scrollTrigger: {
            trigger: chapter,
            start: "top top",
            end: "+=200%",
            scrub: isMobile ? 1.2 : 1.5,
            pin: true,
            pinSpacing: true,
            anticipatePin: isMobile ? 1 : 0,
            invalidateOnRefresh: true,
            onEnter: () => updateActive(index),
            onEnterBack: () => updateActive(index),
          }
        });

        // FIX: Reduced yPercent from -30 to -8 to prevent black gaps
        // With scale: 1.2, the element is 120% of container size (10% buffer each side)
        // Moving up 8% still leaves 2% coverage at the bottom — no gap
        tl.to(`${id} .anim-img-reveal`, { clipPath: "inset(0% 0% 0% 0%)", ease: "power3.inOut", duration: 0.3 }, 0)
          .to(`${id} .anim-img-scale`, { scale: 1.05, ease: "none", duration: 1.5 }, 0)
          .to(`${id} .parallax-pan`, { yPercent: -8, ease: "none", duration: 1.5 }, 0);

        tl.to(`${id} .kinetic-text`, { xPercent: -50, opacity: 0.4, ease: "none", duration: 1 }, 0.2)
          .to(`${id} .anim-headline`, { yPercent: 0, ease: "power4.out", duration: 0.6, stagger: 0.1 }, 0.3)
          .to(`${id} .anim-fade`, { opacity: 1, y: 0, ease: "power3.out", duration: 0.6, stagger: 0.08 }, 0.5);

        tl.to(`${id} .anim-line-draw`, { scaleX: 1, ease: "power2.out", duration: 0.5, stagger: 0.05 }, 0.6);

        // Animate corner brackets drawing in on chapter enter
        gsap.fromTo(`${id} .chapter-corner`,
          { scaleX: 0, scaleY: 0, transformOrigin: "center" },
          {
            scaleX: 1, scaleY: 1, duration: 0.8, ease: "power3.out",
            stagger: 0.1,
            scrollTrigger: {
              trigger: chapter,
              start: "top 70%",
              once: true,
            }
          }
        );

        // Animate chapter badge sliding in
        gsap.fromTo(`${id} .chapter-badge`,
          { opacity: 0, x: -20 },
          {
            opacity: 1, x: 0, duration: 0.6, ease: "power3.out",
            scrollTrigger: {
              trigger: chapter,
              start: "top 60%",
              once: true,
            }
          }
        );

        // Animate accent line drawing in
        gsap.fromTo(`${id} .accent-line`,
          { scaleX: 0, transformOrigin: "left" },
          {
            scaleX: 1, duration: 1, ease: "power3.out",
            scrollTrigger: {
              trigger: chapter,
              start: "top 65%",
              once: true,
            }
          }
        );
      };

      /* ---------------- Desktop cinematic experience ---------------- */
      mm.add("(min-width: 768px) and (prefers-reduced-motion: no-preference)", () => {
        const mouse = { x: 0, y: 0 };

        // FIX: Use quickTo for live mouse tracking that doesn't conflict with scroll yPercent
        // Store quickTo functions on each .parallax-pan element
        const mouseMoveHandler = (e: MouseEvent) => {
          mouse.x = (e.clientX / window.innerWidth - 0.5) * 20;
          mouse.y = (e.clientY / window.innerHeight - 0.5) * 20;
          // Call quickTo on all parallax-pan elements for live mouse parallax
          document.querySelectorAll(".parallax-pan").forEach((el) => {
            const pan = el as HTMLElement & { _xTo?: (v: number) => void; _yTo?: (v: number) => void };
            if (pan._xTo) pan._xTo(mouse.x);
            if (pan._yTo) pan._yTo(mouse.y);
          });
        };
        window.addEventListener("mousemove", mouseMoveHandler);

        const setupChapter = (id: string, index: number, isReversed: boolean) => {
          createChapter(id, index, isReversed, false);

          // FIX: Create quickTo functions for smooth, live mouse-follow parallax
          // These use x/y (pixels) which are SEPARATE from yPercent (percentage)
          // So they don't conflict with the scroll-driven yPercent: -8
          const xTo = gsap.quickTo(`${id} .parallax-pan`, "x", { duration: 1.2, ease: "power2.out" });
          const yTo = gsap.quickTo(`${id} .parallax-pan`, "y", { duration: 1.2, ease: "power2.out" });

          // Store on the DOM element so mouseMoveHandler can call them
          const panEl = document.querySelector(`${id} .parallax-pan`) as HTMLElement & { _xTo?: (v: number) => void; _yTo?: (v: number) => void };
          if (panEl) {
            panEl._xTo = xTo;
            panEl._yTo = yTo;
          }
        };

        setupChapter("#chapter-1", 0, false);
        setupChapter("#chapter-2", 1, false);
        setupChapter("#chapter-3", 2, false);
        setupChapter("#chapter-4", 3, false);
        setupChapter("#chapter-5", 4, true);

        return () => {
          window.removeEventListener("mousemove", mouseMoveHandler);
        };
      });

      /* ---------------- Mobile cinematic experience ---------------- */
      mm.add("(max-width: 767px) and (prefers-reduced-motion: no-preference)", () => {
        createChapter("#chapter-1", 0, false, true);
        createChapter("#chapter-2", 1, false, true);
        createChapter("#chapter-3", 2, false, true);
        createChapter("#chapter-4", 3, false, true);
        createChapter("#chapter-5", 4, true, true);

        gsap.fromTo(mobileProgressRef.current,
          { opacity: 0 },
          {
            opacity: 1, ease: "none",
            scrollTrigger: {
              trigger: sectionRef.current,
              start: "top top",
              end: "top 30%",
              scrub: 1,
            }
          }
        );

        gsap.fromTo(".mobile-progress-fill",
          { scaleX: 0, transformOrigin: "left" },
          {
            scaleX: 1, ease: "none",
            scrollTrigger: {
              trigger: sectionRef.current,
              start: "top top",
              end: "bottom bottom",
              scrub: true
            }
          }
        );
      });

      // Refresh after fonts load
      if (typeof document !== "undefined" && document.fonts) {
        document.fonts.ready.then(() => ScrollTrigger.refresh());
      }
    }, sectionRef);

    return () => ctx.revert();
  }, []);

  const projects = [
    { id: 0, name: "Metro Square" },
    { id: 1, name: "Agro & Golf Academy" },
    { id: 2, name: "Trade Emporium" },
    { id: 3, name: "Express Highway Inn" },
    { id: 4, name: "Condominium" }
  ];

  const isDarkChapter = activeProject !== 4;

  return (
    <section
      ref={sectionRef}
      id="projects-journey"
      className="relative w-full bg-[#0B0B0D] font-lux-sans antialiased overflow-x-hidden"
    >
      {/* ═══ DESKTOP TOP PROGRESS BAR ═══ */}
      {/* <div
        ref={desktopProgressRef}
        className={`fixed top-0 left-0 right-0 z-50 hidden md:block pointer-events-none transition-opacity duration-500 ${
          isInSection ? "opacity-100" : "opacity-0"
        }`}
      >
        <div className="flex items-center justify-between px-12 py-4 backdrop-blur-md bg-[#0B0B0D]/40 border-b border-[#F5F3EE]/[0.06]">
          <div className="flex items-center gap-4">
            <span className="font-lux-serif text-lg italic font-light text-[#19ABE1] leading-none">
              {activeProject + 1 < 10 ? `0${activeProject + 1}` : activeProject + 1}
            </span>
            <span className="h-3 w-px bg-[#F5F3EE]/20" />
            <span className="text-[9px] uppercase tracking-[0.4em] text-[#F5F3EE]/70">
              {projects[activeProject].name}
            </span>
          </div>
          <div className="flex items-center gap-3">
            <span className="text-[9px] uppercase tracking-[0.4em] text-[#F5F3EE]/40">
              Chapter {activeProject + 1} of 05
            </span>
            <span className="h-3 w-px bg-[#F5F3EE]/20" />
            <span className="text-[9px] uppercase tracking-[0.3em] text-[#19ABE1] tabular-nums">
              {Math.round(scrollProgress * 100)}%
            </span>
          </div>
        </div>
        <div className="h-[1.5px] w-full bg-[#F5F3EE]/[0.08]">
          <div
            className="h-full bg-gradient-to-r from-[#19ABE1] via-[#19ABE1] to-[#0B0B0D] origin-left transition-transform duration-100"
            style={{ transform: `scaleX(${scrollProgress})` }}
          />
        </div>
      </div> */}

      {/* --- MOBILE PROGRESS UI (top bar) --- */}
      <div
        ref={mobileProgressRef}
        className="md:hidden fixed top-0 left-0 right-0 z-50 pointer-events-none opacity-0"
      >
        <div className="flex items-center justify-between px-5 py-3 backdrop-blur-sm bg-[#0B0B0D]/60 border-b border-[#F5F3EE]/10">
          <div className="flex items-baseline gap-2">
            <span className="text-base font-lux-serif text-[#19ABE1]">{activeProject + 1 < 10 ? `0${activeProject + 1}` : activeProject + 1}</span>
            <span className="text-[9px] uppercase tracking-[0.3em] text-[#F5F3EE]/80">{projects[activeProject].name}</span>
          </div>
          <span className="text-[9px] uppercase tracking-[0.3em] text-[#F5F3EE]/30">/ 05</span>
        </div>
        <div className="h-[2px] w-full bg-[#F5F3EE]/15">
          <div className="mobile-progress-fill h-full w-full bg-[#19ABE1] origin-left scale-x-0"></div>
        </div>
      </div>

      {/* ═══ FIXED DESKTOP PROGRESS RAIL (right side) ═══ */}
      <div
        className={`fixed right-6 top-1/2 -translate-y-1/2 z-40 hidden md:flex flex-col items-end gap-5 pointer-events-none transition-all duration-700 ${
          isInSection ? "opacity-100 translate-x-0" : "opacity-0 translate-x-4"
        } ${isDarkChapter ? "text-[#F5F3EE]" : "text-[#0B0B0D]"}`}
        aria-hidden="true"
      >
        <div className="flex flex-col items-end gap-1">
          <span className="font-lux-serif text-5xl italic font-light text-[#19ABE1] leading-none">
            {activeProject + 1 < 10 ? `0${activeProject + 1}` : activeProject + 1}
          </span>
          <span className="text-[10px] uppercase tracking-[0.4em] opacity-70 max-w-[120px] text-right">
            {projects[activeProject].name}
          </span>
          <span className="text-[10px] uppercase tracking-[0.4em] opacity-40">of 05</span>
        </div>
        <div className="flex flex-col gap-1.5">
          {[0, 1, 2, 3, 4].map((n) => (
            <div
              key={n}
              className={`w-px transition-all duration-500 ${
                activeProject === n ? "bg-[#19ABE1] h-16" : "bg-current opacity-20 h-10"
              }`}
            />
          ))}
        </div>
      </div>

      {/* ==========================================
          CHAPTER 01: SAMPAN METRO SQUARE (Dark)
          ========================================== */}
      <section id="chapter-1" className="chapter-section relative z-10 w-full h-[100svh] bg-[#0B0B0D] overflow-hidden">

        <div className="absolute top-1/2 left-0 w-full -translate-y-1/2 z-0 overflow-hidden whitespace-nowrap pointer-events-none flex">
          <span className="kinetic-text font-lux-serif text-[20vw] text-[#F5F3EE]/[0.03] leading-none pr-8">METRO SQUARE</span>
          <span className="kinetic-text font-lux-serif text-[20vw] text-[#F5F3EE]/[0.03] leading-none pr-8">METRO SQUARE</span>
        </div>

        <div className="pointer-events-none absolute inset-0 z-[1] opacity-[0.015] mix-blend-overlay" style={{ backgroundImage: "url(\"data:image/svg+xml,%3Csvg viewBox='0 0 200 200' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='3' /%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23n)' /%3E%3C/svg%3E\")" }} aria-hidden="true" />

        <span className="chapter-corner pointer-events-none absolute left-6 top-6 z-30 h-8 w-8 border-l border-t border-[#19ABE1]/50" />
        <span className="chapter-corner pointer-events-none absolute right-6 top-6 z-30 h-8 w-8 border-r border-t border-[#19ABE1]/50" />
        <span className="chapter-corner pointer-events-none absolute bottom-6 left-6 z-30 h-8 w-8 border-b border-l border-[#19ABE1]/50" />
        <span className="chapter-corner pointer-events-none absolute bottom-6 right-6 z-30 h-8 w-8 border-b border-r border-[#19ABE1]/50" />

        <div className="chapter-badge absolute left-6 top-20 z-30 flex items-center gap-3 opacity-0">
          <span className="font-mono text-[9px] uppercase tracking-[0.4em] text-[#F5F3EE]/40">Chapter</span>
          <span className="font-lux-serif text-sm italic text-[#19ABE1]">01 / 05</span>
        </div>

        <div className="relative h-full w-full flex flex-col md:flex-row items-center">
          <div className="relative md:absolute md:right-0 top-0 w-full md:w-[60%] h-[34vh] md:h-full z-10">
            <div className="anim-img-reveal absolute inset-0">
              <div className="parallax-pan absolute inset-0 will-change-transform">
                <img
                  src={PROJECT_ASSETS.metro}
                  alt="Sampan Metro Square Architectural Concept"
                  className="anim-img-scale w-full h-full object-cover will-change-transform"
                />
              </div>
              <div className="absolute inset-0 bg-gradient-to-r from-[#0B0B0D] via-[#0B0B0D]/80 to-transparent"></div>
              <div className="absolute inset-0 bg-gradient-to-t from-[#0B0B0D] via-transparent to-transparent md:hidden"></div>
            </div>
          </div>

          <div className="relative z-20 w-full max-w-[1400px] mx-auto px-5 sm:px-6 md:px-12 lg:px-24 flex-1 md:flex-none flex items-center">
            <div className="max-w-xl text-[#F5F3EE] py-6">
              <div className="anim-fade flex items-center gap-3 sm:gap-4 mb-5 md:mb-8">
                <span className="accent-line h-[1.5px] w-10 sm:w-12 bg-[#19ABE1]"></span>
                <span className="text-[9px] sm:text-[10px] md:text-[11px] font-medium uppercase tracking-[0.35em] sm:tracking-[0.4em] text-[#19ABE1]">
                  01 / Residential
                </span>
              </div>

              <h1 className="font-lux-serif text-[clamp(2.2rem,9vw,5.5rem)] md:text-[clamp(2.5rem,6vw,5.5rem)] leading-[0.95] tracking-[-0.02em] mb-5 md:mb-8">
                <span className="block overflow-hidden pb-1 sm:pb-2">
                  <span className="anim-headline block font-light">Sampan Metro</span>
                </span>
                <span className="block overflow-hidden pb-1 sm:pb-2">
                  <span className="anim-headline block italic text-[#19ABE1]">Square</span>
                </span>
              </h1>

              <div className="anim-fade overflow-hidden mb-5 md:mb-8">
                <h2 className="text-[10px] sm:text-xs md:text-sm font-lux-sans font-light uppercase tracking-[0.18em] sm:tracking-[0.2em] text-[#F5F3EE] border-l border-[#F5F3EE]/20 pl-3 sm:pl-4">
                  Ashulia · B+G+12 Residential
                </h2>
              </div>

              <p className="anim-fade text-xs sm:text-sm md:text-base text-[#F5F3EE]/90 font-light leading-relaxed max-w-md mb-6 md:mb-10">
                A land-share project on 12 katha in Ashulia for buyers who want a defined stake in land without buying a whole plot. Each buyer receives an undivided share, recorded in their name.
              </p>

              <div className="grid grid-cols-2 gap-x-4 sm:gap-x-8 gap-y-3 sm:gap-y-4 mb-6 md:mb-12 max-w-md">
                {["Land Share", "Open to NRBs", "~1300 Sq Ft Flat", "Site visits on request"].map((point, i) => (
                  <div key={i} className="flex items-center gap-2 sm:gap-3">
                    <span className="anim-line-draw block h-px w-5 sm:w-6 bg-[#19ABE1] flex-shrink-0"></span>
                    <span className="anim-fade text-[9px] sm:text-[10px] md:text-xs font-medium text-[#F5F3EE] uppercase tracking-[0.08em] sm:tracking-[0.1em]">
                      {point}
                    </span>
                  </div>
                ))}
              </div>

              <div className="flex flex-col sm:flex-row items-start gap-3 sm:gap-4">
                <Link href="/projects/ongoing/sampan-metro-square" className="anim-fade group relative overflow-hidden bg-[#19ABE1] text-[#0B0B0D] text-[9px] sm:text-[10px] font-semibold uppercase tracking-[0.25em] sm:tracking-[0.3em] px-6 sm:px-8 py-3 sm:py-4 transition-colors duration-500 hover:text-[#19ABE1] flex items-center gap-3">
                  <span className="absolute inset-0 bg-[#F5F3EE] translate-y-full group-hover:translate-y-0 transition-transform duration-500 ease-[cubic-bezier(0.22,1,0.36,1)] z-0"></span>
                  <span className="relative z-10 flex items-center gap-3">See Metro Square <svg className="w-3 h-3 sm:w-4 sm:h-4 transition-transform duration-300 group-hover:translate-x-1" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" d="M14 5l7 7m0 0l-7 7m7-7H3"></path></svg></span>
                </Link>
                <a href={WHATSAPP_URL} target="_blank" rel="noopener noreferrer" className="anim-fade group relative overflow-hidden border border-[#F5F3EE]/30 text-[#F5F3EE] text-[9px] sm:text-[10px] font-semibold uppercase tracking-[0.25em] sm:tracking-[0.3em] px-6 sm:px-8 py-3 sm:py-4 transition-colors duration-500 hover:border-[#25D366] hover:text-[#0B0B0D] flex items-center gap-3 backdrop-blur-sm">
                  <span className="absolute inset-0 bg-[#25D366] translate-y-full group-hover:translate-y-0 transition-transform duration-500 ease-[cubic-bezier(0.22,1,0.36,1)] z-0"></span>
                  <span className="relative z-10 flex items-center gap-3">WhatsApp</span>
                </a>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ═══ CHAPTER 02: SAMPAN AGRO & GOLF ACADEMY ═══ */}
      <section id="chapter-2" className="chapter-section relative z-10 w-full h-[100svh] bg-[#0B0B0D] overflow-hidden">

        <div className="absolute inset-0 z-0">
          <div className="anim-img-reveal absolute inset-0">
            <div className="parallax-pan absolute inset-0 will-change-transform">
              <img
                src={PROJECT_ASSETS.golf}
                alt="Sampan Agro & Golf Academy — lifestyle destination"
                className="anim-img-scale w-full h-full object-cover will-change-transform"
              />
            </div>
            <div className="absolute inset-0 bg-gradient-to-r from-[#0B0B0D] via-[#0B0B0D]/85 to-[#0B0B0D]/20"></div>
            <div className="absolute inset-0 bg-gradient-to-t from-[#0B0B0D] via-transparent to-[#0B0B0D]/40"></div>
            <div className="absolute inset-x-0 top-0 h-24 bg-gradient-to-b from-[#0B0B0D]/80 to-transparent md:hidden"></div>
          </div>
        </div>

        <div className="pointer-events-none absolute inset-0 z-[1] opacity-[0.015] mix-blend-overlay" style={{ backgroundImage: "url(\"data:image/svg+xml,%3Csvg viewBox='0 0 200 200' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='3' /%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23n)' /%3E%3C/svg%3E\")" }} aria-hidden="true" />

        <span className="chapter-corner pointer-events-none absolute left-6 top-6 z-30 h-8 w-8 border-l border-t border-[#19ABE1]/50" />
        <span className="chapter-corner pointer-events-none absolute right-6 top-6 z-30 h-8 w-8 border-r border-t border-[#19ABE1]/50" />
        <span className="chapter-corner pointer-events-none absolute bottom-6 left-6 z-30 h-8 w-8 border-b border-l border-[#19ABE1]/50" />
        <span className="chapter-corner pointer-events-none absolute bottom-6 right-6 z-30 h-8 w-8 border-b border-r border-[#19ABE1]/50" />

        <div className="chapter-badge absolute left-6 top-20 z-30 flex items-center gap-3 opacity-0">
          <span className="font-mono text-[9px] uppercase tracking-[0.4em] text-[#F5F3EE]/40">Chapter</span>
          <span className="font-lux-serif text-sm italic text-[#19ABE1]">02 / 05</span>
        </div>

        <div className="absolute top-1/2 left-0 w-full -translate-y-1/2 z-[2] overflow-hidden whitespace-nowrap pointer-events-none flex">
          <span className="kinetic-text font-lux-serif text-[20vw] text-[#F5F3EE]/[0.03] leading-none pr-8">AGRO &amp; GOLF</span>
          <span className="kinetic-text font-lux-serif text-[20vw] text-[#F5F3EE]/[0.03] leading-none pr-8">AGRO &amp; GOLF</span>
        </div>

        <div className="relative z-20 h-full flex items-center">
          <div className="mx-auto w-full max-w-[1400px] px-5 sm:px-6 md:px-12 lg:px-24">
            <div className="max-w-xl text-[#F5F3EE] py-6">
              <div className="anim-fade flex items-center gap-3 sm:gap-4 mb-5 md:mb-8">
                <span className="accent-line h-[1.5px] w-10 sm:w-12 bg-[#19ABE1]"></span>
                <span className="text-[9px] sm:text-[10px] md:text-[11px] font-medium uppercase tracking-[0.35em] sm:tracking-[0.4em] text-[#19ABE1]">
                  02 / Lifestyle
                </span>
              </div>

              <h1 className="font-lux-serif text-[clamp(2.2rem,9vw,5.5rem)] md:text-[clamp(2.5rem,6vw,5.5rem)] leading-[0.95] tracking-[-0.02em] mb-5 md:mb-8">
                <span className="block overflow-hidden pb-1 sm:pb-2">
                  <span className="anim-headline block font-light">Sampan Agro &amp;</span>
                </span>
                <span className="block overflow-hidden pb-1 sm:pb-2">
                  <span className="anim-headline block italic text-[#19ABE1]">Golf Academy</span>
                </span>
              </h1>

              <div className="anim-fade overflow-hidden mb-5 md:mb-8">
                <h2 className="font-lux-serif text-base sm:text-lg md:text-xl italic font-light text-[#19ABE1] mb-3">
                  Where leisure meets the land.
                </h2>
                <h3 className="text-[10px] sm:text-xs md:text-sm font-lux-sans font-light uppercase tracking-[0.18em] sm:tracking-[0.2em] text-[#F5F3EE] border-l border-[#F5F3EE]/20 pl-3 sm:pl-4">
                  Dhaka–Sylhet Highway · 100 Acres
                </h3>
              </div>

              <p className="anim-fade text-xs sm:text-sm md:text-base text-[#F5F3EE]/90 font-light leading-relaxed max-w-md mb-6 md:mb-10 border-l-2 border-[#19ABE1]/40 pl-4 sm:pl-5">
                A 100-acre integrated lifestyle destination where a championship golf course, eco-resort stays, and working agricultural land converge into a single living landscape.
              </p>

              <div className="grid grid-cols-2 gap-x-4 sm:gap-x-8 gap-y-3 sm:gap-y-4 mb-6 md:mb-12 max-w-md">
                {["100 Acres", "Championship Golf Course", "Eco-Resort Stays", "Working Agro Farm"].map((point, i) => (
                  <div key={i} className="flex items-center gap-2 sm:gap-3">
                    <span className="anim-line-draw block h-px w-5 sm:w-6 bg-[#19ABE1] flex-shrink-0"></span>
                    <span className="anim-fade text-[9px] sm:text-[10px] md:text-xs font-medium text-[#F5F3EE] uppercase tracking-[0.08em] sm:tracking-[0.1em]">
                      {point}
                    </span>
                  </div>
                ))}
              </div>

              <div className="flex flex-col sm:flex-row items-start gap-3 sm:gap-4">
                <Link href="/projects/ongoing/sampan-agro-golf-resort" className="anim-fade group relative overflow-hidden bg-[#19ABE1] text-[#0B0B0D] text-[9px] sm:text-[10px] font-semibold uppercase tracking-[0.25em] sm:tracking-[0.3em] px-6 sm:px-8 py-3 sm:py-4 transition-colors duration-500 hover:text-[#19ABE1] flex items-center gap-3">
                  <span className="absolute inset-0 bg-[#F5F3EE] translate-y-full group-hover:translate-y-0 transition-transform duration-500 ease-[cubic-bezier(0.22,1,0.36,1)] z-0"></span>
                  <span className="relative z-10 flex items-center gap-3">
                    See Agro &amp; Golf
                    <svg className="w-3 h-3 sm:w-4 sm:h-4 transition-transform duration-300 group-hover:translate-x-1" fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden="true">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" d="M14 5l7 7m0 0l-7 7m7-7H3"></path>
                    </svg>
                  </span>
                </Link>
                <a href={WHATSAPP_URL} target="_blank" rel="noopener noreferrer" className="anim-fade group relative overflow-hidden border border-[#F5F3EE]/30 text-[#F5F3EE] text-[9px] sm:text-[10px] font-semibold uppercase tracking-[0.25em] sm:tracking-[0.3em] px-6 sm:px-8 py-3 sm:py-4 transition-colors duration-500 hover:border-[#25D366] hover:text-[#0B0B0D] flex items-center gap-3 backdrop-blur-sm">
                  <span className="absolute inset-0 bg-[#25D366] translate-y-full group-hover:translate-y-0 transition-transform duration-500 ease-[cubic-bezier(0.22,1,0.36,1)] z-0"></span>
                  <span className="relative z-10 flex items-center gap-3">WhatsApp</span>
                </a>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ═══ CHAPTER 03: SAMPAN TRADE EMPORIUM ═══ */}
      <section id="chapter-3" className="chapter-section relative z-10 w-full h-[100svh] bg-[#0b0b0d46] overflow-hidden">

        <div className="absolute top-1/2 left-0 w-full -translate-y-1/2 z-0 overflow-hidden whitespace-nowrap pointer-events-none flex">
          <span className="kinetic-text font-lux-serif text-[20vw] text-[#F5F3EE]/[0.03] leading-none pr-8">TRADE EMPORIUM</span>
          <span className="kinetic-text font-lux-serif text-[20vw] text-[#F5F3EE]/[0.03] leading-none pr-8">TRADE EMPORIUM</span>
        </div>

        <div className="pointer-events-none absolute inset-0 z-[1] opacity-[0.015] mix-blend-overlay" style={{ backgroundImage: "url(\"data:image/svg+xml,%3Csvg viewBox='0 0 200 200' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='3' /%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23n)' /%3E%3C/svg%3E\")" }} aria-hidden="true" />

        <span className="chapter-corner pointer-events-none absolute left-6 top-6 z-30 h-8 w-8 border-l border-t border-[#19ABE1]/50" />
        <span className="chapter-corner pointer-events-none absolute right-6 top-6 z-30 h-8 w-8 border-r border-t border-[#19ABE1]/50" />
        <span className="chapter-corner pointer-events-none absolute bottom-6 left-6 z-30 h-8 w-8 border-b border-l border-[#19ABE1]/50" />
        <span className="chapter-corner pointer-events-none absolute bottom-6 right-6 z-30 h-8 w-8 border-b border-r border-[#19ABE1]/50" />

        <div className="chapter-badge absolute left-6 top-20 z-30 flex items-center gap-3 opacity-0">
          <span className="font-mono text-[9px] uppercase tracking-[0.4em] text-[#F5F3EE]/40">Chapter</span>
          <span className="font-lux-serif text-sm italic text-[#19ABE1]">03 / 05</span>
        </div>

        <div className="relative h-full w-full flex flex-col lg:flex-row items-center">
          <div className="absolute inset-0 z-10">
            <div className="anim-img-reveal absolute inset-0">
              <div className="parallax-pan absolute inset-0 will-change-transform">
                <img
                  src={PROJECT_ASSETS.emporium}
                  alt="Sampan Trade Emporium Mixed Use Architecture"
                  className="anim-img-scale w-full h-full object-cover will-change-transform"
                />
              </div>
              <div className="absolute inset-0 bg-[#0B0B0D]/80"></div>
              <div className="absolute inset-0 bg-gradient-to-r from-[#0B0B0D] via-[#0B0B0D]/80 to-transparent"></div>
              <div className="absolute inset-0 bg-gradient-to-t from-[#0B0B0D] via-[#0B0B0D]/40 to-transparent md:hidden"></div>
            </div>
          </div>

          <div className="relative z-20 w-full max-w-[1400px] mx-auto px-5 sm:px-6 md:px-12 lg:px-24 flex flex-col lg:flex-row gap-6 lg:gap-12 items-center py-6">
            <div className="w-full lg:w-1/2 text-[#F5F3EE]">
              <div className="anim-fade flex items-center gap-3 sm:gap-4 mb-5 md:mb-8">
                <span className="accent-line h-[1.5px] w-10 sm:w-12 bg-[#19ABE1]"></span>
                <span className="text-[9px] sm:text-[10px] md:text-[11px] font-medium uppercase tracking-[0.35em] sm:tracking-[0.4em] text-[#19ABE1]">
                  03 / Mixed-Use
                </span>
              </div>

              <h1 className="font-lux-serif text-[clamp(2.2rem,9vw,5.5rem)] md:text-[clamp(2.5rem,6vw,5.5rem)] leading-[0.95] tracking-[-0.02em] mb-5 md:mb-8">
                <span className="block overflow-hidden pb-1 sm:pb-2">
                  <span className="anim-headline block font-light">Sampan Trade</span>
                </span>
                <span className="block overflow-hidden pb-1 sm:pb-2">
                  <span className="anim-headline block italic text-[#19ABE1]">Emporium</span>
                </span>
              </h1>

              <div className="anim-fade overflow-hidden mb-5 md:mb-8">
                <h2 className="text-[10px] sm:text-xs md:text-sm font-lux-sans font-light uppercase tracking-[0.18em] sm:tracking-[0.2em] text-[#F5F3EE] border-l border-[#F5F3EE]/20 pl-3 sm:pl-4">
                  B+LG+G+11 · 20 Katha
                </h2>
              </div>

              <p className="anim-fade text-xs sm:text-sm md:text-base text-[#F5F3EE]/90 font-light leading-relaxed max-w-md mb-6 md:mb-10">
                A B+LG+G+11 building on 20 katha beside Express Highway Inn. Showrooms and a food court sit at the bottom, banks and offices in the middle, a hospital and diagnostics floors above.
              </p>

              <div className="flex flex-col sm:flex-row items-start gap-3 sm:gap-4">
                <Link href="/projects/ongoing/sampan-trade-emporium" className="anim-fade group relative overflow-hidden bg-[#19ABE1] text-[#0B0B0D] text-[9px] sm:text-[10px] font-semibold uppercase tracking-[0.25em] sm:tracking-[0.3em] px-6 sm:px-8 py-3 sm:py-4 transition-colors duration-500 hover:text-[#19ABE1] flex items-center gap-3">
                  <span className="absolute inset-0 bg-[#F5F3EE] translate-y-full group-hover:translate-y-0 transition-transform duration-500 ease-[cubic-bezier(0.22,1,0.36,1)] z-0"></span>
                  <span className="relative z-10 flex items-center gap-3">See Trade Emporium <svg className="w-3 h-3 sm:w-4 sm:h-4 transition-transform duration-300 group-hover:translate-x-1" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" d="M14 5l7 7m0 0l-7 7m7-7H3"></path></svg></span>
                </Link>
                <a href={WHATSAPP_URL} target="_blank" rel="noopener noreferrer" className="anim-fade group relative overflow-hidden border border-[#F5F3EE]/30 text-[#F5F3EE] text-[9px] sm:text-[10px] font-semibold uppercase tracking-[0.25em] sm:tracking-[0.3em] px-6 sm:px-8 py-3 sm:py-4 transition-colors duration-500 hover:border-[#25D366] hover:text-[#0B0B0D] flex items-center gap-3 backdrop-blur-sm">
                  <span className="absolute inset-0 bg-[#25D366] translate-y-full group-hover:translate-y-0 transition-transform duration-500 ease-[cubic-bezier(0.22,1,0.36,1)] z-0"></span>
                  <span className="relative z-10 flex items-center gap-3">WhatsApp</span>
                </a>
              </div>
            </div>

            <div className="w-full lg:w-1/2 lg:pl-12">
              <div className="hidden lg:flex flex-col gap-1 border-l border-[#F5F3EE]/10 pl-8">
                {[
                  { level: "L7—L11", title: "Healthcare", detail: "Hospital & doctor chambers" },
                  { level: "L5—L6", title: "Corporate", detail: "Corporate offices" },
                  { level: "L4", title: "Leisure", detail: "Foodcourt, Cinema, Gym & Spa" },
                  { level: "G—L3", title: "Showrooms", detail: "Retail spaces" },
                  { level: "L-B2", title: "Parking", detail: "Parking spaces over two levels" },
                ].map((f, i) => (
                  <div key={i} className="flex items-center gap-6 py-4 border-b border-[#F5F3EE]/10 group">
                    <span className="anim-line-draw block h-px w-12 bg-[#19ABE1] flex-shrink-0"></span>
                    <div className="flex flex-col flex-1">
                      <div className="flex items-baseline gap-3">
                        <span className="anim-fade text-[10px] font-medium uppercase tracking-[0.3em] text-[#19ABE1]">{f.level}</span>
                        <span className="anim-fade text-lg font-lux-serif text-[#F5F3EE]">{f.title}</span>
                      </div>
                      <span className="anim-fade text-xs text-[#F5F3EE]/60 font-light mt-1">{f.detail}</span>
                    </div>
                  </div>
                ))}
              </div>

              <div className="lg:hidden grid grid-cols-1 gap-2 sm:gap-3">
                {[
                  { level: "L7—L11", title: "Healthcare" },
                  { level: "L5—L6", title: "Corporate" },
                  { level: "L4", title: "Leisure" },
                  { level: "G—L3", title: "Showrooms" },
                  { level: "L-B2", title: "Parking" },
                ].map((f, i) => (
                  <div key={i} className="flex items-center gap-3 sm:gap-4 border-b border-[#F5F3EE]/10 pb-2 sm:pb-3">
                    <span className="anim-line-draw block h-px w-6 sm:w-8 bg-[#19ABE1] flex-shrink-0"></span>
                    <span className="anim-fade text-[9px] sm:text-[10px] font-medium uppercase tracking-[0.25em] text-[#19ABE1] w-14 sm:w-16">{f.level}</span>
                    <span className="anim-fade text-xs sm:text-sm font-lux-serif text-[#F5F3EE] font-light">{f.title}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ═══ CHAPTER 04: EXPRESS HIGHWAY INN ═══ */}
      <section id="chapter-4" className="chapter-section relative z-10 w-full h-[100svh] bg-[#0B0B0D] overflow-hidden">

        <div className="absolute top-1/2 left-0 w-full -translate-y-1/2 z-0 overflow-hidden whitespace-nowrap pointer-events-none flex">
          <span className="kinetic-text font-lux-serif text-[20vw] text-[#F5F3EE]/[0.03] leading-none pr-8">EXPRESS INN</span>
          <span className="kinetic-text font-lux-serif text-[20vw] text-[#F5F3EE]/[0.03] leading-none pr-8">EXPRESS INN</span>
        </div>

        <div className="pointer-events-none absolute inset-0 z-[1] opacity-[0.015] mix-blend-overlay" style={{ backgroundImage: "url(\"data:image/svg+xml,%3Csvg viewBox='0 0 200 200' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='3' /%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23n)' /%3E%3C/svg%3E\")" }} aria-hidden="true" />

        <span className="chapter-corner pointer-events-none absolute left-6 top-6 z-30 h-8 w-8 border-l border-t border-[#19ABE1]/50" />
        <span className="chapter-corner pointer-events-none absolute right-6 top-6 z-30 h-8 w-8 border-r border-t border-[#19ABE1]/50" />
        <span className="chapter-corner pointer-events-none absolute bottom-6 left-6 z-30 h-8 w-8 border-b border-l border-[#19ABE1]/50" />
        <span className="chapter-corner pointer-events-none absolute bottom-6 right-6 z-30 h-8 w-8 border-b border-r border-[#19ABE1]/50" />

        <div className="chapter-badge absolute left-6 top-20 z-30 flex items-center gap-3 opacity-0">
          <span className="font-mono text-[9px] uppercase tracking-[0.4em] text-[#F5F3EE]/40">Chapter</span>
          <span className="font-lux-serif text-sm italic text-[#19ABE1]">04 / 05</span>
        </div>

        <div className="relative h-full w-full flex flex-col md:flex-row items-center">
          <div className="relative md:absolute md:right-0 top-0 w-full md:w-[58%] h-[34vh] md:h-full z-10">
            <div className="anim-img-reveal absolute inset-0">
              <div className="parallax-pan absolute inset-0 will-change-transform">
                <img
                  src={PROJECT_ASSETS.express}
                  alt="Express Highway Inn — Hospitality landmark on Dhaka–Chittagong Highway"
                  className="anim-img-scale w-full h-full object-cover will-change-transform"
                />
              </div>
              <div className="absolute inset-0 bg-gradient-to-r from-[#0B0B0D] via-[#0B0B0D]/80 to-transparent"></div>
              <div className="absolute inset-0 bg-gradient-to-t from-[#0B0B0D] via-transparent to-transparent md:hidden"></div>
            </div>
          </div>

          <div className="relative z-20 w-full max-w-[1400px] mx-auto px-5 sm:px-6 md:px-12 lg:px-24 flex-1 md:flex-none flex items-center">
            <div className="max-w-xl text-[#F5F3EE] py-6">
              <div className="anim-fade flex items-center gap-3 sm:gap-4 mb-5 md:mb-8">
                <span className="accent-line h-[1.5px] w-10 sm:w-12 bg-[#19ABE1]"></span>
                <span className="text-[9px] sm:text-[10px] md:text-[11px] font-medium uppercase tracking-[0.35em] sm:tracking-[0.4em] text-[#19ABE1]">
                  04 / Hospitality
                </span>
              </div>

              <h1 className="font-lux-serif text-[clamp(2.2rem,9vw,5.5rem)] md:text-[clamp(2.5rem,6vw,5.5rem)] leading-[0.95] tracking-[-0.02em] mb-5 md:mb-8">
                <span className="block overflow-hidden pb-1 sm:pb-2">
                  <span className="anim-headline block font-light">Express Highway</span>
                </span>
                <span className="block overflow-hidden pb-1 sm:pb-2">
                  <span className="anim-headline block italic text-[#19ABE1]">Inn.</span>
                </span>
              </h1>

              <div className="anim-fade overflow-hidden mb-5 md:mb-8">
                <h2 className="font-lux-serif text-base sm:text-lg md:text-xl italic font-light text-[#19ABE1] mb-3">
                  Stop. Unwind. Connect.
                </h2>
                <h3 className="text-[10px] sm:text-xs md:text-sm font-lux-sans font-light uppercase tracking-[0.18em] sm:tracking-[0.2em] text-[#F5F3EE] border-l border-[#F5F3EE]/20 pl-3 sm:pl-4">
                  Dhaka–Chittagong Highway · 60 Katha
                </h3>
              </div>

              <p className="anim-fade text-xs sm:text-sm md:text-base text-[#F5F3EE]/90 font-light leading-relaxed max-w-md mb-6 md:mb-10 border-l-2 border-[#19ABE1]/40 pl-4 sm:pl-5">
                A hospitality destination on the Dhaka–Chittagong Highway. Stop for a meal, unwind in the lounge, and let your car be washed while you relax — all in one landmark address.
              </p>

              <div className="grid grid-cols-2 gap-x-4 sm:gap-x-8 gap-y-3 sm:gap-y-4 mb-6 md:mb-12 max-w-md border-t border-[#F5F3EE]/10 pt-4 sm:pt-6">
                {["60 Katha", "2-Storey Condominium", "Club & Lounge Membership", "VVIP Lounge", "24/7 Restaurant", "Sampan Mart", "Automatic Car Wash"].map((point, i) => (
                  <div key={i} className="flex items-center gap-2 sm:gap-3">
                    <span className="anim-line-draw block h-px w-5 sm:w-6 bg-[#19ABE1] flex-shrink-0"></span>
                    <span className="anim-fade text-[9px] sm:text-[10px] md:text-xs font-medium text-[#F5F3EE] uppercase tracking-[0.08em] sm:tracking-[0.1em]">
                      {point}
                    </span>
                  </div>
                ))}
              </div>

              <div className="flex flex-col sm:flex-row items-start gap-3 sm:gap-4">
                <Link href="/projects/ongoing/express-highway-inn" className="anim-fade group relative overflow-hidden bg-[#19ABE1] text-[#0B0B0D] text-[9px] sm:text-[10px] font-semibold uppercase tracking-[0.25em] sm:tracking-[0.3em] px-6 sm:px-8 py-3 sm:py-4 transition-colors duration-500 hover:text-[#19ABE1] flex items-center gap-3">
                  <span className="absolute inset-0 bg-[#F5F3EE] translate-y-full group-hover:translate-y-0 transition-transform duration-500 ease-[cubic-bezier(0.22,1,0.36,1)] z-0"></span>
                  <span className="relative z-10 flex items-center gap-3">
                    See Express Inn
                    <svg className="w-3 h-3 sm:w-4 sm:h-4 transition-transform duration-300 group-hover:translate-x-1" fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden="true">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" d="M14 5l7 7m0 0l-7 7m7-7H3"></path>
                    </svg>
                  </span>
                </Link>
                <a href={WHATSAPP_URL} target="_blank" rel="noopener noreferrer" className="anim-fade group relative overflow-hidden border border-[#F5F3EE]/30 text-[#F5F3EE] text-[9px] sm:text-[10px] font-semibold uppercase tracking-[0.25em] sm:tracking-[0.3em] px-6 sm:px-8 py-3 sm:py-4 transition-colors duration-500 hover:border-[#25D366] hover:text-[#0B0B0D] flex items-center gap-3 backdrop-blur-sm">
                  <span className="absolute inset-0 bg-[#25D366] translate-y-full group-hover:translate-y-0 transition-transform duration-500 ease-[cubic-bezier(0.22,1,0.36,1)] z-0"></span>
                  <span className="relative z-10 flex items-center gap-3">WhatsApp</span>
                </a>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ═══ CHAPTER 05: SAMPAN CONDOMINIUM (Light) ═══ */}
      <section id="chapter-5" className="chapter-section relative z-10 w-full h-[100svh] bg-[#F5F3EE] overflow-hidden">

        <div className="absolute top-1/2 left-0 w-full -translate-y-1/2 z-0 overflow-hidden whitespace-nowrap pointer-events-none flex">
          <span className="kinetic-text font-lux-serif text-[20vw] text-[#0B0B0D]/[0.03] leading-none pr-8">CONDOMINIUM</span>
          <span className="kinetic-text font-lux-serif text-[20vw] text-[#0B0B0D]/[0.03] leading-none pr-8">CONDOMINIUM</span>
        </div>

        <div className="pointer-events-none absolute inset-0 z-[1] opacity-[0.02] mix-blend-multiply" style={{ backgroundImage: "url(\"data:image/svg+xml,%3Csvg viewBox='0 0 200 200' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='3' /%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23n)' /%3E%3C/svg%3E\")" }} aria-hidden="true" />

        <span className="chapter-corner pointer-events-none absolute left-6 top-6 z-30 h-8 w-8 border-l border-t border-[#19ABE1]/50" />
        <span className="chapter-corner pointer-events-none absolute right-6 top-6 z-30 h-8 w-8 border-r border-t border-[#19ABE1]/50" />
        <span className="chapter-corner pointer-events-none absolute bottom-6 left-6 z-30 h-8 w-8 border-b border-l border-[#19ABE1]/50" />
        <span className="chapter-corner pointer-events-none absolute bottom-6 right-6 z-30 h-8 w-8 border-b border-r border-[#19ABE1]/50" />

        <div className="chapter-badge absolute left-6 top-20 z-30 flex items-center gap-3 opacity-0">
          <span className="font-mono text-[9px] uppercase tracking-[0.4em] text-[#0B0B0D]/40">Chapter</span>
          <span className="font-lux-serif text-sm italic text-[#19ABE1]">05 / 05</span>
        </div>

        <div className="relative h-full w-full flex flex-col md:flex-row items-center">
          <div className="relative md:absolute md:left-0 top-0 w-full md:w-[50%] h-[34vh] md:h-full z-10">
            <div className="anim-img-reveal absolute inset-0">
              <div className="parallax-pan absolute inset-0 will-change-transform">
                <img
                  src={PROJECT_ASSETS.condo}
                  alt="Sampan Condominium G+9 Architectural Concept"
                  className="anim-img-scale w-full h-full object-cover will-change-transform"
                />
              </div>
              <div className="absolute inset-0 bg-gradient-to-r from-transparent to-[#F5F3EE]/80"></div>
              <div className="absolute inset-0 bg-gradient-to-t from-[#F5F3EE] via-transparent to-transparent md:hidden"></div>
            </div>
          </div>

          <div className="relative z-20 w-full max-w-[1400px] mx-auto px-5 sm:px-6 md:px-12 lg:px-24 flex md:justify-end flex-1 md:flex-none items-center">
            <div className="max-w-xl text-[#0B0B0D] md:pl-12 py-6">
              <div className="anim-fade flex items-center gap-3 sm:gap-4 mb-5 md:mb-8">
                <span className="accent-line h-[1.5px] w-10 sm:w-12 bg-[#19ABE1]"></span>
                <span className="text-[9px] sm:text-[10px] md:text-[11px] font-medium uppercase tracking-[0.35em] sm:tracking-[0.4em] text-[#19ABE1]">
                  05 / Serviced Living
                </span>
              </div>

              <h1 className="font-lux-serif text-[clamp(2.2rem,9vw,5.5rem)] md:text-[clamp(2.5rem,6vw,5.5rem)] leading-[0.95] tracking-[-0.02em] mb-5 md:mb-8">
                <span className="block overflow-hidden pb-1 sm:pb-2">
                  <span className="anim-headline block font-light">Sampan</span>
                </span>
                <span className="block overflow-hidden pb-1 sm:pb-2">
                  <span className="anim-headline block italic text-[#19ABE1]">Condominium</span>
                </span>
              </h1>

              <div className="anim-fade overflow-hidden mb-5 md:mb-8">
                <h2 className="text-[10px] sm:text-xs md:text-sm font-lux-sans font-light uppercase tracking-[0.18em] sm:tracking-[0.2em] text-[#0B0B0D] border-l border-[#0B0B0D]/30 pl-3 sm:pl-4">
                  A G+9 Building on the Highway
                </h2>
              </div>

              <p className="anim-fade text-xs sm:text-sm md:text-base text-[#0B0B0D]/90 font-light leading-relaxed max-w-md mb-6 md:mb-10">
                Serviced apartments on 20 katha, right beside Express Highway Inn. Units are managed for rental income, and owners get access to Express Highway Inn and Sampan Trade Emporium next door.
              </p>

              <div className="flex flex-col gap-3 sm:gap-4 mb-6 md:mb-12 max-w-md border-t border-[#0B0B0D]/10 pt-4 sm:pt-6">
                {["Nine service apartment floors", "Rooftop drone land station, pool and gym", "Ground-floor car parking"].map((point, i) => (
                  <div key={i} className="flex items-center gap-3 sm:gap-4">
                    <span className="anim-line-draw block h-px w-6 sm:w-8 bg-[#19ABE1] flex-shrink-0"></span>
                    <span className="anim-fade text-[10px] sm:text-xs font-medium text-[#0B0B0D] uppercase tracking-[0.08em] sm:tracking-[0.1em]">
                      {point}
                    </span>
                  </div>
                ))}
              </div>

              <div className="flex flex-col sm:flex-row items-start gap-3 sm:gap-4">
                <Link href="/projects/ongoing/sampan-condominium" className="anim-fade group relative overflow-hidden bg-[#0B0B0D] text-[#F5F3EE] text-[9px] sm:text-[10px] font-semibold uppercase tracking-[0.25em] sm:tracking-[0.3em] px-6 sm:px-8 py-3 sm:py-4 transition-colors duration-500 hover:text-[#0B0B0D] flex items-center gap-3">
                  <span className="absolute inset-0 bg-[#19ABE1] translate-y-full group-hover:translate-y-0 transition-transform duration-500 ease-[cubic-bezier(0.22,1,0.36,1)] z-0"></span>
                  <span className="relative z-10 flex items-center gap-3">See Condominium <svg className="w-3 h-3 sm:w-4 sm:h-4 transition-transform duration-300 group-hover:translate-x-1" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" d="M14 5l7 7m0 0l-7 7m7-7H3"></path></svg></span>
                </Link>
                <a href={WHATSAPP_URL} target="_blank" rel="noopener noreferrer" className="anim-fade group relative overflow-hidden border border-[#0B0B0D]/20 text-[#0B0B0D] text-[9px] sm:text-[10px] font-semibold uppercase tracking-[0.25em] sm:tracking-[0.3em] px-6 sm:px-8 py-3 sm:py-4 transition-colors duration-500 hover:border-[#25D366] hover:text-[#F5F3EE] flex items-center gap-3">
                  <span className="absolute inset-0 bg-[#0B0B0D] translate-y-full group-hover:translate-y-0 transition-transform duration-500 ease-[cubic-bezier(0.22,1,0.36,1)] z-0"></span>
                  <span className="relative z-10 flex items-center gap-3">WhatsApp</span>
                </a>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* --- Global Styles --- */}
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
