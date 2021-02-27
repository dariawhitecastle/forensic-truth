import styled from 'styled-components';
import { FormField, TextInput } from 'grommet';

export const StyledFormField = styled(FormField)`
  flex-direction: row;
  align-items: flex-end;
  label {
    width: 200px;
    margin: 0;
    margin-right: 20px;
  }
  div {
    height: 30px;
  }
`;
