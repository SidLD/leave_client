import { createBrowserRouter, createRoutesFromElements, Navigate, Route } from "react-router-dom"
import { lazy, Suspense } from "react"
import { PrivateLayout, PublicLayout } from "./module"

const Login = lazy(() => import("@/pages/login/index"))
const DashboardClient = lazy(() => import("@/pages/admin/dashboard/index"))
const UserManagement = lazy(() => import("@/pages/admin/user-management/index"))
const PositionManagment = lazy(() => import("@/pages/admin/position/index"))

const Loading = () => <div>Loading...</div>
const routers = createBrowserRouter(
  createRoutesFromElements(
    <>
      <Route element={<PublicLayout />}>
        <Route
          path="/"
          element={
            <Suspense fallback={<Loading />}>
              <Login />
            </Suspense>
          }
        />
        <Route path="*" element={<Navigate to="/" replace />} />
      </Route>
      <Route  element={<PrivateLayout />}>
        <Route path="/admin">
          <Route
            index
            element={
              <Suspense fallback={<Loading />}>
                <DashboardClient />
              </Suspense>
            }
          />
          <Route
            path="leave-setting"
            element={
              <Suspense fallback={<Loading />}>
                <UserManagement />
              </Suspense>
            }
          />
          <Route
            path="reports"
            element={
              <Suspense fallback={<Loading />}>
                <PositionManagment />
              </Suspense>
            }
          />
        </Route>
      </Route>
    </>,
  ),
)

export default routers

