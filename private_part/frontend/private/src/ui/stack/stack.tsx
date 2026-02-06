import styled from '@emotion/styled'
import React, { CSSProperties } from 'react'

// Типы для пропсов
type StackProps = {
  as?: keyof React.JSX.IntrinsicElements;
  direction?: CSSProperties['flexDirection'];
  gap?: number; // Число, которое будет преобразовано в пиксели
  rowGap?: number; // Отступы между строками (для row)
  columnGap?: number; // Отступы между столбцами (для column)
  alignItems?: CSSProperties['alignItems']; // Выравнивание по краям
  justifyContent?: CSSProperties['justifyContent'];
  wrap?: boolean; // Перенос элементов
};

type StyledStackProps = Omit<StackProps, 'wrap'> & {
  $wrap: boolean;
};

// Создание стилизованного компонента
const StyledStack = styled.div<StyledStackProps>`
  display: flex;
  flex-direction: ${(props) => props.direction || 'column'};
  gap: ${(props) => (props.gap ? `${props.gap}px` : undefined)}; /* Общий gap */
  row-gap: ${(props) =>
    props.rowGap ? `${props.rowGap}px` : undefined}; /* Row gap */
  column-gap: ${(props) =>
    props.columnGap ? `${props.columnGap}px` : undefined}; /* Column gap */
  align-items: ${(props) =>
    props.alignItems || 'stretch'}; /* Выравнивание по краям */
  justify-content: ${(props) =>
    props.justifyContent || 'flex-start'}; /* Выравнивание контента */
  flex-wrap: ${(props) =>
    props.$wrap ? 'wrap' : 'nowrap'}; /* Перенос элементов */
`

// Компонент Stack
export const Stack: React.FC<React.PropsWithChildren<StackProps>> = ({
  as = 'div',
  direction = 'column',
  alignItems = 'stretch',
  justifyContent = 'flex-start',
  wrap = false,
  ...rest
}) => {
  return (
    <StyledStack
      as={as}
      direction={direction}
      alignItems={alignItems}
      justifyContent={justifyContent}
      $wrap={wrap}
      {...rest}
    />
  )
}
