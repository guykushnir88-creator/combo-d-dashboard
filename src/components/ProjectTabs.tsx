"use client";

import { useState, useEffect, useMemo, forwardRef, useImperativeHandle } from "react";
import { GateBadge } from "./StatusBadge";

/* ── Types ── */

interface Document {
  id: string;
  title: string;
  subtitle: string;
  content?: string;
}

interface Agent {
  id: number;
  name: string;
  phase: string;
  runTime: string | null;
  docsProduced: number;
  gate: string;
  gateColor: string;
  summary: string;
  documents: Document[];
}

interface KBEntry {
  id: string;
  cluster: string;
  title: string;
  severity: string;
  pattern: string;
  insight: string;
  source: string;
  agentId: number;
  tags: string[];
  actionable: boolean;
  detectionSignal?: string;
  prevention?: string;
  relatedEntries?: string[];
}

interface GovernanceItem {
  id: string;
  title: string;
  status: string;
  owner: string;
  deadline: string;
  impact: string;
  relatedDefects: string[];
  relatedKB?: string[];
  evidence: string | null;
  lastUpdated: string | null;
}

const tabs = ["Documents", "Knowledge Base", "Governance"] as const;
type Tab = (typeof tabs)[number];

/* ── Cluster trend logic ── */
const clusterTrends: Record<string, { label: string; color: string }> = {
  "Decision / Governance": { label: "DOMINANT", color: "bg-red/10 text-red" },
  "Inadequate Preparation": { label: "GROWING", color: "bg-amber/10 text-amber" },
  "Stakeholder / Org": { label: "GROWING", color: "bg-amber/10 text-amber" },
  "Vendor / Technical": { label: "STABLE", color: "bg-muted/10 text-muted" },
  "Budget / Resource": { label: "GROWING", color: "bg-amber/10 text-amber" },
  "Optimism / Self-Assessment": { label: "STABLE", color: "bg-muted/10 text-muted" },
  "Timeline / Schedule": { label: "STABLE", color: "bg-muted/10 text-muted" },
};

const severityOrder: Record<string, number> = { critical: 0, high: 1, medium: 2, low: 3 };

/* ── Sort helpers ── */
type SortKey = "id" | "pattern" | "severity" | "cluster" | "source" | "title";
type SortDir = "asc" | "desc";

export interface ProjectTabsHandle {
  switchToDocsAgent: (agentId: number) => void;
}

export const ProjectTabs = forwardRef<ProjectTabsHandle, {
  agents: Agent[];
  knowledgeBase: KBEntry[];
  governance: GovernanceItem[];
}>(function ProjectTabs({ agents, knowledgeBase, governance }, ref) {
  const [activeTab, setActiveTab] = useState<Tab>("Documents");
  const [focusAgentId, setFocusAgentId] = useState<number | null>(null);

  useImperativeHandle(ref, () => ({
    switchToDocsAgent(agentId: number) {
      setActiveTab("Documents");
      setFocusAgentId(agentId);
    },
  }));

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

      {activeTab === "Documents" && <DocumentsPanel agents={agents} focusAgentId={focusAgentId} onFocusHandled={() => setFocusAgentId(null)} />}
      {activeTab === "Knowledge Base" && <KnowledgeBasePanel knowledgeBase={knowledgeBase} />}
      {activeTab === "Governance" && <GovernancePanel governance={governance} />}
    </div>
  );
});

/* ════════════════════════════════════════════════════
   1. DOCUMENTS PANEL
   ════════════════════════════════════════════════════ */

