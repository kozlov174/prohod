import {
  ActiveVisitForSecurityModel,
  ActiveVisitModel,
  VisitStatus,
  isActiveVisitForSecurityModel,
} from '@/models'
import { Button, Form, FormGroupControl, TextField } from '@/ui'
import { useState } from 'react'

import { PassportView, VisitForm } from './components'
import * as S from './styled'

type VisitViewFormProps = {
  data: ActiveVisitModel | ActiveVisitForSecurityModel;
  onSubmit: () => void;
  onReject: (reason: string) => void;
  onBack: () => void;
};

export function VisitViewForm(props: VisitViewFormProps) {
  const { data, onSubmit, onReject, onBack } = props

  const [isRejectMode, setIsRejectMode] = useState(false)
  const [rejectReason, setRejectReason] = useState('')

  const hasActions = data.status === VisitStatus.NotProcessed

  if (isRejectMode) {
    return (
      <Form>
        <FormGroupControl
          attention={rejectReason.length === 0}
          label="Причина отклонения посетителя"
        >
          <TextField
            value={rejectReason}
            onChange={(e) => {
              const trimmedValue = e.target.value.trimStart()
              setRejectReason(trimmedValue)
            }}
          />
        </FormGroupControl>
        <S.ActionsContainer>
          <Button
            size="large"
            colorVariant="secondary"
            onClick={() => {
              setIsRejectMode(false)
            }}
          >
            Назад
          </Button>
          <S.SubmitActions>
            <Button
              size="large"
              colorVariant="warning"
              disabled={rejectReason.length === 0}
              onClick={() => {
                onReject(rejectReason)
                setIsRejectMode(false)
              }}
            >
              Отклонить
            </Button>
          </S.SubmitActions>
        </S.ActionsContainer>
      </Form>
    )
  }

  return (
    <Form>
      {isActiveVisitForSecurityModel(data) && <PassportView data={data.form} />}
      <VisitForm data={data} />

      <S.ActionsContainer>
        <Button size="large" colorVariant="secondary" onClick={onBack}>
          Назад
        </Button>
        {hasActions && (
          <S.SubmitActions>
            <Button
              size="large"
              colorVariant="warning"
              onClick={() => {
                setIsRejectMode(true)
              }}
            >
              Отклонить
            </Button>
            <Button type="submit" size="large" onClick={onSubmit}>
              Принять
            </Button>
          </S.SubmitActions>
        )}
      </S.ActionsContainer>
    </Form>
  )
}
