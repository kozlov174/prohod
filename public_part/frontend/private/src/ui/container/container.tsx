import React from 'react'

import * as S from './styled'

type ContainerProps = React.ComponentProps<typeof S.Root>;

export function Container(props: ContainerProps) {
  return <S.Root {...props} />
}
