import { ReportListItem } from '@/models'
import { nav } from '@/pages'
import { usePageTitle } from '@/pages/wrappers/simple-header-wrap/page-title-context'
import { api } from '@/provider/api'
import { useLayoutActions } from '@/provider/layout-actions-provider'
import {
  Button,
  Card,
  FormControl,
  FormGroupControl,
  Highlight,
  PageWrapper,
  Pagination,
  Stack,
  TextField,
  Title,
} from '@/ui'
import { FormGroup, GroupRow } from '@/ui/form-group'
import * as T from '@/ui/table'
import { useQuery } from '@tanstack/react-query'
import {
  PaginationState,
  createColumnHelper,
  flexRender,
  getCoreRowModel,
  getFilteredRowModel,
  getPaginationRowModel,
  useReactTable,
} from '@tanstack/react-table'
import { useState } from 'react'
import { useNavigate } from 'react-router-dom'

function dateConverter(date: string | number) {
  return new Date(date).toLocaleDateString(navigator.language, {
    day: 'numeric',
    month: 'numeric',
    year: 'numeric',
  })
}

function dateTimeConverter(date: string | number) {
  return new Date(date).toLocaleDateString(navigator.language, {
    day: 'numeric',
    month: 'numeric',
    year: 'numeric',
    hour: 'numeric',
    minute: 'numeric',
  })
}

const columnHelper = createColumnHelper<ReportListItem>()
const EMPTY_ARR: ReportListItem[] = []

const now = new Date()
const firstDate = new Date(now.getFullYear(), now.getMonth(), 2)
const lastDate = new Date(now.getFullYear(), now.getMonth() + 1, 0)

const columns = [
  columnHelper.display({
    id: 'number',
    header: '#',
    filterFn: 'includesString',
    cell: (info) => info.row.index + 1,
  }),
  columnHelper.accessor((row) => row.passport_full_name, {
    id: 'name',
    header: () => 'ФИО',
    filterFn: 'includesString',
    cell: (info) => info.renderValue(),
  }),
  columnHelper.accessor((row) => dateConverter(row.passport_issue_date), {
    id: 'passport_issue_date',
    header: () => 'Дата выдачи паспорта',
    filterFn: 'includesString',
    cell: (info) => info.renderValue(),
  }),

  columnHelper.accessor((row) => row.passport_who_issued, {
    id: 'passport_who_issued',
    header: () => 'Кем выдан паспорт',
    filterFn: 'includesString',
    cell: (info) => info.renderValue(),
  }),

  columnHelper.accessor(
    (row) => [row.passport_number, row.passport_series].join(' '),
    {
      id: 'passport_number_series',
      header: () => 'Серия и номер паспорта',
      filterFn: 'includesString',
      cell: (info) => info.renderValue(),
    }
  ),

  columnHelper.accessor((row) => dateTimeConverter(row.visit_time), {
    id: 'visit_time',
    header: () => 'Дата посещения',
    filterFn: 'includesString',
    cell: (info) => info.renderValue(),
  }),

  columnHelper.accessor((row) => row.visit_reason, {
    id: 'visit_reason',
    header: () => 'Причина посещения',
    filterFn: 'includesString',
    cell: (info) => info.renderValue(),
  }),
]

export function ReportsPage() {
  const navigate = useNavigate()

  useLayoutActions({ backHandler: () => navigate(nav.visitsByAdmin()) })
  const handleReportClick = (data: ReportListItem) =>
    navigate(nav.adminReport(data.visit_request_id))

  usePageTitle({
    initialTitle: (
      <Title>
        <Highlight>Отчеты</Highlight>
      </Title>
    ),
  })

  const [range, setRange] = useState<{
    start_date: string;
    end_date: string;
  }>({
    start_date: firstDate.toISOString().split('T')[0],
    end_date: lastDate.toISOString().split('T')[0],
  })

  const { data: reports = EMPTY_ARR } = useQuery({
    queryKey: ['report', range.start_date, range.end_date],
    queryFn: () => {
      return api.reports(range).then((r) => r.data.forms)
    },
  })

  const handleDownloadReports = async () => {
    try {
      const blob = await api.downloadReports(range)
      const url = window.URL.createObjectURL(blob)
      const link = document.createElement('a')
      link.href = url
      link.download = `reports_${range.start_date}_${range.end_date}.xlsx`
      document.body.appendChild(link)
      link.click()
      document.body.removeChild(link)
      window.URL.revokeObjectURL(url)
    } catch (error) {
      console.error('Error downloading reports:', error)
    }
  }

  const [pagination, setPagination] = useState<PaginationState>({
    pageIndex: 0,
    pageSize: 10,
  })

  const [term, setTerm] = useState('')

  const table = useReactTable({
    data: reports || EMPTY_ARR,
    columns,
    getCoreRowModel: getCoreRowModel(),
    getPaginationRowModel: getPaginationRowModel(),
    getFilteredRowModel: getFilteredRowModel(),
    onPaginationChange: setPagination,
    onGlobalFilterChange: setTerm,
    state: {
      pagination,
      globalFilter: term,
    },
  })

  return (
    <PageWrapper>
      <Card>
        <Stack gap={16}>
          <FormGroup title="Фильтры">
            <GroupRow>
              <FormGroupControl label="Дата начала">
                <TextField
                  required
                  placeholder="Дата начала"
                  type="date"
                  value={range.start_date}
                  onChange={(e) => {
                    setRange((prev) => ({
                      ...prev,
                      start_date: e.target.value,
                    }))
                  }}
                  style={{ margin: 'unset', width: '100%' }}
                />
              </FormGroupControl>
              <FormGroupControl label="Дата окончания">
                <TextField
                  required
                  placeholder="Дата окончания"
                  type="date"
                  value={range.end_date}
                  onChange={(e) => {
                    setRange((prev) => ({
                      ...prev,
                      end_date: e.target.value,
                    }))
                  }}
                  style={{ margin: 'unset', width: '100%' }}
                />
              </FormGroupControl>
            </GroupRow>
            <FormControl label="Поиск">
              <TextField
                type="text"
                onChange={(e) => setTerm(e.target.value)}
              />
            </FormControl>
            <Stack gap={8}>
              <Button onClick={handleDownloadReports} colorVariant="secondary">
                Скачать отчет
              </Button>
            </Stack>
          </FormGroup>

          <Stack gap={16}>
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
                  <T.Tr
                    onClick={() => handleReportClick(row.original)}
                    key={row.id}
                  >
                    {row.getVisibleCells().map((cell) => (
                      <T.Td key={cell.id}>
                        {flexRender(
                          cell.column.columnDef.cell,
                          cell.getContext()
                        )}
                      </T.Td>
                    ))}
                  </T.Tr>
                ))}
              </T.Tbody>
            </T.Table>
            <Pagination
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
          </Stack>
        </Stack>
      </Card>
    </PageWrapper>
  )
}
