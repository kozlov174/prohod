import { UserRole } from '@/Models/Auth/client';
import { Filter } from '@/Models/Shared/filter';
import { List } from '@/Models/Shared/list';

export type LoginResponse = {
  accessToken: string;
  refreshToken: string;
  firstEntrance: boolean;
};
export type LoginRequest = {
  username: string;
  password: string;
};

export type User = {
  id: string;
  idInstitute?: string;
  idDirection?: string;
  idReadingDivision?: string;
  idProgram?: string;
  name: string;
  surname: string;
  patronymic: string;
  email: string;
  phone?: string;
  role: UserRole;
  isActive: boolean;
  createdAt: string;
  updatedAt?: string;
};

export type GetAllUsersResponse = List<User>;
export type GetAllUsersRequest = Filter<{
  idInstitute: string;
  idDirection: string;
  idReadingDivision: string;
  idProgram: string;
}>;

export type CreateUserRequest = Omit<User, 'id' | 'createdAt' | 'updatedAt' | 'isActive'>;
export type EditUserRequest = Partial<CreateUserRequest>;
