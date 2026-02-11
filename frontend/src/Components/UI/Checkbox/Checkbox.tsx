import { JSX, memo } from 'react';
import styles from './Styles.module.scss';
import cn from 'classnames';

interface CheckboxProps {
  onChange?: () => void;
  isActive?: boolean;
  label?: string;
}

function CheckboxComponent({ isActive, label, onChange }: CheckboxProps): JSX.Element {
  return (
    <div onClick={onChange} className={styles.container}>
      <div className={cn(styles.checkbox, isActive && styles.checkbox_active)} />
      <p className={cn(styles.container__label, isActive && styles.container__label_active)}>{label}</p>
    </div>
  );
}

export const Checkbox = memo(CheckboxComponent);
