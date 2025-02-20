"use client"

import type React from "react"

import { useState, useEffect } from "react"
import { Dialog, DialogHeader, DialogContent, DialogTitle, DialogTrigger } from "@/components/ui/dialog"
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form"
import { createLeaveSetting, getLeaveSetting, updateLeaveSetting } from "@/lib/api"
import { useStore } from "@/store/app.store"
import type { ILeaveSetting } from "@/types/leaveType"
import { zodResolver } from "@hookform/resolvers/zod"
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query"
import { Button } from "@/components/ui/button"
import { useForm } from "react-hook-form"
import { z } from "zod"
import { Input } from "@/components/ui/input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Switch } from "@/components/ui/switch"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { PlusCircle, Edit2, Loader2, Check, X } from "lucide-react"
import { Badge } from "@/components/ui/badge"

const leaveSettingSchema = z.object({
  _id: z.string().optional(),
  accrual: z.enum(["YEARLY", "MONTHLY", "WEEKLY", "QUARTERLY"]),
  carryOver: z.boolean(),
  gender: z.enum(["MALE", "FEMALE", "ALL"]),
  defaultCredit: z.number().min(0, "Default credit must be a positive number"),
  name: z.string().min(3, "Must have at least 3 characters"),
})

type LeaveSettingFormData = z.infer<typeof leaveSettingSchema>

