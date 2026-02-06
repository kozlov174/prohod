import React from 'react'

import * as S from './styled'

export type IconButtonProps = React.HtmlHTMLAttributes<HTMLDivElement>;

function IconButtonForwarded(
  props: IconButtonProps,
  ref: React.ForwardedRef<HTMLDivElement>
) {
  const { ...rest } = props
  return <S.Root {...rest} ref={ref} />
}

export const IconButton = React.forwardRef(IconButtonForwarded)
