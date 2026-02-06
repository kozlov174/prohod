import { useRoleTranslation } from '@/hooks'
import { PersonRole } from '@/models'
import { Form, FormControl, SelectField, TextField } from '@/ui'
import React from 'react'

const Roles = [PersonRole.Security, PersonRole.User]

export type UserCreateFormValue = {
  name: string;
  surname: string;
  user_email: string;
  login: string;
  role: PersonRole;
};

type UserCreateFormBaseProps = {
  onSubmit: (data: UserCreateFormValue) => void;
  onChange: (data: UserCreateFormValue) => void;
  value: UserCreateFormValue;
};

type UserCreateFormHTMLAttributes = Omit<
  React.HTMLAttributes<HTMLFormElement>,
  keyof UserCreateFormBaseProps
>;

type UserCreateFormProps = UserCreateFormHTMLAttributes &
  UserCreateFormBaseProps;

export function UserCreateForm(props: UserCreateFormProps) {
  const { onSubmit, value, onChange, ...rest } = props
  const { translate } = useRoleTranslation()


  return (
    <Form {...rest} onSubmit={() => onSubmit(value)}>
      <FormControl label="Имя">
        <TextField
          value={value.name}
          onChange={(e) =>
            onChange({ ...value, name: e.target.value.trimStart() })
          }
        />
      </FormControl>

      <FormControl label="Фамилия">
        <TextField
          value={value.surname}
          onChange={(e) =>
            onChange({ ...value, surname: e.target.value.trimStart() })
          }
        />
      </FormControl>

      <FormControl label="Email">
        <TextField
          value={value.user_email}
          onChange={(e) =>
            onChange({ ...value, user_email: e.target.value.trimStart() })
          }
        />
      </FormControl>

      <FormControl label="Логин">
        <TextField
          value={value.login}
          onChange={(e) =>
            onChange({ ...value, login: e.target.value.trimStart() })
          }
        />
      </FormControl>

      <FormControl label="Роль">
        <SelectField
          value={value.role}
          onChange={(e) =>
            onChange({ ...value, role: e.target.value as PersonRole })
          }
        >
          {Roles.map((role) => (
            <option key={role} value={role}>
              {translate(role)}
            </option>
          ))}
        </SelectField>
      </FormControl>
    </Form>
  )
}
