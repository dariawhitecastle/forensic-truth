import React, { useState, useEffect } from 'react';
import { Box, Text, TextArea } from 'grommet';
import * as R from 'ramda';

const SubmissionSection = ({ answers, autoSave, id, savedNote }) => {
  const [noteText, setNoteText] = useState();

  // ever 5 minutes autoSave to Store
  useEffect(() => { 
    const timer = setTimeout(() => {
    autoSave(id, noteText);
    }, 15000);
    return() => clearTimeout(timer)
  }, [noteText])
 

  const formatAnswer = (answer) =>  R.cond([
    [R.equals('true'), R.always('YES')],
    [R.equals('false'), R.always('NO')],
    [R.T, R.always(answer)]
  ])(answer)

 
  return (
    <Box pad={{ horizontal: 'large', vertical: 'small' }} align='start'>
      {answers.map((singleAnswer) => (
        <Box align='start' pad={{ vertical: 'small' }} key={singleAnswer.id}>
          <Text weight='bold'>{singleAnswer.question.description}</Text>
          <Text>{formatAnswer(singleAnswer.body)}</Text>
          
        </Box>
      ))}

      <TextArea placeholder='Examiner Notes here' value={savedNote} onChange={(e) => setNoteText(e.target.value)} />
    </Box>
  );
};

export default SubmissionSection;
