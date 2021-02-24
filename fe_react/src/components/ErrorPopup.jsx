import React from 'react';
import { Box, Button, Layer, Text } from 'grommet';
import { CircleAlert, FormClose } from 'grommet-icons';

const ErrorPopup = ({ setError }) => (
  <Layer
    position='bottom'
    modal={false}
    margin={{ vertical: 'medium', horizontal: 'small' }}
    onEsc={() => setError(false)}
    responsive={false}
    plain>
    <Box
      align='center'
      direction='row'
      gap='small'
      justify='between'
      round='medium'
      elevation='medium'
      pad={{ vertical: 'xsmall', horizontal: 'small' }}
      background='status-error'>
      <Box align='center' direction='row' gap='xsmall'>
        <CircleAlert />
        <Text>Oops! Changes were not saved. Please refresh and try again.</Text>
      </Box>
      <Button icon={<FormClose />} onClick={() => setError(false)} plain />
    </Box>
  </Layer>
);

export default ErrorPopup;
