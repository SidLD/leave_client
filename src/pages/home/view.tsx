
import { format } from "date-fns"
import { toZonedTime } from "date-fns-tz"
import { zodResolver } from "@hookform/resolvers/zod"
import { useForm } from "react-hook-form"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Textarea } from "@/components/ui/textarea"
import { useToast } from "@/hooks/use-toast"
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover"
import { cn } from "@/lib/utils"
import { CalendarIcon } from "lucide-react"
import { Calendar } from "@/components/ui/calendar"
import { Form, FormControl, FormDescription, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form"
import { register } from "@/lib/api"
import * as z from "zod"
import { Toaster } from "@/components/ui/toaster"
import { useEffect } from "react"
import { useStore } from "@/store/app.store"

const teachingPositions = ["Teacher I", "Teacher II", "Teacher III", "Master Teacher"]
const nonTeachingPositions = ["Librarian", "Guidance Counselor", "Administrative Assistant", "Maintenance Staff"]

const teacherRegistrationSchema = z.object({
  username: z.string().min(2, {
    message: "Username must be at least 2 characters.",
  }),
  email: z.string().email({
    message: "Please enter a valid email address.",
  }),
  position: z.enum(["teaching", "non-teaching"]),
  specificPosition: z.string().min(1, {
    message: "Please select a specific position.",
  }),
  contact: z.string().min(1, {
    message: "Contact number is required.",
  }),
  birthday: z.date({
    required_error: "Please select a date.",
  }),
  address: z.string().min(1, {
    message: "Address is required.",
  }),
  educational_attainment: z.string().min(1, {
    message: "Educational attainment is required.",
  }),
  file: z.any().optional()
})

export default function TeacherRegistrationForm() {
  const { getToken } = useStore()
  const form = useForm<z.infer<typeof teacherRegistrationSchema>>({
    resolver: zodResolver(teacherRegistrationSchema),
    defaultValues: {
      position: "teaching",
    },
  })

  const { toast } = useToast()

  useEffect(() => {
    if(getToken()){
      window.location.href = '/admin/'
    }
  }, [])

  const onSubmit = async (data: z.infer<typeof teacherRegistrationSchema>) => {
    const phBirthday = toZonedTime(data.birthday, "Asia/Manila")
    const formattedBirthday = new Date(format(phBirthday, "yyyy-MM-dd"))
    try {
      register({...data, birthday: formattedBirthday, role: "USER"})
      .then((data:any) => {
        const { code } = data.json()
        toast({
          title: "Registration Submitted",
          description: `Thank you ${data.username}, your application for ${data.position} (${data.specificPosition}) position has been received. Your registration code is: ${code}`,
        })
      }).catch((err:any) => {
        toast({
          title: "There was an error submitting your application. Please try again.",
          description: `${err.response.data.message}`,
          variant: "destructive",
        })
      })
    } catch {
      toast({
        title: "Error",
        description: "There was an error submitting your application. Please try again.",
        variant: "destructive",
      })
    }
  }

  return (
    <div className="min-h-screen px-4 py-12 bg-gradient-to-b from-green-50 to-green-100 sm:px-6 lg:px-8">
      <Toaster />
      <Card className="w-full max-w-4xl mx-auto border-green-200 shadow-lg">
        <CardHeader className="text-white bg-green-600 rounded-t-lg">
          <CardTitle className="text-3xl font-bold text-center">Teacher Registration</CardTitle>
          <CardDescription className="text-lg text-center text-green-100">
            Register for teaching and non-teaching positions
          </CardDescription>
        </CardHeader>
        <CardContent className="p-6">
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
              <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
                <FormField
                  control={form.control}
                  name="username"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className="text-green-700">Username</FormLabel>
                      <FormControl>
                        <Input
                          placeholder="Enter your username"
                          {...field}
                          className="border-green-300 focus:border-green-500 focus:ring-green-500"
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="email"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className="text-green-700">Email</FormLabel>
                      <FormControl>
                        <Input
                          type="email"
                          placeholder="Enter your email"
                          {...field}
                          className="border-green-300 focus:border-green-500 focus:ring-green-500"
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="position"
                  render={({ field }) => (
                    <FormItem className="space-y-3">
                      <FormLabel className="text-green-700">Position</FormLabel>
                      <FormControl>
                        <RadioGroup
                          onValueChange={field.onChange}
                          defaultValue={field.value}
                          className="flex space-x-4"
                        >
                          <FormItem className="flex items-center space-x-3 space-y-0">
                            <FormControl>
                              <RadioGroupItem value="teaching" className="text-green-600" />
                            </FormControl>
                            <FormLabel className="font-normal text-green-700">Teaching</FormLabel>
                          </FormItem>
                          <FormItem className="flex items-center space-x-3 space-y-0">
                            <FormControl>
                              <RadioGroupItem value="non-teaching" className="text-green-600" />
                            </FormControl>
                            <FormLabel className="font-normal text-green-700">Non-Teaching</FormLabel>
                          </FormItem>
                        </RadioGroup>
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="specificPosition"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className="text-green-700">Specific Position</FormLabel>
                      <Select onValueChange={field.onChange} defaultValue={field.value}>
                        <FormControl>
                          <SelectTrigger className="border-green-300 focus:border-green-500 focus:ring-green-500">
                            <SelectValue placeholder="Select a position" />
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent>
                          {(form.watch("position") === "teaching" ? teachingPositions : nonTeachingPositions).map(
                            (pos) => (
                              <SelectItem key={pos} value={pos}>
                                {pos}
                              </SelectItem>
                            ),
                          )}
                        </SelectContent>
                      </Select>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="contact"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className="text-green-700">Contact Number</FormLabel>
                      <FormControl>
                        <Input
                          placeholder="Enter your contact number"
                          {...field}
                          className="border-green-300 focus:border-green-500 focus:ring-green-500"
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="birthday"
                  render={({ field }) => (
                    <FormItem className="flex flex-col">
                      <FormLabel className="text-green-700">Birthday</FormLabel>
                      <Popover>
                        <PopoverTrigger asChild>
                          <FormControl>
                            <Button
                              variant={"outline"}
                              className={cn(
                                "w-full pl-3 text-left font-normal border-green-300 focus:border-green-500 focus:ring-green-500",
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
                            disabled={(date) => date > new Date() || date < new Date("1900-01-01")}
                            initialFocus
                          />
                        </PopoverContent>
                      </Popover>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>

              <FormField
                control={form.control}
                name="address"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="text-green-700">Address</FormLabel>
                    <FormControl>
                      <Textarea
                        placeholder="Enter your address"
                        className="border-green-300 focus:border-green-500 focus:ring-green-500"
                        {...field}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="educational_attainment"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="text-green-700">Educational Attainment</FormLabel>
                    <FormControl>
                      <Textarea
                        placeholder="Enter your educational background"
                        className="border-green-300 focus:border-green-500 focus:ring-green-500"
                        {...field}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="file"
                render={({ field: { onChange, value, ...rest } }) => (
                  <FormItem>
                    <FormLabel className="text-green-700">Upload Documents</FormLabel>
                    <FormControl>
                      <Input
                        type="file"
                        accept=".doc,.docx,.pdf,image/*"
                        onChange={(e) => {
                          onChange(e.target.files ? e.target.files[0] : null)
                        }}
                        {...rest}
                        className="border-green-300 focus:border-green-500 focus:ring-green-500"
                      />
                    </FormControl>
                    <FormDescription className="text-sm text-green-600">
                      Accepted formats: .doc, .docx, .pdf, and images
                    </FormDescription>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <Button type="submit" className="w-full text-white bg-green-600 hover:bg-green-700">
                Submit Application
              </Button>
            </form>
          </Form>
        </CardContent>
        <CardFooter className="flex flex-col items-center space-y-2 rounded-b-lg bg-green-50">
          <p className="text-sm text-green-600">By submitting, you agree to our Terms of Service and Privacy Policy.</p>
          <p className="text-sm text-green-600">
            Note: Upon successful registration, a unique code number will be generated for you.
          </p>
        </CardFooter>
      </Card>
    </div>
  )
}

