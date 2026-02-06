import { UserWithActions } from '@/components/user-with-actions/user-with-actions'
import { nav } from '@/pages'
import { LayoutActionsContext } from '@/provider/layout-actions-provider/layout-actions-provider'
import { useUser } from '@/provider/user-provider'
import React from 'react'
import { useNavigate } from 'react-router-dom'

import * as S from './styled'

export function UserLayoutActionsWrap(props: React.PropsWithChildren) {
  const { user, logout } = useUser()
  const { actions, backHandler } = React.useContext(LayoutActionsContext)

  const navigate = useNavigate()

  return (
    <S.Root gap={24}>
      <UserWithActions
        user={user}
        onLogout={() => {
          logout()
          navigate(nav.index())
        }}
        onBack={backHandler}
      >
        {actions}
      </UserWithActions>
      {props.children}
    </S.Root>
  )
}
