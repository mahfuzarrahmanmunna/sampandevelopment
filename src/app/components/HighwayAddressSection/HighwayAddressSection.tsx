// app/components/HighwayAddressSection.tsx
"use client";

import { useLayoutEffect, useRef, useState, useEffect } from "react";
import Link from "next/link";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import * as THREE from "three";
import { Cormorant_Garamond, Inter, Instrument_Serif } from "next/font/google";

/* ─────────────────────────────────────────────────────────────
   TYPOGRAPHY
   Three voices: editorial serif (display), humanist sans (UI),
   typewriter serif (numerals / marginalia).
   ───────────────────────────────────────────────────────────── */
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

const luxMono = Instrument_Serif({
  subsets: ["latin"],
  weight: ["400"],
  style: ["normal", "italic"],
  variable: "--font-lux-mono",
});

/* ─────────────────────────────────────────────────────────────
   DATA — local image paths preserved exactly
   ───────────────────────────────────────────────────────────── */
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
    typology: "Hospitality",
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
    typology: "Residential",
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
    typology: "Mixed-use",
  },
];

/* ─────────────────────────────────────────────────────────────
   CUSTOM EASING — slow-out, cinematic
   ───────────────────────────────────────────────────────────── */
const EASE_OUT_EXPO = "expo.out";

