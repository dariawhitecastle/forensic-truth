import React from 'react';
import {
  Box,
  Button,
  CheckBoxGroup,
  FormField,
  Heading,
  RadioButtonGroup,
  Select,
  Text,
  TextArea,
} from 'grommet';

// utils
import { states } from '../utils/constants';

// styles
import {
  StyledRadioButtonGroup,
  StyledFormField,
} from './SingleStepForm.styled';

const FormFieldComponent = ({
  question,
  onChange,
  onAddMore,
  personalInfo,
  currentSubqs,
}) => {
  const {
    id,
    charLimit,
    description,
    order,
    type,
    placeholder,
    responseOptions,
    required,
  } = question;

  if (currentSubqs.includes(order.toString()) && !personalInfo[id]) return null;

  switch (type) {
    case 'table':
      return (
        <Box style={{ display: 'inline-flex' }} pad={{ right: 'small' }}>
          <FormField
            autoComplete='none'
            label={description}
            maxLength={charLimit ?? 100}
            name={id.toString()}
            value={personalInfo[id] ?? ''}
            onChange={(event) => onChange(event, id)}
            placeholder={placeholder}
            type='text'
            required={required}
          />
        </Box>
      );
    case 'button':
      return (
        <Box
          align='start'
          style={{
            display: 'inline-flex',
            verticalAlign: 'bottom',
            paddingBottom: 33,
            marginRight: 5,
          }}>
          <Button
            primary
            color='primary'
            label={description}
            onClick={() => onAddMore(responseOptions, id)}
          />
        </Box>
      );
    case 'text':
    case 'number':
    case 'date':
      return (
        <Box
          pad={{ right: 'medium' }}
          style={{ display: 'inline-flex' }}
          width={description.length > 20 ? '80%' : '33%'}>
          <StyledFormField
            autoComplete='none'
            label={description}
            maxLength={charLimit ?? 100}
            name={id.toString()}
            value={personalInfo[id] ?? ''}
            onChange={(event) => onChange(event, id)}
            placeholder={placeholder}
            type={type === 'date' ? 'text' : type}
            required={required}
          />
        </Box>
      );
    case 'textArea':
      return (
        <Box width='80%'>
          <Box pad={{ vertical: 'medium' }}>
            <Text>{description}</Text>
          </Box>
          <TextArea
            placeholder='type here'
            name={id.toString()}
            maxLength={charLimit ?? 100}
            value={personalInfo[id]}
            onChange={(event) => onChange(event, id)}
            required={required}
          />
        </Box>
      );
    case 'dropdown':
      return (
        <Box
          width={description.length > 25 ? '80%' : '33%'}
          pad={{ right: 'medium' }}
          style={{ display: 'inline-flex' }}>
          <Text>{description}</Text>
          <Select
            options={responseOptions.length ? responseOptions : states}
            placeholder={description}
            margin={{ top: 'xsmall' }}
            name={id.toString()}
            value={personalInfo[id]}
            onChange={(event) => onChange(event, id)}
            required={required}
          />
        </Box>
      );
    case 'yesNo':
    case 'yesNo reverse':
      return (
        <Box pad='small' direction='row' align='start'>
          <Text>{description}</Text>
          <StyledRadioButtonGroup
            name={id.toString()}
            options={[
              { label: 'Yes', value: 'true' },
              { label: 'No', value: 'false' },
            ]}
            value={personalInfo[id] ?? ''}
            onChange={(event) => onChange(event, id, type)}
            required={required}
          />
        </Box>
      );
    case 'checkBoxGroup':
      return (
        <Box pad='small' direction='column' align='start'>
          <Text>{description}</Text>
          <CheckBoxGroup
            options={responseOptions}
            onChange={(event) => onChange(event, id)}
            required={required}
          />
        </Box>
      );
    case 'radio':
      return (
        <Box pad='small'>
          <Text margin={{ top: '12px', bottom: '12px' }}>{description}</Text>
          <RadioButtonGroup
            label={description}
            name={id.toString()}
            options={responseOptions}
            value={personalInfo[id]}
            onChange={(event) => onChange(event, id)}
            required={required}
          />
        </Box>
      );
    default:
      return (
        <Box width='100%'>
          <Heading level='4' style={{ maxWidth: '100%' }}>
            {description}
          </Heading>
        </Box>
      );
  }
};

export default FormFieldComponent;
