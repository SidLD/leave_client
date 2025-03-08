"use client"

import { useState, useEffect } from "react"
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query"
import { Check, X, Search, Trash2 } from "lucide-react"
import { deleteUsers, getUsers, updateUserStatus } from "@/lib/api"

// User type definition
export interface IUser {
  _id?: string
  firstName: string
  lastName: string
  office: string
  middleName?: string
  employeeId: string
  role: "USER" | "ADMIN"
  gender: "MALE" | "FEMALE"
  password: string
  firstDayOfService: Date
  position: string
  salary: number
  status: "APPROVED" | "REJECTED" | "PENDING"
  officeDepartment: string
}

export default function UserApprovalDashboard() {
  const queryClient = useQueryClient()
  const [searchTerm, setSearchTerm] = useState("")
  const [genderFilter, setGenderFilter] = useState<string | null>(null)
  const [positionFilter, setPositionFilter] = useState<string | null>(null)
  const [departmentFilter, setDepartmentFilter] = useState<string | null>(null)
  const [selectedUsers, setSelectedUsers] = useState<string[]>([])
  const [selectAll, setSelectAll] = useState(false)
  const [isMobile, setIsMobile] = useState(false)

  // Check screen size for responsive design
  useEffect(() => {
    const checkScreenSize = () => {
      setIsMobile(window.innerWidth < 768)
    }

    checkScreenSize()
    window.addEventListener("resize", checkScreenSize)

    return () => {
      window.removeEventListener("resize", checkScreenSize)
    }
  }, [])

  // Fetch users
  const {
    data: users = [],
    isLoading,
    error,
  } = useQuery<IUser[]>({
    queryKey: ["users"],
    queryFn: () => getUsers({}).then(data => data.data),
  })

  // Status update mutation
  const statusMutation = useMutation({
    mutationFn: (data: {
        users: string[], status: string
    }) => updateUserStatus(data).then(data => data.data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["users"] })
      setSelectedUsers([])
      setSelectAll(false)
    },
  })

  // Delete users mutation
  const deleteMutation = useMutation({
    mutationFn: (data: string[]) => deleteUsers(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["users"] })
      setSelectedUsers([])
      setSelectAll(false)
    },
  })

  // Handle batch approve action
  const handleBatchApprove = () => {
    if (selectedUsers.length === 0) return
    statusMutation.mutate({ users: selectedUsers, status: "APPROVED" })
  }

  // Handle batch reject action
  const handleBatchReject = () => {
    if (selectedUsers.length === 0) return
    statusMutation.mutate({ users: selectedUsers, status: "REJECTED" })
  }

  // Handle batch delete action
  const handleBatchDelete = () => {
    if (selectedUsers.length === 0) return
    if (window.confirm(`Are you sure you want to delete ${selectedUsers.length} user(s)?`)) {
      deleteMutation.mutate(selectedUsers)
    }
  }

  // Handle checkbox selection
  const handleSelectUser = (userId: string) => {
    setSelectedUsers((prev) => (prev.includes(userId) ? prev.filter((id) => id !== userId) : [...prev, userId]))
  }

  // Handle select all checkbox
  const handleSelectAll = () => {
    if (selectAll) {
      setSelectedUsers([])
    } else {
      setSelectedUsers(filteredUsers.map((user) => user._id!).filter(Boolean))
    }
    setSelectAll(!selectAll)
  }

  // Extract unique values for filters
  const positions = [...new Set(users.map((user) => user.position))]
  const departments = [...new Set(users.map((user) => user.officeDepartment))]

  // Filter users based on search and filters
  const filteredUsers = users.filter((user) => {
    const matchesSearch =
      searchTerm === "" ||
      user.firstName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      user.lastName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      user.employeeId.toLowerCase().includes(searchTerm.toLowerCase())

    const matchesGender = !genderFilter || user.gender === genderFilter

    const matchesPosition = !positionFilter || user.position === positionFilter

    const matchesDepartment = !departmentFilter || user.officeDepartment === departmentFilter

    return matchesSearch && matchesGender && matchesPosition && matchesDepartment
  })

  // Update selectAll state when filtered users change
  useEffect(() => {
    if (filteredUsers.length > 0 && selectedUsers.length === filteredUsers.length) {
      setSelectAll(true)
    } else {
      setSelectAll(false)
    }
  }, [selectedUsers, filteredUsers])

  if (error) {
    return <div className="text-red-500">Error loading users: {(error as Error).message}</div>
  }

  return (
    <div className="container p-4 mx-auto">
      <div className="p-6 bg-white rounded-lg shadow-md">
        <div className="mb-6">
          <h1 className="mb-2 text-2xl font-bold">User Approval Management</h1>
          <p className="text-gray-600">Review and manage user approval requests</p>
        </div>

        <div className="flex flex-col gap-4 mb-6 md:flex-row">
          <div className="relative flex-1">
            <div className="absolute text-gray-400 left-3 top-3">
              <Search size={18} />
            </div>
            <input
              type="text"
              placeholder="Search by name or employee ID..."
              className="w-full py-2 pl-10 pr-4 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
          <div className="flex flex-col gap-2 sm:flex-row">
            <select
              className="px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              value={genderFilter || ""}
              onChange={(e) => setGenderFilter(e.target.value || null)}
            >
              <option value="">All genders</option>
              <option value="MALE">Male</option>
              <option value="FEMALE">Female</option>
            </select>

            <select
              className="px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              value={positionFilter || ""}
              onChange={(e) => setPositionFilter(e.target.value || null)}
            >
              <option value="">All positions</option>
              {positions.map((position) => (
                <option key={position} value={position}>
                  {position}
                </option>
              ))}
            </select>

            <select
              className="px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              value={departmentFilter || ""}
              onChange={(e) => setDepartmentFilter(e.target.value || null)}
            >
              <option value="">All departments</option>
              {departments.map((department) => (
                <option key={department} value={department}>
                  {department}
                </option>
              ))}
            </select>
          </div>
        </div>

        {/* Batch action buttons */}
        {selectedUsers.length > 0 && (
          <div className="flex flex-wrap gap-2 mb-4">
            <span className="flex items-center text-sm text-gray-600">
              {selectedUsers.length} user{selectedUsers.length !== 1 ? "s" : ""} selected
            </span>
            <div className="flex-grow"></div>
            <button
              className="flex items-center gap-1 px-3 py-2 text-sm text-white bg-green-600 rounded hover:bg-green-700"
              onClick={handleBatchApprove}
              disabled={statusMutation.isPending}
            >
              <Check size={16} />
              Approve Selected
            </button>
            <button
              className="flex items-center gap-1 px-3 py-2 text-sm text-white bg-red-600 rounded hover:bg-red-700"
              onClick={handleBatchReject}
              disabled={statusMutation.isPending}
            >
              <X size={16} />
              Reject Selected
            </button>
            <button
              className="flex items-center gap-1 px-3 py-2 text-sm text-white bg-gray-600 rounded hover:bg-gray-700"
              onClick={handleBatchDelete}
              disabled={deleteMutation.isPending}
            >
              <Trash2 size={16} />
              Delete Selected
            </button>
          </div>
        )}

        <div className="overflow-x-auto">
          <table className="min-w-full bg-white border border-gray-200">
            <thead>
              <tr className="bg-gray-100">
                <th className="px-4 py-3 text-left border-b">
                  <div className="flex items-center">
                    <input
                      type="checkbox"
                      className="w-4 h-4 mr-2 border-gray-300 rounded"
                      checked={selectAll}
                      onChange={handleSelectAll}
                    />
                    <span className="hidden sm:inline">Select All</span>
                  </div>
                </th>
                <th className="px-4 py-3 text-left border-b">Employee ID</th>
                <th className="px-4 py-3 text-left border-b">Name</th>
                <th className="hidden px-4 py-3 text-left border-b md:table-cell">Position</th>
                <th className="hidden px-4 py-3 text-left border-b lg:table-cell">Department</th>
                <th className="hidden px-4 py-3 text-left border-b sm:table-cell">Gender</th>
                <th className="px-4 py-3 text-left border-b">Status</th>
              </tr>
            </thead>
            <tbody>
              {isLoading ? (
                Array(5)
                  .fill(0)
                  .map((_, index) => (
                    <tr key={index}>
                      {Array(7)
                        .fill(0)
                        .map((_, cellIndex) => (
                          <td key={cellIndex} className="px-4 py-3 border-b">
                            <div className="h-6 bg-gray-200 rounded animate-pulse"></div>
                          </td>
                        ))}
                    </tr>
                  ))
              ) : filteredUsers.length === 0 ? (
                <tr>
                  <td colSpan={7} className="py-6 text-center text-gray-500 border-b">
                    No users found matching your criteria
                  </td>
                </tr>
              ) : (
                filteredUsers.map((user) => (
                  <tr
                    key={user._id}
                    className={`hover:bg-gray-50 ${selectedUsers.includes(user._id!) ? "bg-blue-50" : ""}`}
                  >
                    <td className="px-4 py-3 border-b">
                      <input
                        type="checkbox"
                        className="w-4 h-4 border-gray-300 rounded"
                        checked={selectedUsers.includes(user._id!)}
                        onChange={() => handleSelectUser(user._id!)}
                      />
                    </td>
                    <td className="px-4 py-3 border-b">{user.employeeId}</td>
                    <td className="px-4 py-3 border-b">
                      <div>
                        {user.firstName} {user.middleName ? `${user.middleName.charAt(0)}. ` : ""}
                        {user.lastName}
                      </div>
                      {/* Mobile-only information */}
                      <div className="flex flex-col mt-1 text-xs text-gray-500 md:hidden">
                        <span>{user.position}</span>
                        <span>{user.officeDepartment}</span>
                        <span className="mt-1">{user.gender === "MALE" ? "Male" : "Female"}</span>
                      </div>
                    </td>
                    <td className="hidden px-4 py-3 border-b md:table-cell">{user.position}</td>
                    <td className="hidden px-4 py-3 border-b lg:table-cell">{user.officeDepartment}</td>
                    <td className="hidden px-4 py-3 border-b sm:table-cell">
                      {user.gender === "MALE" ? "Male" : "Female"}
                    </td>
                    <td className="px-4 py-3 border-b">
                      <span
                        className={`inline-block px-2 py-1 text-xs font-semibold rounded-full ${
                          user.status === "APPROVED"
                            ? "bg-green-100 text-green-800"
                            : user.status === "REJECTED"
                              ? "bg-red-100 text-red-800"
                              : "bg-yellow-100 text-yellow-800"
                        }`}
                      >
                        {user.status}
                      </span>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>

        {/* Mobile view action buttons (fixed at bottom) */}
        {isMobile && selectedUsers.length > 0 && (
          <div className="fixed bottom-0 left-0 right-0 flex justify-between p-3 bg-white border-t shadow-lg">
            <span className="flex items-center text-sm font-medium">{selectedUsers.length} selected</span>
            <div className="flex gap-2">
              <button
                className="flex items-center justify-center w-10 h-10 text-white bg-green-600 rounded-full"
                onClick={handleBatchApprove}
                disabled={statusMutation.isPending}
              >
                <Check size={20} />
              </button>
              <button
                className="flex items-center justify-center w-10 h-10 text-white bg-red-600 rounded-full"
                onClick={handleBatchReject}
                disabled={statusMutation.isPending}
              >
                <X size={20} />
              </button>
              <button
                className="flex items-center justify-center w-10 h-10 text-white bg-gray-600 rounded-full"
                onClick={handleBatchDelete}
                disabled={deleteMutation.isPending}
              >
                <Trash2 size={20} />
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}

