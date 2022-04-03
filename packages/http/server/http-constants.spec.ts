import { LOGGER_CONTEXT } from './http-constants';

describe('LOGGER_CONTEXT', () => {
  it('should have the appropriate value', () => {
    expect(LOGGER_CONTEXT).toEqual('Http');
  });
});
