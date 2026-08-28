import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Users } from "lucide-react"

export default function Candidates() {
  return (
    <div className="p-6 space-y-6">
      <div>
        <h1 className="text-3xl font-bold text-slate-900">Candidates Database</h1>
        <p className="text-slate-600 mt-1">
          Browse and search through all candidates
        </p>
      </div>

      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Users className="h-5 w-5" />
            Coming Soon
          </CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-slate-600">
            The candidates database feature is under development. You'll be able to browse,
            search, and filter through all candidates who have applied to your jobs.
          </p>
        </CardContent>
      </Card>
    </div>
  )
}
