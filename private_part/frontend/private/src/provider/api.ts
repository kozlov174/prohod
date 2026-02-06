import {
  ActiveVisitForSecurityModel,
  ActiveVisitModel,
  ActiveVisitsModel,
  AuthModel,
  AuthResponseModel,
  CreateAccountModel,
  ReportListItem,
  SecurityActiveVisitsModel,
  UserListItem,
  UserModel,
  UserStatus,
  VisitStatus,
  VisitTargetModel,
} from '../models'
import { instance } from './client'

type RawUser = UserListItem & { status?: 'active' | 'inactive' }

const normalizeUserStatus = (user: RawUser): UserListItem => {
  const normalizedStatus =
    user.user_status ??
    (user.status === 'inactive'
      ? UserStatus.Inactive
      : user.status === 'active'
      ? UserStatus.Active
      : undefined)

  const { status: _status, ...rest } = user

  return {
    ...rest,
    user_status: normalizedStatus,
  }
}

export const api = {
  createVisit: (data: VisitTargetModel) =>
    instance.post('/api/v1/visit-requests-for-users/visit-requests/', data),

  login: (data: AuthModel) => instance.post<AuthResponseModel>('/api/v1/accounts/login', data),

  getVisitsForUser: (params: { offset: number; limit: number; status: VisitStatus }) =>
    instance.get<ActiveVisitsModel | undefined>(
      '/api/v1/visit-requests-for-users/visit-requests/',
      {
        params: params
      }
    ),

  getVisitsForSecurity: (params: { offset: number; limit: number; status: VisitStatus }) =>
    instance.get<SecurityActiveVisitsModel | undefined>(
      '/api/v1/visit-requests-for-security/visit-requests/',
      {
        params: params
      }
    ),

  getVisitByUser: (id: string) =>
    instance.get<ActiveVisitModel>(`/api/v1/visit-requests-for-users/visit-requests/${id}`),

  getVisitBySecurity: (id: string) =>
    instance.get<ActiveVisitForSecurityModel>(
      `/api/v1/visit-requests-for-security/visit-requests/${id}`
    ),

  acceptVisitByUser: (data: { id: string }) => {
    const { id } = data
    return instance.post(`/api/v1/visit-requests-for-users/visit-requests/${id}/accept`)
  },

  acceptVisitBySecurity: (data: { id: string }) => {
    const { id } = data
    return instance.post(`/api/v1/visit-requests-for-security/visit-requests/${id}/accept`)
  },

  rejectVisitByUser: (data: { id: string; rejectionReason: string }) => {
    const { id, rejectionReason } = data
    return instance.post(`/api/v1/visit-requests-for-users/visit-requests/${id}/reject`, {
      rejection_reason: rejectionReason
    })
  },

  rejectVisitBySecurity: (data: { id: string; rejectionReason: string }) => {
    const { id, rejectionReason } = data
    return instance.post(`/api/v1/visit-requests-for-security/visit-requests/${id}/reject`, {
      rejection_reason: rejectionReason
    })
  },

  getUsers: async () => {
    try {
      const { data } = await instance.get<{ users: RawUser[] }>('/api/v1/users/users/')
      return data.users.map(normalizeUserStatus)
    } catch (e) {
      // fallback to unified endpoint if backend exposes /api/v1/users/
      try {
        const { data } = await instance.get<{ users: RawUser[] }>('/api/v1/users/')
        return data.users.map(normalizeUserStatus)
      } catch {
        return []
      }
    }
  },

  getSecurities: () => {
    return instance
      .get<{ securities: RawUser[] }>('/api/v1/users/securities/')
      .then(({ data }: { data: { securities: RawUser[] } }) =>
        data.securities.map(normalizeUserStatus)
      )
  },

  getMyself: () => {
    return instance.get<UserModel | undefined>('/api/v1/accounts/get_me')
  },

  createSecurity: (data: CreateAccountModel) =>
    instance.post<{
      login: string
      password: string
      id: string
    }>('/api/v1/accounts/create/security', data),

  createUser: (data: CreateAccountModel) =>
    instance.post<{
      login: string
      password: string
      id: string
    }>('/api/v1/accounts/create/user', data),

  changePassword: (data: {
    login: string
    current_password: string
    new_password: string
    confirm_new_password: string
  }) => instance.post('/api/v1/accounts/change-password', data),

  resetPassword: (data: { login: string; new_password: string; confirm_new_password: string }) =>
    instance.post('/api/v1/accounts/reset_password', data),

  reports: (data: { start_date: string; end_date: string }) =>
    instance.post<{ forms: ReportListItem[] }>(
      '/api/v1/reports/json_report/',
      null,
      {
        params: data
      }
    ),

  downloadReports: async (data: { start_date: string; end_date: string }) => {
    const response = await instance.post('/api/v1/reports/excel_report/', null, {
      params: data,
      responseType: 'blob'
    })
    return response.data
  },

  sendVerifyCode: (data: { email: string }) => {
    const qParams = {
      email: data.email
    }
    return instance.post('/api/v1/verify_email/send_verify_code', data, {
      params: qParams
    })
  },

  verifyCode: (data: { email: string; code: string }) => {
    const qParams = {
      email: data.email,
      code: data.code
    }
    return instance.post('/api/v1/verify_email/verify_code', data, {
      params: qParams
    })
  },

  activateUser: (data: { id: string }) => {
    const { id } = data
    return instance.post(`/api/v1/accounts/activate_user`, { id })
  },

  deactivateUser: (data: { id: string }) => {
    const { id } = data
    return instance.post(`/api/v1/accounts/deactivate_user`, { id })
  }
}
