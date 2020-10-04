import React, { useState, useEffect } from 'react';
import { Box, Button, Nav, Text } from 'grommet';
import { StatusGood } from 'grommet-icons';
import { getCurrentStepProp } from '../utils/helpers';

const SidebarButton = ({
  label,
  active,
  completed,
  goToNextStep,
  goToPrevStep,
  id,
  ...rest
}) => {
  const handleClick = () => {
    completed ? goToPrevStep(id) : goToNextStep(id);
  };

  return (
    <Button plain {...rest} onClick={handleClick}>
      {({ hover }) => {
        let backgroundColor = completed ? 'success' : undefined;
        backgroundColor = hover ? 'primaryLight' : backgroundColor;
        let fontColor =
          completed || active || hover ? 'accentFont' : 'primaryFont';
        return (
          <Box
            direction='row'
            background={active ? 'primary' : backgroundColor}
            pad={{ horizontal: 'small', vertical: 'medium' }}>
            {completed ? (
              <Box pad={{ right: 'small' }}>
                <StatusGood color='accentFont' size='medium' />
              </Box>
            ) : (
              <Box pad={{ right: '33px' }} />
            )}
            <Text
              weight={active ? 700 : 400}
              size='medium'
              color={fontColor}
              alignSelf='start'>
              {label}
            </Text>
          </Box>
        );
      }}
    </Button>
  );
};

const SidebarNav = ({
  currentStep,
  handleClickNext,
  handleClickPrev,
  steps,
}) => {
  const [active, setActive] = useState(steps[0].id);
  useEffect(() => {
    setActive(getCurrentStepProp('id', steps, currentStep));
  }, [currentStep, steps]);

  const goToNextStep = (id) => {
    if (handleClickNext) {
      setActive(id);
      handleClickNext(id);
    } else return;
  };

  const goToPrevStep = (id) => {
    if (id < active) {
      setActive(id);
      handleClickPrev ? handleClickPrev(id) : handleClickNext(id);
    } else return;
  };
  return (
    <Box fill direction='row'>
      <Nav fill gap='none'>
        {steps.map(({ title, id, questions }, index) => (
          <SidebarButton
            completed={id < active}
            key={id}
            id={id}
            label={title}
            active={id === active}
            goToPrevStep={goToPrevStep}
            goToNextStep={goToNextStep}
          />
        ))}
      </Nav>
    </Box>
  );
};

export default SidebarNav;
