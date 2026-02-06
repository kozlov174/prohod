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
              <S.Logo src={logo} />
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
              Сервис создан для избавления гостей от бумажной работы <br />и
              постоянных согласований, достаточно заполнить заявку на сайте{' '}
              <br />
              и ожидать одобрения в виде QR-кода на указанную почту. <br />
              Пожалуйста, заполните все поля согласно инструкциям на сайте.
            </S.Description>

            <S.ActionsContainer>
              <S.ButtonsWrapper>
                <S.EnterButton onClick={handleEnter}>
                  Пройти в ИРИТ-РтФ
                </S.EnterButton>
                <S.AuthButton onClick={handleAuth}>
                  Авторизация
                </S.AuthButton>
              </S.ButtonsWrapper>
              <Ladder style={{ marginLeft: '5px' }} />
            </S.ActionsContainer>
          </S.Body>
        </S.IntroForm>
      </S.Root>
    </Container>
  )
}