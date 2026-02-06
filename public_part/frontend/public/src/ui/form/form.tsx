import React, { PropsWithChildren } from 'react'

import * as S from './styled'

type FormProps = React.ComponentProps<typeof S.Root>;

export function Form(props: PropsWithChildren<FormProps>) {
  const { children, onSubmit, ...rest } = props
  return (
    <S.Root
      {...rest}
      onSubmit={(e) => {
        e.preventDefault()
        onSubmit?.(e)
      }}
    >
      {children}
    </S.Root>
  )
}
