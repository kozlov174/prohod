import React from 'react'

import * as S from './styled'

type SelectFieldProps = React.ComponentProps<typeof S.Select>;

export function SelectField(props: SelectFieldProps) {
  return (
    <S.Root>
      <S.Select {...props} />
      <S.Arrow />
    </S.Root>
  )
}
