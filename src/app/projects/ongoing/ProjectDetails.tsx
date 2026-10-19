import Link from "next/link";
import type { CSSProperties, ReactNode } from "react";

// ─── types ───────────────────────────────────────────────────────────────────
type RecordValue = Record<string, unknown>;
type Project = RecordValue & {
  id?: string | number;
  slug: string;
  projectName: string;
  shortName?: string;
  brandName?: string;
  projectType?: string;
  category?: string;
  status?: string;
  shortDescription?: string;
  longDescription?: string;
  tagline?: string;
  hero?: RecordValue;
  theme?: RecordValue;
  location?: RecordValue;
  overview?: RecordValue;
  specifications?: RecordValue[];
  sections?: RecordValue[];
  gallery?: RecordValue;
  faq?: RecordValue[];
  relatedProjects?: (string | RecordValue)[];
  ctas?: RecordValue[];
  seo?: RecordValue;
};

// ─── value helpers ───────────────────────────────────────────────────────────
const str = (value: unknown): string =>
  typeof value === "string" ? value.trim() : typeof value === "number" ? String(value) : "";
const arr = (value: unknown): RecordValue[] =>
  Array.isArray(value) ? value.filter((i): i is RecordValue => !!i && typeof i === "object") : [];
const items = (value: unknown): unknown[] => (Array.isArray(value) ? value : []);
const has = (value: unknown): boolean =>
  value !== null && value !== undefined && value !== "" && value !== false;
const bool = (value: unknown, fallback = false): boolean => {
  if (value === undefined || value === null) return fallback;
  return value !== false;
};
const hrefFor = (value: unknown) => {
  const href = str(value);
  return href.startsWith("/") || href.startsWith("#") || href.startsWith("https://") ||
    href.startsWith("mailto:") || href.startsWith("tel:")
    ? href
    : "#enquiry";
};
const googleMapsEmbed = (value: unknown): string => {
  const href = str(value);
  if (!href) return "";
  try {
    const url = new URL(href);
    return url.protocol === "https:" &&
      (url.hostname === "www.google.com" || url.hostname === "maps.google.com") &&
      url.pathname.startsWith("/maps/embed")
      ? url.toString()
      : "";
  } catch {
    return "";
  }
};
const pad = (n: number) => String(n).padStart(2, "0");
const titleCase = (s: string) => s.replace(/[-_]/g, " ").replace(/\b\w/g, (m) => m.toUpperCase());
const projectFallbackImage = (project: Project): string => {
  const hero = project.hero || {};
  const overview = project.overview || {};
  const gallery = project.gallery as RecordValue | undefined;
  const firstGalleryItem = items(gallery?.items)[0];
  const galleryImage = firstGalleryItem && typeof firstGalleryItem === "object"
    ? (firstGalleryItem as RecordValue).src || (firstGalleryItem as RecordValue).image || (firstGalleryItem as RecordValue).url
    : firstGalleryItem;

  return str(
    hero.backgroundImage || hero.image || hero.imageUrl || overview.image ||
    project.image || project.imageUrl || galleryImage
  );
};

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
  };
}

// ─── inline SVG icon set (matches your JSON `icon` values) ────────────────────
function SpecIcon({ name, theme }: { name?: string; theme: Theme }) {
  const stroke = {
    stroke: theme.accent,
    strokeWidth: 1.5,
    fill: "none",
    strokeLinecap: "round" as const,
    strokeLinejoin: "round" as const,
  };
  const paths: Record<string, ReactNode> = {
    "building-2": <><rect x="4" y="3" width="16" height="18" rx="1" {...stroke} /><path d="M9 8h6M9 12h6M9 16h6" {...stroke} /></>,
    "map-pin": <><path d="M12 21c5-5 9-9.5 9-13a9 9 0 10-18 0c0 3.5 4 8 9 13z" {...stroke} /><circle cx="12" cy="8" r="2.5" {...stroke} /></>,
    "landmark": <><path d="M3 22h18M3 10h18M5 10v8M9 10v8M15 10v8M19 10v8M12 3 3 8h18l-9-5z" {...stroke} /></>,
    "calendar-clock": <><rect x="3" y="5" width="18" height="16" rx="2" {...stroke} /><path d="M3 10h18M8 3v4M16 3v4M12 13v3l2 2" {...stroke} /></>,
    "layers": <><path d="M12 3 2 8l10 5 10-5-10-5z" {...stroke} /><path d="M2 13l10 5 10-5M2 18l10 5 10-5" {...stroke} /></>,
    "ruler": <><path d="M3 16 16 3l5 5L8 21l-5-5z" {...stroke} /><path d="M8 13l2 2M11 10l2 2M14 7l2 2" {...stroke} /></>,
    "hotel": <><path d="M3 21V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2v16M3 21h18M9 21v-5h6v5" {...stroke} /><path d="M7 9h2M11 9h2M15 9h2" {...stroke} /></>,
    "bed-double": <><path d="M3 18V7a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2v11M3 18h18M3 14h18" {...stroke} /><path d="M7 10h4M13 10h4" {...stroke} /></>,
    "concierge-bell": <><path d="M3 19h18M5 19a7 7 0 0 1 14 0M12 8v4M10 5h4" {...stroke} /></>,
    "car-front": <><path d="M5 13 7 7h10l2 6M4 13h16v5H4z" {...stroke} /><circle cx="8" cy="18" r="1.5" {...stroke} /><circle cx="16" cy="18" r="1.5" {...stroke} /></>,
    "trees": <><path d="M12 22V12M8 12a4 4 0 1 1 8 0M6 12 4 8a3 3 0 1 1 4-4M18 12l2-4a3 3 0 1 0-4-4" {...stroke} /></>,
    "flag": <><path d="M5 21V4M5 4c4-2 9 2 14 0v10c-5 2-10-2-14 0" {...stroke} /></>,
  };
  const node = name && paths[name];
  if (!node) return null;
  return <svg viewBox="0 0 24 24" className="h-4 w-4 shrink-0">{node}</svg>;
}

// ─── Eyebrow ──────────────────────────────────────────────────────────────────
function Eyebrow({
  children,
  theme,
  className = "",
  onDark = false,
}: {
  children: ReactNode;
  theme: Theme;
  className?: string;
  onDark?: boolean;
}) {
  if (!children || (typeof children === "string" && !str(children))) return null;
  return (
    <p
      className={`mb-5 inline-flex items-center gap-3 text-[10px] font-semibold uppercase tracking-[0.32em] ${className}`}
      style={{ color: onDark ? theme.accent : theme.accent }}
    >
      <span className="h-px w-8" style={{ background: `${theme.accent}99` }} aria-hidden="true" />
      {children}
    </p>
  );
}

