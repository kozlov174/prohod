import { JSX, memo, useEffect, useRef, useState } from 'react';
import styles from './Styles.module.scss';
import { Icon } from '../Icon';
import cn from 'classnames';

type InputProps = (
  | {
      type: 'number';
      onChange: (value: number) => void;
      value: number;
    }
  | {
      type: 'text' | 'search' | 'date' | 'time' | 'password';
      value: string;
      onChange: (value: string) => void;
    }
) & {
  placeholder?: string;
  className?: string;
  label?: string;
  pseudoContent?: string;
  name?: string;
  disabled?: boolean;
  error?: string;
};

function InputComponent({
  type,
  value,
  placeholder,
  onChange,
  className,
  label,
  pseudoContent,
  disabled,
  name,
  error,
}: InputProps): JSX.Element {
  const [displayPassword, setDisplayPassword] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);
  const changeValue = (value: string) => {
    if (type === 'number') {
      onChange(Number(value));
    } else {
      onChange(value);
    }
  };

  useEffect(() => {
    const handleWheel = (e: WheelEvent) => {
      inputRef.current?.blur();
      e.stopPropagation();
    };

    const input = inputRef.current;
    if (input && type === 'number') {
      input.addEventListener('wheel', handleWheel);
      return () => {
        input.removeEventListener('wheel', handleWheel);
      };
    }
  }, [type]);

  return (
    <div>
      {(label || disabled) && <p className={styles.input__label}>{label ? label : placeholder}</p>}
      <div
        style={pseudoContent ? ({ '--pseudoContent': `"${pseudoContent}"` } as React.CSSProperties) : {}}
        className={cn(styles.input, className, error && styles.input_error, type === 'number' && styles.input_number)}
      >
        {type === 'search' && <Icon className={styles.input__search} glyph="search" size={20} glyphColor="blue" />}
        <input
          disabled={disabled}
          ref={inputRef}
          name={name}
          placeholder={placeholder}
          className={cn(styles.input__input)}
          type={type === 'password' ? (displayPassword ? 'text' : 'password') : type}
          value={type === 'number' && value === 0 ? '' : value}
          onChange={e => changeValue(e.target.value)}
        />
        {type === 'password' && (
          <Icon
            pointer
            onClick={() => setDisplayPassword(!displayPassword)}
            className={styles.input__eye}
            glyph={!displayPassword ? 'eyeClose' : 'eye'}
            size={24}
            glyphColor="grey"
          />
        )}
      </div>
      {error && <p className={styles.input__error}>{error}</p>}
    </div>
  );
}

export const Input = memo(InputComponent);
