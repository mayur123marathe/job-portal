import { Card, CardContent } from "@/components/ui/card"

export default function StatsCard({ title, value, icon: Icon, loading }) {
  return (
    <Card className="border-slate-200 shadow-sm">
      <CardContent className="p-6">
        <div className="flex items-center justify-between">
          <div className="flex-1">
            <p className="text-sm font-medium text-slate-500">{title}</p>
            {loading ? (
              <div className="h-9 w-16 bg-slate-200 rounded-md animate-pulse mt-2" />
            ) : (
              <p className="text-3xl font-bold text-slate-900 mt-2">{value}</p>
            )}
          </div>
          {Icon && (
            <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-brand/10">
              <Icon className="h-6 w-6 text-brand" />
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  )
}
