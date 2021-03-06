import React, { useState } from 'react';
import { observer } from 'mobx-react';

import styled from 'styled-components';
import { Box, Button } from 'grommet';

// utils
import { getCurrentStepProp } from '../utils/helpers';

const StyledButtonBox = styled(Box)`
  left: 250px;
  position: fixed;
  bottom: 0px;
  padding: 24px;
  width: calc(100% - 249px);
  box-shadow: 0px 1px 16px rgb(0 0 0 / 20%);
`;

const Wizard = observer(
  ({
    currentStep,
    disableNext,
    steps,
    onClickNext,
    onClickPrev,
    component,
    setDisableNext,
  }) => {
    const [returning, setReturning] = useState(false);

    const goToNext = () => {
      setReturning(false);
      if (currentStep <= steps.length) {
        onClickNext(currentStep + 1);
      }
      return null;
    };

    const goToPrev = () => {
      setReturning(true);
      if (currentStep > 1) {
        setDisableNext(false);
        onClickPrev(currentStep - 1);
      }
      return null;
    };

    return (
      <Box direction='column' display='flex' justify='stretch'>
        {/* <TransitionGroup component="div" className="App">
        <CSSTransition
          key={currentKey}
          timeout={timeout}
          classNames="pageSlider"
          mountOnEnter={false}
          unmountOnExit={true}
        > */}
        <Box>
          {component({
            saveData: goToNext,
            questionList: getCurrentStepProp('questions', steps, currentStep),
            header: getCurrentStepProp('title', steps, currentStep),
            returning,
          })}
        </Box>
        {/* </CSSTransition>
      </TransitionGroup> */}
        <StyledButtonBox direction='row' display='flex' justify='between'>
          {currentStep > 1 ? (
            <Button
              primary
              color='primary'
              label='Previous'
              onClick={goToPrev}
            />
          ) : (
            <Box />
          )}
          <Button
            disabled={disableNext}
            primary
            color='primary'
            label={currentStep === steps.length ? 'Submit' : 'Next'}
            onClick={goToNext}
          />
        </StyledButtonBox>
      </Box>
    );
  }
);

export default Wizard;
