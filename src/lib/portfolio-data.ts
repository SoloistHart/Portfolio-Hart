export type Project = {
  slug: string;
  label: string;
  title: string;
  summary: string;
  previewTagline: string;
  year: string;
  client: string;
  category: string;
  impact: string;
  tags: string[];
  deliverables: string[];
  highlights: Array<{
    label: string;
    value: string;
  }>;
  sections: Array<{
    title: string;
    copy: string;
  }>;
  palette: {
    surface: string;
    depth: string;
    glow: string;
    accent: string;
    accentSoft: string;
    line: string;
  };
};

export const siteContent = {
  brand: {
    name: "Hart",
    role: "Creative developer and experience designer",
    availability: "Available for selective brand, product, and launch work",
    location: "Remote base, global collaborations",
  },
  hero: {
    eyebrow: "Motion-led portfolio",
    title: "Designing digital experiences that feel deliberate from the first frame.",
    description:
      "Hart pairs narrative clarity with premium motion, building a portfolio that earns trust now and leaves room for a future Three.js hero when the moment is right.",
    chips: [
      "Narrative-first",
      "Motion with purpose",
      "Three.js-ready hero",
    ],
  },
  stats: [
    {
      label: "Focus",
      value: "Immersive storytelling with calm, credible structure",
    },
    {
      label: "Structure",
      value: "Home experience plus dedicated project narratives",
    },
    {
      label: "Future layer",
      value: "A reserved hero stage for a custom Three.js scene",
    },
    {
      label: "Growth path",
      value: "Ready for AI chat, extra pages, and modular sections",
    },
  ],
  futureModules: [
    {
      title: "A calm premium base today",
      text: "The foundation keeps hierarchy, copy, and case-study storytelling sharp before any heavier visual experiments arrive.",
      label: "Current mode",
    },
    {
      title: "A dedicated Three.js hero tomorrow",
      text: "The homepage already reserves visual real estate for a future interactive scene, so the upgrade feels intentional instead of bolted on.",
      label: "Future scene",
    },
    {
      title: "Modular enough to keep growing",
      text: "New project pages, an AI guide, and extra storytelling sections can slot into the system without forcing a redesign.",
      label: "Scale path",
    },
  ],
  principles: [
    {
      title: "Start with clarity",
      text: "Visitors should understand the point of view before the effects begin.",
    },
    {
      title: "Use motion with intent",
      text: "Movement should sharpen the story, not compete with it.",
    },
    {
      title: "Leave room for evolution",
      text: "The best portfolios can absorb new ideas without collapsing their own identity.",
    },
  ],
  contact: {
    title: "Ready to shape the next version?",
    description:
      "Use this foundation as the launchpad, then refine the copy, replace the placeholder work, and drop in a future Three.js opener when the portfolio story is ready for it.",
    email: "hello@yourdomain.com",
  },
} as const;

