import React, { useContext, useState } from 'react';
import { useHistory } from 'react-router-dom';
import { observer } from 'mobx-react';

import { Box, Button, FormField, Text, TextInput, ThemeContext } from 'grommet';

// Services
import { ApplicationStoreContext } from '../stores/applicationStore';

const Login = observer(() => {
  const { loginError, setLoginError, handleLogin } = useContext(
    ApplicationStoreContext
  );

  const [credentials, setCredentials] = useState({
    emailAddress: '',
    password: '',
  });
  const { push } = useHistory();

  const login = async () => {
    await handleLogin(credentials);
    push('/examiner');
  };
  const onChange = (value) => {
    setLoginError(false);
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
              type='email'
              value={credentials.username}
              onChange={(event) =>
                onChange({ emailAddress: event.target.value })
              }
            />
          </FormField>
          <FormField label='Password'>
            <TextInput
              type='password'
              value={credentials.password}
              onChange={(event) => onChange({ password: event.target.value })}
            />
          </FormField>
          {loginError && (
            <Box>
              <Text color='status-error' size='small'>
                Email or password is incorrect. Please try again.
              </Text>
            </Box>
          )}
        </ThemeContext.Extend>
        <Box margin={{ vertical: 'small', horizontal: 'xlarge' }}>
          <Button color='primary' label='Login' primary onClick={login} />
        </Box>
      </Box>
    </>
  );
});

export default Login;
