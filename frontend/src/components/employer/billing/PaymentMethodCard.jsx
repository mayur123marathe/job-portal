import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { CreditCard, Edit } from "lucide-react"

const cardBrandIcons = {
  visa: "💳",
  mastercard: "💳",
  amex: "💳",
  discover: "💳",
}

export default function PaymentMethodCard({ paymentMethod, onUpdate }) {
  const { brand, last4, expiryMonth, expiryYear, isDefault } = paymentMethod

  return (
    <Card>
      <CardHeader>
        <div className="flex items-center justify-between">
          <CardTitle className="text-lg">Payment Method</CardTitle>
          {isDefault && (
            <Badge variant="secondary">Default</Badge>
          )}
        </div>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="flex items-center gap-4 p-4 border border-slate-200 rounded-lg">
          <div className="flex h-12 w-12 items-center justify-center rounded-lg bg-slate-100">
            <CreditCard className="h-6 w-6 text-slate-600" />
          </div>
          <div className="flex-1">
            <p className="font-medium text-slate-900 capitalize">
              {brand} •••• {last4}
            </p>
            <p className="text-sm text-slate-600">
              Expires {expiryMonth.toString().padStart(2, '0')}/{expiryYear}
            </p>
          </div>
        </div>

        <Button variant="outline" className="w-full" onClick={onUpdate}>
          <Edit className="mr-2 h-4 w-4" />
          Update Payment Method
        </Button>
      </CardContent>
    </Card>
  )
}
