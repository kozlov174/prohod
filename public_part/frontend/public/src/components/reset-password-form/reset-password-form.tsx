import { Button, Form, FormControl, TextField } from '@/ui'
import { FormGroup } from '@/ui/form-group'
import { useState } from 'react'

export type ResetPasswordFormSubmitData = {
  newPassword: string;
  repeatPassword: string;
};

type ResetPasswordFormProps = {
  onSubmit: (data: ResetPasswordFormSubmitData) => void;
};

export function ResetPasswordForm(props: ResetPasswordFormProps) {
  const { onSubmit } = props

  const [value, setValue] = useState<ResetPasswordFormSubmitData>({
    repeatPassword: '',
    newPassword: '',
  })

  const isNewPasswordMatch =
    value.newPassword === value.repeatPassword &&
    value.newPassword.trim().length > 0 &&
    value.repeatPassword.trim().length > 0

  return (
    <Form
      onSubmit={() => {
        onSubmit(value)
      }}
    >
      <FormGroup title="Изменить пароль">
        <FormControl label="Новый пароль">
          <TextField
            type="password"
            value={value.newPassword}
            onChange={(e) =>
              setValue({ ...value, newPassword: e.target.value.trim() })
            }
          />
        </FormControl>

        <FormControl label="Повторите пароль">
          <TextField
            type="password"
            value={value.repeatPassword}
            onChange={(e) =>
              setValue({ ...value, repeatPassword: e.target.value.trim() })
            }
          />
        </FormControl>
        <Button type="submit" disabled={!isNewPasswordMatch}>
          Сохранить
        </Button>
      </FormGroup>
    </Form>
  )
}
