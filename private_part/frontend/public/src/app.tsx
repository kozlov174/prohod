import '@/app.css'
import {
  AdminVisitViewPage,
  AdminVisitsListPage,
  ReportPage,
  ReportsPage,
  UserCreatePage,
  UserEditPage,
  UserViewPage,
  UsersListPage,
} from '@/pages/admin-pages'
import {
  SecurityVisitViewPage,
  SecurityVisitsListPage,
} from '@/pages/security-pages'
import { UserVisitViewPage, UserVisitsListPage } from '@/pages/user-pages'
import { PageTitleProvider } from '@/pages/wrappers/simple-header-wrap/page-title-context'
import { UserProvider } from '@/provider/user-provider'
import { HashRouter, Outlet, Route, Routes } from 'react-router-dom'

import { AuthPage, Main, UnauthorizedWrap, VisitRequestPage, nav } from './pages'
import { LayoutActionsProvider } from './provider/layout-actions-provider'

export const App = () => {
  return (
    <HashRouter>
      <Routes>
        <Route path={nav.index()} element={<Main />}></Route>
        <Route
          element={
            <PageTitleProvider>
              <Outlet />
            </PageTitleProvider>
          }
        >
          <Route path={nav.auth()} element={<AuthPage />} />
          <Route path={nav.form()} element={<VisitRequestPage />} />

          <Route
            element={
              <UnauthorizedWrap>
                <UserProvider>
                  <LayoutActionsProvider>
                    <Outlet />
                  </LayoutActionsProvider>
                </UserProvider>
              </UnauthorizedWrap>
            }
          >
            <Route
              path={nav.visitsByAdmin()}
              element={<AdminVisitsListPage />}
            />
            <Route
              path={nav.visitsBySecurity()}
              element={<SecurityVisitsListPage />}
            />
            <Route path={nav.visitsByUser()} element={<UserVisitsListPage />} />

            <Route
              path={nav.visitByAdmin(':id')}
              element={<AdminVisitViewPage />}
            />
            <Route
              path={nav.visitBySecurity(':id')}
              element={<SecurityVisitViewPage />}
            />
            <Route
              path={nav.visitByUser(':id')}
              element={<UserVisitViewPage />}
            />

            <Route path={nav.adminUsers()} element={<UsersListPage />} />
            <Route
              path={nav.adminUserView(':userId')}
              element={<UserViewPage />}
            />
            <Route
              path={nav.adminUserEdit(':userId')}
              element={<UserEditPage />}
            />
            <Route path={nav.adminUserCreate()} element={<UserCreatePage />} />

            <Route path={nav.adminReports()} element={<ReportsPage />} />
            <Route path={nav.adminReport(':id')} element={<ReportPage />} />
          </Route>
        </Route>
      </Routes>
    </HashRouter>
  )
}
