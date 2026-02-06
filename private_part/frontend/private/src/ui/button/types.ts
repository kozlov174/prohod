import React from 'react'

export type ButtonColorVariant =
  | 'primary'
  | 'secondary'
  | 'danger'
  | 'warning'
  | 'text';

export type ButtonSize = 'small' | 'medium' | 'large';

export type ButtonProps = React.ButtonHTMLAttributes<HTMLButtonElement> & {
  colorVariant?: ButtonColorVariant;
  size?: ButtonSize;
};
