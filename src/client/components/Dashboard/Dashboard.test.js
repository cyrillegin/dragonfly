import { mount } from 'enzyme';
import React from 'react';
import Dashboard from './Dashboard';

jest.mock('../SensorDetails');
jest.mock('../SensorDetails');
jest.mock('../../charts/Graph');
jest.mock('../../utilities/Window', () => ({
  searchToObject: () => ({
    station: '1',
  }),
  windowEmitter: {
    listen: () => {},
  },
}));

global.fetch = jest.fn(
  () => new Promise(res => res({ json: () => new Promise(inner => inner({})) })),
);

describe('dashboard', () => {
  xit('should render a snap shot', () => {
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
        dashboards={[
          {
            name: 'test',
            sensors: [
              {
                id: 1,
                stationId: 1,
                position: 1,
              },
            ],
          },
        ]}
      />,
    );
    expect(wrapper.html()).toMatchSnapshot();
  });
});
