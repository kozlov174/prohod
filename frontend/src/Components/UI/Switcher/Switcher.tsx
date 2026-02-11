import { JSX, memo } from 'react';
import styles from './Styles.module.scss';
import cn from 'classnames';

interface SwitcherProps {
  onChange: (value: boolean) => void;
  isActive?: boolean;
  label?: string;
  name?: string;
}

function SwitcherComponent({ onChange, isActive, label, name }: SwitcherProps): JSX.Element {
  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    onChange(e.target.checked);
  };

  return (
    <label className={styles.container}>
      <input name={name} checked={isActive} onChange={handleChange} type="checkbox" style={{ display: 'none' }} />
      <div className={cn(styles.switcher, isActive && styles.switcher_active)}>
        <div className={cn(styles.switcher__circle, isActive && styles.switcher__circle_active)}></div>
      </div>
      {label && <p className={styles.container__label}>{label}</p>}
    </label>
  );
}

export const Switcher = memo(SwitcherComponent);
