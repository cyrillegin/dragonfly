import { mount } from 'enzyme';
import React from 'react';
import Dashboard from './Dashboard';

describe('dashboard', () => {
  it('should render a snap shot', () => {
    const wrapper = mount(<Dashboard />);
    expect(wrapper).toMatchSnapshot();
  });
});
