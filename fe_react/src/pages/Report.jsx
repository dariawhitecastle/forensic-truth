import React, { useState, useContext, useEffect } from 'react';
import { observer } from 'mobx-react';
import { useHistory } from 'react-router-dom';
import * as R from 'ramda';

import { Box, Grid, Heading, Image } from 'grommet';

// Store
import { ExaminerStoreContext } from '../stores/examinerStore';

// Components
import SidebarNav from '../components/Sidebar';
import ErrorPopup from '../components/ErrorPopup';
import ReportSection from '../components/ReportSection';
import ReportHeader from '../components/ReportHeader';

// Assets
import { StyledSidebar, StyledHeader, MainComponent } from './Form.styled';
import logo from '../assets/logo.jpg';

const ReportView = observer(() => {
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
    return (
      <ReportSection
        key={subSection[0].id}
        id={currentAnswerGroup}
        answers={subSection}
        savedNote={savedNote}
      />
    );
  });

  return (
    <>
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
            <ReportHeader />
            {sortedSectionList.length
              ? sortedSectionList.map((section) => (
                  <div id={section.id} key={section.id}>
                    {hydrated &&
                      !R.isEmpty(answers) &&
                      answers[section.id] &&
                      getSubsections(R.values(answers[section.id]))}
                  </div>
                ))
              : null}
          </Box>
          {notesError && <ErrorPopup setError={setNotesError} />}
        </MainComponent>
      </Grid>
    </>
  );
});

export default ReportView;
