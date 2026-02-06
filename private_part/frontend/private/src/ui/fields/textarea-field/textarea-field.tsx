import React from 'react'

import * as S from './styled'

export type TextareaFieldProps = React.ComponentProps<typeof S.Textarea>;

function TextareaFieldForwarded(
  props: TextareaFieldProps,
  ref: React.ForwardedRef<HTMLTextAreaElement>
) {
  return <S.Textarea {...props} ref={ref} />
}

export const TextareaField = React.forwardRef(TextareaFieldForwarded)
