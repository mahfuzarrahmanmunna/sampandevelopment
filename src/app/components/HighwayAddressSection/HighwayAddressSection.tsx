// app/components/HighwayAddressSection.tsx
"use client";

import { useLayoutEffect, useRef, useState, useEffect } from "react";
import Link from "next/link";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import * as THREE from "three";
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

const PROJECTS = [
  {
    index: "01",
    name: "Express Highway Inn",
    subhead: "Stop. Unwind. Connect.",
    desc: "A hospitality destination on the Dhaka–Chittagong Highway. Stop for a meal, unwind in the lounge, and let your car be washed while you relax.",
    facts: ["60 katha", "2-storied condominium", "Club and lounge membership", "VVIP lounge", "24/7 restaurant", "Sampan Mart", "Automatic car wash"],
    img: "/expresshighway/Modern-Sampan-Highway-Commercial-Complex.png",
    slug: "/projects/ongoing/express-highway-inn",
    linkLabel: "See Express Highway Inn",
    bgColor: "#1a1a1a",
    location: "Dhaka–Chittagong Highway",
    type: "Hospitality",
  },
  {
    index: "02",
    name: "Sampan Condominium",
    subhead: "Stay. Live. Earn.",
    desc: "Serviced apartment living right next door. Units are professionally managed for rental income, while owners enjoy full access to the adjacent highway facilities.",
    facts: ["20 katha", "G+9 serviced apartments", "Managed rental units", "Rooftop pool and gym"],
    img: "/images/projects/condominium/hero.jpg",
    slug: "/projects/ongoing/sampan-condominium",
    linkLabel: "See the Condominium",
    bgColor: "#0f1f1a",
    location: "Beside Express Highway Inn",
    type: "Serviced Living",
  },
  {
    index: "03",
    name: "Sampan Trade Emporium",
    subhead: "Shop. Discover. Access more.",
    desc: "A mixed-use commercial hub bringing retail, leisure, and essential services together. From showrooms to a cinema, and a hospital to diagnostics, everything is in one building.",
    facts: ["20 katha", "B+LG+G+11", "Showrooms", "Food court", "Cinema", "Banks", "Hospital", "Diagnostics"],
    img: "/images/roni/Sampan_Trade_Emporium_Rooftop_Tower.png",
    slug: "/projects/ongoing/sampan-trade-emporium",
    linkLabel: "See the Trade Emporium",
    bgColor: "#1a1f0f",
    location: "Adjacent to Highway Inn",
    type: "Mixed-Use",
  },
];

