import { removeToken, removeUser, removeUserLogin } from '@/utils/auth'
import React from 'react'

import { UserContext } from './user-provider'

export function useUser() {
  const { user, clearUser } = React.useContext(UserContext)

  if (!user) throw new Error('User not found')

  return {
    user,
    logout: () => {
      removeToken()
      removeUser()
      removeUserLogin()
      clearUser()
    },
  }
}
