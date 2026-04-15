import Link from "next/link";
import { ArrowUpRight } from "lucide-react";
import type { Project } from "@/lib/portfolio-data";

type ProjectCardProps = {
  project: Project;
  variant?: number;
};

type ProjectPreviewProps = {
  project: Project;
  className?: string;
  variant?: number;
};

export function ProjectPreview({ project, className, variant = 0 }: ProjectPreviewProps) {
  return (
    <div
      className={`relative overflow-hidden rounded-[1.75rem] border border-white/10 bg-[#0e1720] ${className ?? ""}`}
      style={{
        background: `linear-gradient(155deg, ${project.palette.surface} 0%, ${project.palette.depth} 80%)`,
      }}
    >
      <div
        aria-hidden
        className="absolute inset-0 opacity-95"
        style={{
          background: [
            `radial-gradient(circle at 18% 18%, ${project.palette.glow} 0%, transparent 28%)`,
            `radial-gradient(circle at 80% 20%, ${project.palette.accentSoft} 0%, transparent 24%)`,
            "linear-gradient(180deg, rgba(255,255,255,0.04), transparent 46%)",
          ].join(", "),
        }}
      />

      <div aria-hidden className="absolute inset-0">
        {variant === 0 && (
          <>
            <div className="absolute left-8 top-8 h-24 w-24 rounded-full border border-white/12 float-slow" />
            <div className="absolute right-8 top-12 h-32 w-32 rounded-[2rem] border border-white/10 float-slower" />
            <div className="absolute left-1/2 top-1/2 h-48 w-48 -translate-x-1/2 -translate-y-1/2 rounded-full border border-white/10" />
            <div className="absolute left-1/2 top-1/2 h-28 w-28 -translate-x-1/2 -translate-y-1/2 rounded-[1.75rem] border border-white/16 bg-white/6 shadow-2xl backdrop-blur-xl float-slow sm:h-32 sm:w-32" />
            <div
              className="absolute left-[22%] top-[58%] h-12 w-12 rounded-2xl border border-white/14 bg-white/8 backdrop-blur-lg float-slower"
              style={{ boxShadow: `0 0 60px ${project.palette.glow}` }}
            />
          </>
        )}
        {variant === 1 && (
          <>
            <div className="absolute left-10 top-10 h-36 w-36 rounded-full border border-white/10 float-slower" />
            <div className="absolute right-12 top-8 h-20 w-20 rounded-full border border-white/14 float-slow" />
            <div className="absolute left-1/2 top-[44%] h-44 w-44 -translate-x-1/2 -translate-y-1/2 rotate-45 rounded-[2rem] border border-white/10" />
            <div className="absolute left-1/2 top-[44%] h-24 w-24 -translate-x-1/2 -translate-y-1/2 rotate-45 rounded-[1.25rem] border border-white/16 bg-white/6 shadow-2xl backdrop-blur-xl float-slow sm:h-28 sm:w-28" />
            <div
              className="absolute right-[18%] top-[62%] h-14 w-14 rounded-full border border-white/14 bg-white/8 backdrop-blur-lg float-slower"
              style={{ boxShadow: `0 0 60px ${project.palette.glow}` }}
            />
            <div className="absolute left-[16%] top-[68%] h-10 w-10 rotate-12 rounded-xl border border-white/12 bg-white/5 float-slow" />
          </>
        )}
        {variant === 2 && (
          <>
            <div className="absolute left-6 top-6 h-16 w-16 rounded-2xl border border-white/12 float-slower" />
            <div className="absolute right-6 top-10 h-16 w-16 rounded-2xl border border-white/12 float-slow" />
            <div className="absolute left-1/2 top-1/2 h-52 w-52 -translate-x-1/2 -translate-y-1/2 rounded-full border border-white/8" />
            <div className="absolute left-[30%] top-[38%] h-20 w-20 rounded-full border border-white/14 bg-white/6 shadow-2xl backdrop-blur-xl float-slow" />
            <div className="absolute right-[28%] top-[52%] h-20 w-20 rounded-full border border-white/14 bg-white/6 shadow-2xl backdrop-blur-xl float-slower" />
            <div
              className="absolute left-1/2 top-[45%] h-1 w-24 -translate-x-1/2 border-t border-dashed border-white/18"
              style={{ boxShadow: `0 0 40px ${project.palette.glow}` }}
            />
            <div className="absolute left-[20%] top-[64%] h-12 w-12 rounded-xl border border-white/12 bg-white/5 float-slow" />
          </>
        )}
      </div>

      <div className="absolute inset-x-0 bottom-0 p-5 sm:p-6">
        <div className="glass-dark rounded-[1.5rem] p-4 sm:p-5">
          <div className="flex flex-wrap items-center justify-between gap-2 text-[0.68rem] uppercase tracking-[0.26em] text-white/50">
            <span>{project.label}</span>
            <span>{project.year}</span>
          </div>
          <div className="mt-3 flex items-end justify-between gap-4">
            <div>
              <p className="text-lg font-semibold leading-snug text-white sm:text-xl">
                {project.title}
              </p>
              <p className="mt-1.5 max-w-xs text-sm leading-relaxed text-white/55">
                {project.previewTagline}
              </p>
            </div>
            <div
              className="hidden shrink-0 rounded-xl border px-3 py-2 text-center text-[0.6rem] uppercase leading-tight tracking-[0.18em] text-white/50 md:block"
              style={{ borderColor: project.palette.line, maxWidth: "8rem" }}
            >
              {project.highlights[2]?.value}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export function ProjectCard({ project, variant = 0 }: ProjectCardProps) {
  return (
    <article className="panel group rounded-[2rem] p-4 transition-shadow hover:shadow-[0_34px_84px_rgba(12,23,34,0.18)] sm:p-5">
      <ProjectPreview project={project} variant={variant} className="min-h-[21rem] sm:min-h-[23rem]" />

      <div className="mt-6 space-y-1">
        <p className="section-kicker">{project.category}</p>
        <div className="flex items-baseline justify-between gap-3">
          <h3 className="text-2xl font-semibold tracking-[-0.04em] text-foreground">
            {project.title}
          </h3>
          <span className="shrink-0 rounded-full border border-line px-3 py-1 text-xs font-medium text-muted">
            {project.year}
          </span>
        </div>
      </div>

      <p className="mt-4 text-sm leading-7 text-muted sm:text-[0.96rem]">
        {project.summary}
      </p>

      <div className="mt-5 flex flex-wrap gap-2">
        {project.tags.map((tag) => (
          <span key={tag} className="chip">
            {tag}
          </span>
        ))}
      </div>

      <Link
        href={`/projects/${project.slug}`}
        className="mt-8 inline-flex items-center gap-2 text-sm font-semibold text-accent hover:text-foreground"
        aria-label={`View ${project.title} case study`}
      >
        Open case study
        <ArrowUpRight className="h-4 w-4" />
      </Link>
    </article>
  );
}
