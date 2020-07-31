import * as R from 'ramda';

export const findStep = (xs, value) => R.find(R.propEq('id', value))(xs);

export const getCurrentStepProp = (prop, xs, value) =>
  R.compose(R.prop(prop), findStep)(xs, value);

export const checkCharLimit = (e, fn) => {
  const { name: field, value } = e.target;

  // for Zip
  if (field === '7' && value.length >= 5) {
    return fn({
      field,
      value: value.slice(0, 5),
    });
  }

  // for SSN
  if (field === '9' && value.length >= 4) {
    return fn({
      field,
      value: value.slice(0, 4),
    });
  }
  fn({ field, value: e.option || value });
};
