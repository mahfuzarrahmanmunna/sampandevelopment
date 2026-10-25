import type { Metadata } from "next";
import { notFound } from "next/navigation";
import type { ComponentProps } from "react";
import projectContent from "../../../data/project.json";
import ProjectDetails from "../ProjectDetails";

const ongoingProjects = (projectContent.projects.filter(
  (project) => project.status === "ongoing"
) ?? []) as unknown as NonNullable<
  ComponentProps<typeof ProjectDetails>["allProjects"]
>;

type ProjectPageProps = {
  params: Promise<{ slug: string }>;
};

function findOngoingProject(slug: string) {
  return ongoingProjects.find((project) => project.slug === slug);
}

export function generateStaticParams() {
  return ongoingProjects.map(({ slug }) => ({ slug }));
}

export async function generateMetadata({
  params,
}: ProjectPageProps): Promise<Metadata> {
  const { slug } = await params;
  const project = findOngoingProject(slug);
  if (!project) notFound();

  const seo = (project.seo || {}) as Record<string, unknown>;
  const title = str(seo.metaTitle) || `${project.projectName} | Sampan Development`;
  const description = str(seo.metaDescription) || project.shortDescription || "";
  const keywords = Array.isArray(seo.keywords) ? seo.keywords.map(String) : undefined;
  const ogImage = str(seo.ogImage) || str(project.hero?.backgroundImage);
  const canonical = str(seo.canonicalPath) || `/projects/ongoing/${project.slug}`;

  // 👇 Define twitterCard HERE — inside the function, before return
  const twitterCard = str(seo.twitterCard) as
    | "summary"
    | "summary_large_image"
    | "player"
    | "app"
    | "";

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
      card: twitterCard || "summary_large_image",
      title: str(seo.ogTitle) || title,
      description: str(seo.ogDescription) || description,
      images: ogImage ? [ogImage] : undefined,
    },
  };
}

function str(v: unknown): string {
  return typeof v === "string" ? v.trim() : typeof v === "number" ? String(v) : "";
}

export default async function OngoingProjectPage({ params }: ProjectPageProps) {
  const { slug } = await params;
  const project = findOngoingProject(slug);
  if (!project) notFound();

  // JSON-LD structured data — improves how Google renders the result
  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "Place",
    name: project.projectName,
    description: project.shortDescription,
    url: `/projects/ongoing/${project.slug}`,
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
      <ProjectDetails project={project} allProjects={ongoingProjects} />
    </>
  );
}