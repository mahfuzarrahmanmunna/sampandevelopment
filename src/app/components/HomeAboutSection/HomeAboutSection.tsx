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

      // --- Reduced motion fallback: show all panels in a normal vertical stack ---
      mm.add("(prefers-reduced-motion: reduce)", () => {
        if (trackRef.current) {
          gsap.set(trackRef.current, { clearProps: "transform" });
        }
        gsap.set(".parallax-img", { clearProps: "transform" });
        gsap.set(".img-reveal", { clearProps: "clipPath" });
      });

      // --- Desktop / tablet (>=768px)full cinematic horizontal scroll ---
      mm.add("(min-width: 768px) and (prefers-reduced-motion: no-preference)", () => {
        const track = trackRef.current;
        if (!track) return;

        const totalScroll = track.scrollWidth - window.innerWidth;

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
          },
        });

        // Horizontal parallax on images
        gsap.utils.toArray<HTMLElement>(".parallax-img").forEach((img) => {
          gsap.fromTo(
            img,
            { xPercent: -15 },
            {
              xPercent: 15,
              ease: "none",
              scrollTrigger: {
                trigger: img.closest(".panel"),
                containerAnimation: scrollTween,
                start: "left right",
                end: "right left",
                scrub: true,
              },
            }
          );
        });

        // Horizontal clip-path reveals
        gsap.utils.toArray<HTMLElement>(".img-reveal").forEach((container) => {
          gsap.fromTo(
            container,
            { clipPath: "inset(0% 0% 0% 100%)" },
            {
              clipPath: "inset(0% 0% 0% 0%)",
              ease: "none",
              scrollTrigger: {
                trigger: container,
                containerAnimation: scrollTween,
                start: "left 80%",
                end: "left 20%",
                scrub: true,
              },
            }
          );
        });
      });

      // --- Mobile (<768px)same horizontal scroll-jacking, tuned for touch ---
      mm.add("(max-width: 767px) and (prefers-reduced-motion: no-preference)", () => {
        const track = trackRef.current;
        if (!track) return;

        // Use full viewport width on mobile (account for no scrollbar discrepancy)
        const viewportWidth = window.innerWidth;
        const totalScroll = track.scrollWidth - viewportWidth;

        // If track doesn't overflow, skip pinning entirely
        if (totalScroll <= 0) return;

        const scrollTween = gsap.to(track, {
          x: () => -totalScroll,
          ease: "none",
          scrollTrigger: {
            trigger: sectionRef.current,
            start: "top top",
            end: () => `+=${totalScroll}`,
            scrub: 1.2, // slightly softer scrub for touch momentum
            pin: true,
            pinSpacing: true,
            anticipatePin: 1, // helps mobile scroll jump
            invalidateOnRefresh: true,
          },
        });

        // Lighter parallax on mobile for performance
        gsap.utils.toArray<HTMLElement>(".parallax-img").forEach((img) => {
          gsap.fromTo(
            img,
            { xPercent: -8 },
            {
              xPercent: 8,
              ease: "none",
              scrollTrigger: {
                trigger: img.closest(".panel"),
                containerAnimation: scrollTween,
                start: "left right",
                end: "right left",
                scrub: true,
              },
            }
          );
        });

        // Clip-path revealssame effect, tuned start/end
        gsap.utils.toArray<HTMLElement>(".img-reveal").forEach((container) => {
          gsap.fromTo(
            container,
            { clipPath: "inset(0% 0% 0% 100%)" },
            {
              clipPath: "inset(0% 0% 0% 0%)",
              ease: "none",
              scrollTrigger: {
                trigger: container,
                containerAnimation: scrollTween,
                start: "left 85%",
                end: "left 30%",
                scrub: true,
              },
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
      className="relative w-full overflow-hidden bg-[#101615] font-lux-sans antialiased"
    >
      {/* 
        Horizontal trackforced to row layout on ALL viewports now.
        Each panel is full-viewport width so horizontal pinning works on mobile too.
      */}
      <div
        ref={trackRef}
        className="flex w-max flex-row flex-nowrap items-stretch h-[100svh]"
      >
        {/* --- Panel 1: Ivory Intro --- */}
        <div className="panel relative flex h-full w-screen flex-col justify-center bg-[#F7F4ED] px-6 text-[#101615] sm:px-8 md:px-16 lg:px-24">
          <div className="mb-8 flex items-center gap-4 overflow-hidden">
            <span className="block h-[1.5px] w-12 bg-[#009D4E] sm:w-16"></span>
            <span className="text-[10px] font-medium uppercase tracking-[0.4em] text-[#101615]/60 md:text-[11px]">
              About Sampan Development
            </span>
          </div>

          <h2 className="font-lux-serif text-[clamp(2.8rem,12vw,11rem)] leading-[0.9] tracking-[-0.03em] font-light md:text-[clamp(3rem,9vw,11rem)]">
            Land and
            <br />
            construction,
          </h2>

          {/* Bottom decorative index */}
          <div className="absolute bottom-6 left-6 text-[10px] uppercase tracking-[0.3em] text-[#101615]/40 sm:bottom-8 sm:left-8 md:left-24">
            01 / Identity
          </div>
        </div>

        {/* --- Panel 2: Obsidian Narrative --- */}
        <div className="panel relative flex h-full w-screen flex-col justify-center bg-[#101615] px-6 py-16 text-[#F7F4ED] sm:px-8 md:px-16 lg:px-24 md:py-0">
          <h2 className="mb-8 font-lux-serif text-[clamp(2.8rem,12vw,11rem)] leading-[0.9] tracking-[-0.03em] italic font-normal text-[#009D4E] md:mb-12 md:text-[clamp(3rem,9vw,11rem)]">
            done in the open.
          </h2>

          <div className="grid max-w-4xl grid-cols-1 gap-8 md:grid-cols-2 md:gap-12">
            <p className="text-sm font-light leading-relaxed text-[#F7F4ED]/70 sm:text-base md:text-lg">
              Sampan Development Ltd is the land and construction arm of Sampan Group. We manage land, run land-share projects, and build apartments, commercial spaces, and highway destinations. Every project starts with documented ownership, so buyers in Bangladesh and abroad know exactly what they own.
            </p>

            {/* Stats Integration */}
            <div className="grid grid-cols-3 gap-2 sm:gap-4">
              <div className="flex flex-col gap-2 border-r border-[#F7F4ED]/15 pr-2 sm:pr-4">
                <span className="font-lux-serif text-2xl text-[#009D4E] font-light sm:text-3xl md:text-4xl">
                  [ 01 ]
                </span>
                <span className="text-[8px] font-medium uppercase tracking-[0.2em] text-[#F7F4ED]/50 sm:text-[9px] sm:tracking-[0.25em]">
                  Years in Business
                </span>
              </div>
              <div className="flex flex-col gap-2 border-r border-[#F7F4ED]/15 px-2 sm:px-4">
                <span className="font-lux-serif text-2xl text-[#009D4E] font-light sm:text-3xl md:text-4xl">
                  [ 02 ]
                </span>
                <span className="text-[8px] font-medium uppercase tracking-[0.2em] text-[#F7F4ED]/50 sm:text-[9px] sm:tracking-[0.25em]">
                  Projects Delivered
                </span>
              </div>
              <div className="flex flex-col gap-2 pl-2 sm:pl-4">
                <span className="font-lux-serif text-2xl text-[#009D4E] font-light sm:text-3xl md:text-4xl">
                  [ 03 ]
                </span>
                <span className="text-[8px] font-medium uppercase tracking-[0.2em] text-[#F7F4ED]/50 sm:text-[9px] sm:tracking-[0.25em]">
                  Units Handed Over
                </span>
              </div>
            </div>
          </div>

          <div className="absolute bottom-6 right-6 text-[10px] uppercase tracking-[0.3em] text-[#F7F4ED]/40 sm:bottom-8 sm:right-8 md:right-24">
            02 / Philosophy
          </div>
        </div>

        {/* --- Panel 3: Immersive Architectural Image --- */}
        <div className="panel relative flex h-full w-screen items-center justify-center overflow-hidden bg-[#101615] md:w-[80vw]">
          <div className="img-reveal absolute inset-0 flex items-center justify-center">
            <div className="parallax-img absolute inset-0 h-full w-full scale-110">
              <img
                src="/images/projects/metro-square/sampanmetrosquare.jpeg"
                alt="Premium architectural commercial and residential development"
                className="h-full w-full object-cover object-top"
                loading="lazy"
              />
            </div>
            {/* Subtle gradient overlay */}
            <div className="pointer-events-none absolute inset-0 bg-gradient-to-t from-[#101615]/50 via-transparent to-transparent"></div>
          </div>

          <div className="relative z-10 mr-6 mb-8 self-end text-right sm:mr-8 md:mb-12 md:mr-12">
            <div className="mb-2 text-[9px] uppercase tracking-[0.3em] text-[#F7F4ED]/80">
              Fig 01 / Ashulia Complex
            </div>
            <div className="ml-auto h-px w-16 bg-[#009D4E] sm:w-24"></div>
          </div>
        </div>

        {/* --- Panel 4: Ivory CTA & Secondary Image --- */}
        <div className="panel flex h-full w-screen flex-col items-stretch bg-[#F7F4ED] text-[#101615] md:w-[60vw] md:flex-row md:items-center">
          <div className="flex h-auto w-full flex-col justify-center px-6 py-10 sm:px-8 md:h-full md:w-1/2 md:px-12 md:py-0">
            <h3 className="mb-6 font-lux-serif text-3xl font-light leading-tight md:text-4xl">
              Know exactly
              <br />
              what you own.
            </h3>

            <Link
              href="/about"
              className="group mt-4 inline-flex items-center gap-3 text-[11px] font-semibold uppercase tracking-[0.3em] text-[#101615] transition-colors duration-300 hover:text-[#009D4E] sm:gap-4"
            >
              Our story
              <span className="relative h-[1.5px] w-10 overflow-hidden bg-[#101615]/40 sm:w-12">
                <span className="absolute inset-0 -translate-x-full bg-[#009D4E] transition-transform duration-500 ease-[cubic-bezier(0.22,1,0.36,1)] group-hover:translate-x-0"></span>
              </span>
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
            </Link>
          </div>

          <div className="relative h-[40svh] w-full overflow-hidden md:mr-12 md:h-[70%] md:w-3/2">
            <div className="img-reveal absolute inset-0">
              <div className="parallax-img absolute inset-0 h-full w-full scale-110">
                <img
                  src="/images/roni/Sampan_Trade_Emporium_Rooftop_Tower.png"
                  alt="Architectural construction detail"
                  className="h-full w-full object-contain"
                  loading="lazy"
                />
              </div>
            </div>
          </div>
        </div>

        {/* --- Panel 5: Obsidian Outro --- */}
        <div className="panel flex h-full w-screen flex-col items-center justify-center bg-[#101615] px-6 text-center md:w-[40vw]">
          <span className="mb-4 text-2xl text-[#009D4E]" aria-hidden="true">
            ✦
          </span>
          <p className="max-w-[200px] text-[10px] uppercase tracking-[0.4em] text-[#F7F4ED]/40">
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