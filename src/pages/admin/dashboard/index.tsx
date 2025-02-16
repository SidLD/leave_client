"use client"

import type React from "react"
import { useState, useEffect } from "react"
import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import * as z from "zod"
import { Button } from "@/components/ui/button"
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form"
import { Input } from "@/components/ui/input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Table, TableBody, TableCell, TableHeader, TableHead, TableRow } from "@/components/ui/table"
import type { IUser } from "@/types/userType"
import type { ILeaveSetting } from "@/types/leaveType"
import type { IUserLeave } from "@/types/leaveType"
import { CostumeModal } from "./_components/custom_modal"
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query"
import {
  getUsers,
  getLeaveSetting,
  createUserLeave,
  deleteUserLeave,
  getUserLeaves,
  batchCreateUserLeave,
} from "@/lib/api"
import DataTable from "./_components/custome-table"

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

// Schema for user leave management
const userLeaveSchema = z.object({
  leaveId: z.string().min(1, "Please select a leave type"),
})

type UserLeaveFormData = z.infer<typeof userLeaveSchema>

// Schema for batch leave management
const batchLeaveSchema = z.object({
  leaveId: z.string().min(1, "Please select a leave type"),
})

type BatchLeaveFormData = z.infer<typeof batchLeaveSchema>

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
              <Select onValueChange={field.onChange} defaultValue={field.value}>
                <FormControl>
                  <SelectTrigger>
                    <SelectValue placeholder="Select role" />
                  </SelectTrigger>
                </FormControl>
                <SelectContent>
                  <SelectItem value="USER">User</SelectItem>
                  <SelectItem value="ADMIN">Admin</SelectItem>
                </SelectContent>
              </Select>
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
              <Select onValueChange={field.onChange} defaultValue={field.value}>
                <FormControl>
                  <SelectTrigger>
                    <SelectValue placeholder="Select gender" />
                  </SelectTrigger>
                </FormControl>
                <SelectContent>
                  <SelectItem value="MALE">Male</SelectItem>
                  <SelectItem value="FEMALE">Female</SelectItem>
                </SelectContent>
              </Select>
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

