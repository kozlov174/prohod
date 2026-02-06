import { PersonRole } from '@/models'

const roleMapper: Record<PersonRole, string> = {
  [PersonRole.Admin]: 'Администратор',
  [PersonRole.Security]: 'Сотрудник УБ',
  [PersonRole.User]: 'Пользователь',
}

type UseRoleTranslationProps = {
  role: PersonRole;
};

export function useRoleTranslation(props?: UseRoleTranslationProps) {
  const { role } = props || {}

  return {
    translation: role ? roleMapper[role] : undefined,
    translate: (role: PersonRole) => roleMapper[role],
  }
}
