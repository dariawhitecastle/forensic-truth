import React from 'react';
import { Box, Text, TextArea } from 'grommet';
import * as R from 'ramda';

const SubmissionSection = ({ answers }) => (
  <Box pad={{ horizontal: 'large', vertical: 'small' }} align='start'>
    {answers.map((singleAnswer) => (
      <Box align='start' pad={{ vertical: 'small' }}>
        <Text weight='bold'>{singleAnswer.question.description}</Text>
        <Text>{singleAnswer.body}</Text>
      </Box>
    ))}

    <TextArea>Examiner notes here </TextArea>
  </Box>
);

export default SubmissionSection;
