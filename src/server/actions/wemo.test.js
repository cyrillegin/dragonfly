import toggleWemo from './wemo';

jest.mock('child_process', () => ({
  exec: command => {
    expect(command).toMatchSnapshot();
  },
}));
describe('wemo', () => {
  it('should test the function', () => {
    toggleWemo({ metaData: '{"name":"test", "event":"test"}' });
  });
});
