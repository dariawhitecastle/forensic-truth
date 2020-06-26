import * as R from 'ramda';
export * from 'ramda';

export const serialize = JSON.stringify;
export const unserialize = JSON.parse;
export const list = R.unapply(R.identity);
export const print = <T>(x: T): T => {
  console.log(x);
  return x;
}; // refactor
export const args = () => process.argv.slice(2);
export const onSuccess: { (x: any) } = R.compose(
  process.exit,
  R.always(0),
  console.log
);
export const onError: { (err: any) } = R.compose(
  process.exit,
  R.always(1),
  (err) => console.error(err.stack)
);
export const promiseAll = (x: Promise<any>[]): Promise<any[]> => Promise.all(x);
export const thenAlways = <T>(x: T) => (y: Promise<any>): Promise<T> =>
  R.then(R.always(x))(y);

// https://stackabuse.com/encoding-and-decoding-base64-strings-in-node-js/#encodingbase64stringswithnodejs
export const base64encode = (x: string) => Buffer.from(x).toString('base64');

// renameKeys({ firstName: 'name', type: 'kind', foo: 'bar' })({ firstName: 'Elisia', age: 22, type: 'human' }) => { name: 'Elisia', age: 22, kind: 'human' }
export const renameKeys = R.curry((keysMap, obj) =>
  R.reduce(
    (acc, key) => R.assoc(keysMap[key] || key, obj[key], acc),
    {},
    R.keys(obj)
  )
);

export const pretty = (x: any) => JSON.stringify(x, null, 2);

export const d = (msg?: string, fn = pretty) => <T>(x: T): T =>
  R.compose(
    R.always(x),
    console.log,
    R.cond([
      [ (x) => isNotNil(msg), R.always(`${msg}: ${fn(x)}`) ],
      [ R.T, R.always(x) ]
    ]),
    (x) => x
  )(x);

export const isNotEmpty = R.compose(R.not, R.isEmpty);
export const isNotNil = R.compose(R.not, R.isNil);
export const mapAsync = <T = any>(fn): { (arr: any[]): Promise<T[]> } => (
  arr
) => Promise.all(arr.map(fn)) as Promise<T[]>;
export const noop = () => {};
