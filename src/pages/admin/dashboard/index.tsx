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
import type { IUser } from "@/types/userType"
import type { ILeaveSetting, IUserLeave } from "@/types/leaveType"
import { CostumeModal } from "./_components/custom_modal"
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query"
import {
  getUsers,
  getLeaveSetting,
  getUserLeaves,
  batchCreateUserLeave,
  createLeaveRecord,
  createUserLeave,
  register,
  deleteUser,
} from "@/lib/api"
import DataTable from "./_components/custome-table"
import { Toaster } from "@/components/ui/toaster"
import { Sheet, SheetContent } from "@/components/ui/sheet"
import UserLeaveRecord from "./_components/user_leave_record"
import { useToast } from "@/hooks/use-toast"
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover"
import { cn } from "@/lib/utils"
import { CalendarIcon } from "lucide-react"
import { format } from "date-fns"
import { Calendar } from "@/components/ui/calendar"

// Form schema for user registration
const registerFormSchema = z.object({
  firstName: z.string().min(2, { message: "First name must be at least 2 characters." }),
  lastName: z.string().min(2, { message: "Last name must be at least 2 characters." }),
  middleName: z.string().optional(),
  gender: z.enum(["MALE", "FEMALE"]),
  firstDayOfService: z.date(),
})

type RegisterFormData = z.infer<typeof registerFormSchema>

