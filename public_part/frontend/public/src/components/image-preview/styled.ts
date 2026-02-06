import styled from '@emotion/styled'

export const Root = styled.div`
  border-radius: 8px;
  overflow: hidden;
  position: relative;
`

export const ImagePreview = styled.img<{ maxHeight?: string }>`
  width: 100%;
  height: 100%;
  position: relative;
  object-fit: contain;
  z-index: 10;
  max-height: ${({ maxHeight }) => maxHeight || '100%'};
`

export const Overlay = styled.div`
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  z-index: 100;
`

export const BackgroundBlur = styled.img`
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  width: 100%;
  height: 100%;
  object-fit: cover;
  filter: blur(10px);
  z-index: 1;
  opacity: 0.5;
  zoom: 2;
`

export const HeaderContainer = styled.div`
  background: #0000006b;
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 8px;
`

export const Title = styled.div`
  font-size: 24px;
`

export const Actions = styled.div`
  display: flex;
  gap: 16px;
`