export default function HighwayAddressSection() {
  const sectionRef = useRef<HTMLElement>(null);
  const stickyRef = useRef<HTMLDivElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const mobileProgressRef = useRef<HTMLDivElement>(null);
  const [activeProject, setActiveProject] = useState(0);
  const [mobileActiveSection, setMobileActiveSection] = useState(0);
  const activeProjectRef = useRef(0);
  const threeUniforms = useRef<any>(null);

  // --- 1. THREE.JS ATMOSPHERIC SHADER BACKGROUND ---
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const prefersReducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    if (prefersReducedMotion) return;

    const renderer = new THREE.WebGLRenderer({ canvas, antialias: true, alpha: true });
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    renderer.setSize(window.innerWidth, window.innerHeight);

    const scene = new THREE.Scene();
    const camera = new THREE.OrthographicCamera(-1, 1, 1, -1, 0, 1);

    const uniforms = {
      uTime: { value: 0.0 },
      uColor: { value: new THREE.Color("#171715") },
      uOpacity: { value: 0.55 },
    };
    threeUniforms.current = uniforms;

    const material = new THREE.ShaderMaterial({
      uniforms,
      vertexShader: `
        varying vec2 vUv;
        void main() {
          vUv = uv;
          gl_Position = vec4(position, 1.0);
        }
      `,
      fragmentShader: `
        uniform float uTime;
        uniform vec3 uColor;
        uniform float uOpacity;
        varying vec2 vUv;

        float random(vec2 st) {
          return fract(sin(dot(st.xy, vec2(12.9898,78.233))) * 43758.5453123);
        }

        void main() {
          vec2 uv = vUv;
          float grain = random(uv * 1200.0 + uTime * 0.08) * 0.035;

          float dist = length(uv - vec2(0.5));
          float vignette = smoothstep(1.0, 0.4, dist);

          // Two wandering gold glows for richer atmosphere
          float glow1 = smoothstep(0.55, 0.0, distance(uv, vec2(0.5 + sin(uTime*0.25)*0.08, 0.45 + cos(uTime*0.18)*0.06))) * 0.20;
          float glow2 = smoothstep(0.7, 0.0, distance(uv, vec2(0.55 + cos(uTime*0.15)*0.05, 0.55 + sin(uTime*0.22)*0.05))) * 0.10;
          vec3 gold = vec3(0.77, 0.62, 0.35) * (glow1 + glow2);

          vec3 color = (uColor + gold) * vignette;
          gl_FragColor = vec4(color + grain, uOpacity * vignette);
        }
      `,
      transparent: true,
      depthWrite: false,
    });

    const geometry = new THREE.PlaneGeometry(2, 2);
    const mesh = new THREE.Mesh(geometry, material);
    scene.add(mesh);

    let rafId: number;
    let isPaused = false;
    const clock = new THREE.Clock();

    const animate = () => {
      if (!isPaused) {
        uniforms.uTime.value = clock.getElapsedTime();
        renderer.render(scene, camera);
      }
      rafId = requestAnimationFrame(animate);
    };
    animate();

    const handleResize = () => renderer.setSize(window.innerWidth, window.innerHeight);
    window.addEventListener("resize", handleResize);

    const handleVisibility = () => {
      isPaused = document.hidden;
    };
    document.addEventListener("visibilitychange", handleVisibility);

    return () => {
      cancelAnimationFrame(rafId);
      window.removeEventListener("resize", handleResize);
      document.removeEventListener("visibilitychange", handleVisibility);
      geometry.dispose();
      material.dispose();
      renderer.dispose();
    };
  }, []);

  // --- 2. GSAP LABELLED TIMELINE ---
  useLayoutEffect(() => {
    gsap.registerPlugin(ScrollTrigger);

    const ctx = gsap.context(() => {
      const mm = gsap.matchMedia();

      // --- DESKTOP CINEMATIC PINNED TIMELINE ---
      mm.add(
        "(min-width: 1024px) and (prefers-reduced-motion: no-preference)",
        () => {
          gsap.set(".img-layer", { autoAlpha: 0, scale: 1.08 });
          gsap.set(".img-layer-0", { autoAlpha: 1, scale: 1 });

          gsap.set(".text-block", { autoAlpha: 0, yPercent: -50, y: 30 });
          gsap.set(".text-block-0", { autoAlpha: 1, yPercent: -50, y: 0 });

          gsap.set(".headline-line span", { yPercent: 110 });
          gsap.set(".anim-fade-up", { opacity: 0, y: 20 });

          const colorMap = [
            "#171715",
            "#1a1a1a",
            "#1a1f1a",
            "#1f1a14",
            "#171715",
          ];

          const tl = gsap.timeline({
            scrollTrigger: {
              trigger: sectionRef.current,
              start: "top top",
              end: "+=500%",
              scrub: 1,
              pin: stickyRef.current,
              invalidateOnRefresh: true,
              onUpdate: (self) => {
                const progress = self.progress;
                let newIndex = 0;
                if (progress >= 0.8) newIndex = 4;
                else if (progress >= 0.6) newIndex = 3;
                else if (progress >= 0.4) newIndex = 2;
                else if (progress >= 0.2) newIndex = 1;

                if (activeProjectRef.current !== newIndex) {
                  activeProjectRef.current = newIndex;
                  setActiveProject(newIndex);

                  if (threeUniforms.current) {
                    const color = colorMap[newIndex];
                    gsap.to(threeUniforms.current.uColor.value, {
                      r: parseInt(color.slice(1, 3), 16) / 255,
                      g: parseInt(color.slice(3, 5), 16) / 255,
                      b: parseInt(color.slice(5, 7), 16) / 255,
                      duration: 1.5,
                      overwrite: true,
                    });
                  }
                }
              },
            },
          });

          // Phase 0: Intro
          tl.addLabel("intro")
            .to(".text-block-0 .headline-line span", { yPercent: 0, stagger: 0.1, duration: 0.6, ease: "power3.out" }, "intro")
            .to(".text-block-0 .anim-fade-up", { opacity: 1, y: 0, stagger: 0.08, duration: 0.5, ease: "power3.out" }, "intro+=0.2")
            .to({}, { duration: 1.4 });

          const createPhase = (label: string, prevIdx: number, nextIdx: number) => {
            tl.addLabel(label)
              .to(`.text-block-${prevIdx}`, { autoAlpha: 0, y: -30, duration: 0.5, ease: "power2.inOut" }, label)
              .to(`.img-layer-${prevIdx}`, { autoAlpha: 0, scale: 1.12, duration: 1, ease: "power2.inOut" }, label)
              .to(`.img-layer-${nextIdx}`, { autoAlpha: 1, scale: 1, duration: 1, ease: "power2.inOut" }, label)
              .to(`.text-block-${nextIdx}`, { autoAlpha: 1, y: 0, duration: 0.5, ease: "power2.out" }, `${label}+=0.5`)
              .to(`.text-block-${nextIdx} .headline-line span`, { yPercent: 0, stagger: 0.1, duration: 0.6, ease: "power3.out" }, `${label}+=0.5`)
              .to(`.text-block-${nextIdx} .anim-fade-up`, { opacity: 1, y: 0, stagger: 0.06, duration: 0.5, ease: "power3.out" }, `${label}+=0.7`)
              .to({}, { duration: 0.8 });
          };

          createPhase("proj1", 0, 1);
          createPhase("proj2", 1, 2);
          createPhase("proj3", 2, 3);
          createPhase("outro", 3, 4);
        }
      );

      // --- MOBILE & REDUCED MOTION FALLBACK ---
      mm.add("(max-width: 1023px), (prefers-reduced-motion: reduce)", () => {
        gsap.set([".img-layer", ".text-block", ".headline-line span", ".anim-fade-up"], { clearProps: "all" });

        // Mobile progress bar
        gsap.fromTo(".mobile-progress-fill",
          { scaleX: 0 },
          {
            scaleX: 1, ease: "none",
            scrollTrigger: {
              trigger: sectionRef.current,
              start: "top top",
              end: "bottom bottom",
              scrub: true,
            }
          }
        );

        // Mobile progress bar visibility
        gsap.fromTo(mobileProgressRef.current,
          { opacity: 0 },
          {
            opacity: 1, ease: "none",
            scrollTrigger: {
              trigger: sectionRef.current,
              start: "top top",
              end: "top 30%",
              scrub: 1,
            }
          }
        );

        // Track active mobile section
        const sections = gsap.utils.toArray<HTMLElement>(".mobile-section");
        sections.forEach((sec, i) => {
          ScrollTrigger.create({
            trigger: sec,
            start: "top 50%",
            end: "bottom 50%",
            onToggle: (self) => {
              if (self.isActive) setMobileActiveSection(i);
            },
          });
        });

        // Card entrance animations
        gsap.utils.toArray<HTMLElement>(".mobile-card").forEach((card) => {
          gsap.from(card, {
            opacity: 0,
            y: 40,
            duration: 0.9,
            ease: "power3.out",
            scrollTrigger: { trigger: card, start: "top 85%" },
          });
        });
      });

      if (typeof document !== "undefined" && document.fonts) {
        document.fonts.ready.then(() => ScrollTrigger.refresh());
      }
    }, sectionRef);

    return () => ctx.revert();
  }, []);

  const mobileSections = [
    { label: "Intro", name: "Three projects, one address" },
    { label: "01", name: "Express Highway Inn" },
    { label: "02", name: "Sampan Condominium" },
    { label: "03", name: "Sampan Trade Emporium" },
    { label: "Outro", name: "Strong alone, together" },
  ];

  return (
    <section
      ref={sectionRef}
      className={`${luxSerif.variable} ${luxSans.variable} relative w-full bg-[#171715] text-[#F4F1EA] font-lux-sans antialiased lg:h-[500vh] motion-reduce:h-auto`}
    >
      {/* ═══════════════════════════════════════════════════════════
          MOBILE PROGRESS BAR (top sticky)
         ═══════════════════════════════════════════════════════════ */}
      <div
        ref={mobileProgressRef}
        className="lg:hidden fixed top-0 left-0 right-0 z-50 opacity-0"
      >
        <div className="flex items-center justify-between px-5 py-3 backdrop-blur-md bg-[#171715]/85 border-b border-[rgba(244,241,234,0.08)]">
          <div className="flex items-baseline gap-3">
            <span className="text-sm font-lux-serif italic text-[#19ABE1]">
              {mobileSections[mobileActiveSection]?.label}
            </span>
            <span className="text-[9px] uppercase tracking-[0.3em] text-[#B5B1A8] truncate max-w-[180px]">
              {mobileSections[mobileActiveSection]?.name}
            </span>
          </div>
          <span className="text-[9px] uppercase tracking-[0.3em] text-[#89867E]">
            {mobileActiveSection + 1} / {mobileSections.length}
          </span>
        </div>
        <div className="h-[2px] w-full bg-[rgba(244,241,234,0.08)]">
          <div className="mobile-progress-fill h-full w-full bg-[#19ABE1] origin-left scale-x-0"></div>
        </div>
      </div>

      {/* ═══════════════════════════════════════════════════════════
          STICKY DESKTOP CINEMATIC VIEWPORT
         ═══════════════════════════════════════════════════════════ */}
      <div
        ref={stickyRef}
        className="lg:sticky lg:top-0 h-screen w-full overflow-hidden hidden lg:flex motion-reduce:hidden items-center"
      >
        <canvas ref={canvasRef} className="absolute inset-0 z-0 pointer-events-none" />

        {/* Architectural corner brackets */}
        <div className="pointer-events-none absolute left-8 top-8 z-30 h-10 w-10 border-l border-t border-[#19ABE1]/40" />
        <div className="pointer-events-none absolute right-8 top-8 z-30 h-10 w-10 border-r border-t border-[#19ABE1]/40" />
        <div className="pointer-events-none absolute bottom-8 left-8 z-30 h-10 w-10 border-b border-l border-[#19ABE1]/40" />
        <div className="pointer-events-none absolute bottom-8 right-8 z-30 h-10 w-10 border-b border-r border-[#19ABE1]/40" />

        {/* Architectural grid */}
        <div
          className="absolute inset-0 z-10 pointer-events-none opacity-[0.06]"
          style={{
            backgroundImage:
              "linear-gradient(rgba(244,241,234,0.2) 1px, transparent 1px), linear-gradient(90deg, rgba(244,241,234,0.2) 1px, transparent 1px)",
            backgroundSize: "120px 120px",
          }}
        />

        {/* Top meta bar */}
        <div className="absolute left-0 right-0 top-0 z-30 flex items-center justify-between px-12 py-6 pointer-events-none">
          <div className="flex items-center gap-4">
            <span className="h-[1px] w-8 bg-[#19ABE1]" />
            <span className="text-[10px] uppercase tracking-[0.4em] text-[#89867E]">
              One Connected Destination
            </span>
          </div>
          <div className="flex items-center gap-3 text-[10px] uppercase tracking-[0.3em] text-[#89867E]">
            <span>Dhaka — Chittagong Highway</span>
          </div>
        </div>

        {/* Image Layers */}
        <div className="absolute inset-0 z-10">
          <div
            className="img-layer img-layer-0 absolute inset-0"
            style={{
              backgroundImage:
                "url(https://images.unsplash.com/photo-1448630360428-65456885c650?q=80&w=2070&auto=format&fit=crop)",
              backgroundSize: "cover",
              backgroundPosition: "center",
            }}
          >
            <div className="absolute inset-0 bg-gradient-to-r from-[#171715] via-[#171715]/70 to-[#171715]/30" />
          </div>
          {PROJECTS.map((p, i) => (
            <div
              key={i}
              className={`img-layer img-layer-${i + 1} absolute inset-0`}
              style={{
                backgroundImage: `url(${p.img})`,
                backgroundSize: "cover",
                backgroundPosition: "center",
              }}
            >
              <div className="absolute inset-0 bg-gradient-to-r from-[#171715] via-[#171715]/72 to-[#171715]/30" />
              <div className="absolute inset-0 bg-gradient-to-t from-[#171715]/60 via-transparent to-transparent" />
            </div>
          ))}
          <div
            className="img-layer img-layer-4 absolute inset-0"
            style={{
              backgroundImage:
                "url(https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?q=80&w=2070&auto=format&fit=crop)",
              backgroundSize: "cover",
              backgroundPosition: "center",
            }}
          >
            <div className="absolute inset-0 bg-gradient-to-r from-[#171715] via-[#171715]/75 to-[#171715]/40" />
          </div>
        </div>

        {/* Text Content Container */}
        <div className="relative z-20 w-full max-w-[1600px] mx-auto px-6 md:px-12 lg:px-24 pointer-events-none">
          {/* Intro Block */}
          <div className="text-block text-block-0 opacity-0 absolute top-1/2 left-6 md:left-12 lg:left-24 -translate-y-1/2 max-w-3xl">
            <div className="anim-fade-up flex items-center gap-4 mb-10">
              <span className="h-[1.5px] w-16 bg-[#19ABE1]" />
              <span className="text-[10px] font-medium uppercase tracking-[0.5em] text-[#19ABE1]">
                Sampan Group · Highway District
              </span>
            </div>
            <h1 className="font-lux-serif text-[clamp(3rem,8.5vw,8.5rem)] leading-[0.88] tracking-[-0.03em] font-light text-[#F4F1EA]">
              <span className="headline-line block overflow-hidden pb-1">
                <span className="block">Three projects.</span>
              </span>
              <span className="headline-line block overflow-hidden pb-1">
                <span className="block italic text-[#19ABE1]">One address.</span>
              </span>
            </h1>
            <div className="anim-fade-up flex items-center gap-5 mt-12 text-[#89867E]">
              <div className="w-[1px] h-12 bg-gradient-to-b from-[#19ABE1] to-transparent" />
              <span className="text-[9px] uppercase tracking-[0.4em]">Scroll to explore the district</span>
            </div>
          </div>

          {/* Project Blocks */}
          {PROJECTS.map((project, i) => (
            <div
              key={project.index}
              className={`text-block text-block-${i + 1} opacity-0 absolute top-1/2 left-6 md:left-12 lg:left-24 -translate-y-1/2 max-w-2xl`}
            >
              <div className="anim-fade-up flex items-center gap-4 mb-10">
                <span className="font-lux-serif text-3xl italic font-light text-[#19ABE1]">{project.index}</span>
                <span className="h-px w-12 bg-[#19ABE1]" />
                <span className="text-[10px] uppercase tracking-[0.4em] text-[#19ABE1] font-medium">
                  {project.type}
                </span>
              </div>
              <h2 className="font-lux-serif text-4xl md:text-6xl lg:text-[5rem] leading-[0.9] tracking-[-0.02em] font-light mb-3 text-[#F4F1EA]">
                <span className="headline-line block overflow-hidden pb-1">
                  <span className="block">{project.name}</span>
                </span>
              </h2>
              <p className="anim-fade-up font-lux-serif text-xl md:text-2xl italic font-light text-[#19ABE1]/85 mb-8">
                {project.subhead}
              </p>
              <p className="anim-fade-up text-sm md:text-base text-[#B5B1A8] font-light leading-relaxed border-l-2 border-[#19ABE1]/40 pl-5 mb-10 max-w-xl">
                {project.desc}
              </p>

              <div className="anim-fade-up grid grid-cols-2 gap-x-8 gap-y-2.5 border-t border-[rgba(244,241,234,0.10)] pt-6 mb-10 max-w-md">
                {project.facts.map((fact, idx) => (
                  <div key={idx} className="flex items-center gap-3 text-[11px] text-[#B5B1A8] font-light">
                    <span className="w-1 h-1 rounded-full bg-[#19ABE1] flex-shrink-0" />
                    {fact}
                  </div>
                ))}
              </div>

              <div className="anim-fade-up flex items-center gap-6">
                <Link
                  href={project.slug}
                  className="group relative inline-flex items-center gap-3 overflow-hidden bg-[#19ABE1] text-[#171715] text-[10px] font-semibold uppercase tracking-[0.3em] px-8 py-4 transition-colors duration-500 hover:text-[#19ABE1] pointer-events-auto"
                >
                  <span className="absolute inset-0 bg-[#F4F1EA] translate-y-full group-hover:translate-y-0 transition-transform duration-500 ease-[cubic-bezier(0.22,1,0.36,1)] z-0" />
                  <span className="relative z-10 flex items-center gap-3">
                    {project.linkLabel}
                    <svg className="w-4 h-4 transition-transform duration-300 group-hover:translate-x-1" fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden="true">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" d="M14 5l7 7m0 0l-7 7m7-7H3" />
                    </svg>
                  </span>
                </Link>
                <span className="text-[10px] uppercase tracking-[0.3em] text-[#89867E]">{project.location}</span>
              </div>
            </div>
          ))}

          {/* Outro Block */}
          <div className="text-block text-block-4 opacity-0 absolute top-1/2 left-6 md:left-12 lg:left-24 -translate-y-1/2 max-w-3xl">
            <div className="anim-fade-up flex items-center gap-4 mb-10">
              <span className="h-[1.5px] w-16 bg-[#19ABE1]" />
              <span className="text-[10px] font-medium uppercase tracking-[0.5em] text-[#19ABE1]">
                The Connected District
              </span>
            </div>
            <h2 className="font-lux-serif text-[clamp(2.5rem,6vw,7rem)] leading-[0.9] tracking-[-0.02em] font-light text-[#F4F1EA] mb-8">
              <span className="headline-line block overflow-hidden pb-1">
                <span className="block">Strong alone.</span>
              </span>
              <span className="headline-line block overflow-hidden pb-1">
                <span className="block italic text-[#19ABE1]">Unstoppable together.</span>
              </span>
            </h2>
            <p className="anim-fade-up text-sm md:text-lg text-[#B5B1A8] font-light leading-relaxed max-w-xl mb-12">
              Stay, live, shop, and connect within one destination on the Dhaka–Chittagong Highway.
            </p>
            <Link
              href="/contact"
              className="anim-fade-up group relative inline-flex items-center gap-3 overflow-hidden bg-[#19ABE1] text-[#171715] text-[10px] font-semibold uppercase tracking-[0.3em] px-10 py-5 transition-colors duration-500 hover:text-[#19ABE1] pointer-events-auto"
            >
              <span className="absolute inset-0 bg-[#F4F1EA] translate-y-full group-hover:translate-y-0 transition-transform duration-500 ease-[cubic-bezier(0.22,1,0.36,1)] z-0" />
              <span className="relative z-10 flex items-center gap-3">
                Book a visit
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden="true">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" d="M14 5l7 7m0 0l-7 7m7-7H3" />
                </svg>
              </span>
            </Link>
          </div>
        </div>

        {/* Refined right-side progress rail */}
        <div
          className={`absolute right-12 top-1/2 -translate-y-1/2 z-30 hidden lg:flex flex-col items-end gap-5 pointer-events-none transition-opacity duration-700 ${
            activeProject === 0 || activeProject === 4 ? "opacity-0" : "opacity-100"
          }`}
        >
          <div className="flex flex-col items-end gap-1">
            <span className="font-lux-serif text-5xl italic font-light text-[#19ABE1] leading-none">
              0{activeProject > 0 && activeProject < 4 ? activeProject : 1}
            </span>
            <span className="text-[10px] uppercase tracking-[0.4em] text-[#B5B1A8]">
              {PROJECTS[(activeProject || 1) - 1]?.name ?? ""}
            </span>
            <span className="text-[10px] uppercase tracking-[0.4em] text-[#89867E]">of 03</span>
          </div>
          <div className="flex flex-col gap-1.5">
            {[1, 2, 3].map((n) => (
              <div
                key={n}
                className={`h-12 w-px transition-all duration-500 ${
                  activeProject === n ? "bg-[#19ABE1]" : "bg-[rgba(244,241,234,0.10)]"
                }`}
              />
            ))}
          </div>
        </div>
      </div>

      {/* ═══════════════════════════════════════════════════════════
          MOBILE / REDUCED-MOTION CARD-BASED LAYOUT
         ═══════════════════════════════════════════════════════════ */}
      <div className="lg:hidden motion-reduce:flex flex-col pt-16">
        {/* Mobile Intro — Hero card */}
        <section className="mobile-section mobile-card relative min-h-[88vh] flex flex-col justify-end px-5 py-12 overflow-hidden">
          <div className="absolute inset-0 z-0">
            <img
              src="https://images.unsplash.com/photo-1448630360428-65456885c650?q=80&w=1600&auto=format&fit=crop"
              alt=""
              className="w-full h-full object-cover opacity-40"
              loading="lazy"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-[#171715] via-[#171715]/70 to-[#171715]/30" />
          </div>
          <div className="relative z-10">
            <div className="flex items-center gap-3 mb-6">
              <span className="h-[1.5px] w-10 bg-[#19ABE1]" />
              <span className="text-[9px] font-medium uppercase tracking-[0.4em] text-[#19ABE1]">
                Highway District
              </span>
            </div>
            <h1 className="font-lux-serif text-[clamp(2.8rem,12vw,5rem)] leading-[0.88] tracking-[-0.03em] font-light text-[#F4F1EA]">
              Three projects.
              <br />
              <span className="italic text-[#19ABE1]">One address.</span>
            </h1>
            <p className="mt-6 text-sm font-light leading-relaxed text-[#B5B1A8] max-w-md">
              Three connected developments on the Dhaka–Chittagong Highway. Scroll to explore each one.
            </p>
            <div className="mt-8 flex items-center gap-3 text-[9px] uppercase tracking-[0.4em] text-[#89867E]">
              <div className="w-6 h-px bg-[#19ABE1]" />
              <span>Scroll to explore</span>
            </div>
          </div>
        </section>

        {/* Mobile Project Cards */}
        {PROJECTS.map((project) => (
          <section
            key={project.index}
            className="mobile-section mobile-card relative min-h-screen flex flex-col px-5 py-12 border-t border-[rgba(244,241,234,0.08)]"
          >
            {/* Card image — top portion */}
            <div className="relative w-full aspect-[4/3] overflow-hidden mb-8 bg-[#1D1D1A]">
              <img
                src={project.img}
                alt={project.name}
                className="w-full h-full object-cover"
                loading="lazy"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-[#171715]/60 via-transparent to-transparent" />
              {/* Top-left index badge */}
              <div className="absolute top-4 left-4 flex items-center gap-2 backdrop-blur-md bg-[#171715]/60 px-3 py-1.5">
                <span className="h-px w-4 bg-[#19ABE1]" />
                <span className="text-[9px] uppercase tracking-[0.3em] text-[#F4F1EA]">{project.index} / 03</span>
              </div>
              {/* Bottom type label */}
              <div className="absolute bottom-4 right-4">
                <span className="text-[9px] uppercase tracking-[0.3em] text-[#F4F1EA] backdrop-blur-md bg-[#171715]/60 px-3 py-1.5">
                  {project.type}
                </span>
              </div>
              {/* Corner accent */}
              <div className="absolute top-0 right-0 h-6 w-6 border-t border-r border-[#19ABE1]/50" />
            </div>

            {/* Card content */}
            <div className="flex-1 flex flex-col">
              <h2 className="font-lux-serif text-[clamp(2.2rem,8vw,3rem)] leading-[0.95] tracking-[-0.02em] font-light text-[#F4F1EA] mb-3">
                {project.name}
              </h2>
              <p className="font-lux-serif text-lg italic font-light text-[#19ABE1]/85 mb-6">
                {project.subhead}
              </p>
              <p className="text-sm text-[#B5B1A8] font-light leading-relaxed mb-8 border-l-2 border-[#19ABE1]/40 pl-4">
                {project.desc}
              </p>

              {/* Facts grid */}
              <div className="grid grid-cols-2 gap-x-4 gap-y-3 mb-8 border-t border-[rgba(244,241,234,0.10)] pt-6">
                {project.facts.map((fact, idx) => (
                  <div key={idx} className="flex items-center gap-2 text-xs text-[#B5B1A8] font-light">
                    <span className="w-1 h-1 rounded-full bg-[#19ABE1] flex-shrink-0" />
                    {fact}
                  </div>
                ))}
              </div>

              {/* CTA */}
              <Link
                href={project.slug}
                className="group relative inline-flex items-center justify-center gap-3 overflow-hidden bg-[#19ABE1] text-[#171715] text-[10px] font-semibold uppercase tracking-[0.3em] px-6 py-4 transition-colors duration-500 hover:text-[#19ABE1] mt-auto"
              >
                <span className="absolute inset-0 bg-[#F4F1EA] translate-y-full group-hover:translate-y-0 transition-transform duration-500 ease-[cubic-bezier(0.22,1,0.36,1)] z-0" />
                <span className="relative z-10 flex items-center gap-3">
                  {project.linkLabel}
                  <svg className="w-3.5 h-3.5 transition-transform duration-300 group-hover:translate-x-1" fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden="true">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" d="M14 5l7 7m0 0l-7 7m7-7H3" />
                  </svg>
                </span>
              </Link>
              <span className="mt-4 text-[9px] uppercase tracking-[0.3em] text-[#89867E] text-center">
                {project.location}
              </span>
            </div>
          </section>
        ))}

        {/* Mobile Outro */}
        <section className="mobile-section mobile-card relative min-h-[88vh] flex flex-col items-center justify-center text-center px-5 py-12 border-t border-[rgba(244,241,234,0.08)]">
          <div className="absolute inset-0 z-0">
            <img
              src="https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?q=80&w=1600&auto=format&fit=crop"
              alt=""
              className="w-full h-full object-cover opacity-25"
              loading="lazy"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-[#171715] via-[#171715]/80 to-[#171715]/60" />
          </div>
          <div className="relative z-10 max-w-md">
            <div className="flex items-center justify-center gap-3 mb-8">
              <span className="h-[1.5px] w-10 bg-[#19ABE1]" />
              <span className="text-[9px] font-medium uppercase tracking-[0.4em] text-[#19ABE1]">
                The Connected District
              </span>
              <span className="h-[1.5px] w-10 bg-[#19ABE1]" />
            </div>
            <h2 className="font-lux-serif text-[clamp(2.2rem,9vw,3.5rem)] leading-[0.95] tracking-[-0.02em] font-light text-[#F4F1EA] mb-6">
              Strong alone.
              <br />
              <span className="italic text-[#19ABE1]">Unstoppable together.</span>
            </h2>
            <p className="text-sm text-[#B5B1A8] font-light leading-relaxed mb-12">
              Stay, live, shop, and connect within one destination on the Dhaka–Chittagong Highway.
            </p>
            <Link
              href="/contact"
              className="group relative inline-flex items-center justify-center gap-3 overflow-hidden bg-[#19ABE1] text-[#171715] text-[10px] font-semibold uppercase tracking-[0.3em] px-8 py-4 transition-colors duration-500 hover:text-[#19ABE1]"
            >
              <span className="absolute inset-0 bg-[#F4F1EA] translate-y-full group-hover:translate-y-0 transition-transform duration-500 ease-[cubic-bezier(0.22,1,0.36,1)] z-0" />
              <span className="relative z-10 flex items-center gap-3">
                Book a visit
                <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden="true">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" d="M14 5l7 7m0 0l-7 7m7-7H3" />
                </svg>
              </span>
            </Link>
          </div>
        </section>
      </div>
    </section>
  );
}