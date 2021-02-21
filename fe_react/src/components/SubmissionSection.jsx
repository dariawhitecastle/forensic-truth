import React, { useState, useEffect } from 'react';
import { Box, Text, TextArea } from 'grommet';
import * as R from 'ramda';

const SubmissionSection = ({
  answers,
  autoSave,
  id,
  savedNote,
  setUnsavedChanges,
}) => {
  const [noteText, setNoteText] = useState();

  // ever 5 seconds autoSave to Store
  useEffect(() => {
    const timer = setTimeout(() => {
      if (noteText) {
        autoSave(id, noteText);
      }
    }, 5000);
    return () => clearTimeout(timer);
  }, [noteText]);

  const formatAnswer = (answer, questionType) => {
    if (questionType === 'checkBoxGroup' && answer) {
      const formattedAnswer = answer.replace(/["\\]/g, '').split('},');
      return formattedAnswer.map((item, index) => {
        const formatted = item.replace(/[{{}}]/g, '').split(',');
        return formatted.length ? (
          <Box direction='row' key={item}>
            <Box direction='row' margin={{ right: 'small' }} width='300px'>
              <Text margin={{ right: 'small' }}>{`${index + 1}.`}</Text>
              <Text>{`Name: ${formatted[0].split(':')[1]}`}</Text>
            </Box>
            <Box>
              <Text>{`Last Used: ${formatted[1].split(':')[1]}`}</Text>
            </Box>
          </Box>
        ) : null;
      });
    }

    return R.cond([
      [R.equals('true'), R.always('YES')],
      [R.equals('false'), R.always('NO')],
      [R.T, R.always(answer)],
    ])(answer);
  };

  const handleOnChange = (e) => {
    setUnsavedChanges(true);
    setNoteText(e.target.value);
  };

  return (
    <Box
      pad={{ vertical: 'medium' }}
      align='start'
      justify='start'
      style={{ display: 'inline' }}>
      {answers.map((singleAnswer) =>
        singleAnswer.question.type === 'table' ? (
          <Box
            key={singleAnswer.id}
            margin={{ vertical: 'medium' }}
            direction='column'
            style={{ display: 'inline-flex' }}
            align='start'
            justify='start'
            width={
              singleAnswer.question.width
                ? `${singleAnswer.question.width}%`
                : '23%'
            }>
            <Text weight='bold'>{singleAnswer.question.description}</Text>
            <Text>{singleAnswer.body}</Text>
          </Box>
        ) : (
          <Box
            align='start'
            style={{ display: 'inline-flex' }}
            pad={{ vertical: 'small' }}
            key={singleAnswer.id}
            width={
              singleAnswer.question.width
                ? `${singleAnswer.question.width}%`
                : '100%'
            }>
            <Text weight='bold'>{singleAnswer.question.description}</Text>
            <Text>
              {formatAnswer(singleAnswer.body, singleAnswer.question.type)}
            </Text>
          </Box>
        )
      )}
      <TextArea
        placeholder='Examiner Notes here'
        value={noteText ?? savedNote}
        onChange={handleOnChange}
      />
    </Box>
  );
};

export default SubmissionSection;
