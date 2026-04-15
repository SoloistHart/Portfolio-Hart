import Link from "next/link";
import {
  ArrowRight,
  ArrowUpRight,
  BarChart3,
  BrainCircuit,
  Workflow,
} from "lucide-react";
import { ContactForm } from "@/components/contact-form";
import { GitHubActivity } from "@/components/github-activity";
import { HeroHologram } from "@/components/hero-hologram";
import { ProjectCard } from "@/components/project-card";
import { Reveal } from "@/components/reveal";
import { SiteHeader } from "@/components/site-header";
import { SiteFooter } from "@/components/site-footer";
import { projects, siteContent } from "@/lib/portfolio-data";

const futureIcons = [BarChart3, BrainCircuit, Workflow] as const;

export default function Home() {
  return (
    <>
      <SiteHeader />

      <main id="main" className="relative overflow-hidden pb-20 pt-28 sm:pt-32">
        <div aria-hidden className="pointer-events-none absolute inset-0 -z-10 overflow-hidden">
          <div className="absolute left-[6%] top-28 h-56 w-56 rounded-full bg-[radial-gradient(circle,_rgba(47,143,134,0.16),_transparent_68%)] blur-3xl" />
          <div className="absolute right-[2%] top-44 h-72 w-72 rounded-full bg-[radial-gradient(circle,_rgba(207,138,84,0.18),_transparent_72%)] blur-3xl" />
          <div className="absolute bottom-24 right-[12%] h-64 w-64 rounded-full bg-[radial-gradient(circle,_rgba(25,80,120,0.12),_transparent_70%)] blur-3xl" />
        </div>

        <section className="page-shell relative min-h-[calc(100vh-8rem)] flex flex-col justify-center">
          {/* Three.js holographic head — positioned behind content, right-of-center */}
          <div className="pointer-events-none absolute inset-0 z-0" aria-hidden>
            <HeroHologram />
          </div>

          <div className="relative z-10 max-w-2xl">
            <Reveal>
              <div>
                <p className="section-kicker">{siteContent.hero.eyebrow}</p>
                <h1 className="mt-6 max-w-3xl text-5xl font-semibold leading-[0.92] tracking-[-0.08em] text-foreground sm:text-6xl md:text-7xl">
                  {siteContent.hero.title}
                </h1>
                <p className="mt-6 max-w-xl text-base leading-8 text-muted sm:text-lg">
                  {siteContent.hero.description}
                </p>

                <div className="mt-8 flex flex-wrap gap-3">
                  {siteContent.hero.chips.map((chip) => (
                    <span key={chip} className="chip">
                      {chip}
                    </span>
                  ))}
                </div>

                <div className="mt-10">
                  <a href="#work" className="button-primary">
                    See the work
                    <ArrowRight className="h-4 w-4" />
                  </a>
                </div>
              </div>
            </Reveal>

            {/* Impact metrics — bottom of hero */}
            <div className="relative z-10 mt-auto pt-12">
              <Reveal>
                <div className="grid gap-4 sm:grid-cols-3">
                  <div className="panel rounded-2xl p-5">
                    <p className="font-mono text-[0.64rem] uppercase tracking-[0.24em] text-muted">
                      Prototype speed
                    </p>
                    <p className="mt-2 text-lg font-semibold text-foreground">Days, not weeks</p>
                    <p className="mt-1 text-sm leading-6 text-muted">
                      AI-accelerated development
                    </p>
                  </div>
                  <div className="panel rounded-2xl p-5">
                    <p className="font-mono text-[0.64rem] uppercase tracking-[0.24em] text-muted">
                      Automation
                    </p>
                    <p className="mt-2 text-lg font-semibold text-foreground">30+ workflows</p>
                    <p className="mt-1 text-sm leading-6 text-muted">
                      Built, deployed, and maintained for one client
                    </p>
                  </div>
                  <div className="panel rounded-2xl p-5">
                    <p className="font-mono text-[0.64rem] uppercase tracking-[0.24em] text-muted">
                      Production
                    </p>
                    <p className="mt-2 text-lg font-semibold text-foreground">4+ tools shipped</p>
                    <p className="mt-1 text-sm leading-6 text-muted">
                      Dashboards, AI systems, automations
                    </p>
                  </div>
                </div>
              </Reveal>
            </div>
          </div>

        </section>

        <section className="page-shell pt-24 sm:pt-32">
          <div className="flex flex-col gap-6 lg:flex-row lg:items-end lg:justify-between">
            <Reveal>
              <div className="max-w-2xl">
                <p id="work" className="section-kicker scroll-mt-20">Selected work</p>
                <h2 className="mt-5 text-4xl font-semibold tracking-[-0.06em] text-foreground sm:text-5xl">
                  Real projects delivering measurable impact across analytics, AI, and automation.
                </h2>
                <p className="mt-5 text-base leading-8 text-muted sm:text-lg">
                  Each project represents production work — internal tools and systems built for real teams, with real data and real business outcomes.
                </p>
              </div>
            </Reveal>

            <Reveal delay={0.08}>
              <Link
                href="/projects"
                className="inline-flex items-center gap-2 text-sm font-semibold text-foreground hover:text-accent"
              >
                Browse the full archive
                <ArrowUpRight className="h-4 w-4" />
              </Link>
            </Reveal>
          </div>

          <div className="mt-10 grid gap-6 xl:grid-cols-3">
            {projects.map((project, index) => (
              <Reveal key={project.slug} delay={index * 0.08}>
                <ProjectCard project={project} variant={index % 3} />
              </Reveal>
            ))}
          </div>
        </section>

        <section id="notes" className="page-shell pt-24 sm:pt-28">
          <div className="flex flex-col gap-6 lg:flex-row lg:items-end lg:justify-between">
            <Reveal>
              <div className="max-w-2xl">
                <p className="section-kicker">How I work</p>
                <h2 className="mt-5 text-4xl font-semibold tracking-[-0.06em] text-foreground sm:text-5xl">
                  Principles behind the work.
                </h2>
              </div>
            </Reveal>
          </div>

          <div className="mt-10 grid gap-4 md:grid-cols-3">
            {siteContent.futureModules.map((item, index) => {
              const Icon = futureIcons[index];
              const iconStyles = [
                "bg-foreground text-background",
                "bg-accent text-white",
                "bg-accent-warm text-white",
              ] as const;

              return (
                <Reveal key={item.title} delay={index * 0.07}>
                  <article className="panel rounded-[1.7rem] p-6">
                    <span className={`flex h-11 w-11 items-center justify-center rounded-2xl ${iconStyles[index % 3]}`}>
                      <Icon className="h-5 w-5" />
                    </span>
                    <h3 className="mt-5 text-xl font-semibold tracking-[-0.04em] text-foreground">
                      {item.title}
                    </h3>
                    <p className="mt-3 text-sm leading-7 text-muted sm:text-[0.96rem]">
                      {item.text}
                    </p>
                  </article>
                </Reveal>
              );
            })}
          </div>
        </section>

        <GitHubActivity username="SoloistHart" />

        <section id="contact" className="page-shell pt-24 sm:pt-28">
          <Reveal>
            <div className="panel-strong rounded-[2.2rem] px-6 py-8 sm:px-8 sm:py-10 lg:px-10 lg:py-12">
              <div className="grid gap-10 lg:grid-cols-[1.1fr_1fr] lg:items-start">
                <div className="max-w-lg">
                  <p className="section-kicker">Next move</p>
                  <h2 className="mt-5 text-4xl font-semibold tracking-[-0.06em] text-foreground sm:text-5xl">
                    {siteContent.contact.title}
                  </h2>
                  <p className="mt-5 text-base leading-8 text-muted sm:text-lg">
                    {siteContent.contact.description}
                  </p>
                  <p className="mt-4 text-sm text-muted">
                    Or email me directly at{" "}
                    <a
                      href={`mailto:${siteContent.contact.email}`}
                      className="font-medium text-accent hover:text-foreground"
                    >
                      {siteContent.contact.email}
                    </a>
                  </p>
                </div>

                <ContactForm />
              </div>
            </div>
          </Reveal>
        </section>
      </main>

      <SiteFooter />
    </>
  );
}
