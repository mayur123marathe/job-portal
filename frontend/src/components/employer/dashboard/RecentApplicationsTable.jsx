import { Link } from "react-router-dom"
import { useSelector } from "react-redux"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { ArrowRight } from "lucide-react"
import ApplicationsTable from "@/components/employer/applications/ApplicationsTable"

export default function RecentApplicationsTable() {
  const { applications, isLoading } = useSelector((s) => s.application)

  const recent = [...applications]
    .sort((a, b) => new Date(b.appliedAt) - new Date(a.appliedAt))
    .slice(0, 5)

  return (
    <Card className="border-slate-200 shadow-sm">
      <CardHeader className="flex flex-row items-center justify-between pb-3">
        <CardTitle className="text-base">Recent Applications</CardTitle>
        <Link to="/employer/applications">
          <Button variant="ghost" size="sm" className="text-brand hover:text-brand/80">
            View All
            <ArrowRight className="ml-2 h-4 w-4" />
          </Button>
        </Link>
      </CardHeader>
      <CardContent className="p-0">
        <ApplicationsTable
          applications={recent}
          isLoading={isLoading}
          emptyTitle="No applications yet"
          emptySubtitle="Applications will appear here once candidates apply."
        />
      </CardContent>
    </Card>
  )
}
