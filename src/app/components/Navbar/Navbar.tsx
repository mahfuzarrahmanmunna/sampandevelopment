// app/components/Navbar.tsx
"use client";

import Link from "next/link";
import Image from "next/image";
import { useState, useEffect, useRef } from "react";
import { usePathname } from "next/navigation";

// Data structure for projects — preserved exactly
const projectData = {
  ongoing: [
    { name: "Sampan Metro Square", slug: "sampan-metro-square", desc: "Ashulia · Land share", type: "Residential" },
    { name: "Sampan Condominium", slug: "sampan-condominium", desc: "Highway · G+9", type: "Serviced Living" },
    { name: "Express Highway Inn", slug: "express-highway-inn", desc: "Highway · Commercial", type: "Hospitality" },
    { name: "Sampan Trade Emporium", slug: "sampan-trade-emporium", desc: "Highway · B+LG+G+11", type: "Mixed-Use" },
    { name: "Sampan Agro & Golf Resort", slug: "sampan-agro-golf-resort", desc: "Outskirts · Leisure", type: "Resort" },
  ],
  completed: [
    { name: "Sampan 21st Century", desc: "Beside University", type: "Residence" },
    { name: "Sampan Taj", desc: "Premium Residence", type: "Residence" },
    { name: "SampanNiketon", desc: "Beside University", type: "Residence" },
    { name: "Sampan White House", desc: "Luxury Living", type: "Residence" },
    { name: "Sampan Highway Inn", desc: "Hospitality", type: "Hospitality" },
    { name: "Sampan Eco & Agro Resort", desc: "Sustainable Living", type: "Resort" },
  ],
};

