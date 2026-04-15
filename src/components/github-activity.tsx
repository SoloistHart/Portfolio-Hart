import { ArrowUpRight } from "lucide-react";
import { Reveal } from "./reveal";

type GitHubUser = {
  public_repos: number;
  total_private_repos: number;
  followers: number;
};

async function fetchGitHub(): Promise<GitHubUser | null> {
  const token = process.env.GITHUB_TOKEN;
  try {
    // Authenticated /user endpoint returns private repo count
    const url = token
      ? "https://api.github.com/user"
      : "https://api.github.com/users/SoloistHart";

    const headers: Record<string, string> = {
      Accept: "application/vnd.github+json",
    };
    if (token) headers.Authorization = `Bearer ${token}`;

    const res = await fetch(url, {
      next: { revalidate: 3600 },
      headers,
    });
    if (!res.ok) return null;
    return res.json();
  } catch {
    return null;
  }
}

type GitHubActivityProps = {
  username: string;
};

export async function GitHubActivity({ username }: GitHubActivityProps) {
  const user = await fetchGitHub();

  if (!user) return null;

  const privateRepos = user.total_private_repos ?? 0;
  const totalRepos = user.public_repos + privateRepos;

  return (
    <section className="page-shell pt-24 sm:pt-28">
      <Reveal>
        <div className="flex flex-col gap-6 lg:flex-row lg:items-end lg:justify-between">
          <div>
            <p className="section-kicker">Open source</p>
            <h2 className="mt-5 text-4xl font-semibold tracking-[-0.06em] text-foreground sm:text-5xl">
              Always building.
            </h2>
          </div>
          <a
            href={`https://github.com/${username}`}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-2 text-sm font-semibold text-foreground hover:text-accent"
          >
            View GitHub profile
            <ArrowUpRight className="h-4 w-4" />
          </a>
        </div>
      </Reveal>

      <Reveal delay={0.08}>
        <div className="mt-10 panel rounded-[1.7rem] overflow-hidden p-5 sm:p-6">
          <div className="overflow-x-auto">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src={`https://ghchart.rshah.org/2f8f86/${username}`}
              alt={`${username}'s GitHub contribution chart`}
              className="contribution-chart mx-auto w-full min-w-[680px]"
              loading="lazy"
            />
          </div>
        </div>
      </Reveal>

      <Reveal delay={0.14}>
        <div className="mt-6 flex flex-wrap gap-x-8 gap-y-3">
          <p className="text-sm text-muted">
            <span className="font-semibold text-foreground">{totalRepos}</span>{" "}
            total repositories
          </p>
          {privateRepos > 0 && (
            <p className="text-sm text-muted">
              <span className="font-semibold text-foreground">{privateRepos}</span>{" "}
              private / org repos
            </p>
          )}
          <p className="text-sm text-muted">
            <span className="font-semibold text-foreground">{user.public_repos}</span>{" "}
            public repos
          </p>
          <p className="text-sm text-muted">
            <span className="font-semibold text-foreground">{user.followers}</span>{" "}
            followers
          </p>
        </div>
      </Reveal>
    </section>
  );
}
