import styled from '@emotion/styled'

export const Textarea = styled.textarea`
  color: white;
  border: none;
  font-size: 20px;
  height: 96px;
  resize: vertical;
  min-height: 48px;
  width: 100%;
  border-radius: 24px;
  color-scheme: dark;
  padding: 24px;
  padding: 12px 24px;

  transition: background-color, outline, 0.3s ease;
  background-color: #b7bacb;
  outline: 1px solid transparent;

  &:focus {
    background-color: #c5c9d3;
    outline: 1px solid #fff;
  }
`
