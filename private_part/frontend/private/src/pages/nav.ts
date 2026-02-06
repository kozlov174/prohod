export const index = () => '/' as const

export const form = () => '/form' as const

export const auth = () => '/auth' as const

export const registration = () => '/registration' as const

export const visitsByAdmin = () => '/admin/visits' as const
export const visitsBySecurity = () => '/security/visits' as const
export const visitsByUser = () => '/user/visits' as const

export const visitByAdmin = <T extends string>(id: T) =>
  `${visitsByAdmin()}/${id}` as const
export const visitBySecurity = <T extends string>(id: T) =>
  `${visitsBySecurity()}/${id}` as const
export const visitByUser = <T extends string>(id: T) =>
  `${visitsByUser()}/${id}` as const

export const dashboardWatchman = <T extends string>(id: T) =>
  `/dashboard/watchman/${id}` as const

export const adminUsers = () => '/users' as const
export const adminUserView = <T extends string>(id: T) =>
  `${adminUsers()}/${id}` as const
export const adminUserEdit = <T extends string>(
  id: T,
  params?: {
    login?: string;
    password?: string;
  }
) => {
  if (params) {
    const searchParams = new URLSearchParams()
    if (params.login) searchParams.set('login', params.login)
    if (params.password) searchParams.set('password', params.password)

    return `${adminUsers()}/${id}/edit?${searchParams.toString()}` as const
  }
  return `${adminUsers()}/${id}/edit` as const
}
export const adminUserCreate = () => `${adminUsers()}/create` as const
export const adminReports = () => '/reports' as const
export const adminReport = <T extends string>(id: T) =>
  `${adminReports()}/${id}` as const
