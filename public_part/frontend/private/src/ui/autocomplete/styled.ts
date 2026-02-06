import styled from '@emotion/styled'

export const ItemsContainer = styled.div`
  display: flex;
  flex-direction: column;
  gap: 8px;
  overflow-y: auto;
  max-height: 240px;
  border: 1px solid #9a9fb6;
  border-radius: 8px;
  padding: 8px;
  background-color: #121629;
  box-shadow: 0 4px 8px 0 rgba(0, 0, 0, 0.2), 0 6px 20px 0 rgba(0, 0, 0, 0.19);
`

export const NoResults = styled.div`
  font-size: 14px;
  padding: 8px;
  color: #9a9fb6;
  text-align: center;
`
