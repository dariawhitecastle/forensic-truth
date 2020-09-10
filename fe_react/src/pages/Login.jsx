import React, { useState } from 'react';
import { useHistory } from 'react-router-dom';

import {
  Box,
  Button,
  FormField,
  Image,
  TextInput,
  ThemeContext,
} from 'grommet';

// Services
import { authenticate } from '../services/applicationServices';

const Login = () => {
  const [credentials, setCredentials] = useState({
    emailAddress: '',
    password: '',
  });
  const { push } = useHistory();
  const login = async () => {
    await authenticate(credentials);
    push('/examiner');
  };
  const onChange = (value) => {
    setCredentials({ ...credentials, ...value });
  };
  return (
    <>
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

export default Login;
