import * as yup from 'yup';

export const loginSchema = yup.object().shape({
  username: yup.string().required('Введите логин'),
  password: yup.string().required('Введите пароль'),
  remember: yup.boolean().default(false),
});

export const resetSchema = yup.object().shape({
  mail: yup.string().required('Введите почту').email('Введите корректную почту'),
});
