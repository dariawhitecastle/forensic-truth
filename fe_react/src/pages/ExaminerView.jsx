import React, { useState, useContext, useEffect } from 'react';
import { observer } from 'mobx-react';

import { Box, Grid, Heading } from 'grommet';

// Store
import { ExaminerStoreContext } from '../stores/examinerStore';

// Componenets
import { StyledSidebar, MainComponent } from './Form.styled';
import SidebarNav from '../components/Sidebar';

const ExaminerView = observer(() => {
  const {
    getQuestions,
    fetchSubmission,
    sortedSectionList,
    currentSubmission,
  } = useContext(ExaminerStoreContext);
  const [currentStep, setCurrentStep] = useState(1);

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
    !!sortedSectionList.length && setCurrentStep(sortedSectionList[0].id);
  }, [sortedSectionList]);

  return (
    <Grid
      fill
      rows={['auto', 'flex']}
      columns={['auto', 'flex']}
      areas={[
        { name: 'sidebar', start: [0, 1], end: [0, 1] },
        { name: 'main', start: [1, 1], end: [1, 1] },
      ]}>
      {!!sortedSectionList.length && (
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
      <MainComponent gridArea='main' justify='center' align='center'>
        <Box fill>
          {sortedSectionList.map((section) => (
            <div id={section.id} key={section.id}>
              <Heading level={4} size='large'>
                {section.title}
              </Heading>
              {section.questions.map((question) => (
                <Box key={question.id}>{question.description}</Box>
              ))}
            </div>
          ))}
        </Box>
      </MainComponent>
    </Grid>
  );
});

export default ExaminerView;
