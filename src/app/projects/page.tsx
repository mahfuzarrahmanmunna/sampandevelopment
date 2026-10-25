"use client";

import { useEffect, useMemo, useState } from "react";
import Link from "next/link";
import ongoingData from "../data/project.json";
import completedData from "../data/sampan-completed-projects.json";

// ─── types ───────────────────────────────────────────────────────────────────
type Project = {
  id: string;
  slug: string;
  projectName: string;
  shortName?: string;
  projectType?: string;
  category?: string;
  status: string;
  shortDescription?: string | null;
  tagline?: string | null;
  location?: {
    area?: string | null;
    city?: string | null;
    country?: string | null;
  } | null;
  hero?: {
    backgroundImage?: string | null;
    backgroundImageAlt?: string | null;
    eyebrow?: string | null;
  } | null;
  theme?: {
    primary?: string;
    secondary?: string;
    accent?: string;
    background?: string;
  } | null;
  seo?: {
    metaTitle?: string | null;
  } | null;
};

type ProjectStatus = "all" | "ongoing" | "completed";

const allProjects: Project[] = [
  ...((ongoingData.projects ?? []) as Project[]),
  ...((completedData.projects ?? []) as Project[]),
];

const statusLabels: Record<string, string> = {
  ongoing: "Ongoing",
  completed: "Completed",
};

const categories = [
  { label: "All categories", value: "all" },
  { label: "Residential", value: "residential" },
  { label: "Hospitality", value: "hospitality" },
  { label: "Commercial", value: "commercial" },
  { label: "Land & Resort", value: "land" },
];

function getCategory(project: Project) {
  const category = (
    project.category ||
    project.projectType ||
    "residential"
  ).toLowerCase();
  if (category.includes("hospital")) return "hospitality";
  if (category.includes("commercial")) return "commercial";
  if (
    category.includes("resort") ||
    category.includes("agro") ||
    category.includes("land")
  ) {
    return "land";
  }
  return category;
}

function getProjectUrl(project: Project) {
  const status = project.status.toLowerCase();
  if (status === "completed") return `/projects/completed/${project.slug}`;
  return `/projects/ongoing/${project.slug}`;
}

// ─── count-up animation hook ─────────────────────────────────────────────────
function useCountUp(target: number, duration = 1500, delay = 0) {
  const [count, setCount] = useState(0);
  useEffect(() => {
    let raf: number;
    const start = performance.now() + delay;
    const tick = (now: number) => {
      if (now < start) {
        raf = requestAnimationFrame(tick);
        return;
      }
      const elapsed = now - start;
      const progress = Math.min(elapsed / duration, 1);
      const eased = 1 - Math.pow(1 - progress, 3);
      setCount(Math.round(target * eased));
      if (progress < 1) raf = requestAnimationFrame(tick);
    };
    raf = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(raf);
  }, [target, duration, delay]);
  return count;
}

// ─── animated stat (used inside dark hero — white text) ──────────────────────
function Stat({
  value,
  label,
  delay = 0,
}: {
  value: number;
  label: string;
  delay?: number;
}) {
  const count = useCountUp(value, 1400, delay + 200);
  return (
    <div>
      <p className="text-3xl font-light tracking-tight text-white tabular-nums">
        {String(count).padStart(2, "0")}
      </p>
      <p className="mt-1 text-[10px] uppercase tracking-[0.22em] text-white/45">
        {label}
      </p>
    </div>
  );
}

