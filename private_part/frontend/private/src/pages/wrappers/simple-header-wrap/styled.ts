import styled from '@emotion/styled'

import { Header } from '../../../ui/header/header'

export const Root = styled.div`
  display: flex;
  flex-direction: column;
  height: 100%;
  display: flex;
  flex-direction: column;
`

export const WrapHeader = styled(Header)`
  margin: 0 24px;
`

export const Content = styled.div`
  flex: 1;
`
