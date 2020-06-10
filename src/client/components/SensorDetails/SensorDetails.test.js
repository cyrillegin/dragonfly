import { mount } from 'enzyme';
import React from 'react';
import SensorDetails from './SensorDetails';

describe('SensorDetails', () => {
  it('should render a snap shot', () => {
    const wrapper = mount(
      <SensorDetails
        sensor={{
          id: 1,
          name: 'test',
          health: 'healthy',
          actions: [{ condition: 'test', interval: 'test', action: 'test', id: 1 }],
        }}
      />,
    );
    expect(wrapper).toMatchSnapshot();
  });

  it('should test functionality', () => {
    const wrapper = mount(
      <SensorDetails
        sensor={{
          id: 1,
          name: 'test',
          health: 'healthy',
          actions: [{ condition: 'test', interval: 'test', action: 'test', id: 1 }],
        }}
      />,
    );

    wrapper.find('button').forEach(button => {
      button.simulate('click');
    });

    wrapper.find('select').simulate('change', {});
  });
});
