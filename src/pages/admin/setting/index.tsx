// "use client"

// import { useEffect, useState } from 'react'
// import { zodResolver } from '@hookform/resolvers/zod'
// import { useForm } from 'react-hook-form'
// import * as z from 'zod'
// import { Button } from "@/components/ui/button"
// import {
//   Form,
//   FormControl,
//   FormField,
//   FormItem,
//   FormLabel,
//   FormMessage,
// } from "@/components/ui/form"
// import { Input } from "@/components/ui/input"
// import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
// import { Separator } from "@/components/ui/separator"
// import { useToast } from '@/hooks/use-toast'
// import { getUserSetting, updateUserSetting } from '@/lib/api'
// import { UserType } from '@/lib/interface'

// // Schema with optional password fields
// const userSettingsSchema = z.object({
//   username: z.string().min(2, 'Username must be at least 2 characters.').max(30, 'Username must not exceed 30 characters.'),
//   email: z.string().email('Invalid email address.'),
//   firstName: z.string().min(1, 'First name is required.'),
//   lastName: z.string().min(1, 'Last name is required.'),
//   middleName: z.string().optional(),
//   currentPassword: z.string().optional(), // Make current password optional
//   newPassword: z.string().optional(),
//   confirmPassword: z.string().optional(),
// }).refine((data) => {
//   if (data.newPassword || data.confirmPassword) {
//     return data.newPassword === data.confirmPassword;
//   }
//   return true;
// }, {
//   message: "Passwords don't match",
//   path: ["confirmPassword"],
// });

// type UserSettingsFormValues = z.infer<typeof userSettingsSchema>

// const initialData = {
//   username: "johndoe",
//   email: "johndoe@example.com",
//   firstName: "John",
//   lastName: "Doe",
//   middleName: "",
//   currentPassword: "",
//   newPassword: "",
//   confirmPassword: "",
// }

// export default function ContributorSetting() {
//   const [isLoading, setIsLoading] = useState<boolean>(false)
//   const { toast } = useToast()
//   const form = useForm<UserSettingsFormValues>({
//     resolver: zodResolver(userSettingsSchema),
//     defaultValues: initialData,
//   })

//   async function onSubmit(data: UserSettingsFormValues) {
//     try {
//       setIsLoading(true)
//       await updateUserSetting(data);
//       setTimeout(() => {
//         setIsLoading(false)
//         toast({
//           title: "Settings updated",
//           description: "Your settings have been successfully updated.",
//         })
//         // Reset form fields, except for the username, email, etc.
//         if (data.newPassword) {
//           form.reset({ ...data, currentPassword: "", newPassword: "", confirmPassword: "" })
//         }
//       }, 2000)
//     } catch (error) {
      
//     }
//   }

//   useEffect(() => {
//       const fetchUserSetting = async () =>  {
//        try {
//         const {data} = await getUserSetting({}) as unknown as any;
//         const userData:UserType = data;
//         form.setValue('firstName', userData.firstName)
//         form.setValue('middleName', userData.middleName)
//         form.setValue('lastName', userData.lastName)
//         form.setValue('username', userData.username)
//         form.setValue('email', userData.email)
//        } catch (error) {
//         console.log(error)
//        }
//       }
//       fetchUserSetting()
//   }, [])

//   return (
//     <Card className="w-full max-w-2xl mx-auto">
//       <CardHeader>
//         <CardTitle>User Settings</CardTitle>
//         <CardDescription>
//           Update your profile information and password here. Click save when you're done.
//         </CardDescription>
//       </CardHeader>
//       <CardContent>
//         <Form {...form}>
//           <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
//             <FormField
//               control={form.control}
//               name="username"
//               render={({ field }) => (
//                 <FormItem>
//                   <FormLabel>Username</FormLabel>
//                   <FormControl>
//                     <Input placeholder="johndoe" {...field} />
//                   </FormControl>
//                   <FormMessage />
//                 </FormItem>
//               )}
//             />
//             <FormField
//               control={form.control}
//               name="email"
//               render={({ field }) => (
//                 <FormItem>
//                   <FormLabel>Email</FormLabel>
//                   <FormControl>
//                     <Input placeholder="johndoe@example.com" {...field} />
//                   </FormControl>
//                   <FormMessage />
//                 </FormItem>
//               )}
//             />
//             <FormField
//               control={form.control}
//               name="firstName"
//               render={({ field }) => (
//                 <FormItem>
//                   <FormLabel>First Name</FormLabel>
//                   <FormControl>
//                     <Input placeholder="John" {...field} />
//                   </FormControl>
//                   <FormMessage />
//                 </FormItem>
//               )}
//             />
//             <FormField
//               control={form.control}
//               name="lastName"
//               render={({ field }) => (
//                 <FormItem>
//                   <FormLabel>Last Name</FormLabel>
//                   <FormControl>
//                     <Input placeholder="Doe" {...field} />
//                   </FormControl>
//                   <FormMessage />
//                 </FormItem>
//               )}
//             />
//             <FormField
//               control={form.control}
//               name="middleName"
//               render={({ field }) => (
//                 <FormItem>
//                   <FormLabel>Middle Name (Optional)</FormLabel>
//                   <FormControl>
//                     <Input placeholder="Middle Name" {...field} />
//                   </FormControl>
//                   <FormMessage />
//                 </FormItem>
//               )}
//             />
//             <Separator className="my-8" />
//             <div className="space-y-8">
//               <FormField
//                 control={form.control}
//                 name="currentPassword"
//                 render={({ field }) => (
//                   <FormItem>
//                     <FormLabel>Current Password</FormLabel>
//                     <FormControl>
//                       <Input type="password" placeholder="Enter your current password" {...field} />
//                     </FormControl>
//                     <FormMessage />
//                   </FormItem>
//                 )}
//               />
//               <FormField
//                 control={form.control}
//                 name="newPassword"
//                 render={({ field }) => (
//                   <FormItem>
//                     <FormLabel>New Password (Optional)</FormLabel>
//                     <FormControl>
//                       <Input type="password" placeholder="Enter your new password" {...field} />
//                     </FormControl>
//                     <FormMessage />
//                   </FormItem>
//                 )}
//               />
//               <FormField
//                 control={form.control}
//                 name="confirmPassword"
//                 render={({ field }) => (
//                   <FormItem>
//                     <FormLabel>Confirm New Password</FormLabel>
//                     <FormControl>
//                       <Input type="password" placeholder="Confirm your new password" {...field} />
//                     </FormControl>
//                     <FormMessage />
//                   </FormItem>
//                 )}
//               />
//             </div>
//             <Button type="submit" className="w-full" disabled={isLoading}>
//               {isLoading ? "Updating..." : "Update Settings"}
//             </Button>
//           </form>
//         </Form>
//       </CardContent>
//     </Card>
//   )
// }
