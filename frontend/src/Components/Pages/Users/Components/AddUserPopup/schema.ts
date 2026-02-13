import { UserRole } from '@/Models/Auth/client';
import { ListValueChema } from '@/Schemas';
import * as yup from 'yup';

export const addUserSchema = yup.object().shape({
  name: yup.string().required('Введите имя'),
  surname: yup.string().required('Введите фамилию'),
  userEmail: yup.string().email('Введите корректный email').required('Введите email'),
  login: yup.string().required('Введите логин'),
  role: ListValueChema<UserRole>().required('Выберите роль'),
});
