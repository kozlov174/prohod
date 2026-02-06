import styled from '@emotion/styled'

export const Field = styled.div`
  padding: 8px 16px;
  border-radius: 24px;
  background-color: #b7bacb;
  color: white;
`

export const TwoColumnLayout = styled.div`
  display: flex;
  gap: 24px;
  width: 100%;

  @media (max-width: 768px) {
    flex-direction: column;
    gap: 16px;
  }
`

export const PhotoColumn = styled.div`
  flex: 1;
  max-width: 40%;
  display: flex;
  flex-direction: column;

  @media (max-width: 768px) {
    max-width: 100%;
  }
`

export const DataColumn = styled.div`
  flex: 2;
  max-width: 60%;

  @media (max-width: 768px) {
    max-width: 100%;
  }
`

export const PhotoContainer = styled.div`
  display: flex;
  flex-direction: column;
  gap: 12px;
  position: sticky;
  top: 24px;
  height: 60vh;
  min-height: 400px;
  max-height: 600px;

  & > img {
    width: 100%;
    height: 100%;
    object-fit: contain;
    border-radius: 16px;
    cursor: pointer;
  }

  @media (max-width: 768px) {
    position: static;
    height: auto;
    min-height: 300px;
  }
`
