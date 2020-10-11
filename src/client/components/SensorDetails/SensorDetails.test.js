import { mount } from 'enzyme';
import React from 'react';
import { act } from '@testing-library/react';
import SensorDetails from './SensorDetails';

describe('SensorDetails', () => {
  let fetch;

  beforeEach(() => {
    fetch = global.fetch;
    global.fetch = jest.fn(
      () => new Promise(res => res({ json: () => new Promise(inner => inner({})) })),
    );
  });

  afterEach(() => {
    global.fetch = fetch;
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
              timestamp: '1234',
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
              timestamp: '1234',
              value: 1,
            },
            actions: [{ condition: 'test', interval: 'test', action: 'test', id: 1 }],
          }}
        />,
      );

      wrapper.find('button').forEach(button => {
        button.simulate('click');
        expect(wrapper.html()).toMatchSnapshot();
      });
    });
  });
});
