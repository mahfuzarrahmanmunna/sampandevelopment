// app/components/AwardsGallery.tsx
"use client";

import { useState, useEffect, useRef, useCallback } from "react";
import Image from "next/image";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { useGSAP } from "@gsap/react";

gsap.registerPlugin(useGSAP, ScrollTrigger);

/* ------------------------------------------------------------------ */
/*  DATA                                                               */
/* ------------------------------------------------------------------ */

const galleryImages = [
  { id: "img-01", src: "/images/awards/Our-Curated-Gallery-Photo-Frame.webp" },
  { id: "img-02", src: "/images/awards/Our-Curated-Gallery-Photo-Frame-1.webp" },
  { id: "img-03", src: "/images/awards/Our-Curated-Gallery-Photo-Frame-2.webp" },
  { id: "img-04", src: "/images/awards/Our-Curated-Gallery-Photo-Frame-3.webp" },
  { id: "img-05", src: "/images/awards/Our-Curated-Gallery-Photo-Frame-4.webp" },
  { id: "img-06", src: "/images/awards/Our-Curated-Gallery-Photo-Frame-5.webp" },
  { id: "img-07", src: "/images/awards/boss.jpeg" },
  { id: "img-08", src: "/images/awards/purple.jpeg" },
  { id: "img-09", src: "/images/awards/mou.jpeg" },
  { id: "img-10", src: "/images/awards/express.jpeg" },
];

const marqueeRow1 = [...galleryImages, ...galleryImages];
const marqueeRow2 = [...galleryImages.slice().reverse(), ...galleryImages.slice().reverse()];

/* ------------------------------------------------------------------ */
/*  COMPONENT                                                          */
/* ------------------------------------------------------------------ */

