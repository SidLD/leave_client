import type React from "react"
import { useState, useEffect } from "react"
import { PieChart, Pie, BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, Cell, Legend } from "recharts"
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { getUsers } from "@/lib/api"
import type { IUser } from "@/types/userType"
import { Search, RefreshCw } from "lucide-react"

// Dashboard Component
const DashboardClient: React.FC = () => {
  const [users, setUsers] = useState<IUser[]>([])
  const [start, _setStart] = useState(0)
  const [limit, _setLimit] = useState(10)
  const [searchTerm, setSearchTerm] = useState("")
  const [educationFilter, setEducationFilter] = useState<string | null>(null)
  const [positionFilter, setPositionFilter] = useState<string | null>(null)
  const [isLoading, setIsLoading] = useState(false)

  const fetchUsers = async () => {
    setIsLoading(true)
    try {
      const { data } = (await getUsers({
        start,
        limit,
        search: searchTerm,
      })) as unknown as any
      setUsers(data.users)
    } catch (error) {
      console.log(error)
    } finally {
      setIsLoading(false)
    }
  }

  useEffect(() => {
    fetchUsers()
  }, []) 

  const educationData = users.reduce(
    (acc, user) => {
      acc[user.educational_attainment] = (acc[user.educational_attainment] || 0) + 1
      return acc
    },
    {} as Record<string, number>,
  )

  const positionData = users.reduce(
    (acc, user) => {
      acc[user.position.name] = (acc[user.position.name] || 0) + 1
      return acc
    },
    {} as Record<string, number>,
  )

  const filteredEducationData = educationFilter
    ? Object.entries(educationData).filter(([key]) => key === educationFilter)
    : Object.entries(educationData)

  const filteredPositionData = positionFilter
    ? Object.entries(positionData).filter(([key]) => key === positionFilter)
    : Object.entries(positionData)

  const COLORS = ["#0088FE", "#00C49F", "#FFBB28", "#FF8042", "#8884D8"]

  return (
    <div className="container p-4 mx-auto space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-3xl font-bold">User Dashboard</h1>
        <Button onClick={fetchUsers} disabled={isLoading}>
          <RefreshCw className="w-4 h-4 mr-2" />
          Refresh Data
        </Button>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Filters</CardTitle>
          <CardDescription>Refine your dashboard data</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 gap-4 md:grid-cols-3">
            <div className="flex items-center space-x-2">
              <Search className="w-4 h-4 text-gray-500" />
              <Input
                placeholder="Search users..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full"
              />
            </div>
            <Select onValueChange={(value) => setEducationFilter(value)}>
              <SelectTrigger>
                <SelectValue placeholder="Filter by Education" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All</SelectItem>
                {Object.keys(educationData).map((edu) => (
                  <SelectItem key={edu} value={edu}>
                    {edu}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
            <Select onValueChange={(value) => setPositionFilter(value)}>
              <SelectTrigger>
                <SelectValue placeholder="Filter by Position" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All</SelectItem>
                {Object.keys(positionData).map((pos) => (
                  <SelectItem key={pos} value={pos}>
                    {pos}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        </CardContent>
      </Card>

      <Tabs defaultValue="charts">
        <TabsList className="grid w-full grid-cols-2">
          <TabsTrigger value="charts">Charts</TabsTrigger>
          <TabsTrigger value="data">Raw Data</TabsTrigger>
        </TabsList>
        <TabsContent value="charts">
          <div className="grid grid-cols-1 gap-6 mt-6 md:grid-cols-2">
            <Card>
              <CardHeader>
                <CardTitle>Educational Attainment</CardTitle>
                <CardDescription>Distribution of user education levels</CardDescription>
              </CardHeader>
              <CardContent>
                <ResponsiveContainer width="100%" height={300}>
                  <PieChart>
                    <Pie
                      data={filteredEducationData.map(([name, value]) => ({ name, value }))}
                      dataKey="value"
                      nameKey="name"
                      cx="50%"
                      cy="50%"
                      outerRadius={80}
                      label
                    >
                      {filteredEducationData.map((_entry, index) => (
                        <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                      ))}
                    </Pie>
                    <Tooltip />
                    <Legend />
                  </PieChart>
                </ResponsiveContainer>
              </CardContent>
            </Card>
            <Card>
              <CardHeader>
                <CardTitle>Users by Position</CardTitle>
                <CardDescription>Number of users in each position</CardDescription>
              </CardHeader>
              <CardContent>
                <ResponsiveContainer width="100%" height={300}>
                  <BarChart data={filteredPositionData.map(([name, value]) => ({ name, value }))}>
                    <XAxis dataKey="name" />
                    <YAxis />
                    <Tooltip />
                    <Legend />
                    <Bar dataKey="value" fill="#8884d8">
                      {filteredPositionData.map((_entry, index) => (
                        <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                      ))}
                    </Bar>
                  </BarChart>
                </ResponsiveContainer>
              </CardContent>
            </Card>
          </div>
        </TabsContent>
        <TabsContent value="data">
          <Card>
            <CardHeader>
              <CardTitle>User Data</CardTitle>
              <CardDescription>Raw user information</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="overflow-x-auto">
                <table className="w-full text-sm text-left text-gray-500">
                  <thead className="text-xs text-gray-700 uppercase bg-gray-50">
                    <tr>
                      <th className="px-6 py-3">Username</th>
                      <th className="px-6 py-3">Email</th>
                      <th className="px-6 py-3">Education</th>
                      <th className="px-6 py-3">Position</th>
                    </tr>
                  </thead>
                  <tbody>
                    {users.map((user) => (
                      <tr key={user._id} className="bg-white border-b">
                        <td className="px-6 py-4">{user.username}</td>
                        <td className="px-6 py-4">{user.email}</td>
                        <td className="px-6 py-4">{user.educational_attainment}</td>
                        <td className="px-6 py-4">{user.position.name}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  )
}

export default DashboardClient

