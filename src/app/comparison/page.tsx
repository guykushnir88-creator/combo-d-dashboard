import { getComparison } from "@/lib/data";
import { Breadcrumb } from "@/components/Breadcrumb";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Project Comparison",
  description: "Side-by-side comparison of PM Agent Chain analysis results",
};

interface Project {
  name: string;
  client: string;
  grade: string;
  score: number;
  verdict: string;
  agents: number;
  duration_min: number;
  documents: number;
  kb_entries: number;
  dominant_cluster: string;
  dominant_tag: string;
  key_finding: string;
  bias_detected: string[];
  prevention_rules: number;
}

interface ChainEvolution {
  total_projects: number;
  total_documents: number;
  total_kb_entries: number;
  unique_custom_tags: number;
  lessons_learned: number;
  chain_self_grade: string;
}

function gradeColor(grade: string) {
  if (grade === "A" || grade === "A+" || grade === "A-") return "text-green";
  if (grade === "B" || grade === "B+" || grade === "B-") return "text-green";
  if (grade === "C" || grade === "C+" || grade === "C-") return "text-amber";
  if (grade === "D" || grade === "D+" || grade === "D-") return "text-amber";
  return "text-red";
}

function scoreBarColor(score: number) {
  if (score >= 80) return "bg-green";
  if (score >= 60) return "bg-amber";
  return "bg-red";
}

function verdictBadgeClass(verdict: string) {
  if (verdict === "PASS") return "bg-green/10 text-green border-green/20";
  if (verdict === "FAIL") return "bg-red/10 text-red border-red/20";
  return "bg-amber/10 text-amber border-amber/20";
}

export default async function ComparisonPage() {
  const data = await getComparison();
  if (!data) return <p>No comparison data available.</p>;

  const projects: Project[] = data.projects;
  const evolution: ChainEvolution = data.chain_evolution;

  return (
    <div className="max-w-6xl mx-auto">
      <Breadcrumb items={[{ label: "Projects", href: "/" }, { label: "Comparison" }]} />

      <div className="mb-8">
        <h1 className="font-[family-name:var(--font-heading)] text-2xl sm:text-3xl text-navy">
          Project Comparison
        </h1>
        <p className="text-muted mt-1">Same chain, different projects, different outcomes</p>
      </div>

      {/* Score comparison hero */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
        {projects.map((p) => (
          <div key={p.name} className="bg-card rounded-xl border border-border p-6">
            <div className="flex items-start justify-between mb-4">
              <div>
                <h2 className="font-semibold text-navy text-lg">{p.name}</h2>
                <p className="text-sm text-muted">{p.client}</p>
              </div>
              <span className={`px-2.5 py-1 rounded-md text-xs font-bold border ${verdictBadgeClass(p.verdict)}`}>
                {p.verdict}
              </span>
            </div>

            {/* Grade + score */}
            <div className="flex items-end gap-4 mb-4">
              <div className="text-center">
                <span className={`text-5xl font-bold ${gradeColor(p.grade)}`}>{p.grade}</span>
                <p className="text-xs text-muted mt-1">Grade</p>
              </div>
              <div className="flex-1">
                <div className="flex justify-between text-sm mb-1">
                  <span className="text-muted">Score</span>
                  <span className="font-semibold text-navy">{p.score}%</span>
                </div>
                <div className="h-3 bg-ice rounded-full overflow-hidden">
                  <div
                    className={`h-full rounded-full transition-all ${scoreBarColor(p.score)}`}
                    style={{ width: `${p.score}%` }}
                  />
                </div>
              </div>
            </div>

            {/* Key finding */}
            <div className="bg-ice/50 rounded-lg p-3 mb-4">
              <p className="text-xs font-semibold text-muted uppercase tracking-wider mb-1">Key Finding</p>
              <p className="text-sm text-navy font-medium">&ldquo;{p.key_finding}&rdquo;</p>
            </div>

            {/* Dominant pattern */}
            <div className="flex items-center gap-2 mb-3">
              <span className="text-xs text-muted">Dominant:</span>
              <span className="text-xs px-2 py-0.5 rounded bg-coral/10 text-coral font-semibold">
                {p.dominant_tag}
              </span>
            </div>

            {/* Bias tags */}
            <div className="flex flex-wrap gap-1.5">
              {p.bias_detected.map((b) => (
                <span key={b} className="text-xs px-2 py-0.5 rounded bg-navy/5 text-navy/70">
                  {b}
                </span>
              ))}
            </div>
          </div>
        ))}
      </div>

      {/* Metrics comparison table */}
      <div className="bg-card rounded-xl border border-border overflow-hidden mb-8">
        <div className="p-4 border-b border-border">
          <h3 className="font-semibold text-navy text-sm uppercase tracking-wider">Metrics Comparison</h3>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-border bg-ice/50">
                <th className="px-4 py-3 text-left font-semibold text-navy">Metric</th>
                {projects.map((p) => (
                  <th key={p.name} className="px-4 py-3 text-right font-semibold text-navy">{p.name.split(" ")[0]}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {([
                ["Grade", (p: Project) => <span className={`font-bold ${gradeColor(p.grade)}`}>{p.grade} ({p.score}%)</span>],
                ["Verdict", (p: Project) => <span className={`px-2 py-0.5 rounded text-xs font-bold ${verdictBadgeClass(p.verdict)}`}>{p.verdict}</span>],
                ["Agents", (p: Project) => `${p.agents}/6`],
                ["Duration", (p: Project) => `${p.duration_min} min`],
                ["Documents", (p: Project) => p.documents],
                ["KB Entries", (p: Project) => p.kb_entries],
                ["Prevention Rules", (p: Project) => p.prevention_rules],
                ["Dominant Cluster", (p: Project) => p.dominant_cluster],
              ] as [string, (p: Project) => React.ReactNode][]).map(([label, render]) => (
                <tr key={label} className="border-b border-border hover:bg-ice/30">
                  <td className="px-4 py-3 text-muted">{label}</td>
                  {projects.map((p) => (
                    <td key={p.name} className="px-4 py-3 text-right text-navy font-medium">
                      {render(p)}
                    </td>
                  ))}
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Chain evolution */}
      <div className="bg-card rounded-xl border border-border p-6">
        <h3 className="font-semibold text-navy mb-4 text-sm uppercase tracking-wider">
          Chain Evolution
        </h3>
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-4 text-center">
          {([
            [evolution.total_projects, "Projects Analyzed"],
            [evolution.total_documents, "Documents Produced"],
            [evolution.total_kb_entries, "KB Entries"],
            [evolution.unique_custom_tags, "Custom Tags"],
            [evolution.lessons_learned, "Lessons Learned"],
            [evolution.chain_self_grade, "Chain Grade"],
          ] as [string | number, string][]).map(([value, label]) => (
            <div key={label}>
              <p className="text-2xl font-bold text-navy">{value}</p>
              <p className="text-xs text-muted mt-1">{label}</p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
