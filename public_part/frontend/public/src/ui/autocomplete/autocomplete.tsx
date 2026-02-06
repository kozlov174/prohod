import {
  FloatingFocusManager,
  FloatingPortal,
  autoUpdate,
  flip,
  size,
  useDismiss,
  useFloating,
  useInteractions,
  useListNavigation,
  useRole,
} from '@floating-ui/react'
import React, { useRef, useState } from 'react'

import { TextField } from '../fields'
import { MenuItem } from './components'
import * as S from './styled'

type AutoCompleteProps<T> = {
  value?: T;
  collection: T[];
  onChange: (value: T) => void;
  keyAccessor: (item: T) => string;
  labelAccessor: (item: T) => string;
  placeholder?: string;
};

export function AutoComplete<T>(props: AutoCompleteProps<T>) {
  const {
    collection = [],
    labelAccessor,
    onChange,
    keyAccessor,
    value,
    placeholder = 'Поиск...',
  } = props
  const [open, setOpen] = useState(false)
  const [inputValue, setInputValue] = useState(
    value ? labelAccessor(value) : ''
  )
  const [activeIndex, setActiveIndex] = useState<number | null>(null)

  const listRef = useRef<Array<HTMLElement | null>>([])

  const { refs, floatingStyles, context } = useFloating<HTMLInputElement>({
    whileElementsMounted: autoUpdate,
    open,
    onOpenChange: setOpen,
    middleware: [
      flip({ padding: 10 }),
      size({
        apply({ rects, availableHeight, elements }) {
          Object.assign(elements.floating.style, {
            width: `${rects.reference.width}px`,
            maxHeight: `${availableHeight}px`,
          })
        },
        padding: 10,
      }),
    ],
  })

  const role = useRole(context, { role: 'listbox' })
  const dismiss = useDismiss(context)
  const listNav = useListNavigation(context, {
    listRef,
    activeIndex,
    onNavigate: setActiveIndex,
    virtual: true,
    loop: true,
  })

  const { getReferenceProps, getFloatingProps, getItemProps } = useInteractions(
    [role, dismiss, listNav]
  )

  function onInputChange(event: React.ChangeEvent<HTMLInputElement>) {
    const value = event.target.value
    setInputValue(value)

    if (value) {
      setOpen(true)
      setActiveIndex(0)
    } else {
      setOpen(false)
    }
  }

  const items = collection.filter((item) =>
    labelAccessor(item).toLowerCase().includes(inputValue.toLowerCase())
  )

  return (
    <>
      <TextField
        {...getReferenceProps({
          ref: refs.setReference,
          onChange: onInputChange,
          value: inputValue,
          placeholder,
          'aria-autocomplete': 'list',
          onKeyDown(event) {
            if (
              event.key === 'Enter' &&
              activeIndex !== null &&
              items[activeIndex]
            ) {
              const selectedValue = items[activeIndex]
              setInputValue(labelAccessor(selectedValue))
              setActiveIndex(null)
              onChange(selectedValue)
              setOpen(false)
            }
          },
        })}
      />
      <FloatingPortal>
        {open && (
          <FloatingFocusManager
            context={context}
            initialFocus={-1}
            visuallyHiddenDismiss
          >
            <S.ItemsContainer
              {...getFloatingProps({
                ref: refs.setFloating,
                style: floatingStyles,
              })}
            >
              {items.length === 0 && (
                <S.NoResults>Совпадения не найдены</S.NoResults>
              )}
              {items.map((item, index) => (
                <MenuItem
                  key={keyAccessor(item)}
                  {...getItemProps({
                    ref(node) {
                      listRef.current[index] = node
                    },
                    onClick() {
                      setInputValue(labelAccessor(item))
                      setOpen(false)
                      onChange(item)
                      refs.domReference.current?.focus()
                    },
                  })}
                  active={activeIndex === index}
                >
                  {labelAccessor(item)}
                </MenuItem>
              ))}
            </S.ItemsContainer>
          </FloatingFocusManager>
        )}
      </FloatingPortal>
    </>
  )
}
