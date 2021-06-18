import React from 'react';
import { Form, TextInput, Heading, Box } from 'grommet';

import { StyledFormField } from './ReportHeader.styled';

const ReportHeader = ({
  agency,
  acquaintanceExam,
  name,
  position,
  caseNumber,
  date,
  timeIn,
  timeOut,
  chartNum,
  onChange,
}) => {
  const handleOnChange = ({ target: { name, value } }) =>
    onChange(name, value, 'section');

  return (
    <Form>
      <Heading level='3'> Report </Heading>
      <StyledFormField name='agency' label='Agency'>
        <TextInput name='agency' onChange={handleOnChange} value={agency} />
      </StyledFormField>
      <StyledFormField name='name' label='Name'>
        <TextInput name='name' onChange={handleOnChange} value={name} />
      </StyledFormField>
      <StyledFormField name='position' label='Position'>
        <TextInput name='position' onChange={handleOnChange} value={position} />
      </StyledFormField>
      <StyledFormField name='caseNumber' label='Case Number'>
        <TextInput
          name='caseNumber'
          onChange={handleOnChange}
          value={caseNumber}
        />
      </StyledFormField>
      <StyledFormField name='date' label='Date'>
        <TextInput name='date' onChange={handleOnChange} value={date} />
      </StyledFormField>
      <StyledFormField name='timeIn' label='Time In'>
        <TextInput name='timeIn' onChange={handleOnChange} value={timeIn} />
      </StyledFormField>
      <StyledFormField name='timeOut' label='Time Out'>
        <TextInput name='timeOut' onChange={handleOnChange} value={timeOut} />
      </StyledFormField>
      <StyledFormField name='chartNum' label='Number of charts'>
        <TextInput
          name='chartNum'
          onChange={handleOnChange}
          value={chartNum}
          type='number'
        />
      </StyledFormField>
      <StyledFormField name='acquaintanceExam' label='Acquintance Exam'>
        <TextInput
          name='acquaintanceExam'
          onChange={handleOnChange}
          value={acquaintanceExam}
          type='number'
        />
      </StyledFormField>
      <Box margin={{ bottom: 'medium' }} />
    </Form>
  );
};

export default ReportHeader;
