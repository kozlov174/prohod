import React, { PropsWithChildren } from 'react'

import * as S from './styled'
import { FormGroupDirection } from './types'

type FormGroupProps = {
  title: string;
  direction?: FormGroupDirection;
} & React.HtmlHTMLAttributes<HTMLDivElement>;

export function FormGroup(props: PropsWithChildren<FormGroupProps>) {
  const { title, children, direction = 'column', ...rest } = props
  return (
    <S.Root {...rest}>
      <S.Title>{title}</S.Title>
      <S.Content direction={direction}>{children}</S.Content>
    </S.Root>
  )
}
