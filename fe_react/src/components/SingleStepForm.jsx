/* eslint-disable react-hooks/exhaustive-deps */
import React, { useEffect, useState, useRef } from 'react';
import { observer } from 'mobx-react';
import { Form, Heading, Text, Box } from 'grommet';

import * as R from 'ramda';

// Components
import FormFieldComponent from './FormField';

// styles
import { StyledFormWrapper } from './SingleStepForm.styled.js';

// helpers
import { checkCharLimit } from '../utils/helpers';

const SingleStepForm = observer(
  ({
    questionList,
    currentStep,
    header,
    saveData,
    personalInfo,
    setPersonalInfo,
    setDisableNext,
    updateQuestions,
  }) => {
    const [currentSubqs, setCurrentSubqs] = useState([]);
    const [tableRow, setTableRow] = useState(0);
    const headerRef = useRef(null);

    useEffect(() => {
      if (headerRef) {
        headerRef.current.scrollIntoView({
          behavior: 'smooth',
          block: 'nearest',
          inline: 'start',
        });
      }
      const subqs = R.reduce(
        (acc, { subQuestions }) => acc.concat(subQuestions),
        [],
        questionList
      );
      setCurrentSubqs(subqs);
    }, [currentStep]);

    useEffect(() => {
      const isRequired = (question) =>
        question.required && question.type !== 'none';

      const isAnswered = (question) => R.has(question.id, personalInfo);
      const isRequiredAndAnswered = (question) =>
        isRequired(question) ? R.both(isRequired, isAnswered)(question) : true;

      // remove currentSubquestions from questionlist to validate
      const filteredQuestionList = R.filter(
        (question) => !currentSubqs.includes(question.order.toString()),
        questionList
      );
      const validatedList = R.map(isRequiredAndAnswered, filteredQuestionList);
      const isInvalid = validatedList.includes(false);

      isInvalid && setDisableNext(true);
      !!Object.keys(personalInfo).length && !isInvalid && setDisableNext(false);
    }, [Object.keys(personalInfo).length, currentSubqs]);

    const onChange = (e, id, type, option) => {
      const { value } = e.target;
      // find this question in the questionList
      const filtered = questionList.find(
        (singleQuestion) => singleQuestion.id === id
      );

      switch (type) {
        case 'yesNo':
          if (value === 'true' && filtered?.subQuestions?.length) {
            // remove subquestion from currentSubqs
            setCurrentSubqs(R.without(filtered.subQuestions, currentSubqs));
          } else if (value === 'false' && filtered?.subQuestions?.length) {
            // add subquestion back to currentSubqs
            const subqs = R.union(currentSubqs, filtered?.subQuestions);
            setCurrentSubqs(subqs);
            // clear out all subquestions from personal info
            R.forEach(({ order, id }) => {
              if (filtered.subQuestions.includes(order.toString())) {
                setPersonalInfo({ field: parseInt(id), value: undefined });
              }
            }, questionList);
          }
          // make sure this is set last or it clears out selected option
          setPersonalInfo({ field: id, value });
          break;
        case 'yesNo reverse':
          setPersonalInfo({ field: id, value });
          if (value === 'false' && filtered?.subQuestions?.length) {
            // remove subquestion from currentSubqs
            setCurrentSubqs(R.without(filtered.subQuestions, currentSubqs));
          } else {
            // add subquestion back to currentSubqs
            const subqs = R.reduce(
              (acc, { subQuestions }) => acc.concat(subQuestions),
              [],
              questionList
            );
            setCurrentSubqs(subqs);
            // clear out all subquestions from personal info
            R.forEach((q) => {
              // check if subQuestions have subQuestions ugh
              questionList.find(({ order, subQuestions }) => {
                if (order === parseInt(q) && subQuestions.length) {
                  const id = subQuestions[0];
                  setPersonalInfo({ field: parseInt(id), value: undefined });
                }
              });
              setPersonalInfo({ field: parseInt(q), value: undefined });
            }, filtered.subQuestions);
          }
          break;

        case 'checkboxGroup':
          const includesDrug = personalInfo[id]?.find(
            (answer) => answer?.name === option.name
          );

          let selectedValues = !!includesDrug
            ? R.reject(R.propEq('name', option.name), personalInfo[id])
            : personalInfo[id]
            ? [...personalInfo[id], option]
            : [option];

          setPersonalInfo({
            field: id,
            value: selectedValues,
          });
          break;
        case 'drugDate':
          const drugIndex = R.findIndex(
            R.propEq('name', option.name),
            personalInfo[id]
          );
          const updatedDrugInfo = R.update(drugIndex, option, personalInfo[id]);

          setPersonalInfo({
            field: id,
            value: updatedDrugInfo,
          });
          break;
        default:
          // set value in state
          checkCharLimit(e, setPersonalInfo, personalInfo);
      }
    };

    const onAddMore = (options, id) => {
      setTableRow(tableRow + 1);

      const findSubQ = (option) => {
        const foundSubq = R.find(R.propEq('order', Number(option)))(
          questionList
        );
        return {
          ...foundSubq,
          id: Number(`${foundSubq.id}${tableRow}`),
        };
      };
      const idx = R.findIndex(R.propEq('id', id), questionList);
      const subQuestions = R.map(findSubQ, options);
      const updated = R.insert(idx, subQuestions, questionList);
      updateQuestions(currentStep, R.flatten(updated));
    };

    const renderFormFields = () =>
      questionList.map((question, i) => (
        <FormFieldComponent
          key={`${question.id}-${i}`}
          onChange={onChange}
          onAddMore={onAddMore}
          question={question}
          personalInfo={personalInfo}
          currentSubqs={currentSubqs}
        />
      ));

    return (
      <StyledFormWrapper height='100vh' alignSelf='center' ref={headerRef}>
        <Heading alignSelf='center' textAlign='center' level={3}>
          {header}
          <Text color='red' style={{ display: 'block' }}>
            All fields are mandatory
          </Text>
        </Heading>

        <Form validate='blur' onSubmit={() => saveData(personalInfo)}>
          {renderFormFields()}
        </Form>
      </StyledFormWrapper>
    );
  }
);

export default SingleStepForm;
