import { Link } from "react-router-dom"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Crown, Calendar, CreditCard, TrendingUp } from "lucide-react"

export default function CurrentPlanCard({ plan }) {
  const {
    name,
    price,
    billing,
    nextBillingDate,
    status,
    features
  } = plan

  const statusConfig = {
    active: { label: "Active", variant: "success" },
    trial: { label: "Trial", variant: "warning" },
    expired: { label: "Expired", variant: "destructive" },
    cancelled: { label: "Cancelled", variant: "secondary" },
  }

  const currentStatus = statusConfig[status] || statusConfig.active

  return (
    <Card className="border-2 border-blue-100 bg-gradient-to-br from-blue-50 to-white">
      <CardHeader>
        <div className="flex items-start justify-between">
          <div className="flex items-center gap-3">
            <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-brand text-white">
              <Crown className="h-6 w-6" />
            </div>
            <div>
              <CardTitle className="text-2xl">Current Plan</CardTitle>
              <p className="text-sm text-slate-600 mt-1">Manage your subscription</p>
            </div>
          </div>
          <Badge variant={currentStatus.variant} className="text-sm px-3 py-1">
            {currentStatus.label}
          </Badge>
        </div>
      </CardHeader>
      <CardContent className="space-y-6">
        {/* Plan Details */}
        <div className="space-y-4">
          <div className="flex items-baseline gap-2">
            <h3 className="text-3xl font-bold text-slate-900">{name}</h3>
            {name !== "Free" && (
              <span className="text-slate-500">Plan</span>
            )}
          </div>

          <div className="flex items-baseline gap-2">
            <span className="text-4xl font-bold text-slate-900">
              ${price}
            </span>
            {billing && (
              <span className="text-slate-600">
                / {billing}
              </span>
            )}
          </div>

          {nextBillingDate && (
            <div className="flex items-center gap-2 text-sm text-slate-600">
              <Calendar className="h-4 w-4" />
              <span>
                Next billing: <span className="font-medium text-slate-900">{nextBillingDate}</span>
              </span>
            </div>
          )}

          {billing && (
            <div className="flex items-center gap-2 text-sm text-slate-600">
              <CreditCard className="h-4 w-4" />
              <span>
                Billing cycle: <span className="font-medium text-slate-900">Monthly</span>
              </span>
            </div>
          )}
        </div>

        {/* Features Included */}
        {features && features.length > 0 && (
          <div className="space-y-2">
            <p className="text-sm font-medium text-slate-700">Plan includes:</p>
            <ul className="space-y-1.5">
              {features.slice(0, 3).map((feature, index) => (
                <li key={index} className="flex items-center gap-2 text-sm text-slate-600">
                  <div className="h-1.5 w-1.5 rounded-full bg-brand" />
                  <span>{feature}</span>
                </li>
              ))}
            </ul>
          </div>
        )}

        {/* Actions */}
        <div className="flex flex-col sm:flex-row gap-3 pt-4">
          {name !== "Enterprise" && (
            <Link to="/employer/billing/plans" className="flex-1">
              <Button className="w-full" size="lg">
                <TrendingUp className="mr-2 h-4 w-4" />
                Upgrade Plan
              </Button>
            </Link>
          )}
          <Link to="/employer/billing/payment" className={name !== "Enterprise" ? "flex-1" : "w-full"}>
            <Button variant="outline" className="w-full" size="lg">
              Manage Billing
            </Button>
          </Link>
        </div>
      </CardContent>
    </Card>
  )
}
