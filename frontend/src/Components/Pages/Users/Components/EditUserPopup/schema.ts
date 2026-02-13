import * as yup from 'yup';

export const editPasswordSchema = yup.object().shape({
  newPassword: yup.string().required('Введите пароль'),
  repeatNewPassword: yup
    .string()
    .required('Введите пароль')
    .oneOf([yup.ref('newPassword')], 'Пароли не совпадают'),
});
