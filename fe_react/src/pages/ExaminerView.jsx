import React, { useState } from 'react';
import {
  Box,
  Button,
  FormField,
  Image,
  TextInput,
  ThemeContext,
} from 'grommet';

// Componenets
import { StyledHeader } from './Form.styled';

// Assets
import logo from '../assets/logo.jpg';

// Services
import { authenticate } from '../services/applicationServices';
import { set } from 'mobx';

const ExaminerView = () => {
  const [credentials, setCredentials] = useState({
    emailAddress: '',
    password: '',
  });
  const login = () => {
    authenticate(credentials);
  };
  const onChange = (value) => {
    setCredentials({ ...credentials, ...value });
  };
  return (
    <>
      <StyledHeader
        elevation='xlarge'
        direction='row'
        align='center'
        justify='between'
        pad={{ horizontal: 'medium', vertical: 'small' }}>
        <Image src={logo} height='40' width='200' />
      </StyledHeader>
      <Box
        width='400px'
        margin={{ vertical: '15%', horizontal: 'auto' }}
        elevation='medium'
        pad='medium'>
        <ThemeContext.Extend
          value={{
            formField: {
              border: { position: 'inner', side: 'all', radius: '5px' },
            },
          }}>
          <FormField label='Username'>
            <TextInput
              placeholder='email@email.com'
              type='email'
              value={credentials.username}
              onChange={(event) =>
                onChange({ emailAddress: event.target.value })
              }
            />
          </FormField>
          <FormField label='Password'>
            <TextInput
              placeholder='Password'
              type='password'
              value={credentials.password}
              onChange={(event) => onChange({ password: event.target.value })}
            />
          </FormField>
        </ThemeContext.Extend>
        <Box margin={{ vertical: 'small', horizontal: 'xlarge' }}>
          <Button color='primary' label='Login' primary onClick={login} />
        </Box>
      </Box>
    </>
  );
};

export default ExaminerView;
