// Типы данных, соответствующие структуре базы данных

export enum RoleEnum {
  user = "user",
  security = "security",
  admin = "admin",
  post = "post",
}

export enum VisitRequestStatusEnum {
  not_processed = "not_processed",
  reject = "reject",
  accept = "accept",
}

export interface User {
  id: string
  name: string
  surname: string
  user_email: string
  role: RoleEnum
}

export interface Form {
  id: string
  user_to_visit_id: string
  passport_full_name: string
  passport_series: string
  passport_number: string
  passport_who_issued: string
  passport_issue_date: string
  passport_photo: string
  visit_time: string
  visit_reason: string
  email_to_send_reply: string
}

export interface VisitRequest {
  id: string
  form_id: string
  who_processed_user_id: string | null
  who_processed_security_id: string | null
  status: VisitRequestStatusEnum
  rejection_reason: string | null
}

export interface VisitLog {
  id: string
  visit_request_id: string
  entry_time: string | null
  exit_time: string | null
  post_user_id: string | null
  notes: string | null
}

// Расширенные типы для API
export interface VisitRequestWithForm extends VisitRequest {
  form: Form
  visit_log?: VisitLog | null
}
