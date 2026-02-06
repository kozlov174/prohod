import {
  ResetPasswordForm,
  ResetPasswordFormSubmitData,
  UserView,
} from '@/components'
import { UserListItem, UserStatus } from '@/models'
import { nav } from '@/pages'
import { usePageTitle } from '@/pages/wrappers/simple-header-wrap/page-title-context'
import { api } from '@/provider/api'
import { useLayoutActions } from '@/provider/layout-actions-provider'
import { Button, Card, Highlight, PageWrapper, Stack, Title } from '@/ui'
import { FormGroup } from '@/ui/form-group'
import { useMutation, useQueryClient } from '@tanstack/react-query'
import { useSnackbar } from 'notistack'
import { useState, useMemo } from 'react'
import { useNavigate, useParams, useSearchParams } from 'react-router-dom'

import * as S from './styled'

export function UserEditPage() {
  const { userId } = useParams<{ userId: string }>()
  const navigate = useNavigate()
  const queryClient = useQueryClient()
  const [searchParams] = useSearchParams()
  const createdLogin = searchParams.get('login') || undefined
  const createdPassword = searchParams.get('password') || undefined

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

  // Получаем данные пользователя из кэша списка пользователей
  const usersData = queryClient.getQueryData<UserListItem[]>(['users'])
  const data = useMemo(() => {
    return usersData?.find((user: UserListItem) => user.id === userId)
  }, [usersData, userId])

  if (!data && userId && !createdLogin) {
    return (
      <PageWrapper>
        <Card>
          <Stack gap={24}>
            <div style={{ color: 'red' }}>
              Пользователь не найден
            </div>
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

  const { mutateAsync: activateUser } = useMutation({
    mutationFn: (id: string) => api.activateUser({ id }),
    onSuccess: async () => {
      enqueueSnackbar('Пользователь активирован', { variant: 'success' })
      // Инвалидируем кэш, чтобы компонент пересчитал данные
      await queryClient.invalidateQueries({ queryKey: ['users'] })
    },
    onError: () => {
      enqueueSnackbar('Произошла ошибка при активации', { variant: 'error' })
    },
  })

  const { mutateAsync: deactivateUser } = useMutation({
    mutationFn: (id: string) => api.deactivateUser({ id }),
    onSuccess: async () => {
      enqueueSnackbar('Пользователь деактивирован', { variant: 'success' })
      // Инвалидируем кэш, чтобы компонент пересчитал данные
      await queryClient.invalidateQueries({ queryKey: ['users'] })
    },
    onError: () => {
      enqueueSnackbar('Произошла ошибка при деактивации', { variant: 'error' })
    },
  })

  if (!data && createdLogin) {
    return (
      <PageWrapper>
        <Card>
          <Stack gap={24}>
            <div style={{ fontWeight: 600 }}>Учетная запись создана</div>
            <div>
              Логин: <b>{createdLogin}</b>
            </div>
            {createdPassword && (
              <div>
                Пароль: <b>{createdPassword}</b>
              </div>
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
          {!isPasswordResetMode && (
            data.user_status === UserStatus.Inactive ? (
              <S.ActivateButton
                onClick={() => activateUser(data.id)}
              >
                Активировать пользователя
              </S.ActivateButton>
            ) : (
              <S.DeactivateButton
                onClick={() => deactivateUser(data.id)}
              >
                Деактивировать пользователя
              </S.DeactivateButton>
            )
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
