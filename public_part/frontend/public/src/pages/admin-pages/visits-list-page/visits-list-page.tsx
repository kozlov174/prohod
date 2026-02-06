import { VisitsFilter, VisitsList } from '@/components'
import { ActiveVisitModel, VisitStatus } from '@/models'
import { nav } from '@/pages'
import { usePageTitle } from '@/pages/wrappers/simple-header-wrap/page-title-context'
import { api } from '@/provider/api'
import { useLayoutActions } from '@/provider/layout-actions-provider'
import { Button, Card, PageWrapper, Stack } from '@/ui'
import { Highlight, Title } from '@/ui/title'
import { useQuery } from '@tanstack/react-query'
import { useState } from 'react'
import { useNavigate } from 'react-router-dom'

const EMPTY_ARR: ActiveVisitModel[] = []

export const VisitsListPage = () => {
  const navigate = useNavigate()

  useLayoutActions({
    actions: (
      <Stack gap={16} direction="row">
        <Button onClick={() => navigate(nav.adminUsers())}>
          Добавить пользователя
        </Button>
        <Button onClick={() => navigate(nav.adminReports())}>Отчеты</Button>
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
    queryKey: ['visit-requests', 'admin', filter.status],
    queryFn: () =>
      api
        .getVisitsForSecurity({
          offset: 0,
          limit: 1000,
          status: filter.status,
        })
        .then((res) => res.data?.visit_requests),
  })

  const handleVisitClick = (visit: ActiveVisitModel) => {
    navigate(nav.visitByAdmin(visit.id))
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
    </PageWrapper>
  )
}
