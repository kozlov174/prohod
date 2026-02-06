import { UserListItem, UserStatus } from '@/models'
import { nav } from '@/pages'
import { api } from '@/provider/api'
import { useLayoutActions } from '@/provider/layout-actions-provider'
import {
  Button,
  Card,
  FormControl,
  Highlight,
  PageWrapper,
  Pagination,
  Stack,
  TextField,
  Title,
} from '@/ui'
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

import { usePageTitle } from '../../../wrappers/simple-header-wrap/page-title-context'

const columnHelper = createColumnHelper<UserListItem>()

const EMPTY_ARR: UserListItem[] = []

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
    header: () => 'ID',
  }),
  columnHelper.accessor((row) => row.login, {
    id: 'login',
    header: () => 'Логин',
    filterFn: 'includesString',
    cell: (info) => info.renderValue(),
  }),
  columnHelper.accessor((row) => [row.name, row.surname].join(' '), {
    id: 'name',
    header: () => 'ФИО',
    filterFn: 'includesString',
    cell: (info) => info.renderValue(),
  }),
  columnHelper.accessor((row) => row.user_email, {
    id: 'email',
    header: () => 'Email',
    filterFn: 'includesString',
    cell: (info) => info.renderValue(),
  }),
  columnHelper.accessor((row) => row.user_status, {
    id: 'status',
    header: () => 'Статус',
    cell: (info) => {
      const status = info.getValue()
      return (
        <span style={{
          color: status === UserStatus.Inactive ? '#F44336' : '#4CAF50',
          fontWeight: 'bold'
        }}>
          {status === UserStatus.Inactive ? 'Деактивирован' : 'Активен'}
        </span>
      )
    },
  }),
]

export function UsersListPage() {
  usePageTitle({
    initialTitle: (
      <Title>
        <Highlight>Пользователи</Highlight>
      </Title>
    ),
  })

  const navigate = useNavigate()

  useLayoutActions({
    actions: (
      <Stack gap={16} direction="row" justifyContent="flex-end">
        <Button onClick={() => navigate(nav.adminUserCreate())}>
          Добавить
        </Button>
      </Stack>
    ),
    backHandler: () => navigate(nav.visitsByAdmin()),
  })

  const { data = EMPTY_ARR } = useQuery({
    queryKey: ['users'],
    queryFn: async () => {
      const [users, securities] = await Promise.all([
        api.getUsers().catch(() => EMPTY_ARR),
        api.getSecurities().catch(() => EMPTY_ARR),
      ])
      return [...users, ...securities]
    },
  })

  const [pagination, setPagination] = useState<PaginationState>({
    pageIndex: 0,
    pageSize: 10,
  })

  const [term, setTerm] = useState('')

  const table = useReactTable({
    data: data || EMPTY_ARR,
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

  const handleEditUserClick = (user: UserListItem) => {
    navigate(nav.adminUserEdit(user.id))
  }

  return (
    <PageWrapper>
      <Stack gap={16}>
        <Card style={{ flex: 1 }}>
          <Stack gap={16}>
            <FormControl label="Поиск">
              <TextField
                type="text"
                onChange={(e) => setTerm(e.target.value)}
              />
            </FormControl>

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
                    key={row.id}
                    onClick={() => handleEditUserClick(row.original)}
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
              {/* <tfoot>
               {table.getFooterGroups().map((footerGroup) => (
                 <tr key={footerGroup.id}>
                   {footerGroup.headers.map((header) => (
                     <th key={header.id}>
                       {header.isPlaceholder
                         ? null
                         : flexRender(
                             header.column.columnDef.footer,
                             header.getContext()
                           )}
                     </th>
                   ))}
                 </tr>
               ))}
             </tfoot> */}
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
        </Card>
      </Stack>
    </PageWrapper>
  )
}
