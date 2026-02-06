import { AutoComplete, FormControl, FormControlGroup, Stack, TextField, TextareaField } from '@/ui'

type VisitDetails = {
  visitTime: string;
  visitDate: string;
  userToVisitId: string;
  visitReason: string;
}

type VisitDetailsSectionProps = {
  data: VisitDetails;
  onChange: (data: VisitDetails) => void;
  usersCollection: Array<{ id: string; name: string; surname: string }>;
  onValidationChange: (isValid: boolean) => void;
}

const validateVisitDetails = (data: VisitDetails) => {
  const errors: Record<keyof VisitDetails, boolean> = {
    visitTime: false,
    visitDate: false,
    userToVisitId: false,
    visitReason: false
  }

  if (!data.visitDate) {
    errors.visitDate = true
  }

  if (!data.visitTime) {
    errors.visitTime = true
  }

  if (!data.userToVisitId) {
    errors.userToVisitId = true
  }

  if (data.visitReason.length < 3) {
    errors.visitReason = true
  }

  return errors
}

export function VisitDetailsSection({ data, onChange, usersCollection, onValidationChange }: VisitDetailsSectionProps) {
  const errors = validateVisitDetails(data)
//   const isValid = !Object.values(errors).some(Boolean)

  const handleChange = (field: keyof VisitDetails, value: string) => {
    const newData = {
      ...data,
      [field]: value
    }
    onChange(newData)
    onValidationChange(!Object.values(validateVisitDetails(newData)).some(Boolean))
  }

  return (
    <Stack direction="column" gap={16}>
      <FormControlGroup direction="row">
        <FormControl
          label="Дата посещения"
          attention={errors.visitDate}
          style={{ flex: 1 }}
        >
          <TextField
            required
            placeholder="Дата посещения"
            type="date"
            min={new Date().toISOString().split('T')[0]}
            value={data.visitDate}
            onChange={(e: React.ChangeEvent<HTMLInputElement>) => handleChange('visitDate', e.target.value)}
            style={{ margin: 'unset', width: '100%' }}
          />
        </FormControl>

        <FormControl
          label="Время посещения"
          attention={errors.visitTime}
          style={{ flex: 1 }}
        >
          <TextField
            required
            placeholder="Время посещения"
            type="time"
            value={data.visitTime}
            onChange={(e: React.ChangeEvent<HTMLInputElement>) => handleChange('visitTime', e.target.value)}
            style={{ margin: 'unset', width: '100%' }}
          />
        </FormControl>
      </FormControlGroup>

      <FormControl
        label="Кого посещаете?"
        attention={errors.userToVisitId}
      >
        <AutoComplete
          collection={usersCollection}
          keyAccessor={(x) => x.id}
          labelAccessor={(x) => `${x.name} ${x.surname}`}
          value={usersCollection.find(
            (x) => x.id === data.userToVisitId
          )}
          onChange={(x) => handleChange('userToVisitId', x.id)}
        />
      </FormControl>

      <FormControl
        label="Цель визита"
        attention={errors.visitReason}
      >
        <TextareaField
          required
          placeholder="Цель визита"
          value={data.visitReason}
          onChange={(e: React.ChangeEvent<HTMLTextAreaElement>) => handleChange('visitReason', e.target.value)}
          style={{ margin: 'unset', width: '100%' }}
        />
      </FormControl>
    </Stack>
  )
} 