import { PagesURl, privateInstance } from '@/Api';
import { CreateUserRequest, PrivateUser } from '@/Models/Auth/api';

export const getAllUsers = async () => {
  const response = await privateInstance.get<{ users: PrivateUser[] }>(PagesURl.USER + '/users/');
  return response.data;
};

export async function createUser(data: CreateUserRequest): Promise<PrivateUser> {
  return (await privateInstance.post<PrivateUser>(PagesURl.USER + '/users/', { ...data })).data;
}

export async function getSecurities() {
  return (await privateInstance.get<{ securities: PrivateUser[] }>(PagesURl.USER + '/securities/')).data;
}
