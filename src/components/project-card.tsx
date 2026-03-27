import Link from "next/link";
import { ArrowUpRight } from "lucide-react";
import type { Project } from "@/lib/portfolio-data";

type ProjectCardProps = {
  project: Project;
};

type ProjectPreviewProps = {
  project: Project;
  className?: string;
};

export function ProjectPreview({ project, className }: ProjectPreviewProps) {
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

      <div className="absolute left-8 top-8 h-24 w-24 rounded-full border border-white/12 float-slow" />
      <div className="absolute right-8 top-12 h-32 w-32 rounded-[2rem] border border-white/10 float-slower" />
      <div className="absolute left-1/2 top-1/2 h-48 w-48 -translate-x-1/2 -translate-y-1/2 rounded-full border border-white/10" />
      <div className="absolute left-1/2 top-1/2 h-28 w-28 -translate-x-1/2 -translate-y-1/2 rounded-[1.75rem] border border-white/16 bg-white/6 shadow-2xl backdrop-blur-xl float-slow sm:h-32 sm:w-32" />
      <div
        className="absolute left-[22%] top-[58%] h-12 w-12 rounded-2xl border border-white/14 bg-white/8 backdrop-blur-lg float-slower"
        style={{ boxShadow: `0 0 60px ${project.palette.glow}` }}
      />

      <div className="absolute inset-x-0 bottom-0 p-5 sm:p-6">
        <div className="glass-dark rounded-[1.5rem] p-4 sm:p-5">
          <div className="flex flex-wrap items-center justify-between gap-2 text-[0.68rem] uppercase tracking-[0.26em] text-white/58">
            <span>{project.label}</span>
            <span>{project.year}</span>
          </div>
          <div className="mt-4 flex items-end justify-between gap-4">
            <div>
              <p className="text-lg font-semibold text-white sm:text-xl">
                {project.title}
              </p>
              <p className="mt-1 max-w-xs text-sm leading-6 text-white/66">
                {project.previewTagline}
              </p>
            </div>
            <div
              className="hidden rounded-full border px-3 py-2 text-[0.65rem] uppercase tracking-[0.22em] text-white/64 md:inline-flex"
              style={{ borderColor: project.palette.line }}
            >
              {project.highlights[2]?.value}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export function ProjectCard({ project }: ProjectCardProps) {
  return (
    <article className="panel group rounded-[2rem] p-4 sm:p-5">
      <ProjectPreview project={project} className="min-h-[21rem] sm:min-h-[23rem]" />

      <div className="mt-6 flex items-center justify-between gap-3">
        <div>
          <p className="section-kicker">{project.category}</p>
          <h3 className="mt-3 text-2xl font-semibold tracking-[-0.04em] text-foreground">
            {project.title}
          </h3>
        </div>
        <span className="rounded-full border border-line bg-white/55 px-3 py-1 text-xs text-muted">
          {project.year}
        </span>
      </div>

      <p className="mt-4 text-sm leading-7 text-muted sm:text-[0.96rem]">
        {project.summary}
      </p>

      <p className="mt-4 text-sm font-medium leading-6 text-foreground/82">
        {project.impact}
      </p>

      <div className="mt-6 flex flex-wrap gap-2">
        {project.tags.map((tag) => (
          <span key={tag} className="chip">
            {tag}
          </span>
        ))}
      </div>

      <Link
        href={`/projects/${project.slug}`}
        className="mt-8 inline-flex items-center gap-2 text-sm font-semibold text-foreground hover:text-accent"
      >
        Open case study
        <ArrowUpRight className="h-4 w-4" />
      </Link>
    </article>
  );
}
