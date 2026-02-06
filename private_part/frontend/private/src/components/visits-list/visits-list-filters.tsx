import { ActiveVisitModel, VisitStatus } from '@/models'
import { FormGroupControl, SelectField, TextField } from '@/ui'
import { GroupRow } from '@/ui/form-group'


export type VisitsFilter = {
  status: VisitStatus;
  term: string;
};

type VisitsListFiltersProps = {
  filter: VisitsFilter;
  onFilterChange: (filter: VisitsFilter) => void;
};

export function VisitsListFilters(props: VisitsListFiltersProps) {
  const { filter, onFilterChange } = props

  const handleTermChange = (term: string) => {
    onFilterChange({
      ...filter,
      term,
    })
  }

  const handleStatusChange = (status: VisitStatus) => {
    onFilterChange({
      ...filter,
      status,
    })
  }

  return (
    <GroupRow>
      <FormGroupControl label="Поиск">
        <TextField
          type="text"
          onChange={(e) => handleTermChange(e.target.value)}
        />
      </FormGroupControl>
      <FormGroupControl label="Статус">
        <SelectField
          value={filter.status}
          onChange={(e) => {
            handleStatusChange(e.target.value as ActiveVisitModel['status'])
          }}
        >
          <option value={VisitStatus.NotProcessed}>Активные</option>
          <option value={VisitStatus.Accept}>Принятые</option>
          <option value={VisitStatus.Reject}>Отклонённые</option>
        </SelectField>
      </FormGroupControl>
    </GroupRow>
  )
}
