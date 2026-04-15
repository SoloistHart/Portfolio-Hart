import type { Metadata } from "next";
import Link from "next/link";
import { ArrowLeft, ArrowUpRight } from "lucide-react";
import { ProjectCard } from "@/components/project-card";
import { Reveal } from "@/components/reveal";
import { SiteHeader } from "@/components/site-header";
import { SiteFooter } from "@/components/site-footer";
import { projects, siteContent } from "@/lib/portfolio-data";

export const metadata: Metadata = {
  title: "Project Archive",
  description: "Selected projects from Hart — dashboards, AI integrations, and automation workflows.",
};

export default function ProjectsPage() {
  return (
    <>
      <SiteHeader />

      <main id="main" className="relative overflow-hidden pb-20 pt-28 sm:pt-32">
        <section className="page-shell">
          <Reveal>
            <Link
              href="/"
              className="inline-flex items-center gap-2 text-sm font-semibold text-muted hover:text-foreground"
            >
              <ArrowLeft className="h-4 w-4" />
              Back to homepage
            </Link>
          </Reveal>

          <div className="mt-10 grid gap-12 lg:grid-cols-[minmax(0,1fr)_20rem] lg:items-end">
            <Reveal>
              <div className="max-w-3xl">
                <p className="section-kicker">Project archive</p>
                <h1 className="mt-5 text-5xl font-semibold tracking-[-0.08em] text-foreground sm:text-6xl">
                  Projects built for real teams with real impact.
                </h1>
                <p className="mt-6 text-base leading-8 text-muted sm:text-lg">
                  Each case study covers production work — from AI-powered dashboards to automation pipelines — with the context, stack, and outcomes that matter.
                </p>
              </div>
            </Reveal>

            <Reveal delay={0.08}>
              <div className="panel rounded-[1.7rem] p-6">
                <p className="section-kicker">Get in touch</p>
                <p className="mt-4 text-sm leading-7 text-muted">
                  Interested in working together? I build dashboards, AI integrations, and automation workflows for teams that want real results.
                </p>
                <Link
                  href={`mailto:${siteContent.contact.email}`}
                  className="mt-6 inline-flex items-center gap-2 text-sm font-semibold text-foreground hover:text-accent"
                >
                  Send an email
                  <ArrowUpRight className="h-4 w-4" />
                </Link>
              </div>
            </Reveal>
          </div>

          <div className="mt-12 grid gap-6 xl:grid-cols-3">
            {projects.map((project, index) => (
              <Reveal key={project.slug} delay={index * 0.08}>
                <ProjectCard project={project} variant={index % 3} />
              </Reveal>
            ))}
          </div>
        </section>
      </main>

      <SiteFooter />
    </>
  );
}
