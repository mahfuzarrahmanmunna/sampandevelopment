// app/components/AboutPage.tsx
"use client";

import Link from "next/link";
import { useLayoutEffect, useRef } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

export default function AboutPage() {
  const pageRef = useRef<HTMLElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);

  // --- 1. CUSTOM CANVAS TOPOGRAPHY ENGINE (3D Wireframe) ---
  useLayoutEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    let width = (canvas.width = canvas.offsetWidth);
    let height = (canvas.height = canvas.offsetHeight);
    let mouse = { x: width / 2, y: height / 2 };
    let rafId: number;

    const handleResize = () => {
      width = canvas.width = canvas.offsetWidth;
      height = canvas.height = canvas.offsetHeight;
    };

    const handleMouse = (e: MouseEvent) => {
      const rect = canvas.getBoundingClientRect();
      mouse.x = e.clientX - rect.left;
      mouse.y = e.clientY - rect.top;
    };

    window.addEventListener("resize", handleResize);
    window.addEventListener("mousemove", handleMouse);

    // Grid of points for the 3D terrain
    const cols = 30;
    const rows = 20;
    const points: { baseX: number; baseY: number; z: number }[] = [];
    
    for (let i = 0; i < cols; i++) {
      for (let j = 0; j < rows; j++) {
        const x = (i / (cols - 1)) * width;
        const y = (j / (rows - 1)) * height;
        points.push({ baseX: x, baseY: y, z: 0 });
      }
    }

    const draw = () => {
      ctx.clearRect(0, 0, width, height);
      const t = Date.now() * 0.001; // Time for ambient motion
      
      // Calculate Z heights (Mouse bulge + ambient waves)
      points.forEach((p) => {
        const dx = mouse.x - p.baseX;
        const dy = mouse.y - p.baseY;
        const dist = Math.sqrt(dx * dx + dy * dy);
        const maxDist = 400;
        
        // 3D Z-depth push based on mouse proximity
        const force = Math.max(0, 1 - dist / maxDist);
        p.z = force * 80 + Math.sin(p.baseX * 0.02 + t) * 15 + Math.cos(p.baseY * 0.02 + t) * 15;
      });

      // Draw wireframe connections with opacity based on depth
      for (let i = 0; i < cols - 1; i++) {
        for (let j = 0; j < rows - 1; j++) {
          const p1 = points[i * rows + j];
          const p2 = points[(i + 1) * rows + j];
          const p3 = points[i * rows + (j + 1)];
          
          // Horizontal line
          const avgZ1 = (p1.z + p2.z) / 2;
          const opacity1 = Math.min(0.6, 0.05 + avgZ1 / 100);
          ctx.strokeStyle = `rgba(197, 160, 89, ${opacity1})`; // Champagne Gold
          ctx.beginPath();
          ctx.moveTo(p1.baseX, p1.baseY - p1.z);
          ctx.lineTo(p2.baseX, p2.baseY - p2.z);
          ctx.stroke();
          
          // Vertical line
          const avgZ2 = (p1.z + p3.z) / 2;
          const opacity2 = Math.min(0.6, 0.05 + avgZ2 / 100);
          ctx.strokeStyle = `rgba(197, 160, 89, ${opacity2})`;
          ctx.beginPath();
          ctx.moveTo(p1.baseX, p1.baseY - p1.z);
          ctx.lineTo(p3.baseX, p3.baseY - p3.z);
          ctx.stroke();
        }
      }

      rafId = requestAnimationFrame(draw);
    };

    draw();

    return () => {
      cancelAnimationFrame(rafId);
      window.removeEventListener("resize", handleResize);
      window.removeEventListener("mousemove", handleMouse);
    };
  }, []);

  // --- 2. GSAP ANIMATION ENGINE ---
  useLayoutEffect(() => {
    gsap.registerPlugin(ScrollTrigger);

    const ctx = gsap.context(() => {
      const mm = gsap.matchMedia();
      
      mm.add("(min-width: 768px) and (prefers-reduced-motion: no-preference)", () => {
        
        // 1. Hero Entrance
        gsap.timeline({ delay: 0.3 })
          .fromTo("#hero .anim-headline", { yPercent: 110 }, { yPercent: 0, ease: "power4.out", duration: 1.2, stagger: 0.1 })
          .fromTo("#hero .anim-fade", { y: 40, opacity: 0 }, { y: 0, opacity: 1, ease: "power3.out", duration: 1 }, "-=0.8")
          .fromTo("#hero .skyline", { opacity: 0, scale: 1.2 }, { opacity: 1, scale: 1, ease: "none", duration: 3 }, 0);

        // Hero Parallax
        gsap.to("#hero .skyline", {
          yPercent: 30, ease: "none",
          scrollTrigger: { trigger: "#hero", start: "top top", end: "bottom top", scrub: true }
        });

        // 2. Horizontal Scroll Jacking for "Vision, Mission, Values"
        const panels = gsap.utils.toArray(".why-panel");
        gsap.to("#why-track", {
          xPercent: -100 * (panels.length - 1),
          ease: "none",
          scrollTrigger: {
            trigger: "#section-why",
            pin: true,
            scrub: 1,
            end: "+=200%", // Exactly 2 viewport widths of scroll distance
            invalidateOnRefresh: true
          }
        });

        // 3. Snappy Mask Reveals for standard sections (scrub 1 for tight follow)
        const createReveal = (trigger: string) => {
          gsap.timeline({
            scrollTrigger: { trigger, start: "top 80%", end: "top 30%", scrub: 1 }
          })
          .fromTo(`${trigger} .anim-headline`, { yPercent: 110 }, { yPercent: 0, ease: "power3.out", duration: 0.6, stagger: 0.1 }, 0)
          .fromTo(`${trigger} .anim-fade`, { y: 40, opacity: 0 }, { y: 0, opacity: 1, ease: "power3.out", duration: 0.6, stagger: 0.08 }, 0.2)
          .fromTo(`${trigger} .anim-line-draw`, { scaleX: 0 }, { scaleX: 1, ease: "none", duration: 0.5, stagger: 0.05 }, 0.4);
        };

        createReveal("#section-story");
        createReveal("#section-leadership");
        createReveal("#section-why-sampan");
        createReveal("#section-affiliations");
        createReveal("#section-concerns");
        createReveal("#section-cta");

        // 4. Timeline Draw
        gsap.fromTo("#section-story .timeline-line", 
          { scaleY: 0, transformOrigin: "top" },
          { 
            scaleY: 1, ease: "none",
            scrollTrigger: { trigger: "#section-story .timeline-wrapper", start: "top 70%", end: "bottom 70%", scrub: 1 }
          }
        );

        // 5. Leadership 3D Tilt (Refined with proper shadows)
        document.querySelectorAll(".leader-card").forEach(card => {
          card.addEventListener("mousemove", (e) => {
            const rect = card.getBoundingClientRect();
            const x = e.clientX - rect.left - rect.width / 2;
            const y = e.clientY - rect.top - rect.height / 2;
            gsap.to(card, { rotateY: x / 20, rotateX: -y / 20, scale: 1.03, duration: 0.5, ease: "power2.out" });
          });
          card.addEventListener("mouseleave", () => {
            gsap.to(card, { rotateY: 0, rotateX: 0, scale: 1, duration: 0.5, ease: "power3.out" });
          });
        });
      });

    }, pageRef);

    return () => {
      ctx.revert();
    };
  }, []);

  return (
    <main ref={pageRef} className="bg-[#F5F3EE] font-lux-sans antialiased overflow-x-hidden">
      
      {/* ==========================================
          1. HERO SECTION
          ========================================== */}
      <section id="hero" className="relative min-h-screen bg-[#17211D] text-[#F5F3EE] flex flex-col justify-center overflow-hidden">
        
        <canvas ref={canvasRef} className="absolute inset-0 w-full h-full z-0 opacity-50 pointer-events-none"></canvas>
        
        {/* Gradient Overlay for Canvas Readability */}
        <div className="absolute inset-0 z-[1] bg-gradient-to-b from-[#17211D]/80 via-[#17211D]/40 to-[#17211D] pointer-events-none"></div>
        
        <div className="absolute top-8 left-8 md:top-12 md:left-12 lg:left-24 z-20 flex items-center gap-3 text-[10px] uppercase tracking-[0.3em] text-[#F5F3EE]/50">
          <Link href="/" className="hover:text-[#C5A059] transition-colors">Home</Link>
          <span>/</span>
          <span className="text-[#C5A059]">About Us</span>
        </div>

        <div className="relative z-10 max-w-[1400px] mx-auto px-6 md:px-12 lg:px-24 w-full">
          <div className="max-w-4xl">
            <h1 className="font-lux-serif text-[clamp(3rem,9vw,8rem)] leading-[0.95] tracking-[-0.02em] mb-8">
              <span className="block overflow-hidden pb-2">
                <span className="anim-headline block font-light">Built on clear title</span>
              </span>
              <span className="block overflow-hidden pb-2">
                <span className="anim-headline block italic text-[#C5A059]">and group strength.</span>
              </span>
            </h1>
            <p className="anim-fade text-base md:text-lg text-[#F5F3EE]/80 font-light max-w-xl mb-12">
              The story of Sampan Development Ltd and the group behind it.
            </p>
            <div className="anim-fade flex flex-col sm:flex-row items-start gap-4">
              <Link href="/projects" className="group relative overflow-hidden bg-[#C5A059] text-[#17211D] text-[10px] font-semibold uppercase tracking-[0.3em] px-10 py-5 flex items-center gap-3 transition-colors duration-500 hover:text-[#C5A059]">
                <span className="absolute inset-0 bg-[#F5F3EE] translate-y-full group-hover:translate-y-0 transition-transform duration-500 ease-[cubic-bezier(0.22,1,0.36,1)] z-0"></span>
                <span className="relative z-10 flex items-center gap-3">View Projects <svg className="w-4 h-4 transition-transform duration-300 group-hover:translate-x-1" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" d="M14 5l7 7m0 0l-7 7m7-7H3"></path></svg></span>
              </Link>
              <Link href="/contact" className="group relative overflow-hidden border border-[#F5F3EE]/30 text-[#F5F3EE] text-[10px] font-semibold uppercase tracking-[0.3em] px-10 py-5 flex items-center gap-3 transition-colors duration-500 hover:border-[#C5A059] hover:text-[#17211D] backdrop-blur-sm bg-[#17211D]/20">
                <span className="absolute inset-0 bg-[#C5A059] translate-y-full group-hover:translate-y-0 transition-transform duration-500 ease-[cubic-bezier(0.22,1,0.36,1)] z-0"></span>
                <span className="relative z-10">Book a Site Visit</span>
              </Link>
            </div>
          </div>
        </div>

        <div className="absolute bottom-0 left-0 w-full h-[35vh] z-[2] pointer-events-none">
          <svg className="skyline w-full h-full object-cover" viewBox="0 0 1440 400" preserveAspectRatio="xMidYMax slice" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path d="M0 400V250H60V200H120V280H180V150H220V220H280V180H340V260H400V100H450V200H520V250H580V180H640V220H700V150H760V250H820V200H880V280H940V180H1000V220H1060V150H1120V250H1180V200H1240V280H1300V220H1360V250H1440V400H0Z" fill="#101615"/>
            <path d="M0 400V300H80V250H160V320H240V280H320V350H400V220H480V300H560V350H640V280H720V320H800V250H880V350H960V300H1040V380H1120V320H1200V350H1280V300H1360V330H1440V400H0Z" fill="#101615" opacity="0.8"/>
          </svg>
        </div>
      </section>

      {/* ==========================================
          2. OUR STORY AND GROUP
          ========================================== */}
      <section id="section-story" className="relative w-full bg-[#F5F3EE] text-[#101615] py-24 md:py-32 lg:py-40 px-6 md:px-12 lg:px-24 overflow-hidden">
        <div className="max-w-[1400px] mx-auto grid grid-cols-1 md:grid-cols-2 gap-16">
          
          <div className="flex flex-col justify-center">
            <div className="anim-fade flex items-center gap-4 mb-8">
              <span className="anim-line-draw block h-[1.5px] w-12 bg-[#C5A059]"></span>
              <span className="text-[10px] md:text-[11px] font-medium uppercase tracking-[0.4em] text-[#C5A059]">Our Story</span>
            </div>

            <h2 className="font-lux-serif text-[clamp(2.5rem,5vw,4rem)] leading-[1.05] tracking-[-0.02em] mb-8">
              <span className="block overflow-hidden pb-2"><span className="anim-headline block font-light">From land sales to</span></span>
              <span className="block overflow-hidden pb-2"><span className="anim-headline block italic text-[#C5A059]">highway destinations.</span></span>
            </h2>

            <div className="anim-fade space-y-6 text-base text-[#101615]/70 font-light leading-relaxed max-w-md mb-10">
              <p>Sampan Development Ltd is the land and construction arm of Sampan Group. We began in [year] with [one-sentence origin]. Today we sell land, run land-share (ojutangsho) projects and build apartments, a mall and highway destinations along the Dhaka–Chittagong Highway and in Ashulia.</p>
              <p>We do this alongside the group's own businesses: hotels and motels, a restaurant and party centre, a resort, a super shop, filling stations and an education arm. That means our buildings sit next to operating businesses, not empty promises.</p>
            </div>

            <a href="/sampan-group" className="anim-fade group inline-flex items-center gap-4 text-[10px] font-semibold uppercase tracking-[0.3em] text-[#101615] hover:text-[#C5A059] mt-4 transition-colors border border-[#101615]/20 px-8 py-4">
              Visit Sampan Group
              <svg className="w-4 h-4 transition-transform duration-300 group-hover:translate-x-1" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" d="M14 5l7 7m0 0l-7 7m7-7H3"></path></svg>
            </a>
          </div>

          <div className="timeline-wrapper relative flex flex-col justify-center pl-8 md:pl-16 py-8">
            <div className="timeline-line absolute top-0 bottom-0 left-0 md:left-8 w-px bg-[#C5A059]"></div>
            
            {[
              { year: "[Year]", event: "Company founded" },
              { year: "[Year]", event: "First project delivered" },
              { year: "[Year]", event: "Sampan Highway Inn opens" },
              { year: "[Year]", event: "Express Highway Inn" },
              { year: "[Year]", event: "Sampan Agro & Golf Resort announced" },
              { year: "[Year]", event: "Metro Square, Condominium and Trade Emporium launched" }
            ].map((m, i) => (
              <div key={i} className="anim-fade relative mb-10 last:mb-0 flex items-start gap-6">
                <div className="absolute -left-8 md:-left-16 top-2 w-3 h-3 rounded-full bg-[#F5F3EE] border-2 border-[#C5A059]"></div>
                <span className="font-lux-serif text-2xl text-[#C5A059] font-light w-20 flex-shrink-0">{m.year}</span>
                <span className="text-sm text-[#101615]/80 font-light pt-1">{m.event}</span>
              </div>
            ))}
          </div>
        </div>

        <div className="anim-fade max-w-[1400px] mx-auto mt-24 md:mt-32 pt-12 border-t border-[#101615]/10 grid grid-cols-2 md:grid-cols-4 gap-8">
          {[
            { num: "—", label: "Years in Business" },
            { num: "—", label: "Projects Delivered" },
            { num: "—", label: "Units Handed Over" },
            { num: "—", label: "Acres Under Development" }
          ].map((stat, i) => (
            <div key={i} className="flex flex-col gap-2">
              <span className="font-lux-serif text-5xl md:text-6xl text-[#101615] font-light">{stat.num}</span>
              <span className="text-[10px] font-medium uppercase tracking-[0.3em] text-[#101615]/50">{stat.label}</span>
            </div>
          ))}
        </div>
      </section>

      {/* ==========================================
          3. VISION, MISSION, VALUES (Horizontal Scroll)
          ========================================== */}
      <section id="section-why" className="relative w-full bg-[#101615] text-[#F5F3EE] overflow-hidden">
        <div id="why-track" className="flex w-[300%] h-screen">
          
          <div className="why-panel w-screen h-full flex items-center px-6 md:px-24">
            <div className="max-w-xl">
              <div className="anim-fade flex items-center gap-4 mb-6">
                <span className="anim-line-draw block h-[1.5px] w-12 bg-[#C5A059]"></span>
                <span className="text-[10px] font-medium uppercase tracking-[0.4em] text-[#C5A059]">Vision</span>
              </div>
              <h3 className="anim-fade font-lux-serif text-4xl md:text-6xl leading-tight font-light mb-4">
                To be the most trusted land and real estate developer in Bangladesh.
              </h3>
            </div>
          </div>

          <div className="why-panel w-screen h-full flex items-center justify-center px-6 md:px-24">
            <div className="max-w-xl text-center">
              <div className="anim-fade flex items-center justify-center gap-4 mb-6">
                <span className="anim-line-draw block h-[1.5px] w-12 bg-[#C5A059]"></span>
                <span className="text-[10px] font-medium uppercase tracking-[0.4em] text-[#C5A059]">Mission</span>
              </div>
              <h3 className="anim-fade font-lux-serif text-4xl md:text-6xl leading-tight font-light mb-4">
                To sell and build only on documented land, deliver what we promise, and keep every buyer informed.
              </h3>
            </div>
          </div>

          <div className="why-panel w-screen h-full flex items-center justify-end px-6 md:px-24">
            <div className="max-w-xl">
              <div className="anim-fade flex items-center gap-4 mb-6">
                <span className="anim-line-draw block h-[1.5px] w-12 bg-[#C5A059]"></span>
                <span className="text-[10px] font-medium uppercase tracking-[0.4em] text-[#C5A059]">Values</span>
              </div>
              <ul className="anim-fade space-y-6 text-lg text-[#F5F3EE]/80 font-light">
                <li><span className="text-[#F5F3EE] font-medium text-2xl block mb-1">Legal clarity</span> documents before payment.</li>
                <li><span className="text-[#F5F3EE] font-medium text-2xl block mb-1">Delivery</span> we finish what we start.</li>
                <li><span className="text-[#F5F3EE] font-medium text-2xl block mb-1">Openness</span> visit any site, ask any question.</li>
                <li><span className="text-[#F5F3EE] font-medium text-2xl block mb-1">Long-term thinking</span> projects that keep earning for their owners.</li>
              </ul>
            </div>
          </div>

        </div>
      </section>

      {/* ==========================================
          4. LEADERSHIP (3D Tilt cards)
          ========================================== */}
      <section id="section-leadership" className="relative w-full bg-[#F5F3EE] text-[#101615] py-24 md:py-32 lg:py-40 px-6 md:px-12 lg:px-24 overflow-hidden">
        <div className="max-w-[1400px] mx-auto">
          <div className="max-w-xl mb-16">
            <div className="anim-fade flex items-center gap-4 mb-8">
              <span className="anim-line-draw block h-[1.5px] w-12 bg-[#C5A059]"></span>
              <span className="text-[10px] font-medium uppercase tracking-[0.4em] text-[#C5A059]">Leadership</span>
            </div>
            <h2 className="font-lux-serif text-[clamp(2.5rem,5vw,4rem)] leading-[1.05] tracking-[-0.02em] mb-8">
              <span className="block overflow-hidden pb-2"><span className="anim-headline block font-light">The people accountable</span></span>
              <span className="block overflow-hidden pb-2"><span className="anim-headline block italic text-[#C5A059]">for your project.</span></span>
            </h2>
            <p className="anim-fade text-base text-[#101615]/70 font-light leading-relaxed">
              Our leaders sign off on every project, from land purchase to handover.
            </p>
          </div>

          {/* Added shadow and solid bg to make the 3D tilt visible */}
          <div className="leader-grid grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-6" style={{ perspective: "1000px" }}>
            {[
              { name: "[Name]", role: "Chairman", bio: "40-word bio goes here detailing professional background and commitment to Sampan's vision." },
              { name: "[Name]", role: "Chief Executive Officer", bio: "40-word bio goes here detailing professional background and commitment to Sampan's vision." },
              { name: "[Name]", role: "Managing Director", bio: "40-word bio goes here detailing professional background and commitment to Sampan's vision." },
              { name: "[Name]", role: "Director, Projects", bio: "40-word bio goes here detailing professional background and commitment to Sampan's vision." },
              { name: "[Name]", role: "Head of Legal", bio: "40-word bio goes here detailing professional background and commitment to Sampan's vision." }
            ].map((leader, i) => (
              <div key={i} className="leader-card group bg-white border border-[#101615]/10 shadow-[0_10px_40px_rgba(0,0,0,0.05)] p-6 transition-transform duration-300" style={{ transformStyle: "preserve-3d" }}>
                <div className="w-full aspect-[4/5] bg-[#101615]/5 mb-4 overflow-hidden relative border border-[#101615]/10">
                  <div className="absolute inset-0 flex items-center justify-center text-[#101615]/30 text-xs uppercase tracking-widest">Photo</div>
                </div>
                <h4 className="font-lux-serif text-lg font-light">{leader.name}</h4>
                <p className="text-[10px] uppercase tracking-[0.2em] text-[#C5A059] mb-3">{leader.role}</p>
                <p className="text-xs text-[#101615]/60 font-light leading-relaxed">{leader.bio}</p>
              </div>
            ))}
          </div>

          <div className="anim-fade mt-24 md:mt-32 border-l-2 border-[#C5A059] pl-8 md:pl-12 max-w-3xl mx-auto text-center md:text-left">
            <p className="font-lux-serif text-2xl md:text-3xl lg:text-4xl italic font-light leading-tight text-[#101615]">
              "We never ask a buyer to trust us on words alone."
            </p>
            <p className="text-[10px] uppercase tracking-[0.3em] text-[#101615]/50 mt-6">CEO, Sampan Development Ltd</p>
          </div>
        </div>
      </section>

      {/* ==========================================
          5. WHY SAMPAN (Wide Rows)
          ========================================== */}
      <section id="section-why-sampan" className="relative w-full bg-[#101615] text-[#F5F3EE] py-24 md:py-32 lg:py-40 px-6 md:px-12 lg:px-24 overflow-hidden">
        <div className="max-w-[1400px] mx-auto">
          
          <h2 className="font-lux-serif text-[clamp(2.5rem,5vw,4rem)] leading-[1.05] tracking-[-0.02em] mb-16">
            <span className="block overflow-hidden pb-2"><span className="anim-headline block font-light">Why buyers choose</span></span>
            <span className="block overflow-hidden pb-2"><span className="anim-headline block italic text-[#C5A059]">Sampan</span></span>
          </h2>

          <div className="flex flex-col gap-12 md:gap-16">
            {[
              { word: "Trust", desc: "Our projects are not only drawings. Sampan Highway Inn and Express Highway Inn are operating on the highway today, and you can drive there.", link: "/projects" },
              { word: "Legal clarity", desc: "Deeds, approvals, mutation and RAJUK papers are shown before you pay. Ask to see the originals at our office.", link: "/legal-and-trust" },
              { word: "Group strength", desc: "Hotels, a mall, a resort and an education business sit behind every development, so each project has a real neighbour and a real anchor.", link: "/sampan-group" }
            ].map((item, i) => (
              <div key={i} className="anim-fade group border-t border-[#F5F3EE]/10 pt-8 md:pt-12 flex flex-col md:flex-row items-start gap-8 md:gap-16">
                <div className="md:w-1/3">
                  <h3 className="font-lux-serif text-4xl md:text-5xl lg:text-6xl font-light text-[#F5F3EE] group-hover:text-[#C5A059] group-hover:translate-x-2 transition-all duration-300">
                    {item.word}
                  </h3>
                </div>
                <div className="md:w-2/3 flex flex-col md:flex-row items-start gap-8 justify-between">
                  <p className="text-base md:text-lg text-[#F5F3EE]/70 font-light leading-relaxed max-w-xl">{item.desc}</p>
                  <Link href={item.link} className="flex-shrink-0 text-[10px] font-semibold uppercase tracking-[0.3em] text-[#C5A059] border-b border-[#C5A059] pb-1 mt-4 md:mt-0">
                    Learn More
                  </Link>
                </div>
              </div>
            ))}
          </div>

          <div className="anim-fade mt-20 md:mt-32 text-center border-t border-[#F5F3EE]/10 pt-12">
            <p className="font-lux-serif text-2xl md:text-3xl italic font-light mb-10 text-[#F5F3EE]/80">
              Visit a site, read the documents, then decide.
            </p>
            <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
              <Link href="/legal" className="group relative overflow-hidden bg-[#C5A059] text-[#101615] text-[10px] font-semibold uppercase tracking-[0.3em] px-10 py-5 flex items-center gap-3 transition-colors duration-500 hover:text-[#C5A059]">
                <span className="absolute inset-0 bg-[#F5F3EE] translate-y-full group-hover:translate-y-0 transition-transform duration-500 ease-[cubic-bezier(0.22,1,0.36,1)] z-0"></span>
                <span className="relative z-10">See Documents</span>
              </Link>
              <Link href="/contact" className="group relative overflow-hidden border border-[#F5F3EE]/30 text-[#F5F3EE] text-[10px] font-semibold uppercase tracking-[0.3em] px-10 py-5 flex items-center gap-3 transition-colors duration-500 hover:border-[#C5A059] hover:text-[#101615] backdrop-blur-sm bg-[#101615]/20">
                <span className="absolute inset-0 bg-[#C5A059] translate-y-full group-hover:translate-y-0 transition-transform duration-500 ease-[cubic-bezier(0.22,1,0.36,1)] z-0"></span>
                <span className="relative z-10">Book a Site Visit</span>
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* ==========================================
          6. OUR AFFILIATIONS
          ========================================== */}
      <section id="section-affiliations" className="relative w-full bg-[#F5F3EE] text-[#101615] py-24 md:py-32 px-6 md:px-12 lg:px-24 overflow-hidden">
        <div className="max-w-[1400px] mx-auto">
          <div className="max-w-xl mb-16">
            <div className="anim-fade flex items-center gap-4 mb-8">
              <span className="anim-line-draw block h-[1.5px] w-12 bg-[#C5A059]"></span>
              <span className="text-[10px] font-medium uppercase tracking-[0.4em] text-[#C5A059]">Affiliations</span>
            </div>
            <h2 className="font-lux-serif text-[clamp(2.5rem,5vw,4rem)] leading-[1.05] tracking-[-0.02em] mb-8">
              <span className="block overflow-hidden pb-2"><span className="anim-headline block font-light">Our affiliations</span></span>
            </h2>
            <p className="anim-fade text-base text-[#101615]/70 font-light leading-relaxed">
              Memberships and associations that hold us to professional standards.
            </p>
          </div>

          <div className="grid grid-cols-2 md:grid-cols-4 gap-8 border-t border-[#101615]/10 pt-12">
            {["REAB", "Dhaka Chamber", "BGMEA", "BIM"].map((logo, i) => (
              <div key={i} className="anim-fade flex flex-col items-center justify-center text-center h-24 border border-[#101615]/10 p-4 hover:border-[#C5A059] hover:shadow-sm transition-all duration-300">
                <span className="font-lux-serif text-2xl font-light text-[#101615]/80">{logo}</span>
                <span className="text-[9px] uppercase tracking-[0.2em] text-[#101615]/40 mt-2">Member since [Year]</span>
              </div>
            ))}
          </div>

          <div className="anim-fade mt-16 grid grid-cols-1 md:grid-cols-3 gap-8">
            {[
              { award: "Best Highway Destination", year: "2023", org: "Real Estate Forum" },
              { award: "Excellence in Mixed-Use", year: "2022", org: "Architectural Digest BD" },
              { award: "Trusted Developer Award", year: "2021", org: "Business Standard" }
            ].map((a, i) => (
              <div key={i} className="border-l border-[#C5A059] pl-4">
                <p className="text-[10px] uppercase tracking-[0.3em] text-[#C5A059] mb-1">{a.year}</p>
                <h4 className="font-lux-serif text-lg font-light mb-1">{a.award}</h4>
                <p className="text-xs text-[#101615]/50 font-light">{a.org}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ==========================================
          7. OUR CONCERNS AND MOTHER COMPANY
          ========================================== */}
      <section id="section-concerns" className="relative w-full bg-[#101615] text-[#F5F3EE] py-24 md:py-32 px-6 md:px-12 lg:px-24 overflow-hidden">
        <div className="max-w-[1400px] mx-auto">
          <div className="max-w-xl mb-16">
            <div className="anim-fade flex items-center gap-4 mb-8">
              <span className="anim-line-draw block h-[1.5px] w-12 bg-[#C5A059]"></span>
              <span className="text-[10px] font-medium uppercase tracking-[0.4em] text-[#C5A059]">Mother Company</span>
            </div>
            <h2 className="font-lux-serif text-[clamp(2.5rem,5vw,4rem)] leading-[1.05] tracking-[-0.02em] mb-8">
              <span className="block overflow-hidden pb-2"><span className="anim-headline block font-light">Part of</span></span>
              <span className="block overflow-hidden pb-2"><span className="anim-headline block italic text-[#C5A059]">Sampan Group</span></span>
            </h2>
            <p className="anim-fade text-base text-[#F5F3EE]/70 font-light leading-relaxed mb-10">
              Sampan Development Ltd sits inside Sampan Group. The group's concerns include:
            </p>
            <a href="/sampan-group" className="anim-fade group inline-flex items-center gap-4 text-[10px] font-semibold uppercase tracking-[0.3em] text-[#F5F3EE] hover:text-[#C5A059] transition-colors border border-[#F5F3EE]/30 px-8 py-4">
              Visit Sampan Group
              <svg className="w-4 h-4 transition-transform duration-300 group-hover:translate-x-1" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" d="M14 5l7 7m0 0l-7 7m7-7H3"></path></svg>
            </a>
          </div>

          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
            {[
              "Express Highway Inn", "Sampan Highway Inn", "Sampan Agro & Golf Resort", "LSHS (Professional Education)",
              "Sampan Eco & Agro Resort", "Sampan Mart", "Mini Sampan Super Shop", "Sampan Hollow Bricks & Tile",
              "Sampan Pet & Beverage", "Sampan Auto & Fuel Stations"
            ].map((concern, i) => (
              <div key={i} className="anim-fade border border-[#F5F3EE]/10 p-6 flex items-center justify-center text-center h-32 hover:border-[#C5A059] hover:bg-[#F5F3EE]/5 transition-colors duration-300">
                <span className="text-sm font-medium text-[#F5F3EE]/80">{concern}</span>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ==========================================
          8. CLOSING CALL TO ACTION
          ========================================== */}
      <section id="section-cta" className="relative w-full bg-[#17211D] text-[#F5F3EE] py-32 md:py-48 px-6 md:px-12 lg:px-24 overflow-hidden text-center">
        {/* Subtle CSS radial gradient for depth instead of canvas to save performance */}
        <div className="absolute inset-0 z-0 opacity-20" style={{ background: "radial-gradient(circle at 50% 50%, rgba(197, 160, 89, 0.3) 0%, transparent 60%)" }}></div>
        
        <div className="max-w-3xl mx-auto relative z-10">
          <h2 className="font-lux-serif text-[clamp(3rem,7vw,6rem)] leading-[0.95] tracking-[-0.02em] mb-10">
            <span className="block overflow-hidden pb-2"><span className="anim-headline block font-light">See it for</span></span>
            <span className="block overflow-hidden pb-2"><span className="anim-headline block italic text-[#C5A059]">yourself.</span></span>
          </h2>
          <p className="anim-fade text-base md:text-lg text-[#F5F3EE]/70 font-light leading-relaxed mb-12 max-w-xl mx-auto">
            Tell us which project and when. Our team will confirm by phone or WhatsApp and arrange the visit.
          </p>
          <div className="anim-fade flex flex-col sm:flex-row items-center justify-center gap-4">
            <Link href="/contact" className="group relative overflow-hidden bg-[#C5A059] text-[#17211D] text-[10px] font-semibold uppercase tracking-[0.3em] px-12 py-5 flex items-center gap-3 transition-colors duration-500 hover:text-[#C5A059]">
              <span className="absolute inset-0 bg-[#F5F3EE] translate-y-full group-hover:translate-y-0 transition-transform duration-500 ease-[cubic-bezier(0.22,1,0.36,1)] z-0"></span>
              <span className="relative z-10">Book a Site Visit</span>
            </Link>
            <a href="https://wa.me/8801000000000" target="_blank" rel="noopener noreferrer" className="group relative overflow-hidden border border-[#F5F3EE]/30 text-[#F5F3EE] text-[10px] font-semibold uppercase tracking-[0.3em] px-12 py-5 flex items-center gap-3 transition-colors duration-500 hover:border-[#25D366] hover:text-[#17211D] backdrop-blur-sm bg-[#17211D]/20">
              <span className="absolute inset-0 bg-[#25D366] translate-y-full group-hover:translate-y-0 transition-transform duration-500 ease-[cubic-bezier(0.22,1,0.36,1)] z-0"></span>
              <span className="relative z-10 flex items-center gap-3">
                <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24"><path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51l-.57-.01c-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z"/></svg>
                Chat on WhatsApp
              </span>
            </a>
          </div>
        </div>
      </section>

      <style jsx global>{`
        @import url('https://fonts.googleapis.com/css2?family=Cormorant+Garamond:ital,wght@0,300;0,400;0,500;0,600;1,300;1,400;1,500&family=Inter:wght@300;400;500;600&display=swap');

        .font-lux-serif {
          font-family: 'Cormorant Garamond', serif;
        }
        .font-lux-sans {
          font-family: 'Inter', sans-serif;
        }
      `}</style>
    </main>
  );
}