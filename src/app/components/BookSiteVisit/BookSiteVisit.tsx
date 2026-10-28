// app/components/BookSiteVisit.tsx
"use client";

import { useLayoutEffect, useRef, useState, FormEvent } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

type FormState = {
  name: string;
  contact: string;
  project: string;
  date: string;
  message: string;
  abroad: boolean;
};

const EMPTY: FormState = {
  name: "",
  contact: "",
  project: "",
  date: "",
  message: "",
  abroad: false,
};

const PROJECT_OPTIONS = [
  "Sampan Metro Square",
  "Sampan Condominium",
  "Sampan Trade Emporium",
  "All three highway projects",
];

export default function BookSiteVisit() {
  const sectionRef = useRef<HTMLElement>(null);
  const [form, setForm] = useState<FormState>(EMPTY);
  const [submitted, setSubmitted] = useState(false);
  const [errors, setErrors] = useState<Partial<Record<keyof FormState, string>>>({});

  useLayoutEffect(() => {
    gsap.registerPlugin(ScrollTrigger);

    const ctx = gsap.context(() => {
      const mm = gsap.matchMedia();

      mm.add("(min-width: 768px) and (prefers-reduced-motion: no-preference)", () => {
        gsap.set(".anim-headline", { yPercent: 110 });
        gsap.set(".anim-fade", { opacity: 0, y: 40 });
        gsap.set(".anim-line-draw", { scaleX: 0, transformOrigin: "left" });
        gsap.set(".anim-eyebrow", { opacity: 0, x: -20 });
        gsap.set(".anim-form", { opacity: 0, y: 60 });
        gsap.set(".anim-aside", { opacity: 0, x: 40 });

        const tl = gsap.timeline({
          scrollTrigger: {
            trigger: sectionRef.current,
            start: "top 75%",
            end: "top 25%",
            scrub: 1,
          }
        });

        tl.to(".anim-eyebrow", { opacity: 1, x: 0, ease: "power3.out", duration: 0.4 }, 0)
          .to(".anim-headline", { yPercent: 0, ease: "power4.out", duration: 0.6, stagger: 0.1 }, 0.1)
          .to(".anim-fade", { opacity: 1, y: 0, ease: "power3.out", duration: 0.6, stagger: 0.08 }, 0.3)
          .to(".anim-line-draw", { scaleX: 1, ease: "power2.out", duration: 0.5, stagger: 0.05 }, 0.5)
          .to(".anim-aside", { opacity: 1, x: 0, ease: "power3.out", duration: 0.8 }, 0.4)
          .to(".anim-form", { opacity: 1, y: 0, ease: "power3.out", duration: 0.8 }, 0.5);
      });

      mm.add("(max-width: 767px) and (prefers-reduced-motion: no-preference)", () => {
        gsap.set(".anim-eyebrow, .anim-headline, .anim-fade, .anim-line-draw, .anim-form, .anim-aside", {
          opacity: 0,
          y: 30,
        });

        const tl = gsap.timeline({
          scrollTrigger: {
            trigger: sectionRef.current,
            start: "top 80%",
            end: "top 40%",
            scrub: 1,
          }
        });

        tl.to(".anim-eyebrow", { opacity: 1, y: 0, ease: "power3.out", duration: 0.5 }, 0)
          .to(".anim-headline", { opacity: 1, y: 0, ease: "power4.out", duration: 0.6, stagger: 0.08 }, 0.1)
          .to(".anim-fade", { opacity: 1, y: 0, ease: "power3.out", duration: 0.5, stagger: 0.06 }, 0.3)
          .to(".anim-line-draw", { scaleX: 1, ease: "power2.out", duration: 0.5, stagger: 0.04 }, 0.4)
          .to(".anim-aside", { opacity: 1, y: 0, ease: "power3.out", duration: 0.6 }, 0.5)
          .to(".anim-form", { opacity: 1, y: 0, ease: "power3.out", duration: 0.6 }, 0.6);
      });

      mm.add("(prefers-reduced-motion: reduce)", () => {
        gsap.set(".anim-eyebrow, .anim-headline, .anim-fade, .anim-line-draw, .anim-form, .anim-aside", { clearProps: "all" });
      });
    }, sectionRef);

    return () => ctx.revert();
  }, []);

  // --- Success state entrance animation ---
  useLayoutEffect(() => {
    if (!submitted) return;
    const ctx = gsap.context(() => {
      gsap.fromTo(".success-card",
        { opacity: 0, y: 30, scale: 0.98 },
        { opacity: 1, y: 0, scale: 1, duration: 0.8, ease: "power3.out" }
      );
      gsap.fromTo(".success-check",
        { scale: 0, rotate: -45 },
        { scale: 1, rotate: 0, duration: 0.6, ease: "back.out(1.7)", delay: 0.2 }
      );
      gsap.fromTo(".success-line",
        { scaleX: 0 },
        { scaleX: 1, duration: 0.5, ease: "power2.out", delay: 0.4, stagger: 0.1, transformOrigin: "left" }
      );
    });
    return () => ctx.revert();
  }, [submitted]);

  const validate = (): boolean => {
    const next: Partial<Record<keyof FormState, string>> = {};
    if (!form.name.trim()) next.name = "Please enter your name";
    if (!form.contact.trim()) next.contact = "Phone or WhatsApp is required";
    else if (!/^[+\d\s()-]{6,}$/.test(form.contact.trim())) next.contact = "Enter a valid number";
    if (!form.project) next.project = "Select a project";
    if (!form.date) next.date = "Pick a preferred date";
    setErrors(next);
    return Object.keys(next).length === 0;
  };

  const handleSubmit = (e: FormEvent) => {
    e.preventDefault();
    if (!validate()) return;
    setSubmitted(true);
  };

  const resetForm = () => {
    setForm(EMPTY);
    setErrors({});
    setSubmitted(false);
  };

  const update = (key: keyof FormState, value: string | boolean) => {
    setForm((f) => ({ ...f, [key]: value }));
    if (errors[key]) setErrors((e) => ({ ...e, [key]: undefined }));
  };

  const fieldBase =
    "w-full bg-transparent border-b py-3 sm:py-4 text-sm sm:text-base text-[#101615] placeholder-[#101615]/30 focus:outline-none transition-colors duration-300";
  const fieldIdle = "border-[#101615]/15 focus:border-[#009D4E]";
  const fieldError = "border-red-500/60 focus:border-red-500";

  return (
    <section
      ref={sectionRef}
      className="relative w-full overflow-hidden bg-[#F5F3EE] font-lux-sans antialiased"
    >
      {/* Ambient Texture */}
      <div className="pointer-events-none absolute inset-0 opacity-50">
        <div className="absolute -top-32 -right-32 h-[500px] w-[500px] rounded-full bg-[radial-gradient(circle,_rgba(198,160,107,0.12)_0%,_transparent_70%)] blur-3xl"></div>
        <div className="absolute -bottom-32 -left-32 h-[500px] w-[500px] rounded-full bg-[radial-gradient(circle,_rgba(198,160,107,0.08)_0%,_transparent_70%)] blur-3xl"></div>
      </div>

      {/* Kinetic Background Typography */}
      <div className="pointer-events-none absolute top-1/2 left-0 w-full -translate-y-1/2 overflow-hidden whitespace-nowrap opacity-[0.03]">
        <span className="font-lux-serif text-[18vw] leading-none text-[#101615] pr-8">SITE VISIT</span>
      </div>

      {/* Main Container */}
      <div className="relative z-10 mx-auto max-w-[1440px] px-5 sm:px-6 md:px-12 lg:px-24 py-20 md:py-32">
        <div className="grid grid-cols-1 gap-12 lg:grid-cols-12 lg:gap-20">

          {/* LEFT: Narrative + Aside */}
          <div className="lg:col-span-5 flex flex-col">
            {/* Eyebrow */}
            <div className="anim-eyebrow flex items-center gap-4 mb-8">
              <span className="block h-[1.5px] w-12 bg-[#009D4E]"></span>
              <span className="text-[10px] md:text-[11px] font-medium uppercase tracking-[0.4em] text-[#009D4E]">
                Site Visit
              </span>
            </div>

            {/* Headline */}
            <h2 className="font-lux-serif text-[clamp(2.5rem,7vw,5.5rem)] leading-[0.95] tracking-[-0.03em] mb-8 text-[#101615]">
              <span className="block overflow-hidden pb-2">
                <span className="anim-headline block font-light">See the land</span>
              </span>
              <span className="block overflow-hidden pb-2">
                <span className="anim-headline block italic font-normal text-[#009D4E]">before you decide.</span>
              </span>
            </h2>

            {/* Copy */}
            <p className="anim-fade max-w-md text-sm sm:text-base md:text-lg text-[#101615]/70 font-light leading-relaxed mb-12">
              Tell us which project and when. Our team will confirm by phone or WhatsApp and arrange the visit.
            </p>

            {/* Asidewhat to expect */}
            <div className="anim-aside mt-auto border-t border-[#101615]/10 pt-8">
              <div className="mb-6 flex items-baseline gap-4">
                <span className="font-lux-serif text-3xl md:text-4xl font-light italic text-[#009D4E]">03</span>
                <span className="text-[10px] uppercase tracking-[0.3em] text-[#101615]/40">Steps to Your Visit</span>
              </div>

              <ul className="flex flex-col gap-5">
                {[
                  { n: "01", title: "Send your request", detail: "Pick a project, date, and leave a note." },
                  { n: "02", title: "We confirm within a working day", detail: "Phone or WhatsAppwhichever you prefer." },
                  { n: "03", title: "Visit the site with our team", detail: "Walk the land. Ask everything. Decide in your own time." },
                ].map((step, i) => (
                  <li key={i} className="group flex items-start gap-5">
                    <span className="anim-line-draw block h-px w-10 flex-shrink-0 bg-[#009D4E] mt-4"></span>
                    <div className="flex-1">
                      <div className="flex items-baseline gap-3 mb-1">
                        <span className="anim-fade text-[10px] font-medium uppercase tracking-[0.3em] text-[#009D4E]">{step.n}</span>
                        <span className="anim-fade font-lux-serif text-lg md:text-xl font-light text-[#101615]">{step.title}</span>
                      </div>
                      <p className="anim-fade text-xs md:text-sm text-[#101615]/50 font-light">{step.detail}</p>
                    </div>
                  </li>
                ))}
              </ul>
            </div>
          </div>

          {/* RIGHT: Form / Success */}
          <div className="lg:col-span-7">
            <div className="anim-form relative">
              {!submitted ? (
                <form
                  onSubmit={handleSubmit}
                  noValidate
                  className="relative bg-[#101615] px-5 py-10 sm:px-10 sm:py-12 md:px-14 md:py-16"
                >
                  {/* Decorative corner */}
                  <div className="absolute top-0 right-0 h-16 w-16 border-t border-r border-[#009D4E]/30"></div>
                  <div className="absolute bottom-0 left-0 h-16 w-16 border-b border-l border-[#009D4E]/30"></div>

                  <div className="mb-8 md:mb-12">
                    <span className="text-[10px] uppercase tracking-[0.4em] text-[#009D4E]">Request Form</span>
                    <h3 className="mt-2 font-lux-serif text-2xl md:text-3xl font-light text-[#F5F3EE]">
                      Schedule your visit
                    </h3>
                  </div>

                  <div className="grid grid-cols-1 gap-6 sm:gap-8 sm:grid-cols-2">
                    {/* Name */}
                    <div className="sm:col-span-1">
                      <label className="block text-[10px] uppercase tracking-[0.3em] text-[#F5F3EE]/40 mb-2">
                        Full Name *
                      </label>
                      <input
                        type="text"
                        value={form.name}
                        onChange={(e) => update("name", e.target.value)}
                        placeholder="Your name"
                        className={`${fieldBase} ${errors.name ? fieldError : fieldIdle} text-[#F5F3EE] border-[#F5F3EE]/15 placeholder-[#F5F3EE]/25`}
                      />
                      {errors.name && <p className="mt-2 text-xs text-red-400">{errors.name}</p>}
                    </div>

                    {/* Phone */}
                    <div className="sm:col-span-1">
                      <label className="block text-[10px] uppercase tracking-[0.3em] text-[#F5F3EE]/40 mb-2">
                        Phone or WhatsApp *
                      </label>
                      <input
                        type="tel"
                        value={form.contact}
                        onChange={(e) => update("contact", e.target.value)}
                        placeholder="+880 1XXX-XXXXXX"
                        className={`${fieldBase} ${errors.contact ? fieldError : fieldIdle} text-[#F5F3EE] border-[#F5F3EE]/15 placeholder-[#F5F3EE]/25`}
                      />
                      {errors.contact && <p className="mt-2 text-xs text-red-400">{errors.contact}</p>}
                    </div>

                    {/* Project Select */}
                    <div className="sm:col-span-2">
                      <label className="block text-[10px] uppercase tracking-[0.3em] text-[#F5F3EE]/40 mb-2">
                        Project *
                      </label>
                      <div className="relative">
                        <select
                          value={form.project}
                          onChange={(e) => update("project", e.target.value)}
                          className={`w-full appearance-none bg-transparent border-b py-3 sm:py-4 text-sm sm:text-base text-[#F5F3EE] focus:outline-none transition-colors duration-300 pr-10 ${
                            errors.project ? fieldError : "border-[#F5F3EE]/15 focus:border-[#009D4E]"
                          } ${form.project === "" ? "text-[#F5F3EE]/30" : ""}`}
                        >
                          <option value="" disabled className="bg-[#101615] text-[#F5F3EE]/50">Select a project</option>
                          {PROJECT_OPTIONS.map((opt) => (
                            <option key={opt} value={opt} className="bg-[#101615] text-[#F5F3EE]">
                              {opt}
                            </option>
                          ))}
                        </select>
                        <svg className="pointer-events-none absolute right-2 top-1/2 -translate-y-1/2 h-4 w-4 text-[#009D4E]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" d="M19 9l-7 7-7-7"></path>
                        </svg>
                      </div>
                      {errors.project && <p className="mt-2 text-xs text-red-400">{errors.project}</p>}
                    </div>

                    {/* Preferred Date */}
                    <div className="sm:col-span-2">
                      <label className="block text-[10px] uppercase tracking-[0.3em] text-[#F5F3EE]/40 mb-2">
                        Preferred Date *
                      </label>
                      <input
                        type="date"
                        value={form.date}
                        onChange={(e) => update("date", e.target.value)}
                        className={`w-full bg-transparent border-b py-3 sm:py-4 text-sm sm:text-base text-[#F5F3EE] focus:outline-none transition-colors duration-300 [color-scheme:dark] ${
                          errors.date ? fieldError : "border-[#F5F3EE]/15 focus:border-[#009D4E]"
                        }`}
                      />
                      {errors.date && <p className="mt-2 text-xs text-red-400">{errors.date}</p>}
                    </div>

                    {/* Message */}
                    <div className="sm:col-span-2">
                      <label className="block text-[10px] uppercase tracking-[0.3em] text-[#F5F3EE]/40 mb-2">
                        Message
                      </label>
                      <textarea
                        value={form.message}
                        onChange={(e) => update("message", e.target.value)}
                        rows={3}
                        placeholder="Anything we should know before the visit?"
                        className="w-full resize-none bg-transparent border-b py-3 sm:py-4 text-sm sm:text-base text-[#F5F3EE] placeholder-[#F5F3EE]/25 border-[#F5F3EE]/15 focus:border-[#009D4E] focus:outline-none transition-colors duration-300"
                      />
                    </div>

                    {/* Abroad Checkbox */}
                    <div className="sm:col-span-2">
                      <label className="group flex cursor-pointer items-start gap-4 select-none">
                        <span className="relative mt-1 flex h-5 w-5 flex-shrink-0 items-center justify-center border border-[#F5F3EE]/30 transition-colors duration-300 group-hover:border-[#009D4E]">
                          <input
                            type="checkbox"
                            checked={form.abroad}
                            onChange={(e) => update("abroad", e.target.checked)}
                            className="peer absolute h-full w-full cursor-pointer opacity-0"
                          />
                          <svg
                            className="h-3 w-3 scale-0 text-[#009D4E] transition-transform duration-300 peer-checked:scale-100"
                            fill="none"
                            stroke="currentColor"
                            viewBox="0 0 24 24"
                          >
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M5 13l4 4L19 7"></path>
                          </svg>
                        </span>
                        <span className="text-xs sm:text-sm text-[#F5F3EE]/70 font-light leading-relaxed">
                          I live abroadplease coordinate over WhatsApp and accommodate timezone differences.
                        </span>
                      </label>
                    </div>
                  </div>

                  {/* Submit */}
                  <div className="mt-10 md:mt-12">
                    <button
                      type="submit"
                      className="group relative inline-flex w-full items-center justify-center gap-3 overflow-hidden bg-[#009D4E] px-8 py-5 text-[10px] sm:text-[11px] font-semibold uppercase tracking-[0.3em] text-[#101615] transition-colors duration-500 hover:text-[#009D4E] sm:w-auto"
                    >
                      <span className="absolute inset-0 z-0 translate-y-full bg-[#F5F3EE] transition-transform duration-500 ease-[cubic-bezier(0.22,1,0.36,1)] group-hover:translate-y-0"></span>
                      <span className="relative z-10 flex items-center gap-3">
                        Confirm Request
                        <svg className="h-4 w-4 transition-transform duration-300 group-hover:translate-x-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" d="M14 5l7 7m0 0l-7 7m7-7H3"></path>
                        </svg>
                      </span>
                    </button>
                  </div>

                  {/* Privacy note */}
                  <p className="mt-6 text-[10px] uppercase tracking-[0.2em] text-[#F5F3EE]/30">
                    We reply within one working day · Your details stay private
                  </p>
                </form>
              ) : (
                <div className="success-card relative bg-[#101615] px-5 py-12 sm:px-10 sm:py-16 md:px-14 md:py-20 text-center">
                  {/* Decorative corners */}
                  <div className="absolute top-0 left-0 h-16 w-16 border-t border-l border-[#009D4E]/40"></div>
                  <div className="absolute bottom-0 right-0 h-16 w-16 border-b border-r border-[#009D4E]/40"></div>

                  {/* Animated check */}
                  <div className="success-check mx-auto mb-8 flex h-20 w-20 items-center justify-center rounded-full border border-[#009D4E]/40">
                    <div className="flex h-14 w-14 items-center justify-center rounded-full bg-[#009D4E]">
                      <svg className="h-7 w-7 text-[#101615]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M5 13l4 4L19 7"></path>
                      </svg>
                    </div>
                  </div>

                  <span className="block text-[10px] uppercase tracking-[0.4em] text-[#009D4E] mb-4">
                    Request Received
                  </span>

                  <h3 className="font-lux-serif text-3xl md:text-4xl font-light text-[#F5F3EE] mb-2">
                    Thanks, <span className="italic text-[#009D4E]">{form.name.split(" ")[0] || "friend"}</span>.
                  </h3>

                  <div className="success-line mx-auto mb-8 h-px w-16 bg-[#009D4E] origin-left"></div>

                  <p className="mx-auto max-w-md text-sm md:text-base text-[#F5F3EE]/70 font-light leading-relaxed">
                    We have your request for{" "}
                    <span className="text-[#009D4E]">{form.project}</span> and will contact you on{" "}
                    <span className="text-[#009D4E]">{form.contact}</span> within{" "}
                    <span className="text-[#009D4E]">one working day</span>.
                  </p>

                  <button
                    onClick={resetForm}
                    className="group mt-10 inline-flex items-center gap-3 text-[10px] font-semibold uppercase tracking-[0.3em] text-[#F5F3EE]/60 transition-colors duration-300 hover:text-[#009D4E]"
                  >
                    <svg className="h-4 w-4 transition-transform duration-300 group-hover:-translate-x-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" d="M10 19l-7-7m0 0l7-7m-7 7h18"></path>
                    </svg>
                    Send another request
                  </button>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Bottom Section Index Marker */}
        {/* <div className="mt-16 md:mt-24 flex items-center justify-between text-[10px] uppercase tracking-[0.3em] text-[#101615]/40">
          <span>14 / Visit</span>
          <span className="hidden sm:inline">Sampan Development Ltd.</span>
        </div> */}
      </div>

      {/* Global Styles Required for Typography */}
      <style jsx global>{`
        @import url('https://fonts.googleapis.com/css2?family=Cormorant+Garamond:ital,wght@0,300;0,400;0,500;0,600;1,300;1,400;1,500&family=Inter:wght@300;400;500;600&display=swap');

        .font-lux-serif {
          font-family: 'Cormorant Garamond', serif;
        }
        .font-lux-sans {
          font-family: 'Inter', sans-serif;
        }

        /* Hide default date picker icon for cleaner underline look */
        input[type="date"]::-webkit-calendar-picker-indicator {
          filter: invert(0.7);
          cursor: pointer;
        }
      `}</style>
    </section>
  );
}