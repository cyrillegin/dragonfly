import { mount } from 'enzyme';
import React from 'react';
import { act } from '@testing-library/react';
import SensorDetails from './SensorDetails';

jest.useFakeTimers();

describe('SensorDetails', () => {
  let fetch;
  let date;

  beforeEach(() => {
    fetch = global.fetch;
    global.fetch = jest.fn(
      () => new Promise(res => res({ json: () => new Promise(inner => inner({})) })),
    );
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
    global.fetch = fetch;
    global.Date = date;
  });

  it('should render a snap shot', () => {
    act(() => {
      const wrapper = mount(
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
      expect(wrapper).toMatchSnapshot();
    });
  });

  it('should test functionality', () => {
    act(() => {
      const wrapper = mount(
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
        expect(wrapper.html()).toMatchSnapshot();
      });
    });
  });
});
