import styled from '@emotion/styled'

export const Actions = styled.div`
  display: flex;
  gap: 16px;
  justify-content: flex-end;
`

export const ActivateButton = styled.button`
  background-color: #2196F3;
  color: white;
  border: none;
  padding: 12px 24px;
  border-radius: 8px;
  font-size: 14px;
  font-weight: 500;
  cursor: pointer;
  transition: background-color 0.2s ease;

  &:hover {
    background-color: #1976D2;
  }

  &:active {
    background-color: #1565C0;
  }
`

export const DeactivateButton = styled.button`
  background-color: #F44336;
  color: white;
  border: none;
  padding: 12px 24px;
  border-radius: 8px;
  font-size: 14px;
  font-weight: 500;
  cursor: pointer;
  transition: background-color 0.2s ease;

  &:hover {
    background-color: #D32F2F;
  }

  &:active {
    background-color: #C62828;
  }
`
