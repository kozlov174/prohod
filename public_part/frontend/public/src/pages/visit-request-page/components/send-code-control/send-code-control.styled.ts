import styled from '@emotion/styled'

type ResendTextProps = {
  $isActive: boolean;
  $isPending: boolean;
}

export const ResendText = styled.span<ResendTextProps>`
  font-size: 14px;
  color: ${({ $isActive, $isPending }) => {
    if ($isPending) return '#999'
    if ($isActive) return '#007bff'
    return '#666'
  }};
  cursor: ${({ $isActive, $isPending }) => ($isActive && !$isPending ? 'pointer' : 'default')};
  text-decoration: ${({ $isActive, $isPending }) => ($isActive && !$isPending ? 'underline' : 'none')};
  transition: all 0.2s;

  &:hover {
    color: ${({ $isActive, $isPending }) => {
      if ($isActive && !$isPending) return '#0056b3'
      return $isPending ? '#999' : '#666'
    }};
  }
`

export const StatusContainer = styled.div`
  display: flex;
  align-items: center;
  gap: 8px;
  font-size: 14px;
  color: #cccccc;
`

export const StatusMessage = styled.div<{ $type: 'success' | 'error' | 'warning' }>`
  font-size: 14px;
  padding: 8px 12px;
  border-radius: 4px;
  margin-top: 8px;
  background-color: ${({ $type }) => {
    switch ($type) {
      case 'success':
        return '#e6f4ea'
      case 'error':
        return '#fce8e6'
      case 'warning':
        return '#fff3e0'
    }
  }};
  color: ${({ $type }) => {
    switch ($type) {
      case 'success':
        return '#1e7e34'
      case 'error':
        return '#dc3545'
      case 'warning':
        return '#ffa000'
    }
  }};
`

export const ResendButton = styled.button<{ $isActive: boolean }>`
  background: none;
  border: none;
  padding: 0;
  font-size: 14px;
  color: ${({ $isActive }) => ($isActive ? '#6bc8f4' : '#666')};
  cursor: ${({ $isActive }) => ($isActive ? 'pointer' : 'default')};
  text-decoration: ${({ $isActive }) => ($isActive ? 'underline' : 'none')};
  transition: color 0.2s;

  &:hover {
    color: ${({ $isActive }) => ($isActive ? '#0056b3' : '#666')};
  }

  &:disabled {
    opacity: 0.5;
    cursor: not-allowed;
  }
` 