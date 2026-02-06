import styled from '@emotion/styled'

import { Button } from '../button'
import { TextField } from '../fields'

export const Root = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  flex-wrap: wrap;
  gap: 16px;
`

export const IconButton = styled(Button)`
  border-radius: 50%;
  padding: 4px;
  width: 32px;
  height: 32px;
  display: flex;
  align-items: center;
  justify-content: center;
`

export const Actions = styled.div`
  display: flex;
  gap: 8px;
  align-items: center;
`

export const AdditionalActions = styled.div`
  display: flex;
  gap: 8px;
  align-items: center;
  flex-wrap: wrap;
`

export const PageInfo = styled.div`
  white-space: nowrap;
`

export const GoToMessage = styled.div`
  white-space: nowrap;
`

export const GoToInput = styled(TextField)`
  width: 48px;
  padding: 8px;
  height: 32px;
  border-radius: 8px;
`

export const GoToContainer = styled.div`
  display: flex;
  align-items: center;
  gap: 8px;
`
