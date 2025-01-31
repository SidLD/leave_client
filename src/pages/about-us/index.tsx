import { useForm, type SubmitHandler } from "react-hook-form"
import { format } from "date-fns"
import { toZonedTime } from "date-fns-tz"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Textarea } from "@/components/ui/textarea"
import { useToast } from "@/hooks/use-toast"
import { useState } from "react"
import { IPosition } from "@/types/positionType"
import { useQuery } from "@tanstack/react-query"
import { getPositions } from "@/lib/api"

type FormData = {
  name: string
  email: string
  position: string
  specificPosition: string
  contact: string
  address: string
  birthday: string
  educationalAttainment: string
}


export default function Home() {
  const {
    register,
    handleSubmit,
    setValue,
    formState: { errors },
  } = useForm<FormData>()
  const { toast } = useToast()
  const { data: positions } = useQuery<IPosition[]>({
    queryKey: ["positions"],
    queryFn: () => getPositions(),
  })
  const [positionType, setPositionType] = useState('POSITION')

  const onSubmit: SubmitHandler<FormData> = async (data) => {
    // Convert birthday to PH timezone
    const phBirthday = toZonedTime(data.birthday, "Asia/Manila")
    const formattedBirthday = format(phBirthday, "yyyy-MM-dd")

    // Here you would typically send this data to your backend
    console.log({ ...data, birthday: formattedBirthday })

    // Generate code number
    const response = await fetch("/api/generate-code")
    const { code } = await response.json()

    toast({
      title: "Registration Submitted",
      description: `Thank you ${data.name}, your application for ${data.position} (${data.specificPosition}) position has been received. Your registration code is: ${code}`,
    })
  }

  return (
    <div className="container py-10 mx-auto">
      <Card className="w-full max-w-3xl mx-auto">
        <CardHeader>
          <CardTitle className="text-3xl font-bold text-center">Teacher Registration</CardTitle>
          <CardDescription className="text-lg text-center">
            Register for teaching and non-teaching positions
          </CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
            <div className="space-y-2">
              <Label htmlFor="name">Full Name</Label>
              <Input
                id="name"
                placeholder="Enter your full name"
                {...register("name", { required: "Name is required" })}
              />
              {errors.name && <p className="text-sm text-red-500">{errors.name.message}</p>}
            </div>

            <div className="space-y-2">
              <Label htmlFor="email">Email</Label>
              <Input
                id="email"
                type="email"
                placeholder="Enter your email"
                {...register("email", {
                  required: "Email is required",
                  pattern: { value: /^\S+@\S+$/i, message: "Invalid email address" },
                })}
              />
              {errors.email && <p className="text-sm text-red-500">{errors.email.message}</p>}
            </div>

            <div className="space-y-2">
              <Label>Position</Label>
              <RadioGroup onValueChange={(value) => setPositionType(value as string)}>
                <div className="flex items-center space-x-2">
                  <RadioGroupItem value="TEACHING" id="teaching" />
                  <Label htmlFor="teaching">Teaching</Label>
                </div>
                <div className="flex items-center space-x-2">
                  <RadioGroupItem value="NON_TEACHING" id="non-teaching" />
                  <Label htmlFor="non-teaching">Non-Teaching</Label>
                </div>
              </RadioGroup>
            </div>

            <div className="space-y-2">
              <Label htmlFor="specificPosition">Specific Position</Label>
              <Select onValueChange={(value) => setValue("specificPosition", value)}>
                <SelectTrigger>
                  <SelectValue placeholder="Select a position" />
                </SelectTrigger>
                <SelectContent>
                  {positions?.filter(pos => pos.type == positionType).map((pos) => (
                        <SelectItem key={pos._id} value={pos._id as string}>
                          {pos.name}
                        </SelectItem>
                      ))}
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label htmlFor="contact">Contact Number</Label>
              <Input
                id="contact"
                placeholder="Enter your contact number"
                {...register("contact", { required: "Contact number is required" })}
              />
              {errors.contact && <p className="text-sm text-red-500">{errors.contact.message}</p>}
            </div>

            <div className="space-y-2">
              <Label htmlFor="address">Address</Label>
              <Textarea
                id="address"
                placeholder="Enter your address"
                {...register("address", { required: "Address is required" })}
              />
              {errors.address && <p className="text-sm text-red-500">{errors.address.message}</p>}
            </div>

            <div className="space-y-2">
              <Label htmlFor="birthday">Birthday</Label>
              <Input id="birthday" type="date" {...register("birthday", { required: "Birthday is required" })} />
              {errors.birthday && <p className="text-sm text-red-500">{errors.birthday.message}</p>}
            </div>

            <div className="space-y-2">
              <Label htmlFor="educationalAttainment">Educational Attainment</Label>
              <Textarea
                id="educationalAttainment"
                placeholder="Enter your educational background"
                {...register("educationalAttainment", { required: "Educational attainment is required" })}
              />
              {errors.educationalAttainment && (
                <p className="text-sm text-red-500">{errors.educationalAttainment.message}</p>
              )}
            </div>

            <Button type="submit" className="w-full">
              Submit Application
            </Button>
          </form>
        </CardContent>
        <CardFooter className="flex flex-col items-center space-y-2">
          <p className="text-sm text-gray-500">By submitting, you agree to our Terms of Service and Privacy Policy.</p>
          <p className="text-sm text-gray-500">
            Note: Upon successful registration, a unique code number will be generated for you.
          </p>
        </CardFooter>
      </Card>
    </div>
  )
}

