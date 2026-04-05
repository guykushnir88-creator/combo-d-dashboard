"use client";

import { useState } from "react";
import { GateBadge } from "./StatusBadge";

interface Agent {
  id: number;
  name: string;
  phase: string;
  runTime: string | null;
  docsProduced: number;
  gate: string;
  gateColor: string;
  summary: string;
}

interface PipelineProps {
  agents: Agent[];
  project: {
    runTime: string;
    docsProduced: number;
    kbEntries: number;
    verdict: string;
    verdictScore: number | null;
    verdictGrade: string | null;
  };
  onViewDocs?: (agentId: number) => void;
}

export function Pipeline({ agents, project, onViewDocs }: PipelineProps) {
  const [selectedAgent, setSelectedAgent] = useState<number | null>(null);
  const selected = agents.find((a) => a.id === selectedAgent);

  // Check if there's a fail loop (agent 5 red → back to agent 3)
  const hasFailLoop =
    agents.find((a) => a.id === 5)?.gateColor === "red";

  return (
    <div className="mb-6">
      <h2 className="font-semibold text-navy mb-3 text-sm uppercase tracking-wider">
        Agent Pipeline
      </h2>

      {/* Pipeline cards with connectors */}
      <div className="relative">
        <div className="flex gap-3 overflow-x-auto pb-2 -mx-1 px-1 snap-x">
          {agents.map((agent, idx) => {
            const isActive = agent.gate !== "PENDING";
            const isSelected = selectedAgent === agent.id;

            return (
              <div key={agent.id} className="flex items-center shrink-0 snap-start">
                {/* Agent card */}
                <button
                  onClick={() =>
                    setSelectedAgent(isSelected ? null : agent.id)
                  }
                  className={`w-[140px] sm:w-[160px] rounded-xl border p-3 sm:p-4 text-left transition-all ${
                    isSelected
                      ? "bg-card border-coral shadow-md ring-2 ring-coral/20"
                      : isActive
                      ? "bg-card border-border hover:shadow-md hover:border-blue/30"
                      : "bg-ice/50 border-border/60 opacity-70"
                  }`}
                >
                  <div className="flex items-center gap-2 mb-2">
                    <span
                      className={`w-7 h-7 rounded-lg text-xs font-bold flex items-center justify-center ${
                        isActive
                          ? "bg-navy text-white"
                          : "bg-border text-muted"
                      }`}
                    >
                      {agent.id}
                    </span>
                    <span className="text-sm font-semibold text-navy truncate">
                      {agent.name}
                    </span>
                  </div>
                  <p className="text-xs text-muted mb-2 truncate">{agent.phase}</p>
                  <div className="relative">
                    <GateBadge gate={agent.gate} color={agent.gateColor} />
                    {/* Pulse animation for in-progress */}
                    {agent.gate === "PENDING" && (
                      <span className="absolute -top-1 -right-1 w-2.5 h-2.5">
                        <span className="absolute inset-0 rounded-full bg-blue/40 animate-ping" />
                        <span className="absolute inset-0 rounded-full bg-blue" />
                      </span>
                    )}
                  </div>
                  <div className="flex justify-between text-xs text-muted mt-2 pt-2 border-t border-border">
                    <span>{agent.runTime || "—"}</span>
                    <span>{agent.docsProduced} docs</span>
                  </div>
                </button>

                {/* Connector arrow */}
                {idx < agents.length - 1 && (
                  <div className="flex items-center px-1 shrink-0">
                    <svg width="24" height="16" viewBox="0 0 24 16" fill="none" className="text-border">
                      <line x1="0" y1="8" x2="18" y2="8" stroke="currentColor" strokeWidth="2" />
                      <path d="M16 3L22 8L16 13" stroke="currentColor" strokeWidth="2" fill="none" strokeLinecap="round" strokeLinejoin="round" />
                    </svg>
                  </div>
                )}
              </div>
            );
          })}
        </div>

        {/* Fail remediation loop arrow (Agent 5 → Agent 3) */}
        {hasFailLoop && (
          <div className="hidden lg:block relative h-8 mx-8 mt-1">
            <svg width="100%" height="32" viewBox="0 0 800 32" preserveAspectRatio="none" className="text-red/40">
              <path
                d="M580 2 C580 24, 300 24, 300 2"
                stroke="currentColor"
                strokeWidth="2"
                strokeDasharray="6 4"
                fill="none"
              />
              <path
                d="M304 8 L300 0 L296 8"
                stroke="currentColor"
                strokeWidth="2"
                fill="none"
              />
            </svg>
            <span className="absolute left-1/2 -translate-x-1/2 top-2 text-[10px] text-red/60 font-medium bg-background px-2">
              FAIL → remediation loop
            </span>
          </div>
        )}
      </div>

      {/* Run summary bar */}
      <div className="flex flex-wrap items-center gap-x-4 gap-y-1 mt-3 px-3 py-2.5 bg-ice rounded-xl text-sm">
        <span className="text-muted">{agents.length} agents</span>
        <span className="text-border hidden sm:inline">|</span>
        <span className="text-muted">{project.runTime}</span>
        <span className="text-border hidden sm:inline">|</span>
        <span className="text-muted">{project.docsProduced} documents</span>
        <span className="text-border hidden sm:inline">|</span>
        <span className="text-muted">{project.kbEntries} KB entries</span>
        <span className="text-border hidden sm:inline">|</span>
        <span className="font-semibold text-navy">
          Verdict: {project.verdict}
          {project.verdictGrade && ` — Grade ${project.verdictGrade}`}
          {project.verdictScore !== null && ` (${project.verdictScore}%)`}
        </span>
      </div>

      {/* Selected agent detail panel */}
      {selected && (
        <div className="mt-4 bg-card rounded-xl border border-border p-5 animate-in fade-in slide-in-from-top-2 duration-200">
          <div className="flex items-start justify-between gap-4 mb-3">
            <div className="flex items-center gap-3">
              <span className="w-9 h-9 rounded-lg bg-navy text-white text-sm font-bold flex items-center justify-center">
                {selected.id}
              </span>
              <div>
                <h3 className="font-semibold text-navy">
                  Agent {selected.id}: {selected.name}
                </h3>
                <p className="text-sm text-muted">{selected.phase}</p>
              </div>
            </div>
            <GateBadge gate={selected.gate} color={selected.gateColor} />
          </div>
          <p className="text-sm text-foreground/80 mb-4">{selected.summary}</p>
          <div className="flex flex-wrap gap-4 text-sm">
            <div>
              <span className="text-muted">Run time: </span>
              <span className="font-medium text-navy">{selected.runTime || "—"}</span>
            </div>
            <div>
              <span className="text-muted">Documents: </span>
              <span className="font-medium text-navy">{selected.docsProduced}</span>
            </div>
          </div>
          {selected.docsProduced > 0 && onViewDocs && (
            <button
              onClick={() => onViewDocs(selected.id)}
              className="mt-3 text-sm font-medium text-coral hover:text-coral/80 transition-colors flex items-center gap-1"
            >
              View documents
              <svg width="14" height="14" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M9 5l7 7-7 7" />
              </svg>
            </button>
          )}
        </div>
      )}
    </div>
  );
}
