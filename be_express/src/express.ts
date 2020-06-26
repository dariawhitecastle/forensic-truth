import * as express from 'express';
import * as F from './fp';

export const OnSuccess = (json: boolean) => (req, res, next) => (x) => {
  if (json) {
    return res.status(200).json(x);
  }
  res.status(200).send(x);
};

export const onSuccess = (req, res, next) => (result) => {
  res.status(200).json(result);
};

export const onError = (req, res, next) => (err) => {
  console.error('function threw error', err);
  next(err);
};

export const PostRequestHandler = (fn): express.RequestHandler => (
  req,
  res,
  next
) => {
  console.log('got request body', req.body);
  return fn(req.body).then(
    ...[ onSuccess, onError ].map((x) => x(req, res, next))
  );
};

export const ErrorHandler: express.ErrorRequestHandler = (
  err,
  req,
  res,
  next
) => {
  res.status(err.statusCode || 500).send(err.message || 'Server error');
};

export type RequestHandler = express.RequestHandler;
export const RequestHandler = (
  fn,
  params: string[] = [],
  { json }: { json: boolean } = { json: true }
): express.RequestHandler => (req, res, next) => {
  const extraArgs = params.map((param) => F.path(param.split('.'), req));
  return fn(...extraArgs, req.body).then(
    ...[ OnSuccess(json), onError ].map((x) => x(req, res, next))
  );
};
