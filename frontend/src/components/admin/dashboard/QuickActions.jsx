import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { UserPlus, Download, Send, Flag, RefreshCw, Lock } from "lucide-react"

const actions = [
  {
    label: "Add Admin",
    icon: UserPlus,
    color: "bg-blue-50 hover:bg-blue-100 text-blue-700 border-blue-200",
  },
  {
    label: "Export Data",
    icon: Download,
    color: "bg-emerald-50 hover:bg-emerald-100 text-emerald-700 border-emerald-200",
  },
  {
    label: "Newsletter",
    icon: Send,
    color: "bg-purple-50 hover:bg-purple-100 text-purple-700 border-purple-200",
  },
  {
    label: "Review Flags",
    icon: Flag,
    color: "bg-red-50 hover:bg-red-100 text-red-700 border-red-200",
  },
  {
    label: "Clear Cache",
    icon: RefreshCw,
    color: "bg-orange-50 hover:bg-orange-100 text-orange-700 border-orange-200",
  },
  {
    label: "Lock Portal",
    icon: Lock,
    color: "bg-slate-100 hover:bg-slate-200 text-slate-700 border-slate-200",
  },
]

export default function QuickActions() {
  return (
    <Card className="border-0 shadow-sm h-full">
      <CardHeader className="pb-3 border-b border-slate-100">
        <CardTitle className="text-base font-semibold text-slate-900">Quick Actions</CardTitle>
      </CardHeader>
      <CardContent className="p-5">
        <div className="grid grid-cols-2 gap-2.5">
          {actions.map((action) => {
            const Icon = action.icon
            return (
              <button
                key={action.label}
                className={`flex flex-col items-center gap-2 p-3.5 rounded-xl border text-xs font-semibold transition-all duration-150 active:scale-95 ${action.color}`}
              >
                <Icon className="h-4 w-4" />
                <span>{action.label}</span>
              </button>
            )
          })}
        </div>
      </CardContent>
    </Card>
  )
}
