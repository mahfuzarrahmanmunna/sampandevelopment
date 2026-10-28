"use client";

import Link from "next/link";
import { useLayoutEffect, useRef, useState } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import type { CSSProperties, ReactNode } from "react";

gsap.registerPlugin(ScrollTrigger);

// ─── types ───────────────────────────────────────────────────────────────────
type RecordValue = Record<string, unknown>;
type Project = {
  id?: string | number | null;
  slug: string;
  projectName: string;
  shortName?: string | null;
  brandName?: string | null;
  projectType?: string | null;
  category?: string | null;
  status?: string | null;
  contentStatus?: string | null;
  shortDescription?: string | null;
  longDescription?: string | null;
  tagline?: string | null;
  hero?: RecordValue | null;
  theme?: RecordValue | null;
  location?: RecordValue | null;
  overview?: RecordValue | null;
  specifications?: RecordValue[] | null;
  sections?: RecordValue[] | null;
  gallery?: RecordValue | null;
  faq?: RecordValue[] | null;
  relatedProjects?: (string | RecordValue)[] | null;
  ctas?: RecordValue[] | null;
  seo?: RecordValue | null;
  socialSharing?: RecordValue | null;
  [key: string]: unknown;
};

// ─── value helpers ───────────────────────────────────────────────────────────
const str = (v: unknown): string =>
  typeof v === "string" ? v.trim() : typeof v === "number" ? String(v) : "";
const arr = (v: unknown): RecordValue[] =>
  Array.isArray(v) ? v.filter((i): i is RecordValue => !!i && typeof i === "object") : [];
const items = (v: unknown): unknown[] => (Array.isArray(v) ? v : []);
const has = (v: unknown): boolean =>
  v !== null && v !== undefined && v !== "" && v !== false;
const bool = (v: unknown, fallback = false): boolean => {
  if (v === undefined || v === null) return fallback;
  return v !== false;
};
const hrefFor = (v: unknown) => {
  const href = str(v);
  return href.startsWith("/") || href.startsWith("#") || href.startsWith("https://") ||
    href.startsWith("mailto:") || href.startsWith("tel:")
    ? href
    : "#enquiry";
};
const pad = (n: number) => String(n).padStart(2, "0");
const titleCase = (s: string) => s.replace(/[-_]/g, " ").replace(/\b\w/g, (m) => m.toUpperCase());
const projectInitial = (name?: string | null): string =>
  (str(name) || "S").charAt(0).toUpperCase();

// ─── theme ────────────────────────────────────────────────────────────────────
type Theme = {
  primary: string;
  accent: string;
  background: string;
  surface: string;
  text: string;
  muted: string;
  border: string;
  gradient: string;
  secondary: string;
};

function getTheme(project: Project): Theme {
  const t = (project.theme || {}) as RecordValue;
  return {
    primary: str(t.primary) || "#15201a",
    accent: str(t.accent) || "#b89656",
    background: str(t.background) || "#f7f4ec",
    surface: str(t.surface) || "#ffffff",
    text: str(t.text) || "#15201a",
    muted: str(t.mutedText) || "#5c655c",
    border: str(t.border) || "#d9d2c1",
    gradient: str(t.gradient) || `linear-gradient(135deg, ${str(t.primary)} 0%, #0a0f0c 100%)`,
    secondary: str(t.secondary) || "#f0e9dc",
  };
}

// ─── Global animation keyframes ──────────────────────────────────────────────
const ANIMATION_STYLES = `
  @keyframes kenBurns {
    0% { transform: scale(1.05) translate(0, 0); }
    100% { transform: scale(1.18) translate(-1.5%, -1.5%); }
  }
  @keyframes drawLine {
    from { transform: scaleX(0); opacity: 0; }
    to { transform: scaleX(1); opacity: 1; }
  }
  @keyframes scrollBounce {
    0%, 100% { transform: translateY(0); opacity: 0.55; }
    50% { transform: translateY(6px); opacity: 1; }
  }
  @keyframes ambientDrift {
    0%, 100% { transform: translate(0, 0) scale(1); }
    50% { transform: translate(30px, -20px) scale(1.08); }
  }
`;

// ─── Scroll-triggered animation hook ─────────────────────────────────────────
function useScrollReveal(scopeRef: React.RefObject<HTMLElement | null>) {
  const [scrollProgress, setScrollProgress] = useState(0);

  useLayoutEffect(() => {
    const ctx = gsap.context(() => {
      // Hero entrance animations
      gsap.fromTo(".hero-eyebrow", { opacity: 0, y: 20 }, { opacity: 1, y: 0, duration: 0.8, ease: "power3.out", delay: 0.2 });
      gsap.fromTo(".hero-title", { opacity: 0, y: 40 }, { opacity: 1, y: 0, duration: 1.1, ease: "power4.out", delay: 0.35 });
      gsap.fromTo(".hero-subtitle", { opacity: 0, y: 30 }, { opacity: 1, y: 0, duration: 0.9, ease: "power3.out", delay: 0.55 });
      gsap.fromTo(".hero-description", { opacity: 0, y: 20 }, { opacity: 1, y: 0, duration: 0.8, ease: "power3.out", delay: 0.7 });
      gsap.fromTo(".hero-cta", { opacity: 0, y: 20 }, { opacity: 1, y: 0, duration: 0.7, ease: "power3.out", delay: 0.85, stagger: 0.1 });
      gsap.fromTo(".hero-meta", { opacity: 0, y: 15 }, { opacity: 1, y: 0, duration: 0.6, ease: "power3.out", delay: 1.0, stagger: 0.08 });
      gsap.fromTo(".hero-accent-line", { scaleX: 0, opacity: 0 }, { scaleX: 1, opacity: 1, duration: 1, ease: "power3.out", delay: 0.3 });

      // Scroll-triggered reveals
      gsap.utils.toArray<HTMLElement>(".reveal-up").forEach((el) => {
        gsap.fromTo(el, { opacity: 0, y: 40 }, {
          opacity: 1, y: 0, duration: 0.9, ease: "power3.out",
          scrollTrigger: { trigger: el, start: "top 88%", once: true },
        });
      });

      gsap.utils.toArray<HTMLElement>(".reveal-line").forEach((el) => {
        gsap.fromTo(el, { scaleX: 0, transformOrigin: "left" }, {
          scaleX: 1, duration: 1, ease: "power3.out",
          scrollTrigger: { trigger: el, start: "top 88%", once: true },
        });
      });

      // Corner bracket draw-in
      gsap.utils.toArray<HTMLElement>(".corner-bracket").forEach((el) => {
        gsap.fromTo(el, { scaleX: 0, scaleY: 0, transformOrigin: "center" }, {
          scaleX: 1, scaleY: 1, duration: 0.8, ease: "power3.out",
          scrollTrigger: { trigger: el.closest("section") || el, start: "top 80%", once: true },
        });
      });

      // Staggered card entrances
      gsap.utils.toArray<HTMLElement>(".stagger-card").forEach((group) => {
        const cards = group.querySelectorAll(".stagger-item");
        gsap.fromTo(cards, { opacity: 0, y: 50 }, {
          opacity: 1, y: 0, duration: 0.7, ease: "power3.out",
          stagger: 0.1,
          scrollTrigger: { trigger: group, start: "top 82%", once: true },
        });
      });

      // Parallax on images
      gsap.utils.toArray<HTMLElement>(".parallax-img").forEach((el) => {
        gsap.fromTo(el, { yPercent: -8 }, {
          yPercent: 8, ease: "none",
          scrollTrigger: { trigger: el, start: "top bottom", end: "bottom top", scrub: 1 },
        });
      });

      // Scroll progress tracker
      ScrollTrigger.create({
        trigger: scopeRef.current,
        start: "top top",
        end: "bottom bottom",
        onUpdate: (self) => setScrollProgress(self.progress),
      });
    }, scopeRef);
    return () => ctx.revert();
  }, []);

  return scrollProgress;
}

