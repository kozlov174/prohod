import React, { useEffect, useRef, useState } from 'react'

import * as S from './styled'
import logo from '/images/logo.svg'
import cat from '/images/cat-w.svg'
import { CatProps } from './types'

type HeaderPropsBase = {
  catPosition?: number;
  title?: React.ReactNode;
  onLogoClick?: () => void;
};

type HeaderProps = Omit<
  React.HtmlHTMLAttributes<HTMLDivElement>,
  keyof HeaderPropsBase
> &
  HeaderPropsBase;

export function Header(props: HeaderProps) {
  const { catPosition = 0, title, onLogoClick, ...rest } = props

  const logoRef = useRef<HTMLImageElement>(null)
  const [logoWidth, setLogoWidth] = useState(0)

  const [catProps, setCatProps] = useState<CatProps>({
    catPosition,
    isFlipped: false,
  })

  useEffect(() => {
    if (catProps.catPosition === catPosition) return

    setCatProps({
      catPosition,
      isFlipped: catProps.catPosition < catPosition,
    })
  }, [catPosition, catProps])

  useEffect(() => {
    handleSetLogoWidth(logoRef.current)
  }, [title])

  const handleSetLogoWidth = (element?: HTMLImageElement | null) => {
    if (element && title && logoWidth !== element.clientWidth) {
      setLogoWidth(element.clientWidth)
    }
  }

  return (
    <S.Header {...rest}>
      <S.Logo
        src={logo}
        alt="logo"
        ref={logoRef}
        onLoad={() => handleSetLogoWidth(logoRef.current)}
        onClick={onLogoClick}
      />
      {title && (
        <>
          <S.TitleContainer>{title}</S.TitleContainer>
          <div style={{ width: logoWidth }} />
        </>
      )}
      <S.Cat {...catProps} src={cat} alt="cat" />
    </S.Header>
  )
}