// ─── Section heading ──────────────────────────────────────────────────────────
function SectionHeading({
  eyebrow,
  title,
  description,
  theme,
  align = "left",
  as: Tag = "h2",
  className = "",
  onDark = false,
}: {
  eyebrow?: ReactNode;
  title: ReactNode;
  description?: ReactNode;
  theme: Theme;
  align?: "left" | "center";
  as?: "h2" | "h3";
  className?: string;
  onDark?: boolean;
}) {
  const centered = align === "center";
  const size = Tag === "h2" ? "text-3xl sm:text-4xl md:text-[2.85rem]" : "text-2xl sm:text-3xl";
  return (
    <div className={`mb-10 max-w-3xl ${centered ? "mx-auto text-center" : ""} ${className}`}>
      {eyebrow ? <Eyebrow theme={theme} onDark={onDark}>{eyebrow}</Eyebrow> : null}
      <Tag
        className={`text-balance ${size} font-medium leading-[1.05] tracking-[-0.035em]`}
        style={{ color: onDark ? "#ffffff" : theme.text }}
      >
        {typeof title === "string" && title.trim() ? title : title || "Designed with purpose."}
      </Tag>
      {description && (
        <p
          className={`mt-6 max-w-2xl text-base leading-[1.85] md:text-[1.05rem] ${centered ? "mx-auto" : ""}`}
          style={{ color: onDark ? "rgba(255,255,255,0.75)" : theme.muted }}
        >
          {description}
        </p>
      )}
    </div>
  );
}

// ─── Action link ──────────────────────────────────────────────────────────────
function ActionLink({
  cta,
  theme,
  variant = "primary",
  onDark = false,
}: {
  cta?: RecordValue | null;
  theme: Theme;
  variant?: "primary" | "outline" | "text";
  onDark?: boolean;
}) {
  if (!cta || cta.enabled === false || !str(cta.label)) return null;
  const variantKey = str(cta.variant || variant);
  const base =
    "group inline-flex min-h-12 items-center justify-center gap-3 border px-7 py-3.5 text-[11px] font-semibold uppercase tracking-[0.22em] transition-all duration-300";

  let classes = "";
  let style: CSSProperties = {};
  if (variantKey === "primary") {
    classes = "text-[#0f1612] hover:shadow-[0_10px_36px_-14px_rgba(0,0,0,0.5)]";
    style = { background: theme.accent, borderColor: theme.accent };
  } else if (variantKey === "outline" || variantKey === "secondary") {
    classes = onDark
      ? "border-white/40 text-white hover:border-white hover:bg-white hover:text-[#0f1612]"
      : "hover:bg-[#0f1612] hover:text-white hover:border-[#0f1612]";
    style = onDark ? { color: "white", borderColor: "rgba(255,255,255,0.4)" } : { color: theme.text, borderColor: theme.border };
  } else {
    // text
    classes = onDark ? "text-white px-0 hover:underline" : "px-0 hover:underline";
    style = onDark ? { color: "white" } : { color: theme.text };
  }

  return (
    <Link href={hrefFor(cta.href)} className={`${base} ${classes}`} style={style}>
      {str(cta.label)}
      <span aria-hidden="true" className="text-sm transition-transform duration-300 group-hover:translate-x-1">→</span>
    </Link>
  );
}

// ─── Image panel ──────────────────────────────────────────────────────────────
function ImagePanel({
  src,
  alt,
  className = "",
  overlay = true,
  theme,
  caption,
  fallbackSrc,
}: {
  src?: unknown;
  alt?: unknown;
  className?: string;
  overlay?: boolean;
  theme: Theme;
  caption?: string;
  fallbackSrc?: string;
}) {
  const image = str(src);
  const backgroundImages = image
    ? [
        `linear-gradient(${overlay ? "180deg,transparent 50%,rgba(7,12,9,.32)" : "transparent"})`,
        `url("${image.replaceAll('"', "%22")}")`,
        fallbackSrc ? `url("${fallbackSrc.replaceAll('"', "%22")}")` : "",
      ].filter(Boolean).join(", ")
    : "";
  return (
    <div
      role={image ? "img" : undefined}
      aria-label={image ? str(alt) || "Project photograph" : undefined}
      className={`relative overflow-hidden ${className}`}
      style={{
        backgroundColor: theme.primary,
        backgroundImage: image ? backgroundImages : `linear-gradient(135deg, ${theme.primary} 0%, #0a0f0c 100%)`,
        backgroundSize: "cover",
        backgroundPosition: "center",
      }}
    >
      {!image && (
        <div className="absolute inset-0 flex items-end p-7">
          <span className="text-[10px] uppercase tracking-[0.3em] text-white/40">
            {caption || "Sampan Development — Thoughtfully built"}
          </span>
        </div>
      )}
    </div>
  );
}

