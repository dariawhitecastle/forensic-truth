import React, { useState, useContext, useEffect } from 'react';
import { Grid, Image, } from 'grommet';
import { observer } from 'mobx-react';
import * as R from 'ramda';

// Store
import { ApplicationStoreContext } from '../stores/applicationStore';

// Components
import SingleStepForm from '../components/SingleStepForm';
import SidebarNav from '../components/Sidebar';
import Wizard from '../components/Wizard';

// Assets
import { StyledSidebar, MainComponent, StyledHeader } from './Form.styled';
import logo from '../assets/logo.jpg';

const Form = observer(() => {
  const {
    disableNext,
    setDisableNext,
    getQuestions,
    sortedSectionList,
    questionServicePending,
    personalInfo,
    resetForm,
    setPersonalInfo,
    submitApplication,
    updateQuestions,
  } = useContext(ApplicationStoreContext);
  const [sidebarOpen, toggleSidebar] = useState(true);
  const [currentStep, setCurrentStep] = useState(1);

  useEffect(() => {
    getQuestions();
  }, [getQuestions]);

  useEffect(() => {
    !!sortedSectionList.length && setCurrentStep(sortedSectionList[0].id);
  }, [questionServicePending]);

  const handleClick = (step) =>
    step > sortedSectionList.length ? onSubmit() : setCurrentStep(step);

  const onSubmit = () => {
    const payload = [];
    R.forEachObjIndexed((val, key) =>
      payload.push({
        question: key,
        responseSelection: val,
        body: val,
      })
    )(personalInfo);
    submitApplication(payload);
    setCurrentStep(sortedSectionList[0].id);
    resetForm();
  };

  return (
    <Grid
      fill
      rows={['auto', 'flex']}
      columns={['auto', 'flex']}
      areas={[
        { name: 'header', start: [0, 0], end: [0, 1] },
        { name: 'sidebar', start: [0, 1], end: [0, 1] },
        { name: 'main', start: [1, 1], end: [1, 1] },
      ]}>
      

      <StyledHeader
        gridArea='header'
        elevation='xlarge'
        direction='row'
        align='center'
        justify='between'
        pad={{ horizontal: 'medium', vertical: 'small' }}>
        <Image src={logo} height='40' width='200' />
      </StyledHeader>

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
            handleClickPrev={handleClick}
          />
        </StyledSidebar>
      )}
      <MainComponent
        gridArea='main'
        justify='center'
        align='center'
        animation={[
          { type: 'fadeIn', duration: 300 },
          { type: 'slideLeft', size: 'xlarge', duration: 150 },
        ]}>
        {!!sortedSectionList.length && (
          <Wizard
            currentStep={currentStep}
            disableNext={disableNext}
            steps={sortedSectionList}
            setDisableNext={setDisableNext}
            onClickNext={handleClick}
            onClickPrev={handleClick}
            component={(props) => (
              <SingleStepForm
                personalInfo={personalInfo}
                setPersonalInfo={setPersonalInfo}
                setDisableNext={setDisableNext}
                currentStep={currentStep}
                updateQuestions={updateQuestions}
                {...props}
              />
            )}
          />
        )}
      </MainComponent>
    </Grid>
  );
});

export default Form;
