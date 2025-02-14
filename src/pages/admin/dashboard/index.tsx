"use client"

import type React from "react"
import { useState, useEffect } from "react"
import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import * as z from "zod"
import { Button } from "@/components/ui/button"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Checkbox } from "@/components/ui/checkbox"
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form"
import { Input } from "@/components/ui/input"
import type { IUser } from "@/types/userType"
import { CostumeModal } from "./_components/custom_modal"
import { useQuery } from "@tanstack/react-query"
import { getUsers } from "@/lib/api"

// Form schema for user registration
const registerFormSchema = z.object({
  firstName: z.string().min(2, { message: "First name must be at least 2 characters." }),
  lastName: z.string().min(2, { message: "Last name must be at least 2 characters." }),
  middleName: z.string().optional(),
  username: z.string().min(3, { message: "Username must be at least 3 characters." }),
  role: z.enum(["USER", "ADMIN"]),
  gender: z.enum(["MALE", "FEMALE"]),
  password: z.string().min(6, { message: "Password must be at least 6 characters." }),
})

type RegisterFormData = z.infer<typeof registerFormSchema>

const Toolbar: React.FC<{
  onRegister: () => void
  onDelete: () => void
  selectedCount: number
  onSearch: (query: string) => void
}> = ({ onRegister, onDelete, selectedCount, onSearch }) => {
  return (
    <div className="flex items-center justify-between mb-4">
      <div className="flex items-center space-x-2">
        <Button onClick={onRegister}>Register User</Button>
        <Input placeholder="Search users..." onChange={(e) => onSearch(e.target.value)} className="max-w-sm" />
      </div>
      <div>
        {selectedCount > 0 && (
          <Button variant="destructive" onClick={onDelete}>
            Delete Selected ({selectedCount})
          </Button>
        )}
      </div>
    </div>
  )
}

const DataTable: React.FC<{
  data: IUser[]
  onSelect: (selectedIds: string[]) => void
  selectedUsers: string[]
  searchQuery: string
}> = ({ data, onSelect, selectedUsers, searchQuery }) => {
  const handleSelectAll = (checked: boolean) => {
    if (checked) {
      onSelect(data.map((user) => user._id as string))
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
    Object.values(user).some((value) => value.toString().toLowerCase().includes(searchQuery.toLowerCase())),
  )

  return (
    <div className="border rounded-md">
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead className="w-[50px]">
              <Checkbox
                checked={selectedUsers.length === filteredData.length}
                onCheckedChange={handleSelectAll}
                aria-label="Select all"
              />
            </TableHead>
            <TableHead>First Name</TableHead>
            <TableHead>Last Name</TableHead>
            <TableHead>Username</TableHead>
            <TableHead>Role</TableHead>
            <TableHead>Gender</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {filteredData.map((user) => (
            <TableRow key={user._id}>
              <TableCell>
                <Checkbox
                  checked={selectedUsers.includes(user._id as string)}
                  onCheckedChange={(checked) => handleSelectUser(user._id as string, checked as boolean)}
                  aria-label={`Select ${user.firstName}`}
                />
              </TableCell>
              <TableCell>{user.firstName}</TableCell>
              <TableCell>{user.lastName}</TableCell>
              <TableCell>{user.username}</TableCell>
              <TableCell>{user.role}</TableCell>
              <TableCell>{user.gender}</TableCell>
            </TableRow>
          ))}
          {filteredData.length === 0 && (
            <TableRow>
              <TableCell colSpan={6} className="h-24 text-center">
                No results.
              </TableCell>
            </TableRow>
          )}
        </TableBody>
      </Table>
    </div>
  )
}

const RegisterForm: React.FC<{
  onSubmit: (user: RegisterFormData) => void
}> = ({ onSubmit }) => {
  const form = useForm<RegisterFormData>({
    resolver: zodResolver(registerFormSchema),
    defaultValues: {
      firstName: "",
      lastName: "",
      middleName: "",
      username: "",
      role: "USER",
      gender: "MALE",
      password: "",
    },
  })

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
        <FormField
          control={form.control}
          name="firstName"
          render={({ field }) => (
            <FormItem>
              <FormLabel>First Name</FormLabel>
              <FormControl>
                <Input placeholder="John" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="lastName"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Last Name</FormLabel>
              <FormControl>
                <Input placeholder="Doe" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="middleName"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Middle Name (Optional)</FormLabel>
              <FormControl>
                <Input placeholder="Middle Name" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="username"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Username</FormLabel>
              <FormControl>
                <Input placeholder="johndoe" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="role"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Role</FormLabel>
              <FormControl>
                <select {...field} className="w-full p-2 border rounded">
                  <option value="USER">User</option>
                  <option value="ADMIN">Admin</option>
                </select>
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="gender"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Gender</FormLabel>
              <FormControl>
                <select {...field} className="w-full p-2 border rounded">
                  <option value="MALE">Male</option>
                  <option value="FEMALE">Female</option>
                </select>
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="password"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Password</FormLabel>
              <FormControl>
                <Input type="password" placeholder="******" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <Button type="submit">Register</Button>
      </form>
    </Form>
  )
}

export default function Dashboard() {
  const [selectedUsers, setSelectedUsers] = useState<string[]>([])
  const [isModalOpen, setIsModalOpen] = useState(false)
  const [searchQuery, setSearchQuery] = useState("")
  const [start, setStart] = useState(0)
  const [limit, _setLimit] = useState(10)

  const {
    data: users,
    refetch,
    isLoading,
  } = useQuery<IUser[]>({
    queryKey: ["users", searchQuery, start, limit],
    queryFn: () => getUsers({ searchItem: searchQuery, start, limit }).then((data) => data.data),
  })

  useEffect(() => {
    refetch()
  }, [refetch])

  const handleRegister = (_newUser: RegisterFormData) => {
    // Implement user registration logic here
    // After successful registration, refetch the users
    refetch()
    setIsModalOpen(false)
  }

  const handleDelete = () => {
    // Implement user deletion logic here
    // After successful deletion, refetch the users
    refetch()
    setSelectedUsers([])
  }

  const handleSearch = (query: string) => {
    setSearchQuery(query)
    setStart(0) // Reset pagination when searching
  }

  return (
    <div className="container py-10 mx-auto">
      <Toolbar
        onRegister={() => setIsModalOpen(true)}
        onDelete={handleDelete}
        selectedCount={selectedUsers.length}
        onSearch={handleSearch}
      />
      {isLoading ? (
        <div>Loading...</div>
      ) : (
        <DataTable
          data={users || []}
          onSelect={setSelectedUsers}
          selectedUsers={selectedUsers}
          searchQuery={searchQuery}
        />
      )}
      <div className="flex justify-between mt-4">
        <Button onClick={() => setStart(Math.max(0, start - limit))} disabled={start === 0}>
          Previous
        </Button>
        <Button onClick={() => setStart(start + limit)} disabled={(users?.length || 0) < limit}>
          Next
        </Button>
      </div>
      <CostumeModal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} title="Register User">
        <RegisterForm onSubmit={handleRegister} />
      </CostumeModal>
    </div>
  )
}

