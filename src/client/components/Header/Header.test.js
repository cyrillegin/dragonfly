import { mount } from 'enzyme';
import React from 'react';
import Header from './Header';

describe('Header', () => {
  it('should render a snap shot', () => {
    const wrapper = mount(<Header />);
    expect(wrapper).toMatchSnapshot();
  });

  it('should test functionality', () => {
    const wrapper = mount(<Header />);

    wrapper.find('.title').simulate('click');

    wrapper.find('input').forEach(input => {
      input.simulate('change', { target: {} });
    });
  });
});
