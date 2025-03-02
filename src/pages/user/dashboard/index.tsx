"use client"

import { useState } from "react"
import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import * as z from "zod"
import { useMutation, useQueryClient } from "@tanstack/react-query"
import { format } from "date-fns"
import { CalendarIcon, Loader2, Settings } from "lucide-react"
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form"
import { Button } from "@/components/ui/button"
import { Select, SelectContent, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Calendar } from "@/components/ui/calendar"
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover"
import { Textarea } from "@/components/ui/textarea"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { cn } from "@/lib/utils"
import { createLeaveRecord, updateLeaveRecord } from "@/lib/api"
import { useToast } from "@/hooks/use-toast"
import { useStore } from "@/store/app.store"
import { Toaster } from "@/components/ui/toaster"
import { UserSettingsDialog } from "@/components/ui/user-settings-dialog"

const leaveFormSchema = z.object({
  leaveType: z.string(),
  dateStart: z.date(),
  dateEnd: z.date(),
  remarks: z.string().optional(),
})

type LeaveFormData = z.infer<typeof leaveFormSchema>

export default function LeaveDashboard() {
  const { toast } = useToast()
  const queryClient = useQueryClient()
  const [editingId, setEditingId] = useState<string | null>(null)
  const [isSettingsOpen, setIsSettingsOpen] = useState(false)
  const { getUserInfo } = useStore()
  const userId = getUserInfo().id

  const form = useForm<LeaveFormData>({
    resolver: zodResolver(leaveFormSchema),
    defaultValues: {
      dateStart: new Date(),
      dateEnd: new Date(),
    },
  })

  const createLeaveMutation = useMutation({
    mutationFn: (data: LeaveFormData) => createLeaveRecord(userId, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["leaveRecords", userId] })
      toast({ title: "Leave application submitted successfully" })
      form.reset()
    },
    onError: (error: any) => {
      toast({ title: "Failed to submit leave application", description: error.message, variant: "destructive" })
    },
  })

  const updateLeaveMutation = useMutation({
    mutationFn: ({ id, data }: { id: string; data: LeaveFormData }) => updateLeaveRecord(id, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["leaveRecords", userId] })
      toast({ title: "Leave record updated successfully" })
      setEditingId(null)
    },
    onError: (error: any) => {
      toast({ title: "Failed to update leave record", description: error.message, variant: "destructive" })
    },
  })


  const onSubmit = (data: LeaveFormData) => {
    if (editingId) {
      updateLeaveMutation.mutate({ id: editingId, data })
    } else {
      createLeaveMutation.mutate(data)
    }
  }

  return (
    <div className="container p-4 mx-auto">
      <div className="flex justify-between mb-6">
        <h1 className="text-2xl font-bold">Leave Dashboard</h1>
        <Button onClick={() => setIsSettingsOpen(true)}>
          <Settings className="w-4 h-4 mr-2" />
          User Settings
        </Button>
      </div>
      <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle>{editingId ? "Edit Leave Application" : "Apply for Leave"}</CardTitle>
          </CardHeader>
          <CardContent>
            <Form {...form}>
              <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
                <FormField
                  control={form.control}
                  name="leaveType"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Leave Type</FormLabel>
                      <Select onValueChange={field.onChange} value={field.value}>
                        <FormControl>
                          <SelectTrigger>
                            <SelectValue placeholder="Select leave type" />
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent>
                          
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
                              className={cn(
                                "w-[240px] pl-3 text-left font-normal",
                                !field.value && "text-muted-foreground",
                              )}
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
                            disabled={(date) => date < new Date() || date < new Date("1900-01-01")}
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
                              className={cn(
                                "w-[240px] pl-3 text-left font-normal",
                                !field.value && "text-muted-foreground",
                              )}
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
                            disabled={(date) => date < new Date() || date < new Date("1900-01-01")}
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
                  name="remarks"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Remarks</FormLabel>
                      <FormControl>
                        <Textarea placeholder="Add any additional information" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <Button type="submit" disabled={createLeaveMutation.isPending || updateLeaveMutation.isPending}>
                  {createLeaveMutation.isPending || updateLeaveMutation.isPending ? (
                    <>
                      <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                      {editingId ? "Updating..." : "Submitting..."}
                    </>
                  ) : editingId ? (
                    "Update Leave Application"
                  ) : (
                    "Apply for Leave"
                  )}
                </Button>
                {editingId && (
                  <Button
                    type="button"
                    variant="outline"
                    onClick={() => {
                      setEditingId(null)
                      form.reset()
                    }}
                  >
                    Cancel Edit
                  </Button>
                )}
              </form>
            </Form>
          </CardContent>
        </Card>
      </div>
      <UserSettingsDialog open={isSettingsOpen} onOpenChange={setIsSettingsOpen} />
      <Toaster />
    </div>
  )
}

