import { useVisitStatusTranslation } from '@/hooks'
import { ActiveVisitModel } from '@/models'
import { FormGroupControl } from '@/ui'
import { FormGroup } from '@/ui/form-group'

import * as S from './styled'

function dateTimeConverter(date: string) {
  return new Date(date).toLocaleDateString(navigator.language, {
    day: 'numeric',
    month: 'numeric',
    year: 'numeric',
    hour: 'numeric',
    minute: 'numeric',
  })
}

export type VisitFormProps = {
  data: ActiveVisitModel;
};

export function VisitForm(props: VisitFormProps) {
  const { data } = props

  const visitStatus = useVisitStatusTranslation({ visitStatus: data.status })

  return (
    <FormGroup title="Детали визита">
      <FormGroupControl label="Время посещения">
        <S.Field>{dateTimeConverter(data.form.visit_time)}</S.Field>
      </FormGroupControl>

      <FormGroupControl label="Причина">
        <S.Field>{data.form.visit_reason}</S.Field>
      </FormGroupControl>

      <FormGroupControl label="Статус">
        <S.Field>{visitStatus}</S.Field>
      </FormGroupControl>
    </FormGroup>
  )
}
