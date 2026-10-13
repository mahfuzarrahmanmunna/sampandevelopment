// app/components/Navbar.tsx
"use client";

import Link from "next/link";
import { useState } from "react";
import Image from "next/image";

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
  const [isProjectsOpen, setIsProjectsOpen] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [mobileAccordion, setMobileAccordion] = useState<string | null>(null);

  return (
    <header className="fixed top-0 left-0 w-full z-50 bg-white/60 backdrop-blur-xl text-gray-900 shadow-[0_8px_30px_rgb(0,0,0,0.04)] border-b border-white/30 transition-all duration-300">
      <nav className="max-w-7xl mx-auto px-6 lg:px-8">
        <div className="flex items-center justify-between h-20">
          
          {/* Logo Section */}
          <div className="flex-shrink-0 z-50">
            <Link href="/" className="flex items-center gap-2 group">
              <Image 
                src="/logo/logo.png" 
                alt="Sampan Development Limited Logo" 
                width={160} 
                height={40} 
                className="rounded-md transition-transform duration-300 group-hover:scale-105"
              />
            </Link>
          </div>

          {/* Desktop Menu */}
          <ul className="hidden lg:flex items-center space-x-10 h-full">
            <li className="flex items-center h-full">
              <Link href="/" className="relative text-sm font-medium uppercase tracking-widest text-gray-700 hover:text-primary transition-colors duration-300 flex items-center h-full group">
                Home
                <span className="absolute bottom-6 left-1/2 transform -translate-x-1/2 h-[2px] w-0 bg-primary transition-all duration-300 group-hover:w-full"></span>
              </Link>
            </li>
            <li className="flex items-center h-full">
              <Link href="/about" className="relative text-sm font-medium uppercase tracking-widest text-gray-700 hover:text-primary transition-colors duration-300 flex items-center h-full group">
                About
                <span className="absolute bottom-6 left-1/2 transform -translate-x-1/2 h-[2px] w-0 bg-primary transition-all duration-300 group-hover:w-full"></span>
              </Link>
            </li>

            {/* Mega Menu Trigger: Projects */}
            <li 
              className="relative h-full flex items-center"
              onMouseEnter={() => setIsProjectsOpen(true)}
              onMouseLeave={() => setIsProjectsOpen(false)}
            >
              <button 
                className="relative text-sm font-medium uppercase tracking-widest text-gray-700 hover:text-primary transition-colors duration-300 flex items-center gap-1 h-full group"
                onClick={() => setIsProjectsOpen(!isProjectsOpen)}
              >
                Projects 
                <svg className={`w-4 h-4 transition-transform duration-300 ${isProjectsOpen ? 'rotate-180' : ''}`} fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7"></path></svg>
                <span className="absolute bottom-6 left-1/2 transform -translate-x-1/2 h-[2px] w-0 bg-primary transition-all duration-300 group-hover:w-full"></span>
              </button>

              {/* Mega Menu Dropdown (Glassmorphism + Advanced Animation) */}
              <div className={`absolute top-full left-1/2 transform -translate-x-1/2 mt-0 w-[800px] bg-white/90 backdrop-blur-2xl border border-white/40 rounded-b-2xl shadow-2xl shadow-gray-300/30 overflow-hidden transition-all duration-300 ease-out origin-top ${
                isProjectsOpen ? 'opacity-100 visible translate-y-0' : 'opacity-0 invisible -translate-y-4'
              }`}>
                <div className="grid grid-cols-2 gap-8 p-8">
                  {/* Ongoing Projects */}
                  <div>
                    <h3 className="text-sm font-bold uppercase tracking-widest text-secondary mb-6 border-b border-gray-200/50 pb-2">
                      Ongoing Projects
                    </h3>
                    <div className="space-y-2">
                      {projectData.ongoing.map((project) => (
                        <Link 
                          key={project.name} 
                          href={`/projects/ongoing/${project.name.toLowerCase().replace(/\s+/g, '-')}`}
                          className="block group p-3 -m-3 rounded-lg transition-colors duration-200 hover:bg-white/50"
                        >
                          <div className="text-base font-semibold text-gray-800 group-hover:text-primary transition-colors flex items-center">
                            {project.name}
                            <svg className="w-4 h-4 ml-2 opacity-0 group-hover:opacity-100 group-hover:translate-x-1 transition-all duration-200 text-primary" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M14 5l7 7m0 0l-7 7m7-7H3"></path></svg>
                          </div>
                          <div className="text-xs text-gray-500 uppercase tracking-wider mt-1">
                            {project.desc}
                          </div>
                        </Link>
                      ))}
                    </div>
                  </div>
                  
                  {/* Completed Projects */}
                  <div>
                    <h3 className="text-sm font-bold uppercase tracking-widest text-secondary mb-6 border-b border-gray-200/50 pb-2">
                      Completed Projects
                    </h3>
                    <div className="space-y-2">
                      {projectData.completed.map((project) => (
                        <Link 
                          key={project.name} 
                          href={`/projects/completed/${project.name.toLowerCase().replace(/\s+/g, '-')}`}
                          className="block group p-3 -m-3 rounded-lg transition-colors duration-200 hover:bg-white/50"
                        >
                          <div className="text-base font-semibold text-gray-800 group-hover:text-primary transition-colors flex items-center">
                            {project.name}
                            <svg className="w-4 h-4 ml-2 opacity-0 group-hover:opacity-100 group-hover:translate-x-1 transition-all duration-200 text-primary" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M14 5l7 7m0 0l-7 7m7-7H3"></path></svg>
                          </div>
                          <div className="text-xs text-gray-500 uppercase tracking-wider mt-1">
                            {project.desc}
                          </div>
                        </Link>
                      ))}
                    </div>
                  </div>
                </div>
                <div className="bg-white/40 backdrop-blur-sm px-8 py-4 border-t border-white/40 flex justify-end">
                  <Link href="/projects" className="text-xs font-bold uppercase tracking-widest text-primary hover:text-accent transition-colors duration-300 flex items-center group">
                    View All Projects 
                    <svg className="w-4 h-4 ml-2 group-hover:translate-x-1 transition-transform duration-300" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M14 5l7 7m0 0l-7 7m7-7H3"></path></svg>
                  </Link>
                </div>
              </div>
            </li>

            <li className="flex items-center h-full">
              <Link href="/investment" className="relative text-sm font-medium uppercase tracking-widest text-gray-700 hover:text-primary transition-colors duration-300 flex items-center h-full group">
                Investment
                <span className="absolute bottom-6 left-1/2 transform -translate-x-1/2 h-[2px] w-0 bg-primary transition-all duration-300 group-hover:w-full"></span>
              </Link>
            </li>
            <li className="flex items-center h-full">
              <Link href="/sampan-group" className="relative text-sm font-medium uppercase tracking-widest text-gray-700 hover:text-primary transition-colors duration-300 flex items-center h-full group">
                Sampan Group
                <span className="absolute bottom-6 left-1/2 transform -translate-x-1/2 h-[2px] w-0 bg-primary transition-all duration-300 group-hover:w-full"></span>
              </Link>
            </li>
            <li className="flex items-center h-full">
              <Link href="/privacy-policy" className="relative text-sm font-medium uppercase tracking-widest text-gray-400 hover:text-primary transition-colors duration-300 flex items-center h-full group">
                Privacy / Terms
                <span className="absolute bottom-6 left-1/2 transform -translate-x-1/2 h-[2px] w-0 bg-primary transition-all duration-300 group-hover:w-full"></span>
              </Link>
            </li>
          </ul>

          {/* CTA Button & Mobile Toggle */}
          <div className="flex items-center gap-4">
            <Link 
              href="/contact" 
              className="hidden md:inline-block bg-brand-black text-white text-sm font-bold uppercase tracking-widest px-6 py-3 rounded-lg hover:bg-primary transition-all duration-300 shadow-lg shadow-gray-400/30 hover:shadow-primary/30 hover:-translate-y-0.5"
            >
              Book Site Visit
            </Link>

            {/* Mobile Menu Button */}
            <button 
              className="lg:hidden text-gray-800 p-2 z-50 relative" 
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
              aria-label="Toggle menu"
            >
              <div className="w-6 h-5 relative flex flex-col justify-between items-center transform transition-all duration-300">
                <span className={`bg-current block h-0.5 w-full rounded-full transform transition-all duration-300 ${isMobileMenuOpen ? 'rotate-45 translate-y-2' : ''}`}></span>
                <span className={`bg-current block h-0.5 w-full rounded-full transition-all duration-300 ${isMobileMenuOpen ? 'opacity-0' : 'opacity-100'}`}></span>
                <span className={`bg-current block h-0.5 w-full rounded-full transform transition-all duration-300 ${isMobileMenuOpen ? '-rotate-45 -translate-y-2' : ''}`}></span>
              </div>
            </button>
          </div>
        </div>
      </nav>

      {/* Mobile Menu Drawer (Glassmorphism) */}
      <div className={`lg:hidden absolute top-full left-0 w-full bg-white/80 backdrop-blur-2xl border-t border-white/40 shadow-xl transition-all duration-300 ease-out overflow-hidden ${
        isMobileMenuOpen ? 'max-h-[90vh] opacity-100 visible' : 'max-h-0 opacity-0 invisible'
      }`}>
        <div className="px-6 py-8 space-y-2 overflow-y-auto">
          <Link href="/" className="block py-3 text-lg font-medium text-gray-800 border-b border-gray-200/50 hover:text-primary transition-colors">Home</Link>
          <Link href="/about" className="block py-3 text-lg font-medium text-gray-800 border-b border-gray-200/50 hover:text-primary transition-colors">About</Link>
          
          {/* Mobile Accordion: Projects */}
          <div className="border-b border-gray-200/50">
            <button 
              className="flex items-center justify-between w-full py-3 text-lg font-medium text-gray-800 hover:text-primary transition-colors"
              onClick={() => setMobileAccordion(mobileAccordion === 'projects' ? null : 'projects')}
            >
              Projects
              <svg className={`w-5 h-5 transition-transform duration-300 ${mobileAccordion === 'projects' ? 'rotate-180 text-primary' : ''}`} fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7"></path></svg>
            </button>
            
            <div className={`grid transition-all duration-300 ease-out ${mobileAccordion === 'projects' ? 'grid-rows-[1fr] opacity-100' : 'grid-rows-[0fr] opacity-0'}`}>
              <div className="overflow-hidden">
                <div className="pl-4 pb-4 space-y-4">
                  <div>
                    <h4 className="text-secondary uppercase tracking-widest text-sm py-2">Ongoing</h4>
                    {projectData.ongoing.map(p => (
                      <Link key={p.name} href="#" className="block py-2 text-gray-600 hover:text-primary hover:translate-x-1 transition-all duration-200">{p.name}</Link>
                    ))}
                  </div>
                  <div>
                    <h4 className="text-secondary uppercase tracking-widest text-sm py-2">Completed</h4>
                    {projectData.completed.map(p => (
                      <Link key={p.name} href="#" className="block py-2 text-gray-600 hover:text-primary hover:translate-x-1 transition-all duration-200">{p.name}</Link>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          </div>

          <Link href="/investment" className="block py-3 text-lg font-medium text-gray-800 border-b border-gray-200/50 hover:text-primary transition-colors">Investment</Link>
          <Link href="/sampan-group" className="block py-3 text-lg font-medium text-gray-800 border-b border-gray-200/50 hover:text-primary transition-colors">Sampan Group</Link>
          <Link href="/contact" className="block py-3 text-lg font-medium text-gray-800 border-b border-gray-200/50 hover:text-primary transition-colors">Contact</Link>
          <Link href="/privacy-policy" className="block py-3 text-base font-medium text-gray-400 hover:text-primary transition-colors">Privacy Policy / Terms</Link>
          
          <Link 
            href="/contact" 
            className="block mt-6 bg-brand-black text-white text-center text-base font-bold uppercase tracking-widest px-6 py-4 rounded-lg hover:bg-primary transition-all duration-300 shadow-lg"
          >
            Book Site Visit
          </Link>
        </div>
      </div>
    </header>
  );
}