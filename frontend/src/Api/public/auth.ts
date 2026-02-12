import instance, { PagesURl } from '@/Api';
import { LoginRequest, LoginResponse, ResetAdminPassword, RestorePasswordRequest, User } from '@/Models/Auth/api';

export async function login(data: LoginRequest): Promise<LoginResponse> {
  const response = await instance.post<LoginResponse>(PagesURl.ACCOUNTS + '/login', data, {});
  return response.data;
}

export async function changePassword(data: RestorePasswordRequest) {
  await instance.post(PagesURl.ACCOUNTS + '/change-password', { ...data });
}

export async function resetAdminPassword(data: ResetAdminPassword) {
  await instance.post(PagesURl.ACCOUNTS + '/reset_password', { ...data });
}

export async function getMe(): Promise<User> {
  return (await instance.get<User>(PagesURl.ACCOUNTS + '/get_me')).data;
}