// Schema for user leave management
const userLeaveSchema = z.object({
  leaveId: z.string().min(1, "Please select a leave type"),
  carryOver: z.number().min(0, "Carry Over must be a positive number").optional(),
  used: z.number().min(0, "Used must be a positive number").optional(),
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
      gender: "MALE",
      firstDayOfService: new Date(),
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
          name="firstDayOfService"
          render={({ field }) => (
            <FormItem className="flex flex-col">
              <FormLabel>First Day of Service</FormLabel>
              <Popover>
                <PopoverTrigger asChild>
                  <FormControl>
                    <Button
                      variant={"outline"}
                      className={cn("w-[240px] pl-3 text-left font-normal", !field.value && "text-muted-foreground")}
                    >
                      {field.value ? format(field.value, "PPP") : <span>Pick a date</span>}
                      <CalendarIcon className="w-4 h-4 ml-auto opacity-50" />
                    </Button>
                  </FormControl>
                </PopoverTrigger>
                <PopoverContent className="w-auto p-0" align="start">
                  <Calendar
                    mode="single"
                    selected={field.value}
                    onSelect={field.onChange}
                    disabled={(date) => date > new Date() || date < new Date("1900-01-01")}
                    initialFocus
                  />
                </PopoverContent>
              </Popover>
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
        <Button type="submit">Register</Button>
      </form>
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
const leaveRecordSchema = z.object({
  userLeaveId: z.string().min(1, "Please select a user leave"),
  dateStart: z.date(),
  dateEnd: z.date(),
  leaveType: z.enum(["WHOLE_DAY", "HALF_DAY_MORNING", "HALF_DAY_AFTERNOON"]),
})

type LeaveRecordFormData = z.infer<typeof leaveRecordSchema>
interface LeaveRecordFormProps {
  userLeaves: IUserLeave[]
  onSubmit: (data: LeaveRecordFormData) => void
}

const LeaveRecordForm: React.FC<LeaveRecordFormProps> = ({ userLeaves, onSubmit }) => {
  const form = useForm<LeaveRecordFormData>({
    resolver: zodResolver(leaveRecordSchema),
    defaultValues: {
      userLeaveId: "",
      dateStart: new Date(),
      dateEnd: new Date(),
      leaveType: "WHOLE_DAY",
    },
  })

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
        <FormField
          control={form.control}
          name="userLeaveId"
          render={({ field }) => (
            <FormItem>
              <FormLabel>User Leave</FormLabel>
              <Select onValueChange={field.onChange} defaultValue={field.value}>
                <FormControl>
                  <SelectTrigger>
                    <SelectValue placeholder="Select user leave" />
                  </SelectTrigger>
                </FormControl>
                <SelectContent>
                  {userLeaves.map((userLeave) => (
                    <SelectItem key={userLeave._id} value={userLeave._id!}>
                      {`${userLeave.leave.name}`}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="dateStart"
          render={({ field }) => (
            <FormItem className="flex flex-col">
              <FormLabel>Start Date</FormLabel>
              <Popover>
                <PopoverTrigger asChild>
                  <FormControl>
                    <Button
                      variant={"outline"}
                      className={cn("w-[240px] pl-3 text-left font-normal", !field.value && "text-muted-foreground")}
                    >
                      {field.value ? format(field.value, "PPP") : <span>Pick a date</span>}
                      <CalendarIcon className="w-4 h-4 ml-auto opacity-50" />
                    </Button>
                  </FormControl>
                </PopoverTrigger>
                <PopoverContent className="w-auto p-0" align="start">
                  <Calendar
                    mode="single"
                    onSelect={field.onChange}
                    disabled={(date) => date < new Date()}
                    initialFocus
                  />
                </PopoverContent>
              </Popover>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="dateEnd"
          render={({ field }) => (
            <FormItem className="flex flex-col">
              <FormLabel>End Date</FormLabel>
              <Popover>
                <PopoverTrigger asChild>
                  <FormControl>
                    <Button
                      variant={"outline"}
                      className={cn("w-[240px] pl-3 text-left font-normal", !field.value && "text-muted-foreground")}
                    >
                      {field.value ? format(field.value, "PPP") : <span>Pick a date</span>}
                      <CalendarIcon className="w-4 h-4 ml-auto opacity-50" />
                    </Button>
                  </FormControl>
                </PopoverTrigger>
                <PopoverContent className="w-auto p-0" align="start">
                  <Calendar
                    mode="single"
                    onSelect={field.onChange}
                    disabled={(date) => date < new Date(form.getValues("dateStart")) || date < new Date()}
                    initialFocus
                  />
                </PopoverContent>
              </Popover>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="leaveType"
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
                  <SelectItem value="WHOLE_DAY">Whole Day</SelectItem>
                  <SelectItem value="HALF_DAY_MORNING">Half Day (Morning)</SelectItem>
                  <SelectItem value="HALF_DAY_AFTERNOON">Half Day (Afternoon)</SelectItem>
                </SelectContent>
              </Select>
              <FormMessage />
            </FormItem>
          )}
        />
        <Button type="submit">Create Leave Record</Button>
      </form>
    </Form>
  )
}

const UserLeaveForm: React.FC<{
  leaveSettings: ILeaveSetting[]
  onSubmit: (data: UserLeaveFormData) => void
  initialData: IUserLeave | null
}> = ({ leaveSettings, onSubmit, initialData }) => {
  const form = useForm<UserLeaveFormData>({
    resolver: zodResolver(userLeaveSchema),
    defaultValues: {
      leaveId: initialData?.leave?._id || "",
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
        <FormField
          control={form.control}
          name="used"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Used (8 Credit = 1 Day)</FormLabel>
              <FormControl>
                <Input type="number" {...field} onChange={(e) => field.onChange(Number(e.target.value))} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="carryOver"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Carry Over (8 Credit = 1 Day)</FormLabel>
              <FormControl>
                <Input type="number" {...field} onChange={(e) => field.onChange(Number(e.target.value))} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <Button type="submit">{initialData ? "Update" : "Add"} Leave</Button>
      </form>
    </Form>
  )
}

export default function Dashboard() {
  const [selectedUsers, setSelectedUsers] = useState<string[]>([])
  const [isRegisterModalOpen, setIsRegisterModalOpen] = useState(false)
  const [isBatchLeaveModalOpen, setIsBatchLeaveModalOpen] = useState(false)
  const [selectedUser, setSelectedUser] = useState<IUser | null>(null)
  const [searchQuery, setSearchQuery] = useState("")
  const [start, setStart] = useState(0)
  const [limit, _setLimit] = useState(10)
  const [isRecordSheetOpen, setIsRecordSheetOpen] = useState(false)
  const [isAddLeaveRecordModalOpen, setIsAddLeaveRecordModalOpen] = useState(false)
  const [isManageLeaveModalOpen, setIsManageLeaveModalOpen] = useState(false)
  const [selectedUserLeave, _setSelectedUserLeave] = useState<IUserLeave | null>(null)

  const queryClient = useQueryClient()
  const { toast } = useToast()

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

  const batchCreateUserLeaveMutation = useMutation({
    mutationFn: (data: { userIds: string[]; leaveId: string }) => batchCreateUserLeave(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["users"] })
      setIsBatchLeaveModalOpen(false)
      toast({
        title: "Batch leave added successfully",
        description: "Leaves have been added to the selected users.",
      })
    },
    onError: (error: any) => {
      toast({
        title: "Error adding batch leave",
        description: error.message || "An error occurred while adding batch leaves.",
        variant: "destructive",
      })
    },
  })

  const createLeaveRecordMutation = useMutation({
    mutationFn: (data: LeaveRecordFormData) => createLeaveRecord(selectedUser!._id!, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["userLeaveRecords", selectedUser?._id] })
      setIsAddLeaveRecordModalOpen(false)
      toast({
        title: "Leave record created successfully",
        description: "The leave record has been added.",
      })
    },
    onError: (error: any) => {
      toast({
        title: "Error creating leave record",
        description: error.response.data.message || "An error occurred while creating the leave record.",
        variant: "destructive",
      })
    },
  })

  const createUserLeaveMutation = useMutation({
    mutationFn: (data: { userId: string; leaveId: string; carryOver: number; used: number }) => createUserLeave(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["userLeaves", selectedUser?._id] })
      setIsManageLeaveModalOpen(false)
      toast({
        title: "Leave added successfully",
        description: "The user's leave has been added.",
      })
    },
    onError: (error: any) => {
      toast({
        title: "Error adding leave",
        description: error.response.data.message || "An error occurred while adding the leave.",
        variant: "destructive",
      })
    },
  })

  const createUser = useMutation({
    mutationFn: (data: IUser) => register(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["users"] })
      setIsManageLeaveModalOpen(false)
      toast({
        title: "User added successfully",
        description: "The user has been added.",
      })
    },
    onError: (error: any) => {
      toast({
        title: "Error adding User",
        description: error.response.data.message || "An error occurred while adding the User.",
        variant: "destructive",
      })
    },
  })

  useEffect(() => {
    refetch()
  }, [refetch])

  const handleRegister = (_newUser: RegisterFormData) => {
    createUser.mutate({
      role: "USER",
      firstName: _newUser.firstName,
      lastName: _newUser.lastName,
      middleName: _newUser.middleName,
      username: _newUser.firstName,
      gender: _newUser.gender,
      firstDayOfService: _newUser.firstDayOfService,
    } as IUser)
    setIsRegisterModalOpen(false)
  }

  const deleteUserMutation = useMutation({
    mutationKey: ["userDelete"],
    mutationFn: (data: any) => deleteUser(data).then((data) => data.data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["users"] })
    }
  
  })

  const handleDelete = () => {
    deleteUserMutation.mutate(selectedUsers)
    refetch()
    setSelectedUsers([])
  }

  const handleSearch = (query: string) => {
    setSearchQuery(query)
    setStart(0) // Reset pagination when searching
  }

  const handleBatchAddLeave = () => {
    setIsBatchLeaveModalOpen(true)
  }

  const handleBatchLeaveSubmit = (data: BatchLeaveFormData) => {
    batchCreateUserLeaveMutation.mutate({ userIds: selectedUsers, leaveId: data.leaveId })
  }

  const handleManageRecord = (user: IUser) => {
    setSelectedUser(user)
    setIsRecordSheetOpen(true)
  }

  const handleAddLeaveRecord = () => {
    setIsAddLeaveRecordModalOpen(true)
  }

  const handleLeaveRecordSubmit = (data: LeaveRecordFormData) => {
    createLeaveRecordMutation.mutate(data)
  }

  const handleManageLeave = (user: IUser) => {
    setSelectedUser(user)
    setIsManageLeaveModalOpen(true)
  }

  const handleAddUserLeave = (data: UserLeaveFormData) => {
    if (selectedUser) {
      createUserLeaveMutation.mutate({ ...data, userId: selectedUser._id as string } as any)
    }
  }

  return (
    <div className="container py-10 mx-auto">
      <Toaster />
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
          onManageRecord={handleManageRecord}
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
      <CostumeModal
        isOpen={isBatchLeaveModalOpen}
        onClose={() => setIsBatchLeaveModalOpen(false)}
        title="Batch Add Leave"
      >
        {leaveSettings && <BatchLeaveForm leaveSettings={leaveSettings} onSubmit={handleBatchLeaveSubmit} />}
      </CostumeModal>
      {/* Update the UserLeaveRecord component usage in the Sheet */}
      <Sheet open={isRecordSheetOpen} onOpenChange={setIsRecordSheetOpen}>
        <SheetContent side="right" className="w-[400px] sm:w-[640px]">
          {selectedUser && leaveSettings && (
            <UserLeaveRecord
              user={selectedUser}
              leaveSettings={leaveSettings}
              onClose={() => setIsRecordSheetOpen(false)}
              onAddLeaveRecord={handleAddLeaveRecord}
              isOpen={isRecordSheetOpen} // Add this line
            />
          )}
        </SheetContent>
      </Sheet>
      <CostumeModal
        isOpen={isAddLeaveRecordModalOpen}
        onClose={() => setIsAddLeaveRecordModalOpen(false)}
        title="Add Leave Record"
      >
        {userLeaves && <LeaveRecordForm userLeaves={userLeaves} onSubmit={handleLeaveRecordSubmit} />}
      </CostumeModal>
      <CostumeModal
        isOpen={isManageLeaveModalOpen}
        onClose={() => setIsManageLeaveModalOpen(false)}
        title={selectedUserLeave ? "Update User Leave" : "Add User Leave"}
      >
        {leaveSettings && (
          <UserLeaveForm leaveSettings={leaveSettings} onSubmit={handleAddUserLeave} initialData={selectedUserLeave} />
        )}
      </CostumeModal>
    </div>
  )
}

