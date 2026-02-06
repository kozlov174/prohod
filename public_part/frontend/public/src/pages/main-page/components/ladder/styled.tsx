import styled from '@emotion/styled'

export const Root = styled.div``

export const Bridge = styled.div<{ isCorner?: boolean }>`
  width: 50px;
  height: 50px;

  ${({ isCorner }) =>
    isCorner &&
    `   border-right: 2px #6bc8f4 solid;
        border-top: 2px #6bc8f4 solid;
    `}
`

export const FirstStep = styled.div`
  margin-bottom: -2px;
`

export const SecondStep = styled.div`
  display: flex;
  position: relative;
`

export const Kitty = styled.img`
  position: absolute;
  right: 16px;
  bottom: -15%;

  height: 70%;
`
