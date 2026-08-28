import { Card, CardContent, CardHeader } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Check, Sparkles } from "lucide-react"
import { cn } from "@/lib/utils"

export default function PlanCard({
  plan,
  billingCycle = "monthly",
  currentPlan = false,
  onSelectPlan,
  highlighted = false
}) {
  const { name, monthlyPrice, yearlyPrice, features, popular, description } = plan

  const price = billingCycle === "monthly" ? monthlyPrice : yearlyPrice
  const isEnterprise = name === "Enterprise"
  const isFree = name === "Free"

  return (
    <Card className={cn(
      "relative transition-all duration-300",
      highlighted && "border-2 border-brand shadow-xl scale-105",
      !highlighted && "hover:shadow-lg hover:scale-102"
    )}>
      {popular && (
        <div className="absolute -top-4 left-1/2 -translate-x-1/2">
          <Badge className="bg-gradient-to-r bg-brand text-white px-4 py-1 shadow-lg">
            <Sparkles className="mr-1 h-3 w-3" />
            Most Popular
          </Badge>
        </div>
      )}

      <CardHeader className={cn("text-center pb-8", popular && "pt-8")}>
        <h3 className="text-2xl font-bold text-slate-900">{name}</h3>
        {description && (
          <p className="text-sm text-slate-600 mt-2">{description}</p>
        )}
        <div className="mt-6">
          {isEnterprise ? (
            <div>
              <p className="text-4xl font-bold text-slate-900">Custom</p>
              <p className="text-sm text-slate-600 mt-2">Contact for pricing</p>
            </div>
          ) : (
            <>
              <div className="flex items-baseline justify-center gap-2">
                <span className="text-5xl font-bold text-slate-900">${price}</span>
                <span className="text-slate-600">/ {billingCycle === "monthly" ? "mo" : "yr"}</span>
              </div>
              {billingCycle === "yearly" && monthlyPrice > 0 && (
                <p className="text-sm text-green-600 mt-2 font-medium">
                  Save ${((monthlyPrice * 12) - yearlyPrice).toFixed(0)}/year
                </p>
              )}
            </>
          )}
        </div>
      </CardHeader>

      <CardContent>
        {/* Features List */}
        <ul className="space-y-3 mb-8">
          {features.map((feature, index) => (
            <li key={index} className="flex items-start gap-3">
              <Check className="h-5 w-5 text-brand flex-shrink-0 mt-0.5" />
              <span className="text-sm text-slate-700">{feature}</span>
            </li>
          ))}
        </ul>

        {/* CTA Button */}
        {currentPlan ? (
          <Button
            variant="outline"
            className="w-full"
            size="lg"
            disabled
          >
            Current Plan
          </Button>
        ) : isEnterprise ? (
          <Button
            variant={highlighted ? "default" : "outline"}
            className="w-full"
            size="lg"
            onClick={() => onSelectPlan && onSelectPlan(plan)}
          >
            Contact Sales
          </Button>
        ) : isFree ? (
          <Button
            variant="outline"
            className="w-full"
            size="lg"
            onClick={() => onSelectPlan && onSelectPlan(plan)}
          >
            Get Started
          </Button>
        ) : (
          <Button
            variant={highlighted ? "default" : "outline"}
            className={cn(
              "w-full",
              highlighted && "bg-brand hover:bg-brand/90 text-white"
            )}
            size="lg"
            onClick={() => onSelectPlan && onSelectPlan(plan)}
          >
            Upgrade to {name}
          </Button>
        )}
      </CardContent>
    </Card>
  )
}
