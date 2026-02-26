import { UserRole } from '@/Models/Auth/client';
import { List } from '@/Models/Shared/list';

export type LoginResponse = {
  user: {
    id: string;
    name: string;
    surname: string;
    userEmail: string;
    role: UserRole;
  };
  jwtToken: string;
};
export type LoginRequest = {
  login: string;
  password: string;
};

export type User = {
  id: string;
  name: string;
  surname: string;
  userEmail: string;
  role: UserRole;
  login: string;
};

export type PrivateUser = User & {
  status: string;
};

export type GetAllUsersResponse = List<User>;

export type CreateUserRequest = Omit<User, 'role'>;

export type RestorePasswordRequest = {
  login: string;
  currentPassword: string;
  newPassword: string;
  confirmNewPassword: string;
};

export type ResetAdminPassword = {
  login: string;
  newPassword: string;
  confirmNewPassword: string;
};
