"use client";

import Link from "next/link";
import { useLayoutEffect, useRef } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

gsap.registerPlugin(ScrollTrigger);

const SECTIONS = [
  { id: "introduction", num: "01", title: "Introduction" },
  { id: "information-we-collect", num: "02", title: "Information We Collect" },
  { id: "how-we-use", num: "03", title: "How We Use Your Information" },
  { id: "cookies", num: "04", title: "Cookies & Tracking" },
  { id: "data-sharing", num: "05", title: "Data Sharing & Third Parties" },
  { id: "data-security", num: "06", title: "Data Security" },
  { id: "your-rights", num: "07", title: "Your Rights" },
  { id: "children", num: "08", title: "Children's Privacy" },
  { id: "changes", num: "09", title: "Changes to This Policy" },
  { id: "contact", num: "10", title: "Contact Us" },
];

export default function PrivacyPolicyPage() {
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
        {/* Ken Burns background gradient */}
        <div
          className="absolute inset-0 -z-10 bg-cover bg-center"
          style={{
            background: "linear-gradient(135deg, #0B0B0D 0%, #15201A 50%, #0B0B0D 100%)",
            animation: "kenBurns 30s ease-in-out infinite alternate",
          }}
        />
        {/* Ambient glow */}
        <div
          className="absolute -right-32 -top-32 -z-10 h-[40vw] w-[40vw] rounded-full blur-[120px]"
          style={{ background: "radial-gradient(circle, rgba(197,160,89,0.16) 0%, transparent 70%)", animation: "ambientDrift 24s ease-in-out infinite" }}
        />
        {/* Film grain */}
        <div
          className="absolute inset-0 -z-10 opacity-[0.025] mix-blend-overlay pointer-events-none"
          style={{
            backgroundImage: "url(\"data:image/svg+xml,%3Csvg viewBox='0 0 200 200' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='3' /%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23n)' /%3E%3C/svg%3E\")",
            backgroundSize: "200px 200px",
          }}
        />
        {/* Dot grid */}
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

        {/* Hero content */}
        <div className="mx-auto flex w-full max-w-[1200px] flex-1 flex-col items-start justify-center px-5 py-20 sm:px-8 md:px-12">
          <div className="legal-hero-eyebrow mb-6 flex items-center gap-3">
            <span className="h-px w-10 bg-[#C5A059]" />
            <span className="text-[10px] font-semibold uppercase tracking-[0.32em] text-[#C5A059] sm:text-xs">
              Legal · Privacy Policy
            </span>
          </div>
          <h1 className="legal-hero-title text-balance text-4xl font-light leading-[0.98] tracking-[-0.04em] sm:text-5xl md:text-6xl lg:text-[4.5rem]">
            Privacy <span className="font-serif italic text-[#C5A059]">Policy</span>
          </h1>
          <p className="legal-hero-desc mt-6 max-w-xl text-base leading-[1.85] text-white/55">
            How Sampan Development Ltd. collects, uses, and protects your personal information when you visit our website or engage with our services.
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
        {/* Dot grid */}
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
            {/* ─── Sidebar Table of Contents ─── */}
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
              {/* Contact CTA */}
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
              {/* 01 — Introduction */}
              <div id="introduction" className="legal-reveal mb-12 scroll-mt-20">
                <div className="mb-4 flex items-center gap-3">
                  <span className="font-mono text-[10px] tracking-[0.15em] text-[#C5A059]">01</span>
                  <span className="h-px w-6 bg-[#C5A059]/40" />
                </div>
                <h2 className="text-2xl font-medium tracking-[-0.03em] sm:text-3xl mb-4">Introduction</h2>
                <p className="text-[15px] leading-[1.85] text-[#15201A]/70">
                  Sampan Development Ltd. (&ldquo;we&rdquo;, &ldquo;us&rdquo;, or &ldquo;our&rdquo;) is a real estate and property development company headquartered in Bangladesh. This Privacy Policy explains how we collect, use, disclose, and safeguard your personal information when you visit our website at <Link href="https://sampandevelopmentltd.com" className="text-[#C5A059] underline underline-offset-2">sampandevelopmentltd.com</Link> or engage with our services.
                </p>
                <p className="mt-4 text-[15px] leading-[1.85] text-[#15201A]/70">
                  We are committed to protecting your privacy and ensuring the security of your personal data. By using our website, you agree to the practices described in this policy.
                </p>
              </div>

              {/* 02 — Information We Collect */}
              <div id="information-we-collect" className="legal-reveal mb-12 scroll-mt-20">
                <div className="mb-4 flex items-center gap-3">
                  <span className="font-mono text-[10px] tracking-[0.15em] text-[#C5A059]">02</span>
                  <span className="h-px w-6 bg-[#C5A059]/40" />
                </div>
                <h2 className="text-2xl font-medium tracking-[-0.03em] sm:text-3xl mb-4">Information We Collect</h2>
                <p className="text-[15px] leading-[1.85] text-[#15201A]/70 mb-4">
                  We may collect the following types of personal information:
                </p>
                <div className="space-y-4">
                  <div className="border-l-2 border-[#C5A059]/40 pl-5">
                    <h3 className="text-sm font-semibold uppercase tracking-[0.15em] text-[#15201A] mb-1">Personal Identification</h3>
                    <p className="text-[14px] leading-[1.75] text-[#15201A]/60">Name, email address, phone number, and any information you voluntarily provide through contact forms, enquiry forms, or project interest submissions.</p>
                  </div>
                  <div className="border-l-2 border-[#C5A059]/40 pl-5">
                    <h3 className="text-sm font-semibold uppercase tracking-[0.15em] text-[#15201A] mb-1">Technical Data</h3>
                    <p className="text-[14px] leading-[1.75] text-[#15201A]/60">IP address, browser type, device information, pages visited, referral URLs, and usage patterns collected automatically through cookies and analytics tools.</p>
                  </div>
                  <div className="border-l-2 border-[#C5A059]/40 pl-5">
                    <h3 className="text-sm font-semibold uppercase tracking-[0.15em] text-[#15201A] mb-1">Project Enquiry Data</h3>
                    <p className="text-[14px] leading-[1.75] text-[#15201A]/60">Information about your interest in specific projects, preferred property types, budget ranges, and timeline preferences shared during consultations or enquiries.</p>
                  </div>
                  <div className="border-l-2 border-[#C5A059]/40 pl-5">
                    <h3 className="text-sm font-semibold uppercase tracking-[0.15em] text-[#15201A] mb-1">Communication Records</h3>
                    <p className="text-[14px] leading-[1.75] text-[#15201A]/60">Records of correspondence including emails, WhatsApp messages, phone calls, and meeting notes related to your enquiry or project engagement.</p>
                  </div>
                </div>
              </div>

              {/* 03 — How We Use */}
              <div id="how-we-use" className="legal-reveal mb-12 scroll-mt-20">
                <div className="mb-4 flex items-center gap-3">
                  <span className="font-mono text-[10px] tracking-[0.15em] text-[#C5A059]">03</span>
                  <span className="h-px w-6 bg-[#C5A059]/40" />
                </div>
                <h2 className="text-2xl font-medium tracking-[-0.03em] sm:text-3xl mb-4">How We Use Your Information</h2>
                <p className="text-[15px] leading-[1.85] text-[#15201A]/70 mb-4">We use your personal information for the following purposes:</p>
                <ul className="space-y-2">
                  {[
                    "Responding to your enquiries and providing information about our projects",
                    "Processing project interest submissions and scheduling site visits",
                    "Sending project updates, marketing materials, and relevant communications (with your consent)",
                    "Improving our website content, user experience, and service offerings",
                    "Analyzing website usage patterns to optimize performance and navigation",
                    "Complying with legal obligations and protecting our legitimate business interests",
                    "Maintaining records of communication for customer service and dispute resolution",
                  ].map((item, i) => (
                    <li key={i} className="flex items-start gap-3 text-[14px] leading-[1.75] text-[#15201A]/60">
                      <span className="mt-2 h-1 w-1 flex-shrink-0 rounded-full bg-[#C5A059]" />
                      {item}
                    </li>
                  ))}
                </ul>
              </div>

              {/* 04 — Cookies */}
              <div id="cookies" className="legal-reveal mb-12 scroll-mt-20">
                <div className="mb-4 flex items-center gap-3">
                  <span className="font-mono text-[10px] tracking-[0.15em] text-[#C5A059]">04</span>
                  <span className="h-px w-6 bg-[#C5A059]/40" />
                </div>
                <h2 className="text-2xl font-medium tracking-[-0.03em] sm:text-3xl mb-4">Cookies & Tracking Technologies</h2>
                <p className="text-[15px] leading-[1.85] text-[#15201A]/70">
                  Our website uses cookies and similar tracking technologies to enhance your browsing experience, analyze traffic, and understand how visitors interact with our content. Cookies are small text files stored on your device.
                </p>
                <p className="mt-4 text-[15px] leading-[1.85] text-[#15201A]/70">
                  You can control and manage cookies through your browser settings. Disabling cookies may affect some features of the website. We do not use cookies to collect sensitive personal information.
                </p>
              </div>

              {/* 05 — Data Sharing */}
              <div id="data-sharing" className="legal-reveal mb-12 scroll-mt-20">
                <div className="mb-4 flex items-center gap-3">
                  <span className="font-mono text-[10px] tracking-[0.15em] text-[#C5A059]">05</span>
                  <span className="h-px w-6 bg-[#C5A059]/40" />
                </div>
                <h2 className="text-2xl font-medium tracking-[-0.03em] sm:text-3xl mb-4">Data Sharing & Third Parties</h2>
                <p className="text-[15px] leading-[1.85] text-[#15201A]/70">
                  We do not sell, trade, or rent your personal information to third parties. We may share your information with:
                </p>
                <ul className="mt-4 space-y-2">
                  {[
                    "Service providers and contractors who assist with website hosting, analytics, and customer communications",
                    "Legal authorities when required by law, court order, or government regulation",
                    "Business partners within the Sampan Group network for project-related coordination (with your consent)",
                  ].map((item, i) => (
                    <li key={i} className="flex items-start gap-3 text-[14px] leading-[1.75] text-[#15201A]/60">
                      <span className="mt-2 h-1 w-1 flex-shrink-0 rounded-full bg-[#C5A059]" />
                      {item}
                    </li>
                  ))}
                </ul>
              </div>

              {/* 06 — Data Security */}
              <div id="data-security" className="legal-reveal mb-12 scroll-mt-20">
                <div className="mb-4 flex items-center gap-3">
                  <span className="font-mono text-[10px] tracking-[0.15em] text-[#C5A059]">06</span>
                  <span className="h-px w-6 bg-[#C5A059]/40" />
                </div>
                <h2 className="text-2xl font-medium tracking-[-0.03em] sm:text-3xl mb-4">Data Security</h2>
                <p className="text-[15px] leading-[1.85] text-[#15201A]/70">
                  We implement appropriate technical and organizational security measures to protect your personal information from unauthorized access, alteration, disclosure, or destruction. These measures include access controls, encryption, secure servers, and regular security assessments.
                </p>
                <p className="mt-4 text-[15px] leading-[1.85] text-[#15201A]/70">
                  However, no method of transmission over the internet or electronic storage is 100% secure. We cannot guarantee absolute security but are committed to maintaining best practices in data protection.
                </p>
              </div>

              {/* 07 — Your Rights */}
              <div id="your-rights" className="legal-reveal mb-12 scroll-mt-20">
                <div className="mb-4 flex items-center gap-3">
                  <span className="font-mono text-[10px] tracking-[0.15em] text-[#C5A059]">07</span>
                  <span className="h-px w-6 bg-[#C5A059]/40" />
                </div>
                <h2 className="text-2xl font-medium tracking-[-0.03em] sm:text-3xl mb-4">Your Rights</h2>
                <p className="text-[15px] leading-[1.85] text-[#15201A]/70 mb-4">You have the following rights regarding your personal information:</p>
                <ul className="space-y-2">
                  {[
                    "Access: Request a copy of the personal information we hold about you",
                    "Correction: Request correction of inaccurate or incomplete information",
                    "Deletion: Request deletion of your personal data (subject to legal requirements)",
                    "Opt-out: Unsubscribe from marketing communications at any time",
                    "Data portability: Request your data in a structured, machine-readable format",
                  ].map((item, i) => (
                    <li key={i} className="flex items-start gap-3 text-[14px] leading-[1.75] text-[#15201A]/60">
                      <span className="mt-2 h-1 w-1 flex-shrink-0 rounded-full bg-[#C5A059]" />
                      {item}
                    </li>
                  ))}
                </ul>
                <p className="mt-4 text-[15px] leading-[1.85] text-[#15201A]/70">
                  To exercise any of these rights, please contact us at <a href="mailto:info@sampangroup.com.bd" className="text-[#C5A059] underline underline-offset-2">info@sampangroup.com.bd</a>.
                </p>
              </div>

              {/* 08 — Children */}
              <div id="children" className="legal-reveal mb-12 scroll-mt-20">
                <div className="mb-4 flex items-center gap-3">
                  <span className="font-mono text-[10px] tracking-[0.15em] text-[#C5A059]">08</span>
                  <span className="h-px w-6 bg-[#C5A059]/40" />
                </div>
                <h2 className="text-2xl font-medium tracking-[-0.03em] sm:text-3xl mb-4">Children&apos;s Privacy</h2>
                <p className="text-[15px] leading-[1.85] text-[#15201A]/70">
                  Our website and services are intended for individuals aged 18 and above. We do not knowingly collect personal information from children under 18. If you believe a child has provided us with personal information, please contact us immediately, and we will take steps to delete such information.
                </p>
              </div>

              {/* 09 — Changes */}
              <div id="changes" className="legal-reveal mb-12 scroll-mt-20">
                <div className="mb-4 flex items-center gap-3">
                  <span className="font-mono text-[10px] tracking-[0.15em] text-[#C5A059]">09</span>
                  <span className="h-px w-6 bg-[#C5A059]/40" />
                </div>
                <h2 className="text-2xl font-medium tracking-[-0.03em] sm:text-3xl mb-4">Changes to This Policy</h2>
                <p className="text-[15px] leading-[1.85] text-[#15201A]/70">
                  We may update this Privacy Policy from time to time to reflect changes in our practices, legal requirements, or operational changes. We will post the updated policy on this page and update the &ldquo;Last updated&rdquo; date. We encourage you to review this page periodically.
                </p>
              </div>

              {/* 10 — Contact */}
              <div id="contact" className="legal-reveal mb-12 scroll-mt-20">
                <div className="mb-4 flex items-center gap-3">
                  <span className="font-mono text-[10px] tracking-[0.15em] text-[#C5A059]">10</span>
                  <span className="h-px w-6 bg-[#C5A059]/40" />
                </div>
                <h2 className="text-2xl font-medium tracking-[-0.03em] sm:text-3xl mb-4">Contact Us</h2>
                <p className="text-[15px] leading-[1.85] text-[#15201A]/70 mb-4">
                  If you have any questions, concerns, or requests regarding this Privacy Policy or your personal data, please contact us:
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