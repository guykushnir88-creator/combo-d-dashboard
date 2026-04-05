"use client";

import { useState, useRef } from "react";
import { Pipeline } from "./Pipeline";
import { ProjectTabs } from "./ProjectTabs";
import { AssessmentViewer } from "./AssessmentViewer";

interface Agent {
  id: number;
  name: string;
  phase: string;
  runTime: string | null;
  docsProduced: number;
  gate: string;
  gateColor: string;
  summary: string;
  documents: { id: string; title: string; subtitle: string; content?: string }[];
}

interface Props {
  project: {
    runTime: string;
    docsProduced: number;
    kbEntries: number;
    verdict: string;
    verdictScore: number | null;
    verdictGrade: string | null;
  };
  agents: Agent[];
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  knowledgeBase: any[];
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  governance: any[];
  assessment: {
    overallScore: number;
    overallLevel: string;
    dimensions: { name: string; score: number; level: string; recommendation: string }[];
    configRecommendation: Record<string, boolean | string>;
  } | null;
}

export function ProjectOverviewClient({ project, agents, knowledgeBase, governance, assessment }: Props) {
  const [activeSection, setActiveSection] = useState<"pipeline" | "assessment">(
    "pipeline"
  );
  const tabsRef = useRef<{ switchToDocsAgent: (id: number) => void } | null>(null);

  function handleViewDocs(agentId: number) {
    tabsRef.current?.switchToDocsAgent(agentId);
  }

  return (
    <>
      {/* Section toggle if assessment exists */}
      {assessment && (
        <div className="flex gap-1 bg-ice rounded-xl p-1 mb-6">
          <button
            onClick={() => setActiveSection("pipeline")}
            className={`flex-1 px-4 py-2.5 rounded-lg text-sm font-medium transition-colors ${
              activeSection === "pipeline"
                ? "bg-card text-navy shadow-sm"
                : "text-muted hover:text-navy"
            }`}
          >
            Pipeline & Results
          </button>
          <button
            onClick={() => setActiveSection("assessment")}
            className={`flex-1 px-4 py-2.5 rounded-lg text-sm font-medium transition-colors ${
              activeSection === "assessment"
                ? "bg-card text-navy shadow-sm"
                : "text-muted hover:text-navy"
            }`}
          >
            Assessment
            <span className="ml-1.5 text-xs opacity-60">
              ({assessment.overallScore}/5)
            </span>
          </button>
        </div>
      )}

      {activeSection === "pipeline" && (
        <>
          <Pipeline
            agents={agents}
            project={project}
            onViewDocs={handleViewDocs}
          />
          <ProjectTabs
            ref={tabsRef}
            agents={agents}
            knowledgeBase={knowledgeBase}
            governance={governance}
          />
        </>
      )}

      {activeSection === "assessment" && assessment && (
        <AssessmentViewer assessment={assessment} />
      )}
    </>
  );
}
