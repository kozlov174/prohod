import { UserView } from '@/components'
import { nav } from '@/pages'
import { usePageTitle } from '@/pages/wrappers/simple-header-wrap/page-title-context'
import { api } from '@/provider/api'
import { useLayoutActions } from '@/provider/layout-actions-provider'
import { Card, Highlight, PageWrapper, Title } from '@/ui'
import { useQuery } from '@tanstack/react-query'
import { useNavigate, useParams } from 'react-router-dom'

export function UserViewPage() {
  const navigate = useNavigate()

  useLayoutActions({ backHandler: () => navigate(nav.adminUsers()) })

  usePageTitle({
    initialTitle: (
      <Title>
        <Highlight>Пользователь</Highlight>
      </Title>
    ),
  })

  const { userId } = useParams<{ userId: string }>()

  const { data } = useQuery({
    queryKey: ['user', userId],
    queryFn: () =>
      api.getUsers().then((res) => res.find((u) => u.id === userId)),
  })

  if (!data) return null

  return (
    <PageWrapper>
      <Card>
        <UserView data={data} />
      </Card>
    </PageWrapper>
  )
}
