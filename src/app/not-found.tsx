import Link from "next/link";
import { ArrowLeft, ArrowUpRight } from "lucide-react";

export default function NotFound() {
  return (
    <main className="page-shell flex min-h-screen flex-col items-center justify-center py-24 text-center">
      <div className="relative">
        <p className="select-none text-[10rem] font-semibold leading-none tracking-[-0.1em] text-foreground/[0.04] sm:text-[14rem]">
          404
        </p>
        <div className="absolute inset-0 flex items-center justify-center">
          <div className="h-24 w-24 rounded-[2rem] border border-line bg-surface backdrop-blur-xl float-slow sm:h-32 sm:w-32" />
        </div>
      </div>

      <div className="mt-2 max-w-xl">
        <p className="section-kicker">Page not found</p>
        <h1 className="mt-5 text-4xl font-semibold tracking-[-0.06em] text-foreground sm:text-5xl">
          Nothing here yet.
        </h1>
        <p className="mt-5 text-base leading-8 text-muted">
          This page doesn&apos;t exist — or it hasn&apos;t been built yet.
          Head back home or explore the project archive.
        </p>
        <div className="mt-10 flex flex-col items-center gap-4 sm:flex-row sm:justify-center">
          <Link href="/" className="button-primary">
            <ArrowLeft className="h-4 w-4" />
            Return home
          </Link>
          <Link href="/projects" className="button-secondary">
            Project archive
            <ArrowUpRight className="h-4 w-4" />
          </Link>
        </div>
      </div>
    </main>
  );
}
