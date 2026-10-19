// app/components/About.tsx
"use client";

import Link from "next/link";
import { useLayoutEffect, useRef } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

export default function About() {
  const sectionRef = useRef<HTMLElement>(null);
  const trackRef = useRef<HTMLDivElement>(null);

  useLayoutEffect(() => {
    gsap.registerPlugin(ScrollTrigger);
    
    const ctx = gsap.context(() => {
      const mm = gsap.matchMedia();
      
      mm.add("(min-width: 768px)", () => {
        const track = trackRef.current;
        if (!track) return;
        
        const totalScroll = track.scrollWidth - window.innerWidth;
        
        // 1. HORIZONTAL PINNING TIMELINE
        const scrollTween = gsap.to(track, {
          x: () => -totalScroll,
          ease: "none",
          scrollTrigger: {
            trigger: sectionRef.current,
            start: "top top",
            end: () => `+=${totalScroll}`,
            scrub: 1,
            pin: true,
            invalidateOnRefresh: true,
          }
        });

        // 2. HORIZONTAL PARALLAX ON IMAGES
        // Moves images slower than the track to create depth
        gsap.utils.toArray(".parallax-img").forEach((img) => {
          gsap.fromTo(img, 
            { xPercent: -15 }, 
            {
              xPercent: 15,
              ease: "none",
              scrollTrigger: {
                trigger: img.closest(".panel"),
                containerAnimation: scrollTween,
                start: "left right",
                end: "right left",
                scrub: true
              }
            }
          );
        });

        // 3. HORIZONTAL CLIP-PATH REVEALS
        gsap.utils.toArray(".img-reveal").forEach((container) => {
          gsap.fromTo(container, 
            { clipPath: "inset(0% 0% 0% 100%)" }, 
            {
              clipPath: "inset(0% 0% 0% 0%)",
              ease: "none",
              scrollTrigger: {
                trigger: container,
                containerAnimation: scrollTween,
                start: "left 80%",
                end: "left 20%",
                scrub: true
              }
            }
          );
        });
      });

    }, sectionRef);

    return () => ctx.revert();
  }, []);

  return (
    <section 
      ref={sectionRef} 
      className="relative w-full h-screen bg-[#101615] overflow-hidden font-lux-sans antialiased"
    >
      {/* Horizontal Track */}
      <div ref={trackRef} className="flex flex-nowrap h-full w-max items-center">
        
        {/* --- Panel 1: Ivory Intro (Land and construction) --- */}
        <div className="panel w-screen h-full bg-[#F7F4ED] text-[#101615] flex flex-col justify-center px-8 md:px-16 lg:px-24 relative">
          <div className="flex items-center gap-4 mb-8 overflow-hidden">
            <span className="block h-[1.5px] w-16 bg-[#C6A06B]"></span>
            <span className="text-[10px] md:text-[11px] font-medium uppercase tracking-[0.4em] text-[#101615]/60">
              About Sampan Development
            </span>
          </div>
          
          <h2 className="font-lux-serif text-[clamp(3rem,9vw,11rem)] leading-[0.9] tracking-[-0.03em] font-light">
            Land and<br/>construction,
          </h2>

          {/* Bottom decorative index */}
          <div className="absolute bottom-8 left-8 md:left-24 text-[10px] uppercase tracking-[0.3em] text-[#101615]/40">
            01 / Identity
          </div>
        </div>

        {/* --- Panel 2: Obsidian Narrative (done in the open) --- */}
        <div className="panel w-screen h-full bg-[#101615] text-[#F7F4ED] flex flex-col justify-center px-8 md:px-16 lg:px-24 relative">
          <h2 className="font-lux-serif text-[clamp(3rem,9vw,11rem)] leading-[0.9] tracking-[-0.03em] italic font-normal text-[#C6A06B] mb-12">
            done in the open.
          </h2>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-12 max-w-4xl">
            <p className="text-base md:text-lg text-[#F7F4ED]/70 font-light leading-relaxed">
              Sampan Development Ltd is the land and construction arm of Sampan Group. We manage land, run land-share projects, and build apartments, commercial spaces, and highway destinations. Every project starts with documented ownership, so buyers in Bangladesh and abroad know exactly what they own.
            </p>
            
            {/* Stats Integration */}
            <div className="grid grid-cols-3 gap-4">
              <div className="flex flex-col gap-2 pr-4 border-r border-[#F7F4ED]/15">
                <span className="font-lux-serif text-3xl md:text-4xl text-[#C6A06B] font-light">[ 01 ]</span>
                <span className="text-[9px] font-medium uppercase tracking-[0.25em] text-[#F7F4ED]/50">Years in Business</span>
              </div>
              <div className="flex flex-col gap-2 px-4 border-r border-[#F7F4ED]/15">
                <span className="font-lux-serif text-3xl md:text-4xl text-[#C6A06B] font-light">[ 02 ]</span>
                <span className="text-[9px] font-medium uppercase tracking-[0.25em] text-[#F7F4ED]/50">Projects Delivered</span>
              </div>
              <div className="flex flex-col gap-2 pl-4">
                <span className="font-lux-serif text-3xl md:text-4xl text-[#C6A06B] font-light">[ 03 ]</span>
                <span className="text-[9px] font-medium uppercase tracking-[0.25em] text-[#F7F4ED]/50">Units Handed Over</span>
              </div>
            </div>
          </div>

          <div className="absolute bottom-8 right-8 md:right-24 text-[10px] uppercase tracking-[0.3em] text-[#F7F4ED]/40">
            02 / Philosophy
          </div>
        </div>

        {/* --- Panel 3: Immersive Architectural Image --- */}
        <div className="panel w-[80vw] h-full bg-[#101615] flex items-center justify-center relative overflow-hidden">
          <div className="img-reveal absolute inset-0 flex items-center justify-center">
            <div className="parallax-img absolute inset-0 scale-110 w-full h-full">
              <img 
                src="/images/roni/Sampan_Trade_Emporium_Rooftop_Tower.png" 
                alt="Premium architectural commercial and residential development" 
                className="w-full h-full object-cover"
              />
            </div>
            {/* Subtle gradient overlay */}
            <div className="absolute inset-0 bg-gradient-to-t from-[#101615]/50 via-transparent to-transparent pointer-events-none"></div>
          </div>
          
          <div className="relative z-10 text-right self-end mb-12 mr-12">
            <div className="text-[9px] uppercase tracking-[0.3em] text-[#F7F4ED]/80 mb-2">Fig 01 / Ashulia Complex</div>
            <div className="w-24 h-px bg-[#C6A06B] ml-auto"></div>
          </div>
        </div>

        {/* --- Panel 4: Ivory CTA & Secondary Image --- */}
        <div className="panel w-[60vw] h-full bg-[#F7F4ED] text-[#101615] flex items-center">
          <div className="w-1/2 h-full flex flex-col justify-center px-8 md:px-12">
            <h3 className="font-lux-serif text-3xl md:text-4xl font-light mb-6 leading-tight">
              Know exactly<br/>what you own.
            </h3>
            
            <Link 
              href="/about" 
              className="group inline-flex items-center gap-4 text-[11px] font-semibold uppercase tracking-[0.3em] text-[#101615] transition-colors duration-300 hover:text-[#C6A06B] mt-4"
            >
              Our story
              <span className="relative w-12 h-[1.5px] bg-[#101615]/40 overflow-hidden">
                <span className="absolute inset-0 bg-[#C6A06B] translate-x-[-100%] group-hover:translate-x-0 transition-transform duration-500 ease-[cubic-bezier(0.22,1,0.36,1)]"></span>
              </span>
              <svg className="w-4 h-4 transition-transform duration-300 group-hover:translate-x-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" d="M14 5l7 7m0 0l-7 7m7-7H3"></path>
              </svg>
            </Link>
          </div>
          
          <div className="w-1/2 h-[70%] relative overflow-hidden mr-8 md:mr-12">
            <div className="img-reveal absolute inset-0">
              <div className="parallax-img absolute inset-0 scale-110 w-full h-full">
                <img 
                  src="/images/roni/Sampan_Trade_Emporium_Rooftop_Tower.png" 
                  alt="Architectural construction detail" 
                  className="w-full h-full object-cover"
                />
              </div>
            </div>
          </div>
        </div>

        {/* --- Panel 5: Obsidian Outro --- */}
        <div className="panel w-[40vw] h-full bg-[#101615] flex flex-col justify-center items-center px-8 text-center">
           <span className="text-[#C6A06B] text-2xl mb-4">✦</span>
           <p className="text-[10px] uppercase tracking-[0.4em] text-[#F7F4ED]/40 max-w-[200px]">
             Building Better Tomorrows.
           </p>
        </div>

      </div>

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