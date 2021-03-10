import styled from 'styled-components';
import { TextInput, Text } from 'grommet';

export const StyledTextInput = styled(TextInput)`
  border: none;
  border-radius: 0;
  border-bottom: 1px solid grey;
  &:focus {
    box-shadow: none;
  }
`;

export const ExaminerNotes = styled(Text)`
  font-family: 'Lato';
`;
