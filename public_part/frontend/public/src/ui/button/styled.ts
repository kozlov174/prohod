import styled from '@emotion/styled'

import { ButtonProps } from './types'

const getColorStyles = (props: ButtonProps) => {
  const { colorVariant: variant, disabled } = props

  if (disabled) {
    return `
        cursor: not-allowed;
        color: #B7BACB;
    `
  }

  const getBaseStyle = (color: string) => {
    return `
    cursor: pointer;
    background-color: ${color};
    color: white;
        &:hover {
            border-color: ${color};
            background-color: transparent;
        }
        &:focus,
        &:focus-visible {
            outline: 4px auto -webkit-focus-ring-color;
        }

`
  }

  switch (variant) {
    case 'primary':
      return getBaseStyle('#6bc8f4')
    case 'secondary':
      return getBaseStyle('#b7bacb')
    case 'warning':
      return getBaseStyle('#f5a623')
    case 'danger':
      return getBaseStyle('#e53935')
    case 'text':
      return getBaseStyle('transparent')
    default:
      return getBaseStyle('#747a9b')
  }
}

const getSizeStyles = (props: ButtonProps) => {
  const { size } = props
  switch (size) {
    case 'small':
      return `
                padding: 4px 8px;
            `
    case 'medium':
      return `
                padding: 8px 16px;
            `
    case 'large':
      return `
                padding: 12px 24px;
            `
  }
}

export const Root = styled.button<ButtonProps>`
  border: 2px transparent solid;
  font-size: 20px;
  padding: 8px 16px;
  border-radius: 32px;
  text-align: center;

  ${getColorStyles}
  ${getSizeStyles}
`
