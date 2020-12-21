import { mount } from 'enzyme';
import React from 'react';
import AddAction from './AddAction';

describe('AddAction', () => {
  it('should render a snap shot', () => {
    const wrapper = mount(<AddAction close={() => {}} stations={[]} />);
    expect(wrapper.html()).toMatchSnapshot();
  });
});
