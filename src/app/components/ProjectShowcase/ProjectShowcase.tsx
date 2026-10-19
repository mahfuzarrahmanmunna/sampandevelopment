// app/components/ProjectShowcase.tsx
"use client";

import Link from "next/link";
import { useLayoutEffect, useRef, useState } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

// --- CONFIGURATION ---
const PROJECT_ASSETS = {
  metro: "/images/projects/metro-square/hero.webp",
  condo: "/images/projects/condominium/hero.jpg",
  emporium: "/images/roni/Sampan_Trade_Emporium_Rooftop_Tower.png"
};

const WHATSAPP_URL = "https://wa.me/8801000000000"; // Replace with actual business number

export default function ProjectShowcase() {
  const sectionRef = useRef<HTMLElement>(null);
  const uiRef = useRef<HTMLDivElement>(null);
  const [activeProject, setActiveProject] = useState(0);
  const activeProjectRef = useRef(0);

  useLayoutEffect(() => {
    gsap.registerPlugin(ScrollTrigger);
    
    const ctx = gsap.context(() => {
      const mm = gsap.matchMedia();
      
      // --- DESKTOP CINEMATIC EXPERIENCE ---
      mm.add("(min-width: 768px) and (prefers-reduced-motion: no-preference)", () => {
        
        const updateActive = (index: number) => {
          if (activeProjectRef.current !== index) {
            activeProjectRef.current = index;
            setActiveProject(index);
          }
        };

        // --- SECTION-SPECIFIC UI VISIBILITY ---
        // Fades in the right UI only when this section is active
        gsap.fromTo(uiRef.current, 
          { opacity: 0, x: 40 },
          { 
            opacity: 1, 
            x: 0, 
            ease: "none",
            scrollTrigger: {
              trigger: sectionRef.current,
              start: "top 80%",
              end: "top 30%",
              scrub: 1,
            }
          }
        );

        // --- MOUSE PARALLAX SETUP ---
        const mouse = { x: 0, y: 0 };
        const onMouseMove = (e: MouseEvent) => {
          mouse.x = (e.clientX / window.innerWidth - 0.5) * 20;
          mouse.y = (e.clientY / window.innerHeight - 0.5) * 20;
        };
        window.addEventListener("mousemove", onMouseMove);

        const createChapter = (id: string, index: number, isReversed: boolean) => {
          const chapter = document.querySelector(id);
          if (!chapter) return;

          // Set initial states
          gsap.set(`${id} .anim-headline`, { yPercent: 110 });
          gsap.set(`${id} .anim-fade`, { opacity: 0, y: 40 });
          gsap.set(`${id} .anim-line-draw`, { scaleX: 0, transformOrigin: "left" });
          gsap.set(`${id} .anim-img-reveal`, { clipPath: isReversed ? "inset(0% 100% 0% 0%)" : "inset(100% 0% 0% 0%)" });
          gsap.set(`${id} .anim-img-scale`, { scale: 1.5 });
          gsap.set(`${id} .kinetic-text`, { xPercent: 10, opacity: 0 });

          // Master Timeline
          const tl = gsap.timeline({
            scrollTrigger: {
              trigger: chapter,
              start: "top top",
              end: "+=200%",
              scrub: 1.5,
              pin: true,
              pinSpacing: true,
              invalidateOnRefresh: true,
              onEnter: () => updateActive(index),
              onEnterBack: () => updateActive(index),
            }
          });

          // Phase 1: Architectural Camera Reveal
          tl.to(`${id} .anim-img-reveal`, { clipPath: "inset(0% 0% 0% 0%)", ease: "power3.inOut", duration: 0.3 }, 0)
            .to(`${id} .anim-img-scale`, { scale: 1.05, ease: "none", duration: 1.5 }, 0)
            .to(`${id} .parallax-pan`, { yPercent: -20, ease: "none", duration: 1.5 }, 0);
          
          // Phase 2: Kinetic Typography & Headlines
          tl.to(`${id} .kinetic-text`, { xPercent: -50, opacity: 0.4, ease: "none", duration: 1 }, 0.2)
            .to(`${id} .anim-headline`, { yPercent: 0, ease: "power4.out", duration: 0.6, stagger: 0.1 }, 0.3)
            .to(`${id} .anim-fade`, { opacity: 1, y: 0, ease: "power3.out", duration: 0.6, stagger: 0.08 }, 0.5);
          
          // Phase 3: Directory Line Draw
          tl.to(`${id} .anim-line-draw`, { scaleX: 1, ease: "power2.out", duration: 0.5, stagger: 0.05 }, 0.6);

          // Continuous Mouse Parallax for 3D depth
          gsap.to(`${id} .parallax-pan`, {
            x: mouse.x,
            y: mouse.y,
            duration: 1.5,
            ease: "power2.out",
            repeat: -1,
            yoyo: true,
          });
        };

        createChapter("#chapter-1", 0, false);
        createChapter("#chapter-2", 1, true);
        createChapter("#chapter-3", 2, false);

        // Overall Progress Indicator
        gsap.to(".progress-bar-fill", {
          scaleY: 1,
          ease: "none",
          scrollTrigger: {
            trigger: sectionRef.current,
            start: "top top",
            end: "bottom bottom",
            scrub: true
          }
        });

        return () => {
          window.removeEventListener("mousemove", onMouseMove);
        };
      });

    }, sectionRef);

    return () => {
      ctx.revert();
    };
  }, []);

  const projects = [
    { id: 0, name: "Metro Square" },
    { id: 1, name: "Condominium" },
    { id: 2, name: "Trade Emporium" }
  ];

  return (
    <section 
      ref={sectionRef} 
      id="projects-journey"
      className="relative w-full bg-[#0B0B0D] font-lux-sans antialiased overflow-x-hidden"
    >
      {/* --- SECTION-SPECIFIC PROGRESS UI (Desktop Only) --- */}
      <div ref={uiRef} className="hidden md:flex fixed right-8 top-1/2 -translate-y-1/2 z-50 flex-col items-end gap-6 pointer-events-none opacity-0">
        <div className="flex flex-col items-end gap-2">
          <span className="text-2xl font-lux-serif text-[#C5A059]">
            0{activeProject + 1}
          </span>
          <span className="text-[10px] uppercase tracking-[0.4em] text-[#F5F3EE]/80 transition-all duration-300">
            {projects[activeProject].name}
          </span>
          <span className="text-[10px] uppercase tracking-[0.4em] text-[#F5F3EE]/30">
            / 03
          </span>
        </div>
        <div className="w-px h-40 bg-[#F5F3EE]/20 relative overflow-hidden">
          <div className="progress-bar-fill absolute top-0 left-0 h-full w-full bg-[#C5A059] origin-top scale-y-0"></div>
        </div>
      </div>

      {/* ==========================================
          CHAPTER 01: SAMPAN METRO SQUARE (Obsidian)
          ========================================== */}
      <section id="chapter-1" className="chapter-section relative z-10 w-full h-screen bg-[#0B0B0D] overflow-hidden">
        
        {/* Kinetic Background Typography */}
        <div className="absolute top-1/2 left-0 w-full -translate-y-1/2 z-0 overflow-hidden whitespace-nowrap pointer-events-none flex">
          <span className="kinetic-text font-lux-serif text-[20vw] text-[#F5F3EE]/[0.03] leading-none pr-8">METRO SQUARE</span>
          <span className="kinetic-text font-lux-serif text-[20vw] text-[#F5F3EE]/[0.03] leading-none pr-8">METRO SQUARE</span>
        </div>

        <div className="relative h-full w-full flex flex-col md:flex-row items-center">
          {/* Image Layer */}
          <div className="relative md:absolute md:right-0 top-0 w-full md:w-[60%] h-[40vh] md:h-full z-10">
            <div className="anim-img-reveal absolute inset-0">
              <div className="parallax-pan absolute inset-0 scale-110 will-change-transform">
                <img 
                  src={PROJECT_ASSETS.metro} 
                  alt="Sampan Metro Square Architectural Concept" 
                  className="anim-img-scale w-full h-full object-cover will-change-transform"
                />
              </div>
              <div className="absolute inset-0 bg-gradient-to-r from-[#0B0B0D] via-[#0B0B0D]/80 to-transparent"></div>
            </div>
          </div>

          {/* Content Layer */}
          <div className="relative z-20 w-full max-w-[1400px] mx-auto px-6 md:px-12 lg:px-24 py-12 md:py-0">
            <div className="max-w-xl text-[#F5F3EE]">
              <div className="anim-fade flex items-center gap-4 mb-8">
                <span className="h-[1.5px] w-12 bg-[#C5A059]"></span>
                <span className="text-[10px] md:text-[11px] font-medium uppercase tracking-[0.4em] text-[#C5A059]">
                  01 / Residential Development
                </span>
              </div>

              <h1 className="font-lux-serif text-[clamp(2.5rem,6vw,5.5rem)] leading-[0.95] tracking-[-0.02em] mb-8">
                <span className="block overflow-hidden pb-2">
                  <span className="anim-headline block font-light">Sampan Metro</span>
                </span>
                <span className="block overflow-hidden pb-2">
                  <span className="anim-headline block italic text-[#C5A059]">Square</span>
                </span>
              </h1>

              <div className="anim-fade overflow-hidden mb-8">
                <h2 className="text-xs md:text-sm font-lux-sans font-light uppercase tracking-[0.2em] text-[#F5F3EE] border-l border-[#F5F3EE]/20 pl-4">
                  Ashulia · B+G+12 Residential Building
                </h2>
              </div>

              <p className="anim-fade text-sm md:text-base text-[#F5F3EE]/90 font-light leading-relaxed max-w-md mb-10">
                A land-share project on 12 katha in Ashulia for buyers who want a defined stake in land without buying a whole plot. Each buyer receives an undivided share, recorded in their name and backed by project documents.
              </p>

              <div className="grid grid-cols-2 gap-x-8 gap-y-4 mb-12 max-w-md">
                {["Land Share", "Open to NRBs", "~1300 Sq Ft Apartment", "Site visits on request"].map((point, i) => (
                  <div key={i} className="flex items-center gap-3">
                    <span className="anim-line-draw block h-px w-6 bg-[#C5A059] flex-shrink-0"></span>
                    <span className="anim-fade text-[10px] md:text-xs font-medium text-[#F5F3EE] uppercase tracking-[0.1em]">
                      {point}
                    </span>
                  </div>
                ))}
              </div>

              <div className="flex flex-col sm:flex-row items-start gap-4">
                <Link href="/projects/ongoing/sampan-metro-square" className="anim-fade group relative overflow-hidden bg-[#C5A059] text-[#0B0B0D] text-[10px] font-semibold uppercase tracking-[0.3em] px-8 py-4 transition-colors duration-500 hover:text-[#C5A059] flex items-center gap-3">
                  <span className="absolute inset-0 bg-[#F5F3EE] translate-y-full group-hover:translate-y-0 transition-transform duration-500 ease-[cubic-bezier(0.22,1,0.36,1)] z-0"></span>
                  <span className="relative z-10 flex items-center gap-3">See Metro Square <svg className="w-4 h-4 transition-transform duration-300 group-hover:translate-x-1" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" d="M14 5l7 7m0 0l-7 7m7-7H3"></path></svg></span>
                </Link>
                <a href={WHATSAPP_URL} target="_blank" rel="noopener noreferrer" className="anim-fade group relative overflow-hidden border border-[#F5F3EE]/30 text-[#F5F3EE] text-[10px] font-semibold uppercase tracking-[0.3em] px-8 py-4 transition-colors duration-500 hover:border-[#25D366] hover:text-[#0B0B0D] flex items-center gap-3 backdrop-blur-sm">
                  <span className="absolute inset-0 bg-[#25D366] translate-y-full group-hover:translate-y-0 transition-transform duration-500 ease-[cubic-bezier(0.22,1,0.36,1)] z-0"></span>
                  <span className="relative z-10 flex items-center gap-3">Chat on WhatsApp</span>
                </a>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ==========================================
          CHAPTER 02: SAMPAN CONDOMINIUM (Warm Ivory)
          ========================================== */}
      <section id="chapter-2" className="chapter-section relative z-10 w-full h-screen bg-[#F5F3EE] overflow-hidden">
        
        {/* Kinetic Background Typography */}
        <div className="absolute top-1/2 left-0 w-full -translate-y-1/2 z-0 overflow-hidden whitespace-nowrap pointer-events-none flex">
          <span className="kinetic-text font-lux-serif text-[20vw] text-[#0B0B0D]/[0.03] leading-none pr-8">CONDOMINIUM</span>
          <span className="kinetic-text font-lux-serif text-[20vw] text-[#0B0B0D]/[0.03] leading-none pr-8">CONDOMINIUM</span>
        </div>

        <div className="relative h-full w-full flex flex-col md:flex-row items-center">
          {/* Image Layer (Left Side) */}
          <div className="relative md:absolute md:left-0 top-0 w-full md:w-[50%] h-[40vh] md:h-full z-10">
            <div className="anim-img-reveal absolute inset-0">
              <div className="parallax-pan absolute inset-0 scale-110 will-change-transform">
                <img 
                  src={PROJECT_ASSETS.condo} 
                  alt="Sampan Condominium G+9 Architectural Concept" 
                  className="anim-img-scale w-full h-full object-cover will-change-transform"
                />
              </div>
              <div className="absolute inset-0 bg-gradient-to-r from-transparent to-[#F5F3EE] md:bg-gradient-to-r md:from-transparent md:to-[#F5F3EE]/80"></div>
            </div>
          </div>

          {/* Content Layer (Right Side) */}
          <div className="relative z-20 w-full max-w-[1400px] mx-auto px-6 md:px-12 lg:px-24 flex md:justify-end py-12 md:py-0">
            <div className="max-w-xl text-[#0B0B0D] md:pl-12">
              <div className="anim-fade flex items-center gap-4 mb-8">
                <span className="h-[1.5px] w-12 bg-[#C5A059]"></span>
                <span className="text-[10px] md:text-[11px] font-medium uppercase tracking-[0.4em] text-[#0B0B0D]">
                  02 / Serviced Living
                </span>
              </div>

              <h1 className="font-lux-serif text-[clamp(2.5rem,6vw,5.5rem)] leading-[0.95] tracking-[-0.02em] mb-8">
                <span className="block overflow-hidden pb-2">
                  <span className="anim-headline block font-light">Sampan</span>
                </span>
                <span className="block overflow-hidden pb-2">
                  <span className="anim-headline block italic text-[#C5A059]">Condominium</span>
                </span>
              </h1>

              <div className="anim-fade overflow-hidden mb-8">
                <h2 className="text-xs md:text-sm font-lux-sans font-light uppercase tracking-[0.2em] text-[#0B0B0D] border-l border-[#0B0B0D]/30 pl-4">
                  A G+9 Building on the Highway
                </h2>
              </div>

              <p className="anim-fade text-sm md:text-base text-[#0B0B0D]/90 font-light leading-relaxed max-w-md mb-10">
                Serviced apartments on 20 katha, right beside Express Highway Inn. Units are managed for rental income, and owners get access to Express Highway Inn and Sampan Trade Emporium next door.
              </p>

              <div className="flex flex-col gap-4 mb-12 max-w-md border-t border-[#0B0B0D]/10 pt-6">
                {["Nine service apartment floors", "Rooftop drone land station, pool and gym", "Ground-floor car parking"].map((point, i) => (
                  <div key={i} className="flex items-center gap-4">
                    <span className="anim-line-draw block h-px w-8 bg-[#C5A059] flex-shrink-0"></span>
                    <span className="anim-fade text-xs font-medium text-[#0B0B0D] uppercase tracking-[0.1em]">
                      {point}
                    </span>
                  </div>
                ))}
              </div>

              <div className="flex flex-col sm:flex-row items-start gap-4">
                <Link href="/projects/ongoing/sampan-condominium" className="anim-fade group relative overflow-hidden bg-[#0B0B0D] text-[#F5F3EE] text-[10px] font-semibold uppercase tracking-[0.3em] px-8 py-4 transition-colors duration-500 hover:text-[#0B0B0D] flex items-center gap-3">
                  <span className="absolute inset-0 bg-[#C5A059] translate-y-full group-hover:translate-y-0 transition-transform duration-500 ease-[cubic-bezier(0.22,1,0.36,1)] z-0"></span>
                  <span className="relative z-10 flex items-center gap-3">See the Condominium <svg className="w-4 h-4 transition-transform duration-300 group-hover:translate-x-1" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" d="M14 5l7 7m0 0l-7 7m7-7H3"></path></svg></span>
                </Link>
                <a href={WHATSAPP_URL} target="_blank" rel="noopener noreferrer" className="anim-fade group relative overflow-hidden border border-[#0B0B0D]/20 text-[#0B0B0D] text-[10px] font-semibold uppercase tracking-[0.3em] px-8 py-4 transition-colors duration-500 hover:border-[#25D366] hover:text-[#F5F3EE] flex items-center gap-3">
                  <span className="absolute inset-0 bg-[#0B0B0D] translate-y-full group-hover:translate-y-0 transition-transform duration-500 ease-[cubic-bezier(0.22,1,0.36,1)] z-0"></span>
                  <span className="relative z-10 flex items-center gap-3">Chat on WhatsApp</span>
                </a>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ==========================================
          CHAPTER 03: SAMPAN TRADE EMPORIUM (Pure Dark)
          ========================================== */}
      <section id="chapter-3" className="chapter-section relative z-10 w-full h-screen bg-[#0B0B0D] overflow-hidden">
        
        {/* Kinetic Background Typography */}
        <div className="absolute top-1/2 left-0 w-full -translate-y-1/2 z-0 overflow-hidden whitespace-nowrap pointer-events-none flex">
          <span className="kinetic-text font-lux-serif text-[20vw] text-[#F5F3EE]/[0.03] leading-none pr-8">TRADE EMPORIUM</span>
          <span className="kinetic-text font-lux-serif text-[20vw] text-[#F5F3EE]/[0.03] leading-none pr-8">TRADE EMPORIUM</span>
        </div>

        <div className="relative h-full w-full flex flex-col lg:flex-row items-center py-12 md:py-0">
          {/* Full Background Image */}
          <div className="absolute inset-0 z-10">
            <div className="anim-img-reveal absolute inset-0">
              <div className="parallax-pan absolute inset-0 scale-110 will-change-transform">
                <img 
                  src={PROJECT_ASSETS.emporium} 
                  alt="Sampan Trade Emporium Mixed Use Architecture" 
                  className="anim-img-scale w-full h-full object-cover will-change-transform"
                />
              </div>
              <div className="absolute inset-0 bg-[#0B0B0D]/90"></div>
              <div className="absolute inset-0 bg-gradient-to-r from-[#0B0B0D] via-[#0B0B0D]/80 to-transparent"></div>
            </div>
          </div>

          {/* Content Layer */}
          <div className="relative z-20 w-full max-w-[1400px] mx-auto px-6 md:px-12 lg:px-24 flex flex-col lg:flex-row gap-12 items-center">
            <div className="w-full lg:w-1/2 text-[#F5F3EE]">
              <div className="anim-fade flex items-center gap-4 mb-8">
                <span className="h-[1.5px] w-12 bg-[#C5A059]"></span>
                <span className="text-[10px] md:text-[11px] font-medium uppercase tracking-[0.4em] text-[#C5A059]">
                  03 / Mixed-Use Development
                </span>
              </div>

              <h1 className="font-lux-serif text-[clamp(2.5rem,6vw,5.5rem)] leading-[0.95] tracking-[-0.02em] mb-8">
                <span className="block overflow-hidden pb-2">
                  <span className="anim-headline block font-light">Sampan Trade</span>
                </span>
                <span className="block overflow-hidden pb-2">
                  <span className="anim-headline block italic text-[#C5A059]">Emporium</span>
                </span>
              </h1>

              <div className="anim-fade overflow-hidden mb-8">
                <h2 className="text-xs md:text-sm font-lux-sans font-light uppercase tracking-[0.2em] text-[#F5F3EE] border-l border-[#F5F3EE]/20 pl-4">
                  B+LG+G+11 · 20 Katha
                </h2>
              </div>

              <p className="anim-fade text-sm md:text-base text-[#F5F3EE]/90 font-light leading-relaxed max-w-md mb-10">
                A B+LG+G+11 building on 20 katha beside Express Highway Inn. Showrooms and a food court sit at the bottom, banks and offices in the middle, a hospital and diagnostics floors above, along with doctors&apos; chambers.
              </p>

              <div className="flex flex-col sm:flex-row items-start gap-4">
                <Link href="/projects/ongoing/sampan-trade-emporium" className="anim-fade group relative overflow-hidden bg-[#C5A059] text-[#0B0B0D] text-[10px] font-semibold uppercase tracking-[0.3em] px-8 py-4 transition-colors duration-500 hover:text-[#C5A059] flex items-center gap-3">
                  <span className="absolute inset-0 bg-[#F5F3EE] translate-y-full group-hover:translate-y-0 transition-transform duration-500 ease-[cubic-bezier(0.22,1,0.36,1)] z-0"></span>
                  <span className="relative z-10 flex items-center gap-3">See the Trade Emporium <svg className="w-4 h-4 transition-transform duration-300 group-hover:translate-x-1" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" d="M14 5l7 7m0 0l-7 7m7-7H3"></path></svg></span>
                </Link>
                <a href={WHATSAPP_URL} target="_blank" rel="noopener noreferrer" className="anim-fade group relative overflow-hidden border border-[#F5F3EE]/30 text-[#F5F3EE] text-[10px] font-semibold uppercase tracking-[0.3em] px-8 py-4 transition-colors duration-500 hover:border-[#25D366] hover:text-[#0B0B0D] flex items-center gap-3 backdrop-blur-sm">
                  <span className="absolute inset-0 bg-[#25D366] translate-y-full group-hover:translate-y-0 transition-transform duration-500 ease-[cubic-bezier(0.22,1,0.36,1)] z-0"></span>
                  <span className="relative z-10 flex items-center gap-3">Chat on WhatsApp</span>
                </a>
              </div>
            </div>

            {/* Right: Architectural Floor Directory */}
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
                    <span className="anim-line-draw block h-px w-12 bg-[#C5A059] flex-shrink-0"></span>
                    <div className="flex flex-col flex-1">
                      <div className="flex items-baseline gap-3">
                        <span className="anim-fade text-[10px] font-medium uppercase tracking-[0.3em] text-[#C5A059]">{f.level}</span>
                        <span className="anim-fade text-lg font-lux-serif text-[#F5F3EE]">{f.title}</span>
                      </div>
                      <span className="anim-fade text-xs text-[#F5F3EE]/60 font-light mt-1">{f.detail}</span>
                    </div>
                  </div>
                ))}
              </div>

              {/* Mobile Specs Grid */}
              <div className="lg:hidden grid grid-cols-1 gap-4">
                {["Parking spaces over two levels", "Showrooms on the ground floor to levels 3", "Foodcourt, Cinema, gym and spa on level 4", "Corporate on levels 5 to 6", "Hospital, doctor chambers on levels 7 to 11"].map((point, i) => (
                  <div key={i} className="flex items-center gap-4 border-b border-[#F5F3EE]/10 pb-3">
                    <span className="block h-px w-8 bg-[#C5A059] flex-shrink-0"></span>
                    <span className="text-xs font-medium text-[#F5F3EE] uppercase tracking-[0.1em]">
                      {point}
                    </span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* --- Global Styles Required for Typography --- */}
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