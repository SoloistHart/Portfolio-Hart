# Portfolio-Hart — Architecture

## Framework
Next.js 16 app router with React 19, TypeScript strict, Tailwind CSS v4, Framer Motion.

## Directory structure

```
src/
├── app/                    # Route-level page composition
│   ├── layout.tsx          # Root layout — fonts (Sora, IBM Plex Mono), global scripts, PortfolioChat, ScrollProgress, CursorTrail
│   ├── template.tsx        # Page transition animation wrapper (Framer Motion)
│   ├── page.tsx            # Homepage — hero, projects, "how I work", GitHub activity, contact form
│   ├── not-found.tsx       # Custom 404
│   ├── globals.css         # Design tokens, shared utility classes (.panel, .chip, .button-*, .section-kicker, .page-shell)
│   ├── about/page.tsx      # About page — bio, skills grid, experience timeline, education, CTA
│   ├── projects/page.tsx   # Project archive — grid of all projects
│   ├── projects/[slug]/    # Dynamic project detail pages (SSG via generateStaticParams)
│   └── api/chat/route.ts   # Portfolio AI chat endpoint (Gemini API with local fallback)
├── components/             # Reusable UI pieces (presentational by default)
│   ├── reveal.tsx          # Shared scroll-reveal motion wrapper (used everywhere)
│   ├── project-card.tsx    # ProjectCard + ProjectPreview — card UI with per-project palette
│   ├── site-header.tsx     # Fixed floating header — brand pill, nav, theme toggle, mobile nav
│   ├── site-footer.tsx     # Footer — brand, nav links, social icons
│   ├── contact-form.tsx    # Web3Forms contact form with honeypot + time-based anti-spam
│   ├── portfolio-chat.tsx  # Floating AI chat widget (Gemini-powered)
│   ├── hero-hologram.tsx   # Three.js holographic head — custom GLSL wireframe + particles + glow
│   ├── hero-sphere.tsx     # Alternative Three.js hero (unused/secondary)
│   ├── cursor-trail.tsx    # WebGL fluid simulation cursor effect (SplashCursor)
│   ├── scroll-progress.tsx # Fixed top scroll progress bar
│   ├── theme-toggle.tsx    # Light/dark/system theme cycler with localStorage
│   ├── mobile-nav.tsx      # Mobile navigation drawer
│   ├── nav-links.tsx       # Shared navigation link list
│   └── github-activity.tsx # Server component — fetches GitHub stats + contribution chart
└── lib/                    # Structured content and utilities
    ├── portfolio-data.ts   # PRIMARY CONTENT MODEL — all copy, projects, about, socials, contact
    └── portfolio-chat.ts   # Chat context builder, local fallback replies, link suggestion logic
```

## Data flow

```
portfolio-data.ts (content model)
    ↓
page.tsx / about/page.tsx / projects/page.tsx / [slug]/page.tsx (server components consume data)
    ↓
components (receive data as props, render UI)
```

Chat flow:
```
portfolio-chat.tsx (client) → /api/chat (server route) → Gemini API
                                                        ↓ fallback
                                                   portfolio-chat.ts (local replies)
```

## Design system

### Tokens (CSS variables in globals.css)
- `--background`, `--foreground` — base colors (light/dark aware)
- `--muted` — secondary text
- `--surface`, `--surface-strong` — glass panel backgrounds
- `--line`, `--line-strong` — borders
- `--accent` — teal primary (`#2f8f86` light / `#3db5a9` dark)
- `--accent-soft` — teal tint for backgrounds
- `--accent-warm` — warm orange secondary (`#cf8a54` / `#d9985c`)
- `--shadow-md`, `--shadow-lg` — elevation

### Shared classes
- `.page-shell` — centered container with max-width and padding
- `.panel` — glass surface with blur, border, shadow
- `.panel-strong` — heavier glass with accent top border
- `.chip` — pill tag
- `.button-primary` — solid foreground button
- `.button-secondary` — outlined glass button
- `.section-kicker` — monospace uppercase label

### Fonts
- **Sora** (`--font-sora`) — primary sans-serif
- **IBM Plex Mono** (`--font-plex-mono`) — monospace accents

### Theme
- Three modes: system / dark / light
- Managed via `localStorage` + class on `<html>`
- Smooth transition via `.theme-transitioning` class

## Rendering strategy
- Homepage: static with ISR (revalidate 1h for GitHub data)
- About: fully static
- Projects archive: fully static
- Project detail pages: SSG via `generateStaticParams`
- Chat API: dynamic server route
- 404: static

## Key patterns
- Server components by default; `"use client"` only for interactivity
- Content lives in `portfolio-data.ts`, not scattered in components
- `Reveal` wraps every animated section/element for consistent scroll-reveal
- Project cards use per-project color palettes for visual variety
- Template.tsx handles route transition animations
- Three.js hero is isolated in its own client component, positioned behind hero text
