import { ChangePasswordForm, VisitsFilter, VisitsList } from '@/components'
import { ActiveVisitModel, VisitStatus } from '@/models'
import { nav } from '@/pages'
import { usePageTitle } from '@/pages/wrappers/simple-header-wrap/page-title-context'
import { api } from '@/provider/api'
import { useLayoutActions } from '@/provider/layout-actions-provider/use-layout-actions'
import { ActionContainer, BaseDialog, Button, Card, Divider, PageWrapper } from '@/ui'
import { Highlight, Title } from '@/ui/title'
import { useMutation, useQuery } from '@tanstack/react-query'
import { useSnackbar } from 'notistack'
import { useEffect, useMemo, useState } from 'react'
import { useNavigate } from 'react-router-dom'

const EMPTY_ARR: ActiveVisitModel[] = []

export const VisitsListPage = () => {
  const navigate = useNavigate()
  const { enqueueSnackbar } = useSnackbar()

  usePageTitle({
    initialTitle: (
      <Title>
        <Highlight>Заявки</Highlight> на вход
      </Title>
    ),
  })

  const [filter, setFilter] = useState<VisitsFilter>({
    status: VisitStatus.NotProcessed,
    term: '',
  })

  const { data = EMPTY_ARR } = useQuery({
    queryKey: ['visit-requests', 'security', filter.status],
    queryFn: () =>
      api
        .getVisitsForUser({
          offset: 0,
          limit: 1000,
          status: filter.status,
        })
        .then((res) => res.data?.visit_requests),
  })

  const handleVisitClick = (visit: ActiveVisitModel) => {
    navigate(nav.visitByUser(visit.id))
  }

  const [isChangePasswordOpen, setIsChangePasswordOpen] = useState(false)
  const [loginPrefill, setLoginPrefill] = useState('')

  const { mutateAsync: changePassword, isPending: isChanging } = useMutation({
    mutationFn: (req: { login: string; currentPassword: string; newPassword: string; repeatPassword: string }) =>
      api.changePassword({
        login: req.login,
        current_password: req.currentPassword,
        new_password: req.newPassword,
        confirm_new_password: req.repeatPassword,
      }),
    onSuccess: () => {
      enqueueSnackbar('Пароль успешно изменен', { variant: 'success' })
      setIsChangePasswordOpen(false)
    },
    onError: () => {
      enqueueSnackbar('Произошла ошибка', { variant: 'error' })
    },
  })

  useLayoutActions({
    actions: (
      <Button onClick={() => setIsChangePasswordOpen(true)}>
        Смена пароля
      </Button>
    ),
  })

  const storedLogin = useMemo(() => localStorage.getItem('user_login') || '', [])
  useEffect(() => {
    setLoginPrefill(storedLogin)
  }, [storedLogin])

  return (
    <PageWrapper>
      <Card>
        <VisitsList
          filter={filter}
          onFilterChange={setFilter}
          collection={data}
          onRowClick={handleVisitClick}
        />
      </Card>

      <BaseDialog
        open={isChangePasswordOpen}
        onOpenChange={setIsChangePasswordOpen}
        title={
          <Title>
            <Highlight>Смена</Highlight> пароля
          </Title>
        }
        footer={
          <ActionContainer>
            <Button onClick={() => setIsChangePasswordOpen(false)} colorVariant="secondary">Отмена</Button>
            <Divider />
          </ActionContainer>
        }
      >
        <ChangePasswordForm
          initialData={{ login: loginPrefill }}
          hideLogin
          onSubmit={(data) => {
            changePassword({
              login: loginPrefill,
              currentPassword: data.currentPassword,
              newPassword: data.newPassword,
              repeatPassword: data.repeatPassword,
            })
          }}
        />
      </BaseDialog>
    </PageWrapper>
  )
}
