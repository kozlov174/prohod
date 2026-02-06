import { setUnauthorizedHandler } from '@/provider/client'
import React, { useEffect } from 'react'
import { useNavigate } from 'react-router-dom'

import { nav } from '../..'

export function UnauthorizedWrap(props: React.PropsWithChildren) {
  const navigate = useNavigate()

  useEffect(() => {
    setUnauthorizedHandler(() => navigate(nav.index()))
    return () => {
      setUnauthorizedHandler(() => {})
    }
  }, [])

  return props.children
}
