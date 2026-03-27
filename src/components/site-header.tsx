import Link from "next/link";
import { ArrowUpRight } from "lucide-react";
import { siteContent } from "@/lib/portfolio-data";

const links = [
  { href: "/#work", label: "Work" },
  { href: "/#notes", label: "Notes" },
  { href: "/projects", label: "Archive" },
  { href: "/#contact", label: "Contact" },
];

export function SiteHeader() {
  return (
    <header className="pointer-events-none fixed inset-x-0 top-4 z-40">
      <div className="page-shell flex items-center justify-between gap-4">
        <Link
          href="/"
          className="pointer-events-auto panel flex items-center gap-3 rounded-full px-3 py-2"
        >
          <span className="flex h-10 w-10 items-center justify-center rounded-full bg-foreground text-sm font-semibold text-background">
            H
          </span>
          <span className="hidden min-[430px]:block">
            <span className="block text-sm font-semibold text-foreground">
              {siteContent.brand.name}
            </span>
            <span className="block text-xs text-muted">
              {siteContent.brand.role}
            </span>
          </span>
        </Link>

        <nav className="pointer-events-auto hidden items-center gap-1 rounded-full border border-line bg-white/55 px-2 py-2 backdrop-blur-xl md:flex">
          {links.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              className="rounded-full px-4 py-2 text-sm text-muted hover:bg-white/70 hover:text-foreground"
            >
              {link.label}
            </Link>
          ))}
        </nav>

        <Link
          href="/projects"
          className="pointer-events-auto inline-flex items-center gap-2 rounded-full border border-line-strong bg-white/65 px-4 py-2 text-sm font-medium text-foreground backdrop-blur-xl hover:bg-white/82"
        >
          Project archive
          <ArrowUpRight className="h-4 w-4" />
        </Link>
      </div>
    </header>
  );
}
