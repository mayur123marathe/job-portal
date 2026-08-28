import { Card, CardContent } from "@/components/ui/card"
import { Skeleton } from "@/components/ui/skeleton"

export default function StatCard({ label, value, sub, icon: Icon, iconClass, isLoading }) {
  return (
    <Card>
      <CardContent className="p-5">
        {isLoading ? (
          <div className="space-y-2">
            <Skeleton className="h-4 w-24" />
            <Skeleton className="h-8 w-16" />
            <Skeleton className="h-3 w-20" />
          </div>
        ) : (
          <div className="flex items-start justify-between gap-3">
            <div>
              <p className="text-xs font-medium text-slate-500">{label}</p>
              <p className="text-3xl font-bold text-slate-900 mt-1 leading-none">{value}</p>
              {sub && <p className="text-xs text-slate-400 mt-1.5">{sub}</p>}
            </div>
            <div className={`flex h-10 w-10 shrink-0 items-center justify-center rounded-lg ${iconClass}`}>
              <Icon className="h-5 w-5" />
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  )
}
