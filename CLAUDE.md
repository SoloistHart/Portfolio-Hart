# CLAUDE.md

## Project overview

This repository is a premium portfolio site built with Next.js, React, TypeScript, Tailwind CSS v4, and Framer Motion.

The current product shape is:
- a polished homepage
- a project archive page
- dynamic project detail pages
- centralized site and portfolio content
- a visual system designed to support a future Three.js hero without requiring a redesign

Primary goal:
- keep the portfolio feeling premium, calm, editorial, and motion-aware
- preserve a structure that can grow into richer storytelling, modular sections, and future interactive layers

## Tech stack

- Next.js 16 app router
- React 19
- TypeScript
- Tailwind CSS v4
- Framer Motion
- Lucide React

## Source of truth

Prefer these files as the first place to inspect before making changes:

- `src/lib/portfolio-data.ts` — primary content model for site copy and project data
- `src/app/page.tsx` — homepage composition
- `src/app/projects/page.tsx` — project archive page
- `src/app/projects/[slug]/page.tsx` — project detail page
- `src/components/project-card.tsx` — reusable project preview and archive card UI
- `src/components/site-header.tsx` — top navigation/header
- `src/components/reveal.tsx` — motion wrapper used across the site
- `src/app/globals.css` — global tokens, shared utility classes, and visual language

## Architecture guidance

Follow this separation of concerns:

- `src/lib/*` for structured content and data
- `src/app/*` for route-level page composition
- `src/components/*` for reusable UI pieces
- `src/app/globals.css` for shared tokens and repeated visual primitives

When adding new functionality:
- prefer extending existing data structures over hardcoding repeated content into page files
- prefer editing existing components over creating new ones unless reuse is real
- keep page files focused on composition, not large embedded data blobs
- keep components presentational unless they truly need client behavior

## Design and brand rules

This project should feel:
- premium
- calm
- deliberate
- readable
- slightly futuristic, but not noisy
- motion-led, but never motion-heavy for its own sake

Preserve these patterns:
- strong editorial hierarchy
- spacious layouts
- soft glass / panel surfaces
- restrained accent usage
- concise, confident copy
- modular sections that can evolve later

Avoid:
- cluttered layouts
- overly playful UI
- dense walls of text
- harsh color departures from the established palette
- unnecessary animation
- visual changes that make the future Three.js hero harder to integrate

## Motion guidance

Motion should support clarity, not compete with it.

Current motion is light and reveal-based. Keep that bias unless explicitly asked otherwise.

When changing motion:
- prefer subtle entrance and emphasis
- preserve performance and readability
- avoid stacking multiple animated effects in the same area
- do not introduce heavy client-side animation architecture unless requested

## Content guidance

Most copy and project information should stay centralized in `src/lib/portfolio-data.ts`.

Prefer this order of operations:
1. update content structures in `src/lib/portfolio-data.ts`
2. surface that content in route/component files
3. only add new fields when they support a real site need

Do not scatter portfolio copy across many components if it can remain data-driven.

## Styling guidance

Before adding new styles, inspect `src/app/globals.css` for existing tokens and reusable classes.

Prefer reusing or extending:
- CSS variables in `:root`
- shared classes like `.panel`, `.panel-strong`, `.chip`, `.button-primary`, `.button-secondary`, `.hero-stage`, `.section-kicker`

Avoid:
- one-off styling systems for a single section
- unnecessary duplication of spacing, radius, or surface treatments
- changing established tokens unless the task requires a broader visual update

## Implementation preferences

- Prefer the smallest clean diff that solves the task.
- Do not refactor unrelated areas.
- Do not add dependencies unless explicitly asked.
- Do not create abstractions for hypothetical future reuse.
- Do not add comments unless the logic is genuinely non-obvious.
- Preserve static-friendly patterns where possible.
- Prefer server components by default; only use client components when interactivity or browser APIs require them.

## Safe evolution strategy

As the project grows, prefer these changes:
- add fields to existing content models before inventing parallel sources of truth
- add reusable sections only when at least two places need the pattern
- keep future-facing features optional and non-blocking
- prepare for richer experiences without forcing them into the current build early

Examples of good growth paths:
- adding social links or contact actions to centralized site content
- adding optional project fields like live URL, gallery items, or testimonials
- adding modular homepage sections that still fit the visual system
- reserving clean integration points for a future Three.js hero or AI guide

## Commands

Common commands:

```bash
npm run dev
npm run lint
npm run build
npm run start
```

Before finishing implementation work when relevant, run:
- `npm run lint`
- `npm run build` for route/layout/rendering-sensitive changes

## Collaboration workflow

Default working pattern for Claude:
1. inspect the relevant files first
2. explain the current structure briefly if helpful
3. propose the smallest clean implementation when the change is non-trivial
4. make focused edits
5. run relevant validation commands when appropriate
6. summarize changed files and any follow-up to consider

For larger requests, break work into tracked tasks.

## What to optimize for

Unless the user says otherwise, optimize for:
- minimal diff
- premium visual consistency
- maintainability
- centralized content management
- future flexibility without premature architecture

## Repo-specific cautions

- The homepage is intentionally shaped around a future hero upgrade. Do not collapse or overfill that visual space casually.
- `src/lib/portfolio-data.ts` is a central content source. Changes there can affect multiple routes.
- `src/components/reveal.tsx` is a shared motion primitive. Changes there can affect motion across the whole site.
- `metadataBase` in `src/app/layout.tsx` currently uses a local placeholder URL. If production metadata work is requested, confirm the real site URL.

## When unsure

If a requested change could reasonably be solved in multiple ways, prefer the option that:
1. keeps content centralized
2. preserves the existing visual language
3. adds the least complexity
4. keeps the path open for future Three.js and richer storytelling work
