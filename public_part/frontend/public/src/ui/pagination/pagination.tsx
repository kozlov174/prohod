import React from 'react'

import * as S from './styled'
import { SelectField } from '../fields'
import {
  KeyboardArrowLeftIcon,
  KeyboardArrowRightIcon,
  KeyboardDoubleArrowLeftIcon,
  KeyboardDoubleArrowRightIcon,
} from '../icons'

type PaginationBaseProps = {
  canPreviousPage: boolean;
  canNextPage: boolean;
  pageOptions: number[];
  pageCount: number;

  onGoToPage: (value: number) => void;
  onNextPage: () => void;
  onPreviousPage: () => void;
  onPageSizeChange: (value: number) => void;
  pageIndex: number;
  pageSize: number;
};

type PaginationHTMLAttributes = Omit<
  React.ComponentProps<typeof S.Root>,
  keyof PaginationBaseProps
>;

type PaginationProps = PaginationBaseProps & PaginationHTMLAttributes;

export function Pagination(props: PaginationProps) {
  const {
    canNextPage,
    canPreviousPage,
    onGoToPage,
    onNextPage,
    onPreviousPage,
    onPageSizeChange,
    pageIndex,
    pageSize,
    pageOptions,
    pageCount,
    ...rest
  } = props

  return (
    <S.Root {...rest}>
      <S.Actions>
        <S.IconButton onClick={() => onGoToPage(0)} disabled={!canPreviousPage}>
          <KeyboardDoubleArrowLeftIcon />
        </S.IconButton>
        <S.IconButton onClick={onPreviousPage} disabled={!canPreviousPage}>
          <KeyboardArrowLeftIcon />
        </S.IconButton>
        <S.IconButton onClick={onNextPage} disabled={!canNextPage}>
          <KeyboardArrowRightIcon />
        </S.IconButton>
        <S.IconButton
          onClick={() => onGoToPage(pageCount - 1)}
          disabled={!canNextPage}
        >
          <KeyboardDoubleArrowRightIcon />
        </S.IconButton>
      </S.Actions>

      <S.AdditionalActions>
        <S.PageInfo>
          {pageIndex + 1} из {pageCount}
        </S.PageInfo>
        |
        <S.GoToContainer>
          <S.GoToMessage>Перейти на страницу:</S.GoToMessage>
          <S.GoToInput
            type="number"
            min={1}
            max={pageCount}
            defaultValue={pageIndex + 1}
            onChange={(e) => {
              const page = e.target.value ? Number(e.target.value) - 1 : 0
              onGoToPage(page)
            }}
          />
        </S.GoToContainer>
        <SelectField
          style={{ width: '180px', height: '32px', borderRadius: '8px' }}
          value={pageSize}
          onChange={(e) => {
            onPageSizeChange(Number(e.target.value))
          }}
        >
          {pageOptions.map((pageSize) => (
            <option key={pageSize} value={pageSize}>
              Показывать {pageSize}
            </option>
          ))}
        </SelectField>
      </S.AdditionalActions>
    </S.Root>
  )
}
