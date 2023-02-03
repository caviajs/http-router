import { HttpException } from '../src';

describe('HttpException', () => {
  it('should return correct response for default reason', () => {
    const badRequest = new HttpException(400);
    const unauthorized = new HttpException(401);

    expect(badRequest.getStatus()).toEqual(400);
    expect(badRequest.getResponse()).toEqual({ statusCode: 400, statusMessage: 'Bad Request' });

    expect(unauthorized.getStatus()).toEqual(401);
    expect(unauthorized.getResponse()).toEqual({ statusCode: 401, statusMessage: 'Unauthorized' });
  });

  it('should return correct response for custom reason', () => {
    const stringReason = new HttpException(400, 'Hello World');
    const objectReason = new HttpException(401, { hello: 'world' });

    expect(stringReason.getStatus()).toEqual(400);
    expect(stringReason.getResponse()).toEqual({ statusCode: 400, statusMessage: 'Hello World' });

    expect(objectReason.getStatus()).toEqual(401);
    expect(objectReason.getResponse()).toEqual({ hello: 'world' });
  });
});