export default function AwardsGallery() {
  const containerRef = useRef<HTMLDivElement>(null);
  const lightboxRef = useRef<HTMLDivElement>(null);
  const [activeIndex, setActiveIndex] = useState<number | null>(null);

  const showNext = useCallback(() => {
    setActiveIndex((c) => (c !== null ? (c + 1) % galleryImages.length : null));
  }, []);

  const showPrev = useCallback(() => {
    setActiveIndex((c) => (c !== null ? (c - 1 + galleryImages.length) % galleryImages.length : null));
  }, []);

  const closeLightbox = useCallback(() => setActiveIndex(null), []);

  /* --- Keyboard accessibility --- */
  useEffect(() => {
    if (activeIndex === null) return;
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") closeLightbox();
      if (e.key === "ArrowRight") showNext();
      if (e.key === "ArrowLeft") showPrev();
    };
    window.addEventListener("keydown", handleKeyDown);
    document.body.style.overflow = "hidden";
    return () => {
      window.removeEventListener("keydown", handleKeyDown);
      document.body.style.overflow = "";
    };
  }, [activeIndex, closeLightbox, showNext, showPrev]);

  /* --- Lightbox entrance & image transition --- */
  useGSAP(
    () => {
      if (!lightboxRef.current || activeIndex === null) return;
      gsap.fromTo(
        lightboxRef.current,
        { opacity: 0 },
        { opacity: 1, duration: 0.4, ease: "power3.out" }
      );
      gsap.fromTo(
        ".lightbox-image-wrapper",
        { scale: 0.95, opacity: 0, filter: "blur(8px)" },
        { scale: 1, opacity: 1, filter: "blur(0px)", duration: 0.6, ease: "power4.out", delay: 0.1 }
      );
    },
    { scope: containerRef, dependencies: [activeIndex] }
  );

  /* --- Marquee + Header Entrance --- */
  useGSAP(
    () => {
      const mm = gsap.matchMedia();

      mm.add("(prefers-reduced-motion: reduce)", () => {
        gsap.set(".marquee-track-1, .marquee-track-2", { x: 0, xPercent: 0 });
      });

      mm.add("(min-width: 768px) and (prefers-reduced-motion: no-preference)", () => {
        gsap.set(".anim-eyebrow", { opacity: 0, x: -20 });
        gsap.set(".anim-headline", { yPercent: 110 });
        gsap.set(".anim-fade", { opacity: 0, y: 40 });
        gsap.set(".anim-line-draw", { scaleX: 0, transformOrigin: "left" });

        const tl = gsap.timeline({
          scrollTrigger: {
            trigger: ".awd-header",
            start: "top 80%",
            end: "top 30%",
            scrub: 1,
          },
        });
        tl.to(".anim-eyebrow", { opacity: 1, x: 0, ease: "power3.out", duration: 0.4 }, 0)
          .to(".anim-headline", { yPercent: 0, ease: "power4.out", duration: 0.6, stagger: 0.1 }, 0.1)
          .to(".anim-fade", { opacity: 1, y: 0, ease: "power3.out", duration: 0.6, stagger: 0.08 }, 0.3)
          .to(".anim-line-draw", { scaleX: 1, ease: "power2.out", duration: 0.5, stagger: 0.05 }, 0.5);

        const track1 = containerRef.current?.querySelector(".marquee-track-1") as HTMLElement;
        const track2 = containerRef.current?.querySelector(".marquee-track-2") as HTMLElement;

        if (track1) {
          const tl1 = gsap.timeline({ repeat: -1 });
          tl1.fromTo(track1, { xPercent: -50 }, { xPercent: 0, duration: 45, ease: "none" });
          const row1 = containerRef.current?.querySelector(".row-1-wrapper");
          if (row1) {
            row1.addEventListener("mouseenter", () => gsap.to(tl1, { timeScale: 0.2, duration: 0.5 }));
            row1.addEventListener("mouseleave", () => gsap.to(tl1, { timeScale: 1, duration: 0.5 }));
          }
        }
        if (track2) {
          const tl2 = gsap.timeline({ repeat: -1 });
          tl2.fromTo(track2, { xPercent: 0 }, { xPercent: -50, duration: 50, ease: "none" });
          const row2 = containerRef.current?.querySelector(".row-2-wrapper");
          if (row2) {
            row2.addEventListener("mouseenter", () => gsap.to(tl2, { timeScale: 0.2, duration: 0.5 }));
            row2.addEventListener("mouseleave", () => gsap.to(tl2, { timeScale: 1, duration: 0.5 }));
          }
        }
      });

      mm.add("(max-width: 767px) and (prefers-reduced-motion: no-preference)", () => {
        gsap.set(".anim-eyebrow, .anim-headline, .anim-fade", { opacity: 0, y: 30 });
        gsap.set(".anim-line-draw", { scaleX: 0, transformOrigin: "left" });

        const tl = gsap.timeline({
          scrollTrigger: {
            trigger: ".awd-header",
            start: "top 85%",
            end: "top 45%",
            scrub: 1,
          },
        });
        tl.to(".anim-eyebrow", { opacity: 1, y: 0, ease: "power3.out", duration: 0.5 }, 0)
          .to(".anim-headline", { opacity: 1, y: 0, ease: "power4.out", duration: 0.6, stagger: 0.08 }, 0.1)
          .to(".anim-fade", { opacity: 1, y: 0, ease: "power3.out", duration: 0.5, stagger: 0.06 }, 0.3)
          .to(".anim-line-draw", { scaleX: 1, ease: "power2.out", duration: 0.5, stagger: 0.04 }, 0.4);

        const track1 = containerRef.current?.querySelector(".marquee-track-1") as HTMLElement;
        if (track1) {
          const tl1 = gsap.timeline({ repeat: -1 });
          tl1.fromTo(track1, { xPercent: -50 }, { xPercent: 0, duration: 40, ease: "none" });
        }
      });
    },
    { scope: containerRef }
  );

  return (
    <section
      ref={containerRef}
      className="relative w-full overflow-hidden bg-[#F5F3EE] font-lux-sans antialiased pt-24"
    >
      {/* Ambient Gradient Halo */}
      <div className="pointer-events-none absolute inset-0 opacity-70">
        <div className="absolute left-1/2 top-1/3 h-[600px] w-[600px] -translate-x-1/2 -translate-y-1/2 rounded-full bg-[radial-gradient(circle,_rgba(198,160,107,0.12)_0%,_transparent_70%)] blur-3xl"></div>
      </div>

      {/* Kinetic Background Typography */}
      <div className="pointer-events-none absolute left-0 top-1/2 w-full -translate-y-1/2 overflow-hidden whitespace-nowrap opacity-[0.04]">
        <span className="font-lux-serif pr-8 text-[18vw] leading-none text-[#101615]">ARCHIVE</span>
      </div>

      <div className="relative mx-auto max-w-[1600px] px-5 sm:px-6 md:px-12 lg:px-24">
        {/* ====== EDITORIAL HEADER ====== */}
        <div className="awd-header mb-12 flex flex-col justify-between gap-8 border-b border-[#101615]/10 pb-8 md:mb-20 lg:flex-row lg:items-end">
          <div>

            <h2 className="font-lux-serif text-[clamp(2.5rem,7vw,6rem)] leading-[0.92] tracking-[-0.03em] text-[#101615]">
              <span className="block overflow-hidden pb-2">
                <span className="anim-headline block font-light">Recognition &amp;</span>
              </span>
              <span className="block overflow-hidden pb-2">
                <span className="anim-headline block font-normal italic text-[#009D4E]">Achievements</span>
              </span>
            </h2>
          </div>

          <p className="anim-fade max-w-xs text-sm leading-relaxed text-[#101615]/60 font-light lg:text-right">
            Click to enlarge. A visual timeline of milestones that shaped the foundation of Sampan Group.
          </p>
        </div>
      </div>

      {/* ====== DUAL-ROW MARQUEE ====== */}
      <div className="relative flex flex-col gap-4 md:gap-8">
        {/* Row 1 — Left to Right */}
        <div
          className="row-1-wrapper relative w-full overflow-hidden"
          style={{
            maskImage: "linear-gradient(to right, transparent, black 5%, black 95%, transparent)",
            WebkitMaskImage: "linear-gradient(to right, transparent, black 5%, black 95%, transparent)",
          }}
        >
          <div className="marquee-track-1 flex w-max items-center gap-4 will-change-transform md:gap-6">
            {marqueeRow1.map((image, i) => (
              <MarqueeItem
                key={`r1-${i}`}
                image={image}
                index={i}
                onClick={() => setActiveIndex(i % galleryImages.length)}
                priority={i < 3}
              />
            ))}
          </div>
        </div>

        {/* Row 2 — Right to Left (desktop only) */}
        <div
          className="row-2-wrapper relative hidden w-full overflow-hidden lg:flex"
          style={{
            maskImage: "linear-gradient(to right, transparent, black 5%, black 95%, transparent)",
            WebkitMaskImage: "linear-gradient(to right, transparent, black 5%, black 95%, transparent)",
          }}
        >
          <div className="marquee-track-2 flex w-max items-center gap-6 will-change-transform">
            {marqueeRow2.map((image, i) => (
              <MarqueeItem
                key={`r2-${i}`}
                image={image}
                index={i}
                onClick={() => setActiveIndex(i % galleryImages.length)}
                priority={false}
              />
            ))}
          </div>
        </div>
      </div>

      {/* ====== BOTTOM INDEX MARKER ====== */}
      <div className="mx-auto mt-12 flex max-w-[1600px] items-center justify-between px-5 pb-12 text-[10px] uppercase tracking-[0.3em] text-[#101615]/40 sm:px-6 md:px-12 lg:px-24">
        <span>15 / Archive</span>
        <span className="hidden sm:inline">{galleryImages.length} Records</span>
      </div>

      {/* ====== FULLSCREEN CINEMATIC LIGHTBOX (stays dark for image viewing) ====== */}
      {activeIndex !== null && (
        <div
          ref={lightboxRef}
          className="fixed inset-0 z-[200] flex flex-col items-center justify-center bg-[#0B0B0D]/95 backdrop-blur-xl"
          onClick={closeLightbox}
        >
          {/* Top Bar */}
          <div className="absolute left-0 right-0 top-0 z-50 flex items-center justify-between p-5 md:p-8">
            <div className="flex items-center gap-3">
              <span className="h-px w-8 bg-[#009D4E]"></span>
              <span className="text-[10px] uppercase tracking-[0.3em] text-[#F5F3EE]/50">
                Sampan Group Archive
              </span>
            </div>
            <button
              onClick={closeLightbox}
              aria-label="Close lightbox"
              className="flex h-12 w-12 items-center justify-center rounded-full border border-[#F5F3EE]/20 text-[#F5F3EE] transition-colors duration-300 hover:border-[#009D4E] hover:bg-[#009D4E] hover:text-[#0B0B0D]"
            >
              <svg className="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" d="M6 18L18 6M6 6l12 12"></path>
              </svg>
            </button>
          </div>

          {/* Prev */}
          <button
            onClick={(e) => { e.stopPropagation(); showPrev(); }}
            aria-label="Previous image"
            className="absolute left-4 z-50 flex h-12 w-12 items-center justify-center rounded-full border border-[#F5F3EE]/20 text-[#F5F3EE] transition-colors duration-300 hover:border-[#009D4E] hover:bg-[#009D4E] hover:text-[#0B0B0D] md:left-8"
          >
            <svg className="h-6 w-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" d="M15 19l-7-7 7-7"></path>
            </svg>
          </button>

          {/* Image */}
          <div
            key={activeIndex}
            className="lightbox-image-wrapper relative h-[60vh] w-[88vw] max-w-5xl"
            onClick={(e) => e.stopPropagation()}
          >
            <Image
              src={galleryImages[activeIndex].src}
              alt={`Enlarged view of Sampan Group Gallery Image ${activeIndex + 1}`}
              fill
              sizes="90vw"
              quality={100}
              priority
              className="object-contain"
            />
            {/* Decorative corners */}
            <div className="absolute -left-2 -top-2 h-8 w-8 border-l border-t border-[#009D4E]/50"></div>
            <div className="absolute -bottom-2 -right-2 h-8 w-8 border-b border-r border-[#009D4E]/50"></div>
          </div>

          {/* Next */}
          <button
            onClick={(e) => { e.stopPropagation(); showNext(); }}
            aria-label="Next image"
            className="absolute right-4 z-50 flex h-12 w-12 items-center justify-center rounded-full border border-[#F5F3EE]/20 text-[#F5F3EE] transition-colors duration-300 hover:border-[#009D4E] hover:bg-[#009D4E] hover:text-[#0B0B0D] md:right-8"
          >
            <svg className="h-6 w-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" d="M9 5l7 7-7 7"></path>
            </svg>
          </button>

          {/* Bottom filmstrip / counter */}
          <div
            className="absolute bottom-0 left-0 right-0 z-50 flex flex-col items-center gap-4 p-5 md:p-8"
            onClick={(e) => e.stopPropagation()}
          >
            <span className="text-[10px] uppercase tracking-[0.3em] text-[#F5F3EE]/60">
              <strong className="text-[#009D4E]">0{activeIndex + 1}</strong>
              <span className="mx-2 text-[#F5F3EE]/30">/</span>
              0{galleryImages.length}
            </span>

            {/* Square filmstrip (desktop only) */}
            <div className="hidden max-w-[640px] gap-2 overflow-x-auto border border-[#F5F3EE]/10 bg-[#0B0B0D]/60 p-2 backdrop-blur-sm md:flex">
              {galleryImages.map((img, i) => (
                <button
                  key={img.id}
                  onClick={() => setActiveIndex(i)}
                  className={`relative h-12 w-12 shrink-0 overflow-hidden border transition-all duration-300 ${
                    activeIndex === i
                      ? "scale-110 border-[#009D4E]"
                      : "border-transparent opacity-50 hover:opacity-100"
                  }`}
                >
                  <Image
                    src={img.src}
                    alt={`Thumbnail ${i + 1}`}
                    fill
                    sizes="48px"
                    quality={90}
                    className="object-cover"
                  />
                </button>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* ====== Global Typography Styles ====== */}
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

/* ------------------------------------------------------------------ */
/*  MARQUEE ITEM SUBCOMPONENT                                          */
/* ------------------------------------------------------------------ */

function MarqueeItem({
  image,
  index,
  onClick,
  priority,
}: {
  image: (typeof galleryImages)[0];
  index: number;
  onClick: () => void;
  priority?: boolean;
}) {
  return (
    <div
      className="group relative h-[220px] w-[220px] shrink-0 cursor-pointer overflow-hidden border border-[#101615]/10 bg-[#FFFFFF] shadow-[0_8px_30px_-12px_rgba(16,22,21,0.15)] md:h-[340px] md:w-[340px] lg:h-[380px] lg:w-[380px]"
      onClick={onClick}
    >
      <Image
        src={image.src}
        alt={`Sampan Group Gallery Image ${index + 1}`}
        fill
        sizes="(min-width: 1024px) 380px, (min-width: 768px) 340px, 220px"
        quality={90}
        priority={priority}
        className="object-cover transition-transform duration-700 ease-[cubic-bezier(0.19,1,0.22,1)] group-hover:scale-105"
      />

      {/* Subtle dark overlay on hover for legibility */}
      <div className="absolute inset-0 bg-gradient-to-t from-[#0B0B0D]/70 via-transparent to-transparent opacity-0 transition-opacity duration-500 group-hover:opacity-100"></div>

      {/* Top-right index — dark on light, inverts on hover */}
      <div className="absolute right-0 top-0 z-10 flex items-center gap-2 bg-[#FFFFFF]/70 py-1 pl-2 pr-3 text-[#101615] backdrop-blur-sm transition-colors duration-500 group-hover:bg-[#0B0B0D]/40 group-hover:text-[#F5F3EE]">
        <span className="h-px w-3 bg-[#009D4E]"></span>
        <span className="text-[10px] tracking-[0.2em]">0{(index % galleryImages.length) + 1}</span>
      </div>

      {/* Expand icon — appears on hover */}
      <div className="absolute bottom-4 right-4 z-10 flex h-10 w-10 translate-y-2 items-center justify-center rounded-full border border-[#101615]/30 bg-[#F5F3EE]/40 text-[#101615] opacity-0 backdrop-blur-sm transition-all duration-500 ease-[cubic-bezier(0.19,1,0.22,1)] group-hover:translate-y-0 group-hover:border-[#009D4E] group-hover:bg-[#0B0B0D]/40 group-hover:text-[#F5F3EE] group-hover:opacity-100">
        <svg className="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" d="M4 8V4h4M20 8V4h-4M4 16v4h4M20 16v4h-4"></path>
        </svg>
      </div>
    </div>
  );
}