import React, { Fragment } from 'react';
import { Box, Text, Button } from 'grommet';
import * as R from 'ramda';
import { Add } from 'grommet-icons';
import { toJS } from 'mobx';

import { ReportSectionHeaders } from '../utils/constants';
import { StyledTextInput, ExaminerNotes } from './ReportSection.styled';

const FormattedNotes = ({ savedNote }) => {
  return savedNote
    ? savedNote.body.split('//').map((note) => (
        <Box direction='row' key='note'>
          <Text color='success'>{note}</Text>
        </Box>
      ))
    : null;
};

const ReportSection = ({ questionId, reportHeader, onChange, report }) => {
  if (!reportHeader) return null;
  const handleReportSectionChange = (e) => {
    onChange(questionId, e.target.value);
  };

  const onAddMore = () => {
    console.log('add more');
  };

  return (
    <Box margin={{ vertical: 'medium' }}>
      <Text weight='bold'>{reportHeader}</Text>
      <Box margin={{ vertical: 'medium' }} width='large' direction='row'>
        <StyledTextInput
          name={questionId}
          value={report[questionId]}
          onChange={handleReportSectionChange}
          placeholder='Enter report notes'
        />
        <Button primary color='primary' icon={<Add />} onClick={onAddMore} />
      </Box>
    </Box>
  );
};

const TableCell = ({ singleAnswer }) => {
  return (
    <Box
      margin={{ vertical: 'medium' }}
      direction='column'
      style={{ display: 'inline-flex' }}
      align='start'
      justify='start'
      width={
        singleAnswer.question.width ? `${singleAnswer.question.width}%` : '23%'
      }>
      <Text textAlign='start' color='primary' weight='bold'>
        {singleAnswer.question.description}
      </Text>
      <Text color='primary'>{singleAnswer.body}</Text>
    </Box>
  );
};

const Section = ({ answers, id, savedNote, onChange, report }) => {
  const lastSection = answers[0].question.section.id === 8;
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

  const sectionHeader = (question) =>
    R.compose(
      R.prop('description'),
      R.find(R.propEq('questionId', question.id))
    )(ReportSectionHeaders);

  return (
    <Box
      pad={{ vertical: 'medium' }}
      align='start'
      justify='start'
      style={{ display: 'inline' }}>
      {answers.map((singleAnswer, idx) => {
        const reportHeader = sectionHeader(singleAnswer.question);
        const tableType = singleAnswer.question.type === 'table';
        const lastQuestion = singleAnswer.question.id === 131;

        if (tableType) {
          const followedByNonTableType =
            answers[idx - 1]?.question.type !== 'table';
          return (
            <Fragment key={singleAnswer.id}>
              {followedByNonTableType ? (
                <ReportSection
                  questionId={singleAnswer.question.id}
                  reportHeader={reportHeader}
                  onChange={onChange}
                  report={report}
                />
              ) : null}
              <TableCell singleAnswer={singleAnswer} />
            </Fragment>
          );
        }

        return (
          <Fragment key={singleAnswer.id}>
            {!lastQuestion && (
              <ReportSection
                questionId={singleAnswer.question.id}
                reportHeader={reportHeader}
                onChange={onChange}
                report={report}
              />
            )}
            <Box
              align='start'
              style={{ display: 'inline-flex' }}
              pad={{ vertical: 'small' }}
              width={
                singleAnswer.question.width
                  ? `${singleAnswer.question.width}%`
                  : '100%'
              }>
              <Text textAlign='start' color='primary' weight='bold'>
                {singleAnswer.question.description}
              </Text>
              <Text color='primary'>
                {formatAnswer(singleAnswer.body, singleAnswer.question.type)}
              </Text>
              {lastQuestion && (
                <ReportSection
                  questionId={singleAnswer.question.id}
                  reportHeader={reportHeader}
                  onChange={onChange}
                  report={report}
                />
              )}
            </Box>
          </Fragment>
        );
      })}
      {lastSection ? (
        <ReportSection
          questionId={132}
          reportHeader='ADDITIONAL NOTES BY EXAMINER'
          onChange={onChange}
          report={report}
        />
      ) : (
        <Box margin={{ vertical: 'medium' }}>
          <ExaminerNotes color='red' weight='bold'>
            Examiner notes
          </ExaminerNotes>
          <FormattedNotes savedNote={savedNote} />
        </Box>
      )}
    </Box>
  );
};

export default Section;
