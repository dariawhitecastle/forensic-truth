import React, { useState, useEffect, useContext } from 'react';
import { observer } from 'mobx-react';
import { useHistory } from 'react-router-dom';
import * as R from 'ramda';

import { Box, Text, DataTable } from 'grommet';

// Store
import { fetchAllSubmissions } from '../services/applicationServices';
import { ExaminerStoreContext } from '../stores/examinerStore';

const columns = [
  {
    property: 'id',
    header: <Text>Submission Id</Text>,
    size: 'small',
    primary: true,
  },
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
];

const formatData = (submissions) =>
  submissions.map((submission) => {
    const { answer } = submission;
    const submissionData = [
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
  const { setSelectedSubmissionId } = useContext(ExaminerStoreContext);
  const [submissions, setSubmissions] = useState([]);
  const { push } = useHistory();

  useEffect(() => {
    fetchAllSubmissions().then((data) => setSubmissions(formatData(data)));
  }, []);

  const handleRowClick = (row) => {
    setSelectedSubmissionId(row.id);
    push('/examiner');
  };

  return (
    <Box
      pad='large'
      height='50%'
      align='center'
      margin={{ top: '10%', horizontal: 'auto' }}>
      {submissions.length ? (
        <DataTable
          columns={columns.map((c) => ({
            ...c,
            search: c.property === 'firstName' || c.property === 'lastName',
          }))}
          data={submissions}
          onClickRow={(event) => handleRowClick(event.datum)}
        />
      ) : (
        <Text> No Submissions</Text>
      )}
    </Box>
  );
});

export default AllSubmissions;
