// app/components/Footer/Footer.tsx
"use client";

import Link from "next/link";
import Image from "next/image";
import { useEffect, useState } from "react";

export default function Footer() {
  // Render year on the client to avoid `new Date()` during prerendering.
  // Falls back to a static year until hydrated (no layout shift, no SSR error).
  const [currentYear, setCurrentYear] = useState<number>(2025);

  useEffect(() => {
    setCurrentYear(new Date().getFullYear());
  }, []);

  return (
    <footer className="bg-[#0B0B0D] text-[#F5F5F2] font-sans antialiased">
      <div className="max-w-[1400px] mx-auto px-6 lg:px-12 py-20 lg:py-28">

        {/* Top Section: Brand Intro & Navigation */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-16 lg:gap-8 mb-20">

          {/* A. Brand Introduction */}
          <div className="lg:col-span-5">
            <Link href="/" className="inline-block mb-10">
              <Image
                src="/logo/logo.png"
                alt="Sampan Development Limited Logo"
                width={200}
                height={50}
                className="h-auto w-auto object-contain"
                priority={false}
              />
            </Link>
            <h2 className="text-2xl md:text-3xl font-light tracking-tight text-[#F5F5F2] mb-6 leading-tight">
              Building a legacy. <br />Creating lasting value.
            </h2>
            <p className="text-sm text-[#A3A3A3] font-light leading-relaxed max-w-sm mb-8">
              Sampan Development Ltd specializes in premium land development, construction, and real estate, delivering exceptional residential and commercial spaces.
            </p>
            <p className="text-[11px] text-[#A3A3A3] uppercase tracking-[0.25em] font-medium">
              A concern of Sampan Group
            </p>
          </div>

          {/* B. Navigation Columns */}
          <div className="lg:col-span-7 grid grid-cols-1 sm:grid-cols-3 gap-12">

            {/* Explore */}
            <div className="flex flex-col">
              <h3 className="text-[11px] font-semibold uppercase tracking-[0.25em] text-[#19ABE1] mb-8">
                Explore
              </h3>
              <ul className="space-y-5">
                <li><Link href="/about" className="text-sm text-[#A3A3A3] hover:text-[#F5F5F2] transition-colors duration-300">About Us</Link></li>
                <li><Link href="/investment" className="text-sm text-[#A3A3A3] hover:text-[#F5F5F2] transition-colors duration-300">Investment</Link></li>
                <li><Link href="/contact" className="text-sm text-[#A3A3A3] hover:text-[#F5F5F2] transition-colors duration-300">Contact</Link></li>
                <li><Link href="/sampan-group" className="text-sm text-[#A3A3A3] hover:text-[#F5F5F2] transition-colors duration-300">Sampan Group</Link></li>
              </ul>
            </div>

            {/* Our Projects */}
            <div className="flex flex-col">
              <h3 className="text-[11px] font-semibold uppercase tracking-[0.25em] text-[#19ABE1] mb-8">
                Our Projects
              </h3>
              <ul className="space-y-5">
                <li><Link href="/projects/ongoing/sampan-metro-square" className="text-sm text-[#A3A3A3] hover:text-[#F5F5F2] transition-colors duration-300">Sampan Metro Square</Link></li>
                <li><Link href="/projects/ongoing/sampan-condominium" className="text-sm text-[#A3A3A3] hover:text-[#F5F5F2] transition-colors duration-300">Sampan Condominium</Link></li>
                <li><Link href="/projects/ongoing/sampan-trade-emporium" className="text-sm text-[#A3A3A3] hover:text-[#F5F5F2] transition-colors duration-300">Sampan Trade Emporium</Link></li>
                <li><Link href="/projects" className="inline-flex items-center gap-1.5 text-sm font-medium text-[#19ABE1] hover:opacity-80 transition-opacity duration-300 mt-1">
                  View All Projects
                  <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 5l7 7-7 7"></path></svg>
                </Link></li>
              </ul>
            </div>

            {/* Get in Touch */}
            <div className="flex flex-col">
              <h3 className="text-[11px] font-semibold uppercase tracking-[0.25em] text-[#19ABE1] mb-8">
                Get in Touch
              </h3>
              <ul className="space-y-5">
                <li>
                  <a href="tel:+8801234567890" className="flex items-start gap-3 text-sm text-[#A3A3A3] hover:text-[#F5F5F2] transition-colors duration-300 group">
                    <svg className="w-4 h-4 mt-0.5 text-[#19ABE1] flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z"></path></svg>
                    +880 1234 567890
                  </a>
                </li>
                <li>
                  <a href="https://wa.me/8801234567890" target="_blank" rel="noopener noreferrer" className="flex items-start gap-3 text-sm text-[#A3A3A3] hover:text-[#F5F5F2] transition-colors duration-300">
                    <svg className="w-4 h-4 mt-0.5 text-[#19ABE1] flex-shrink-0" fill="currentColor" viewBox="0 0 24 24"><path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.608.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51l-.57-.01c-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.247-.694.247-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413Z"></path></svg>
                    WhatsApp Chat
                  </a>
                </li>
                <li>
                  <a href="mailto:info@sampandevelopmentltd.com" className="flex items-start gap-3 text-sm text-[#A3A3A3] hover:text-[#F5F5F2] transition-colors duration-300 break-all">
                    <svg className="w-4 h-4 mt-0.5 text-[#19ABE1] flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z"></path></svg>
                    info@sampandevelopmentltd.com
                  </a>
                </li>
                <li>
                  <div className="flex items-start gap-3 text-sm text-[#A3A3A3]">
                    <svg className="w-4 h-4 mt-0.5 text-[#19ABE1] flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z"></path><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" d="M15 11a3 3 0 11-6 0 3 3 0 016 0z"></path></svg>
                    <span>Head Office, Dhaka, Bangladesh</span>
                  </div>
                </li>
              </ul>
            </div>

          </div>
        </div>

        {/* D. Bottom Bar */}
        <div className="border-t border-[#292929] pt-8 flex flex-col md:flex-row justify-between items-center gap-6">
          <p className="text-xs text-[#A3A3A3] tracking-wide text-center md:text-left">
            © {currentYear} Sampan Development Ltd. All rights reserved.
          </p>

          <div className="flex items-center gap-8">
            <div className="flex items-center gap-5">
              <a href="https://www.facebook.com/sampandevelopmentlimited" target="_blank" rel="noopener noreferrer" aria-label="Visit Sampan Development on Facebook" className="text-[#A3A3A3] hover:text-[#19ABE1] transition-colors duration-300 focus:outline-none focus-visible:ring-2 focus-visible:ring-[#19ABE1] rounded-full p-1">
                <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24"><path d="M22 12c0-5.523-4.477-10-10-10S2 6.477 2 12c0 4.991 3.657 9.128 8.438 9.878v-6.987h-2.54V12h2.54V9.797c0-2.506 1.492-3.89 3.777-3.89 1.094 0 2.238.195 2.238.195v2.46h-1.26c-1.243 0-1.63.771-1.63 1.562V12h2.773l-.443 2.89h-2.33v6.988C18.343 21.128 22 16.991 22 12z"></path></svg>
              </a>
            </div>

            <div className="flex items-center gap-6 border-l border-[#292929] pl-8">
              <Link href="/privacy-policy" className="text-xs text-[#A3A3A3] hover:text-[#19ABE1] transition-colors duration-300 focus:outline-none focus-visible:ring-2 focus-visible:ring-[#19ABE1] rounded">
                Privacy Policy
              </Link>
              <Link href="/terms" className="text-xs text-[#A3A3A3] hover:text-[#19ABE1] transition-colors duration-300 focus:outline-none focus-visible:ring-2 focus-visible:ring-[#19ABE1] rounded">
                Terms
              </Link>
            </div>
          </div>
        </div>

      </div>
    </footer>
  );
}