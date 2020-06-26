import React, { useState, useEffect } from 'react';
import { Box, Button, Nav, Text } from 'grommet';
import { StatusGood } from 'grommet-icons';
import { getCurrentStepProp } from '../utils/helpers';

const SidebarButton = ({
  label,
  active,
  completed,
  goToPrevStep,
  id,
  ...rest
}) => (
  <Button plain {...rest} onClick={() => goToPrevStep(id)}>
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

const SidebarNav = ({ currentStep, handleClickPrev, steps }) => {
  const [ active, setActive ] = useState(steps[0].id);
  useEffect(
    () => {
      setActive(getCurrentStepProp('id', steps, currentStep));
    },
    [ currentStep, steps ]
  );
  const goToPrevStep = (id) => {
    if (id < active) {
      setActive(id);
      handleClickPrev(id);
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
          />
        ))}
      </Nav>
    </Box>
  );
};

export default SidebarNav;
