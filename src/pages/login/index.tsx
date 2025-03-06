import { useState } from "react"
import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import { z } from "zod"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Toaster } from "@/components/ui/toaster"
import { useToast } from "@/hooks/use-toast"
import { login } from "@/lib/api"
import type { TeacherLoginType } from "@/types/userType"
import { ClapperboardIcon as ChalkboardTeacher, Eye, EyeOff } from "lucide-react"
import { useStore } from "@/store/app.store"
import { useMutation } from "@tanstack/react-query"
import { useNavigate } from "react-router-dom"

const teacherLoginSchema = z.object({
  username: z.string().min(1, "Employee ID is required"),
  password: z.string().min(6, "Password must be at least 6 characters"),
})

export default function TeacherLoginView() {
  const [showPassword, setShowPassword] = useState(false)
  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<TeacherLoginType>({
    resolver: zodResolver(teacherLoginSchema),
  })
  const { setToken } = useStore()
  const { toast } = useToast()
  const createMutation = useMutation({
    mutationFn: login,
    onSuccess: () => {
      toast({ title: "Welcome User" })
    },
  })
  const navigator = useNavigate()
  const onSubmit = async (data: TeacherLoginType) => {
    try {
      const response = await createMutation.mutateAsync(data)
      if(response.status == 200){
        const { token } = response.data;
        console.log(token)
        if(token){
          setToken(token)
          window.location.reload()
        }
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
    <div className="flex w-full min-h-screen bg-gradient-to-br from-blue-50 to-blue-100">
      <Toaster /> 
      {/* Decorative Side Section */}
      <div className="items-center justify-center hidden w-1/2 bg-green-600 lg:flex">
        <div className="text-center">
          <ChalkboardTeacher className="w-32 h-32 mx-auto text-white" />
          <h1 className="mt-4 text-4xl font-bold text-white">Leave Portal</h1>
          <p className="mt-2 text-xl text-blue-100">Empowering educators, inspiring minds</p>
        </div>
      </div>

      {/* Login Form Section */}
      <div className="flex items-center justify-center w-full px-6 py-12 lg:w-1/2">
        <Card className="w-full max-w-md shadow-lg">
          <CardHeader className="space-y-1">
            <CardTitle className="text-2xl font-bold text-center text-green-600">Leave Login</CardTitle>
            <CardDescription className="text-center">Enter your credentials to access your account</CardDescription>
          </CardHeader>
          <form onSubmit={handleSubmit(onSubmit)}>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="employeeId" className="text-sm font-medium text-gray-700">
                  Username
                </Label>
                <Input
                  id="employeeId"
                  type="text"
                  placeholder="Enter your Username"
                  {...register("username")}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
                {errors.username && <p className="text-sm text-red-500">{errors.username.message}</p>}
              </div>
              <div className="space-y-2">
                <Label htmlFor="password" className="text-sm font-medium text-gray-700">
                  Password
                </Label>
                <div className="relative">
                  <Input
                    id="password"
                    type={showPassword ? "text" : "password"}
                    placeholder="Enter your password"
                    {...register("password")}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-green-500"
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute inset-y-0 right-0 flex items-center pr-3 text-gray-400 hover:text-gray-500"
                  >
                    {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                  </button>
                </div>
                {errors.password && <p className="text-sm text-red-500">{errors.password.message}</p>}
              </div>
            </CardContent>
            <CardFooter>
              <Button
                type="submit"
                className="w-full px-4 py-2 font-semibold text-white transition duration-300 ease-in-out transform bg-green-600 rounded-md hover:bg-green-700 hover:scale-105 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-opacity-50"
                disabled={isSubmitting}
              >
                {isSubmitting ? "Logging in..." : "Log in"}
              </Button>
            </CardFooter>
                  <div className="p-4 text-center ">
                  Don't have an account?{" "}
                  <Button onClick={() => {
                      navigator('/register')
                  }} className=" hover:underline">
                    Register here
              </Button>
            </div>
          </form>
        </Card>
      </div>

      <Toaster />
    </div>
  )
}

