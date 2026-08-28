import { useState } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Switch } from "@/components/ui/switch"
import PaymentMethodCard from "@/components/employer/billing/PaymentMethodCard"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import { ArrowLeft, Building2, Mail, MapPin, CreditCard } from "lucide-react"
import { Link } from "react-router-dom"

const paymentMethod = {
  brand: "visa",
  last4: "4242",
  expiryMonth: 12,
  expiryYear: 2027,
  isDefault: true,
}

const billingInfo = {
  companyName: "Tech Corp Inc.",
  billingEmail: "billing@techcorp.com",
  address: "123 Business Street",
  city: "San Francisco",
  state: "CA",
  zipCode: "94102",
  country: "United States",
  taxId: "12-3456789",
}

export default function PaymentDetails() {
  const [showUpdatePaymentModal, setShowUpdatePaymentModal] = useState(false)
  const [showUpdateBillingModal, setShowUpdateBillingModal] = useState(false)
  const [autoRenew, setAutoRenew] = useState(true)

  return (
    <div className="p-6 space-y-6">
      {/* Header */}
      <div>
        <Link
          to="/employer/billing"
          className="inline-flex items-center text-sm text-slate-600 hover:text-slate-900 mb-4"
        >
          <ArrowLeft className="mr-2 h-4 w-4" />
          Back to Billing
        </Link>
        <h1 className="text-3xl font-bold text-slate-900">Payment & Billing Details</h1>
        <p className="text-slate-600 mt-1">
          Manage your payment methods and billing information
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Payment Method */}
        <PaymentMethodCard
          paymentMethod={paymentMethod}
          onUpdate={() => setShowUpdatePaymentModal(true)}
        />

        {/* Billing Settings */}
        <Card>
          <CardHeader>
            <CardTitle className="text-lg">Billing Settings</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex items-center justify-between p-4 border border-slate-200 rounded-lg">
              <div>
                <p className="font-medium text-slate-900">Auto-renewal</p>
                <p className="text-sm text-slate-600">
                  Automatically renew subscription
                </p>
              </div>
              <Switch checked={autoRenew} onCheckedChange={setAutoRenew} />
            </div>

            <div className="p-4 border border-slate-200 rounded-lg">
              <div className="flex items-center justify-between mb-3">
                <p className="font-medium text-slate-900">Billing Cycle</p>
                <span className="text-sm text-slate-600 font-medium">Monthly</span>
              </div>
              <Link to="/employer/billing/plans">
                <Button variant="outline" size="sm" className="w-full">
                  Switch to Yearly (Save 20%)
                </Button>
              </Link>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Billing Information */}
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <CardTitle>Billing Information</CardTitle>
            <Button variant="outline" size="sm" onClick={() => setShowUpdateBillingModal(true)}>
              Edit
            </Button>
          </div>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-4">
              <div className="flex items-start gap-3">
                <Building2 className="h-5 w-5 text-slate-400 mt-0.5" />
                <div>
                  <p className="text-sm text-slate-600">Company Name</p>
                  <p className="font-medium text-slate-900">{billingInfo.companyName}</p>
                </div>
              </div>

              <div className="flex items-start gap-3">
                <Mail className="h-5 w-5 text-slate-400 mt-0.5" />
                <div>
                  <p className="text-sm text-slate-600">Billing Email</p>
                  <p className="font-medium text-slate-900">{billingInfo.billingEmail}</p>
                </div>
              </div>

              <div className="flex items-start gap-3">
                <CreditCard className="h-5 w-5 text-slate-400 mt-0.5" />
                <div>
                  <p className="text-sm text-slate-600">Tax/GST ID</p>
                  <p className="font-medium text-slate-900">{billingInfo.taxId}</p>
                </div>
              </div>
            </div>

            <div className="space-y-4">
              <div className="flex items-start gap-3">
                <MapPin className="h-5 w-5 text-slate-400 mt-0.5" />
                <div>
                  <p className="text-sm text-slate-600">Billing Address</p>
                  <p className="font-medium text-slate-900">{billingInfo.address}</p>
                  <p className="font-medium text-slate-900">
                    {billingInfo.city}, {billingInfo.state} {billingInfo.zipCode}
                  </p>
                  <p className="font-medium text-slate-900">{billingInfo.country}</p>
                </div>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Update Payment Method Modal */}
      <Dialog open={showUpdatePaymentModal} onOpenChange={setShowUpdatePaymentModal}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Update Payment Method</DialogTitle>
            <DialogDescription>
              Enter your new credit card details
            </DialogDescription>
          </DialogHeader>

          <div className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="cardNumber">Card Number</Label>
              <Input
                id="cardNumber"
                placeholder="1234 5678 9012 3456"
                maxLength="19"
              />
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="expiry">Expiry Date</Label>
                <Input id="expiry" placeholder="MM/YY" maxLength="5" />
              </div>
              <div className="space-y-2">
                <Label htmlFor="cvc">CVC</Label>
                <Input id="cvc" placeholder="123" maxLength="3" />
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="cardName">Cardholder Name</Label>
              <Input id="cardName" placeholder="John Doe" />
            </div>
          </div>

          <DialogFooter>
            <Button variant="outline" onClick={() => setShowUpdatePaymentModal(false)}>
              Cancel
            </Button>
            <Button onClick={() => setShowUpdatePaymentModal(false)}>
              Update Card
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Update Billing Info Modal */}
      <Dialog open={showUpdateBillingModal} onOpenChange={setShowUpdateBillingModal}>
        <DialogContent className="max-w-2xl">
          <DialogHeader>
            <DialogTitle>Update Billing Information</DialogTitle>
            <DialogDescription>
              Update your company and billing address details
            </DialogDescription>
          </DialogHeader>

          <div className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="company">Company Name</Label>
              <Input id="company" defaultValue={billingInfo.companyName} />
            </div>

            <div className="space-y-2">
              <Label htmlFor="email">Billing Email</Label>
              <Input id="email" type="email" defaultValue={billingInfo.billingEmail} />
            </div>

            <div className="space-y-2">
              <Label htmlFor="address">Address</Label>
              <Input id="address" defaultValue={billingInfo.address} />
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="city">City</Label>
                <Input id="city" defaultValue={billingInfo.city} />
              </div>
              <div className="space-y-2">
                <Label htmlFor="state">State/Province</Label>
                <Input id="state" defaultValue={billingInfo.state} />
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="zip">ZIP/Postal Code</Label>
                <Input id="zip" defaultValue={billingInfo.zipCode} />
              </div>
              <div className="space-y-2">
                <Label htmlFor="country">Country</Label>
                <Input id="country" defaultValue={billingInfo.country} />
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="tax">Tax/GST ID</Label>
              <Input id="tax" defaultValue={billingInfo.taxId} />
            </div>
          </div>

          <DialogFooter>
            <Button variant="outline" onClick={() => setShowUpdateBillingModal(false)}>
              Cancel
            </Button>
            <Button onClick={() => setShowUpdateBillingModal(false)}>
              Save Changes
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  )
}
