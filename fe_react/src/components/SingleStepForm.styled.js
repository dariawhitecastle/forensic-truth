import styled from 'styled-components'
import { Box, FormField, RadioButtonGroup } from 'grommet'

export const StyledFormWrapper = styled(Box)`
  text-align: start;
  padding: 8px 24px 16px 24px;
`
export const StyledDateFormField = styled(FormField)`
  input {
    margin-top: -6px;
  }
`
export const StyledRadioButtonGroup = styled(RadioButtonGroup)`
  margin-left: 10px;
  flex-direction: row;
`
