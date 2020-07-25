import { mount } from 'enzyme';
import React from 'react';
import AddSensor from './AddSensor';

describe('AddSensor', () => {
  it('should render a snap shot', () => {
    const wrapper = mount(<AddSensor />);
    expect(wrapper.html()).toMatchSnapshot();
  });
});
