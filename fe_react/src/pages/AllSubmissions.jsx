import React, { useState, useEffect, useContext } from 'react';
import { observer } from 'mobx-react';
import { useHistory } from 'react-router-dom';
import * as R from 'ramda';

import { Button, Box, Text, DataTable, Image } from 'grommet';
import { StatusGood } from 'grommet-icons';

// Store
import { ExaminerStoreContext } from '../stores/examinerStore';

// Assets
import { StyledHeader } from './Form.styled';
import logo from '../assets/logo.jpg';

const columns = [
  {
    property: 'lastName',
    header: <Text>Last Name</Text>,
    size: 'medium',
  },
  {
    property: 'firstName',
    header: <Text>First Name</Text>,
    size: 'medium',
  },
  {
    property: 'ssn',
    header: <Text> Last 4 digits of SSN</Text>,
    size: 'medium',
  },
  {
    property: 'date',
    header: <Text>Date</Text>,
    size: 'small',
  },
  {
    header: <Text>Done</Text>,
    render: (row) => (
      <Box align='center'>
        <StatusGood
          size='medium'
          color={row.notes.length >= 41 ? 'success' : 'grey'}
        />
      </Box>
    ),
  },
  {
    render: (row) => (
      <Button
        primary
        disabled={row.notes.length < 41}
        color='primary'
        label='Write report'
        onClick={() => console.log('writing report')}
      />
    ),
    size: 'small',
  },
];

const formatData = (submissions) =>
  submissions.map((submission) => {
    const { answer } = submission;
    const submissionData = [
      ['notes', submission.note],
      ['date', submission.date],
      ['id', submission.id],
    ];
    const answers = answer.map(({ question: { id }, body }) =>
      R.cond([
        [R.equals(1), R.always(['firstName', body])],
        [R.equals(3), R.always(['lastName', body])],
        [R.equals(9), R.always(['ssn', body])],
      ])(id)
    );
    return R.length(answers)
      ? R.fromPairs([...answers, ...submissionData])
      : {};
  });

const AllSubmissions = observer(() => {
  const {
    setSelectedSubmissionId,
    allSubmissions,
    fetchAllSubmissions,
    resetNotes,
    selectedSubmissionId,
  } = useContext(ExaminerStoreContext);
  const [submissions, setSubmissions] = useState([]);
  const { push } = useHistory();

  useEffect(() => {
    resetNotes();
  }, [selectedSubmissionId]);

  useEffect(() => {
    if (!allSubmissions.length) fetchAllSubmissions();
  }, []);

  useEffect(() => {
    setSubmissions(formatData(allSubmissions));
  }, [allSubmissions.length]);

  const handleRowClick = (row) => {
    setSelectedSubmissionId(row.id);
    push('/examiner');
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
        pad='large'
        height='50%'
        align='center'
        margin={{ top: '10%', horizontal: 'auto' }}>
        {submissions.length ? (
          <DataTable
            border
            columns={columns.map((c) => ({
              ...c,
              search:
                c.property === 'firstName' ||
                c.property === 'lastName' ||
                c.property === 'ssn',
            }))}
            data={submissions}
            onClickRow={(event) => handleRowClick(event.datum)}
          />
        ) : (
          <Text> No Submissions</Text>
        )}
      </Box>
    </>
  );
});

export default AllSubmissions;
