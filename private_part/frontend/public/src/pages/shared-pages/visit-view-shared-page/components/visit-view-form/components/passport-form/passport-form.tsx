import { PassportModel } from '@/models'
import { ImageViewDialog, Stack } from '@/ui'
import { FormGroup, FormGroupControl, GroupRow } from '@/ui/form-group'
import { useState } from 'react'

import * as S from './styled'

function dateConverter(date: string) {
  return new Date(date).toLocaleDateString(navigator.language, {
    day: 'numeric',
    month: 'numeric',
    year: 'numeric',
  })
}

type PassportViewProps = {
  data: PassportModel;
};

export function PassportView(props: PassportViewProps) {
  const { data } = props

  const [imageToView, setImageToView] = useState<string | null>(null)

  return (
    <FormGroup title="Паспортные данные">
      <Stack gap={16}>
        <img
          src={data.passport_photo}
          alt="passport"
          onClick={() => setImageToView(data.passport_photo)}
        />
        <div style={{ flex: 1 }}>
          <FormGroupControl>
            <S.Field>{data.passport_full_name}</S.Field>
          </FormGroupControl>

          <GroupRow>
            <FormGroupControl>
              <S.Field>{data.passport_series}</S.Field>
            </FormGroupControl>

            <FormGroupControl>
              <S.Field>{data.passport_number}</S.Field>
            </FormGroupControl>

            <FormGroupControl>
              <S.Field>{dateConverter(data.passport_issue_date)}</S.Field>
            </FormGroupControl>
          </GroupRow>

          <FormGroupControl>
            <S.Field>{data.passport_who_issued}</S.Field>
          </FormGroupControl>
        </div>
      </Stack>

      {imageToView && <ImageViewDialog src={imageToView} onOpenChange={val => setImageToView(val ? imageToView : null)} open={!!imageToView} title='Паспорт'></ImageViewDialog>}
    </FormGroup>
  )
}
