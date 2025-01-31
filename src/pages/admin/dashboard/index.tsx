import { useState, useEffect } from "react"
import { getUsers } from "@/lib/api"

const DashboardClient = () => {
  const [start] = useState(0)
  const [limit] = useState(10)
  const [searchTerm] = useState("")
  const fetchUser = async () => {
    try {
      const {data} = await getUsers({
        start, limit, search: searchTerm
      }) as unknown as any
      console.log(data)
    } catch (error) {
      console.log(error)
    }
  }

  useEffect(() => {
    fetchUser()
  }, [start, limit, searchTerm])

  return (
    <>asasda</>
  )
}

export default DashboardClient