function DocumentsPanel({ agents, focusAgentId, onFocusHandled }: { agents: Agent[]; focusAgentId?: number | null; onFocusHandled?: () => void }) {
  const [expandedAgent, setExpandedAgent] = useState<number | null>(1);

  useEffect(() => {
    if (focusAgentId != null) {
      setExpandedAgent(focusAgentId);
      const el = document.getElementById(`agent-${focusAgentId}`);
      if (el) el.scrollIntoView({ behavior: "smooth", block: "start" });
      onFocusHandled?.();
    }
  }, [focusAgentId, onFocusHandled]);
  const [expandedDoc, setExpandedDoc] = useState<string | null>(null);

  return (
    <div className="space-y-3">
      {agents.map((agent) => (
        <div
          key={agent.id}
          id={`agent-${agent.id}`}
          className="bg-card rounded-xl border border-border overflow-hidden"
        >
          {/* Agent header */}
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
                <span className="text-xs text-muted ml-auto mr-2 hidden sm:inline">{agent.runTime}</span>
              </div>
              <p className="text-sm text-muted mt-0.5 truncate">{agent.summary}</p>
            </div>
            <div className="flex items-center gap-3 shrink-0">
              <GateBadge gate={agent.gate} color={agent.gateColor} />
              <svg
                width="20" height="20" fill="none" viewBox="0 0 24 24"
                stroke="currentColor" strokeWidth={2}
                className={`text-muted transition-transform ${expandedAgent === agent.id ? "rotate-180" : ""}`}
              >
                <path strokeLinecap="round" strokeLinejoin="round" d="M19 9l-7 7-7-7" />
              </svg>
            </div>
          </button>

          {/* Expanded: document cards */}
          {expandedAgent === agent.id && agent.documents.length > 0 && (
            <div className="border-t border-border p-4 space-y-3">
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
                {agent.documents.map((doc) => {
                  const docKey = `${agent.id}-${doc.id}`;
                  const isExpanded = expandedDoc === docKey;

                  return (
                    <div
                      key={doc.id}
                      className={`rounded-lg border transition-all cursor-pointer ${
                        isExpanded
                          ? "bg-white border-blue/30 shadow-sm col-span-full"
                          : "bg-ice/50 border-transparent hover:bg-ice hover:border-border"
                      }`}
                      onClick={() => setExpandedDoc(isExpanded ? null : docKey)}
                    >
                      <div className="flex items-start gap-3 p-3">
                        <span className="w-8 h-8 rounded-lg bg-blue/10 text-blue text-xs font-bold flex items-center justify-center shrink-0">
                          {doc.id}
                        </span>
                        <div className="min-w-0 flex-1">
                          <p className="text-sm font-medium text-navy">{doc.title}</p>
                          <p className="text-xs text-muted mt-0.5">{doc.subtitle}</p>
                        </div>
                        {doc.content && (
                          <svg
                            width="16" height="16" fill="none" viewBox="0 0 24 24"
                            stroke="currentColor" strokeWidth={2}
                            className={`text-muted shrink-0 mt-0.5 transition-transform ${isExpanded ? "rotate-180" : ""}`}
                          >
                            <path strokeLinecap="round" strokeLinejoin="round" d="M19 9l-7 7-7-7" />
                          </svg>
                        )}
                      </div>
                      {isExpanded && doc.content && (
                        <div className="px-4 pb-4 pt-1 border-t border-border mx-3 mt-1">
                          {doc.content.split("\n\n").map((para, i) => (
                            <p key={i} className="text-sm text-foreground/80 leading-relaxed mt-2 first:mt-0">
                              {para}
                            </p>
                          ))}
                        </div>
                      )}
                    </div>
                  );
                })}
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
  );
}

/* ════════════════════════════════════════════════════
   2. KNOWLEDGE BASE PANEL
   ════════════════════════════════════════════════════ */

function KnowledgeBasePanel({ knowledgeBase }: { knowledgeBase: KBEntry[] }) {
  const [clusterFilter, setClusterFilter] = useState<string | null>(null);
  const [search, setSearch] = useState("");
  const [sortKey, setSortKey] = useState<SortKey>("id");
  const [sortDir, setSortDir] = useState<SortDir>("asc");
  const [expandedRow, setExpandedRow] = useState<string | null>(null);
  const [playbookOpen, setPlaybookOpen] = useState(false);

  const clusters = useMemo(() => {
    const map = new Map<string, number>();
    knowledgeBase.forEach((e) => map.set(e.cluster, (map.get(e.cluster) || 0) + 1));
    return [...map.entries()].sort((a, b) => b[1] - a[1]);
  }, [knowledgeBase]);

  const filtered = useMemo(() => {
    let items = knowledgeBase;
    if (clusterFilter) items = items.filter((e) => e.cluster === clusterFilter);
    if (search) {
      const q = search.toLowerCase();
      items = items.filter(
        (e) =>
          e.id.toLowerCase().includes(q) ||
          e.title.toLowerCase().includes(q) ||
          e.pattern.toLowerCase().includes(q) ||
          e.cluster.toLowerCase().includes(q) ||
          e.insight.toLowerCase().includes(q) ||
          e.source.toLowerCase().includes(q) ||
          e.tags.some((t) => t.toLowerCase().includes(q))
      );
    }
    return [...items].sort((a, b) => {
      let cmp = 0;
      if (sortKey === "severity") {
        cmp = (severityOrder[a.severity] ?? 99) - (severityOrder[b.severity] ?? 99);
      } else {
        cmp = (a[sortKey] ?? "").toString().localeCompare((b[sortKey] ?? "").toString());
      }
      return sortDir === "asc" ? cmp : -cmp;
    });
  }, [knowledgeBase, clusterFilter, search, sortKey, sortDir]);

  function toggleSort(key: SortKey) {
    if (sortKey === key) setSortDir(sortDir === "asc" ? "desc" : "asc");
    else { setSortKey(key); setSortDir("asc"); }
  }

  const SortIcon = ({ col }: { col: SortKey }) => (
    <svg width="12" height="12" viewBox="0 0 12 12" fill="currentColor"
      className={`inline ml-1 ${sortKey === col ? "opacity-100" : "opacity-30"}`}
    >
      {sortKey === col && sortDir === "desc"
        ? <path d="M6 9L2 4h8L6 9z" />
        : <path d="M6 3l4 5H2l4-5z" />
      }
    </svg>
  );

  const severityBadge = (sev: string) => {
    const map: Record<string, string> = {
      critical: "bg-red/10 text-red",
      high: "bg-amber/10 text-amber",
      medium: "bg-blue/10 text-blue",
      low: "bg-muted/10 text-muted",
    };
    return (
      <span className={`px-2 py-0.5 rounded text-xs font-semibold ${map[sev] || map.low}`}>
        {sev.toUpperCase()}
      </span>
    );
  };

  /* Prevention rules grouped by cluster */
  const playbookRules = useMemo(() => {
    const map = new Map<string, { id: string; detection: string; prevention: string }[]>();
    knowledgeBase.forEach((e) => {
      if (e.detectionSignal && e.prevention) {
        const list = map.get(e.cluster) || [];
        list.push({ id: e.id, detection: e.detectionSignal, prevention: e.prevention });
        map.set(e.cluster, list);
      }
    });
    return map;
  }, [knowledgeBase]);

  return (
    <div>
      {/* Cluster cards — horizontal scroll */}
      <div className="flex gap-3 overflow-x-auto pb-3 mb-4 -mx-1 px-1">
        <button
          onClick={() => setClusterFilter(null)}
          className={`shrink-0 rounded-xl border p-3 min-w-[160px] text-left transition-all ${
            !clusterFilter
              ? "bg-navy text-white border-navy"
              : "bg-card text-foreground border-border hover:border-navy/30"
          }`}
        >
          <p className="text-sm font-semibold">All Clusters</p>
          <p className={`text-2xl font-bold mt-1 ${!clusterFilter ? "text-white" : "text-navy"}`}>
            {knowledgeBase.length}
          </p>
          <p className={`text-xs mt-1 ${!clusterFilter ? "text-white/60" : "text-muted"}`}>entries</p>
        </button>
        {clusters.map(([cluster, count]) => {
          const trend = clusterTrends[cluster] || { label: "STABLE", color: "bg-muted/10 text-muted" };
          const active = clusterFilter === cluster;
          return (
            <button
              key={cluster}
              onClick={() => setClusterFilter(active ? null : cluster)}
              className={`shrink-0 rounded-xl border p-3 min-w-[160px] text-left transition-all ${
                active
                  ? "bg-navy text-white border-navy"
                  : "bg-card text-foreground border-border hover:border-navy/30"
              }`}
            >
              <p className={`text-sm font-semibold ${active ? "text-white" : "text-navy"}`}>{cluster}</p>
              <div className="flex items-center gap-2 mt-1">
                <span className={`text-2xl font-bold ${active ? "text-white" : "text-navy"}`}>{count}</span>
                <span className={`text-xs px-1.5 py-0.5 rounded font-medium ${active ? "bg-white/20 text-white" : trend.color}`}>
                  {trend.label}
                </span>
              </div>
            </button>
          );
        })}
      </div>

      {/* Search */}
      <div className="mb-4">
        <input
          type="text"
          placeholder="Search entries by ID, pattern, cluster, keyword..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="w-full px-4 py-2.5 rounded-lg border border-border bg-card text-sm focus:outline-none focus:ring-2 focus:ring-blue/30 focus:border-blue placeholder:text-muted"
        />
      </div>

      {/* Desktop table */}
      <div className="hidden md:block bg-card rounded-xl border border-border overflow-hidden mb-6">
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-border bg-ice/50">
                {([
                  ["id", "ID"],
                  ["pattern", "Pattern"],
                  ["severity", "Severity"],
                  ["cluster", "Cluster"],
                  ["source", "Agent"],
                  ["title", "Summary"],
                ] as [SortKey, string][]).map(([key, label]) => (
                  <th
                    key={key}
                    onClick={() => toggleSort(key)}
                    className="px-4 py-3 text-left font-semibold text-navy cursor-pointer select-none hover:bg-ice whitespace-nowrap"
                  >
                    {label}<SortIcon col={key} />
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {filtered.map((entry) => {
                const isExpanded = expandedRow === entry.id;
                return (
                  <Fragment key={entry.id}>
                    <tr
                      onClick={() => setExpandedRow(isExpanded ? null : entry.id)}
                      className={`border-b border-border cursor-pointer transition-colors ${
                        isExpanded ? "bg-ice/50" : "hover:bg-ice/30"
                      }`}
                    >
                      <td className="px-4 py-3 font-mono text-xs text-muted whitespace-nowrap">{entry.id}</td>
                      <td className="px-4 py-3">
                        <span className="text-xs px-2 py-0.5 rounded bg-navy/5 text-navy font-medium">
                          {entry.pattern}
                        </span>
                      </td>
                      <td className="px-4 py-3">{severityBadge(entry.severity)}</td>
                      <td className="px-4 py-3 text-xs text-muted whitespace-nowrap">{entry.cluster}</td>
                      <td className="px-4 py-3 text-xs text-muted whitespace-nowrap">{entry.source}</td>
                      <td className="px-4 py-3 text-navy">{entry.title}</td>
                    </tr>
                    {isExpanded && <KBExpandedRow entry={entry} onRelatedClick={(re) => setExpandedRow(re)} />}
                  </Fragment>
                );
              })}
              {filtered.length === 0 && (
                <tr>
                  <td colSpan={6} className="px-4 py-8 text-center text-muted">
                    No entries match your search.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Mobile card layout */}
      <div className="md:hidden space-y-3 mb-6">
        {filtered.map((entry) => {
          const isExpanded = expandedRow === entry.id;
          return (
            <div
              key={entry.id}
              onClick={() => setExpandedRow(isExpanded ? null : entry.id)}
              className={`bg-card rounded-xl border border-border p-4 cursor-pointer transition-all ${isExpanded ? "ring-2 ring-coral/20" : ""}`}
            >
              <div className="flex items-start justify-between gap-2 mb-2">
                <div className="flex items-center gap-2 min-w-0">
                  <span className="text-xs font-mono text-muted shrink-0">{entry.id}</span>
                  <h4 className="text-sm font-semibold text-navy truncate">{entry.title}</h4>
                </div>
                {severityBadge(entry.severity)}
              </div>
              <div className="flex flex-wrap gap-1.5 mb-2">
                <span className="text-xs px-2 py-0.5 rounded bg-navy/5 text-navy font-medium">{entry.pattern}</span>
                <span className="text-xs px-2 py-0.5 rounded bg-ice text-muted">{entry.cluster}</span>
              </div>
              <p className="text-xs text-muted">{entry.source}</p>
              {isExpanded && (
                <div className="mt-3 pt-3 border-t border-border space-y-2">
                  <p className="text-sm text-foreground/80">{entry.insight}</p>
                  {entry.detectionSignal && (
                    <div>
                      <p className="text-xs font-semibold text-muted uppercase tracking-wider mb-0.5">Detection</p>
                      <p className="text-xs text-foreground/70">{entry.detectionSignal}</p>
                    </div>
                  )}
                  {entry.prevention && (
                    <div>
                      <p className="text-xs font-semibold text-muted uppercase tracking-wider mb-0.5">Prevention</p>
                      <p className="text-xs text-green font-medium">{entry.prevention}</p>
                    </div>
                  )}
                  <div className="flex flex-wrap gap-1 pt-1">
                    {entry.tags.map((tag) => (
                      <span key={tag} className="text-xs px-2 py-0.5 rounded bg-ice text-muted">{tag}</span>
                    ))}
                  </div>
                </div>
              )}
            </div>
          );
        })}
        {filtered.length === 0 && (
          <p className="text-center text-muted py-8 text-sm">No entries match your search.</p>
        )}
      </div>

      {/* Prevention Playbook */}
      <div className="bg-card rounded-xl border border-border overflow-hidden">
        <button
          onClick={() => setPlaybookOpen(!playbookOpen)}
          className="w-full flex items-center justify-between p-4 hover:bg-ice/50 transition-colors"
        >
          <div className="flex items-center gap-3">
            <svg width="20" height="20" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2} className="text-green">
              <path strokeLinecap="round" strokeLinejoin="round" d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
            </svg>
            <span className="font-semibold text-navy">Prevention Playbook</span>
            <span className="text-xs text-muted">
              ({[...playbookRules.values()].reduce((s, r) => s + r.length, 0)} rules)
            </span>
          </div>
          <svg
            width="20" height="20" fill="none" viewBox="0 0 24 24"
            stroke="currentColor" strokeWidth={2}
            className={`text-muted transition-transform ${playbookOpen ? "rotate-180" : ""}`}
          >
            <path strokeLinecap="round" strokeLinejoin="round" d="M19 9l-7 7-7-7" />
          </svg>
        </button>
        {playbookOpen && (
          <div className="border-t border-border p-4 space-y-6">
            {[...playbookRules.entries()].map(([cluster, rules]) => (
              <div key={cluster}>
                <h4 className="text-xs font-semibold text-muted uppercase tracking-wider mb-3">{cluster}</h4>
                <div className="space-y-2">
                  {rules.map((rule) => (
                    <div key={rule.id} className="flex gap-3 p-3 rounded-lg bg-ice/50">
                      <span className="text-xs font-mono text-muted shrink-0 w-14">{rule.id}</span>
                      <div className="text-sm">
                        <p className="text-foreground/80">
                          <span className="font-semibold text-red">IF</span>{" "}
                          {rule.detection.replace(/^IF /i, "")}
                        </p>
                        <p className="text-green mt-0.5">
                          <span className="font-semibold">THEN</span>{" "}
                          {rule.prevention.replace(/^.*?THEN /i, "")}
                        </p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

/* We need Fragment for the table rows */
import { Fragment } from "react";

/* Shared expanded row for KB table */
function KBExpandedRow({ entry, onRelatedClick }: { entry: KBEntry; onRelatedClick: (id: string) => void }) {
  return (
    <tr className="bg-ice/30">
      <td colSpan={6} className="px-6 py-4">
        <div className="max-w-3xl space-y-3">
          <div>
            <p className="text-xs font-semibold text-muted uppercase tracking-wider mb-1">Insight</p>
            <p className="text-sm text-foreground/80">{entry.insight}</p>
          </div>
          {entry.detectionSignal && (
            <div>
              <p className="text-xs font-semibold text-muted uppercase tracking-wider mb-1">Detection Signal</p>
              <p className="text-sm text-foreground/80">{entry.detectionSignal}</p>
            </div>
          )}
          {entry.prevention && (
            <div>
              <p className="text-xs font-semibold text-muted uppercase tracking-wider mb-1">Prevention Rule</p>
              <p className="text-sm text-green font-medium">{entry.prevention}</p>
            </div>
          )}
          <div className="flex flex-wrap gap-4 pt-2 border-t border-border">
            <div>
              <p className="text-xs text-muted">Source</p>
              <p className="text-sm font-medium text-navy">{entry.source}</p>
            </div>
            <div>
              <p className="text-xs text-muted">Tags</p>
              <div className="flex flex-wrap gap-1 mt-0.5">
                {entry.tags.map((tag) => (
                  <span key={tag} className="text-xs px-2 py-0.5 rounded bg-ice text-muted">{tag}</span>
                ))}
              </div>
            </div>
            {entry.relatedEntries && entry.relatedEntries.length > 0 && (
              <div>
                <p className="text-xs text-muted">Related</p>
                <div className="flex flex-wrap gap-1 mt-0.5">
                  {entry.relatedEntries.map((re) => (
                    <button
                      key={re}
                      onClick={(e) => { e.stopPropagation(); onRelatedClick(re); }}
                      className="text-xs px-2 py-0.5 rounded bg-blue/10 text-blue font-medium hover:bg-blue/20"
                    >
                      {re}
                    </button>
                  ))}
                </div>
              </div>
            )}
          </div>
        </div>
      </td>
    </tr>
  );
}

/* ════════════════════════════════════════════════════
   3. GOVERNANCE PANEL
   ════════════════════════════════════════════════════ */

function GovernancePanel({ governance }: { governance: GovernanceItem[] }) {
  const [items, setItems] = useState<GovernanceItem[]>(governance);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [editStatus, setEditStatus] = useState("");
  const [editEvidence, setEditEvidence] = useState("");

  /* Load overrides from localStorage */
  useEffect(() => {
    const stored = localStorage.getItem("governance-overrides");
    if (stored) {
      const overrides: Record<string, { status: string; evidence: string; lastUpdated: string }> = JSON.parse(stored);
      setItems(
        governance.map((g) => {
          const o = overrides[g.id];
          return o ? { ...g, status: o.status, evidence: o.evidence, lastUpdated: o.lastUpdated } : g;
        })
      );
    }
  }, [governance]);

  const today = new Date().toISOString().split("T")[0];

  /* Computed status (overdue check) */
  function effectiveStatus(item: GovernanceItem) {
    if (item.status === "PENDING" && item.deadline < today) return "OVERDUE";
    return item.status;
  }

  /* Sort: OVERDUE first, PENDING, DECIDED, VERIFIED */
  const statusOrder: Record<string, number> = { OVERDUE: 0, PENDING: 1, DECIDED: 2, VERIFIED: 3 };
  const sorted = [...items].sort((a, b) => {
    const sa = statusOrder[effectiveStatus(a)] ?? 9;
    const sb = statusOrder[effectiveStatus(b)] ?? 9;
    return sa - sb;
  });

  const counts = {
    total: items.length,
    decided: items.filter((i) => i.status === "DECIDED").length,
    verified: items.filter((i) => i.status === "VERIFIED").length,
    pending: items.filter((i) => effectiveStatus(i) === "PENDING").length,
    overdue: items.filter((i) => effectiveStatus(i) === "OVERDUE").length,
  };

  function saveEdit(id: string) {
    const updated = items.map((i) =>
      i.id === id
        ? { ...i, status: editStatus, evidence: editEvidence || null, lastUpdated: new Date().toISOString() }
        : i
    );
    setItems(updated);

    /* Persist to localStorage */
    const stored = localStorage.getItem("governance-overrides");
    const overrides = stored ? JSON.parse(stored) : {};
    overrides[id] = { status: editStatus, evidence: editEvidence, lastUpdated: new Date().toISOString() };
    localStorage.setItem("governance-overrides", JSON.stringify(overrides));

    setEditingId(null);
  }

  const statusBadgeColor: Record<string, string> = {
    PENDING: "bg-amber/10 text-amber border-amber/20",
    DECIDED: "bg-green/10 text-green border-green/20",
    VERIFIED: "bg-blue/10 text-blue border-blue/20",
    OVERDUE: "bg-red/10 text-red border-red/20",
  };

  return (
    <div>
      {/* Summary bar */}
      <div className="bg-card rounded-xl border border-border p-4 mb-6">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
          <p className="text-sm text-foreground">
            <span className="font-semibold text-navy">{counts.total}</span> decisions tracked:{" "}
            <span className="text-green font-medium">{counts.decided} decided</span>,{" "}
            <span className="text-blue font-medium">{counts.verified} verified</span>,{" "}
            <span className="text-amber font-medium">{counts.pending} pending</span>
            {counts.overdue > 0 && (
              <>, <span className="text-red font-medium">{counts.overdue} overdue</span></>
            )}
          </p>
          <div className="w-full sm:w-48 h-2.5 bg-ice rounded-full overflow-hidden flex">
            <div
              className="h-full bg-green transition-all"
              style={{ width: `${((counts.decided + counts.verified) / counts.total) * 100}%` }}
            />
            <div
              className="h-full bg-amber transition-all"
              style={{ width: `${(counts.pending / counts.total) * 100}%` }}
            />
            <div
              className="h-full bg-red transition-all"
              style={{ width: `${(counts.overdue / counts.total) * 100}%` }}
            />
          </div>
        </div>
      </div>

      {/* Decision cards */}
      <div className="space-y-4">
        {sorted.map((item) => {
          const status = effectiveStatus(item);
          const badgeClass = statusBadgeColor[status] || statusBadgeColor.PENDING;
          const isEditing = editingId === item.id;

          return (
            <div key={item.id} className="bg-card rounded-xl border border-border p-5">
              <div className="flex items-start justify-between gap-3 mb-4">
                <div>
                  <div className="flex items-center gap-2 mb-1">
                    <span className="text-xs font-mono text-muted">{item.id}</span>
                    <span className={`px-2.5 py-1 rounded-md text-xs font-semibold border ${badgeClass}`}>
                      {status}
                    </span>
                  </div>
                  <h3 className="font-semibold text-navy text-lg">{item.title}</h3>
                </div>
                {!isEditing && (
                  <button
                    onClick={() => {
                      setEditingId(item.id);
                      setEditStatus(item.status);
                      setEditEvidence(item.evidence || "");
                    }}
                    className="text-xs font-medium text-coral hover:text-coral/80 transition-colors shrink-0"
                  >
                    Update Status
                  </button>
                )}
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-sm">
                <div>
                  <p className="text-xs text-muted mb-0.5">Owner</p>
                  <p className="text-foreground font-medium">{item.owner}</p>
                </div>
                <div>
                  <p className="text-xs text-muted mb-0.5">Deadline</p>
                  <p className={`font-medium ${item.deadline < today ? "text-red" : "text-foreground"}`}>
                    {item.deadline}
                    {item.deadline < today && (
                      <span className="text-xs ml-1.5 text-red">PAST DUE</span>
                    )}
                  </p>
                </div>
                <div className="sm:col-span-2">
                  <p className="text-xs text-muted mb-0.5">Impact</p>
                  <p className="text-foreground/80">{item.impact}</p>
                </div>
              </div>

              {/* Evidence */}
              {item.evidence && (
                <div className="mt-3 pt-3 border-t border-border">
                  <p className="text-xs text-muted mb-0.5">Evidence</p>
                  <p className="text-sm text-foreground/80 bg-green/5 p-2 rounded-lg">{item.evidence}</p>
                </div>
              )}

              {/* Related items */}
              <div className="flex flex-wrap items-center gap-2 mt-3 pt-3 border-t border-border">
                {item.relatedDefects.map((d) => (
                  <span key={d} className="text-xs px-2 py-0.5 rounded bg-red/10 text-red font-mono">{d}</span>
                ))}
                {item.relatedKB?.map((kb) => (
                  <span key={kb} className="text-xs px-2 py-0.5 rounded bg-blue/10 text-blue font-mono">{kb}</span>
                ))}
              </div>

              {/* Last updated */}
              {item.lastUpdated && (
                <p className="text-xs text-muted mt-2">
                  Last updated: {new Date(item.lastUpdated).toLocaleString()}
                </p>
              )}

              {/* Inline edit form */}
              {isEditing && (
                <div className="mt-4 pt-4 border-t border-border space-y-3">
                  <div>
                    <label className="text-xs font-semibold text-muted block mb-1">Status</label>
                    <select
                      value={editStatus}
                      onChange={(e) => setEditStatus(e.target.value)}
                      className="w-full sm:w-48 px-3 py-2 rounded-lg border border-border bg-background text-sm focus:outline-none focus:ring-2 focus:ring-blue/30"
                    >
                      <option value="PENDING">PENDING</option>
                      <option value="DECIDED">DECIDED</option>
                      <option value="VERIFIED">VERIFIED</option>
                    </select>
                  </div>
                  <div>
                    <label className="text-xs font-semibold text-muted block mb-1">Evidence / Notes</label>
                    <textarea
                      value={editEvidence}
                      onChange={(e) => setEditEvidence(e.target.value)}
                      placeholder="Add evidence or decision notes..."
                      className="w-full px-3 py-2 rounded-lg border border-border bg-background text-sm h-24 resize-y focus:outline-none focus:ring-2 focus:ring-blue/30"
                    />
                  </div>
                  <div className="flex gap-2">
                    <button
                      onClick={() => saveEdit(item.id)}
                      className="px-4 py-2 bg-coral text-white rounded-lg text-sm font-medium hover:bg-coral/90 transition-colors"
                    >
                      Save
                    </button>
                    <button
                      onClick={() => setEditingId(null)}
                      className="px-4 py-2 bg-ice text-muted rounded-lg text-sm font-medium hover:bg-border transition-colors"
                    >
                      Cancel
                    </button>
                  </div>
                </div>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
}
