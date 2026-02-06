import { Button, Form, FormControl, TextField } from '@/ui'
import { FormGroup } from '@/ui/form-group'
import { useState } from 'react'

export type ChangePasswordFormSubmitData = {
  newPassword: string;
  currentPassword: string;
  repeatPassword: string;
  login: string;
};

type InitialData = Pick<
  ChangePasswordFormSubmitData,
  'login' | 'currentPassword'
>;

type ChangePasswordFormProps = {
  initialData?: Partial<InitialData>;
  onSubmit: (data: ChangePasswordFormSubmitData) => void;
  hideLogin?: boolean;
};

export function ChangePasswordForm(props: ChangePasswordFormProps) {
  const { initialData, onSubmit, hideLogin = false } = props

  const [value, setValue] = useState<ChangePasswordFormSubmitData>({
    login: initialData?.login || '',
    currentPassword: initialData?.currentPassword || '',
    repeatPassword: '',
    newPassword: '',
  })

  const isCurrentPasswordValid = value.currentPassword.trim().length > 0
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
        {!hideLogin && (
          <FormControl label="Логин">
            <TextField
              value={value.login}
              onChange={(e) =>
                setValue({
                  ...value,
                  login: e.target.value.trimStart(),
                })
              }
            />
          </FormControl>
        )}

        <FormControl label="Текущий пароль">
          <TextField
            type="password"
            value={value.currentPassword}
            onChange={(e) =>
              setValue({
                ...value,
                currentPassword: e.target.value.trimStart(),
              })
            }
          />
        </FormControl>

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
        <Button
          type="submit"
          disabled={!isNewPasswordMatch || !isCurrentPasswordValid}
        >
          Сохранить
        </Button>
      </FormGroup>
    </Form>
  )
}
