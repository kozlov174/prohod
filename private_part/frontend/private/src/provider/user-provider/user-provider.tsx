import { useQuery, useQueryClient } from '@tanstack/react-query'
import React from 'react'

import { UserModel } from '../../models'
import { api } from '../../provider/api'

type UserContextData = {
  user: UserModel | null;
  clearUser: () => void;
};

export const UserContext = React.createContext<UserContextData>({
  clearUser: () => {},
  user: null,
})

export function UserProvider(props: React.PropsWithChildren) {
  const queryClient = useQueryClient()
  const { data: user = null } = useQuery({
    queryKey: ['user'],
    queryFn: () => api.getMyself().then((r) => r.data),
    retry: false,
  })

  const clearUser = () => {
    queryClient.setQueryData(['user'], () => null)
  }

  if (!user) return

  return (
    <UserContext.Provider value={{ clearUser, user }}>
      {props.children}
    </UserContext.Provider>
  )
}
