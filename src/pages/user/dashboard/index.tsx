"use client"

import { useState, useEffect } from "react"
import { useQuery } from "@tanstack/react-query"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { PlusCircle, Search, Edit, Trash2, Filter, RefreshCw } from "lucide-react"
import { getLeaveRecords } from "@/lib/api"
import { LeaveFormType, typeOfLeave } from "@/types/leaveType"


export default function LeaveDashboard() {
  const [statusFilter, setStatusFilter] = useState<string>("ALL")
  const [searchQuery, setSearchQuery] = useState<string>("")
  const [filteredApplications, setFilteredApplications] = useState<LeaveFormType[]>([])

  // Use React Query to fetch data
  const {
    data: reports,
    isLoading,
    isError,
    refetch,
  } = useQuery({
    queryKey: ["leaveReports"],
    queryFn: () => getLeaveRecords({}).then((data) => data.data),
    staleTime: 5 * 60 * 1000, // 5 minutes
    refetchOnWindowFocus: false,
  })

  // Filter applications based on status and search query
  useEffect(() => {
    if (!reports) return

    let filtered = [...reports]

    // Filter by status
    if (statusFilter !== "ALL") {
      filtered = filtered.filter((app) => app.status === statusFilter)
    }

    // Filter by search query
    if (searchQuery) {
      const query = searchQuery.toLowerCase()
      filtered = filtered.filter(
        (app) =>
          app.user.firstName.toLowerCase().includes(query) ||
          app.user.lastName.toLowerCase().includes(query) ||
          app.user.employeeId.toLowerCase().includes(query) ||
          app.officeDepartment.toLowerCase().includes(query) ||
          app.position.toLowerCase().includes(query),
      )
    }

    setFilteredApplications(filtered)
  }, [statusFilter, searchQuery, reports])

  // Handle delete application
  const handleDelete = async (id: string) => {
    // In a real application, this would call an API to delete the application
    // For now, we'll just simulate it and refetch the data
    alert(`Deleting application with ID: ${id}`)
    // After successful deletion, refetch the data
    await refetch()
  }

  // Format date for display
  const formatDate = (dateString: string): string => {
    try {
      const date = new Date(dateString)
      return date.toLocaleDateString("en-US", { year: "numeric", month: "short", day: "numeric" })
    } catch (error) {
      return dateString
    }
  }

  // Get leave type as string
  const getLeaveType = (typeOfLeave: typeOfLeave): string => {
    for (const [key, value] of Object.entries(typeOfLeave)) {
      if (value === true && key !== "other") {
        return key.charAt(0).toUpperCase() + key.slice(1)
      }
    }
    return typeOfLeave.other || "Unknown"
  }

  return (
    <div className="container py-6 mx-auto">
      <Card className="border-green-200">
        <CardHeader className="bg-green-50">
          <div className="flex flex-col items-start justify-between gap-4 sm:flex-row sm:items-center">
            <div>
              <CardTitle className="text-2xl font-bold text-green-800">Leave Applications Dashboard</CardTitle>
              <CardDescription className="text-green-600">Manage employee leave applications</CardDescription>
            </div>
            <div className="flex w-full gap-2 sm:w-auto">
              <Button
                variant="outline"
                size="icon"
                className="text-green-600 border-green-200 hover:bg-green-50"
                onClick={() => refetch()}
                disabled={isLoading}
              >
                <RefreshCw className={`h-4 w-4 ${isLoading ? "animate-spin" : ""}`} />
                <span className="sr-only">Refresh</span>
              </Button>
              <a href="/create-leave" className="w-full sm:w-auto">
                <Button className="w-full bg-green-600 hover:bg-green-700">
                  <PlusCircle className="w-4 h-4 mr-2" />
                  Create New Application
                </Button>
              </a>
            </div>
          </div>
        </CardHeader>
        <CardContent className="pt-6">
          <div className="flex flex-col gap-4 mb-6 md:flex-row">
            <div className="flex items-center w-full gap-2 md:w-1/3">
              <Filter className="w-4 h-4 text-green-600" />
              <Select value={statusFilter} onValueChange={setStatusFilter}>
                <SelectTrigger className="border-green-200 focus:ring-green-500">
                  <SelectValue placeholder="Filter by status" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="ALL">All Statuses</SelectItem>
                  <SelectItem value="PENDING">Pending</SelectItem>
                  <SelectItem value="APPROVED">Approved</SelectItem>
                  <SelectItem value="REJECTED">Rejected</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="relative w-full md:w-2/3">
              <Search className="absolute w-4 h-4 text-green-600 -translate-y-1/2 left-3 top-1/2" />
              <Input
                placeholder="Search by name, employee ID, department..."
                className="pl-10 border-green-200 focus:ring-green-500"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
            </div>
          </div>

          <div className="border border-green-200 rounded-md">
            {isLoading ? (
              <div className="flex items-center justify-center h-64">
                <div className="flex flex-col items-center gap-2">
                  <RefreshCw className="w-8 h-8 text-green-600 animate-spin" />
                  <p className="font-medium text-green-600">Loading leave applications...</p>
                </div>
              </div>
            ) : isError ? (
              <div className="flex items-center justify-center h-64">
                <div className="flex flex-col items-center gap-2 text-red-500">
                  <p className="font-medium">Error loading data</p>
                  <Button
                    variant="outline"
                    onClick={() => refetch()}
                    className="text-red-600 border-red-200 hover:bg-red-50"
                  >
                    Try Again
                  </Button>
                </div>
              </div>
            ) : (
              <Table>
                <TableHeader className="bg-green-50">
                  <TableRow>
                    <TableHead className="text-green-800">Employee</TableHead>
                    <TableHead className="text-green-800">Department</TableHead>
                    <TableHead className="text-green-800">Leave Type</TableHead>
                    <TableHead className="text-green-800">Duration</TableHead>
                    <TableHead className="text-green-800">Filing Date</TableHead>
                    <TableHead className="text-green-800">Status</TableHead>
                    <TableHead className="text-right text-green-800">Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {filteredApplications.length > 0 ? (
                    filteredApplications.map((application) => (
                      <TableRow key={application._id}>
                        <TableCell className="font-medium">
                          {application.user.firstName} {application.user.lastName}
                          <div className="text-sm text-gray-500">ID: {application.user.employeeId}</div>
                        </TableCell>
                        <TableCell>{application.officeDepartment}</TableCell>
                        <TableCell>{getLeaveType(application.detailsOfApplication.typeOfLeave as typeOfLeave)}</TableCell>
                        <TableCell>{application.detailsOfApplication.leaveDuration.numberOfDays}</TableCell>
                        <TableCell>{formatDate(application.dateOfFiling)}</TableCell>
                        <TableCell>
                          <Badge
                            className={
                              application.status === "APPROVED"
                                ? "bg-green-100 text-green-800 hover:bg-green-100"
                                : application.status === "REJECTED"
                                  ? "bg-red-100 text-red-800 hover:bg-red-100"
                                  : "bg-yellow-100 text-yellow-800 hover:bg-yellow-100"
                            }
                          >
                            {application.status}
                          </Badge>
                        </TableCell>
                        <TableCell className="text-right">
                          <div className="flex justify-end gap-2">
                            {application.status === "PENDING" && (
                              <a href={`/edit-leave/${application._id}`}>
                                <Button
                                  variant="outline"
                                  size="sm"
                                  className="text-green-600 border-green-200 hover:bg-green-50"
                                >
                                  <Edit className="w-4 h-4" />
                                </Button>
                              </a>
                            )}
                            {application.status === "REJECTED" && (
                              <Button
                                variant="outline"
                                size="sm"
                                className="text-red-600 border-red-200 hover:bg-red-50"
                                onClick={() => handleDelete(application._id as string)}
                              >
                                <Trash2 className="w-4 h-4" />
                              </Button>
                            )}
                          </div>
                        </TableCell>
                      </TableRow>
                    ))
                  ) : (
                    <TableRow>
                      <TableCell colSpan={7} className="py-6 text-center text-gray-500">
                        No leave applications found matching your filters
                      </TableCell>
                    </TableRow>
                  )}
                </TableBody>
              </Table>
            )}
          </div>
        </CardContent>
      </Card>
    </div>
  )
}

