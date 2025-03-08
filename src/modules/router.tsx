import { createBrowserRouter, createRoutesFromElements, Navigate, Route } from "react-router-dom"
import { lazy, Suspense } from "react"
import { PrivateLayout, PublicLayout } from "./module"

const Login = lazy(() => import("@/pages/login/index"))
const DashboardClient = lazy(() => import("@/pages/admin/dashboard/index"))
const Dashboard = lazy(() => import("@/pages/user/dashboard/index"))
const AdminReport = lazy(() => import("@/pages/admin/form_six/index"))
const UserReport = lazy(() => import("@/pages/user/report/index"))
const FormSeven = lazy(() => import("@/pages/admin/form_seven/index"))
const RegisterPage = lazy(() => import("@/pages/user/register/index"))
const UserSetting = lazy(() => import("@/pages/user/setting/index"))
const UserPage = lazy(() => import("@/pages/admin/user/index"))

const Loading = () => <div>Loading...</div>
const routers = createBrowserRouter(
  createRoutesFromElements(
    <>
      <Route element={<PublicLayout />}>
        <Route
          path="/"
          element={
            <Suspense fallback={<Loading />}>
             < Login />
            </Suspense>
          }
        />
         <Route
          path="/register"
          element={
            <Suspense fallback={<Loading />}>
              <RegisterPage />
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
            path="report/:type/:id"
            element={
              <Suspense fallback={<Loading />}>
                <AdminReport />
              </Suspense>
            }
          />
            <Route
            path="form-seven"
            element={
              <Suspense fallback={<Loading />}>
                <FormSeven />
              </Suspense>
            }
          />
              <Route
            path="setting"
            element={
              <Suspense fallback={<Loading />}>
                <UserSetting />
              </Suspense>
            }
          />
              <Route
            path="user"
            element={
              <Suspense fallback={<Loading />}>
                <UserPage />
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
          <Route
            path="report/:type/:id"
            element={
              <Suspense fallback={<Loading />}>
                <UserReport />
              </Suspense>
            }
          />
            <Route
            path="setting"
            element={
              <Suspense fallback={<Loading />}>
                <UserSetting />
              </Suspense>
            }
          />
        </Route>
      </Route>
    </>,
  ),
)

export default routers

