import {
  FloatingFocusManager,
  FloatingOverlay,
  useClick,
  useDismiss,
  useFloating,
  useInteractions,
  useRole,
} from '@floating-ui/react'
import React from 'react'

import * as S from './styled'

export type BaseDialogRawProps = {
  open: boolean;
  onOpenChange: (isOpen: boolean) => void;
  title?: React.ReactNode;
  footer?: React.ReactNode;
};

export type BaseDialogProps = Omit<
  React.HTMLAttributes<HTMLDivElement>,
  keyof BaseDialogRawProps | 'onSubmit'
> &
  BaseDialogRawProps;

export function BaseDialog(props: BaseDialogProps) {
  const { open, onOpenChange, title, footer, ...rest } = props

  const { refs, context } = useFloating({
    open,
    onOpenChange,
  })

  const click = useClick(context)
  const dismiss = useDismiss(context, {
    outsidePressEvent: 'mousedown',
  })
  const role = useRole(context)

  // Merge all the interactions into prop getters
  const { getFloatingProps } = useInteractions([click, dismiss, role])

  if (!open) return null

  return (
    <FloatingOverlay
      lockScroll
      style={{
        background: 'rgba(0, 0, 0, 0.6)',
        zIndex: 10000,
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
      }}
    >
      <FloatingFocusManager context={context}>
        <S.Root {...rest} ref={refs.setFloating} {...getFloatingProps()}>
          {title && <S.Header>{title}</S.Header>}
          <S.Content>{props.children}</S.Content>
          {footer && <S.Footer>{footer}</S.Footer>}
        </S.Root>
      </FloatingFocusManager>
    </FloatingOverlay>
  )
}
