import type { Metadata } from "next";
import Link from "next/link";
import { ArrowLeft, ArrowRight, ArrowUpRight } from "lucide-react";
import { ProjectPreview } from "@/components/project-card";
import { Reveal } from "@/components/reveal";
import { SiteHeader } from "@/components/site-header";
import { SiteFooter } from "@/components/site-footer";
import { WorkflowDiagram } from "@/components/workflow-diagram";
import { getProject, projects } from "@/lib/portfolio-data";
import { notFound } from "next/navigation";

type ProjectPageProps = {
  params: Promise<{
    slug: string;
  }>;
};

export function generateStaticParams() {
  return projects.map((project) => ({ slug: project.slug }));
}

export async function generateMetadata({
  params,
}: ProjectPageProps): Promise<Metadata> {
  const { slug } = await params;
  const project = getProject(slug);

  if (!project) {
    return {
      title: "Project not found",
    };
  }

  return {
    title: project.title,
    description: project.summary,
  };
}

export default async function ProjectPage({ params }: ProjectPageProps) {
  const { slug } = await params;
  const project = getProject(slug);

  if (!project) {
    notFound();
  }

  const currentIndex = projects.findIndex((entry) => entry.slug === project.slug);
  const nextProject = projects[(currentIndex + 1) % projects.length];

  return (
    <>
      <SiteHeader />

      <main id="main" className="relative overflow-hidden pb-20 pt-28 sm:pt-32">
        <section className="page-shell">
          <Reveal>
            <Link
              href="/projects"
              className="inline-flex items-center gap-2 text-sm font-semibold text-muted hover:text-foreground"
            >
              <ArrowLeft className="h-4 w-4" />
              Back to archive
            </Link>
          </Reveal>

          <div className="mt-10 grid gap-12 lg:grid-cols-[minmax(0,1fr)_34rem] lg:items-start xl:grid-cols-[minmax(0,1fr)_37rem]">
            <Reveal>
              <div className="max-w-3xl">
                <p className="section-kicker">{project.label}</p>
                <h1 className="mt-5 text-5xl font-semibold tracking-[-0.08em] text-foreground sm:text-6xl">
                  {project.title}
                </h1>
                <p className="mt-6 text-base leading-8 text-muted sm:text-lg">
                  {project.summary}
                </p>

                <div className="mt-8 flex flex-wrap gap-2">
                  {project.tags.map((tag) => (
                    <span key={tag} className="chip">
                      {tag}
                    </span>
                  ))}
                </div>

                <div className="mt-10 grid gap-4 sm:grid-cols-3">
                  {project.highlights.map((item) => (
                    <div key={item.label} className="panel rounded-[1.35rem] p-4">
                      <p className="section-kicker">{item.label}</p>
                      <p className="mt-3 text-sm leading-7 text-foreground/84">
                        {item.value}
                      </p>
                    </div>
                  ))}
                </div>

                <div className="mt-10 grid gap-4 sm:grid-cols-2">
                  <div className="panel rounded-[1.4rem] p-5">
                    <p className="section-kicker">Client context</p>
                    <p className="mt-3 text-sm leading-7 text-foreground/84">
                      {project.client}
                    </p>
                  </div>
                  <div className="panel rounded-[1.4rem] p-5">
                    <p className="section-kicker">Category</p>
                    <p className="mt-3 text-sm leading-7 text-foreground/84">
                      {project.category}
                    </p>
                  </div>
                </div>
              </div>
            </Reveal>

            <Reveal delay={0.12}>
              <ProjectPreview project={project} className="min-h-[34rem]" />
            </Reveal>
          </div>
        </section>

        <section className="page-shell pt-24 sm:pt-28">
          <div className="grid gap-10 lg:grid-cols-[0.8fr_1.2fr] lg:items-start">
            <Reveal>
              <div className="max-w-lg">
                <p className="section-kicker">Case study</p>
                <h2 className="mt-5 text-4xl font-semibold tracking-[-0.06em] text-foreground sm:text-5xl">
                  The challenge, the build, and why it holds up.
                </h2>
              </div>
            </Reveal>

            <div className="space-y-4">
              {project.sections.map((section, index) => (
                <Reveal key={section.title} delay={index * 0.08}>
                  <article className="panel rounded-[1.7rem] p-6 sm:p-7">
                    <p className="section-kicker">{section.title}</p>
                    <p className="mt-4 text-base leading-8 text-foreground/82">
                      {section.copy}
                    </p>
                  </article>
                </Reveal>
              ))}
            </div>
          </div>
        </section>

        {project.workflows && project.workflows.length > 0 && (
          <section className="page-shell pt-24 sm:pt-28">
            <Reveal>
              <p className="section-kicker">Workflow architecture</p>
              <h2 className="mt-5 mb-10 text-4xl font-semibold tracking-[-0.06em] text-foreground sm:text-5xl">
                How the automation flows.
              </h2>
            </Reveal>
            <Reveal delay={0.1}>
              <WorkflowDiagram workflows={project.workflows} />
            </Reveal>
          </section>
        )}

        <section className="page-shell pt-10 sm:pt-14">
          <div className="grid gap-6 lg:grid-cols-2">
            <Reveal>
              <article className="panel rounded-[1.7rem] p-6 sm:p-7">
                <p className="section-kicker">Deliverables</p>
                <ul className="mt-5 space-y-3 text-sm leading-7 text-foreground/82 sm:text-[0.96rem]">
                  {project.deliverables.map((item) => (
                    <li key={item} className="flex items-start gap-3">
                      <span className="mt-2 h-2 w-2 rounded-full bg-accent" />
                      <span>{item}</span>
                    </li>
                  ))}
                </ul>
              </article>
            </Reveal>

            <Reveal delay={0.08}>
              <article className="panel rounded-[1.7rem] p-6 sm:p-7">
                <p className="section-kicker">Why it matters</p>
                <p className="mt-5 text-base leading-8 text-foreground/82">
                  {project.impact}
                </p>
                <Link
                  href="/projects"
                  className="mt-8 inline-flex items-center gap-2 text-sm font-semibold text-foreground hover:text-accent"
                >
                  Explore more projects
                  <ArrowUpRight className="h-4 w-4" />
                </Link>
              </article>
            </Reveal>
          </div>
        </section>

        <section className="page-shell pt-16 sm:pt-20">
          <Reveal>
            <div className="panel-strong rounded-[2rem] px-6 py-7 sm:px-8 sm:py-8">
              <div className="flex flex-col gap-6 lg:flex-row lg:items-center lg:justify-between">
                <div>
                  <p className="section-kicker">Next project</p>
                  <h2 className="mt-4 text-3xl font-semibold tracking-[-0.05em] text-foreground sm:text-4xl">
                    {nextProject.title}
                  </h2>
                  <p className="mt-3 max-w-2xl text-base leading-8 text-muted">
                    {nextProject.summary}
                  </p>
                </div>

                <Link href={`/projects/${nextProject.slug}`} className="button-primary">
                  Open next case study
                  <ArrowRight className="h-4 w-4" />
                </Link>
              </div>
            </div>
          </Reveal>
        </section>
      </main>

      <SiteFooter />
    </>
  );
}
