import styled from 'styled-components'
import { Box } from 'grommet'

export const MainComponent = styled(Box)`
  position: absolute;
  top: 69px;
  bottom: 95px;
  left: 250px;
  right: 0;
  overflow-y: scroll;
  ::-webkit-scrollbar {
    -webkit-appearance: none;
    width: 7px;
  }

  ::-webkit-scrollbar-thumb {
    border-radius: 4px;
    background-color: rgba(0, 0, 0, 0.5);
    box-shadow: 0 0 1px rgba(255, 255, 255, 0.5);
  }
`
export const StyledHeader = styled(Box)`
  position: fixed;
  left: 0;
  right: 0;
  display: flex;
  justify-content: space-between
`
export const StyledSidebar = styled(Box)`
  position: fixed;
  overflow-y: scroll;
  top: 69px;
  bottom: 0;
`
