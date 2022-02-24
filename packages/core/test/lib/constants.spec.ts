import { LOGGER_CONTEXT } from '../../src/public-api';

describe('LOGGER_CONTEXT', () => {
  it('should contain the appropriate value', () => {
    expect(LOGGER_CONTEXT).toEqual('Core');
  });
});
