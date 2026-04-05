"use client";

import { useState, useEffect } from "react";
import { useParams } from "next/navigation";
import Link from "next/link";

const foundationFiles = [
  {
    key: "COMPANY",
    title: "Company Profile",
    description: "Organization overview, industry, size, and culture",
    placeholder: `# Company Profile\n\nOrganization: CloudSync Inc.\nIndustry: SaaS / Cloud Services\nSize: 500+ employees\nHQ: Austin, TX\n\n## Culture\n- Fast-paced, engineering-driven\n- Remote-first since 2020`,
  },
  {
    key: "PROJECT",
    title: "Project Brief",
    description: "High-level project description, objectives, and constraints",
    placeholder: `# Project Brief\n\nProject: HR System Migration\nObjective: Migrate legacy HR system to cloud-based platform\nTimeline: 6-12 months\nBudget: $850,000\n\n## Key Objectives\n1. Zero data loss during migration\n2. Minimal disruption to HR operations\n3. Full compliance with data regulations`,
  },
  {
    key: "STAKEHOLDERS",
    title: "Stakeholders",
    description: "Key stakeholders, roles, and communication preferences",
    placeholder: `# Stakeholders\n\n| Name | Role | Interest |\n|------|------|----------|\n| Maria Santos | CFO | Budget, ROI |\n| James Chen | CTO | Technical architecture |\n| Lisa Park | HR Director | Minimal disruption |`,
  },
  {
    key: "LANDSCAPE",
    title: "Technical Landscape",
    description: "Current systems, integrations, and technical constraints",
    placeholder: `# Technical Landscape\n\n## Current Systems\n- Legacy HR: On-premise, 15 years old\n- Payroll: Integrated with HR\n- Benefits Portal: Semi-integrated\n\n## Constraints\n- 3 downstream system dependencies\n- GDPR and local data regulations`,
  },
  {
    key: "GOALS",
    title: "Success Criteria",
    description: "Measurable goals and acceptance criteria",
    placeholder: `# Success Criteria\n\n1. All employee records migrated (100%)\n2. Zero payroll disruption during cutover\n3. User adoption > 80% within 30 days\n4. System uptime > 99.5%\n5. Complete audit trail maintained`,
  },
];

const defaultConfig = {
  coPilotEnabled: true,
  knowledgeBaseEnabled: true,
  gateChecksEnabled: true,
  detailedBudgetAnalysis: true,
  riskSimulation: false,
  stakeholderSentiment: false,
};

export default function SetupPage() {
  const params = useParams();
  const projectId = params.id as string;

  const [files, setFiles] = useState<Record<string, string>>({});
  const [config, setConfig] = useState(defaultConfig);
  const [editing, setEditing] = useState<string | null>(null);
  const [saved, setSaved] = useState(false);

  useEffect(() => {
    const storedFiles = localStorage.getItem(`setup-files-${projectId}`);
    const storedConfig = localStorage.getItem(`setup-config-${projectId}`);
    if (storedFiles) setFiles(JSON.parse(storedFiles));
    if (storedConfig) setConfig(JSON.parse(storedConfig));
  }, [projectId]);

  function save() {
    localStorage.setItem(`setup-files-${projectId}`, JSON.stringify(files));
    localStorage.setItem(`setup-config-${projectId}`, JSON.stringify(config));
    setSaved(true);
    setTimeout(() => setSaved(false), 2000);
  }

  return (
    <div className="max-w-4xl mx-auto">
      {/* Breadcrumb */}
      <nav className="flex items-center gap-1.5 text-sm mb-6 overflow-x-auto">
        <Link href="/" className="text-muted hover:text-coral transition-colors shrink-0">Projects</Link>
        <svg width="14" height="14" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2} className="text-muted/40 shrink-0"><path strokeLinecap="round" strokeLinejoin="round" d="M9 5l7 7-7 7" /></svg>
        <Link href={`/project/${projectId}`} className="text-muted hover:text-coral transition-colors shrink-0">{projectId}</Link>
        <svg width="14" height="14" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2} className="text-muted/40 shrink-0"><path strokeLinecap="round" strokeLinejoin="round" d="M9 5l7 7-7 7" /></svg>
        <span className="text-navy font-medium shrink-0">Context Setup</span>
      </nav>

      <div className="mb-8">
        <h1 className="font-[family-name:var(--font-heading)] text-2xl sm:text-3xl text-navy">
          Context Setup
        </h1>
        <p className="text-muted mt-1">
          Foundation files and configuration for the PM Agent Chain
        </p>
      </div>

      {/* Foundation Files */}
      <div className="mb-8">
        <h2 className="font-semibold text-navy mb-4 text-sm uppercase tracking-wider">
          Foundation Files
        </h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {foundationFiles.map((file) => (
            <div
              key={file.key}
              className="bg-card rounded-xl border border-border p-5"
            >
              <div className="flex items-start justify-between mb-2">
                <div className="w-10 h-10 rounded-xl bg-blue/10 text-blue flex items-center justify-center shrink-0">
                  <svg width="20" height="20" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                  </svg>
                </div>
                {files[file.key] && (
                  <span className="w-2 h-2 rounded-full bg-green shrink-0 mt-1" title="Has content" />
                )}
              </div>
              <h3 className="font-semibold text-navy text-sm">{file.title}</h3>
              <p className="text-xs text-muted mt-1 mb-3">{file.description}</p>
              <button
                onClick={() => setEditing(editing === file.key ? null : file.key)}
                className="text-xs font-medium text-coral hover:text-coral/80 transition-colors"
              >
                {editing === file.key ? "Close" : files[file.key] ? "Edit" : "Add Content"}
              </button>

              {editing === file.key && (
                <textarea
                  className="mt-3 w-full h-48 rounded-lg border border-border bg-background p-3 text-sm font-mono resize-y focus:outline-none focus:ring-2 focus:ring-blue/30 focus:border-blue"
                  value={files[file.key] || ""}
                  onChange={(e) => setFiles({ ...files, [file.key]: e.target.value })}
                  placeholder={file.placeholder}
                />
              )}
            </div>
          ))}
        </div>
      </div>

      {/* Configuration */}
      <div className="mb-8">
        <h2 className="font-semibold text-navy mb-4 text-sm uppercase tracking-wider">
          Agent Configuration
        </h2>
        <div className="bg-card rounded-xl border border-border p-5">
          <div className="space-y-4">
            {Object.entries(config).map(([key, value]) => (
              <div key={key} className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-navy">
                    {key.replace(/([A-Z])/g, " $1").replace(/^./, (s) => s.toUpperCase())}
                  </p>
                </div>
                <button
                  onClick={() => setConfig({ ...config, [key]: !value })}
                  className={`relative w-11 h-6 rounded-full transition-colors ${
                    value ? "bg-green" : "bg-border"
                  }`}
                >
                  <span
                    className={`absolute top-0.5 left-0.5 w-5 h-5 bg-white rounded-full shadow transition-transform ${
                      value ? "translate-x-5" : ""
                    }`}
                  />
                </button>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Save */}
      <div className="flex items-center gap-3">
        <button
          onClick={save}
          className="px-6 py-2.5 bg-coral text-white rounded-lg font-medium hover:bg-coral/90 transition-colors"
        >
          Save Configuration
        </button>
        {saved && (
          <span className="text-sm text-green font-medium">Saved to localStorage</span>
        )}
      </div>
    </div>
  );
}
