"use client"

import { useState } from "react"
import { useQuery, useMutation } from "@tanstack/react-query"
import { getPositions, createPosition, updatePosition, deletePosition } from "@/lib/api"
import { zodResolver } from "@hookform/resolvers/zod"
import { useForm } from "react-hook-form"
import { z } from "zod"

import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form"
import { useToast } from "@/hooks/use-toast"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Trash2 } from "lucide-react"

const positionSchema = z.object({
  _id: z.string().optional(),
  type: z.enum(["TEACHING", "NON_TEACHING"]),
  name: z.string().min(1, "Please enter a valid name."),
})

type Position = z.infer<typeof positionSchema>

export default function PositionsPage() {
  const [selectedPosition, setSelectedPosition] = useState<Position | null>(null)
  const { toast } = useToast()
  const { data: positions, refetch } = useQuery({
    queryKey: ["positions"],
    queryFn: () => getPositions(),
  })

  const createMutation = useMutation({
    mutationFn: createPosition,
    onSuccess: () => {
      toast({ title: "Position created successfully" })
      form.reset()
      refetch()
    },
    onError: () => {
      toast({ title: "Failed to create position", variant: "destructive" })
    },
  })

  const updateMutation = useMutation({
    mutationFn: updatePosition,
    onSuccess: () => {
      toast({ title: "Position updated successfully" })
      setSelectedPosition(null)
      form.reset()
      refetch()
    },
    onError: () => {
      toast({ title: "Failed to update position", variant: "destructive" })
    },
  })

  const deleteMutation = useMutation({
    mutationFn: deletePosition,
    onSuccess: () => {
      toast({ title: "Position deleted successfully" })
      refetch()
    },
    onError: () => {
      toast({ title: "Failed to delete position", variant: "destructive" })
    },
  })

  const form = useForm<Position>({
    resolver: zodResolver(positionSchema),
    defaultValues: {
      name: "",
      type: "TEACHING",
    },
  })

  const onSubmit = async (data: Position) => {
    if (selectedPosition) {
      updateMutation.mutate({ ...data, _id: selectedPosition._id })
    } else {
      createMutation.mutate(data)
    }
  }

  const handleSelectPosition = (position: Position) => {
    setSelectedPosition(position)
    form.reset(position)
  }

  const handleDeletePosition = (id: string) => {
    if (window.confirm("Are you sure you want to delete this position?")) {
      deleteMutation.mutate(id)
    }
  }

  return (
    <div className="container p-4 mx-auto">
      <h1 className="mb-6 text-3xl font-bold text-green-700">Manage Positions</h1>
      <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle className="text-green-600">
              {selectedPosition ? "Edit Position" : "Create New Position"}
            </CardTitle>
          </CardHeader>
          <CardContent>
            <Form {...form}>
              <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
                <FormField
                  control={form.control}
                  name="type"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Type</FormLabel>
                      <Select onValueChange={field.onChange} defaultValue={field.value}>
                        <FormControl>
                          <SelectTrigger className="border-green-200 focus:ring-green-500">
                            <SelectValue placeholder="Select position type" />
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent>
                          <SelectItem value="TEACHING">Teaching</SelectItem>
                          <SelectItem value="NON_TEACHING">Non-Teaching</SelectItem>
                        </SelectContent>
                      </Select>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="name"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Name</FormLabel>
                      <FormControl>
                        <Input
                          placeholder="Enter position name"
                          {...field}
                          className="border-green-200 focus:ring-green-500"
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <div className="flex gap-2">
                  <Button
                    type="submit"
                    disabled={createMutation.isPending || updateMutation.isPending}
                    className="bg-green-600 hover:bg-green-700"
                  >
                    {selectedPosition ? "Update" : "Create"} Position
                  </Button>
                  {selectedPosition && (
                    <Button
                      type="button"
                      variant="outline"
                      onClick={() => {
                        setSelectedPosition(null)
                        form.reset({ name: "", type: "TEACHING" })
                      }}
                      className="text-green-600 border-green-600 hover:bg-green-50"
                    >
                      Cancel Edit
                    </Button>
                  )}
                </div>
              </form>
            </Form>
          </CardContent>
        </Card>
        <Card>
          <CardHeader>
            <CardTitle className="text-green-600">Existing Positions</CardTitle>
          </CardHeader>
          <CardContent>
            {positions && positions.length > 0 ? (
              <ul className="space-y-2">
                {positions.map((position: Position) => (
                  <li key={position._id} className="flex items-center justify-between p-3 rounded-lg bg-green-50">
                    <div>
                      <span className="font-medium">{position.name}</span>
                      <Badge variant="outline" className="ml-2 text-green-600 border-green-600">
                        {position.type}
                      </Badge>
                    </div>
                    <div className="flex gap-2">
                      <Button
                        onClick={() => handleSelectPosition(position)}
                        size="sm"
                        variant="outline"
                        className="text-green-600 border-green-600 hover:bg-green-100"
                      >
                        Edit
                      </Button>
                      <Button
                        onClick={() => handleDeletePosition(position._id as string)}
                        size="sm"
                        variant="destructive"
                        className="bg-red-500 hover:bg-red-600"
                      >
                        <Trash2 className="w-4 h-4" />
                      </Button>
                    </div>
                  </li>
                ))}
              </ul>
            ) : (
              <p className="text-gray-500">No positions found.</p>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  )
}

