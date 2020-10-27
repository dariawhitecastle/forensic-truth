import React, { useState, useContext, useEffect } from 'react';
import { observer } from 'mobx-react';
import * as R from 'ramda';

import { Box, Grid, Heading } from 'grommet';

// Store
import { ExaminerStoreContext } from '../stores/examinerStore';

// Componenets
import { StyledSidebar, MainComponent } from './Form.styled';
import SidebarNav from '../components/Sidebar';
import SubmissionSection from '../components/SubmissionSection';

const ExaminerView = observer(() => {
  const {
    getQuestions,
    fetchSubmission,
    sortedSectionList,
    sortedAnswers,
  } = useContext(ExaminerStoreContext);
  const [currentStep, setCurrentStep] = useState(1);
  const [answers, setAnswers] = useState();

  const handleSideNavClick = (step) => {
    const el = document.getElementById(step);
    el.scrollIntoView({
      behavior: 'smooth',
      block: 'start',
      inline: 'nearest',
    });
    setCurrentStep(step);
  };

  useEffect(() => {
    getQuestions();
    fetchSubmission();
  }, [getQuestions]);

  useEffect(() => {
    setAnswers(sortedAnswers);
  }, [sortedAnswers]);

  useEffect(() => {
    !!sortedSectionList.length && setCurrentStep(sortedSectionList[0].id);
  }, [sortedSectionList]);

  const getSubsections = R.map((subSection) => (
    <SubmissionSection answers={subSection} />
  ));

  return (
    <Grid
      fill
      rows={['auto', 'flex']}
      columns={['auto', 'flex']}
      areas={[
        { name: 'sidebar', start: [0, 1], end: [0, 1] },
        { name: 'main', start: [1, 1], end: [1, 1] },
      ]}>
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
          {sortedSectionList.map((section) => (
            <div id={section.id} key={section.id}>
              <Heading level={3} size='large' textAlign='start'>
                {section.title}
              </Heading>
              {!R.isEmpty(answers) &&
                answers[section.id] &&
                getSubsections(R.values(answers[section.id]))}
            </div>
          ))}
        </Box>
      </MainComponent>
    </Grid>
  );
});

export default ExaminerView;
