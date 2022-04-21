import { CORE_CONTEXT } from './constants';

describe('LOGGER_CONTEXT', () => {
  it('should contain the appropriate value', () => {
    expect(CORE_CONTEXT).toEqual('Core');
  });
});