export const projects: Project[] = [
  {
    slug: "northstar-platform",
    label: "Data platform reframe",
    title: "Northstar Platform",
    summary:
      "A denser analytics workspace reshaped into a clearer product story, with calmer navigation, stronger pacing, and more confident visual rhythm.",
    previewTagline: "Dense product, lighter story.",
    year: "Current concept",
    client: "Product-led team",
    category: "Narrative UX and interface direction",
    impact: "Turns complexity into a sharper first impression without losing capability.",
    tags: ["Product story", "Interface pacing", "Motion cues"],
    deliverables: [
      "Story-led landing structure",
      "Modular analytics surface",
      "Reusable section system",
      "Future motion blueprint",
    ],
    highlights: [
      { label: "Scope", value: "Narrative, interface, motion" },
      { label: "Mode", value: "Calm premium clarity" },
      { label: "Result", value: "Sharper product positioning" },
    ],
    sections: [
      {
        title: "Challenge",
        copy:
          "The workspace had plenty of depth, but its first impression felt colder and heavier than the product deserved. The goal was to make the experience feel more human without stripping away substance.",
      },
      {
        title: "Response",
        copy:
          "The new direction introduces cleaner rhythm, quieter supporting detail, and motion moments that explain where attention should go next instead of overwhelming the interface.",
      },
      {
        title: "Why it holds up",
        copy:
          "Because the structure is modular, richer dashboards and future interactive layers can arrive later without breaking the main narrative arc.",
      },
    ],
    palette: {
      surface: "#132634",
      depth: "#09131a",
      glow: "rgba(96, 219, 199, 0.42)",
      accent: "#89efe0",
      accentSoft: "rgba(137, 239, 224, 0.18)",
      line: "rgba(240, 248, 255, 0.18)",
    },
  },
  {
    slug: "aster-launch-system",
    label: "Launch site direction",
    title: "Aster Launch System",
    summary:
      "A premium launch story built around tension, release, and sharper hierarchy, giving a growing brand a more mature digital presence.",
    previewTagline: "A launch page with backbone.",
    year: "Current concept",
    client: "Brand and marketing team",
    category: "Brand storytelling and launch UX",
    impact: "Moves the brand from simply polished to memorable and better paced.",
    tags: ["Brand pacing", "Editorial hierarchy", "Launch system"],
    deliverables: [
      "Narrative homepage arc",
      "Editorial component kit",
      "Campaign-ready feature blocks",
      "Premium call-to-action moments",
    ],
    highlights: [
      { label: "Scope", value: "Brand, layout, CTA rhythm" },
      { label: "Mode", value: "Warm futuristic editorial" },
      { label: "Result", value: "More distinct brand posture" },
    ],
    sections: [
      {
        title: "Challenge",
        copy:
          "The team needed a site that felt elevated enough for a major launch but disciplined enough to remain usable long after the announcement cycle ended.",
      },
      {
        title: "Response",
        copy:
          "The concept uses large-format typography, measured spacing, and warmer accent tones to build a stronger sense of point of view without losing conversion clarity.",
      },
      {
        title: "Why it holds up",
        copy:
          "The visual language is expressive, but each section still behaves like part of a reusable system, making later campaign refreshes easier to ship.",
      },
    ],
    palette: {
      surface: "#2c1d1e",
      depth: "#130c10",
      glow: "rgba(223, 164, 114, 0.34)",
      accent: "#f7c290",
      accentSoft: "rgba(247, 194, 144, 0.18)",
      line: "rgba(255, 237, 224, 0.16)",
    },
  },
  {
    slug: "signal-concierge",
    label: "Guided partner journey",
    title: "Signal Concierge",
    summary:
      "A concept for a guided product experience that feels helpful instead of noisy, combining trust-building copy with space for a future AI layer.",
    previewTagline: "Prepared for an AI guide later.",
    year: "Current concept",
    client: "Service and partnerships team",
    category: "Journey design and future AI readiness",
    impact: "Creates a clearer path from curiosity to confidence while keeping the experience modular.",
    tags: ["Guided flow", "Trust signals", "AI-ready structure"],
    deliverables: [
      "Guided inquiry path",
      "Modular conversation prompts",
      "Flexible partner proof blocks",
      "Future chatbot stage mapping",
    ],
    highlights: [
      { label: "Scope", value: "Journey, copy, future AI layer" },
      { label: "Mode", value: "Guided and confident" },
      { label: "Result", value: "Lower-friction first contact" },
    ],
    sections: [
      {
        title: "Challenge",
        copy:
          "Prospective partners needed more context before reaching out, but the experience could not feel like a wall of explanations or a maze of options.",
      },
      {
        title: "Response",
        copy:
          "The structure introduces guided prompts, clearer proof moments, and space for an AI helper later, without making the current version depend on that future feature.",
      },
      {
        title: "Why it holds up",
        copy:
          "The current build already communicates trust and direction, while the architecture leaves room for a smarter assistant to plug in when the product is ready.",
      },
    ],
    palette: {
      surface: "#0f2029",
      depth: "#081116",
      glow: "rgba(101, 212, 191, 0.38)",
      accent: "#8ef1d1",
      accentSoft: "rgba(142, 241, 209, 0.16)",
      line: "rgba(230, 255, 249, 0.16)",
    },
  },
];

export function getProject(slug: string) {
  return projects.find((project) => project.slug === slug);
}
