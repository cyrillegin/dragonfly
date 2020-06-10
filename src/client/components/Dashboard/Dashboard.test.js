import { mount } from 'enzyme';
import React from 'react';
import Dashboard from './Dashboard';

jest.mock('../SensorDetails');
jest.mock('../../charts/Graph');
jest.mock('../../utilities/Window', () => ({
  searchToObject: () => ({
    station: '',
  }),
  windowEmitter: {
    listen: () => {},
  },
}));

global.fetch = jest.fn(
  () => new Promise(res => res({ json: () => new Promise(inner => inner({})) })),
);

describe('dashboard', () => {
  it('should render a snap shot', () => {
    const wrapper = mount(
      <Dashboard
        stations={[
          {
            id: 1,
            name: 'test',
            health: 'healthy',
            sensors: [
              {
                id: 1,
                name: 'test',
                health: 'healthy',
              },
            ],
          },
        ]}
      />,
    );
    expect(wrapper).toMatchSnapshot();
  });
});