const UserLeaveForm: React.FC<{
  user: IUser
  leaveSettings: ILeaveSetting[]
  onSubmit: (data: UserLeaveFormData) => void
  userLeaves: IUserLeave[]
  onDeleteLeave: (leaveId: string) => void
}> = ({ user, leaveSettings, onSubmit, userLeaves, onDeleteLeave }) => {
  const form = useForm<UserLeaveFormData>({
    resolver: zodResolver(userLeaveSchema),
    defaultValues: {
      leaveId: "",
    },
  })

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
        <FormField
          control={form.control}
          name="leaveId"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Leave Type</FormLabel>
              <Select onValueChange={field.onChange} defaultValue={field.value}>
                <FormControl>
                  <SelectTrigger>
                    <SelectValue placeholder="Select leave type" />
                  </SelectTrigger>
                </FormControl>
                <SelectContent>
                  {leaveSettings.map((leave) => (
                    <SelectItem key={leave._id} value={leave._id!}>
                      {leave.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              <FormMessage />
            </FormItem>
          )}
        />
        <Button type="submit">Add Leave</Button>
      </form>
      <div className="mt-4">
        <h3 className="mb-2 text-lg font-semibold">Current Leaves</h3>
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Leave Type</TableHead>
              <TableHead>Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {userLeaves.map((userLeave) => (
              <TableRow key={userLeave._id}>
                <TableCell>{userLeave.leave.name}</TableCell>
                <TableCell>
                  <Button variant="destructive" size="sm" onClick={() => onDeleteLeave(userLeave._id)}>
                    Remove
                  </Button>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>
    </Form>
  )
}

const BatchLeaveForm: React.FC<{
  leaveSettings: ILeaveSetting[]
  onSubmit: (data: BatchLeaveFormData) => void
}> = ({ leaveSettings, onSubmit }) => {
  const form = useForm<BatchLeaveFormData>({
    resolver: zodResolver(batchLeaveSchema),
    defaultValues: {
      leaveId: "",
    },
  })

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
        <FormField
          control={form.control}
          name="leaveId"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Leave Type</FormLabel>
              <Select onValueChange={field.onChange} defaultValue={field.value}>
                <FormControl>
                  <SelectTrigger>
                    <SelectValue placeholder="Select leave type" />
                  </SelectTrigger>
                </FormControl>
                <SelectContent>
                  {leaveSettings.map((leave) => (
                    <SelectItem key={leave._id} value={leave._id!}>
                      {leave.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              <FormMessage />
            </FormItem>
          )}
        />
        <Button type="submit">Add Leave to Selected Users</Button>
      </form>
    </Form>
  )
}

export default function Dashboard() {
  const [selectedUsers, setSelectedUsers] = useState<string[]>([])
  const [isRegisterModalOpen, setIsRegisterModalOpen] = useState(false)
  const [isLeaveModalOpen, setIsLeaveModalOpen] = useState(false)
  const [isBatchLeaveModalOpen, setIsBatchLeaveModalOpen] = useState(false)
  const [selectedUser, setSelectedUser] = useState<IUser | null>(null)
  const [searchQuery, setSearchQuery] = useState("")
  const [start, setStart] = useState(0)
  const [limit, _setLimit] = useState(10)

  const queryClient = useQueryClient()

  const {
    data: users,
    refetch,
    isLoading,
  } = useQuery<IUser[]>({
    queryKey: ["users", searchQuery, start, limit],
    queryFn: () => getUsers({ searchItem: searchQuery, start, limit }).then((res) => res.data),
  })

  const { data: leaveSettings } = useQuery<ILeaveSetting[]>({
    queryKey: ["leaveSettings"],
    queryFn: () => getLeaveSetting({}).then((res) => res.data),
  })

  const { data: userLeaves } = useQuery<IUserLeave[]>({
    queryKey: ["userLeaves", selectedUser?._id],
    queryFn: () => getUserLeaves({ userId: selectedUser?._id }).then((res) => res.data),
    enabled: !!selectedUser,
  })

  const createUserLeaveMutation = useMutation({
    mutationFn: (data: { userId: string } & UserLeaveFormData) => createUserLeave(data),
    onSuccess: () => {
      queryClient.invalidateQueries({queryKey: ["userLeaves", selectedUser?._id]})
    },
  })

  const deleteUserLeaveMutation = useMutation({
    mutationFn: (leaveId: string) => deleteUserLeave(leaveId),
    onSuccess: () => {
      queryClient.invalidateQueries({queryKey: ["userLeaves", selectedUser?._id]})
    },
  })

  const batchCreateUserLeaveMutation = useMutation({
    mutationFn: (data: { userIds: string[]; leaveId: string }) => batchCreateUserLeave(data),
    onSuccess: () => {
      queryClient.invalidateQueries({queryKey: ["users"]})
      setIsBatchLeaveModalOpen(false)
    },
  })

  useEffect(() => {
    refetch()
  }, [refetch])

  const handleRegister = (_newUser: RegisterFormData) => {
    // Implement user registration logic here
    // After successful registration, refetch the users
    refetch()
    setIsRegisterModalOpen(false)
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

  const handleLeaveSubmit = (data: UserLeaveFormData) => {
    if (selectedUser) {
      createUserLeaveMutation.mutate({ userId: selectedUser._id!, ...data })
    }
  }

  const handleDeleteLeave = (leaveId: string) => {
    deleteUserLeaveMutation.mutate(leaveId)
  }

  const handleManageLeave = (user: IUser) => {
    setSelectedUser(user)
    setIsLeaveModalOpen(true)
  }

  const handleBatchAddLeave = () => {
    setIsBatchLeaveModalOpen(true)
  }

  const handleBatchLeaveSubmit = (data: BatchLeaveFormData) => {
    batchCreateUserLeaveMutation.mutate({ userIds: selectedUsers, leaveId: data.leaveId })
  }

  return (
    <div className="container py-10 mx-auto">
      <Toolbar
        onRegister={() => setIsRegisterModalOpen(true)}
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
          onManageLeave={handleManageLeave}
          onBatchAddLeave={handleBatchAddLeave}
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
      <CostumeModal isOpen={isRegisterModalOpen} onClose={() => setIsRegisterModalOpen(false)} title="Register User">
        <RegisterForm onSubmit={handleRegister} />
      </CostumeModal>
      <CostumeModal isOpen={isLeaveModalOpen} onClose={() => setIsLeaveModalOpen(false)} title="Manage User Leave">
        {selectedUser && leaveSettings && userLeaves && (
          <UserLeaveForm
            user={selectedUser}
            leaveSettings={leaveSettings}
            onSubmit={handleLeaveSubmit}
            userLeaves={userLeaves}
            onDeleteLeave={handleDeleteLeave}
          />
        )}
      </CostumeModal>
      <CostumeModal
        isOpen={isBatchLeaveModalOpen}
        onClose={() => setIsBatchLeaveModalOpen(false)}
        title="Batch Add Leave"
      >
        {leaveSettings && <BatchLeaveForm leaveSettings={leaveSettings} onSubmit={handleBatchLeaveSubmit} />}
      </CostumeModal>
    </div>
  )
}

