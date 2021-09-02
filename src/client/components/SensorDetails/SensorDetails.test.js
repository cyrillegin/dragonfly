import { mount } from 'enzyme';
import React from 'react';
import { act } from '@testing-library/react';
import SensorDetails from './SensorDetails';

jest.useFakeTimers();

jest.mock('../../Api', () => ({
  updateSensor: () => new Promise(res => res([])),
  deleteAction: () => new Promise(res => res()),
}));

describe('SensorDetails', () => {
  let date;

  beforeEach(() => {
    date = global.Date;
    global.Date = class {
      getDate = () => '1';

      getMonth = () => '1';

      getFullYear = () => '1';

      getHours = () => '1';

      getMinutes = () => '1';

      static now() {
        return '1';
      }
    };
  });

  afterEach(() => {
    global.Date = date;
  });

  it('should render a snap shot', async () => {
    let wrapper;
    await act(async () => {
      wrapper = mount(
        <SensorDetails
          sensor={{
            id: 1,
            name: 'test',
            health: 'healthy',
            stationId: 1,
            stationName: 'test',
            lastReading: {
              timestamp: '2020-10-04T20:59:30.176Z',
              value: 1,
            },
            actions: [{ condition: 'test', interval: 'test', action: 'test', id: 1 }],
          }}
        />,
      );
    });
    expect(wrapper).toMatchSnapshot();
  });

  it('should test functionality', async () => {
    let wrapper;
    await act(async () => {
      wrapper = mount(
        <SensorDetails
          sensor={{
            id: 1,
            name: 'test',
            health: 'healthy',
            stationId: 1,
            stationName: 'test',
            lastReading: {
              timestamp: '2020-10-04T20:59:30.176Z',
              value: 1,
            },
            actions: [{ condition: 'test', interval: 'test', action: 'test', id: 1 }],
          }}
        />,
      );
      wrapper.find('button').forEach(button => {
        button.simulate('click');
        jest.runAllTimers();
      });
    });
    expect(wrapper.html()).toMatchSnapshot();
  });
});
