// app/components/Hero.tsx
"use client";

import Link from "next/link";
import { useState, useEffect, useRef } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

// --- Art-directed slide data ---
const slides = [
  {
    img: "/banner/condomenium.png",
    eyebrow: "SAMPAN DEVELOPMENT LTD. / ARCHITECTURE & DEVELOPMENT",
    titleLine1: "Land & Tower",
    titleLine2: "Developments",
    subtitle: "Premium high-rises built on clearly titled, documented land.",
    location: "Ashulia, Bangladesh",
  },
  {
    img: "/expresshighway/Modern-Sampan-Highway-Commercial-Complex.png",
    eyebrow: "SAMPAN DEVELOPMENT LTD. / COMMERCE & DESIGN",
    titleLine1: "Highway",
    titleLine2: "Destinations",
    subtitle: "Innovative commercial hubs designed for modern commerce.",
    location: "Express Highway",
  },
  {
    img: "/banner/golf-ball-field.jpg",
    eyebrow: "SAMPAN DEVELOPMENT LTD. / SUSTAINABLE FUTURES",
    titleLine1: "Sampan Agro and",
    titleLine2: "Golf Resort",
    subtitle: "Agro-resort and communities in harmony with nature.",
    location: "Outskirts of City",
  },
];

export default function Hero() {
  const sectionRef = useRef<HTMLElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [currentSlide, setCurrentSlide] = useState(0);
  const [isPaused, setIsPaused] = useState(false);
  const autoplayRef = useRef<NodeJS.Timeout | null>(null);
  const touchStartX = useRef<number | null>(null);

  // --- 1. Topographic Canvas Architecture (Creative Coding) ---
  useEffect(() => {
    if (!window.matchMedia("(min-width: 768px) and (prefers-reduced-motion: no-preference)").matches) return;

    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    let width = (canvas.width = window.innerWidth);
    let height = (canvas.height = window.innerHeight);
    const mouse = { x: width / 2, y: height / 2 };
    let rafId = 0;

    const handleResize = () => {
      width = canvas.width = window.innerWidth;
      height = canvas.height = window.innerHeight;
    };

    const handleMouse = (e: MouseEvent) => {
      mouse.x = e.clientX;
      mouse.y = e.clientY;
    };

    const numLines = 25;
    const lines = Array.from({ length: numLines }, () => ({
      offset: Math.random() * 1000,
    }));

    const draw = () => {
      if (document.hidden) return;

      ctx.clearRect(0, 0, width, height);
      const mouseInfluence = (mouse.x / width - 0.5) * 100;

      lines.forEach((line, i) => {
        ctx.beginPath();
        const dist = Math.abs(i - numLines / 2) / (numLines / 2);
        const opacity = (1 - dist) * 0.2;
        const baseY = height * 0.65 + i * 15;

        for (let x = 0; x <= width; x += 15) {
          const wave1 = Math.sin(x * 0.003 + line.offset) * 60;
          const wave2 = Math.sin(x * 0.008 + line.offset * 1.5) * 30;
          const mouseWave = Math.sin((x + mouseInfluence) * 0.005) * 40;

          const y = baseY + wave1 + wave2 + mouseWave * (1 - dist);
          if (x === 0) ctx.moveTo(x, y);
          else ctx.lineTo(x, y);
        }

        ctx.strokeStyle = `rgba(198, 160, 107, ${opacity})`;
        ctx.lineWidth = 1;
        ctx.stroke();
      });

      if (!document.hidden) rafId = requestAnimationFrame(draw);
    };

    const handleVisibility = () => {
      if (document.hidden) cancelAnimationFrame(rafId);
      else draw();
    };

    window.addEventListener("resize", handleResize);
    if (window.matchMedia("(pointer: fine)").matches) {
      window.addEventListener("mousemove", handleMouse);
    }
    document.addEventListener("visibilitychange", handleVisibility);
    draw();

    return () => {
      cancelAnimationFrame(rafId);
      window.removeEventListener("resize", handleResize);
      window.removeEventListener("mousemove", handleMouse);
      document.removeEventListener("visibilitychange", handleVisibility);
    };
  }, []);

  // --- 2. Background Scroll Parallax (GSAP) ---
  useEffect(() => {
    if (!window.matchMedia("(min-width: 768px) and (prefers-reduced-motion: no-preference)").matches) return;

    gsap.registerPlugin(ScrollTrigger);
    const ctx = gsap.context(() => {
      gsap.to(".parallax-layer", {
        yPercent: 15,
        ease: "none",
        scrollTrigger: {
          trigger: sectionRef.current,
          start: "top top",
          end: "bottom top",
          scrub: true,
        },
      });
    }, sectionRef);

    return () => ctx.revert();
  }, []);

  // --- 3. Synchronized Autoplay & Visibility Management ---
  useEffect(() => {
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;

    const handleVisibility = () => setIsPaused(document.hidden);
    document.addEventListener("visibilitychange", handleVisibility);

    if (!isPaused) {
      autoplayRef.current = setTimeout(() => {
        setCurrentSlide((prev) => (prev + 1) % slides.length);
      }, 7000); // 7-second comfortable reading time
    }

    return () => {
      document.removeEventListener("visibilitychange", handleVisibility);
      if (autoplayRef.current) clearTimeout(autoplayRef.current);
    };
  }, [currentSlide, isPaused]);

  // --- 4. Immediate Slide Transition Logic ---
  // No animation locks. No delayed state updates. Content renders instantly.
  const goToSlide = (index: number) => {
    if (index === currentSlide) return;
    setCurrentSlide(index);
  };

  return (
    <section
      ref={sectionRef}
      onTouchStart={(event) => {
        touchStartX.current = event.changedTouches[0]?.clientX ?? null;
      }}
      onTouchEnd={(event) => {
        const startX = touchStartX.current;
        const endX = event.changedTouches[0]?.clientX;
        touchStartX.current = null;
        if (startX === null || endX === undefined || Math.abs(endX - startX) < 48) return;
        goToSlide((currentSlide + (endX < startX ? 1 : -1) + slides.length) % slides.length);
      }}
      className="relative h-[100svh] min-h-[650px] w-full bg-[#101615] overflow-hidden font-lux-sans antialiased flex flex-col md:min-h-[700px]"
    >
      {/* --- Background Image Layers --- */}
      <div className="absolute inset-0 z-0">
        <div className="parallax-layer absolute inset-0 will-change-transform">
          {slides.map((slide, index) => (
            <div
              key={index}
              className={`absolute inset-0 transition-opacity duration-[800ms] ease-in-out pointer-events-none ${
                index === currentSlide ? "opacity-100" : "opacity-0"
              }`}
            >
              <div
                className="absolute inset-0 bg-cover bg-[center_58%] lg:bg-right transition-transform duration-[7000ms] ease-out"
                style={{
                  backgroundImage: `url(${slide.img})`,
                  transform: index === currentSlide ? "scale(1.05)" : "scale(1)",
                }}
              ></div>
            </div>
          ))}
        </div>

        {/* Cinematic Gradients for Text Readability */}
        <div className="absolute inset-0 bg-gradient-to-r from-[#101615] via-[#101615]/95 to-[#101615]/20"></div>
        <div className="absolute inset-0 bg-gradient-to-t from-[#101615] via-transparent to-[#101615]/60"></div>
      </div>

      {/* --- Topographic Canvas Architecture --- */}
      <canvas
        ref={canvasRef}
        className="absolute inset-0 z-10 pointer-events-none hidden md:block opacity-90"
      ></canvas>

      {/* --- Main Content Composition --- */}
      <div className="relative z-20 flex-grow flex items-center px-5 sm:px-6 md:px-12 lg:px-24 pt-28 pb-28 md:pb-32">
        {/* 
          Using key={currentSlide} forces React to remount the DOM instantly.
          The CSS animation 'contentReveal' plays a subtle, non-blocking transform.
          Opacity is never hidden, ensuring text is immediately readable.
        */}
        <div key={currentSlide} className="max-w-3xl text-[#F8F7F3] content-reveal">
          {/* Eyebrow */}
          <div className="flex items-center gap-3 sm:gap-4 mb-6 sm:mb-8">
            <span className="h-px w-8 sm:w-12 shrink-0 bg-[#009D4E]"></span>
            <span className="max-w-[280px] text-[9px] sm:text-[10px] md:text-[11px] font-medium uppercase tracking-[0.2em] sm:tracking-[0.35em] text-[#E9E0D2]/80">
              {slides[currentSlide].eyebrow}
            </span>
          </div>

          {/* Main Typographic Silhouette */}
          <h1 className="font-lux-serif text-[clamp(2.8rem,12vw,7rem)] leading-[0.91] tracking-tight mb-6 sm:mb-8 drop-shadow-[0_4px_20px_rgba(0,0,0,0.5)]">
            <span className="block">{slides[currentSlide].titleLine1}</span>
            <span className="block italic font-light text-[#009D4E]">
              {slides[currentSlide].titleLine2}
            </span>
          </h1>

          {/* Subtitle & Location */}
          <p className="text-sm sm:text-base md:text-lg text-[#E9E0D2]/90 font-light leading-relaxed max-w-xl mb-2 drop-shadow-[0_2px_10px_rgba(0,0,0,0.5)]">
            {slides[currentSlide].subtitle}
          </p>

          <div className="flex items-center gap-3 text-[#E9E0D2]/60 text-[10px] sm:text-xs uppercase tracking-[0.16em] sm:tracking-[0.2em] mb-8 sm:mb-12">
            <svg className="w-3 h-3 text-[#009D4E]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z"></path>
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" d="M15 11a3 3 0 11-6 0 3 3 0 016 0z"></path>
            </svg>
            {slides[currentSlide].location}
          </div>

          {/* CTAs */}
          <div className="flex w-full flex-col sm:w-auto sm:flex-row items-stretch sm:items-start gap-3 sm:gap-4">
            <Link
              href="/projects"
              className="group min-h-12 w-full sm:w-auto justify-between bg-[#009D4E] text-[#101615] text-[10px] sm:text-[11px] font-semibold uppercase tracking-[0.16em] sm:tracking-[0.2em] px-5 sm:px-8 py-4 transition-all duration-300 hover:bg-[#F8F7F3] flex items-center gap-3"
            >
              View Projects
              <svg className="w-4 h-4 transition-transform duration-300 group-hover:translate-x-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M14 5l7 7m0 0l-7 7m7-7H3"></path>
              </svg>
            </Link>

            <Link
              href="/contact"
              className="group min-h-12 w-full sm:w-auto justify-center border border-[#E9E0D2]/30 text-[#F8F7F3] text-[10px] sm:text-[11px] font-semibold uppercase tracking-[0.16em] sm:tracking-[0.2em] px-5 sm:px-8 py-4 transition-all duration-300 hover:border-[#009D4E] hover:text-[#009D4E] flex items-center gap-3 backdrop-blur-sm bg-[#101615]/20"
            >
              Book a Site Visit
            </Link>
          </div>
        </div>
      </div>

      {/* --- Cinematic Bottom UI Bar --- */}
      <div className="absolute bottom-0 left-0 right-0 z-30 border-t border-[#E9E0D2]/10 bg-gradient-to-t from-[#101615] to-transparent backdrop-blur-sm">
        <div className="max-w-[1440px] mx-auto px-5 sm:px-6 md:px-12 lg:px-24 py-3 sm:py-6 flex items-center justify-between gap-3 sm:gap-8">
          {/* Bottom Left: Scroll Indicator */}
          <div className="hidden md:flex items-center gap-4 text-[#E9E0D2]/50 text-[10px] uppercase tracking-[0.3em] flex-shrink-0">
            <div className="w-12 h-px bg-[#E9E0D2]/20 relative overflow-hidden">
              <div className="absolute top-0 left-0 h-full w-full bg-[#009D4E] animate-[scrollLine_2.5s_ease-in-out_infinite]"></div>
            </div>
            Scroll to Discover
          </div>

          {/* Bottom Center: Trust Strip */}
          <div className="hidden lg:flex items-center gap-8 text-[9px] uppercase tracking-[0.25em] text-[#E9E0D2]/50 flex-grow justify-center">
            <span>Clear Title Documents</span>
            <span className="h-3 w-px bg-[#E9E0D2]/20"></span>
            <span>Site Visits on Request</span>
            <span className="h-3 w-px bg-[#E9E0D2]/20"></span>
            <span className="text-[#009D4E]/80">Backed by Sampan Group</span>
          </div>

          {/* Bottom Right: Slider Controls & Up Next */}
          <div className="flex items-center gap-2 sm:gap-6 ml-auto">
            {/* Featured Preview Thumbnail */}
            <div
              className="hidden md:flex items-center gap-4 group cursor-pointer"
              onClick={() => goToSlide((currentSlide + 1) % slides.length)}
            >
              <div className="text-right">
                <div className="text-[9px] uppercase tracking-[0.3em] text-[#E9E0D2]/40 mb-1">Up Next</div>
                <div className="text-sm font-lux-serif text-[#F8F7F3]">
                  {slides[(currentSlide + 1) % slides.length].titleLine1}
                </div>
              </div>
              <div className="w-12 h-12 overflow-hidden border border-[#E9E0D2]/20 group-hover:border-[#009D4E] transition-colors duration-300">
                <img
                  src={slides[(currentSlide + 1) % slides.length].img}
                  className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
                  alt="Next project preview"
                />
              </div>
            </div>

            <div className="hidden md:block h-12 w-px bg-[#E9E0D2]/10"></div>

            {/* Slide Index & Progress */}
            <div className="flex items-center gap-2 sm:gap-4 text-[#F8F7F3] flex-shrink-0">
              <span className="text-sm font-medium tracking-wider text-[#F8F7F3]">
                0{currentSlide + 1}
              </span>
              <div className="w-10 sm:w-16 h-px bg-[#E9E0D2]/20 relative overflow-hidden">
                {/* 
                  Key ensures the CSS animation restarts instantly on slide change.
                  Animation pauses if the tab is hidden.
                */}
                <div
                  key={currentSlide}
                  className={`absolute top-0 left-0 h-full bg-[#009D4E] w-full origin-left progress-bar ${
                    isPaused ? "paused" : ""
                  }`}
                ></div>
              </div>
              <span className="text-sm font-medium tracking-wider text-[#E9E0D2]/40">
                0{slides.length}
              </span>
            </div>

            {/* Manual Prev/Next Controls */}
            <div className="flex items-center gap-1 sm:gap-2">
              <button
                onClick={() => goToSlide((currentSlide - 1 + slides.length) % slides.length)}
                aria-label="Previous slide"
                className="grid size-10 sm:size-11 place-items-center text-[#E9E0D2]/70 hover:text-[#009D4E] transition-colors duration-300"
              >
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" d="M10 19l-7-7m0 0l7-7m-7 7h18"></path></svg>
              </button>
              <button
                onClick={() => goToSlide((currentSlide + 1) % slides.length)}
                aria-label="Next slide"
                className="grid size-10 sm:size-11 place-items-center text-[#E9E0D2]/70 hover:text-[#009D4E] transition-colors duration-300"
              >
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" d="M14 5l7 7m0 0l-7 7m7-7H3"></path></svg>
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* --- Global Styles & Keyframes --- */}
      <style jsx global>{`
        @import url('https://fonts.googleapis.com/css2?family=Cormorant+Garamond:ital,wght@0,400;0,500;0,600;1,400;1,500&family=Inter:wght@300;400;500;600&display=swap');

        .font-lux-serif {
          font-family: 'Cormorant Garamond', serif;
        }
        .font-lux-sans {
          font-family: 'Inter', sans-serif;
        }

        @keyframes scrollLine {
          0% { transform: translateX(-100%); }
          100% { transform: translateX(100%); }
        }

        @keyframes progressGrow {
          from { transform: scaleX(0); }
          to { transform: scaleX(1); }
        }

        /* 
          Subtle entrance animation that DOES NOT affect opacity or readability.
          Only translates the content 10px upwards over 0.8s.
        */
        @keyframes contentReveal {
          from { transform: translateY(10px); }
          to { transform: translateY(0); }
        }

        .content-reveal {
          animation: contentReveal 0.8s cubic-bezier(0.22, 1, 0.36, 1) forwards;
          will-change: transform;
        }

        .progress-bar {
          transform: scaleX(0);
          animation: progressGrow 7s linear forwards;
        }

        .progress-bar.paused {
          animation-play-state: paused;
        }
      `}</style>
    </section>
  );
}