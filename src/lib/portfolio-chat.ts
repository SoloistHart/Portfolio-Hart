import { projects, siteContent } from "@/lib/portfolio-data";

export type ChatLinkSuggestion = {
  label: string;
  href: string;
};

export type ChatReply = {
  answer: string;
  suggestions: ChatLinkSuggestion[];
};

const baseSuggestions: ChatLinkSuggestion[] = [
  { label: "About", href: "/about" },
  { label: "Project archive", href: "/projects" },
  { label: "Contact", href: "/#contact" },
];

const projectSuggestions = projects.map((project) => ({
  label: project.title,
  href: `/projects/${project.slug}`,
}));

const allowedSuggestions = [...baseSuggestions, ...projectSuggestions];

export function getAllowedSuggestions() {
  return allowedSuggestions;
}

export function buildPortfolioChatContext() {
  const projectDetails = projects
    .map(
      (project) => `- ${project.title} (${project.year})\n  Slug: ${project.slug}\n  Client: ${project.client}\n  Category: ${project.category}\n  Summary: ${project.summary}\n  Impact: ${project.impact}\n  Tags: ${project.tags.join(", ")}\n  Deliverables: ${project.deliverables.join(", ")}`,
    )
    .join("\n\n");

  const skills = siteContent.about.skills
    .map((group) => `${group.category}: ${group.items.join(", ")}`)
    .join("\n");

  const experience = siteContent.about.experience
    .map(
      (item) => `- ${item.role} at ${item.company} (${item.period})\n  ${item.highlights.join(" ")}`,
    )
    .join("\n\n");

  return `Brand\nName: ${siteContent.brand.name}\nRole: ${siteContent.brand.role}\nAvailability: ${siteContent.brand.availability}\nLocation: ${siteContent.brand.location}\n\nHero\n${siteContent.hero.description}\n\nAbout\nHeadline: ${siteContent.about.headline}\nSummary: ${siteContent.about.summary}\n\nSkills\n${skills}\n\nExperience\n${experience}\n\nContact\nEmail: ${siteContent.contact.email}\n\nSocials\n${siteContent.socials.map((social) => `${social.label}: ${social.href}`).join("\n")}\n\nProjects\n${projectDetails}`;
}

function normalizedText(value: string) {
  return value.toLowerCase();
}

function includesAny(value: string, terms: string[]) {
  return terms.some((term) => value.includes(term));
}

export function findSuggestedLinks(message: string) {
  const text = normalizedText(message);

  if (includesAny(text, ["dashboard", "analytics", "qa", "behavior", "coaching"])) {
    return allowedSuggestions.filter((item) =>
      ["/projects/qa-behavioral-analytics", "/projects/qa-productivity-dashboard", "/projects"].includes(item.href),
    );
  }

  if (includesAny(text, ["automation", "workflow", "n8n", "content pipeline"])) {
    return allowedSuggestions.filter((item) =>
      ["/projects/n8n-automation-workflows", "/projects", "/#contact"].includes(item.href),
    );
  }

  if (includesAny(text, ["experience", "background", "about", "education", "skills"])) {
    return allowedSuggestions.filter((item) =>
      ["/about", "/projects", "/#contact"].includes(item.href),
    );
  }

  if (includesAny(text, ["contact", "hire", "available", "freelance", "remote"])) {
    return allowedSuggestions.filter((item) =>
      ["/#contact", "/about", "/projects"].includes(item.href),
    );
  }

  return baseSuggestions;
}

export function buildLocalChatReply(message: string): ChatReply {
  const text = normalizedText(message);

  if (includesAny(text, ["kind of developer", "who is", "what kind", "strength"])) {
    return {
      answer: `${siteContent.brand.name} is a ${siteContent.brand.role.toLowerCase()}. His work centers on AI-integrated dashboards, internal tools, automation pipelines, and data storytelling, with production experience across frontend, backend integration, and analytics systems.`,
      suggestions: findSuggestedLinks(message),
    };
  }

  if (includesAny(text, ["dashboard", "analytics", "data", "reporting"])) {
    return {
      answer: `${siteContent.brand.name} has shipped executive dashboards, QA analytics tools, KPI reporting interfaces, and behavioral analytics systems. The strongest examples are QA AI: Behavioral Analytics for agent-level coaching insights and QA AI: Overall Productivity for leadership-facing reporting.`,
      suggestions: findSuggestedLinks(message),
    };
  }

  if (includesAny(text, ["ai", "integration", "chatbot", "llm", "prompt"])) {
    return {
      answer: `The portfolio is strongest where AI is tied to real workflows rather than generic chat. That includes AI-powered coaching insights, PII-safe data pipelines, prompt workflows, and automation systems that turn raw data or repetitive work into usable outputs for teams.`,
      suggestions: findSuggestedLinks(message),
    };
  }

  if (includesAny(text, ["automation", "workflow", "n8n"])) {
    return {
      answer: `${siteContent.brand.name} has built 30+ n8n workflows, including multi-step content production pipelines and repeatable automations across multiple accounts and platforms. The automation archive project is the clearest public example of that work.`,
      suggestions: findSuggestedLinks(message),
    };
  }

  if (includesAny(text, ["team like ours", "what can he build", "services", "hire", "help build"])) {
    return {
      answer: `${siteContent.brand.name} is a strong fit for teams that need internal dashboards, AI-assisted reporting, workflow automation, system integrations, or fast prototyping in Next.js and TypeScript. If your team has messy data, repetitive operations, or an AI idea that needs to become a usable product, that aligns well with the portfolio.`,
      suggestions: findSuggestedLinks(message),
    };
  }

  if (includesAny(text, ["contact", "email", "available", "remote"])) {
    return {
      answer: `${siteContent.brand.name} is ${siteContent.brand.availability.toLowerCase()} and is based in ${siteContent.brand.location}. The best next step is to use the contact section or email ${siteContent.contact.email}.`,
      suggestions: findSuggestedLinks(message),
    };
  }

  return {
    answer: `I can help with questions about ${siteContent.brand.name}'s projects, AI integrations, dashboards, automation work, background, and availability. Try asking about a specific project, the kind of systems he builds, or what experience he has with AI and analytics.`,
    suggestions: findSuggestedLinks(message),
  };
}
