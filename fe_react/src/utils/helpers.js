import * as R from 'ramda'

export const findStep = (xs, value) => R.find(R.propEq('id', value))(xs)

export const getCurrentStepProp = (prop, xs, value) => R.compose(R.prop(prop), findStep)(xs, value)
