import { mount } from 'enzyme';
import React from 'react';
import SensorDetails from './SensorDetails';

describe('SensorDetails', () => {
  it('should render a snap shot', () => {
    const wrapper = mount(<SensorDetails />);
    expect(wrapper).toMatchSnapshot();
  });
});
