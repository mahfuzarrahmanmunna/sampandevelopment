// app/components/Navbar.tsx
"use client";

import Link from "next/link";
import Image from "next/image";
import { useState, useEffect } from "react";
import { usePathname } from "next/navigation";

// Data structure for projects
const projectData = {
  ongoing: [
    { name: "Sampan Metro Square", desc: "Ashulia, land share" },
    { name: "Sampan Condominium", desc: "Highway, G+9" },
    { name: "Express Highway Inn", desc: "Commercial" },
    { name: "Sampan Trade Emporium", desc: "Highway, B+LG+G+11" },
    { name: "Sampan Agro & Golf Resort", desc: "Leisure & Resort" },
  ],
  completed: [
    { name: "Sampan 21st Century", desc: "Beside University" },
    { name: "Sampan Taj", desc: "Premium Residence" },
    { name: "SampanNiketon", desc: "Beside University" },
    { name: "Sampan White House", desc: "Luxury Living" },
    { name: "Sampan Highway Inn", desc: "Hospitality" },
    { name: "Sampan Eco & Agro Resort", desc: "Sustainable Living" },
  ],
};

export default function Navbar() {
  const [isScrolled, setIsScrolled] = useState(false);
  const [isProjectsOpen, setIsProjectsOpen] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [mobileAccordion, setMobileAccordion] = useState<string | null>(null);
  
  const pathname = usePathname();

  // Scroll listener for transparent to solid transition
  useEffect(() => {
    const handleScroll = () => {
      // Small threshold to prevent flicker
      setIsScrolled(window.scrollY > 40);
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  // Close mobile menu on route change
  useEffect(() => {
    setIsMobileMenuOpen(false);
    setIsProjectsOpen(false);
  }, [pathname]);

  // Body scroll lock for mobile menu
  useEffect(() => {
    if (isMobileMenuOpen) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "unset";
    }
    return () => {
      document.body.style.overflow = "unset";
    };
  }, [isMobileMenuOpen]);

  // Keyboard listener for Escape key
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

  // Dynamic header classes based on scroll state
  const headerClasses = `fixed top-0 left-0 w-full z-50 transition-all duration-500 ease-in-out border-b ${
    isMobileMenuOpen
      ? "bg-[#F8F7F3] text-[#101615] border-transparent h-20"
      : isScrolled
      ? "bg-[#F8F7F3]/95 backdrop-blur-xl text-[#101615] border-[#DCD2C1] h-20 shadow-sm"
      : "bg-transparent text-[#F8F7F3] border-transparent h-24"
  }`;

  // Helper for desktop link classes
  const getLinkClass = (path: string) => {
    const isActive = pathname === path;
    return `relative text-[11px] font-medium uppercase tracking-[0.25em] transition-colors duration-300 flex items-center h-full group py-2 ${
      isMobileMenuOpen || isScrolled
        ? `${isActive ? "text-[#C6A06B]" : "text-[#101615]/80 hover:text-[#C6A06B]"}`
        : `${isActive ? "text-[#C6A06B]" : "text-[#F8F7F3]/90 hover:text-[#C6A06B]"}`
    }`;
  };

  return (
    <header className={headerClasses}>
      <nav className="max-w-[1440px] mx-auto px-6 lg:px-12 h-full">
        <div className="flex items-center justify-between h-full">
          
          {/* Logo Section */}
          <div className="flex-shrink-0 z-50">
            <Link href="/" className="flex items-center gap-3 group">
              <Image 
                src="/logo/logo.png" 
                alt="Sampan Development Limited Logo" 
                width={160} 
                height={40} 
                priority
                className={`h-auto w-auto object-contain transition-all duration-500 group-hover:opacity-80 ${
                  !isScrolled && !isMobileMenuOpen ? "brightness-0 invert" : ""
                }`}
              />
            </Link>
          </div>

          {/* Desktop Menu */}
          <ul className="hidden lg:flex items-center gap-12 h-full">
            <li className="flex items-center h-full">
              <Link href="/" className={getLinkClass("/")}>
                Home
                <span className={`absolute bottom-0 left-0 w-full h-[1px] bg-[#C6A06B] origin-left transition-transform duration-300 ${pathname === "/" ? "scale-x-100" : "scale-x-0 group-hover:scale-x-100"}`}></span>
              </Link>
            </li>
            <li className="flex items-center h-full">
              <Link href="/about" className={getLinkClass("/about")}>
                About
                <span className={`absolute bottom-0 left-0 w-full h-[1px] bg-[#C6A06B] origin-left transition-transform duration-300 ${pathname === "/about" ? "scale-x-100" : "scale-x-0 group-hover:scale-x-100"}`}></span>
              </Link>
            </li>

            {/* Mega Menu Trigger: Projects */}
            <li 
              className="relative h-full flex items-center"
              onMouseEnter={() => setIsProjectsOpen(true)}
              onMouseLeave={() => setIsProjectsOpen(false)}
            >
              <button 
                className={`${getLinkClass("/projects")} gap-1.5`}
                onClick={() => setIsProjectsOpen(!isProjectsOpen)}
                aria-expanded={isProjectsOpen}
                aria-controls="projects-mega-menu"
              >
                Projects 
                <svg className={`w-3 h-3 transition-transform duration-300 ${isProjectsOpen ? 'rotate-180' : ''}`} fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" d="M19 9l-7 7-7-7"></path></svg>
                <span className={`absolute bottom-0 left-0 w-full h-[1px] bg-[#C6A06B] origin-left transition-transform duration-300 ${pathname.includes("/projects") ? "scale-x-100" : "scale-x-0 group-hover:scale-x-100"}`}></span>
              </button>

              {/* Mega Menu Dropdown - Hover Bridge Added via pt-4 */}
              <div 
                id="projects-mega-menu"
                className={`absolute top-full left-1/2 transform -translate-x-1/2 w-[900px] pt-4 transition-all duration-300 ease-out origin-top ${
                  isProjectsOpen ? 'opacity-100 visible translate-y-0 scale-100' : 'opacity-0 invisible -translate-y-4 scale-95 pointer-events-none'
                }`}
              >
                <div className="bg-[#F8F7F3] border border-[#DCD2C1] shadow-2xl overflow-hidden grid grid-cols-[1fr_1.2fr_1.2fr]">
                  
                  {/* Area A: Featured Project (Obsidian) */}
                  <div className="bg-[#101615] text-[#F8F7F3] p-8 flex flex-col justify-between">
                    <div>
                      <span className="text-[9px] font-bold uppercase tracking-[0.3em] text-[#C6A06B]">Featured Project</span>
                      <h3 className="font-lux-serif text-3xl mt-4 leading-tight text-[#F8F7F3]">Sampan Agro & Golf Resort</h3>
                      <p className="text-sm text-[#E9E0D2]/60 mt-2 font-light">Experience sustainable luxury living nestled in nature.</p>
                    </div>
                    <Link 
                      href="/projects/ongoing/sampan-agro-&-golf-resort" 
                      className="mt-6 inline-flex items-center gap-2 text-[10px] font-bold uppercase tracking-[0.25em] text-[#C6A06B] group"
                    >
                      Discover 
                      <svg className="w-4 h-4 group-hover:translate-x-1 transition-transform duration-300" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" d="M14 5l7 7m0 0l-7 7m7-7H3"></path></svg>
                    </Link>
                  </div>

                  {/* Area B: Ongoing Projects */}
                  <div className="p-8 border-r border-[#DCD2C1]">
                    <h3 className="text-[9px] font-bold uppercase tracking-[0.3em] text-[#C6A06B] mb-6 border-b border-[#DCD2C1] pb-3">
                      Ongoing Projects
                    </h3>
                    <div className="space-y-1">
                      {projectData.ongoing.map((project) => (
                        <Link 
                          key={project.name} 
                          href={`/projects/ongoing/${project.name.toLowerCase().replace(/\s+/g, '-')}`}
                          className="block group p-2 -m-2 rounded-sm hover:bg-[#E9E0D2]/40 transition-colors duration-200"
                        >
                          <div className="text-sm font-medium text-[#101616] group-hover:text-[#C6A06B] transition-colors flex items-center justify-between">
                            {project.name}
                            <svg className="w-3 h-3 opacity-0 group-hover:opacity-100 group-hover:translate-x-1 transition-all duration-200 text-[#C6A06B]" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" d="M14 5l7 7m0 0l-7 7m7-7H3"></path></svg>
                          </div>
                          <div className="text-[11px] text-[#101615]/50 mt-0.5 tracking-wide">
                            {project.desc}
                          </div>
                        </Link>
                      ))}
                    </div>
                  </div>
                  
                  {/* Area C: Completed Projects */}
                  <div className="p-8 bg-[#E9E0D2]/20">
                    <h3 className="text-[9px] font-bold uppercase tracking-[0.3em] text-[#C6A06B] mb-6 border-b border-[#DCD2C1] pb-3">
                      Completed Projects
                    </h3>
                    <div className="space-y-1">
                      {projectData.completed.map((project) => (
                        <Link 
                          key={project.name} 
                          href={`/projects/completed/${project.name.toLowerCase().replace(/\s+/g, '-')}`}
                          className="block group p-2 -m-2 rounded-sm hover:bg-[#E9E0D2]/40 transition-colors duration-200"
                        >
                          <div className="text-sm font-medium text-[#101616] group-hover:text-[#C6A06B] transition-colors flex items-center justify-between">
                            {project.name}
                            <svg className="w-3 h-3 opacity-0 group-hover:opacity-100 group-hover:translate-x-1 transition-all duration-200 text-[#C6A06B]" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" d="M14 5l7 7m0 0l-7 7m7-7H3"></path></svg>
                          </div>
                          <div className="text-[11px] text-[#101615]/50 mt-0.5 tracking-wide">
                            {project.desc}
                          </div>
                        </Link>
                      ))}
                    </div>
                  </div>
                </div>
                
                {/* Mega Menu Footer */}
                <div className="bg-[#F8F7F3] px-8 py-4 border-t border-[#DCD2C1] flex justify-end">
                  <Link href="/projects" className="text-[10px] font-bold uppercase tracking-[0.25em] text-[#101615] hover:text-[#C6A06B] transition-colors duration-300 flex items-center group">
                    View All Projects 
                    <svg className="w-4 h-4 ml-2 group-hover:translate-x-1 transition-transform duration-300" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" d="M14 5l7 7m0 0l-7 7m7-7H3"></path></svg>
                  </Link>
                </div>
              </div>
            </li>

            <li className="flex items-center h-full">
              <Link href="/investment" className={getLinkClass("/investment")}>
                Investment
                <span className={`absolute bottom-0 left-0 w-full h-[1px] bg-[#C6A06B] origin-left transition-transform duration-300 ${pathname === "/investment" ? "scale-x-100" : "scale-x-0 group-hover:scale-x-100"}`}></span>
              </Link>
            </li>
            <li className="flex items-center h-full">
              <Link href="/sampan-group" className={getLinkClass("/sampan-group")}>
                Sampan Group
                <span className={`absolute bottom-0 left-0 w-full h-[1px] bg-[#C6A06B] origin-left transition-transform duration-300 ${pathname === "/sampan-group" ? "scale-x-100" : "scale-x-0 group-hover:scale-x-100"}`}></span>
              </Link>
            </li>
          </ul>

          {/* CTA Button & Mobile Toggle */}
          <div className="flex items-center gap-6">
            <Link 
              href="/contact" 
              className={`hidden md:inline-flex items-center text-[10px] font-semibold uppercase tracking-[0.25em] px-6 py-3 transition-all duration-300 group border ${
                isScrolled || isMobileMenuOpen
                  ? 'bg-[#101615] text-[#F8F7F3] border-[#101615] hover:bg-transparent hover:text-[#101615]' 
                  : 'bg-transparent text-[#F8F7F3] border-[#F8F7F3]/30 hover:bg-[#F8F7F3] hover:text-[#101615]'
              }`}
            >
              Book Site Visit
              <svg className="w-4 h-4 ml-2 transition-transform duration-300 group-hover:translate-x-1" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" d="M14 5l7 7m0 0l-7 7m7-7H3"></path></svg>
            </Link>

            {/* Mobile Menu Button */}
            <button 
              className="lg:hidden p-2 z-50 relative" 
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
              aria-label="Toggle menu"
              aria-expanded={isMobileMenuOpen}
            >
              <div className="w-6 h-5 relative flex flex-col justify-between items-center transform transition-all duration-300">
                <span className={`bg-current block h-px w-full rounded-full transform transition-all duration-300 ${isMobileMenuOpen ? 'rotate-45 translate-y-2' : ''}`}></span>
                <span className={`bg-current block h-px w-full rounded-full transition-all duration-300 ${isMobileMenuOpen ? 'opacity-0' : 'opacity-100'}`}></span>
                <span className={`bg-current block h-px w-full rounded-full transform transition-all duration-300 ${isMobileMenuOpen ? '-rotate-45 -translate-y-2' : ''}`}></span>
              </div>
            </button>
          </div>
        </div>
      </nav>

      {/* Mobile Menu Full Screen Overlay */}
      <div className={`lg:hidden fixed inset-0 z-40 bg-[#F8F7F3] transition-all duration-500 ease-in-out ${
        isMobileMenuOpen ? 'opacity-100 visible' : 'opacity-0 invisible pointer-events-none'
      }`}>
        <div className="flex flex-col h-full pt-24 pb-8 px-6 overflow-y-auto">
          
          {/* Micro Brand Label */}
          <div className="flex items-center gap-3 mb-8 px-2">
            <span className="h-px w-8 bg-[#C6A06B]"></span>
            <span className="text-[9px] uppercase tracking-[0.3em] text-[#101615]/50">Sampan Development Ltd.</span>
          </div>

          <nav className="flex flex-col flex-grow space-y-1">
            <Link href="/" className="font-lux-serif text-3xl font-light text-[#101615] py-3 border-b border-[#DCD2C1] hover:text-[#C6A06B] transition-colors">Home</Link>
            <Link href="/about" className="font-lux-serif text-3xl font-light text-[#101615] py-3 border-b border-[#DCD2C1] hover:text-[#C6A06B] transition-colors">About</Link>
            
            {/* Mobile Accordion: Projects */}
            <div className="border-b border-[#DCD2C1]">
              <button 
                className="flex items-center justify-between w-full py-3 font-lux-serif text-3xl font-light text-[#101615] hover:text-[#C6A06B] transition-colors text-left"
                onClick={() => setMobileAccordion(mobileAccordion === 'projects' ? null : 'projects')}
                aria-expanded={mobileAccordion === 'projects'}
              >
                Projects
                <svg className={`w-6 h-6 transition-transform duration-300 ${mobileAccordion === 'projects' ? 'rotate-180 text-[#C6A06B]' : ''}`} fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1" d="M19 9l-7 7-7-7"></path></svg>
              </button>
              
              <div className={`grid transition-all duration-400 ease-out ${mobileAccordion === 'projects' ? 'grid-rows-[1fr] opacity-100' : 'grid-rows-[0fr] opacity-0'}`}>
                <div className="overflow-hidden">
                  <div className="pl-4 pb-6 pt-2 space-y-6">
                    <div>
                      <h4 className="text-[#C6A06B] uppercase tracking-[0.25em] text-[10px] font-bold pb-3">Ongoing</h4>
                      <div className="space-y-3">
                        {projectData.ongoing.map(p => (
                          <Link key={p.name} href={`/projects/ongoing/${p.name.toLowerCase().replace(/\s+/g, '-')}`} className="block text-lg font-lux-serif text-[#101615] hover:text-[#C6A06B] transition-colors">- {p.name}</Link>
                        ))}
                      </div>
                    </div>
                    <div>
                      <h4 className="text-[#C6A06B] uppercase tracking-[0.25em] text-[10px] font-bold pb-3">Completed</h4>
                      <div className="space-y-3">
                        {projectData.completed.map(p => (
                          <Link key={p.name} href={`/projects/completed/${p.name.toLowerCase().replace(/\s+/g, '-')}`} className="block text-lg font-lux-serif text-[#101916] hover:text-[#C6A06B] transition-colors">- {p.name}</Link>
                        ))}
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            <Link href="/investment" className="font-lux-serif text-3xl font-light text-[#101615] py-3 border-b border-[#DCD2C1] hover:text-[#C6A06B] transition-colors">Investment</Link>
            <Link href="/sampan-group" className="font-lux-serif text-3xl font-light text-[#101615] py-3 border-b border-[#DCD2C1] hover:text-[#C6A06B] transition-colors">Sampan Group</Link>
            <Link href="/contact" className="font-lux-serif text-3xl font-light text-[#101615] py-3 border-b border-[#DCD2C1] hover:text-[#C6A06B] transition-colors">Contact</Link>
          </nav>

          <div className="mt-8">
            <Link 
              href="/contact" 
              className="flex items-center justify-center w-full bg-[#101615] text-[#F8F7F3] text-[11px] font-semibold uppercase tracking-[0.25em] px-6 py-5 hover:bg-[#C6A06B] transition-all duration-300 shadow-md"
            >
              Book Site Visit
              <svg className="w-4 h-4 ml-3" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" d="M14 5l7 7m0 0l-7 7m7-7H3"></path></svg>
            </Link>
          </div>
        </div>
      </div>

      {/* Font imports for consistency with Hero */}
      <style jsx global>{`
        .font-lux-serif {
          font-family: 'Cormorant Garamond', serif;
        }
      `}</style>
    </header>
  );
}