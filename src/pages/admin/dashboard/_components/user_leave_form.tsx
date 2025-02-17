import type React from "react"
import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import * as z from "zod"
import { Button } from "@/components/ui/button"
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form"
import { Input } from "@/components/ui/input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import type { ILeaveSetting, IUserLeave } from "@/types/leaveType"

const userLeaveSchema = z.object({
  leaveId: z.string().min(1, "Please select a leave type"),
  credit: z.number().min(0, "Credit must be a positive number"),
})

type UserLeaveFormData = z.infer<typeof userLeaveSchema>

interface UserLeaveFormProps {
  leaveSettings: ILeaveSetting[]
  onSubmit: (data: UserLeaveFormData) => void
  initialData?: IUserLeave
}

const UserLeaveForm: React.FC<UserLeaveFormProps> = ({ leaveSettings, onSubmit, initialData }) => {
  const form = useForm<UserLeaveFormData>({
    resolver: zodResolver(userLeaveSchema),
    defaultValues: {
      leaveId: initialData?.leave._id || "",
      credit: initialData?.credit || 0,
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
          name="credit"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Credit</FormLabel>
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

export default UserLeaveForm

