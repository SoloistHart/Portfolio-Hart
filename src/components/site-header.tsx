import Image from "next/image";
import Link from "next/link";
import { ArrowUpRight } from "lucide-react";
import { siteContent } from "@/lib/portfolio-data";
import { MobileNav } from "./mobile-nav";
import { NavLinks } from "./nav-links";
import { ThemeToggle } from "./theme-toggle";

export function SiteHeader() {
  return (
    <header className="pointer-events-none fixed inset-x-0 top-4 z-40">
      <div className="page-shell flex items-center justify-between gap-4">
        <Link
          href="/"
          className="pointer-events-auto panel flex items-center gap-3 rounded-full px-3 py-2"
        >
          {siteContent.brand.profileImage ? (
            <span className="relative h-10 w-10 overflow-hidden rounded-full ring-1 ring-white/12">
              <Image
                src={siteContent.brand.profileImage}
                alt={`${siteContent.brand.name} profile photo`}
                fill
                sizes="40px"
                className="object-cover"
              />
            </span>
          ) : (
            <span className="flex h-10 w-10 items-center justify-center rounded-full bg-foreground text-sm font-semibold text-background">
              H
            </span>
          )}
          <span className="hidden min-[430px]:block">
            <span className="block text-sm font-semibold text-foreground">
              {siteContent.brand.name}
            </span>
            <span className="block text-xs text-muted">
              {siteContent.brand.shortRole}
            </span>
          </span>
        </Link>

        <nav className="pointer-events-auto hidden items-center gap-1 rounded-full border border-line bg-surface px-2 py-2 backdrop-blur-xl md:flex">
          <NavLinks />
        </nav>

        <div className="flex items-center gap-3">
          <ThemeToggle />
          <Link
            href="/projects"
            className="pointer-events-auto hidden items-center gap-2 rounded-full border border-line-strong bg-surface px-4 py-2 text-sm font-medium text-foreground backdrop-blur-xl hover:bg-surface-strong md:inline-flex"
          >
            Project archive
            <ArrowUpRight className="h-4 w-4" />
          </Link>
          <MobileNav />
        </div>
      </div>
    </header>
  );
}