// ─── Hero ─────────────────────────────────────────────────────────────────────
function Hero({ project, theme }: { project: Project; theme: Theme }) {
  const hero = project.hero || {};
  const location = project.location || {};
  const heroImage = str(hero.backgroundImage || hero.image || hero.imageUrl);
  const mobileImage = str(hero.mobileImage);
  const fallbackImage = projectFallbackImage(project);
  const imageAlt = str(hero.backgroundImageAlt) || `${project.projectName} project`;
  const desktopBackgroundImages = [
    heroImage ? `url("${heroImage.replaceAll('"', "%22")}")` : "",
    fallbackImage ? `url("${fallbackImage.replaceAll('"', "%22")}")` : "",
  ].filter(Boolean).join(", ") || "none";
  const mobileBackgroundImages = [
    `url("${mobileImage.replaceAll('"', "%22")}")`,
    fallbackImage ? `url("${fallbackImage.replaceAll('"', "%22")}")` : "",
  ].filter(Boolean).join(", ");
  const title = str(hero.title) || project.projectName;
  const description = str(hero.description) || project.shortDescription || project.longDescription || "";
  const primaryCta = (hero.primaryCTA || arr(project.ctas)[0]) as RecordValue | undefined;
  const secondaryCta = (hero.secondaryCTA || arr(project.ctas)[1]) as RecordValue | undefined;
  const alignment = str(hero.alignment).toLowerCase();
  const imageCaption = str(hero.imageCaption);

  const showBreadcrumb = bool(hero.showBreadcrumbs, true);
  const showStatus = bool(hero.showProjectStatus, true);
  const showLocation = bool(hero.showLocation, true);
  const showScrollIndicator = bool(hero.showScrollIndicator, true);
  const showQuickFacts = bool(hero.showQuickFacts, true);
  const quickFacts = showQuickFacts ? arr(hero.quickFacts).filter((f) => bool(f.visibility, true) && has(f.value)) : [];

  const justifyContent = alignment === "center" ? "justify-center" : "";
  const textCenter = alignment === "center" ? "text-center" : "";
  const bottomAlign = alignment === "bottom-left" || alignment === "bottom";

  return (
    <section
      className={`relative isolate flex min-h-[88svh] flex-col overflow-hidden text-white md:min-h-[96svh] ${bottomAlign ? "justify-end" : "justify-between"}`}
      style={{
        background: theme.gradient,
        backgroundSize: "cover",
        backgroundPosition: str(hero.backgroundPosition) || "center",
      }}
    >
      <div
        role="img"
        aria-label={imageAlt}
        className="absolute inset-0 -z-10 hidden bg-cover bg-center md:block"
        style={{
          backgroundImage: desktopBackgroundImages,
          backgroundPosition: str(hero.backgroundPosition) || "center",
        }}
      />
      {mobileImage && (
        <div
          role="img"
          aria-label={imageAlt}
          className="absolute inset-0 -z-10 bg-cover bg-center md:hidden"
          style={{
            backgroundImage: mobileBackgroundImages,
            backgroundPosition: str(hero.backgroundPosition) || "center",
          }}
        />
      )}
      <div
        className="absolute inset-0 -z-10"
        style={{
          background: str(hero.overlay) || `linear-gradient(110deg, ${theme.primary}e8 0%, ${theme.primary}80 50%, ${theme.primary}20 100%)`,
        }}
      />
      <div className="absolute inset-0 -z-10 bg-[linear-gradient(0deg,rgba(0,0,0,.5),transparent_50%)]" />
      <div className="absolute inset-0 -z-10 bg-[radial-gradient(ellipse_at_50%_100%,rgba(0,0,0,0.4),transparent_55%)]" />

      {/* breadcrumb */}
      {showBreadcrumb && (
        <div className="mx-auto w-full max-w-[1600px] px-5 pt-10 sm:px-8 md:px-12 md:pt-14">
          <nav
            className="flex flex-wrap items-center gap-3 text-[10px] font-medium uppercase tracking-[0.28em] text-white/65"
            aria-label="Breadcrumb"
          >
            <Link href="/" className="transition-colors hover:text-white">Home</Link>
            <span style={{ color: theme.accent }}>/</span>
            <Link href="/projects" className="transition-colors hover:text-white">Projects</Link>
            <span style={{ color: theme.accent }}>/</span>
            <span className="text-white/85">{titleCase(str(project.category || project.projectType)) || "Development"}</span>
            {showStatus && str(project.status) && (
              <>
                <span className="text-white/25">/</span>
                <span style={{ color: theme.accent }}>{titleCase(str(project.status))}</span>
              </>
            )}
          </nav>
        </div>
      )}

      {/* hero body */}
      <div className={`mx-auto w-full max-w-[1600px] px-5 ${bottomAlign ? "pb-14 pt-20" : "py-20"} sm:px-8 md:px-12 md:${bottomAlign ? "pb-20" : "py-28"} ${textCenter}`}>
        <div className={`max-w-5xl ${justifyContent}`}>
          <p className="mb-7 text-[10px] font-semibold uppercase tracking-[0.32em]" style={{ color: theme.accent }}>
            {str(hero.eyebrow || project.brandName || "Sampan Development")}
          </p>
          <h1 className="max-w-5xl text-balance text-5xl font-medium leading-[0.98] tracking-[-0.06em] sm:text-6xl md:text-7xl lg:text-[clamp(4rem,7.5vw,8rem)]">
            {title}
          </h1>
          {(str(hero.highlightedText) || str(hero.highlight) || str(project.tagline)) && (
            <p className="mt-7 max-w-2xl text-xl font-light leading-[1.45] text-white/90 sm:text-2xl md:text-[1.6rem]">
              {str(hero.highlightedText) || str(hero.highlight) || str(project.tagline)}
            </p>
          )}
          {description && (
            <p className="mt-6 max-w-2xl text-[15px] leading-[1.85] text-white/75 sm:text-base">{description}</p>
          )}
          <div className={`mt-10 flex flex-wrap gap-3 ${justifyContent}`}>
            <ActionLink cta={primaryCta} theme={theme} variant="primary" onDark />
            <ActionLink cta={secondaryCta} theme={theme} variant="outline" onDark />
          </div>
          {showLocation && str(location.area || location.address || location.city) && (
            <div className={`mt-10 flex flex-wrap items-center gap-x-8 gap-y-3 text-xs text-white/75 ${justifyContent}`}>
              <span className="inline-flex items-center gap-2.5">
                <svg className="h-3.5 w-3.5" style={{ color: theme.accent }} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M12 21c5-5 9-9.5 9-13a9 9 0 10-18 0c0 3.5 4 8 9 13z" />
                  <circle cx="12" cy="8" r="2.5" />
                </svg>
                {[str(location.area), str(location.city), str(location.country)].filter(Boolean).join(", ") || str(location.address)}
              </span>
            </div>
          )}
        </div>
      </div>

      {/* quick facts bar */}
      {quickFacts.length > 0 && (
        <div className="border-t border-white/10 bg-black/20 backdrop-blur-[3px]">
          <div className="mx-auto flex w-full max-w-[1600px] flex-wrap items-center justify-between gap-8 px-5 py-7 sm:px-8 md:px-12 md:py-9">
            <div className="grid flex-1 grid-cols-2 sm:grid-cols-4">
              {quickFacts.slice(0, 4).map((fact, i) => (
                <div key={str(fact.label) || i} className="border-l border-white/15 px-5 py-1 first:pl-0 sm:px-7">
                  <span className="block text-[9px] uppercase tracking-[0.22em] text-white/50">{str(fact.label)}</span>
                  <strong className="mt-2.5 block text-base font-medium text-white sm:text-lg">
                    {str(fact.value)} <span className="text-xs font-normal" style={{ color: theme.accent }}>{str(fact.unit)}</span>
                  </strong>
                </div>
              ))}
            </div>
            {showScrollIndicator && (
              <a href="#project-overview" className="hidden items-center gap-3 text-[9px] uppercase tracking-[0.28em] text-white/55 transition hover:text-white sm:flex">
                <span className="h-px w-12" style={{ background: theme.accent }} />
                Scroll to explore
              </a>
            )}
          </div>
        </div>
      )}

      {imageCaption && (
        <div className="absolute bottom-3 right-4 z-10 hidden text-[9px] uppercase tracking-[0.2em] text-white/40 md:block">
          {imageCaption}
        </div>
      )}
    </section>
  );
}

