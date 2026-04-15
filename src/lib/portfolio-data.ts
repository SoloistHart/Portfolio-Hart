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
    name: "Rhohart Martel",
    profileImage: "/grad-pic.jpg",
    role: "AI Engineer — workflow automation, intelligent tools, and business process systems",
    shortRole: "AI Engineer & Automation",
    availability: "Available for freelance projects and client engagements",
    location: "Manila, Philippines — open to remote work globally",
  },
  hero: {
    eyebrow: "AI Engineer & Automation Specialist",
    title: "I help businesses integrate AI and automate workflows that scale.",
    description:
      "AI Engineer who builds n8n automation pipelines, AI-powered dashboards, and intelligent business tools — turning manual processes into systems that run themselves.",
    chips: [
      "n8n workflow automation",
      "AI integrations",
      "Business process automation",
      "Intelligent dashboards",
      "End-to-end execution",
    ],
  },
  chatbot: {
    label: "Ask about my work",
    title: "Portfolio AI guide",
    description:
      "Ask about my AI integrations, n8n automations, dashboards, and how I can help your business.",
    starterPrompts: [
      "What kind of AI engineer is Rhohart?",
      "How can he automate my business workflows?",
      "Which project best shows AI integration?",
      "What n8n automations has he built?",
    ],
  },
  stats: [
    {
      label: "AI & Automation",
      value: "n8n workflows, OpenAI, Claude, Gemini — 30+ automations built and deployed",
    },
    {
      label: "Stack",
      value: "React, Next.js, Node.js, TypeScript, PostgreSQL, Prisma",
    },
    {
      label: "Impact",
      value: "50% collection rate improvement on a deployed analytics campaign",
    },
    {
      label: "Education",
      value: "BS Information Technology, Data Science — Cum Laude",
    },
  ],
  futureModules: [
    {
      title: "AI integration for your business",
      text: "From AI-powered dashboards to intelligent chatbots and agent workflows — I build AI tools that fit your existing operations and solve real problems.",
      label: "AI solutions",
    },
    {
      title: "n8n workflow automation",
      text: "30+ n8n workflows built and deployed. I automate content pipelines, data processing, multi-platform publishing, and operational workflows that eliminate manual effort.",
      label: "Automation",
    },
    {
      title: "Intelligent dashboards & reporting",
      text: "Executive-facing analytics, behavioral insights, and KPI systems that turn your raw data into actionable business intelligence.",
      label: "Data tools",
    },
  ],
  principles: [
    {
      title: "AI should solve real business problems",
      text: "Not AI for its own sake — integrations that reduce manual effort, improve accuracy, and create value your team can measure.",
    },
    {
      title: "Automation should free your team",
      text: "Every workflow I build is designed to eliminate repetitive tasks so your team can focus on work that actually moves the needle.",
    },
    {
      title: "Systems should scale with you",
      text: "From n8n pipelines to dashboard architecture, everything is built modular — ready to grow without needing a rebuild.",
    },
  ],
  contact: {
    title: "Let's automate and build smarter.",
    description:
      "Whether it's an AI integration, n8n automation pipeline, or an intelligent dashboard — I'm ready to help your business work faster and scale further.",
    email: "martel.rhohart@gmail.com",
  },
  socials: [
    { label: "GitHub", href: "https://github.com/SoloistHart" },
    { label: "LinkedIn", href: "https://www.linkedin.com/in/rhohart-martel-4798ab307" },
  ],
  about: {
    headline: "Rhohart Martel",
    summary:
      "AI Engineer and workflow automation specialist who helps businesses integrate AI and automate operations. I build n8n automation pipelines, AI-powered dashboards, and intelligent business tools — turning manual processes into scalable systems that deliver measurable results.",
    education: {
      degree: "BS Information Technology, Major in Data Science",
      school: "Universidad De Manila",
      graduationDate: "Jul 2025",
      honors: "Cum Laude",
    },
    skills: [
      { category: "AI & Automation", items: ["n8n Workflow Design", "OpenAI", "Claude", "Gemini", "Prompt Engineering", "AI Agent Development", "Workflow Orchestration"] },
      { category: "Business Process", items: ["Process Optimization", "Workflow Design", "Operational Efficiency", "System Integration"] },
      { category: "Frontend", items: ["React", "Next.js", "Tailwind CSS", "Responsive UI"] },
      { category: "Backend", items: ["Node.js", "REST APIs", "Prisma", "TypeScript"] },
      { category: "Databases", items: ["PostgreSQL", "MySQL", "MariaDB"] },
      { category: "Analytics & Tools", items: ["Dashboard Development", "Behavioral Analytics", "KPI Reporting", "Data Visualization", "Git", "GitHub", "VS Code"] },
    ],
    experience: [
      {
        role: "Freelance AI & Automation Engineer",
        company: "Self-Employed",
        period: "Nov 2025 – Present",
        highlights: [
          "Built 30+ personalized n8n automation workflows for clients across multiple accounts and platforms.",
          "Automated short-form content production pipelines including AI-powered script generation, image creation, and video assembly.",
          "Designed modular workflow architectures that scale with new content formats, platforms, and AI tools.",
        ],
      },
      {
        role: "Full Stack Developer — AI Integrations",
        company: "S.P. Madrid & Associates",
        period: "Dec 2025 – Present",
        highlights: [
          "Build AI-integrated dashboards and reporting systems that transform QA and operational data into executive-ready insights.",
          "Develop AI-powered tools for behavioral analytics, coaching support, and productivity monitoring.",
          "Create data visualizations and reporting interfaces for performance trends and business-critical metrics.",
          "Guide intern contributors on AI-related projects including OpenClaw and LarkChat integrations.",
        ],
      },
      {
        role: "AI Media / Prompt Engineer",
        company: "S.P. Madrid & Associates",
        period: "Oct 2025 – Dec 2025",
        highlights: [
          "Created AI-powered media assets and character workflows for Okpo.com.",
          "Designed prompt workflows and AI agent behavior for lead generation use cases.",
          "Evaluated and selected text, image, voice, and video AI tools for business fit.",
        ],
      },
      {
        role: "Data Analyst",
        company: "S.P. Madrid & Associates",
        period: "Jul 2025 – Oct 2025",
        highlights: [
          "Converted existing company data into clearer reporting outputs and operational insights.",
          "Helped structure data used in later dashboarding and QA performance analysis initiatives.",
        ],
      },
    ],
  },
} as const;

