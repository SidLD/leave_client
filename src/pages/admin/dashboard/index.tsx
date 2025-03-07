"use client"

import { useState } from "react"
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { format } from "date-fns"
import { MoreHorizontal, Check, X, FileText } from "lucide-react"
import { useToast } from "@/hooks/use-toast"
import { useNavigate } from "react-router-dom"
import { getAllLeaveRecords, updateLeaveStatus } from "@/lib/api"
import type { LeaveFormType } from "@/types/leaveType"

export default function AdminDashboard() {
  const [selectedLeave, setSelectedLeave] = useState<LeaveFormType | null>(null)
  const [isApproveDialogOpen, setIsApproveDialogOpen] = useState(false)
  const [isRejectDialogOpen, setIsRejectDialogOpen] = useState(false)
  const [rejectReason, setRejectReason] = useState("")
  const [approveNote, setApproveNote] = useState("")
  const [selectedUsers, setSelectedUsers] = useState<string[]>([])
  const { toast } = useToast()
  const navigate = useNavigate()
  const queryClient = useQueryClient()

  // Fetch all leave records
  const { data: leaveRecords, isLoading } = useQuery<LeaveFormType[]>({
    queryKey: ["leaveRecords"],
    queryFn: () => getAllLeaveRecords({}).then((data) => data.data),
  })

  // Mutation for updating leave status
  const updateStatusMutation = useMutation({
    mutationFn: (data: { id: string; status: string; note?: string }) => updateLeaveStatus(data.id, data.status),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["leaveRecords"] })
      toast({
        title: "Success",
        description: "Leave status updated successfully",
      })
      setIsApproveDialogOpen(false)
      setIsRejectDialogOpen(false)
      setRejectReason("")
      setApproveNote("")
    },
    onError: (error: Error) => {
      toast({
        variant: "destructive",
        title: "Error",
        description: error.message || "Failed to update leave status",
      })
    },
  })

  const handleApprove = (leave: LeaveFormType) => {
    setSelectedLeave(leave)
    setIsApproveDialogOpen(true)
  }

  const handleReject = (leave: LeaveFormType) => {
    setSelectedLeave(leave)
    setIsRejectDialogOpen(true)
  }

  const confirmApprove = () => {
    if (!selectedLeave) return
    updateStatusMutation.mutate({
      id: selectedLeave._id as string,
      status: "APPROVED",
      note: approveNote,
    })
  }

  const confirmReject = () => {
    if (!selectedLeave || !rejectReason.trim()) return
    updateStatusMutation.mutate({
      id: selectedLeave._id as string,
      status: "REJECTED",
      note: rejectReason,
    })
  }

  const handleUserSelection = (userId: string) => {
    setSelectedUsers((prev) => (prev.includes(userId) ? prev.filter((id) => id !== userId) : [...prev, userId]))
  }

  const getStatusBadge = (status: string) => {
    switch (status) {
      case "PENDING":
        return (
          <Badge variant="outline" className="text-yellow-800 bg-yellow-100">
            Pending
          </Badge>
        )
      case "approved":
        return (
          <Badge variant="outline" className="text-green-800 bg-green-100">
            Approved
          </Badge>
        )
      case "rejected":
        return (
          <Badge variant="outline" className="text-red-800 bg-red-100">
            Rejected
          </Badge>
        )
      default:
        return <Badge variant="outline">Unknown</Badge>
    }
  }

  return (
    <div className="container py-8 mx-auto">
      <Card>
        <CardHeader>
          <CardTitle>Leave Management</CardTitle>
          <CardDescription>Review and manage employee leave requests</CardDescription>
        </CardHeader>
        <CardContent>
          {isLoading ? (
            <div className="flex justify-center py-8">
              <div className="w-8 h-8 border-b-2 border-gray-900 rounded-full animate-spin"></div>
            </div>
          ) : (
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead className="w-[50px]">Select</TableHead>
                  <TableHead>Employee</TableHead>
                  <TableHead>Leave Type</TableHead>
                  <TableHead>Duration</TableHead>
                  <TableHead>Dates</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead>Filed On</TableHead>
                  <TableHead className="text-right">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {leaveRecords && leaveRecords.length > 0 ? (
                  leaveRecords.map((leave) => (
                    <TableRow key={leave._id}>
                      <TableCell>
                        <div className="flex items-center justify-center">
                          <input
                            type="checkbox"
                            className="w-4 h-4 border-gray-300 rounded text-primary focus:ring-primary"
                            checked={selectedUsers.includes(leave.user._id as string)}
                            onChange={() => handleUserSelection(leave.user._id as string)}
                          />
                        </div>
                      </TableCell>
                      <TableCell className="font-medium">
                        {leave.user.firstName} {leave.user.lastName}
                      </TableCell>
                      <TableCell>
                        {Object.entries(leave.detailsOfApplication?.typeOfLeave || {})
                          .filter(([_, value]) => value === true)
                          .map(([key]) => key)
                          .join(", ")}
                      </TableCell>
                      <TableCell>{leave.detailsOfApplication?.leaveDuration?.numberOfDays}</TableCell>
                      <TableCell>{leave.detailsOfApplication?.leaveDuration?.inclusiveDates}</TableCell>
                      <TableCell>{getStatusBadge(leave.status || "PENDING")}</TableCell>
                      <TableCell>{format(new Date(leave.dateOfFiling), "MMM dd, yyyy")}</TableCell>
                      <TableCell className="text-right">
                        <DropdownMenu>
                          <DropdownMenuTrigger asChild>
                            <Button variant="ghost" className="w-8 h-8 p-0">
                              <span className="sr-only">Open menu</span>
                              <MoreHorizontal className="w-4 h-4" />
                            </Button>
                          </DropdownMenuTrigger>
                          <DropdownMenuContent align="end">
                            {leave.status === "PENDING" && (
                              <>
                                <DropdownMenuItem onClick={() => handleApprove(leave)}>
                                  <Check className="w-4 h-4 mr-2" />
                                  Approve
                                </DropdownMenuItem>
                                <DropdownMenuItem onClick={() => handleReject(leave)}>
                                  <X className="w-4 h-4 mr-2" />
                                  Reject
                                </DropdownMenuItem>
                              </>
                            )}
                            <DropdownMenuItem onClick={() => navigate(`/admin/report/application/${leave._id}`)}>
                              <FileText className="w-4 h-4 mr-2" />
                              View Form
                            </DropdownMenuItem>
                          </DropdownMenuContent>
                        </DropdownMenu>
                      </TableCell>
                    </TableRow>
                  ))
                ) : (
                  <TableRow>
                    <TableCell colSpan={8} className="py-4 text-center">
                      No leave records found
                    </TableCell>
                  </TableRow>
                )}
              </TableBody>
            </Table>
          )}
          {leaveRecords && leaveRecords.length > 0 && selectedUsers.length > 0 && (
            <div className="flex justify-end mt-4">
              <Button
                onClick={() => {
                  // Here you can pass the selectedUsers to wherever you need
                  console.log("Selected user IDs:", selectedUsers)
                  // Example: navigate to another page with the selected users
                  // navigate(`/some-path?users=${selectedUsers.join(',')}`)
                }}
              >
                Process Selected ({selectedUsers.length})
              </Button>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Approve Dialog */}
      <Dialog open={isApproveDialogOpen} onOpenChange={setIsApproveDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Approve Leave Request</DialogTitle>
            <DialogDescription>Are you sure you want to approve this leave request?</DialogDescription>
          </DialogHeader>
          <div className="py-2 space-y-4">
            <div className="space-y-2">
              <Label htmlFor="approveNote">Note (Optional)</Label>
              <Textarea
                id="approveNote"
                placeholder="Add any notes or comments"
                value={approveNote}
                onChange={(e) => setApproveNote(e.target.value)}
              />
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setIsApproveDialogOpen(false)}>
              Cancel
            </Button>
            <Button onClick={confirmApprove} disabled={updateStatusMutation.isPending}>
              {updateStatusMutation.isPending ? "Processing..." : "Approve"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Reject Dialog */}
      <Dialog open={isRejectDialogOpen} onOpenChange={setIsRejectDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Reject Leave Request</DialogTitle>
            <DialogDescription>Please provide a reason for rejecting this leave request.</DialogDescription>
          </DialogHeader>
          <div className="py-2 space-y-4">
            <div className="space-y-2">
              <Label htmlFor="rejectReason">
                Reason <span className="text-red-500">*</span>
              </Label>
              <Textarea
                id="rejectReason"
                placeholder="Enter reason for rejection"
                value={rejectReason}
                onChange={(e) => setRejectReason(e.target.value)}
                required
              />
              {isRejectDialogOpen && !rejectReason.trim() && <p className="text-sm text-red-500">Reason is required</p>}
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setIsRejectDialogOpen(false)}>
              Cancel
            </Button>
            <Button
              variant="destructive"
              onClick={confirmReject}
              disabled={updateStatusMutation.isPending || !rejectReason.trim()}
            >
              {updateStatusMutation.isPending ? "Processing..." : "Reject"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  )
}

