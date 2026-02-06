export type PassportModel = {
  passport_full_name: string;
  passport_series: string;
  passport_number: string;
  passport_who_issued: string;
  passport_issue_date: string;
  passport_photo: string;
};
export type VisitTargetModel = {
  form: {
    user_to_visit_id: string;
    // timestamp
    visit_time: number;
    visit_reason: string;
    email_to_send_reply: string;
  } & PassportModel;
};

export type AuthModel = {
  login: string;
  password: string;
};

export enum PersonRole {
  User = 'user',
  Security = 'security',
  Admin = 'admin',
}

export enum UserStatus {
  Active = 'active',
  Inactive = 'inactive',
}

export type UserModel = {
  id: string;
  name: string;
  surname: string;
  user_email: string;
  role: PersonRole;
  user_status?: UserStatus;
};

export type UserListItem = UserModel & {
  login: string;
};

export type AuthResponseModel = {
  user: UserModel;
  jwtToken: string;
};

export type CreateAccountModel = {
  account_info: {
    name: string;
    surname: string;
    user_email: string;
  };
  login: string;
};

export type EditAccountModel = {
  login: string;
  current_password: string;
  new_password: string;
  confirm_password: string;
};

export enum VisitStatus {
  NotProcessed = 'not_processed',
  Reject = 'reject',
  Accept = 'accept',
}

type ActiveVisitTargetFormModel = {
  user_to_visit_id: string;
  email_to_send_reply: string;
  passport_full_name: string;
  visit_reason: string;
  visit_time: string;
};

export type ActiveVisitModel = {
  id: string;
  form: ActiveVisitTargetFormModel;
  status: VisitStatus;
  rejectionReason: string;
};

export type ActiveVisitForSecurityModel = {
  id: string;
  form: ActiveVisitTargetFormModel & PassportModel;
  status: VisitStatus;
  rejectionReason: string;
};

export function isActiveVisitForSecurityModel(
  data: ActiveVisitModel | ActiveVisitForSecurityModel
): data is ActiveVisitForSecurityModel {
  return 'passport_number' in data.form
}

export type ActiveVisitsModel = {
  visit_requests: ActiveVisitModel[];
};

export type SecurityActiveVisitsModel = {
  visit_requests: ActiveVisitForSecurityModel[];
};

export type ReportListItem = {
  user_to_visit_id: string;
  passport_full_name: string;
  passport_number: string;
  passport_issue_date: string;
  visit_time: string;
  email_to_send_reply: string;
  id: string;
  passport_series: string;
  passport_who_issued: string;
  passport_photo: string;
  visit_reason: string;
  visit_request_id: string;
};
