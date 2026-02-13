import instance, { PagesURl } from '@/Api';
import { CreateUserRequest, PrivateUser } from '@/Models/Auth/api';
import { UserRole } from '@/Models/Auth/client';

export const getAllUsers = async () => {
  const response = await instance.get<{ users: PrivateUser[] }>(PagesURl.USER + '/users/');
  return response.data;
};

export async function createUser(role: UserRole, data: CreateUserRequest): Promise<PrivateUser> {
  return (await instance.post<PrivateUser>(PagesURl.USER + '/users/', { ...data }, { params: { role } })).data;
}

export async function getSecurities() {
  return (await instance.get<PrivateUser[]>(PagesURl.USER + '/securities/')).data;
}