export default function Navbar() {
  const [isScrolled, setIsScrolled] = useState(false);
  const [isProjectsOpen, setIsProjectsOpen] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [mobileAccordion, setMobileAccordion] = useState<string | null>(null);
  const pathname = usePathname();
  const mobileMenuRef = useRef<HTMLDivElement>(null);

  // Scroll listener
  useEffect(() => {
    const handleScroll = () => setIsScrolled(window.scrollY > 40);
    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  // Close on route change
  useEffect(() => {
    setIsMobileMenuOpen(false);
    setIsProjectsOpen(false);
    setMobileAccordion(null);
  }, [pathname]);

  // Body scroll lock
  useEffect(() => {
    document.body.style.overflow = isMobileMenuOpen ? "hidden" : "";
    return () => {
      document.body.style.overflow = "";
    };
  }, [isMobileMenuOpen]);

  // Escape key
  useEffect(() => {
    const handleEscape = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        setIsProjectsOpen(false);
        setIsMobileMenuOpen(false);
      }
    };
    window.addEventListener("keydown", handleEscape);
    return () => window.removeEventListener("keydown", handleEscape);
  }, []);

  // Determine if header should use dark text (light bg) or light text (transparent/dark bg)
  const useDarkText = isScrolled || isMobileMenuOpen;

  const headerClasses = `fixed top-0 left-0 w-full z-50 transition-all duration-500 ease-[cubic-bezier(0.22,1,0.36,1)] ${
    isMobileMenuOpen
      ? "bg-[#171715] text-[#F4F1EA] border-b border-[rgba(244,241,234,0.08)]"
      : isScrolled
      ? "bg-[#171715]/95 backdrop-blur-xl text-[#F4F1EA] border-b border-[rgba(244,241,234,0.08)] shadow-[0_8px_32px_-12px_rgba(0,0,0,0.4)]"
      : "bg-transparent text-[#F4F1EA] border-b border-transparent"
  }`;

  const getLinkClass = (path: string, isExact = true) => {
    const isActive = isExact ? pathname === path : pathname.includes(path);
    return `relative text-[11px] font-medium uppercase tracking-[0.28em] transition-colors duration-300 flex items-center h-full group py-2 ${
      isActive ? "text-[#C5A059]" : "text-[#F4F1EA]/80 hover:text-[#C5A059]"
    }`;
  };

  return (
    <header className={headerClasses}>
      {/* ─── Top Utility Bar (hidden when scrolled or mobile menu open) ─── */}
      <div
        className={`hidden lg:block border-b border-[rgba(244,241,234,0.06)] transition-all duration-500 overflow-hidden ${
          isScrolled || isMobileMenuOpen ? "h-0 opacity-0" : "h-10 opacity-100"
        }`}
      >
        <div className="max-w-[1440px] mx-auto px-12 h-full flex items-center justify-between text-[9px] uppercase tracking-[0.3em] text-[#F4F1EA]/50">
          <div className="flex items-center gap-8">
            <span className="flex items-center gap-2">
              <svg className="w-3 h-3 text-[#C5A059]" fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden="true">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
              </svg>
              Dhaka — Chittagong Highway
            </span>
            <span className="flex items-center gap-2">
              <svg className="w-3 h-3 text-[#C5A059]" fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden="true">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
              </svg>
              +880 1000-000000
            </span>
          </div>
          <div className="flex items-center gap-6">
            <span className="text-[#C5A059]/80">Clear Title Documents</span>
            <span className="h-3 w-px bg-[rgba(244,241,234,0.15)]" />
            <span>Site Visits on Request</span>
            <span className="h-3 w-px bg-[rgba(244,241,234,0.15)]" />
            <span>Backed by Sampan Group</span>
          </div>
        </div>
      </div>

      {/* ─── Main Nav Bar ─── */}
      <nav className="max-w-[1440px] mx-auto px-6 lg:px-12 h-20">
        <div className="flex items-center justify-between h-full">
          {/* Logo */}
          <div className="flex-shrink-0 z-50">
            <Link href="/" className="flex items-center gap-3 group" aria-label="Sampan Development Ltd. — Home">
              <div className="relative">
                <Image
                  src="/logo/logo.png"
                  alt="Sampan Development Limited Logo"
                  width={160}
                  height={40}
                  priority
                  className="h-auto w-auto object-contain transition-all duration-500 group-hover:opacity-85"
                />
                {/* Subtle gold underline that extends on hover */}
                <span className="absolute -bottom-1 left-0 h-px w-0 bg-[#C5A059] transition-all duration-500 ease-[cubic-bezier(0.22,1,0.36,1)] group-hover:w-full" />
              </div>
            </Link>
          </div>

          {/* Desktop Menu */}
          <ul className="hidden lg:flex items-center gap-10 h-full">
            <li className="flex items-center h-full">
              <Link href="/" className={getLinkClass("/")}>
                Home
                <span className={`absolute bottom-0 left-0 w-full h-px bg-[#C5A059] origin-left transition-transform duration-300 ${pathname === "/" ? "scale-x-100" : "scale-x-0 group-hover:scale-x-100"}`} />
              </Link>
            </li>
            <li className="flex items-center h-full">
              <Link href="/about-us" className={getLinkClass("/about-us")}>
                About
                <span className={`absolute bottom-0 left-0 w-full h-px bg-[#C5A059] origin-left transition-transform duration-300 ${pathname === "/about-us" ? "scale-x-100" : "scale-x-0 group-hover:scale-x-100"}`} />
              </Link>
            </li>

            {/* Mega Menu Trigger */}
            <li
              className="relative h-full flex items-center"
              onMouseEnter={() => setIsProjectsOpen(true)}
              onMouseLeave={() => setIsProjectsOpen(false)}
            >
              <button
                className={`${getLinkClass("/projects", false)} gap-1.5`}
                onClick={() => setIsProjectsOpen(!isProjectsOpen)}
                aria-expanded={isProjectsOpen}
                aria-controls="projects-mega-menu"
              >
                Projects
                <svg className={`w-3 h-3 transition-transform duration-300 ${isProjectsOpen ? "rotate-180 text-[#C5A059]" : ""}`} fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden="true">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" d="M19 9l-7 7-7-7" />
                </svg>
                <span className={`absolute bottom-0 left-0 w-full h-px bg-[#C5A059] origin-left transition-transform duration-300 ${pathname.includes("/projects") ? "scale-x-100" : "scale-x-0 group-hover:scale-x-100"}`} />
              </button>

              {/* Mega Menu — refined with soft-dark palette */}
              <div
                id="projects-mega-menu"
                className={`absolute top-full left-1/2 -translate-x-1/2 w-[940px] pt-4 transition-all duration-400 ease-[cubic-bezier(0.22,1,0.36,1)] origin-top ${
                  isProjectsOpen ? "opacity-100 visible translate-y-0 scale-100" : "opacity-0 invisible -translate-y-4 scale-[0.98] pointer-events-none"
                }`}
              >
                <div className="bg-[#1D1D1A] border border-[rgba(244,241,234,0.10)] shadow-[0_30px_80px_-20px_rgba(0,0,0,0.6)] overflow-hidden grid grid-cols-[1fr_1.1fr_1.1fr]">
                  {/* Area A: Featured Project — elevated surface */}
                  <div className="relative bg-[#24241F] text-[#F4F1EA] p-8 flex flex-col justify-between overflow-hidden">
                    {/* Subtle gold radial */}
                    <div className="pointer-events-none absolute -top-12 -right-12 h-48 w-48 rounded-full bg-[radial-gradient(circle,_rgba(197,160,89,0.18)_0%,_transparent_70%)] blur-2xl" />
                    <div className="relative">
                      <div className="flex items-center gap-3 mb-5">
                        <span className="h-px w-8 bg-[#C5A059]" />
                        <span className="text-[9px] font-bold uppercase tracking-[0.3em] text-[#C5A059]">Featured</span>
                      </div>
                      <h3 className="font-lux-serif text-3xl leading-[0.95] tracking-[-0.02em] font-light text-[#F4F1EA]">
                        Sampan Agro
                        <br />
                        <span className="italic text-[#C5A059]">&amp; Golf Resort</span>
                      </h3>
                      <p className="text-xs text-[#B5B1A8] mt-4 font-light leading-relaxed">
                        Sustainable luxury living nestled in nature — leisure, agriculture, and resort hospitality in one destination.
                      </p>
                    </div>
                    <Link
                      href="/projects/ongoing/sampan-agro-golf-resort"
                      className="relative mt-8 inline-flex items-center gap-3 text-[10px] font-semibold uppercase tracking-[0.3em] text-[#C5A059] group/link w-fit"
                    >
                      Discover
                      <span className="relative w-10 h-px bg-[#C5A059]/40 overflow-hidden">
                        <span className="absolute inset-0 bg-[#C5A059] -translate-x-full group-hover/link:translate-x-0 transition-transform duration-500 ease-[cubic-bezier(0.22,1,0.36,1)]" />
                      </span>
                      <svg className="w-3.5 h-3.5 transition-transform duration-300 group-hover/link:translate-x-1" fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden="true">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" d="M14 5l7 7m0 0l-7 7m7-7H3" />
                      </svg>
                    </Link>
                    {/* Corner accent */}
                    <div className="absolute bottom-0 right-0 h-6 w-6 border-b border-r border-[#C5A059]/40" />
                  </div>

                  {/* Area B: Ongoing */}
                  <div className="p-7 border-r border-[rgba(244,241,234,0.08)]">
                    <div className="flex items-center justify-between mb-5 pb-3 border-b border-[rgba(244,241,234,0.08)]">
                      <h3 className="text-[9px] font-bold uppercase tracking-[0.3em] text-[#C5A059]">Ongoing</h3>
                      <span className="text-[9px] uppercase tracking-[0.2em] text-[#89867E]">{projectData.ongoing.length} Projects</span>
                    </div>
                    <div className="space-y-1">
                      {projectData.ongoing.map((project) => (
                        <Link
                          key={project.name}
                          href={`/projects/ongoing/${project.slug}`}
                          className="block group p-2 -m-2 transition-colors duration-200 hover:bg-[#24241F] rounded-[2px]"
                        >
                          <div className="flex items-center justify-between gap-3">
                            <div className="flex-1 min-w-0">
                              <div className="text-sm font-medium text-[#F4F1EA] group-hover:text-[#C5A059] transition-colors duration-200 truncate">
                                {project.name}
                              </div>
                              <div className="flex items-center gap-2 mt-0.5">
                                <span className="text-[9px] uppercase tracking-[0.2em] text-[#89867E]">{project.type}</span>
                                <span className="text-[9px] text-[#89867E]/60">·</span>
                                <span className="text-[10px] text-[#B5B1A8]/70 font-light">{project.desc}</span>
                              </div>
                            </div>
                            <svg className="w-3 h-3 flex-shrink-0 text-[#C5A059] opacity-0 -translate-x-1 group-hover:opacity-100 group-hover:translate-x-0 transition-all duration-300" fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden="true">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" d="M14 5l7 7m0 0l-7 7m7-7H3" />
                            </svg>
                          </div>
                        </Link>
                      ))}
                    </div>
                  </div>

                  {/* Area C: Completed */}
                  <div className="p-7 bg-[#171715]/60">
                    <div className="flex items-center justify-between mb-5 pb-3 border-b border-[rgba(244,241,234,0.08)]">
                      <h3 className="text-[9px] font-bold uppercase tracking-[0.3em] text-[#C5A059]">Completed</h3>
                      <span className="text-[9px] uppercase tracking-[0.2em] text-[#89867E]">{projectData.completed.length} Projects</span>
                    </div>
                    <div className="space-y-1">
                      {projectData.completed.map((project) => (
                        <Link
                          key={project.name}
                          href={`/projects/completed/${project.name.toLowerCase().replace(/\s+/g, '-')}`}
                          className="block group p-2 -m-2 transition-colors duration-200 hover:bg-[#24241F] rounded-[2px]"
                        >
                          <div className="flex items-center justify-between gap-3">
                            <div className="flex-1 min-w-0">
                              <div className="text-sm font-medium text-[#F4F1EA] group-hover:text-[#C5A059] transition-colors duration-200 truncate">
                                {project.name}
                              </div>
                              <div className="flex items-center gap-2 mt-0.5">
                                <span className="text-[9px] uppercase tracking-[0.2em] text-[#89867E]">{project.type}</span>
                                <span className="text-[9px] text-[#89867E]/60">·</span>
                                <span className="text-[10px] text-[#B5B1A8]/70 font-light">{project.desc}</span>
                              </div>
                            </div>
                            <svg className="w-3 h-3 flex-shrink-0 text-[#C5A059] opacity-0 -translate-x-1 group-hover:opacity-100 group-hover:translate-x-0 transition-all duration-300" fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden="true">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" d="M14 5l7 7m0 0l-7 7m7-7H3" />
                            </svg>
                          </div>
                        </Link>
                      ))}
                    </div>
                  </div>
                </div>

                {/* Mega Menu Footer */}
                <div className="bg-[#171715] px-8 py-4 border-t border-[rgba(244,241,234,0.08)] flex items-center justify-between">
                  <span className="text-[9px] uppercase tracking-[0.3em] text-[#89867E]">
                    Every project starts with documented ownership
                  </span>
                  <Link href="/projects" className="text-[10px] font-semibold uppercase tracking-[0.3em] text-[#F4F1EA] hover:text-[#C5A059] transition-colors duration-300 flex items-center gap-2 group">
                    View All Projects
                    <svg className="w-3.5 h-3.5 transition-transform duration-300 group-hover:translate-x-1" fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden="true">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" d="M14 5l7 7m0 0l-7 7m7-7H3" />
                    </svg>
                  </Link>
                </div>
              </div>
            </li>

            <li className="flex items-center h-full">
              <Link href="/investment" className={getLinkClass("/investment")}>
                Investment
                <span className={`absolute bottom-0 left-0 w-full h-px bg-[#C5A059] origin-left transition-transform duration-300 ${pathname === "/investment" ? "scale-x-100" : "scale-x-0 group-hover:scale-x-100"}`} />
              </Link>
            </li>
            <li className="flex items-center h-full">
              <a href="https://www.sampangroup.com.bd/" target="_blank" rel="noopener noreferrer" className={getLinkClass("/sampan-group")}>
                Sampan Group
                <span className={`absolute bottom-0 left-0 w-full h-px bg-[#C5A059] origin-left transition-transform duration-300 ${pathname === "/sampan-group" ? "scale-x-100" : "scale-x-0 group-hover:scale-x-100"}`} />
              </a>
            </li>
          </ul>

          {/* CTA + Mobile Toggle */}
          <div className="flex items-center gap-5">
            <Link
              href="/contact"
              className={`hidden md:inline-flex items-center gap-3 text-[10px] font-semibold uppercase tracking-[0.28em] px-6 py-3.5 transition-all duration-500 group relative overflow-hidden border ${
                useDarkText
                  ? "bg-[#C5A059] text-[#171715] border-[#C5A059] hover:text-[#C5A059]"
                  : "bg-transparent text-[#F4F1EA] border-[#F4F1EA]/30 hover:text-[#171715]"
              }`}
            >
              {/* Hover fill — slides up from bottom */}
              <span className={`absolute inset-0 translate-y-full transition-transform duration-500 ease-[cubic-bezier(0.22,1,0.36,1)] z-0 ${
                useDarkText ? "bg-[#F4F1EA]" : "bg-[#F4F1EA]"
              } group-hover:translate-y-0`} />
              <span className="relative z-10 flex items-center gap-2">
                Book Site Visit
                <svg className="w-3.5 h-3.5 transition-transform duration-300 group-hover:translate-x-1" fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden="true">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" d="M14 5l7 7m0 0l-7 7m7-7H3" />
                </svg>
              </span>
            </Link>

            {/* Mobile menu button — refined */}
            <button
              className="lg:hidden p-2 z-50 relative flex flex-col justify-center items-center w-8 h-8"
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
              aria-label="Toggle menu"
              aria-expanded={isMobileMenuOpen}
            >
              <span className={`block h-px w-6 bg-current transition-all duration-300 ease-[cubic-bezier(0.22,1,0.36,1)] ${isMobileMenuOpen ? "rotate-45 translate-y-[1px]" : "-translate-y-[6px]"}`} />
              <span className={`block h-px w-6 bg-current transition-all duration-300 ${isMobileMenuOpen ? "opacity-0" : "opacity-100"}`} />
              <span className={`block h-px w-6 bg-current transition-all duration-300 ease-[cubic-bezier(0.22,1,0.36,1)] ${isMobileMenuOpen ? "-rotate-45 -translate-y-[1px]" : "translate-y-[6px]"}`} />
            </button>
          </div>
        </div>
      </nav>

      {/* ═══════════════════════════════════════════════════════════
          MOBILE MENU — Cinematic full-screen overlay
         ═══════════════════════════════════════════════════════════ */}
      <div
        ref={mobileMenuRef}
        className={`lg:hidden fixed inset-0 z-40 transition-all duration-700 ease-[cubic-bezier(0.22,1,0.36,1)] ${
          isMobileMenuOpen ? "opacity-100 visible" : "opacity-0 invisible pointer-events-none"
        }`}
      >
        {/* Background with subtle gradient layers */}
        <div className="absolute inset-0 bg-[#171715]" />
        <div className="pointer-events-none absolute inset-0">
          <div className="absolute top-0 left-1/2 h-[500px] w-[700px] -translate-x-1/2 -translate-y-1/3 rounded-full bg-[radial-gradient(ellipse_at_center,_rgba(197,160,89,0.10)_0%,_transparent_60%)] blur-3xl" />
          <div className="absolute bottom-0 right-0 h-[400px] w-[500px] translate-x-1/3 translate-y-1/3 rounded-full bg-[radial-gradient(circle,_rgba(197,160,89,0.06)_0%,_transparent_70%)] blur-3xl" />
        </div>
        {/* Architectural corner brackets */}
        <div className="pointer-events-none absolute left-5 top-24 h-8 w-8 border-l border-t border-[#C5A059]/30" />
        <div className="pointer-events-none absolute right-5 top-24 h-8 w-8 border-r border-t border-[#C5A059]/30" />
        <div className="pointer-events-none absolute bottom-5 left-5 h-8 w-8 border-b border-l border-[#C5A059]/30" />
        <div className="pointer-events-none absolute bottom-5 right-5 h-8 w-8 border-b border-r border-[#C5A059]/30" />

        <div className="relative h-full flex flex-col pt-24 pb-8 px-6 overflow-y-auto">
          {/* Micro brand label */}
          <div className={`flex items-center gap-3 mb-10 transition-all duration-500 delay-200 ${isMobileMenuOpen ? "opacity-100 translate-y-0" : "opacity-0 translate-y-3"}`}>
            <span className="h-px w-8 bg-[#C5A059]" />
            <span className="text-[9px] uppercase tracking-[0.3em] text-[#89867E]">Sampan Development Ltd.</span>
          </div>

          <nav className="flex flex-col flex-grow">
            {/* Staggered link reveal — uses CSS transition with delay */}
            {[
              { href: "/", label: "Home", delay: "delay-[100ms]" },
              { href: "/about-us", label: "About", delay: "delay-[180ms]" },
            ].map((item) => (
              <Link
                key={item.href}
                href={item.href}
                className={`group flex items-center justify-between font-lux-serif text-3xl font-light text-[#F4F1EA] py-4 border-b border-[rgba(244,241,234,0.08)] transition-all duration-500 hover:text-[#C5A059] hover:pl-3 ${item.delay} ${isMobileMenuOpen ? "opacity-100 translate-y-0" : "opacity-0 translate-y-4"}`}
              >
                <span>{item.label}</span>
                <svg className="w-5 h-5 text-[#C5A059] opacity-0 -translate-x-2 group-hover:opacity-100 group-hover:translate-x-0 transition-all duration-300" fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden="true">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" d="M14 5l7 7m0 0l-7 7m7-7H3" />
                </svg>
              </Link>
            ))}

            {/* Projects accordion */}
            <div className={`border-b border-[rgba(244,241,234,0.08)] transition-all duration-500 delay-[260ms] ${isMobileMenuOpen ? "opacity-100 translate-y-0" : "opacity-0 translate-y-4"}`}>
              <button
                className="group flex items-center justify-between w-full py-4 font-lux-serif text-3xl font-light text-[#F4F1EA] hover:text-[#C5A059] transition-all duration-300 text-left hover:pl-3"
                onClick={() => setMobileAccordion(mobileAccordion === "projects" ? null : "projects")}
                aria-expanded={mobileAccordion === "projects"}
              >
                <span>Projects</span>
                <svg className={`w-5 h-5 text-[#C5A059] transition-transform duration-300 ${mobileAccordion === "projects" ? "rotate-180" : ""}`} fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden="true">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1" d="M19 9l-7 7-7-7" />
                </svg>
              </button>

              <div className={`grid transition-all duration-500 ease-[cubic-bezier(0.22,1,0.36,1)] ${mobileAccordion === "projects" ? "grid-rows-[1fr] opacity-100" : "grid-rows-[0fr] opacity-0"}`}>
                <div className="overflow-hidden">
                  <div className="pl-3 pb-6 pt-2 space-y-6">
                    {/* Ongoing */}
                    <div>
                      <div className="flex items-center gap-3 mb-4">
                        <span className="h-px w-6 bg-[#C5A059]" />
                        <h4 className="text-[#C5A059] uppercase tracking-[0.3em] text-[9px] font-semibold">Ongoing</h4>
                      </div>
                      <div className="space-y-3 border-l border-[rgba(244,241,234,0.08)] pl-4">
                        {projectData.ongoing.map((p) => (
                          <Link
                            key={p.name}
                            href={`/projects/ongoing/${p.slug}`}
                            className="group block text-lg font-lux-serif text-[#B5B1A8] hover:text-[#C5A059] transition-colors duration-300"
                          >
                            <div className="flex items-baseline gap-2">
                              <span className="text-[#C5A059]/60 text-xs">—</span>
                              <span>{p.name}</span>
                            </div>
                            <div className="text-[9px] uppercase tracking-[0.2em] text-[#89867E] mt-0.5 ml-4">{p.type} · {p.desc}</div>
                          </Link>
                        ))}
                      </div>
                    </div>
                    {/* Completed */}
                    <div>
                      <div className="flex items-center gap-3 mb-4">
                        <span className="h-px w-6 bg-[#C5A059]" />
                        <h4 className="text-[#C5A059] uppercase tracking-[0.3em] text-[9px] font-semibold">Completed</h4>
                      </div>
                      <div className="space-y-3 border-l border-[rgba(244,241,234,0.08)] pl-4">
                        {projectData.completed.map((p) => (
                          <Link
                            key={p.name}
                            href={`/projects/completed/${p.name.toLowerCase().replace(/\s+/g, '-')}`}
                            className="group block text-lg font-lux-serif text-[#B5B1A8] hover:text-[#C5A059] transition-colors duration-300"
                          >
                            <div className="flex items-baseline gap-2">
                              <span className="text-[#C5A059]/60 text-xs">—</span>
                              <span>{p.name}</span>
                            </div>
                            <div className="text-[9px] uppercase tracking-[0.2em] text-[#89867E] mt-0.5 ml-4">{p.type} · {p.desc}</div>
                          </Link>
                        ))}
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Remaining links */}
            {[
              { href: "/investment", label: "Investment", delay: "delay-[340ms]" },
              { href: "https://www.sampangroup.com.bd/", label: "Sampan Group", external: true, delay: "delay-[420ms]" },
              { href: "/contact", label: "Contact", delay: "delay-[500ms]" },
            ].map((item) => (
              <Link
                key={item.label}
                href={item.href}
                target={item.external ? "_blank" : undefined}
                rel={item.external ? "noopener noreferrer" : undefined}
                className={`group flex items-center justify-between font-lux-serif text-3xl font-light text-[#F4F1EA] py-4 border-b border-[rgba(244,241,234,0.08)] transition-all duration-500 hover:text-[#C5A059] hover:pl-3 ${item.delay} ${isMobileMenuOpen ? "opacity-100 translate-y-0" : "opacity-0 translate-y-4"}`}
              >
                <span>{item.label}</span>
                <svg className="w-5 h-5 text-[#C5A059] opacity-0 -translate-x-2 group-hover:opacity-100 group-hover:translate-x-0 transition-all duration-300" fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden="true">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" d="M14 5l7 7m0 0l-7 7m7-7H3" />
                </svg>
              </Link>
            ))}
          </nav>

          {/* CTA */}
          <div className={`mt-10 transition-all duration-500 delay-[600ms] ${isMobileMenuOpen ? "opacity-100 translate-y-0" : "opacity-0 translate-y-4"}`}>
            <Link
              href="/contact"
              className="group relative flex items-center justify-center gap-3 overflow-hidden bg-[#C5A059] text-[#171715] text-[11px] font-semibold uppercase tracking-[0.3em] px-6 py-5 transition-colors duration-500 hover:text-[#C5A059] w-full"
            >
              <span className="absolute inset-0 bg-[#F4F1EA] translate-y-full group-hover:translate-y-0 transition-transform duration-500 ease-[cubic-bezier(0.22,1,0.36,1)] z-0" />
              <span className="relative z-10 flex items-center gap-3">
                Book Site Visit
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden="true">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" d="M14 5l7 7m0 0l-7 7m7-7H3" />
                </svg>
              </span>
            </Link>
          </div>

          {/* Bottom contact info */}
          <div className={`mt-10 pt-8 border-t border-[rgba(244,241,234,0.08)] grid grid-cols-2 gap-6 transition-all duration-500 delay-[700ms] ${isMobileMenuOpen ? "opacity-100 translate-y-0" : "opacity-0 translate-y-4"}`}>
            <div>
              <div className="text-[9px] uppercase tracking-[0.3em] text-[#89867E] mb-2">Visit Us</div>
              <div className="text-xs text-[#B5B1A8] font-light leading-relaxed">Dhaka — Chittagong Highway, Bangladesh</div>
            </div>
            <div>
              <div className="text-[9px] uppercase tracking-[0.3em] text-[#89867E] mb-2">Contact</div>
              <div className="text-xs text-[#B5B1A8] font-light leading-relaxed">+880 1000-000000<br />hello@sampan.com.bd</div>
            </div>
          </div>
        </div>
      </div>

      {/* Font imports for consistency */}
      <style jsx global>{`
        .font-lux-serif {
          font-family: 'Cormorant Garamond', serif;
        }
      `}</style>
    </header>
  );
}