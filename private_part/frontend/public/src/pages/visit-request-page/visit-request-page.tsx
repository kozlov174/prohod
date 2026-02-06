import { nav } from '@/pages'
import { api } from '@/provider/api'
import {
  Button,
  Card,
  Container,
  Form,
  Highlight,
  Title,
} from '@/ui'
import { FormGroup } from '@/ui/form-group'
import { useMutation, useQuery } from '@tanstack/react-query'
import { useSnackbar } from 'notistack'
import { useCallback, useState } from 'react'
import { useNavigate } from 'react-router-dom'

import { PassportSection, SendCodeControl, VisitDetailsSection } from './components'
import * as S from './styled'
import { usePageTitle } from '../wrappers/simple-header-wrap/page-title-context'

type FormState = {
  passport: {
    fullName: string;
    series: string;
    number: string;
    whoIssued: string;
    issueDate: string;
    photo?: string;
  };
  visitTime: string;
  visitDate: string;
  visitReason: string;
  userToVisitId: string;
  emailToSendReply: string;
  personalDataAgreement: boolean;
};

export function VisitRequestPage() {
  const { enqueueSnackbar } = useSnackbar()
  const navigate = useNavigate()
  const [isCodeVerified, setIsCodeVerified] = useState(false)
  const [isPassportValid, setIsPassportValid] = useState(false)
  const [isVisitDetailsValid, setIsVisitDetailsValid] = useState(false)

  usePageTitle({
    initialTitle: (
      <Title>
        <Highlight>Заявка</Highlight> на вход
      </Title>
    ),
  })

  const { data: usersCollection = [] } = useQuery({
    queryKey: ['users'],
    queryFn: () => api.getUsers(),
  })

  const { mutateAsync: createVisit } = useMutation({
    mutationFn: (data: FormState) => {
      const issueDate = new Date(data.passport.issueDate).toISOString()

      const visitTimeDate = new Date(data.visitDate)
      const visitTimeTime = data.visitTime.split(':') as [string, string]
      visitTimeDate.setHours(parseInt(visitTimeTime[0]))
      visitTimeDate.setMinutes(parseInt(visitTimeTime[1]))
      const visitTimestamp = visitTimeDate.getTime()

      return api.createVisit({
        form: {
          user_to_visit_id: data.userToVisitId,
          passport_full_name: data.passport.fullName,
          passport_series: data.passport.series,
          passport_number: data.passport.number,
          passport_who_issued: data.passport.whoIssued,
          passport_issue_date: issueDate,
          passport_photo: data.passport.photo || '',
          visit_time: visitTimestamp,
          visit_reason: data.visitReason,
          email_to_send_reply: data.emailToSendReply,
        },
      })
    },
    onSuccess: () => {
      enqueueSnackbar('Заявка отправлена', { variant: 'success' })
      navigate(nav.index())
    },
    onError: () => {
      enqueueSnackbar('Произошла ошибка', { variant: 'error' })
    },
  })

  const [formState, setFormState] = useState<FormState>({
    passport: {
      fullName: '',
      series: '',
      number: '',
      whoIssued: '',
      issueDate: '',
    },
    visitTime: '',
    visitDate: '',
    visitReason: '',
    userToVisitId: '',
    emailToSendReply: '',
    personalDataAgreement: false,
  })

  const handlePassportChange = useCallback((passport: FormState['passport']) => {
    setFormState((prevState) => ({
      ...prevState,
      passport,
    }))
  }, [])

  const handleVisitDetailsChange = useCallback((details: Pick<FormState, 'visitTime' | 'visitDate' | 'visitReason' | 'userToVisitId'>) => {
    setFormState((prevState) => ({
      ...prevState,
      ...details,
    }))
  }, [])

  const handleFormChange = useCallback((
    prop: keyof FormState,
    value: FormState[keyof FormState]
  ) => {
    setFormState((prevState) => ({
      ...prevState,
      [prop]: value,
    }))
  }, [])

  const handleSend = useCallback(() => {
    if (!isPassportValid || !isVisitDetailsValid || !isCodeVerified || !formState.personalDataAgreement) {
      enqueueSnackbar('Пожалуйста, заполните все обязательные поля корректно', { variant: 'error' })
      return
    }
    createVisit(formState)
  }, [formState, isPassportValid, isVisitDetailsValid, isCodeVerified, createVisit, enqueueSnackbar])

  return (
    <S.Root>
      <Container>
        <Card>
          <Form
            style={{ gap: '16px', display: 'flex', flexDirection: 'column' }}
          >
            <FormGroup title="1. Заполните паспортные данные">
              <PassportSection
                data={formState.passport}
                onChange={handlePassportChange}
                onValidationChange={setIsPassportValid}
                onError={error => {
                  enqueueSnackbar(error, { variant: 'error' })
                }}
              />
            </FormGroup>

            <FormGroup title="2. Уточните детали визита">
              <VisitDetailsSection
                data={{
                  visitTime: formState.visitTime,
                  visitDate: formState.visitDate,
                  userToVisitId: formState.userToVisitId,
                  visitReason: formState.visitReason,
                }}
                onChange={handleVisitDetailsChange}
                usersCollection={usersCollection}
                onValidationChange={setIsVisitDetailsValid}
              />
            </FormGroup>

            <FormGroup title="3. Куда придет QR-код для посещения">
              <SendCodeControl
                email={formState.emailToSendReply}
                onEmailChange={(val) =>
                  handleFormChange('emailToSendReply', val)
                }
                onCodeSubmit={() => {
                  setIsCodeVerified(true)
                }}
              />
            </FormGroup>

            {isCodeVerified && (
              <S.Actions>
                <label style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                  <input
                    checked={formState.personalDataAgreement}
                    onChange={(e) => {
                      handleFormChange('personalDataAgreement', e.target.checked)
                    }}
                    type="checkbox"
                    required
                    className="anon-form-checkbox"
                  />
                  даю согласие на обработку персональных данных
\               </label>
                <Button
                  disabled={!isPassportValid || !isVisitDetailsValid || !formState.personalDataAgreement}
                  colorVariant="primary"
                  type="submit"
                  onClick={handleSend}
                >
                  РћС‚РїСЂР°РІРёС‚СЊ
                </Button>
              </S.Actions>
            )}
          </Form>
        </Card>
      </Container>
    </S.Root>
  )
}
