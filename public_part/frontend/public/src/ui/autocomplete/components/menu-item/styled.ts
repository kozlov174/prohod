import styled from '@emotion/styled'

import { MenuItemBaseProps } from './types'

export const Root = styled.div<MenuItemBaseProps>`
  background: ${(props) => (props.active ? '#9a9fb6' : 'none')};
  padding: 4px;
  cursor: pointer;
`
