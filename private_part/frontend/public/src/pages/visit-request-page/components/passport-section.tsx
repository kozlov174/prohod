import { ImagePreview } from '@/components'
import { Button, FormControl, FormControlGroup, Stack, TextField } from '@/ui'
import { useFilePicker } from 'use-file-picker'
import { FileSizeValidator } from 'use-file-picker/validators'

const MAX_FILE_SIZE = 5 * 1024 * 1024

type PassportData = {
    fullName: string;
    series: string;
    number: string;
    whoIssued: string;
    issueDate: string;
    photo?: string;
}

type PassportSectionProps = {
    data: PassportData;
    onChange: (data: PassportData) => void;
    onValidationChange: (isValid: boolean) => void;
    onError: (error: string) => void;
}

const validatePassport = (data: PassportData) => {
    const errors: Record<keyof PassportData, boolean> = {
        fullName: false,
        series: false,
        number: false,
        whoIssued: false,
        issueDate: false,
        photo: false
    }

    if (data.fullName.length < 3) {
        errors.fullName = true
    }

    if (data.series.length !== 4) {
        errors.series = true
    }

    if (data.number.length !== 6) {
        errors.number = true
    }

    if (data.whoIssued.length !== 6) {
        errors.whoIssued = true
    }

    if (!data.issueDate) {
        errors.issueDate = true
    }

    if (!data.photo) {
        errors.photo = true
    }

    return errors
}

export function PassportSection({ data, onChange, onValidationChange, onError }: PassportSectionProps) {
    const { openFilePicker, filesContent, clear } = useFilePicker({
        accept: '.jpg, .jpeg',
        readAs: 'DataURL',
        validators: [new FileSizeValidator({ maxFileSize: MAX_FILE_SIZE })],
        multiple: false,
        onFilesSuccessfullySelected(data) {
            const base64 = data.filesContent[0].content
            handleChange('photo', base64)
        },
        onFilesRejected(data) {
            const error = data.errors[0]
            if (error?.name === 'FileSizeError') {
                onError(`Файл слишком большой. Максимальный размер файла: ${MAX_FILE_SIZE / 1024 / 1024}MB`)
            }
        },
    })

    const errors = validatePassport(data)
    // const isValid = !Object.values(errors).some(Boolean)

    const handleChange = (field: keyof PassportData, value: string) => {
        const newData = {
            ...data,
            [field]: value
        }
        onChange(newData)
        onValidationChange(!Object.values(validatePassport(newData)).some(Boolean))
    }

    return (
        <Stack direction="column" gap={16}>
            <FormControl
                label="ФИО"
                attention={errors.fullName}
            >
                <TextField
                    required
                    placeholder="ФИО"
                    type="text"
                    value={data.fullName}
                    onChange={(e) => handleChange('fullName', e.target.value)}
                    style={{ margin: 'unset', width: '100%' }}
                />
            </FormControl>

            <FormControlGroup direction="row">
                <FormControl
                    label="Серия паспорта"
                    attention={errors.series}
                    style={{ flex: 1 }}
                >
                    <TextField
                        required
                        pattern="[0-9]{4}"
                        placeholder="Серия паспорта"
                        type="text"
                        value={data.series}
                        onChange={(e) => {
                            const value = e.target.value.trim()
                            const numberRegexp = /(^[0-9]+$)|(^$)/
                            if (numberRegexp.test(value) && value.length <= 4) {
                                handleChange('series', value)
                            }
                        }}
                        style={{ margin: 'unset', width: '100%' }}
                    />
                </FormControl>

                <FormControl
                    label="Номер паспорта"
                    attention={errors.number}
                    style={{ flex: 1 }}
                >
                    <TextField
                        required
                        pattern="[0-9]{6}"
                        placeholder="Номер паспорта"
                        type="text"
                        value={data.number}
                        onChange={(e) => {
                            const value = e.target.value.trim()
                            const numberRegexp = /(^[0-9]+$)|(^$)/
                            if (numberRegexp.test(value) && value.length <= 6) {
                                handleChange('number', value)
                            }
                        }}
                        style={{ margin: 'unset', width: '100%' }}
                    />
                </FormControl>
            </FormControlGroup>

            <FormControlGroup direction="row">
                <FormControl
                    label="Код подразделения"
                    attention={errors.whoIssued}
                    style={{ flex: 1 }}
                >
                    <TextField
                        required
                        placeholder="Код подразделения"
                        type="text"
                        maxLength={6}
                        minLength={6}
                        pattern="[0-9]{6}"
                        value={data.whoIssued}
                        onChange={(e) => {
                            const value = e.target.value.trim()
                            const numberRegexp = /(^[0-9]+$)|(^$)/
                            if (numberRegexp.test(value) && value.length <= 6) {
                                handleChange('whoIssued', value)
                            }
                        }}
                        style={{ margin: 'unset', width: '100%' }}
                    />
                </FormControl>
                <FormControl
                    label="Когда выдан паспорт?"
                    attention={errors.issueDate}
                    style={{ flex: 1 }}
                >
                    <TextField
                        required
                        type="date"
                        placeholder="Когда выдан паспорт?"
                        value={data.issueDate}
                        onChange={(e) => handleChange('issueDate', e.target.value)}
                        style={{ margin: 'unset', width: '100%' }}
                    />
                </FormControl>
            </FormControlGroup>

            <FormControl
                label="Фото"
                attention={errors.photo}
                style={{ flex: 1 }}
            >
                {!filesContent.length && (
                    <Button onClick={openFilePicker}>Загрузить</Button>
                )}
                {filesContent?.map((x) => (
                    <div key={x.name}>
                        <ImagePreview
                            maxHeight="50vh"
                            src={x.content}
                            name={x.name}
                            onEdit={() => openFilePicker()}
                            onRemove={() => {
                                clear()
                                handleChange('photo', '')
                            }}
                        />
                    </div>
                ))}
            </FormControl>
        </Stack>
    )
} 