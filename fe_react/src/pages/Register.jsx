import React, { useState } from 'react';
import { useHistory } from 'react-router-dom';
import { Box, Button, FormField, TextInput, ThemeContext } from 'grommet';

// Services
import { registerUser } from '../services/applicationServices';

const Register = () => {
  const [credentials, setCredentials] = useState({
    emailAddress: '',
    password: '',
  });
  const { push } = useHistory();
  const register = async () => {
    await registerUser(credentials);
    push('/examiner/login');
  };
  const onChange = (value) => {
    setCredentials({ ...credentials, ...value });
  };
  return (
    <>
      <Box
        width='400px'
        margin={{ vertical: '10%', horizontal: 'auto' }}
        elevation='medium'
        pad='medium'>
        <ThemeContext.Extend
          value={{
            formField: {
              border: { position: 'inner', side: 'all' },
            },
          }}>
          <FormField label='First Name'>
            <TextInput
              placeholder='Margot'
              type='text'
              value={credentials.firstName}
              onChange={(event) => onChange({ firstName: event.target.value })}
            />
          </FormField>
          <FormField label='Last Name'>
            <TextInput
              placeholder='Tennenbaum'
              type='text'
              value={credentials.lastName}
              onChange={(event) => onChange({ lastName: event.target.value })}
            />
          </FormField>
          <FormField label='Username'>
            <TextInput
              placeholder='margot@email.com'
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
          <Button color='primary' label='Register' primary onClick={register} />
        </Box>
      </Box>
    </>
  );
};

export default Register;
