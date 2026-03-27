import Link from "next/link";
import { ArrowLeft, ArrowUpRight } from "lucide-react";

export default function NotFound() {
  return (
    <main className="page-shell flex min-h-screen items-center py-24">
      <div className="panel-strong w-full rounded-[2.2rem] px-6 py-10 sm:px-8 sm:py-12 lg:px-10">
        <p className="section-kicker">Not found</p>
        <h1 className="mt-5 text-5xl font-semibold tracking-[-0.08em] text-foreground sm:text-6xl">
          This page is not part of the portfolio yet.
        </h1>
        <p className="mt-6 max-w-2xl text-base leading-8 text-muted sm:text-lg">
          Head back to the homepage or browse the project archive to keep exploring the base experience.
        </p>
        <div className="mt-10 flex flex-col gap-4 sm:flex-row">
          <Link href="/" className="button-primary">
            <ArrowLeft className="h-4 w-4" />
            Return home
          </Link>
          <Link href="/projects" className="button-secondary">
            Open archive
            <ArrowUpRight className="h-4 w-4" />
          </Link>
        </div>
      </div>
    </main>
  );
}
