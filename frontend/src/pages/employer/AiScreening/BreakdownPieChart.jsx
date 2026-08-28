import { PieChart, Pie, Cell, Label, Tooltip } from "recharts"
import { STATUS_CFG, STATUS_ORDER } from "./config"

export default function BreakdownPieChart({ dist, total, size = 180 }) {
  const data = STATUS_ORDER
    .map(s => ({ key: s, value: dist[s] || 0, fill: STATUS_CFG[s].color, label: STATUS_CFG[s].label }))
    .filter(d => d.value > 0)

  if (total === 0 || data.length === 0) {
    return (
      <div
        className="flex items-center justify-center rounded-full bg-slate-100 shrink-0"
        style={{ width: size, height: size }}
      >
        <span className="text-xs text-slate-400">No data</span>
      </div>
    )
  }

  return (
    <PieChart width={size} height={size} className="shrink-0">
      <Tooltip
        content={({ payload }) => {
          if (!payload?.length) return null
          const { label, value } = payload[0].payload
          return (
            <div className="rounded-lg border border-border/50 bg-background px-2.5 py-1.5 text-xs shadow-xl">
              <span className="font-medium">{label}</span>
              <span className="ml-2 font-mono tabular-nums text-muted-foreground">{value}</span>
            </div>
          )
        }}
      />
      <Pie
        data={data}
        cx={size / 2}
        cy={size / 2}
        innerRadius={size / 2 - 34}
        outerRadius={size / 2 - 6}
        startAngle={90}
        endAngle={-270}
        dataKey="value"
        strokeWidth={2}
        stroke="white"
      >
        {data.map(d => <Cell key={d.key} fill={d.fill} />)}
        <Label
          content={({ viewBox }) => {
            const { cx, cy } = viewBox
            return (
              <text textAnchor="middle">
                <tspan x={cx} y={cy - 5} fontSize={20} fontWeight="700" fill="#1e293b">{total}</tspan>
                <tspan x={cx} y={cy + 10} fontSize={10} fill="#94a3b8">total</tspan>
              </text>
            )
          }}
        />
      </Pie>
    </PieChart>
  )
}
