import { useVisitStatusTranslation } from '@/hooks'
import { ActiveVisitModel } from '@/models'
import { Form, Pagination } from '@/ui'
import { FormGroup } from '@/ui/form-group'
import * as T from '@/ui/table'
import {
  PaginationState,
  createColumnHelper,
  flexRender,
  getCoreRowModel,
  getFilteredRowModel,
  getPaginationRowModel,
  useReactTable,
} from '@tanstack/react-table'
import React from 'react'

import * as S from './styled'
import { VisitsFilter, VisitsListFilters } from './visits-list-filters'

function VisitStatusCell(props: { visitStatus: ActiveVisitModel['status'] }) {
  const { visitStatus } = props
  const translation = useVisitStatusTranslation({ visitStatus })
  return translation
}

function dateConverter(date: string | number) {
  return new Date(date).toLocaleDateString(navigator.language, {
    day: 'numeric',
    month: 'numeric',
    year: 'numeric',
    hour: 'numeric',
    minute: 'numeric',
  })
}

const columnHelper = createColumnHelper<ActiveVisitModel>()

const columns = [
  columnHelper.display({
    id: 'number',
    header: '#',
    filterFn: 'includesString',
    cell: (info) => info.row.index + 1,
  }),
  columnHelper.accessor((row) => row.id, {
    id: 'id',
    cell: (info) => <i>{info.getValue()}</i>,
    header: () => 'ID заявки',
  }),
  columnHelper.accessor((row) => row.form.passport_full_name, {
    id: 'name',
    header: () => 'Посетитель',
    filterFn: 'includesString',
    cell: (info) => info.renderValue(),
  }),
  columnHelper.accessor((row) => row.form.visit_time, {
    id: 'visitTime',
    header: 'Дата посещения',
    filterFn: 'includesString',
    cell: (info) => dateConverter(info.getValue()),
  }),
  columnHelper.accessor((row) => row.status, {
    id: 'status',
    header: 'Статус',
    cell: (info) => <VisitStatusCell visitStatus={info.getValue()} />,
  }),
]

type VisitsListProps = {
  collection: ActiveVisitModel[];
  onRowClick: (visit: ActiveVisitModel) => void;
  filter: VisitsFilter;
  onFilterChange: (filter: VisitsFilter) => void;
};

export function VisitsList(props: VisitsListProps) {
  const { collection, onRowClick, filter, onFilterChange } = props

  const [pagination, setPagination] = React.useState<PaginationState>({
    pageIndex: 0,
    pageSize: 10,
  })

  const handleTermChange = (term: string) => {
    onFilterChange({
      ...filter,
      term,
    })
  }

  const table = useReactTable({
    data: collection,
    columns,
    getCoreRowModel: getCoreRowModel(),
    getPaginationRowModel: getPaginationRowModel(),
    getFilteredRowModel: getFilteredRowModel(),
    onPaginationChange: setPagination,
    onGlobalFilterChange: handleTermChange,
    state: {
      pagination,
      globalFilter: filter.term,
    },
  })

  return (
    <Form>
      <S.FiltersContainer>
        <FormGroup title="Фильтры">
          <VisitsListFilters filter={filter} onFilterChange={onFilterChange} />
        </FormGroup>
      </S.FiltersContainer>
      <T.Table style={{ width: '100%' }}>
        <T.Thead>
          {table.getHeaderGroups().map((headerGroup) => (
            <T.Tr key={headerGroup.id}>
              {headerGroup.headers.map((header) => (
                <T.Th key={header.id}>
                  {header.isPlaceholder
                    ? null
                    : flexRender(
                        header.column.columnDef.header,
                        header.getContext()
                      )}
                </T.Th>
              ))}
            </T.Tr>
          ))}
        </T.Thead>
        <T.Tbody>
          {table.getRowModel().rows.map((row) => (
            <T.Tr key={row.id} onClick={() => onRowClick(row.original)}>
              {row.getVisibleCells().map((cell) => (
                <T.Td key={cell.id}>
                  {flexRender(cell.column.columnDef.cell, cell.getContext())}
                </T.Td>
              ))}
            </T.Tr>
          ))}
        </T.Tbody>
      </T.Table>
      <Pagination
        style={{ marginTop: '24px' }}
        canNextPage={table.getCanNextPage()}
        canPreviousPage={table.getCanPreviousPage()}
        pageCount={table.getPageCount()}
        pageIndex={table.getState().pagination.pageIndex}
        onNextPage={table.nextPage}
        onPreviousPage={table.previousPage}
        onGoToPage={table.setPageIndex}
        onPageSizeChange={table.setPageSize}
        pageOptions={[10, 20, 30, 40, 50]}
        pageSize={table.getState().pagination.pageSize}
      />
    </Form>
  )
}
