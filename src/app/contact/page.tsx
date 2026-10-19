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
  "Sampan Metro Square", "Sampan Condominium", "Express Highway Inn", 
  "Sampan Trade Emporium", "Sampan Agro & Golf Resort", "Completed projects", "Not sure yet"
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
      uColor: { value: new THREE.Color("#174B3A") }
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
        varying vec2 vUv;
        
        float random(vec2 st) { 
          return fract(sin(dot(st.xy, vec2(12.9898,78.233))) * 43758.5453123); 
        }
        
        void main() {
          vec2 uv = vUv;
          float grain = random(uv * 1000.0 + uTime * 0.1) * 0.05;
          
          float dist = length(uv - vec2(0.5));
          float vignette = smoothstep(0.9, 0.3, dist);
          
          // Slow gold ambient glow
          float glow = smoothstep(0.6, 0.0, distance(uv, vec2(0.5 + sin(uTime*0.3)*0.1, 0.5 + cos(uTime*0.2)*0.1))) * 0.15;
          vec3 gold = vec3(0.77, 0.62, 0.35) * glow;
          
          vec3 color = (uColor + gold) * vignette;
          gl_FragColor = vec4(color + grain, 1.0);
        }
      `,
      transparent: true,
      depthWrite: false
    });

    const geometry = new THREE.PlaneGeometry(2, 2);
    const mesh = new THREE.Mesh(geometry, material);
    scene.add(mesh);

    let rafId: number;
    const clock = new THREE.Clock();

    const animate = () => {
      uniforms.uTime.value = clock.getElapsedTime();
      renderer.render(scene, camera);
      rafId = requestAnimationFrame(animate);
    };
    animate();

    const handleResize = () => renderer.setSize(window.innerWidth, window.innerHeight);
    window.addEventListener("resize", handleResize);

    return () => {
      cancelAnimationFrame(rafId);
      window.removeEventListener("resize", handleResize);
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
      mm.add("(min-width: 768px) and (prefers-reduced-motion: no-preference)", () => {
        
        // Hero Entrance
        gsap.timeline({ delay: 0.3 })
          .fromTo(".anim-hero-line", { yPercent: 110 }, { yPercent: 0, ease: "power4.out", duration: 1.2, stagger: 0.1 }, 0.2)
          .fromTo(".anim-fade", { y: 40, opacity: 0 }, { y: 0, opacity: 1, ease: "power3.out", duration: 1, stagger: 0.1 }, 0.6);

        // General Scroll Reveals
        gsap.utils.toArray<HTMLElement>(".section-anim").forEach((sec) => {
          gsap.timeline({ scrollTrigger: { trigger: sec, start: "top 75%", end: "top 30%", scrub: 1 }})
            .fromTo(sec.querySelectorAll(".anim-mask"), { yPercent: 110 }, { yPercent: 0, ease: "power3.out", duration: 0.6, stagger: 0.1 }, 0)
            .fromTo(sec.querySelectorAll(".anim-fade"), { y: 40, opacity: 0 }, { y: 0, opacity: 1, ease: "power3.out", duration: 0.6, stagger: 0.08 }, 0.2);
        });

        // Map Reveal
        gsap.fromTo("#map-container", 
          { clipPath: "inset(100% 0% 0% 0%)" }, 
          { 
            clipPath: "inset(0% 0% 0% 0%)", ease: "power2.inOut", duration: 1.5,
            scrollTrigger: { trigger: "#map-container", start: "top 80%" }
          }
        );
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
          1. HERO
          ========================================== */}
      <section className="relative min-h-[80vh] bg-[#174B3A] text-[#F7F5EF] flex flex-col justify-center overflow-hidden">
        
        {/* Three.js Canvas Background */}
        <canvas ref={canvasRef} className="absolute inset-0 z-0 pointer-events-none" />
        
        {/* Skyline SVG */}
        <div className="absolute bottom-0 left-0 w-full h-1/3 z-10 pointer-events-none">
          <svg className="w-full h-full opacity-40" viewBox="0 0 1440 200" preserveAspectRatio="xMidYMax slice" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path d="M0 200V100H40V50H80V120H120V80H180V150H240V40H300V110H360V70H420V140H480V90H540V160H600V60H660V130H720V80H780V150H840V50H900V120H960V70H1020V140H1080V90H1140V160H1200V100H1260V40H1320V110H1380V80H1440V200H0Z" fill="#0B0B0D" opacity="0.8"/>
          </svg>
        </div>

        <div className="relative z-20 max-w-[1600px] mx-auto w-full px-6 md:px-12 lg:px-24 py-24">
          <div className="flex items-center gap-3 text-[10px] uppercase tracking-[0.3em] text-[#F7F5EF]/50 mb-8">
            <Link href="/" className="hover:text-[#C5A059]">Home</Link> <span>/</span> <span className="text-[#C5A059]">Contact</span>
          </div>
          <h1 className="font-lux-serif text-[clamp(3rem,8vw,8rem)] leading-[0.9] tracking-[-0.02em] font-light mb-8 max-w-4xl">
            <span className="block overflow-hidden pb-2"><span className="anim-hero-line block">Talk to us, or</span></span>
            <span className="block overflow-hidden pb-2"><span className="anim-hero-line block italic text-[#C5A059]">come and see it.</span></span>
          </h1>
          <p className="anim-fade text-base md:text-lg text-[#F7F5EF]/70 font-light leading-relaxed max-w-xl mb-10">
            Ask about a project, request documents or book a site visit. Our team replies on WhatsApp or by phone, usually within {CONFIG.responseTime}.
          </p>
          <div className="anim-fade flex flex-col sm:flex-row items-start gap-4">
            <a href={CONFIG.whatsapp} target="_blank" rel="noopener noreferrer" className="group relative overflow-hidden bg-[#C5A059] text-[#174B3A] text-[10px] font-semibold uppercase tracking-[0.3em] px-10 py-5 flex items-center gap-3 transition-colors duration-500 hover:text-[#C5A059]">
              <span className="absolute inset-0 bg-[#F7F5EF] translate-y-full group-hover:translate-y-0 transition-transform duration-500 z-0"></span>
              <span className="relative z-10 flex items-center gap-3">Chat on WhatsApp <span className="text-[9px] opacity-80">(হোয়াটসঅ্যাপে কথা বলুন)</span></span>
            </a>
            <a href="#visit" className="group relative overflow-hidden border border-[#F7F5EF]/30 text-[#F7F5EF] text-[10px] font-semibold uppercase tracking-[0.3em] px-10 py-5 flex items-center gap-3 transition-colors duration-500 hover:border-[#C5A059] hover:text-[#174B3A] backdrop-blur-sm bg-[#174B3A]/20">
              <span className="absolute inset-0 bg-[#C5A059] translate-y-full group-hover:translate-y-0 transition-transform duration-500 z-0"></span>
              <span className="relative z-10 flex items-center gap-3">Book a site visit <span className="text-[9px] opacity-80">(সাইট ভিজিট বুক করুন)</span></span>
            </a>
          </div>
        </div>
      </section>

      {/* ==========================================
          2. TALK TO US (#talk)
          ========================================== */}
      <section id="talk" className="section-anim relative py-24 md:py-32 px-6 md:px-12 lg:px-24 scroll-mt-20">
        <div className="max-w-[1600px] mx-auto">
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 mb-24 border-t border-[#191C19]/10 pt-12">
            {[
              { label: "WhatsApp", value: CONFIG.phone, desc: "Fastest for questions, brochures and documents." },
              { label: "Phone", value: CONFIG.phone, desc: CONFIG.hours },
              { label: "Email", value: CONFIG.email, desc: "For formal requests and attachments." },
              { label: "Head office", value: CONFIG.address, desc: "Visit by appointment." }
            ].map((item, i) => (
              <div key={i} className="anim-fade flex flex-col gap-2 border-l border-[#C5A059] pl-4">
                <span className="text-[10px] uppercase tracking-[0.3em] text-[#174B3A] font-semibold">{item.label}</span>
                <span className="font-lux-serif text-lg font-light text-[#191C19]">{item.value}</span>
                <p className="text-xs text-[#777A74] font-light leading-relaxed">{item.desc}</p>
              </div>
            ))}
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-12 gap-16">
            <div className="lg:col-span-7">
              <h2 className="font-lux-serif text-4xl md:text-5xl leading-[1.05] font-light mb-12">
                <span className="block overflow-hidden pb-2"><span className="anim-mask block">Send us a <span className="italic text-[#174B3A]">message</span></span></span>
              </h2>
              <EnquiryForm />
            </div>
            
            <div className="lg:col-span-4 lg:col-start-9 flex flex-col gap-8">
              <div className="anim-fade bg-[#E8F0E9] p-8 border border-[#174B3A]/10">
                <h3 className="text-[10px] uppercase tracking-[0.3em] text-[#174B3A] font-semibold mb-6">Office Hours</h3>
                <p className="text-sm text-[#191C19] font-light mb-2">Saturday to Thursday</p>
                <p className="text-sm text-[#777A74] font-light mb-2">{CONFIG.hours}</p>
                <p className="text-sm text-[#777A74] font-light">{CONFIG.fridayHours}</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ==========================================
          3. BOOK A SITE VISIT (#visit)
          ========================================== */}
      <section id="visit" className="section-anim relative py-24 md:py-32 px-6 md:px-12 lg:px-24 bg-[#191C19] text-[#F7F5EF] scroll-mt-20">
        <div className="max-w-[1600px] mx-auto">
          <div className="max-w-2xl mb-16">
            <h2 className="font-lux-serif text-4xl md:text-6xl leading-[1.05] font-light mb-6">
              <span className="block overflow-hidden pb-2"><span className="anim-mask block">See the land before</span></span>
              <span className="block overflow-hidden pb-2"><span className="anim-mask block italic text-[#C5A059]">you decide.</span></span>
            </h2>
            <p className="anim-fade text-sm md:text-base text-[#F7F5EF]/70 font-light leading-relaxed">
              Choose a project and a day. We will confirm by phone or WhatsApp and arrange the visit. Bring any questions; we can show you the documents on site.
            </p>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-12 gap-16 items-start">
            <div className="lg:col-span-7">
              <BookingForm />
            </div>

            <div className="lg:col-span-5">
              <h3 className="font-lux-serif text-2xl font-light mb-8 text-[#C5A059]">What to expect on a visit</h3>
              <div className="flex flex-col gap-8 border-l border-[#F7F5EF]/10 pl-6">
                {[
                  "A team member meets you at the site or at our office.",
                  "You walk the land or the building with the project plan.",
                  "We show the document set and answer questions.",
                  "You get the price list and payment plans in writing, with no pressure to decide."
                ].map((step, i) => (
                  <div key={i} className="anim-fade relative">
                    <span className="absolute -left-[31px] top-0 w-3 h-3 rounded-full bg-[#174B3A] border-2 border-[#C5A059]"></span>
                    <span className="font-lux-serif text-xl text-[#C5A059] block mb-1">0{i + 1}</span>
                    <p className="text-sm text-[#F7F5EF]/80 font-light leading-relaxed">{step}</p>
                  </div>
                ))}
              </div>
            </div>
          </div>

          <div className="mt-24 border-t border-[#F7F5EF]/10 pt-12">
            <h3 className="font-lux-serif text-2xl font-light mb-8">Visit by project</h3>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              <div className="border-l border-[#C5A059] pl-4">
                <h4 className="text-sm font-medium mb-2 text-[#C5A059]">Metro Square, Ashulia</h4>
                <p className="text-xs text-[#F7F5EF]/60 font-light">Meeting point: [meeting point]</p>
              </div>
              <div className="border-l border-[#C5A059] pl-4">
                <h4 className="text-sm font-medium mb-2 text-[#C5A059]">Highway Projects</h4>
                <p className="text-xs text-[#F7F5EF]/60 font-light">Condominium, Express Highway Inn and Trade Emporium all sit side by side. Meeting point: [meeting point]</p>
              </div>
              <div className="border-l border-[#C5A059] pl-4">
                <h4 className="text-sm font-medium mb-2 text-[#C5A059]">Agro & Golf Resort, Sylhet</h4>
                <p className="text-xs text-[#F7F5EF]/60 font-light">Visit arrangements and travel notes: [visit arrangements and travel notes]</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ==========================================
          4. FIND US (#map)
          ========================================== */}
      <section id="map" className="section-anim relative py-24 md:py-32 px-6 md:px-12 lg:px-24 scroll-mt-20">
        <div className="max-w-[1600px] mx-auto">
          <h2 className="font-lux-serif text-4xl md:text-6xl leading-[1.05] font-light mb-12">
            <span className="block overflow-hidden pb-2"><span className="anim-mask block">Where to <span className="italic text-[#174B3A]">find us</span></span></span>
          </h2>
          
          {/* Google Map Iframe Integration */}
          <div id="map-container" className="w-full h-[450px] md:h-[600px] bg-[#E8F0E9] border border-[#174B3A]/10 mb-12 overflow-hidden will-change-transform">
            <iframe
              src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3649.9518606974993!2d90.42892470000001!3d23.820310799999998!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x3755c76bec836017%3A0x455b21c6a1bee471!2shomespirit!5e0!3m2!1sbn!2sbd!4v1792057380856!5m2!1sbn!2sbd"
              width="100%"
              height="100%"
              style={{ border: 0 }}
              allowFullScreen
              loading="lazy"
              referrerPolicy="strict-origin-when-cross-origin"
            ></iframe>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 border-t border-[#191C19]/10 pt-8">
            {[
              { name: "Head office", addr: CONFIG.address },
              { name: "Metro Square, Ashulia", addr: "[Address or landmark]" },
              { name: "Highway projects", addr: "Dhaka–Chittagong Highway, [landmark]" },
              { name: "Agro & Golf Resort", addr: "Podunapur, Moulvibazar Sadar, Sylhet" }
            ].map((loc, i) => (
              <div key={i} className="anim-fade flex flex-col gap-2">
                <h4 className="font-lux-serif text-lg font-light">{loc.name}</h4>
                <p className="text-xs text-[#777A74] font-light">{loc.addr}</p>
                <a href={CONFIG.mapsLink} target="_blank" rel="noopener noreferrer" className="text-[10px] uppercase tracking-[0.2em] text-[#C5A059] mt-2 hover:underline">Get directions →</a>
              </div>
            ))}
          </div>
          <p className="text-xs text-[#777A74] font-light mt-8 italic">Please call before you visit a project site so we can have someone meet you.</p>
        </div>
      </section>

      {/* ==========================================
          5. NRB DESK (#nrb)
          ========================================== */}
      <section id="nrb" className="section-anim relative py-24 md:py-32 px-6 md:px-12 lg:px-24 bg-[#E8F0E9] scroll-mt-20">
        <div className="max-w-[1200px] mx-auto text-center">
          <h2 className="font-lux-serif text-4xl md:text-6xl leading-[1.05] font-light mb-6">
            <span className="block overflow-hidden pb-2"><span className="anim-mask block">Living abroad?</span></span>
            <span className="block overflow-hidden pb-2"><span className="anim-mask block italic text-[#174B3A]">Start here.</span></span>
          </h2>
          <p className="anim-fade text-base md:text-lg text-[#191C19]/70 font-light leading-relaxed max-w-2xl mx-auto mb-12">
            Our NRB desk handles remote enquiries, document reviews and video walkthroughs. Tell us your country and time zone and we will arrange a call that suits you.
          </p>
          
          <div className="anim-fade flex flex-col md:flex-row items-center justify-center gap-8 mb-12 border-t border-[#174B3A]/10 pt-8">
            <div className="text-sm text-[#191C19]"><span className="text-[10px] uppercase tracking-[0.2em] text-[#174B3A] block mb-1">WhatsApp</span> {CONFIG.phone}</div>
            <div className="text-sm text-[#191C19]"><span className="text-[10px] uppercase tracking-[0.2em] text-[#174B3A] block mb-1">Email</span> {CONFIG.email}</div>
            <div className="text-sm text-[#191C19]"><span className="text-[10px] uppercase tracking-[0.2em] text-[#174B3A] block mb-1">Hours</span> [Bangladesh time and your time zone]</div>
          </div>

          <div className="anim-fade flex flex-col sm:flex-row items-center justify-center gap-4">
            <a href={CONFIG.whatsapp} target="_blank" rel="noopener noreferrer" className="group relative overflow-hidden bg-[#174B3A] text-[#F7F5EF] text-[10px] font-semibold uppercase tracking-[0.3em] px-10 py-5 flex items-center gap-3 transition-colors duration-500 hover:text-[#174B3A]">
              <span className="absolute inset-0 bg-[#C5A059] translate-y-full group-hover:translate-y-0 transition-transform duration-500 z-0"></span>
              <span className="relative z-10">Chat with our NRB desk</span>
            </a>
            <a href="#visit" className="group relative overflow-hidden border border-[#174B3A]/20 text-[#174B3A] text-[10px] font-semibold uppercase tracking-[0.3em] px-10 py-5 flex items-center gap-3 transition-colors duration-500 hover:border-[#174B3A] hover:text-[#F7F5EF] bg-[#174B3A]/5">
              <span className="absolute inset-0 bg-[#174B3A] translate-y-full group-hover:translate-y-0 transition-transform duration-500 z-0"></span>
              <span className="relative z-10">Book a video visit</span>
            </a>
          </div>
          <Link href={CONFIG.investmentLink} className="anim-fade inline-block mt-8 text-xs uppercase tracking-[0.2em] text-[#C5A059] border-b border-[#C5A059] pb-1">
            Read the NRB buying steps on the Investment page
          </Link>
        </div>
      </section>

      {/* ==========================================
          6. FAQ (#faq)
          ========================================== */}
      <section id="faq" className="section-anim relative py-24 md:py-32 px-6 md:px-12 lg:px-24">
        <div className="max-w-[800px] mx-auto">
          <h2 className="font-lux-serif text-4xl md:text-5xl leading-[1.05] font-light mb-12 text-center">
            <span className="block overflow-hidden pb-2"><span className="anim-mask block">A few things you may <span className="italic text-[#174B3A]">want to know.</span></span></span>
          </h2>
          
          <div className="flex flex-col gap-4">
            {FAQS.map((faq, i) => (
              <div key={i} className="border-b border-[#191C19]/10">
                <button 
                  className="w-full flex items-center justify-between py-6 text-left group"
                  onClick={() => setOpenFaq(openFaq === i ? null : i)}
                  aria-expanded={openFaq === i}
                >
                  <span className="font-lux-serif text-lg font-light pr-4 group-hover:text-[#174B3A] transition-colors">{faq.q}</span>
                  <svg className={`w-5 h-5 text-[#C5A059] flex-shrink-0 transition-transform duration-300 ${openFaq === i ? "rotate-45" : ""}`} fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" d="M12 4v16m8-8H4"></path></svg>
                </button>
                <div className="grid transition-all duration-500 ease-in-out" style={{ gridTemplateRows: openFaq === i ? "1fr" : "0fr" }}>
                  <div className="overflow-hidden">
                    <p className="text-sm text-[#777A74] font-light leading-relaxed pb-6 pr-8">{faq.a}</p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ==========================================
          7. PART OF SAMPAN GROUP
          ========================================== */}
      <section className="section-anim relative py-32 md:py-48 px-6 md:px-12 lg:px-24 bg-[#174B3A] text-[#F7F5EF] text-center overflow-hidden">
        <div className="absolute inset-0 z-0 opacity-10" style={{ backgroundImage: "linear-gradient(rgba(255,255,255,0.1) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,0.1) 1px, transparent 1px)", backgroundSize: "100px 100px" }}></div>
        <div className="relative z-10 max-w-3xl mx-auto">
          <h2 className="font-lux-serif text-4xl md:text-6xl leading-[0.95] tracking-[-0.02em] font-light mb-6">
            <span className="block overflow-hidden pb-2"><span className="anim-mask block">Part of <span className="italic text-[#C5A059]">Sampan Group</span></span></span>
          </h2>
          <p className="anim-fade text-base md:text-lg text-[#F7F5EF]/70 font-light leading-relaxed mb-12 max-w-xl mx-auto">
            Looking for another Sampan business? Visit Sampan Group for hotels, education, agro and more.
          </p>
          <Link href={CONFIG.groupLink} className="anim-fade group relative overflow-hidden bg-[#C5A059] text-[#174B3A] text-[10px] font-semibold uppercase tracking-[0.3em] px-12 py-5 inline-flex items-center gap-3 transition-colors duration-500 hover:text-[#C5A059]">
            <span className="absolute inset-0 bg-[#F7F5EF] translate-y-full group-hover:translate-y-0 transition-transform duration-500 z-0"></span>
            <span className="relative z-10 flex items-center gap-3">Visit Sampan Group <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" d="M14 5l7 7m0 0l-7 7m7-7H3"></path></svg></span>
          </Link>
        </div>
      </section>

      {/* ==========================================
          MOBILE FLOATING ACTIONS
          ========================================== */}
      <div className="md:hidden fixed bottom-6 right-6 z-50 flex flex-col gap-3">
        <a href={`tel:${CONFIG.phoneRaw}`} className="w-14 h-14 bg-[#174B3A] rounded-full flex items-center justify-center shadow-lg text-[#F7F5EF]" aria-label="Call us">
          <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z"></path></svg>
        </a>
        <a href={CONFIG.whatsapp} target="_blank" rel="noopener noreferrer" className="w-14 h-14 bg-[#25D366] rounded-full flex items-center justify-center shadow-lg text-white" aria-label="Chat on WhatsApp">
          <svg className="w-7 h-7" fill="currentColor" viewBox="0 0 24 24"><path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51l-.57-.01c-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z"/></svg>
        </a>
      </div>

    </main>
  );
}

