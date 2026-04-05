"use client";

interface Dimension {
  name: string;
  score: number;
}

export function RadarChart({ dimensions }: { dimensions: Dimension[] }) {
  const n = dimensions.length;
  const cx = 150;
  const cy = 150;
  const maxR = 120;
  const levels = 5;

  function polarToCart(angle: number, radius: number) {
    // Start from top (-90 degrees)
    const a = (angle - 90) * (Math.PI / 180);
    return { x: cx + radius * Math.cos(a), y: cy + radius * Math.sin(a) };
  }

  function getAngle(i: number) {
    return (360 / n) * i;
  }

  // Grid circles
  const gridPaths = Array.from({ length: levels }, (_, l) => {
    const r = (maxR / levels) * (l + 1);
    const pts = Array.from({ length: n }, (_, i) => {
      const p = polarToCart(getAngle(i), r);
      return `${p.x},${p.y}`;
    });
    return `M${pts.join("L")}Z`;
  });

  // Axis lines
  const axes = Array.from({ length: n }, (_, i) => {
    const p = polarToCart(getAngle(i), maxR);
    return { x1: cx, y1: cy, x2: p.x, y2: p.y };
  });

  // Data polygon
  const dataPts = dimensions.map((d, i) => {
    const r = (maxR / levels) * d.score;
    return polarToCart(getAngle(i), r);
  });
  const dataPath = `M${dataPts.map((p) => `${p.x},${p.y}`).join("L")}Z`;

  // Labels
  const labels = dimensions.map((d, i) => {
    const p = polarToCart(getAngle(i), maxR + 28);
    return { ...p, name: d.name, score: d.score };
  });

  return (
    <svg viewBox="0 0 300 300" className="w-full max-w-[360px] mx-auto">
      {/* Grid */}
      {gridPaths.map((path, i) => (
        <path
          key={i}
          d={path}
          fill="none"
          stroke="#0B1D2E"
          strokeWidth={i === levels - 1 ? 1.5 : 0.5}
          opacity={i === levels - 1 ? 0.3 : 0.12}
        />
      ))}

      {/* Axes */}
      {axes.map((a, i) => (
        <line key={i} {...a} stroke="#0B1D2E" strokeWidth={0.5} opacity={0.15} />
      ))}

      {/* Data fill */}
      <path d={dataPath} fill="#EF6B4A" fillOpacity={0.2} stroke="#EF6B4A" strokeWidth={2} />

      {/* Data points */}
      {dataPts.map((p, i) => (
        <circle key={i} cx={p.x} cy={p.y} r={3.5} fill="#EF6B4A" />
      ))}

      {/* Labels */}
      {labels.map((l, i) => {
        // Determine anchor based on position
        const anchor =
          Math.abs(l.x - cx) < 5 ? "middle" : l.x > cx ? "start" : "end";
        return (
          <text
            key={i}
            x={l.x}
            y={l.y}
            textAnchor={anchor}
            dominantBaseline="middle"
            className="text-[8px] fill-navy font-medium"
          >
            {l.name}
          </text>
        );
      })}

      {/* Center score labels */}
      {Array.from({ length: levels }, (_, l) => {
        const r = (maxR / levels) * (l + 1);
        return (
          <text
            key={l}
            x={cx + 4}
            y={cy - r + 3}
            className="text-[7px] fill-muted"
            textAnchor="start"
          >
            {l + 1}
          </text>
        );
      })}
    </svg>
  );
}
