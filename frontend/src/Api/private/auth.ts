import { PagesURl, privateInstance } from '@/Api';
import { CreateAccountRequest, CreateAccountResponse } from '@/Models/Account/api';
import { LoginRequest, LoginResponse, ResetAdminPassword, RestorePasswordRequest, User } from '@/Models/Auth/api';
import { UserRole } from '@/Models/Auth/client';

export async function login(data: LoginRequest): Promise<LoginResponse> {
  const response = await privateInstance.post<LoginResponse>(PagesURl.ACCOUNTS + '/login', data, {});
  return response.data;
}

export async function createAccount(data: {
  role: UserRole;
  data: CreateAccountRequest;
}): Promise<CreateAccountResponse> {
  return (
    await privateInstance.post<CreateAccountResponse>(PagesURl.ACCOUNTS + `/create/${data.role}`, { ...data.data })
  ).data;
}

export async function changePassword(data: RestorePasswordRequest) {
  await privateInstance.post(PagesURl.ACCOUNTS + '/change-password', { ...data });
}

export async function resetPasswordForAdmin(data: ResetAdminPassword) {
  await privateInstance.post(PagesURl.ACCOUNTS + '/reset_password', { ...data });
}

export async function getMe(): Promise<User> {
  return (await privateInstance.get<User>(PagesURl.ACCOUNTS + '/get_me')).data;
}

export async function deactivateUser(id: string) {
  await privateInstance.post(PagesURl.ACCOUNTS + '/deactivate_user', { id });
}

export async function activateUser(id: string) {
  await privateInstance.post(PagesURl.ACCOUNTS + '/activate_user', { id });
}
