"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

const links = [
  { href: "/#work", label: "Work" },
  { href: "/about", label: "About" },
  { href: "/projects", label: "Archive" },
  { href: "/#contact", label: "Contact" },
];

export function NavLinks() {
  const pathname = usePathname();

  return (
    <>
      {links.map((link) => {
        const isActive =
          link.href === "/about"
            ? pathname === "/about"
            : link.href === "/projects"
              ? pathname.startsWith("/projects")
              : false;

        return (
          <Link
            key={link.href}
            href={link.href}
            className={`rounded-full px-4 py-2 text-sm ${
              isActive
                ? "bg-foreground/8 font-medium text-foreground"
                : "text-muted hover:bg-surface hover:text-foreground"
            }`}
          >
            {link.label}
          </Link>
        );
      })}
    </>
  );
}
