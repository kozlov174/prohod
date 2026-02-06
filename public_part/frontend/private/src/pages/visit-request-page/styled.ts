import styled from '@emotion/styled'

export const Root = styled.div`
  padding: 24px 0;
`

export const Actions = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-top: 24px;
`

export const FormControlGroup = styled.div`
  display: flex;
  gap: 16px;
`

export const Button = styled.button`
  padding: 8px 16px;
  border-radius: 4px;
  background: #007bff;
  color: white;
  border: none;
  cursor: pointer;
  font-size: 14px;
  transition: background-color 0.2s;

  &:hover {
    background: #0056b3;
  }

  &:disabled {
    background: #ccc;
    cursor: not-allowed;
  }
`
