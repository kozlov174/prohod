import styled from '@emotion/styled'

import { CatProps } from './types'

export const Header = styled.div`
  border-bottom: 2px white solid;
  padding: 24px;
  display: flex;
  position: relative;
  flex-wrap: wrap;
  gap: 8px;
`

export const Logo = styled.img`
  height: 24px;
  width: 120px;
`

export const Cat = styled.img<CatProps>`
  height: 24px;
  position: absolute;

  bottom: 0;
  right: ${(props) => props.catPosition + 24}px;

  transition: transform 300ms, right 2s;
  transform: scaleX(${(props) => (props.isFlipped ? '-1' : '1')});
`

export const TitleContainer = styled.div`
  display: flex;
  align-items: center;
  flex: 1;
  text-align: center;
  display: flex;
  align-items: center;
  justify-content: center;
  white-space: nowrap;
`
