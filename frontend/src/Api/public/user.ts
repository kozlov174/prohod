import instance, { PagesURl } from '@/Api';
import { CreateUserRequest, User } from '@/Models/Auth/api';

export const getAllUsers = async () => {
  const response = await instance.get<{ users: User[] }>(PagesURl.USER + '/users/');
  return response.data;
};

export async function createUser(data: CreateUserRequest): Promise<User> {
  return (await instance.post(PagesURl.USER + '/users/', { ...data, role: 'user' })).data;
}

export async function getSecurities() {
  return (await instance.get(PagesURl.USER + '/securities/')).data;
}
