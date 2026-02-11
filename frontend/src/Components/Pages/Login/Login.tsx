import { JSX, memo, useState } from 'react';
import { Controller, useForm } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import styles from './Styles.module.scss';
import { loginSchema, resetSchema } from './schema';
import { InferType } from 'yup';
import { Button } from '@/Components/UI/Button';
import { setTokensToCookies } from '@/Utils/token';
import { login } from '@/Api/auth';
import { useNavigate } from 'react-router-dom';
import { Checkbox } from '@/Components/UI/Checkbox';
import { Input } from '@/Components/UI/Input';
import { toast } from 'react-toastify';

function LoginComponent(): JSX.Element {
  const navigate = useNavigate();
  const [isResetPassword, setIsResetPassword] = useState(false);
  const loginForm = useForm({
    resolver: yupResolver(loginSchema),
    defaultValues: { remember: false },
  });
  const resetForm = useForm({
    resolver: yupResolver(resetSchema),
  });

  const onSubmit = async (data: InferType<typeof loginSchema>) => {
    try {
      const user = await login({ username: data.username, password: data.password });
      if (user) {
        setTokensToCookies(user.accessToken, 'access', {}, !data.remember);
        setTokensToCookies(user.refreshToken, 'refresh', {}, !data.remember);
        navigate('/');
      }
    } catch {
      loginForm.setError('password', { message: 'Неправильный логин или пароль' });
      loginForm.setError('username', { message: ' ' });
    }
  };

  const onResetPassword = (data: InferType<typeof resetSchema>) => {
    console.log(data);
    toast.success('Письмо отправлено');
    resetForm.reset();
    setIsResetPassword(false);
  };

  return (
    <div className={styles.container}>
      {isResetPassword ? (
        <form key="reset-form" className={styles.container__form} onSubmit={resetForm.handleSubmit(onResetPassword)}>
          <img src="/logo.svg" alt="УрФУ" className={styles.container__logo} />
          <h2 className={styles.container__title}>{'Восстановление пароля'}</h2>
          <Controller
            name="mail"
            control={resetForm.control}
            render={({ field }) => (
              <Input
                name={field.name}
                type="text"
                value={field.value}
                onChange={val => {
                  console.log(val);
                  resetForm.setValue('mail', val);
                }}
                error={resetForm.formState.errors.mail?.message}
                placeholder="Почта"
              />
            )}
          />
          <div className={styles.container__buttons}>
            <Button
              onClick={() => {
                setIsResetPassword(!isResetPassword);
                resetForm.reset();
              }}
              type="button"
              size="s"
              color="secondary"
              fullWidth
            >
              {'Назад'}
            </Button>
            <Button type="submit" size="ss" fullWidth color="blue">
              {'Отправить письмо'}
            </Button>
          </div>
        </form>
      ) : (
        <form key="login-form" className={styles.container__form} onSubmit={loginForm.handleSubmit(onSubmit)}>
          <img src="/logo.svg" alt="УрФУ" className={styles.container__logo} />
          <h2 className={styles.container__title}>{'Вход'}</h2>
          <Controller
            name="username"
            control={loginForm.control}
            render={({ field }) => (
              <Input
                name={field.name}
                type="text"
                value={field.value}
                onChange={field.onChange}
                error={loginForm.formState.errors.username?.message}
                placeholder="Логин"
              />
            )}
          />
          <Controller
            name="password"
            control={loginForm.control}
            render={({ field }) => (
              <Input
                name={field.name}
                value={field.value}
                onChange={field.onChange}
                error={loginForm.formState.errors.password?.message}
                placeholder="Пароль"
                type="password"
              />
            )}
          />
          <Controller
            name="remember"
            control={loginForm.control}
            render={({ field }) => (
              <Checkbox label="Запомнить меня" isActive={field.value} onChange={() => field.onChange(!field.value)} />
            )}
          />
          <div className={styles.container__buttons}>
            <Button
              onClick={() => {
                setIsResetPassword(true);
              }}
              type="button"
              size="s"
              color="secondary"
              fullWidth
            >
              {'Забыли пароль?'}
            </Button>
            <Button type="submit" size="ss" fullWidth color="blue">
              {'Войти'}
            </Button>
          </div>
        </form>
      )}
    </div>
  );
}

export const Login = memo(LoginComponent);
