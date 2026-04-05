const colorMap: Record<string, string> = {
  green: "bg-green/10 text-green border-green/20",
  amber: "bg-amber/10 text-amber border-amber/20",
  red: "bg-red/10 text-red border-red/20",
  navy: "bg-navy/10 text-navy border-navy/20",
  blue: "bg-blue/10 text-blue border-blue/20",
};

const statusColorMap: Record<string, string> = {
  "analysis-complete": "bg-green/10 text-green border-green/20",
  "in-progress": "bg-blue/10 text-blue border-blue/20",
  "not-started": "bg-muted/10 text-muted border-muted/20",
};

const verdictColorMap: Record<string, string> = {
  FAIL: "bg-red/10 text-red border-red/20",
  "PASS WITH CONDITIONS": "bg-green/10 text-green border-green/20",
  PASS: "bg-green/10 text-green border-green/20",
  "NO-GO": "bg-red/10 text-red border-red/20",
  PARTIAL: "bg-amber/10 text-amber border-amber/20",
};

export function GateBadge({ gate, color }: { gate: string; color: string }) {
  const classes = colorMap[color] || colorMap.navy;
  return (
    <span className={`inline-flex items-center px-2.5 py-1 rounded-md text-xs font-semibold border ${classes}`}>
      {gate}
    </span>
  );
}

export function StatusBadge({ status }: { status: string }) {
  const classes = statusColorMap[status] || statusColorMap["not-started"];
  const label = status.replace(/-/g, " ").replace(/\b\w/g, (c) => c.toUpperCase());
  return (
    <span className={`inline-flex items-center px-2.5 py-1 rounded-md text-xs font-semibold border ${classes}`}>
      {label}
    </span>
  );
}

export function VerdictBadge({ verdict }: { verdict: string }) {
  const classes = verdictColorMap[verdict] || "bg-muted/10 text-muted border-muted/20";
  return (
    <span className={`inline-flex items-center px-2.5 py-1 rounded-md text-xs font-bold border ${classes}`}>
      {verdict}
    </span>
  );
}
