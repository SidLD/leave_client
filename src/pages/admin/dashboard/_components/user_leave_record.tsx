import type React from "react"
import { useState } from "react"
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query"
import { Button } from "@/components/ui/button"
import { Table, TableBody, TableCell, TableHeader, TableHead, TableRow } from "@/components/ui/table"
import { SheetHeader, SheetTitle, SheetDescription, SheetFooter } from "@/components/ui/sheet"
import type {  ILeaveSetting, IUserLeave, ILeaveRecord } from "@/types/leaveType"
import { getUserLeaves, updateUserLeave, deleteUserLeave, getLeaveRecords } from "@/lib/api"
import LeaveRecordTable from "./leave_record_table"
import UserLeaveForm from "./user_leave_form"
import { IUser } from "@/types/userType"
import { useToast } from "@/hooks/use-toast"

interface UserLeaveRecordProps {
  user: IUser
  leaveSettings: ILeaveSetting[]
  onClose: () => void
  onAddLeaveRecord: () => void
  onManageLeave: () => void
}

const UserLeaveRecord: React.FC<UserLeaveRecordProps> = ({ user, leaveSettings, onClose, onAddLeaveRecord, onManageLeave }) => {
  const [selectedUserLeave, setSelectedUserLeave] = useState<IUserLeave | null>(null)
  const queryClient = useQueryClient()
  const { toast } = useToast()

  const { data: userLeaves, isLoading: userLeavesLoading } = useQuery<IUserLeave[]>({
    queryKey: ["userLeaves", user._id],
    queryFn: () => getUserLeaves({ userId: user._id }).then((res) => res.data),
  })

  const { data: userLeaveRecords, isLoading: isLeaveRecordsLoading } = useQuery<ILeaveRecord[]>({
    queryKey: ["userLeaveRecords", user._id],
    queryFn: () => getLeaveRecords(user._id!, {}).then((res) => res.data),
  })

  const updateUserLeaveMutation = useMutation({
    mutationFn: (data: { userLeaveId: string; credit: number }) => updateUserLeave(selectedUserLeave?._id!,data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["userLeaves", user._id] })
      toast({
        title: "Leave updated successfully",
        description: "The user's leave has been updated.",
      })
      setSelectedUserLeave(null)
    },
    onError: (error: any) => {
      toast({
        title: "Error updating leave",
        description: error.message || "An error occurred while updating the leave.",
        variant: "destructive",
      })
    },
  })

  const deleteUserLeaveMutation = useMutation({
    mutationFn: (leaveId: string) => deleteUserLeave(leaveId),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["userLeaves", user._id] })
      toast({
        title: "Leave deleted successfully",
        description: "The user's leave has been removed.",
      })
    },
    onError: (error: any) => {
      toast({
        title: "Error deleting leave",
        description: error.message || "An error occurred while deleting the leave.",
        variant: "destructive",
      })
    },
  })

  const handleUpdateUserLeave = (data: { leaveId: string; credit: number }) => {
    if (selectedUserLeave) {
      updateUserLeaveMutation.mutate({ userLeaveId: selectedUserLeave._id, credit: data.credit })
    }
  }

  const handleDeleteUserLeave = (leaveId: string) => {
    deleteUserLeaveMutation.mutate(leaveId)
  }

  return (
    <>
      <SheetHeader>
        <SheetTitle>User Leave Management</SheetTitle>
        <SheetDescription>
          Manage leave records for {user.firstName} {user.lastName}
        </SheetDescription>
      </SheetHeader>
      <div className="py-4">
        <h3 className="mb-2 text-lg font-semibold">User Leaves</h3>
        {userLeavesLoading ? (
          <div>Loading user leaves...</div>
        ) : (
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Leave Type</TableHead>
                <TableHead>Credit</TableHead>
                <TableHead>Used</TableHead>
                <TableHead>Carry Over</TableHead>
                <TableHead>Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {userLeaves?.map((userLeave) => (
                <TableRow key={userLeave._id}>
                  <TableCell>{userLeave.leave.name}</TableCell>
                  <TableCell>{userLeave.credit}</TableCell>
                  <TableCell>{userLeave.used}</TableCell>
                  <TableCell>{userLeave.carryOver}</TableCell>
                  <TableCell>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => setSelectedUserLeave(userLeave)}
                      className="mr-2"
                    >
                      Edit
                    </Button>
                    <Button variant="destructive" size="sm" onClick={() => handleDeleteUserLeave(userLeave._id)}>
                      Delete
                    </Button>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        )}
      </div>
      {selectedUserLeave && (
        <div className="py-4">
          <h3 className="mb-2 text-lg font-semibold">Update User Leave</h3>
          <UserLeaveForm
            leaveSettings={leaveSettings}
            onSubmit={handleUpdateUserLeave}
            initialData={selectedUserLeave}
          />
        </div>
      )}
      <div className="py-4">
        <h3 className="mb-2 text-lg font-semibold">Leave Records</h3>
        <Button onClick={onAddLeaveRecord} className="mb-4">
          Add Leave Record
        </Button>
        <LeaveRecordTable data={userLeaveRecords || []} isLoading={isLeaveRecordsLoading} />
      </div>
      <SheetFooter>
        <Button onClick={onClose}>Close</Button>
      </SheetFooter>
    </>
  )
}

export default UserLeaveRecord

