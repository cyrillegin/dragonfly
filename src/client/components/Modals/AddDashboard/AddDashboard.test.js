import { mount } from 'enzyme';
import React from 'react';
import AddDashboard from './AddDashboard';

describe('AddDashboard', () => {
  it('should render a snap shot', () => {
    const wrapper = mount(<AddDashboard />);
    expect(wrapper.html()).toMatchSnapshot();
  });
});