// ─── CompletedStamp ───────────────────────────────────────────────────────────
function CompletedStamp({ theme, onDark = false }: { theme: Theme; onDark?: boolean }) {
  return (
    <div
      className="inline-flex items-center gap-2.5 border px-4 py-2"
      style={{
        borderColor: onDark ? `${theme.accent}` : theme.accent,
        color: onDark ? theme.accent : theme.accent,
        background: onDark ? "rgba(255,255,255,0.04)" : "transparent",
        backdropFilter: onDark ? "blur(8px)" : undefined,
      }}
    >
      <svg className="h-3.5 w-3.5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
        <path strokeLinecap="round" strokeLinejoin="round" d="m5 13 4 4L19 7" />
      </svg>
      <span className="text-[10px] font-semibold uppercase tracking-[0.28em]">Completed Project</span>
    </div>
  );
}

// ─── ChapterMarker ────────────────────────────────────────────────────────────
function ChapterMarker({
  chapter,
  total,
  label,
  theme,
  onDark = false,
}: {
  chapter: string | number;
  total?: string | number;
  label?: string;
  theme: Theme;
  onDark?: boolean;
}) {
  return (
    <div className="reveal-up flex items-center gap-4" style={{ color: theme.accent }}>
      <span className="font-mono text-[11px] font-semibold tracking-[0.2em]">
        {typeof chapter === "number" ? pad(chapter) : chapter}
        {total !== undefined && (
          <span className="opacity-50"> / {typeof total === "number" ? pad(total) : total}</span>
        )}
      </span>
      <span className="reveal-line h-px w-6" style={{ background: theme.accent, opacity: 0.5 }} aria-hidden="true" />
      {label && (
        <span
          className="text-[10px] font-semibold uppercase tracking-[0.28em]"
          style={{ color: onDark ? "rgba(255,255,255,0.65)" : theme.muted }}
        >
          {label}
        </span>
      )}
    </div>
  );
}

// ─── ImagePanel (FIXED — uses <img> with onError fallback) ──────────────────
function ImagePanel({
  src,
  alt,
  className = "",
  theme,
  caption,
}: {
  src?: unknown;
  alt?: unknown;
  className?: string;
  theme: Theme;
  caption?: string;
}) {
  const image = str(src);
  const [imgLoaded, setImgLoaded] = useState(false);
  const [imgError, setImgError] = useState(false);

  const showImage = image && !imgError;

  return (
    <div
      className={`parallax-img relative overflow-hidden ${className}`}
      style={{
        backgroundColor: theme.primary,
        background: !showImage
          ? `linear-gradient(135deg, ${theme.primary} 0%, #0a0f0c 100%)`
          : undefined,
      }}
    >
      {/* Actual <img> tag — loads the image properly */}
      {showImage && (
        <img
          src={image}
          alt={str(alt) || "Project photograph"}
          className={`absolute inset-0 h-full w-full object-cover transition-opacity duration-500 ${
            imgLoaded ? "opacity-100" : "opacity-0"
          }`}
          onLoad={() => setImgLoaded(true)}
          onError={() => setImgError(true)}
        />
      )}

      {/* Loading placeholder — shows while image loads */}
      {showImage && !imgLoaded && (
        <div className="absolute inset-0 flex items-center justify-center">
          <div
            className="h-8 w-8 animate-spin rounded-full border-2 border-t-transparent"
            style={{
              borderColor: `${theme.accent} transparent ${theme.accent} ${theme.accent}`,
            }}
          />
        </div>
      )}

      {/* Fallback when no image or image failed to load */}
      {!showImage && (
        <div className="absolute inset-0 flex items-end p-7">
          <span className="text-[10px] uppercase tracking-[0.3em] text-white/40">
            {caption || "Project archive · Sampan Development"}
          </span>
        </div>
      )}
    </div>
  );
}

