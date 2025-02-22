import { createBrowserRouter, createRoutesFromElements, Navigate, Route } from "react-router-dom"
import { lazy, Suspense } from "react"
import { PrivateLayout, PublicLayout } from "./module"

const Login = lazy(() => import("@/pages/login/index"))
const DashboardClient = lazy(() => import("@/pages/admin/dashboard/index"))
const LeaveSettingManagement = lazy(() => import("@/pages/admin/leave/index"))
const Report = lazy(() => import("@/pages/admin/report/index"))

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
                <LeaveSettingManagement />
              </Suspense>
            }
          />
          <Route
            path="report/:userId"
            element={
              <Suspense fallback={<Loading />}>
                <Report />
              </Suspense>
            }
          />
        </Route>
      </Route>
    </>,
  ),
)

export default routers

