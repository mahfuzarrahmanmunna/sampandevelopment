// app/components/Hero.tsx
"use client";

import Link from "next/link";
import Image from "next/image";
import { useState } from "react";

// Typed project data
interface Project {
  id: string;
  name: string;
  location: string;
  src: string;
  alt: string;
}

const projects: Project[] = [
  { 
    id: '01', 
    name: 'Sampan Metro Square', 
    location: 'Ashulia, Bangladesh', 
    // Illustrative architecture photography (Replace with approved Sampan asset)
    src: 'https://images.unsplash.com/photo-1486325212027-8081e485255e?q=80&w=2070&auto=format&fit=crop', 
    alt: 'Illustrative architectural photography of contemporary residential development' 
  },
  { 
    id: '02', 
    name: 'Sampan Condominium', 
    location: 'Dhaka–Chittagong Highway', 
    src: 'https://images.unsplash.com/photo-1545324418-cc1a3fa10c00?q=80&w=2070&auto=format&fit=crop', 
    alt: 'Illustrative architectural photography of modern high-rise condominium' 
  },
  { 
    id: '03', 
    name: 'Sampan Trade Emporium', 
    location: 'Dhaka–Chittagong Highway', 
    src: 'https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?q=80&w=2070&auto=format&fit=crop', 
    alt: 'Illustrative architectural photography of commercial building facade' 
  },
];

