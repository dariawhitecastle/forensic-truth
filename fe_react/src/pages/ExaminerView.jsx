import React, { useState, useContext, useEffect } from 'react';
import { Box, Grid } from 'grommet';

// Store
import { ApplicationStoreContext } from '../stores/applicationStore';

// Componenets
import { StyledSidebar, MainComponent } from './Form.styled';
import SidebarNav from '../components/Sidebar';

const ExaminerView = () => {
  const { getQuestions, sortedSectionList } = useContext(
    ApplicationStoreContext
  );
  const [sidebarOpen, toggleSidebar] = useState(true);
  const [currentStep, setCurrentStep] = useState(1);

  const handleClickNext = (step) => setCurrentStep(step);

  const handleClickPrev = (step) => setCurrentStep(step);

  useEffect(() => {
    getQuestions();
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
      {sidebarOpen && !!sortedSectionList.length && (
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
            handleClickPrev={handleClickPrev}
          />
        </StyledSidebar>
      )}
      <MainComponent gridArea='main' justify='center' align='center'>
        <Box fill>Main Component here</Box>
      </MainComponent>
    </Grid>
  );
};

export default ExaminerView;
