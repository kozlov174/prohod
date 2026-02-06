import { Container } from '@/ui'
import { useNavigate } from 'react-router-dom'

import { Ladder } from './components'
import * as S from './styled'
import logo from '../../assets/images/logo.svg'
import * as nav from '../nav'

export function Main() {
  const navigate = useNavigate()

  const handleEnter = () => {
    navigate(nav.form())
  }

  const handleAuth = () => {
    navigate(nav.auth())
  }

  return (
    <Container>
      <S.Root>
        <S.IntroForm>
          <S.HeaderContainer>
            <S.Header>
              <S.Logo  src={logo}></S.Logo>
            </S.Header>
          </S.HeaderContainer>
          <S.Body>
            <S.AboutContainer>
              о нашем <S.AboutMark>сервисе</S.AboutMark>
            </S.AboutContainer>
            <S.Title>
              Добро пожаловать <br /> на платформу{' '}
              <S.TitleMark>Про</S.TitleMark>
              Ход
            </S.Title>
            <S.Description>
              Панель управления процессом согласования разовых пропусков. Мониторинг статусов, верификация данных и управление доступом.
            </S.Description>

            <S.ActionsContainer>
              <S.EnterButton onClick={handleAuth}>
                Войти в систему
              </S.EnterButton>
              <Ladder style={{ transform: 'translateY(24px)' }} />
            </S.ActionsContainer>
          </S.Body>
        </S.IntroForm>
      </S.Root>
    </Container>
  )
}

