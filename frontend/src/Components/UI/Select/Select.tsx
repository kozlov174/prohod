import { JSX, memo, useEffect, useRef, useState } from 'react';
import cn from 'classnames';
import styles from './Styles.module.scss';
import { Icon } from '../Icon';
import { Checkbox } from '../Checkbox';
import { ListValue } from './types';

type SelectProps = (
  | {
      type: 'single';
      selectedValue: ListValue | null;
      onChange: (newValue: ListValue) => void;
    }
  | {
      type: 'multiply';
      selectedValue: ListValue[] | null;
      onChange: (newList: ListValue[]) => void;
    }
) & {
  placeholder?: string;
  list: ListValue[];
  disabled?: boolean;
  direction?: 'up' | 'down';
  disableBorders?: boolean;
  label?: string;
  width?: number;
  error?: string;
};

function SelectComponent({
  type,
  selectedValue,
  onChange,
  placeholder = 'Выберите значение',
  list,
  direction = 'down',
  disableBorders = false,
  disabled,
  label,
  width,
  error,
}: SelectProps): JSX.Element {
  const [isDisplayFull, setIsDisplayFull] = useState(false);
  const [searchValue, setSearchValue] = useState('');
  const inputRef = useRef<HTMLInputElement>(null);

  const onSelectValue = (value: ListValue) => {
    if (type === 'single') {
      onChange(value);
      setIsDisplayFull(false);
      setSearchValue('');
      return;
    }
    if (!selectedValue) {
      onChange([value]);
      return;
    }
    if (selectedValue.find(el => el.id === value.id)) {
      onChange(selectedValue.filter(el => el.id !== value.id));
    } else {
      onChange([...selectedValue, value]);
    }
  };

  const onSelectAll = () => {
    if (type !== 'multiply') return;
    if (selectedValue?.length === list.length) {
      onChange([]);
    } else {
      onChange(list);
    }
  };

  const handleClick = () => {
    setIsDisplayFull(!isDisplayFull);

    if (inputRef.current) {
      if (!isDisplayFull) {
        inputRef.current.focus();
      } else {
        inputRef.current.blur();
      }
    }
  };

  useEffect(() => {
    if (inputRef.current) {
      const span = document.createElement('span');
      span.style.font = window.getComputedStyle(inputRef.current).font;
      span.style.visibility = 'hidden';
      span.style.position = 'absolute';
      span.style.whiteSpace = 'pre';
      span.textContent = searchValue || inputRef.current.placeholder || '';

      document.body.appendChild(span);
      const width = span.offsetWidth;
      document.body.removeChild(span);

      inputRef.current.style.width = `${width + 20}px`;
    }
  }, [inputRef, searchValue]);

  return (
    <div className={styles.container}>
      {(label || disabled) && <p className={styles.container__label}>{label ? label : placeholder}</p>}
      <div
        style={width ? { width: `${width}px` } : {}}
        className={cn(styles.select, isDisplayFull && styles.select_full, disableBorders && styles.select_noBorder)}
      >
        <div
          onClick={disabled ? undefined : handleClick}
          className={cn(
            styles.select__titleBlock,
            disableBorders && styles.select__titleBlock_noBorder,
            isDisplayFull && styles.select__titleBlock_full,
            disabled && styles.select__titleBlock_disabled,
            error && styles.select__titleBlock_error
          )}
        >
          <div className={cn(styles.select__selectedblock)}>
            {type === 'single' ? (
              selectedValue ? (
                <p className={selectedValue?.value ? styles.select__titleBlock_active : undefined}>
                  {selectedValue?.value}
                </p>
              ) : (
                isDisplayFull || <p>{placeholder}</p>
              )
            ) : selectedValue && !!selectedValue.length ? (
              selectedValue.map(el => (
                <div key={el.id} className={styles.select__selected}>
                  <p>{el.value}</p>
                  <Icon
                    onClick={e => {
                      e.stopPropagation();
                      onSelectValue(el);
                    }}
                    glyph="close"
                    glyphColor="grey"
                    size={16}
                  />
                </div>
              ))
            ) : (
              <p>{placeholder}</p>
            )}
            {disabled || (
              <input ref={inputRef} type="text" value={searchValue} onChange={e => setSearchValue(e.target.value)} />
            )}
          </div>
          {disabled || (
            <Icon
              className={cn(
                ((isDisplayFull && direction === 'down') || (!isDisplayFull && direction === 'up')) &&
                  styles.select__icon_disabled
              )}
              size={24}
              glyphColor="grey"
              glyph="arrowDown"
            />
          )}
        </div>
        {isDisplayFull && (
          <div className={cn(styles.select__list, 'scroll', styles[`select__list_${direction}`])}>
            {type === 'multiply' && list.length > 0 && (
              <div
                onClick={e => {
                  e.stopPropagation();
                  onSelectAll();
                }}
                key={'all'}
                className={cn(styles.select__item, styles[`select__item_${direction}`])}
              >
                {<Checkbox isActive={list.length === selectedValue?.length} />}
                <p>{'Выбрать все'}</p>
              </div>
            )}
            {list
              .filter(el => el.value.toString().toLowerCase().includes(searchValue.toLowerCase()))
              .map(el => (
                <div
                  onClick={() => onSelectValue(el)}
                  key={el.id}
                  className={cn(
                    styles.select__item,
                    type === 'single' && selectedValue?.id === el.id && styles.select__item_active,
                    styles[`select__item_${direction}`]
                  )}
                >
                  {type === 'multiply' && <Checkbox isActive={!!selectedValue?.find(item => item.id === el.id)} />}
                  <p>{el.value}</p>
                </div>
              ))}
          </div>
        )}
      </div>
      {error && <p className={styles.container__error}>{error}</p>}
    </div>
  );
}

export const Select = memo(SelectComponent);
