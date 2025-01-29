import { useState, useEffect } from "react"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { ChevronLeft, ChevronRight } from "lucide-react"

// Interfaces
interface IFile {
  _id?: string
  type: string
  generation: string
  metageneration: string
  fullPath: string
  name: string
  size: number
  timeCreated: string
  downloadURL: string
}

interface IPosition {
  // Define the structure of IPosition here
  name: string
  // Add other relevant fields
}

interface IUser {
  status: string
  _id: string
  username: string
  code: string
  birthday: Date
  address: string
  email: string
  contact: string
  educational_attainment: string
  position: IPosition
  role: "ADMIN" | "USER"
  password?: string
  file?: IFile
}

// Mock data generation
const generateMockUsers = (count: number): IUser[] => {
  return Array.from({ length: count }, (_, i) => ({
    status: Math.random() > 0.5 ? "Active" : "Inactive",
    _id: `user${i + 1}`,
    username: `user${i + 1}`,
    code: `CODE${i + 1}`,
    birthday: new Date(1980 + i, 0, 1),
    address: `${i + 1} Main St, City`,
    email: `user${i + 1}@example.com`,
    contact: `+1234567890${i}`,
    educational_attainment: "Bachelor's Degree",
    position: { name: `Position ${i + 1}` },
    role: Math.random() > 0.5 ? "ADMIN" : "USER",
  }))
}

// Dashboard Component
export function UserDashboard() {
  const [users, setUsers] = useState<IUser[]>([])
  const [searchTerm, setSearchTerm] = useState("")
  const [currentPage, setCurrentPage] = useState(1)
  const [usersPerPage] = useState(10)

  useEffect(() => {
    // Simulating API call
    const fetchUsers = async () => {
      // In a real application, replace this with an actual API call
      const mockUsers = generateMockUsers(50)
      setUsers(mockUsers)
    }

    fetchUsers()
  }, [])

  // Filtering users based on search term
  const filteredUsers = users.filter(
    (user) =>
      user.username.toLowerCase().includes(searchTerm.toLowerCase()) ||
      user.email.toLowerCase().includes(searchTerm.toLowerCase()),
  )

  // Pagination
  const indexOfLastUser = currentPage * usersPerPage
  const indexOfFirstUser = indexOfLastUser - usersPerPage
  const currentUsers = filteredUsers.slice(indexOfFirstUser, indexOfLastUser)

  const paginate = (pageNumber: number) => setCurrentPage(pageNumber)

  return (
    <div className="p-8 space-y-8">
      <Card>
        <CardHeader>
          <CardTitle>User Dashboard</CardTitle>
          <CardDescription>Manage and view user information</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="mb-4">
            <Input
              placeholder="Search users..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="max-w-sm"
            />
          </div>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Username</TableHead>
                <TableHead>Email</TableHead>
                <TableHead>Status</TableHead>
                <TableHead>Role</TableHead>
                <TableHead>Position</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {currentUsers.map((user) => (
                <TableRow key={user._id}>
                  <TableCell>{user.username}</TableCell>
                  <TableCell>{user.email}</TableCell>
                  <TableCell>{user.status}</TableCell>
                  <TableCell>{user.role}</TableCell>
                  <TableCell>{user.position.name}</TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
          <div className="flex items-center justify-between mt-4">
            <div>
              Showing {indexOfFirstUser + 1} to {Math.min(indexOfLastUser, filteredUsers.length)} of{" "}
              {filteredUsers.length} users
            </div>
            <div className="flex space-x-2">
              <Button
                variant="outline"
                onClick={() => paginate(Math.max(currentPage - 1, 1))}
                disabled={currentPage === 1}
              >
                <ChevronLeft className="w-4 h-4" />
              </Button>
              <Button
                variant="outline"
                onClick={() => paginate(Math.min(currentPage + 1, Math.ceil(filteredUsers.length / usersPerPage)))}
                disabled={currentPage === Math.ceil(filteredUsers.length / usersPerPage)}
              >
                <ChevronRight className="w-4 h-4" />
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}

