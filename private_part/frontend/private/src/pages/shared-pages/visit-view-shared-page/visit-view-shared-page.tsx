import { ActiveVisitForSecurityModel, ActiveVisitModel } from '@/models'
import { useLayoutActions } from '@/provider/layout-actions-provider'
import { Card, Highlight, PageWrapper, Title } from '@/ui'
import { useMutation, useQuery } from '@tanstack/react-query'

import { VisitViewForm } from './components'
import { usePageTitle } from '@/pages/wrappers/simple-header-wrap/page-title-context'

type VisitViewProvider = {
  getVisit: (id: string) => Promise<ActiveVisitModel | ActiveVisitForSecurityModel>;
  acceptVisit: (data: { id: string }) => Promise<unknown>;
  rejectVisit: (data: { id: string; rejectionReason: string }) => Promise<unknown>;
};

type VisitViewSharedPageProps = {
  id: string;
  onBack: () => void;
  provider: VisitViewProvider;
};

export default function VisitViewSharedPage(props: VisitViewSharedPageProps) {
  const { id, onBack, provider } = props

  useLayoutActions({ backHandler: onBack })

  usePageTitle({
    initialTitle: (
      <Title>
        <Highlight>Заявка</Highlight> на вход
      </Title>
    ),
  })

  const { data } = useQuery({
    queryKey: ['visit-view', id],
    queryFn: () => provider.getVisit(id),
  })

  const { mutateAsync: acceptVisit } = useMutation({
    mutationFn: (visitId: string) => provider.acceptVisit({ id: visitId }),
    onSuccess: onBack,
  })

  const { mutateAsync: rejectVisit } = useMutation({
    mutationFn: (payload: { id: string; rejectionReason: string }) =>
      provider.rejectVisit(payload),
    onSuccess: onBack,
  })

  if (!data) {
    return null
  }

  const handleSubmit = () => {
    void acceptVisit(data.id)
  }

  const handleReject = (reason: string) => {
    void rejectVisit({ id: data.id, rejectionReason: reason })
  }

  return (
    <PageWrapper>
      <Card>
        <VisitViewForm
          data={data}
          onBack={onBack}
          onSubmit={handleSubmit}
          onReject={handleReject}
        />
      </Card>
    </PageWrapper>
  )
}