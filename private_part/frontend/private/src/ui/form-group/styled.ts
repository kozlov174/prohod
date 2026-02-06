import styled from '@emotion/styled'

import { FormControl } from '../form-control'
import { FormGroupDirection } from './types'

const getStyle = (props: { direction: FormGroupDirection }) => {
  switch (props.direction) {
    case 'column':
      return `
        flex-direction: column;
      `
    case 'row':
      return `
        flex-direction: row;
      `
    default:
      return `
        flex-direction: column;
      `
  }
}

export const Root = styled.div`
  display: flex;
  flex-direction: column;
  gap: 8px;
  color: white;

  & + & {
    margin-top: 16px;
  }
`

export const Title = styled.div`
  color: white;
`

export const Content = styled.div<{ direction: FormGroupDirection }>`
  display: flex;
  flex-direction: column;
  gap: 8px;
  padding: 16px;
  border: 1px solid #9a9fb6;
  border-radius: 8px;
  ${getStyle};
`

export const FormGroupControl = styled(FormControl)`
  flex: 1;
`

export const GroupRow = styled.div`
  display: flex;
  flex-direction: row;
  gap: 8px;
`
