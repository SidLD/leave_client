"use client"

import { useState, useEffect } from "react"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import { Edit, Trash2, MoreVertical, Eye, Search, Filter, Download } from "lucide-react"
import { format } from "date-fns"
import { useQuery } from "@tanstack/react-query"
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog"
import { useNavigate } from "react-router-dom"

// Using the provided LeaveReportType
export type LeaveReportType = {
  id?: string
  detailsOfApplication: {
    leaveDuration: {
      inclusiveDates: string[]
      numberOfDays: number
      commutationRequested: boolean
      commutationNotRequested: boolean
    }
  }

  certifiedLeaveCredit: {
    asOf: string
    totalEarnedVacationLeave: number
    totalEarnedSickLeave: number
    lessThisApplicationVacationLeave: number
    lessThisApplicationSickLeave: number
  }

  reccomendation: {
    approval?: boolean
    disapproval?: boolean
    disapprovalDetail?: string
  }

  commutation: {
    forApproval?: string | null
    forDisApproval?: string | null
  }

  approvedFor: {
    dasyWithPay: number
    daysWithoutPay: number
  }

  disapproveFor?: string | null
  specialOrderNo?: string | null
  date: string
  period: string
  approverName: string
  approverDesignation: string
}

// Add status for the table display
type LeaveReportDisplay = LeaveReportType & {
  id: string // Make id required for display
  status: "pending" | "approved" | "declined"
  updatedAt: string
}

// Mock function to fetch leave reports
const fetchLeaveReports = async (): Promise<LeaveReportDisplay[]> => {
  // This would be replaced with an actual API call
  return new Promise((resolve) => {
    setTimeout(() => {
      resolve([
        {
          id: "LR-2025-001",
          status: "pending",
          detailsOfApplication: {
            leaveDuration: {
              inclusiveDates: ["2025-03-01", "2025-03-02", "2025-03-03", "2025-03-04", "2025-03-05"],
              numberOfDays: 5,
              commutationRequested: false,
              commutationNotRequested: true,
            },
          },
          certifiedLeaveCredit: {
            asOf: new Date().toISOString(),
            totalEarnedVacationLeave: 15,
            totalEarnedSickLeave: 15,
            lessThisApplicationVacationLeave: 5,
            lessThisApplicationSickLeave: 0,
          },
          reccomendation: {
            approval: false,
            disapproval: false,
          },
          commutation: {
            forApproval: null,
            forDisApproval: null,
          },
          approvedFor: {
            dasyWithPay: 0,
            daysWithoutPay: 0,
          },
          date: new Date().toISOString(),
          period: "March 1-5, 2025",
          specialOrderNo: null,
          approverName: "Jane Smith",
          approverDesignation: "Principal",
          updatedAt: new Date(Date.now() - 86400000 * 2).toISOString(),
        },
        {
          id: "LR-2025-002",
          status: "approved",
          detailsOfApplication: {
            leaveDuration: {
              inclusiveDates: ["2025-03-10", "2025-03-11", "2025-03-12"],
              numberOfDays: 3,
              commutationRequested: true,
              commutationNotRequested: false,
            },
          },
          certifiedLeaveCredit: {
            asOf: new Date(Date.now() - 86400000 * 5).toISOString(),
            totalEarnedVacationLeave: 15,
            totalEarnedSickLeave: 15,
            lessThisApplicationVacationLeave: 0,
            lessThisApplicationSickLeave: 3,
          },
          reccomendation: {
            approval: true,
            disapproval: false,
          },
          commutation: {
            forApproval: "Approved for commutation",
            forDisApproval: null,
          },
          approvedFor: {
            dasyWithPay: 3,
            daysWithoutPay: 0,
          },
          date: new Date(Date.now() - 86400000 * 3).toISOString(),
          period: "March 10-12, 2025",
          specialOrderNo: "SO-2025-042",
          approverName: "Robert Johnson",
          approverDesignation: "Superintendent",
          updatedAt: new Date(Date.now() - 86400000 * 3).toISOString(),
        },
        {
          id: "LR-2025-003",
          status: "declined",
          detailsOfApplication: {
            leaveDuration: {
              inclusiveDates: ["2025-03-15", "2025-03-16"],
              numberOfDays: 2,
              commutationRequested: false,
              commutationNotRequested: true,
            },
          },
          certifiedLeaveCredit: {
            asOf: new Date(Date.now() - 86400000 * 7).toISOString(),
            totalEarnedVacationLeave: 0,
            totalEarnedSickLeave: 0,
            lessThisApplicationVacationLeave: 0,
            lessThisApplicationSickLeave: 0,
          },
          reccomendation: {
            approval: false,
            disapproval: true,
            disapprovalDetail: "Insufficient leave credits",
          },
          commutation: {
            forApproval: null,
            forDisApproval: "Disapproved due to insufficient leave credits",
          },
          approvedFor: {
            dasyWithPay: 0,
            daysWithoutPay: 0,
          },
          disapproveFor: "Insufficient leave credits",
          date: new Date(Date.now() - 86400000 * 6).toISOString(),
          period: "March 15-16, 2025",
          specialOrderNo: "SO-2025-043",
          approverName: "Susan Brown",
          approverDesignation: "HR Director",
          updatedAt: new Date(Date.now() - 86400000 * 6).toISOString(),
        },
      ])
    }, 200) // Fast loading
  })
}

