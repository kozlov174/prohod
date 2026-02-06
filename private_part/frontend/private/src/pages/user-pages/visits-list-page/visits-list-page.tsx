import { ChangePasswordForm, VisitsFilter, VisitsList } from '@/components'
import { ActiveVisitModel, VisitStatus } from '@/models'
import { nav } from '@/pages'
import { usePageTitle } from '@/pages/wrappers/simple-header-wrap/page-title-context'
import { api } from '@/provider/api'
import { Card, PageWrapper, Button, Stack, BaseDialog } from '@/ui'
import { useLayoutActions } from '@/provider/layout-actions-provider/use-layout-actions'
import { getLogin } from '@/utils/auth'
import { useSnackbar } from 'notistack'
import { Highlight, Title } from '@/ui/title'
import { useQuery } from '@tanstack/react-query'
import { useState } from 'react'
import { useNavigate } from 'react-router-dom'

const EMPTY_ARR: ActiveVisitModel[] = []

export const VisitsListPage = () => {
  const navigate = useNavigate()
  const { enqueueSnackbar } = useSnackbar()
  const [isChangePasswordOpen, setChangePasswordOpen] = useState(false)

  useLayoutActions({
    actions: (
      <Stack gap={16} direction="row">
        <Button onClick={() => setChangePasswordOpen(true)}>Смена пароля</Button>
      </Stack>
    ),
  })

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
        onOpenChange={setChangePasswordOpen}
        title={
          <>
            Смена пароля
          </>
        }
      >
        <ChangePasswordForm
          initialData={{ login: getLogin() || '' }}
          onSubmit={(form) => {
            api
              .changePassword({
                login: form.login,
                current_password: form.currentPassword,
                new_password: form.newPassword,
                confirm_new_password: form.repeatPassword,
              })
              .then(() => {
                enqueueSnackbar('Пароль успешно изменен', { variant: 'success' })
                setChangePasswordOpen(false)
              })
              .catch(() => {
                enqueueSnackbar('Не удалось изменить пароль', { variant: 'error' })
              })
          }}
        />
      </BaseDialog>
    </PageWrapper>
  )
}
