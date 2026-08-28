import { Clock } from "lucide-react"

/**
 * Compact circular progress indicator for AI screening scores.
 *
 * Props:
 *   score  — number 0–100, or null/undefined (shows a clock placeholder)
 *   size   — diameter in px (default 44)
 *   stroke — ring thickness in px (default 4)
 */
export default function AiScoreCircle({ score, size = 44, stroke = 4 }) {
  if (score == null) {
    return (
      <span className="flex items-center gap-1 text-xs text-slate-400">
        <Clock className="h-3 w-3" /> —
      </span>
    )
  }

  const r     = (size - stroke) / 2
  const circ  = 2 * Math.PI * r
  const pct   = Math.min(100, Math.max(0, score))
  const offset = circ * (1 - pct / 100)
  const color  = pct >= 75 ? "#16a34a" : pct >= 50 ? "#d97706" : "#dc2626"

  return (
    <div className="relative" style={{ width: size, height: size }}>
      <svg width={size} height={size} className="-rotate-90">
        <circle
          cx={size / 2} cy={size / 2} r={r}
          fill="none" stroke="#e2e8f0" strokeWidth={stroke}
        />
        <circle
          cx={size / 2} cy={size / 2} r={r}
          fill="none" stroke={color} strokeWidth={stroke}
          strokeLinecap="round"
          strokeDasharray={circ}
          strokeDashoffset={offset}
        />
      </svg>
      <div className="absolute inset-0 flex items-center justify-center">
        <span className="text-[10px] font-bold" style={{ color }}>{pct}%</span>
      </div>
    </div>
  )
}