// ─── ArchiveHero (DARK CINEMATIC BANNER) ─────────────────────────────────────
function ArchiveHero({ project, theme }: { project: Project; theme: Theme }) {
  const hero = (project.hero || {}) as RecordValue;
  const location = (project.location || {}) as RecordValue;
  const heroImage = str(hero.backgroundImage || hero.image || hero.imageUrl);
  const title = str(hero.title) || project.projectName;
  const description = str(hero.description) || str(project.shortDescription) || "";
  const primaryCta = (hero.primaryCTA || arr(project.ctas)[0]) as RecordValue | undefined;
  const secondaryCta = (hero.secondaryCTA || arr(project.ctas)[1]) as RecordValue | undefined;

  const showLocation = bool(hero.showLocation, true);
  const showScrollIndicator = bool(hero.showScrollIndicator, true);

  const locationText =
    [str(location.area), str(location.city), str(location.country)].filter(Boolean).join(", ") ||
    str(location.address);

  return (
    <section
      className="relative isolate flex min-h-[92svh] flex-col overflow-hidden text-white md:min-h-[96svh]"
      style={{
        background: `${str(hero.overlay) || `linear-gradient(110deg, ${theme.primary}f2 0%, ${theme.primary}a0 50%, ${theme.primary}40 100%)`}, ${
          heroImage
            ? `url("${heroImage.replaceAll('"', "%22")}")`
            : theme.gradient
        }`,
        backgroundSize: "cover",
        backgroundPosition: str(hero.backgroundPosition) || "center",
      }}
    >
      {/* Ken Burns zoom on background */}
      <div
        className="absolute inset-0 -z-10 bg-cover bg-center"
        style={{
          backgroundImage: heroImage ? `url("${heroImage.replaceAll('"', "%22")}")` : undefined,
          animation: "kenBurns 30s ease-in-out infinite alternate",
        }}
      />

      {/* Vignette overlays for depth */}
      <div className="absolute inset-0 -z-10 bg-[linear-gradient(0deg,rgba(0,0,0,.65),transparent_50%)]" />
      <div className="absolute inset-0 -z-10 bg-[radial-gradient(ellipse_at_50%_100%,rgba(0,0,0,0.5),transparent_55%)]" />
      <div className="absolute inset-0 -z-10 bg-gradient-to-r from-[#0B0B0D] via-[#0B0B0D]/60 to-transparent" />

      {/* Subtle accent glow at top-right */}
      <div
        className="absolute -right-32 -top-32 -z-10 h-[40vw] w-[40vw] rounded-full opacity-20 blur-[120px]"
        style={{ background: theme.accent, animation: "ambientDrift 24s ease-in-out infinite" }}
      />

      {/* Film grain texture */}
      <div
        className="absolute inset-0 -z-10 opacity-[0.025] mix-blend-overlay pointer-events-none"
        style={{
          backgroundImage: "url(\"data:image/svg+xml,%3Csvg viewBox='0 0 200 200' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='3' /%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23n)' /%3E%3C/svg%3E\")",
          backgroundSize: "200px 200px",
        }}
      />

      {/* Architectural corner brackets */}
      <span className="corner-bracket pointer-events-none absolute left-6 top-6 z-30 h-10 w-10 border-l border-t border-white/20 sm:left-8 sm:top-8 sm:h-12 sm:w-12" />
      <span className="corner-bracket pointer-events-none absolute right-6 top-6 z-30 h-10 w-10 border-r border-t border-white/20 sm:right-8 sm:top-8 sm:h-12 sm:w-12" />
      <span className="corner-bracket pointer-events-none absolute bottom-6 left-6 z-30 h-10 w-10 border-b border-l border-white/20 sm:bottom-8 sm:left-8 sm:h-12 sm:w-12" />
      <span className="corner-bracket pointer-events-none absolute bottom-6 right-6 z-30 h-10 w-10 border-b border-r border-white/20 sm:bottom-8 sm:right-8 sm:h-12 sm:w-12" />

      {/* Main body */}
      <div className="mx-auto w-full max-w-[1600px] px-5 pb-16 pt-12 sm:px-8 md:px-12 md:pb-24 md:pt-24">
        <div className="max-w-5xl">
          <div className="hero-eyebrow mb-6 mt-20 flex items-center gap-3">
            <span className="hero-accent-line h-px w-10" style={{ background: theme.accent, opacity: 0 }} />
            <p
              className="text-[10px] font-semibold uppercase tracking-[0.32em]"
              style={{ color: theme.accent }}
            >
              {str(hero.eyebrow || project.brandName || "Sampan Development")}
            </p>
          </div>

          <h1 className="hero-title max-w-5xl text-balance text-5xl font-medium leading-[0.98] tracking-[-0.06em] sm:text-6xl md:text-7xl lg:text-[clamp(4rem,7.5vw,8rem)]">
            {title}
          </h1>

          {(str(project.tagline) || str(hero.highlight)) && (
            <p className="hero-subtitle mt-7 max-w-2xl text-xl font-light leading-[1.45] text-white/90 sm:text-2xl md:text-[1.6rem]">
              {str(hero.highlight) || str(project.tagline)}
            </p>
          )}

          {description && (
            <p className="hero-description mt-6 max-w-2xl text-[15px] leading-[1.85] text-white/75 sm:text-base">
              {description}
            </p>
          )}

          {(primaryCta || secondaryCta) && (
            <div className="mt-10 flex flex-wrap gap-3">
              {primaryCta && (
                <Link
                  href={hrefFor(primaryCta.href)}
                  className="hero-cta group inline-flex min-h-12 items-center justify-center gap-3 px-7 py-3.5 text-[11px] font-semibold uppercase tracking-[0.22em] transition-all duration-300 hover:shadow-[0_10px_36px_-14px_rgba(0,0,0,0.5)]"
                  style={{ background: theme.accent, color: "#0f1612" }}
                >
                  {str(primaryCta.label)}
                  <span aria-hidden="true" className="text-sm transition-transform duration-300 group-hover:translate-x-1">→</span>
                </Link>
              )}
              {secondaryCta && (
                <Link
                  href={hrefFor(secondaryCta.href)}
                  className="hero-cta group inline-flex min-h-12 items-center justify-center gap-3 border border-white/35 px-7 py-3.5 text-[11px] font-semibold uppercase tracking-[0.22em] transition hover:border-white hover:bg-white hover:text-[#0f1612]"
                >
                  {str(secondaryCta.label)}
                </Link>
              )}
            </div>
          )}
        </div>
      </div>

      {/* Meta footer bar */}
      <div className="border-t border-white/10 bg-black/25 backdrop-blur-[3px]">
        <div className="mx-auto flex w-full max-w-[1600px] flex-wrap items-center justify-between gap-8 px-5 py-7 sm:px-8 md:px-12 md:py-9">
          <div className="grid flex-1 grid-cols-2 gap-x-8 gap-y-4 sm:grid-cols-4">
            {str(project.projectType) && (
              <div className="hero-meta">
                <p className="mb-1.5 text-[9px] uppercase tracking-[0.22em] text-white/45">Project type</p>
                <p className="text-sm font-medium text-white">{titleCase(str(project.projectType))}</p>
              </div>
            )}
            {showLocation && locationText && (
              <div className="hero-meta">
                <p className="mb-1.5 text-[9px] uppercase tracking-[0.22em] text-white/45">Location</p>
                <p className="text-sm font-medium text-white">{locationText}</p>
              </div>
            )}
            {str(project.category) && (
              <div className="hero-meta">
                <p className="mb-1.5 text-[9px] uppercase tracking-[0.22em] text-white/45">Category</p>
                <p className="text-sm font-medium text-white">{titleCase(str(project.category))}</p>
              </div>
            )}
            <div className="hero-meta">
              <p className="mb-1.5 text-[9px] uppercase tracking-[0.22em] text-white/45">Status</p>
              <p className="text-sm font-medium uppercase tracking-[0.12em]" style={{ color: theme.accent }}>
                {titleCase(str(project.status) || "Completed")}
              </p>
            </div>
          </div>

          {showScrollIndicator && (
            <a
              href="#project-archive"
              className="hidden items-center gap-3 text-[9px] uppercase tracking-[0.28em] text-white/55 transition hover:text-white sm:flex"
            >
              <span className="h-px w-12" style={{ background: theme.accent }} />
              Open archive
              <svg className="h-3 w-3" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" style={{ animation: "scrollBounce 2s ease-in-out infinite" }}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M12 5v14M5 12l7 7 7-7" />
              </svg>
            </a>
          )}
        </div>
      </div>

      {/* Hero image caption */}
      {str(hero.imageCaption) && (
        <div className="absolute bottom-3 right-4 z-10 hidden text-[9px] uppercase tracking-[0.2em] text-white/40 md:block">
          {str(hero.imageCaption)}
        </div>
      )}
    </section>
  );
}

// ─── FactSheet Icon Set ────────────────────────────────────────────────────
function FactSheetIcon({ name, color }: { name: string; color: string }) {
  const s = { stroke: color, strokeWidth: 1.5, fill: "none", strokeLinecap: "round" as const, strokeLinejoin: "round" as const };
  const icons: Record<string, ReactNode> = {
    "building-2": <><rect x="4" y="3" width="16" height="18" rx="1" {...s} /><path d="M9 8h6M9 12h6M9 16h6" {...s} /></>,
    "map-pin": <><path d="M12 21c5-5 9-9.5 9-13a9 9 0 10-18 0c0 3.5 4 8 9 13z" {...s} /><circle cx="12" cy="8" r="2.5" {...s} /></>,
    "layers": <><path d="M12 3 2 8l10 5 10-5-10-5z" {...s} /><path d="M2 13l10 5 10-5M2 18l10 5 10-5" {...s} /></>,
    "calendar-check": <><rect x="3" y="5" width="18" height="16" rx="2" {...s} /><path d="M3 10h18M8 3v4M16 3v4M9 15l2 2 4-4" {...s} /></>,
    "calendar-clock": <><rect x="3" y="5" width="18" height="16" rx="2" {...s} /><path d="M3 10h18M8 3v4M16 3v4M12 13v3l2 2" {...s} /></>,
    "ruler": <><path d="M3 16 16 3l5 5L8 21l-5-5z" {...s} /><path d="M8 13l2 2M11 10l2 2M14 7l2 2" {...s} /></>,
    "landmark": <><path d="M3 22h18M3 10h18M5 10v8M9 10v8M15 10v8M19 10v8M12 3 3 8h18l-9-5z" {...s} /></>,
    "hotel": <><path d="M3 21V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2v16M3 21h18M9 21v-5h6v5" {...s} /><path d="M7 9h2M11 9h2M15 9h2" {...s} /></>,
    "trees": <><path d="M12 22V12M8 12a4 4 0 1 1 8 0M6 12 4 8a3 3 0 1 1 4-4M18 12l2-4a3 3 0 1 0-4-4" {...s} /></>,
    "flag": <><path d="M5 21V4M5 4c4-2 9 2 14 0v10c-5 2-10-2-14 0" {...s} /></>,
    "car-front": <><path d="M5 13 7 7h10l2 6M4 13h16v5H4z" {...s} /><circle cx="8" cy="18" r="1.5" {...s} /><circle cx="16" cy="18" r="1.5" {...s} /></>,
    "concierge-bell": <><path d="M3 19h18M5 19a7 7 0 0 1 14 0M12 8v4M10 5h4" {...s} /></>,
    "bed-double": <><path d="M3 18V7a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2v11M3 18h18M3 14h18" {...s} /><path d="M7 10h4M13 10h4" {...s} /></>,
  };
  const node = name && icons[name];
  if (!node) return null;
  return <svg viewBox="0 0 24 24" className="h-4 w-4">{node}</svg>;
}

// ─── FactSheet (ENHANCED) ────────────────────────────────────────────────────
function FactSheet({ project, theme }: { project: Project; theme: Theme }) {
  const specs = arr(project.specifications).filter(
    (item) => bool(item.visibility, true) && has(item.value ?? item.label)
  );
  const heroFacts = arr(project.hero?.quickFacts).filter(
    (item) => bool(item.visibility, true) && has(item.value)
  );
  const facts = specs.length ? specs : heroFacts;
  if (!facts.length) return null;

  return (
    <section
      id="project-archive"
      className="relative border-y px-5 py-10 sm:px-8 md:px-12 md:py-14"
      style={{ background: theme.surface, borderColor: theme.border, color: theme.text }}
    >
      {/* Subtle dot grid texture */}
      <div
        className="pointer-events-none absolute inset-0 opacity-[0.025]"
        style={{
          backgroundImage: `radial-gradient(${theme.text} 0.5px, transparent 0.5px)`,
          backgroundSize: "28px 28px",
        }}
        aria-hidden="true"
      />

      <div className="relative mx-auto max-w-7xl">
        {/* Header row */}
        <div className="reveal-up mb-8 flex items-center justify-between">
          <ChapterMarker chapter="A" label="Project fact sheet" theme={theme} />
          <span className="text-[10px] uppercase tracking-[0.28em]" style={{ color: theme.muted }}>
            Reference card · {pad(facts.length)} items
          </span>
        </div>

        {/* Premium fact card grid */}
        <div
          className="stagger-card grid grid-cols-2 gap-px overflow-hidden border lg:grid-cols-4"
          style={{ borderColor: theme.border, background: theme.border }}
        >
          {facts.slice(0, 4).map((item, i) => {
            const icon = str(item.icon);
            return (
              <div
                key={str(item.label) || i}
                className="stagger-item group relative flex flex-col gap-3 p-6 transition-all duration-300 hover:bg-[rgba(0,0,0,0.015)] sm:p-8"
                style={{ background: theme.surface }}
              >
                {/* Top row: number + icon */}
                <div className="flex items-center justify-between">
                  <span
                    className="font-mono text-[10px] tracking-[0.15em]"
                    style={{ color: theme.accent }}
                  >
                    {pad(i + 1)} / {pad(facts.length)}
                  </span>
                  {/* Icon in a subtle circle */}
                  {icon ? (
                    <div
                      className="flex h-9 w-9 items-center justify-center rounded-full border transition-all duration-300 group-hover:scale-110 group-hover:border-[var(--theme-accent)]"
                      style={{
                        borderColor: `${theme.accent}30`,
                        background: `${theme.accent}08`,
                      }}
                    >
                      <FactSheetIcon name={icon} color={theme.accent} />
                    </div>
                  ) : (
                    /* Fallback: small dot if no icon */
                    <span
                      className="h-1.5 w-1.5 rounded-full transition-all duration-300 group-hover:scale-150"
                      style={{ background: theme.accent }}
                    />
                  )}
                </div>

                {/* Label (muted, uppercase) */}
                <p
                  className="text-[11px] uppercase tracking-[0.18em]"
                  style={{ color: theme.muted }}
                >
                  {str(item.label) || str(item.title)}
                </p>

                {/* Value (large, bold) */}
                <p
                  className="text-xl font-medium tracking-[-0.02em] sm:text-2xl"
                  style={{ color: theme.text }}
                >
                  {[str(item.value), str(item.unit)].filter(Boolean).join(" ")}
                </p>

                {/* Description (if present) */}
                {str(item.description) && (
                  <p
                    className="text-[12px] leading-5"
                    style={{ color: theme.muted }}
                  >
                    {str(item.description)}
                  </p>
                )}

                {/* Top accent bar on hover */}
                <div
                  className="absolute left-0 top-0 h-0.5 w-0 transition-all duration-500 group-hover:w-full"
                  style={{ background: theme.accent }}
                />

                {/* Bottom accent bar on hover (slight delay) */}
                <div
                  className="absolute bottom-0 left-0 h-0.5 w-0 transition-all duration-500 group-hover:w-full"
                  style={{
                    background: theme.accent,
                    transitionDelay: "60ms",
                  }}
                />

                {/* Corner accent on hover (top-right) */}
                <span
                  className="absolute right-0 top-0 h-3 w-3 border-r border-t opacity-0 transition-all duration-300 group-hover:opacity-100"
                  style={{ borderColor: theme.accent }}
                />
              </div>
            );
          })}
        </div>

        {/* Footer note */}
        <div className="reveal-up mt-4 flex items-center gap-3 text-[9px] uppercase tracking-[0.2em]" style={{ color: theme.muted }}>
          <span className="h-px w-6" style={{ background: theme.border }} />
          <span>Information verified at time of publication</span>
        </div>
      </div>
    </section>
  );
}

// ─── OverviewChapter (ENHANCED) ──────────────────────────────────────────────
function OverviewChapter({ project, theme }: { project: Project; theme: Theme }) {
  const overview = (project.overview || {}) as RecordValue;
  const title = str(overview.sectionTitle || overview.title);
  const subtitle = str(overview.sectionSubtitle || overview.subtitle);
  const description = str(overview.description);
  const quote = str(overview.editorialQuote);
  const image = str(overview.image);
  const highlights = arr(overview.highlights).filter((h) => has(h.title) || has(h.description));

  if (!title && !description && !image) return null;

  return (
    <section
      id="project-overview"
      className="relative px-5 py-14 sm:px-8 md:px-12 md:py-20"
      style={{ background: theme.background, color: theme.text }}
    >
      {/* Subtle dot grid texture */}
      <div
        className="pointer-events-none absolute inset-0 opacity-[0.03]"
        style={{
          backgroundImage: `radial-gradient(${theme.text} 0.5px, transparent 0.5px)`,
          backgroundSize: "32px 32px",
        }}
        aria-hidden="true"
      />

      <div className="relative mx-auto max-w-7xl">
        <ChapterMarker chapter={1} label={str(overview.eyebrow) || "Overview"} theme={theme} />

        <div className="reveal-up mt-6 grid gap-10 md:grid-cols-[0.4fr_1.6fr] md:gap-16">
          {/* ═══ Aside (left sidebar) — editorial styling ═══ */}
          <aside
            className="relative md:border-l md:pl-8"
            style={{ borderColor: theme.border }}
          >
            {/* Accent dot at top of aside (desktop only) */}
            <span
              className="absolute -left-[3.5px] top-0 hidden h-1.5 w-1.5 rounded-full md:block"
              style={{ background: theme.accent }}
              aria-hidden="true"
            />

            {subtitle && (
              <p
                className="text-sm font-medium uppercase tracking-[0.22em]"
                style={{ color: theme.muted }}
              >
                {subtitle}
              </p>
            )}

            {str(project.shortDescription) && (
              <p
                className="mt-3 text-sm leading-7"
                style={{ color: theme.muted }}
              >
                {str(project.shortDescription)}
              </p>
            )}

            {/* Decorative accent line at bottom of aside (desktop only) */}
            <div className="mt-8 hidden md:block">
              <span
                className="block h-px w-12"
                style={{ background: theme.accent, opacity: 0.3 }}
              />
            </div>
          </aside>

          {/* ═══ Main content ═══ */}
          <div>
            {/* Title */}
            <h2
              className="reveal-up text-balance text-3xl font-medium leading-[1.08] tracking-[-0.04em] sm:text-4xl md:text-[3rem]"
              style={{ color: theme.text }}
            >
              {title || str(project.tagline) || `Introducing ${project.projectName}`}
            </h2>

            {/* Description */}
            {description && (
              <p
                className="reveal-up mt-6 max-w-3xl text-base leading-[1.9] md:text-lg"
                style={{ color: theme.muted }}
              >
                {description}
              </p>
            )}

            {/* ═══ Editorial quote — premium treatment ═══ */}
            {quote && (
              <blockquote
                className="reveal-up relative mt-8 border-l-2 pl-8 text-xl font-light italic leading-[1.6] md:mt-10 md:pl-10 md:text-2xl"
                style={{ borderColor: theme.accent, color: theme.primary }}
              >
                {/* Large decorative quotation mark */}
                <span
                  className="pointer-events-none absolute -left-2 -top-6 select-none text-6xl font-serif leading-none opacity-[0.12] md:-left-1 md:-top-7 md:text-7xl"
                  style={{ color: theme.accent }}
                  aria-hidden="true"
                >
                  &ldquo;
                </span>
                {quote}
              </blockquote>
            )}

            {/* ═══ Image with corner brackets ═══ */}
            {image && (
              <div className="reveal-up relative mt-8">
                <ImagePanel
                  src={image}
                  alt={overview.imageAlt}
                  theme={theme}
                  className="w-full min-h-[18rem] md:min-h-[26rem]"
                />
                {/* Corner brackets — premium frame */}
                <span className="pointer-events-none absolute left-3 top-3 z-10 h-4 w-4 border-l border-t border-white/40" />
                <span className="pointer-events-none absolute right-3 top-3 z-10 h-4 w-4 border-r border-t border-white/40" />
                <span className="pointer-events-none absolute bottom-3 left-3 z-10 h-4 w-4 border-b border-l border-white/40" />
                <span className="pointer-events-none absolute bottom-3 right-3 z-10 h-4 w-4 border-b border-r border-white/40" />
              </div>
            )}

            {/* ═══ Highlights — premium cards with hover ═══ */}
            {highlights.length > 0 && (
              <div className="stagger-card mt-8 grid gap-4 sm:grid-cols-3 sm:gap-5">
                {highlights.map((h, i) => (
                  <div
                    key={i}
                    className="stagger-item group relative border-t pt-5 transition-all duration-300 hover:-translate-y-1"
                    style={{ borderColor: theme.border }}
                  >
                    {/* Hover accent bar at top (draws in left-to-right) */}
                    <div
                      className="absolute left-0 top-0 h-0.5 w-0 transition-all duration-500 group-hover:w-full"
                      style={{ background: theme.accent }}
                    />

                    <span
                      className="mb-3 block font-mono text-[10px] tracking-[0.15em]"
                      style={{ color: theme.accent }}
                    >
                      {pad(i + 1)}
                    </span>

                    <h3
                      className="text-base font-medium tracking-[-0.01em]"
                      style={{ color: theme.text }}
                    >
                      {str(h.title)}
                    </h3>

                    {str(h.description) && (
                      <p
                        className="mt-2 text-[14px] leading-7"
                        style={{ color: theme.muted }}
                      >
                        {str(h.description)}
                      </p>
                    )}

                    {/* Hover "Learn more" hint */}
                    <div
                      className="mt-4 flex items-center gap-2 text-[9px] uppercase tracking-[0.2em] opacity-0 transition-opacity duration-300 group-hover:opacity-100"
                      style={{ color: theme.accent }}
                    >
                      <span className="h-px w-4" style={{ background: theme.accent }} />
                      <span>Learn more</span>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>
    </section>
  );
}

// ─── SectionChapter ───────────────────────────────────────────────────────────
function SectionChapter({
  section,
  chapterIndex,
  total,
  theme,
  project,
}: {
  section: RecordValue;
  chapterIndex: number;
  total: number;
  theme: Theme;
  project: Project;
}) {
  if (section.enabled === false || section.visibility === false) return null;

  const id = str(section.id);
  const type = str(section.type || section.layout).toLowerCase();
  const layout = str(section.layout).toLowerCase();
  const sectionTheme = str(section.theme).toLowerCase();
  const eyebrow = str(section.eyebrow);
  const title = str(section.title || section.heading);
  const subtitle = str(section.subtitle);
  const description = str(section.description || section.body || subtitle);
  const content = (section.content && typeof section.content === "object" ? section.content : {}) as RecordValue;
  const media = (section.media && typeof section.media === "object" ? section.media : {}) as RecordValue;
  const image = str(media.src || section.image || section.imageUrl);
  const imageAlt = str(media.alt || section.imageAlt);
  const cta = section.cta && typeof section.cta === "object" ? (section.cta as RecordValue) : null;
  const settings = (section.settings && typeof section.settings === "object" ? section.settings : {}) as RecordValue;
  const imageSide = str(settings.imageSide).toLowerCase();

  if (type.includes("specifications")) return null;

  const isDark = sectionTheme === "dark";
  const bg = isDark ? theme.gradient : theme.surface;
  const text = isDark ? "#ffffff" : theme.text;
  const muted = isDark ? "rgba(255,255,255,0.72)" : theme.muted;
  const border = isDark ? "rgba(255,255,255,0.18)" : theme.border;

  // ─── Enquiry CTA ────────────────────────────────────────────────────────────
  if (type.includes("enquiry-cta") || id === "enquiry") {
    const supportingText = str(content.supportingText);
    return (
      <section
        id={id || "enquiry"}
        className="relative isolate overflow-hidden px-5 py-16 sm:px-8 md:px-12 md:py-24"
        style={{ background: bg, color: text }}
      >
        <div className="absolute -right-16 -top-32 -z-10 select-none font-serif text-[28vw] font-semibold leading-none tracking-[-0.1em] opacity-[0.04]">
          {projectInitial(project.projectName)}
        </div>
        <div className="mx-auto max-w-7xl">
          <ChapterMarker chapter="✶" label={eyebrow || "Discuss this project"} theme={theme} onDark={isDark} />
          <div className="reveal-up mt-6 grid gap-10 md:grid-cols-[0.4fr_1.6fr] md:gap-16">
            <div>
              {image && (
                <ImagePanel src={image} alt={imageAlt} theme={theme} className="mb-6 min-h-[16rem] md:min-h-[24rem]" />
              )}
            </div>
            <div>
              <h2 className="reveal-up text-balance text-3xl font-medium leading-[1.08] tracking-[-0.035em] sm:text-4xl md:text-[3rem]">
                {title || `Discuss ${project.projectName} with our team`}
              </h2>
              {(subtitle || supportingText) && (
                <p className="reveal-up mt-6 max-w-2xl text-base leading-[1.85] md:text-lg" style={{ color: muted }}>
                  {supportingText || subtitle || "Reach out to our team to learn more about this completed project and similar work in our archive."}
                </p>
              )}
              <div className="reveal-up mt-8 flex flex-wrap gap-3">
                {cta && (
                  <Link
                    href={hrefFor(cta.href)}
                    className="group inline-flex min-h-12 items-center justify-center gap-3 px-7 py-3.5 text-[11px] font-semibold uppercase tracking-[0.22em] transition-all duration-300 hover:shadow-[0_10px_36px_-14px_rgba(0,0,0,0.5)]"
                    style={{ background: theme.accent, color: "#0f1612" }}
                  >
                    {str(cta.label)}
                    <span aria-hidden="true" className="text-sm transition-transform duration-300 group-hover:translate-x-1">→</span>
                  </Link>
                )}
                <Link
                  href="/projects/completed"
                  className="group inline-flex min-h-12 items-center justify-center gap-3 border px-7 py-3.5 text-[11px] font-semibold uppercase tracking-[0.22em] transition"
                  style={{
                    borderColor: isDark ? "rgba(255,255,255,0.3)" : theme.border,
                    color: isDark ? "white" : theme.text,
                  }}
                >
                  View archive
                </Link>
              </div>
            </div>
          </div>
        </div>
      </section>
    );
  }

  // ─── FAQ ────────────────────────────────────────────────────────────────────
  if (type.includes("faq")) {
    const faqItems = arr(content.items || section.items);
    return (
      <section id={id} className="px-5 py-14 sm:px-8 md:px-12 md:py-20" style={{ background: bg, color: text }}>
        <div className="mx-auto max-w-7xl">
          <ChapterMarker chapter={chapterIndex} total={total} label={eyebrow || "Questions"} theme={theme} onDark={isDark} />
          <div className="reveal-up mt-6 grid gap-10 md:grid-cols-[0.4fr_1.6fr] md:gap-16">
            <div>
              <h2 className="text-balance text-3xl font-medium leading-[1.08] tracking-[-0.035em] sm:text-4xl" style={{ color: text }}>
                {title || "Frequently asked questions"}
              </h2>
              {(description || subtitle) && (
                <p className="mt-5 max-w-md text-base leading-[1.85]" style={{ color: muted }}>
                  {description || subtitle}
                </p>
              )}
            </div>
            {faqItems.length > 0 ? (
              <div className="divide-y border-y" style={{ borderColor: border }}>
                {faqItems.map((item, i) => {
                  const q = str(item.question || item.title);
                  const a = str(item.answer || item.body || item.description);
                  if (!q && !a) return null;
                  return (
                    <details key={i} className="group py-6">
                      <summary className="flex cursor-pointer list-none items-center justify-between gap-5 text-base font-medium [&::-webkit-details-marker]:hidden" style={{ color: text }}>
                        <span className="flex items-baseline gap-4">
                          <span className="font-mono text-[10px] tracking-[0.15em]" style={{ color: theme.accent }}>{pad(i + 1)}</span>
                          {q}
                        </span>
                        <span className="text-2xl font-light transition-transform duration-300 group-open:rotate-45" style={{ color: theme.accent }}>+</span>
                      </summary>
                      <p className="max-w-2xl pt-4 pl-8 text-[15px] leading-[1.85]" style={{ color: muted }}>{a}</p>
                    </details>
                  );
                })}
              </div>
            ) : (
              <div className="border-y py-8" style={{ borderColor: border }}>
                <p className="text-base leading-[1.85]" style={{ color: muted }}>
                  {subtitle || "Project-specific FAQs will be added as information is confirmed. Have a question in the meantime?"}
                </p>
                <div className="mt-6">
                  <Link
                    href="/contact"
                    className="group inline-flex min-h-11 items-center gap-3 border px-6 py-3 text-[11px] font-semibold uppercase tracking-[0.22em] transition"
                    style={{ borderColor: border, color: text }}
                  >
                    Ask our team
                    <span aria-hidden="true" className="text-sm transition-transform duration-300 group-hover:translate-x-1">→</span>
                  </Link>
                </div>
              </div>
            )}
          </div>
        </div>
      </section>
    );
  }

  // ─── Gallery ────────────────────────────────────────────────────────────────
  if (type.includes("image-gallery") || type.includes("gallery")) {
    const galleryItems = items(content.items || content.images || section.images);
    if (!galleryItems.length) {
      return (
        <section id={id} className="px-5 py-14 sm:px-8 md:px-12 md:py-20" style={{ background: bg, color: text }}>
          <div className="mx-auto max-w-7xl">
            <ChapterMarker chapter={chapterIndex} total={total} label={eyebrow || "Portfolio"} theme={theme} onDark={isDark} />
            <div className="reveal-up mt-6 grid gap-10 md:grid-cols-[0.4fr_1.6fr] md:gap-16">
              <div>
                <h2 className="text-balance text-3xl font-medium leading-[1.08] tracking-[-0.035em] sm:text-4xl" style={{ color: text }}>
                  {title || "Project portfolio"}
                </h2>
                {(description || subtitle) && (
                  <p className="mt-5 max-w-md text-base leading-[1.85]" style={{ color: muted }}>
                    {description || subtitle}
                  </p>
                )}
              </div>
              <div className="stagger-card grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
                {[0, 1, 2, 3].map((i) => (
                  <div
                    key={i}
                    className={`stagger-item flex min-h-64 flex-col items-center justify-center border p-8 text-center ${i === 0 ? "sm:col-span-2 sm:row-span-2" : ""}`}
                    style={{ borderColor: border, background: isDark ? "rgba(255,255,255,0.03)" : theme.background }}
                  >
                    <svg className="mb-4 h-8 w-8 opacity-40" viewBox="0 0 24 24" fill="none" stroke={isDark ? "white" : theme.muted} strokeWidth="1.5">
                      <rect x="3" y="3" width="18" height="18" rx="2" />
                      <circle cx="9" cy="9" r="2" />
                      <path d="m21 15-5-5L5 21" />
                    </svg>
                    <p className="text-xs uppercase tracking-[0.22em]" style={{ color: muted }}>
                      {subtitle || "Approved imagery coming soon"}
                    </p>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </section>
      );
    }
    return (
      <section id={id} className="px-5 py-14 sm:px-8 md:px-12 md:py-20" style={{ background: bg, color: text }}>
        <div className="mx-auto max-w-7xl">
          <ChapterMarker chapter={chapterIndex} total={total} label={eyebrow || "Portfolio"} theme={theme} onDark={isDark} />
          <div className="reveal-up mt-6 grid gap-10 md:grid-cols-[0.4fr_1.6fr] md:gap-16">
            <div>
              <h2 className="text-balance text-3xl font-medium leading-[1.08] tracking-[-0.035em] sm:text-4xl" style={{ color: text }}>
                {title || "Project portfolio"}
              </h2>
              {(description || subtitle) && (
                <p className="mt-5 max-w-md text-base leading-[1.85]" style={{ color: muted }}>
                  {description || subtitle}
                </p>
              )}
            </div>
            <div className="stagger-card grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
              {galleryItems.map((entry, i) => {
                const item = (entry && typeof entry === "object" ? entry : { src: entry }) as RecordValue;
                return (
                  <figure key={str(item.id) || str(item.src) || i} className={`stagger-item group ${i === 0 ? "sm:col-span-2 sm:row-span-2" : ""}`}>
                    <ImagePanel
                      src={item.src || item.image || item.url}
                      alt={item.alt || item.caption}
                      theme={theme}
                      className={i === 0 ? "h-full min-h-[28rem]" : "min-h-72"}
                    />
                    {str(item.caption || item.title) && (
                      <figcaption className="pt-4 text-[11px] uppercase tracking-[0.18em]" style={{ color: muted }}>
                        {str(item.caption || item.title)}
                      </figcaption>
                    )}
                  </figure>
                );
              })}
            </div>
          </div>
        </div>
      </section>
    );
  }

  // ─── Architecture / cinematic full-bleed ────────────────────────────────────
  if (type.includes("architecture") || type.includes("cinematic") || type.includes("landscape-story")) {
    const body = str(content.body);
    const principles = arr(content.designPrinciples || content.landscapeFeatures || content.points);
    const fullBleed = bool(settings.fullBleed, false);
    if (fullBleed && image) {
      return (
        <section id={id} className="relative isolate flex min-h-[78svh] items-end overflow-hidden text-white">
          <div
            className="absolute inset-0 -z-10"
            style={{
              backgroundImage: `linear-gradient(180deg, transparent 35%, ${theme.primary}f2 100%), url("${image.replaceAll('"', "%22")}")`,
              backgroundSize: "cover",
              backgroundPosition: "center",
              animation: "kenBurns 30s ease-in-out infinite alternate",
            }}
          />
          {/* Corner brackets */}
          <span className="corner-bracket pointer-events-none absolute left-6 top-6 z-30 h-10 w-10 border-l border-t border-white/20 sm:left-8 sm:top-8" />
          <span className="corner-bracket pointer-events-none absolute right-6 top-6 z-30 h-10 w-10 border-r border-t border-white/20 sm:right-8 sm:top-8" />
          <span className="corner-bracket pointer-events-none absolute bottom-6 left-6 z-30 h-10 w-10 border-b border-l border-white/20 sm:bottom-8 sm:left-8" />
          <span className="corner-bracket pointer-events-none absolute bottom-6 right-6 z-30 h-10 w-10 border-b border-r border-white/20 sm:bottom-8 sm:right-8" />

          <div className="mx-auto w-full max-w-7xl px-5 py-16 sm:px-8 md:px-12 md:py-24">
            <ChapterMarker chapter={chapterIndex} total={total} label={eyebrow} theme={theme} onDark />
            <h2 className="reveal-up mt-6 max-w-4xl text-balance text-4xl font-medium leading-[1.05] tracking-[-0.04em] sm:text-5xl md:text-[3.5rem]">
              {title}
            </h2>
            {body && <p className="reveal-up mt-6 max-w-2xl text-base leading-[1.85] text-white/80 md:text-lg">{body}</p>}
            {principles.length > 0 && (
              <div className="stagger-card mt-8 grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
                {principles.map((p, i) => (
                  <div key={i} className="stagger-item border-t border-white/15 pt-4">
                    <span className="mb-2 block font-mono text-[10px] tracking-[0.15em]" style={{ color: theme.accent }}>{pad(i + 1)}</span>
                    <h3 className="text-base font-medium">{str(p.title || p.name || p.label)}</h3>
                    {str(p.description || p.body) && <p className="mt-1 text-sm leading-7 text-white/70">{str(p.description || p.body)}</p>}
                  </div>
                ))}
              </div>
            )}
          </div>
        </section>
      );
    }
  }

  // ─── Default editorial chapter ─────────────────────────────────────────────
  const body = str(content.body || content.supportingText);
  const entries = items(
    content.highlights || content.items || content.features || content.amenities ||
    content.points || content.advantages || content.details || section.items || section.features
  );

  const imageRight = layout.includes("image-right") || layout.includes("copy-left") || imageSide === "right";
  const imageLeft = layout.includes("image-left") || layout.includes("copy-right") || imageSide === "left";
  const reversed = imageLeft || (!imageRight && chapterIndex % 2 === 1);

  if (!title && !description && !body && !entries.length && !image) return null;

  return (
    <section id={id} className="px-5 py-14 sm:px-8 md:px-12 md:py-20" style={{ background: bg, color: text }}>
      <div className="mx-auto max-w-7xl">
        <ChapterMarker chapter={chapterIndex} total={total} label={eyebrow} theme={theme} onDark={isDark} />

        <div className={`reveal-up mt-6 grid items-center gap-10 md:grid-cols-2 md:gap-16 ${reversed && image ? "md:[&>*:first-child]:order-2" : ""}`}>
          {image && (
            <ImagePanel src={image} alt={imageAlt} theme={theme} className="min-h-[20rem] md:min-h-[28rem]" />
          )}
          <div>
            <h2 className="reveal-up text-balance text-3xl font-medium leading-[1.08] tracking-[-0.04em] sm:text-4xl md:text-[2.85rem]" style={{ color: text }}>
              {title}
            </h2>
            {description && description !== body && (
              <p className="reveal-up mt-6 max-w-2xl text-base leading-[1.85] md:text-lg" style={{ color: muted }}>
                {description}
              </p>
            )}
            {body && body !== description && (
              <p className="reveal-up mt-6 max-w-2xl text-base leading-[1.85]" style={{ color: muted }}>
                {body}
              </p>
            )}
            {entries.length > 0 && (
              <div className="stagger-card mt-8 divide-y border-y" style={{ borderColor: border }}>
                {entries.map((entry, i) => {
                  const item = (entry && typeof entry === "object" ? entry : { title: entry }) as RecordValue;
                  const itemTitle = str(item.title || item.name || item.label || item.value);
                  const itemDesc = str(item.description || item.body);
                  if (!itemTitle && !itemDesc) return null;
                  return (
                    <div key={str(item.id) || itemTitle || i} className="stagger-item flex gap-6 py-5">
                      <span className="font-mono pt-1 text-[10px] tracking-[0.15em]" style={{ color: theme.accent }}>
                        {pad(i + 1)}
                      </span>
                      <div>
                        <h3 className="text-base font-medium tracking-[-0.01em]" style={{ color: text }}>{itemTitle}</h3>
                        {itemDesc && <p className="mt-2 text-[14px] leading-7" style={{ color: muted }}>{itemDesc}</p>}
                      </div>
                    </div>
                  );
                })}
              </div>
            )}
            {cta && (
              <div className="reveal-up mt-8">
                <Link
                  href={hrefFor(cta.href)}
                  className="group inline-flex min-h-11 items-center gap-3 border px-6 py-3 text-[11px] font-semibold uppercase tracking-[0.22em] transition hover:bg-[#0f1612] hover:text-white"
                  style={{ borderColor: border, color: text }}
                >
                  {str(cta.label)}
                  <span aria-hidden="true" className="text-sm transition-transform duration-300 group-hover:translate-x-1">→</span>
                </Link>
              </div>
            )}
          </div>
        </div>
      </div>
    </section>
  );
}

// ─── ArchiveGrid ──────────────────────────────────────────────────────────────
function ArchiveGrid({ project, allProjects, theme }: { project: Project; allProjects: Project[]; theme: Theme }) {
  const related = items(project.relatedProjects)
    .map((entry) => (typeof entry === "string" ? entry : str((entry as RecordValue)?.slug)))
    .filter(Boolean);
  if (!related.length) return null;

  return (
    <section className="px-5 py-14 sm:px-8 md:px-12 md:py-20" style={{ background: theme.background, color: theme.text }}>
      <div className="mx-auto max-w-7xl">
        <div className="reveal-up mb-10 flex flex-wrap items-end justify-between gap-6 border-b pb-8" style={{ borderColor: theme.border }}>
          <div>
            <ChapterMarker chapter="↻" label="Continue exploring the archive" theme={theme} />
            <h2 className="reveal-up mt-4 text-3xl font-medium tracking-[-0.035em] sm:text-4xl" style={{ color: theme.text }}>
              More from our portfolio
            </h2>
          </div>
          <Link
            href="/projects/completed"
            className="group inline-flex items-center gap-3 text-[11px] font-semibold uppercase tracking-[0.22em] transition"
            style={{ color: theme.muted }}
          >
            View all completed
            <span aria-hidden="true" className="text-sm transition-transform duration-300 group-hover:translate-x-0.5">→</span>
          </Link>
        </div>
        <div className="stagger-card grid gap-4 md:grid-cols-2 lg:grid-cols-3">
          {related.slice(0, 3).map((slug, i) => {
            const match = allProjects.find((item) => item.slug === slug);
            return (
              <Link
                href={`/projects/completed/${encodeURIComponent(slug)}`}
                key={slug}
                className="stagger-item group relative flex min-h-72 flex-col justify-between overflow-hidden border p-8 transition-all duration-300 hover:shadow-[0_24px_60px_-30px_rgba(0,0,0,0.25)] hover:-translate-y-1 sm:p-10"
                style={{ borderColor: theme.border, background: theme.surface }}
              >
                <div className="absolute right-0 top-0 h-1 w-0 transition-all duration-500 group-hover:w-full" style={{ background: theme.accent }} />
                <div className="flex items-start justify-between">
                  <span className="font-mono text-[11px] uppercase tracking-[0.18em]" style={{ color: theme.accent }}>
                    {pad(i + 1)} / Archive
                  </span>
                  <span
                    className="inline-flex items-center gap-1.5 border px-2.5 py-1 text-[9px] font-semibold uppercase tracking-[0.22em]"
                    style={{ borderColor: theme.accent, color: theme.accent }}
                  >
                    <svg className="h-2.5 w-2.5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3">
                      <path strokeLinecap="round" strokeLinejoin="round" d="m5 13 4 4L19 7" />
                    </svg>
                    Completed
                  </span>
                </div>
                <div>
                  <h3 className="text-2xl font-medium leading-[1.1] tracking-[-0.035em] sm:text-[1.7rem]" style={{ color: theme.text }}>
                    {str(match?.projectName) || titleCase(slug)}
                  </h3>
                  {str(match?.tagline) && (
                    <p className="mt-2 text-sm leading-6" style={{ color: theme.muted }}>{str(match?.tagline)}</p>
                  )}
                  <div className="mt-5 flex items-center gap-3 text-[11px] uppercase tracking-[0.22em] opacity-0 transition-opacity duration-300 group-hover:opacity-100" style={{ color: theme.accent }}>
                    Open project
                    <span aria-hidden="true" className="text-base transition-transform duration-300 group-hover:translate-x-1">↗</span>
                  </div>
                </div>
              </Link>
            );
          })}
        </div>
      </div>
    </section>
  );
}

// ─── CompletedProjectDetails (main) ───────────────────────────────────────────
export default function CompletedProjectDetails({
  project,
  allProjects = [],
}: {
  project: Project;
  allProjects?: Project[];
}) {
  const theme = getTheme(project);
  const sectionRef = useRef<HTMLElement>(null);
  const sections = arr(project.sections).filter(
    (s) => s.enabled !== false && s.visibility !== false
  );
  const gallery = arr((project.gallery as RecordValue | undefined)?.items).filter((item) =>
    has(item.src || item.image || item.url)
  );
  const faq = arr(project.faq).filter((item) => has(item.question) && has(item.answer));

  // Initialize scroll-triggered animations + get scroll progress
  const scrollProgress = useScrollReveal(sectionRef);

  const themeVars: CSSProperties = {
    ["--theme-primary" as string]: theme.primary,
    ["--theme-accent" as string]: theme.accent,
    ["--theme-bg" as string]: theme.background,
    ["--theme-surface" as string]: theme.surface,
    ["--theme-text" as string]: theme.text,
    ["--theme-muted" as string]: theme.muted,
    ["--theme-border" as string]: theme.border,
  } as CSSProperties;

  const chapterSections = sections.filter((s) => !str(s.type).includes("specifications"));
  const totalChapters = chapterSections.length;

  return (
    <main ref={sectionRef} className="min-h-screen" style={{ background: theme.background, color: theme.text, ...themeVars }}>
      {/* Global animation keyframes */}
      <style>{ANIMATION_STYLES}</style>

      {/* ═══ FIXED TOP SCROLL PROGRESS BAR (NEW) ═══ */}
      <div className="fixed top-0 left-0 right-0 z-[100] h-[2px] bg-transparent pointer-events-none">
        <div
          className="h-full origin-left transition-transform duration-100"
          style={{
            transform: `scaleX(${scrollProgress})`,
            background: `linear-gradient(90deg, ${theme.accent}, ${theme.accent}88)`,
          }}
        />
      </div>

      <ArchiveHero project={project} theme={theme} />
      <FactSheet project={project} theme={theme} />
      <OverviewChapter project={project} theme={theme} />

      {chapterSections.map((section, index) => (
        <SectionChapter
          key={str(section.id) || `${str(section.type)}-${index}`}
          section={section}
          chapterIndex={index + 1}
          total={totalChapters}
          theme={theme}
          project={project}
        />
      ))}

      {gallery.length > 0 && (
        <section className="px-5 py-14 sm:px-8 md:px-12 md:py-20" style={{ background: theme.surface, color: theme.text }}>
          <div className="mx-auto max-w-7xl">
            <ChapterMarker chapter="✦" label={str(project.gallery?.eyebrow) || "Portfolio"} theme={theme} />
            <div className="reveal-up mt-6 grid gap-10 md:grid-cols-[0.4fr_1.6fr] md:gap-16">
              <div>
                <h2 className="text-balance text-3xl font-medium leading-[1.08] tracking-[-0.035em] sm:text-4xl" style={{ color: theme.text }}>
                  {str(project.gallery?.galleryTitle) || str(project.gallery?.title) || "Project portfolio"}
                </h2>
                {(str(project.gallery?.gallerySubtitle) || str(project.gallery?.description)) && (
                  <p className="mt-5 max-w-md text-base leading-[1.85]" style={{ color: theme.muted }}>
                    {str(project.gallery?.gallerySubtitle) || str(project.gallery?.description)}
                  </p>
                )}
              </div>
              <div className="stagger-card grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
                {gallery.map((item, index) => (
                  <figure key={str(item.id) || str(item.src) || index} className={`stagger-item group ${index === 0 ? "sm:col-span-2 sm:row-span-2" : ""}`}>
                    <ImagePanel
                      src={item.src || item.image || item.url}
                      alt={item.alt || item.caption}
                      theme={theme}
                      className={index === 0 ? "h-full min-h-[28rem]" : "min-h-72"}
                    />
                    {str(item.caption || item.title) && (
                      <figcaption className="pt-4 text-[11px] uppercase tracking-[0.18em]" style={{ color: theme.muted }}>
                        {str(item.caption || item.title)}
                      </figcaption>
                    )}
                  </figure>
                ))}
              </div>
            </div>
          </div>
        </section>
      )}

      {faq.length > 0 && (
        <section className="px-5 py-14 sm:px-8 md:px-12 md:py-20" style={{ background: theme.background, color: theme.text }}>
          <div className="mx-auto max-w-7xl">
            <ChapterMarker chapter="?" label="Good to know" theme={theme} />
            <div className="reveal-up mt-6 grid gap-10 md:grid-cols-[0.4fr_1.6fr] md:gap-16">
              <div>
                <h2 className="text-balance text-3xl font-medium leading-[1.08] tracking-[-0.035em] sm:text-4xl" style={{ color: theme.text }}>
                  Frequently asked questions
                </h2>
                <p className="mt-5 max-w-md text-base leading-[1.85]" style={{ color: theme.muted }}>
                  A few helpful details about this completed project.
                </p>
              </div>
              <div className="divide-y border-y" style={{ borderColor: theme.border }}>
                {faq.map((item, i) => (
                  <details key={str(item.question) || i} className="group py-6">
                    <summary className="flex cursor-pointer list-none items-center justify-between gap-5 text-base font-medium [&::-webkit-details-marker]:hidden" style={{ color: theme.text }}>
                      <span className="flex items-baseline gap-4">
                        <span className="font-mono text-[10px] tracking-[0.15em]" style={{ color: theme.accent }}>{pad(i + 1)}</span>
                        {str(item.question)}
                      </span>
                      <span className="text-2xl font-light transition-transform duration-300 group-open:rotate-45" style={{ color: theme.accent }}>+</span>
                    </summary>
                    <p className="max-w-2xl pt-4 pl-8 text-[15px] leading-[1.85]" style={{ color: theme.muted }}>{str(item.answer)}</p>
                  </details>
                ))}
              </div>
            </div>
          </div>
        </section>
      )}

      <ArchiveGrid project={project} allProjects={allProjects} theme={theme} />
    </main>
  );
}