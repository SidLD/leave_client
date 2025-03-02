"use client"

import type React from "react"
import { useState } from "react"
import { Download } from "lucide-react"

// Types
interface Employee {
  empNo: string
  name: string
  positionTitle: string
  status: string
  basic: number
  pera: number
  absences: string
  cause: string
  divisionAction: string
  deductions: string
  remarks: string
}

interface PayrollData {
  station: string
  school: string
  month: string
  year: string
  preparedBy: {
    name: string
    position: string
  }
  certifiedBy: {
    name: string
    position: string
  }
  approvedBy: {
    name: string
    position: string
  }
  employees: Employee[]
}

// Dummy data
const dummyData: PayrollData = {
  station: "008 TINAMBACAN II DISTRICT",
  school: "MANGUINO-O ELEMENTARY SCHOOL (INSULAR)",
  month: "JANUARY",
  year: "2025",
  preparedBy: {
    name: "ROBIRTH M. ORNOPIA",
    position: "Teacher-In-Charge/Master Teacher I",
  },
  certifiedBy: {
    name: "ELBERT G. ONGCAL",
    position: "Public Schools District Supervisor",
  },
  approvedBy: {
    name: "GRACE S. PAGUNSAN",
    position: "Administrative Officer V",
  },
  employees: [
    {
      empNo: "6295487",
      name: "BANGCALE, NAOMI T.",
      positionTitle: "AO II",
      status: "P",
      basic: 30024.0,
      pera: 2000.0,
      absences: "14",
      cause: "1 DAY",
      divisionAction: "SL",
      deductions: "01-567",
      remarks: "WITH PAY",
    },
    {
      empNo: "6295488",
      name: "DELA CRUZ, JUAN C.",
      positionTitle: "TEACHER III",
      status: "P",
      basic: 29242.0,
      pera: 2000.0,
      absences: "0",
      cause: "",
      divisionAction: "",
      deductions: "",
      remarks: "",
    },
    {
      empNo: "6295489",
      name: "SANTOS, MARIA L.",
      positionTitle: "TEACHER II",
      status: "P",
      basic: 27828.0,
      pera: 2000.0,
      absences: "7",
      cause: "2 DAYS",
      divisionAction: "VL",
      deductions: "01-568",
      remarks: "WITH PAY",
    },
  ],
}

const months = [
  "JANUARY",
  "FEBRUARY",
  "MARCH",
  "APRIL",
  "MAY",
  "JUNE",
  "JULY",
  "AUGUST",
  "SEPTEMBER",
  "OCTOBER",
  "NOVEMBER",
  "DECEMBER",
]

