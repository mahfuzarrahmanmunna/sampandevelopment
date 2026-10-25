// app/components/CondominiumShowcase.tsx
"use client";

import Link from "next/link";
import { useLayoutEffect, useRef } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

export default function CondominiumShowcase() {
  const sectionRef = useRef<HTMLElement>(null);

  useLayoutEffect(() => {
    gsap.registerPlugin(ScrollTrigger);
    
    const ctx = gsap.context(() => {
      const mm = gsap.matchMedia();
      
      mm.add("(prefers-reduced-motion: no-preference)", () => {
        
        // Set initial states
        gsap.set(".condo-img-wrapper", { clipPath: "inset(100% 0% 0% 0%)" });
        gsap.set(".condo-img", { scale: 1.4 });
        gsap.set(".condo-eyebrow", { x: -30, opacity: 0 });
        gsap.set(".condo-headline-line", { yPercent: 110 });
        gsap.set(".condo-body", { y: 40, opacity: 0 });
        gsap.set(".condo-feature-line", { scaleX: 0, transformOrigin: "left" });
        gsap.set(".condo-feature", { y: 30, opacity: 0 });
        gsap.set(".condo-cta", { y: 40, opacity: 0 });
        gsap.set(".condo-meta", { opacity: 0 });

        // Master Timeline
        const tl = gsap.timeline({
          scrollTrigger: {
            trigger: sectionRef.current,
            start: "top 70%",
            end: "center 40%",
            scrub: 1.5,
          }
        });

        tl.to(".condo-img-wrapper", { 
            clipPath: "inset(0% 0% 0% 0%)", 
            ease: "none", 
            duration: 1.5 
          }, 0)
          .to(".condo-img", { 
            scale: 1.1, 
            ease: "none", 
            duration: 2 
          }, 0)
          .to(".condo-eyebrow", { 
            x: 0, opacity: 1, 
            ease: "none", 
            duration: 1 
          }, 0.5)
          .to(".condo-headline-line", { 
            yPercent: 0, 
            ease: "none", 
            duration: 1, 
            stagger: 0.5 
          }, 0.6)
          .to(".condo-body", { 
            y: 0, opacity: 1, 
            ease: "none", 
            duration: 1 
          }, 1.1)
          .to(".condo-feature-line", { 
            scaleX: 1, 
            ease: "none", 
            duration: 1, 
            stagger: 0.2 
          }, 1.3)
          .to(".condo-feature", { 
            y: 0, opacity: 1, 
            ease: "none", 
            duration: 1, 
            stagger: 0.2 
          }, 1.3)
          .to(".condo-cta", { 
            y: 0, opacity: 1, 
            ease: "none", 
            duration: 1, 
            stagger: 0.2 
          }, 1.5)
          .to(".condo-meta", { 
            opacity: 1, 
            ease: "none", 
            duration: 1 
          }, 1.6);

        // Subtle continuous parallax on the image
        gsap.to(".condo-img-parallax", {
          yPercent: -15,
          ease: "none",
          scrollTrigger: {
            trigger: sectionRef.current,
            start: "top bottom",
            end: "bottom top",
            scrub: 2
          }
        });

      });

    }, sectionRef);

    return () => ctx.revert();
  }, []);

  const features = [
    { label: "Serviced Apartments", detail: "Nine dedicated floors" },
    { label: "Premium Amenities", detail: "Drone pad, pool & gym" },
    { label: "Convenient Parking", detail: "Ground-floor capacity" }
  ];

  return (
    <section 
      ref={sectionRef} 
      className="relative w-full bg-[#F7F4ED] text-[#101615] py-24 md:py-32 lg:py-40 overflow-hidden font-lux-sans antialiased"
    >
      <div className="max-w-[1600px] mx-auto px-6 md:px-12 lg:px-24">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-16 items-center">
          
          {/* --- Left Column: Editorial Content --- */}
          <div className="lg:col-span-5 flex flex-col justify-center order-2 lg:order-1 relative z-10">
            
            {/* Ghost Number */}
            <span className="absolute -top-20 -left-6 font-lux-serif text-[12rem] text-[#101615]/[0.03] leading-none pointer-events-none hidden lg:block">
              02
            </span>

            {/* Eyebrow */}
            <div className="condo-eyebrow flex items-center gap-4 mb-10">
              <span className="h-[1.5px] w-12 bg-[#009D4E]"></span>
              <span className="text-[10px] md:text-[11px] font-medium uppercase tracking-[0.4em] text-[#101615]/60">
                Sampan Developments · Residential
              </span>
            </div>

            {/* Main Headline with Mask Wipe */}
            <h2 className="font-lux-serif text-[clamp(2.5rem,5.5vw,4.5rem)] leading-[1.05] tracking-[-0.02em] mb-10">
              <span className="block overflow-hidden pb-2">
                <span className="condo-headline-line block font-light">Sampan Condominium:</span>
              </span>
              <span className="block overflow-hidden pb-2">
                <span className="condo-headline-line block italic text-[#009D4E]">A G+9 Building on the Highway</span>
              </span>
            </h2>

            {/* Body Copy */}
            <p className="condo-body text-base md:text-lg text-[#101615]/70 font-light leading-relaxed max-w-md mb-12">
              Serviced apartments on 20 katha, right beside Express Highway Inn. Units are professionally managed for rental income, while owners enjoy access to Express Highway Inn and Sampan Trade Emporium next door.
            </p>

            {/* Architectural Features Row */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-8 mb-14 border-t border-[#101615]/10 pt-8">
              {features.map((feat, i) => (
                <div key={i} className="flex flex-col gap-2">
                  <span className="condo-feature-line block w-full h-px bg-[#009D4E] mb-2"></span>
                  <span className="condo-feature text-sm font-medium text-[#101615] uppercase tracking-[0.1em] leading-tight">
                    {feat.label}
                  </span>
                  <span className="condo-feature text-xs text-[#101615]/50 font-light">
                    {feat.detail}
                  </span>
                </div>
              ))}
            </div>

            {/* CTAs */}
            <div className="flex flex-col sm:flex-row items-start gap-5">
              <Link 
                href="/projects/ongoing/sampan-condominium" 
                className="condo-cta group relative overflow-hidden bg-[#101615] text-[#F7F4ED] text-[10px] font-semibold uppercase tracking-[0.3em] px-10 py-5 transition-colors duration-500 ease-in-out hover:text-[#101615] flex items-center gap-3"
              >
                <span className="absolute inset-0 bg-[#009D4E] translate-y-full group-hover:translate-y-0 transition-transform duration-500 ease-[cubic-bezier(0.22,1,0.36,1)] z-0"></span>
                <span className="relative z-10 flex items-center gap-3">
                  See the Condominium
                  <svg className="w-4 h-4 transition-transform duration-300 group-hover:translate-x-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" d="M14 5l7 7m0 0l-7 7m7-7H3"></path>
                  </svg>
                </span>
              </Link>

              <a 
                href="https://wa.me/8801000000000" 
                target="_blank"
                rel="noopener noreferrer"
                className="condo-cta group relative overflow-hidden border border-[#101615]/20 text-[#101615] text-[10px] font-semibold uppercase tracking-[0.3em] px-10 py-5 transition-colors duration-500 ease-in-out hover:border-[#101615] hover:text-[#F7F4ED] flex items-center gap-3"
              >
                <span className="absolute inset-0 bg-[#101615] translate-y-full group-hover:translate-y-0 transition-transform duration-500 ease-[cubic-bezier(0.22,1,0.36,1)] z-0"></span>
                <span className="relative z-10 flex items-center gap-3">
                  Chat on WhatsApp
                  <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51l-.57-.01c-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z"/>
                  </svg>
                </span>
              </a>
            </div>

          </div>

          {/* --- Right Column: Immersive Architectural Image --- */}
          <div className="lg:col-span-7 order-1 lg:order-2 relative h-[60vh] lg:h-[90vh] w-full">
            
            {/* Fine Gold Vertical Rule */}
            <div className="absolute top-0 bottom-0 left-0 w-px bg-[#101615]/10 hidden lg:block"></div>
            
            {/* Image Clip Path Wrapper */}
            <div className="condo-img-wrapper absolute inset-0 lg:left-12 overflow-hidden">
              {/* Parallax Inner Wrapper */}
              <div className="condo-img-parallax absolute inset-0 will-change-transform">
                <img 
                  src="https://images.unsplash.com/photo-1515263487990-61b07816b324?q=80&w=2070&auto=format&fit=crop" 
                  alt="Sampan Condominium G+9 Architectural Concept" 
                  className="condo-img w-full h-full object-cover will-change-transform"
                />
              </div>
              
              {/* Subtle Gradient Overlay for Image Depth */}
              <div className="absolute inset-0 bg-gradient-to-t from-[#101615]/40 via-transparent to-[#101615]/10 pointer-events-none"></div>

              {/* Floating Architectural Metadata */}
              <div className="condo-meta absolute bottom-8 right-8 text-right text-[#F7F4ED] z-10">
                <div className="text-[9px] uppercase tracking-[0.3em] opacity-80 mb-2">Proximity</div>
                <div className="text-sm font-lux-serif">Beside Express Highway Inn</div>
                <div className="w-24 h-px bg-[#009D4E] ml-auto mt-2"></div>
              </div>
            </div>

          </div>
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