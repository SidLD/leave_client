"use client"

import type React from "react"

import { useState } from "react"
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query"
import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import * as z from "zod"
import { format } from "date-fns"
import { CalendarIcon } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover"
import { Calendar } from "@/components/ui/calendar"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { getUserLeaves, createLeaveRecord } from "@/lib/api"
import { cn } from "@/lib/utils"
import { useToast } from "@/hooks/use-toast"
import { useStore } from "@/store/app.store"

const leaveRecordSchema = z.object({
  userLeaveId: z.string().min(1, "Please select a leave type"),
  dateStart: z.date(),
  dateEnd: z.date(),
  leaveType: z.enum(["WHOLE_DAY", "HALF_DAY_MORNING", "HALF_DAY_AFTERNOON"]),
})

type LeaveRecordFormData = z.infer<typeof leaveRecordSchema>

interface IUserLeave {
  _id: string
  leave: {
    name: string
  }
  balance: number
}

const LeaveRecordForm: React.FC<{ userLeaves: IUserLeave[]; onSubmit: (data: LeaveRecordFormData) => void }> = ({
  userLeaves,
  onSubmit,
}) => {
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
              <FormLabel>Leave Type</FormLabel>
              <Select onValueChange={field.onChange} defaultValue={field.value}>
                <FormControl>
                  <SelectTrigger>
                    <SelectValue placeholder="Select leave type" />
                  </SelectTrigger>
                </FormControl>
                <SelectContent>
                  {userLeaves.map((userLeave) => (
                    <SelectItem key={userLeave._id} value={userLeave._id}>
                      {userLeave.leave.name}
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
                    selected={field.value}
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
                    selected={field.value}
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
              <FormLabel>Leave Duration</FormLabel>
              <Select onValueChange={field.onChange} defaultValue={field.value}>
                <FormControl>
                  <SelectTrigger>
                    <SelectValue placeholder="Select leave duration" />
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
        <Button type="submit">Apply for Leave</Button>
      </form>
    </Form>
  )
}

export default function Dashboard() {
  const [userId] = useState("current-user-id") // Replace with actual user ID retrieval
  const { toast } = useToast()
  const queryClient = useQueryClient()
    const {getUserInfo} = useStore()

  const { data: userLeaves, isLoading } = useQuery<IUserLeave[]>({
    queryKey: ["userLeaves", userId],
    queryFn: () => getUserLeaves({ userId: getUserInfo().id }).then(data => data.data),
  })

  const leaveApplicationMutation = useMutation({
    mutationFn: (data: LeaveRecordFormData) => createLeaveRecord(userId, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["userLeaves", userId] })
      toast({
        title: "Leave application submitted",
        description: "Your leave request has been submitted for approval.",
      })
    },
    onError: (error: any) => {
      toast({
        title: "Error submitting leave application",
        description: error.message || "An error occurred while submitting your leave application.",
        variant: "destructive",
      })
    },
  })

  const handleSubmit = (data: LeaveRecordFormData) => {
    leaveApplicationMutation.mutate(data)
  }

  if (isLoading) {
    return <div>Loading...</div>
  }

  return (
    <div className="container py-10 mx-auto">
      <h1 className="mb-6 text-3xl font-bold">Your Leave Dashboard</h1>
      <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle>Apply for Leave</CardTitle>
            <CardDescription>Submit a new leave application</CardDescription>
          </CardHeader>
          <CardContent>{userLeaves && <LeaveRecordForm userLeaves={userLeaves} onSubmit={handleSubmit} />}</CardContent>
        </Card>
        <Card>
          <CardHeader>
            <CardTitle>Your Leave Balance</CardTitle>
            <CardDescription>Your current leave balance</CardDescription>
          </CardHeader>
          <CardContent>
            <ul className="space-y-2">
              {userLeaves?.map((userLeave) => (
                <li key={userLeave._id} className="flex items-center justify-between">
                  <span>{userLeave.leave.name}</span>
                  <span className="font-semibold">
                    {userLeave.balance} {userLeave.balance === 1 ? "day" : "days"}
                  </span>
                </li>
              ))}
            </ul>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}

