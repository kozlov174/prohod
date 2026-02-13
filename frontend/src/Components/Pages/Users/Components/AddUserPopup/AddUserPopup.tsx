import { JSX, memo } from 'react';
import { Popup } from '@/Components/Layouts/Popup';
import { Controller, useForm } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import { addUserSchema } from '@/Components/Pages/Users/Components/AddUserPopup/schema';
import { Input } from '@/Components/UI/Input';
import { Select } from '@/Components/UI/Select';
import { USER_ROLE_LIST } from '@/Constants/User';

interface AddUserPopupProps {
  onClose: () => void;
}

function AddUserPopupComponent({ onClose }: AddUserPopupProps): JSX.Element {
  const addUserForm = useForm({
    resolver: yupResolver(addUserSchema),
    mode: 'onTouched',
  });
  return (
    <Popup displayCloseButton onClose={onClose}>
      <form>
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
              list={USER_ROLE_LIST}
              error={addUserForm.formState.errors[field.name]?.message}
              placeholder="Введите логин"
              label="Логин"
              type="single"
              selectedValue={field.value}
              onChange={field.onChange}
            />
          )}
        />
      </form>
    </Popup>
  );
}

export const AddUserPopup = memo(AddUserPopupComponent);
