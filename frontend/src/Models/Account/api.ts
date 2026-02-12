import { UserRole } from '@/Models/Auth/client';

export type CreateAccountRequest = {
  accountInfo: {
    name: string;
    surname: string;
    userEmail: string;
  };
  login: string;
};
export type CreateAccountResponse = {
  id: string;
  password: string;
  login: string;
};

export type Account = {
  id: string;
  name: string;
  surname: string;
  userEmail: string;
  role: UserRole;
};
