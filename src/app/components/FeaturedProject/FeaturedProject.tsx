// app/components/FeaturedProject.tsx
"use client";

import Link from "next/link";
import Image from "next/image";
import { useLayoutEffect, useRef } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import Lenis from "lenis";

export default function FeaturedProject() {
  const sectionRef = useRef<HTMLElement>(null);
  const imageWrapperRef = useRef<HTMLDivElement>(null);
  const imageRef = useRef<HTMLImageElement>(null);
  const textRefs = useRef<HTMLDivElement[]>([]);
  const specsRef = useRef<HTMLDivElement>(null);

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

      // 1. Image Reveal (Clip-path animation)
      gsap.fromTo(
        imageWrapperRef.current,
        { clipPath: "inset(100% 0% 0% 0%)" },
        {
          clipPath: "inset(0% 0% 0% 0%)",
          duration: 1.5,
          ease: "power4.out",
          scrollTrigger: {
            trigger: sectionRef.current,
            start: "top 75%",
          },
        }
      );

      // 2. Image Parallax (Inner image moves slower than the scroll)
      gsap.fromTo(
        imageRef.current,
        { yPercent: -15, scale: 1.1 },
        {
          yPercent: 15,
          ease: "none",
          scrollTrigger: {
            trigger: imageWrapperRef.current,
            start: "top bottom",
            end: "bottom top",
            scrub: true,
          },
        }
      );

      // 3. Text Content Reveal (Fade-up stagger)
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

      // 4. Specifications Reveal
      if (specsRef.current) {
        gsap.from(specsRef.current.children, {
          y: 20,
          opacity: 0,
          duration: 0.6,
          stagger: 0.1,
          ease: "power2.out",
          scrollTrigger: {
            trigger: specsRef.current,
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

  // CONFIGURATION VALUES
  const config = {
    imageUrl: "https://images.unsplash.com/photo-1515263487990-61b07816b324?q=80&w=1974&auto=format&fit=crop", 
    imageAlt: "Architectural rendering of Sampan Metro Square B+G+12 Residential Building",
    projectLink: "/projects/ongoing/sampan-metro-square", 
    whatsappNumber: "8801XXXXXXXXX", 
  };

  // Project Specifications Data
  const specifications = [
    {
      label: "Land Share",
      icon: (
        <svg className="w-5 h-5 text-[#00A551]" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" d="M4 5a1 1 0 011-1h14a1 1 0 011 1v3a1 1 0 01-1 1H5a1 1 0 01-1-1V5zM4 13a1 1 0 011-1h6a1 1 0 011 1v6a1 1 0 01-1 1H5a1 1 0 01-1-1v-6zM14 13a1 1 0 011-1h4a1 1 0 011 1v6a1 1 0 01-1 1h-4a1 1 0 01-1-1v-6z"></path></svg>
      ),
    },
    {
      label: "Open to NRBs",
      icon: (
        <svg className="w-5 h-5 text-[#168FD0]" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" d="M21 12a9 9 0 11-18 0 9 9 0 0118 0zm-9-5v10m-4-5h8"></path></svg>
      ),
    },
    {
      label: "Approx. 1,300 Sq Ft Apartment",
      icon: (
        <svg className="w-5 h-5 text-[#00A551]" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4"></path></svg>
      ),
    },
    {
      label: "Site Visits Arranged",
      icon: (
        <svg className="w-5 h-5 text-[#168FD0]" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z"></path><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" d="M15 11a3 3 0 11-6 0 3 3 0 016 0z"></path></svg>
      ),
    },
  ];

  return (
    <section 
      ref={sectionRef}
      className="relative w-full bg-[#F7FAFC] overflow-hidden font-sans antialiased"
    >

      <div className="relative z-10 max-w-[1440px] mx-auto px-6 lg:px-12 py-20 lg:py-32">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-16 items-center">
          
          {/* Left Column: Architectural Visual (55-60%) */}
          <div className="lg:col-span-7 relative">
            {/* Primary Architectural Image Container */}
            <div 
              ref={imageWrapperRef}
              className="relative w-full h-[450px] md:h-[600px] lg:h-[720px] overflow-hidden shadow-2xl border-4 border-[#F7FAFC]"
            >
              <Image 
                ref={imageRef}
                src={config.imageUrl} 
                alt={config.imageAlt} 
                fill 
                priority 
                sizes="(max-width: 1024px) 100vw, 60vw" 
                className="object-cover object-center will-change-transform" 
              />
              
              {/* Subtle inner border for architectural precision */}
              <div className="absolute inset-0 border border-[#168FD0]/20 pointer-events-none"></div>
            </div>

            {/* Editorial Caption Overlay */}
            <div className="absolute bottom-8 left-8 z-20 flex items-center gap-3">
              <span className="h-px w-8 bg-[#00A551]"></span>
              <span className="text-[10px] font-medium text-[#F7FAFC]/80 tracking-[0.3em] uppercase mix-blend-difference">
                Ashulia, Dhaka
              </span>
            </div>
          </div>

          {/* Right Column: Project Information (40-45%) */}
          <div className="lg:col-span-5 flex flex-col justify-center pl-0">
            
            {/* Eyebrow */}
            <div 
              ref={(el) => { if (el) textRefs.current[0] = el; }}
              className="flex items-center gap-4 mb-8"
            >
              <span className="h-px w-12 bg-[#168FD0]"></span>
              <span className="text-[11px] font-medium uppercase tracking-[0.35em] text-[#221F1F]/60">
                Featured Project · Ashulia
              </span>
            </div>

            {/* Heading */}
            <h2 
              ref={(el) => { if (el) textRefs.current[1] = el; }}
              className="font-serif text-3xl md:text-4xl xl:text-[2.75rem] tracking-tight text-[#00A551] leading-[1.15] mb-8"
            >
              Sampan Metro Square (Ashulia): <span className="text-[#168FD0]">B+G+12</span> Residential Building
            </h2>

            {/* Description */}
            <p 
              ref={(el) => { if (el) textRefs.current[2] = el; }}
              className="text-base lg:text-lg text-[#221F1F]/70 font-light leading-relaxed max-w-xl mb-10"
            >
              A land-share project on 12 katha in Ashulia for buyers who want a defined stake in land without buying a whole plot. Each buyer receives an undivided share, recorded in their name and backed by project documents.
            </p>

            {/* Refined Specification Strip */}
            <div 
              ref={specsRef}
              className="grid grid-cols-2 gap-x-8 gap-y-6 mb-12 border-t border-[#221F1F]/10 pt-8"
            >
              {specifications.map((spec, index) => (
                <div key={index} className="flex items-center gap-4">
                  {spec.icon}
                  <span className="text-sm font-medium text-[#221F1F] tracking-wide">
                    {spec.label}
                  </span>
                </div>
              ))}
            </div>

            {/* CTAs */}
            <div 
              ref={(el) => { if (el) textRefs.current[3] = el; }}
              className="flex flex-col sm:flex-row items-start sm:items-center gap-6"
            >
              <Link 
                href={config.projectLink} 
                className="group bg-[#221F1F] text-white text-sm font-medium tracking-wide px-8 py-4 transition-all duration-300 hover:bg-[#00A551] flex items-center gap-3 shadow-md"
              >
                See Metro Square
                <svg className="w-4 h-4 transition-transform duration-300 group-hover:translate-x-1" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M14 5l7 7m0 0l-7 7m7-7H3"></path></svg>
              </Link>
              
              <a 
                href={`https://wa.me/${config.whatsappNumber}`} 
                target="_blank" 
                rel="noopener noreferrer"
                className="group bg-transparent border border-[#221F1F]/20 text-[#221F1F] text-sm font-medium tracking-wide px-8 py-4 transition-all duration-300 hover:border-[#168FD0] hover:text-[#168FD0] flex items-center gap-3"
              >
                <svg className="w-4 h-4 text-[#00A551]" fill="currentColor" viewBox="0 0 24 24"><path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.608.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51l-.57-.01c-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.247-.694.247-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413Z"></path></svg>
                Chat on WhatsApp
              </a>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}