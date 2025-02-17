import type React from "react"
import { Table, TableBody, TableCell, TableHeader, TableHead, TableRow } from "@/components/ui/table"
import type { ILeaveRecord } from "@/types/leaveType"

interface LeaveRecordTableProps {
  data: ILeaveRecord[]
  isLoading: boolean
}

const LeaveRecordTable: React.FC<LeaveRecordTableProps> = ({ data, isLoading }) => {
  if (isLoading) {
    return <div className="p-4">Loading...</div>
  }

  return (
    <div className="py-4">
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Leave Type</TableHead>
            <TableHead>Start Date</TableHead>
            <TableHead>End Date</TableHead>
            <TableHead>Credit</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {data.map((record) => (
            <TableRow key={record._id}>
              <TableCell>{record.leave.name}</TableCell>
              <TableCell>{new Date(record.dateStart).toLocaleDateString()}</TableCell>
              <TableCell>{new Date(record.dateEnd).toLocaleDateString()}</TableCell>
              <TableCell>{record.credit}</TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  )
}

export default LeaveRecordTable