export default function HighwayAddressSection() {
  const sectionRef = useRef<HTMLElement>(null);
  const stickyRef = useRef<HTMLDivElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const cursorRef = useRef<HTMLDivElement>(null);
  const [activeProject, setActiveProject] = useState(0); // 0 = Intro, 4 = Outro
  const activeProjectRef = useRef(0);
  const threeUniforms = useRef<any>(null);

  /* ═══════════════════════════════════════════════════════════
     1. THREE.JS — ATMOSPHERIC SHADER (vignette + grain + gold glow)
     ═══════════════════════════════════════════════════════════ */
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
      uTime: { value: 0 },
      uColor: { value: new THREE.Color("#050507") },
      uOpacity: { value: 0.6 },
      uMouse: { value: new THREE.Vector2(0.5, 0.5) },
    };
    threeUniforms.current = uniforms;

    const material = new THREE.ShaderMaterial({
      uniforms,
      vertexShader: `
        varying vec2 vUv;
        void main() { vUv = uv; gl_Position = vec4(position, 1.0); }
      `,
      fragmentShader: `
        uniform float uTime;
        uniform vec3  uColor;
        uniform float uOpacity;
        uniform vec2  uMouse;
        varying vec2  vUv;

        float hash(vec2 p) {
          return fract(sin(dot(p, vec2(127.1, 311.7))) * 43758.5453);
        }
        float noise(vec2 p) {
          vec2 i = floor(p), f = fract(p);
          float a = hash(i), b = hash(i + vec2(1.0, 0.0)),
                c = hash(i + vec2(0.0, 1.0)), d = hash(i + vec2(1.0, 1.0));
          vec2 u = f * f * (3.0 - 2.0 * f);
          return mix(a, b, u.x) + (c - a) * u.y * (b - a);
        }
        float fbm(vec2 p) {
          float v = 0.0, a = 0.5;
          for (int i = 0; i < 5; i++) { v += a * noise(p); p *= 2.0; a *= 0.5; }
          return v;
        }

        void main() {
          vec2 uv = vUv;
          vec2 p = uv - 0.5;
          float dist = length(p);

          vec2 glow = vec2(0.5 + sin(uTime * 0.15) * 0.08, 0.5 + cos(uTime * 0.12) * 0.06);
          float g = smoothstep(0.55, 0.0, distance(uv, glow)) * 0.14;

          float mouseGlow = smoothstep(0.35, 0.0, distance(uv, uMouse)) * 0.06;

          float n = fbm(uv * 3.0 + uTime * 0.03);
          n = pow(n, 1.5);

          float vignette = smoothstep(1.05, 0.25, dist);

          vec3 gold = vec3(0.722, 0.580, 0.353);
          vec3 color = uColor;
          color += gold * (g + mouseGlow);
          color += vec3(0.04) * n * vignette;
          color *= vignette;

          float grain = hash(uv * 1500.0 + uTime * 0.05) * 0.04;

          gl_FragColor = vec4(color + grain, uOpacity * vignette);
        }
      `,
      transparent: true,
      depthWrite: false,
    });

    const mesh = new THREE.Mesh(new THREE.PlaneGeometry(2, 2), material);
    scene.add(mesh);

    const clock = new THREE.Clock();
    let rafId: number = 0;
    let visible = true;

    const animate = () => {
      if (visible) {
        uniforms.uTime.value = clock.getElapsedTime();
        renderer.render(scene, camera);
      }
      rafId = requestAnimationFrame(animate);
    };
    animate();

    const handleResize = () => renderer.setSize(window.innerWidth, window.innerHeight);
    const handleMouse = (e: MouseEvent) => {
      gsap.to(uniforms.uMouse.value, {
        x: e.clientX / window.innerWidth,
        y: 1 - e.clientY / window.innerHeight,
        duration: 1.2,
        overwrite: true,
      });
    };

    window.addEventListener("resize", handleResize);
    window.addEventListener("mousemove", handleMouse);

    const io = new IntersectionObserver(
      ([entry]) => { visible = entry.isIntersecting; },
      { threshold: 0 }
    );
    if (sectionRef.current) io.observe(sectionRef.current);

    return () => {
      cancelAnimationFrame(rafId);
      window.removeEventListener("resize", handleResize);
      window.removeEventListener("mousemove", handleMouse);
      io.disconnect();
      mesh.geometry.dispose();
      material.dispose();
      renderer.dispose();
    };
  }, []);

  /* ═══════════════════════════════════════════════════════════
     2. CUSTOM CURSOR — refined ring follower (desktop only)
     ═══════════════════════════════════════════════════════════ */
  useEffect(() => {
    if (window.matchMedia("(max-width: 1023px)").matches) return;
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
    const cursor = cursorRef.current;
    if (!cursor) return;

    const xTo = gsap.quickTo(cursor, "x", { duration: 0.6, ease: "power3" });
    const yTo = gsap.quickTo(cursor, "y", { duration: 0.6, ease: "power3" });
    const move = (e: MouseEvent) => { xTo(e.clientX); yTo(e.clientY); };
    window.addEventListener("mousemove", move);
    return () => window.removeEventListener("mousemove", move);
  }, []);

  /* ═══════════════════════════════════════════════════════════
     3. GSAP — LABELLED CINEMATIC TIMELINE
     ═══════════════════════════════════════════════════════════ */
  useLayoutEffect(() => {
    gsap.registerPlugin(ScrollTrigger);

    const ctx = gsap.context(() => {
      const mm = gsap.matchMedia();

      /* ── DESKTOP CINEMATIC PINNED TIMELINE ─────────────── */
      mm.add(
        "(min-width: 1024px) and (prefers-reduced-motion: no-preference)",
        () => {
          gsap.set(".img-layer", { autoAlpha: 0, scale: 1.08 });
          gsap.set(".img-layer-0", { autoAlpha: 1, scale: 1 });

          gsap.set(".text-block", { autoAlpha: 0, yPercent: -50, y: 40 });
          gsap.set(".text-block-0", { autoAlpha: 1, yPercent: -50, y: 0 });

          gsap.set(".headline-line > span", { yPercent: 110 });
          gsap.set(".eyebrow-line", { autoAlpha: 0, x: -20 });
          gsap.set(".fade-up", { autoAlpha: 0, y: 24 });
          gsap.set(".fact-row", { autoAlpha: 0, y: 12 });

          const colorMap = [
            "#050507", // Intro
            "#1a1a1a", // Project 1
            "#0f1f1a", // Project 2
            "#1a1f0f", // Project 3
            "#050507", // Outro
          ];

          const tl = gsap.timeline({
            scrollTrigger: {
              trigger: sectionRef.current,
              start: "top top",
              end: "+=600%",
              scrub: 1,
              pin: stickyRef.current,
              invalidateOnRefresh: true,
              onUpdate: (self) => {
                const p = self.progress;
                let newIndex = 0;
                if (p >= 0.8) newIndex = 4;
                else if (p >= 0.6) newIndex = 3;
                else if (p >= 0.4) newIndex = 2;
                else if (p >= 0.2) newIndex = 1;

                if (activeProjectRef.current !== newIndex) {
                  activeProjectRef.current = newIndex;
                  setActiveProject(newIndex);

                  if (threeUniforms.current) {
                    const color = colorMap[newIndex];
                    gsap.to(threeUniforms.current.uColor.value, {
                      r: parseInt(color.slice(1, 3), 16) / 255,
                      g: parseInt(color.slice(3, 5), 16) / 255,
                      b: parseInt(color.slice(5, 7), 16) / 255,
                      duration: 1.6,
                      overwrite: true,
                      ease: "power2.inOut",
                    });
                  }
                }
              },
            },
          });

          /* ── PHASE 0 — INTRO (0–20%) ─────────────────── */
          tl.addLabel("intro")
            .to(".text-block-0 .eyebrow-line",
              { autoAlpha: 1, x: 0, duration: 0.8, ease: EASE_OUT_EXPO }, "intro")
            .to(".text-block-0 .headline-line > span",
              { yPercent: 0, stagger: 0.1, duration: 0.9, ease: EASE_OUT_EXPO }, "intro+=0.1")
            .to(".text-block-0 .fade-up",
              { autoAlpha: 1, y: 0, stagger: 0.1, duration: 0.8, ease: EASE_OUT_EXPO }, "intro+=0.4")
            .to({}, { duration: 1.4 });

          /* helper — generates the per-project transition */
          const projectPhase = (label: string, idx: number) => {
            const curBlock = `.text-block-${idx}`;
            const nextBlock = `.text-block-${idx + 1}`;
            tl.addLabel(label)
              .to(`${curBlock} .headline-line > span`,
                { yPercent: -110, stagger: 0.06, duration: 0.5, ease: "power3.in" }, label)
              .to(curBlock,
                { autoAlpha: 0, y: -40, duration: 0.6, ease: "power2.inOut" }, label)
              .to(`.img-layer-${idx}`,
                { autoAlpha: 0, scale: 1.18, duration: 1.4, ease: "power2.inOut" }, label)
              .to(`.img-layer-${idx + 1}`,
                { autoAlpha: 1, scale: 1, duration: 1.4, ease: "power2.inOut" }, label)
              .to(`${nextBlock} .eyebrow-line`,
                { autoAlpha: 1, x: 0, duration: 0.7, ease: EASE_OUT_EXPO }, `${label}+=0.55`)
              .to(`${nextBlock} .headline-line > span`,
                { yPercent: 0, stagger: 0.08, duration: 0.85, ease: EASE_OUT_EXPO }, `${label}+=0.65`)
              .to(`${nextBlock} .fade-up`,
                { autoAlpha: 1, y: 0, stagger: 0.08, duration: 0.75, ease: EASE_OUT_EXPO }, `${label}+=0.9`)
              .to(`${nextBlock} .fact-row`,
                { autoAlpha: 1, y: 0, stagger: 0.04, duration: 0.5, ease: "power2.out" }, `${label}+=1.1`)
              .to({}, { duration: 1.0 });
          };

          projectPhase("proj1", 0);
          projectPhase("proj2", 1);
          projectPhase("proj3", 2);

          /* ── PHASE 4 — OUTRO (80–100%) ────────────────── */
          tl.addLabel("outro")
            .to(".text-block-3 .headline-line > span",
              { yPercent: -110, stagger: 0.06, duration: 0.5, ease: "power3.in" }, "outro")
            .to(".text-block-3",
              { autoAlpha: 0, y: -40, duration: 0.6, ease: "power2.inOut" }, "outro")
            .to(".img-layer-3",
              { autoAlpha: 0, scale: 1.18, duration: 1.4, ease: "power2.inOut" }, "outro")
            .to(".img-layer-4",
              { autoAlpha: 1, scale: 1, duration: 1.4, ease: "power2.inOut" }, "outro")
            .to(".text-block-4 .eyebrow-line",
              { autoAlpha: 1, x: 0, duration: 0.7, ease: EASE_OUT_EXPO }, "outro+=0.55")
            .to(".text-block-4 .headline-line > span",
              { yPercent: 0, stagger: 0.1, duration: 0.9, ease: EASE_OUT_EXPO }, "outro+=0.65")
            .to(".text-block-4 .fade-up",
              { autoAlpha: 1, y: 0, stagger: 0.1, duration: 0.8, ease: EASE_OUT_EXPO }, "outro+=0.9")
            .to({}, { duration: 1.0 });
        }
      );

      /* ── MOBILE / REDUCED MOTION ─────────────────────── */
      mm.add(
        "(max-width: 1023px), (prefers-reduced-motion: reduce)",
        () => {
          gsap.set(
            [".img-layer", ".text-block", ".headline-line > span", ".eyebrow-line", ".fade-up", ".fact-row"],
            { clearProps: "all" }
          );

          gsap.utils.toArray<HTMLElement>(".mobile-block").forEach((block) => {
            gsap.from(block, {
              opacity: 0,
              y: 60,
              duration: 1.0,
              ease: EASE_OUT_EXPO,
              scrollTrigger: { trigger: block, start: "top 75%" },
            });
          });
        }
      );

      if (typeof document !== "undefined" && document.fonts) {
        document.fonts.ready.then(() => ScrollTrigger.refresh());
      }
    }, sectionRef);

    return () => ctx.revert();
  }, []);

  return (
    <section
      ref={sectionRef}
      data-component="HighwayAddressSection"
      className={`${luxSerif.variable} ${luxSans.variable} ${luxMono.variable} relative w-full bg-[#050507] text-[#EFE9DD] font-lux-sans antialiased lg:h-[600vh] motion-reduce:h-auto`}
    >
      {/* ═══════════════════════════════════════════════════════
          STICKY DESKTOP CINEMATIC VIEWPORT
         ═══════════════════════════════════════════════════════ */}
      <div
        ref={stickyRef}
        className="lg:sticky lg:top-0 h-screen w-full overflow-hidden hidden lg:flex motion-reduce:hidden items-center"
      >
        {/* WebGL atmospheric shader */}
        <canvas ref={canvasRef} className="absolute inset-0 z-0 pointer-events-none" />

        {/* Architectural grid (hairlines) */}
        <div
          className="absolute inset-0 z-10 pointer-events-none opacity-[0.05]"
          style={{
            backgroundImage:
              "linear-gradient(rgba(239,233,221,1) 1px, transparent 1px), linear-gradient(90deg, rgba(239,233,221,1) 1px, transparent 1px)",
            backgroundSize: "120px 120px",
          }}
        />

        {/* Fine film grain (CSS noise) */}
        <div
          className="absolute inset-0 z-[15] pointer-events-none opacity-[0.04] mix-blend-overlay"
          style={{
            backgroundImage:
              "url(\"data:image/svg+xml,%3Csvg viewBox='0 0 200 200' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='3'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23n)'/%3E%3C/svg%3E\")",
          }}
        />

        {/* ── IMAGE LAYERS (heavily darkened for premium mood) ── */}
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
            {/* Layered darkening: base charcoal + radial spotlight + warm gold tint */}
            <div className="absolute inset-0 bg-[#050507]/80" />
            <div
              className="absolute inset-0"
              style={{
                background:
                  "radial-gradient(ellipse at 30% 50%, transparent 0%, rgba(5,5,7,0.85) 70%)",
              }}
            />
            <div className="absolute inset-0 bg-gradient-to-r from-[#050507] via-[#050507]/60 to-transparent" />
            <div className="absolute inset-0 bg-[#C5A059]/[0.04] mix-blend-color-dodge" />
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
              {/* Heavy darkening for cinematic, premium mood */}
              <div className="absolute inset-0 bg-[#050507]/65" />
              <div
                className="absolute inset-0"
                style={{
                  background:
                    "radial-gradient(ellipse at 35% 50%, transparent 0%, rgba(5,5,7,0.75) 75%)",
                }}
              />
              {/* Left-to-right gradient for text legibility */}
              <div className="absolute inset-0 bg-gradient-to-r from-[#050507] via-[#050507]/55 to-transparent" />
              {/* Subtle bottom-fade for the status bar */}
              <div className="absolute inset-x-0 bottom-0 h-40 bg-gradient-to-t from-[#050507] to-transparent" />
              {/* Warm gold tint for tonal cohesion */}
              <div className="absolute inset-0 bg-[#C5A059]/[0.03] mix-blend-color-dodge" />
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
            <div className="absolute inset-0 bg-[#050507]/88" />
            <div className="absolute inset-0 bg-gradient-to-r from-[#050507] via-[#050507]/70 to-transparent" />
            <div className="absolute inset-0 bg-[#C5A059]/[0.05] mix-blend-color-dodge" />
          </div>
        </div>

        {/* ── TOP BAR (brand · section label · live counter) ── */}
        <header className="absolute top-0 left-0 right-0 z-30 flex items-center justify-between px-6 md:px-12 lg:px-20 py-8 pointer-events-none">
          <div className="flex items-center gap-3">
            <span className="w-2 h-2 rounded-full bg-[#C5A059]" />
            <span className="font-lux-mono text-[11px] tracking-[0.3em] uppercase text-[#EFE9DD]/70">
              Sampan&nbsp;Holdings
            </span>
          </div>

          <span className="font-lux-mono text-[11px] tracking-[0.3em] uppercase text-[#EFE9DD]/40">
            One Address — Three Destinations
          </span>

          <span className="font-lux-mono text-[11px] tracking-[0.3em] uppercase text-[#C5A059]">
            {String(Math.max(0, Math.min(4, activeProject))).padStart(2, "0")} / 04
          </span>
        </header>

        {/* ── ARCHITECTURAL CORNER MARKS ───────────────────── */}
        <CornerMarks />

        {/* ── MAIN CONTENT (left rail) ──────────────────────── */}
        <div className="relative z-20 w-full max-w-[1600px] mx-auto px-6 md:px-12 lg:px-20 lg:py-0 pointer-events-none">
          {/* ─── INTRO BLOCK ─── */}
          <div className="text-block text-block-0 opacity-0 absolute top-1/2 left-6 md:left-12 lg:left-20 -translate-y-1/2 max-w-4xl">
            <div className="eyebrow-line flex items-center gap-6 mb-10">
              <span className="h-[1px] w-20 bg-[#C5A059]" />
              <span className="font-lux-mono text-[10px] uppercase tracking-[0.45em] text-[#C5A059]">
                A Connected Destination
              </span>
            </div>

            <h1 className="font-lux-serif text-[clamp(3.5rem,10vw,10rem)] leading-[0.85] tracking-[-0.04em] font-light">
              <span className="headline-line block overflow-hidden">
                <span className="block">Three projects.</span>
              </span>
              <span className="headline-line block overflow-hidden">
                <span className="block italic text-[#C5A059]">One address.</span>
              </span>
            </h1>

            <div className="fade-up mt-12 max-w-xl">
              <p className="text-sm md:text-base text-[#EFE9DD]/65 font-light leading-[1.7] border-l border-[#C5A059]/40 pl-6">
                On the Dhaka–Chittagong Highway, hospitality, residential living, and
                commerce converge into a single, connected destination. Each project stands
                alone in its purpose. Together, they form an ecosystem.
              </p>
            </div>

            <div className="fade-up mt-14 flex items-center gap-5 text-[#EFE9DD]/45">
              <span className="font-lux-mono text-[9px] uppercase tracking-[0.4em]">Scroll to explore</span>
              <span className="relative w-px h-14 bg-gradient-to-b from-[#C5A059] via-[#C5A059]/40 to-transparent">
                <span className="absolute top-0 left-1/2 -translate-x-1/2 w-1.5 h-1.5 rounded-full bg-[#C5A059] animate-pulse" />
              </span>
            </div>
          </div>

          {/* ─── PROJECT BLOCKS ─── */}
          {PROJECTS.map((project, i) => (
            <div
              key={project.index}
              className={`text-block text-block-${i + 1} opacity-0 absolute top-1/2 left-6 md:left-12 lg:left-20 -translate-y-1/2 max-w-3xl`}
            >
              {/* Eyebrow */}
              <div className="eyebrow-line flex items-center gap-5 mb-8">
                <span className="font-lux-mono text-[11px] uppercase tracking-[0.4em] text-[#C5A059] font-medium">
                  {project.index}
                </span>
                <span className="h-px w-14 bg-[#C5A059]/50" />
                <span className="font-lux-mono text-[10px] uppercase tracking-[0.4em] text-[#EFE9DD]/55">
                  {project.typology} · Ongoing
                </span>
              </div>

              {/* Headline */}
              <h2 className="font-lux-serif text-4xl md:text-6xl lg:text-[5.5rem] leading-[0.92] tracking-[-0.025em] font-light text-[#EFE9DD] mb-6">
                <span className="headline-line block overflow-hidden">
                  <span className="block">{project.name}</span>
                </span>
              </h2>

              {/* Subhead as editorial pull-quote */}
              <p className="fade-up font-lux-serif text-2xl md:text-3xl italic font-light text-[#C5A059] mb-10 leading-tight">
                {project.subhead}
              </p>

              {/* Description */}
              <p className="fade-up text-sm md:text-base text-[#EFE9DD]/65 font-light leading-[1.75] border-l border-[#C5A059]/40 pl-6 mb-10 max-w-xl">
                {project.desc}
              </p>

              {/* Facts grid */}
              <div className="fade-up mb-10">
                <div className="font-lux-mono text-[9px] uppercase tracking-[0.35em] text-[#EFE9DD]/40 mb-4">
                  Specifications
                </div>
                <div className="grid grid-cols-2 gap-x-10 gap-y-3 border-t border-[#EFE9DD]/10 pt-6 max-w-lg">
                  {project.facts.map((fact, idx) => (
                    <div
                      key={idx}
                      className="fact-row flex items-center gap-3 text-[12px] text-[#EFE9DD]/85 font-light"
                    >
                      <span className="w-1 h-1 rounded-full bg-[#C5A059]" />
                      {fact}
                    </div>
                  ))}
                </div>
              </div>

              {/* CTA — magnetic link */}
              <Link
                href={project.slug}
                className="group fade-up inline-flex items-center gap-5 text-[11px] font-semibold uppercase tracking-[0.35em] text-[#EFE9DD] hover:text-[#C5A059] transition-colors duration-500 w-fit pointer-events-auto"
              >
                {project.linkLabel}
                <span className="relative w-16 h-px bg-current overflow-hidden">
                  <span className="absolute inset-0 bg-[#C5A059] translate-x-[-100%] group-hover:translate-x-0 transition-transform duration-700 ease-[cubic-bezier(0.16,1,0.3,1)]" />
                </span>
                <svg
                  className="w-4 h-4 transition-transform duration-500 group-hover:translate-x-1.5"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" d="M14 5l7 7m0 0l-7 7m7-7H3" />
                </svg>
              </Link>
            </div>
          ))}

          {/* ─── OUTRO BLOCK ─── */}
          <div className="text-block text-block-4 opacity-0 absolute top-1/2 left-6 md:left-12 lg:left-20 -translate-y-1/2 max-w-4xl">
            <div className="eyebrow-line flex items-center gap-6 mb-10">
              <span className="h-[1px] w-20 bg-[#C5A059]" />
              <span className="font-lux-mono text-[10px] uppercase tracking-[0.45em] text-[#C5A059]">
                The Ecosystem
              </span>
            </div>

            <h2 className="font-lux-serif text-[clamp(2.5rem,7vw,8rem)] leading-[0.9] tracking-[-0.03em] font-light text-[#EFE9DD] mb-12">
              <span className="headline-line block overflow-hidden">
                <span className="block">Strong alone.</span>
              </span>
              <span className="headline-line block overflow-hidden">
                <span className="block italic text-[#C5A059]">Unstoppable together.</span>
              </span>
            </h2>

            <p className="fade-up text-base md:text-lg text-[#EFE9DD]/65 font-light leading-[1.7] max-w-xl mb-14">
              Stay, live, shop, and connect within one destination on the
              Dhaka–Chittagong Highway. Book a private visit to walk through
              the masterplan, the units, and the vision.
            </p>

            <div className="fade-up flex items-center gap-8 pointer-events-auto">
              <Link
                href="/contact"
                className="group relative overflow-hidden bg-[#C5A059] text-[#050507] text-[11px] font-semibold uppercase tracking-[0.35em] px-12 py-5 flex items-center gap-3 transition-colors duration-500 hover:text-[#C5A059]"
              >
                <span className="absolute inset-0 bg-[#EFE9DD] translate-y-full group-hover:translate-y-0 transition-transform duration-700 ease-[cubic-bezier(0.16,1,0.3,1)]" />
                <span className="relative z-10 flex items-center gap-3">
                  Book a private visit
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" d="M14 5l7 7m0 0l-7 7m7-7H3" />
                  </svg>
                </span>
              </Link>

              <Link
                href="/projects"
                className="text-[11px] font-semibold uppercase tracking-[0.35em] text-[#EFE9DD]/70 hover:text-[#C5A059] transition-colors duration-500"
              >
                View all projects
              </Link>
            </div>
          </div>
        </div>

        {/* ── RIGHT RAIL — vertical project index ───────────── */}
        <aside
          className={`absolute right-12 top-1/2 -translate-y-1/2 z-30 flex flex-col items-end gap-6 transition-all duration-700 ${
            activeProject === 0 || activeProject === 4 ? "opacity-0 translate-x-6" : "opacity-100"
          }`}
        >
          <div className="font-lux-serif text-5xl text-[#C5A059] tabular-nums leading-none">
            {activeProject > 0 && activeProject < 4 ? `0${activeProject}` : ""}
          </div>

          <div className="relative h-40 w-px bg-[#EFE9DD]/15">
            <div
              className="absolute top-0 left-0 w-full bg-[#C5A059] origin-top transition-transform duration-700 ease-[cubic-bezier(0.16,1,0.3,1)]"
              style={{
                transform: `scaleY(${
                  activeProject > 0 && activeProject < 4 ? activeProject / 3 : 0
                })`,
              }}
            />
          </div>

          <div className="flex flex-col gap-3 items-end">
            {PROJECTS.map((p, i) => (
              <div
                key={p.index}
                className={`font-lux-mono text-[10px] tracking-[0.3em] uppercase transition-colors duration-500 ${
                  activeProject === i + 1 ? "text-[#C5A059]" : "text-[#EFE9DD]/30"
                }`}
              >
                {p.name.split(" ")[0]}
              </div>
            ))}
          </div>

          <div className="font-lux-mono text-[9px] tracking-[0.4em] uppercase text-[#EFE9DD]/40 [writing-mode:vertical-rl] rotate-180 mt-2">
            Index
          </div>
        </aside>

        {/* ── BOTTOM STATUS BAR ─────────────────────────────── */}
        <footer className="absolute bottom-0 left-0 right-0 z-30 px-6 md:px-12 lg:px-20 py-6 pointer-events-none">
          <div className="flex items-end justify-between gap-8">
            <div className="flex items-center gap-3">
              <span className="font-lux-mono text-[10px] tracking-[0.35em] uppercase text-[#EFE9DD]/40">
                Currently viewing
              </span>
              <span className="font-lux-serif text-base italic text-[#EFE9DD]/90">
                {activeProject === 0
                  ? "Introduction"
                  : activeProject === 4
                  ? "The Ecosystem"
                  : PROJECTS[activeProject - 1].name}
              </span>
            </div>

            <div className="flex-1 max-w-md mx-8">
              <div className="h-px w-full bg-[#EFE9DD]/15 relative">
                <div
                  className="absolute top-0 left-0 h-full bg-[#C5A059] transition-all duration-700 ease-[cubic-bezier(0.16,1,0.3,1)]"
                  style={{
                    width: `${(activeProject / 4) * 100}%`,
                  }}
                />
              </div>
            </div>

            <div className="font-lux-mono text-[10px] tracking-[0.3em] uppercase text-[#EFE9DD]/40">
              Dhaka — Chittagong
            </div>
          </div>
        </footer>

        {/* Custom cursor ring */}
        <div
          ref={cursorRef}
          className="pointer-events-none fixed top-0 left-0 z-50 w-8 h-8 rounded-full border border-[#C5A059]/60 hidden lg:block"
          style={{ transform: "translate(-50%, -50%)" }}
        />
      </div>

      {/* ═══════════════════════════════════════════════════════
          MOBILE / REDUCED-MOTION STACKED LAYOUT
         ═══════════════════════════════════════════════════════ */}
      <div className="lg:hidden motion-reduce:flex flex-col">
        {/* Mobile Intro */}
        <div className="mobile-block relative min-h-[80vh] flex items-center px-6 py-24">
          <div className="absolute inset-0 z-0">
            <img
              src="https://images.unsplash.com/photo-1448630360428-65456885c650?q=80&w=2070&auto=format&fit=crop"
              alt=""
              className="w-full h-full object-cover opacity-20"
            />
            <div className="absolute inset-0 bg-[#050507]/90" />
          </div>
          <div className="relative z-10 max-w-xl">
            <div className="flex items-center gap-4 mb-8">
              <span className="h-px w-12 bg-[#C5A059]" />
              <span className="font-lux-mono text-[10px] uppercase tracking-[0.4em] text-[#C5A059]">
                A Connected Destination
              </span>
            </div>
            <h1 className="font-lux-serif text-5xl leading-[0.85] tracking-[-0.03em] font-light">
              Three projects.
              <br />
              <span className="italic text-[#C5A059]">One address.</span>
            </h1>
            <p className="mt-8 text-sm text-[#EFE9DD]/65 font-light leading-relaxed border-l border-[#C5A059]/40 pl-4">
              On the Dhaka–Chittagong Highway, hospitality, residential living,
              and commerce converge into a single, connected destination.
            </p>
          </div>
        </div>

        {/* Mobile Project Blocks */}
        {PROJECTS.map((project) => (
          <div
            key={project.index}
            className="mobile-block relative min-h-screen flex items-center px-6 py-24 border-t border-[#EFE9DD]/10"
          >
            <div className="absolute inset-0 z-0">
              <img src={project.img} alt={project.name} className="w-full h-full object-cover opacity-25" />
              <div className="absolute inset-0 bg-[#050507]/85" />
              <div className="absolute inset-x-0 bottom-0 h-32 bg-gradient-to-t from-[#050507] to-transparent" />
            </div>
            <div className="relative z-10 max-w-xl">
              <div className="flex items-center gap-4 mb-6">
                <span className="font-lux-mono text-[11px] uppercase tracking-[0.4em] text-[#C5A059] font-medium">
                  {project.index}
                </span>
                <span className="h-px w-12 bg-[#C5A059]/50" />
                <span className="font-lux-mono text-[9px] uppercase tracking-[0.4em] text-[#EFE9DD]/55">
                  {project.typology}
                </span>
              </div>
              <h2 className="font-lux-serif text-4xl md:text-5xl leading-[0.92] font-light mb-4">
                {project.name}
              </h2>
              <p className="font-lux-serif text-xl italic font-light text-[#C5A059] mb-6">
                {project.subhead}
              </p>
              <p className="text-sm text-[#EFE9DD]/65 font-light mb-8 leading-relaxed border-l border-[#C5A059]/40 pl-4">
                {project.desc}
              </p>
              <div className="font-lux-mono text-[9px] uppercase tracking-[0.35em] text-[#EFE9DD]/40 mb-3">
                Specifications
              </div>
              <div className="grid grid-cols-2 gap-3 mb-8 border-t border-[#EFE9DD]/10 pt-5">
                {project.facts.map((fact, idx) => (
                  <div key={idx} className="flex items-center gap-2 text-xs text-[#EFE9DD]/85 font-light">
                    <span className="w-1 h-1 rounded-full bg-[#C5A059]" /> {fact}
                  </div>
                ))}
              </div>
              <Link
                href={project.slug}
                className="inline-flex items-center gap-3 text-[11px] font-semibold uppercase tracking-[0.3em] text-[#C5A059]"
              >
                {project.linkLabel} →
              </Link>
            </div>
          </div>
        ))}

        {/* Mobile Outro */}
        <div className="mobile-block relative min-h-[80vh] flex items-center justify-center text-center px-6 py-24 border-t border-[#EFE9DD]/10">
          <div className="absolute inset-0 z-0">
            <img
              src="https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?q=80&w=2070&auto=format&fit=crop"
              alt=""
              className="w-full h-full object-cover opacity-12"
            />
            <div className="absolute inset-0 bg-[#050507]/92" />
          </div>
          <div className="relative z-10">
            <div className="flex items-center gap-4 justify-center mb-8">
              <span className="h-px w-12 bg-[#C5A059]" />
              <span className="font-lux-mono text-[10px] uppercase tracking-[0.4em] text-[#C5A059]">
                The Ecosystem
              </span>
              <span className="h-px w-12 bg-[#C5A059]" />
            </div>
            <h2 className="font-lux-serif text-4xl leading-[0.92] font-light mb-8">
              Strong alone.
              <br />
              <span className="italic text-[#C5A059]">Unstoppable together.</span>
            </h2>
            <p className="text-sm text-[#EFE9DD]/65 font-light mb-10 max-w-md mx-auto leading-relaxed">
              Stay, live, shop, and connect within one destination on the
              Dhaka–Chittagong Highway.
            </p>
            <Link
              href="/contact"
              className="bg-[#C5A059] text-[#050507] text-[11px] font-semibold uppercase tracking-[0.3em] px-10 py-4 inline-block"
            >
              Book a visit
            </Link>
          </div>
        </div>
      </div>
    </section>
  );
}

/* ─────────────────────────────────────────────────────────────
   ARCHITECTURAL CORNER MARKS — hairlines at viewport corners
   ───────────────────────────────────────────────────────────── */
function CornerMarks() {
  const marks = [
    "top-8 left-8 border-l border-t",
    "top-8 right-8 border-r border-t",
    "bottom-8 left-8 border-l border-b",
    "bottom-8 right-8 border-r border-b",
  ];
  return (
    <div className="absolute inset-0 z-20 pointer-events-none">
      {marks.map((cls, i) => (
        <span key={i} className={`absolute w-6 h-6 border-[#C5A059]/40 ${cls}`} />
      ))}
    </div>
  );
}
