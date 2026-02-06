import React, { PropsWithChildren } from 'react'

import * as S from './styled'

type FormControlProps = {
  label?: string;
  attention?: boolean;
} & React.HTMLAttributes<HTMLDivElement>;

export function FormControl(props: PropsWithChildren<FormControlProps>) {
  const { label, children, attention, ...rest } = props
  return (
    <S.Root {...rest}>
      <S.Label>
        {label} {attention && <S.AttentionMark />}
      </S.Label>
      <div>{children}</div>
    </S.Root>
  )
}
