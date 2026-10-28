// app/not-found.tsx
"use client";

import Link from "next/link";
import { useEffect, useState } from "react";

export default function NotFound() {
  const [mounted, setMounted] = useState(false);
  const [mousePos, setMousePos] = useState({ x: 0, y: 0 });

  useEffect(() => {
    setMounted(true);

    const handleMouseMove = (e: MouseEvent) => {
      setMousePos({
        x: (e.clientX / window.innerWidth - 0.5) * 2,
        y: (e.clientY / window.innerHeight - 0.5) * 2,
      });
    };

    window.addEventListener("mousemove", handleMouseMove);
    return () => window.removeEventListener("mousemove", handleMouseMove);
  }, []);

  return (
    <main className="relative min-h-screen overflow-hidden bg-[#0B0B0D] font-sans antialiased">
      {/* ─── Animation keyframes ─── */}
      <style>{`
        @keyframes float404 {
          0%, 100% { transform: translateY(0) rotateX(0deg) rotateY(0deg); }
          25% { transform: translateY(-12px) rotateX(3deg) rotateY(-2deg); }
          50% { transform: translateY(-6px) rotateX(-2deg) rotateY(3deg); }
          75% { transform: translateY(-10px) rotateX(2deg) rotateY(-3deg); }
        }
        @keyframes ambientDrift {
          0%, 100% { transform: translate(0, 0) scale(1); }
          50% { transform: translate(40px, -30px) scale(1.08); }
        }
        @keyframes ambientDrift2 {
          0%, 100% { transform: translate(0, 0) scale(1); }
          50% { transform: translate(-30px, 20px) scale(1.1); }
        }
        @keyframes fadeUp {
          from { opacity: 0; transform: translateY(28px); }
          to { opacity: 1; transform: translateY(0); }
        }
        @keyframes drawLine {
          from { transform: scaleX(0); opacity: 0; }
          to { transform: scaleX(1); opacity: 1; }
        }
        @keyframes shimmer {
          0% { background-position: 200% 0; }
          100% { background-position: -200% 0; }
        }
        @keyframes float {
          0%, 100% { transform: translateY(0); }
          50% { transform: translateY(-8px); }
        }
        @keyframes orbit {
          from { transform: rotate(0deg) translateX(180px) rotate(0deg); }
          to { transform: rotate(360deg) translateX(180px) rotate(-360deg); }
        }
        @keyframes orbitReverse {
          from { transform: rotate(0deg) translateX(140px) rotate(0deg); }
          to { transform: rotate(-360deg) translateX(140px) rotate(360deg); }
        }
        @keyframes orbitSmall {
          from { transform: rotate(0deg) translateX(100px) rotate(0deg); }
          to { transform: rotate(360deg) translateX(100px) rotate(-360deg); }
        }
        @keyframes pulseRing {
          0% { transform: scale(1); opacity: 0.4; }
          50% { transform: scale(1.05); opacity: 0.15; }
          100% { transform: scale(1); opacity: 0.4; }
        }
        @keyframes spinSlow {
          from { transform: rotate(0deg); }
          to { transform: rotate(360deg); }
        }
        @keyframes spinReverse {
          from { transform: rotate(360deg); }
          to { transform: rotate(0deg); }
        }
        @keyframes dashMove {
          from { stroke-dashoffset: 0; }
          to { stroke-dashoffset: -40; }
        }
      `}</style>

      {/* ─── Dark ambient background ─── */}
      <div className="absolute inset-0 -z-10 overflow-hidden">
        {/* Dot grid */}
        <div
          className="absolute inset-0 opacity-[0.04]"
          style={{
            backgroundImage: "radial-gradient(rgba(245,245,242,0.6) 1px, transparent 1px)",
            backgroundSize: "32px 32px",
            maskImage: "radial-gradient(ellipse at 50% 40%, black 0%, transparent 75%)",
            WebkitMaskImage: "radial-gradient(ellipse at 50% 40%, black 0%, transparent 75%)",
          }}
        />
        {/* Warm glow top-right */}
        <div
          className="absolute -right-40 -top-40 h-[45vw] w-[45vw] rounded-full blur-[140px]"
          style={{
            background: "radial-gradient(circle, rgba(197,160,89,0.16) 0%, transparent 70%)",
            animation: "ambientDrift 24s ease-in-out infinite",
          }}
        />
        {/* Warm glow bottom-left */}
        <div
          className="absolute -left-40 bottom-0 h-[40vw] w-[40vw] rounded-full blur-[140px]"
          style={{
            background: "radial-gradient(circle, rgba(160,125,63,0.12) 0%, transparent 70%)",
            animation: "ambientDrift2 28s ease-in-out infinite",
          }}
        />
        {/* Center subtle glow */}
        <div
          className="absolute left-1/2 top-1/2 h-[30vw] w-[30vw] -translate-x-1/2 -translate-y-1/2 rounded-full blur-[100px]"
          style={{
            background: "radial-gradient(circle, rgba(197,160,89,0.10) 0%, transparent 70%)",
          }}
        />
      </div>

      {/* ─── 3D Orbiting decorative elements ─── */}
      <div
        className="absolute left-1/2 top-1/2 z-0 hidden -translate-x-1/2 -translate-y-1/2 md:block"
        style={{ perspective: "1200px" }}
      >
        {/* Orbiting rings */}
        <div className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2" style={{ animation: "spinSlow 40s linear infinite" }}>
          <div className="h-[400px] w-[400px] rounded-full border border-[#C5A059]/15" />
        </div>
        <div className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2" style={{ animation: "spinReverse 30s linear infinite" }}>
          <div className="h-[320px] w-[320px] rounded-full border border-[#C5A059]/20" />
        </div>
        <div className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2" style={{ animation: "spinSlow 20s linear infinite" }}>
          <div className="h-[260px] w-[260px] rounded-full border border-[#C5A059]/25" />
        </div>

        {/* Orbiting dots */}
        <div className="absolute left-1/2 top-1/2 h-2 w-2 rounded-full bg-[#C5A059]" style={{ animation: "orbit 12s linear infinite" }} />
        <div className="absolute left-1/2 top-1/2 h-1.5 w-1.5 rounded-full bg-[#A07D3F]" style={{ animation: "orbitReverse 16s linear infinite" }} />
        <div className="absolute left-1/2 top-1/2 h-1 w-1 rounded-full bg-white/80" style={{ animation: "orbitSmall 8s linear infinite" }} />

        {/* Pulsing ring */}
        <div className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 h-[500px] w-[500px] rounded-full border border-[#C5A059]/10" style={{ animation: "pulseRing 4s ease-in-out infinite" }} />
      </div>

      {/* ─── Animated SVG wave paths at bottom ─── */}
      <svg
        className="absolute bottom-0 left-0 right-0 z-0 h-[30vh] w-full opacity-[0.06]"
        viewBox="0 0 1440 200"
        preserveAspectRatio="none"
        fill="none"
        aria-hidden="true"
      >
        <path d="M0,100 C320,160 420,40 720,100 C1020,160 1120,40 1440,100" stroke="#F5F5F2" strokeWidth="1" strokeDasharray="8 8" style={{ animation: "dashMove 2s linear infinite" }} />
        <path d="M0,120 C320,60 420,180 720,120 C1020,60 1120,180 1440,120" stroke="#C5A059" strokeWidth="1" strokeDasharray="6 10" style={{ animation: "dashMove 3s linear infinite reverse" }} />
        <path d="M0,80 C320,140 420,20 720,80 C1020,140 1120,20 1440,80" stroke="#F5F5F2" strokeWidth="0.5" strokeDasharray="4 6" style={{ animation: "dashMove 1.5s linear infinite" }} />
      </svg>

      {/* ─── Architectural corner brackets ─── */}
      <span className="pointer-events-none absolute left-6 top-6 z-30 h-10 w-10 border-l border-t border-white/20 sm:left-8 sm:top-8 sm:h-12 sm:w-12" />
      <span className="pointer-events-none absolute right-6 top-6 z-30 h-10 w-10 border-r border-t border-white/20 sm:right-8 sm:top-8 sm:h-12 sm:w-12" />
      <span className="pointer-events-none absolute bottom-6 left-6 z-30 h-10 w-10 border-b border-l border-white/20 sm:bottom-8 sm:left-8 sm:h-12 sm:w-12" />
      <span className="pointer-events-none absolute bottom-6 right-6 z-30 h-10 w-10 border-b border-r border-white/20 sm:bottom-8 sm:right-8 sm:h-12 sm:w-12" />

      {/* ─── Center content ─── */}
      <div className="relative z-10 flex min-h-screen flex-col items-center justify-center px-5 py-20 sm:px-6 md:px-12">
        <div className="mx-auto max-w-2xl text-center">

          {/* Eyebrow with animated lines */}
          <div className="mb-8 flex items-center justify-center gap-4" style={{ opacity: mounted ? 1 : 0, animation: mounted ? "fadeUp 0.8s ease-out 0.1s both" : undefined }}>
            <span className="h-px bg-[#C5A059] origin-left" style={{ width: "2.5rem", animation: mounted ? "drawLine 1s ease-out 0.3s both" : undefined }} />
            <span className="text-[10px] font-semibold uppercase tracking-[0.32em] text-[#C5A059] sm:text-xs">Error · Lost in space</span>
            <span className="h-px bg-[#C5A059] origin-right" style={{ width: "2.5rem", animation: mounted ? "drawLine 1s ease-out 0.3s both" : undefined }} />
          </div>

          {/* ─── 3D Floating 404 ─── */}
          <div
            className="relative"
            style={{
              perspective: "1000px",
              transformStyle: "preserve-3d",
              transform: mounted ? `rotateX(${mousePos.y * 5}deg) rotateY(${mousePos.x * 5}deg)` : "none",
              transition: "transform 0.3s ease-out",
              opacity: mounted ? 1 : 0,
              animation: mounted ? "fadeUp 1s ease-out 0.2s both" : undefined,
            }}
          >
            {/* Shadow layer behind 404 */}
            <div className="absolute inset-0 flex items-center justify-center" style={{ transform: "translateZ(-20px)" }} aria-hidden="true">
              <span className="font-serif text-[clamp(7rem,20vw,15rem)] font-light leading-[0.85] tracking-[-0.08em] opacity-[0.04]" style={{ color: "#FFFFFF" }}>404</span>
            </div>

            {/* Main 404 with gradient shimmer + 3D float */}
            <h1
              className="relative font-serif text-[clamp(8rem,22vw,16rem)] font-light leading-[0.85] tracking-[-0.08em] bg-clip-text text-transparent"
              style={{
                backgroundImage: "linear-gradient(120deg, #C5A059 0%, #E5C787 25%, #FFFFFF 50%, #E5C787 75%, #C5A059 100%)",
                backgroundSize: "200% 100%",
                animation: "float404 6s ease-in-out infinite, shimmer 6s linear infinite 1.5s",
                transformStyle: "preserve-3d",
              }}
            >
              404
            </h1>

            {/* Floating accent dots at different Z depths */}
            <span className="absolute -left-4 top-1/4 h-2 w-2 rounded-full bg-[#C5A059]" style={{ animation: "float 3s ease-in-out infinite", transform: "translateZ(30px)" }} />
            <span className="absolute -right-2 top-1/3 h-1.5 w-1.5 rounded-full bg-[#E5C787]" style={{ animation: "float 2.5s ease-in-out infinite 0.5s", transform: "translateZ(40px)" }} />
            <span className="absolute right-1/4 -bottom-2 h-1 w-1 rounded-full bg-white/80" style={{ animation: "float 4s ease-in-out infinite 1s", transform: "translateZ(20px)" }} />
          </div>

          {/* Headline */}
          <h2 className="mt-4 text-balance text-2xl font-light leading-[1.2] tracking-[-0.03em] text-white sm:text-3xl md:text-4xl" style={{ opacity: mounted ? 1 : 0, animation: mounted ? "fadeUp 0.9s ease-out 0.45s both" : undefined }}>
            This page wandered off the map.
          </h2>

          {/* Description */}
          <p className="mx-auto mt-6 max-w-md text-base leading-[1.85] text-white/55" style={{ opacity: mounted ? 1 : 0, animation: mounted ? "fadeUp 0.8s ease-out 0.6s both" : undefined }}>
            The page you're looking for may have been moved, renamed, or never existed. Let's get you back to solid ground.
          </p>

          {/* CTA buttons */}
          <div className="mt-10 flex flex-col items-center justify-center gap-3 sm:flex-row sm:gap-4" style={{ opacity: mounted ? 1 : 0, animation: mounted ? "fadeUp 0.8s ease-out 0.75s both" : undefined }}>
            {/* Primary CTA — gold filled */}
            <Link href="/" className="group relative inline-flex min-h-12 items-center justify-center gap-3 overflow-hidden px-8 py-4 text-[11px] font-semibold uppercase tracking-[0.22em] text-[#0B0B0D] transition-all duration-300 hover:shadow-[0_10px_36px_-14px_rgba(197,160,89,0.5)]" style={{ background: "#C5A059" }}>
              <span className="absolute inset-0 translate-y-full bg-white transition-transform duration-500 ease-[cubic-bezier(0.22,1,0.36,1)] group-hover:translate-y-0" />
              <span className="relative z-10 flex items-center gap-3 transition-colors duration-300 group-hover:text-[#0B0B0D]">
                Back to home
                <svg className="h-4 w-4 transition-transform duration-300 group-hover:translate-x-1" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" d="M14 5l7 7m0 0l-7 7m7-7H3" /></svg>
              </span>
            </Link>
            {/* Secondary CTA — white outline */}
            <Link href="/projects" className="group relative inline-flex min-h-12 items-center justify-center gap-3 border border-white/30 px-8 py-4 text-[11px] font-semibold uppercase tracking-[0.22em] text-white transition-all duration-300 hover:border-white hover:bg-white hover:text-[#0B0B0D]">
              Browse projects
              <span className="text-sm transition-transform duration-300 group-hover:translate-x-1">→</span>
            </Link>
          </div>

          {/* Quick links */}
          <div className="mt-16 flex flex-col items-center gap-3" style={{ opacity: mounted ? 1 : 0, animation: mounted ? "fadeUp 0.8s ease-out 0.9s both" : undefined }}>
            <span className="text-[9px] uppercase tracking-[0.28em] text-white/35">Or try one of these</span>
            <div className="flex flex-wrap items-center justify-center gap-x-6 gap-y-2 text-[10px] uppercase tracking-[0.22em]">
              <Link href="/projects" className="text-white/50 transition-colors hover:text-[#C5A059]">Projects</Link>
              <span className="text-white/15">/</span>
              <Link href="/projects/completed" className="text-white/50 transition-colors hover:text-[#C5A059]">Completed</Link>
              <span className="text-white/15">/</span>
              <Link href="/contact" className="text-white/50 transition-colors hover:text-[#C5A059]">Contact</Link>
              <span className="text-white/15">/</span>
              {/* ─── Sampan Group external link ─── */}
              <a href="https://sampangroup.com.bd/" target="_blank" rel="noopener noreferrer" className="group inline-flex items-center gap-1.5 text-white/50 transition-colors hover:text-[#C5A059]">
                Sampan Group
                <svg className="h-3 w-3 transition-transform duration-300 group-hover:translate-x-0.5 group-hover:-translate-y-0.5" fill="none" stroke="currentColor" strokeWidth="1.5" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="M7 17 17 7M7 7h10v10" /></svg>
              </a>
            </div>
            <div className="mt-4" style={{ animation: "float 2.5s ease-in-out infinite" }}>
              <svg className="h-4 w-4 text-[#C5A059]/50" fill="none" stroke="currentColor" strokeWidth="1.5" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="M12 5v14M5 12l7 7 7-7" /></svg>
            </div>
          </div>
        </div>
      </div>
    </main>
  );
}