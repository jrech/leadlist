/**
 * A stylized, deterministic "redesigned homepage" illustration. There is no
 * image generation in this app — this stands in for what GPT Image would
 * return, cycled by "Replace Image". It's drawn, not a network image, so it
 * never fails to load and never claims to be a real render.
 */
const PALETTES = [
  { canvas: "#FAFAFA", ink: "#0A0A0A", accent: "#7C5CFC", muted: "#E4E4E7" },
  { canvas: "#F5F1EA", ink: "#2A2520", accent: "#8A6D4B", muted: "#E2D9CB" },
  { canvas: "#161221", ink: "#F4F1FA", accent: "#9B7FFE", muted: "#2C2640" },
  { canvas: "#FFFFFF", ink: "#111827", accent: "#16A34A", muted: "#E5E7EB" },
];

export function MockupPreviewArt({
  variant,
  className,
}: {
  variant: number;
  className?: string;
}) {
  const p = PALETTES[variant % PALETTES.length];

  return (
    <svg
      viewBox="0 0 400 260"
      className={className}
      role="img"
      aria-label="Sample redesign preview (illustrative placeholder)"
    >
      <rect width="400" height="260" rx="10" fill={p.canvas} />
      {/* browser chrome */}
      <rect width="400" height="22" rx="10" fill={p.muted} />
      <circle cx="14" cy="11" r="3" fill={p.accent} opacity="0.6" />
      <circle cx="24" cy="11" r="3" fill={p.ink} opacity="0.2" />
      <circle cx="34" cy="11" r="3" fill={p.ink} opacity="0.2" />
      <rect x="60" y="6" width="120" height="10" rx="5" fill={p.canvas} />

      {/* hero */}
      <rect x="24" y="40" width="160" height="10" rx="3" fill={p.ink} opacity="0.85" />
      <rect x="24" y="56" width="110" height="7" rx="3" fill={p.ink} opacity="0.45" />
      <rect x="24" y="78" width="64" height="20" rx="6" fill={p.accent} />
      <rect x="220" y="40" width="156" height="84" rx="8" fill={p.muted} />

      {/* content cards */}
      {[24, 142, 260].map((x) => (
        <g key={x}>
          <rect x={x} y="148" width="116" height="80" rx="8" fill={p.muted} />
          <rect x={x + 12} y="164" width="60" height="8" rx="3" fill={p.ink} opacity="0.7" />
          <rect x={x + 12} y="178" width="92" height="6" rx="3" fill={p.ink} opacity="0.35" />
          <rect x={x + 12} y="190" width="80" height="6" rx="3" fill={p.ink} opacity="0.35" />
        </g>
      ))}
    </svg>
  );
}
