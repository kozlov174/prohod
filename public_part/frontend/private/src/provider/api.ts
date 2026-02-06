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
  VisitStatus,
  VisitTargetModel
} from '../models'
import { instance } from './client'

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

  getUsers: () => {
    return instance
      .get<{ users: UserListItem[] }>('/api/v1/users/users/')
      .then(({ data }) => data.users)
  },

  getSecurities: () => {
    return instance
      .get<{ securities: UserListItem[] }>('/api/v1/users/securities/')
      .then(({ data }) => data.securities)
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
      '/api/v1/reports/reports/',
      {},
      {
        params: data
      }
    ),

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
  }
}