export default function Hero() {
  const [activeIndex, setActiveIndex] = useState(0);
  const activeProject = projects[activeIndex];

  return (
    <section className="relative w-full bg-[#F5F7FA] overflow-hidden font-sans antialiased">
      
      {/* Architectural Image Container */}
      <div className="absolute top-0 right-0 w-full lg:w-[58%] h-[320px] lg:h-full z-0">
        {projects.map((project, index) => (
          <div 
            key={project.id} 
            className={`absolute inset-0 transition-all duration-1000 ease-in-out ${
              index === activeIndex ? 'opacity-100 scale-100' : 'opacity-0 scale-105'
            }`}
          >
            <Image
              src={project.src}
              alt={project.alt}
              fill
              priority={index === 0} // LCP Optimization
              sizes="(max-width: 1024px) 100vw, 60vw"
              className="object-cover object-center"
            />
          </div>
        ))}
      </div>

      {/* Soft Blending Gradients */}
      {/* Desktop: Left-to-right blend */}
      <div className="hidden lg:block absolute inset-0 z-10 bg-gradient-to-r from-[#F5F7FA] via-[#F5F7FA]/90 to-transparent pointer-events-none"></div>
      <div className="hidden lg:block absolute inset-0 z-10 bg-gradient-to-t from-[#F5F7FA] via-transparent to-transparent pointer-events-none"></div>
      
      {/* Mobile: Top-to-bottom fade */}
      <div className="lg:hidden absolute top-[180px] left-0 right-0 h-[180px] z-10 bg-gradient-to-b from-transparent to-[#F5F7FA] pointer-events-none"></div>

      {/* Subtle Architectural Blueprint SVG (Bottom-Left) */}
      <svg className="absolute bottom-0 left-0 w-[60%] h-[80%] z-0 opacity-[0.04] pointer-events-none" xmlns="http://www.w3.org/2000/svg">
        <defs>
          <pattern id="grid" width="50" height="50" patternUnits="userSpaceOnUse">
            <path d="M 50 0 L 0 0 0 50" fill="none" stroke="#1B1B1B" strokeWidth="1"/>
          </pattern>
        </defs>
        <rect width="100%" height="100%" fill="url(#grid)" />
      </svg>

      {/* Main Content Container */}
      <div className="relative z-20 max-w-[1440px] mx-auto px-6 lg:px-12 w-full lg:min-h-[760px] flex flex-col lg:pt-32 lg:pb-40 pt-28 pb-10">
        
        {/* Text Content Block */}
        <div className="flex-grow flex flex-col justify-center max-w-xl lg:max-w-[560px]">
          {/* Eyebrow */}
          <div className="animate-fade-up delay-100 flex items-center gap-4 mb-6">
            <span className="h-px w-12 bg-[#19ABE1]"></span>
            <span className="text-[11px] font-semibold uppercase tracking-[0.35em] text-[#6B7280]">
              LAND / ARCHITECTURE / DEVELOPMENT
            </span>
          </div>

          {/* Headline */}
          <h1 className="animate-fade-up delay-200 text-4xl md:text-5xl lg:text-[3.5rem] xl:text-6xl font-light tracking-tight text-[#1B1B1B] leading-[1.15] mb-8">
            We manage & develop <span className="text-[#19ABE1] font-medium">land, towers, highway</span> destinations, commercial and residential buildings.
          </h1>

          {/* Paragraph */}
          <p className="animate-fade-up delay-300 text-base lg:text-lg text-[#6B7280] font-light leading-relaxed max-w-md mb-10">
            Sampan Development Ltd runs land-share projects and builds on documented, clearly titled land. Visit any project before you decide.
          </p>

          {/* CTAs */}
          <div className="animate-fade-up delay-400 flex flex-col sm:flex-row items-start sm:items-center gap-6 mb-10">
            <Link 
              href="/projects" 
              className="group bg-[#19ABE1] text-white text-sm font-semibold tracking-wide px-8 py-4 transition-all duration-300 hover:bg-[#1C87CC] flex items-center gap-3 shadow-lg shadow-[#19ABE1]/20"
            >
              View Projects
              <svg className="w-4 h-4 transition-transform duration-300 group-hover:translate-x-1" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M14 5l7 7m0 0l-7 7m7-7H3"></path></svg>
            </Link>
            
            <div className="flex flex-col items-start sm:items-center">
              <Link 
                href="/contact" 
                className="bg-transparent border border-[#19ABE1] text-[#19ABE1] text-sm font-semibold tracking-wide px-8 py-4 transition-all duration-300 hover:bg-[#19ABE1]/10 flex items-center gap-2"
              >
                Book a Site Visit
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z"></path></svg>
              </Link>
            </div>
          </div>

          {/* Trust Strip */}
          <div className="animate-fade-up delay-500 flex flex-wrap items-center gap-x-6 gap-y-3">
            <div className="flex items-center gap-2">
              <span className="w-4 h-4 rounded-full bg-[#009D4E]/10 flex items-center justify-center">
                <svg className="w-2.5 h-2.5 text-[#009D4E]" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="3" d="M5 13l4 4L19 7"></path></svg>
              </span>
              <span className="text-xs font-medium text-[#6B7280] uppercase tracking-wider">Clear title documents</span>
            </div>
            <div className="flex items-center gap-2">
              <span className="w-4 h-4 rounded-full bg-[#009D4E]/10 flex items-center justify-center">
                <svg className="w-2.5 h-2.5 text-[#009D4E]" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="3" d="M5 13l4 4L19 7"></path></svg>
              </span>
              <span className="text-xs font-medium text-[#6B7280] uppercase tracking-wider">Site visits on request</span>
            </div>
            <div className="flex items-center gap-2">
              <span className="w-4 h-4 rounded-full bg-[#009D4E]/10 flex items-center justify-center">
                <svg className="w-2.5 h-2.5 text-[#009D4E]" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="3" d="M5 13l4 4L19 7"></path></svg>
              </span>
              <span className="text-xs font-medium text-[#6B7280] uppercase tracking-wider">Backed by Sampan Group</span>
            </div>
          </div>
        </div>
      </div>

      {/* Bottom Project Showcase Strip */}
      <div className="relative z-30 w-full lg:absolute lg:bottom-0 lg:left-0 px-6 lg:px-12 pb-8">
        <div className="max-w-[1280px] mx-auto bg-white border border-gray-100 shadow-2xl shadow-gray-200/50 grid grid-cols-1 md:grid-cols-3 divide-y md:divide-y-0 md:divide-x divide-gray-100">
          {projects.map((project, index) => (
            <button 
              key={project.id} 
              onClick={() => setActiveIndex(index)}
              aria-label={`View ${project.name}`}
              className={`relative text-left p-6 transition-colors duration-300 group focus:outline-none focus-visible:ring-2 focus-visible:ring-inset focus-visible:ring-[#19ABE1] ${
                index === activeIndex ? 'bg-[#F5F7FA]' : 'bg-white hover:bg-gray-50'
              }`}
            >
              {/* Active Indicator Line */}
              <span className={`absolute top-0 left-0 h-[3px] bg-[#19ABE1] transition-all duration-500 ${
                index === activeIndex ? 'w-full' : 'w-0'
              }`}></span>
              
              <div className="flex items-start gap-5">
                <span className={`text-3xl font-light transition-colors ${index === activeIndex ? 'text-[#19ABE1]' : 'text-gray-300'}`}>
                  {project.id}
                </span>
                <div className="flex-1">
                  <div className={`h-px mb-3 transition-colors ${index === activeIndex ? 'bg-[#19ABE1] w-12' : 'bg-gray-200 w-8'}`}></div>
                  <h3 className={`text-sm font-semibold tracking-tight transition-colors ${index === activeIndex ? 'text-[#1B1B1B]' : 'text-[#6B7280] group-hover:text-[#1B1B1B]'}`}>
                    {project.name}
                  </h3>
                  <p className="text-xs text-[#6B7280] mt-1 flex items-center gap-1.5">
                    <svg className="w-3 h-3 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z"></path><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 11a3 3 0 11-6 0 3 3 0 016 0z"></path></svg>
                    {project.location}
                  </p>
                </div>
              </div>
            </button>
          ))}
        </div>
      </div>

      {/* Scoped Animation Styles */}
      <style jsx>{`
        @keyframes fadeUp {
          0% { opacity: 0; transform: translateY(20px); }
          100% { opacity: 1; transform: translateY(0); }
        }
        .animate-fade-up { animation: fadeUp 0.8s cubic-bezier(0.16, 1, 0.3, 1) forwards; opacity: 0; }
        .delay-100 { animation-delay: 0.1s; }
        .delay-200 { animation-delay: 0.2s; }
        .delay-300 { animation-delay: 0.3s; }
        .delay-400 { animation-delay: 0.4s; }
        .delay-500 { animation-delay: 0.5s; }

        @media (prefers-reduced-motion: reduce) {
          .animate-fade-up {
            animation: none !important;
            opacity: 1 !important;
            transform: none !important;
          }
        }
      `}</style>
    </section>
  );
}