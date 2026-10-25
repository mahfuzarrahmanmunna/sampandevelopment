// app/components/AboutPage.tsx
"use client";

import Link from "next/link";
import { useLayoutEffect, useRef } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

export default function AboutPage() {
  const pageRef = useRef<HTMLElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);

  /* ------------------------------------------------------------------ */
  /*  1. CANVAS TOPOGRAPHY                                              */
  /* ------------------------------------------------------------------ */
  useLayoutEffect(() => {
    if (!window.matchMedia("(min-width: 768px) and (prefers-reduced-motion: no-preference)").matches) return;

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

    const cols = 36;
    const rows = 22;
    const points: { baseX: number; baseY: number; z: number }[] = [];
    for (let i = 0; i < cols; i++) {
      for (let j = 0; j < rows; j++) {
        points.push({
          baseX: (i / (cols - 1)) * width,
          baseY: (j / (rows - 1)) * height,
          z: 0,
        });
      }
    }

    const draw = () => {
      if (document.hidden) {
        rafId = requestAnimationFrame(draw);
        return;
      }
      ctx.clearRect(0, 0, width, height);
      const t = Date.now() * 0.0006;

      points.forEach((p) => {
        const dx = mouse.x - p.baseX;
        const dy = mouse.y - p.baseY;
        const dist = Math.sqrt(dx * dx + dy * dy);
        const maxDist = 480;
        const force = Math.max(0, 1 - dist / maxDist);
        const eased = force * force * (3 - 2 * force);
        p.z =
          eased * 90 +
          Math.sin(p.baseX * 0.012 + t) * 18 +
          Math.cos(p.baseY * 0.014 + t * 1.3) * 14;
      });

      ctx.lineWidth = 0.6;
      for (let i = 0; i < cols - 1; i++) {
        for (let j = 0; j < rows - 1; j++) {
          const p1 = points[i * rows + j];
          const p2 = points[(i + 1) * rows + j];
          const p3 = points[i * rows + (j + 1)];

          const avgZ1 = (p1.z + p2.z) / 2;
          const avgZ2 = (p1.z + p3.z) / 2;
          const opacity1 = Math.min(0.55, 0.04 + avgZ1 / 110);
          const opacity2 = Math.min(0.55, 0.04 + avgZ2 / 110);

          ctx.strokeStyle = `rgba(197, 160, 89, ${opacity1})`;
          ctx.beginPath();
          ctx.moveTo(p1.baseX, p1.baseY - p1.z);
          ctx.lineTo(p2.baseX, p2.baseY - p2.z);
          ctx.stroke();

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

  /* ------------------------------------------------------------------ */
  /*  2. GSAP ANIMATION ENGINE                                          */
  /* ------------------------------------------------------------------ */
  useLayoutEffect(() => {
    gsap.registerPlugin(ScrollTrigger);

    const ctx = gsap.context(() => {
      const mm = gsap.matchMedia();

      mm.add("(min-width: 768px) and (prefers-reduced-motion: no-preference)", () => {
        gsap
          .timeline({ delay: 0.3 })
          .fromTo("#hero .anim-headline", { yPercent: 110 }, { yPercent: 0, ease: "power4.out", duration: 1.2, stagger: 0.12 })
          .fromTo("#hero .anim-fade", { y: 40, opacity: 0 }, { y: 0, opacity: 1, ease: "power3.out", duration: 1 }, "-=0.8")
          .fromTo("#hero .skyline", { opacity: 0, scale: 1.2 }, { opacity: 1, scale: 1, ease: "none", duration: 3 }, 0);

        gsap.to("#hero .skyline", {
          yPercent: 30,
          ease: "none",
          scrollTrigger: { trigger: "#hero", start: "top top", end: "bottom top", scrub: true },
        });

        const panels = gsap.utils.toArray(".why-panel");
        gsap.to("#why-track", {
          xPercent: -100 * (panels.length - 1),
          ease: "none",
          scrollTrigger: {
            trigger: "#section-why",
            pin: true,
            scrub: 1,
            end: "+=200%",
            invalidateOnRefresh: true,
          },
        });

        const createReveal = (trigger: string) => {
          gsap.timeline({
            scrollTrigger: { trigger, start: "top 80%", end: "top 30%", scrub: 1 },
          })
            .fromTo(`${trigger} .anim-headline`, { yPercent: 110 }, { yPercent: 0, ease: "power3.out", duration: 0.6, stagger: 0.1 }, 0)
            .fromTo(`${trigger} .anim-fade`, { y: 40, opacity: 0 }, { y: 0, opacity: 1, ease: "power3.out", duration: 0.6, stagger: 0.08 }, 0.2)
            .fromTo(`${trigger} .anim-line-draw`, { scaleX: 0 }, { scaleX: 1, ease: "none", duration: 0.5, stagger: 0.05 }, 0.4);
        };

        ["#section-story", "#section-leadership", "#section-why-sampan", "#section-affiliations", "#section-concerns", "#section-cta"].forEach(createReveal);

        gsap.fromTo("#section-story .timeline-line", { scaleY: 0, transformOrigin: "top" }, {
          scaleY: 1,
          ease: "none",
          scrollTrigger: { trigger: "#section-story .timeline-wrapper", start: "top 70%", end: "bottom 70%", scrub: 1 },
        });

        document.querySelectorAll<HTMLElement>(".leader-card").forEach((card) => {
          const handleMove = (e: MouseEvent) => {
            const rect = card.getBoundingClientRect();
            const x = e.clientX - rect.left - rect.width / 2;
            const y = e.clientY - rect.top - rect.height / 2;
            gsap.to(card, { rotateY: x / 24, rotateX: -y / 24, scale: 1.04, duration: 0.6, ease: "power3.out" });
          };
          const handleLeave = () => {
            gsap.to(card, { rotateY: 0, rotateX: 0, scale: 1, duration: 0.8, ease: "elastic.out(1, 0.4)" });
          };
          card.addEventListener("mousemove", handleMove);
          card.addEventListener("mouseleave", handleLeave);
        });

        // Concern card stagger entrance
        gsap.fromTo("#section-concerns .concern-card",
          { opacity: 0, y: 40 },
          {
            opacity: 1,
            y: 0,
            ease: "power3.out",
            duration: 0.6,
            stagger: 0.08,
            scrollTrigger: {
              trigger: "#section-concerns .concerns-grid",
              start: "top 80%",
              end: "bottom 60%",
              scrub: 1,
            },
          }
        );
      });

      mm.add("(max-width: 767px) and (prefers-reduced-motion: no-preference)", () => {
        const createReveal = (trigger: string) => {
          gsap.timeline({
            scrollTrigger: { trigger, start: "top 85%", end: "top 50%", scrub: 1 },
          })
            .fromTo(`${trigger} .anim-headline`, { opacity: 0, y: 30 }, { opacity: 1, y: 0, ease: "power3.out", duration: 0.6, stagger: 0.08 }, 0)
            .fromTo(`${trigger} .anim-fade`, { opacity: 0, y: 30 }, { opacity: 1, y: 0, ease: "power3.out", duration: 0.5, stagger: 0.06 }, 0.2)
            .fromTo(`${trigger} .anim-line-draw`, { scaleX: 0 }, { scaleX: 1, ease: "none", duration: 0.5, stagger: 0.04 }, 0.4);
        };
        ["#section-story", "#section-leadership", "#section-why-sampan", "#section-affiliations", "#section-concerns", "#section-cta"].forEach(createReveal);

        gsap.fromTo("#section-story .timeline-line", { scaleY: 0, transformOrigin: "top" }, {
          scaleY: 1,
          ease: "none",
          scrollTrigger: { trigger: "#section-story .timeline-wrapper", start: "top 80%", end: "bottom 80%", scrub: 1 },
        });

        gsap.fromTo("#section-concerns .concern-card",
          { opacity: 0, y: 30 },
          {
            opacity: 1,
            y: 0,
            ease: "power3.out",
            duration: 0.5,
            stagger: 0.06,
            scrollTrigger: {
              trigger: "#section-concerns .concerns-grid",
              start: "top 85%",
              end: "bottom 65%",
              scrub: 1,
            },
          }
        );
      });

      mm.add("(prefers-reduced-motion: reduce)", () => {
        gsap.set(".anim-headline, .anim-fade, .anim-line-draw, .concern-card", { clearProps: "all" });
      });
    }, pageRef);

    return () => ctx.revert();
  }, []);

  /* ------------------------------------------------------------------ */
  /*  DATA                                                              */
  /* ------------------------------------------------------------------ */
  const timeline = [
    { year: "[Year]", event: "Company founded — first land sales along Dhaka–Chittagong Highway." },
    { year: "[Year]", event: "First residential project delivered in Ashulia." },
    { year: "[Year]", event: "Sampan Highway Inn opens — operational hospitality landmark." },
    { year: "[Year]", event: "Express Highway Inn launches as the group's flagship highway destination." },
    { year: "[Year]", event: "Sampan Agro & Golf Resort announced — leisure and agriculture convergence." },
    { year: "[Year]", event: "Metro Square, Condominium and Trade Emporium launched together." },
  ];

  const stats = [
    { num: "—", label: "Years in Business" },
    { num: "—", label: "Projects Delivered" },
    { num: "—", label: "Units Handed Over" },
    { num: "—", label: "Acres Under Development" },
  ];

  const leaders = [
    { name: "[Name]", role: "Chairman" },
    { name: "[Name]", role: "Chief Executive Officer" },
    { name: "[Name]", role: "Managing Director" },
    { name: "[Name]", role: "Director, Projects" },
    { name: "[Name]", role: "Head of Legal" },
  ];

  const whyItems = [
    { word: "Trust", desc: "Our projects are not only drawings. Sampan Highway Inn and Express Highway Inn are operating on the highway today, and you can drive there.", link: "/projects" },
    { word: "Legal clarity", desc: "Deeds, approvals, mutation and RAJUK papers are shown before you pay. Ask to see the originals at our office.", link: "/legal-and-trust" },
    { word: "Group strength", desc: "Hotels, a mall, a resort and an education business sit behind every development, so each project has a real neighbour and a real anchor.", link: "/sampan-group" },
  ];

  const affiliations = ["REAB", "Dhaka Chamber", "BGMEA", "BIM"];

  const awards = [
    { award: "Best Highway Destination", year: "2023", org: "Real Estate Forum" },
    { award: "Excellence in Mixed-Use", year: "2022", org: "Architectural Digest BD" },
    { award: "Trusted Developer Award", year: "2021", org: "Business Standard" },
  ];

  // ── Each concern now has an image + anchor link ────────────────────
  const concerns = [
    {
      name: "Express Highway Inn",
      tag: "Hospitality",
      location: "Express Highway",
      img: "/images/concerns/express-highway-inn.jpg",
      href: "https://sampangroup.com.bd/express-highway-inn",
      caption: "Flagship highway hospitality landmark.",
    },
    {
      name: "Sampan Highway Inn",
      tag: "Hospitality",
      location: "Dhaka – Chittagong Highway",
      img: "/images/concerns/sampan-highway-inn.jpg",
      href: "https://sampangroup.com.bd/sampan-highway-inn",
      caption: "Modern transit accommodation for travellers.",
    },
    {
      name: "Sampan Agro & Golf Resort",
      tag: "Leisure",
      location: "Outskirts of City",
      img: "/images/concerns/agro-golf-resort.jpg",
      href: "https://sampangroup.com.bd/agro-golf-resort",
      caption: "Resort living beside fairways and farmland.",
    },
    {
      name: "LSHS",
      tag: "Education",
      location: "Professional Studies",
      img: "/images/concerns/lshs.jpg",
      href: "https://sampangroup.com.bd/lshs",
      caption: "Institute of professional and higher studies.",
    },
    {
      name: "Sampan Eco & Agro Resort",
      tag: "Agriculture",
      location: "Sustainable Futures",
      img: "/images/concerns/eco-agro-resort.jpg",
      href: "https://sampangroup.com.bd/eco-agro-resort",
      caption: "Eco-resort and agro enterprise in harmony with nature.",
    },
    {
      name: "Sampan Mart",
      tag: "Retail",
      location: "Everyday Goods",
      img: "/images/concerns/sampan-mart.jpg",
      href: "https://sampangroup.com.bd/sampan-mart",
      caption: "Modern super shop for daily essentials.",
    },
    {
      name: "Mini Sampan Super Shop",
      tag: "Retail",
      location: "Neighbourhood",
      img: "/images/concerns/mini-sampan.jpg",
      href: "https://sampangroup.com.bd/mini-sampan",
      caption: "Compact convenience stores across communities.",
    },
    {
      name: "Sampan Hollow Bricks & Tile",
      tag: "Manufacturing",
      location: "Industrial Supply",
      img: "/images/concerns/bricks-tile.jpg",
      href: "https://sampangroup.com.bd/bricks-tile",
      caption: "Hollow bricks and tiles for construction projects.",
    },
    {
      name: "Sampan Pet & Beverage",
      tag: "Consumer",
      location: "Pet & Beverage",
      img: "/images/concerns/pet-beverage.jpg",
      href: "https://sampangroup.com.bd/pet-beverage",
      caption: "Pet products and beverage distribution.",
    },
    {
      name: "Sampan Auto & Fuel Stations",
      tag: "Energy",
      location: "Fuel Network",
      img: "/images/concerns/auto-fuel.jpg",
      href: "https://sampangroup.com.bd/auto-fuel",
      caption: "Fuel stations and auto services along the highway.",
    },
  ];

  return (
    <main ref={pageRef} className="bg-[#F5F3EE] font-lux-sans antialiased overflow-x-hidden">

      {/* ============================================================
          1. HERO
          ============================================================ */}
      <section id="hero" className="relative min-h-[100svh] bg-[#17211D] text-[#F5F3EE] flex flex-col justify-center overflow-hidden">
        <canvas ref={canvasRef} className="absolute inset-0 z-0 h-full w-full opacity-50 pointer-events-none" />
        <div className="absolute inset-0 z-[1] bg-gradient-to-b from-[#17211D]/80 via-[#17211D]/40 to-[#17211D] pointer-events-none" />

        <div className="absolute left-5 top-6 z-20 flex items-center gap-3 text-[10px] uppercase tracking-[0.3em] text-[#F5F3EE]/50 sm:left-6 md:left-12 md:top-12 lg:left-24">
          <Link href="/" className="transition-colors hover:text-[#C5A059]">Home</Link>
          <span className="text-[#F5F3EE]/30">/</span>
          <span className="text-[#C5A059]">About Us</span>
        </div>

        <div className="absolute right-6 top-1/2 z-20 hidden -translate-y-1/2 rotate-90 text-[10px] uppercase tracking-[0.4em] text-[#F5F3EE]/40 md:block lg:right-12">
          Est. [Year] · Dhaka, Bangladesh
        </div>

        <div className="relative z-10 mx-auto w-full max-w-[1400px] px-5 sm:px-6 md:px-12 lg:px-24">
          <div className="max-w-4xl">
            <div className="anim-fade mb-8 flex items-center gap-4">
              <span className="block h-[1.5px] w-12 bg-[#C5A059]"></span>
              <span className="text-[10px] font-medium uppercase tracking-[0.4em] text-[#C5A059] md:text-[11px]">
                About Sampan Development
              </span>
            </div>

            <h1 className="font-lux-serif text-[clamp(2.8rem,9vw,8rem)] leading-[0.95] tracking-[-0.02em] mb-8">
              <span className="block overflow-hidden pb-2">
                <span className="anim-headline block font-light">Built on clear title</span>
              </span>
              <span className="block overflow-hidden pb-2">
                <span className="anim-headline block font-normal italic text-[#C5A059]">and group strength.</span>
              </span>
            </h1>

            <p className="anim-fade mb-12 max-w-xl text-base font-light leading-relaxed text-[#F5F3EE]/80 md:text-lg">
              The story of Sampan Development Ltd and the group behind it.
            </p>

            <div className="anim-fade flex flex-col items-start gap-4 sm:flex-row">
              <Link href="/projects" className="group relative flex items-center gap-3 overflow-hidden bg-[#C5A059] px-8 py-4 text-[10px] font-semibold uppercase tracking-[0.3em] text-[#17211D] transition-colors duration-500 hover:text-[#C5A059] sm:px-10 sm:py-5">
                <span className="absolute inset-0 z-0 translate-y-full bg-[#F5F3EE] transition-transform duration-500 ease-[cubic-bezier(0.22,1,0.36,1)] group-hover:translate-y-0"></span>
                <span className="relative z-10 flex items-center gap-3">
                  View Projects
                  <svg className="h-4 w-4 transition-transform duration-300 group-hover:translate-x-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" d="M14 5l7 7m0 0l-7 7m7-7H3"></path>
                  </svg>
                </span>
              </Link>
              <Link href="/contact" className="group relative flex items-center gap-3 overflow-hidden border border-[#F5F3EE]/30 bg-[#17211D]/20 px-8 py-4 text-[10px] font-semibold uppercase tracking-[0.3em] text-[#F5F3EE] backdrop-blur-sm transition-colors duration-500 hover:border-[#C5A059] hover:text-[#17211D] sm:px-10 sm:py-5">
                <span className="absolute inset-0 z-0 translate-y-full bg-[#C5A059] transition-transform duration-500 ease-[cubic-bezier(0.22,1,0.36,1)] group-hover:translate-y-0"></span>
                <span className="relative z-10">Book a Site Visit</span>
              </Link>
            </div>
          </div>
        </div>

        <div className="absolute bottom-0 left-0 z-[2] h-[35vh] w-full pointer-events-none">
          <svg className="skyline h-full w-full object-cover" viewBox="0 0 1440 400" preserveAspectRatio="xMidYMax slice" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path d="M0 400V250H60V200H120V280H180V150H220V220H280V180H340V260H400V100H450V200H520V250H580V180H640V220H700V150H760V250H820V200H880V280H940V180H1000V220H1060V150H1120V250H1180V200H1240V280H1300V220H1360V250H1440V400H0Z" fill="#101615" />
            <path d="M0 400V300H80V250H160V320H240V280H320V350H400V220H480V300H560V350H640V280H720V320H800V250H880V350H960V300H1040V380H1120V320H1200V350H1280V300H1360V330H1440V400H0Z" fill="#101615" opacity="0.8" />
          </svg>
        </div>

        <div className="absolute bottom-8 left-1/2 z-20 hidden -translate-x-1/2 flex-col items-center gap-3 text-[9px] uppercase tracking-[0.4em] text-[#F5F3EE]/50 md:flex">
          <span>Scroll to Discover</span>
          <div className="h-10 w-px overflow-hidden bg-[#F5F3EE]/20">
            <div className="h-full w-full origin-top animate-[scrollCue_2s_ease-in-out_infinite] bg-[#C5A059]"></div>
          </div>
        </div>
      </section>

      {/* ============================================================
          2. OUR STORY
          ============================================================ */}
      <section id="section-story" className="relative w-full overflow-hidden bg-[#F5F3EE] px-5 py-20 text-[#101615] sm:px-6 md:px-12 md:py-32 lg:px-24 lg:py-40">
        <div className="mx-auto grid max-w-[1400px] grid-cols-1 gap-16 md:grid-cols-2">

          <div className="flex flex-col justify-center">
            <div className="anim-fade mb-8 flex items-center gap-4">
              <span className="anim-line-draw block h-[1.5px] w-12 bg-[#C5A059]"></span>
              <span className="text-[10px] font-medium uppercase tracking-[0.4em] text-[#C5A059] md:text-[11px]">Our Story</span>
            </div>

            <h2 className="font-lux-serif text-[clamp(2.5rem,5vw,4rem)] leading-[1.05] tracking-[-0.02em] mb-8">
              <span className="block overflow-hidden pb-2"><span className="anim-headline block font-light">From land sales to</span></span>
              <span className="block overflow-hidden pb-2"><span className="anim-headline block font-normal italic text-[#C5A059]">highway destinations.</span></span>
            </h2>

            <div className="anim-fade space-y-6 text-sm font-light leading-relaxed text-[#101615]/70 sm:text-base md:max-w-md">
              <p>Sampan Development Ltd is the land and construction arm of Sampan Group. We began in [year] with [one-sentence origin]. Today we sell land, run land-share (ojutangsho) projects and build apartments, a mall and highway destinations along the Dhaka–Chittagong Highway and in Ashulia.</p>
              <p>We do this alongside the group's own businesses: hotels and motels, a restaurant and party centre, a resort, a super shop, filling stations and an education arm. That means our buildings sit next to operating businesses, not empty promises.</p>
            </div>

            <a href="/sampan-group" className="anim-fade group mt-10 inline-flex items-center gap-4 border border-[#101615]/20 px-8 py-4 text-[10px] font-semibold uppercase tracking-[0.3em] text-[#101615] transition-colors hover:border-[#C5A059] hover:text-[#C5A059]">
              Visit Sampan Group
              <svg className="h-4 w-4 transition-transform duration-300 group-hover:translate-x-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" d="M14 5l7 7m0 0l-7 7m7-7H3"></path>
              </svg>
            </a>
          </div>

          <div className="timeline-wrapper relative flex flex-col justify-center py-8 pl-8 md:pl-16">
            <div className="timeline-line absolute bottom-0 left-0 top-0 w-px bg-[#C5A059] md:left-8"></div>

            {timeline.map((m, i) => (
              <div key={i} className="anim-fade relative mb-10 flex items-start gap-6 last:mb-0">
                <div className="absolute -left-8 top-2 h-3 w-3 rounded-full border-2 border-[#C5A059] bg-[#F5F3EE] md:-left-16"></div>
                <span className="w-20 flex-shrink-0 font-lux-serif text-2xl font-light text-[#C5A059]">{m.year}</span>
                <span className="pt-1 text-sm font-light text-[#101615]/80">{m.event}</span>
              </div>
            ))}
          </div>
        </div>

        <div className="anim-fade mx-auto mt-20 grid max-w-[1400px] grid-cols-2 gap-8 border-t border-[#101615]/10 pt-12 md:mt-32 md:grid-cols-4">
          {stats.map((stat, i) => (
            <div key={i} className="flex flex-col gap-2">
              <span className="font-lux-serif text-5xl font-light text-[#101615] md:text-6xl">{stat.num}</span>
              <span className="text-[10px] font-medium uppercase tracking-[0.3em] text-[#101615]/50">{stat.label}</span>
            </div>
          ))}
        </div>
      </section>

      {/* ============================================================
          3. VISION · MISSION · VALUES
          ============================================================ */}
      <section id="section-why" className="relative h-screen w-full overflow-hidden bg-[#101615] text-[#F5F3EE]">
        <div id="why-track" className="flex h-full w-[300%]">

          <div className="why-panel flex h-full w-screen items-center px-5 sm:px-6 md:px-24">
            <div className="max-w-xl">
              <div className="anim-fade mb-6 flex items-center gap-4">
                <span className="anim-line-draw block h-[1.5px] w-12 bg-[#C5A059]"></span>
                <span className="text-[10px] font-medium uppercase tracking-[0.4em] text-[#C5A059]">01 / Vision</span>
              </div>
              <h3 className="anim-fade font-lux-serif text-3xl font-light leading-tight sm:text-4xl md:text-6xl">
                To be the most trusted land and real estate developer in Bangladesh.
              </h3>
            </div>
          </div>

          <div className="why-panel flex h-full w-screen items-center justify-center px-5 sm:px-6 md:px-24">
            <div className="max-w-xl text-center">
              <div className="anim-fade mb-6 flex items-center justify-center gap-4">
                <span className="anim-line-draw block h-[1.5px] w-12 bg-[#C5A059]"></span>
                <span className="text-[10px] font-medium uppercase tracking-[0.4em] text-[#C5A059]">02 / Mission</span>
              </div>
              <h3 className="anim-fade font-lux-serif text-3xl font-light leading-tight sm:text-4xl md:text-6xl">
                To sell and build only on documented land, deliver what we promise, and keep every buyer informed.
              </h3>
            </div>
          </div>

          <div className="why-panel flex h-full w-screen items-center justify-end px-5 sm:px-6 md:px-24">
            <div className="max-w-xl">
              <div className="anim-fade mb-6 flex items-center gap-4">
                <span className="anim-line-draw block h-[1.5px] w-12 bg-[#C5A059]"></span>
                <span className="text-[10px] font-medium uppercase tracking-[0.4em] text-[#C5A059]">03 / Values</span>
              </div>
              <ul className="anim-fade space-y-5 text-sm font-light text-[#F5F3EE]/80 sm:text-base md:text-lg">
                {[
                  { t: "Legal clarity", d: "Documents before payment." },
                  { t: "Delivery", d: "We finish what we start." },
                  { t: "Openness", d: "Visit any site, ask any question." },
                  { t: "Long-term thinking", d: "Projects that keep earning for their owners." },
                ].map((v, i) => (
                  <li key={i} className="flex gap-4">
                    <span className="font-lux-serif text-2xl font-light italic text-[#C5A059]">0{i + 1}</span>
                    <div>
                      <span className="block text-base font-medium text-[#F5F3EE] sm:text-lg md:text-2xl">{v.t}</span>
                      <span className="block text-sm sm:text-base">{v.d}</span>
                    </div>
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </div>

        <div className="absolute bottom-8 left-1/2 z-20 flex -translate-x-1/2 gap-3">
          {[0, 1, 2].map((i) => (
            <span key={i} className="h-px w-12 bg-[#F5F3EE]/20">
              <span className={`block h-full bg-[#C5A059] transition-all duration-500 ${i === 0 ? "w-full" : "w-0"}`}></span>
            </span>
          ))}
        </div>
      </section>

      {/* ============================================================
          4. LEADERSHIP
          ============================================================ */}
      <section id="section-leadership" className="relative w-full overflow-hidden bg-[#F5F3EE] px-5 py-20 text-[#101615] sm:px-6 md:px-12 md:py-32 lg:px-24 lg:py-40">
        <div className="mx-auto max-w-[1400px]">
          <div className="mb-16 max-w-xl">
            <div className="anim-fade mb-8 flex items-center gap-4">
              <span className="anim-line-draw block h-[1.5px] w-12 bg-[#C5A059]"></span>
              <span className="text-[10px] font-medium uppercase tracking-[0.4em] text-[#C5A059]">Leadership</span>
            </div>
            <h2 className="font-lux-serif text-[clamp(2.5rem,5vw,4rem)] leading-[1.05] tracking-[-0.02em] mb-8">
              <span className="block overflow-hidden pb-2"><span className="anim-headline block font-light">The people accountable</span></span>
              <span className="block overflow-hidden pb-2"><span className="anim-headline block font-normal italic text-[#C5A059]">for your project.</span></span>
            </h2>
            <p className="anim-fade text-sm font-light leading-relaxed text-[#101615]/70 sm:text-base md:text-lg">
              Our leaders sign off on every project, from land purchase to handover.
            </p>
          </div>

          <div className="grid grid-cols-2 gap-4 sm:gap-6 md:grid-cols-3 lg:grid-cols-5" style={{ perspective: "1000px" }}>
            {leaders.map((leader, i) => (
              <div key={i} className="leader-card group relative bg-white p-4 shadow-[0_8px_30px_-12px_rgba(16,22,21,0.12)] transition-shadow duration-500 hover:shadow-[0_20px_50px_-12px_rgba(197,160,89,0.25)] sm:p-6" style={{ transformStyle: "preserve-3d" }}>
                <span className="absolute right-3 top-3 text-[9px] uppercase tracking-[0.2em] text-[#101615]/30">0{i + 1}</span>

                <div className="relative mb-4 aspect-[4/5] w-full overflow-hidden border border-[#101615]/10 bg-gradient-to-br from-[#101615]/5 to-[#101615]/[0.02]">
                  <div className="absolute inset-0 flex items-center justify-center text-[10px] uppercase tracking-[0.3em] text-[#101615]/25">Photo</div>
                  <div className="absolute left-0 top-0 h-4 w-4 border-l border-t border-[#C5A059]/50"></div>
                  <div className="absolute bottom-0 right-0 h-4 w-4 border-b border-r border-[#C5A059]/50"></div>
                </div>

                <h4 className="font-lux-serif text-base font-light sm:text-lg">{leader.name}</h4>
                <p className="mb-3 text-[10px] uppercase tracking-[0.2em] text-[#C5A059]">{leader.role}</p>
                <span className="block h-px w-6 origin-left scale-x-100 bg-[#C5A059] transition-transform duration-500 group-hover:w-full"></span>
              </div>
            ))}
          </div>

          <div className="anim-fade mx-auto mt-20 max-w-3xl border-l-2 border-[#C5A059] pl-6 text-center md:mt-32 md:pl-12 md:text-left">
            <span className="mb-4 block font-lux-serif text-6xl italic leading-none text-[#C5A059]/30">"</span>
            <p className="font-lux-serif text-2xl font-light italic leading-tight text-[#101615] md:text-3xl lg:text-4xl">
              We never ask a buyer to trust us on words alone.
            </p>
            <p className="mt-6 text-[10px] uppercase tracking-[0.3em] text-[#101615]/50">CEO, Sampan Development Ltd</p>
          </div>
        </div>
      </section>

      {/* ============================================================
          5. WHY SAMPAN
          ============================================================ */}
      <section id="section-why-sampan" className="relative w-full overflow-hidden bg-[#101615] px-5 py-20 text-[#F5F3EE] sm:px-6 md:px-12 md:py-32 lg:px-24 lg:py-40">
        <div className="pointer-events-none absolute left-0 top-1/2 w-full -translate-y-1/2 overflow-hidden whitespace-nowrap opacity-[0.04]">
          <span className="font-lux-serif pr-8 text-[20vw] leading-none text-[#F5F3EE]">WHY SAMPAN</span>
        </div>

        <div className="relative mx-auto max-w-[1400px]">
          <h2 className="mb-16 font-lux-serif text-[clamp(2.5rem,5vw,4rem)] leading-[1.05] tracking-[-0.02em]">
            <span className="block overflow-hidden pb-2"><span className="anim-headline block font-light">Why buyers choose</span></span>
            <span className="block overflow-hidden pb-2"><span className="anim-headline block font-normal italic text-[#C5A059]">Sampan</span></span>
          </h2>

          <div className="flex flex-col gap-12 md:gap-16">
            {whyItems.map((item, i) => (
              <div key={i} className="anim-fade group flex flex-col items-start gap-8 border-t border-[#F5F3EE]/10 pt-8 md:flex-row md:gap-16 md:pt-12">
                <div className="md:w-1/3">
                  <span className="mb-2 block text-[10px] uppercase tracking-[0.3em] text-[#C5A059]">0{i + 1}</span>
                  <h3 className="font-lux-serif text-4xl font-light text-[#F5F3EE] transition-all duration-500 group-hover:translate-x-2 group-hover:text-[#C5A059] md:text-5xl lg:text-6xl">
                    {item.word}
                  </h3>
                </div>
                <div className="flex flex-col items-start justify-between gap-8 md:w-2/3 md:flex-row">
                  <p className="max-w-xl text-sm font-light leading-relaxed text-[#F5F3EE]/70 sm:text-base md:text-lg">{item.desc}</p>
                  <Link href={item.link} className="group/link flex flex-shrink-0 items-center gap-3 border-b border-[#C5A059] pb-1 text-[10px] font-semibold uppercase tracking-[0.3em] text-[#C5A059]">
                    Learn More
                    <svg className="h-3 w-3 transition-transform duration-300 group-hover/link:translate-x-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" d="M14 5l7 7m0 0l-7 7m7-7H3"></path>
                    </svg>
                  </Link>
                </div>
              </div>
            ))}
          </div>

          <div className="anim-fade mt-20 border-t border-[#F5F3EE]/10 pt-12 text-center md:mt-32">
            <p className="mb-10 font-lux-serif text-2xl font-light italic text-[#F5F3EE]/80 md:text-3xl">
              Visit a site, read the documents, then decide.
            </p>
            <div className="flex flex-col items-center justify-center gap-4 sm:flex-row">
              <Link href="/legal" className="group relative flex items-center gap-3 overflow-hidden bg-[#C5A059] px-10 py-5 text-[10px] font-semibold uppercase tracking-[0.3em] text-[#101615] transition-colors duration-500 hover:text-[#C5A059]">
                <span className="absolute inset-0 z-0 translate-y-full bg-[#F5F3EE] transition-transform duration-500 ease-[cubic-bezier(0.22,1,0.36,1)] group-hover:translate-y-0"></span>
                <span className="relative z-10">See Documents</span>
              </Link>
              <Link href="/contact" className="group relative flex items-center gap-3 overflow-hidden border border-[#F5F3EE]/30 bg-[#101615]/20 px-10 py-5 text-[10px] font-semibold uppercase tracking-[0.3em] text-[#F5F3EE] backdrop-blur-sm transition-colors duration-500 hover:border-[#C5A059] hover:text-[#101615]">
                <span className="absolute inset-0 z-0 translate-y-full bg-[#C5A059] transition-transform duration-500 ease-[cubic-bezier(0.22,1,0.36,1)] group-hover:translate-y-0"></span>
                <span className="relative z-10">Book a Site Visit</span>
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* ============================================================
          6. AFFILIATIONS
          ============================================================ */}
      <section id="section-affiliations" className="relative w-full overflow-hidden bg-[#F5F3EE] px-5 py-20 text-[#101615] sm:px-6 md:px-12 md:py-32 lg:px-24">
        <div className="mx-auto max-w-[1400px]">
          <div className="mb-16 max-w-xl">
            <div className="anim-fade mb-8 flex items-center gap-4">
              <span className="anim-line-draw block h-[1.5px] w-12 bg-[#C5A059]"></span>
              <span className="text-[10px] font-medium uppercase tracking-[0.4em] text-[#C5A059]">Affiliations</span>
            </div>
            <h2 className="font-lux-serif text-[clamp(2.5rem,5vw,4rem)] leading-[1.05] tracking-[-0.02em] mb-8">
              <span className="block overflow-hidden pb-2"><span className="anim-headline block font-light">Our affiliations</span></span>
              <span className="block overflow-hidden pb-2"><span className="anim-headline block font-normal italic text-[#C5A059]">and recognition</span></span>
            </h2>
            <p className="anim-fade text-sm font-light leading-relaxed text-[#101615]/70 sm:text-base md:text-lg">
              Memberships and associations that hold us to professional standards.
            </p>
          </div>

          <div className="grid grid-cols-2 gap-4 border-t border-[#101615]/10 pt-12 md:grid-cols-4 md:gap-8">
            {affiliations.map((logo, i) => (
              <div key={i} className="anim-fade group relative flex h-28 flex-col items-center justify-center border border-[#101615]/10 p-4 text-center transition-all duration-300 hover:border-[#C5A059] hover:shadow-[0_8px_30px_-12px_rgba(197,160,89,0.2)]">
                <span className="font-lux-serif text-2xl font-light text-[#101615]/80 transition-colors group-hover:text-[#C5A059]">{logo}</span>
                <span className="mt-2 text-[9px] uppercase tracking-[0.2em] text-[#101615]/40">Member since [Year]</span>
                <span className="absolute right-2 top-2 text-[9px] uppercase tracking-[0.2em] text-[#101615]/20">0{i + 1}</span>
              </div>
            ))}
          </div>

          <div className="anim-fade mt-16 grid grid-cols-1 gap-8 md:mt-20 md:grid-cols-3">
            {awards.map((a, i) => (
              <div key={i} className="group relative border-l border-[#C5A059] pl-4">
                <span className="absolute -left-1 top-0 h-2 w-2 rounded-full bg-[#C5A059] opacity-0 transition-opacity duration-500 group-hover:opacity-100"></span>
                <p className="mb-1 text-[10px] uppercase tracking-[0.3em] text-[#C5A059]">{a.year}</p>
                <h4 className="mb-1 font-lux-serif text-lg font-light">{a.award}</h4>
                <p className="text-xs font-light text-[#101615]/50">{a.org}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ============================================================
          7. CONCERNS & MOTHER COMPANY — Editorial directory with images
          ============================================================ */}
      <section id="section-concerns" className="relative w-full overflow-hidden bg-[#101615] px-5 py-20 text-[#F5F3EE] sm:px-6 md:px-12 md:py-32 lg:px-24">
        {/* Kinetic ghost text */}
        <div className="pointer-events-none absolute left-0 top-1/2 w-full -translate-y-1/2 overflow-hidden whitespace-nowrap opacity-[0.04]">
          <span className="font-lux-serif pr-8 text-[18vw] leading-none text-[#F5F3EE]">SAMPAN GROUP</span>
        </div>

        {/* Ambient gold halo */}
        <div className="pointer-events-none absolute inset-0 opacity-60">
          <div className="absolute left-1/2 top-1/3 h-[600px] w-[600px] -translate-x-1/2 -translate-y-1/2 rounded-full bg-[radial-gradient(circle,_rgba(197,160,89,0.06)_0%,_transparent_70%)] blur-3xl"></div>
        </div>

        <div className="relative mx-auto max-w-[1400px]">
          {/* Header — Sticky narrative */}
          <div className="mb-16 grid grid-cols-1 gap-8 md:grid-cols-12 md:gap-12 lg:mb-20">
            <div className="md:col-span-7">
              <div className="anim-fade mb-8 flex items-center gap-4">
                <span className="anim-line-draw block h-[1.5px] w-12 bg-[#C5A059]"></span>
                <span className="text-[10px] font-medium uppercase tracking-[0.4em] text-[#C5A059] md:text-[11px]">Mother Company</span>
              </div>
              <h2 className="font-lux-serif text-[clamp(2.5rem,5vw,4rem)] leading-[1.05] tracking-[-0.02em] mb-8">
                <span className="block overflow-hidden pb-2"><span className="anim-headline block font-light">Part of</span></span>
                <span className="block overflow-hidden pb-2"><span className="anim-headline block font-normal italic text-[#C5A059]">Sampan Group</span></span>
              </h2>
              <p className="anim-fade max-w-xl text-sm font-light leading-relaxed text-[#F5F3EE]/70 sm:text-base md:text-lg">
                Sampan Development Ltd sits inside Sampan Group. The group's concerns span hospitality, leisure, education, retail, manufacturing and energy — every project we build sits next to an operating business, not an empty promise.
              </p>
            </div>

            <div className="anim-fade flex flex-col items-start justify-end md:col-span-5 md:items-end md:text-right">
              <div className="flex items-baseline gap-4">
                <span className="font-lux-serif text-5xl font-light italic text-[#C5A059] md:text-6xl">10</span>
                <span className="text-[10px] uppercase tracking-[0.3em] text-[#F5F3EE]/50">Concerns<br/>& Counting</span>
              </div>
              <a
                href="https://sampangroup.com.bd"
                target="_blank"
                rel="noopener noreferrer"
                className="group mt-6 inline-flex items-center gap-3 border border-[#F5F3EE]/30 px-6 py-3 text-[10px] font-semibold uppercase tracking-[0.3em] text-[#F5F3EE] transition-colors hover:border-[#C5A059] hover:text-[#C5A059] sm:px-8 sm:py-4"
              >
                Visit Sampan Group
                <svg className="h-3 w-3 transition-transform duration-300 group-hover:translate-x-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" d="M14 5l7 7m0 0l-7 7m7-7H3"></path>
                </svg>
              </a>
            </div>
          </div>

          {/* Concerns Directory — Editorial grid with images + anchor links */}
          <div className="concerns-grid grid grid-cols-1 gap-3 border-t border-[#F5F3EE]/10 pt-8 sm:grid-cols-2 md:gap-4 lg:grid-cols-2">

            {concerns.map((concern, i) => {
              const indexLabel = (i + 1).toString().padStart(2, "0");
              return (
                <a
                  key={i}
                  href={concern.href}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="concern-card group relative flex overflow-hidden border border-[#F5F3EE]/10 transition-colors duration-500 hover:border-[#C5A059]/50"
                >
                  {/* Image — left side, fixed aspect */}
                  <div className="relative h-32 w-32 flex-shrink-0 overflow-hidden sm:h-40 sm:w-40 md:h-44 md:w-44">
                    <img
                      src={concern.img}
                      alt={concern.name}
                      className="h-full w-full object-cover grayscale-[35%] transition-all duration-700 ease-[cubic-bezier(0.19,1,0.22,1)] group-hover:scale-110 group-hover:grayscale-0"
                    />
                    {/* Dark gradient overlay for text legibility */}
                    <div className="absolute inset-0 bg-gradient-to-t from-[#101615]/60 via-transparent to-transparent"></div>

                    {/* Top-left number index */}
                    <div className="absolute left-3 top-3 z-10 flex items-center gap-2">
                      <span className="h-px w-4 bg-[#C5A059]"></span>
                      <span className="text-[10px] uppercase tracking-[0.2em] text-[#F5F3EE]">{indexLabel}</span>
                    </div>

                    {/* Corner accent */}
                    <div className="absolute bottom-0 right-0 h-5 w-5 border-b border-r border-[#C5A059]/40"></div>
                  </div>

                  {/* Content — right side */}
                  <div className="relative flex flex-1 flex-col justify-between p-5 sm:p-6">
                    {/* Sliding gold background */}
                    <span className="absolute inset-0 -translate-x-full bg-gradient-to-r from-[#C5A059]/8 to-transparent transition-transform duration-700 ease-[cubic-bezier(0.22,1,0.36,1)] group-hover:translate-x-0"></span>

                    {/* Top: tag + location */}
                    <div className="relative z-10 mb-3 flex items-center gap-3 text-[9px] uppercase tracking-[0.25em] text-[#F5F3EE]/40">
                      <span className="text-[#C5A059]">{concern.tag}</span>
                      <span className="h-px w-3 bg-[#F5F3EE]/20"></span>
                      <span className="hidden sm:inline">{concern.location}</span>
                    </div>

                    {/* Name */}
                    <h3 className="relative z-10 font-lux-serif text-xl font-light leading-tight text-[#F5F3EE] transition-colors duration-300 group-hover:text-[#C5A059] sm:text-2xl md:text-3xl">
                      {concern.name}
                    </h3>

                    {/* Caption */}
                    <p className="relative z-10 mt-3 text-xs font-light leading-relaxed text-[#F5F3EE]/50 sm:text-sm">
                      {concern.caption}
                    </p>

                    {/* Bottom: gold rule that extends on hover + arrow */}
                    <div className="relative z-10 mt-4 flex items-center justify-between">
                      <span className="block h-px w-8 origin-left bg-[#C5A059] transition-all duration-500 ease-[cubic-bezier(0.22,1,0.36,1)] group-hover:w-16"></span>
                      <span className="flex items-center gap-2 text-[9px] uppercase tracking-[0.3em] text-[#F5F3EE]/40 transition-colors duration-300 group-hover:text-[#C5A059]">
                        Visit
                        <svg className="h-3 w-3 transition-transform duration-300 group-hover:translate-x-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" d="M14 5l7 7m0 0l-7 7m7-7H3"></path>
                        </svg>
                      </span>
                    </div>
                  </div>
                </a>
              );
            })}

            {/* "+ more" card — fills the last cell */}
            <a
              href="https://sampangroup.com.bd"
              target="_blank"
              rel="noopener noreferrer"
              className="concern-card group relative flex items-center justify-center overflow-hidden border border-dashed border-[#F5F3EE]/15 p-8 transition-colors duration-500 hover:border-[#C5A059]/40"
            >
              <div className="text-center">
                <span className="block font-lux-serif text-3xl font-light italic text-[#C5A059]/70 transition-colors duration-300 group-hover:text-[#C5A059] sm:text-4xl">
                  + more
                </span>
                <span className="mt-2 block text-[10px] uppercase tracking-[0.3em] text-[#F5F3EE]/40">
                  concerns in the network
                </span>
              </div>
            </a>
          </div>

          {/* Footer note */}
          <div className="anim-fade mt-12 flex flex-col items-start justify-between gap-4 border-t border-[#F5F3EE]/10 pt-8 text-[10px] uppercase tracking-[0.3em] text-[#F5F3EE]/40 sm:flex-row sm:items-center">
            <span>Every concern opens in a new tab on Sampan Group.</span>
            <span className="hidden sm:inline">Mother Company · Sampan Group</span>
          </div>
        </div>
      </section>

      {/* ============================================================
          8. CLOSING CTA
          ============================================================ */}
      <section id="section-cta" className="relative w-full overflow-hidden bg-[#17211D] px-5 py-24 text-center text-[#F5F3EE] sm:px-6 md:px-12 md:py-48 lg:px-24">
        <div className="absolute inset-0 z-0 opacity-20" style={{ background: "radial-gradient(circle at 50% 50%, rgba(197, 160, 89, 0.3) 0%, transparent 60%)" }} />

        <div className="pointer-events-none absolute left-0 top-1/2 w-full -translate-y-1/2 overflow-hidden whitespace-nowrap opacity-[0.03]">
          <span className="font-lux-serif pr-8 text-[20vw] leading-none text-[#F5F3EE]">VISIT</span>
        </div>

        <div className="relative z-10 mx-auto max-w-3xl">
          <div className="anim-fade mb-8 flex items-center justify-center gap-4">
            <span className="block h-[1.5px] w-12 bg-[#C5A059]"></span>
            <span className="text-[10px] font-medium uppercase tracking-[0.4em] text-[#C5A059]">Closing</span>
          </div>

          <h2 className="font-lux-serif text-[clamp(3rem,7vw,6rem)] leading-[0.95] tracking-[-0.02em] mb-10">
            <span className="block overflow-hidden pb-2"><span className="anim-headline block font-light">See it for</span></span>
            <span className="block overflow-hidden pb-2"><span className="anim-headline block font-normal italic text-[#C5A059]">yourself.</span></span>
          </h2>

          <p className="anim-fade mx-auto mb-12 max-w-xl text-sm font-light leading-relaxed text-[#F5F3EE]/70 sm:text-base md:text-lg">
            Tell us which project and when. Our team will confirm by phone or WhatsApp and arrange the visit.
          </p>

          <div className="anim-fade flex flex-col items-center justify-center gap-4 sm:flex-row">
            <Link href="/contact" className="group relative flex items-center gap-3 overflow-hidden bg-[#C5A059] px-12 py-5 text-[10px] font-semibold uppercase tracking-[0.3em] text-[#17211D] transition-colors duration-500 hover:text-[#C5A059]">
              <span className="absolute inset-0 z-0 translate-y-full bg-[#F5F3EE] transition-transform duration-500 ease-[cubic-bezier(0.22,1,0.36,1)] group-hover:translate-y-0"></span>
              <span className="relative z-10">Book a Site Visit</span>
            </Link>
            <a href="https://wa.me/8801000000000" target="_blank" rel="noopener noreferrer" className="group relative flex items-center gap-3 overflow-hidden border border-[#F5F3EE]/30 bg-[#17211D]/20 px-12 py-5 text-[10px] font-semibold uppercase tracking-[0.3em] text-[#F5F3EE] backdrop-blur-sm transition-colors duration-500 hover:border-[#25D366] hover:text-[#17211D]">
              <span className="absolute inset-0 z-0 translate-y-full bg-[#25D366] transition-transform duration-500 ease-[cubic-bezier(0.22,1,0.36,1)] group-hover:translate-y-0"></span>
              <span className="relative z-10 flex items-center gap-3">
                <svg className="h-4 w-4" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51l-.57-.01c-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z" />
                </svg>
                Chat on WhatsApp
              </span>
            </a>
          </div>
        </div>
      </section>

      {/* ============================================================
          Global Styles
          ============================================================ */}
      <style jsx global>{`
        @import url('https://fonts.googleapis.com/css2?family=Cormorant+Garamond:ital,wght@0,300;0,400;0,500;0,600;1,300;1,400;1,500&family=Inter:wght@300;400;500;600&display=swap');

        .font-lux-serif { font-family: 'Cormorant Garamond', serif; }
        .font-lux-sans { font-family: 'Inter', sans-serif; }

        @keyframes scrollCue {
          0%   { transform: scaleY(0); transform-origin: top; }
          50%  { transform: scaleY(1); transform-origin: top; }
          51%  { transform: scaleY(1); transform-origin: bottom; }
          100% { transform: scaleY(0); transform-origin: bottom; }
        }
      `}</style>
    </main>
  );
}