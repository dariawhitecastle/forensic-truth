import React from 'react';
import { Form, TextInput, Heading, Box } from 'grommet';

import { StyledFormField } from './ReportHeader.styled';

const ReportHeader = ({
  name,
  position,
  caseNumber,
  date,
  timeIn,
  timeOut,
  chartNum,
}) => {
  const [form, setForm] = React.useState({});

  const handleOnChange = ({ target: { name, value } }) =>
    setForm({ ...form, [name]: value });

  return (
    <Form>
      <Heading level='3'> Report </Heading>
      <StyledFormField name='name' htmlFor='text-input-id' label='Name'>
        <TextInput name='name' onChange={handleOnChange} value={name} />
      </StyledFormField>
      <StyledFormField name='position' htmlFor='text-input-id' label='Position'>
        <TextInput name='position' onChange={handleOnChange} value={position} />
      </StyledFormField>
      <StyledFormField
        name='caseNumber'
        htmlFor='text-input-id'
        label='Case Number'>
        <TextInput
          name='caseNumber'
          onChange={handleOnChange}
          value={caseNumber}
        />
      </StyledFormField>
      <StyledFormField name='date' htmlFor='text-input-id' label='Date'>
        <TextInput name='date' onChange={handleOnChange} value={date} />
      </StyledFormField>
      <StyledFormField name='timeIn' htmlFor='text-input-id' label='Time In'>
        <TextInput name='timeIn' onChange={handleOnChange} value={timeIn} />
      </StyledFormField>
      <StyledFormField name='timeOut' htmlFor='text-input-id' label='Time Out'>
        <TextInput name='timeOut' onChange={handleOnChange} value={timeOut} />
      </StyledFormField>
      <StyledFormField
        name='chartNum'
        htmlFor='text-input-id'
        label='Number of charts'>
        <TextInput name='chartNum' onChange={handleOnChange} value={chartNum} />
      </StyledFormField>
      <Box margin={{ bottom: 'medium' }} />
    </Form>
  );
};

export default ReportHeader;
