import Link from "next/link";
import {
  ArrowRight,
  ArrowUpRight,
  Bot,
  Cuboid,
  Layers3,
  MoveRight,
  Sparkles,
} from "lucide-react";
import { ProjectCard } from "@/components/project-card";
import { Reveal } from "@/components/reveal";
import { SiteHeader } from "@/components/site-header";
import { projects, siteContent } from "@/lib/portfolio-data";

const futureIcons = [Cuboid, Bot, Layers3] as const;
const principleIcons = [Sparkles, MoveRight, ArrowUpRight] as const;

export default function Home() {
  return (
    <>
      <SiteHeader />

      <main className="relative overflow-hidden pb-20 pt-28 sm:pt-32">
        <div aria-hidden className="pointer-events-none absolute inset-0 -z-10 overflow-hidden">
          <div className="absolute left-[6%] top-28 h-56 w-56 rounded-full bg-[radial-gradient(circle,_rgba(47,143,134,0.16),_transparent_68%)] blur-3xl" />
          <div className="absolute right-[2%] top-44 h-72 w-72 rounded-full bg-[radial-gradient(circle,_rgba(207,138,84,0.18),_transparent_72%)] blur-3xl" />
          <div className="absolute bottom-24 right-[12%] h-64 w-64 rounded-full bg-[radial-gradient(circle,_rgba(25,80,120,0.12),_transparent_70%)] blur-3xl" />
        </div>

        <section className="page-shell">
          <div className="grid gap-12 lg:grid-cols-[minmax(0,1fr)_34rem] lg:items-center xl:grid-cols-[minmax(0,1fr)_37rem]">
            <Reveal>
              <div>
                <p className="section-kicker">{siteContent.hero.eyebrow}</p>
                <h1 className="mt-6 max-w-3xl text-5xl font-semibold leading-[0.92] tracking-[-0.08em] text-foreground sm:text-6xl md:text-7xl">
                  {siteContent.hero.title}
                </h1>
                <p className="mt-6 max-w-2xl text-base leading-8 text-muted sm:text-lg">
                  {siteContent.hero.description}
                </p>

                <div className="mt-8 flex flex-wrap gap-3">
                  {siteContent.hero.chips.map((chip) => (
                    <span key={chip} className="chip">
                      {chip}
                    </span>
                  ))}
                </div>

                <div className="mt-10 flex flex-col gap-4 sm:flex-row">
                  <Link href="#work" className="button-primary">
                    See selected work
                    <ArrowRight className="h-4 w-4" />
                  </Link>
                  <Link href="/projects" className="button-secondary">
                    Open project archive
                    <ArrowUpRight className="h-4 w-4" />
                  </Link>
                </div>

                <div className="mt-12 grid gap-5 sm:grid-cols-2">
                  <div className="panel rounded-[1.6rem] p-5">
                    <p className="section-kicker">Availability</p>
                    <p className="mt-3 text-sm leading-7 text-foreground/86">
                      {siteContent.brand.availability}
                    </p>
                  </div>
                  <div className="panel rounded-[1.6rem] p-5">
                    <p className="section-kicker">Base</p>
                    <p className="mt-3 text-sm leading-7 text-foreground/86">
                      {siteContent.brand.location}
                    </p>
                  </div>
                </div>
              </div>
            </Reveal>

            <Reveal delay={0.14}>
              <div className="hero-stage min-h-[38rem] p-6 sm:p-7">
                <div className="relative z-10 flex h-full flex-col">
                  <div className="flex items-start justify-between gap-6">
                    <div className="max-w-sm">
                      <p className="font-mono text-[0.68rem] uppercase tracking-[0.3em] text-white/62">
                        Future hero stage
                      </p>
                      <h2 className="mt-4 text-3xl font-semibold leading-tight tracking-[-0.05em] text-white sm:text-[2.15rem]">
                        The layout already leaves room for a future Three.js reveal.
                      </h2>
                    </div>
                    <span className="rounded-full border border-white/14 bg-white/7 px-3 py-2 text-[0.68rem] uppercase tracking-[0.22em] text-white/64">
                      Phase one
                    </span>
                  </div>

                  <div className="relative mt-8 flex-1 overflow-hidden rounded-[1.85rem] border border-white/10 bg-white/4">
                    <div className="absolute left-1/2 top-1/2 h-72 w-72 -translate-x-1/2 -translate-y-1/2 rounded-full bg-[radial-gradient(circle,_rgba(137,239,224,0.46),_transparent_58%)] blur-2xl" />
                    <div className="orbit-ring absolute left-6 top-8 h-44 w-44 float-slower" />
                    <div className="orbit-ring absolute right-10 top-14 h-28 w-28 float-slow" />
                    <div className="orbit-ring absolute bottom-8 left-10 h-36 w-36" />
                    <div className="absolute left-1/2 top-1/2 h-52 w-52 -translate-x-1/2 -translate-y-1/2 rounded-full border border-white/12" />
                    <div className="absolute left-1/2 top-1/2 h-36 w-36 -translate-x-1/2 -translate-y-1/2 rounded-[2rem] border border-white/16 bg-white/8 shadow-2xl backdrop-blur-xl float-slow" />
                    <div className="absolute left-[18%] top-[56%] h-12 w-12 rounded-2xl border border-white/18 bg-white/10 backdrop-blur-xl float-slower" />
                    <div className="absolute right-[20%] top-[34%] h-16 w-16 rounded-full border border-white/16 bg-white/8 backdrop-blur-xl float-slow" />

                    <div className="absolute inset-x-5 bottom-5 glass-dark rounded-[1.6rem] p-4 sm:inset-x-6 sm:bottom-6 sm:p-5">
                      <div className="flex items-center justify-between gap-4 text-[0.68rem] uppercase tracking-[0.26em] text-white/58">
                        <span>Reserved composition</span>
                        <span>Three.js later</span>
                      </div>
                      <div className="mt-4 grid gap-3 sm:grid-cols-3">
                        <div className="rounded-[1.2rem] border border-white/10 bg-white/6 p-4">
                          <p className="font-mono text-[0.64rem] uppercase tracking-[0.24em] text-white/54">
                            Now
                          </p>
                          <p className="mt-2 text-sm leading-6 text-white/76">
                            Calm depth, layered shape language, strong copy.
                          </p>
                        </div>
                        <div className="rounded-[1.2rem] border border-white/10 bg-white/6 p-4">
                          <p className="font-mono text-[0.64rem] uppercase tracking-[0.24em] text-white/54">
                            Next
                          </p>
                          <p className="mt-2 text-sm leading-6 text-white/76">
                            Swap in a crafted 3D scene without rebuilding the page.
                          </p>
                        </div>
                        <div className="rounded-[1.2rem] border border-white/10 bg-white/6 p-4">
                          <p className="font-mono text-[0.64rem] uppercase tracking-[0.24em] text-white/54">
                            Always
                          </p>
                          <p className="mt-2 text-sm leading-6 text-white/76">
                            Keep the rest of the portfolio sharp, fast, and easy to extend.
                          </p>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </Reveal>
          </div>

          <Reveal delay={0.18} className="mt-10">
            <div className="panel rounded-[2rem] px-6 py-6 sm:px-7">
              <div className="grid gap-6 md:grid-cols-2 xl:grid-cols-4">
                {siteContent.stats.map((stat, index) => (
                  <div
                    key={stat.label}
                    className={`relative ${
                      index < siteContent.stats.length - 1
                        ? "xl:pr-7 xl:after:absolute xl:after:right-0 xl:after:top-0 xl:after:h-full xl:after:w-px xl:after:metric-divider xl:after:content-['']"
                        : ""
                    }`}
                  >
                    <p className="section-kicker">{stat.label}</p>
                    <p className="mt-3 max-w-xs text-sm leading-7 text-foreground/86">
                      {stat.value}
                    </p>
                  </div>
                ))}
              </div>
            </div>
          </Reveal>
        </section>

        <section id="work" className="page-shell pt-24 sm:pt-28">
          <div className="flex flex-col gap-6 lg:flex-row lg:items-end lg:justify-between">
            <Reveal>
              <div className="max-w-2xl">
                <p className="section-kicker">Selected work</p>
                <h2 className="mt-5 text-4xl font-semibold tracking-[-0.06em] text-foreground sm:text-5xl">
                  Three portfolio stories that already support a stronger future hero.
                </h2>
                <p className="mt-5 text-base leading-8 text-muted sm:text-lg">
                  Each concept is structured to feel finished right now, while still leaving enough flexibility for motion upgrades, deeper storytelling, and future interactive layers.
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
                <ProjectCard project={project} />
              </Reveal>
            ))}
          </div>
        </section>

        <section id="notes" className="page-shell pt-24 sm:pt-28">
          <div className="grid gap-10 lg:grid-cols-[0.88fr_1.12fr] lg:items-start">
            <Reveal>
              <div className="max-w-xl">
                <p className="section-kicker">Built to evolve</p>
                <h2 className="mt-5 text-4xl font-semibold tracking-[-0.06em] text-foreground sm:text-5xl">
                  The base is meant to grow without forcing another redesign.
                </h2>
                <p className="mt-5 text-base leading-8 text-muted sm:text-lg">
                  This first version stays premium and readable, but the architecture already anticipates what you asked for next: a Three.js hero, richer components, and an optional AI guide.
                </p>
              </div>
            </Reveal>

            <div className="space-y-4">
              {siteContent.futureModules.map((item, index) => {
                const Icon = futureIcons[index];

                return (
                  <Reveal key={item.title} delay={index * 0.08}>
                    <article className="panel flex flex-col gap-5 rounded-[1.7rem] p-6 sm:flex-row sm:items-start sm:justify-between">
                      <div className="flex gap-4">
                        <span className="flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl bg-foreground text-background">
                          <Icon className="h-5 w-5" />
                        </span>
                        <div className="max-w-xl">
                          <p className="section-kicker">{item.label}</p>
                          <h3 className="mt-3 text-xl font-semibold tracking-[-0.04em] text-foreground">
                            {item.title}
                          </h3>
                          <p className="mt-3 text-sm leading-7 text-muted sm:text-[0.96rem]">
                            {item.text}
                          </p>
                        </div>
                      </div>
                    </article>
                  </Reveal>
                );
              })}
            </div>
          </div>

          <div className="mt-8 grid gap-4 md:grid-cols-3">
            {siteContent.principles.map((principle, index) => {
              const Icon = principleIcons[index];

              return (
                <Reveal key={principle.title} delay={index * 0.07}>
                  <article className="panel rounded-[1.7rem] p-6">
                    <span className="flex h-11 w-11 items-center justify-center rounded-2xl bg-accent-soft text-accent">
                      <Icon className="h-5 w-5" />
                    </span>
                    <h3 className="mt-5 text-xl font-semibold tracking-[-0.04em] text-foreground">
                      {principle.title}
                    </h3>
                    <p className="mt-3 text-sm leading-7 text-muted sm:text-[0.96rem]">
                      {principle.text}
                    </p>
                  </article>
                </Reveal>
              );
            })}
          </div>
        </section>

        <section id="contact" className="page-shell pt-24 sm:pt-28">
          <Reveal>
            <div className="panel-strong rounded-[2.2rem] px-6 py-8 sm:px-8 sm:py-10 lg:px-10 lg:py-12">
              <div className="grid gap-10 lg:grid-cols-[1.1fr_auto] lg:items-end">
                <div className="max-w-3xl">
                  <p className="section-kicker">Next move</p>
                  <h2 className="mt-5 text-4xl font-semibold tracking-[-0.06em] text-foreground sm:text-5xl">
                    {siteContent.contact.title}
                  </h2>
                  <p className="mt-5 text-base leading-8 text-muted sm:text-lg">
                    {siteContent.contact.description}
                  </p>
                </div>

                <div className="flex flex-col gap-4 sm:flex-row lg:flex-col">
                  <Link
                    href={`mailto:${siteContent.contact.email}`}
                    className="button-primary"
                  >
                    Start the conversation
                    <ArrowRight className="h-4 w-4" />
                  </Link>
                  <Link href="/projects" className="button-secondary">
                    Review project pages
                    <ArrowUpRight className="h-4 w-4" />
                  </Link>
                </div>
              </div>
            </div>
          </Reveal>

          <footer className="mt-8 flex flex-col gap-3 border-t border-line pt-6 text-sm text-muted sm:flex-row sm:items-center sm:justify-between">
            <p>
              {siteContent.brand.name} - {siteContent.brand.role}
            </p>
            <div className="flex flex-wrap gap-4">
              <Link href="/projects" className="hover:text-foreground">
                Archive
              </Link>
              <Link href={`mailto:${siteContent.contact.email}`} className="hover:text-foreground">
                Email
              </Link>
            </div>
          </footer>
        </section>
      </main>
    </>
  );
}
