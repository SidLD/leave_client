"use client"

import { useEffect, useState } from "react"
import { useQuery } from "@tanstack/react-query"
import { PDFDownloadLink } from "@react-pdf/renderer"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Loader2, FileDown } from "lucide-react"

// Import components and types
import { PayrollPDF } from "./_components/payroll-pdf"
import { AbsenceDialog } from "./_components/absence-dialog"
import { type PayrollPeriod, type AbsenceOrUndertime, months } from "./_components/type"
import { fetchUserPayoll } from "@/lib/api"
import { UseStore } from "@/store/app.store"

export default function PayrollReport() {
  const [selectedMonth, setSelectedMonth] = useState<string>(months[0])
  const [selectedYear, setSelectedYear] = useState<string>(new Date().getFullYear().toString())
  const [editableData, setEditableData] = useState<PayrollPeriod | null>(null)
  const [users, setUsers] = useState<string[]>([])
  const { getUsers } = UseStore()

  useEffect(() => {
    setUsers(getUsers())
    console.log(getUsers(), users)
  }, [getUsers])

  const { data, isLoading, error } = useQuery<PayrollPeriod, Error>({
    queryKey: ["payroll", selectedMonth, selectedYear, setUsers, getUsers, users],
    queryFn: () =>
      fetchUserPayoll({
        month: new Date(`${selectedMonth} 1, ${new Date().getFullYear()}`).getMonth() + 1,
        year: selectedYear,
        users: users,
      }).then((data) => data.data),
  })

  useEffect(() => {
    if (data) {
      setEditableData(data)
    }
  }, [data])

  const handleMonthChange = (value: string) => {
    setSelectedMonth(value)
  }

  const handleYearChange = (value: string) => {
    setSelectedYear(value)
  }

  const handleEmployeeUpdate = (employeeId: string, field: string, value: string) => {
    if (!editableData) return

    setEditableData({
      ...editableData,
      employees: editableData.employees.map((emp) => {
        if (emp.id === employeeId) {
          return { ...emp, [field]: value }
        }
        return emp
      }),
    })
  }

  const handleAbsenceUpdate = (employeeId: string, absenceData: AbsenceOrUndertime) => {
    if (!editableData) return

    setEditableData({
      ...editableData,
      employees: editableData.employees.map((emp) => {
        if (emp.id === employeeId) {
          return { ...emp, abesencesOrUndertime: absenceData }
        }
        return emp
      }),
    })
  }

  const handleApproverUpdate = (approverField: string, value: string) => {
    if (!editableData) return

    setEditableData({
      ...editableData,
      [approverField]: value,
    })
  }

  if (error) {
    return <div className="text-red-500">Error loading payroll data: {error.message}</div>
  }

  return (
    <div className="container p-4 mx-auto">
      <Card className="mb-6">
        <CardHeader className="pb-3">
          <CardTitle className="text-2xl">Payroll Report</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex items-center gap-4 mb-6">
            <div className="w-64">
              <label className="block mb-2 text-sm font-medium">Select Month</label>
              <Select value={selectedMonth} onValueChange={handleMonthChange}>
                <SelectTrigger>
                  <SelectValue placeholder="Select month" />
                </SelectTrigger>
                <SelectContent>
                  {months.map((month) => (
                    <SelectItem key={month} value={month}>
                      {month}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div className="w-40">
              <label className="block mb-2 text-sm font-medium">Select Year</label>
              <Select value={selectedYear} onValueChange={handleYearChange}>
                <SelectTrigger>
                  <SelectValue placeholder="Select year" />
                </SelectTrigger>
                <SelectContent>
                  {[...Array(5)].map((_, i) => {
                    const year = (new Date().getFullYear() - 2 + i).toString()
                    return (
                      <SelectItem key={year} value={year}>
                        {year}
                      </SelectItem>
                    )
                  })}
                </SelectContent>
              </Select>
            </div>

            {editableData && (
              <PDFDownloadLink
                document={<PayrollPDF data={editableData} />}
                fileName={`payroll-${selectedMonth.toLowerCase()}-${selectedYear}.pdf`}
                className="mt-6"
              >
                {({ loading }) => (
                  <Button disabled={loading}>
                    {loading ? (
                      <>
                        <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                        Generating PDF...
                      </>
                    ) : (
                      <>
                        <FileDown className="w-4 h-4 mr-2" />
                        Download PDF
                      </>
                    )}
                  </Button>
                )}
              </PDFDownloadLink>
            )}
          </div>

          <div className="mb-4">
            <h2 className="text-xl font-bold text-center">Department of Education</h2>
            <h3 className="text-center">Implementation of Programs for Basic Education</h3>
            <h3 className="text-center">Monthly Payroll Worksheet & Report of Service</h3>
            <h3 className="text-center">
              For the Month of {selectedMonth} {selectedYear}
            </h3>

            {editableData && (
              <div className="mt-4 space-y-4">
                <div className="flex items-center gap-2">
                  <label className="w-24 font-medium">Station:</label>
                  <Input
                    value={editableData.station}
                    onChange={(e) => setEditableData({ ...editableData, station: e.target.value })}
                    className="max-w-xs"
                  />
                </div>

                <div className="grid grid-cols-3 gap-4">
                  <div className="space-y-2">
                    <label className="font-medium">Approver 1:</label>
                    <Input
                      value={editableData.approverOne}
                      onChange={(e) => handleApproverUpdate("approverOne", e.target.value)}
                    />
                  </div>
                  <div className="space-y-2">
                    <label className="font-medium">Approver 2:</label>
                    <Input
                      value={editableData.approverTwo}
                      onChange={(e) => handleApproverUpdate("approverTwo", e.target.value)}
                    />
                  </div>
                  <div className="space-y-2">
                    <label className="font-medium">Approver 3:</label>
                    <Input
                      value={editableData.approverThree}
                      onChange={(e) => handleApproverUpdate("approverThree", e.target.value)}
                    />
                  </div>
                </div>
              </div>
            )}
          </div>

          {isLoading ? (
            <div className="flex items-center justify-center h-64">
              <Loader2 className="w-8 h-8 animate-spin" />
            </div>
          ) : editableData ? (
            <div className="overflow-x-auto">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead className="w-[100px]">Emp. ID</TableHead>
                    <TableHead className="w-[200px]">Name</TableHead>
                    <TableHead className="w-[200px]">Position Title</TableHead>
                    <TableHead className="w-[80px]">Status</TableHead>
                    <TableHead className="w-[120px]">PERA/ACA</TableHead>
                    <TableHead className="w-[120px]">Remarks</TableHead>
                    <TableHead className="w-[200px]">Absences/Undertime</TableHead>
                    <TableHead className="w-[100px]">Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {editableData.employees.map((employee) => (
                    <TableRow key={employee.id}>
                      <TableCell className="font-medium">{employee.user.employeeId}</TableCell>
                      <TableCell>{employee.user.name}</TableCell>
                      <TableCell>{employee.user.position}</TableCell>
                      <TableCell>
                        <Input
                          value={employee.s}
                          onChange={(e) => handleEmployeeUpdate(employee.id, "s", e.target.value)}
                          className="h-8 w-14"
                        />
                      </TableCell>
                      <TableCell>
                        <Input
                          value={employee.peraOrAca}
                          onChange={(e) => handleEmployeeUpdate(employee.id, "peraOrAca", e.target.value)}
                          className="h-8"
                        />
                      </TableCell>
                      <TableCell>
                        <Input
                          value={employee.remark}
                          onChange={(e) => handleEmployeeUpdate(employee.id, "remark", e.target.value)}
                          className="h-8"
                        />
                      </TableCell>
                      <TableCell>
                        {employee.abesencesOrUndertime?.incluseiveDate ? (
                          <div className="text-xs">
                            <p>
                              <strong>Date:</strong> {employee.abesencesOrUndertime.incluseiveDate}
                            </p>
                            <p>
                              <strong>Days/Hours:</strong> {employee.abesencesOrUndertime.dayOrHr}
                            </p>
                            <p>
                              <strong>Cause:</strong> {employee.abesencesOrUndertime.cause}
                            </p>
                            <p>
                              <strong>Deduction:</strong> Basic: {employee.abesencesOrUndertime.deduction.basic},
                              PERA/ACA: {employee.abesencesOrUndertime.deduction.pOrA}
                            </p>
                          </div>
                        ) : (
                          <span className="text-gray-500">No absences recorded</span>
                        )}
                      </TableCell>
                      <TableCell>
                        <AbsenceDialog employee={employee} onUpdate={handleAbsenceUpdate} />
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>
          ) : null}
        </CardContent>
      </Card>
    </div>
  )
}

