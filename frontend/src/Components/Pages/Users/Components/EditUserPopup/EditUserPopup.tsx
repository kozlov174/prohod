import { JSX, memo, useState } from 'react';
import { PrivateUser } from '@/Models/Auth/api';
import { Popup } from '@/Components/Layouts/Popup';
import { Input } from '@/Components/UI/Input';
import { USER_ROLE } from '@/Constants/User';
import { Button } from '@/Components/UI/Button';
import { Controller, useForm } from 'react-hook-form';
import { editPasswordSchema } from '@/Components/Pages/Users/Components/EditUserPopup/schema';
import { yupResolver } from '@hookform/resolvers/yup';
import { InferType } from 'yup';
import { activateUser, deactivateUser, resetPasswordForAdmin } from '@/Api/private/auth';
import { toast } from 'react-toastify';
import { useMutation, useQueryClient } from '@tanstack/react-query';

interface EditUserPopupProps {
  user: PrivateUser;
  onClose: () => void;
}

function EditUserPopupComponent({ user, onClose }: EditUserPopupProps): JSX.Element {
  const queryClient = useQueryClient();
  const [isDisplayPassword, setIsDisplayPassword] = useState(false);
  const changeUserStatusMutation = useMutation({
    mutationFn: async () => {
      if (user.status === 'active') {
        await deactivateUser(user.id);
      } else {
        await activateUser(user.id);
      }
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['users'] });
      toast.success('Пользователь изменен');
    },
  });
  const editPasswordForm = useForm({
    resolver: yupResolver(editPasswordSchema),
    mode: 'onTouched',
  });

  const onSubmit = async (data: InferType<typeof editPasswordSchema>) => {
    await resetPasswordForAdmin({
      login: user.login,
      newPassword: data.newPassword,
      confirmNewPassword: data.repeatNewPassword,
    });
    editPasswordForm.reset();
    setIsDisplayPassword(false);
    toast.success('Пароль изменен');
  };

  return (
    <Popup displayCloseButton onClose={onClose}>
      <div>
        <h2>{`${user.surname} ${user.name}`}</h2>
        <Input type="text" label="ФИО" disabled value={`${user.surname} ${user.name}`} onChange={() => {}} />
        <Input type="text" label="Логин" disabled value={user.login} onChange={() => {}} />
        <Input type="text" label="Email" disabled value={user.userEmail} onChange={() => {}} />
        <Input type="text" label="Роль" disabled value={USER_ROLE[user.role]} onChange={() => {}} />
        <Input
          type="text"
          label="Статус"
          disabled
          value={user.status === 'active' ? 'Активен' : 'Заблокирован'}
          onChange={() => {}}
        />
        {!isDisplayPassword ? (
          <Button size="s" color="secondary" onClick={() => setIsDisplayPassword(true)}>
            Изменить пароль
          </Button>
        ) : (
          <form onSubmit={editPasswordForm.handleSubmit(onSubmit)}>
            <Controller
              name="newPassword"
              control={editPasswordForm.control}
              render={({ field }) => (
                <Input
                  type="password"
                  label="Новый пароль"
                  {...field}
                  error={editPasswordForm.formState.errors.newPassword?.message}
                />
              )}
            />
            <Controller
              name="repeatNewPassword"
              control={editPasswordForm.control}
              render={({ field }) => (
                <Input
                  type="password"
                  label="Повторите пароль"
                  {...field}
                  error={editPasswordForm.formState.errors.repeatNewPassword?.message}
                />
              )}
            />
            <Button size="s" type="submit" color="secondary">
              Сохранить
            </Button>
          </form>
        )}
        <Button
          disabled={changeUserStatusMutation.isPending}
          onClick={() => changeUserStatusMutation.mutate()}
          size="s"
          color={`${user.status === 'active' ? 'red' : 'blue'}`}
        >{`${changeUserStatusMutation.isPending ? '...' : user.status === 'active' ? 'Деактивировать' : 'Активировать'} пользователя`}</Button>
      </div>
    </Popup>
  );
}

export const EditUserPopup = memo(EditUserPopupComponent);
