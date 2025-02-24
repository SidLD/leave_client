import { createBrowserRouter, createRoutesFromElements, Navigate, Route } from "react-router-dom"
import { lazy, Suspense } from "react"
import { PrivateLayout, PublicLayout } from "./module"

const Login = lazy(() => import("@/pages/login/index"))
const DashboardClient = lazy(() => import("@/pages/admin/dashboard/index"))
const Dashboard = lazy(() => import("@/pages/user/dashboard/index"))
const LeaveSettingManagement = lazy(() => import("@/pages/admin/leave/index"))
const Report = lazy(() => import("@/pages/admin/report/index"))
const RegisterPage = lazy(() => import("@/pages/user/register/index"))
const LoginPage = lazy(() => import("@/pages/user/login/index"))

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
         <Route
          path="/user/register"
          element={
            <Suspense fallback={<Loading />}>
              <RegisterPage />
            </Suspense>
          }
        />
         <Route
          path="/user/login"
          element={
            <Suspense fallback={<Loading />}>
              <LoginPage />
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
        <Route path="/user">
          <Route
            index
            element={
              <Suspense fallback={<Loading />}>
                <Dashboard />
              </Suspense>
            }
          />
        </Route>
      </Route>
    </>,
  ),
)

export default routers

