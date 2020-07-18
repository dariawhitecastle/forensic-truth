import * as R from 'ramda';

export const findStep = (xs, value) => R.find(R.propEq('id', value))(xs);

export const getCurrentStepProp = (prop, xs, value) =>
  R.compose(R.prop(prop), findStep)(xs, value);

export const checkCharLimit = (e, fn) => {
  const { name: field, value } = e.target;

  if (field === '123' && value.length >= 5) {
    return fn({
      field,
      value: value.slice(0, 5),
    });
  }

  if (field === '2' && value.length >= 4) {
    return fn({
      field,
      value: value.slice(0, 4),
    });
  }
  fn({ field, value: e.option || value });
};
