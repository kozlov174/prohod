import { JSX, memo } from 'react';
import styles from './Styles.module.scss';

interface ButtonProps {
  size?: 'm' | 'l' | 's' | 'ss' | 'min';
  fullWidth?: boolean;
  color?: 'red' | 'blue' | 'secondary';
  children?: React.ReactNode;
  onClick?: () => void;
  type?: 'button' | 'submit' | 'reset';
  radius?: number;
  disabled?: boolean;
}

function ButtonComponent({
  size = 'l',
  color = 'blue',
  children,
  fullWidth,
  disabled,
  onClick,
  type = 'button',
  radius,
}: ButtonProps): JSX.Element {
  return (
    <button
      style={{ borderRadius: radius ? `${radius}px` : '' }}
      onClick={disabled ? undefined : onClick}
      type={type}
      className={`${styles.button} ${disabled && styles.button_disabled} ${styles[`button_${color}`]} ${styles[`button_${size}`]} ${fullWidth && styles.button_fullWidth}`}
    >
      {children}
    </button>
  );
}

export const Button = memo(ButtonComponent);
