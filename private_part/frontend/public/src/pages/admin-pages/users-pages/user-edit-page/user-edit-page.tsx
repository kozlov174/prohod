import {
  ResetPasswordForm,
  ResetPasswordFormSubmitData,
  UserView,
} from '@/components'
import { nav } from '@/pages'
import { usePageTitle } from '@/pages/wrappers/simple-header-wrap/page-title-context'
import { api } from '@/provider/api'
import { useLayoutActions } from '@/provider/layout-actions-provider'
import { Button, Card, Highlight, PageWrapper, Stack, Title } from '@/ui'
import { FormGroup } from '@/ui/form-group'
import { useMutation, useQuery } from '@tanstack/react-query'
import { useSnackbar } from 'notistack'
import { useState } from 'react'
import { useNavigate, useParams } from 'react-router-dom'

import * as S from './styled'

export function UserEditPage() {
  const { userId } = useParams<{ userId: string }>()
  const navigate = useNavigate()

  const { enqueueSnackbar } = useSnackbar()

  const [isPasswordResetMode, setPasswordResetMode] = useState(false)
  useLayoutActions({
    backHandler: () => navigate(nav.adminUsers()),
  })

  usePageTitle({
    initialTitle: (
      <Title>
        <Highlight>Редактирование</Highlight> пользователя
      </Title>
    ),
  })

  const { data } = useQuery({
    queryKey: ['user', userId],
    queryFn: () =>
      Promise.all([api.getUsers(), api.getSecurities()]).then(
        ([users, securities]) =>
          users.find((u) => u.id === userId) ||
          securities.find((u) => u.id === userId)
      ),
  })

  const { mutateAsync: changePassword } = useMutation({
    mutationFn: (reqData: ResetPasswordFormSubmitData & { login: string }) => {
      return api.resetPassword({
        login: reqData.login,
        new_password: reqData.newPassword,
        confirm_new_password: reqData.repeatPassword,
      })
    },
    onSuccess: () => {
      enqueueSnackbar('Пароль успешно изменен', { variant: 'success' })
    },
    onError: () => {
      enqueueSnackbar('Произошла ошибка', { variant: 'error' })
    },
  })

  if (!data) return null

  return (
    <PageWrapper>
      <Card>
        <Stack gap={24}>
          <FormGroup title="Пользователь">
            <UserView data={data} />
          </FormGroup>
          {!isPasswordResetMode && (
            <Button
              colorVariant="warning"
              onClick={() => setPasswordResetMode(true)}
            >
              Изменить пароль
            </Button>
          )}
          {isPasswordResetMode && (
            <ResetPasswordForm
              onSubmit={(value) => {
                changePassword({ ...value, login: data.login })
              }}
            />
          )}
          <S.Actions>
            <Button
              colorVariant="secondary"
              onClick={() => navigate(nav.adminUsers())}
            >
              Назад
            </Button>
          </S.Actions>
        </Stack>
      </Card>
    </PageWrapper>
  )
}
