import { notFound } from "next/navigation";
import { getProject, getAgents, getKnowledgeBase, getGovernance, getAssessment } from "@/lib/data";
import { VerdictBadge } from "@/components/StatusBadge";
import { Breadcrumb } from "@/components/Breadcrumb";
import { ProjectOverviewClient } from "@/components/ProjectOverviewClient";

interface PageProps {
  params: Promise<{ id: string }>;
}

export async function generateMetadata({ params }: PageProps) {
  const { id } = await params;
  const project = await getProject(id);
  if (!project) return { title: "Not Found" };
  return {
    title: `${project.name} — Combo D`,
    description: `PM Agent Chain results for ${project.name}. Verdict: ${project.verdict}`,
    openGraph: {
      title: `${project.name} ��� PM Agent Chain`,
      description: `${project.verdict} — ${project.docsProduced} documents, ${project.kbEntries} KB entries`,
    },
  };
}

export default async function ProjectPage({ params }: PageProps) {
  const { id } = await params;
  const [project, agents, knowledgeBase, governance, assessment] = await Promise.all([
    getProject(id),
    getAgents(id),
    getKnowledgeBase(id),
    getGovernance(id),
    getAssessment(id),
  ]);

  if (!project) notFound();

  return (
    <div className="max-w-6xl mx-auto">
      <Breadcrumb
        items={[
          { label: "Projects", href: "/" },
          { label: project.name },
        ]}
      />

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

      <ProjectOverviewClient
        project={project}
        agents={agents}
        knowledgeBase={knowledgeBase}
        governance={governance}
        assessment={assessment}
      />
    </div>
  );
}
