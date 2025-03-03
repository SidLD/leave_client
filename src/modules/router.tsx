import { createBrowserRouter, createRoutesFromElements, Navigate, Route } from "react-router-dom"
import { lazy, Suspense } from "react"
import { PrivateLayout, PublicLayout } from "./module"

const Login = lazy(() => import("@/pages/login/index"))
// const DashboardClient = lazy(() => import("@/pages/admin/dashboard/index"))
const Dashboard = lazy(() => import("@/pages/user/dashboard/index"))
const Report = lazy(() => import("@/pages/admin/report/index"))
const UserReport = lazy(() => import("@/pages/user/report/index"))
const FormSeven = lazy(() => import("@/pages/admin/form_seven/index"))
const RegisterPage = lazy(() => import("@/pages/user/register/index"))
const LoginPage = lazy(() => import("@/pages/user/login/index"))
const UserSetting = lazy(() => import("@/pages/user/setting/index"))

const Loading = () => <div>Loading...</div>
const routers = createBrowserRouter(
  createRoutesFromElements(
    <>
      <Route element={<PublicLayout />}>
        <Route
          path="/"
          element={
            <Suspense fallback={<Loading />}>
              <LoginPage />
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
         <Route
          path="/admin/login"
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
                {/* <DashboardClient /> */}
                <div>
                  Still Work in Progreess
                </div>
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
            <Route
            path="form-seven"
            element={
              <Suspense fallback={<Loading />}>
                <FormSeven />
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
            path="report"
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

