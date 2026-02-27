import { JSX, memo } from 'react';
import { Controller, useForm } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import styles from './Styles.module.scss';
import { loginSchema } from './schema';
import { InferType } from 'yup';
import { Button } from '@/Components/UI/Button';
import { setTokensToCookies } from '@/Utils/token';
import { login } from '@/Api/public/auth';
import { login as privateLogin } from '@/Api/private/auth';
import { Link, useNavigate } from 'react-router-dom';
import { Checkbox } from '@/Components/UI/Checkbox';
import { Input } from '@/Components/UI/Input';
import { useMutation } from '@tanstack/react-query';

interface LoginProps {
  isPublic?: boolean;
}

function LoginComponent({ isPublic }: LoginProps): JSX.Element {
  const navigate = useNavigate();
  const loginForm = useForm({
    resolver: yupResolver(loginSchema),
    defaultValues: { remember: false },
  });
  const loginMutation = useMutation({
    mutationFn: isPublic ? login : privateLogin,
  });

  const onSubmit = async (data: InferType<typeof loginSchema>) => {
    try {
      const user = await loginMutation.mutateAsync({ login: data.login, password: data.password });
      if (user) {
        setTokensToCookies(user.jwtToken, 'access', {}, !data.remember);
        navigate('/visits');
      }
    } catch {
      loginForm.setError('password', { message: 'Неправильный логин или пароль' });
      loginForm.setError('login', { message: ' ' });
    }
  };

  return (
    <div className={styles.container}>
      <form key="login-form" className={styles.container__form} onSubmit={loginForm.handleSubmit(onSubmit)}>
        <img src="/logo.svg" alt="УрФУ" className={styles.container__logo} />
        <h2 className={styles.container__title}>{'Вход'}</h2>
        <Controller
          name="login"
          control={loginForm.control}
          render={({ field }) => (
            <Input
              name={field.name}
              type="text"
              value={field.value}
              onChange={field.onChange}
              error={loginForm.formState.errors.login?.message}
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
          <Link to={'/'}>
            <Button type="button" size="s" color="secondary" fullWidth>
              {'На главную'}
            </Button>
          </Link>
          <Button disabled={loginMutation.isPending} type="submit" size="ss" fullWidth color="blue">
            {loginMutation.isPending ? 'Вход...' : 'Войти'}
          </Button>
        </div>
      </form>
    </div>
  );
}

export const Login = memo(LoginComponent);
