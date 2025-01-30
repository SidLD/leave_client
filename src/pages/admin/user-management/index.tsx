"use client"

import { useEffect, useState } from "react"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { ArrowUpDown, Trash2, Eye } from "lucide-react"
import { getUsers, deleteUser as apiDeleteUser } from "@/lib/api"
import type { IUser } from "@/types/userType"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from "@/components/ui/dialog"
import { format } from "date-fns"

const UserManagementTable = () => {
  const [users, setUsers] = useState<IUser[]>([])
  const [sortConfig, setSortConfig] = useState<{ key: keyof IUser; direction: "asc" | "desc" } | null>(null)
  const [start, setStart] = useState(0)
  const [limit] = useState(10)
  const [searchTerm, setSearchTerm] = useState("")
  const [selectedUser, setSelectedUser] = useState<IUser | null>(null)
  const [isModalOpen, setIsModalOpen] = useState(false)

  const fetchUser = async () => {
    setTimeout( async () => {
      try {
        const { data } = ( await getUsers({
          start,
          limit,
          search: searchTerm,
        })) as unknown as any
        if (data.users.length > 0) {
          setUsers(data.users)
        }
      } catch (error) {
        console.log(error)
      }
    }, 1000)
}


  useEffect(() => {
    fetchUser()
  }, [start, limit, searchTerm])

  const sortData = (key: keyof IUser) => {
    let direction: "asc" | "desc" = "asc"
    if (sortConfig && sortConfig.key === key && sortConfig.direction === "asc") {
      direction = "desc"
    }
    setSortConfig({ key, direction })

    setUsers(
      [...users].sort((a: any, b: any) => {
        if (a[key] < b[key]) return direction === "asc" ? -1 : 1
        if (a[key] > b[key]) return direction === "asc" ? 1 : -1
        return 0
      }),
    )
  }

  const deleteUser = async (id: string) => {
    try {
      await apiDeleteUser(id)
      setUsers(users.filter((user) => user._id !== id))
    } catch (error) {
      console.error("Error deleting user:", error)
    }
  }

  const handleSearch = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchTerm(e.target.value)
    setStart(0) // Reset pagination when searching
  }

  const viewUserDetails = (user: IUser) => {
    setSelectedUser(user)
    setIsModalOpen(true)
  }

  return (
    <div className="container py-10 mx-auto">
      <Input type="text" placeholder="Search users..." value={searchTerm} onChange={handleSearch} className="mb-4" />
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead className="w-[100px]">
              <Button variant="ghost" onClick={() => sortData("code")}>
                Code <ArrowUpDown className="w-4 h-4 ml-2" />
              </Button>
            </TableHead>
            <TableHead>
              <Button variant="ghost" onClick={() => sortData("username")}>
                Username <ArrowUpDown className="w-4 h-4 ml-2" />
              </Button>
            </TableHead>
            <TableHead>
              <Button variant="ghost" onClick={() => sortData("email")}>
                Email <ArrowUpDown className="w-4 h-4 ml-2" />
              </Button>
            </TableHead>
            <TableHead>
              <Button variant="ghost" onClick={() => sortData("position")}>
                Position <ArrowUpDown className="w-4 h-4 ml-2" />
              </Button>
            </TableHead>
            <TableHead>Contact</TableHead>
            <TableHead className="text-right">Actions</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {users.map((user) => (
            <TableRow key={user._id}>
              <TableCell className="font-medium">{user.code}</TableCell>
              <TableCell>{user.username}</TableCell>
              <TableCell>{user.email}</TableCell>
              <TableCell>{user.position.name}</TableCell>
              <TableCell>{user.contact}</TableCell>
              <TableCell className="text-right">
                <Button variant="ghost" onClick={() => viewUserDetails(user)}>
                  <Eye className="w-4 h-4" />
                </Button>
                <Button variant="ghost" onClick={() => deleteUser(user._id)}>
                  <Trash2 className="w-4 h-4" />
                </Button>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>

      <Dialog open={isModalOpen} onOpenChange={setIsModalOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>User Details</DialogTitle>
          </DialogHeader>
          <DialogDescription>
            {selectedUser && (
              <div className="space-y-2">
                <p>
                  <strong>Username:</strong> {selectedUser.username}
                </p>
                <p>
                  <strong>Email:</strong> {selectedUser.email}
                </p>
                <p>
                  <strong>Code:</strong> {selectedUser.code}
                </p>
                <p>
                  <strong>Birthday:</strong> {format(new Date(selectedUser.birthday), "PP")}
                </p>
                <p>
                  <strong>Address:</strong> {selectedUser.address}
                </p>
                <p>
                  <strong>Educational Attainment:</strong> {selectedUser.educational_attainment}
                </p>
                <p>
                  <strong>Position:</strong> {selectedUser.position.name}
                </p>
                <p>
                  <strong>Role:</strong> {selectedUser.role}
                </p>
                <p>
                  <strong>Contact:</strong> {selectedUser.contact}
                </p>
                {selectedUser.file && (
                  <div>
                    <p>
                      <strong>File:</strong>
                    </p>
                    <img
                      src={selectedUser.file.downloadURL as string || "/placeholder.svg"}
                      alt="User file"
                      className="h-auto max-w-full"
                    />
                  </div>
                )}
              </div>
            )}
          </DialogDescription>
        </DialogContent>
      </Dialog>
    </div>
  )
}

export default UserManagementTable

