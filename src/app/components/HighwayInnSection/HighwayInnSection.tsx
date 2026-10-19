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
    desc: "Fine dining and grand celebrations",
    img: "https://images.unsplash.com/photo-1517248135467-4c7edcad34c4?q=80&w=2070&auto=format&fit=crop"
  },
  {
    name: "Sweet Box",
    desc: "Artisanal desserts & confections",
    img: "https://images.unsplash.com/photo-1488477181946-5428a054e44f?q=80&w=2070&auto=format&fit=crop"
  },
  {
    name: "Mini Sampan",
    desc: "Quick bites & casual café",
    img: "https://images.unsplash.com/photo-1521017432531-fbd92d768814?q=80&w=2070&auto=format&fit=crop"
  },
  {
    name: "Sampan Mart",
    desc: "Premium retail & essentials",
    img: "https://images.unsplash.com/photo-1604719312566-8912e922ed26?q=80&w=2070&auto=format&fit=crop"
  },
  {
    name: "Filling Station",
    desc: "Modern fueling infrastructure",
    img: "https://images.unsplash.com/photo-1545459720-aac8509eb02c?q=80&w=2070&auto=format&fit=crop"
  },
  {
    name: "LPG Station",
    desc: "Safe & efficient gas solutions",
    img: "https://images.unsplash.com/photo-1581094794329-c8112a89af12?q=80&w=2070&auto=format&fit=crop"
  },
  {
    name: "White House Hotel & Motel",
    desc: "Luxury transient living",
    img: "https://images.unsplash.com/photo-1566073771259-6a8506099945?q=80&w=2070&auto=format&fit=crop"
  }
];

