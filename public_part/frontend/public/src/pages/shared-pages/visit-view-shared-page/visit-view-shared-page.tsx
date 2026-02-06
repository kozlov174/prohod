import { ActiveVisitForSecurityModel, ActiveVisitModel } from '@/models'
import { usePageTitle } from '@/pages/wrappers/simple-header-wrap/page-title-context'
import { useLayoutActions } from '@/provider/layout-actions-provider'
import { Card, Highlight, PageWrapper, Title } from '@/ui'
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import { useSnackbar } from 'notistack'

import { VisitViewForm } from './components'

type Provider = {
  acceptVisit: (data: { id: string }) => Promise<unknown>;
  rejectVisit: (data: {
    id: string;
    rejectionReason: string;
  }) => Promise<unknown>;
  getVisit: (
    id: string
  ) => Promise<ActiveVisitModel | ActiveVisitForSecurityModel | undefined>;
};

type VisitViewSharedPageProps = {
  provider: Provider;
  onBack: () => void;
  id: string;
};

export function VisitViewSharedPage(props: VisitViewSharedPageProps) {
  const { id, onBack, provider } = props

  usePageTitle({
    initialTitle: (
      <Title>
        <Highlight>Заявка</Highlight> на вход
      </Title>
    ),
  })

  const { enqueueSnackbar } = useSnackbar()

  const queryClient = useQueryClient()

  useLayoutActions({
    backHandler: onBack,
  })

  const { mutateAsync: acceptVisit } = useMutation({
    mutationFn: (data: { id: string }) => provider.acceptVisit(data),
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: ['visit', id],
      })
      enqueueSnackbar('Заявка принята', { variant: 'success' })
    },
  })

  const { mutateAsync: rejectVisit } = useMutation({
    mutationFn: (data: { id: string; rejectionReason: string }) =>
      provider.rejectVisit(data),
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: ['visit', id],
      })
      enqueueSnackbar('Заявка отклонена', { variant: 'warning' })
    },
  })

  const { data, isLoading } = useQuery({
    queryKey: ['visit', id],
    queryFn: () => provider.getVisit(id),
    refetchOnWindowFocus: false,
  })

  if (isLoading || !data) return <div>Загрузка...</div>

  return (
    <PageWrapper>
      <Card>
        <VisitViewForm
          data={data}
          onSubmit={() =>
            acceptVisit({
              id: data.id,
            })
          }
          onReject={(reason) =>
            rejectVisit({
              id: data.id,
              rejectionReason: reason,
            })
          }
          onBack={onBack}
        />
      </Card>
    </PageWrapper>
  )
}
