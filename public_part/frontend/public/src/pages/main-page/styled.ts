import styled from '@emotion/styled'

export const Root = styled.div`
  padding: 54px;
`

export const IntroForm = styled.div`
  display: flex;
  flex-direction: column;
  color: white;
`

export const Logo = styled.img`
  height: 24px;
`

export const HeaderContainer = styled.div`
  border-bottom: 2px white solid;
`

export const Header = styled.div`
  border: 2px white solid;
  border-radius: 32px 32px 0 0;
  border-bottom: none;
  padding: 32px 32px 24px 32px;
  margin: 0 32px;
`

export const Body = styled.div`
  border: 2px white solid;
  border-radius: 32px;
  border-top: none;
  border-radius: 0 0 32px 32px;
  margin: 0 32px;
  padding: 32px 32px 24px 32px;
`

export const Title = styled.div`
  font-family: Gilroy;
  font-size: 40px;
  margin-bottom: 16px;
`

export const TitleMark = styled.span`
  color: #6bc8f4;
`

export const Description = styled.div`
  font-family: Gilroy;
  font-size: 24px;
`

export const ButtonsWrapper = styled.div`
  display: flex;
  gap: 16px;
  margin-top: 32px;
`

export const EnterButton = styled.button`
  font-size: 16px;
  background-color: #6bc8f4;
  color: white;
  width: 270px;
  height: 55px;
  border-radius: 35px;
  border: #6bc8f4 solid;
  cursor: pointer;
`

export const AuthButton = styled.button`
  font-size: 16px;
  background-color: transparent;
  color: #6bc8f4;
  width: 270px;
  height: 55px;
  border-radius: 35px;
  border: #6bc8f4 solid;
  cursor: pointer;
`

export const ActionsContainer = styled.div`
  display: flex;
  align-items: flex-end;
`

export const AboutContainer = styled.div`
  font-size: 24px;
  text-align: right;
`

export const AboutMark = styled.span`
  color: #6bc8f4;
`