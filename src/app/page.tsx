import Link from "next/link";
import { getProjects } from "@/lib/data";
import { StatusBadge, VerdictBadge } from "@/components/StatusBadge";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Projects — Combo D Dashboard",
  description: "PM Agent Chain analysis results dashboard",
  openGraph: {
    title: "Combo D — PM Agent Chain Dashboard",
    description: "Client-facing viewer for PM Agent Chain results",
  },
};

export default async function HomePage() {
  const projects = await getProjects();

  return (
    <div className="max-w-6xl mx-auto">
      <div className="mb-8">
        <h1 className="font-[family-name:var(--font-heading)] text-3xl text-navy">
          Projects
        </h1>
        <p className="text-muted mt-1">PM Agent Chain analysis results</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
        {projects.map((project: {
          id: string;
          name: string;
          client: string;
          status: string;
          verdict: string;
          verdictScore: number | null;
          docsProduced: number;
          kbEntries: number;
          lastRun: string;
          agents: { completed: number; total: number };
          runTime: string;
        }) => (
          <Link
            key={project.id}
            href={`/project/${project.id}`}
            className="bg-card rounded-xl border border-border p-6 hover:shadow-lg hover:border-coral/30 transition-all group"
          >
            <div className="flex items-start justify-between mb-4">
              <div className="flex-1 min-w-0">
                <h2 className="font-semibold text-navy text-lg truncate group-hover:text-coral transition-colors">
                  {project.name}
                </h2>
                <p className="text-sm text-muted">{project.client}</p>
              </div>
            </div>

            <div className="flex flex-wrap gap-2 mb-4">
              <StatusBadge status={project.status} />
              <VerdictBadge verdict={project.verdict} />
            </div>

            {project.verdictScore !== null && (
              <div className="mb-4">
                <div className="flex justify-between text-xs text-muted mb-1">
                  <span>Score</span>
                  <span>{project.verdictScore}%</span>
                </div>
                <div className="h-2 bg-ice rounded-full overflow-hidden">
                  <div
                    className={`h-full rounded-full ${
                      project.verdictScore >= 80 ? "bg-green" : project.verdictScore >= 60 ? "bg-amber" : "bg-red"
                    }`}
                    style={{ width: `${project.verdictScore}%` }}
                  />
                </div>
              </div>
            )}

            <div className="grid grid-cols-3 gap-3 text-center pt-4 border-t border-border">
              <div>
                <p className="text-lg font-semibold text-navy">{project.agents.completed}/{project.agents.total}</p>
                <p className="text-xs text-muted">Agents</p>
              </div>
              <div>
                <p className="text-lg font-semibold text-navy">{project.docsProduced}</p>
                <p className="text-xs text-muted">Docs</p>
              </div>
              <div>
                <p className="text-lg font-semibold text-navy">{project.kbEntries}</p>
                <p className="text-xs text-muted">KB</p>
              </div>
            </div>

            <div className="flex justify-between items-center mt-4 pt-3 border-t border-border text-xs text-muted">
              <span>{project.runTime}</span>
              <span>Last run: {project.lastRun}</span>
            </div>
          </Link>
        ))}

        {/* New Project card (disabled) */}
        <div
          className="bg-card rounded-xl border-2 border-dashed border-border p-6 flex flex-col items-center justify-center text-muted cursor-not-allowed min-h-[280px]"
          title="Coming soon — run PM Agent Chain to create a new project"
        >
          <svg width="48" height="48" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5} className="text-border mb-3">
            <path strokeLinecap="round" strokeLinejoin="round" d="M12 4v16m8-8H4" />
          </svg>
          <p className="font-medium">New Project</p>
          <p className="text-xs mt-1">Coming soon</p>
        </div>
      </div>
    </div>
  );
}
