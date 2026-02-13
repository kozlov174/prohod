import { UserRole } from '@/Models/Auth/client';
import { getListFormObject } from '@/Utils';

export const USER_ROLE: Record<UserRole, string> = {
  admin: 'Администратор',
  user: 'Пользователь',
  security: 'Сотрудник УБ',
};
export const USER_ROLE_LIST = getListFormObject(USER_ROLE);
