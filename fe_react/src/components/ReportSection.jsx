import React from 'react';
import { toJS } from 'mobx';
import { Box, Text, TextArea } from 'grommet';
import * as R from 'ramda';

import { ReportSectionHeaders } from '../utils/constants';

const SubmissionSection = ({ answers, id, savedNote }) => {
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

  const sectionHeader = (question) => {
    console.log(toJS(question));
    const header = R.find(
      R.propEq('questionId', question.id),
      ReportSectionHeaders
    );
    return header?.description;
  };
  return (
    <Box
      pad={{ vertical: 'medium' }}
      align='start'
      justify='start'
      style={{ display: 'inline' }}>
      {answers.map((singleAnswer) => {
        const reportHeader = sectionHeader(singleAnswer.question);

        return singleAnswer.question.type === 'table' ? (
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
            <Text weight='bold' textAlign='start'>
              {singleAnswer.question.description}
            </Text>
            <Text>{singleAnswer.body}</Text>
            {reportHeader ? <Text>{reportHeader}</Text> : null}
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
            <Text textAlign='start' weight='bold'>
              {singleAnswer.question.description}
            </Text>
            <Text>
              {formatAnswer(singleAnswer.body, singleAnswer.question.type)}
            </Text>
            {reportHeader ? <Text>{reportHeader}</Text> : null}
          </Box>
        );
      })}

      <Text>{` Examiner notes: ${savedNote?.body}`}</Text>
    </Box>
  );
};

export default SubmissionSection;
