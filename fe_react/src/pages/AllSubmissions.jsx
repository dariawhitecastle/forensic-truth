import React, { useState, useEffect, useContext } from 'react';
import { observer } from 'mobx-react';
import { useHistory } from 'react-router-dom';
import * as R from 'ramda';

import { Button, Box, Text, DataTable, Image } from 'grommet';

// Store
import { ExaminerStoreContext } from '../stores/examinerStore';

// Components
import ErrorPopup from '../components/ErrorPopup';

// Assets
import { StyledHeader } from './Form.styled';
import logo from '../assets/logo.jpg';

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
    apiError,
    fetchAllSubmissions,
    resetNotes,
    selectedSubmissionId,
    setApiError,
  } = useContext(ExaminerStoreContext);
  const [submissions, setSubmissions] = useState([]);
  const { push } = useHistory();

  const handleRowClick = (row, route) => {
    setSelectedSubmissionId(row.id);
    push(route);
  };

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
      property: 'notes',
      header: <Text>Notes</Text>,
      render: (row) => (
        <Button
          primary
          // disabled={row.notes.length < 40}
          color='primary'
          label='Notes'
          onClick={() => handleRowClick(row, '/examiner')}
        />
      ),
      size: 'xsmall',
    },
    {
      property: 'report',
      header: <Text>Report</Text>,
      render: (row) => (
        <Button
          secondary
          // disabled={row.notes.length < 40}
          color='primary'
          label='Write report'
          onClick={() => handleRowClick(row, '/report')}
        />
      ),
      size: 'small',
    },
  ];

  useEffect(() => {
    resetNotes();
  }, [selectedSubmissionId]);

  useEffect(() => {
    if (!allSubmissions.length) fetchAllSubmissions();
  }, []);

  useEffect(() => {
    setSubmissions(formatData(allSubmissions));
  }, [allSubmissions.length]);

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
          />
        ) : (
          <Text> No Submissions</Text>
        )}
        {apiError && <ErrorPopup setError={setApiError} />}
      </Box>
    </>
  );
});

export default AllSubmissions;
