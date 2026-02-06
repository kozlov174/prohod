import { UserLayoutActionsWrap } from '@/pages'
import { Container } from '@/ui'
import React, { useState } from 'react'

type LayoutActionsContextData = {
  setActions: (actions: React.ReactNode | undefined) => void;
  actions?: React.ReactNode;
  setBackHandler: (handler: (() => void) | undefined) => void;
  backHandler?: () => void;
};

export const LayoutActionsContext =
  React.createContext<LayoutActionsContextData>({
    setActions: () => {},
    setBackHandler: () => {},
  })

export function LayoutActionsProvider(props: React.PropsWithChildren) {
  const [actions, setActions] = useState<React.ReactNode | undefined>()
  const [backHandler, setBackHandler] = useState<(() => void) | undefined>()

  return (
    <LayoutActionsContext.Provider
      value={{ actions, setActions, backHandler, setBackHandler }}
    >
      <Container>
        <UserLayoutActionsWrap>{props.children}</UserLayoutActionsWrap>
      </Container>
    </LayoutActionsContext.Provider>
  )
}
