import * as S from './styled'
import { IconButton } from '../../ui/icon-button/icon-button'
import { DeleteIcon, SyncIcon } from '../../ui/icons'

type ImagePreviewProps = {
  src: string;
  name: string;
  onRemove: () => void;
  onEdit: () => void;
  maxHeight?: string;
};

export function ImagePreview(props: ImagePreviewProps) {
  const { src, name, onRemove, onEdit, maxHeight } = props
  return (
    <S.Root>
      <S.ImagePreview src={src} alt={name} maxHeight={maxHeight} />
      <S.BackgroundBlur src={src} alt={name} />
      <S.Overlay>
        <S.HeaderContainer>
          <S.Title>{name}</S.Title>
          <S.Actions>
            <IconButton onClick={onEdit}>
              <SyncIcon>Редактировать</SyncIcon>
            </IconButton>
            <IconButton onClick={onRemove}>
              <DeleteIcon>Удалить</DeleteIcon>
            </IconButton>
          </S.Actions>
        </S.HeaderContainer>
      </S.Overlay>
    </S.Root>
  )
}
