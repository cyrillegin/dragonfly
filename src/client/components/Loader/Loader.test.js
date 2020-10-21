import React from 'react';
import { mount } from 'enzyme';
import Loader from './index';

describe('Loader', () => {
  it('should take a snapshot', () => {
    const wrapper = mount(<Loader />);
    expect(wrapper.html()).toMatchSnapshot();
  });
});
