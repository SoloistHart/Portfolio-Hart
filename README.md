## Hart Portfolio Base

This project is a polished personal portfolio foundation built with Next.js, Tailwind CSS, and a future Three.js hero in mind.

## Highlights

- Premium homepage with a dedicated hero stage reserved for a future 3D scene
- Project archive plus individual project pages
- Central content file for fast copy and project edits
- Motion-ready structure that can grow into richer interactions later

## Getting started

Install dependencies and run the development server:

```bash
npm install
npm run dev
```

Open [http://localhost:3000](http://localhost:3000).

## Key files

- `src/lib/portfolio-data.ts` - main content and project data
- `src/app/page.tsx` - homepage layout
- `src/app/projects/page.tsx` - project archive
- `src/app/projects/[slug]/page.tsx` - project detail pages
- `src/components/project-card.tsx` - reusable project preview cards

## Commands

```bash
npm run dev
npm run lint
npm run build
npm run start
```

## Editing the content

Start by updating the text, contact info, and project entries in `src/lib/portfolio-data.ts`.

When you are ready for the next phase, the homepage hero is already structured so a custom Three.js scene can replace the current visual stage without changing the overall layout.

## Deployment

Deploy with any standard Next.js host such as Vercel.
