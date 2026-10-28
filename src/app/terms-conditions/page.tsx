"use client";

import Link from "next/link";
import { useLayoutEffect, useRef } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

gsap.registerPlugin(ScrollTrigger);

const SECTIONS = [
  { id: "acceptance", num: "01", title: "Acceptance of Terms" },
  { id: "use-of-website", num: "02", title: "Use of Website" },
  { id: "intellectual-property", num: "03", title: "Intellectual Property" },
  { id: "project-disclaimer", num: "04", title: "Project Information Disclaimer" },
  { id: "investment-disclaimer", num: "05", title: "Investment Disclaimer" },
  { id: "third-party-links", num: "06", title: "Third-Party Links" },
  { id: "limitation", num: "07", title: "Limitation of Liability" },
  { id: "governing-law", num: "08", title: "Governing Law" },
  { id: "changes", num: "09", title: "Changes to Terms" },
  { id: "contact", num: "10", title: "Contact Information" },
];

export default function TermsConditionsPage() {
  const scopeRef = useRef<HTMLElement>(null);

  useLayoutEffect(() => {
    const ctx = gsap.context(() => {
      gsap.fromTo(".legal-hero-eyebrow", { opacity: 0, y: 20 }, { opacity: 1, y: 0, duration: 0.8, ease: "power3.out", delay: 0.2 });
      gsap.fromTo(".legal-hero-title", { opacity: 0, y: 40 }, { opacity: 1, y: 0, duration: 1.1, ease: "power4.out", delay: 0.35 });
      gsap.fromTo(".legal-hero-desc", { opacity: 0, y: 20 }, { opacity: 1, y: 0, duration: 0.8, ease: "power3.out", delay: 0.55 });
      gsap.fromTo(".legal-hero-meta", { opacity: 0, y: 15 }, { opacity: 1, y: 0, duration: 0.6, ease: "power3.out", delay: 0.75 });

      gsap.utils.toArray<HTMLElement>(".legal-reveal").forEach((el) => {
        gsap.fromTo(el, { opacity: 0, y: 40 }, {
          opacity: 1, y: 0, duration: 0.9, ease: "power3.out",
          scrollTrigger: { trigger: el, start: "top 85%", once: true },
        });
      });

      gsap.utils.toArray<HTMLElement>(".legal-sidebar-item").forEach((el) => {
        gsap.fromTo(el, { opacity: 0, x: -20 }, {
          opacity: 1, x: 0, duration: 0.5, ease: "power3.out",
          stagger: 0.05,
          scrollTrigger: { trigger: ".legal-sidebar", start: "top 80%", once: true },
        });
      });
    }, scopeRef);
    return () => ctx.revert();
  }, []);

  return (
    <main ref={scopeRef} className="min-h-screen overflow-hidden bg-[#F7F4ED] text-[#15201A] font-sans antialiased">
      <style>{`
        @keyframes kenBurns {
          0% { transform: scale(1.05) translate(0, 0); }
          100% { transform: scale(1.15) translate(-1%, -1.5%); }
        }
        @keyframes ambientDrift {
          0%, 100% { transform: translate(0, 0) scale(1); }
          50% { transform: translate(30px, -20px) scale(1.08); }
        }
      `}</style>

      {/* ═══ HERO (DARK) ═══ */}
      <section className="relative isolate flex min-h-[70svh] flex-col overflow-hidden bg-[#0B0B0D] text-white">
        <div
          className="absolute inset-0 -z-10 bg-cover bg-center"
          style={{
            background: "linear-gradient(135deg, #0B0B0D 0%, #15201A 50%, #0B0B0D 100%)",
            animation: "kenBurns 30s ease-in-out infinite alternate",
          }}
        />
        <div
          className="absolute -right-32 -top-32 -z-10 h-[40vw] w-[40vw] rounded-full blur-[120px]"
          style={{ background: "radial-gradient(circle, rgba(197,160,89,0.16) 0%, transparent 70%)", animation: "ambientDrift 24s ease-in-out infinite" }}
        />
        <div
          className="absolute inset-0 -z-10 opacity-[0.025] mix-blend-overlay pointer-events-none"
          style={{
            backgroundImage: "url(\"data:image/svg+xml,%3Csvg viewBox='0 0 200 200' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='3' /%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23n)' /%3E%3C/svg%3E\")",
            backgroundSize: "200px 200px",
          }}
        />
        <div
          className="absolute inset-0 -z-10 opacity-[0.04]"
          style={{
            backgroundImage: "radial-gradient(rgba(245,245,242,0.5) 1px, transparent 1px)",
            backgroundSize: "32px 32px",
            maskImage: "radial-gradient(ellipse at 50% 40%, black 0%, transparent 75%)",
            WebkitMaskImage: "radial-gradient(ellipse at 50% 40%, black 0%, transparent 75%)",
          }}
        />
        {/* Corner brackets */}
        <span className="pointer-events-none absolute left-6 top-6 z-30 h-10 w-10 border-l border-t border-white/20 sm:left-8 sm:top-8 sm:h-12 sm:w-12" />
        <span className="pointer-events-none absolute right-6 top-6 z-30 h-10 w-10 border-r border-t border-white/20 sm:right-8 sm:top-8 sm:h-12 sm:w-12" />
        <span className="pointer-events-none absolute bottom-6 left-6 z-30 h-10 w-10 border-b border-l border-white/20 sm:bottom-8 sm:left-8 sm:h-12 sm:w-12" />
        <span className="pointer-events-none absolute bottom-6 right-6 z-30 h-10 w-10 border-b border-r border-white/20 sm:bottom-8 sm:right-8 sm:h-12 sm:w-12" />

        <div className="mx-auto flex w-full max-w-[1200px] flex-1 flex-col items-start justify-center px-5 py-20 sm:px-8 md:px-12">
          <div className="legal-hero-eyebrow mb-6 flex items-center gap-3">
            <span className="h-px w-10 bg-[#C5A059]" />
            <span className="text-[10px] font-semibold uppercase tracking-[0.32em] text-[#C5A059] sm:text-xs">
              Legal · Terms & Conditions
            </span>
          </div>
          <h1 className="legal-hero-title text-balance text-4xl font-light leading-[0.98] tracking-[-0.04em] sm:text-5xl md:text-6xl lg:text-[4.5rem]">
            Terms & <span className="font-serif italic text-[#C5A059]">Conditions</span>
          </h1>
          <p className="legal-hero-desc mt-6 max-w-xl text-base leading-[1.85] text-white/55">
            The terms and conditions governing your use of the Sampan Development Ltd. website and the services we provide.
          </p>
          <div className="legal-hero-meta mt-8 flex flex-wrap items-center gap-x-8 gap-y-3 text-[9px] uppercase tracking-[0.28em] text-white/40">
            <span>Last updated: October 2025</span>
            <span className="h-3 w-px bg-white/15" />
            <span>Effective immediately</span>
            <span className="h-3 w-px bg-white/15" />
            <span>Version 1.0</span>
          </div>
        </div>
      </section>

      {/* ═══ CONTENT (LIGHT) ═══ */}
      <section className="relative px-5 py-16 sm:px-8 md:px-12 md:py-20">
        <div
          className="pointer-events-none absolute inset-0 opacity-[0.03]"
          style={{
            backgroundImage: "radial-gradient(rgba(21,32,26,0.5) 0.5px, transparent 0.5px)",
            backgroundSize: "32px 32px",
          }}
          aria-hidden="true"
        />
        <div className="relative mx-auto max-w-[1200px]">
          <div className="grid gap-10 md:grid-cols-[260px_1fr] md:gap-16">
            {/* ─── Sidebar ─── */}
            <aside className="legal-sidebar md:sticky md:top-8 md:self-start">
              <div className="mb-6 flex items-center gap-3">
                <span className="h-px w-6 bg-[#C5A059]" />
                <span className="text-[9px] font-semibold uppercase tracking-[0.28em] text-[#C5A059]">Contents</span>
              </div>
              <nav className="flex flex-col gap-1">
                {SECTIONS.map((s) => (
                  <a
                    key={s.id}
                    href={`#${s.id}`}
                    className="legal-sidebar-item group flex items-baseline gap-3 border-l border-[#15201A]/10 py-2 pl-4 transition-colors duration-300 hover:border-[#C5A059]"
                  >
                    <span className="font-mono text-[10px] tracking-[0.15em] text-[#C5A059]">{s.num}</span>
                    <span className="text-[12px] leading-tight text-[#15201A]/60 transition-colors duration-300 group-hover:text-[#15201A]">{s.title}</span>
                  </a>
                ))}
              </nav>
              <div className="mt-8 border-t border-[#15201A]/10 pt-6">
                <p className="text-[10px] uppercase tracking-[0.22em] text-[#15201A]/40 mb-3">Questions?</p>
                <Link href="/contact" className="group inline-flex items-center gap-2 text-[11px] font-semibold uppercase tracking-[0.22em] text-[#C5A059] transition-colors hover:text-[#15201A]">
                  Contact us
                  <span className="text-sm transition-transform duration-300 group-hover:translate-x-1">→</span>
                </Link>
              </div>
            </aside>

            {/* ─── Main Content ─── */}
            <div className="max-w-3xl">
              {/* 01 — Acceptance of Terms */}
              <div id="acceptance" className="legal-reveal mb-12 scroll-mt-20">
                <div className="mb-4 flex items-center gap-3">
                  <span className="font-mono text-[10px] tracking-[0.15em] text-[#C5A059]">01</span>
                  <span className="h-px w-6 bg-[#C5A059]/40" />
                </div>
                <h2 className="text-2xl font-medium tracking-[-0.03em] sm:text-3xl mb-4">Acceptance of Terms</h2>
                <p className="text-[15px] leading-[1.85] text-[#15201A]/70">
                  By accessing and using the Sampan Development Ltd. website at <Link href="https://sampandevelopmentltd.com" className="text-[#C5A059] underline underline-offset-2">sampandevelopmentltd.com</Link>, you accept and agree to be bound by these Terms and Conditions. If you do not agree with any part of these terms, please do not use our website or services.
                </p>
                <p className="mt-4 text-[15px] leading-[1.85] text-[#15201A]/70">
                  These terms apply to all visitors, users, and others who access or use the website. We reserve the right to update or modify these terms at any time without prior notice.
                </p>
              </div>

              {/* 02 — Use of Website */}
              <div id="use-of-website" className="legal-reveal mb-12 scroll-mt-20">
                <div className="mb-4 flex items-center gap-3">
                  <span className="font-mono text-[10px] tracking-[0.15em] text-[#C5A059]">02</span>
                  <span className="h-px w-6 bg-[#C5A059]/40" />
                </div>
                <h2 className="text-2xl font-medium tracking-[-0.03em] sm:text-3xl mb-4">Use of Website</h2>
                <p className="text-[15px] leading-[1.85] text-[#15201A]/70 mb-4">You agree to use this website only for lawful purposes and in a manner that does not infringe the rights of others. You agree not to:</p>
                <ul className="space-y-2">
                  {[
                    "Use the website in any way that violates applicable laws or regulations",
                    "Attempt to gain unauthorized access to any part of the website, server, or database",
                    "Introduce viruses, malware, or other malicious code to the website",
                    "Scrape, copy, or republish content from the website without written permission",
                    "Use the website to send unsolicited communications or marketing materials",
                    "Interfere with the proper functioning of the website or its features",
                  ].map((item, i) => (
                    <li key={i} className="flex items-start gap-3 text-[14px] leading-[1.75] text-[#15201A]/60">
                      <span className="mt-2 h-1 w-1 flex-shrink-0 rounded-full bg-[#C5A059]" />
                      {item}
                    </li>
                  ))}
                </ul>
              </div>

              {/* 03 — Intellectual Property */}
              <div id="intellectual-property" className="legal-reveal mb-12 scroll-mt-20">
                <div className="mb-4 flex items-center gap-3">
                  <span className="font-mono text-[10px] tracking-[0.15em] text-[#C5A059]">03</span>
                  <span className="h-px w-6 bg-[#C5A059]/40" />
                </div>
                <h2 className="text-2xl font-medium tracking-[-0.03em] sm:text-3xl mb-4">Intellectual Property</h2>
                <p className="text-[15px] leading-[1.85] text-[#15201A]/70">
                  All content on this website — including text, graphics, logos, images, architectural renderings, project designs, typography, software, and overall design — is the intellectual property of Sampan Development Ltd. or its content creators, and is protected by applicable copyright, trademark, and intellectual property laws of Bangladesh.
                </p>
                <p className="mt-4 text-[15px] leading-[1.85] text-[#15201A]/70">
                  You may view, download, and print pages from the website for your personal, non-commercial use. Any other use, including reproduction, modification, distribution, or publication, requires prior written consent from Sampan Development Ltd.
                </p>
              </div>

              {/* 04 — Project Information Disclaimer */}
              <div id="project-disclaimer" className="legal-reveal mb-12 scroll-mt-20">
                <div className="mb-4 flex items-center gap-3">
                  <span className="font-mono text-[10px] tracking-[0.15em] text-[#C5A059]">04</span>
                  <span className="h-px w-6 bg-[#C5A059]/40" />
                </div>
                <h2 className="text-2xl font-medium tracking-[-0.03em] sm:text-3xl mb-4">Project Information Disclaimer</h2>
                <p className="text-[15px] leading-[1.85] text-[#15201A]/70">
                  All project information, specifications, floor plans, architectural renderings, timelines, pricing, and availability displayed on this website are provided for general informational purposes only. While we strive to keep information accurate and up-to-date, we make no warranties or representations regarding the completeness, accuracy, or reliability of any project information.
                </p>
                <p className="mt-4 text-[15px] leading-[1.85] text-[#15201A]/70">
                  Architectural renderings and visualizations are artistic impressions and may differ from the final constructed product. Specifications, amenities, and features may be modified or revised at the discretion of Sampan Development Ltd. without prior notice. For verified and confirmed project details, please contact our team directly.
                </p>
              </div>

              {/* 05 — Investment Disclaimer */}
              <div id="investment-disclaimer" className="legal-reveal mb-12 scroll-mt-20">
                <div className="mb-4 flex items-center gap-3">
                  <span className="font-mono text-[10px] tracking-[0.15em] text-[#C5A059]">05</span>
                  <span className="h-px w-6 bg-[#C5A059]/40" />
                </div>
                <h2 className="text-2xl font-medium tracking-[-0.03em] sm:text-3xl mb-4">Investment Disclaimer</h2>
                <p className="text-[15px] leading-[1.85] text-[#15201A]/70">
                  Information on this website regarding land investment, property purchases, or rental income potential does not constitute financial, legal, or investment advice. Any projections, estimates, or returns mentioned are for informational purposes only and are not guaranteed.
                </p>
                <p className="mt-4 text-[15px] leading-[1.85] text-[#15201A]/70">
                  We strongly recommend that you consult with qualified legal, financial, and real estate professionals before making any property investment decisions. Sampan Development Ltd. shall not be liable for any financial decisions made based on information obtained from this website.
                </p>
              </div>

              {/* 06 — Third-Party Links */}
              <div id="third-party-links" className="legal-reveal mb-12 scroll-mt-20">
                <div className="mb-4 flex items-center gap-3">
                  <span className="font-mono text-[10px] tracking-[0.15em] text-[#C5A059]">06</span>
                  <span className="h-px w-6 bg-[#C5A059]/40" />
                </div>
                <h2 className="text-2xl font-medium tracking-[-0.03em] sm:text-3xl mb-4">Third-Party Links</h2>
                <p className="text-[15px] leading-[1.85] text-[#15201A]/70">
                  Our website may contain links to external websites, including the Sampan Group parent company website and partner organizations. We are not responsible for the content, privacy policies, or practices of these third-party websites. We encourage you to review the terms and privacy policies of any external site you visit.
                </p>
              </div>

              {/* 07 — Limitation of Liability */}
              <div id="limitation" className="legal-reveal mb-12 scroll-mt-20">
                <div className="mb-4 flex items-center gap-3">
                  <span className="font-mono text-[10px] tracking-[0.15em] text-[#C5A059]">07</span>
                  <span className="h-px w-6 bg-[#C5A059]/40" />
                </div>
                <h2 className="text-2xl font-medium tracking-[-0.03em] sm:text-3xl mb-4">Limitation of Liability</h2>
                <p className="text-[15px] leading-[1.85] text-[#15201A]/70">
                  To the fullest extent permitted by applicable law, Sampan Development Ltd. and its affiliates, officers, employees, agents, and partners shall not be liable for any direct, indirect, incidental, consequential, special, or exemplary damages arising from your use of the website or reliance on any information displayed on the website.
                </p>
                <p className="mt-4 text-[15px] leading-[1.85] text-[#15201A]/70">
                  This includes, but is not limited to, damages for loss of profits, data, or other intangible losses resulting from access to or use of, or inability to access or use, the website.
                </p>
              </div>

              {/* 08 — Governing Law */}
              <div id="governing-law" className="legal-reveal mb-12 scroll-mt-20">
                <div className="mb-4 flex items-center gap-3">
                  <span className="font-mono text-[10px] tracking-[0.15em] text-[#C5A059]">08</span>
                  <span className="h-px w-6 bg-[#C5A059]/40" />
                </div>
                <h2 className="text-2xl font-medium tracking-[-0.03em] sm:text-3xl mb-4">Governing Law</h2>
                <p className="text-[15px] leading-[1.85] text-[#15201A]/70">
                  These Terms and Conditions shall be governed by and construed in accordance with the laws of the People&apos;s Republic of Bangladesh. Any disputes arising from or relating to these terms shall be subject to the exclusive jurisdiction of the courts of Dhaka, Bangladesh.
                </p>
              </div>

              {/* 09 — Changes to Terms */}
              <div id="changes" className="legal-reveal mb-12 scroll-mt-20">
                <div className="mb-4 flex items-center gap-3">
                  <span className="font-mono text-[10px] tracking-[0.15em] text-[#C5A059]">09</span>
                  <span className="h-px w-6 bg-[#C5A059]/40" />
                </div>
                <h2 className="text-2xl font-medium tracking-[-0.03em] sm:text-3xl mb-4">Changes to Terms</h2>
                <p className="text-[15px] leading-[1.85] text-[#15201A]/70">
                  We reserve the right to modify or replace these Terms and Conditions at any time. Changes will be effective immediately upon posting on this page. Your continued use of the website following any changes constitutes acceptance of the revised terms.
                </p>
              </div>

              {/* 10 — Contact Information */}
              <div id="contact" className="legal-reveal mb-12 scroll-mt-20">
                <div className="mb-4 flex items-center gap-3">
                  <span className="font-mono text-[10px] tracking-[0.15em] text-[#C5A059]">10</span>
                  <span className="h-px w-6 bg-[#C5A059]/40" />
                </div>
                <h2 className="text-2xl font-medium tracking-[-0.03em] sm:text-3xl mb-4">Contact Information</h2>
                <p className="text-[15px] leading-[1.85] text-[#15201A]/70 mb-4">
                  For any questions or clarifications regarding these Terms and Conditions, please contact us:
                </p>
                <div className="border border-[#15201A]/10 bg-white p-6">
                  <div className="space-y-3">
                    <div className="flex items-center gap-3">
                      <svg className="h-4 w-4 text-[#C5A059]" fill="none" stroke="currentColor" strokeWidth="1.5" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="M3 8l9 6 9-6M3 8v10a2 2 0 002 2h14a2 2 0 002-2V8M3 8l9 6 9-6" /></svg>
                      <a href="mailto:info@sampangroup.com.bd" className="text-sm text-[#C5A059] underline underline-offset-2">info@sampangroup.com.bd</a>
                    </div>
                    <div className="flex items-center gap-3">
                      <svg className="h-4 w-4 text-[#C5A059]" fill="none" stroke="currentColor" strokeWidth="1.5" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" /></svg>
                      <a href="tel:+8801912234588" className="text-sm text-[#C5A059] underline underline-offset-2">+880 1912 234588</a>
                    </div>
                    <div className="flex items-center gap-3">
                      <svg className="h-4 w-4 text-[#C5A059]" fill="none" stroke="currentColor" strokeWidth="1.5" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="M12 21c5-5 9-9.5 9-13a9 9 0 10-18 0c0 3.5 4 8 9 13z" /><circle cx="12" cy="8" r="2.5" /></svg>
                      <span className="text-sm text-[#15201A]/60">Sampan Development Ltd., Dhaka, Bangladesh</span>
                    </div>
                  </div>
                  <div className="mt-6 pt-6 border-t border-[#15201A]/10">
                    <Link href="/contact" className="group inline-flex items-center gap-3 border border-[#15201A] px-6 py-3 text-[11px] font-semibold uppercase tracking-[0.22em] transition hover:bg-[#15201A] hover:text-white">
                      Contact our team
                      <span className="text-sm transition-transform duration-300 group-hover:translate-x-1">→</span>
                    </Link>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>
    </main>
  );
}