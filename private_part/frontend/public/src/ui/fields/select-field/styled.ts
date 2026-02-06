import styled from '@emotion/styled'

export const Select = styled.select`
  border: none;
  border-radius: 24px;
  padding: 8px 16px;
  font-size: 16px;
  width: 100%;
  height: 48px;
  margin: unset;
  padding-right: 24px;
  background-color: #a6aabf;
  color: white;
  appearance: none;

  transition: all 0.3s ease;
  outline: 1px solid transparent;

  &:focus {
    background-color: #c5c9d3;
    outline: 1px solid #fff;
  }
`

export const Root = styled.div`
  color: white;
  display: flex;
  position: relative;
`

export const Arrow = styled.div`
  position: absolute;
  right: 16px;
  top: 50%;
  transform: translateY(-50%);
  border-left: 5px solid transparent;
  border-right: 5px solid transparent;
  border-top: 6px solid white;
  transition: transform ease-in-out 0.3s;
  pointer-events: none;
`
