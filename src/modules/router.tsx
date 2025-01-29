import { createBrowserRouter, createRoutesFromElements, Navigate, Route } from "react-router-dom"
import { lazy, Suspense } from "react"
import { PrivateLayout, PublicLayout } from "./module"

const Home = lazy(() => import("@/pages/home").then((module) => ({ default: module.Home })))
const Login = lazy(() => import("@/pages/login").then((module) => ({ default: module.Login })))
const AdminDashboard = lazy(() =>
  import("@/pages/admin/dashboard").then((module) => ({ default: module.AdminDashboard })),
)
// const UserManagement = lazy(() =>
//   import("@/pages/admin/user-management").then((module) => ({ default: module.UserManagement })),
// )

const Loading = () => <div>Loading...</div>

const routers = createBrowserRouter(
  createRoutesFromElements(
    <>
      <Route element={<PublicLayout />}>
        <Route
          index
          path="/"
          element={
            <Suspense fallback={<Loading />}>
              <Home />
            </Suspense>
          }
        />
        <Route
          path="/admin-login"
          element={
            <Suspense fallback={<Loading />}>
              <Login />
            </Suspense>
          }
        />
        <Route path="*" element={<Navigate to="/" replace />} />
      </Route>
      <Route element={<PrivateLayout />}>
        <Route path="/admin">
          <Route
            index
            element={
              <Suspense fallback={<Loading />}>
                <AdminDashboard />
              </Suspense>
            }
          />
          {/* <Route
            path="user-management"
            element={
              <Suspense fallback={<Loading />}>
                <UserManagement />
              </Suspense>
            }
          /> */}
        </Route>
      </Route>
    </>,
  ),
)

export default routers

