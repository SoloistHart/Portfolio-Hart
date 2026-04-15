# Portfolio-Hart — Repo Memory

## Last reviewed: 2026-04-15

## Project state
- Build: ✅ passes (Next.js 16.2.1 Turbopack)
- All 10 routes generate: 7 static, 3 SSG (`/projects/[slug]`), 1 dynamic (`/api/chat`)
- Deploy target: unknown — `metadataBase` still points to `https://portfolio-hart.local`

## Known issues

### Lint errors (17 errors, 2 warnings)

**reveal.tsx:33** — reads `hasPlayed.current` ref during render. React 19 strict rules forbid this.

**theme-toggle.tsx:25** — `setState` (setTheme) called synchronously inside useEffect. Cascading render.

**hero-hologram.tsx:189** — `Math.random()` during render (impure function). Move to useMemo or useRef init.

**hero-hologram.tsx:249-260+** — mutating useMemo uniform values inside useFrame. Standard R3F pattern but flagged by React 19 rules. Consider using useRef for uniforms or eslint-disable for R3F-specific code.

**cursor-trail.tsx:96** — `glCtx` should be `const` not `let`.

**cursor-trail.tsx:185** — unused eslint-disable directive.

### Metadata mismatch
- `layout.tsx` title says "Full Stack Developer"
- `portfolio-data.ts` hero/brand says "AI Engineer & Automation Specialist"
- These should be aligned for SEO consistency

### Missing SEO files
- No `robots.txt` in public/
- No `sitemap.xml` generated or static
- No OG images

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