// ==========================================
// ENQUIRY FORM COMPONENT
// ==========================================
function EnquiryForm() {
  const [status, setStatus] = useState<'idle' | 'loading' | 'success' | 'error'>('idle');
  const [isNRB, setIsNRB] = useState(false);
  const [formData, setFormData] = useState({ name: "", phone: "", email: "", project: "", interest: "", message: "", consent: false });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value, type } = e.target;
    const checked = (e.target as HTMLInputElement).checked;
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
      <div className="bg-[#E8F0E9] p-8 border border-[#174B3A]/10 text-center">
        <svg className="w-12 h-12 mx-auto mb-4 text-[#174B3A]" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"></path></svg>
        <h3 className="font-lux-serif text-2xl font-light mb-2">Thanks, {formData.name}.</h3>
        <p className="text-sm text-[#777A74] font-light">
          We have your message about {formData.project || "your enquiry"} and will reply on {formData.phone} within {CONFIG.responseTime}.
        </p>
      </div>
    );
  }

  return (
    <form onSubmit={handleSubmit} className="flex flex-col gap-6">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <FormInput label="Full name" name="name" value={formData.name} onChange={handleChange} required />
        <FormInput label="Phone or WhatsApp" name="phone" value={formData.phone} onChange={handleChange} required type="tel" />
      </div>
      <FormInput label="Email (Optional)" name="email" value={formData.email} onChange={handleChange} type="email" />
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="flex flex-col gap-2">
          <label className="text-[10px] uppercase tracking-[0.3em] text-[#777A74]">Project of interest</label>
          <select name="project" value={formData.project} onChange={handleChange} className="bg-transparent border-b border-[#191C19]/30 py-3 focus:outline-none focus:border-[#174B3A] text-sm appearance-none cursor-pointer">
            <option value="">Select a project</option>
            {PROJECTS.map(p => <option key={p} value={p}>{p}</option>)}
          </select>
        </div>
        <div className="flex flex-col gap-2">
          <label className="text-[10px] uppercase tracking-[0.3em] text-[#777A74]">I am interested in</label>
          <select name="interest" value={formData.interest} onChange={handleChange} required className="bg-transparent border-b border-[#191C19]/30 py-3 focus:outline-none focus:border-[#174B3A] text-sm appearance-none cursor-pointer">
            <option value="">Select interest</option>
            <option>Land share</option>
            <option>Apartment</option>
            <option>Commercial space</option>
            <option>Membership</option>
            <option>Other</option>
          </select>
        </div>
      </div>

      <div className="flex items-center gap-3">
        <input type="checkbox" name="nrb" id="nrb" checked={isNRB} onChange={(e) => setIsNRB(e.target.checked)} className="w-4 h-4 accent-[#174B3A]" />
        <label htmlFor="nrb" className="text-sm text-[#191C19] font-light">I live abroad</label>
      </div>

      {isNRB && (
        <div className="bg-[#E8F0E9] p-4 border-l-2 border-[#174B3A] text-sm text-[#191C19] font-light">
          As an overseas buyer, you might prefer our remote NRB desk. <a href="#nrb" className="text-[#C5A059] underline">Learn more</a>.
        </div>
      )}

      <div className="flex flex-col gap-2">
        <label className="text-[10px] uppercase tracking-[0.3em] text-[#777A74]">Message</label>
        <textarea name="message" value={formData.message} onChange={handleChange} rows={4} className="bg-transparent border-b border-[#191C19]/30 py-3 focus:outline-none focus:border-[#174B3A] text-sm resize-none"></textarea>
      </div>

      <div className="flex items-start gap-3">
        <input type="checkbox" name="consent" id="consent" checked={formData.consent} onChange={handleChange} required className="w-4 h-4 mt-1 accent-[#174B3A]" />
        <label htmlFor="consent" className="text-xs text-[#777A74] font-light">
          I agree that Sampan Development Ltd may contact me about my enquiry. <Link href={CONFIG.privacyLink} className="text-[#174B3A] underline">Privacy policy</Link>.
        </label>
      </div>

      {status === 'error' && <p className="text-red-600 text-xs">Enter a phone number we can reach on WhatsApp and ensure consent is checked.</p>}

      <button type="submit" disabled={status === 'loading'} className="group relative overflow-hidden bg-[#174B3A] text-[#F7F5EF] text-[10px] font-semibold uppercase tracking-[0.3em] px-10 py-5 flex items-center justify-center gap-3 transition-colors duration-500 hover:text-[#174B3A] disabled:opacity-50 w-full md:w-auto">
        <span className="absolute inset-0 bg-[#C5A059] translate-y-full group-hover:translate-y-0 transition-transform duration-500 z-0"></span>
        <span className="relative z-10 flex items-center gap-3">
          {status === 'loading' ? 'Sending...' : 'Send message'}
          {!status && <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" d="M14 5l7 7m0 0l-7 7m7-7H3"></path></svg>}
        </span>
      </button>
    </form>
  );
}

