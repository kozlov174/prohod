import { useId } from '@floating-ui/react'
import React from 'react'

import * as S from './styled'
import { MenuItemProps } from './types'

function MenuItemForwarded(
  props: MenuItemProps,
  ref: React.ForwardedRef<HTMLDivElement>
) {
  const { active, children, ...rest } = props
  const id = useId()

  return (
    <S.Root
      ref={ref}
      role="option"
      id={id}
      aria-selected={active}
      active={active}
      {...rest}
    >
      {children}
    </S.Root>
  )
}

export const MenuItem = React.forwardRef(MenuItemForwarded)
