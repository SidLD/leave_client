"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog"
import type { AbsenceOrUndertime, Employee } from "./type"

interface AbsenceDialogProps {
  employee: Employee
  onUpdate: (id: string, absenceData: AbsenceOrUndertime) => void
}

export const AbsenceDialog = ({ employee, onUpdate }: AbsenceDialogProps) => {
  const [absenceData, setAbsenceData] = useState<AbsenceOrUndertime>(
    employee.abesencesOrUndertime || {
      incluseiveDate: "",
      dayOrHr: "",
      cause: "",
      divisionAction: "",
      deduction: {
        basic: "",
        pOrA: "",
      },
    },
  )

  const handleChange = (field: string, value: string) => {
    if (field.includes(".")) {
      const [parent, child] = field.split(".")
      setAbsenceData({
        ...absenceData,
        [parent]: {
          ...(absenceData[parent as keyof AbsenceOrUndertime] as any),
          [child]: value,
        },
      })
    } else {
      setAbsenceData({
        ...absenceData,
        [field]: value,
      })
    }
  }

  const handleSave = () => {
    onUpdate(employee.id, absenceData)
  }

  return (
    <Dialog>
      <DialogTrigger asChild>
        <Button variant="outline" size="sm">
          {employee.abesencesOrUndertime?.incluseiveDate ? "Edit" : "Add"} Absence
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[500px]">
        <DialogHeader>
          <DialogTitle>Absence/Undertime Details for {employee.user.name}</DialogTitle>
        </DialogHeader>
        <div className="grid gap-4 py-4">
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <label className="text-sm font-medium">Inclusive Date</label>
              <Input
                value={absenceData.incluseiveDate}
                onChange={(e) => handleChange("incluseiveDate", e.target.value)}
                placeholder="e.g., March 15-16, 2024"
              />
            </div>
            <div className="space-y-2">
              <label className="text-sm font-medium">Days/Hours</label>
              <Input
                value={absenceData.dayOrHr}
                onChange={(e) => handleChange("dayOrHr", e.target.value)}
                placeholder="Number of days/hours"
              />
            </div>
          </div>
          <div className="space-y-2">
            <label className="text-sm font-medium">Cause</label>
            <Input
              value={absenceData.cause}
              onChange={(e) => handleChange("cause", e.target.value)}
              placeholder="Reason for absence"
            />
          </div>
          <div className="space-y-2">
            <label className="text-sm font-medium">Division Action</label>
            <Select value={absenceData.divisionAction} onValueChange={(value) => handleChange("divisionAction", value)}>
              <SelectTrigger>
                <SelectValue placeholder="Select action" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="Approved">Approved</SelectItem>
                <SelectItem value="Pending">Pending</SelectItem>
                <SelectItem value="Rejected">Rejected</SelectItem>
              </SelectContent>
            </Select>
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <label className="text-sm font-medium">Basic Deduction</label>
              <Input
                value={absenceData.deduction?.basic || ""}
                onChange={(e) => handleChange("deduction.basic", e.target.value)}
                placeholder="Amount"
              />
            </div>
            <div className="space-y-2">
              <label className="text-sm font-medium">PERA/ACA Deduction</label>
              <Input
                value={absenceData.deduction?.pOrA || ""}
                onChange={(e) => handleChange("deduction.pOrA", e.target.value)}
                placeholder="Amount"
              />
            </div>
          </div>
        </div>
        <div className="flex justify-end">
          <Button onClick={handleSave}>Save Changes</Button>
        </div>
      </DialogContent>
    </Dialog>
  )
}

