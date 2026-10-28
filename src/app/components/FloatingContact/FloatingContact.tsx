"use client";

import { useState, useEffect, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";

const smoothEase = [0.22, 1, 0.36, 1] as const;

const contactOptions = [
  {
    name: "Call",
    sub: "+880 1912 234588",
    href: "tel:+8801912234588",
    color: "#3B82F6", // Call blue
    external: false,
    Icon: () => (
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" className="h-4 w-4">
        <path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72 12.84 12.84 0 0 0 .7 2.81 2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45 12.84 12.84 0 0 0 2.81.7A2 2 0 0 1 22 16.92z" />
      </svg>
    ),
  },
  {
    name: "WhatsApp",
    sub: "Chat now",
    href: "https://wa.me/8801912234588",
    color: "#25D366", // WhatsApp green
    external: true,
    Icon: () => (
      <svg viewBox="0 0 24 24" fill="currentColor" className="h-4 w-4" aria-hidden="true">
        <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.149-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.149-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.323.298-.52.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.436 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.89-11.893a11.821 11.821 0 00-3.48-8.413Z" />
      </svg>
    ),
  },
  {
    name: "Email",
    sub: "Send a message",
    href: "mailto:info@sampangroup.com.bd",
    color: "#EA4335", // Gmail red
    external: false,
    Icon: () => (
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" className="h-4 w-4">
        <rect x="2" y="4" width="20" height="16" rx="0" />
        <path d="M2 6l10 7 10-7" />
      </svg>
    ),
  },
];

export default function FloatingContact() {
  const [isOpen, setIsOpen] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);

  /* Close on outside click */
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        containerRef.current &&
        !containerRef.current.contains(event.target as Node)
      ) {
        setIsOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  return (
    <div
      ref={containerRef}
      className="fixed bottom-6 right-6 z-[9000] flex items-center gap-2"
    >
      {/* ═══ Horizontal pill dock (expands leftward) ═══ */}
      <AnimatePresence mode="popLayout">
        {isOpen &&
          contactOptions.map((option, i) => {
            const Icon = option.Icon;
            return (
              <motion.a
                key={option.name}
                href={option.href}
                target={option.external ? "_blank" : undefined}
                rel={option.external ? "noopener noreferrer" : undefined}
                layout
                initial={{ opacity: 0, width: 0, scale: 0.6 }}
                animate={{
                  opacity: 1,
                  width: "auto",
                  scale: 1,
                  transition: { delay: i * 0.06, duration: 0.4, ease: smoothEase },
                }}
                exit={{
                  opacity: 0,
                  width: 0,
                  scale: 0.6,
                  transition: { duration: 0.25, ease: smoothEase },
                }}
                className="group relative flex h-12 items-center gap-2.5 overflow-hidden rounded-full pl-1.5 pr-4 text-white"
                style={{
                  background: option.color,
                  boxShadow: `0 6px 18px ${option.color}55, inset 0 1px 0 rgba(255,255,255,0.2)`,
                }}
                aria-label={option.name}
              >
                {/* Icon disc (semi-transparent white) */}
                <span className="relative flex h-9 w-9 flex-shrink-0 items-center justify-center rounded-full bg-white/15 backdrop-blur-sm">
                  <Icon />
                </span>

                {/* Label (hidden on small screens to save horizontal space) */}
                <div className="hidden flex-col leading-tight sm:flex">
                  <span className="text-[8px] font-semibold uppercase tracking-[0.25em] text-white/80">
                    {option.name}
                  </span>
                  <span className="whitespace-nowrap text-[11px] font-medium text-white">
                    {option.sub}
                  </span>
                </div>

                {/* Hover sweep sheen */}
                <span
                  aria-hidden="true"
                  className="pointer-events-none absolute inset-0 -translate-x-full bg-gradient-to-r from-transparent via-white/25 to-transparent transition-transform duration-700 ease-out group-hover:translate-x-full"
                />
              </motion.a>
            );
          })}
      </AnimatePresence>

      {/* ═══ Toggle pill ═══ */}
      <motion.button
        onClick={() => setIsOpen(!isOpen)}
        whileTap={{ scale: 0.94 }}
        className="group relative flex h-12 items-center gap-2.5 overflow-hidden rounded-full border border-[#007DC5]/45 bg-[#071018] px-5 text-white backdrop-blur-md transition-colors duration-300 hover:border-[#007DC5]/90"
        style={{ boxShadow: "0 8px 24px rgba(0, 125, 197, 0.3)" }}
        aria-label={isOpen ? "Close contact options" : "Open contact options"}
      >
        {/* Inner gradient sheen */}
        <span
          aria-hidden="true"
          className="pointer-events-none absolute inset-0 bg-gradient-to-r from-[#007DC5]/10 via-transparent to-[#007DC5]/10"
        />

        {/* Pulsing dot when closed (hint that there's more) */}
        {!isOpen && (
          <span className="absolute -right-0.5 -top-0.5 h-2.5 w-2.5 rounded-full bg-[#ef636b] ring-2 ring-[#071018] [animation:dockPulse_2s_ease-in-out_infinite]" />
        )}

        <AnimatePresence mode="wait" initial={false}>
          {isOpen ? (
            <motion.span
              key="close"
              initial={{ opacity: 0, y: 8 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -8 }}
              transition={{ duration: 0.2 }}
              className="relative flex items-center gap-2 text-[10px] font-bold uppercase tracking-[0.25em]"
            >
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="h-3.5 w-3.5">
                <line x1="18" y1="6" x2="6" y2="18" />
                <line x1="6" y1="6" x2="18" y2="18" />
              </svg>
              Close
            </motion.span>
          ) : (
            <motion.span
              key="open"
              initial={{ opacity: 0, y: 8 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -8 }}
              transition={{ duration: 0.2 }}
              className="relative flex items-center gap-2 text-[10px] font-bold uppercase tracking-[0.25em]"
            >
              <span
                className="h-1.5 w-1.5 rounded-full"
                style={{ background: "#007DC5" }}
              />
              Get in touch
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="h-3.5 w-3.5 transition-transform duration-300 group-hover:rotate-45">
                <path d="M14 5l7 7m0 0l-7 7m7-7H3" />
              </svg>
            </motion.span>
          )}
        </AnimatePresence>
      </motion.button>

      {/* Keyframes */}
      <style>{`
        @keyframes dockPulse {
          0%, 100% { opacity: 1; transform: scale(1); }
          50% { opacity: 0.5; transform: scale(0.75); }
        }
      `}</style>
    </div>
  );
}