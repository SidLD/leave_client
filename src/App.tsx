import { RouterProvider } from "react-router-dom"
import routers from "./modules/router"
import {
  QueryClient,
  QueryClientProvider,
} from '@tanstack/react-query'
const queryClient = new QueryClient()
function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <RouterProvider
        router={routers}
    />
    </QueryClientProvider>
  )
}

export default App
