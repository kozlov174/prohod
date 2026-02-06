import React from 'react'

import { VisitStatus } from '../models'

type VisitStatusTransition = Record<VisitStatus, string>;

const visitStatusTransition: VisitStatusTransition & Record<'Unknown', string> =
  {
    accept: 'Вход разрешен',
    not_processed: 'Вход не обработан',
    reject: 'Вход отклонен',
    Unknown: 'Статус неизвестен',
  }

type UseVisitStatusTranslationProps = {
  visitStatus: VisitStatus;
};

export function useVisitStatusTranslation(
  props: UseVisitStatusTranslationProps
) {
  const { visitStatus } = props

  return React.useMemo(
    () => visitStatusTransition[visitStatus] || visitStatusTransition.Unknown,
    [visitStatus]
  )
}
