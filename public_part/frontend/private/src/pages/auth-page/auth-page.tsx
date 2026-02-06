import { useSnackbar } from 'notistack'
import { useState } from 'react'
import { useNavigate } from 'react-router-dom'

import * as nav from '../nav'
import * as S from './styled'
import { AuthModel, PersonRole } from '../../models'
import { api } from '../../provider/api'
import { Container, FormControl } from '../../ui'
import { Button } from '../../ui/button'
import { Card } from '../../ui/card'
import { TextField } from '../../ui/fields'
import { Form } from '../../ui/form'
import { Highlight, Title } from '../../ui/title'
import { removeToken, removeUser, setToken, setUser, setLogin } from '../../utils/auth'
import { usePageTitle } from '../wrappers/simple-header-wrap/page-title-context'

export function AuthPage() {
  const navigate = useNavigate()
  const { enqueueSnackbar } = useSnackbar()

  usePageTitle({
    initialTitle: (
      <Title>
        <Highlight>Вход</Highlight>
      </Title>
    ),
  })

  const [formData, setFormData] = useState<AuthModel>({
    login: '',
    password: '',
  })

  const handleFormChange = (
    prop: keyof AuthModel,
    value: AuthModel[keyof AuthModel]
  ) => {
    setFormData((prevState) => ({
      ...prevState,
      [prop]: value,
    }))
  }

  const handleSubmit = () => {
    api.login(formData).then(
      (res) => {
        setToken(res.data.jwtToken)
        setUser(res.data.user.id)
        setLogin(formData.login)
        switch (res.data.user.role) {
          case PersonRole.Admin:
            navigate(nav.visitsByAdmin())
            break
          case PersonRole.User:
            navigate(nav.visitsByUser())
            break
          case PersonRole.Security:
            navigate(nav.visitsBySecurity())
            break
          default:
            enqueueSnackbar('Произошла ошибка. Неверная роль', {
              variant: 'error',
            })
            throw new Error('Unknown role')
        }
      },
      (err) => {
        removeToken()
        removeUser()
        enqueueSnackbar('Неверный логин или пароль', { variant: 'error' })
        console.log(err)
      }
    )
  }

  const handleBack = () => navigate(nav.index())

  return (
    <S.Root>
      <Container>
        <Card style={{ flex: 1 }}>
          <Form onSubmit={handleSubmit}>
            <FormControl label="Логин" attention={!formData.login}>
              <TextField
                required
                type="text"
                value={formData.login}
                onChange={(e) => handleFormChange('login', e.target.value)}
                placeholder="Логин"
                autoComplete="username"
              />
            </FormControl>
            <FormControl label="Пароль" attention={!formData.password}>
              <TextField
                required
                type="password"
                value={formData.password}
                onChange={(e) => handleFormChange('password', e.target.value)}
                placeholder="Пароль"
                autoComplete="current-password"
              />
            </FormControl>

            <S.Actions>
              <Button
                colorVariant="secondary"
                type="button"
                onClick={handleBack}
              >
                На главную
              </Button>
              <Button type="submit">Войти</Button>
            </S.Actions>
          </Form>
        </Card>
      </Container>
    </S.Root>
  )
}

