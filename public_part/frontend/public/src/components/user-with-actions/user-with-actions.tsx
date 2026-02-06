import { UserModel } from '@/models'
import { IconButton } from '@/ui/icon-button/icon-button'
import { ArrowBackIcon, LogoutIcon } from '@/ui/icons'
import { AnimatePresence, motion } from 'motion/react'
import React from 'react'

import * as S from './styled'

type UserWithActionsBaseProps = {
  onBack?: () => void;
  onLogout: () => void;
  user: UserModel;
};

type UserWithActionsProps = React.PropsWithChildren<UserWithActionsBaseProps>;

export function UserWithActions(props: UserWithActionsProps) {
  const { children, user, onBack, onLogout } = props

  const userName = [user.name, user.surname].filter(Boolean).join(' ') || ''

  return (
    <S.Root>
      <AnimatePresence>
        <S.PageActions>
          {onBack && (
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1, transition: { duration: 0.3 } }}>
              <IconButton onClick={onBack}>
                <ArrowBackIcon />
              </IconButton>
            </motion.div>
          )}
          {children}
          <S.UserInfo>
            <span>{userName}</span>
            <IconButton onClick={onLogout}>
              <LogoutIcon />
            </IconButton>
          </S.UserInfo>
        </S.PageActions>
      </AnimatePresence>
    </S.Root>
  )
}