// Mock function to delete a leave report
const deleteLeaveReport = async (id: string): Promise<void> => {
  return new Promise((resolve) => {
    setTimeout(() => {
      console.log(`Deleted report with ID: ${id}`)
      resolve()
    }, 200)
  })
}

export default function LeaveReportsTable() {
  const router = useNavigate()
  const [searchTerm, setSearchTerm] = useState("")
  const [statusFilter, setStatusFilter] = useState<string | null>(null)
  const [filteredReports, setFilteredReports] = useState<LeaveReportDisplay[]>([])

  // Using React Query for data fetching with optimized settings
  const {
    data: reports,
    isLoading,
    isError,
    refetch,
  } = useQuery({
    queryKey: ["leaveReports"],
    queryFn: fetchLeaveReports,
    staleTime: 5 * 60 * 1000, // 5 minutes
    refetchOnWindowFocus: false,
  })

  // Filter reports based on search term and status
  useEffect(() => {
    if (!reports) return

    let filtered = [...reports]

    // Apply search filter
    if (searchTerm) {
      const lowerCaseSearch = searchTerm.toLowerCase()
      filtered = filtered.filter(
        (report) =>
          report.id.toLowerCase().includes(lowerCaseSearch) ||
          report.period.toLowerCase().includes(lowerCaseSearch) ||
          report.specialOrderNo?.toLowerCase().includes(lowerCaseSearch) ||
          report.approverName.toLowerCase().includes(lowerCaseSearch),
      )
    }

    // Apply status filter
    if (statusFilter && statusFilter !== "all") {
      filtered = filtered.filter((report) => report.status === statusFilter)
    }

    setFilteredReports(filtered)
  }, [reports, searchTerm, statusFilter])

  const getStatusBadge = (status: string) => {
    switch (status) {
      case "pending":
        return (
          <Badge variant="outline" className="text-yellow-800 bg-yellow-100 border-yellow-300">
            Pending
          </Badge>
        )
      case "approved":
        return (
          <Badge variant="outline" className="text-green-800 bg-green-100 border-green-300">
            Approved
          </Badge>
        )
      case "declined":
        return (
          <Badge variant="outline" className="text-red-800 bg-red-100 border-red-300">
            Declined
          </Badge>
        )
      default:
        return <Badge variant="outline">Unknown</Badge>
    }
  }

  const getRecommendationStatus = (report: LeaveReportDisplay) => {
    if (report.reccomendation.approval) return "Approved"
    if (report.reccomendation.disapproval) return "Disapproved"
    return "Pending"
  }

  const getCommutationStatus = (report: LeaveReportDisplay) => {
    if (report.commutation.forApproval) return "Approved"
    if (report.commutation.forDisApproval) return "Disapproved"
    if (report.detailsOfApplication.leaveDuration.commutationRequested) return "Requested"
    return "Not Requested"
  }

  const handleEdit = (id: string) => {
    router(`/user/report/application/${id}`)
  }

  const handleDelete = async (id: string) => {
    try {
      await deleteLeaveReport(id)
      refetch()
    } catch (error) {
      console.error("Error deleting report:", error)
    }
  }

  const handleDownload = (id: string) => {
    console.log(`Downloading PDF for report ${id}`)
    // This would trigger the PDF download functionality
  }

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="w-12 h-12 border-b-2 rounded-full animate-spin border-primary"></div>
      </div>
    )
  }

  if (isError) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="text-red-500">Error loading leave reports. Please try again later.</div>
      </div>
    )
  }

  return (
    <div className="container py-8 mx-auto">
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <div>
              <CardTitle>Leave Reports</CardTitle>
              <CardDescription>View and manage leave reports</CardDescription>
            </div>
            <Button onClick={() => router(`/user/report/application/new`)}>New Report</Button>
          </div>
        </CardHeader>
        <CardContent>
          <div className="flex flex-col gap-4 mb-6 md:flex-row">
            <div className="relative flex-1">
              <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Search by ID, period, or approver..."
                className="pl-8"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>
            <div className="flex items-center gap-2">
              <Filter className="w-4 h-4 text-muted-foreground" />
              <Select value={statusFilter || "all"} onValueChange={(value) => setStatusFilter(value)}>
                <SelectTrigger className="w-[180px]">
                  <SelectValue placeholder="Filter by status" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Statuses</SelectItem>
                  <SelectItem value="pending">Pending</SelectItem>
                  <SelectItem value="approved">Approved</SelectItem>
                  <SelectItem value="declined">Declined</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>

          <div className="border rounded-md">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>ID</TableHead>
                  <TableHead>Period</TableHead>
                  <TableHead>Days</TableHead>
                  <TableHead>Special Order</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead>Recommendation</TableHead>
                  <TableHead>Commutation</TableHead>
                  <TableHead className="text-right">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredReports.length === 0 ? (
                  <TableRow>
                    <TableCell colSpan={8} className="py-6 text-center text-muted-foreground">
                      No leave reports found
                    </TableCell>
                  </TableRow>
                ) : (
                  filteredReports.map((report) => (
                    <TableRow key={report.id}>
                      <TableCell className="font-medium">{report.id}</TableCell>
                      <TableCell>{report.period}</TableCell>
                      <TableCell>{report.detailsOfApplication.leaveDuration.numberOfDays}</TableCell>
                      <TableCell>{report.specialOrderNo || "—"}</TableCell>
                      <TableCell>{getStatusBadge(report.status)}</TableCell>
                      <TableCell>{getRecommendationStatus(report)}</TableCell>
                      <TableCell>{getCommutationStatus(report)}</TableCell>
                      <TableCell className="text-right">
                        <DropdownMenu>
                          <DropdownMenuTrigger asChild>
                            <Button variant="ghost" size="icon">
                              <MoreVertical className="w-4 h-4" />
                              <span className="sr-only">Open menu</span>
                            </Button>
                          </DropdownMenuTrigger>
                          <DropdownMenuContent align="end">
                            <Dialog>
                              <DialogTrigger asChild>
                                <DropdownMenuItem onSelect={(e) => e.preventDefault()}>
                                  <Eye className="w-4 h-4 mr-2" />
                                  View Details
                                </DropdownMenuItem>
                              </DialogTrigger>
                              <DialogContent className="max-w-3xl max-h-[90vh] overflow-y-auto">
                                <DialogHeader>
                                  <DialogTitle>Leave Report Details</DialogTitle>
                                </DialogHeader>
                                <div className="grid gap-4 py-4">
                                  <div className="grid grid-cols-2 gap-4">
                                    <div>
                                      <h3 className="font-semibold">Report ID</h3>
                                      <p>{report.id}</p>
                                    </div>
                                    <div>
                                      <h3 className="font-semibold">Status</h3>
                                      <p>{getStatusBadge(report.status)}</p>
                                    </div>
                                  </div>

                                  <div className="grid grid-cols-2 gap-4">
                                    <div>
                                      <h3 className="font-semibold">Period</h3>
                                      <p>{report.period}</p>
                                    </div>
                                    <div>
                                      <h3 className="font-semibold">Number of Days</h3>
                                      <p>{report.detailsOfApplication.leaveDuration.numberOfDays}</p>
                                    </div>
                                  </div>

                                  <div className="grid grid-cols-2 gap-4">
                                    <div>
                                      <h3 className="font-semibold">Special Order No.</h3>
                                      <p>{report.specialOrderNo || "Not assigned"}</p>
                                    </div>
                                    <div>
                                      <h3 className="font-semibold">Date</h3>
                                      <p>{format(new Date(report.date), "MMMM d, yyyy")}</p>
                                    </div>
                                  </div>

                                  <div className="grid grid-cols-2 gap-4">
                                    <div>
                                      <h3 className="font-semibold">Approver</h3>
                                      <p>{report.approverName}</p>
                                    </div>
                                    <div>
                                      <h3 className="font-semibold">Designation</h3>
                                      <p>{report.approverDesignation}</p>
                                    </div>
                                  </div>

                                  <div>
                                    <h3 className="font-semibold">Recommendation</h3>
                                    <p>{getRecommendationStatus(report)}</p>
                                    {report.reccomendation.disapprovalDetail && (
                                      <p className="mt-1 text-sm text-red-600">
                                        Reason: {report.reccomendation.disapprovalDetail}
                                      </p>
                                    )}
                                  </div>

                                  <div>
                                    <h3 className="font-semibold">Commutation</h3>
                                    <p>{getCommutationStatus(report)}</p>
                                  </div>

                                  <div className="grid grid-cols-2 gap-4">
                                    <div>
                                      <h3 className="font-semibold">Days with Pay</h3>
                                      <p>{report.approvedFor.dasyWithPay}</p>
                                    </div>
                                    <div>
                                      <h3 className="font-semibold">Days without Pay</h3>
                                      <p>{report.approvedFor.daysWithoutPay}</p>
                                    </div>
                                  </div>

                                  <div>
                                    <h3 className="font-semibold">
                                      Leave Credits as of{" "}
                                      {format(new Date(report.certifiedLeaveCredit.asOf), "MMM d, yyyy")}
                                    </h3>
                                    <div className="grid grid-cols-3 gap-2 mt-2 text-sm">
                                      <div className="font-medium">Type</div>
                                      <div className="font-medium">Vacation</div>
                                      <div className="font-medium">Sick</div>

                                      <div>Total Earned</div>
                                      <div>{report.certifiedLeaveCredit.totalEarnedVacationLeave}</div>
                                      <div>{report.certifiedLeaveCredit.totalEarnedSickLeave}</div>

                                      <div>Less this Application</div>
                                      <div>{report.certifiedLeaveCredit.lessThisApplicationVacationLeave}</div>
                                      <div>{report.certifiedLeaveCredit.lessThisApplicationSickLeave}</div>

                                      <div>Balance</div>
                                      <div>
                                        {report.certifiedLeaveCredit.totalEarnedVacationLeave -
                                          report.certifiedLeaveCredit.lessThisApplicationVacationLeave}
                                      </div>
                                      <div>
                                        {report.certifiedLeaveCredit.totalEarnedSickLeave -
                                          report.certifiedLeaveCredit.lessThisApplicationSickLeave}
                                      </div>
                                    </div>
                                  </div>
                                </div>
                                <div className="flex justify-end">
                                  <Button
                                    variant="outline"
                                    onClick={() => handleDownload(report.id)}
                                    className="flex items-center gap-2"
                                  >
                                    <Download className="w-4 h-4" />
                                    Download PDF
                                  </Button>
                                </div>
                              </DialogContent>
                            </Dialog>

                            {report.status === "pending" && (
                              <DropdownMenuItem onClick={() => handleEdit(report.id)}>
                                <Edit className="w-4 h-4 mr-2" />
                                Edit
                              </DropdownMenuItem>
                            )}

                            {report.status === "declined" && (
                              <AlertDialog>
                                <AlertDialogTrigger asChild>
                                  <DropdownMenuItem onSelect={(e) => e.preventDefault()} className="text-red-600">
                                    <Trash2 className="w-4 h-4 mr-2" />
                                    Delete
                                  </DropdownMenuItem>
                                </AlertDialogTrigger>
                                <AlertDialogContent>
                                  <AlertDialogHeader>
                                    <AlertDialogTitle>Are you sure?</AlertDialogTitle>
                                    <AlertDialogDescription>
                                      This will permanently delete this leave report. This action cannot be undone.
                                    </AlertDialogDescription>
                                  </AlertDialogHeader>
                                  <AlertDialogFooter>
                                    <AlertDialogCancel>Cancel</AlertDialogCancel>
                                    <AlertDialogAction
                                      onClick={() => handleDelete(report.id)}
                                      className="bg-red-600 hover:bg-red-700"
                                    >
                                      Delete
                                    </AlertDialogAction>
                                  </AlertDialogFooter>
                                </AlertDialogContent>
                              </AlertDialog>
                            )}

                            <DropdownMenuItem onClick={() => handleDownload(report.id)}>
                              <Download className="w-4 h-4 mr-2" />
                              Download PDF
                            </DropdownMenuItem>
                          </DropdownMenuContent>
                        </DropdownMenu>
                      </TableCell>
                    </TableRow>
                  ))
                )}
              </TableBody>
            </Table>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}

