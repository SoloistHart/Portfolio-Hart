import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import {
  ArrowLeft,
  ArrowRight,
  ArrowUpRight,
  Briefcase,
  GraduationCap,
} from "lucide-react";
import { Reveal } from "@/components/reveal";
import { SiteHeader } from "@/components/site-header";
import { SiteFooter } from "@/components/site-footer";
import { siteContent } from "@/lib/portfolio-data";

const { about } = siteContent;

export const metadata: Metadata = {
  title: "About",
  description: about.summary,
};

export default function AboutPage() {
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

          <div className="mt-10 grid gap-10 lg:grid-cols-[1fr_16rem] lg:items-start">
            <Reveal>
              <div>
                <p className="section-kicker">About</p>
                <h1 className="mt-5 text-5xl font-semibold tracking-[-0.08em] text-foreground sm:text-6xl">
                  {about.headline}
                </h1>
                <p className="mt-6 text-base leading-8 text-muted sm:text-lg">
                  {about.summary}
                </p>
              </div>
            </Reveal>

            <Reveal delay={0.12}>
              <div className="relative mx-auto aspect-[3/4] w-full max-w-[16rem] overflow-hidden rounded-[2rem] border border-foreground/8">
                <Image
                  src="/grad-pic.jpg"
                  alt="Rhohart Martel — graduation photo"
                  fill
                  className="object-cover"
                  sizes="(max-width: 1024px) 256px, 256px"
                  priority
                />
              </div>
            </Reveal>
          </div>
        </section>

        <section className="page-shell pt-20 sm:pt-24">
          <Reveal>
            <p className="section-kicker">Skills & tools</p>
            <h2 className="mt-5 text-4xl font-semibold tracking-[-0.06em] text-foreground sm:text-5xl">
              What I work with.
            </h2>
          </Reveal>

          <div className="mt-10 grid gap-4 sm:grid-cols-2 xl:grid-cols-3">
            {about.skills.map((group, index) => (
              <Reveal key={group.category} delay={index * 0.06}>
                <article className="panel rounded-[1.7rem] border-t-2 border-t-accent p-6">
                  <p className="section-kicker">{group.category}</p>
                  <div className="mt-4 flex flex-wrap gap-2">
                    {group.items.map((item) => (
                      <span key={item} className="chip">
                        {item}
                      </span>
                    ))}
                  </div>
                </article>
              </Reveal>
            ))}
          </div>
        </section>

        <section className="page-shell pt-20 sm:pt-24">
          <Reveal>
            <p className="section-kicker">Experience</p>
            <h2 className="mt-5 text-4xl font-semibold tracking-[-0.06em] text-foreground sm:text-5xl">
              Where I&apos;ve built things.
            </h2>
          </Reveal>

          <div className="mt-10 space-y-4">
            {about.experience.map((job, index) => (
              <Reveal key={`${job.company}-${job.role}`} delay={index * 0.08}>
                <article className="panel rounded-[1.7rem] p-6 sm:p-7">
                  <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
                    <div className="flex gap-4">
                      <span className="flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl bg-foreground text-background">
                        <Briefcase className="h-5 w-5" />
                      </span>
                      <div>
                        <h3 className="text-xl font-semibold tracking-[-0.04em] text-foreground">
                          {job.role}
                        </h3>
                        <p className="mt-1 text-sm text-muted">
                          {job.company}
                        </p>
                      </div>
                    </div>
                    <span className="shrink-0 text-sm text-muted">
                      {job.period}
                    </span>
                  </div>
                  <ul className="mt-5 space-y-3 text-sm leading-7 text-foreground/82">
                    {job.highlights.map((highlight) => (
                      <li key={highlight} className="flex items-start gap-3">
                        <span className="mt-2 h-2 w-2 shrink-0 rounded-full bg-accent" />
                        <span>{highlight}</span>
                      </li>
                    ))}
                  </ul>
                </article>
              </Reveal>
            ))}
          </div>
        </section>

        <section className="page-shell pt-20 sm:pt-24">
          <Reveal>
            <article className="panel rounded-[1.7rem] p-6 sm:p-7">
              <div className="flex gap-4">
                <span className="flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl bg-accent-soft text-accent">
                  <GraduationCap className="h-5 w-5" />
                </span>
                <div>
                  <p className="section-kicker">Education</p>
                  <h3 className="mt-3 text-xl font-semibold tracking-[-0.04em] text-foreground">
                    {about.education.degree}
                  </h3>
                  <p className="mt-1 text-sm text-muted">
                    {about.education.school} · {about.education.graduationDate}
                  </p>
                  <span className="mt-3 inline-block rounded-full border border-accent/30 bg-accent-soft px-3 py-1 text-xs font-semibold text-accent">
                    {about.education.honors}
                  </span>
                </div>
              </div>
            </article>
          </Reveal>
        </section>

        <section className="page-shell pt-16 sm:pt-20">
          <Reveal>
            <div className="panel-strong rounded-[2rem] px-6 py-7 sm:px-8 sm:py-8">
              <div className="flex flex-col gap-6 lg:flex-row lg:items-center lg:justify-between">
                <div>
                  <p className="section-kicker">Next step</p>
                  <h2 className="mt-4 text-3xl font-semibold tracking-[-0.05em] text-foreground sm:text-4xl">
                    {siteContent.contact.title}
                  </h2>
                  <p className="mt-3 max-w-2xl text-base leading-8 text-muted">
                    {siteContent.contact.description}
                  </p>
                </div>
                <div className="flex flex-col gap-4 sm:flex-row lg:flex-col">
                  <Link
                    href={`mailto:${siteContent.contact.email}`}
                    className="button-primary"
                  >
                    Get in touch
                    <ArrowRight className="h-4 w-4" />
                  </Link>
                  <Link href="/projects" className="button-secondary">
                    View projects
                    <ArrowUpRight className="h-4 w-4" />
                  </Link>
                </div>
              </div>
            </div>
          </Reveal>
        </section>
      </main>

      <SiteFooter />
    </>
  );
}
