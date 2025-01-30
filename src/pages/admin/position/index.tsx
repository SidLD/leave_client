import { Form } from "react-router-dom"
import { useQuery } from "@tanstack/react-query"
import { getPositions } from "@/lib/api"
import z from 'zod';
import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"

const positionSchema = z.object({
    type: z.enum(['TEACHING', 'NON_TEACHING']),
    name: z.string().email({
      message: "Please enter a valid name.",
    })
  })

export default function PositionsPage() {
//   const [positions, setPositions] = useState<IPosition[]>([])
//   const [selectedPosition, setSelectedPosition] = useState<IPosition>({ type: "TEACHING", name: "" })
//   const {toast} = useToast()

  const { data } = useQuery({
    queryKey: [`positions`],
    queryFn: () => getPositions()
  });

  const form = useForm<z.infer<typeof positionSchema>>({
    resolver: zodResolver(positionSchema),
    defaultValues: {
      name: "Teacher",
      type: 'TEACHING'
    },
  })

  const onSubmit = async (data: z.infer<typeof positionSchema>) => {
    console.log(data)
  }

  console.log(data)

  return (
      <div>
        <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
                
            </form>
        </Form>
    </div>
  )
}
