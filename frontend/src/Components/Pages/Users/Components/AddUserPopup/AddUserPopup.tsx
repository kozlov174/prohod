import { JSX, memo } from 'react';
import { Popup } from '@/Components/Layouts/Popup';
import { Controller, useForm } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import { addUserSchema } from '@/Components/Pages/Users/Components/AddUserPopup/schema';
import { Input } from '@/Components/UI/Input';
import { Select } from '@/Components/UI/Select';
import { USER_ROLE_LIST } from '@/Constants/User';
import styles from './Styles.module.scss';
import { Button } from '@/Components/UI/Button';
import { InferType } from 'yup';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { createAccount } from '@/Api/private/auth';
import { UserRole } from '@/Models/Auth/client';
import { CreateAccountRequest } from '@/Models/Account/api';

interface AddUserPopupProps {
  onClose: () => void;
}

function AddUserPopupComponent({ onClose }: AddUserPopupProps): JSX.Element {
  const queryClient = useQueryClient();
  const addUserMutation = useMutation({
    mutationFn: (data: { role: UserRole; data: CreateAccountRequest }) =>
      createAccount({ role: data.role, data: data.data }),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['users'] });
      queryClient.invalidateQueries({ queryKey: ['securities'] });
      onClose();
    },
  });
  const addUserForm = useForm({
    resolver: yupResolver(addUserSchema),
    mode: 'onTouched',
  });

  const onCreateUser = (data: InferType<typeof addUserSchema>) => {
    addUserMutation.mutate({
      data: {
        accountInfo: {
          name: data.name,
          surname: data.surname,
          userEmail: data.userEmail,
        },
        login: data.login,
      },
      role: data.role.id,
    });
  };

  return (
    <Popup displayCloseButton onClose={onClose}>
      <form onSubmit={addUserForm.handleSubmit(onCreateUser)} className={styles.addUserPopup}>
        <h2>Добавление пользователя</h2>
        <Controller
          control={addUserForm.control}
          name="name"
          render={({ field }) => (
            <Input
              error={addUserForm.formState.errors[field.name]?.message}
              placeholder="Имя"
              label="Имя"
              type="text"
              {...field}
            />
          )}
        />
        <Controller
          control={addUserForm.control}
          name="surname"
          render={({ field }) => (
            <Input
              error={addUserForm.formState.errors[field.name]?.message}
              placeholder="Введите фамилию"
              label="Фамилия"
              type="text"
              {...field}
            />
          )}
        />
        <Controller
          control={addUserForm.control}
          name="userEmail"
          render={({ field }) => (
            <Input
              error={addUserForm.formState.errors[field.name]?.message}
              placeholder="Введите email"
              label="Email"
              type="text"
              {...field}
            />
          )}
        />
        <Controller
          control={addUserForm.control}
          name="login"
          render={({ field }) => (
            <Input
              error={addUserForm.formState.errors[field.name]?.message}
              placeholder="Введите логин"
              label="Логин"
              type="text"
              {...field}
            />
          )}
        />
        <Controller
          control={addUserForm.control}
          name="role"
          render={({ field }) => (
            <Select
              direction="up"
              list={USER_ROLE_LIST.filter(item => item.id !== 'admin')}
              error={addUserForm.formState.errors[field.name]?.message}
              placeholder="Выберите роль"
              label="Роль"
              type="single"
              selectedValue={field.value}
              onChange={field.onChange}
            />
          )}
        />
        <Button size="s" type="submit">
          Добавить
        </Button>
      </form>
    </Popup>
  );
}

export const AddUserPopup = memo(AddUserPopupComponent);