const Leave: React.FC = () => {
  const [isDialogOpen, setIsDialogOpen] = useState(false)
  const { setSelectedLeave, getSelectedLeave , selectedLeave} = useStore()
  const queryClient = useQueryClient()

  const { data: leaves, isLoading } = useQuery<ILeaveSetting[]>({
    queryKey: ["leaveSetting"],
    queryFn: () => getLeaveSetting({}).then((data) => data.data),
  })

  const leaveSettingMutation = useMutation({
    mutationFn: (data: LeaveSettingFormData) =>
      data._id
        ? updateLeaveSetting(data._id, data).then((data) => data)
        : createLeaveSetting(data).then((data) => data),
    onSuccess: () => {
      queryClient.invalidateQueries({queryKey: ["leaveSetting"]})
      setIsDialogOpen(false)
      setSelectedLeave(null)
    },
  })

  const form = useForm<LeaveSettingFormData>({
    resolver: zodResolver(leaveSettingSchema),
    defaultValues: {
      accrual: "YEARLY",
      carryOver: false,
      gender: "ALL",
      defaultCredit: 0,
      name: "",
    },
  })


  useEffect(() => {
    const selectedLeave = getSelectedLeave()
    if (selectedLeave) {
      form.reset({...selectedLeave, defaultCredit: selectedLeave.defaultCredit / 8})
    } else {
      form.reset({
        accrual: "YEARLY",
        carryOver: false,
        gender: "ALL",
        defaultCredit: 0,
        name: "",
      })
    }
  }, [getSelectedLeave, form, selectedLeave])

  const onSubmit = async (data: LeaveSettingFormData) => {
    await leaveSettingMutation.mutateAsync(data)
  }

  const getAccrualColor = (accrual: string) => {
    switch (accrual) {
      case "YEARLY":
        return "bg-blue-100 text-blue-800"
      case "MONTHLY":
        return "bg-green-100 text-green-800"
      case "WEEKLY":
        return "bg-yellow-100 text-yellow-800"
      case "QUARTERLY":
        return "bg-purple-100 text-purple-800"
      default:
        return "bg-gray-100 text-gray-800"
    }
  }

  const getGenderColor = (gender: string) => {
    switch (gender) {
      case "MALE":
        return "bg-sky-100 text-sky-800"
      case "FEMALE":
        return "bg-pink-100 text-pink-800"
      case "ALL":
        return "bg-indigo-100 text-indigo-800"
      default:
        return "bg-gray-100 text-gray-800"
    }
  }

  return (
    <div className="container p-4 mx-auto">
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-3xl font-bold text-primary">Leave Settings</h1>
        <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
          <DialogTrigger asChild>
            <Button onClick={() => setSelectedLeave(null)} className="bg-primary hover:bg-primary/90">
              <PlusCircle className="w-4 h-4 mr-2" />
              Create Leave Setting
            </Button>
          </DialogTrigger>
          <DialogContent className="sm:max-w-[425px]">
            <DialogHeader>
              <DialogTitle>{getSelectedLeave() ? "Update" : "Create"} Leave Setting</DialogTitle>
            </DialogHeader>
            <Form {...form}>
              <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
                <FormField
                  control={form.control}
                  name="name"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Name</FormLabel>
                      <FormControl>
                        <Input placeholder="Enter leave name" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="accrual"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Accrual</FormLabel>
                      <Select onValueChange={field.onChange} value={field.value}>
                        <FormControl>
                          <SelectTrigger>
                            <SelectValue placeholder="Select accrual type" />
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent>
                          <SelectItem value="YEARLY">Yearly</SelectItem>
                          <SelectItem value="MONTHLY">Monthly</SelectItem>
                          <SelectItem value="WEEKLY">Weekly</SelectItem>
                          <SelectItem value="QUARTERLY">Quarterly</SelectItem>
                        </SelectContent>
                      </Select>
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
                      <Select onValueChange={field.onChange} value={field.value}>
                        <FormControl>
                          <SelectTrigger>
                            <SelectValue placeholder="Select gender" />
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent>
                          <SelectItem value="ALL">All</SelectItem>
                          <SelectItem value="MALE">Male</SelectItem>
                          <SelectItem value="FEMALE">Female</SelectItem>
                        </SelectContent>
                      </Select>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="defaultCredit"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Default Credit (days)</FormLabel>
                      <FormControl>
                        <Input type="number" {...field} onChange={(e) => field.onChange(+e.target.value)} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="carryOver"
                  render={({ field }) => (
                    <FormItem className="flex flex-row items-center justify-between p-4 border rounded-lg">
                      <div className="space-y-0.5">
                        <FormLabel className="text-base">Carry Over</FormLabel>
                      </div>
                      <FormControl>
                        <Switch checked={field.value} onCheckedChange={field.onChange} />
                      </FormControl>
                    </FormItem>
                  )}
                />
                <Button
                  type="submit"
                  className="w-full bg-primary hover:bg-primary/90"
                  disabled={leaveSettingMutation.isPending}
                >
                  {leaveSettingMutation.isPending ? (
                    <>
                      <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                      Submitting...
                    </>
                  ) : (
                    "Submit"
                  )}
                </Button>
              </form>
            </Form>
          </DialogContent>
        </Dialog>
      </div>

      {isLoading ? (
        <div className="flex items-center justify-center h-64">
          <Loader2 className="w-8 h-8 animate-spin text-primary" />
        </div>
      ) : (
        <div className="overflow-x-auto">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead className="w-[200px]">Name</TableHead>
                <TableHead>Accrual</TableHead>
                <TableHead>Gender</TableHead>
                <TableHead className="text-right">Default Credit (Days)</TableHead>
                <TableHead className="text-center">Carry Over</TableHead>
                <TableHead className="text-right">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {leaves?.map((leave) => (
                <TableRow key={leave._id}>
                  <TableCell className="font-medium">{leave.name}</TableCell>
                  <TableCell>
                    <Badge className={`${getAccrualColor(leave.accrual)}`}>{leave.accrual}</Badge>
                  </TableCell>
                  <TableCell>
                    <Badge className={`${getGenderColor(leave.gender)}`}>{leave.gender}</Badge>
                  </TableCell>
                  <TableCell className="text-right">{leave.defaultCredit/8}</TableCell>
                  <TableCell className="text-center">
                    {leave.carryOver ? (
                      <Check className="inline-block w-5 h-5 text-green-500" />
                    ) : (
                      <X className="inline-block w-5 h-5 text-red-500" />
                    )}
                  </TableCell>
                  <TableCell className="text-right">
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => {
                        setSelectedLeave(leave)
                        setIsDialogOpen(true)
                      }}
                    >
                      <Edit2 className="w-4 h-4" />
                    </Button>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>
      )}
    </div>
  )
}

export default Leave

