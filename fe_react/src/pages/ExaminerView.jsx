import React, { useState, useContext, useEffect } from 'react';
import { observer } from 'mobx-react';
import { toJS } from 'mobx';
import { useHistory, Prompt } from 'react-router-dom';
import * as R from 'ramda';

import { Box, Button, Grid, Heading, Image, Layer, Text } from 'grommet';
import { Send, CircleAlert, FormClose } from 'grommet-icons';

// Store
import { ExaminerStoreContext } from '../stores/examinerStore';

// Componenets
import SidebarNav from '../components/Sidebar';
import SubmissionSection from '../components/SubmissionSection';

// Assets
import { StyledSidebar, StyledHeader, MainComponent } from './Form.styled';
import logo from '../assets/logo.jpg';

const ExaminerView = observer(() => {
  const {
    getQuestions,
    setNotes,
    notes,
    notesError,
    hydrated,
    fetchSubmission,
    setNotesError,
    sortedSectionList,
    sortedAnswers,
    notesByAnswerGroup,
    submitNotes,
  } = useContext(ExaminerStoreContext);
  const [currentStep, setCurrentStep] = useState(1);
  const [answers, setAnswers] = useState([]);
  const { push } = useHistory();
  const [unsavedChanges, setUnsavedChanges] = useState(false);
  const [savedProgress, setSavedProgress] = useState('Save progress');

  useEffect(() => {
    if (sortedSectionList.length) {
      const intersectionCallback = (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            let step = entry.target.id;
            setCurrentStep(parseInt(step));
          }
        });
      };

      let intersectionObserver = new IntersectionObserver(
        intersectionCallback,
        {
          rootMargin: '0px',
          threshold: 0.1,
        }
      );

      R.map(({ id }) => {
        const target = document.querySelector(`#\\3${id}`);
        intersectionObserver.observe(target);
      })(sortedSectionList);
    }
  }, [sortedSectionList]);

  useEffect(() => {
    getQuestions();
    hydrated && fetchSubmission();
  }, [hydrated]);

  useEffect(() => {
    setAnswers(sortedAnswers);
  }, [sortedAnswers]);

  useEffect(() => {
    !!sortedSectionList.length && setCurrentStep(sortedSectionList[0].id);
  }, [sortedSectionList]);

  const handleSideNavClick = (step) => {
    const el = document.getElementById(step);
    el.scrollIntoView({
      behavior: 'smooth',
      block: 'start',
      inline: 'nearest',
    });
    setCurrentStep(step);
  };

  const getSubsections = R.map((subSection) => {
    const currentAnswerGroup = subSection[0].question.answerGroup;
    const savedNote = R.find(
      R.propEq('answerGroup', currentAnswerGroup),
      notesByAnswerGroup
    );
    const currentNote = savedNote ? savedNote.body : notes[currentAnswerGroup];
    return (
      <SubmissionSection
        key={subSection[0].id}
        id={currentAnswerGroup}
        answers={subSection}
        autoSave={setNotes}
        savedNote={currentNote}
        setUnsavedChanges={setUnsavedChanges}
      />
    );
  });

  const handleSubmitNotes = async () => {
    if (R.isEmpty(notes)) {
      return push('/all-submissions');
    }
    const success = await submitNotes();
    setUnsavedChanges(false);
    success && push('/all-submissions');
  };

  const handleSaveProgress = async () => {
    setUnsavedChanges(false);
    if (R.not(R.isEmpty(notes))) {
      const success = await submitNotes();
      success ? setSavedProgress('Saved') : setSavedProgress('Error');
      setTimeout(() => setSavedProgress('Save progress'), 500);
    }
  };

  return (
    <>
      <Prompt
        message={(_, action) => {
          return action === 'POP' && unsavedChanges
            ? 'You have unsaved changes, are you sure you want to leave?'
            : true;
        }}
      />
      <Grid
        fill
        rows={['auto', 'flex']}
        columns={['auto', 'flex']}
        areas={[
          { name: 'sidebar', start: [0, 1], end: [0, 1] },
          { name: 'main', start: [1, 1], end: [1, 1] },
        ]}>
        <StyledHeader
          elevation='xlarge'
          direction='row'
          align='center'
          justify='between'
          pad={{ horizontal: 'medium', vertical: 'small' }}>
          <Image src={logo} height='40' width='200' />
          <Button
            primary
            label={savedProgress}
            color='primary'
            onClick={handleSaveProgress}
            disabled={!unsavedChanges}
          />
        </StyledHeader>
        {!R.isEmpty(sortedSectionList) && (
          <StyledSidebar
            elevation='xlarge'
            gridArea='sidebar'
            width='250px'
            animation={[
              { type: 'fadeIn', duration: 300 },
              { type: 'slideRight', size: 'xlarge', duration: 150 },
            ]}>
            <SidebarNav
              currentStep={currentStep}
              steps={sortedSectionList}
              handleClickNext={handleSideNavClick}
            />
          </StyledSidebar>
        )}
        <MainComponent gridArea='main'>
          <Box fill align='start' pad='medium'>
            {sortedSectionList.length
              ? sortedSectionList.map((section) => (
                  <div id={section.id} key={section.id}>
                    <Heading level={3} size='large' textAlign='start'>
                      {section.title}
                    </Heading>
                    {hydrated &&
                      !R.isEmpty(answers) &&
                      answers[section.id] &&
                      getSubsections(R.values(answers[section.id]))}
                  </div>
                ))
              : null}

            <Button
              alignSelf='end'
              margin='large'
              size='medium'
              primary
              color='primary'
              icon={<Send />}
              onClick={handleSubmitNotes}
              label='Submit'
            />
          </Box>
          {notesError && (
            <Layer
              position='bottom'
              modal={false}
              margin={{ vertical: 'medium', horizontal: 'small' }}
              onEsc={() => setNotesError(false)}
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
                  <Text>
                    Oops! Changes were not saved. Please refresh and try again.
                  </Text>
                </Box>
                <Button
                  icon={<FormClose />}
                  onClick={() => setNotesError(false)}
                  plain
                />
              </Box>
            </Layer>
          )}
        </MainComponent>
      </Grid>
    </>
  );
});

export default ExaminerView;
