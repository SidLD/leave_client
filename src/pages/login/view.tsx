import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Toaster } from "@/components/ui/toaster"
import { useToast } from "@/hooks/use-toast"

import logo from "../../assets/logo_c.png"
import { login } from "@/lib/api"
import { z } from "zod"
import { TeacherLoginType } from "@/types/userType"
import { useAuthStore } from "@/store/userStore"

const teacherLoginSchema = z.object({
  username: z.string().min(1, "Employee ID is required"),
  password: z.string().min(6, "Password must be at least 6 characters"),
})

export default function TeacherLoginView() {
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<TeacherLoginType>({
    resolver: zodResolver(teacherLoginSchema),
  })
  const setToken = useAuthStore((state) => state.setToken)
  const { toast } = useToast()

  const onSubmit = async (data: TeacherLoginType) => {
    try {
      const response = await login(data) as unknown as any
      toast({
        title: "Success",
        description: "Welcome, Teacher!",
      })
      if (response.data && response.data.token) {
        setToken(response.data.token)
        // Redirect to teacher dashboard or appropriate page
        // navigate('/teacher/dashboard')
      }
    } catch (error: any) {
      console.error(error.response)
      toast({
        title: "Error",
        variant: "destructive",
        description: error.response?.data?.message || "Login failed. Please try again.",
      })
    }
  }

  return (
    <div className="flex w-full min-h-screen bg-gray-100">
      {/* Logo Section */}
      <div className="items-center justify-center hidden w-1/2 bg-blue-600 lg:flex">
        <div className="text-center">
          <img src={logo || "/placeholder.svg"} alt="School Logo" className="w-32 h-32 mx-auto" />
          <h1 className="mt-4 text-4xl font-bold text-white">Teacher Portal</h1>
          <p className="mt-2 text-xl text-blue-100">Welcome back, Educator!</p>
        </div>
      </div>

      {/* Login Form Section */}
      <div className="flex items-center justify-center w-full px-6 py-12 lg:w-1/2">
        <Card className="w-full max-w-md">
          <CardHeader>
            <CardTitle className="text-2xl font-bold text-center text-blue-600">Teacher Login</CardTitle>
            <CardDescription className="text-center">Enter your credentials to access your account</CardDescription>
          </CardHeader>
          <form onSubmit={handleSubmit(onSubmit)}>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="employeeId">Employee ID</Label>
                <Input id="employeeId" type="text" placeholder="Enter your Employee ID" {...register("employeeId")} />
                {errors.employeeId && <p className="text-sm text-red-500">{errors.employeeId.message}</p>}
              </div>
              <div className="space-y-2">
                <Label htmlFor="password">Password</Label>
                <Input id="password" type="password" placeholder="Enter your password" {...register("password")} />
                {errors.password && <p className="text-sm text-red-500">{errors.password.message}</p>}
              </div>
            </CardContent>
            <CardFooter>
              <Button type="submit" className="w-full bg-blue-600 hover:bg-blue-700">
                Login as Teacher
              </Button>
            </CardFooter>
          </form>
        </Card>
      </div>

      <Toaster />
    </div>
  )
}

