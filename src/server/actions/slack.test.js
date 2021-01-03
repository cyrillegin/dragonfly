import sendSlack from './slack';

jest.mock('node-fetch', () => (url, details) => {
  expect(details.body).toMatchSnapshot();
});

describe('slack action', () => {
  it('should test the function', () => {
    sendSlack({
      sensor: {
        name: 'test',
      },
      action: {
        condition: 'test',
      },
      reading: {
        value: 1,
      },
    });
  });
});
