// app/contact/page.tsx
"use client";

import { useState, useLayoutEffect, useRef, useEffect } from "react";
import Link from "next/link";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import Lenis from "lenis";
import * as THREE from "three";
import { Cormorant_Garamond, Inter } from "next/font/google";

// --- Font Optimization ---
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

// --- Configuration ---
const CONFIG = {
  whatsapp: "https://wa.me/8801929918400",
  phone: "+880 1929918400–11",
  phoneRaw: "+8801929918400",
  email: "info@sampangroup.com.bd",
  address: "Sampan 21st Century Tower, H 284, Rd 1/A, Block B, Bashundhara R/A, Dhaka, Bangladesh, 1229",
  hours: "10:00 AM – 06:00 PM",
  fridayHours: "Friday: Closed",
  responseTime: "one working day",
  mapsLink: "https://www.google.com/maps/search/?api=1&query=Sampan+21st+Century+Tower+Bashundhara+Dhaka",
  privacyLink: "/privacy-policy",
  investmentLink: "/investment",
  downloadsLink: "/downloads",
  groupLink: "/sampan-group",
  apiEndpoint: "/api/contact"
};

const PROJECTS = [
  "Sampan Metro Square",
  "Sampan Condominium",
  "Express Highway Inn",
  "Sampan Trade Emporium",
  "Sampan Agro & Golf Resort",
  "Completed projects",
  "Not sure yet"
];

const FAQS = [
  { q: "How fast will you reply?", a: `We aim to reply within ${CONFIG.responseTime}. WhatsApp is usually quickest.` },
  { q: "Can I visit without an appointment?", a: "Please book first so someone can meet you and show you the documents." },
  { q: "Can I get brochures and price lists?", a: "Yes. Ask on WhatsApp or download them from the Downloads page." },
  { q: "Do you help buyers living abroad?", a: "Yes. The NRB desk supports remote buying, video visits and document reviews." },
  { q: "Who do I contact after I buy?", a: `Customer care at ${CONFIG.phone} or ${CONFIG.email}.` }
];

