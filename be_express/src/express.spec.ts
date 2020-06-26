import { PostRequestHandler, RequestHandler } from './express';
import * as F from './fp';

const mock = Object.assign;

describe('express', () => {
  describe('PostRequestHandler', () => {
    it('should call res.json with the value inside the promise', async () => {
      const body = { name: 'rosie' };
      const req = mock({ body });
      const res = mock({ json: jest.fn(), status: jest.fn(), send: jest.fn() });
      const next = jest.fn();

      res.status.mockReturnValue(res);
      res.json.mockReturnValue(body);

      const handler = PostRequestHandler((x: any): Promise<any> =>
        Promise.resolve(x)
      );
      await handler(req, res, next);
      expect(res.json).toHaveBeenCalledWith(req.body);
    });
  });

  describe('testHandler', () => {
    it('testing some code options for pulling in route params', async () => {
      const id = 1;
      const params = { id };
      const body = { name: 'rosie' };
      const req = mock({ body, params });
      const res = mock({ json: jest.fn(), status: jest.fn() });
      const next = jest.fn();
      const fn = (id: string, body: any): Promise<any> =>
        Promise.resolve({ id, body });

      res.status.mockReturnValue(res);
      res.json.mockReturnValue(body);

      const handler = ((fn: any, params: string[]) => (req, res, next) =>
        fn(...params.map((param) => req.params[param]), req.body)
          .then((result) => {
            res.status(200).json(result);
          })
          .catch((err) => {
            next(err);
          }))(fn, [ 'id' ]);

      await handler(req, res, next);
      expect(res.json).toHaveBeenCalledWith({ id, body });
    });
  });

  describe('RequestHandler', () => {
    it('should pass extra args from request to function', async () => {
      const id = 1;
      const params = { id };
      const body = { name: 'rosie' };
      const req = mock({ body, params });
      const res = mock({ json: jest.fn(), status: jest.fn() });
      const next = jest.fn();
      const fn = jest.fn((id: string, body: any): Promise<any> =>
        Promise.resolve({ id, body })
      );

      res.status.mockReturnValue(res);
      res.json.mockReturnValue(body);

      const handler = RequestHandler(fn, [ 'params.id' ]);

      await handler(req, res, next);
      expect(fn).toHaveBeenCalledWith(id, body);
      expect(res.json).toHaveBeenCalledWith({ id, body });
    });
  });
});
