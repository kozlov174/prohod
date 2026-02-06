import React from 'react'

import { LayoutActionsContext } from './layout-actions-provider'

type UseLayoutActionsProps = {
  actions?: React.ReactNode;
  backHandler?: () => void;
  resetOnUnmount?: boolean;
};

export function useLayoutActions(props: UseLayoutActionsProps = {}) {
  const { resetOnUnmount = true } = props
  const { setActions, setBackHandler, actions, backHandler } =
    React.useContext(LayoutActionsContext)

  React.useEffect(() => {
    setActions(props.actions)
    return () => {
      if (resetOnUnmount) setActions(undefined)
    }
  }, [])

  React.useEffect(() => {
    setBackHandler(() => props.backHandler)
    return () => {
      if (resetOnUnmount) setBackHandler(undefined)
    }
  }, [])

  return { actions, backHandler, setActions, setBackHandler }
}
