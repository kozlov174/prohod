import React from 'react'

import * as S from './styled'
import catblue from '../../../../assets/images/cat-b.svg'

type LadderProps = React.HTMLAttributes<HTMLDivElement>;

export function Ladder(props: LadderProps) {
  return (
    <S.Root {...props}>
      <S.FirstStep>
        <S.Bridge isCorner />
      </S.FirstStep>
      <S.SecondStep>
        <S.Bridge />
        <S.Bridge isCorner />
        <S.Kitty alt="cat" src={catblue} />
      </S.SecondStep>
    </S.Root>
  )
}
