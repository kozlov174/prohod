import { PersonRole, UserListItem, UserStatus } from '@/models'
import { Stack } from '@/ui'
import { FormGroupControl } from '@/ui/form-group'

import * as S from './styled'

const roleMapper: Record<PersonRole, string> = {
  [PersonRole.Admin]: 'Администратор',
  [PersonRole.Security]: 'Охранник',
  [PersonRole.User]: 'Пользователь',
}

type UserViewProps = {
  data: UserListItem;
};

export function UserView(props: UserViewProps) {
  const { data } = props

  const fullName = [data.name, data.surname].join(' ')

  return (
    <Stack gap={16}>
      <FormGroupControl label="ФИО">
        <S.Field>{fullName}</S.Field>
      </FormGroupControl>

      <FormGroupControl label="login">
        <S.Field>{data.login}</S.Field>
      </FormGroupControl>

      <FormGroupControl label="Email">
        <S.Field>{data.user_email}</S.Field>
      </FormGroupControl>

      <FormGroupControl label="Роль">
        <S.Field>{roleMapper[data.role]}</S.Field>
      </FormGroupControl>

      <FormGroupControl label="Статус">
        <S.Field>
          {data.user_status === UserStatus.Inactive ? "Деактивирован" : "Активен"}
        </S.Field>
      </FormGroupControl>
    </Stack>
  )
}