// ─── Overview ──────────────────────────────────────────────────────────────────
function Overview({ project, theme }: { project: Project; theme: Theme }) {
  const overview = project.overview || {};
  const title = str(overview.sectionTitle || overview.title);
  const subtitle = str(overview.sectionSubtitle || overview.subtitle);
  const description = str(overview.description || overview.supportingText);
  const quote = str(overview.editorialQuote);
  const image = str(overview.image);
  const fallbackImage = projectFallbackImage(project);
  const highlights = arr(overview.highlights).filter((h) => has(h.title) || has(h.description));
  const layout = str(overview.layout).toLowerCase();
  const isWide = layout.includes("wide");
  const isCinematic = layout.includes("cinematic");
  const imageRight = layout.includes("image-right") || layout.includes("copy-left");
  const imageLeft = layout.includes("image-left") || layout.includes("copy-right");
  const imageTop = layout.includes("wide") || (overview as RecordValue).imageSide === "top";

  if (!title && !subtitle && !description && !image && !quote && highlights.length === 0) return null;

  return (
    <section id="project-overview" className="px-5 py-24 sm:px-8 md:px-12 md:py-32" style={{ background: theme.background, color: theme.text }}>
      <div className="mx-auto max-w-7xl">
        {(isWide || isCinematic) && image ? (
          // wide-image-editorial: image first, then text below
          <div className="mb-16">
            <ImagePanel src={image} alt={overview.imageAlt} theme={theme} fallbackSrc={fallbackImage} className="w-full min-h-[36rem] md:min-h-[56rem]" />
          </div>
        ) : null}

        <div className={`grid gap-12 md:gap-20 ${isWide || isCinematic ? "md:grid-cols-[0.4fr_1.6fr]" : image && !imageTop ? "md:grid-cols-2 items-center" : "md:grid-cols-[0.4fr_1.6fr]"}`}>
          {/* Image side */}
          {!isWide && !isCinematic && image ? (
            <div className={imageLeft ? "md:order-1" : "md:order-2"}>
              <ImagePanel src={image} alt={overview.imageAlt} theme={theme} fallbackSrc={fallbackImage} className="min-h-[28rem] md:min-h-[40rem]" />
            </div>
          ) : null}

          {/* Text side */}
          <div className={imageLeft ? "md:order-2" : imageRight ? "md:order-1" : ""}>
            <Eyebrow theme={theme}>{str(overview.eyebrow) || "A considered approach"}</Eyebrow>
            {subtitle && (
              <p className="mb-5 text-sm uppercase tracking-[0.22em]" style={{ color: theme.muted }}>{subtitle}</p>
            )}
            <h2 className="text-balance text-3xl font-medium leading-[1.08] tracking-[-0.04em] sm:text-4xl md:text-[3rem]" style={{ color: theme.text }}>
              {title || str(project.tagline) || `Introducing ${project.projectName}`}
            </h2>
            {description && (
              <p className="mt-7 max-w-3xl text-base leading-[1.9] md:text-lg" style={{ color: theme.muted }}>{description}</p>
            )}
            {quote && (
              <blockquote
                className="mt-10 border-l-2 pl-7 text-xl font-light italic leading-[1.6] md:text-2xl"
                style={{ borderColor: theme.accent, color: theme.primary }}
              >
                "{quote}"
              </blockquote>
            )}
            {highlights.length > 0 && (
              <div className={`mt-12 grid gap-6 ${highlights.length >= 3 ? "sm:grid-cols-3" : "sm:grid-cols-2"}`}>
                {highlights.map((h, i) => (
                  <div key={i} className="border-t pt-5" style={{ borderColor: theme.border }}>
                    <span className="mb-3 block font-mono text-[10px] tracking-[0.15em]" style={{ color: theme.accent }}>{pad(i + 1)}</span>
                    <h3 className="text-base font-medium tracking-[-0.01em]" style={{ color: theme.text }}>{str(h.title)}</h3>
                    {str(h.description) && (
                      <p className="mt-2 text-[14px] leading-7" style={{ color: theme.muted }}>{str(h.description)}</p>
                    )}
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

// ─── Specifications ────────────────────────────────────────────────────────────
function Specifications({ project, theme }: { project: Project; theme: Theme }) {
  const specs = arr(project.specifications).filter((item) => bool(item.visibility, true) && has(item.value ?? item.label ?? item.title));
  const heroFacts = arr(project.hero?.quickFacts).filter((item) => bool(item.visibility, true) && has(item.value));
  const facts = specs.length ? specs : heroFacts;
  if (!facts.length) return null;

  // Pull title/subtitle from the section of type "specifications" if present
  const specsSection = arr(project.sections).find((s) => str(s.type).includes("specifications") && s.enabled !== false);
  const heading = specsSection ? str(specsSection.title) : "";
  const subheading = specsSection ? str(specsSection.subtitle) : "";
  const eyebrow = specsSection ? str(specsSection.eyebrow) : "The details";

  return (
    <section className="px-5 py-20 sm:px-8 md:px-12 md:py-28" style={{ background: theme.surface, color: theme.text }}>
      <div className="mx-auto max-w-7xl">
        <div className="mb-12 flex flex-wrap items-end justify-between gap-6 border-b pb-8" style={{ borderColor: theme.border }}>
          <div>
            <Eyebrow theme={theme}>{eyebrow}</Eyebrow>
            <h2 className="text-3xl font-medium tracking-[-0.035em] sm:text-4xl" style={{ color: theme.text }}>
              {heading || "Project at a glance"}
            </h2>
            {subheading && <p className="mt-2 text-sm" style={{ color: theme.muted }}>{subheading}</p>}
          </div>
          <span className="text-[10px] uppercase tracking-[0.28em]" style={{ color: theme.muted }}>Key information</span>
        </div>
        <div className="grid grid-cols-2 border-l border-t md:grid-cols-4" style={{ borderColor: theme.border }}>
          {facts.slice(0, 8).map((item, index) => (
            <div
              key={str(item.label) || str(item.title) || index}
              className="group relative min-h-40 border-b border-r p-6 transition-colors duration-300 sm:p-8"
              style={{ borderColor: theme.border }}
            >
              <div className="mb-8 flex items-center justify-between">
                <span className="font-mono text-[10px] tracking-[0.15em]" style={{ color: theme.accent }}>
                  {pad(index + 1)} / {pad(facts.length)}
                </span>
                {str(item.icon) && <SpecIcon name={str(item.icon)} theme={theme} />}
              </div>
              <p className="text-[11px] uppercase tracking-[0.18em]" style={{ color: theme.muted }}>
                {str(item.label) || str(item.title) || "Specification"}
              </p>
              <p className="mt-3 text-2xl font-medium tracking-[-0.03em] sm:text-[1.7rem]" style={{ color: theme.text }}>
                {[str(item.value), str(item.unit)].filter(Boolean).join(" ") || str(item.name)}
              </p>
              {str(item.description) && (
                <p className="mt-3 text-[13px] leading-6" style={{ color: theme.muted }}>{str(item.description)}</p>
              )}
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

// ─── ContentSection (handles all section types) ───────────────────────────────
function ContentSection({ project, section, index, total, theme }: { project: Project; section: RecordValue; index: number; total: number; theme: Theme }) {
  if (section.enabled === false || section.visibility === false) return null;

  const id = str(section.id);
  const type = str(section.type || section.layout).toLowerCase();
  const layout = str(section.layout).toLowerCase();
  const sectionTheme = str(section.theme).toLowerCase();
  const eyebrow = str(section.eyebrow);
  const title = str(section.title || section.heading);
  const subtitle = str(section.subtitle);
  const content = (section.content && typeof section.content === "object" ? section.content : {}) as RecordValue;
  const media = (section.media && typeof section.media === "object" ? section.media : {}) as RecordValue;
  const description = str(section.description || content.description || section.body || subtitle);
  const image = str(media.src || section.image || section.imageUrl);
  const imageAlt = str(media.alt || section.imageAlt);
  const cta = section.cta && typeof section.cta === "object" ? (section.cta as RecordValue) : null;
  const settings = (section.settings && typeof section.settings === "object" ? section.settings : {}) as RecordValue;
  const imageSide = str(settings.imageSide).toLowerCase();
  const showIndex = bool(settings.showIndex, false);
  const contentStatus = str(section.contentStatus);

  const isDark = sectionTheme === "dark";
  const bg = isDark ? theme.gradient : index % 2 === 0 ? theme.surface : theme.background;
  const text = isDark ? "#ffffff" : theme.text;
  const muted = isDark ? "rgba(255,255,255,0.75)" : theme.muted;
  const border = isDark ? "rgba(255,255,255,0.15)" : theme.border;

  // Skip duplicate "specifications" sections — handled by top-level <Specifications>
  if (type.includes("specifications") && !type.includes("specification-grid")) return null;

  // ─── Enquiry CTA section ────────────────────────────────────────────────────
  if (type.includes("enquiry-cta") || id === "enquiry") {
    const supportingText = str(content.supportingText);
    const fullBleed = layout.includes("full-bleed") || layout.includes("nature-image") || layout.includes("bold-panel") || layout.includes("image");
    return (
      <section id={id || "enquiry"} className={`relative isolate overflow-hidden px-5 py-24 sm:px-8 md:px-12 md:py-32 ${isDark ? "text-white" : ""}`} style={{ background: bg, color: text }}>
        {image && fullBleed && (
          <div
            className="absolute inset-0 -z-10"
            style={{
              backgroundImage: `linear-gradient(${isDark ? "90deg, rgba(0,0,0,.82) 0%, rgba(0,0,0,.45) 60%, rgba(0,0,0,.2) 100%" : "90deg, rgba(255,255,255,.95) 0%, rgba(255,255,255,.55) 60%, transparent 100%"}), url("${image.replaceAll('"', "%22")}")`,
              backgroundSize: "cover",
              backgroundPosition: "center",
            }}
          />
        )}
        {!image && (
          <div className="absolute -right-16 -top-32 -z-10 select-none font-serif text-[32vw] font-semibold leading-none tracking-[-0.1em] opacity-[0.04]">S</div>
        )}
        <div className="mx-auto flex max-w-7xl flex-col justify-between gap-12 md:flex-row md:items-end">
          <div className="max-w-3xl">
            <Eyebrow theme={theme} onDark={isDark}>{eyebrow || "Begin a conversation"}</Eyebrow>
            <h2 className="text-balance text-4xl font-medium leading-[1.05] tracking-[-0.04em] sm:text-5xl md:text-[3.5rem]" style={{ color: text }}>
              {title || "Every great place starts with a conversation."}
            </h2>
            {(subtitle || supportingText) && (
              <p className="mt-6 max-w-xl text-base leading-[1.85] md:text-lg" style={{ color: muted }}>
                {supportingText || subtitle || `Connect with the Sampan team to learn more about ${project_name_placeholder(project)}, availability and the next steps.`}
              </p>
            )}
          </div>
          <div className="flex shrink-0 flex-wrap gap-3">
            <ActionLink cta={cta || { label: "Make an enquiry", href: "/contact" }} theme={theme} variant="primary" onDark={isDark} />
            <Link
              href="/contact"
              className="group inline-flex min-h-12 items-center justify-center border px-7 py-3.5 text-[11px] font-semibold uppercase tracking-[0.22em] transition"
              style={{ borderColor: isDark ? "rgba(255,255,255,0.3)" : theme.border, color: isDark ? "white" : theme.text }}
            >
              Contact us
              <span aria-hidden="true" className="ml-3 text-sm transition-transform duration-300 group-hover:translate-x-0.5">→</span>
            </Link>
          </div>
        </div>
      </section>
    );
  }

  // ─── FAQ section ────────────────────────────────────────────────────────────
  if (type.includes("faq")) {
    const faqItems = arr(content.items || section.items);
    return (
      <section id={id} className="px-5 py-20 sm:px-8 md:px-12 md:py-28" style={{ background: bg, color: text }}>
        <div className="mx-auto grid max-w-7xl gap-12 md:grid-cols-[0.4fr_1.6fr] md:gap-20">
          <SectionHeading
            theme={theme}
            eyebrow={eyebrow || "Good to know"}
            title={title || "Frequently asked questions"}
            description={description || "A few helpful details to guide your next step."}
            onDark={isDark}
          />
          {faqItems.length > 0 ? (
            <div className="divide-y border-y" style={{ borderColor: border }}>
              {faqItems.map((item, i) => {
                const q = str(item.question || item.title);
                const a = str(item.answer || item.body || item.description);
                if (!q && !a) return null;
                return (
                  <details key={i} className="group py-6">
                    <summary
                      className="flex cursor-pointer list-none items-center justify-between gap-5 text-base font-medium [&::-webkit-details-marker]:hidden"
                      style={{ color: text }}
                    >
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
            // Empty FAQ state — graceful fallback with CTA
            <div className="border-y py-10" style={{ borderColor: border }}>
              <p className="text-base leading-[1.85]" style={{ color: muted }}>
                {subtitle || "Project-specific FAQs will be added as information is confirmed. Have a question in the meantime?"}
              </p>
              <div className="mt-6">
                <ActionLink cta={{ label: "Ask our team", href: "/contact", variant: "outline", enabled: true }} theme={theme} variant="outline" onDark={isDark} />
              </div>
            </div>
          )}
        </div>
      </section>
    );
  }

  // ─── Location and map section ─────────────────────────────────────────────
  if (type.includes("location")) {
    const location = project.location || {};
    const advantages = items(content.advantages || content.points).filter((entry) =>
      typeof entry === "string" ? Boolean(entry.trim()) : Boolean(entry && typeof entry === "object"),
    );
    const address = str(content.address || location.address);
    const locality = [str(location.area), str(location.city), str(location.country)].filter(Boolean).join(", ");
    const mapUrl = googleMapsEmbed(content.mapEmbedUrl || location.mapEmbedUrl);

    return (
      <section id={id} className="px-5 py-20 sm:px-8 md:px-12 md:py-28" style={{ background: bg, color: text }}>
        <div className="mx-auto max-w-7xl">
          <SectionHeading
            theme={theme}
            eyebrow={eyebrow || "Location"}
            title={title || "A connected location"}
            description={description}
            onDark={isDark}
          />
          <div className={`grid items-start gap-10 lg:grid-cols-2 lg:gap-16 ${imageSide === "right" ? "lg:[&>*:first-child]:order-2" : ""}`}>
            <div>
              {image && (
                <ImagePanel src={image} alt={imageAlt} theme={theme} fallbackSrc={projectFallbackImage(project)} className="min-h-[24rem] md:min-h-[34rem]" />
              )}
              {mapUrl && (
                <iframe
                  src={mapUrl}
                  title={`${project.projectName} location map`}
                  loading="lazy"
                  referrerPolicy="no-referrer-when-downgrade"
                  className="mt-5 aspect-[4/3] w-full border-0"
                />
              )}
            </div>
            <div className="py-2">
              {locality && <p className="text-xl font-medium tracking-[-0.02em]">{locality}</p>}
              {address && <p className="mt-3 text-sm leading-7" style={{ color: muted }}>{address}</p>}
              {advantages.length > 0 && (
                <ul className="mt-6 divide-y border-y" style={{ borderColor: border }}>
                  {advantages.map((entry, i) => {
                    const item = typeof entry === "string" ? null : entry as RecordValue;
                    const heading = item ? str(item.title || item.name || item.label) : str(entry);
                    const detail = item ? str(item.description || item.body) : "";
                    return (
                      <li key={i} className="py-5">
                        {heading && <p className="font-medium">{heading}</p>}
                        {detail && <p className="mt-1 text-sm leading-7" style={{ color: muted }}>{detail}</p>}
                      </li>
                    );
                  })}
                </ul>
              )}
              {!locality && !address && !advantages.length && !mapUrl && (
                <p className="text-sm leading-7" style={{ color: muted }}>
                  {subtitle || "Verified address and map details will be added when available."}
                </p>
              )}
            </div>
          </div>
        </div>
      </section>
    );
  }

  // ─── Image gallery section ──────────────────────────────────────────────────
  if (type.includes("image-gallery") || type.includes("gallery")) {
    const galleryItems = items((section.gallery as RecordValue | undefined)?.items || content.items || content.images || section.images);
    if (!galleryItems.length) {
      // Empty gallery state — graceful placeholder
      return (
        <section id={id} className="px-5 py-20 sm:px-8 md:px-12 md:py-28" style={{ background: bg, color: text }}>
          <div className="mx-auto max-w-7xl">
            <SectionHeading
              theme={theme}
              eyebrow={eyebrow || "Visual story"}
              title={title || "Explore the project"}
              description={description || subtitle}
              onDark={isDark}
            />
            <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
              {[0, 1, 2].map((i) => (
                <div
                  key={i}
                  className="flex min-h-64 flex-col items-center justify-center border p-8 text-center"
                  style={{ borderColor: border, background: isDark ? "rgba(255,255,255,0.03)" : theme.surface }}
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
        </section>
      );
    }
    return (
      <section id={id} className="px-5 py-20 sm:px-8 md:px-12 md:py-28" style={{ background: bg, color: text }}>
        <div className="mx-auto max-w-7xl">
          <SectionHeading theme={theme} eyebrow={eyebrow || "Visual notes"} title={title || "A closer look"} description={description} onDark={isDark} />
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {galleryItems.map((entry, i) => {
              const item = (entry && typeof entry === "object" ? entry : { src: entry }) as RecordValue;
              return (
                <figure key={str(item.id) || str(item.src) || i} className={`group ${i === 0 ? "sm:row-span-2" : ""}`}>
                  <ImagePanel src={item.src || item.image || item.url} alt={item.alt || item.caption} theme={theme} fallbackSrc={projectFallbackImage(project)} className={i === 0 ? "h-full min-h-[28rem]" : "min-h-72"} />
                  {str(item.caption || item.title) && (
                    <figcaption className="pt-4 text-[11px] uppercase tracking-[0.18em]" style={{ color: muted }}>{str(item.caption || item.title)}</figcaption>
                  )}
                </figure>
              );
            })}
          </div>
        </div>
      </section>
    );
  }

  // ─── Architecture / cinematic full-bleed section ───────────────────────────
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
              backgroundImage: `linear-gradient(180deg, transparent 30%, ${theme.primary}f2 100%), url("${image.replaceAll('"', "%22")}")`,
              backgroundSize: "cover",
              backgroundPosition: "center",
            }}
          />
          <div className="mx-auto w-full max-w-7xl px-5 py-20 sm:px-8 md:px-12 md:py-28">
            <Eyebrow theme={theme} onDark>{eyebrow}</Eyebrow>
            <h2 className="max-w-4xl text-balance text-4xl font-medium leading-[1.05] tracking-[-0.04em] sm:text-5xl md:text-[3.5rem]">{title}</h2>
            {body && <p className="mt-6 max-w-2xl text-base leading-[1.85] text-white/80 md:text-lg">{body}</p>}
            {principles.length > 0 && (
              <div className="mt-10 grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
                {principles.map((p, i) => (
                  <div key={i} className="border-t border-white/15 pt-4">
                    <span className="mb-2 block font-mono text-[10px] tracking-[0.15em]" style={{ color: theme.accent }}>{pad(i + 1)}</span>
                    <h3 className="text-base font-medium">{str(p.title || p.name || p.label)}</h3>
                    {str(p.description || p.body) && <p className="mt-1 text-sm leading-7 text-white/70">{str(p.description || p.body)}</p>}
                  </div>
                ))}
              </div>
            )}
            {subtitle && <p className="mt-6 max-w-2xl text-base leading-[1.85] text-white/70 md:text-lg">{subtitle}</p>}
          </div>
        </section>
      );
    }
    // fall through to default if not full-bleed
  }

  // ─── Numbered cards variant (commercial-opportunities, hospitality-experience) ─
  if (type.includes("commercial-opportunities") || type.includes("opportunities") || type.includes("experience")) {
    const opportunities = arr(content.opportunities || content.experiences || content.details || content.items);
    return (
      <section id={id} className="px-5 py-20 sm:px-8 md:px-12 md:py-28" style={{ background: bg, color: text }}>
        <div className="mx-auto max-w-7xl">
          <SectionHeading theme={theme} eyebrow={eyebrow} title={title} description={description || subtitle} onDark={isDark} />
          {opportunities.length > 0 ? (
            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
              {opportunities.map((op, i) => (
                <div
                  key={i}
                  className="group relative flex min-h-64 flex-col justify-between border p-8 transition-all duration-300 sm:p-10"
                  style={{ borderColor: border, background: isDark ? "rgba(255,255,255,0.03)" : theme.surface }}
                >
                  <div className="absolute right-0 top-0 h-1 w-0 transition-all duration-500 group-hover:w-full" style={{ background: theme.accent }} />
                  <span className="font-mono text-[10px] uppercase tracking-[0.18em]" style={{ color: theme.accent }}>
                    {pad(i + 1)} — {str(op.label || op.type || "Opportunity")}
                  </span>
                  <div>
                    <h3 className="text-xl font-medium leading-[1.1] tracking-[-0.035em] sm:text-2xl" style={{ color: text }}>{str(op.title || op.name)}</h3>
                    {str(op.description || op.body) && <p className="mt-3 text-sm leading-7" style={{ color: muted }}>{str(op.description || op.body)}</p>}
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="border-l-2 pl-6 py-4" style={{ borderColor: theme.accent }}>
              <p className="text-sm leading-[1.85]" style={{ color: muted }}>
                {subtitle || "Confirmed offerings and details will be added here once verified."}
              </p>
            </div>
          )}
          {cta && (
            <div className="mt-12">
              <ActionLink cta={cta} theme={theme} variant={str(cta.variant) || "outline"} onDark={isDark} />
            </div>
          )}
        </div>
      </section>
    );
  }

  // ─── Investment-overview / land-share section (with legalDisclaimer) ────────
  if (type.includes("investment") || type.includes("land-share") || type.includes("ownership")) {
    const details = arr(content.details || content.items || content.points);
    const legalDisclaimer = str(content.legalDisclaimer);
    return (
      <section id={id} className="px-5 py-20 sm:px-8 md:px-12 md:py-28" style={{ background: bg, color: text }}>
        <div className="mx-auto max-w-7xl">
          <div className="grid gap-12 md:grid-cols-2 md:gap-20">
            <div>
              <SectionHeading theme={theme} eyebrow={eyebrow || "Ownership concept"} title={title} description={description || subtitle} onDark={isDark} />
              {details.length > 0 && (
                <div className="mt-8 divide-y border-y" style={{ borderColor: border }}>
                  {details.map((d, i) => (
                    <div key={i} className="flex gap-6 py-5">
                      <span className="font-mono pt-1 text-[10px] tracking-[0.15em]" style={{ color: theme.accent }}>{pad(i + 1)}</span>
                      <div>
                        <h3 className="text-base font-medium" style={{ color: text }}>{str(d.title || d.label || d.name)}</h3>
                        {str(d.description || d.value || d.body) && <p className="mt-1 text-sm leading-7" style={{ color: muted }}>{str(d.description || d.value || d.body)}</p>}
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
            <div>
              {image && (
                <ImagePanel src={image} alt={imageAlt} theme={theme} fallbackSrc={projectFallbackImage(project)} className="mb-8 min-h-[24rem] md:min-h-[32rem]" />
              )}
              {legalDisclaimer && (
                <div className="border p-6" style={{ borderColor: border, background: isDark ? "rgba(255,255,255,0.03)" : theme.surface }}>
                  <div className="mb-3 flex items-center gap-3">
                    <svg className="h-4 w-4" style={{ color: theme.accent }} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
                      <circle cx="12" cy="12" r="10" />
                      <path strokeLinecap="round" strokeLinejoin="round" d="M12 8v4M12 16h.01" />
                    </svg>
                    <span className="text-[10px] font-semibold uppercase tracking-[0.22em]" style={{ color: theme.accent }}>Important note</span>
                  </div>
                  <p className="text-sm leading-[1.85]" style={{ color: muted }}>{legalDisclaimer}</p>
                </div>
              )}
              {cta && (
                <div className="mt-6">
                  <ActionLink cta={cta} theme={theme} variant={str(cta.variant) || "outline"} onDark={isDark} />
                </div>
              )}
            </div>
          </div>
        </div>
      </section>
    );
  }

  // ─── Default editorial split section ──────────────────────────────────────
  // used by: editorial-intro, image-text, location-advantages, etc.
  const body = str(content.body || content.supportingText);
  const entries = items(
    content.highlights || content.items || content.features || content.amenities ||
    content.points || content.advantages || content.details || content.opportunities ||
    content.experiences || section.items || section.features
  );

  // image placement
  const imageRight = layout.includes("image-right") || layout.includes("copy-left") || imageSide === "right" || layout.includes("asymmetric") || layout.includes("offset");
  const imageLeft = layout.includes("image-left") || layout.includes("copy-right") || imageSide === "left";
  const imageTop = layout.includes("wide") || imageSide === "top" || layout.includes("cinematic-split");
  const reversed = imageLeft || (!imageRight && index % 2 === 1);

  // skip if literally nothing
  if (!title && !description && !body && !entries.length && !image && !subtitle) return null;

  return (
    <section id={id} className="px-5 py-20 sm:px-8 md:px-12 md:py-28" style={{ background: bg, color: text }}>
      <div className="mx-auto max-w-7xl">
        {showIndex && (
          <div className="mb-10 flex items-center gap-4">
            <span className="font-mono text-[10px] tracking-[0.18em]" style={{ color: theme.accent }}>
              {pad(index + 1)} / {pad(total)}
            </span>
            <span className="h-px flex-1" style={{ background: border }} />
          </div>
        )}

        {imageTop && image ? (
          // image-top layout (wide-image-editorial, cinematic-split with imageSide="top")
          <div>
            <div className="mb-12">
              <ImagePanel src={image} alt={imageAlt} theme={theme} fallbackSrc={projectFallbackImage(project)} className="w-full min-h-[24rem] md:min-h-[40rem]" />
            </div>
            <div className="grid gap-8 md:grid-cols-[0.4fr_1.6fr]">
              <div>
                <Eyebrow theme={theme} onDark={isDark}>{eyebrow || `Section ${pad(index + 1)}`}</Eyebrow>
                {subtitle && <p className="text-sm uppercase tracking-[0.22em]" style={{ color: muted }}>{subtitle}</p>}
              </div>
              <div>
                <SectionHeading theme={theme} title={title} description={description} onDark={isDark} className="!mb-6" />
                {body && body !== description && <p className="mb-8 text-base leading-[1.85]" style={{ color: muted }}>{body}</p>}
                {entries.length > 0 && (
                  <div className="mt-8 divide-y border-y" style={{ borderColor: border }}>
                    {entries.map((entry, i) => {
                      const item = (entry && typeof entry === "object" ? entry : { title: entry }) as RecordValue;
                      const itemTitle = str(item.title || item.name || item.label || item.value);
                      const itemDesc = str(item.description || item.body);
                      if (!itemTitle && !itemDesc) return null;
                      return (
                        <div key={str(item.id) || itemTitle || i} className="flex gap-6 py-6">
                          <span className="font-mono pt-1 text-[10px] tracking-[0.15em]" style={{ color: theme.accent }}>{pad(i + 1)}</span>
                          <div>
                            <h3 className="text-base font-medium tracking-[-0.01em]" style={{ color: text }}>{itemTitle}</h3>
                            {itemDesc && <p className="mt-2 text-[14px] leading-7" style={{ color: muted }}>{itemDesc}</p>}
                          </div>
                        </div>
                      );
                    })}
                  </div>
                )}
                {cta && <div className="mt-10"><ActionLink cta={cta} theme={theme} variant={str(cta.variant) || "outline"} onDark={isDark} /></div>}
              </div>
            </div>
          </div>
        ) : (
          // standard 2-column split
          <div className={`grid items-center gap-12 md:gap-20 ${image ? "md:grid-cols-2" : "md:grid-cols-[0.65fr_1.35fr]"} ${reversed && image ? "md:[&>*:first-child]:order-2" : ""}`}>
            {image && (
              <ImagePanel src={image} alt={imageAlt} theme={theme} fallbackSrc={projectFallbackImage(project)} className="min-h-[24rem] md:min-h-[36rem]" />
            )}
            <div className="py-2">
              <SectionHeading
                theme={theme}
                eyebrow={eyebrow || `The story / ${pad(index + 1)}`}
                title={title}
                description={description}
                onDark={isDark}
              />
              {body && body !== description && (
                <p className="mb-8 text-base leading-[1.85]" style={{ color: muted }}>{body}</p>
              )}
              {entries.length > 0 && (
                <div className="mt-10 divide-y border-y" style={{ borderColor: border }}>
                  {entries.map((entry, i) => {
                    const item = (entry && typeof entry === "object" ? entry : { title: entry }) as RecordValue;
                    const itemTitle = str(item.title || item.name || item.label || item.value);
                    const itemDesc = str(item.description || item.body);
                    if (!itemTitle && !itemDesc) return null;
                    return (
                      <div key={str(item.id) || itemTitle || i} className="flex gap-6 py-6">
                        <span className="font-mono pt-1 text-[10px] tracking-[0.15em]" style={{ color: theme.accent }}>{pad(i + 1)}</span>
                        <div>
                          <h3 className="text-base font-medium tracking-[-0.01em]" style={{ color: text }}>{itemTitle}</h3>
                          {itemDesc && <p className="mt-2 text-[14px] leading-7" style={{ color: muted }}>{itemDesc}</p>}
                        </div>
                      </div>
                    );
                  })}
                </div>
              )}
              {contentStatus === "needs_confirmation" && !body && entries.length === 0 && (
                <p className="mt-2 text-sm italic" style={{ color: muted }}>
                  {subtitle || "Confirmed details for this section will be added once verified."}
                </p>
              )}
              {cta && <div className="mt-10"><ActionLink cta={cta} theme={theme} variant={str(cta.variant) || "outline"} onDark={isDark} /></div>}
            </div>
          </div>
        )}
      </div>
    </section>
  );
}

// helper to safely project project name into a sentence (kept server-side)
function project_name_placeholder(project: { projectName?: string }) {
  return project.projectName || "this project";
}

// ─── Related projects ─────────────────────────────────────────────────────────
function RelatedProjects({ project, allProjects, theme }: { project: Project; allProjects: Project[]; theme: Theme }) {
  const related = items(project.relatedProjects)
    .map((entry) => (typeof entry === "string" ? entry : str((entry as RecordValue)?.slug)))
    .filter(Boolean);
  if (!related.length) return null;

  return (
    <section className="px-5 py-20 sm:px-8 md:px-12 md:py-28" style={{ background: theme.background, color: theme.text }}>
      <div className="mx-auto max-w-7xl">
        <div className="mb-12 flex flex-wrap items-end justify-between gap-6 border-b pb-8" style={{ borderColor: theme.border }}>
          <div>
            <Eyebrow theme={theme}>Continue exploring</Eyebrow>
            <h2 className="text-3xl font-medium tracking-[-0.035em] sm:text-4xl" style={{ color: theme.text }}>More from Sampan</h2>
          </div>
          <Link
            href="/projects"
            className="group inline-flex items-center gap-3 text-[11px] font-semibold uppercase tracking-[0.22em] transition"
            style={{ color: theme.muted }}
          >
            All projects
            <span aria-hidden="true" className="text-sm transition-transform duration-300 group-hover:translate-x-0.5">→</span>
          </Link>
        </div>
        <div className="grid gap-4 md:grid-cols-3">
          {related.slice(0, 3).map((slug, i) => {
            const match = allProjects.find((item) => item.slug === slug);
            return (
              <Link
                href={`/projects/ongoing/${encodeURIComponent(slug)}`}
                key={slug}
                className="group relative flex min-h-64 flex-col justify-between overflow-hidden border p-8 transition-all duration-300 hover:border-[var(--theme-accent)] hover:shadow-[0_24px_60px_-30px_rgba(0,0,0,0.25)] sm:p-10"
                style={{ borderColor: theme.border, background: theme.surface }}
              >
                <div className="absolute right-0 top-0 h-1 w-0 transition-all duration-500 group-hover:w-full" style={{ background: theme.accent }} />
                <span className="font-mono text-[10px] uppercase tracking-[0.18em]" style={{ color: theme.accent }}>
                  {pad(i + 1)} — {str(match?.category) ? titleCase(str(match?.category)) : "Project"}
                </span>
                <div>
                  <h3 className="text-2xl font-medium leading-[1.1] tracking-[-0.035em] sm:text-[1.7rem]" style={{ color: theme.text }}>
                    {str(match?.projectName) || titleCase(slug)}
                  </h3>
                  {str(match?.tagline) && (
                    <p className="mt-2 text-sm leading-6" style={{ color: theme.muted }}>{str(match?.tagline)}</p>
                  )}
                  <div className="mt-5 flex items-center gap-3 text-[11px] uppercase tracking-[0.22em] opacity-0 transition-opacity duration-300 group-hover:opacity-100" style={{ color: theme.accent }}>
                    View project
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

// ─── ProjectDetails (main) ────────────────────────────────────────────────────
export default function ProjectDetails({ project, allProjects = [] }: { project: Project; allProjects?: Project[] }) {
  const theme = getTheme(project);
  const sections = arr(project.sections).filter((s) => s.enabled !== false && s.visibility !== false);
  const gallery = items((project.gallery as RecordValue | undefined)?.items)
    .map((entry) => typeof entry === "string" ? { src: entry } : entry && typeof entry === "object" && !Array.isArray(entry) ? entry as RecordValue : null)
    .filter((item): item is RecordValue => Boolean(item && has(item.src || item.image || item.url)));
  const faq = arr(project.faq).filter((item) => has(item.question) && has(item.answer));

  const themeVars: CSSProperties = {
    ["--theme-primary" as string]: theme.primary,
    ["--theme-accent" as string]: theme.accent,
    ["--theme-bg" as string]: theme.background,
    ["--theme-surface" as string]: theme.surface,
    ["--theme-text" as string]: theme.text,
    ["--theme-muted" as string]: theme.muted,
    ["--theme-border" as string]: theme.border,
  } as CSSProperties;

  return (
    <main className="min-h-screen" style={{ background: theme.background, color: theme.text, ...themeVars }}>
      <Hero project={project} theme={theme} />
      <Overview project={project} theme={theme} />
      <Specifications project={project} theme={theme} />

      {sections.map((section, index) => (
        <ContentSection
          key={str(section.id) || `${str(section.type)}-${index}`}
          project={project}
          section={section}
          index={index}
          total={sections.length}
          theme={theme}
        />
      ))}

      {/* Standalone gallery (project.gallery.items) */}
      {gallery.length > 0 && (
        <section className="px-5 py-20 sm:px-8 md:px-12 md:py-28" style={{ background: theme.surface, color: theme.text }}>
          <div className="mx-auto max-w-7xl">
            <SectionHeading
              theme={theme}
              eyebrow={str(project.gallery?.eyebrow) || "Visual notes"}
              title={str(project.gallery?.galleryTitle) || str(project.gallery?.title) || "A closer look"}
              description={str(project.gallery?.gallerySubtitle) || str(project.gallery?.description)}
            />
            <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
              {gallery.map((item, index) => (
                <figure key={str(item.id) || str(item.src) || index} className={`group ${index === 0 ? "sm:row-span-2" : ""}`}>
                  <ImagePanel src={item.src || item.image || item.url} alt={item.alt || item.caption} theme={theme} fallbackSrc={projectFallbackImage(project)} className={index === 0 ? "h-full min-h-[28rem]" : "min-h-72"} />
                  {str(item.caption || item.title) && (
                    <figcaption className="pt-4 text-[11px] uppercase tracking-[0.18em]" style={{ color: theme.muted }}>{str(item.caption || item.title)}</figcaption>
                  )}
                </figure>
              ))}
            </div>
          </div>
        </section>
      )}

      {/* Standalone project.faq */}
      {faq.length > 0 && (
        <section className="px-5 py-20 sm:px-8 md:px-12 md:py-28" style={{ background: theme.background, color: theme.text }}>
          <div className="mx-auto grid max-w-7xl gap-12 md:grid-cols-[0.4fr_1.6fr] md:gap-20">
            <SectionHeading theme={theme} eyebrow="Good to know" title="Frequently asked questions" description="A few helpful details to guide your next step." />
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
        </section>
      )}

      <RelatedProjects project={project} allProjects={allProjects} theme={theme} />
    </main>
  );
}