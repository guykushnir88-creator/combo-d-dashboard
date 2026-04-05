import { notFound } from "next/navigation";
import { getProject, getAgents, getKnowledgeBase, getGovernance } from "@/lib/data";
import { GateBadge, VerdictBadge } from "@/components/StatusBadge";
import { ProjectTabs } from "@/components/ProjectTabs";

interface PageProps {
  params: Promise<{ id: string }>;
}

export default async function ProjectPage({ params }: PageProps) {
  const { id } = await params;
  const [project, agents, knowledgeBase, governance] = await Promise.all([
    getProject(id),
    getAgents(id),
    getKnowledgeBase(id),
    getGovernance(id),
  ]);

  if (!project) notFound();

  return (
    <div className="max-w-6xl mx-auto">
      {/* Header */}
      <div className="bg-card rounded-xl border border-border p-6 mb-6">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <div>
            <h1 className="font-[family-name:var(--font-heading)] text-2xl sm:text-3xl text-navy">
              {project.name}
            </h1>
            <p className="text-muted mt-1">{project.client}</p>
          </div>
          <div className="flex flex-wrap items-center gap-3">
            <VerdictBadge verdict={project.verdict} />
            {project.verdictScore !== null && (
              <span className="text-sm font-semibold text-navy">
                {project.verdictScore}%
              </span>
            )}
            <span className="text-sm text-muted">{project.runTime}</span>
          </div>
        </div>
      </div>

      {/* Agent Pipeline */}
      <div className="mb-6">
        <h2 className="font-semibold text-navy mb-3 text-sm uppercase tracking-wider">
          Agent Pipeline
        </h2>
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3">
          {agents.map((agent: {
            id: number;
            name: string;
            phase: string;
            runTime: string;
            gate: string;
            gateColor: string;
            docsProduced: number;
          }) => (
            <a
              key={agent.id}
              href={`#agent-${agent.id}`}
              className="bg-card rounded-xl border border-border p-4 hover:shadow-md hover:border-blue/30 transition-all"
            >
              <div className="flex items-center gap-2 mb-2">
                <span className="w-7 h-7 rounded-lg bg-navy text-white text-xs font-bold flex items-center justify-center">
                  {agent.id}
                </span>
                <span className="text-sm font-semibold text-navy truncate">
                  {agent.name}
                </span>
              </div>
              <p className="text-xs text-muted mb-3">{agent.phase}</p>
              <GateBadge gate={agent.gate} color={agent.gateColor} />
              <div className="flex justify-between text-xs text-muted mt-3 pt-2 border-t border-border">
                <span>{agent.runTime}</span>
                <span>{agent.docsProduced} docs</span>
              </div>
            </a>
          ))}
        </div>
      </div>

      {/* Connecting line visual between pipeline cards */}
      <div className="hidden lg:flex items-center justify-center -mt-4 mb-4 px-8">
        <div className="flex-1 h-0.5 bg-border rounded-full" />
      </div>

      {/* Tabbed Content */}
      <ProjectTabs
        agents={agents}
        knowledgeBase={knowledgeBase}
        governance={governance}
      />
    </div>
  );
}
