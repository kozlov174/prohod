import styled from '@emotion/styled'

export const Root = styled.div`
  margin: 0 auto;
  padding: 0 16px;
  max-width: 1200px;
  width: 100%;
  box-sizing: border-box;

  @media (max-width: 1200px) {
    max-width: 90%;
  }

  @media (max-width: 768px) {
    max-width: 100%;
    padding: 0 8px;
  }
`