export default function HighwayInnSection() {
  const sectionRef = useRef<HTMLElement>(null);

  useLayoutEffect(() => {
    gsap.registerPlugin(ScrollTrigger);

    const ctx = gsap.context(() => {
      const mm = gsap.matchMedia();

      // --- DESKTOP & TABLET CINEMATIC ANIMATION ---
      mm.add("(min-width: 768px) and (prefers-reduced-motion: no-preference)", () => {
        
        // Hero Image Reveal
        gsap.from(".hero-img-wrap", {
          opacity: 0,
          scale: 1.05,
          duration: 1.5,
          ease: "power3.out",
          scrollTrigger: {
            trigger: ".hero-img-wrap",
            start: "top 85%",
          }
        });

        // Hero Text Reveal
        gsap.from(".hero-text", {
          opacity: 0,
          y: 30,
          duration: 1.2,
          stagger: 0.15,
          ease: "power3.out",
          scrollTrigger: {
            trigger: ".hero-text",
            start: "top 85%",
          }
        });

        // Gallery Items Reveal
        gsap.from(".gallery-item", {
          opacity: 0,
          y: 40,
          duration: 1,
          stagger: 0.1,
          ease: "power3.out",
          scrollTrigger: {
            trigger: ".gallery-grid",
            start: "top 80%"
          }
        });
      });

    }, sectionRef);

    return () => ctx.revert();
  }, []);

  return (
    <section 
      ref={sectionRef} 
      className={`${luxSerif.variable} ${luxSans.variable} relative w-full bg-[#0B0B0A] text-[#F4F1EA] font-lux-sans antialiased py-24 md:py-32 lg:py-40 overflow-hidden`}
    >
      <div className="max-w-[1400px] mx-auto px-6 md:px-12 lg:px-24">
        
        {/* --- EDITORIAL HERO SECTION --- */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-20 items-center mb-24 md:mb-32 lg:mb-40">
          
          {/* Text Column */}
          <div className="flex flex-col gap-6 max-w-xl order-2 lg:order-1">
            <span className="hero-text text-[11px] font-medium uppercase tracking-[0.3em] text-[#C5A059]">
              The Sampan Experience
            </span>

            <h2 className="hero-text font-lux-serif text-[clamp(2.5rem,5vw,4rem)] leading-[1.1] tracking-[-0.02em] font-light">
              Sampan Highway Inn
              <span className="block italic text-[#A7A39B] mt-2">Everything in one destination.</span>
            </h2>

            <p className="hero-text text-[#A7A39B] text-base md:text-lg font-light leading-relaxed mt-2">
              A restaurant and party centre, Sweet Box, Mini Sampan, Sampan Mart, a filling station, an LPG station and the Sampan White House hotel and motel, all in one place.
            </p>

            <Link 
              href="/sampan-highway-inn" 
              className="hero-text group inline-flex items-center gap-4 text-[12px] font-medium uppercase tracking-[0.2em] text-[#F4F1EA] hover:text-[#C5A059] transition-colors mt-6 w-fit"
            >
              Explore Highway Inn
              <span className="relative w-12 h-[1px] bg-[#F4F1EA] overflow-hidden">
                <span className="absolute inset-0 bg-[#C5A059] translate-x-[-100%] group-hover:translate-x-0 transition-transform duration-500 ease-[cubic-bezier(0.22,1,0.36,1)]"></span>
              </span>
            </Link>
          </div>

          {/* Image Column */}
          <div className="hero-img-wrap relative aspect-[4/5] lg:aspect-[5/6] overflow-hidden order-1 lg:order-2">
            <img 
              src="https://images.unsplash.com/photo-1551882547-ff40c63fe5fa?q=80&w=2070&auto=format&fit=crop" 
              alt="Sampan Highway Inn Architectural Exterior" 
              className="w-full h-full object-cover"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-[#0B0B0A]/40 via-transparent to-transparent pointer-events-none"></div>
          </div>
        </div>

        {/* --- AMENITIES GALLERY SECTION --- */}
        <div className="border-t border-[rgba(244,241,234,0.12)] pt-16 md:pt-24">
          
          {/* Section Header */}
          <div className="flex flex-col md:flex-row justify-between items-start md:items-end gap-6 mb-12 md:mb-16">
            <h3 className="font-lux-serif text-[clamp(2rem,3.5vw,3rem)] font-light leading-tight">
              More to discover.
            </h3>
            <p className="text-[#A7A39B] text-sm md:text-base max-w-xs md:text-right font-light">
              Everything you need, thoughtfully brought together.
            </p>
          </div>

          {/* Bento-style Gallery Grid */}
          <div className="gallery-grid grid grid-cols-1 md:grid-cols-2 lg:grid-cols-12 gap-4 md:gap-6">
            {FACILITIES.map((facility, i) => {
              
              // Layout logic for a balanced 7-item grid
              let spanClass = "";
              let heightClass = "";

              if (i === 0) {
                spanClass = "md:col-span-2 lg:col-span-7";
                heightClass = "h-[350px] md:h-[450px] lg:h-[500px]";
              } else if (i === 1) {
                spanClass = "lg:col-span-5";
                heightClass = "h-[350px] md:h-[450px] lg:h-[500px]";
              } else if (i >= 2 && i <= 4) {
                spanClass = "lg:col-span-4";
                heightClass = "h-[300px] md:h-[350px] lg:h-[400px]";
              } else {
                spanClass = "md:col-span-2 lg:col-span-6";
                heightClass = "h-[350px] md:h-[450px] lg:h-[500px]";
              }

              return (
                <div 
                  key={i} 
                  className={`gallery-item group relative ${spanClass} ${heightClass} overflow-hidden`}
                >
                  {/* Image */}
                  <img 
                    src={facility.img} 
                    alt={facility.name} 
                    className="absolute inset-0 w-full h-full object-cover transition-transform duration-[1.2s] ease-[cubic-bezier(0.22,1,0.36,1)] group-hover:scale-105"
                  />
                  
                  {/* Overlays */}
                  <div className="absolute inset-0 bg-gradient-to-t from-[#0B0B0A] via-[#0B0B0A]/20 to-transparent opacity-90 transition-opacity duration-500 group-hover:opacity-100"></div>
                  
                  {/* Content */}
                  <div className="absolute bottom-0 left-0 p-6 md:p-8 flex flex-col">
                    <span className="text-[10px] font-medium tracking-[0.3em] text-[#C5A059] uppercase mb-3 opacity-80">
                      0{i + 1}
                    </span>
                    <h4 className="font-lux-serif text-2xl md:text-3xl text-[#F4F1EA] font-light leading-tight">
                      {facility.name}
                    </h4>
                    
                    {/* Hover Description */}
                    <div className="grid transition-all duration-500 ease-[cubic-bezier(0.22,1,0.36,1)] group-hover:grid-rows-[1fr] grid-rows-[0fr]">
                      <div className="overflow-hidden">
                        <p className="text-sm text-[#A7A39B] mt-2 font-light opacity-0 group-hover:opacity-100 transition-opacity duration-500 delay-100">
                          {facility.desc}
                        </p>
                      </div>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </section>
  );
}