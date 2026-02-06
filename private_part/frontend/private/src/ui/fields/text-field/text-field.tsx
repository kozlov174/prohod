import React from 'react'

import * as S from './styled'

export type TextFieldProps = React.ComponentProps<typeof S.Input>;

function TextFieldForwarded(
  props: TextFieldProps,
  ref: React.ForwardedRef<HTMLInputElement>
) {
  return <S.Input {...props} ref={ref} />
}

export const TextField = React.forwardRef(TextFieldForwarded)
