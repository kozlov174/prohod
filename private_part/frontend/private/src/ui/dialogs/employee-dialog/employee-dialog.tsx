import React, { useState } from 'react'

import { ActionContainer, BaseDialog, BaseDialogProps, Divider } from '..'
import { Button } from '../../button'
import { TextField } from '../../fields'
import { FormGroup, FormGroupControl, GroupRow } from '../../form-group'
import { Highlight, Title } from '../../title'

const EMPTY_DATA: EmployeeDialogEditModel = {
  name: '',
  surname: '',
  userEmail: '',
  login: '',
}

export type EmployeeDialogEditModel = {
  name: string;
  surname: string;
  userEmail: string;
  login: string;
};

type EmployeeDialogProps = {
  onSubmit: (data: EmployeeDialogEditModel) => void;
  initial?: EmployeeDialogEditModel;
  disabled?: boolean;
} & BaseDialogProps;

export function EmployeeDialog(props: EmployeeDialogProps) {
  const { onSubmit, initial, disabled = false, ...rest } = props

  const [value, setValue] = useState(initial || EMPTY_DATA)

  const handlePropChange =
    (prop: keyof EmployeeDialogEditModel) =>
    (event: React.ChangeEvent<HTMLInputElement>) => {
      const propValue = event.target.value || ''
      setValue({ ...value, [prop]: propValue })
    }

  return (
    <BaseDialog
      {...rest}
      title={
        <Title>
          Добавить <Highlight> сотрудника</Highlight>
        </Title>
      }
      footer={
        <ActionContainer>
          <Button onClick={() => props.onOpenChange(false)}>Закрыть</Button>
          <Divider />
          <Button disabled={disabled} onClick={() => onSubmit(value)}>
            Добавить
          </Button>
        </ActionContainer>
      }
    >
      <FormGroup title="Информация о сотруднике">
        <GroupRow>
          <FormGroupControl label="Имя">
            <TextField
              disabled={disabled}
              onChange={handlePropChange('name')}
            />
          </FormGroupControl>
          <FormGroupControl label="Фамилия и отчество">
            <TextField
              disabled={disabled}
              onChange={handlePropChange('surname')}
            />
          </FormGroupControl>
        </GroupRow>
        <GroupRow>
          <FormGroupControl label="E-mail">
            <TextField
              disabled={disabled}
              onChange={handlePropChange('userEmail')}
            />
          </FormGroupControl>
          <FormGroupControl label="Логин">
            <TextField
              disabled={disabled}
              onChange={handlePropChange('login')}
            />
          </FormGroupControl>
        </GroupRow>
      </FormGroup>
    </BaseDialog>
  )
}