// ==========================================
// BOOKING FORM COMPONENT
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
      <div className="bg-[#F7F5EF] text-[#191C19] p-8 border border-[#191C19]/10 text-center">
        <svg className="w-12 h-12 mx-auto mb-4 text-[#174B3A]" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"></path></svg>
        <h3 className="font-lux-serif text-2xl font-light mb-2">Visit requested for {formData.date}.</h3>
        <p className="text-sm text-[#777A74] font-light">
          We will confirm on {formData.phone}. If you need to change it, message us on <a href={CONFIG.whatsapp} className="text-[#C5A059] underline">WhatsApp</a>.
        </p>
      </div>
    );
  }

  return (
    <form onSubmit={handleSubmit} className="flex flex-col gap-6 bg-[#F7F5EF]/5 p-8 border border-[#F7F5EF]/10">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <FormInput label="Name" name="name" value={formData.name} onChange={handleChange} required dark />
        <FormInput label="Phone or WhatsApp" name="phone" value={formData.phone} onChange={handleChange} required type="tel" dark />
      </div>

      <div className="flex flex-col gap-2">
        <label className="text-[10px] uppercase tracking-[0.3em] text-[#F7F5EF]/50">Project</label>
        <select name="project" value={formData.project} onChange={handleChange} required className="bg-transparent border-b border-[#F7F5EF]/30 py-3 focus:outline-none focus:border-[#C5A059] text-sm appearance-none cursor-pointer text-[#F7F5EF]">
          <option value="" className="bg-[#191C19]">Select a project</option>
          {PROJECTS.map(p => <option key={p} value={p} className="bg-[#191C19]">{p}</option>)}
          <option value="All three highway projects" className="bg-[#191C19]">All three highway projects</option>
        </select>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <FormInput label="Visitors" name="visitors" value={formData.visitors} onChange={handleChange} type="number" dark />
        <FormInput label="Preferred date" name="date" value={formData.date} onChange={handleChange} type="date" required dark />
        <div className="flex flex-col gap-2">
          <label className="text-[10px] uppercase tracking-[0.3em] text-[#F7F5EF]/50">Time</label>
          <select name="time" value={formData.time} onChange={handleChange} className="bg-transparent border-b border-[#F7F5EF]/30 py-3 focus:outline-none focus:border-[#C5A059] text-sm appearance-none cursor-pointer text-[#F7F5EF]">
            <option value="Morning" className="bg-[#191C19]">Morning</option>
            <option value="Afternoon" className="bg-[#191C19]">Afternoon</option>
          </select>
        </div>
      </div>

      <div className="flex flex-col gap-2">
        <label className="text-[10px] uppercase tracking-[0.3em] text-[#F7F5EF]/50">Pick-up needed? [If offered]</label>
        <div className="flex gap-4">
          <label className="flex items-center gap-2 text-sm text-[#F7F5EF]/80 font-light cursor-pointer">
            <input type="radio" name="pickup" value="Yes" checked={formData.pickup === 'Yes'} onChange={handleChange} className="accent-[#C5A059]" /> Yes
          </label>
          <label className="flex items-center gap-2 text-sm text-[#F7F5EF]/80 font-light cursor-pointer">
            <input type="radio" name="pickup" value="No" checked={formData.pickup === 'No'} onChange={handleChange} className="accent-[#C5A059]" /> No
          </label>
        </div>
      </div>

      {status === 'error' && <p className="text-red-400 text-xs">Please fill in all required fields correctly.</p>}

      <button type="submit" disabled={status === 'loading'} className="group relative overflow-hidden bg-[#C5A059] text-[#191C19] text-[10px] font-semibold uppercase tracking-[0.3em] px-10 py-5 flex items-center justify-center gap-3 transition-colors duration-500 hover:text-[#C5A059] disabled:opacity-50 w-full md:w-auto">
        <span className="absolute inset-0 bg-[#F7F5EF] translate-y-full group-hover:translate-y-0 transition-transform duration-500 z-0"></span>
        <span className="relative z-10 flex items-center gap-3">
          {status === 'loading' ? 'Requesting...' : 'Request my visit'}
        </span>
      </button>
    </form>
  );
}

// ==========================================
// REUSABLE FORM INPUT
// ==========================================
function FormInput({ label, name, value, onChange, type = "text", required = false, dark = false }: {
  label: string; name: string; value: string; onChange: (e: React.ChangeEvent<HTMLInputElement>) => void; type?: string; required?: boolean; dark?: boolean;
}) {
  return (
    <div className="flex flex-col gap-2">
      <label className="text-[10px] uppercase tracking-[0.3em] text-[#777A74]">{label}</label>
      <input 
        type={type} 
        name={name} 
        value={value} 
        onChange={onChange} 
        required={required} 
        className={`bg-transparent border-b py-3 focus:outline-none text-sm transition-colors ${dark ? 'border-[#F7F5EF]/30 text-[#F7F5EF] focus:border-[#C5A059]' : 'border-[#191C19]/30 text-[#191C19] focus:border-[#174B3A]'}`} 
      />
    </div>
  );
}