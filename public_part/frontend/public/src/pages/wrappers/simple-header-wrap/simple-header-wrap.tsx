import React, { useEffect, useState } from 'react'
import { useLocation, useNavigate } from 'react-router-dom'

import * as S from './styled'
import * as nav from '../../nav'

type SimpleHeaderWrapProps = React.PropsWithChildren<{
  title?: React.ReactNode;
}>;

export function SimpleHeaderWrap(props: SimpleHeaderWrapProps) {
  const { children, title } = props
  const [catPosition, setCatPosition] = useState(0)
  const { pathname } = useLocation()
  const navigate = useNavigate()

  const catRange = 20

  useEffect(() => {
    const rnd = Math.floor(Math.random() * catRange * 2)
    setCatPosition(-catRange + rnd)
  }, [pathname])

  return (
    <S.Root>
      <S.WrapHeader
        catPosition={catPosition}
        title={title}
        onLogoClick={() => navigate(nav.index())}
      />
      <S.Content>{children}</S.Content>
    </S.Root>
  )
}
