import { nav } from '@/pages'
import { VisitViewSharedPage } from '@/pages/shared-pages'
import { api } from '@/provider/api'
import { useNavigate, useParams } from 'react-router-dom'

export function ReportPage() {
  const navigate = useNavigate()

  const { id } = useParams<{ id: string }>()
  const handleBack = () => navigate(nav.adminReports())

  if (!id) {
    handleBack()
    return null
  }

  return (
    <VisitViewSharedPage
      id={id}
      onBack={handleBack}
      provider={{
        acceptVisit: api.acceptVisitBySecurity,
        getVisit: (data) =>
          api.getVisitBySecurity(data).then((res) => res.data),
        rejectVisit: api.rejectVisitBySecurity,
      }}
    />
  )
}
