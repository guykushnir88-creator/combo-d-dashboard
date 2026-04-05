"use client";

import { useState } from "react";
import { GateBadge } from "./StatusBadge";

interface Agent {
  id: number;
  name: string;
  phase: string;
  runTime: string;
  docsProduced: number;
  gate: string;
  gateColor: string;
  summary: string;
  documents: { id: string; title: string; subtitle: string }[];
}

interface KBEntry {
  id: string;
  cluster: string;
  title: string;
  severity: string;
  pattern: string;
  insight: string;
  source: string;
  tags: string[];
  actionable: boolean;
}

interface GovernanceItem {
  id: string;
  title: string;
  status: string;
  owner: string;
  deadline: string;
  impact: string;
  relatedDefects: string[];
  evidence: string | null;
}

const tabs = ["Documents", "Knowledge Base", "Governance"] as const;
type Tab = (typeof tabs)[number];

export function ProjectTabs({
  agents,
  knowledgeBase,
  governance,
}: {
  agents: Agent[];
  knowledgeBase: KBEntry[];
  governance: GovernanceItem[];
}) {
  const [activeTab, setActiveTab] = useState<Tab>("Documents");
  const [expandedAgent, setExpandedAgent] = useState<number | null>(1);
  const [clusterFilter, setClusterFilter] = useState<string | null>(null);

  const clusters = [...new Set(knowledgeBase.map((e) => e.cluster))];
  const filteredKB = clusterFilter
    ? knowledgeBase.filter((e) => e.cluster === clusterFilter)
    : knowledgeBase;

  return (
    <div>
      {/* Tab bar */}
      <div className="flex gap-1 bg-ice rounded-xl p-1 mb-6">
        {tabs.map((tab) => (
          <button
            key={tab}
            onClick={() => setActiveTab(tab)}
            className={`flex-1 px-4 py-2.5 rounded-lg text-sm font-medium transition-colors ${
              activeTab === tab
                ? "bg-card text-navy shadow-sm"
                : "text-muted hover:text-navy"
            }`}
          >
            {tab}
            {tab === "Knowledge Base" && (
              <span className="ml-1.5 text-xs opacity-60">({knowledgeBase.length})</span>
            )}
            {tab === "Governance" && (
              <span className="ml-1.5 text-xs opacity-60">({governance.length})</span>
            )}
          </button>
        ))}
      </div>

      {/* Documents Tab */}
      {activeTab === "Documents" && (
        <div className="space-y-3">
          {agents.map((agent) => (
            <div
              key={agent.id}
              id={`agent-${agent.id}`}
              className="bg-card rounded-xl border border-border overflow-hidden"
            >
              <button
                onClick={() =>
                  setExpandedAgent(expandedAgent === agent.id ? null : agent.id)
                }
                className="w-full flex items-center gap-4 p-4 text-left hover:bg-ice/50 transition-colors"
              >
                <span className="w-8 h-8 rounded-lg bg-navy text-white text-sm font-bold flex items-center justify-center shrink-0">
                  {agent.id}
                </span>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2 flex-wrap">
                    <span className="font-semibold text-navy">{agent.name}</span>
                    <span className="text-sm text-muted">— {agent.phase}</span>
                  </div>
                  <p className="text-sm text-muted mt-0.5 truncate">{agent.summary}</p>
                </div>
                <div className="flex items-center gap-3 shrink-0">
                  <GateBadge gate={agent.gate} color={agent.gateColor} />
                  <svg
                    width="20"
                    height="20"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                    strokeWidth={2}
                    className={`text-muted transition-transform ${
                      expandedAgent === agent.id ? "rotate-180" : ""
                    }`}
                  >
                    <path strokeLinecap="round" strokeLinejoin="round" d="M19 9l-7 7-7-7" />
                  </svg>
                </div>
              </button>

              {expandedAgent === agent.id && agent.documents.length > 0 && (
                <div className="border-t border-border p-4">
                  <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
                    {agent.documents.map((doc) => (
                      <div
                        key={doc.id}
                        className="flex items-start gap-3 p-3 rounded-lg bg-ice/50 hover:bg-ice transition-colors"
                      >
                        <span className="w-8 h-8 rounded-lg bg-blue/10 text-blue text-xs font-bold flex items-center justify-center shrink-0">
                          {doc.id}
                        </span>
                        <div className="min-w-0">
                          <p className="text-sm font-medium text-navy">{doc.title}</p>
                          <p className="text-xs text-muted mt-0.5">{doc.subtitle}</p>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {expandedAgent === agent.id && agent.documents.length === 0 && (
                <div className="border-t border-border p-6 text-center text-sm text-muted">
                  Document details not yet loaded for this agent.
                </div>
              )}
            </div>
          ))}
        </div>
      )}

      {/* Knowledge Base Tab */}
      {activeTab === "Knowledge Base" && (
        <div>
          {/* Cluster filter cards */}
          <div className="flex flex-wrap gap-2 mb-4">
            <button
              onClick={() => setClusterFilter(null)}
              className={`px-3 py-1.5 rounded-lg text-xs font-medium border transition-colors ${
                !clusterFilter
                  ? "bg-navy text-white border-navy"
                  : "bg-card text-muted border-border hover:border-navy/30"
              }`}
            >
              All ({knowledgeBase.length})
            </button>
            {clusters.map((cluster) => (
              <button
                key={cluster}
                onClick={() => setClusterFilter(cluster === clusterFilter ? null : cluster)}
                className={`px-3 py-1.5 rounded-lg text-xs font-medium border transition-colors ${
                  cluster === clusterFilter
                    ? "bg-navy text-white border-navy"
                    : "bg-card text-muted border-border hover:border-navy/30"
                }`}
              >
                {cluster} ({knowledgeBase.filter((e) => e.cluster === cluster).length})
              </button>
            ))}
          </div>

          {/* KB entries */}
          <div className="space-y-3">
            {filteredKB.map((entry) => (
              <div
                key={entry.id}
                className="bg-card rounded-xl border border-border p-4"
              >
                <div className="flex items-start justify-between gap-3 mb-2">
                  <div className="flex items-center gap-2">
                    <span className="text-xs font-mono text-muted">{entry.id}</span>
                    <h3 className="font-semibold text-navy text-sm">{entry.title}</h3>
                  </div>
                  <span
                    className={`shrink-0 px-2 py-0.5 rounded text-xs font-semibold ${
                      entry.severity === "critical"
                        ? "bg-red/10 text-red"
                        : entry.severity === "high"
                        ? "bg-amber/10 text-amber"
                        : "bg-blue/10 text-blue"
                    }`}
                  >
                    {entry.severity.toUpperCase()}
                  </span>
                </div>
                <p className="text-sm text-foreground/80 mb-3">{entry.insight}</p>
                <div className="flex flex-wrap items-center gap-2">
                  <span className="text-xs text-muted">{entry.source}</span>
                  <span className="text-border">|</span>
                  <span className="text-xs px-2 py-0.5 rounded bg-ice text-muted">
                    {entry.cluster}
                  </span>
                  {entry.tags.slice(0, 3).map((tag) => (
                    <span
                      key={tag}
                      className="text-xs px-2 py-0.5 rounded bg-ice text-muted"
                    >
                      {tag}
                    </span>
                  ))}
                  {entry.actionable && (
                    <span className="text-xs px-2 py-0.5 rounded bg-coral/10 text-coral font-medium">
                      Actionable
                    </span>
                  )}
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Governance Tab */}
      {activeTab === "Governance" && (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {governance.map((item) => (
            <div
              key={item.id}
              className="bg-card rounded-xl border border-border p-5"
            >
              <div className="flex items-start justify-between mb-3">
                <div>
                  <span className="text-xs font-mono text-muted">{item.id}</span>
                  <h3 className="font-semibold text-navy mt-0.5">{item.title}</h3>
                </div>
                <span className="px-2.5 py-1 rounded-md text-xs font-semibold bg-amber/10 text-amber border border-amber/20">
                  {item.status}
                </span>
              </div>
              <div className="space-y-2 text-sm">
                <div className="flex gap-2">
                  <span className="text-muted w-20 shrink-0">Owner</span>
                  <span className="text-foreground">{item.owner}</span>
                </div>
                <div className="flex gap-2">
                  <span className="text-muted w-20 shrink-0">Deadline</span>
                  <span className="text-foreground">{item.deadline}</span>
                </div>
                <div className="flex gap-2">
                  <span className="text-muted w-20 shrink-0">Impact</span>
                  <span className="text-foreground">{item.impact}</span>
                </div>
              </div>
              {item.relatedDefects.length > 0 && (
                <div className="mt-3 pt-3 border-t border-border flex gap-2">
                  {item.relatedDefects.map((d) => (
                    <span
                      key={d}
                      className="text-xs px-2 py-0.5 rounded bg-red/10 text-red font-mono"
                    >
                      {d}
                    </span>
                  ))}
                </div>
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
