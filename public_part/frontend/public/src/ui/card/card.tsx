import React from 'react'

import * as S from './styled'

type CardProps = React.ComponentProps<typeof S.Root>;

export function Card(props: CardProps) {
  const { ...rest } = props
  return <S.Root {...rest} />
}