export default function ProjectArchivePage() {
  const [activeStatus, setActiveStatus] = useState<ProjectStatus>("all");
  const [activeCategory, setActiveCategory] = useState("all");
  const [searchQuery, setSearchQuery] = useState("");
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  const projects = useMemo(() => {
    const query = searchQuery.trim().toLowerCase();
    return allProjects.filter((project) => {
      const matchesStatus =
        activeStatus === "all" || project.status.toLowerCase() === activeStatus;
      const matchesCategory =
        activeCategory === "all" || getCategory(project).includes(activeCategory);
      const searchableText = [
        project.projectName,
        project.shortName,
        project.shortDescription,
        project.tagline,
        project.location?.area,
        project.location?.city,
        project.category,
        project.projectType,
      ]
        .filter(Boolean)
        .join(" ")
        .toLowerCase();
      const matchesSearch = searchableText.includes(query);
      return matchesStatus && matchesCategory && matchesSearch;
    });
  }, [activeStatus, activeCategory, searchQuery]);

  const ongoingCount = allProjects.filter(
    (project) => project.status.toLowerCase() === "ongoing"
  ).length;
  const completedCount = allProjects.filter(
    (project) => project.status.toLowerCase() === "completed"
  ).length;

  return (
    <main className="min-h-screen overflow-hidden bg-[#F7F4ED] text-[#171714] font-sans antialiased">
      {/* ─────────────────────────── HERO (DARK) ─────────────────────────── */}
      <section className="relative isolate flex min-h-[100svh] flex-col overflow-hidden bg-[#0B0B0D] text-[#F5F5F2]">
        {/* global keyframes for animations */}
        <style>{`
          @keyframes ambientDrift1 {
            0%, 100% { transform: translate(0, 0) scale(1); }
            33% { transform: translate(-40px, 30px) scale(1.08); }
            66% { transform: translate(30px, -20px) scale(0.96); }
          }
          @keyframes ambientDrift2 {
            0%, 100% { transform: translate(0, 0) scale(1); }
            50% { transform: translate(50px, -30px) scale(1.1); }
          }
          @keyframes drawLine {
            from { transform: scaleX(0); opacity: 0; }
            to { transform: scaleX(1); opacity: 1; }
          }
          @keyframes fadeUp {
            from { opacity: 0; transform: translateY(28px); }
            to { opacity: 1; transform: translateY(0); }
          }
          @keyframes shimmer {
            0% { background-position: 200% 0; }
            100% { background-position: -200% 0; }
          }
          @keyframes scrollBounce {
            0%, 100% { transform: translateY(0); opacity: 0.55; }
            50% { transform: translateY(6px); opacity: 1; }
          }
          @keyframes pulseGlow {
            0%, 100% { opacity: 0.18; }
            50% { opacity: 0.32; }
          }
        `}</style>

        {/* ambient background layers */}
        <div className="absolute inset-0 -z-10 overflow-hidden bg-[#0B0B0D]">
          <div
            className="absolute inset-0 opacity-[0.05]"
            style={{
              backgroundImage:
                "radial-gradient(rgba(197,160,89,0.6) 1px, transparent 1px)",
              backgroundSize: "32px 32px",
              maskImage:
                "radial-gradient(ellipse at 50% 40%, black 0%, transparent 70%)",
              WebkitMaskImage:
                "radial-gradient(ellipse at 50% 40%, black 0%, transparent 70%)",
            }}
          />
          <div
            className="absolute -right-40 -top-40 h-[42vw] w-[42vw] rounded-full blur-[140px]"
            style={{
              background:
                "radial-gradient(circle, rgba(197,160,89,0.22) 0%, rgba(197,160,89,0.06) 40%, transparent 70%)",
              animation: "ambientDrift1 24s ease-in-out infinite",
            }}
          />
          <div
            className="absolute -left-40 bottom-0 h-[38vw] w-[38vw] rounded-full blur-[140px]"
            style={{
              background:
                "radial-gradient(circle, rgba(120,90,40,0.18) 0%, transparent 70%)",
              animation: "ambientDrift2 28s ease-in-out infinite",
            }}
          />
          <div
            className="absolute left-1/2 top-1/3 h-[30vw] w-[30vw] -translate-x-1/2 rounded-full blur-[120px]"
            style={{
              background:
                "radial-gradient(circle, rgba(197,160,89,0.1) 0%, transparent 70%)",
              animation: "pulseGlow 8s ease-in-out infinite",
            }}
          />
          <div
            className="absolute inset-0"
            style={{
              background:
                "linear-gradient(180deg, rgba(11,11,13,0) 0%, rgba(11,11,13,0.3) 60%, rgba(11,11,13,0.95) 100%)",
            }}
          />
          <div
            className="absolute inset-0 opacity-[0.03] mix-blend-overlay"
            style={{
              backgroundImage: "url('/images/noise.png')",
              backgroundSize: "200px 200px",
            }}
          />
        </div>

        {/* breadcrumb */}
        <div className="mx-auto w-full max-w-[1600px] px-5 pt-28 sm:px-18 lg:px-16 lg:pt-38">
          <nav
            className="flex flex-wrap items-center gap-3 text-[10px] font-medium uppercase tracking-[0.28em] text-white/55"
            aria-label="Breadcrumb"
          >
            <Link href="/" className="transition-colors hover:text-white">
              Home
            </Link>
            <span className="text-[#19ABE1]">/</span>
            <span className="text-white">Projects</span>
          </nav>
        </div>

        {/* main hero body */}
        <div className="mx-auto flex w-full max-w-[1600px] flex-1 flex-col justify-center px-5 py-16 sm:px-8 lg:px-16 lg:py-20">
          {/* eyebrow with animated gold rule */}
          <div
            className="mb-8 flex items-center gap-4"
            style={{
              opacity: mounted ? 1 : 0,
              animation: mounted ? "fadeUp 0.8s ease-out 0.1s both" : undefined,
            }}
          >
            <span
              className="h-px bg-[#19ABE1] origin-left"
              style={{
                width: "2.5rem",
                transformOrigin: "left",
                animation: mounted ? "drawLine 1s ease-out 0.3s both" : undefined,
              }}
            />
            <span className="text-[10px] font-semibold uppercase tracking-[0.32em] text-[#19ABE1] sm:text-xs">
              Sampan Development — Project Archive
            </span>
          </div>

          <div className="grid items-end gap-10 lg:grid-cols-[1.4fr_0.6fr]">
            {/* headline */}
            <div>
              <h1 className="max-w-5xl text-[clamp(3.5rem,9vw,8.5rem)] font-light leading-[0.88] tracking-[-0.075em]">
                <span
                  className="block"
                  style={{
                    opacity: mounted ? 1 : 0,
                    animation: mounted
                      ? "fadeUp 0.9s ease-out 0.2s both"
                      : undefined,
                  }}
                >
                  Spaces.
                </span>
                <span
                  className="block font-serif italic bg-clip-text text-transparent"
                  style={{
                    backgroundImage:
                      "linear-gradient(120deg, #A07D3F 0%, #E5C787 25%, #19ABE1 50%, #E5C787 75%, #A07D3F 100%)",
                    backgroundSize: "200% 100%",
                    opacity: mounted ? 1 : 0,
                    animation: mounted
                      ? "fadeUp 0.9s ease-out 0.4s both, shimmer 6s linear infinite 1.2s"
                      : undefined,
                  }}
                >
                  Stories.
                </span>
                <span
                  className="block"
                  style={{
                    opacity: mounted ? 1 : 0,
                    animation: mounted
                      ? "fadeUp 0.9s ease-out 0.55s both"
                      : undefined,
                  }}
                >
                  Lasting value.
                </span>
              </h1>
            </div>

            {/* description + animated stats */}
            <div
              className="max-w-md pb-2 lg:justify-self-end"
              style={{
                opacity: mounted ? 1 : 0,
                animation: mounted
                  ? "fadeUp 0.9s ease-out 0.7s both"
                  : undefined,
              }}
            >
              <p className="text-base leading-8 text-white/65 sm:text-lg">
                Explore our portfolio of developments, hospitality
                destinations and places shaped around the way people live,
                work and connect.
              </p>
              <div className="mt-8 flex flex-wrap gap-x-10 gap-y-4 border-t border-white/15 pt-6">
                <Stat value={allProjects.length} label="Total projects" delay={700} />
                <Stat value={ongoingCount} label="In progress" delay={850} />
                <Stat value={completedCount} label="Completed" delay={1000} />
              </div>
            </div>
          </div>
        </div>

        {/* scroll indicator */}
        <div className="mx-auto w-full max-w-[1600px] px-5 pb-10 sm:px-8 lg:px-16 lg:pb-14">
          <a
            href="#project-archive"
            className="inline-flex items-center gap-3 text-[9px] uppercase tracking-[0.28em] text-white/55 transition-colors hover:text-white"
            style={{
              opacity: mounted ? 1 : 0,
              animation: mounted
                ? "fadeUp 0.8s ease-out 1.3s both"
                : undefined,
            }}
          >
            <span className="h-px w-12 bg-[#19ABE1]" />
            Scroll to explore
            <svg
              className="h-3 w-3"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="1.5"
              style={{ animation: "scrollBounce 2s ease-in-out infinite" }}
            >
              <path
                d="M12 5v14M5 12l7 7 7-7"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
            </svg>
          </a>
        </div>

        {/* fade transition from dark hero to light archive */}
        <div
          aria-hidden="true"
          className="pointer-events-none absolute inset-x-0 bottom-0 h-32"
          style={{
            background:
              "linear-gradient(180deg, transparent 0%, #F7F4ED 100%)",
          }}
        />
      </section>

      {/* ───────────────────────── ARCHIVE (LIGHT) ───────────────────────── */}
      <section
        id="project-archive"
        className="relative bg-[#F7F4ED] px-5 pb-24 pt-8 sm:px-8 lg:px-16 lg:pb-32"
      >
        <div className="mx-auto max-w-[1600px]">
          {/* ── FILTERS ── */}
          <div className="mb-12 flex flex-col gap-8 xl:flex-row xl:items-end xl:justify-between">
            <div>
              <p className="mb-4 flex items-center gap-3 text-[10px] font-semibold uppercase tracking-[0.28em] text-[#A17D3F]">
                <span className="h-px w-8 bg-[#A17D3F]" />
                The portfolio
              </p>
              <h2 className="mb-6 text-3xl font-light tracking-[-0.035em] text-[#171714] sm:text-4xl">
                Browse the archive
              </h2>
              <div className="flex flex-wrap gap-2">
                {(
                  [
                    ["all", "All projects"],
                    ["ongoing", "Ongoing"],
                    ["completed", "Completed"],
                  ] as [ProjectStatus, string][]
                ).map(([value, label]) => {
                  const count =
                    value === "all"
                      ? allProjects.length
                      : value === "ongoing"
                        ? ongoingCount
                        : completedCount;
                  const active = activeStatus === value;
                  return (
                    <button
                      key={value}
                      type="button"
                      onClick={() => setActiveStatus(value)}
                      className={`group relative overflow-hidden rounded-full border px-5 py-3 text-xs transition-all duration-300 ${active
                          ? "border-[#171714] bg-[#171714] text-white"
                          : "border-[#D9D3C6] bg-transparent text-[#5F5C54] hover:border-[#171714] hover:text-[#171714]"
                        }`}
                    >
                      <span className="relative z-10">
                        {label}
                        <span
                          className={`ml-2 ${active ? "opacity-60" : "opacity-50"}`}
                        >
                          {count}
                        </span>
                      </span>
                      {!active && (
                        <span className="absolute inset-0 -z-0 translate-y-full bg-[#171714]/[0.04] transition-transform duration-300 group-hover:translate-y-0" />
                      )}
                    </button>
                  );
                })}
              </div>
            </div>

            <div className="grid gap-3 sm:grid-cols-2 xl:min-w-[480px]">
              {/* search */}
              <label className="group relative block">
                <span className="sr-only">Search projects</span>
                <svg
                  aria-hidden="true"
                  viewBox="0 0 24 24"
                  fill="none"
                  className="absolute left-4 top-1/2 h-4 w-4 -translate-y-1/2 text-[#777268] transition-colors group-focus-within:text-[#A17D3F]"
                >
                  <circle cx="11" cy="11" r="7" stroke="currentColor" strokeWidth="1.5" />
                  <path d="m16 16 4 4" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
                </svg>
                <input
                  type="search"
                  value={searchQuery}
                  onChange={(event) => setSearchQuery(event.target.value)}
                  placeholder="Search projects..."
                  className="h-12 w-full rounded-full border border-[#D9D3C6] bg-white/60 pl-11 pr-4 text-sm text-[#171714] placeholder:text-[#777268] outline-none transition focus:border-[#A17D3F] focus:bg-white"
                />
              </label>

              {/* category select */}
              <label className="group relative block">
                <span className="sr-only">Filter by category</span>
                <select
                  value={activeCategory}
                  onChange={(event) => setActiveCategory(event.target.value)}
                  className="h-12 w-full appearance-none rounded-full border border-[#D9D3C6] bg-white/60 px-5 pr-12 text-sm text-[#171714] outline-none transition focus:border-[#A17D3F] focus:bg-white"
                >
                  {categories.map((category) => (
                    <option key={category.value} value={category.value} className="bg-[#F7F4ED] text-[#171714]">
                      {category.label}
                    </option>
                  ))}
                </select>
                <svg
                  aria-hidden="true"
                  viewBox="0 0 24 24"
                  fill="none"
                  className="pointer-events-none absolute right-4 top-1/2 h-4 w-4 -translate-y-1/2 text-[#777268]"
                >
                  <path d="m6 9 6 6 6-6" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
                </svg>
              </label>
            </div>
          </div>

          {/* ── RESULT COUNT ── */}
          <div className="mb-10 flex items-center justify-between border-b border-[#D9D3C6] pb-4">
            <p className="text-xs text-[#777268]">
              Showing{" "}
              <span className="font-semibold text-[#171714]">{projects.length}</span>{" "}
              {projects.length === 1 ? "project" : "projects"}
            </p>
            {(searchQuery || activeStatus !== "all" || activeCategory !== "all") && (
              <button
                type="button"
                onClick={() => {
                  setSearchQuery("");
                  setActiveStatus("all");
                  setActiveCategory("all");
                }}
                className="text-xs text-[#A17D3F] underline underline-offset-4 transition hover:text-[#171714]"
              >
                Clear filters
              </button>
            )}
          </div>

          {/* ── PROJECT GRID ── */}
          {projects.length > 0 ? (
            <div className="grid grid-cols-1 gap-x-6 gap-y-12 sm:grid-cols-2 lg:grid-cols-3 lg:gap-y-16">
              {projects.map((project, index) => {
                const image = project.hero?.backgroundImage;
                const category = getCategory(project);
                const location = [
                  project.location?.area,
                  project.location?.city,
                ]
                  .filter(Boolean)
                  .join(", ");

                return (
                  <article key={`${project.status}-${project.slug}`} className="group">
                    <Link
                      href={getProjectUrl(project)}
                      className="block"
                      aria-label={`Explore ${project.projectName}`}
                    >
                      {/* image card */}
                      <div className="relative aspect-[4/5] overflow-hidden rounded-[2px] bg-[#E6E0D4]">
                        <div
                          aria-hidden="true"
                          className="absolute inset-0 bg-gradient-to-br from-[#D5C9B2] via-[#B8AC96] to-[#8F8878]"
                        />

                        {image && (
                          // eslint-disable-next-line @next/next/no-img-element
                          <img
                            src={image}
                            alt={project.hero?.backgroundImageAlt || project.projectName}
                            loading={index < 3 ? "eager" : "lazy"}
                            className="absolute inset-0 h-full w-full object-cover transition-transform duration-[900ms] ease-out group-hover:scale-[1.05]"
                            onError={(event) => {
                              event.currentTarget.style.display = "none";
                            }}
                          />
                        )}

                        <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/10 to-black/20 transition-opacity duration-500 group-hover:from-black/80" />

                        {/* top badges */}
                        <div className="absolute left-5 right-5 top-5 flex items-start justify-between gap-3">
                          <span className="rounded-full border border-white/40 bg-black/20 px-3 py-2 text-[9px] uppercase tracking-[0.2em] text-white backdrop-blur-md">
                            {statusLabels[project.status.toLowerCase()] || project.status}
                          </span>
                          <span className="rounded-full border border-white/40 bg-black/20 px-3 py-2 text-[9px] uppercase tracking-[0.16em] text-white backdrop-blur-md">
                            {category.replace(/-/g, " ")}
                          </span>
                        </div>

                        {/* gold top-line that draws on hover */}
                        <div className="absolute left-0 top-0 h-px w-0 bg-[#A17D3F] transition-all duration-500 ease-out group-hover:w-full" />

                        {/* bottom content on image */}
                        <div className="absolute inset-x-5 bottom-6 text-white sm:inset-x-6 sm:bottom-7">
                          <p className="mb-3 text-[9px] uppercase tracking-[0.25em] text-[#E5C787]">
                            {project.hero?.eyebrow || "Sampan Development"}
                          </p>
                          <h2 className="max-w-md text-3xl font-light leading-tight tracking-[-0.04em] sm:text-4xl">
                            {project.projectName}
                          </h2>
                          {location && (
                            <p className="mt-3 flex items-center gap-2 text-xs tracking-wide text-white/70">
                              <svg className="h-3 w-3 text-[#E5C787]" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
                                <path strokeLinecap="round" strokeLinejoin="round" d="M12 21c5-5 9-9.5 9-13a9 9 0 10-18 0c0 3.5 4 8 9 13z" />
                                <circle cx="12" cy="8" r="2.5" />
                              </svg>
                              {location}
                            </p>
                          )}
                        </div>

                        {/* gold corner arrow */}
                        <div className="absolute bottom-6 right-5 flex h-11 w-11 translate-y-2 items-center justify-center rounded-full border border-[#A17D3F]/70 bg-[#A17D3F]/10 text-[#A17D3F] opacity-0 backdrop-blur-sm transition-all duration-300 group-hover:translate-y-0 group-hover:bg-[#A17D3F] group-hover:text-white sm:bottom-7 sm:right-6">
                          <svg aria-hidden="true" viewBox="0 0 24 24" fill="none" className="h-5 w-5">
                            <path d="M7 17 17 7M7 7h10v10" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
                          </svg>
                        </div>
                      </div>

                      {/* card footer — light themed */}
                      <div className="flex items-start justify-between gap-5 border-b border-[#D9D3C6] bg-white py-5 px-5 transition-all duration-300 group-hover:border-[#A17D3F]/50 group-hover:shadow-[0_24px_60px_-30px_rgba(20,32,26,0.15)] sm:px-6">
                        <div>
                          <p className="mb-2 text-[10px] uppercase tracking-[0.22em] text-[#A17D3F]">
                            {project.shortName || project.projectType || "Development"}
                          </p>
                          <p className="max-w-sm text-sm leading-7 text-[#5F5C54]">
                            {project.shortDescription ||
                              project.tagline ||
                              "Discover the vision behind this Sampan Development project."}
                          </p>
                        </div>
                        <span className="mt-1 shrink-0 text-xs text-[#A17D3F] transition-transform duration-300 group-hover:translate-x-1">
                          ↗
                        </span>
                      </div>
                    </Link>
                  </article>
                );
              })}
            </div>
          ) : (
            /* ── empty state — light themed ── */
            <div className="flex min-h-[300px] flex-col items-center justify-center rounded-[2px] border border-dashed border-[#D9D3C6] bg-white/60 px-6 text-center">
              <p className="font-serif text-3xl italic text-[#171714]">No projects found.</p>
              <p className="mt-3 max-w-sm text-sm leading-6 text-[#777268]">
                Try a different search term or adjust your filters to explore our portfolio.
              </p>
              <button
                type="button"
                onClick={() => {
                  setSearchQuery("");
                  setActiveStatus("all");
                  setActiveCategory("all");
                }}
                className="mt-6 border-b border-[#A17D3F] pb-1 text-xs uppercase tracking-[0.16em] text-[#A17D3F] transition hover:text-[#171714]"
              >
                View all projects
              </button>
            </div>
          )}
        </div>
      </section>

      {/* ─────────────────────── CLOSING CTA (LIGHT) ─────────────────────── */}
      <section className="relative isolate overflow-hidden bg-[#EFE9DC] px-5 py-24 text-[#171714] sm:px-8 sm:py-32 lg:px-16">
        {/* soft warm ambient glow */}
        <div
          className="absolute -right-32 top-1/2 h-[40vw] w-[40vw] -translate-y-1/2 rounded-full blur-[140px]"
          style={{
            background:
              "radial-gradient(circle, rgba(197,160,89,0.18) 0%, transparent 70%)",
          }}
        />
        <div
          className="absolute -left-32 top-1/4 h-[30vw] w-[30vw] rounded-full blur-[120px]"
          style={{
            background:
              "radial-gradient(circle, rgba(160,125,63,0.12) 0%, transparent 70%)",
          }}
        />
        {/* faint dot grid */}
        <div
          className="absolute inset-0 -z-10 opacity-[0.05]"
          style={{
            backgroundImage:
              "radial-gradient(rgba(160,125,63,0.7) 1px, transparent 1px)",
            backgroundSize: "32px 32px",
          }}
        />

        <div className="relative mx-auto flex max-w-[1600px] flex-col justify-between gap-10 md:flex-row md:items-end">
          <div className="max-w-3xl">
            <p className="mb-5 flex items-center gap-3 text-[10px] uppercase tracking-[0.28em] text-[#A17D3F]">
              <span className="h-px w-8 bg-[#A17D3F]" />
              Your next chapter
            </p>
            <h2 className="text-4xl font-light leading-tight tracking-[-0.05em] sm:text-6xl lg:text-7xl">
              Let&apos;s build something
              <br />
              <span className="font-serif italic text-[#A17D3F]">meaningful.</span>
            </h2>
            <p className="mt-8 max-w-xl text-base leading-8 text-[#5F5C54] md:text-lg">
              From residential towers to hospitality destinations and
              land-led visions — talk to the Sampan team about a project
              that fits your ambitions.
            </p>
          </div>

          <Link
            href="/contact"
            className="group inline-flex w-fit items-center gap-5 border-b border-[#A17D3F]/60 pb-4 text-sm text-[#171714] transition-colors hover:border-[#A17D3F] hover:text-[#A17D3F]"
          >
            Discuss a project
            <span
              aria-hidden="true"
              className="text-xl text-[#A17D3F] transition-transform duration-300 group-hover:translate-x-1 group-hover:-translate-y-1"
            >
              ↗
            </span>
          </Link>
        </div>
      </section>
    </main>
  );
}