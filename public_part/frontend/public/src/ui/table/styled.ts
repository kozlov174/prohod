import styled from '@emotion/styled'

export const Tr = styled.tr`
  height: 48px;
  /* border-bottom: 1px solid #9a9fb6; */

  ${(props) =>
    props.onClick &&
    `
    &:hover {
      background-color: #6bc8f4;
      cursor: pointer;
    }
  `}
`
export const Td = styled.td`
  padding: 8px;
  border: 1px solid #9a9fb6;
`
export const Th = styled.th`
  padding: 8px;
  align-content: center;
`
export const Tbody = styled.tbody``
export const Table = styled.table`
  border: 1px solid #9a9fb6;
  border-radius: 8px;
`
export const Thead = styled.thead``
