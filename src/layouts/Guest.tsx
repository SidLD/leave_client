import { Outlet } from "react-router-dom"
export default function GuestLayout() {
  return (
    <div className="flex flex-col min-h-screen bg-gray-100">
      
      <main className="flex items-center justify-center flex-grow px-4 sm:px-6 lg:px-8">
        <Outlet />
      </main>

      <footer className="bg-white">
        <div className="px-4 py-4 mx-auto max-w-7xl sm:px-6 lg:px-8">
          <p className="text-sm text-center text-gray-500">
            &copy; 2023 YourCompany. All rights reserved.
          </p>
        </div>
      </footer>
    </div>
  )
}