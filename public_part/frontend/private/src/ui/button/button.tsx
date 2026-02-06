import React from 'react'

import * as S from './styled'
import { ButtonProps } from './types'

function ButtonForwarded(
  props: ButtonProps,
  ref: React.ForwardedRef<HTMLButtonElement>
) {
  const { colorVariant = 'primary', ...rest } = props
  return <S.Root {...rest} colorVariant={colorVariant} ref={ref} />
}

export const Button = React.forwardRef(ButtonForwarded)
