// app/components/CompletedProjectsSection.tsx
"use client";

import { useLayoutEffect, useRef } from "react";
import Link from "next/link";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { Cormorant_Garamond, Inter } from "next/font/google";

// 1. Next.js Font Optimization
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

// 2. Configurable Project Data
// Note: Replace placeholder strings with verified data when available.
const PROJECTS = [
  {
    index: "01",
    name: "Sampan 21st Century",
    location: "[Verified Location]",
    handover: "[Verified Year]",
    units: "[Verified Count]",
    img: "/images/21st/21st.png",
    slug: "/projects/completed/sampan-21st-century"
  },
  {
    index: "02",
    name: "Sampan Taj",
    location: "[Verified Location]",
    handover: "[Verified Year]",
    units: "[Verified Count]",
    img: "/images/21st/sampantaz.png",
    slug: "/projects/completed/sampan-taj"
  },
  {
    index: "03",
    name: "Sampan Niketon",
    location: "[Verified Location]",
    handover: "[Verified Year]",
    units: "[Verified Count]",
    img: "/images/21st/sampanniketon.png",
    slug: "/projects/completed/sampan-niketon"
  }
];

export default function CompletedProjectsSection() {
  const sectionRef = useRef<HTMLElement>(null);

  useLayoutEffect(() => {
    gsap.registerPlugin(ScrollTrigger);

    const ctx = gsap.context(() => {
      const mm = gsap.matchMedia();

      // --- DESKTOP & TABLET ANIMATIONS ---
      mm.add("(min-width: 768px) and (prefers-reduced-motion: no-preference)", () => {
        
        // Text Mask Reveals
        gsap.utils.toArray<HTMLElement>(".anim-mask").forEach((el) => {
          gsap.fromTo(el.children, 
            { yPercent: 110 }, 
            { 
              yPercent: 0, ease: "power3.out", duration: 1.2, stagger: 0.1,
              scrollTrigger: { trigger: el, start: "top 85%" }
            }
          );
        });

        // Fade & Slide Reveals
        gsap.utils.toArray<HTMLElement>(".anim-fade").forEach((el) => {
          gsap.fromTo(el, 
            { y: 40, opacity: 0 }, 
            { 
              y: 0, opacity: 1, ease: "power3.out", duration: 1,
              scrollTrigger: { trigger: el, start: "top 85%" }
            }
          );
        });

        // Gold Line Draws
        gsap.utils.toArray<HTMLElement>(".anim-line").forEach((el) => {
          gsap.fromTo(el, 
            { scaleX: 0 }, 
            { 
              scaleX: 1, ease: "none", duration: 0.8,
              scrollTrigger: { trigger: el, start: "top 90%" }
            }
          );
        });

        // Image Clip-path & Scale Reveals
        gsap.utils.toArray<HTMLElement>(".anim-img-wrap").forEach((wrap) => {
          const img = wrap.querySelector("img");
          
          gsap.fromTo(wrap, 
            { clipPath: "inset(100% 0% 0% 0%)" }, 
            { 
              clipPath: "inset(0% 0% 0% 0%)", ease: "power2.inOut", duration: 1.5,
              scrollTrigger: { trigger: wrap, start: "top 80%" }
            }
          );

          if (img) {
            gsap.fromTo(img, 
              { scale: 1.2 }, 
              { 
                scale: 1, ease: "none",
                scrollTrigger: { trigger: wrap, start: "top bottom", end: "bottom top", scrub: true }
              }
            );
          }
        });
      });

      // --- MOBILE & REDUCED MOTION FALLBACK ---
      mm.add("(max-width: 767px), (prefers-reduced-motion: reduce)", () => {
        gsap.set([".anim-mask", ".anim-fade", ".anim-line", ".anim-img-wrap"], { clearProps: "all" });
      });

    }, sectionRef);

    return () => ctx.revert();
  }, []);

  return (
    <section 
      ref={sectionRef} 
      className={`${luxSerif.variable} ${luxSans.variable} relative w-full bg-[#F5F2EC] text-[#0B0B0D] font-lux-sans antialiased py-24 md:py-32 lg:py-40 px-6 md:px-12 lg:px-24 overflow-hidden`}
    >
      <div className="max-w-[1600px] mx-auto">
        
        {/* --- EDITORIAL INTRODUCTION --- */}
        <div className="grid grid-cols-1 md:grid-cols-12 gap-8 md:gap-12 mb-24 md:mb-40">
          <div className="md:col-span-7">
            <div className="anim-fade flex items-center gap-4 mb-8">
              <span className="anim-line h-[1.5px] w-12 bg-[#19ABE1] origin-left block"></span>
              <span className="text-[10px] font-medium uppercase tracking-[0.4em] text-[#19ABE1]">Completed Developments</span>
            </div>
            <h2 className="font-lux-serif text-[clamp(2.5rem,6vw,5rem)] leading-[1.05] tracking-[-0.02em] font-light">
              <span className="anim-mask block overflow-hidden pb-2"><span className="block">Projects we have</span></span>
              <span className="anim-mask block overflow-hidden pb-2"><span className="block italic text-[#19ABE1]">already delivered.</span></span>
            </h2>
          </div>
          <div className="md:col-span-4 md:col-start-9 flex flex-col justify-end">
            <p className="anim-fade text-sm md:text-base text-[#0B0B0D]/70 font-light leading-relaxed max-w-md">
              Sampan 21st Century, Sampan Taj and Sampan Niketon are built and handed over, with homes in locations close to familiar universities and established neighbourhoods.
            </p>
          </div>
        </div>

        {/* --- ASYMMETRIC PROJECT SHOWCASE --- */}
        <div className="flex flex-col gap-24 md:gap-32">
          {PROJECTS.map((project, i) => {
            
            // Alternating Asymmetric Layout Logic
            const isEven = i % 2 === 0;
            const layoutClasses = isEven 
              ? "md:col-span-7" 
              : "md:col-span-7 md:col-start-6 md:mt-24";
            const textClasses = isEven
              ? "md:col-span-4 md:col-start-9"
              : "md:col-span-4 md:col-start-1 md:row-start-1 md:mt-24";

            return (
              <div key={project.index} className="grid grid-cols-1 md:grid-cols-12 gap-8 md:gap-12 items-center">
                
                {/* Image Column */}
                <div className={`${layoutClasses} anim-img-wrap relative aspect-[4/3] overflow-hidden will-change-transform`}>
                  <img 
                    src={project.img} 
                    alt={project.name} 
                    className="w-full h-full object-cover will-change-transform transition-transform duration-1000 ease-[cubic-bezier(0.22,1,0.36,1)] hover:scale-105" 
                  />
                  <div className="absolute top-4 left-4 bg-[#0B0B0D]/80 backdrop-blur-md text-[#F5F2EC] text-[9px] uppercase tracking-[0.3em] px-4 py-2 border border-[#F5F2EC]/10">
                    Delivered
                  </div>
                </div>

                {/* Text & Metadata Column */}
                <div className={`${textClasses} flex flex-col gap-6`}>
                  <span className="anim-fade text-[10px] uppercase tracking-[0.3em] text-[#19ABE1]">{project.index} / 03</span>
                  
                  <h3 className="anim-mask font-lux-serif text-4xl md:text-5xl leading-[0.95] tracking-[-0.02em] font-light overflow-hidden pb-2">
                    <span className="block">{project.name}</span>
                  </h3>

                  {/* Architectural Metadata Panel */}
                  <div className="anim-fade grid grid-cols-2 gap-x-8 gap-y-6 border-t border-[#0B0B0D]/10 pt-8 mt-4">
                    <div>
                      <span className="block text-[10px] uppercase tracking-[0.3em] text-[#0B0B0D]/50 mb-2">Location</span>
                      <span className="font-lux-serif text-lg font-light">{project.location}</span>
                    </div>
                    <div>
                      <span className="block text-[10px] uppercase tracking-[0.3em] text-[#0B0B0D]/50 mb-2">Handover</span>
                      <span className="font-lux-serif text-lg font-light">{project.handover}</span>
                    </div>
                    <div>
                      <span className="block text-[10px] uppercase tracking-[0.3em] text-[#0B0B0D]/50 mb-2">Residential Units</span>
                      <span className="font-lux-serif text-lg font-light">{project.units}</span>
                    </div>
                  </div>

                  {/* Project Link */}
                  <Link 
                    href={project.slug} 
                    className="anim-fade group inline-flex items-center gap-4 text-[10px] font-semibold uppercase tracking-[0.3em] text-[#0B0B0D] hover:text-[#19ABE1] transition-colors mt-4 w-fit"
                  >
                    View Project
                    <span className="relative w-12 h-[1.5px] bg-[#0B0B0D] overflow-hidden">
                      <span className="absolute inset-0 bg-[#19ABE1] translate-x-[-100%] group-hover:translate-x-0 transition-transform duration-500 ease-[cubic-bezier(0.22,1,0.36,1)]"></span>
                    </span>
                    <svg className="w-4 h-4 transition-transform duration-300 group-hover:translate-x-1" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" d="M14 5l7 7m0 0l-7 7m7-7H3"></path></svg>
                  </Link>
                </div>
              </div>
            );
          })}
        </div>


      </div>
    </section>
  );
}