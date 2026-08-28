import { useState } from "react"
import { format } from "date-fns"
import { CalendarIcon } from "lucide-react"
import { Card, CardContent } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Button } from "@/components/ui/button"
import { Calendar } from "@/components/ui/calendar"
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover"
import { cn } from "@/lib/utils"
import { ChevronDownIcon } from "lucide-react"

export default function AdditionalDetails({
  expectedSalary,
  setExpectedSalary,
  availableFrom,
  setAvailableFrom,
}) {
  const [open, setOpen] = useState(false)
    const [date, setDate] = useState()

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-bold text-slate-900 mb-2">Additional Details</h2>
        <p className="text-slate-600">Provide salary expectations and availability (both optional)</p>
      </div>

      <Card>
        <CardContent className="p-6 space-y-6">
          {/* Expected Salary */}
          <div className="space-y-2">
            <Label>Expected Salary (INR)</Label>
            <div className="relative">
              <span className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-500 text-sm font-medium">₹</span>
              <Input
                type="number"
                min="0"
                placeholder="e.g. 80000"
                value={expectedSalary}
                onChange={(e) => setExpectedSalary(e.target.value)}
                className="pl-7"
              />
            </div>
          </div>

          {/* Available From */}
          <div className="space-y-2">
            <Label>Available From</Label>
            <Popover open={open} onOpenChange={setOpen}>
              <PopoverTrigger asChild>
                <Button
                  variant="outline"
                  className={cn(
                    "w-full justify-start text-left font-normal",
                    !availableFrom && "text-muted-foreground"
                  )}
                >
                  <CalendarIcon className="mr-2 size-4" />
                  {availableFrom ? format(availableFrom, "PPP") : "Pick a date"}
                </Button>
              </PopoverTrigger>
              <PopoverContent className="w-auto p-0" align="start">
                <Calendar
                  // className="[--cell-size:3rem]"
                  mode="single"
                  selected={availableFrom}
                  onSelect={(date) => {
                    setAvailableFrom(date)
                    setOpen(false)
                  }}
                  disabled={(date) => date < new Date(new Date().setHours(0, 0, 0, 0))}
                  initialFocus
                />
              </PopoverContent>
            </Popover>
          </div>
        </CardContent>
      </Card>

      
    </div>
  )
}
