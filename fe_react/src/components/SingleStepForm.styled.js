import styled from 'styled-components';
import { Box, FormField, RadioButtonGroup } from 'grommet';

export const StyledFormWrapper = styled(Box)`
  text-align: start;
  padding: 8px 24px 16px 24px;
`;
export const StyledFormField = styled(FormField)`
  input::-webkit-outer-spin-button,
  input::-webkit-inner-spin-button {
    /* display: none; <- Crashes Chrome on hover */
    -webkit-appearance: none;
    margin: 0;
  }

  input[type='number'] {
    -moz-appearance: textfield; /* Firefox */
  }
`;
export const StyledRadioButtonGroup = styled(RadioButtonGroup)`
  margin-left: 10px;
  flex-direction: row;
`;
