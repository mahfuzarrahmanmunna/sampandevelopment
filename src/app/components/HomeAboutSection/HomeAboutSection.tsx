// app/components/About.tsx
"use client";

import Link from "next/link";
import Image from "next/image";
import { useLayoutEffect, useRef } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import Lenis from "lenis";

export default function About() {
  const sectionRef = useRef<HTMLElement>(null);
  const primaryImageRef = useRef<HTMLDivElement>(null);
  const secondaryImageRef = useRef<HTMLDivElement>(null);
  const textRefs = useRef<HTMLDivElement[]>([]);
  const statsRef = useRef<HTMLDivElement>(null);

  useLayoutEffect(() => {
    gsap.registerPlugin(ScrollTrigger);
    
    const prefersReducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

    // Initialize Lenis smooth scrolling
    const lenis = new Lenis({
      duration: 1.2,
      easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
      smoothWheel: true,
    });

    lenis.on("scroll", ScrollTrigger.update);

    const raf = (time: number) => {
      lenis.raf(time * 1000);
    };
    gsap.ticker.add(raf);
    gsap.ticker.lagSmoothing(0);

    const ctx = gsap.context(() => {
      if (prefersReducedMotion) return;

      // 1. Text Content Reveal (Fade-up stagger)
      gsap.from(textRefs.current, {
        y: 40,
        opacity: 0,
        duration: 1,
        stagger: 0.15,
        ease: "power3.out",
        scrollTrigger: {
          trigger: sectionRef.current,
          start: "top 70%",
        },
      });

      // 2. Primary Image Reveal (Clip-path from top)
      gsap.fromTo(
        primaryImageRef.current,
        { clipPath: "inset(0% 0% 100% 0%)" },
        {
          clipPath: "inset(0% 0% 0% 0%)",
          duration: 1.5,
          ease: "power4.out",
          scrollTrigger: {
            trigger: primaryImageRef.current,
            start: "top 80%",
          },
        }
      );

      // 3. Secondary Image Reveal (Clip-path from bottom)
      gsap.fromTo(
        secondaryImageRef.current,
        { clipPath: "inset(100% 0% 0% 0%)" },
        {
          clipPath: "inset(0% 0% 0% 0%)",
          duration: 1.5,
          ease: "power4.out",
          delay: 0.2,
          scrollTrigger: {
            trigger: secondaryImageRef.current,
            start: "top 85%",
          },
        }
      );

      // 4. Parallax Effects on Images
      gsap.to(primaryImageRef.current?.querySelector("img") || null, {
        yPercent: 10,
        ease: "none",
        scrollTrigger: {
          trigger: sectionRef.current,
          start: "top bottom",
          end: "bottom top",
          scrub: true,
        }
      });

      gsap.to(secondaryImageRef.current?.querySelector("img") || null, {
        yPercent: -15,
        ease: "none",
        scrollTrigger: {
          trigger: sectionRef.current,
          start: "top bottom",
          end: "bottom top",
          scrub: true,
        }
      });

      // 5. Statistics Reveal
      if (statsRef.current) {
        gsap.from(statsRef.current.children, {
          y: 30,
          opacity: 0,
          duration: 0.8,
          stagger: 0.15,
          ease: "power2.out",
          scrollTrigger: {
            trigger: statsRef.current,
            start: "top 85%",
          },
        });
      }
    }, sectionRef);

    return () => {
      ctx.revert();
      gsap.ticker.remove(raf);
      lenis.destroy();
    };
  }, []);

  // CONFIGURATION PLACEHOLDERS
  const stats = {
    yearsInBusiness: "—", 
    projectsDelivered: "—", 
    unitsHandedOver: "—", 
  };
  
  const ourStoryLink = "/about";

  return (
    <section 
      ref={sectionRef}
      className="relative w-full overflow-hidden font-sans antialiased"
    >

      <div className="relative z-10 max-w-[1440px] mx-auto px-6 lg:px-12 pt-32 lg:pt-40 pb-20 lg:pb-24">
        
        {/* Main Two-Column Editorial Composition */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 lg:gap-24 items-center mb-24 lg:mb-32">
          
          {/* Left Column: Art-Directed Architectural Collage */}
          <div className="relative h-[450px] md:h-[550px] lg:h-[640px]">
            
            {/* Primary Architectural Image (Left Dominant) */}
            <div 
              ref={primaryImageRef} 
              className="absolute top-0 left-0 w-[75%] h-[80%] z-10 overflow-hidden shadow-2xl border-4 border-[#F7FAFC] will-change-transform"
            >
              <Image 
                src="https://images.unsplash.com/photo-1460472178825-e5240623afd5?q=80&w=2069&auto=format&fit=crop" 
                alt="Premium architectural commercial and residential development by Sampan Development" 
                fill 
                sizes="(max-width: 1024px) 75vw, 35vw" 
                className="object-cover object-center will-change-transform" 
              />
            </div>

            {/* Secondary Offset Architectural Image (Right Bottom Overlap) */}
            <div 
              ref={secondaryImageRef} 
              className="absolute bottom-0 right-0 w-[50%] h-[55%] z-20 overflow-hidden shadow-xl border-4 border-[#F7FAFC] will-change-transform"
            >
              <Image 
                src="https://images.unsplash.com/photo-1497366754035-f200968a6e72?q=80&w=2069&auto=format&fit=crop" 
                alt="Detailed architectural facade and construction quality" 
                fill 
                sizes="(max-width: 1024px) 50vw, 25vw" 
                className="object-cover object-center will-change-transform" 
              />
            </div>

            {/* Architectural Caption */}
            <div className="absolute bottom-4 left-4 lg:bottom-8 lg:left-8 z-30 flex items-center gap-3">
              <span className="h-px w-8 bg-[#00A551]"></span>
              <span className="text-[10px] font-medium text-[#221F1F]/60 tracking-[0.3em] uppercase">
                Built on Transparency
              </span>
            </div>
          </div>

          {/* Right Column: Company Story */}
          <div className="flex flex-col justify-center pl-0 lg:pl-8">
            
            {/* Eyebrow */}
            <div 
              ref={(el) => { if (el) textRefs.current[0] = el; }}
              className="flex items-center gap-4 mb-8"
            >
              <span className="h-px w-12 bg-[#00A551]"></span>
              <span className="text-[11px] font-medium uppercase tracking-[0.35em] text-[#221F1F]/60">
                About Sampan Development
              </span>
            </div>

            {/* Heading */}
            <h2 
              ref={(el) => { if (el) textRefs.current[1] = el; }}
              className="font-serif text-4xl md:text-5xl xl:text-[3.5rem] tracking-tight text-[#19ABE1] leading-[1.1] mb-8"
            >
              Land and construction, done in the open.
            </h2>

            {/* Description */}
            <p 
              ref={(el) => { if (el) textRefs.current[2] = el; }}
              className="text-base lg:text-lg text-[#221F1F]/70 font-light leading-relaxed max-w-xl mb-12"
            >
              Sampan Development Ltd is the land and construction arm of Sampan Group. We manage land, run land-share projects, and build apartments, commercial spaces, and highway destinations. Every project starts with documented ownership, so buyers in Bangladesh and abroad know exactly what they own.
            </p>

            {/* CTA Button */}
            <Link 
              ref={(el) => { if (el) textRefs.current[3] = el; }}
              href={ourStoryLink} 
              className="group self-start bg-[#009D4E] text-white text-sm font-medium tracking-wide px-8 py-4 transition-all duration-300 hover:bg-[#168FD0] flex items-center gap-3 shadow-md"
            >
              Our Story
              <svg className="w-4 h-4 transition-transform duration-300 group-hover:translate-x-1" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M14 5l7 7m0 0l-7 7m7-7H3"></path></svg>
            </Link>
          </div>
        </div>

        {/* Elegant Statistics Strip */}
        <div 
          ref={statsRef}
          className="border-t border-[#221F1F]/10 pt-12 grid grid-cols-1 md:grid-cols-3 gap-8"
        >
          {/* Stat 1 */}
          <div className="flex flex-col gap-2 md:pr-8 md:border-r md:border-[#221F1F]/10">
            <span className="font-serif text-4xl lg:text-5xl text-[#221F1F] font-light">
              {stats.yearsInBusiness}
            </span>
            <span className="text-[11px] font-medium uppercase tracking-[0.3em] text-[#221F1F]/50">
              Years in Business
            </span>
          </div>

          {/* Stat 2 */}
          <div className="flex flex-col gap-2 md:pr-8 md:border-r md:border-[#221F1F]/10">
            <span className="font-serif text-4xl lg:text-5xl text-[#221F1F] font-light">
              {stats.projectsDelivered}
            </span>
            <span className="text-[11px] font-medium uppercase tracking-[0.3em] text-[#221F1F]/50">
              Projects Delivered
            </span>
          </div>

          {/* Stat 3 */}
          <div className="flex flex-col gap-2">
            <span className="font-serif text-4xl lg:text-5xl text-[#221F1F] font-light">
              {stats.unitsHandedOver}
            </span>
            <span className="text-[11px] font-medium uppercase tracking-[0.3em] text-[#221F1F]/50">
              Units Handed Over
            </span>
          </div>
        </div>

      </div>
    </section>
  );
}