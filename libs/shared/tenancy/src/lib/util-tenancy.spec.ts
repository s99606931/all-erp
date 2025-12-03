import { utilTenancy } from './util-tenancy';

describe('utilTenancy', () => {
  it('should work', () => {
    expect(utilTenancy()).toEqual('util-tenancy');
  });
});
