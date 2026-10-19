import type { Metadata } from "next";
import { notFound } from "next/navigation";
import projectContent from "../../../data/sampan-completed-projects.json";
import CompletedProjectDetails from "../CompletedProjectDetails";

// ─── value helpers ────────────────────────────────────────────────────────────
function str(v: unknown): string {
  return typeof v === "string" ? v.trim() : typeof v === "number" ? String(v) : "";
}

// ─── project lookup ────────────────────────────────────────────────────────────
const completedProjects = projectContent.projects.filter(
  (project) => project.status === "completed"
);

function findCompletedProject(slug: string) {
  return completedProjects.find((project) => project.slug === slug);
}

// ─── types ─────────────────────────────────────────────────────────────────────
type ProjectPageProps = {
  params: Promise<{ slug: string }>;
};

// ─── static params (pre-render all completed project pages at build) ───────────
export function generateStaticParams() {
  return completedProjects.map(({ slug }) => ({ slug }));
}

// ─── metadata / SEO ────────────────────────────────────────────────────────────
export async function generateMetadata({
  params,
}: ProjectPageProps): Promise<Metadata> {
  const { slug } = await params;
  const project = findCompletedProject(slug);

  if (!project) {
    return {
      title: "Project Not Found | Sampan Development",
      description: "The project you are looking for could not be found.",
    };
  }

  const seo = (project.seo ?? {}) as Record<string, unknown>;
  const title = str(seo.metaTitle) || `${project.projectName} | Sampan Development`;
  const description = str(seo.metaDescription) || str(project.shortDescription) || "";
  const keywords = Array.isArray(seo.keywords) ? seo.keywords.map(String) : undefined;
  const ogImage = str(seo.ogImage) || str(project.hero?.backgroundImage);
  const canonical = str(seo.canonicalPath) || `/projects/completed/${project.slug}`;

  return {
    title,
    description,
    keywords,
    alternates: { canonical },
    openGraph: {
      title: str(seo.ogTitle) || title,
      description: str(seo.ogDescription) || description,
      images: ogImage ? [{ url: ogImage, width: 1200, height: 630 }] : undefined,
      type: "website",
      siteName: "Sampan Development",
    },
    twitter: {
      card: str(seo.twitterCard) || "summary_large_image",
      title: str(seo.ogTitle) || title,
      description: str(seo.ogDescription) || description,
      images: ogImage ? [ogImage] : undefined,
    },
  };
}

// ─── page ──────────────────────────────────────────────────────────────────────
export default async function CompletedProjectPage({
  params,
}: ProjectPageProps) {
  const { slug } = await params;
  const project = findCompletedProject(slug);

  if (!project) {
    notFound();
  }

  // JSON-LD structured data — completed project (Building)
  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "Building",
    name: project.projectName,
    description: str(project.shortDescription),
    url: `/projects/completed/${project.slug}`,
    address: {
      "@type": "PostalAddress",
      addressLocality: str(project.location?.area),
      addressCountry: str(project.location?.country),
    },
  };

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />
      <CompletedProjectDetails project={project} allProjects={completedProjects} />
    </>
  );
}