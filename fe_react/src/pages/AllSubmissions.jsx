import React, { useState, useEffect, useContext } from 'react';
import { observer } from 'mobx-react';
import { useHistory } from 'react-router-dom';
import * as R from 'ramda';

import { Button, Box, Text, DataTable, Image, DropButton } from 'grommet';
import { DocumentDownload } from 'grommet-icons';

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
  const [showMenu, setShowMenu] = useState(false);

  console.log(selectedSubmissionId);

  const handleRowClick = (row, route) => {
    setSelectedSubmissionId(row.id);
    push(route);
  };

  const dropMenuItems = () => (
    <Box>
      <Button plain>
        <Box pad='small' direction='row' align='center'>
          <Text>Report only</Text>
        </Box>
      </Button>
      <Button plain>
        <Box pad='small' direction='row' align='center'>
          <Text>Full package</Text>
        </Box>
      </Button>
      <Button plain>
        <Box pad='small' direction='row' align='center'>
          <Text>View report</Text>
        </Box>
      </Button>
    </Box>
  );

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
          color='primary'
          onClick={() => handleRowClick(row, '/examiner')}>
          <Box pad={{ horizontal: 'small', vertical: 'xsmall' }}>
            <Text>Add Notes</Text>
          </Box>
        </Button>
      ),
      size: 'small',
    },
    {
      property: 'report',
      header: <Text>Report</Text>,
      render: (row) => (
        <Button
          primary
          color='primary'
          disabled={row.notes.length < 37}
          onClick={() => handleRowClick(row, '/report')}>
          <Box pad={{ horizontal: 'small', vertical: 'xsmall' }}>
            <Text>Write Report</Text>
          </Box>
        </Button>
      ),
      size: 'small',
    },
    {
      property: 'download',
      header: <Text>Download</Text>,
      render: (row) => (
        <DropButton
          alignSelf='center'
          margin={{ horizontal: '25%' }}
          dropContent={dropMenuItems()}
          dropProps={{ align: { right: 'right', top: 'bottom' } }}
          onClick={() => setShowMenu(!showMenu)}>
          <Box pad='small'>
            <DocumentDownload />
          </Box>
        </DropButton>
      ),
      size: 'xsmall',
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
