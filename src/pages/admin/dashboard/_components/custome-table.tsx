import type React from "react"
import { Checkbox } from "@/components/ui/checkbox"
import { TableHeader, TableRow, TableHead, TableBody, TableCell, Table } from "@/components/ui/table"
import { Button } from "@/components/ui/button"
import type { IUser } from "@/types/userType"
import { useNavigate } from "react-router-dom"

interface DataTableProps {
  data: IUser[]
  onSelect: (selectedIds: string[]) => void
  selectedUsers: string[]
  searchQuery: string
  onManageLeave: (user: IUser) => void
  onBatchAddLeave: () => void
  onManageRecord: (user: IUser)  => void
}

const DataTable: React.FC<DataTableProps> = ({
  data,
  onSelect,
  selectedUsers,
  searchQuery,
  onManageLeave,
  onBatchAddLeave,
  onManageRecord
}) => {
  const navigate = useNavigate()
  const handleSelectAll = (checked: boolean) => {
    if (checked) {
      onSelect(data.map((user) => user._id!))
    } else {
      onSelect([])
    }
  }

  const handleSelectUser = (userId: string, checked: boolean) => {
    if (checked) {
      onSelect([...selectedUsers, userId])
    } else {
      onSelect(selectedUsers.filter((id) => id !== userId))
    }
  }

  const filteredData = data.filter((user) =>
    Object.values(user).some((value) => value?.toString().toLowerCase().includes(searchQuery.toLowerCase())),
  )

  return (
    <div className="border rounded-md">
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead className="w-[50px]">
              <Checkbox
                checked={selectedUsers.length === filteredData.length && filteredData.length > 0}
                onCheckedChange={handleSelectAll}
                aria-label="Select all"
              />
            </TableHead>
            <TableHead>First Name</TableHead>
            <TableHead>Last Name</TableHead>
            <TableHead>Username</TableHead>
            <TableHead>Role</TableHead>
            <TableHead>Gender</TableHead>
            <TableHead>Actions</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {filteredData.map((user) => (
            <TableRow key={user._id}>
              <TableCell>
                <Checkbox
                  checked={selectedUsers.includes(user._id!)}
                  onCheckedChange={(checked) => handleSelectUser(user._id!, checked as boolean)}
                  aria-label={`Select ${user.firstName}`}
                />
              </TableCell>
              <TableCell>{user.firstName}</TableCell>
              <TableCell>{user.lastName}</TableCell>
              <TableCell>{user.username}</TableCell>
              <TableCell>{user.role}</TableCell>
              <TableCell>{user.gender}</TableCell>
              <TableCell>
                <Button onClick={() => onManageLeave(user)} variant="secondary" size="sm">
                  Avail Leave
                </Button>
                <span className="mx-2"></span>
                <Button onClick={() => onManageRecord(user)} variant="outline" size="sm">
                  Manage Leave Record
                </Button>
                <Button variant='ghost' onClick={() => {
                  navigate(`/admin/report/${user._id}`)
                }}>
                  View Report
                </Button>
              </TableCell>
            </TableRow>
          ))}
          {filteredData.length === 0 && (
            <TableRow>
              <TableCell colSpan={7} className="h-24 text-center">
                No results.
              </TableCell>
            </TableRow>
          )}
        </TableBody>
      </Table>
      {selectedUsers.length > 0 && (
        <div className="p-4 bg-gray-100 dark:bg-gray-800">
          <Button onClick={onBatchAddLeave}>Batch Add Leave for Selected Users</Button>
        </div>
      )}
    </div>
  )
}

export default DataTable