export default function ContactPage() {
  const pageRef = useRef<HTMLElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [openFaq, setOpenFaq] = useState<number | null>(0);

  // --- 1. THREE.JS ATMOSPHERIC SHADER BACKGROUND (Hero only, dark) ---
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

    // Soft warm charcoal base with subtle gold atmosphere
    const uniforms = {
      uTime: { value: 0.0 },
      uColor: { value: new THREE.Color("#171715") },
      uOpacity: { value: 0.5 }
    };

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

          float glow1 = smoothstep(0.55, 0.0, distance(uv, vec2(0.5 + sin(uTime*0.25)*0.08, 0.45 + cos(uTime*0.18)*0.06))) * 0.18;
          float glow2 = smoothstep(0.7, 0.0, distance(uv, vec2(0.55 + cos(uTime*0.15)*0.05, 0.55 + sin(uTime*0.22)*0.05))) * 0.10;
          vec3 gold = vec3(0.77, 0.62, 0.35) * (glow1 + glow2);

          vec3 color = (uColor + gold) * vignette;
          gl_FragColor = vec4(color + grain, uOpacity * vignette);
        }
      `,
      transparent: true,
      depthWrite: false
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

    const handleVisibility = () => { isPaused = document.hidden; };
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

  // --- 2. LENIS SMOOTH SCROLL & GSAP ANIMATIONS ---
  useLayoutEffect(() => {
    gsap.registerPlugin(ScrollTrigger);

    const lenis = new Lenis({
      duration: 1.2,
      easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
      smoothWheel: true,
    });

    lenis.on("scroll", ScrollTrigger.update);
    const raf = (time: number) => lenis.raf(time * 1000);
    gsap.ticker.add(raf);
    gsap.ticker.lagSmoothing(0);

    const ctx = gsap.context(() => {
      const mm = gsap.matchMedia();

      mm.add("(prefers-reduced-motion: reduce)", () => {
        gsap.set(
          ".anim-hero-line, .anim-fade, .anim-mask, .anim-eyebrow, .anim-line-draw, .anim-card",
          { clearProps: "all" }
        );
      });

      mm.add("(min-width: 768px) and (prefers-reduced-motion: no-preference)", () => {
        gsap.set(".anim-hero-line", { yPercent: 110 });
        gsap.set(".anim-eyebrow", { opacity: 0, x: -16 });
        gsap.set(".anim-fade", { opacity: 0, y: 30 });

        gsap.timeline({ delay: 0.3 })
          .to(".anim-eyebrow", { opacity: 1, x: 0, ease: "power3.out", duration: 0.4 }, 0.1)
          .to(".anim-hero-line", { yPercent: 0, ease: "power4.out", duration: 1.2, stagger: 0.1 }, 0.2)
          .to(".anim-fade", { y: 0, opacity: 1, ease: "power3.out", duration: 1, stagger: 0.1 }, 0.6);

        gsap.utils.toArray<HTMLElement>(".section-anim").forEach((sec) => {
          const headline = sec.querySelectorAll(".anim-mask");
          const fade = sec.querySelectorAll(".anim-fade");
          const lineDraw = sec.querySelectorAll(".anim-line-draw");
          const card = sec.querySelectorAll(".anim-card");

          gsap.set(headline, { yPercent: 110 });
          gsap.set(fade, { opacity: 0, y: 30 });
          gsap.set(lineDraw, { scaleX: 0, transformOrigin: "left" });
          gsap.set(card, { opacity: 0, y: 30 });

          gsap.timeline({
            scrollTrigger: { trigger: sec, start: "top 75%", end: "top 30%", scrub: 1 }
          })
            .to(headline, { yPercent: 0, ease: "power3.out", duration: 0.6, stagger: 0.1 }, 0)
            .to(fade, { opacity: 1, y: 0, ease: "power3.out", duration: 0.6, stagger: 0.08 }, 0.2)
            .to(lineDraw, { scaleX: 1, ease: "power2.out", duration: 0.5, stagger: 0.05 }, 0.3)
            .to(card, { opacity: 1, y: 0, ease: "power3.out", duration: 0.6, stagger: 0.06 }, 0.4);
        });

        gsap.fromTo("#map-container",
          { clipPath: "inset(100% 0% 0% 0%)" },
          {
            clipPath: "inset(0% 0% 0% 0%)", ease: "power2.inOut", duration: 1.5,
            scrollTrigger: { trigger: "#map-container", start: "top 80%" }
          }
        );
      });

      mm.add("(max-width: 767px) and (prefers-reduced-motion: no-preference)", () => {
        gsap.set(".anim-hero-line, .anim-fade, .anim-eyebrow, .anim-mask, .anim-card", { opacity: 0, y: 24 });

        gsap.timeline({ delay: 0.3 })
          .to(".anim-eyebrow", { opacity: 1, y: 0, ease: "power3.out", duration: 0.5 }, 0.1)
          .to(".anim-hero-line", { opacity: 1, y: 0, ease: "power4.out", duration: 0.8, stagger: 0.08 }, 0.2)
          .to(".anim-fade", { opacity: 1, y: 0, ease: "power3.out", duration: 0.7, stagger: 0.08 }, 0.5);

        gsap.utils.toArray<HTMLElement>(".section-anim").forEach((sec) => {
          const headline = sec.querySelectorAll(".anim-mask");
          const fade = sec.querySelectorAll(".anim-fade");
          const card = sec.querySelectorAll(".anim-card");

          gsap.timeline({
            scrollTrigger: { trigger: sec, start: "top 82%", end: "top 45%", scrub: 1 }
          })
            .to(headline, { opacity: 1, y: 0, ease: "power3.out", duration: 0.6, stagger: 0.08 }, 0)
            .to(fade, { opacity: 1, y: 0, ease: "power3.out", duration: 0.6, stagger: 0.06 }, 0.2)
            .to(card, { opacity: 1, y: 0, ease: "power3.out", duration: 0.6, stagger: 0.05 }, 0.3);
        });
      });
    }, pageRef);

    return () => {
      ctx.revert();
      gsap.ticker.remove(raf);
      lenis.destroy();
    };
  }, []);

  return (
    <main ref={pageRef} className={`${luxSerif.variable} ${luxSans.variable} bg-[#F7F5EF] text-[#191C19] font-lux-sans antialiased overflow-x-hidden`}>

      {/* ==========================================
          1. HERO — Dark cinematic masthead
          ========================================== */}
      <section className="relative min-h-[88vh] flex flex-col justify-end overflow-hidden bg-[#171715] text-[#F4F1EA]">
        <canvas ref={canvasRef} className="absolute inset-0 z-0 pointer-events-none" />

        <div
          className="absolute inset-0 z-10 pointer-events-none opacity-[0.06]"
          style={{
            backgroundImage:
              "linear-gradient(rgba(244,241,234,0.2) 1px, transparent 1px), linear-gradient(90deg, rgba(244,241,234,0.2) 1px, transparent 1px)",
            backgroundSize: "120px 120px",
          }}
        />

        <div className="pointer-events-none absolute left-8 top-8 z-30 h-10 w-10 border-l border-t border-[#19ABE1]/40" />
        <div className="pointer-events-none absolute right-8 top-8 z-30 h-10 w-10 border-r border-t border-[#19ABE1]/40" />

        <div className="absolute bottom-0 left-0 z-10 w-full h-1/3 pointer-events-none">
          <svg className="h-full w-full opacity-50" viewBox="0 0 1440 200" preserveAspectRatio="xMidYMax slice" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path d="M0 200V100H40V50H80V120H120V80H180V150H240V40H300V110H360V70H420V140H480V90H540V160H600V60H660V130H720V80H780V150H840V50H900V120H960V70H1020V140H1080V90H1140V160H1200V100H1260V40H1320V110H1380V80H1440V200H0Z" fill="#0B0B0D" opacity="0.85"/>
          </svg>
        </div>

        <div className="relative z-20 mx-auto w-full max-w-[1600px] px-6 md:px-12 lg:px-24 pb-16 pt-32 md:pb-24">
          <div className="mb-8 flex items-center gap-3 text-[10px] uppercase tracking-[0.3em] text-[#89867E]">
            <Link href="/" className="transition-colors hover:text-[#19ABE1]">Home</Link>
            <span className="text-[#89867E]/50">/</span>
            <span className="text-[#19ABE1]">Contact</span>
          </div>

          <div className="anim-eyebrow mb-8 flex items-center gap-4">
            <span className="anim-line-draw block h-[1.5px] w-12 bg-[#19ABE1]" />
            <span className="text-[10px] font-medium uppercase tracking-[0.4em] text-[#19ABE1] md:text-[11px]">
              Begin a Conversation
            </span>
          </div>

          <h1 className="font-lux-serif text-[clamp(3rem,8vw,8rem)] leading-[0.92] tracking-[-0.03em] font-light mb-10 max-w-4xl">
            <span className="block overflow-hidden pb-2">
              <span className="anim-hero-line block">Talk to us, or</span>
            </span>
            <span className="block overflow-hidden pb-2">
              <span className="anim-hero-line block italic text-[#19ABE1]">come and see it.</span>
            </span>
          </h1>

          <p className="anim-fade text-base md:text-lg text-[#B5B1A8] font-light leading-relaxed max-w-xl mb-12">
            Ask about a project, request documents, or book a site visit. Our team replies on WhatsApp or by phone — usually within {CONFIG.responseTime}.
          </p>

          <div className="anim-fade flex flex-col sm:flex-row items-start gap-4">
            <a
              href={CONFIG.whatsapp}
              target="_blank"
              rel="noopener noreferrer"
              className="group relative inline-flex items-center gap-3 overflow-hidden bg-[#19ABE1] px-10 py-5 text-[10px] font-semibold uppercase tracking-[0.3em] text-[#171715] transition-colors duration-500 hover:text-[#19ABE1]"
            >
              <span className="absolute inset-0 z-0 translate-y-full bg-[#F4F1EA] transition-transform duration-500 ease-[cubic-bezier(0.22,1,0.36,1)] group-hover:translate-y-0" />
              <span className="relative z-10 flex items-center gap-3">
                Chat on WhatsApp
                <svg className="h-4 w-4 transition-transform duration-300 group-hover:translate-x-1" fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden="true">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" d="M14 5l7 7m0 0l-7 7m7-7H3" />
                </svg>
              </span>
            </a>
            <a
              href="#visit"
              className="group relative inline-flex items-center gap-3 overflow-hidden border border-[rgba(244,241,234,0.3)] bg-[rgba(23,23,21,0.4)] px-10 py-5 text-[10px] font-semibold uppercase tracking-[0.3em] text-[#F4F1EA] backdrop-blur-sm transition-colors duration-500 hover:text-[#171715]"
            >
              <span className="absolute inset-0 z-0 translate-y-full bg-[#19ABE1] transition-transform duration-500 ease-[cubic-bezier(0.22,1,0.36,1)] group-hover:translate-y-0" />
              <span className="relative z-10">Book a site visit</span>
            </a>
          </div>
        </div>
      </section>

      {/* ==========================================
          2. TALK TO US — LIGHT section with form + cards
          ========================================== */}
      <section id="talk" className="section-anim relative px-6 py-24 md:px-12 md:py-32 lg:px-24 scroll-mt-20">
        <div className="mx-auto max-w-[1600px]">
          {/* Contact channel cards */}
          <div className="mb-24 grid grid-cols-1 gap-8 border-t border-[rgba(25,28,25,0.1)] pt-12 sm:grid-cols-2 lg:grid-cols-4">
            {[
              { label: "WhatsApp", value: CONFIG.phone, desc: "Fastest for questions, brochures and documents.", href: CONFIG.whatsapp, icon: "whatsapp" },
              { label: "Phone", value: CONFIG.phone, desc: `Office hours: ${CONFIG.hours}`, href: `tel:${CONFIG.phoneRaw}`, icon: "phone" },
              { label: "Email", value: CONFIG.email, desc: "For formal requests and attachments.", href: `mailto:${CONFIG.email}`, icon: "mail" },
              { label: "Head office", value: "Bashundhara R/A, Dhaka", desc: "Visit by appointment.", href: "#map", icon: "pin" }
            ].map((item, i) => (
              <a
                key={i}
                href={item.href}
                target={item.href.startsWith("http") ? "_blank" : undefined}
                rel={item.href.startsWith("http") ? "noopener noreferrer" : undefined}
                className="anim-card group flex flex-col gap-3 border-l border-[rgba(197,160,89,0.5)] pl-4 transition-colors duration-300 hover:border-[#19ABE1]"
              >
                <div className="flex items-center gap-3">
                  <span className="text-[#19ABE1]">
                    <ChannelIcon name={item.icon} />
                  </span>
                  <span className="text-[10px] uppercase tracking-[0.3em] text-[#777A74] group-hover:text-[#19ABE1] transition-colors">{item.label}</span>
                </div>
                <span className="font-lux-serif text-lg font-light leading-tight text-[#191C19]">{item.value}</span>
                <p className="text-xs text-[#777A74] font-light leading-relaxed">{item.desc}</p>
              </a>
            ))}
          </div>

          {/* Form + sidebar */}
          <div className="grid grid-cols-1 gap-16 lg:grid-cols-12">
            <div className="lg:col-span-7">
              <div className="mb-8 flex items-center gap-4">
                <span className="anim-line-draw block h-[1.5px] w-12 bg-[#19ABE1]" />
                <span className="text-[10px] font-medium uppercase tracking-[0.4em] text-[#19ABE1] md:text-[11px]">Send a message</span>
              </div>
              <h2 className="font-lux-serif text-4xl md:text-5xl leading-[1.05] font-light mb-12">
                <span className="block overflow-hidden pb-2">
                  <span className="anim-mask block">Tell us what you&apos;re</span>
                </span>
                <span className="block overflow-hidden pb-2">
                  <span className="anim-mask block italic text-[#19ABE1]">looking for.</span>
                </span>
              </h2>
              <EnquiryForm />
            </div>

            <div className="lg:col-span-4 lg:col-start-9 flex flex-col gap-6">
              {/* Office hours card */}
              <div className="anim-card relative overflow-hidden border border-[rgba(25,28,25,0.08)] bg-white p-8 shadow-[0_8px_30px_-12px_rgba(25,28,25,0.08)]">
                <div className="pointer-events-none absolute -top-12 -right-12 h-40 w-40 rounded-full bg-[radial-gradient(circle,_rgba(197,160,89,0.15)_0%,_transparent_70%)] blur-2xl" />
                <div className="relative">
                  <div className="mb-6 flex items-center gap-3">
                    <span className="h-px w-8 bg-[#19ABE1]" />
                    <h3 className="text-[10px] uppercase tracking-[0.3em] text-[#19ABE1]">Office Hours</h3>
                  </div>
                  <p className="font-lux-serif text-2xl font-light text-[#191C19] mb-1">Saturday — Thursday</p>
                  <p className="text-sm text-[#5C655C] font-light mb-4">{CONFIG.hours}</p>
                  <div className="border-t border-[rgba(25,28,25,0.08)] pt-4">
                    <p className="text-sm text-[#777A74] font-light">{CONFIG.fridayHours}</p>
                  </div>
                </div>
                <div className="absolute bottom-0 right-0 h-6 w-6 border-b border-r border-[#19ABE1]/40" />
              </div>

              {/* Response time card */}
              <div className="anim-card relative overflow-hidden border border-[rgba(25,28,25,0.08)] bg-white p-8 shadow-[0_8px_30px_-12px_rgba(25,28,25,0.08)]">
                <div className="mb-4 flex items-center gap-3">
                  <span className="h-px w-8 bg-[#19ABE1]" />
                  <h3 className="text-[10px] uppercase tracking-[0.3em] text-[#19ABE1]">Response Time</h3>
                </div>
                <p className="font-lux-serif text-2xl font-light italic text-[#191C19] mb-2">Within {CONFIG.responseTime}</p>
                <p className="text-sm text-[#5C655C] font-light">We reply on WhatsApp or by phone. For complex enquiries, expect a follow-up email.</p>
              </div>

              {/* Quick downloads */}
              <div className="anim-card relative overflow-hidden border border-[rgba(25,28,25,0.08)] bg-white p-8 shadow-[0_8px_30px_-12px_rgba(25,28,25,0.08)]">
                <div className="mb-4 flex items-center gap-3">
                  <span className="h-px w-8 bg-[#19ABE1]" />
                  <h3 className="text-[10px] uppercase tracking-[0.3em] text-[#19ABE1]">Quick Downloads</h3>
                </div>
                <Link href={CONFIG.downloadsLink} className="group flex items-center justify-between gap-3 text-sm text-[#191C19] hover:text-[#19ABE1] transition-colors">
                  <span className="font-light">Brochures & price lists</span>
                  <svg className="h-4 w-4 transition-transform duration-300 group-hover:translate-x-1" fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden="true">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" d="M14 5l7 7m0 0l-7 7m7-7H3" />
                  </svg>
                </Link>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ==========================================
          3. BOOK A SITE VISIT — DARK section
          ========================================== */}
      <section id="visit" className="section-anim relative px-6 py-24 md:px-12 md:py-32 lg:px-24 bg-[#0B0B0D] text-[#F4F1EA] scroll-mt-20">
        <div className="pointer-events-none absolute left-0 top-1/2 w-full -translate-y-1/2 overflow-hidden whitespace-nowrap opacity-[0.025]">
          <span className="font-lux-serif pr-8 text-[20vw] leading-none text-[#F4F1EA]">SITE VISIT</span>
        </div>

        <div className="relative mx-auto max-w-[1600px]">
          <div className="mb-16 max-w-2xl">
            <div className="anim-fade mb-8 flex items-center gap-4">
              <span className="anim-line-draw block h-[1.5px] w-12 bg-[#19ABE1]" />
              <span className="text-[10px] font-medium uppercase tracking-[0.4em] text-[#19ABE1] md:text-[11px]">Book a Site Visit</span>
            </div>
            <h2 className="font-lux-serif text-4xl md:text-6xl leading-[1.05] font-light mb-6">
              <span className="block overflow-hidden pb-2">
                <span className="anim-mask block">See the land before</span>
              </span>
              <span className="block overflow-hidden pb-2">
                <span className="anim-mask block italic text-[#19ABE1]">you decide.</span>
              </span>
            </h2>
            <p className="anim-fade text-sm md:text-base text-[#B5B1A8] font-light leading-relaxed">
              Choose a project and a day. We will confirm by phone or WhatsApp and arrange the visit. Bring any questions; we can show you the documents on site.
            </p>
          </div>

          <div className="grid grid-cols-1 gap-16 lg:grid-cols-12 lg:items-start">
            <div className="lg:col-span-7">
              <BookingForm />
            </div>

            <div className="lg:col-span-5">
              <h3 className="anim-fade font-lux-serif text-2xl font-light mb-8 text-[#19ABE1]">What to expect on a visit</h3>
              <div className="flex flex-col gap-8 border-l border-[rgba(244,241,234,0.1)] pl-6">
                {[
                  "A team member meets you at the site or at our office.",
                  "You walk the land or the building with the project plan.",
                  "We show the document set and answer questions.",
                  "You get the price list and payment plans in writing, with no pressure to decide."
                ].map((step, i) => (
                  <div key={i} className="anim-card relative">
                    <span className="absolute -left-[31px] top-0 h-3 w-3 rounded-full bg-[#171715] border-2 border-[#19ABE1]" />
                    <span className="font-lux-serif text-xl italic text-[#19ABE1] block mb-1">0{i + 1}</span>
                    <p className="text-sm text-[#B5B1A8] font-light leading-relaxed">{step}</p>
                  </div>
                ))}
              </div>
            </div>
          </div>

          <div className="mt-24 border-t border-[rgba(244,241,234,0.1)] pt-12">
            <h3 className="anim-fade font-lux-serif text-2xl font-light mb-8">Visit by project</h3>
            <div className="grid grid-cols-1 gap-8 md:grid-cols-3">
              {[
                { name: "Metro Square, Ashulia", detail: "Meeting point: [meeting point]" },
                { name: "Highway Projects", detail: "Condominium, Express Highway Inn and Trade Emporium all sit side by side. Meeting point: [meeting point]" },
                { name: "Agro & Golf Resort, Sylhet", detail: "Visit arrangements and travel notes: [visit arrangements and travel notes]" }
              ].map((p, i) => (
                <div key={i} className="anim-card border-l border-[rgba(197,160,89,0.5)] pl-4 transition-colors duration-300 hover:border-[#19ABE1]">
                  <h4 className="text-sm font-medium mb-2 text-[#19ABE1]">{p.name}</h4>
                  <p className="text-xs text-[#89867E] font-light">{p.detail}</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* ==========================================
          4. FIND US — LIGHT section with map
          ========================================== */}
      <section id="map" className="section-anim relative px-6 py-24 md:px-12 md:py-32 lg:px-24 scroll-mt-20">
        <div className="mx-auto max-w-[1600px]">
          <div className="mb-12 flex flex-col gap-8 md:flex-row md:items-end md:justify-between">
            <div>
              <div className="anim-fade mb-6 flex items-center gap-4">
                <span className="anim-line-draw block h-[1.5px] w-12 bg-[#19ABE1]" />
                <span className="text-[10px] font-medium uppercase tracking-[0.4em] text-[#19ABE1] md:text-[11px]">Where to Find Us</span>
              </div>
              <h2 className="font-lux-serif text-4xl md:text-6xl leading-[1.05] font-light">
                <span className="block overflow-hidden pb-2">
                  <span className="anim-mask block">Visit our</span>
                </span>
                <span className="block overflow-hidden pb-2">
                  <span className="anim-mask block italic text-[#19ABE1]">offices.</span>
                </span>
              </h2>
            </div>
            <p className="anim-fade max-w-sm text-sm text-[#5C655C] font-light leading-relaxed">
              Our head office is in Bashundhara R/A, Dhaka. Project sites are along the Dhaka–Chittagong Highway and in Sylhet.
            </p>
          </div>

          <div className="relative mb-12">
            <div id="map-container" className="h-[450px] w-full overflow-hidden border border-[rgba(25,28,25,0.08)] will-change-transform md:h-[600px]">
              <iframe
                src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3649.9518606974993!2d90.42892470000001!3d23.820310799999998!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x3755c76bec836017%3A0x455b21c6a1bee471!2shomespirit!5e0!3m2!1sbn!2sbd!4v1792057380856!5m2!1sbn!2sbd"
                width="100%"
                height="100%"
                style={{ border: 0 }}
                allowFullScreen
                loading="lazy"
                referrerPolicy="strict-origin-when-cross-origin"
              />
            </div>
            <div className="absolute left-0 top-0 h-8 w-8 border-l border-t border-[#19ABE1]/50" />
            <div className="absolute right-0 top-0 h-8 w-8 border-r border-t border-[#19ABE1]/50" />
            <div className="absolute bottom-0 left-0 h-8 w-8 border-b border-l border-[#19ABE1]/50" />
            <div className="absolute bottom-0 right-0 h-8 w-8 border-b border-r border-[#19ABE1]/50" />
          </div>

          <div className="grid grid-cols-1 gap-8 border-t border-[rgba(25,28,25,0.1)] pt-8 md:grid-cols-2 lg:grid-cols-4">
            {[
              { name: "Head office", addr: CONFIG.address },
              { name: "Metro Square, Ashulia", addr: "[Address or landmark]" },
              { name: "Highway projects", addr: "Dhaka–Chittagong Highway, [landmark]" },
              { name: "Agro & Golf Resort", addr: "Podunapur, Moulvibazar Sadar, Sylhet" }
            ].map((loc, i) => (
              <div key={i} className="anim-card flex flex-col gap-2">
                <h4 className="font-lux-serif text-lg font-light text-[#191C19]">{loc.name}</h4>
                <p className="text-xs text-[#777A74] font-light leading-relaxed">{loc.addr}</p>
                <a href={CONFIG.mapsLink} target="_blank" rel="noopener noreferrer" className="group mt-2 inline-flex items-center gap-2 text-[10px] uppercase tracking-[0.2em] text-[#19ABE1]">
                  Get directions
                  <svg className="h-3 w-3 transition-transform duration-300 group-hover:translate-x-1" fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden="true">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" d="M14 5l7 7m0 0l-7 7m7-7H3" />
                  </svg>
                </a>
              </div>
            ))}
          </div>
          <p className="anim-fade mt-8 text-xs text-[#777A74] font-light italic">Please call before you visit a project site so we can have someone meet you.</p>
        </div>
      </section>

      {/* ==========================================
          5. NRB DESK — DARK section
          ========================================== */}
      <section id="nrb" className="section-anim relative px-6 py-24 md:px-12 md:py-32 lg:px-24 bg-[#171715] text-[#F4F1EA] scroll-mt-20">
        <div className="pointer-events-none absolute inset-0">
          <div className="absolute left-1/2 top-1/2 h-[500px] w-[700px] -translate-x-1/2 -translate-y-1/2 rounded-full bg-[radial-gradient(ellipse_at_center,_rgba(197,160,89,0.06)_0%,_transparent_60%)] blur-3xl" />
        </div>

        <div className="relative mx-auto max-w-[1200px] text-center">
          <div className="anim-fade mb-8 flex items-center justify-center gap-4">
            <span className="anim-line-draw block h-[1.5px] w-12 bg-[#19ABE1]" />
            <span className="text-[10px] font-medium uppercase tracking-[0.4em] text-[#19ABE1] md:text-[11px]">For Buyers Abroad</span>
            <span className="anim-line-draw block h-[1.5px] w-12 bg-[#19ABE1]" />
          </div>

          <h2 className="font-lux-serif text-4xl md:text-6xl leading-[1.05] font-light mb-6">
            <span className="block overflow-hidden pb-2">
              <span className="anim-mask block">Living abroad?</span>
            </span>
            <span className="block overflow-hidden pb-2">
              <span className="anim-mask block italic text-[#19ABE1]">Start here.</span>
            </span>
          </h2>

          <p className="anim-fade mx-auto mb-12 max-w-2xl text-base font-light leading-relaxed text-[#B5B1A8] md:text-lg">
            Our NRB desk handles remote enquiries, document reviews and video walkthroughs. Tell us your country and time zone and we will arrange a call that suits you.
          </p>

          <div className="anim-fade mb-12 grid grid-cols-1 gap-8 border-t border-[rgba(244,241,234,0.1)] pt-8 sm:grid-cols-3">
            {[
              { label: "WhatsApp", value: CONFIG.phone },
              { label: "Email", value: CONFIG.email },
              { label: "Hours", value: "[Bangladesh time and your time zone]" }
            ].map((item, i) => (
              <div key={i} className="text-sm text-[#F4F1EA]">
                <span className="mb-1 block text-[10px] uppercase tracking-[0.3em] text-[#19ABE1]">{item.label}</span>
                <span className="font-light">{item.value}</span>
              </div>
            ))}
          </div>

          <div className="anim-fade flex flex-col items-center justify-center gap-4 sm:flex-row">
            <a href={CONFIG.whatsapp} target="_blank" rel="noopener noreferrer" className="group relative inline-flex items-center gap-3 overflow-hidden bg-[#19ABE1] px-10 py-5 text-[10px] font-semibold uppercase tracking-[0.3em] text-[#171715] transition-colors duration-500 hover:text-[#19ABE1]">
              <span className="absolute inset-0 z-0 translate-y-full bg-[#F4F1EA] transition-transform duration-500 ease-[cubic-bezier(0.22,1,0.36,1)] group-hover:translate-y-0" />
              <span className="relative z-10">Chat with our NRB desk</span>
            </a>
            <a href="#visit" className="group relative inline-flex items-center gap-3 overflow-hidden border border-[rgba(244,241,234,0.3)] px-10 py-5 text-[10px] font-semibold uppercase tracking-[0.3em] text-[#F4F1EA] transition-colors duration-500 hover:text-[#171715]">
              <span className="absolute inset-0 z-0 translate-y-full bg-[#19ABE1] transition-transform duration-500 ease-[cubic-bezier(0.22,1,0.36,1)] group-hover:translate-y-0" />
              <span className="relative z-10">Book a video visit</span>
            </a>
          </div>

          <Link href={CONFIG.investmentLink} className="anim-fade group mt-10 inline-flex items-center gap-3 text-xs uppercase tracking-[0.2em] text-[#19ABE1]">
            Read the NRB buying steps on the Investment page
            <span className="relative w-10 h-px bg-[#19ABE1]/40 overflow-hidden">
              <span className="absolute inset-0 bg-[#19ABE1] -translate-x-full group-hover:translate-x-0 transition-transform duration-500 ease-[cubic-bezier(0.22,1,0.36,1)]" />
            </span>
          </Link>
        </div>
      </section>

      {/* ==========================================
          6. FAQ — LIGHT section
          ========================================== */}
      <section id="faq" className="section-anim relative px-6 py-24 md:px-12 md:py-32 lg:px-24">
        <div className="mx-auto max-w-[800px]">
          <div className="mb-12 flex flex-col items-center text-center">
            <div className="anim-fade mb-6 flex items-center gap-4">
              <span className="anim-line-draw block h-[1.5px] w-12 bg-[#19ABE1]" />
              <span className="text-[10px] font-medium uppercase tracking-[0.4em] text-[#19ABE1] md:text-[11px]">Good to Know</span>
              <span className="anim-line-draw block h-[1.5px] w-12 bg-[#19ABE1]" />
            </div>
            <h2 className="font-lux-serif text-4xl md:text-5xl leading-[1.05] font-light">
              <span className="block overflow-hidden pb-2">
                <span className="anim-mask block">A few things you may</span>
              </span>
              <span className="block overflow-hidden pb-2">
                <span className="anim-mask block italic text-[#19ABE1]">want to know.</span>
              </span>
            </h2>
          </div>

          <div className="flex flex-col gap-4">
            {FAQS.map((faq, i) => (
              <div key={i} className="anim-card border-b border-[rgba(25,28,25,0.1)]">
                <button
                  className="group flex w-full items-center justify-between py-6 text-left"
                  onClick={() => setOpenFaq(openFaq === i ? null : i)}
                  aria-expanded={openFaq === i}
                >
                  <span className="flex items-baseline gap-4 pr-4 font-lux-serif text-lg font-light text-[#191C19] transition-colors group-hover:text-[#19ABE1]">
                    <span className="font-mono text-[10px] tracking-[0.15em] text-[#19ABE1]">{String(i + 1).padStart(2, "0")}</span>
                    {faq.q}
                  </span>
                  <svg className={`h-5 w-5 flex-shrink-0 text-[#19ABE1] transition-transform duration-300 ${openFaq === i ? "rotate-45" : ""}`} fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden="true">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" d="M12 4v16m8-8H4" />
                  </svg>
                </button>
                <div className="grid transition-all duration-500 ease-in-out" style={{ gridTemplateRows: openFaq === i ? "1fr" : "0fr" }}>
                  <div className="overflow-hidden">
                    <p className="pb-6 pr-8 pl-10 text-sm font-light leading-relaxed text-[#5C655C]">{faq.a}</p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ==========================================
          7. PART OF SAMPAN GROUP — DARK closing
          ========================================== */}
      <section className="section-anim relative overflow-hidden px-6 py-32 md:px-12 md:py-48 lg:px-24 bg-[#0B0B0D] text-[#F4F1EA] text-center">
        <div className="pointer-events-none absolute inset-0">
          <div className="absolute left-1/2 top-1/2 h-[600px] w-[800px] -translate-x-1/2 -translate-y-1/2 rounded-full bg-[radial-gradient(ellipse_at_center,_rgba(197,160,89,0.08)_0%,_transparent_60%)] blur-3xl" />
        </div>
        <div
          className="absolute inset-0 z-0 opacity-[0.04]"
          style={{
            backgroundImage:
              "linear-gradient(rgba(244,241,234,0.1) 1px, transparent 1px), linear-gradient(90deg, rgba(244,241,234,0.1) 1px, transparent 1px)",
            backgroundSize: "100px 100px",
          }}
        />

        <div className="relative z-10 mx-auto max-w-3xl">
          <div className="anim-fade mb-8 flex items-center justify-center gap-4">
            <span className="h-[1.5px] w-12 bg-[#19ABE1]" />
            <span className="text-[10px] font-medium uppercase tracking-[0.4em] text-[#19ABE1] md:text-[11px]">Mother Company</span>
            <span className="h-[1.5px] w-12 bg-[#19ABE1]" />
          </div>
          <h2 className="font-lux-serif text-4xl md:text-6xl leading-[0.95] tracking-[-0.02em] font-light mb-6">
            <span className="block overflow-hidden pb-2">
              <span className="anim-mask block">Part of</span>
            </span>
            <span className="block overflow-hidden pb-2">
              <span className="anim-mask block italic text-[#19ABE1]">Sampan Group</span>
            </span>
          </h2>
          <p className="anim-fade mx-auto mb-12 max-w-xl text-base font-light leading-relaxed text-[#B5B1A8] md:text-lg">
            Looking for another Sampan business? Visit Sampan Group for hotels, education, agro and more.
          </p>
          <Link href={CONFIG.groupLink} className="anim-fade group relative inline-flex items-center gap-3 overflow-hidden bg-[#19ABE1] px-12 py-5 text-[10px] font-semibold uppercase tracking-[0.3em] text-[#171715] transition-colors duration-500 hover:text-[#19ABE1]">
            <span className="absolute inset-0 z-0 translate-y-full bg-[#F4F1EA] transition-transform duration-500 ease-[cubic-bezier(0.22,1,0.36,1)] group-hover:translate-y-0" />
            <span className="relative z-10 flex items-center gap-3">
              Visit Sampan Group
              <svg className="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden="true">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" d="M14 5l7 7m0 0l-7 7m7-7H3" />
              </svg>
            </span>
          </Link>
        </div>
      </section>

      {/* ==========================================
          MOBILE FLOATING ACTIONS
          ========================================== */}
      <div className="fixed bottom-6 right-6 z-50 flex flex-col gap-3 md:hidden">
        <a href={`tel:${CONFIG.phoneRaw}`} className="flex h-14 w-14 items-center justify-center rounded-full bg-[#191C19] text-[#F4F1EA] shadow-[0_8px_24px_-8px_rgba(0,0,0,0.4)]" aria-label="Call us">
          <svg className="h-6 w-6" fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden="true">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
          </svg>
        </a>
        <a href={CONFIG.whatsapp} target="_blank" rel="noopener noreferrer" className="flex h-14 w-14 items-center justify-center rounded-full bg-[#25D366] text-white shadow-[0_8px_24px_-8px_rgba(37,211,102,0.6)]" aria-label="Chat on WhatsApp">
          <svg className="h-7 w-7" fill="currentColor" viewBox="0 0 24 24" aria-hidden="true">
            <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51l-.57-.01c-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z" />
          </svg>
        </a>
      </div>
    </main>
  );
}

// ==========================================
// CHANNEL ICON
// ==========================================
function ChannelIcon({ name }: { name: string }) {
  const common = "h-4 w-4";
  if (name === "whatsapp") return (
    <svg className={common} fill="currentColor" viewBox="0 0 24 24" aria-hidden="true">
      <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51l-.57-.01c-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z" />
    </svg>
  );
  if (name === "phone") return (
    <svg className={common} fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden="true">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
    </svg>
  );
  if (name === "mail") return (
    <svg className={common} fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden="true">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
    </svg>
  );
  return (
    <svg className={common} fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden="true">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
    </svg>
  );
}

// ==========================================
// ENQUIRY FORM COMPONENT — LIGHT theme
// ==========================================
function EnquiryForm() {
  const [status, setStatus] = useState<'idle' | 'loading' | 'success' | 'error'>('idle');
  const [isNRB, setIsNRB] = useState(false);
  const [formData, setFormData] = useState({ name: "", phone: "", email: "", project: "", interest: "", message: "", consent: false });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const target = e.target;
    const { name, value, type } = target;
    const checked = type === 'checkbox' ? (target as HTMLInputElement).checked : false;
    setFormData(prev => ({ ...prev, [name]: type === 'checkbox' ? checked : value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.phone || !formData.consent) {
      setStatus('error');
      return;
    }
    setStatus('loading');
    await new Promise(resolve => setTimeout(resolve, 1500));
    setStatus('success');
  };

  if (status === 'success') {
    return (
      <div className="relative overflow-hidden border border-[rgba(197,160,89,0.3)] bg-white p-10 text-center shadow-[0_8px_30px_-12px_rgba(25,28,25,0.08)]">
        <div className="pointer-events-none absolute -top-12 -right-12 h-48 w-48 rounded-full bg-[radial-gradient(circle,_rgba(197,160,89,0.18)_0%,_transparent_70%)] blur-2xl" />
        <div className="relative">
          <div className="mx-auto mb-6 flex h-14 w-14 items-center justify-center rounded-full border border-[#19ABE1]">
            <svg className="h-7 w-7 text-[#19ABE1]" fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden="true">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" d="M5 13l4 4L19 7" />
            </svg>
          </div>
          <h3 className="font-lux-serif text-3xl font-light mb-3 text-[#191C19]">
            Thanks, <span className="italic text-[#19ABE1]">{formData.name || "friend"}</span>.
          </h3>
          <div className="mx-auto mb-6 h-px w-12 bg-[#19ABE1]" />
          <p className="text-sm font-light leading-relaxed text-[#5C655C] max-w-md mx-auto">
            We have your message about <span className="text-[#19ABE1]">{formData.project || "your enquiry"}</span> and will reply on <span className="text-[#19ABE1]">{formData.phone}</span> within <span className="text-[#19ABE1]">{CONFIG.responseTime}</span>.
          </p>
        </div>
        <div className="absolute bottom-0 right-0 h-8 w-8 border-b border-r border-[#19ABE1]/50" />
        <div className="absolute left-0 top-0 h-8 w-8 border-l border-t border-[#19ABE1]/50" />
      </div>
    );
  }

  return (
    <form onSubmit={handleSubmit} className="flex flex-col gap-6">
      <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
        <FormInput label="Full name" name="name" value={formData.name} onChange={handleChange} required />
        <FormInput label="Phone or WhatsApp" name="phone" value={formData.phone} onChange={handleChange} required type="tel" />
      </div>
      <FormInput label="Email (Optional)" name="email" value={formData.email} onChange={handleChange} type="email" />

      <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
        <div className="flex flex-col gap-2">
          <label className="text-[10px] uppercase tracking-[0.3em] text-[#777A74]">Project of interest</label>
          <select name="project" value={formData.project} onChange={handleChange} className="appearance-none border-b border-[rgba(25,28,25,0.2)] bg-transparent py-3 text-sm text-[#191C19] focus:border-[#19ABE1] focus:outline-none cursor-pointer">
            <option value="" className="bg-white">Select a project</option>
            {PROJECTS.map(p => <option key={p} value={p} className="bg-white">{p}</option>)}
          </select>
        </div>
        <div className="flex flex-col gap-2">
          <label className="text-[10px] uppercase tracking-[0.3em] text-[#777A74]">I am interested in</label>
          <select name="interest" value={formData.interest} onChange={handleChange} required className="appearance-none border-b border-[rgba(25,28,25,0.2)] bg-transparent py-3 text-sm text-[#191C19] focus:border-[#19ABE1] focus:outline-none cursor-pointer">
            <option value="" className="bg-white">Select interest</option>
            <option className="bg-white">Land share</option>
            <option className="bg-white">Apartment</option>
            <option className="bg-white">Commercial space</option>
            <option className="bg-white">Membership</option>
            <option className="bg-white">Other</option>
          </select>
        </div>
      </div>

      <div className="flex items-center gap-3">
        <input type="checkbox" name="nrb" id="nrb" checked={isNRB} onChange={(e) => setIsNRB(e.target.checked)} className="h-4 w-4 accent-[#19ABE1]" />
        <label htmlFor="nrb" className="text-sm text-[#5C655C] font-light">I live abroad</label>
      </div>

      {isNRB && (
        <div className="border-l-2 border-[#19ABE1] bg-white p-4 text-sm font-light text-[#191C19] shadow-[0_4px_12px_-4px_rgba(25,28,25,0.06)]">
          As an overseas buyer, you might prefer our remote NRB desk. <a href="#nrb" className="text-[#19ABE1] underline">Learn more</a>.
        </div>
      )}

      <div className="flex flex-col gap-2">
        <label className="text-[10px] uppercase tracking-[0.3em] text-[#777A74]">Message</label>
        <textarea name="message" value={formData.message} onChange={handleChange} rows={4} className="resize-none border-b border-[rgba(25,28,25,0.2)] bg-transparent py-3 text-sm text-[#191C19] focus:border-[#19ABE1] focus:outline-none"></textarea>
      </div>

      <div className="flex items-start gap-3">
        <input type="checkbox" name="consent" id="consent" checked={formData.consent} onChange={handleChange} required className="mt-1 h-4 w-4 accent-[#19ABE1]" />
        <label htmlFor="consent" className="text-xs text-[#777A74] font-light leading-relaxed">
          I agree that Sampan Development Ltd may contact me about my enquiry. <Link href={CONFIG.privacyLink} className="text-[#19ABE1] underline">Privacy policy</Link>.
        </label>
      </div>

      {status === 'error' && <p className="text-xs text-red-600">Enter a phone number we can reach on WhatsApp and ensure consent is checked.</p>}

      <button
        type="submit"
        disabled={status === 'loading'}
        className="group relative inline-flex w-full items-center justify-center gap-3 overflow-hidden bg-[#191C19] px-10 py-5 text-[10px] font-semibold uppercase tracking-[0.3em] text-[#F4F1EA] transition-colors duration-500 hover:text-[#191C19] disabled:opacity-50 md:w-auto"
      >
        <span className="absolute inset-0 z-0 translate-y-full bg-[#19ABE1] transition-transform duration-500 ease-[cubic-bezier(0.22,1,0.36,1)] group-hover:translate-y-0" />
        <span className="relative z-10 flex items-center gap-3">
          {status === 'loading' ? 'Sending...' : 'Send message'}
          {status !== 'loading' && (
            <svg className="h-4 w-4 transition-transform duration-300 group-hover:translate-x-1" fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden="true">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" d="M14 5l7 7m0 0l-7 7m7-7H3" />
            </svg>
          )}
        </span>
      </button>
    </form>
  );
}

// ==========================================
// BOOKING FORM COMPONENT — DARK theme
// ==========================================
function BookingForm() {
  const [status, setStatus] = useState<'idle' | 'loading' | 'success' | 'error'>('idle');
  const [formData, setFormData] = useState({ name: "", phone: "", project: "", visitors: "1", date: "", time: "Morning", pickup: "No" });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    setFormData(prev => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.name || !formData.phone || !formData.date) {
      setStatus('error');
      return;
    }
    setStatus('loading');
    await new Promise(resolve => setTimeout(resolve, 1500));
    setStatus('success');
  };

  if (status === 'success') {
    return (
      <div className="relative overflow-hidden border border-[rgba(197,160,89,0.3)] bg-[#1D1D1A] p-10 text-center">
        <div className="pointer-events-none absolute -top-12 -right-12 h-48 w-48 rounded-full bg-[radial-gradient(circle,_rgba(197,160,89,0.15)_0%,_transparent_70%)] blur-2xl" />
        <div className="relative">
          <div className="mx-auto mb-6 flex h-14 w-14 items-center justify-center rounded-full border border-[#19ABE1]">
            <svg className="h-7 w-7 text-[#19ABE1]" fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden="true">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" d="M5 13l4 4L19 7" />
            </svg>
          </div>
          <h3 className="font-lux-serif text-3xl font-light mb-3 text-[#F4F1EA]">
            Visit requested for <span className="italic text-[#19ABE1]">{formData.date}</span>.
          </h3>
          <div className="mx-auto mb-6 h-px w-12 bg-[#19ABE1]" />
          <p className="text-sm font-light leading-relaxed text-[#B5B1A8] max-w-md mx-auto">
            We will confirm on <span className="text-[#19ABE1]">{formData.phone}</span>. If you need to change it, message us on <a href={CONFIG.whatsapp} className="text-[#19ABE1] underline">WhatsApp</a>.
          </p>
        </div>
        <div className="absolute bottom-0 right-0 h-8 w-8 border-b border-r border-[#19ABE1]/50" />
        <div className="absolute left-0 top-0 h-8 w-8 border-l border-t border-[#19ABE1]/50" />
      </div>
    );
  }

  return (
    <form onSubmit={handleSubmit} className="flex flex-col gap-6 border border-[rgba(244,241,234,0.08)] bg-[rgba(29,29,26,0.6)] p-8 backdrop-blur-sm">
      <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
        <FormInput label="Name" name="name" value={formData.name} onChange={handleChange} required dark />
        <FormInput label="Phone or WhatsApp" name="phone" value={formData.phone} onChange={handleChange} required type="tel" dark />
      </div>

      <div className="flex flex-col gap-2">
        <label className="text-[10px] uppercase tracking-[0.3em] text-[#89867E]">Project</label>
        <select name="project" value={formData.project} onChange={handleChange} required className="appearance-none border-b border-[rgba(244,241,234,0.2)] bg-transparent py-3 text-sm text-[#F4F1EA] focus:border-[#19ABE1] focus:outline-none cursor-pointer">
          <option value="" className="bg-[#1D1D1A]">Select a project</option>
          {PROJECTS.map(p => <option key={p} value={p} className="bg-[#1D1D1A]">{p}</option>)}
          <option value="All three highway projects" className="bg-[#1D1D1A]">All three highway projects</option>
        </select>
      </div>

      <div className="grid grid-cols-1 gap-6 md:grid-cols-3">
        <FormInput label="Visitors" name="visitors" value={formData.visitors} onChange={handleChange} type="number" dark />
        <FormInput label="Preferred date" name="date" value={formData.date} onChange={handleChange} type="date" required dark />
        <div className="flex flex-col gap-2">
          <label className="text-[10px] uppercase tracking-[0.3em] text-[#89867E]">Time</label>
          <select name="time" value={formData.time} onChange={handleChange} className="appearance-none border-b border-[rgba(244,241,234,0.2)] bg-transparent py-3 text-sm text-[#F4F1EA] focus:border-[#19ABE1] focus:outline-none cursor-pointer">
            <option value="Morning" className="bg-[#1D1D1A]">Morning</option>
            <option value="Afternoon" className="bg-[#1D1D1A]">Afternoon</option>
          </select>
        </div>
      </div>

      <div className="flex flex-col gap-2">
        <label className="text-[10px] uppercase tracking-[0.3em] text-[#89867E]">Pick-up needed? [If offered]</label>
        <div className="flex gap-6">
          <label className="flex cursor-pointer items-center gap-2 text-sm font-light text-[#B5B1A8]">
            <input type="radio" name="pickup" value="Yes" checked={formData.pickup === 'Yes'} onChange={handleChange} className="accent-[#19ABE1]" /> Yes
          </label>
          <label className="flex cursor-pointer items-center gap-2 text-sm font-light text-[#B5B1A8]">
            <input type="radio" name="pickup" value="No" checked={formData.pickup === 'No'} onChange={handleChange} className="accent-[#19ABE1]" /> No
          </label>
        </div>
      </div>

      {status === 'error' && <p className="text-xs text-red-400">Please fill in all required fields correctly.</p>}

      <button
        type="submit"
        disabled={status === 'loading'}
        className="group relative inline-flex w-full items-center justify-center gap-3 overflow-hidden bg-[#19ABE1] px-10 py-5 text-[10px] font-semibold uppercase tracking-[0.3em] text-[#171715] transition-colors duration-500 hover:text-[#19ABE1] disabled:opacity-50 md:w-auto"
      >
        <span className="absolute inset-0 z-0 translate-y-full bg-[#F4F1EA] transition-transform duration-500 ease-[cubic-bezier(0.22,1,0.36,1)] group-hover:translate-y-0" />
        <span className="relative z-10 flex items-center gap-3">
          {status === 'loading' ? 'Requesting...' : 'Request my visit'}
        </span>
      </button>
    </form>
  );
}

// ==========================================
// REUSABLE FORM INPUT — supports light & dark
// ==========================================
function FormInput({ label, name, value, onChange, type = "text", required = false, dark = false }: {
  label: string;
  name: string;
  value: string;
  onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  type?: string;
  required?: boolean;
  dark?: boolean;
}) {
  return (
    <div className="flex flex-col gap-2">
      <label className={`text-[10px] uppercase tracking-[0.3em] ${dark ? 'text-[#89867E]' : 'text-[#777A74]'}`}>{label}</label>
      <input
        type={type}
        name={name}
        value={value}
        onChange={onChange}
        required={required}
        className={`border-b bg-transparent py-3 text-sm transition-colors focus:outline-none ${
          dark
            ? 'border-[rgba(244,241,234,0.2)] text-[#F4F1EA] focus:border-[#19ABE1] [color-scheme:dark]'
            : 'border-[rgba(25,28,25,0.2)] text-[#191C19] focus:border-[#19ABE1] [color-scheme:light]'
        }`}
      />
    </div>
  );
}