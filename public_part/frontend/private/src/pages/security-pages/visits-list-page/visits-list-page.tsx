import { VisitsFilter, VisitsList } from '@/components'
import { ActiveVisitModel, VisitStatus } from '@/models'
import { nav } from '@/pages'
import { usePageTitle } from '@/pages/wrappers/simple-header-wrap/page-title-context'
import { api } from '@/provider/api'
import { Card, PageWrapper } from '@/ui'
import { Highlight, Title } from '@/ui/title'
import { useQuery } from '@tanstack/react-query'
import { useState } from 'react'
import { useNavigate } from 'react-router-dom'

const EMPTY_ARR: ActiveVisitModel[] = []

export const VisitsListPage = () => {
  const navigate = useNavigate()

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
        .getVisitsForSecurity({
          offset: 0,
          limit: 1000,
          status: filter.status,
        })
        .then((res) => res.data?.visit_requests),
  })

  const handleVisitClick = (visit: ActiveVisitModel) => {
    navigate(nav.visitBySecurity(visit.id))
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
