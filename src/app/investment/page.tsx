// app/investment/page.tsx
"use client";

import { useLayoutEffect, useRef } from "react";
import Link from "next/link";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

const WHATSAPP_URL = "https://wa.me/8801000000000"; // Replace with actual config

export default function InvestmentPage() {
  const pageRef = useRef<HTMLElement>(null);

  useLayoutEffect(() => {
    gsap.registerPlugin(ScrollTrigger);

    const ctx = gsap.context(() => {
      const mm = gsap.matchMedia();

      // --- DESKTOP CINEMATIC EXPERIENCE ---
      mm.add("(min-width: 768px) and (prefers-reduced-motion: no-preference)", () => {

        // 1. Hero Entrance Timeline
        gsap.timeline({ delay: 0.3 })
          .to(".hero-img", { scale: 1, ease: "none", duration: 2.5 }, 0)
          .to(".hero-overlay", { opacity: 1, ease: "none", duration: 1.5 }, 0)
          .to(".anim-hero-line", { yPercent: 0, ease: "power4.out", duration: 1.5, stagger: 0.1 }, 0.3)
          .to(".anim-hero-fade", { y: 0, opacity: 1, ease: "power3.out", duration: 1.2, stagger: 0.1 }, 0.8);

        // 2. Hero Parallax
        gsap.to(".hero-img", {
          yPercent: 20, ease: "none",
          scrollTrigger: { trigger: "#hero", start: "top top", end: "bottom top", scrub: true }
        });

        // 3. Investment Cards Reveal (Clip-path + Stagger)
        gsap.utils.toArray<HTMLElement>(".invest-card").forEach((card) => {
          const img = card.querySelector<HTMLElement>(".card-img");
          const content = card.querySelectorAll<HTMLElement>(".card-anim");

          gsap.timeline({
            scrollTrigger: { trigger: card, start: "top 75%", end: "top 35%", scrub: 1 }
          })
            .fromTo(img,
              { clipPath: "inset(100% 0% 0% 0%)" },
              { clipPath: "inset(0% 0% 0% 0%)", ease: "power2.inOut", duration: 1 }
            )
            .fromTo(content,
              { y: 40, opacity: 0 },
              { y: 0, opacity: 1, ease: "power3.out", duration: 0.5, stagger: 0.1 },
              0.3
            );
        });

        // 4. Standard Mask Reveals for other sections
        const createReveal = (trigger: string) => {
          gsap.timeline({
            scrollTrigger: { trigger, start: "top 75%", end: "top 30%", scrub: 1 }
          })
            .fromTo(`${trigger} .anim-headline`, { yPercent: 110 }, { yPercent: 0, ease: "power3.out", duration: 0.6, stagger: 0.1 }, 0)
            .fromTo(`${trigger} .anim-fade`, { y: 40, opacity: 0 }, { y: 0, opacity: 1, ease: "power3.out", duration: 0.6, stagger: 0.08 }, 0.2)
            .fromTo(`${trigger} .anim-line-draw`, { scaleX: 0 }, { scaleX: 1, ease: "none", duration: 0.5, stagger: 0.05 }, 0.4);
        };

        createReveal("#section-options");
        createReveal("#section-guide");
        createReveal("#section-trust");
        createReveal("#section-cta");

        // 5. Closing CTA Image Reveal
        gsap.fromTo("#section-cta .cta-img",
          { clipPath: "inset(100% 0% 0% 0%)" },
          {
            clipPath: "inset(0% 0% 0% 0%)", ease: "power2.inOut", duration: 1.5,
            scrollTrigger: { trigger: "#section-cta", start: "top 80%", end: "top 30%", scrub: 1 }
          }
        );
      });

      // --- MOBILE & REDUCED MOTION FALLBACK ---
      mm.add("(max-width: 767px), (prefers-reduced-motion: reduce)", () => {
        gsap.set([".anim-hero-line", ".anim-hero-fade", ".anim-headline", ".anim-fade", ".card-anim", ".cta-anim"], { clearProps: "all" });
        gsap.set([".hero-img", ".hero-overlay", ".card-img", ".cta-img"], { clearProps: "all" });
      });

    }, pageRef);

    return () => {
      ctx.revert();
    };
  }, []);

  return (
    <main ref={pageRef} className="bg-[#F5F2EC] text-[#0B0B0D] font-lux-sans antialiased overflow-x-hidden">

      {/* ==========================================
          1. CINEMATIC INVESTMENT HERO
          ========================================== */}
      <section id="hero" className="relative h-screen min-h-[700px] w-full overflow-hidden bg-[#0B0B0D] text-[#F5F2EC] flex items-end">

        <div className="absolute inset-0 z-0">
          <img
            src="https://images.unsplash.com/photo-1460472178825-e5240623afd5?q=80&w=2070&auto=format&fit=crop"
            alt="Sampan Architectural Investment"
            className="hero-img w-full h-full object-cover opacity-70 will-change-transform"
            style={{ transform: "scale(1.2)" }}
          />
          <div
            className="hero-overlay absolute inset-0 bg-gradient-to-t from-[#0B0B0D] via-[#0B0B0D]/40 to-[#0B0B0D]/60"
            style={{ opacity: 0 }}
          ></div>
        </div>

        <div className="relative z-10 max-w-[1600px] mx-auto w-full px-6 md:px-12 lg:px-24 pb-16 md:pb-24">
          <div className="max-w-4xl">
            <div className="anim-hero-fade flex items-center gap-4 mb-8" style={{ opacity: 0, y: 40 }}>
              <span className="h-[1.5px] w-12 bg-[#19ABE1]"></span>
              <span className="text-[10px] md:text-[11px] font-medium uppercase tracking-[0.4em] text-[#19ABE1]">
                Investment Opportunities
              </span>
            </div>

            <h1 className="font-lux-serif text-[clamp(3rem,8vw,8rem)] leading-[0.9] tracking-[-0.02em] mb-8">
              <span className="block overflow-hidden pb-2">
                <span className="anim-hero-line block font-light" style={{ transform: "translateY(110%)" }}>Three ways to invest</span>
              </span>
              <span className="block overflow-hidden pb-2">
                <span className="anim-hero-line block italic text-[#19ABE1]" style={{ transform: "translateY(110%)" }}>with Sampan.</span>
              </span>
            </h1>

            <p className="anim-hero-fade text-base md:text-lg text-[#F5F2EC]/80 font-light leading-relaxed max-w-xl mb-12" style={{ opacity: 0, y: 40 }}>
              Own a share of land, join a club, or buy space in a building. Every route starts with documents you can read and a site you can visit.
            </p>

            <div className="anim-hero-fade flex flex-col sm:flex-row items-start gap-4" style={{ opacity: 0, y: 40 }}>
              <a href="#section-options" className="group relative overflow-hidden bg-[#19ABE1] text-[#0B0B0D] text-[10px] font-semibold uppercase tracking-[0.3em] px-10 py-5 flex items-center gap-3 transition-colors duration-500 hover:text-[#19ABE1]">
                <span className="absolute inset-0 bg-[#F5F2EC] translate-y-full group-hover:translate-y-0 transition-transform duration-500 ease-[cubic-bezier(0.22,1,0.36,1)] z-0"></span>
                <span className="relative z-10 flex items-center gap-3">Compare the options <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" d="M19 14l-7 7m0 0l-7-7m7 7V3"></path></svg></span>
              </a>
              <Link href="/contact" className="group relative overflow-hidden border border-[#F5F2EC]/30 text-[#F5F2EC] text-[10px] font-semibold uppercase tracking-[0.3em] px-10 py-5 flex items-center gap-3 transition-colors duration-500 hover:border-[#19ABE1] hover:text-[#0B0B0D] backdrop-blur-sm bg-[#0B0B0D]/20">
                <span className="absolute inset-0 bg-[#19ABE1] translate-y-full group-hover:translate-y-0 transition-transform duration-500 ease-[cubic-bezier(0.22,1,0.36,1)] z-0"></span>
                <span className="relative z-10">Book a site visit</span>
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* ==========================================
          2. THREE INVESTMENT OPTIONS
          ========================================== */}
      <section id="section-options" className="relative py-24 md:py-32 lg:py-40 px-6 md:px-12 lg:px-24 bg-[#F5F2EC] overflow-hidden">
        <div className="max-w-[1600px] mx-auto">

          <div className="max-w-2xl mb-16 md:mb-24">
            <div className="anim-fade flex items-center gap-4 mb-8">
              <span className="anim-line-draw block h-[1.5px] w-12 bg-[#19ABE1]"></span>
              <span className="text-[10px] font-medium uppercase tracking-[0.4em] text-[#19ABE1]">Investment Options</span>
            </div>
            <h2 className="font-lux-serif text-[clamp(2.5rem,5vw,4.5rem)] leading-[1.05] tracking-[-0.02em] mb-8">
              <span className="block overflow-hidden pb-2"><span className="anim-headline block font-light">Choose the path that</span></span>
              <span className="block overflow-hidden pb-2"><span className="anim-headline block italic text-[#19ABE1]">fits your goals.</span></span>
            </h2>
            <p className="anim-fade text-base text-[#0B0B0D]/70 font-light leading-relaxed">
              Three flexible ways to invest, each with its own lifestyle, benefits and long-term potential.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 md:gap-6 lg:gap-12">

            {/* Card 01 - Land Share */}
            <div className="invest-card flex flex-col group">
              <div className="card-img relative aspect-[4/5] overflow-hidden mb-6 will-change-transform">
                <img src="https://images.unsplash.com/photo-1500382017468-9049fed747ef?q=80&w=2070&auto=format&fit=crop" alt="Aerial land development" className="w-full h-full object-cover transition-transform duration-1000 group-hover:scale-105" />
                <div className="absolute inset-0 bg-gradient-to-t from-[#0B0B0D]/40 to-transparent"></div>
                <span className="absolute top-4 left-4 text-[#F5F2EC] font-lux-serif text-4xl font-light">01</span>
              </div>
              <div className="flex flex-col flex-grow">
                <h3 className="card-anim font-lux-serif text-3xl font-light mb-3">Land Share</h3>
                <p className="card-anim text-sm text-[#0B0B0D]/70 font-light leading-relaxed mb-6">Own an undivided share of project land in proportion to the space you buy.</p>
                <div className="mt-auto">
                  <div className="card-anim border-t border-[#0B0B0D]/10 pt-4 mb-6">
                    <p className="text-[9px] uppercase tracking-[0.3em] text-[#19ABE1] mb-2">Projects</p>
                    <ul className="text-xs text-[#0B0B0D]/80 space-y-1">
                      <li>Sampan Metro Square</li>
                      <li>Sampan Condominium</li>
                    </ul>
                  </div>
                  <Link href="/projects" className="card-anim group inline-flex items-center gap-4 text-[10px] font-semibold uppercase tracking-[0.3em] text-[#0B0B0D] hover:text-[#19ABE1] transition-colors">
                    Explore land share
                    <span className="relative w-12 h-[1.5px] bg-[#0B0B0D] overflow-hidden">
                      <span className="absolute inset-0 bg-[#19ABE1] translate-x-[-100%] group-hover:translate-x-0 transition-transform duration-500"></span>
                    </span>
                  </Link>
                </div>
              </div>
            </div>

            {/* Card 02 - Membership */}
            <div className="invest-card flex flex-col group">
              <div className="card-img relative aspect-[4/5] overflow-hidden mb-6 will-change-transform">
                <img src="https://images.unsplash.com/photo-1580060839134-75a5edca2e99?q=80&w=2070&auto=format&fit=crop" alt="Resort and golf course" className="w-full h-full object-cover transition-transform duration-1000 group-hover:scale-105" />
                <div className="absolute inset-0 bg-gradient-to-t from-[#0B0B0D]/40 to-transparent"></div>
                <span className="absolute top-4 left-4 text-[#F5F2EC] font-lux-serif text-4xl font-light">02</span>
              </div>
              <div className="flex flex-col flex-grow">
                <h3 className="card-anim font-lux-serif text-3xl font-light mb-3">Membership</h3>
                <p className="card-anim text-sm text-[#0B0B0D]/70 font-light leading-relaxed mb-6">Join a club and lounge on the highway or in Sylhet.</p>
                <div className="mt-auto">
                  <div className="card-anim border-t border-[#0B0B0D]/10 pt-4 mb-6">
                    <p className="text-[9px] uppercase tracking-[0.3em] text-[#19ABE1] mb-2">Projects</p>
                    <ul className="text-xs text-[#0B0B0D]/80 space-y-1">
                      <li>Express Highway Inn</li>
                      <li>Sampan Agro & Golf Resort</li>
                    </ul>
                  </div>
                  <Link href="/projects" className="card-anim group inline-flex items-center gap-4 text-[10px] font-semibold uppercase tracking-[0.3em] text-[#0B0B0D] hover:text-[#19ABE1] transition-colors">
                    Explore membership
                    <span className="relative w-12 h-[1.5px] bg-[#0B0B0D] overflow-hidden">
                      <span className="absolute inset-0 bg-[#19ABE1] translate-x-[-100%] group-hover:translate-x-0 transition-transform duration-500"></span>
                    </span>
                  </Link>
                </div>
              </div>
            </div>

            {/* Card 03 - Apartment & Commercial */}
            <div className="invest-card flex flex-col group">
              <div className="card-img relative aspect-[4/5] overflow-hidden mb-6 will-change-transform">
                <img src="https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?q=80&w=2070&auto=format&fit=crop" alt="Commercial building architecture" className="w-full h-full object-cover transition-transform duration-1000 group-hover:scale-105" />
                <div className="absolute inset-0 bg-gradient-to-t from-[#0B0B0D]/40 to-transparent"></div>
                <span className="absolute top-4 left-4 text-[#F5F2EC] font-lux-serif text-4xl font-light">03</span>
              </div>
              <div className="flex flex-col flex-grow">
                <h3 className="card-anim font-lux-serif text-3xl font-light mb-3">Apartment & Commercial Space</h3>
                <p className="card-anim text-sm text-[#0B0B0D]/70 font-light leading-relaxed mb-6">Buy units in a building on the Dhaka–Chittagong Highway.</p>
                <div className="mt-auto">
                  <div className="card-anim border-t border-[#0B0B0D]/10 pt-4 mb-6">
                    <p className="text-[9px] uppercase tracking-[0.3em] text-[#19ABE1] mb-2">Projects</p>
                    <ul className="text-xs text-[#0B0B0D]/80 space-y-1">
                      <li>Sampan Condominium</li>
                      <li>Sampan Trade Emporium</li>
                    </ul>
                  </div>
                  <Link href="/projects" className="card-anim group inline-flex items-center gap-4 text-[10px] font-semibold uppercase tracking-[0.3em] text-[#0B0B0D] hover:text-[#19ABE1] transition-colors">
                    See available space
                    <span className="relative w-12 h-[1.5px] bg-[#0B0B0D] overflow-hidden">
                      <span className="absolute inset-0 bg-[#19ABE1] translate-x-[-100%] group-hover:translate-x-0 transition-transform duration-500"></span>
                    </span>
                  </Link>
                </div>
              </div>
            </div>

          </div>

          {/* Risk Disclaimer */}
          <div className="anim-fade mt-16 md:mt-24 border-t border-[#0B0B0D]/10 pt-8 flex items-start gap-4 max-w-3xl">
            <svg className="w-5 h-5 text-[#19ABE1] mt-0.5 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"></path></svg>
            <p className="text-xs text-[#0B0B0D]/50 font-light leading-relaxed">
              Property values, rental income and membership benefits are not guaranteed. Read the documents and terms before you decide.
            </p>
          </div>
        </div>
      </section>

      {/* ==========================================
          3. WHICH IS RIGHT FOR ME? (Decision Guide)
          ========================================== */}
      <section id="section-guide" className="relative py-24 md:py-32 lg:py-40 px-6 md:px-12 lg:px-24 bg-[#0B0B0D] text-[#F5F2EC] overflow-hidden">
        <div className="max-w-[1400px] mx-auto">

          <div className="max-w-2xl mb-16 md:mb-24">
            <div className="anim-fade flex items-center gap-4 mb-8">
              <span className="anim-line-draw block h-[1.5px] w-12 bg-[#19ABE1]"></span>
              <span className="text-[10px] font-medium uppercase tracking-[0.4em] text-[#19ABE1]">Decision Guide</span>
            </div>
            <h2 className="font-lux-serif text-[clamp(2.5rem,5vw,4.5rem)] leading-[1.05] tracking-[-0.02em] mb-8">
              <span className="block overflow-hidden pb-2"><span className="anim-headline block font-light">Which is right</span></span>
              <span className="block overflow-hidden pb-2"><span className="anim-headline block italic text-[#19ABE1]">for me?</span></span>
            </h2>
            <p className="anim-fade text-base text-[#F5F3EE]/70 font-light leading-relaxed">A quick guide to help you decide.</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-px bg-[#F5F3EE]/10 border border-[#F5F3EE]/10">

            {[
              { need: "Want a lower entry point and no building to manage?", rec: "Land Share" },
              { need: "Want access, dining and a lounge?", rec: "Membership" },
              { need: "Want space that earns rent or runs a business?", rec: "Apartment or commercial space" }
            ].map((item, i) => (
              <div key={i} className="anim-fade bg-[#0B0B0D] p-8 md:p-12 flex flex-col justify-between min-h-[300px] group hover:bg-[#101615] transition-colors duration-500">
                <p className="font-lux-serif text-2xl md:text-3xl font-light leading-tight text-[#F5F3EE]/90 mb-12">
                  {item.need}
                </p>
                <div>
                  <p className="text-[9px] uppercase tracking-[0.3em] text-[#F5F3EE]/40 mb-2">Recommendation</p>
                  <h3 className="font-lux-serif text-xl md:text-2xl italic text-[#19ABE1]">{item.rec}</h3>
                  <div className="anim-line-draw block h-px w-16 bg-[#19ABE1] mt-4 origin-left"></div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ==========================================
          4. TRUST AND TRANSPARENCY
          ========================================== */}
      <section id="section-trust" className="relative py-20 md:py-28 px-6 md:px-12 lg:px-24 bg-[#EAE5DB] overflow-hidden">
        <div className="max-w-[1400px] mx-auto">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-12 md:gap-8 items-start">
            <div className="md:col-span-1">
              <div className="anim-fade flex items-center gap-4 mb-4">
                <span className="anim-line-draw block h-[1.5px] w-12 bg-[#19ABE1]"></span>
                <span className="text-[10px] font-medium uppercase tracking-[0.4em] text-[#19ABE1]">Our Commitment</span>
              </div>
            </div>

            <div className="md:col-span-3 grid grid-cols-1 sm:grid-cols-2 md:grid-cols-2 lg:grid-cols-4 gap-8 md:gap-6">
              {["Clear title documents", "Site visits on request", "Remote buying for NRBs", "Backed by Sampan Group"].map((text, i) => (
                <div key={i} className="anim-fade border-l border-[#0B0B0D]/20 pl-4">
                  <p className="font-lux-serif text-lg font-light leading-snug text-[#0B0B0D]">{text}</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* ==========================================
          5. CINEMATIC CLOSING CTA
          ========================================== */}
      <section id="section-cta" className="relative min-h-[90vh] md:min-h-screen w-full overflow-hidden bg-[#0B0B0D] text-[#F5F2EC] flex items-center justify-center text-center">

        <div className="absolute inset-0 z-0">
          <div className="cta-img absolute inset-0 will-change-transform" style={{ clipPath: "inset(100% 0% 0% 0%)" }}>
            <img
              src="https://images.unsplash.com/photo-1448630360428-65456885c650?q=80&w=2070&auto=format&fit=crop"
              alt="Sampan Investment Architecture"
              className="w-full h-full object-cover opacity-40"
            />
          </div>
          <div className="absolute inset-0 bg-gradient-to-t from-[#0B0B0D] via-[#0B0B0D]/80 to-[#0B0B0D]/80"></div>
        </div>

        <div className="relative z-10 max-w-4xl mx-auto px-6 md:px-12 py-24">
          <div className="anim-fade flex items-center justify-center gap-4 mb-8">
            <span className="h-[1.5px] w-12 bg-[#19ABE1]"></span>
            <span className="text-[10px] font-medium uppercase tracking-[0.4em] text-[#19ABE1]">Invest in a brighter tomorrow</span>
          </div>

          <h2 className="font-lux-serif text-[clamp(3rem,8vw,7rem)] leading-[0.95] tracking-[-0.02em] mb-10 font-light">
            <span className="block overflow-hidden pb-2"><span className="anim-headline block">Your next chapter</span></span>
            <span className="block overflow-hidden pb-2"><span className="anim-headline block italic text-[#19ABE1]">starts here.</span></span>
          </h2>

          <p className="anim-fade text-base md:text-lg text-[#F5F3EE]/70 font-light leading-relaxed mb-12 max-w-xl mx-auto">
            Explore the options, review the documents, and take the first step towards a smarter investment with Sampan.
          </p>

          <div className="anim-fade flex flex-col sm:flex-row items-center justify-center gap-4">
            <a href="#section-options" className="group relative overflow-hidden bg-[#19ABE1] text-[#0B0B0D] text-[10px] font-semibold uppercase tracking-[0.3em] px-12 py-5 flex items-center gap-3 transition-colors duration-500 hover:text-[#19ABE1]">
              <span className="absolute inset-0 bg-[#F5F3EE] translate-y-full group-hover:translate-y-0 transition-transform duration-500 z-0"></span>
              <span className="relative z-10 flex items-center gap-3">Compare the options <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" d="M19 14l-7 7m0 0l-7-7m7 7V3"></path></svg></span>
            </a>
            <Link href="/contact" className="group relative overflow-hidden border border-[#F5F3EE]/30 text-[#F5F3EE] text-[10px] font-semibold uppercase tracking-[0.3em] px-12 py-5 flex items-center gap-3 transition-colors duration-500 hover:border-[#19ABE1] hover:text-[#0B0B0D] backdrop-blur-sm bg-[#0B0B0D]/20">
              <span className="absolute inset-0 bg-[#19ABE1] translate-y-full group-hover:translate-y-0 transition-transform duration-500 z-0"></span>
              <span className="relative z-10">Book a site visit</span>
            </Link>
          </div>
        </div>
      </section>

      <style jsx global>{`
        @import url('https://fonts.googleapis.com/css2?family=Cormorant+Garamond:ital,wght@0,300;0,400;0,500;0,600;1,300;1,400;1,500&family=Inter:wght@300;400;500;600&display=swap');
        .font-lux-serif { font-family: 'Cormorant Garamond', serif; }
        .font-lux-sans { font-family: 'Inter', sans-serif; }
      `}</style>
    </main>
  );
}