export const projects: Project[] = [
  {
    slug: "qa-behavioral-analytics",
    label: "AI-powered QA analytics",
    title: "QA AI: Behavioral Analytics",
    summary:
      "A behavioral analytics dashboard that turns uploaded call datasets into agent-level KPIs, coaching insights, and AI-powered performance analysis — with PII redaction baked in.",
    previewTagline: "Call data into coaching insights.",
    year: "2025–2026",
    client: "S.P. Madrid & Associates",
    category: "Full stack dashboard with AI integration",
    impact: "Helped improve collection rate by 50% in one deployed campaign while supporting script-adherence analysis for agent coaching.",
    tags: ["React", "Node.js", "PostgreSQL", "Recharts", "AI coaching"],
    deliverables: [
      "Agent-level KPI dashboard with drilldowns",
      "Filtered data exports and CSV/XLSX import",
      "AI-powered coaching insight workflows",
      "PII redaction pipeline before AI processing",
    ],
    highlights: [
      { label: "Stack", value: "React, Vite, Node.js, PostgreSQL" },
      { label: "AI layer", value: "Coaching insights with PII safety" },
      { label: "Result", value: "50% collection rate improvement" },
    ],
    sections: [
      {
        title: "Challenge",
        copy:
          "QA teams had raw call datasets in CSV and XLSX format but no structured way to surface agent behavior patterns, identify coaching opportunities, or track performance over time.",
      },
      {
        title: "Response",
        copy:
          "Built a full analytics dashboard with agent-level KPI views, drilldown filters, and AI-powered coaching workflows. Added PII redaction and context validation before any data reached external AI services.",
      },
      {
        title: "Why it holds up",
        copy:
          "The modular architecture handles new data sources and metric types without structural changes, and the PII-safe pipeline keeps the system production-ready as AI capabilities expand.",
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
    slug: "qa-productivity-dashboard",
    label: "Executive productivity reporting",
    title: "QA AI: Overall Productivity",
    summary:
      "An executive-facing productivity dashboard that translates internal QA audit data into actionable metrics, trend analysis, and team-level performance tracking for C-level stakeholders.",
    previewTagline: "Raw audits into executive clarity.",
    year: "2025–2026",
    client: "S.P. Madrid & Associates",
    category: "Full stack dashboard with data visualization",
    impact: "Improved visibility into QA system performance by translating raw database records into business-readable insights used across leadership and operations.",
    tags: ["Next.js", "TypeScript", "Prisma", "MariaDB", "Data viz"],
    deliverables: [
      "Executive overview metrics and KPI cards",
      "Trend analysis with weekly and monthly tracking",
      "Filtered breakdowns and ranking views",
      "Role-based data access for C-level and team leads",
    ],
    highlights: [
      { label: "Stack", value: "Next.js, TypeScript, Prisma, MariaDB" },
      { label: "Audience", value: "C-level and operations teams" },
      { label: "Result", value: "Business-readable QA insights" },
    ],
    sections: [
      {
        title: "Challenge",
        copy:
          "Internal QA audit data lived in raw database records with no structured reporting layer. Leadership needed actionable visibility into team performance without digging through spreadsheets.",
      },
      {
        title: "Response",
        copy:
          "Built an executive-facing dashboard with overview metrics, trend analysis, filtered breakdowns, and ranking views — turning operational data into reports that stakeholders could act on immediately.",
      },
      {
        title: "Why it holds up",
        copy:
          "The Prisma-backed data layer and modular report components mean new metrics and breakdowns can be added without rearchitecting the system. The dashboard scales with the team.",
      },
    ],
    palette: {
      surface: "#1a1a2e",
      depth: "#0d0d1a",
      glow: "rgba(130, 120, 230, 0.36)",
      accent: "#a8a0f0",
      accentSoft: "rgba(168, 160, 240, 0.18)",
      line: "rgba(220, 216, 255, 0.16)",
    },
  },
  {
    slug: "n8n-automation-workflows",
    label: "Content automation at scale",
    title: "n8n Automation Workflows",
    summary:
      "30+ personalized automation workflows for a single client, automating short-form content production from script generation through video creation and multi-platform publishing.",
    previewTagline: "Manual pipelines, fully automated.",
    year: "2025–present",
    client: "Freelance client",
    category: "Workflow automation and orchestration",
    impact: "Reduced manual content creation effort by systemizing repeatable multi-step processes into reusable automation flows across multiple accounts and platforms.",
    tags: ["n8n", "Automation", "AI pipelines", "Content ops", "Multi-platform"],
    deliverables: [
      "30+ custom n8n automation workflows",
      "Script generation and AI content pipelines",
      "Image and video production automation",
      "Cross-platform publishing orchestration",
    ],
    highlights: [
      { label: "Scale", value: "30+ workflows, multiple platforms" },
      { label: "Pipeline", value: "Script → image → video → publish" },
      { label: "Result", value: "Fully automated content ops" },
    ],
    sections: [
      {
        title: "Challenge",
        copy:
          "The client was creating short-form content manually across multiple accounts and platforms — each piece requiring scripting, image sourcing, video editing, and platform-specific publishing steps.",
      },
      {
        title: "Response",
        copy:
          "Designed and built 30+ n8n workflows covering the full production pipeline: AI-powered script generation, automated image creation, video assembly, and orchestrated multi-platform distribution.",
      },
      {
        title: "Why it holds up",
        copy:
          "Each workflow is modular and reusable. New content formats, platforms, or AI tools can be plugged into the existing pipeline without rebuilding the automation from scratch.",
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
];

export function getProject(slug: string) {
  return projects.find((project) => project.slug === slug);
}
