"use client"

import { useEffect, useState } from "react"
import { zodResolver } from "@hookform/resolvers/zod"
import { useForm } from "react-hook-form"
import { z } from "zod"
import { useQuery, useMutation, QueryClient, QueryClientProvider } from "@tanstack/react-query"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Form, FormControl, FormDescription, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form"
import { Input } from "@/components/ui/input"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Loader2, Eye, EyeOff, Save, User, Lock } from "lucide-react"
import { userPasswordSchema, userSettingSchema } from "@/types/userType"
import { useToast } from "@/hooks/use-toast"
import { getUserSetting, updateUserPassword, updateUserSetting } from "@/lib/api"
import { useStore } from "@/store/app.store"

// Create a client
const queryClient = new QueryClient()


type UserSettingsFormValues = z.infer<typeof userSettingSchema>
type UserPasswordFormValues = z.infer<typeof userPasswordSchema>

function UserSettingsContent() {
  const [showCurrentPassword, setShowCurrentPassword] = useState(false)
  const [showNewPassword, setShowNewPassword] = useState(false)
  const {toast} = useToast()

  const {getUserInfo} = useStore()
  // Fetch user settings
  const { data: userData, isLoading: isLoadingUser } = useQuery({
    queryKey: ["userSettings"],
    queryFn: () => getUserSetting(getUserInfo().id).then(data => data.data),
  })

  // Update user settings mutation
  const { mutate: updateSetting, isPending: isUpdatingSettings } = useMutation({
    mutationFn: (data:UserSettingsFormValues) => updateUserSetting(data).then(data => data),
    onSuccess: () => {
      toast({
        title: "Settings updated",
        description: "Your profile information has been updated successfully.",
      })
      queryClient.invalidateQueries({ queryKey: ["userSettings"] })
    },
    onError: () => {
      toast({
        title: "Error",
        description: "Failed to update settings. Please try again.",
        variant: "destructive",
      })
    },
  })

  // Update password mutation
  const { mutate: updatePassword, isPending: isUpdatingPassword } = useMutation({
    mutationFn: updateUserPassword,
    onSuccess: () => {
      toast({
        title: "Password updated",
        description: "Your password has been changed successfully.",
      })
      passwordForm.reset({
        _id: userData?._id || "",
        password: "",
        newPassword: "",
      })
    },
    onError: () => {
      toast({
        title: "Error",
        description: "Failed to update password. Please try again.",
        variant: "destructive",
      })
    },
  })

  // Profile form
  const profileForm = useForm<UserSettingsFormValues>({
    resolver: zodResolver(userSettingSchema),
    defaultValues: userData || {
      _id: "",
      firstName: "",
      lastName: "",
      middleName: "",
      employeeId: "",
      position: "",
      officeDepartment: "",
      salary: 0,
    },
    values: userData,
  })

  useEffect(() => {
        if(userData){
            profileForm.setValue('employeeId', userData.employeeId)
            profileForm.setValue('firstName', userData.firstName)
            profileForm.setValue('lastName', userData.lastName)
            profileForm.setValue('middleName', userData.middleName)
            profileForm.setValue('officeDepartment', userData.officeDepartment)
            profileForm.setValue('position', userData.position)
            profileForm.setValue('salary', userData.salary)
        }
  }, [userData])

  // Password form
  const passwordForm = useForm<UserPasswordFormValues>({
    resolver: zodResolver(userPasswordSchema),
    defaultValues: {
      _id: userData?._id || "",
      password: "",
      newPassword: "",
    },
    values: userData ? { _id: userData._id, password: "", newPassword: "" } : undefined,
  })

  const  onSubmitProfile = async (data: UserSettingsFormValues) => {
    console.log(data)
    updateSetting(data)
  }

  const onSubmitPassword = async (data: UserPasswordFormValues) => {
    console.log(data)
    updatePassword(data)
  }

  if (isLoadingUser) {
    return (
      <div className="flex items-center justify-center h-64">
        <Loader2 className="w-8 h-8 animate-spin text-primary" />
        <span className="ml-2">Loading user data...</span>
      </div>
    )
  }

  return (
    <div className="container max-w-5xl px-4 py-6 mx-auto md:py-10 md:px-6">
      <Tabs defaultValue="profile" className="w-full">
        <TabsList className="grid w-full grid-cols-2 mb-8">
          <TabsTrigger value="profile" className="flex items-center gap-2">
            <User className="w-4 h-4" />
            <span className="hidden sm:inline">Profile Information</span>
            <span className="sm:hidden">Profile</span>
          </TabsTrigger>
          <TabsTrigger value="password" className="flex items-center gap-2">
            <Lock className="w-4 h-4" />
            <span className="hidden sm:inline">Change Password</span>
            <span className="sm:hidden">Password</span>
          </TabsTrigger>
        </TabsList>

        <TabsContent value="profile">
          <Card>
            <CardHeader>
              <CardTitle>Profile Information</CardTitle>
              <CardDescription>Update your personal and employment details</CardDescription>
            </CardHeader>
            <CardContent>
              <Form {...profileForm}>
                <form onSubmit={profileForm.handleSubmit(onSubmitProfile)} className="space-y-6">
                  <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
                    <FormField
                      control={profileForm.control}
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
                      control={profileForm.control}
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
                  </div>

                  <FormField
                    control={profileForm.control}
                    name="middleName"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Middle Name (Optional)</FormLabel>
                        <FormControl>
                          <Input placeholder="Middle name" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
                    <FormField
                      control={profileForm.control}
                      name="employeeId"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Employee ID</FormLabel>
                          <FormControl>
                            <Input placeholder="EMP12345" {...field} />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    <FormField
                      control={profileForm.control}
                      name="position"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Position</FormLabel>
                          <FormControl>
                            <Input placeholder="Software Engineer" {...field} />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  </div>

                  <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
                    <FormField
                      control={profileForm.control}
                      name="officeDepartment"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Office Department</FormLabel>
                          <FormControl>
                            <Input placeholder="Engineering" {...field} />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  </div>

                  <FormField
                    control={profileForm.control}
                    name="salary"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Salary</FormLabel>
                        <FormControl>
                          <Input
                            type="number"
                            placeholder="0.00"
                            {...field}
                            onChange={(e) => {
                              field.onChange(Number.parseFloat(e.target.value) || 0)
                            }}
                          />
                        </FormControl>
                        <FormDescription>Annual salary amount (before tax)</FormDescription>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={profileForm.control}
                    name="_id"
                    render={({ field }) => (
                      <FormItem className="hidden">
                        <FormControl>
                          <Input {...field} />
                        </FormControl>
                      </FormItem>
                    )}
                  />

                  <div className="flex justify-end">
                    <Button type="submit" disabled={isUpdatingSettings} className="flex items-center gap-2">
                      {isUpdatingSettings ? (
                        <>
                          <Loader2 className="w-4 h-4 animate-spin" />
                          <span>Saving...</span>
                        </>
                      ) : (
                        <>
                          <Save className="w-4 h-4" />
                          <span>Save Changes</span>
                        </>
                      )}
                    </Button>
                  </div>
                </form>
              </Form>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="password">
          <Card>
            <CardHeader>
              <CardTitle>Change Password</CardTitle>
              <CardDescription>Update your account password</CardDescription>
            </CardHeader>
            <CardContent>
              <Form {...passwordForm}>
                <form onSubmit={passwordForm.handleSubmit(onSubmitPassword)} className="space-y-6">
                  <FormField
                    control={passwordForm.control}
                    name="password"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Current Password</FormLabel>
                        <FormControl>
                          <div className="relative">
                            <Input
                              type={showCurrentPassword ? "text" : "password"}
                              placeholder="Enter current password"
                              {...field}
                            />
                            <Button
                              type="button"
                              variant="ghost"
                              size="sm"
                              className="absolute top-0 right-0 h-full px-3 py-2 hover:bg-transparent"
                              onClick={() => setShowCurrentPassword(!showCurrentPassword)}
                            >
                              {showCurrentPassword ? (
                                <EyeOff className="w-4 h-4 text-muted-foreground" />
                              ) : (
                                <Eye className="w-4 h-4 text-muted-foreground" />
                              )}
                              <span className="sr-only">{showCurrentPassword ? "Hide password" : "Show password"}</span>
                            </Button>
                          </div>
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={passwordForm.control}
                    name="newPassword"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>New Password</FormLabel>
                        <FormControl>
                          <div className="relative">
                            <Input
                              type={showNewPassword ? "text" : "password"}
                              placeholder="Enter new password"
                              {...field}
                            />
                            <Button
                              type="button"
                              variant="ghost"
                              size="sm"
                              className="absolute top-0 right-0 h-full px-3 py-2 hover:bg-transparent"
                              onClick={() => setShowNewPassword(!showNewPassword)}
                            >
                              {showNewPassword ? (
                                <EyeOff className="w-4 h-4 text-muted-foreground" />
                              ) : (
                                <Eye className="w-4 h-4 text-muted-foreground" />
                              )}
                              <span className="sr-only">{showNewPassword ? "Hide password" : "Show password"}</span>
                            </Button>
                          </div>
                        </FormControl>
                        <FormDescription>Password must be at least 6 characters long</FormDescription>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={passwordForm.control}
                    name="_id"
                    render={({ field }) => (
                      <FormItem className="hidden">
                        <FormControl>
                          <Input {...field} />
                        </FormControl>
                      </FormItem>
                    )}
                  />

                  <div className="flex justify-end">
                    <Button type="submit" disabled={isUpdatingPassword} className="flex items-center gap-2">
                      {isUpdatingPassword ? (
                        <>
                          <Loader2 className="w-4 h-4 animate-spin" />
                          <span>Updating...</span>
                        </>
                      ) : (
                        <>
                          <Lock className="w-4 h-4" />
                          <span>Update Password</span>
                        </>
                      )}
                    </Button>
                  </div>
                </form>
              </Form>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  )
}

// Wrap the component with QueryClientProvider
export default function UserSettingsPage() {
  return (
    <QueryClientProvider client={queryClient}>
      <UserSettingsContent />
    </QueryClientProvider>
  )
}

