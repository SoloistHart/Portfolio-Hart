# Portfolio-Hart — Repo Memory

## Last reviewed: 2026-04-15

## Project state
- Build: ✅ passes (Next.js 16.2.1 Turbopack)
- All 11 routes generate: 7 static, 3 SSG (`/projects/[slug]`), 1 dynamic (`/api/chat`), 1 sitemap
- Deployed: https://portfolio-hart.vercel.app (auto-deploys on push)
- Lint: ✅ 0 errors, 0 warnings
- SEO: robots.txt, sitemap.xml, aligned metadata

## Resolved issues (session 2026-04-15)
- 17 lint errors → 0 (React 19 strict mode fixes, R3F eslint-disable where needed)
- Metadata aligned: title, description match AI Engineer branding
- robots.txt and sitemap.ts added
- Header shortRole field added (concise brand pill)
- prefers-reduced-motion: reveal.tsx, template.tsx, scroll-progress.tsx, cursor-trail.tsx
- cursor-trail.tsx: desktop-only (pointer: fine + hover: hover)
- contact-form.tsx: role="alert" on error messages
- portfolio-chat.tsx: animated typing dots indicator (replaces plain text)

## Known remaining items
- No OG images (social sharing cards)
- metadataBase uses Vercel URL — update if custom domain added

## Architecture notes
- Content centralized in `src/lib/portfolio-data.ts` — changes there affect all routes
- `reveal.tsx` is the shared motion primitive — changes affect all animated sections
- Three.js hero (`hero-hologram.tsx`) uses custom GLSL shaders — treat carefully
- `cursor-trail.tsx` is a WebGL fluid simulation (SplashCursor) — heavy client component
- Chat system: Gemini API with local fallback in `portfolio-chat.ts`, API route at `/api/chat`
- Contact form uses Web3Forms with honeypot + time-based anti-spam

## Key dependencies
- next: 16.2.1
- react: 19.2.4
- @react-three/fiber: ^9.5.0
- @react-three/drei: ^10.7.7
- three: ^0.183.2
- framer-motion: ^12.38.0
- tailwindcss: ^4

## Working principles (Karpathy-aligned)
1. Think before coding — surface assumptions, present tradeoffs
2. Simplicity first — minimum code that solves the problem
3. Surgical changes — touch only what's requested, clean up only your own mess
4. Goal-driven execution — define success criteria, verify before marking done
