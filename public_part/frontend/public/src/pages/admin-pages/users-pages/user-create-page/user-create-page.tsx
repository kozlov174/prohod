import { UserCreateForm, UserCreateFormValue } from '@/components'
import { PersonRole } from '@/models'
import { nav } from '@/pages'
import { usePageTitle } from '@/pages/wrappers/simple-header-wrap/page-title-context'
import { api } from '@/provider/api'
import { useLayoutActions } from '@/provider/layout-actions-provider'
import { Button, Card, Highlight, PageWrapper, Stack, Title } from '@/ui'
import { useMutation } from '@tanstack/react-query'
import { useSnackbar } from 'notistack'
import { useState } from 'react'
import { useNavigate } from 'react-router-dom'

const formId = 'user-create-form'

export function UserCreatePage() {
  const navigate = useNavigate()

  usePageTitle({
    initialTitle: (
      <Title>
        <Highlight>Добавление</Highlight> пользователя
      </Title>
    ),
  })

  useLayoutActions({ backHandler: () => navigate(nav.adminUsers()) })

  const { enqueueSnackbar } = useSnackbar()

  const [value, setValue] = useState<UserCreateFormValue>({
    login: '',
    name: '',
    surname: '',
    user_email: '',
    role: PersonRole.User,
  })

  const { mutateAsync: createUser } = useMutation({
    mutationFn: (reqData: UserCreateFormValue) => {
      const apiFn =
        reqData.role === PersonRole.User ? api.createUser : api.createSecurity

      return apiFn({
        account_info: {
          name: reqData.name,
          surname: reqData.surname,
          user_email: reqData.user_email,
        },
        login: reqData.login,
      })
    },
    onSuccess: (resp) => {
      enqueueSnackbar(
        `Пользователь успешно создан. Пароль: ${resp.data.password}`,
        {
          variant: 'success',
        }
      )
      navigate(
        nav.adminUserEdit(resp.data.id, {
          login: resp.data.login,
          password: resp.data.password,
        })
      )
    },
    onError: () => {
      enqueueSnackbar('Произошла ошибка', { variant: 'error' })
    },
  })

  const isValid =
    value.name.trim().length > 0 &&
    value.surname.trim().length > 0 &&
    value.user_email.trim().length > 0 &&
    value.login.trim().length > 0 &&
    value.role

  return (
    <PageWrapper>
      <Card>
        <Stack gap={24}>
          <UserCreateForm
            id={formId}
            value={value}
            onChange={setValue}
            onSubmit={() => createUser(value)}
          />
          <Stack gap={16} direction="row" justifyContent="end">
            <Button
              type="button"
              colorVariant="secondary"
              onClick={() => navigate(nav.adminUsers())}
            >
              Назад
            </Button>
            <Button
              form={formId}
              type="submit"
              colorVariant="primary"
              disabled={!isValid}
            >
              Создать
            </Button>
          </Stack>
        </Stack>
      </Card>
    </PageWrapper>
  )
}
