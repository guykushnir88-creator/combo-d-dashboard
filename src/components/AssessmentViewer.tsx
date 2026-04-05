"use client";

import { RadarChart } from "./RadarChart";

interface Dimension {
  name: string;
  score: number;
  level: string;
  recommendation: string;
}

interface Assessment {
  overallScore: number;
  overallLevel: string;
  dimensions: Dimension[];
  configRecommendation: Record<string, boolean | string>;
}

function scoreColor(score: number) {
  if (score >= 4) return "bg-green/10 text-green border-green/20";
  if (score >= 3) return "bg-blue/10 text-blue border-blue/20";
  if (score >= 2) return "bg-amber/10 text-amber border-amber/20";
  return "bg-red/10 text-red border-red/20";
}

function scoreTag(score: number) {
  if (score >= 4) return { label: "Strong", color: "bg-green/10 text-green" };
  if (score >= 3) return { label: "Room to improve", color: "bg-amber/10 text-amber" };
  return { label: "Critical gap", color: "bg-red/10 text-red" };
}

function overallColor(score: number) {
  if (score >= 4) return "text-green";
  if (score >= 3) return "text-blue";
  if (score >= 2) return "text-amber";
  return "text-red";
}

const configLabels: Record<string, string> = {
  co_pilot_enabled: "Co-Pilot Enabled",
  co_pilot_detail: "Co-Pilot Detail Level",
  knowledge_base_enabled: "Knowledge Base",
  gate_checks_enabled: "Gate Checks",
  detailed_budget_analysis: "Detailed Budget Analysis",
  risk_simulation: "Risk Simulation",
  stakeholder_sentiment: "Stakeholder Sentiment",
};

export function AssessmentViewer({ assessment }: { assessment: Assessment }) {
  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Radar chart */}
        <div className="bg-card rounded-xl border border-border p-6">
          <h3 className="font-semibold text-navy mb-4 text-sm uppercase tracking-wider">
            Maturity Assessment
          </h3>
          <RadarChart dimensions={assessment.dimensions} />
        </div>

        {/* Overall score + config */}
        <div className="space-y-4">
          {/* Maturity badge */}
          <div className="bg-card rounded-xl border border-border p-6">
            <div className="flex items-center gap-4">
              <div className={`w-20 h-20 rounded-2xl flex flex-col items-center justify-center ${scoreColor(assessment.overallScore)} border`}>
                <span className="text-2xl font-bold">{assessment.overallScore}</span>
                <span className="text-[10px] font-medium opacity-70">/5.0</span>
              </div>
              <div>
                <h3 className="font-semibold text-navy text-lg">Overall Maturity</h3>
                <p className={`text-sm font-semibold ${overallColor(assessment.overallScore)}`}>
                  Level: {assessment.overallLevel}
                </p>
                <p className="text-xs text-muted mt-1">
                  Based on {assessment.dimensions.length} dimensions
                </p>
              </div>
            </div>
          </div>

          {/* Recommended config */}
          <div className="bg-card rounded-xl border border-border p-6">
            <h3 className="font-semibold text-navy mb-3 text-sm uppercase tracking-wider">
              Recommended Configuration
            </h3>
            <div className="space-y-3">
              {Object.entries(assessment.configRecommendation).map(([key, value]) => (
                <div key={key} className="flex items-center justify-between">
                  <span className="text-sm text-foreground">{configLabels[key] || key}</span>
                  {typeof value === "boolean" ? (
                    <span className={`relative w-10 h-5.5 rounded-full ${value ? "bg-green" : "bg-border"}`}>
                      <span className={`absolute top-0.5 left-0.5 w-4.5 h-4.5 bg-white rounded-full shadow transition-transform ${value ? "translate-x-[18px]" : ""}`} />
                    </span>
                  ) : (
                    <span className="text-xs px-2.5 py-1 rounded-lg bg-blue/10 text-blue font-medium">
                      {value}
                    </span>
                  )}
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Per-dimension cards */}
      <div>
        <h3 className="font-semibold text-navy mb-3 text-sm uppercase tracking-wider">
          Dimension Details
        </h3>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
          {assessment.dimensions.map((dim) => {
            const tag = scoreTag(dim.score);
            return (
              <div key={dim.name} className="bg-card rounded-xl border border-border p-4">
                <div className="flex items-start justify-between mb-2">
                  <div className={`w-10 h-10 rounded-xl flex items-center justify-center text-lg font-bold ${scoreColor(dim.score)} border`}>
                    {dim.score}
                  </div>
                  <span className={`text-xs px-2 py-0.5 rounded font-semibold ${tag.color}`}>
                    {tag.label}
                  </span>
                </div>
                <h4 className="font-semibold text-navy text-sm mt-2">{dim.name}</h4>
                <p className="text-xs text-muted mt-0.5 mb-2">Level: {dim.level}</p>
                <p className="text-xs text-foreground/70 leading-relaxed">{dim.recommendation}</p>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}
