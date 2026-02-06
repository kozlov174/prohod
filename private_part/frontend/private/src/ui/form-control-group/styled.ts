import styled from '@emotion/styled'

import { FormControlGroupDirection } from './types'
import { FormControl } from '../form-control'

const getStyle = (props: { direction: FormControlGroupDirection }) => {
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

export const FormGroupControl = styled(FormControl)`
  flex: 1;
`

export const Root = styled.div<{ direction: FormControlGroupDirection }>`
  display: flex;
  flex-wrap: wrap;
  color: white;
  gap: 16px;
  ${getStyle};
`
