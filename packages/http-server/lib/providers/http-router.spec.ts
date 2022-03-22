import { Logger, LoggerLevel } from '@caviajs/logger';
import { HttpRouter } from './http-router';

jest.mock('@caviajs/logger');

describe('HttpRouter', () => {
  let httpRouter: HttpRouter;

  beforeEach(() => {
    httpRouter = new HttpRouter(new Logger(LoggerLevel.ALL, () => ''));
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  describe('', () => {

  });

  it('lorem', () => {
    expect(1).toBe(1);
  });
});