export default function PayrollWorksheet() {
  const [data, setData] = useState<PayrollData>(dummyData)
  const [selectedMonth, setSelectedMonth] = useState(data.month)

  const handleMonthChange = (event: React.ChangeEvent<HTMLSelectElement>) => {
    const newMonth = event.target.value
    setSelectedMonth(newMonth)
    setData((prevData) => ({ ...prevData, month: newMonth }))
    // Here you would typically fetch new data based on the selected month
    // For now, we're just updating the month in the state
  }

  return (
    <main className="min-h-screen p-4 bg-gray-50">
      <div className="max-w-[1200px] mx-auto">
        <div className="flex items-center justify-between mb-4">
          <select value={selectedMonth} onChange={handleMonthChange} className="p-2 border border-gray-300 rounded">
            {months.map((month) => (
              <option key={month} value={month}>
                {month}
              </option>
            ))}
          </select>
          <button className="flex items-center gap-2 px-4 py-2 text-white transition-colors bg-blue-600 rounded hover:bg-blue-700">
            <Download className="w-4 h-4" />
            Download PDF
          </button>
        </div>

        <div className="p-4 bg-white rounded-lg shadow-lg md:p-8">
          {/* Header */}
          <div className="mb-6 text-center">
            <div className="w-16 h-16 mx-auto mb-2 bg-gray-200 rounded-full"></div>
            <p className="text-xs">Republic of the Philippines</p>
            <h1 className="text-lg font-bold md:text-xl">Department of Education</h1>
            <p className="text-xs">REGION VIII</p>
            <p className="text-xs">SCHOOLS DIVISION OF CALBAYOG CITY</p>
            <p className="mt-2 text-xs">Implementation of Programs for Basic Education</p>
            <p className="text-xs">Monthly Payroll Worksheet & Report of Service</p>
            <p className="mt-2 text-sm font-bold">
              For the Month of {data.month} {data.year}
            </p>
          </div>

          {/* School Info */}
          <div className="mb-4 text-sm">
            <p>
              <span className="font-semibold">Station: </span>
              {data.station}
            </p>
            <p>
              <span className="font-semibold">School: </span>
              {data.school}
            </p>
          </div>

          {/* Table */}
          <div className="overflow-x-auto">
            <table className="w-full text-xs border border-collapse border-gray-300 md:text-sm">
              <thead>
                <tr className="bg-gray-50">
                  <th className="px-1 py-1 text-left border border-gray-300">Emp. #</th>
                  <th className="px-1 py-1 text-left border border-gray-300">Name</th>
                  <th className="px-1 py-1 text-left border border-gray-300">Position Title</th>
                  <th className="px-1 py-1 text-center border border-gray-300">Status</th>
                  <th className="px-1 py-1 text-right border border-gray-300">Basic</th>
                  <th className="px-1 py-1 text-right border border-gray-300">PERA/ACA</th>
                  <th className="px-1 py-1 text-center border border-gray-300">Absences/ Undertime</th>
                  <th className="px-1 py-1 text-center border border-gray-300">Cause</th>
                  <th className="px-1 py-1 text-center border border-gray-300">Division Action</th>
                  <th className="px-1 py-1 text-center border border-gray-300">Deductions</th>
                  <th className="px-1 py-1 text-center border border-gray-300">Remarks</th>
                </tr>
              </thead>
              <tbody>
                {data.employees.map((employee) => (
                  <tr key={employee.empNo}>
                    <td className="px-1 py-1 border border-gray-300">{employee.empNo}</td>
                    <td className="px-1 py-1 border border-gray-300">{employee.name}</td>
                    <td className="px-1 py-1 border border-gray-300">{employee.positionTitle}</td>
                    <td className="px-1 py-1 text-center border border-gray-300">{employee.status}</td>
                    <td className="px-1 py-1 text-right border border-gray-300">
                      {employee.basic.toLocaleString("en-PH", { minimumFractionDigits: 2 })}
                    </td>
                    <td className="px-1 py-1 text-right border border-gray-300">
                      {employee.pera.toLocaleString("en-PH", { minimumFractionDigits: 2 })}
                    </td>
                    <td className="px-1 py-1 text-center border border-gray-300">{employee.absences}</td>
                    <td className="px-1 py-1 text-center border border-gray-300">{employee.cause}</td>
                    <td className="px-1 py-1 text-center border border-gray-300">{employee.divisionAction}</td>
                    <td className="px-1 py-1 text-center border border-gray-300">{employee.deductions}</td>
                    <td className="px-1 py-1 text-center border border-gray-300">{employee.remarks}</td>
                  </tr>
                ))}
                {/* Empty rows */}
                {[...Array(7)].map((_, index) => (
                  <tr key={`empty-${index}`}>
                    {[...Array(11)].map((_, cellIndex) => (
                      <td key={`empty-cell-${cellIndex}`} className="px-1 py-1 border border-gray-300">
                        &nbsp;
                      </td>
                    ))}
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {/* Signatures */}
          <div className="grid grid-cols-1 gap-4 mt-8 text-sm md:grid-cols-3 md:gap-8">
            <div className="text-center">
              <p className="mb-2">PREPARED BY:</p>
              <div className="min-h-[40px] flex items-end justify-center border-b border-black">
                <p className="font-bold">{data.preparedBy.name}</p>
              </div>
              <p className="mt-1 text-xs">{data.preparedBy.position}</p>
            </div>
            <div className="text-center">
              <p className="mb-2">CERTIFIED CORRECT:</p>
              <div className="min-h-[40px] flex items-end justify-center border-b border-black">
                <p className="font-bold">{data.certifiedBy.name}</p>
              </div>
              <p className="mt-1 text-xs">{data.certifiedBy.position}</p>
            </div>
            <div className="text-center">
              <p className="mb-2">APPROVED:</p>
              <div className="min-h-[40px] flex items-end justify-center border-b border-black">
                <p className="font-bold">{data.approvedBy.name}</p>
              </div>
              <p className="mt-1 text-xs">{data.approvedBy.position}</p>
            </div>
          </div>

          {/* Page Number */}
          <div className="mt-8">
            <p className="text-xs">1 of 1</p>
          </div>
        </div>
      </div>
    </main>
  )
}

