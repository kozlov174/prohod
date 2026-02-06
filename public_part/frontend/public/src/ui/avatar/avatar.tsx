import styled from '@emotion/styled'

// Создаем стилизованный компонент Avatar
export const Avatar = styled.div<{ src?: string; size?: string }>`
  width: ${(props) => props.size || '32px'};
  height: ${(props) => props.size || '32px'};
  background-color: #ccc; /* Цвет фона, если нет изображения */
  border-radius: 50%; /* Круглая форма */
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 14px;
  font-weight: bold;
  color: #fff;
  overflow: hidden;

  // Если передан src, отображаем изображение
  background-image: ${(props) => (props.src ? `url(${props.src})` : 'none')};
  background-size: cover;
  background-position: center;
`
