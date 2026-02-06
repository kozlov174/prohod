import { PropsWithChildren } from 'react'

import * as S from './styled'
import { FormControlGroupDirection } from './types'

type FormControlGroupProps = PropsWithChildren<{
  direction?: FormControlGroupDirection;
}>;

export function FormControlGroup(props: FormControlGroupProps) {
  const { direction = 'row' } = props

  return <S.Root direction={direction}>{props.children}</S.Root>
}
